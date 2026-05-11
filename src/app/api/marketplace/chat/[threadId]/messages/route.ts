/**
 * /api/marketplace/chat/[threadId]/messages
 *
 * GET  — list messages for the thread (must be a party)
 * POST — append a message ({ kind: 'text'|'price', body: string })
 */
import { NextResponse } from "next/server";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import { checkSetupErr } from "@/lib/db-errors";

interface Ctx { params: Promise<{ threadId: string }> }

async function assertParty(threadId: string, userId: string) {
  const admin = createAdminClient();
  const { data: thread, error } = await admin
    .from("chat_threads")
    .select("id, buyer_id, helper_user_id")
    .eq("id", threadId)
    .maybeSingle();
  if (error) {
    const setup = checkSetupErr(error);
    if (setup) return { ok: false as const, response: NextResponse.json(setup.body, { status: setup.status }) };
    return { ok: false as const, response: NextResponse.json({ error: error.message }, { status: 500 }) };
  }
  if (!thread) return { ok: false as const, response: NextResponse.json({ error: "Thread introuvable" }, { status: 404 }) };
  if (thread.buyer_id !== userId && thread.helper_user_id !== userId) {
    return { ok: false as const, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true as const, thread };
}

export async function GET(_req: Request, { params }: Ctx) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  const { threadId } = await params;
  const gate = await assertParty(threadId, user.id);
  if (!gate.ok) return gate.response;

  const admin = createAdminClient();
  const { data: msgs, error } = await admin
    .from("chat_messages")
    .select("id, sender_id, kind, body, created_at")
    .eq("thread_id", threadId)
    .order("created_at");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    messages: (msgs ?? []).map((m) => ({
      id: m.id,
      senderId: m.sender_id,
      kind: m.kind,
      body: m.body,
      createdAt: m.created_at,
    })),
  });
}

export async function POST(req: Request, { params }: Ctx) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  const { threadId } = await params;
  const gate = await assertParty(threadId, user.id);
  if (!gate.ok) return gate.response;

  let body: { kind?: string; body?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const kind = body.kind === "price" ? "price" : "text";
  const text = String(body.body ?? "").trim().slice(0, 4000);
  if (!text) return NextResponse.json({ error: "Message vide" }, { status: 400 });

  const admin = createAdminClient();
  const { data: inserted, error } = await admin
    .from("chat_messages")
    .insert({ thread_id: threadId, sender_id: user.id, kind, body: text })
    .select("id, sender_id, kind, body, created_at")
    .single();

  if (error) {
    console.error("[chat/messages] insert failed", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Bump thread last_message_at
  await admin
    .from("chat_threads")
    .update({ last_message_at: new Date().toISOString() })
    .eq("id", threadId);

  return NextResponse.json({
    message: {
      id: inserted.id,
      senderId: inserted.sender_id,
      kind: inserted.kind,
      body: inserted.body,
      createdAt: inserted.created_at,
    },
  });
}
