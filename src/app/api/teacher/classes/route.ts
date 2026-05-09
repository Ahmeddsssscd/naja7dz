/**
 * POST /api/teacher/classes — create a new class for the current teacher.
 * Returns the new class id so the client can navigate straight to it.
 */
import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { checkSetupErr } from "@/lib/db-errors";

const VALID_GRADES = ["1AP", "2AP", "3AP", "4AP", "5AP", "1AM", "2AM", "3AM", "4AM", "1AS", "2AS", "3AS"];

export async function POST(req: Request) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  // Verify the user is a teacher
  const { data: prof } = await supabase
    .from("teacher_profiles")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!prof) return NextResponse.json({ error: "Profil enseignant manquant" }, { status: 403 });

  let body: { name?: string; grade?: string; year?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const name = (body.name ?? "").trim().slice(0, 200);
  const grade = String(body.grade ?? "");
  const year = (body.year ?? "2025-2026").trim().slice(0, 12);
  if (name.length < 2) return NextResponse.json({ error: "Nom trop court" }, { status: 400 });
  if (!VALID_GRADES.includes(grade)) return NextResponse.json({ error: "Niveau invalide" }, { status: 400 });

  const { data, error } = await supabase
    .from("teacher_classes")
    .insert({ teacher_id: user.id, name, grade, school_year: year })
    .select("id")
    .single();

  const setup = checkSetupErr(error);
  if (setup) return NextResponse.json(setup.body, { status: setup.status });
  if (error || !data) {
    console.error("[teacher/classes] insert failed", error);
    return NextResponse.json({ error: error?.message ?? "Erreur" }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}
