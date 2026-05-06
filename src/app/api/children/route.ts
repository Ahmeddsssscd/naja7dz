import { NextResponse } from "next/server";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import { checkSetupErr } from "@/lib/db-errors";

export async function POST(req: Request) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  let body: { fullName?: string; age?: number | null; grade?: string | null; markOnboarded?: boolean };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const fullName = (body.fullName ?? "").trim().slice(0, 100);
  const age = body.age ? Math.max(5, Math.min(18, Number(body.age))) : null;
  const grade = body.grade ?? null;
  if (!fullName) return NextResponse.json({ error: "Prénom requis" }, { status: 400 });

  const { data: child, error } = await supabase
    .from("children")
    .insert({ parent_id: user.id, full_name: fullName, age, grade })
    .select("id")
    .single();

  // Check if DB isn't set up — return a clean 503 instead of leaking the raw schema-cache error
  const setup = checkSetupErr(error);
  if (setup) return NextResponse.json(setup.body, { status: setup.status });

  if (error) {
    console.error("[children] insert failed", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (body.markOnboarded) {
    // CRITICAL: must handle the case where parent_profiles row doesn't exist
    // yet (e.g. signup created auth.user but the profile upsert failed silently).
    // A bare UPDATE on a missing row is a no-op → user gets stuck in a redirect
    // loop between /parent and /parent/bienvenue forever.
    //
    // Use service-role admin client to UPSERT, which:
    //   - INSERTs if no row exists (with required full_name from auth metadata),
    //   - UPDATEs only `onboarded` if the row exists (via ignoreDuplicates: false +
    //     onConflict: user_id), preserving any existing full_name/phone/wilaya.
    const admin = createAdminClient();
    const fullNameMeta =
      (typeof user.user_metadata?.full_name === "string" && user.user_metadata.full_name) ||
      user.email?.split("@")[0] ||
      "Parent";

    // First, try to UPDATE just the onboarded flag (preserves other fields).
    const { data: updated, error: updErr } = await admin
      .from("parent_profiles")
      .update({ onboarded: true })
      .eq("user_id", user.id)
      .select("user_id");

    const setup2 = checkSetupErr(updErr);
    if (setup2) return NextResponse.json(setup2.body, { status: setup2.status });

    // If no rows matched, the profile doesn't exist yet — INSERT it.
    if (!updated || updated.length === 0) {
      const { error: insErr } = await admin.from("parent_profiles").insert({
        user_id: user.id,
        full_name: fullNameMeta,
        onboarded: true,
        language_pref: "fr",
      });
      const setup3 = checkSetupErr(insErr);
      if (setup3) return NextResponse.json(setup3.body, { status: setup3.status });
      if (insErr) {
        console.error("[children] profile insert failed", insErr);
        // Don't fail the request — child was created. User can re-trigger.
      }
    }
  }

  return NextResponse.json({ ok: true, id: child.id });
}
