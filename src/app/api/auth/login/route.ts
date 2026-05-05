import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";

  if (!email || !EMAIL_RX.test(email))
    return NextResponse.json({ error: "Email invalide" }, { status: 400 });
  if (!password)
    return NextResponse.json({ error: "Mot de passe requis" }, { status: 400 });

  const supabase = await createServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return NextResponse.json(
      { error: "Email ou mot de passe incorrect" },
      { status: 401 },
    );
  }

  return NextResponse.json({ ok: true });
}
