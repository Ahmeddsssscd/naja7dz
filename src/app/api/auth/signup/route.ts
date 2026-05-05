import { NextResponse } from "next/server";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import { rateLimit, getClientKey } from "@/lib/rate-limit";

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://naja7dz.com";

interface SignupRequest {
  email?: string;
  password?: string;
  fullName?: string;
  phone?: string;
  wilaya?: string;
  locale?: string;
}

export async function POST(req: Request) {
  const rl = rateLimit(`signup:${getClientKey(req)}`, { max: 5, windowSec: 60 * 15 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessaye dans 15 minutes." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter ?? 900) } },
    );
  }

  let body: SignupRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";
  const fullName = (body.fullName ?? "").trim().slice(0, 200);
  const phone = (body.phone ?? "").trim().slice(0, 32) || null;
  const wilaya = (body.wilaya ?? "").trim().slice(0, 64) || null;
  const locale = body.locale === "ar" ? "ar" : "fr";

  if (!email || !EMAIL_RX.test(email))
    return NextResponse.json({ error: "Email invalide" }, { status: 400 });
  if (!password || password.length < 8)
    return NextResponse.json({ error: "Mot de passe trop court (8 caractères minimum)" }, { status: 400 });
  if (!fullName)
    return NextResponse.json({ error: "Nom complet requis" }, { status: 400 });

  const supabase = await createServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${SITE}/${locale}/verifier-email`,
      data: { full_name: fullName, locale },
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Create the parent profile row (service role so RLS doesn't block on first request)
  if (data.user) {
    try {
      const admin = createAdminClient();
      await admin.from("parent_profiles").upsert({
        user_id: data.user.id,
        full_name: fullName,
        phone,
        wilaya,
        language_pref: locale,
        onboarded: false,
      });
    } catch (err) {
      console.error("[signup] profile insert failed", err);
      // Don't block signup if profile creation fails — user can complete it on first login
    }
  }

  return NextResponse.json({
    ok: true,
    needsVerification: !data.session, // true unless email auto-confirm is enabled
  });
}
