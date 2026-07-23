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
  role?: string;   // parent | student | teacher
  grade?: string;  // required when role = student
}

const ROLES = new Set(["parent", "student", "teacher"]);
const GRADES = new Set([
  "1AP", "2AP", "3AP", "4AP", "5AP", "1AM", "2AM", "3AM", "4AM", "1AS", "2AS", "3AS",
]);

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
  const role = ROLES.has(body.role ?? "") ? body.role! : "parent";
  const grade = GRADES.has(body.grade ?? "") ? body.grade! : null;

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
      role,
    });
    if (isSetupIncompleteError(profileErr)) {
      return NextResponse.json(
        {
          error: "Configuration de la base de données incomplète. L'admin doit appliquer database/FIX_EVERYTHING.sql dans Supabase.",
          setupRequired: true,
        },
        { status: 503 },
      );
    }
    if (profileErr) {
      console.error("[signup] profile upsert failed", profileErr);
    }

    // Role-specific setup so the first login lands in the right space.
    if (role === "teacher") {
      // Pending teacher profile — the "specialized team" approves it later.
      await admin.from("teacher_profiles").upsert(
        { user_id: data.user.id, full_name: fullName, wilaya, phone, status: "pending" },
        { onConflict: "user_id" },
      ).then(({ error }) => error && console.error("[signup] teacher_profiles", error.message));
    } else if (role === "student") {
      // The student is their own learner — create a child row for themselves
      // so the student space (which reads the first child) works immediately.
      const { data: existing } = await admin
        .from("children").select("id").eq("parent_id", data.user.id).limit(1).maybeSingle();
      if (!existing) {
        await admin.from("children")
          .insert({ parent_id: data.user.id, full_name: fullName, grade })
          .then(({ error }) => error && console.error("[signup] self-child", error.message));
      }
    }
  }

  return NextResponse.json({
    ok: true,
    needsVerification: !data.session, // true unless email auto-confirm is enabled
  });
}
