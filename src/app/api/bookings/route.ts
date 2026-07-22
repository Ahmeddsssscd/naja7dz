/**
 * Create a booking request for a professor.
 *
 * POST /api/bookings { professorId, studentName?, grade?, preferredMode?, phone?, message? }
 *
 * Auth required. Rate-limited. The request is saved as "pending"; the team
 * follows up — no live scheduling or payment here.
 */
import { NextResponse } from "next/server";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import { rateLimit, getClientKey } from "@/lib/rate-limit";

const MODES = new Set(["in_person", "online", "both"]);

export async function POST(req: Request) {
  const rl = rateLimit(`booking:${getClientKey(req)}`, { max: 5, windowSec: 60 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Trop de demandes. Réessaye dans un instant." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter ?? 60) } },
    );
  }

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Connecte-toi pour réserver" }, { status: 401 });

  let body: {
    professorId?: string;
    studentName?: string;
    grade?: string;
    preferredMode?: string;
    phone?: string;
    message?: string;
  };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const professorId = (body.professorId ?? "").trim();
  if (!professorId) return NextResponse.json({ error: "Professeur requis" }, { status: 400 });

  const admin = createAdminClient();
  // Professor must exist and be active.
  const { data: prof } = await admin
    .from("professors")
    .select("id")
    .eq("id", professorId)
    .eq("active", true)
    .maybeSingle();
  if (!prof) return NextResponse.json({ error: "Professeur introuvable" }, { status: 404 });

  const preferredMode = MODES.has(body.preferredMode ?? "") ? body.preferredMode : null;

  const { error } = await admin.from("booking_requests").insert({
    professor_id: professorId,
    parent_id: user.id,
    student_name: (body.studentName ?? "").trim().slice(0, 120) || null,
    grade: (body.grade ?? "").trim().slice(0, 20) || null,
    preferred_mode: preferredMode,
    phone: (body.phone ?? "").trim().slice(0, 40) || null,
    message: (body.message ?? "").trim().slice(0, 1000) || null,
    status: "pending",
  });
  if (error) {
    console.error("[bookings] insert failed", error.message);
    return NextResponse.json({ error: "Une erreur s'est produite" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
