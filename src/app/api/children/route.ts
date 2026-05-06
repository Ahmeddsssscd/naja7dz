import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { checkSetupErr } from "@/lib/db-errors";

export async function POST(req: Request) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  let body: { fullName?: string; age?: number | null; grade?: string | null; markOnboarded?: boolean };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const fullName = (body.fullName ?? "").trim().slice(0, 100);
  const age = body.age ? Math.max(5, Math.min(18, Number(body.age))) : null;
  const grade = body.grade ?? null;
  if (!fullName) return NextResponse.json({ error: "Prénom requis" }, { status: 400 });

  const { data: child, error } = await supabase
    .from("children")
    .insert({ parent_id: user.id, full_name: fullName, age, grade })
    .select("id")
    .single();

  // Check if DB isn't set up — return a clean 503 instead of leaking the raw schema-cache error
  const setup = checkSetupErr(error);
  if (setup) return NextResponse.json(setup.body, { status: setup.status });

  if (error) {
    console.error("[children] insert failed", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (body.markOnboarded) {
    const { error: profErr } = await supabase
      .from("parent_profiles")
      .update({ onboarded: true })
      .eq("user_id", user.id);
    const setup2 = checkSetupErr(profErr);
    if (setup2) return NextResponse.json(setup2.body, { status: setup2.status });
  }

  return NextResponse.json({ ok: true, id: child.id });
}
