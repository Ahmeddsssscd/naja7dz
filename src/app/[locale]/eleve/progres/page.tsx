import { redirect } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import { StudentShell } from "@/components/app/StudentShell";
import { Link } from "@/i18n/routing";

export const metadata = { title: "Mes progrès" };

/**
 * Real progress dashboard for the student.
 *
 * Reads the `quizzes` table (one row per completed quiz, now carrying
 * chapter_id) and aggregates:
 *   - top KPIs: quizzes done, average score, XP (10 XP per correct answer)
 *   - a mini trend of the last 10 quiz scores
 *   - per-subject bars: chapters practised / total, average score
 */
export default async function ProgressPage() {
  const t = await getTranslations("EleveProgres");
  const locale = await getLocale();
  const isAr = locale === "ar";
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: child } = await supabase
    .from("children").select("id, full_name, grade").eq("parent_id", user.id).order("created_at").limit(1).maybeSingle();

  const admin = createAdminClient();

  // All completed quizzes for this child, newest first.
  const { data: quizzes } = child?.id
    ? await admin
        .from("quizzes")
        .select("id, chapter_id, score_pct, total_questions, correct_count, completed_at")
        .eq("child_id", child.id)
        .not("completed_at", "is", null)
        .order("completed_at", { ascending: false })
        .limit(200)
    : { data: [] as never[] };

  const rows = quizzes ?? [];
  const quizCount = rows.length;
  const totalCorrect = rows.reduce((a, q) => a + (q.correct_count ?? 0), 0);
  const avgScore = quizCount
    ? Math.round(rows.reduce((a, q) => a + (Number(q.score_pct) || 0), 0) / quizCount)
    : null;
  const xp = totalCorrect * 10;

  // Last 10 scores for the trend, oldest → newest (reverse the newest-first list).
  const trend = rows.slice(0, 10).map((q) => Number(q.score_pct) || 0).reverse();

  // Per-subject aggregation. Map chapter_id → subject via the catalog.
  const chapterIds = [...new Set(rows.map((q) => q.chapter_id).filter(Boolean))] as string[];
  const perSubject: {
    name: string;
    chaptersPractised: number;
    chaptersTotal: number;
    avg: number;
  }[] = [];

  if (child?.grade) {
    const { data: subjects } = await admin
      .from("subjects")
      .select("id, name_fr, name_ar")
      .eq("grade_code", child.grade)
      .order("sort_order");

    const { data: chapters } = await admin
      .from("chapters")
      .select("id, subject_id")
      .in("subject_id", (subjects ?? []).map((s) => s.id));

    const chapterToSubject = new Map<string, string>();
    const totalBySubject = new Map<string, number>();
    for (const c of chapters ?? []) {
      chapterToSubject.set(c.id, c.subject_id);
      totalBySubject.set(c.subject_id, (totalBySubject.get(c.subject_id) ?? 0) + 1);
    }

    // Group quiz rows by subject.
    const scoresBySubject = new Map<string, number[]>();
    const practisedChaptersBySubject = new Map<string, Set<string>>();
    for (const q of rows) {
      if (!q.chapter_id) continue;
      const sid = chapterToSubject.get(q.chapter_id);
      if (!sid) continue;
      if (!scoresBySubject.has(sid)) scoresBySubject.set(sid, []);
      scoresBySubject.get(sid)!.push(Number(q.score_pct) || 0);
      if (!practisedChaptersBySubject.has(sid)) practisedChaptersBySubject.set(sid, new Set());
      practisedChaptersBySubject.get(sid)!.add(q.chapter_id);
    }

    for (const s of subjects ?? []) {
      const scores = scoresBySubject.get(s.id);
      if (!scores || scores.length === 0) continue; // only show subjects touched
      perSubject.push({
        name: (isAr && s.name_ar) || s.name_fr,
        chaptersPractised: practisedChaptersBySubject.get(s.id)?.size ?? 0,
        chaptersTotal: totalBySubject.get(s.id) ?? 0,
        avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      });
    }
    perSubject.sort((a, b) => b.avg - a.avg);
  }

  void chapterIds;

  return (
    <StudentShell active="progress" childName={child?.full_name} childGrade={child?.grade}>
      <h1 className="text-2xl font-bold text-fg mb-6">{t("page_title")}</h1>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Kpi value={String(quizCount)} label={t("kpi_quizzes")} />
        <Kpi value={avgScore === null ? "—" : `${avgScore}%`} label={t("kpi_avg")} />
        <Kpi value={String(xp)} label={t("kpi_xp")} />
      </div>

      {quizCount === 0 ? (
        <div className="bg-surface border border-line rounded-card p-8 text-center">
          <div className="text-4xl mb-3">📊</div>
          <p className="text-fg-soft text-sm mb-5">
            {isAr
              ? "لم تُنجز أي اختبار بعد. ابدأ اختبارًا لترى تقدّمك هنا!"
              : "Tu n'as pas encore fait de quiz. Lance un quiz pour voir tes progrès ici !"}
          </p>
          <Link href="/eleve/matieres" className="btn btn-primary">
            {isAr ? "ابدأ اختبارًا" : "Commencer un quiz"}
          </Link>
        </div>
      ) : (
        <>
          {/* Trend */}
          <div className="bg-surface border border-line rounded-card p-6 mb-6">
            <h2 className="font-semibold text-fg mb-4">
              {isAr ? "آخر النتائج" : "Tes derniers scores"}
            </h2>
            <div className="h-36 flex items-end justify-around gap-1.5">
              {trend.map((score, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                  <span className="text-[10px] text-fg-faint mb-1">{score}%</span>
                  <div
                    className={`w-full rounded-t transition-all ${
                      score >= 80 ? "bg-emerald-500" : score >= 50 ? "bg-gold" : "bg-red-400"
                    }`}
                    style={{ height: `${Math.max(6, score)}%` }}
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-fg-faint text-center mt-3">
              {isAr ? "من الأقدم إلى الأحدث" : "Du plus ancien au plus récent"}
            </p>
          </div>

          {/* Per-subject */}
          {perSubject.length > 0 && (
            <div className="bg-surface border border-line rounded-card p-6">
              <h2 className="font-semibold text-fg mb-4">
                {isAr ? "حسب المادة" : "Par matière"}
              </h2>
              <div className="space-y-4">
                {perSubject.map((s) => (
                  <div key={s.name}>
                    <div className="flex justify-between items-baseline mb-1.5">
                      <span className="text-sm font-medium text-fg">{s.name}</span>
                      <span className="text-xs text-fg-soft">
                        {s.chaptersPractised}/{s.chaptersTotal} {isAr ? "فصل" : "chapitres"} ·{" "}
                        <span className={`font-bold ${s.avg >= 50 ? "text-emerald-600" : "text-red-500"}`}>
                          {s.avg}%
                        </span>
                      </span>
                    </div>
                    <div className="h-2.5 bg-surface-3 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          s.avg >= 80 ? "bg-emerald-500" : s.avg >= 50 ? "bg-gold" : "bg-red-400"
                        }`}
                        style={{ width: `${Math.max(4, s.avg)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </StudentShell>
  );
}

function Kpi({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-surface border border-line rounded-card p-4 text-center">
      <div className="text-2xl font-bold text-fg tabular-nums">{value}</div>
      <div className="text-xs text-fg-soft mt-1">{label}</div>
    </div>
  );
}
