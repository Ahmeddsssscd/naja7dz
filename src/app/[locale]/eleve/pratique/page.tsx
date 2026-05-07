/**
 * /eleve/pratique — the one-stop "Practice" hub.
 *
 * Lists every chapter that has a usable question bank, grouped by subject.
 * Sources content for the active child's grade first; if that grade has zero
 * ready chapters, falls back to the closest neighboring grades so the kid
 * always has something to practice (instead of a dead "À venir" page).
 */
import { redirect } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import { StudentShell } from "@/components/app/StudentShell";
import { Link } from "@/i18n/routing";
import { getActiveSubscription, hasAccessForGrade } from "@/lib/subscriptions";

export const metadata = { title: "Pratique" };

// Order of grades along the schooling path. Used for "nearest grade with
// content" fallback when the child's own grade has no quiz-ready chapters.
const GRADE_ORDER = [
  "1AP", "2AP", "3AP", "4AP", "5AP",
  "1AM", "2AM", "3AM", "4AM",
  "1AS", "2AS", "3AS",
];

function nearestGrades(target: string, available: Set<string>): string[] {
  const idx = GRADE_ORDER.indexOf(target);
  if (idx === -1) return [...available];
  const result: string[] = [];
  for (let d = 1; d < GRADE_ORDER.length; d++) {
    const before = GRADE_ORDER[idx - d];
    const after = GRADE_ORDER[idx + d];
    if (before && available.has(before) && !result.includes(before)) result.push(before);
    if (after && available.has(after) && !result.includes(after)) result.push(after);
    if (result.length >= 2) break;
  }
  return result;
}

interface ReadyChapter {
  id: string;
  title: string;
  subject_id: string;
  subject_name: string;
  grade_code: string;
  questionCount: number;
}

export default async function PracticeHub() {
  const t = await getTranslations("ElevePratique");
  const locale = await getLocale();
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: child } = await supabase
    .from("children")
    .select("full_name, grade")
    .eq("parent_id", user.id)
    .order("created_at")
    .limit(1)
    .maybeSingle();

  const sub = await getActiveSubscription(user.id);
  const canAccess = await hasAccessForGrade(user.id, child?.grade);
  const isAr = locale === "ar";
  const admin = createAdminClient();

  // Pull all active questions in one go and bucket per chapter.
  const { data: allQs } = await admin
    .from("quiz_questions")
    .select("chapter_id")
    .eq("active", true);
  const counts: Record<string, number> = {};
  for (const q of allQs ?? []) counts[q.chapter_id] = (counts[q.chapter_id] ?? 0) + 1;
  const readyChapterIds = Object.keys(counts).filter((id) => counts[id] >= 3);

  // Resolve those chapter IDs into rich rows (subject + grade).
  let readyChapters: ReadyChapter[] = [];
  if (readyChapterIds.length) {
    const { data: chapters } = await admin
      .from("chapters")
      .select("id, title_fr, title_ar, subject_id, sort_order, subjects(name_fr, name_ar, grade_code, sort_order)")
      .in("id", readyChapterIds)
      .order("sort_order");
    readyChapters = (chapters ?? []).map((c) => {
      const s = Array.isArray(c.subjects) ? c.subjects[0] : c.subjects;
      return {
        id: c.id,
        title: ((isAr && c.title_ar) || c.title_fr) as string,
        subject_id: c.subject_id,
        subject_name: ((isAr && s?.name_ar) || s?.name_fr) as string,
        grade_code: s?.grade_code as string,
        questionCount: counts[c.id] ?? 0,
      };
    });
  }

  // Pick chapters for the active child's grade. If empty, fall back to the
  // two nearest grades so practice is never dead.
  const availableGrades = new Set(readyChapters.map((c) => c.grade_code));
  const childGrade = child?.grade ?? null;

  let primary: ReadyChapter[] = [];
  let fallback: ReadyChapter[] = [];
  let fallbackGrades: string[] = [];

  if (childGrade && availableGrades.has(childGrade)) {
    primary = readyChapters.filter((c) => c.grade_code === childGrade);
  } else if (childGrade) {
    fallbackGrades = nearestGrades(childGrade, availableGrades);
    fallback = readyChapters.filter((c) => fallbackGrades.includes(c.grade_code));
  } else {
    // No active child grade — show everything.
    primary = readyChapters;
  }

  // Group by subject for display.
  const groupBySubject = (rows: ReadyChapter[]) => {
    const m = new Map<string, { name: string; subject_id: string; chapters: ReadyChapter[] }>();
    for (const r of rows) {
      const key = r.subject_id;
      if (!m.has(key)) m.set(key, { name: r.subject_name, subject_id: r.subject_id, chapters: [] });
      m.get(key)!.chapters.push(r);
    }
    return [...m.values()];
  };
  const primaryGrouped = groupBySubject(primary);
  const fallbackGrouped = groupBySubject(fallback);

  // Total ready chapters for the dashboard stat
  const totalReadyForChild = primary.length || fallback.length;
  const totalQuestions = (primary.length ? primary : fallback).reduce((s, c) => s + c.questionCount, 0);

  return (
    <StudentShell active="practice" childName={child?.full_name ?? undefined} childGrade={childGrade}>
      <div className="max-w-6xl">
        <div className="mb-2 flex items-baseline justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-fg">{t("page_title")}</h1>
          {childGrade && (
            <span className="text-xs md:text-sm text-fg-soft font-mono px-2 py-1 rounded-btn bg-pale-blue dark:bg-surface-3">
              {childGrade}
            </span>
          )}
        </div>
        <p className="text-fg-soft text-sm md:text-base mb-6 md:mb-8">{t("subtitle")}</p>

        {/* Desktop stats bar */}
        {totalReadyForChild > 0 && (
          <div className="hidden md:grid md:grid-cols-3 gap-4 mb-8">
            <Stat label={t("stat_chapters")} value={String(totalReadyForChild)} />
            <Stat label={t("stat_questions")} value={String(totalQuestions)} />
            <Stat label={t("stat_subjects")} value={String((primary.length ? primaryGrouped : fallbackGrouped).length)} />
          </div>
        )}

      {/* Subscription gate — info only, never blocks the page from rendering */}
      {!sub && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-300 rounded-card p-4 mb-5 text-sm">
          <div className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
            🔒 {t("locked_title")}
          </div>
          <p className="text-amber-900/80 dark:text-amber-100/80 mb-3">
            {t("locked_text")}
          </p>
          <Link href="/tarifs" className="btn btn-primary btn-sm">
            {t("view_plans")} →
          </Link>
        </div>
      )}
      {sub && !canAccess && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-300 rounded-card p-4 mb-5 text-sm">
          <div className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
            ⚠️ {t("tier_limit_title")}
          </div>
          <p className="text-amber-900/80 dark:text-amber-100/80 mb-3">
            {t("tier_limit_text")}
          </p>
          <Link href="/parent/abonnement" className="btn btn-outline btn-sm">
            {t("change_plan")}
          </Link>
        </div>
      )}

      {/* Primary content — chapters for the child's own grade */}
      {primaryGrouped.length > 0 && (
        <SubjectGroups groups={primaryGrouped} t={t} />
      )}

      {/* Fallback — the child's grade is empty, but neighboring grades aren't */}
      {primaryGrouped.length === 0 && fallbackGrouped.length > 0 && (
        <>
          <div className="bg-pale-blue/30 dark:bg-surface-3 border border-line rounded-card p-4 mb-5 text-sm">
            <div className="font-semibold text-fg mb-1">
              📚 {t("fallback_title", { grade: childGrade ?? "" })}
            </div>
            <p className="text-fg-soft">
              {t("fallback_text", { grades: fallbackGrades.join(", ") })}
            </p>
          </div>
          <SubjectGroups groups={fallbackGrouped} t={t} showGrade />
        </>
      )}

      {/* Truly nothing available — should be rare */}
      {primaryGrouped.length === 0 && fallbackGrouped.length === 0 && (
        <div className="bg-surface border border-line rounded-card p-8 text-center">
          <div className="text-4xl mb-3">📚</div>
          <h3 className="font-semibold text-fg mb-1">{t("empty_title")}</h3>
          <p className="text-fg-soft text-sm mb-4">{t("empty_text")}</p>
          <Link href="/eleve/matieres" className="btn btn-outline btn-sm">
            {t("browse_subjects")}
          </Link>
        </div>
      )}
      </div>
    </StudentShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface border border-line rounded-card p-5">
      <div className="text-xs font-semibold text-fg-soft uppercase tracking-wider mb-2">{label}</div>
      <div className="text-2xl font-bold text-fg leading-none">{value}</div>
    </div>
  );
}

function SubjectGroups({
  groups,
  t,
  showGrade = false,
}: {
  groups: { name: string; subject_id: string; chapters: ReadyChapter[] }[];
  t: (key: string, values?: Record<string, string | number>) => string;
  showGrade?: boolean;
}) {
  return (
    <div className="space-y-8">
      {groups.map((g) => (
        <section key={g.subject_id}>
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="text-base md:text-lg font-semibold text-fg">{g.name}</h2>
            <span className="text-xs text-fg-soft">
              {t("question_count", { count: g.chapters.reduce((s, c) => s + c.questionCount, 0) })}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {g.chapters.map((c) => (
              <Link
                key={c.id}
                href={`/eleve/matieres/${c.subject_id}/${c.id}` as never}
                className="bg-surface border border-line rounded-card p-4 flex items-center gap-3 hover:border-fg/40 hover:shadow-card-hover transition-all group"
              >
                <span className="w-11 h-11 rounded-[12px] bg-gold text-navy flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
                  </svg>
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-fg leading-snug line-clamp-2">{c.title}</div>
                  <div className="text-xs text-fg-soft mt-0.5">
                    {showGrade && <span className="font-mono mr-1">{c.grade_code}</span>}
                    {t("question_count", { count: c.questionCount })}
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-btn bg-pale-blue dark:bg-surface-3 text-navy dark:text-fg font-semibold whitespace-nowrap flex-shrink-0">
                  {t("start")}
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
