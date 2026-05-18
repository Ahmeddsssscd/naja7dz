/**
 * Parent catalog page — surfaces the size of the platform so parents can
 * see exactly what their subscription buys: how many games, quizzes,
 * stories, exam papers, etc., grouped by section.
 *
 * Read-only, audited live from the DB on each visit.
 */
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/app/AppShell";
import { Link } from "@/i18n/routing";

export const metadata = { title: "Catalogue Najaح" };

interface Stat {
  label: string;
  value: number;
  href?: string;
  hint?: string;
}

export default async function CataloguePage() {
  const t = await getTranslations("ParentCatalogue");
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: profile } = await supabase
    .from("parent_profiles")
    .select("full_name")
    .eq("user_id", user.id)
    .maybeSingle();

  // Pull catalog stats in one batch.
  const admin = createAdminClient();
  const [chaptersR, questionsR, storiesR, examsR, riddlesR, speechesR, wilayasR, suraR, writingR, adabR] =
    await Promise.all([
      admin.from("chapters").select("id", { count: "exact", head: true }),
      admin.from("quiz_questions").select("id", { count: "exact", head: true }).eq("active", true),
      admin.from("stories").select("id", { count: "exact", head: true }).eq("active", true),
      admin.from("exam_papers").select("id", { count: "exact", head: true }),
      admin.from("logic_riddles").select("id", { count: "exact", head: true }).eq("active", true),
      admin.from("motivational_speeches").select("id", { count: "exact", head: true }).eq("status", "approved"),
      admin.from("wilayas").select("code", { count: "exact", head: true }),
      admin.from("quran_surahs").select("number", { count: "exact", head: true }),
      admin.from("writing_prompts").select("id", { count: "exact", head: true }).eq("active", true),
      admin.from("adab_lessons").select("id", { count: "exact", head: true }),
    ]);

  // The total game count is stable — derived from src/components/app/games/.
  // Bumping this when we add new games is a manual step, but it's a tiny
  // string change and hardcoding avoids a filesystem scan at request time.
  const totalGames = 24;
  const totalActivities = 6; // Rédaction, Calligraphie, Lecture, Quran, Adab, Wilayas
  const totalSubjects = 9; // Math, Arabe, Français, Anglais, Sciences nat, Sciences phys, Histoire-géo, Éveil, Philo

  const subjectStats: Stat[] = [
    { label: t("subjects"), value: totalSubjects, hint: t("subjects_hint") },
    { label: t("chapters"), value: chaptersR.count ?? 0, hint: t("chapters_hint") },
    { label: t("questions"), value: questionsR.count ?? 0, hint: t("questions_hint") },
  ];

  const kidsStats: Stat[] = [
    { label: t("games"), value: totalGames, href: "/eleve/pratique", hint: t("games_hint") },
    { label: t("activities"), value: totalActivities, href: "/eleve/pratique", hint: t("activities_hint") },
    { label: t("stories"), value: storiesR.count ?? 0, href: "/petits/lecture", hint: t("stories_hint") },
    { label: t("riddles"), value: riddlesR.count ?? 0, hint: t("riddles_hint") },
    { label: t("surahs"), value: suraR.count ?? 0, href: "/petits/quran", hint: t("surahs_hint") },
    { label: t("adab"), value: adabR.count ?? 0, href: "/petits/monde-reel/adab", hint: t("adab_hint") },
    { label: t("wilayas"), value: wilayasR.count ?? 0, href: "/petits/monde-reel/wilayas", hint: t("wilayas_hint") },
  ];

  const bacStats: Stat[] = [
    { label: t("exam_papers"), value: examsR.count ?? 0, href: "/eleve/bac", hint: t("exam_hint") },
    { label: t("writing_prompts"), value: writingR.count ?? 0, href: "/eleve/redaction", hint: t("writing_hint") },
    { label: t("speeches"), value: speechesR.count ?? 0, hint: t("speeches_hint") },
  ];

  const total =
    (chaptersR.count ?? 0) +
    (questionsR.count ?? 0) +
    (storiesR.count ?? 0) +
    (examsR.count ?? 0) +
    (riddlesR.count ?? 0) +
    (speechesR.count ?? 0) +
    totalGames +
    totalActivities;

  return (
    <AppShell active="reports" parentName={profile?.full_name ?? ""}>
      <div className="max-w-6xl">
        <div className="mb-8">
          <span className="eyebrow">{t("eyebrow")}</span>
          <h1 className="text-2xl md:text-3xl font-bold text-fg mt-2 mb-2">{t("page_title")}</h1>
          <p className="text-fg-soft text-sm md:text-base max-w-prose">{t("subtitle")}</p>
        </div>

        {/* Big "platform total" hero */}
        <div className="accent-block rounded-modal p-6 md:p-8 mb-10">
          <span className="text-xs font-semibold text-gold uppercase tracking-wider">
            {t("total_label")}
          </span>
          <div className="text-5xl md:text-7xl font-bold text-white mt-2">
            {total.toLocaleString("fr-DZ")}
          </div>
          <p className="text-white/70 text-sm md:text-base mt-2 max-w-prose">
            {t("total_subtitle")}
          </p>
        </div>

        {/* Apprentissage scolaire (subjects + chapters + questions) */}
        <h2 className="text-lg md:text-xl font-bold text-fg mb-3">{t("section_school")}</h2>
        <p className="text-fg-soft text-sm mb-4">{t("section_school_subtitle")}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {subjectStats.map((s) => <StatCard key={s.label} stat={s} />)}
        </div>

        {/* Univers des petits */}
        <h2 className="text-lg md:text-xl font-bold text-fg mb-3">{t("section_kids")}</h2>
        <p className="text-fg-soft text-sm mb-4">{t("section_kids_subtitle")}</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-10">
          {kidsStats.map((s) => <StatCard key={s.label} stat={s} />)}
        </div>

        {/* Bac & secondaire */}
        <h2 className="text-lg md:text-xl font-bold text-fg mb-3">{t("section_bac")}</h2>
        <p className="text-fg-soft text-sm mb-4">{t("section_bac_subtitle")}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {bacStats.map((s) => <StatCard key={s.label} stat={s} />)}
        </div>

        {/* Highlight: 5 sub-groups of games */}
        <div className="bg-surface border border-line rounded-card p-6 mb-10">
          <h3 className="text-base font-bold text-fg mb-3">{t("games_breakdown_title")}</h3>
          <p className="text-fg-soft text-sm mb-4">{t("games_breakdown_subtitle")}</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
            <div><div className="font-semibold text-fg">{t("group_math")}</div><div className="text-fg-soft text-xs">7 jeux</div></div>
            <div><div className="font-semibold text-fg">{t("group_logic")}</div><div className="text-fg-soft text-xs">7 jeux</div></div>
            <div><div className="font-semibold text-fg">{t("group_langues")}</div><div className="text-fg-soft text-xs">6 jeux</div></div>
            <div><div className="font-semibold text-fg">{t("group_decouvertes")}</div><div className="text-fg-soft text-xs">5 jeux</div></div>
            <div><div className="font-semibold text-fg">{t("group_creation")}</div><div className="text-fg-soft text-xs">2 jeux</div></div>
          </div>
        </div>

        {/* Quick CTAs */}
        <div className="flex flex-wrap gap-3">
          <Link href="/eleve/pratique" className="btn btn-primary">
            {t("cta_practice")}
          </Link>
          <Link href="/petits" className="btn btn-outline">
            {t("cta_kids")}
          </Link>
          <Link href="/parent/abonnement" className="btn btn-outline">
            {t("cta_sub")}
          </Link>
        </div>
      </div>
    </AppShell>
  );
}

function StatCard({ stat }: { stat: Stat }) {
  const inner = (
    <>
      <div className="text-3xl md:text-4xl font-bold text-fg leading-none mb-1">
        {stat.value.toLocaleString("fr-DZ")}
      </div>
      <div className="text-sm font-semibold text-fg">{stat.label}</div>
      {stat.hint && <div className="text-xs text-fg-soft mt-1">{stat.hint}</div>}
    </>
  );
  if (stat.href) {
    return (
      <Link
        href={stat.href as never}
        className="bg-surface border border-line rounded-card p-5 hover:border-fg/40 hover:shadow-card-hover transition-all block"
      >
        {inner}
      </Link>
    );
  }
  return (
    <div className="bg-surface border border-line rounded-card p-5">{inner}</div>
  );
}
