/**
 * Admin CRUD for `chapters`. Same pattern as /api/admin/subjects.
 *
 * GET    /api/admin/chapters                    → all
 * GET    /api/admin/chapters?subject_id=<uuid>  → filter
 * POST   /api/admin/chapters                    → create
 * PATCH  /api/admin/chapters?id=<uuid>          → update
 * DELETE /api/admin/chapters?id=<uuid>          → delete
 */
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdminApi } from "@/lib/admin-auth";

interface Body {
  subject_id?: string;
  slug?: string;
  title_fr?: string;
  title_ar?: string;
  description_fr?: string;
  sort_order?: number;
}

function clean(b: Body, requireSubjectId: boolean) {
  const subject_id = (b.subject_id ?? "").trim();
  const slug = (b.slug ?? "").trim().slice(0, 64).toLowerCase();
  const title_fr = (b.title_fr ?? "").trim().slice(0, 200);
  const title_ar = (b.title_ar ?? "").trim().slice(0, 200);
  const description_fr = (b.description_fr ?? "").trim().slice(0, 2000);
  const sort_order = Number.isFinite(b.sort_order) ? Number(b.sort_order) : 0;
  if (requireSubjectId && !subject_id) return { error: "subject_id requis" } as const;
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) return { error: "slug invalide (lettres/chiffres/tirets)" } as const;
  if (!title_fr) return { error: "Titre (FR) requis" } as const;
  return {
    row: {
      ...(requireSubjectId && { subject_id }),
      slug,
      title_fr,
      title_ar: title_ar || null,
      description_fr: description_fr || null,
      sort_order,
    },
  } as const;
}

export async function GET(req: Request) {
  const gate = await requireAdminApi();
  if ("response" in gate) return gate.response;

  const url = new URL(req.url);
  const subjectId = url.searchParams.get("subject_id");

  const admin = createAdminClient();
  let q = admin
    .from("chapters")
    .select("id, subject_id, slug, title_fr, title_ar, description_fr, sort_order, subjects(name_fr, grade_code)")
    .order("sort_order");
  if (subjectId) q = q.eq("subject_id", subjectId);

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ rows: data ?? [] });
}

export async function POST(req: Request) {
  const gate = await requireAdminApi();
  if ("response" in gate) return gate.response;

  let body: Body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const cleaned = clean(body, true);
  if ("error" in cleaned) return NextResponse.json({ error: cleaned.error }, { status: 400 });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("chapters")
    .insert(cleaned.row)
    .select("id, subject_id, slug, title_fr, title_ar, description_fr, sort_order")
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
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  // For PATCH we don't require subject_id (user may not be re-assigning).
  const cleaned = clean(body, false);
  if ("error" in cleaned) return NextResponse.json({ error: cleaned.error }, { status: 400 });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("chapters")
    .update(cleaned.row)
    .eq("id", id)
    .select("id, subject_id, slug, title_fr, title_ar, description_fr, sort_order")
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
  const { error } = await admin.from("chapters").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
