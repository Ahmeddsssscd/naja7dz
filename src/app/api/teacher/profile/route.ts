/**
 * POST /api/teacher/profile — create the teacher_profiles row for the
 * current user. Idempotent: re-posting just updates the fields.
 */
import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { checkSetupErr } from "@/lib/db-errors";

export async function POST(req: Request) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  let body: { fullName?: string; school?: string; wilaya?: string; phone?: string; bio?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const fullName = (body.fullName ?? "").trim().slice(0, 100);
  if (fullName.length < 3) return NextResponse.json({ error: "Nom complet requis" }, { status: 400 });

  const row = {
    user_id: user.id,
    full_name: fullName,
    school_name: (body.school ?? "").trim().slice(0, 200) || null,
    wilaya: (body.wilaya ?? "").trim().slice(0, 80) || null,
    phone: (body.phone ?? "").trim().slice(0, 32) || null,
    bio: (body.bio ?? "").trim().slice(0, 1000) || null,
  };

  // Upsert — first call inserts, follow-ups update.
  const { error } = await supabase
    .from("teacher_profiles")
    .upsert(row, { onConflict: "user_id" });

  const setup = checkSetupErr(error);
  if (setup) return NextResponse.json(setup.body, { status: setup.status });
  if (error) {
    console.error("[teacher/profile] upsert failed", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
