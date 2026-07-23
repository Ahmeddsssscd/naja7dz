/**
 * Admin CRUD for the `professors` directory.
 * GET / POST / PATCH?id / DELETE?id — all admin-gated.
 */
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdminApi } from "@/lib/admin-auth";

const MODES = new Set(["in_person", "online", "both"]);

interface Body {
  full_name?: string;
  subject?: string;
  wilaya?: string;
  teaches_at?: string;
  mode?: string;
  teaching_types?: string[] | string;
  bio?: string;
  hourly_rate_dzd?: number | string;
  verified?: boolean;
  active?: boolean;
  sort_order?: number | string;
}

const TEACH_TYPES = new Set(["school", "private", "online"]);

function clean(b: Body) {
  const full_name = (b.full_name ?? "").trim().slice(0, 120);
  const subject = (b.subject ?? "").trim().slice(0, 60);
  const wilaya = (b.wilaya ?? "").trim().slice(0, 60);
  const mode = MODES.has(b.mode ?? "") ? b.mode! : "both";
  if (!full_name) return { error: "Nom requis" } as const;
  if (!subject) return { error: "Matière requise" } as const;
  if (!wilaya) return { error: "Wilaya requise" } as const;
  const rate = b.hourly_rate_dzd === "" || b.hourly_rate_dzd == null ? null : Math.round(Number(b.hourly_rate_dzd));
  // teaching_types may arrive as an array or a comma-separated string.
  const rawTypes = Array.isArray(b.teaching_types)
    ? b.teaching_types
    : String(b.teaching_types ?? "").split(",");
  const teaching_types = [...new Set(rawTypes.map((s) => s.trim()).filter((s) => TEACH_TYPES.has(s)))];
  return {
    row: {
      full_name,
      subject,
      wilaya,
      teaches_at: (b.teaches_at ?? "").trim().slice(0, 160) || null,
      mode,
      teaching_types,
      bio: (b.bio ?? "").trim().slice(0, 600) || null,
      hourly_rate_dzd: Number.isFinite(rate) ? rate : null,
      verified: b.verified === true,
      active: b.active !== false,
      sort_order: Number.isFinite(Number(b.sort_order)) ? Number(b.sort_order) : 0,
    },
  } as const;
}

export async function GET() {
  const gate = await requireAdminApi();
  if ("response" in gate) return gate.response;
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("professors")
    .select("id, full_name, subject, wilaya, teaches_at, mode, teaching_types, bio, hourly_rate_dzd, verified, active, sort_order")
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
  const { data, error } = await admin.from("professors").insert(cleaned.row).select().single();
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
  const cleaned = clean(body);
  if ("error" in cleaned) return NextResponse.json({ error: cleaned.error }, { status: 400 });
  const admin = createAdminClient();
  const { data, error } = await admin.from("professors").update(cleaned.row).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ row: data });
}

export async function DELETE(req: Request) {
  const gate = await requireAdminApi();
  if ("response" in gate) return gate.response;
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const admin = createAdminClient();
  const { error } = await admin.from("professors").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
