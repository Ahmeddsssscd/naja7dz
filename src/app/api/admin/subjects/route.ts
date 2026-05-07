/**
 * Admin CRUD for the `subjects` table.
 *
 * GET    /api/admin/subjects                  → list, optional ?grade=3AM
 * POST   /api/admin/subjects                  → create
 * PATCH  /api/admin/subjects?id=<uuid>        → update
 * DELETE /api/admin/subjects?id=<uuid>        → delete
 *
 * All ops gated by requireAdminApi(). Uses service-role client to bypass RLS.
 */
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdminApi } from "@/lib/admin-auth";

interface Body {
  grade_code?: string;
  name_fr?: string;
  name_ar?: string;
  sort_order?: number;
}

const VALID_GRADES = [
  "1AP", "2AP", "3AP", "4AP", "5AP",
  "1AM", "2AM", "3AM", "4AM",
  "1AS", "2AS", "3AS",
];

function clean(b: Body) {
  const grade_code = (b.grade_code ?? "").trim();
  const name_fr = (b.name_fr ?? "").trim().slice(0, 100);
  const name_ar = (b.name_ar ?? "").trim().slice(0, 100);
  const sort_order = Number.isFinite(b.sort_order) ? Number(b.sort_order) : 0;
  if (!VALID_GRADES.includes(grade_code)) return { error: "grade_code invalide" } as const;
  if (!name_fr) return { error: "Nom (FR) requis" } as const;
  return { row: { grade_code, name_fr, name_ar: name_ar || null, sort_order } } as const;
}

export async function GET(req: Request) {
  const gate = await requireAdminApi();
  if ("response" in gate) return gate.response;

  const url = new URL(req.url);
  const grade = url.searchParams.get("grade");

  const admin = createAdminClient();
  let q = admin
    .from("subjects")
    .select("id, grade_code, name_fr, name_ar, sort_order, created_at")
    .order("grade_code")
    .order("sort_order");
  if (grade) q = q.eq("grade_code", grade);

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ rows: data ?? [] });
}

export async function POST(req: Request) {
  const gate = await requireAdminApi();
  if ("response" in gate) return gate.response;

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const cleaned = clean(body);
  if ("error" in cleaned) return NextResponse.json({ error: cleaned.error }, { status: 400 });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("subjects")
    .insert(cleaned.row)
    .select("id, grade_code, name_fr, name_ar, sort_order")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ row: data });
}

export async function PATCH(req: Request) {
  const gate = await requireAdminApi();
  if ("response" in gate) return gate.response;

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const cleaned = clean(body);
  if ("error" in cleaned) return NextResponse.json({ error: cleaned.error }, { status: 400 });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("subjects")
    .update(cleaned.row)
    .eq("id", id)
    .select("id, grade_code, name_fr, name_ar, sort_order")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ row: data });
}

export async function DELETE(req: Request) {
  const gate = await requireAdminApi();
  if ("response" in gate) return gate.response;

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const admin = createAdminClient();
  const { error } = await admin.from("subjects").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
