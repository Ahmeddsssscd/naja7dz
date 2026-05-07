/**
 * Admin CRUD for `writing_prompts`.
 */
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdminApi } from "@/lib/admin-auth";

interface Body {
  age_min?: number;
  age_max?: number;
  prompt_fr?: string;
  prompt_ar?: string;
  type?: string;
  active?: boolean;
}

function clean(b: Body) {
  const age_min = Math.max(5, Math.min(18, Number(b.age_min ?? 5)));
  const age_max = Math.max(5, Math.min(18, Number(b.age_max ?? 18)));
  if (age_min > age_max) return { error: "age_min > age_max" } as const;
  const prompt_fr = (b.prompt_fr ?? "").trim().slice(0, 1000);
  const prompt_ar = (b.prompt_ar ?? "").trim().slice(0, 1000);
  if (!prompt_fr) return { error: "Sujet (FR) requis" } as const;
  const type = b.type === "structured" ? "structured" : "free";
  const active = b.active !== false;
  return { row: { age_min, age_max, prompt_fr, prompt_ar: prompt_ar || null, type, active } } as const;
}

export async function GET() {
  const gate = await requireAdminApi();
  if ("response" in gate) return gate.response;
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("writing_prompts")
    .select("id, age_min, age_max, prompt_fr, prompt_ar, type, active, created_at")
    .order("created_at", { ascending: false });
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
    .from("writing_prompts")
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
    .from("writing_prompts")
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
  const { error } = await admin.from("writing_prompts").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
