/**
 * Mock-exam endpoint: build a timed exam from the quiz bank.
 *
 * POST /api/exam/start
 * Body: { subject?: string; count?: number; locale?: "fr" | "ar" }
 *
 * Unlike /api/quiz/start (one chapter), this pulls questions across ALL
 * chapters of the child's grade — either one subject (subject slug) or
 * every subject mixed. Returns the same question shape as the quiz player
 * plus the chapter title per question so corrections can say where each
 * question came from.
 */
import { NextResponse } from "next/server";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import { getActiveSubscription, requireSubscriptionApi } from "@/lib/subscriptions";

interface Body {
  subject?: string;
  count?: number;
  locale?: "fr" | "ar";
}

export async function POST(req: Request) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  const sub = await getActiveSubscription(user.id);
  const block = requireSubscriptionApi(sub);
  if (block) return block;

  let body: Body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const count = Math.max(5, Math.min(40, Number(body.count ?? 20)));
  const locale = body.locale === "ar" ? "ar" : "fr";
  const subjectSlug = (body.subject ?? "").trim() || null;

  const { data: child } = await supabase
    .from("children").select("grade").eq("parent_id", user.id).order("created_at").limit(1).maybeSingle();
  if (!child?.grade) {
    return NextResponse.json({ error: "Aucun profil enfant avec un niveau" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Subjects for this grade (one or all).
  let subjectQuery = admin.from("subjects").select("id, name_fr, name_ar").eq("grade_code", child.grade);
  if (subjectSlug) subjectQuery = subjectQuery.eq("slug", subjectSlug);
  const { data: subjects } = await subjectQuery;
  if (!subjects?.length) {
    return NextResponse.json({ error: "Matière introuvable pour ce niveau" }, { status: 404 });
  }

  const { data: chapters } = await admin
    .from("chapters")
    .select("id, title_fr, title_ar")
    .in("subject_id", subjects.map((s) => s.id));
  if (!chapters?.length) {
    return NextResponse.json({ error: "Aucun chapitre pour ce niveau" }, { status: 404 });
  }
  const chapterTitle: Record<string, { fr: string; ar: string | null }> = {};
  for (const c of chapters) chapterTitle[c.id] = { fr: c.title_fr, ar: c.title_ar };

  const { data: pool, error } = await admin
    .from("quiz_questions")
    .select("id, chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar")
    .in("chapter_id", chapters.map((c) => c.id))
    .eq("active", true)
    .limit(400);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!pool?.length) {
    return NextResponse.json({ error: "Aucune question disponible pour cet examen" }, { status: 404 });
  }

  // Fisher-Yates, then take `count`.
  const shuffled = pool.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const isAr = locale === "ar";
  const questions = shuffled.slice(0, count).map((qq) => ({
    id: qq.id,
    prompt: (isAr && qq.prompt_ar) || qq.prompt_fr,
    options:
      isAr && qq.options_ar && (qq.options_ar as string[]).length === (qq.options_fr as string[]).length
        ? qq.options_ar
        : qq.options_fr,
    correctIndex: qq.correct_index,
    explanation: (isAr && qq.explanation_ar) || qq.explanation_fr || "",
    chapter: (isAr && chapterTitle[qq.chapter_id]?.ar) || chapterTitle[qq.chapter_id]?.fr || "",
  }));

  return NextResponse.json({
    questions,
    grade: child.grade,
    available: pool.length,
  });
}
