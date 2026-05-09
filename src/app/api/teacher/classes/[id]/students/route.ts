/**
 * POST /api/teacher/classes/[id]/students — bulk-insert students into a class.
 * Body: { students: [{ full_name, numero? }] }
 */
import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { checkSetupErr } from "@/lib/db-errors";

interface Props { params: Promise<{ id: string }> }

export async function POST(req: Request, { params }: Props) {
  const { id: classId } = await params;
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  // Verify the class belongs to this teacher
  const { data: cls } = await supabase
    .from("teacher_classes")
    .select("id")
    .eq("id", classId)
    .eq("teacher_id", user.id)
    .maybeSingle();
  if (!cls) return NextResponse.json({ error: "Classe introuvable" }, { status: 404 });

  let body: { students?: Array<{ full_name?: string; numero?: string | null }> };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const rows = (body.students ?? [])
    .map((s) => ({
      class_id: classId,
      full_name: String(s.full_name ?? "").trim().slice(0, 120),
      numero: s.numero ? String(s.numero).trim().slice(0, 32) : null,
    }))
    .filter((r) => r.full_name.length >= 2)
    .slice(0, 200); // cap per request

  if (rows.length === 0) return NextResponse.json({ error: "Aucune ligne valide" }, { status: 400 });

  const { error } = await supabase.from("class_students").insert(rows);

  const setup = checkSetupErr(error);
  if (setup) return NextResponse.json(setup.body, { status: setup.status });
  if (error) {
    console.error("[teacher/classes/students] insert failed", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ inserted: rows.length });
}
