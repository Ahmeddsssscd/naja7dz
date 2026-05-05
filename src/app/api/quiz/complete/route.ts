import { NextResponse } from "next/server";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";

/**
 * Save a completed quiz attempt.
 * Body: { childId, subject, chapter?, score, total, durationSeconds, answers: [{question, picked, correct, isCorrect}] }
 *
 * Persists to:
 *   - quizzes (one row)
 *   - attempts (one per question)
 *   - activity_logs (one summary row)
 */
export async function POST(req: Request) {
  const auth = await createServerClient();
  const { data: { user } } = await auth.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  let body: {
    childId?: string;
    subjectSlug?: string;
    score?: number;
    total?: number;
    durationSeconds?: number;
    language?: string;
    answers?: Array<{ prompt: string; picked: number; correct: number; isCorrect: boolean }>;
  };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { childId, score = 0, total = 1, durationSeconds = 0, language = "fr" } = body;
  if (!childId) return NextResponse.json({ error: "childId required" }, { status: 400 });

  // Service role for cross-table writes
  const admin = createAdminClient();

  // Verify the child belongs to the parent
  const { data: child } = await admin
    .from("children")
    .select("id")
    .eq("id", childId)
    .eq("parent_id", user.id)
    .maybeSingle();
  if (!child) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const scorePct = total > 0 ? Math.round((score / total) * 100) : 0;

  // Insert quiz row
  const { data: quiz, error: quizErr } = await admin
    .from("quizzes")
    .insert({
      child_id: childId,
      type: "regular",
      score_pct: scorePct,
      total_questions: total,
      correct_count: score,
      language,
      started_at: new Date(Date.now() - durationSeconds * 1000).toISOString(),
      completed_at: new Date().toISOString(),
      duration_seconds: durationSeconds,
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

  return NextResponse.json({ ok: true, quizId: quiz.id, scorePct });
}
