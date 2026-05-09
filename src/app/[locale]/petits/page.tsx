/**
 * /petits — kid universe entry point.
 *
 * Two big behaviours that came out of user feedback:
 *
 *   1. Multi-child support. Parents in our beta have 2-3 kids each. The
 *      previous version silently picked `children[0]` ordered by created_at,
 *      which left siblings invisible. Now we resolve the active child via
 *      `resolveActiveChild` (URL ?child > cookie > first) and show a
 *      `<ChildSwitcher />` pill row when the parent has 2+ children.
 *
 *   2. Show every game directly. The old layout was 7 universe tiles
 *      (Coloriage, Maths, Jeux malins…) which forced the kid through one
 *      extra hop just to see the game list. Parents complained the page
 *      "doesn't show all games". We now keep the universe shortcuts as a
 *      compact "Mes univers" strip but render every individual game flat
 *      below it, grouped into 5 sub-groups identical to /eleve/pratique
 *      and /petits/jeux-malins. The kid lands on /petits → picks who they
 *      are → sees everything available.
 */
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/routing";
import { LangSwitch } from "@/components/LangSwitch";
import { ThemeToggle } from "@/components/ThemeToggle";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { requireKidsAccess } from "@/lib/subscriptions";
import { resolveActiveChild } from "@/lib/active-child";
import { ChildSwitcher } from "@/components/app/ChildSwitcher";
import { DailyStrip } from "@/components/app/DailyStrip";
import { getLocale } from "next-intl/server";

export const metadata = { title: "Mon univers" };

interface PageProps {
  searchParams: Promise<{ child?: string }>;
}

export default async function KidsHome({ searchParams }: PageProps) {
  const t = await getTranslations("Petits");
  const tHub = await getTranslations("ElevePratique");
  const locale = await getLocale();
  const isAr = locale === "ar";
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  // Hard paywall: kids universe is full-tier only (eleve / famille). Pack Bac
  // users get redirected to upgrade.
  await requireKidsAccess(user.id);

  // Pick which child this parent is currently viewing (URL > cookie > first).
  const { child: queryChild } = await searchParams;
  const { active, all, hasMultiple } = await resolveActiveChild(user.id, queryChild);
  const firstName = active?.full_name?.split(" ")[0];

  // Feature flags — admin can hide universe shortcuts. Individual games stay
  // always-on; if a tile needs hiding we'd add a per-game flag later.
  const [coloringOn, mathsOn, smartOn, worldOn, readingOn, quranOn, englishOn] = await Promise.all([
    isFeatureEnabled("kids_coloring"),
    isFeatureEnabled("kids_maths"),
    isFeatureEnabled("kids_smart"),
    isFeatureEnabled("kids_world"),
    isFeatureEnabled("kids_reading"),
    isFeatureEnabled("kids_quran"),
    isFeatureEnabled("kids_english"),
  ]);

  return (
    <div className="min-h-screen bg-cream pb-12">
      {/* Top bar — wider on desktop, child pill + locale/theme toggles */}
      <header className="px-5 lg:px-8 pt-5 pb-3 flex items-center justify-between max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <span className="w-12 h-12 rounded-full bg-gold text-navy text-xl font-bold flex items-center justify-center shadow-card">
            {(active?.full_name ?? "?").split(" ").map((s: string) => s[0]).slice(0, 2).join("")}
          </span>
          <div>
            <div className="font-bold text-navy text-lg">
              {firstName ? t("greeting", { name: firstName }) : t("greeting_default")}
            </div>
            <div className="text-xs text-fg-soft">{t("stats", { trophies: 0, stars: 0 })}</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <LangSwitch />
        </div>
      </header>

      {/* Child switcher — only shown when the parent has 2+ children. */}
      {hasMultiple && (
        <div className="max-w-5xl mx-auto px-5 lg:px-8">
          <ChildSwitcher
            kids={all.map((c) => ({ id: c.id, full_name: c.full_name, grade: c.grade }))}
            activeId={active?.id ?? null}
            label={t("switcher_label")}
          />
        </div>
      )}

      {/* Hero with mascot — constrained on desktop so it doesn't go ridiculous */}
      <section className="max-w-5xl mx-auto mx-5 lg:mx-auto lg:px-8">
        <div className="accent-block rounded-[28px] p-6 md:p-8 relative overflow-hidden mx-5 lg:mx-0">
          <div className="absolute -bottom-6 -end-3 text-7xl md:text-8xl">🦊</div>
          <div className="relative">
            <div className="text-xs font-bold text-gold uppercase tracking-wider mb-2">{t("fennec_says")}</div>
            <p className="text-lg md:text-xl font-semibold leading-snug max-w-[70%]">{t("welcome")}</p>
          </div>
        </div>
      </section>

      {/* Daily strip — streak + featured-of-the-day + Fennec tip. Fills the
          dead space that used to sit between the hero and the catalogue on
          desktop, and gives kids a reason to come back tomorrow. */}
      <section className="max-w-5xl mx-auto mt-5 px-5 lg:px-8">
        <DailyStrip childId={active?.id ?? null} isAr={isAr} />
      </section>

      {/* "Mes univers" — compact horizontal strip with the 7 multi-page hubs.
          Kept smaller than before so they don't dominate the page. */}
      <section className="max-w-5xl mx-auto mt-6 px-5 lg:px-8">
        <div className="flex items-baseline justify-between mb-3 ms-1">
          <h2 className="text-base font-bold text-navy uppercase tracking-wide">{t("section_universes")}</h2>
          <span className="text-xs text-fg-soft hidden sm:inline">{t("section_universes_sub")}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {coloringOn && <UniverseTile href="/petits/coloriage" emoji="🎨" title={t("tile_coloring")} color="bg-pink-100 dark:bg-pink-950/30 text-pink-900 dark:text-pink-100" />}
          {mathsOn && <UniverseTile href="/petits/maths" emoji="🧮" title={t("tile_maths")} color="bg-blue-100 dark:bg-blue-950/30 text-blue-900 dark:text-blue-100" />}
          {smartOn && <UniverseTile href="/petits/jeux-malins" emoji="🧩" title={t("tile_smart")} color="bg-emerald-100 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-100" />}
          {worldOn && <UniverseTile href="/petits/monde-reel" emoji="🌍" title={t("tile_world")} color="bg-amber-100 dark:bg-amber-950/30 text-amber-900 dark:text-amber-100" />}
          {readingOn && <UniverseTile href="/petits/lecture" emoji="📖" title={t("tile_reading")} color="bg-purple-100 dark:bg-purple-950/30 text-purple-900 dark:text-purple-100" />}
          {quranOn && <UniverseTile href="/petits/quran" emoji="📿" title={t("tile_quran")} color="bg-rose-100 dark:bg-rose-950/30 text-rose-900 dark:text-rose-100" />}
          {englishOn && <UniverseTile href="/petits/anglais" emoji="🇬🇧" title={t("tile_english")} color="bg-indigo-100 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-100" />}
        </div>
      </section>

      {/* "Tous les jeux" — flat catalog of every individual game we ship,
          organised in 5 sub-groups exactly mirroring /eleve/pratique and
          /petits/jeux-malins. This is what the user wanted: see every game
          on the landing page, no extra click. */}
      <section className="max-w-5xl mx-auto mt-7 px-5 lg:px-8">
        <div className="flex items-baseline justify-between mb-3 ms-1">
          <h2 className="text-base font-bold text-navy uppercase tracking-wide">{t("section_all_games")}</h2>
          <span className="text-xs text-fg-soft hidden sm:inline">{t("section_all_games_sub")}</span>
        </div>

        <div className="space-y-7">
          {/* Maths & nombres */}
          <SubGroup label={tHub("games_group_math")}>
            <Tile href="/petits/maths/number-ninja" emoji="🥷" title={tHub("game_ninja")} color="bg-red-100 dark:bg-red-950/30 text-red-900 dark:text-red-100" />
            <Tile href="/petits/maths/souk" emoji="🛒" title={tHub("game_souk")} color="bg-amber-100 dark:bg-amber-950/30 text-amber-900 dark:text-amber-100" />
            <Tile href="/petits/jeux-malins/course-maths" emoji="🏁" title={tHub("game_mathrace")} color="bg-orange-100 dark:bg-orange-950/30 text-orange-900 dark:text-orange-100" />
            <Tile href="/petits/jeux-malins/calcul-mental" emoji="🧮" title={tHub("game_calcul_mental")} color="bg-rose-100 dark:bg-rose-950/30 text-rose-900 dark:text-rose-100" />
            <Tile href="/petits/jeux-malins/pieces" emoji="🪙" title={tHub("game_coins")} color="bg-yellow-100 dark:bg-yellow-950/30 text-yellow-900 dark:text-yellow-100" />
            <Tile href="/petits/jeux-malins/tables" emoji="🟰" title={tHub("game_tables")} color="bg-cyan-100 dark:bg-cyan-950/30 text-cyan-900 dark:text-cyan-100" />
            <Tile href="/petits/jeux-malins/chiffres-arabes" emoji="🔢" title={tHub("game_chiffres_ar")} color="bg-emerald-100 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-100" />
          </SubGroup>

          {/* Logique & réflexion */}
          <SubGroup label={tHub("games_group_logic")}>
            <Tile href="/petits/jeux-malins/sudoku" emoji="🧩" title={tHub("game_sudoku")} color="bg-blue-100 dark:bg-blue-950/30 text-blue-900 dark:text-blue-100" />
            <Tile href="/petits/jeux-malins/sudoku-9x9" emoji="9️⃣" title={tHub("game_sudoku_9")} color="bg-blue-100 dark:bg-blue-950/30 text-blue-900 dark:text-blue-100" />
            <Tile href="/petits/jeux-malins/memoire" emoji="🧠" title={tHub("game_memory")} color="bg-purple-100 dark:bg-purple-950/30 text-purple-900 dark:text-purple-100" />
            <Tile href="/petits/jeux-malins/motifs" emoji="🔷" title={tHub("game_pattern")} color="bg-emerald-100 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-100" />
            <Tile href="/petits/jeux-malins/enigme" emoji="🤔" title={tHub("game_riddle")} color="bg-amber-100 dark:bg-amber-950/30 text-amber-900 dark:text-amber-100" />
            <Tile href="/petits/jeux-malins/morpion" emoji="⭕" title={tHub("game_tictactoe")} color="bg-indigo-100 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-100" />
            <Tile href="/petits/jeux-malins/animaux" emoji="🦊" title={tHub("game_animals")} color="bg-orange-100 dark:bg-orange-950/30 text-orange-900 dark:text-orange-100" />
          </SubGroup>

          {/* Lettres & langues */}
          <SubGroup label={tHub("games_group_langues")}>
            <Tile href="/petits/jeux-malins/mots-caches" emoji="🔍" title={tHub("game_wordsearch")} color="bg-teal-100 dark:bg-teal-950/30 text-teal-900 dark:text-teal-100" />
            <Tile href="/petits/jeux-malins/pendu" emoji="🆎" title={tHub("game_hangman")} color="bg-rose-100 dark:bg-rose-950/30 text-rose-900 dark:text-rose-100" />
            <Tile href="/petits/jeux-malins/anagrammes" emoji="🔤" title={tHub("game_anagrams")} color="bg-fuchsia-100 dark:bg-fuchsia-950/30 text-fuchsia-900 dark:text-fuchsia-100" />
            <Tile href="/petits/jeux-malins/vocabulaire" emoji="💬" title={tHub("game_vocab")} color="bg-sky-100 dark:bg-sky-950/30 text-sky-900 dark:text-sky-100" />
            <Tile href="/petits/jeux-malins/conjugaison" emoji="📝" title={tHub("game_conjugaison")} color="bg-violet-100 dark:bg-violet-950/30 text-violet-900 dark:text-violet-100" />
            <Tile href="/petits/jeux-malins/dictee" emoji="🎤" title={tHub("game_dictee")} color="bg-pink-100 dark:bg-pink-950/30 text-pink-900 dark:text-pink-100" />
            {englishOn && <Tile href="/petits/anglais" emoji="🇬🇧" title={t("tile_english")} color="bg-indigo-100 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-100" />}
          </SubGroup>

          {/* Découverte du corps & du monde — visual SVG-based games. NEW. */}
          <SubGroup label={t("group_body_world")}>
            <Tile href="/petits/jeux-malins/mon-corps"    emoji="🧒" title={t("game_body")}     color="bg-rose-100 dark:bg-rose-950/30 text-rose-900 dark:text-rose-100" />
            <Tile href="/petits/jeux-malins/emotions"     emoji="😊" title={t("game_emotions")} color="bg-yellow-100 dark:bg-yellow-950/30 text-yellow-900 dark:text-yellow-100" />
            <Tile href="/petits/jeux-malins/saisons"      emoji="🌈" title={t("game_seasons")}  color="bg-sky-100 dark:bg-sky-950/30 text-sky-900 dark:text-sky-100" />
            <Tile href="/petits/jeux-malins/mon-assiette" emoji="🍎" title={t("game_plate")}    color="bg-emerald-100 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-100" />
          </SubGroup>

          {/* Découvertes (sciences, histoire, géo) */}
          <SubGroup label={tHub("games_group_decouvertes")}>
            <Tile href="/petits/jeux-malins/drapeaux" emoji="🚩" title={tHub("game_flags")} color="bg-red-100 dark:bg-red-950/30 text-red-900 dark:text-red-100" />
            <Tile href="/petits/jeux-malins/histoire-algerie" emoji="🏛️" title={tHub("game_histoire")} color="bg-stone-100 dark:bg-stone-900/40 text-stone-900 dark:text-stone-100" />
            <Tile href="/petits/jeux-malins/petits-scientifiques" emoji="🧪" title={tHub("game_science")} color="bg-emerald-100 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-100" />
            <Tile href="/petits/monde-reel/heure" emoji="⏰" title={tHub("game_clock")} color="bg-blue-100 dark:bg-blue-950/30 text-blue-900 dark:text-blue-100" />
            <Tile href="/petits/monde-reel/wilayas" emoji="🇩🇿" title={tHub("game_wilayas")} color="bg-amber-100 dark:bg-amber-950/30 text-amber-900 dark:text-amber-100" />
            {quranOn && <Tile href="/petits/quran" emoji="📿" title={t("tile_quran")} color="bg-rose-100 dark:bg-rose-950/30 text-rose-900 dark:text-rose-100" />}
            {readingOn && <Tile href="/petits/lecture" emoji="📖" title={t("tile_reading")} color="bg-purple-100 dark:bg-purple-950/30 text-purple-900 dark:text-purple-100" />}
          </SubGroup>

          {/* Création */}
          <SubGroup label={tHub("games_group_creation")}>
            <Tile href="/petits/coloriage" emoji="🎨" title={tHub("game_coloriage")} color="bg-pink-100 dark:bg-pink-950/30 text-pink-900 dark:text-pink-100" />
            <Tile href="/petits/jeux-malins/coloriage-numeros" emoji="🖍️" title={tHub("game_coloriage_num")} color="bg-fuchsia-100 dark:bg-fuchsia-950/30 text-fuchsia-900 dark:text-fuchsia-100" />
          </SubGroup>
        </div>
      </section>
    </div>
  );
}

/** Compact pill-ish tile used in the "Mes univers" horizontal strip. */
function UniverseTile({
  href, emoji, title, color,
}: { href: string; emoji: string; title: string; color: string }) {
  return (
    <Link
      href={href as never}
      className={`${color} rounded-2xl px-3 py-3 flex flex-col items-center justify-center gap-1 active:scale-95 hover:scale-[1.03] hover:shadow-card-hover transition-all text-center min-h-[88px]`}
    >
      <span className="text-2xl md:text-3xl">{emoji}</span>
      <span className="font-bold text-[11px] md:text-xs leading-tight">{title}</span>
    </Link>
  );
}

/** Section heading wrapping a 4-col grid of `<Tile>`s for individual games. */
function SubGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="text-xs font-bold text-navy/70 uppercase tracking-wider mb-2.5 ms-1">
        {label}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {children}
      </div>
    </section>
  );
}

/** Single-game tile — square, big emoji, bold title. */
function Tile({
  href, emoji, title, color,
}: { href: string; emoji: string; title: string; color: string }) {
  return (
    <Link
      href={href as never}
      className={`${color} rounded-3xl aspect-square p-4 md:p-5 flex flex-col items-center justify-center gap-2 active:scale-95 hover:scale-[1.02] hover:shadow-card-hover transition-all`}
    >
      <span className="text-4xl md:text-5xl">{emoji}</span>
      <span className="font-bold text-center text-sm md:text-base leading-tight">{title}</span>
    </Link>
  );
}
