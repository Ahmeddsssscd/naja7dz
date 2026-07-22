/**
 * Toggle the Kids Universe opt-in flag for one of the parent's children.
 *
 * POST /api/children/kids-universe { childId: string, enabled: boolean }
 *
 * IDOR-protected: the child must belong to the authenticated parent.
 */
import { NextResponse } from "next/server";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  let body: { childId?: string; enabled?: boolean };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const childId = (body.childId ?? "").trim();
  const enabled = body.enabled === true;
  if (!childId) return NextResponse.json({ error: "childId requis" }, { status: 400 });

  const admin = createAdminClient();
  const { data: child } = await admin
    .from("children")
    .select("id")
    .eq("id", childId)
    .eq("parent_id", user.id)
    .maybeSingle();
  if (!child) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { error } = await admin
    .from("children")
    .update({ kids_universe_enabled: enabled })
    .eq("id", childId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, enabled });
}
