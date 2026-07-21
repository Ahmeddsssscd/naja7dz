import { NextResponse } from "next/server";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import { rateLimit, getClientKey } from "@/lib/rate-limit";
import { sendContactConfirmation } from "@/lib/email";

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const rl = rateLimit(`contact:${getClientKey(req)}`, { max: 3, windowSec: 60 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessaye dans un instant." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter ?? 60) } },
    );
  }

  let body: {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
    locale?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = (body.name ?? "").trim().slice(0, 200);
  const email = (body.email ?? "").trim().toLowerCase();
  const subject = (body.subject ?? "").trim().slice(0, 200);
  const message = (body.message ?? "").trim().slice(0, 5000);
  const locale = body.locale === "ar" ? "ar" : "fr";

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
  }
  if (!EMAIL_RX.test(email)) {
    return NextResponse.json({ error: "Adresse email invalide" }, { status: 400 });
  }

  // Resolve the optional authenticated user so we can link the message.
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  const admin = createAdminClient();
  const { error } = await admin.from("support_messages").insert({
    name,
    email,
    subject,
    message,
    locale,
    user_id: user?.id ?? null,
    status: "open",
  });

  if (error) {
    console.error("[contact] insert failed", error.message);
    return NextResponse.json(
      { error: "Une erreur s'est produite. Réessaye dans un instant." },
      { status: 500 },
    );
  }

  // Send auto-reply — fire-and-forget so an email failure never breaks the form.
  sendContactConfirmation({ to: email, name }).catch(
    (err) => console.error("[contact] confirmation email failed", err),
  );

  return NextResponse.json({ ok: true });
}
