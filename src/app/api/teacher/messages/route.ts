/**
 * Professor message center — approved teachers/professors only.
 *
 * GET  /api/teacher/messages
 *      → { student_requests: [...], conversations: [...] }
 *        - student_requests: booking_requests addressed to the professor's
 *          linked directory listing(s)
 *        - conversations: prof-to-prof DM threads (grouped by peer)
 *
 * GET  /api/teacher/messages?peer=<userId>
 *      → { thread: [...] } messages with one peer (marks incoming as read)
 *
 * POST /api/teacher/messages { recipientId, body }   → send a DM
 */
import { NextResponse } from "next/server";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import { rateLimit, getClientKey } from "@/lib/rate-limit";

async function approvedTeacher(userId: string): Promise<boolean> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("teacher_profiles")
    .select("status")
    .eq("user_id", userId)
    .maybeSingle();
  return data?.status === "approved";
}

async function nameFor(admin: ReturnType<typeof createAdminClient>, ids: string[]) {
  const map = new Map<string, string>();
  if (!ids.length) return map;
  const { data } = await admin.from("teacher_profiles").select("user_id, full_name").in("user_id", ids);
  for (const t of data ?? []) map.set(t.user_id, t.full_name);
  return map;
}

export async function GET(req: Request) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  if (!(await approvedTeacher(user.id))) {
    return NextResponse.json({ error: "Réservé aux professeurs confirmés", approved: false }, { status: 403 });
  }

  const admin = createAdminClient();
  const peer = new URL(req.url).searchParams.get("peer");

  // One thread with a peer.
  if (peer) {
    const { data: msgs } = await admin
      .from("teacher_dms")
      .select("id, sender_id, recipient_id, body, created_at, read_at")
      .or(`and(sender_id.eq.${user.id},recipient_id.eq.${peer}),and(sender_id.eq.${peer},recipient_id.eq.${user.id})`)
      .order("created_at");
    // Mark incoming as read.
    await admin.from("teacher_dms").update({ read_at: new Date().toISOString() })
      .eq("recipient_id", user.id).eq("sender_id", peer).is("read_at", null);
    const names = await nameFor(admin, [peer]);
    return NextResponse.json({
      peerName: names.get(peer) ?? "Professeur",
      thread: (msgs ?? []).map((m) => ({ id: m.id, mine: m.sender_id === user.id, body: m.body, at: m.created_at })),
    });
  }

  // Student booking requests → this professor's linked listing(s).
  const { data: listings } = await admin.from("professors").select("id").eq("user_id", user.id);
  const listingIds = (listings ?? []).map((l) => l.id);
  let studentRequests: unknown[] = [];
  if (listingIds.length) {
    const { data: reqs } = await admin
      .from("booking_requests")
      .select("id, student_name, grade, preferred_mode, phone, message, status, created_at")
      .in("professor_id", listingIds)
      .order("created_at", { ascending: false })
      .limit(100);
    studentRequests = reqs ?? [];
  }

  // Prof-to-prof conversations grouped by peer.
  const { data: dms } = await admin
    .from("teacher_dms")
    .select("sender_id, recipient_id, body, created_at, read_at")
    .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
    .order("created_at", { ascending: false })
    .limit(300);
  const convMap = new Map<string, { peer: string; last: string; at: string; unread: number }>();
  for (const m of dms ?? []) {
    const peerId = m.sender_id === user.id ? m.recipient_id : m.sender_id;
    if (!convMap.has(peerId)) convMap.set(peerId, { peer: peerId, last: m.body, at: m.created_at, unread: 0 });
    if (m.recipient_id === user.id && !m.read_at) {
      const c = convMap.get(peerId)!; c.unread += 1;
    }
  }
  const names = await nameFor(admin, [...convMap.keys()]);
  const conversations = [...convMap.values()].map((c) => ({
    peer: c.peer, peerName: names.get(c.peer) ?? "Professeur", last: c.last, at: c.at, unread: c.unread,
  }));

  return NextResponse.json({ approved: true, student_requests: studentRequests, conversations });
}

export async function POST(req: Request) {
  const rl = rateLimit(`dm:${getClientKey(req)}`, { max: 20, windowSec: 60 });
  if (!rl.ok) {
    return NextResponse.json({ error: "Trop de messages. Réessaye dans un instant." }, { status: 429 });
  }
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  if (!(await approvedTeacher(user.id))) {
    return NextResponse.json({ error: "Réservé aux professeurs confirmés" }, { status: 403 });
  }

  let body: { recipientId?: string; body?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const recipientId = (body.recipientId ?? "").trim();
  const text = (body.body ?? "").trim().slice(0, 2000);
  if (!recipientId || recipientId === user.id || text.length < 1) {
    return NextResponse.json({ error: "Message invalide" }, { status: 400 });
  }

  const admin = createAdminClient();
  // Recipient must also be an approved teacher.
  const { data: rec } = await admin.from("teacher_profiles").select("status").eq("user_id", recipientId).maybeSingle();
  if (rec?.status !== "approved") return NextResponse.json({ error: "Destinataire introuvable" }, { status: 404 });

  const { error } = await admin.from("teacher_dms").insert({ sender_id: user.id, recipient_id: recipientId, body: text });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
