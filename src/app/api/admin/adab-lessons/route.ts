/**
 * Admin CRUD for `adab_lessons`.
 */
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdminApi } from "@/lib/admin-auth";

interface Body {
  slug?: string;
  title_fr?: string;
  title_ar?: string;
  body_fr?: string;
  body_ar?: string;
  age_min?: number;
  age_max?: number;
  sort_order?: number;
}

function clean(b: Body) {
  const slug = (b.slug ?? "").trim().slice(0, 64).toLowerCase();
  const title_fr = (b.title_fr ?? "").trim().slice(0, 200);
  const title_ar = (b.title_ar ?? "").trim().slice(0, 200);
  const body_fr = (b.body_fr ?? "").trim().slice(0, 5000);
  const body_ar = (b.body_ar ?? "").trim().slice(0, 5000);
  const age_min = Math.max(5, Math.min(18, Number(b.age_min ?? 5)));
  const age_max = Math.max(5, Math.min(18, Number(b.age_max ?? 12)));
  const sort_order = Number.isFinite(b.sort_order) ? Number(b.sort_order) : 0;
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) return { error: "slug invalide (lettres/chiffres/tirets)" } as const;
  if (!title_fr) return { error: "Titre (FR) requis" } as const;
  if (!body_fr) return { error: "Texte (FR) requis" } as const;
  if (age_min > age_max) return { error: "age_min > age_max" } as const;
  return {
    row: { slug, title_fr, title_ar: title_ar || null, body_fr, body_ar: body_ar || null, age_min, age_max, sort_order },
  } as const;
}

export async function GET() {
  const gate = await requireAdminApi();
  if ("response" in gate) return gate.response;
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("adab_lessons")
    .select("*")
    .order("sort_order");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ rows: data ?? [] });
}

export async function POST(req: Request) {
  const gate = await requireAdminApi();
  if ("response" in gate) return gate.response;
  let body: Body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const cleaned = clean(body);
  if ("error" in cleaned) return NextResponse.json({ error: cleaned.error }, { status: 400 });
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("adab_lessons")
    .insert(cleaned.row)
    .select()
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
  const cleaned = clean(body);
  if ("error" in cleaned) return NextResponse.json({ error: cleaned.error }, { status: 400 });
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("adab_lessons")
    .update(cleaned.row)
    .eq("id", id)
    .select()
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
  const { error } = await admin.from("adab_lessons").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
