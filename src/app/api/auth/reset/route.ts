import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://naja7dz.com";

export async function POST(req: Request) {
  let body: { email?: string; locale?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const locale = body.locale === "ar" ? "ar" : "fr";
  if (!email) return NextResponse.json({ error: "Email requis" }, { status: 400 });

  const supabase = await createServerClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${SITE}/${locale}/connexion/reinitialiser`,
  });

  // Always return success so we don't leak which emails are registered
  return NextResponse.json({ ok: true });
}
