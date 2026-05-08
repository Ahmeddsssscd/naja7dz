/**
 * Save a completed quiz attempt with server-side scoring.
 *
 * Body: {
 *   childId: string,
 *   picks: [{ questionId: string, chosenIndex: number }, ...],
 *   durationSeconds: number,
 *   language?: "fr" | "ar"
 * }
 *
 * The server looks up `correct_index` per question and computes the score
 * itself — the client cannot inflate stats by sending an arbitrary
 * `score`/`total`. Subscription is verified before any DB write.
 */
import { NextResponse } from "next/server";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import { getActiveSubscription, requireSubscriptionApi } from "@/lib/subscriptions";

interface Pick {
  questionId: string;
  chosenIndex: number;
}

interface Body {
  childId?: string;
  picks?: Pick[];
  durationSeconds?: number;
  language?: string;
  // Legacy fields ignored — kept for clean error messages on stale clients.
  score?: number;
  total?: number;
}

export async function POST(req: Request) {
  const auth = await createServerClient();
  const { data: { user } } = await auth.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  // Subscription required before persisting any stats.
  const sub = await getActiveSubscription(user.id);
  const block = requireSubscriptionApi(sub);
  if (block) return block;

  let body: Body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { childId, picks, durationSeconds = 0, language = "fr" } = body;
  if (!childId) return NextResponse.json({ error: "childId required" }, { status: 400 });
  if (!Array.isArray(picks) || picks.length === 0) {
    return NextResponse.json({ error: "picks array required" }, { status: 400 });
  }
  if (picks.length > 50) {
    return NextResponse.json({ error: "too many picks" }, { status: 400 });
  }
  // Sanitize each pick — coerce to expected shape, reject anything weird.
  const cleanPicks: Pick[] = [];
  for (const p of picks) {
    if (!p || typeof p.questionId !== "string" || p.questionId.length > 64) continue;
    const idx = Number(p.chosenIndex);
    if (!Number.isInteger(idx) || idx < 0 || idx > 10) continue;
    cleanPicks.push({ questionId: p.questionId, chosenIndex: idx });
  }
  if (cleanPicks.length === 0) {
    return NextResponse.json({ error: "no valid picks" }, { status: 400 });
  }

  // Service role for cross-table writes
  const admin = createAdminClient();

  // Verify the child belongs to the parent (IDOR protection)
  const { data: child } = await admin
    .from("children")
    .select("id, grade")
    .eq("id", childId)
    .eq("parent_id", user.id)
    .maybeSingle();
  if (!child) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // Tier check — bac_only tier should only score 3AS / 4AM content. We don't
  // know the chapter's grade here without a join, so we trust the page-level
  // requireAccessForGrade gate. But the duration sanity check guards against
  // bot-style spam.
  if (sub && sub.tier === "bac_only" && child.grade && child.grade !== "3AS" && child.grade !== "4AM") {
    return NextResponse.json({ error: "tier does not cover this grade" }, { status: 403 });
  }

  // Pull the canonical correct answers for the picked questions.
  const ids = cleanPicks.map((p) => p.questionId);
  const { data: questions, error: qErr } = await admin
    .from("quiz_questions")
    .select("id, correct_index, active")
    .in("id", ids);
  if (qErr) {
    console.error("[quiz/complete] question lookup failed", qErr);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
  const correctById = new Map<string, number>();
  for (const q of questions ?? []) {
    if (q.active) correctById.set(q.id, q.correct_index);
  }

  // Server-side score: count picks where chosen_index === correct_index.
  let score = 0;
  let total = 0;
  for (const p of cleanPicks) {
    const correct = correctById.get(p.questionId);
    if (correct === undefined) continue; // unknown / inactive question — skip
    total++;
    if (p.chosenIndex === correct) score++;
  }
  if (total === 0) {
    return NextResponse.json({ error: "no scorable questions" }, { status: 400 });
  }
  const scorePct = Math.round((score / total) * 100);

  // Insert quiz row
  const safeDuration = Math.max(0, Math.min(60 * 60, Math.round(Number(durationSeconds) || 0)));
  const { data: quiz, error: quizErr } = await admin
    .from("quizzes")
    .insert({
      child_id: childId,
      type: "regular",
      score_pct: scorePct,
      total_questions: total,
      correct_count: score,
      language,
      started_at: new Date(Date.now() - safeDuration * 1000).toISOString(),
      completed_at: new Date().toISOString(),
      duration_seconds: safeDuration,
    })
    .select("id")
    .single();
  if (quizErr || !quiz) {
    console.error("[quiz/complete] quiz insert failed", quizErr);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  // Activity log entry
  await admin.from("activity_logs").insert({
    child_id: childId,
    activity_type: "quiz_completed",
    metadata_json: { quiz_id: quiz.id, score_pct: scorePct, total },
    occurred_at: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true, quizId: quiz.id, scorePct, score, total });
}
