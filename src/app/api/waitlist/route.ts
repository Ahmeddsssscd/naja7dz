import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { rateLimit, getClientKey } from "@/lib/rate-limit";

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  // 5 signups per IP per minute is plenty
  const rl = rateLimit(`waitlist:${getClientKey(req)}`, { max: 5, windowSec: 60 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessaye dans un instant." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter ?? 60) } },
    );
  }

  let body: { email?: string; locale?: string; source?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const locale = body.locale === "ar" ? "ar" : "fr";
  const source = (body.source ?? "landing").slice(0, 64);

  if (!email || !EMAIL_RX.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Adresse email invalide" }, { status: 400 });
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("early_access_signups")
      .insert({ email, locale, source });

    if (error) {
      // Unique violation → already registered, treat as success (idempotent)
      if (error.code === "23505") {
        return NextResponse.json({ ok: true, alreadyRegistered: true });
      }
      console.error("waitlist insert failed", error);
      return NextResponse.json(
        { error: "Une erreur s'est produite. Réessaye dans un instant." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("waitlist route exception", err);
    return NextResponse.json(
      { error: "Une erreur s'est produite. Réessaye dans un instant." },
      { status: 500 },
    );
  }
}
