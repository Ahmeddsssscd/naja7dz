import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Saves contact-form messages to Supabase. Until the support_messages
 * table exists (added in a future migration), we just log + return ok.
 */
export async function POST(req: Request) {
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

  // For now, just log it. Once the support_messages table is added we'll
  // insert here. The field shape matches the future schema.
  console.log("[contact]", { name, email, subject, message, locale });

  // Future: insert into support_messages
  void createServerClient; // keep import warm

  return NextResponse.json({ ok: true });
}
