/**
 * POST /api/fac/services — receive a Faculté service request from a logged-in
 * user. Stores in the `fac_service_requests` table and (TODO) emails the
 * Najah staff inbox.
 *
 * The table is created by migration 011_fac_service_requests.sql. If the
 * migration hasn't been applied yet we degrade to a 503 with a friendly
 * message rather than 500.
 */
import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { checkSetupErr } from "@/lib/db-errors";

const VALID_SERVICES = ["orientation", "dossier", "memoire", "bourse", "autre"];

export async function POST(req: Request) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  let body: { service?: string; details?: string; phone?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const service = String(body.service ?? "");
  if (!VALID_SERVICES.includes(service)) {
    return NextResponse.json({ error: "Service invalide" }, { status: 400 });
  }
  const details = String(body.details ?? "").trim().slice(0, 4000);
  const phone   = String(body.phone ?? "").trim().slice(0, 32);
  if (details.length < 10) {
    return NextResponse.json({ error: "Détails trop courts (min. 10 caractères)" }, { status: 400 });
  }

  const { error } = await supabase
    .from("fac_service_requests")
    .insert({
      user_id: user.id,
      email: user.email ?? null,
      service,
      details,
      phone: phone || null,
      status: "new",
    });

  const setup = checkSetupErr(error);
  if (setup) return NextResponse.json(setup.body, { status: setup.status });

  if (error) {
    console.error("[fac/services] insert failed", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // TODO: send email notification via Resend to staff inbox.

  return NextResponse.json({ ok: true });
}
