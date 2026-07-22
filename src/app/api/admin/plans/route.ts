/**
 * Admin CRUD for the `plans` catalog (pricing).
 *
 * GET    /api/admin/plans            → list all plans
 * POST   /api/admin/plans            → create (id is a text slug, admin-set)
 * PATCH  /api/admin/plans?id=<slug>  → update price / names / active
 * DELETE /api/admin/plans?id=<slug>  → delete
 *
 * The plan `id` is referenced by checkout, so editing an existing plan's
 * price/name/description is the common path; deleting one that's wired into
 * the UI would remove it from /tarifs.
 */
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdminApi } from "@/lib/admin-auth";

interface Body {
  id?: string;
  name_fr?: string;
  name_ar?: string;
  amount_dzd?: number;
  period?: string;
  description_fr?: string;
  description_ar?: string;
  active?: boolean;
}

const VALID_PERIODS = ["monthly", "annual", "one_time"];

function clean(b: Body, requireId: boolean) {
  const name_fr = (b.name_fr ?? "").trim().slice(0, 100);
  const name_ar = (b.name_ar ?? "").trim().slice(0, 100);
  const description_fr = (b.description_fr ?? "").trim().slice(0, 300);
  const description_ar = (b.description_ar ?? "").trim().slice(0, 300);
  const period = (b.period ?? "").trim();
  const amount = Number(b.amount_dzd);

  if (!name_fr) return { error: "Nom (FR) requis" } as const;
  if (!VALID_PERIODS.includes(period)) return { error: "Période invalide" } as const;
  if (!Number.isFinite(amount) || amount < 0 || amount > 10_000_000) {
    return { error: "Montant invalide" } as const;
  }

  const row: Record<string, unknown> = {
    name_fr,
    name_ar: name_ar || null,
    description_fr: description_fr || null,
    description_ar: description_ar || null,
    period,
    amount_dzd: Math.round(amount),
    active: b.active !== false,
  };
  if (requireId) {
    const id = (b.id ?? "").trim().toLowerCase().replace(/[^a-z0-9_]/g, "_").slice(0, 40);
    if (!id) return { error: "Identifiant requis" } as const;
    row.id = id;
  }
  return { row } as const;
}

export async function GET() {
  const gate = await requireAdminApi();
  if ("response" in gate) return gate.response;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("plans")
    .select("id, name_fr, name_ar, amount_dzd, period, description_fr, description_ar, active")
    .order("amount_dzd");
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
  const { data, error } = await admin.from("plans").insert(cleaned.row).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ row: data });
}

export async function PATCH(req: Request) {
  const gate = await requireAdminApi();
  if ("response" in gate) return gate.response;

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  let body: Body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const cleaned = clean(body, false);
  if ("error" in cleaned) return NextResponse.json({ error: cleaned.error }, { status: 400 });

  const admin = createAdminClient();
  const { data, error } = await admin.from("plans").update(cleaned.row).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ row: data });
}

export async function DELETE(req: Request) {
  const gate = await requireAdminApi();
  if ("response" in gate) return gate.response;

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const admin = createAdminClient();
  const { error } = await admin.from("plans").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
