/**
 * POST /api/marketplace/helper-profile
 *
 * Logged-in user creates their helper_profiles row. Always lands in
 * status='pending' — admin reviews from /admin/approvals.
 *
 * One profile per user (unique constraint on user_id).
 */
import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { checkSetupErr } from "@/lib/db-errors";

interface Body {
  display_name?: string;
  last_initial?: string | null;
  helper_type?: "student" | "pro";
  university_slug?: string | null;
  study_year?: number | null;
  field?: string | null;
  profession?: string | null;
  experience_years?: number | null;
  services?: string[];
  bio?: string;
  responds_within?: string;
  hourly_rate_da?: number | null;
}

export async function POST(req: Request) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  let body: Body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const displayName = String(body.display_name ?? "").trim().slice(0, 120);
  if (displayName.length < 2) return NextResponse.json({ error: "Nom requis" }, { status: 400 });

  const helperType = body.helper_type;
  if (helperType !== "student" && helperType !== "pro") {
    return NextResponse.json({ error: "Type invalide" }, { status: 400 });
  }

  const bio = String(body.bio ?? "").trim().slice(0, 2000);
  if (bio.length < 30) return NextResponse.json({ error: "Bio trop courte (30 caractères min)" }, { status: 400 });

  const services = (body.services ?? []).filter((s): s is string => typeof s === "string").slice(0, 10);
  if (services.length === 0) return NextResponse.json({ error: "Choisis au moins un service" }, { status: 400 });

  const row = {
    user_id: user.id,
    display_name: displayName,
    last_initial: body.last_initial ? String(body.last_initial).slice(0, 1).toUpperCase() : null,
    helper_type: helperType,
    university_slug: helperType === "student" ? (body.university_slug ?? null) : null,
    study_year: helperType === "student" ? (body.study_year ?? null) : null,
    field: helperType === "student" ? String(body.field ?? "").trim().slice(0, 80) || null : null,
    profession: helperType === "pro" ? String(body.profession ?? "").trim().slice(0, 120) || null : null,
    experience_years: helperType === "pro" ? (body.experience_years ?? null) : null,
    services,
    bio,
    responds_within: String(body.responds_within ?? "24h").slice(0, 10),
    hourly_rate_da: body.hourly_rate_da ?? null,
    status: "pending",
  };

  const { error } = await supabase.from("helper_profiles").insert(row);
  const setup = checkSetupErr(error);
  if (setup) return NextResponse.json(setup.body, { status: setup.status });
  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Tu as déjà un profil — modifie-le depuis Mon profil." }, { status: 409 });
    }
    console.error("[marketplace/helper-profile] insert failed", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
