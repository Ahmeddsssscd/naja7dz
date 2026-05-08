/**
 * Student endpoint: build a fresh quiz from the question bank.
 *
 * POST /api/quiz/start
 * Body: { chapter_id?: string, child_id?: string, count?: number, difficulty?: string }
 *
 * Returns: { questions: [{id, prompt, options, correctIndex, explanation}, ...] }
 *
 * Strategy: pull `count` (default 5, max 20) random active questions from the
 * given chapter at the requested difficulty (medium by default). Localized
 * fields are returned in the user's locale (defaults to fr).
 */
import { NextResponse } from "next/server";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import { getActiveSubscription, requireSubscriptionApi } from "@/lib/subscriptions";

interface Body {
  chapter_id?: string;
  child_id?: string;
  count?: number;
  difficulty?: "easy" | "medium" | "hard";
  locale?: "fr" | "ar";
}

const VALID_DIFF = new Set(["easy", "medium", "hard"]);

export async function POST(req: Request) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  // Subscription required — page-level paywall is also enforced but a direct
  // API hit by a non-paying user must also be blocked.
  const sub = await getActiveSubscription(user.id);
  const block = requireSubscriptionApi(sub);
  if (block) return block;

  let body: Body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const chapter_id = (body.chapter_id ?? "").trim();
  const count = Math.max(3, Math.min(20, Number(body.count ?? 5)));
  const difficulty = VALID_DIFF.has(body.difficulty ?? "") ? body.difficulty! : null;
  const locale = body.locale === "ar" ? "ar" : "fr";

  if (!chapter_id) return NextResponse.json({ error: "chapter_id requis" }, { status: 400 });

  const admin = createAdminClient();

  // Pull a generous pool then shuffle in-memory (PostgREST doesn't support
  // ORDER BY random() without a function and we don't need server-side
  // randomness for a simple kid quiz).
  let q = admin
    .from("quiz_questions")
    .select("id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, explanation_fr, explanation_ar, difficulty")
    .eq("chapter_id", chapter_id)
    .eq("active", true)
    .limit(50);
  if (difficulty) q = q.eq("difficulty", difficulty);

  const { data: pool, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!pool?.length) return NextResponse.json({ error: "Aucune question disponible pour ce chapitre" }, { status: 404 });

  // Fisher-Yates shuffle the pool, take `count`.
  const shuffled = pool.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const selected = shuffled.slice(0, count);

  // Project to player shape, picking locale-appropriate fields with FR fallback.
  const questions = selected.map((qq) => {
    const isAr = locale === "ar";
    const promptArr = isAr && qq.options_ar && qq.options_ar.length === qq.options_fr.length
      ? qq.options_ar
      : qq.options_fr;
    return {
      id: qq.id,
      prompt: (isAr && qq.prompt_ar) || qq.prompt_fr,
      options: promptArr,
      correctIndex: qq.correct_index,
      explanation: (isAr && qq.explanation_ar) || qq.explanation_fr || "",
    };
  });

  return NextResponse.json({ questions });
}
