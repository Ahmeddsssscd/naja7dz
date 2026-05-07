/**
 * Admin CRUD for `quiz_questions` (the question bank).
 *
 * GET    /api/admin/quiz-questions                       → all (with chapter info)
 * GET    /api/admin/quiz-questions?chapter_id=<uuid>     → filter
 * POST   /api/admin/quiz-questions                       → create
 * PATCH  /api/admin/quiz-questions?id=<uuid>             → update
 * DELETE /api/admin/quiz-questions?id=<uuid>             → delete
 */
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdminApi } from "@/lib/admin-auth";

interface Body {
  chapter_id?: string;
  prompt_fr?: string;
  prompt_ar?: string;
  options_fr?: string[] | string; // accept JSON string or array
  options_ar?: string[] | string | null;
  correct_index?: number;
  explanation_fr?: string;
  explanation_ar?: string;
  difficulty?: "easy" | "medium" | "hard";
  active?: boolean;
  sort_order?: number;
}

const VALID_DIFF = ["easy", "medium", "hard"] as const;

function clean(b: Body, requireChapter: boolean) {
  const chapter_id = (b.chapter_id ?? "").trim();
  const prompt_fr = (b.prompt_fr ?? "").trim().slice(0, 1000);
  const prompt_ar = (b.prompt_ar ?? "").trim().slice(0, 1000);
  const explanation_fr = (b.explanation_fr ?? "").trim().slice(0, 2000);
  const explanation_ar = (b.explanation_ar ?? "").trim().slice(0, 2000);

  const opts = typeof b.options_fr === "string" ? safeParseList(b.options_fr) : b.options_fr;
  const optsAr = typeof b.options_ar === "string" ? safeParseList(b.options_ar) : (b.options_ar ?? null);

  const difficulty = VALID_DIFF.includes(b.difficulty as never) ? b.difficulty! : "medium";
  const correct_index = Number(b.correct_index ?? 0);
  const active = b.active !== false;
  const sort_order = Number.isFinite(b.sort_order) ? Number(b.sort_order) : 0;

  if (requireChapter && !chapter_id) return { error: "chapter_id requis" } as const;
  if (!prompt_fr) return { error: "Énoncé (FR) requis" } as const;
  if (!Array.isArray(opts) || opts.length < 2) return { error: "Au moins 2 options" } as const;
  if (opts.length > 6) return { error: "Maximum 6 options" } as const;
  if (correct_index < 0 || correct_index >= opts.length)
    return { error: "Index de la bonne réponse hors limites" } as const;
  if (optsAr && Array.isArray(optsAr) && optsAr.length !== opts.length)
    return { error: "Les options AR doivent avoir le même nombre que FR" } as const;

  return {
    row: {
      ...(requireChapter && { chapter_id }),
      prompt_fr,
      prompt_ar: prompt_ar || null,
      options_fr: opts,
      options_ar: optsAr && Array.isArray(optsAr) && optsAr.length ? optsAr : null,
      correct_index,
      explanation_fr: explanation_fr || null,
      explanation_ar: explanation_ar || null,
      difficulty,
      active,
      sort_order,
    },
  } as const;
}

function safeParseList(s: string): string[] | null {
  // Accept either JSON array literal or one-per-line.
  const trimmed = s.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("[")) {
    try {
      const v = JSON.parse(trimmed);
      return Array.isArray(v) ? v.map(String) : null;
    } catch { return null; }
  }
  return trimmed.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
}

export async function GET(req: Request) {
  const gate = await requireAdminApi();
  if ("response" in gate) return gate.response;

  const url = new URL(req.url);
  const chapterId = url.searchParams.get("chapter_id");

  const admin = createAdminClient();
  let q = admin
    .from("quiz_questions")
    .select(
      "id, chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, " +
      "explanation_fr, explanation_ar, difficulty, active, sort_order, " +
      "chapters(title_fr, subjects(name_fr, grade_code))",
    )
    .order("sort_order");
  if (chapterId) q = q.eq("chapter_id", chapterId);

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
    .from("quiz_questions")
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
  const cleaned = clean(body, false);
  if ("error" in cleaned) return NextResponse.json({ error: cleaned.error }, { status: 400 });
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("quiz_questions")
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
  const { error } = await admin.from("quiz_questions").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
