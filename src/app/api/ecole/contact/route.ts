/**
 * POST /api/ecole/contact — receive a Pack École quote request.
 *
 * Anonymous-friendly: schools shouldn't have to log in to ask for a price.
 * We rate-limit the IP later if abuse appears; for now relying on the
 * captcha-free pattern used by the public contact form.
 *
 * Stores the row in `school_quote_requests` (migration 014). Logs warn-
 * level if the table doesn't exist yet but still 200s — the user shouldn't
 * see an error during a sales-funnel moment.
 */
import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { checkSetupErr } from "@/lib/db-errors";

interface Body {
  schoolName?: string;
  contactName?: string;
  role?: string;
  email?: string;
  phone?: string;
  wilaya?: string;
  studentCount?: string;
  levels?: string[];
  message?: string;
}

const VALID_BUCKETS = ["<100", "100-300", "300-600", "600-1000", ">1000"];

export async function POST(req: Request) {
  let body: Body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const schoolName = String(body.schoolName ?? "").trim().slice(0, 200);
  const email      = String(body.email ?? "").trim().slice(0, 200);
  if (schoolName.length < 2) return NextResponse.json({ error: "Nom de l'école requis" }, { status: 400 });
  if (!email.includes("@")) return NextResponse.json({ error: "Email invalide" }, { status: 400 });

  const studentCount = String(body.studentCount ?? "").trim();
  if (studentCount && !VALID_BUCKETS.includes(studentCount)) {
    return NextResponse.json({ error: "Tranche d'effectif invalide" }, { status: 400 });
  }

  const levels = (body.levels ?? [])
    .filter((l): l is string => typeof l === "string")
    .map((l) => l.slice(0, 60))
    .slice(0, 8);

  const row = {
    school_name: schoolName,
    contact_name: String(body.contactName ?? "").trim().slice(0, 120) || null,
    role: String(body.role ?? "").trim().slice(0, 120) || null,
    email,
    phone: String(body.phone ?? "").trim().slice(0, 32) || null,
    wilaya: String(body.wilaya ?? "").trim().slice(0, 80) || null,
    student_count_bucket: studentCount || null,
    levels,
    message: String(body.message ?? "").trim().slice(0, 4000) || null,
    status: "new",
  };

  const supabase = await createServerClient();
  const { error } = await supabase.from("school_quote_requests").insert(row);

  const setup = checkSetupErr(error);
  if (setup) {
    console.warn("[ecole/contact] DB not ready — run SETUP.sql in Supabase");
    return NextResponse.json({ ok: true, stored: false }, { status: 202 });
  }
  if (error) {
    console.error("[ecole/contact] insert failed", error.message);
    return NextResponse.json({ ok: true, stored: false }, { status: 202 });
  }

  // TODO: send email notification via Resend to sales inbox.

  return NextResponse.json({ ok: true });
}
