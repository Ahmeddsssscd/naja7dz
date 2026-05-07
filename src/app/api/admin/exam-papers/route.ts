/**
 * Admin CRUD for `exam_papers`. PDFs are stored in Supabase Storage bucket
 * `exam-papers` and `file_url` here is the public URL.
 *
 * The storage bucket is auto-created on first POST if it doesn't exist.
 */
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdminApi } from "@/lib/admin-auth";

interface Body {
  exam_type?: "bac" | "bem";
  year?: number;
  filiere?: string;
  subject_slug?: string;
  file_url?: string;
  official?: boolean;
}

const VALID_EXAM_TYPES = ["bac", "bem"] as const;

function clean(b: Body) {
  const exam_type = b.exam_type ?? "bac";
  if (!VALID_EXAM_TYPES.includes(exam_type as never)) return { error: "exam_type invalide" } as const;
  const year = Math.max(1990, Math.min(2100, Number(b.year ?? new Date().getFullYear())));
  const filiere = (b.filiere ?? "").trim().slice(0, 100);
  const subject_slug = (b.subject_slug ?? "").trim().slice(0, 100).toLowerCase();
  const file_url = (b.file_url ?? "").trim().slice(0, 1000);
  const official = !!b.official;
  if (!subject_slug) return { error: "subject_slug requis" } as const;
  return {
    row: {
      exam_type,
      year,
      filiere: filiere || null,
      subject_slug,
      file_url: file_url || null,
      official,
    },
  } as const;
}

export async function GET() {
  const gate = await requireAdminApi();
  if ("response" in gate) return gate.response;
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("exam_papers")
    .select("id, exam_type, year, filiere, subject_slug, file_url, official, solution_verified_by_admin, created_at")
    .order("year", { ascending: false })
    .order("exam_type");
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
    .from("exam_papers")
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
    .from("exam_papers")
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
  const { error } = await admin.from("exam_papers").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
