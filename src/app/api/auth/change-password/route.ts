import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { rateLimit, getClientKey } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const rl = rateLimit(`change-pw:${getClientKey(req)}`, { max: 5, windowSec: 60 * 30 });
  if (!rl.ok) return NextResponse.json({ error: "Trop de tentatives" }, { status: 429 });

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  let body: { newPassword?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const newPassword = body.newPassword ?? "";
  if (newPassword.length < 8) return NextResponse.json({ error: "8 caractères minimum" }, { status: 400 });

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
