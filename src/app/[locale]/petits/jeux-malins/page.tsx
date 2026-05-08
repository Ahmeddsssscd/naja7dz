/**
 * /petits/jeux-malins — full kids game hub.
 *
 * Mirrors the Jeux malins section of /eleve/pratique exactly, so when a kid
 * finishes a game and taps the back arrow they always land on the same
 * comprehensive list of all 13 games (not the small subset that just
 * happened to live under this URL prefix).
 *
 * Sub-groups: Maths & nombres · Logique & réflexion · Lettres & mots ·
 *             Création & monde réel
 */
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/routing";
import { requireKidsAccess } from "@/lib/subscriptions";

export const metadata = { title: "Jeux malins" };

export default async function MalinsHub() {
  const t = await getTranslations("PetitsSmart");
  const tHub = await getTranslations("ElevePratique");
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  // Hard paywall: kids universe is full-tier only.
  await requireKidsAccess(user.id);

  return (
    <div className="min-h-screen bg-cream pb-12">
      {/* Header — kept simple + kid-friendly: back arrow, title, spacer */}
      <header className="px-5 py-4 flex items-center justify-between bg-white border-b border-pale-blue sticky top-0 z-30">
        <Link
          href="/petits"
          className="w-10 h-10 rounded-full hover:bg-pale-blue/40 flex items-center justify-center text-navy"
          aria-label={t("back")}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </Link>
        <h1 className="font-bold text-navy text-lg">{t("page_title")}</h1>
        <div className="w-10" />
      </header>

      <main className="max-w-5xl mx-auto px-5 md:px-8 py-6 md:py-8">
        <p className="text-fg-soft text-sm md:text-base mb-6 text-center md:text-start">
          {tHub("section_games_subtitle")}
        </p>

        <div className="space-y-7">
          {/* Maths & numbers */}
          <SubGroup label={tHub("games_group_math")}>
            <Tile
              href="/petits/maths/number-ninja"
              emoji="🥷"
              title={tHub("game_ninja")}
              color="bg-red-100 dark:bg-red-950/30 text-red-900 dark:text-red-100"
            />
            <Tile
              href="/petits/maths/souk"
              emoji="🛒"
              title={tHub("game_souk")}
              color="bg-amber-100 dark:bg-amber-950/30 text-amber-900 dark:text-amber-100"
            />
            <Tile
              href="/petits/jeux-malins/course-maths"
              emoji="🏁"
              title={tHub("game_mathrace")}
              color="bg-orange-100 dark:bg-orange-950/30 text-orange-900 dark:text-orange-100"
            />
            <Tile
              href="/petits/jeux-malins/pieces"
              emoji="🪙"
              title={tHub("game_coins")}
              color="bg-yellow-100 dark:bg-yellow-950/30 text-yellow-900 dark:text-yellow-100"
            />
          </SubGroup>

          {/* Logic & reasoning */}
          <SubGroup label={tHub("games_group_logic")}>
            <Tile
              href="/petits/jeux-malins/sudoku"
              emoji="🧩"
              title={tHub("game_sudoku")}
              color="bg-blue-100 dark:bg-blue-950/30 text-blue-900 dark:text-blue-100"
            />
            <Tile
              href="/petits/jeux-malins/memoire"
              emoji="🧠"
              title={tHub("game_memory")}
              color="bg-purple-100 dark:bg-purple-950/30 text-purple-900 dark:text-purple-100"
            />
            <Tile
              href="/petits/jeux-malins/motifs"
              emoji="🔷"
              title={tHub("game_pattern")}
              color="bg-emerald-100 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-100"
            />
            <Tile
              href="/petits/jeux-malins/enigme"
              emoji="🤔"
              title={tHub("game_riddle")}
              color="bg-amber-100 dark:bg-amber-950/30 text-amber-900 dark:text-amber-100"
            />
            <Tile
              href="/petits/jeux-malins/morpion"
              emoji="❌"
              title={tHub("game_tictactoe")}
              color="bg-indigo-100 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-100"
            />
          </SubGroup>

          {/* Letters & words */}
          <SubGroup label={tHub("games_group_words")}>
            <Tile
              href="/petits/jeux-malins/mots-caches"
              emoji="🔍"
              title={tHub("game_wordsearch")}
              color="bg-teal-100 dark:bg-teal-950/30 text-teal-900 dark:text-teal-100"
            />
            <Tile
              href="/petits/jeux-malins/pendu"
              emoji="🪢"
              title={tHub("game_hangman")}
              color="bg-rose-100 dark:bg-rose-950/30 text-rose-900 dark:text-rose-100"
            />
          </SubGroup>

          {/* Creativity & real world */}
          <SubGroup label={tHub("games_group_world")}>
            <Tile
              href="/petits/coloriage"
              emoji="🎨"
              title={tHub("game_coloriage")}
              color="bg-pink-100 dark:bg-pink-950/30 text-pink-900 dark:text-pink-100"
            />
            <Tile
              href="/petits/monde-reel/heure"
              emoji="⏰"
              title={tHub("game_clock")}
              color="bg-blue-100 dark:bg-blue-950/30 text-blue-900 dark:text-blue-100"
            />
            <Tile
              href="/petits/monde-reel/wilayas"
              emoji="🇩🇿"
              title={tHub("game_wilayas")}
              color="bg-amber-100 dark:bg-amber-950/30 text-amber-900 dark:text-amber-100"
            />
          </SubGroup>
        </div>
      </main>
    </div>
  );
}

function SubGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xs font-bold text-navy/70 uppercase tracking-wider mb-2.5 ms-1">
        {label}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {children}
      </div>
    </section>
  );
}

function Tile({
  href, emoji, title, color,
}: {
  href: string;
  emoji: string;
  title: string;
  color: string;
}) {
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
