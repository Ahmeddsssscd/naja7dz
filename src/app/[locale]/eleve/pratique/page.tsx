/**
 * /eleve/pratique — the unified Practice hub.
 *
 * Sections:
 *   1. 🎯 Quiz       — chapter quizzes by subject
 *   2. 📝 Activités  — calligraphie, rédaction, dictée, lecture, adab
 *   3. 🎮 Jeux        — kids-universe games (sudoku, mémoire, motifs, énigme,
 *                       coloriage, number ninja, souk, heure, wilayas)
 *   4. 🎓 Examens    — Bac archive, examen blanc, countdown (3AS/4AM only)
 *
 * For 2AP/younger kids the games section is the most fun-friendly one, so
 * it's prominently shown. For 3AS/Bac students, the Examens section sits at
 * the top.
 */
import { redirect } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import { StudentShell } from "@/components/app/StudentShell";
import { Link } from "@/i18n/routing";
import { requireAccessForGrade } from "@/lib/subscriptions";

export const metadata = { title: "Pratique" };

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

// Bac/BEM-relevant grades for the Examens section.
const BAC_GRADES = new Set(["3AS", "4AM"]);

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
    .select("full_name, grade, age")
    .eq("parent_id", user.id)
    .order("created_at")
    .limit(1)
    .maybeSingle();

  // Hard paywall — non-subscribers and tier-mismatch are redirected to the
  // abonnement page instead of seeing the practice hub with a banner.
  const sub = await requireAccessForGrade(user.id, child?.grade);
  const canAccess = true; // requireAccessForGrade redirected if false
  const isAr = locale === "ar";
  const admin = createAdminClient();
  const childGrade = child?.grade ?? null;
  const childAge = child?.age ?? null;
  // Below 11 = primary kid → games up top; 12+ = older student → quizzes up top.
  const isYoungKid = (childAge !== null && childAge <= 11) ||
    (childGrade !== null && childGrade.endsWith("AP"));
  const isBacStudent = childGrade !== null && BAC_GRADES.has(childGrade);

  // ---- Quiz section data --------------------------------------------------
  const { data: allQs } = await admin
    .from("quiz_questions")
    .select("chapter_id")
    .eq("active", true);
  const counts: Record<string, number> = {};
  for (const q of allQs ?? []) counts[q.chapter_id] = (counts[q.chapter_id] ?? 0) + 1;
  const readyChapterIds = Object.keys(counts).filter((id) => counts[id] >= 3);

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
  const availableGrades = new Set(readyChapters.map((c) => c.grade_code));
  let primary: ReadyChapter[] = [];
  let fallback: ReadyChapter[] = [];
  let fallbackGrades: string[] = [];
  if (childGrade && availableGrades.has(childGrade)) {
    primary = readyChapters.filter((c) => c.grade_code === childGrade);
  } else if (childGrade) {
    fallbackGrades = nearestGrades(childGrade, availableGrades);
    fallback = readyChapters.filter((c) => fallbackGrades.includes(c.grade_code));
  } else {
    primary = readyChapters;
  }
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
  const showSection = primaryGrouped.length > 0 || fallbackGrouped.length > 0;

  // ---- Sections ordered by audience --------------------------------------
  const QuizSection = () => (
    <Section
      icon="🎯"
      title={t("section_quiz_title")}
      subtitle={t("section_quiz_subtitle")}
      stat={primary.length || fallback.length}
      statLabel={t("stat_chapters")}
    >
      {primaryGrouped.length > 0 && <SubjectGroups groups={primaryGrouped} t={t} />}
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
      {!showSection && (
        <div className="bg-surface border border-line rounded-card p-6 text-center">
          <div className="text-3xl mb-2">📚</div>
          <p className="text-fg-soft text-sm">{t("empty_text")}</p>
        </div>
      )}
    </Section>
  );

  const ActivitiesSection = () => (
    <Section icon="📝" title={t("section_activities_title")} subtitle={t("section_activities_subtitle")}>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        <ActivityTile
          href="/eleve/redaction"
          emoji="✍️"
          title={t("act_redaction_title")}
          subtitle={t("act_redaction_sub")}
          color="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900"
        />
        <ActivityTile
          href="/eleve/calligraphie"
          emoji="🎨"
          title={t("act_calligraphie_title")}
          subtitle={t("act_calligraphie_sub")}
          color="bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900"
        />
        <ActivityTile
          href="/petits/lecture"
          emoji="📖"
          title={t("act_lecture_title")}
          subtitle={t("act_lecture_sub")}
          color="bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900"
        />
        <ActivityTile
          href="/petits/quran"
          emoji="📿"
          title={t("act_quran_title")}
          subtitle={t("act_quran_sub")}
          color="bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900"
        />
        <ActivityTile
          href="/petits/monde-reel/adab"
          emoji="🤲"
          title={t("act_adab_title")}
          subtitle={t("act_adab_sub")}
          color="bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-900"
        />
      </div>
    </Section>
  );

  const GamesSection = () => (
    <Section icon="🎮" title={t("section_games_title")} subtitle={t("section_games_subtitle")}>
      {/* Organized into 4 themed sub-groups so the ~13 games don't look like
          a wall of identical tiles. */}
      <div className="space-y-6">
        {/* Math + numbers */}
        <SubGroup label={t("games_group_math")}>
          <ActivityTile href="/petits/maths/number-ninja" emoji="🥷" title={t("game_ninja")} color="bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900" compact />
          <ActivityTile href="/petits/maths/souk" emoji="🛒" title={t("game_souk")} color="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900" compact />
          <ActivityTile href="/petits/jeux-malins/course-maths" emoji="🏁" title={t("game_mathrace")} color="bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-900" compact />
          <ActivityTile href="/petits/jeux-malins/pieces" emoji="🪙" title={t("game_coins")} color="bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900" compact />
        </SubGroup>

        {/* Logic + reasoning */}
        <SubGroup label={t("games_group_logic")}>
          <ActivityTile href="/petits/jeux-malins/sudoku" emoji="🧩" title={t("game_sudoku")} color="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900" compact />
          <ActivityTile href="/petits/jeux-malins/memoire" emoji="🧠" title={t("game_memory")} color="bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900" compact />
          <ActivityTile href="/petits/jeux-malins/motifs" emoji="🔷" title={t("game_pattern")} color="bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900" compact />
          <ActivityTile href="/petits/jeux-malins/enigme" emoji="🤔" title={t("game_riddle")} color="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900" compact />
          <ActivityTile href="/petits/jeux-malins/morpion" emoji="❌" title={t("game_tictactoe")} color="bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900" compact />
        </SubGroup>

        {/* Letters + words */}
        <SubGroup label={t("games_group_words")}>
          <ActivityTile href="/petits/jeux-malins/mots-caches" emoji="🔍" title={t("game_wordsearch")} color="bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-900" compact />
          <ActivityTile href="/petits/jeux-malins/pendu" emoji="🪢" title={t("game_hangman")} color="bg-stone-50 dark:bg-stone-900/40 border-stone-200 dark:border-stone-700" compact />
        </SubGroup>

        {/* Real-world + creativity */}
        <SubGroup label={t("games_group_world")}>
          <ActivityTile href="/petits/coloriage" emoji="🎨" title={t("game_coloriage")} color="bg-pink-50 dark:bg-pink-950/30 border-pink-200 dark:border-pink-900" compact />
          <ActivityTile href="/petits/monde-reel/heure" emoji="⏰" title={t("game_clock")} color="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900" compact />
          <ActivityTile href="/petits/monde-reel/wilayas" emoji="🇩🇿" title={t("game_wilayas")} color="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900" compact />
        </SubGroup>
      </div>
    </Section>
  );

  const ExamsSection = () => (
    <Section icon="🎓" title={t("section_exams_title")} subtitle={t("section_exams_subtitle")}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <ActivityTile
          href="/eleve/bac"
          emoji="📄"
          title={t("exam_archive_title")}
          subtitle={t("exam_archive_sub")}
          color="bg-navy/5 dark:bg-navy/20 border-navy/20"
        />
        <ActivityTile
          href="/eleve/bac/examen"
          emoji="⏱️"
          title={t("exam_mock_title")}
          subtitle={t("exam_mock_sub")}
          color="bg-gold/10 dark:bg-gold/15 border-gold/40"
        />
        <ActivityTile
          href="/eleve/bac/countdown"
          emoji="📅"
          title={t("exam_countdown_title")}
          subtitle={t("exam_countdown_sub")}
          color="bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900"
        />
      </div>
    </Section>
  );

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
        <p className="text-fg-soft text-sm md:text-base mb-6 md:mb-8">{t("subtitle_unified")}</p>

        {/* Subscription gate — info only, never blocks the page from rendering */}
        {!sub && (
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-300 rounded-card p-4 mb-6 text-sm">
            <div className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
              🔒 {t("locked_title")}
            </div>
            <p className="text-amber-900/80 dark:text-amber-100/80 mb-3">{t("locked_text")}</p>
            <Link href="/tarifs" className="btn btn-primary btn-sm">{t("view_plans")} →</Link>
          </div>
        )}
        {sub && !canAccess && (
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-300 rounded-card p-4 mb-6 text-sm">
            <div className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
              ⚠️ {t("tier_limit_title")}
            </div>
            <p className="text-amber-900/80 dark:text-amber-100/80 mb-3">{t("tier_limit_text")}</p>
            <Link href="/parent/abonnement" className="btn btn-outline btn-sm">{t("change_plan")}</Link>
          </div>
        )}

        {/* Section order changes by audience: Bac students see exams first;
            young kids see games first; everyone else sees quizzes first. */}
        <div className="space-y-10">
          {isBacStudent && <ExamsSection />}
          {isYoungKid && <GamesSection />}
          <QuizSection />
          {!isYoungKid && <GamesSection />}
          <ActivitiesSection />
          {!isBacStudent && childGrade && <ExamsSection />}
        </div>
      </div>
    </StudentShell>
  );
}

/* ============================================================ */
/* Sub-components                                               */
/* ============================================================ */

function Section({
  icon, title, subtitle, stat, statLabel, children,
}: {
  icon: string;
  title: string;
  subtitle?: string;
  stat?: number;
  statLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-baseline justify-between mb-3 md:mb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-fg flex items-center gap-2">
            <span className="text-2xl">{icon}</span>
            {title}
          </h2>
          {subtitle && <p className="text-fg-soft text-sm mt-1">{subtitle}</p>}
        </div>
        {stat !== undefined && stat > 0 && (
          <span className="text-xs text-fg-soft whitespace-nowrap">
            {stat} {statLabel}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}

function SubGroup({ label, children }: { label: string; children: React.ReactNode }) {
  // A sub-grouping header inside a Section. Used to break the games list
  // into themed clusters (Math / Logic / Words / World) instead of a flat
  // grid of 13 identical tiles.
  return (
    <div>
      <div className="text-xs font-semibold text-fg-soft uppercase tracking-wider mb-2 ms-1">
        {label}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
        {children}
      </div>
    </div>
  );
}

function ActivityTile({
  href, emoji, title, subtitle, color, compact = false,
}: {
  href: string;
  emoji: string;
  title: string;
  subtitle?: string;
  color: string;
  compact?: boolean;
}) {
  return (
    <Link
      href={href as never}
      className={`${color} border rounded-card p-4 ${compact ? "" : "md:p-5"} flex flex-col justify-between hover:shadow-card-hover hover:-translate-y-0.5 transition-all min-h-[110px] active:scale-[0.98]`}
    >
      <div className={compact ? "text-3xl" : "text-4xl mb-2"}>{emoji}</div>
      <div>
        <div className={`font-bold text-fg leading-tight ${compact ? "text-sm" : "text-base"}`}>{title}</div>
        {!compact && subtitle && (
          <div className="text-xs text-fg-soft mt-1">{subtitle}</div>
        )}
      </div>
    </Link>
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
    <div className="space-y-6">
      {groups.map((g) => (
        <section key={g.subject_id}>
          <div className="flex items-baseline justify-between mb-2">
            <h3 className="text-sm md:text-base font-semibold text-fg">{g.name}</h3>
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
