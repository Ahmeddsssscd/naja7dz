import { NextResponse } from "next/server";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import { rateLimit, getClientKey } from "@/lib/rate-limit";
import { isSetupIncompleteError } from "@/lib/db-errors";

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
  // We intentionally DO surface non-setup errors now: silently swallowing them
  // caused a real bug where the auth user existed but no parent_profiles row
  // ever got created, sending the user into an infinite redirect loop between
  // /parent and /parent/bienvenue. The /api/children handler has a defensive
  // INSERT-if-missing fallback now too, but we want to know early if this fails.
  if (data.user) {
    const admin = createAdminClient();
    const { error: profileErr } = await admin.from("parent_profiles").upsert({
      user_id: data.user.id,
      full_name: fullName,
      phone,
      wilaya,
      language_pref: locale,
      onboarded: false,
    });
    if (isSetupIncompleteError(profileErr)) {
      return NextResponse.json(
        {
          error: "Configuration de la base de données incomplète. L'admin doit appliquer database/SETUP.sql dans Supabase.",
          setupRequired: true,
        },
        { status: 503 },
      );
    }
    if (profileErr) {
      console.error("[signup] profile upsert failed", profileErr);
      // Don't block signup — child API has a defensive INSERT-if-missing path —
      // but log it so we notice in monitoring. Auth user was created and
      // verification email was sent; user can still log in and the wizard
      // will create their profile on the first onboarding action.
    }
  }

  return NextResponse.json({
    ok: true,
    needsVerification: !data.session, // true unless email auto-confirm is enabled
  });
}
