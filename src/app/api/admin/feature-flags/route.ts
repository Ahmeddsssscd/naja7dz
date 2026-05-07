/**
 * Admin endpoints for feature_flags.
 *
 * GET    /api/admin/feature-flags                    → list all
 * PATCH  /api/admin/feature-flags?key=<key>          → toggle/update enabled+label
 *
 * Cannot create/delete from the API — flags are introduced by migrations,
 * so the schema stays consistent with what the app code expects.
 */
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdminApi } from "@/lib/admin-auth";

export async function GET() {
  const gate = await requireAdminApi();
  if ("response" in gate) return gate.response;
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("feature_flags")
    .select("key, enabled, label_fr, description_fr, group_name, sort_order, updated_at")
    .order("group_name")
    .order("sort_order");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ rows: data ?? [] });
}

export async function PATCH(req: Request) {
  const gate = await requireAdminApi();
  if ("response" in gate) return gate.response;

  const url = new URL(req.url);
  const key = url.searchParams.get("key");
  if (!key) return NextResponse.json({ error: "key required" }, { status: 400 });

  let body: { enabled?: boolean };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const enabled = !!body.enabled;
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("feature_flags")
    .update({ enabled })
    .eq("key", key)
    .select("key, enabled, label_fr, description_fr, group_name, sort_order, updated_at")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ row: data });
}
