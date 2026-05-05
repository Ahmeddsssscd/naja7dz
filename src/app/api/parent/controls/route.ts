import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const childId = body.childId as string | undefined;
  if (!childId) return NextResponse.json({ error: "childId required" }, { status: 400 });

  // Ensure the child belongs to the parent
  const { data: child } = await supabase
    .from("children").select("id").eq("id", childId).eq("parent_id", user.id).maybeSingle();
  if (!child) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await supabase
    .from("parent_controls")
    .upsert({
      child_id: childId,
      parent_id: user.id,
      daily_time_limit_minutes: body.daily_time_limit_minutes ?? 60,
      lock_games_until_quizzes: body.lock_games_until_quizzes ?? false,
      allowed_kids_universe: body.allowed_kids_universe ?? true,
      allowed_social: body.allowed_social ?? false,
      bedtime_start: body.bedtime_start || null,
      bedtime_end: body.bedtime_end || null,
    });

  return NextResponse.json({ ok: true });
}
