/**
 * POST /api/admin/approvals
 *
 * Admin-only. Approves or rejects a helper_profile or teacher_profile.
 *
 * Body:
 *   { kind: 'helper' | 'teacher', id: string, action: 'approve' | 'reject', note?: string }
 */
import { NextResponse } from "next/server";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  // Admin check
  const { data: me } = await supabase
    .from("parent_profiles")
    .select("is_admin")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!me?.is_admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let body: { kind?: string; id?: string; action?: string; note?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  if (body.kind !== "helper" && body.kind !== "teacher") {
    return NextResponse.json({ error: "kind invalide" }, { status: 400 });
  }
  if (body.action !== "approve" && body.action !== "reject") {
    return NextResponse.json({ error: "action invalide" }, { status: 400 });
  }

  const admin = createAdminClient();
  const update: Record<string, unknown> = {
    status: body.action === "approve" ? "approved" : "rejected",
    approved_at: body.action === "approve" ? new Date().toISOString() : null,
    approved_by: body.action === "approve" ? user.id : null,
  };
  if (body.action === "reject" && body.note) update.rejection_note = String(body.note).slice(0, 1000);

  if (body.kind === "helper") {
    const { error } = await admin
      .from("helper_profiles")
      .update(update)
      .eq("id", body.id ?? "");
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    // Teachers: approve also flips is_public so they show in /enseignant/reseau
    const teacherUpdate: Record<string, unknown> = { ...update };
    if (body.action === "approve") teacherUpdate.is_public = true;
    delete teacherUpdate.rejection_note; // not on teacher_profiles
    const { error } = await admin
      .from("teacher_profiles")
      .update(teacherUpdate)
      .eq("user_id", body.id ?? "");
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
