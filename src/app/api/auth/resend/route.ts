import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { rateLimit, getClientKey } from "@/lib/rate-limit";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://naja7dz.com";

export async function POST(req: Request) {
  const rl = rateLimit(`resend:${getClientKey(req)}`, { max: 3, windowSec: 60 * 5 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Patiente quelques minutes avant de réessayer." },
      { status: 429 },
    );
  }

  let body: { email?: string; locale?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const email = (body.email ?? "").trim().toLowerCase();
  const locale = body.locale === "ar" ? "ar" : "fr";
  if (!email) return NextResponse.json({ error: "Email requis" }, { status: 400 });

  const supabase = await createServerClient();
  await supabase.auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo: `${SITE}/${locale}/verifier-email` },
  });

  // Always return success — don't leak whether email exists
  return NextResponse.json({ ok: true });
}
