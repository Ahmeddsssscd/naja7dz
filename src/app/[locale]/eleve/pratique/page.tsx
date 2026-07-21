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

  // Audience determines BOTH section ordering and which game/activity tiles
  // are shown. The previous logic was binary (kid vs not-kid) so a 1AP kid
  // still saw a Bac Examens block at the bottom — we now hide it entirely.
  type Audience = "primary" | "middle" | "high_school_other" | "bac";
  let audience: Audience;
  if (childGrade && childGrade.endsWith("AS") && BAC_GRADES.has(childGrade)) {
    audience = "bac"; // 3AS only (the actual Bac year)
  } else if (childGrade && childGrade === "4AM") {
    audience = "bac"; // BEM final year — also gets exam content
  } else if (childGrade && childGrade.endsWith("AS")) {
    audience = "high_school_other"; // 1AS, 2AS — high school but no Bac yet
  } else if (childGrade && childGrade.endsWith("AM")) {
    audience = "middle"; // 1AM, 2AM, 3AM
  } else {
    audience = "primary"; // 1AP - 5AP and anything we don't recognize
  }

  // Coarse age buckets (used to filter the games section to age-appropriate
  // tiles — a 5 yr old shouldn't see "Mots cachés" with 8-letter FR words).
  const isUnder8 = childGrade === "1AP" || childGrade === "2AP";

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
              {t("fallback_title", { grade: childGrade ?? "" })}
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
          <p className="text-fg-soft text-sm">{t("empty_text")}</p>
        </div>
      )}
    </Section>
  );

  // Activity catalog filtered by audience.
  // - Rédaction + Calligraphie : middle / high school / Bac
  // - Lis avec moi : primary + middle (kid-style stories)
  // - Quran : everyone (universal)
  // - Adab (bonnes manières) : primary only
  const allActivities: Array<{
    href: string; emoji: string; title: string; subtitle: string; color: string;
    audiences: Audience[];
  }> = [
    { href: "/eleve/redaction", emoji: "✍️", title: t("act_redaction_title"), subtitle: t("act_redaction_sub"), color: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900", audiences: ["middle", "high_school_other", "bac"] },
    { href: "/eleve/calligraphie", emoji: "🎨", title: t("act_calligraphie_title"), subtitle: t("act_calligraphie_sub"), color: "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900", audiences: ["primary", "middle", "high_school_other", "bac"] },
    { href: "/petits/lecture", emoji: "📖", title: t("act_lecture_title"), subtitle: t("act_lecture_sub"), color: "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900", audiences: ["primary", "middle"] },
    { href: "/petits/quran", emoji: "📿", title: t("act_quran_title"), subtitle: t("act_quran_sub"), color: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900", audiences: ["primary", "middle", "high_school_other", "bac"] },
    { href: "/petits/monde-reel/adab", emoji: "🤲", title: t("act_adab_title"), subtitle: t("act_adab_sub"), color: "bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-900", audiences: ["primary"] },
  ];
  const visibleActivities = allActivities.filter((a) => a.audiences.includes(audience));

  const ActivitiesSection = () => (
    <Section title={t("section_activities_title")} subtitle={t("section_activities_subtitle")}>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {visibleActivities.map((a) => (
          <ActivityTile key={a.href} {...a} />
        ))}
      </div>
    </Section>
  );

  // ---- Game catalog with audience tags --------------------------------
  // Each tile knows which audiences it's appropriate for. Letter-based games
  // need literacy, so under-8 kids don't see them. High school students don't
  // see Coloriage / clock-reading. The audience enum lives in the closure.
  // Groups: maths, logic, langues (FR + AR words), decouvertes (history/geo/science),
  // creation (drawing).
  const allGames: Array<{
    href: string; emoji: string; title: string; color: string;
    group: "maths" | "logic" | "langues" | "decouvertes" | "creation";
    audiences: Audience[]; literate?: boolean;
  }> = [
    // ── Maths & nombres
    { href: "/petits/maths/number-ninja", emoji: "🥷", title: t("game_ninja"), color: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900", group: "maths", audiences: ["primary", "middle"] },
    { href: "/petits/maths/souk", emoji: "🛒", title: t("game_souk"), color: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900", group: "maths", audiences: ["primary"] },
    { href: "/petits/jeux-malins/course-maths", emoji: "🏁", title: t("game_mathrace"), color: "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-900", group: "maths", audiences: ["primary", "middle"] },
    { href: "/petits/jeux-malins/calcul-mental", emoji: "🧮", title: t("game_calcul_mental"), color: "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900", group: "maths", audiences: ["primary", "middle", "high_school_other"] },
    { href: "/petits/jeux-malins/pieces", emoji: "🪙", title: t("game_coins"), color: "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900", group: "maths", audiences: ["primary", "middle"] },
    { href: "/petits/jeux-malins/tables", emoji: "🟰", title: t("game_tables"), color: "bg-cyan-50 dark:bg-cyan-950/30 border-cyan-200 dark:border-cyan-900", group: "maths", audiences: ["primary", "middle"] },
    { href: "/petits/jeux-malins/chiffres-arabes", emoji: "🔢", title: t("game_chiffres_ar"), color: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900", group: "maths", audiences: ["primary"] },
    { href: "/petits/jeux-malins/fractions", emoji: "🍕", title: t("game_fractions"), color: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900", group: "maths", audiences: ["primary", "middle"] },
    { href: "/petits/jeux-malins/comparaison", emoji: "🐊", title: t("game_comparaison"), color: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900", group: "maths", audiences: ["primary"] },
    { href: "/petits/jeux-malins/mesures", emoji: "📏", title: t("game_mesures"), color: "bg-sky-50 dark:bg-sky-950/30 border-sky-200 dark:border-sky-900", group: "maths", audiences: ["primary", "middle"] },

    // ── Logique & réflexion
    { href: "/petits/jeux-malins/sudoku", emoji: "🧩", title: t("game_sudoku"), color: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900", group: "logic", audiences: ["primary"] },
    { href: "/petits/jeux-malins/sudoku-9x9", emoji: "9️⃣", title: t("game_sudoku_9"), color: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900", group: "logic", audiences: ["middle", "high_school_other", "bac"] },
    { href: "/petits/jeux-malins/memoire", emoji: "🧠", title: t("game_memory"), color: "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900", group: "logic", audiences: ["primary"] },
    { href: "/petits/jeux-malins/motifs", emoji: "🔷", title: t("game_pattern"), color: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900", group: "logic", audiences: ["primary"] },
    { href: "/petits/jeux-malins/enigme", emoji: "🤔", title: t("game_riddle"), color: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900", group: "logic", audiences: ["primary", "middle", "high_school_other", "bac"] },
    { href: "/petits/jeux-malins/morpion", emoji: "⭕", title: t("game_tictactoe"), color: "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900", group: "logic", audiences: ["primary", "middle"] },
    { href: "/petits/jeux-malins/animaux", emoji: "🦊", title: t("game_animals"), color: "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-900", group: "logic", audiences: ["primary"] },

    // ── Lettres & langues
    { href: "/petits/jeux-malins/mots-caches", emoji: "🔍", title: t("game_wordsearch"), color: "bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-900", group: "langues", audiences: ["primary", "middle", "high_school_other"], literate: true },
    { href: "/petits/jeux-malins/pendu", emoji: "🆎", title: t("game_hangman"), color: "bg-stone-50 dark:bg-stone-900/40 border-stone-200 dark:border-stone-700", group: "langues", audiences: ["primary", "middle"], literate: true },
    { href: "/petits/jeux-malins/anagrammes", emoji: "🔤", title: t("game_anagrams"), color: "bg-fuchsia-50 dark:bg-fuchsia-950/30 border-fuchsia-200 dark:border-fuchsia-900", group: "langues", audiences: ["primary", "middle"], literate: true },
    { href: "/petits/jeux-malins/vocabulaire", emoji: "💬", title: t("game_vocab"), color: "bg-sky-50 dark:bg-sky-950/30 border-sky-200 dark:border-sky-900", group: "langues", audiences: ["primary", "middle"], literate: true },
    { href: "/petits/jeux-malins/conjugaison", emoji: "📝", title: t("game_conjugaison"), color: "bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-900", group: "langues", audiences: ["middle", "high_school_other", "bac"], literate: true },
    { href: "/petits/jeux-malins/dictee", emoji: "🎤", title: t("game_dictee"), color: "bg-pink-50 dark:bg-pink-950/30 border-pink-200 dark:border-pink-900", group: "langues", audiences: ["middle", "high_school_other"], literate: true },

    // ── Découvertes (sciences, histoire, géo, animaux, drapeaux)
    { href: "/petits/jeux-malins/drapeaux", emoji: "🚩", title: t("game_flags"), color: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900", group: "decouvertes", audiences: ["primary", "middle"] },
    { href: "/petits/jeux-malins/histoire-algerie", emoji: "🏛️", title: t("game_histoire"), color: "bg-stone-50 dark:bg-stone-900/40 border-stone-200 dark:border-stone-700", group: "decouvertes", audiences: ["middle", "high_school_other", "bac"], literate: true },
    { href: "/petits/jeux-malins/petits-scientifiques", emoji: "🧪", title: t("game_science"), color: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900", group: "decouvertes", audiences: ["primary", "middle"] },
    { href: "/petits/monde-reel/heure", emoji: "⏰", title: t("game_clock"), color: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900", group: "decouvertes", audiences: ["primary"] },
    { href: "/petits/monde-reel/wilayas", emoji: "🇩🇿", title: t("game_wilayas"), color: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900", group: "decouvertes", audiences: ["primary", "middle"] },
    { href: "/petits/jeux-malins/monuments", emoji: "🕌", title: t("game_monuments"), color: "bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-900", group: "decouvertes", audiences: ["primary", "middle"] },

    // ── Création
    { href: "/petits/coloriage", emoji: "🎨", title: t("game_coloriage"), color: "bg-pink-50 dark:bg-pink-950/30 border-pink-200 dark:border-pink-900", group: "creation", audiences: ["primary"] },
    { href: "/petits/jeux-malins/coloriage-numeros", emoji: "🖍️", title: t("game_coloriage_num"), color: "bg-fuchsia-50 dark:bg-fuchsia-950/30 border-fuchsia-200 dark:border-fuchsia-900", group: "creation", audiences: ["primary"] },
  ];
  const visibleGames = allGames.filter((g) => {
    if (!g.audiences.includes(audience)) return false;
    if (g.literate && isUnder8) return false;
    return true;
  });
  const gamesByGroup = {
    maths: visibleGames.filter((g) => g.group === "maths"),
    logic: visibleGames.filter((g) => g.group === "logic"),
    langues: visibleGames.filter((g) => g.group === "langues"),
    decouvertes: visibleGames.filter((g) => g.group === "decouvertes"),
    creation: visibleGames.filter((g) => g.group === "creation"),
  };

  const GamesSection = () => (
    <Section title={t("section_games_title")} subtitle={t("section_games_subtitle")}>
      <div className="space-y-6">
        {gamesByGroup.maths.length > 0 && (
          <SubGroup label={t("games_group_math")}>
            {gamesByGroup.maths.map((g) => <ActivityTile key={g.href} {...g} compact />)}
          </SubGroup>
        )}
        {gamesByGroup.logic.length > 0 && (
          <SubGroup label={t("games_group_logic")}>
            {gamesByGroup.logic.map((g) => <ActivityTile key={g.href} {...g} compact />)}
          </SubGroup>
        )}
        {gamesByGroup.langues.length > 0 && (
          <SubGroup label={t("games_group_langues")}>
            {gamesByGroup.langues.map((g) => <ActivityTile key={g.href} {...g} compact />)}
          </SubGroup>
        )}
        {gamesByGroup.decouvertes.length > 0 && (
          <SubGroup label={t("games_group_decouvertes")}>
            {gamesByGroup.decouvertes.map((g) => <ActivityTile key={g.href} {...g} compact />)}
          </SubGroup>
        )}
        {gamesByGroup.creation.length > 0 && (
          <SubGroup label={t("games_group_creation")}>
            {gamesByGroup.creation.map((g) => <ActivityTile key={g.href} {...g} compact />)}
          </SubGroup>
        )}
      </div>
    </Section>
  );

  const ExamsSection = () => (
    <Section title={t("section_exams_title")} subtitle={t("section_exams_subtitle")}>
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
              {t("locked_title")}
            </div>
            <p className="text-amber-900/80 dark:text-amber-100/80 mb-3">{t("locked_text")}</p>
            <Link href="/tarifs" className="btn btn-primary btn-sm">{t("view_plans")}</Link>
          </div>
        )}
        {sub && !canAccess && (
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-300 rounded-card p-4 mb-6 text-sm">
            <div className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
              {t("tier_limit_title")}
            </div>
            <p className="text-amber-900/80 dark:text-amber-100/80 mb-3">{t("tier_limit_text")}</p>
            <Link href="/parent/abonnement" className="btn btn-outline btn-sm">{t("change_plan")}</Link>
          </div>
        )}

        {/* Section ordering + visibility per audience.
            - primary (1AP-5AP)        : Quiz, Games, Activities. NO Examens.
            - middle (1AM-3AM)         : Quiz, Games, Activities. NO Examens.
            - high_school_other (1-2AS): Quiz, Activities, Games. NO Examens.
            - bac (3AS / 4AM)          : Examens FIRST, then Quiz, Activities. */}
        <div className="space-y-10">
          {audience === "bac" && <ExamsSection />}
          {audience === "primary" && <GamesSection />}
          <QuizSection />
          <ActivitiesSection />
          {audience === "middle" && <GamesSection />}
          {audience === "high_school_other" && <GamesSection />}
        </div>
      </div>
    </StudentShell>
  );
}

/* ============================================================ */
/* Sub-components                                               */
/* ============================================================ */

function Section({
  title, subtitle, stat, statLabel, children,
}: {
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
          <h2 className="text-xl md:text-2xl font-bold text-fg">{title}</h2>
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
  href, title, subtitle, color, compact = false,
}: {
  href: string;
  /** kept on the source for backwards compat but not rendered (no emojis). */
  emoji?: string;
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
      <div>
        <div className={`font-bold text-fg leading-tight ${compact ? "text-sm" : "text-base"}`}>{title}</div>
        {!compact && subtitle && (
          <div className="text-xs text-fg-soft mt-1">{subtitle}</div>
        )}
      </div>
    </Link>
  );
}

// Per-subject visual theme: letter monogram badge + accent color. Match by
// lowercase substring of the FR subject name so it works across grades.
function subjectTheme(name: string): {
  abbr: string; bgClass: string; ringClass: string; iconClass: string;
} {
  const n = name.toLowerCase();
  if (n.includes("math")) return { abbr: "MA", bgClass: "bg-blue-100 dark:bg-blue-950/40", ringClass: "ring-blue-300 dark:ring-blue-800", iconClass: "text-blue-700 dark:text-blue-300" };
  if (n.startsWith("arabe") || n.startsWith("اللغة العر")) return { abbr: "AR", bgClass: "bg-amber-100 dark:bg-amber-950/40", ringClass: "ring-amber-300 dark:ring-amber-800", iconClass: "text-amber-700 dark:text-amber-300" };
  if (n.startsWith("français") || n.startsWith("francais")) return { abbr: "FR", bgClass: "bg-rose-100 dark:bg-rose-950/40", ringClass: "ring-rose-300 dark:ring-rose-800", iconClass: "text-rose-700 dark:text-rose-300" };
  if (n.startsWith("anglais") || n.startsWith("english")) return { abbr: "EN", bgClass: "bg-indigo-100 dark:bg-indigo-950/40", ringClass: "ring-indigo-300 dark:ring-indigo-800", iconClass: "text-indigo-700 dark:text-indigo-300" };
  if (n.startsWith("éveil") || n.startsWith("eveil")) return { abbr: "EV", bgClass: "bg-teal-100 dark:bg-teal-950/40", ringClass: "ring-teal-300 dark:ring-teal-800", iconClass: "text-teal-700 dark:text-teal-300" };
  if (n.startsWith("sciences naturelles") || n.includes("svt")) return { abbr: "SN", bgClass: "bg-emerald-100 dark:bg-emerald-950/40", ringClass: "ring-emerald-300 dark:ring-emerald-800", iconClass: "text-emerald-700 dark:text-emerald-300" };
  if (n.startsWith("sciences physiques") || n.startsWith("physique")) return { abbr: "PH", bgClass: "bg-orange-100 dark:bg-orange-950/40", ringClass: "ring-orange-300 dark:ring-orange-800", iconClass: "text-orange-700 dark:text-orange-300" };
  if (n.startsWith("histoire")) return { abbr: "HG", bgClass: "bg-stone-100 dark:bg-stone-900/60", ringClass: "ring-stone-300 dark:ring-stone-700", iconClass: "text-stone-700 dark:text-stone-300" };
  if (n.startsWith("philo")) return { abbr: "PI", bgClass: "bg-purple-100 dark:bg-purple-950/40", ringClass: "ring-purple-300 dark:ring-purple-800", iconClass: "text-purple-700 dark:text-purple-300" };
  return { abbr: name.slice(0, 2).toUpperCase(), bgClass: "bg-pale-blue dark:bg-surface-3", ringClass: "ring-line", iconClass: "text-navy dark:text-fg" };
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
    <div className="space-y-7">
      {groups.map((g) => {
        const theme = subjectTheme(g.name);
        const totalQ = g.chapters.reduce((s, c) => s + c.questionCount, 0);
        return (
          <section key={g.subject_id} className="relative">
            {/* Subject header — colored card with monogram badge + chapter count */}
            <header className={`${theme.bgClass} ring-1 ${theme.ringClass} rounded-card p-3 md:p-4 flex items-center gap-3 mb-3`}>
              <span className={`w-10 h-10 md:w-11 md:h-11 rounded-[10px] bg-surface text-xs md:text-sm font-bold flex items-center justify-center flex-shrink-0 ${theme.iconClass} ring-1 ${theme.ringClass}`}>
                {theme.abbr}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className={`text-base md:text-lg font-bold ${theme.iconClass}`}>{g.name}</h3>
                <p className="text-xs text-fg-soft">
                  {g.chapters.length} {g.chapters.length > 1 ? "chapitres" : "chapitre"} · {totalQ} questions
                </p>
              </div>
            </header>
            {/* Chapter cards under the subject — clean white cards, no yellow bullseye */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {g.chapters.map((c, i) => (
                <Link
                  key={c.id}
                  href={`/eleve/matieres/${c.subject_id}/${c.id}` as never}
                  className="bg-surface border border-line rounded-card p-4 flex items-center gap-3 hover:border-fg/40 hover:shadow-card-hover hover:-translate-y-0.5 transition-all group"
                >
                  {/* Numbered circle in the subject color, replaces the uniform gold target */}
                  <span className={`w-11 h-11 rounded-full ${theme.bgClass} flex items-center justify-center flex-shrink-0 ring-1 ${theme.ringClass} group-hover:scale-105 transition-transform`}>
                    <span className={`text-base font-bold ${theme.iconClass}`}>{i + 1}</span>
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-fg leading-snug line-clamp-2">{c.title}</div>
                    <div className="text-xs text-fg-soft mt-0.5">
                      {showGrade && <span className="font-mono mr-1">{c.grade_code}</span>}
                      {t("question_count", { count: c.questionCount })}
                    </div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-btn ${theme.bgClass} ${theme.iconClass} font-semibold whitespace-nowrap flex-shrink-0 ring-1 ${theme.ringClass}`}>
                    {t("start")}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
