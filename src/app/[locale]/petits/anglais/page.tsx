/**
 * /petits/anglais — English-learning hub for kids (5-12 yo).
 *
 * 4 sections, each rendered as a SubGroup with tiles:
 *   - Mes leçons     : 8 themed lessons (alphabet, numbers, colors, …)
 *   - Les jeux       : 5 English mini-games (flashcards, listen, search, hangman, pronunciation)
 *   - Quiz           : 3 standalone MCQ quizzes
 *   - Histoires      : 3 short bilingual stories
 *
 * Hard-paywalled with `requireKidsAccess` like the rest of /petits/*.
 *
 * Audience: bilingual FR/AR users learning English as L3. The hub stays in
 * French (the kid's primary school language) but every tile carries an
 * Arabic subtitle for full bilingual context.
 */

import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/routing";
import { requireKidsAccess } from "@/lib/subscriptions";
import { ALL_LESSONS } from "@/components/app/games/english/englishData";
import { STORIES } from "@/components/app/games/english/englishStories";
import { QUIZ_IDS, QUIZ_META } from "@/components/app/games/english/quizMeta";

export const metadata = { title: "Apprends l'anglais" };

export default async function AnglaisHub() {
  const t = await getTranslations("PetitsAnglais");
  const tBack = await getTranslations("Petits");
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  // Hard paywall — kids universe is full-tier only.
  await requireKidsAccess(user.id);

  const lessonTiles = ALL_LESSONS.map((l) => ({
    href: `/petits/anglais/${l.slug}` as const,
    emoji: l.emoji,
    title: t(`lesson_${l.i18nKey}`),
    sub: t(`lesson_${l.i18nKey}_sub`),
    color: l.color,
  }));

  const gameTiles = [
    {
      href: "/petits/anglais/jeux/flashcards" as const,
      emoji: "🎴",
      title: t("game_flashcards"),
      sub: t("game_flashcards_sub"),
      color: "bg-rose-100 text-rose-900",
    },
    {
      href: "/petits/anglais/jeux/ecouter" as const,
      emoji: "🎧",
      title: t("game_listen"),
      sub: t("game_listen_sub"),
      color: "bg-blue-100 text-blue-900",
    },
    {
      href: "/petits/anglais/jeux/mots-caches" as const,
      emoji: "🔍",
      title: t("game_wordsearch"),
      sub: t("game_wordsearch_sub"),
      color: "bg-teal-100 text-teal-900",
    },
    {
      href: "/petits/anglais/jeux/pendu" as const,
      emoji: "🪢",
      title: t("game_hangman"),
      sub: t("game_hangman_sub"),
      color: "bg-fuchsia-100 text-fuchsia-900",
    },
    {
      href: "/petits/anglais/jeux/prononciation" as const,
      emoji: "🗣️",
      title: t("game_pronunciation"),
      sub: t("game_pronunciation_sub"),
      color: "bg-amber-100 text-amber-900",
    },
  ];

  const quizTiles = QUIZ_IDS.map((id) => ({
    href: `/petits/anglais/quiz/${id}` as const,
    emoji: QUIZ_META[id].emoji,
    title: QUIZ_META[id].name_fr,
    sub: QUIZ_META[id].name_ar,
    color: "bg-emerald-100 text-emerald-900",
  }));

  const storyTiles = STORIES.map((s) => ({
    href: `/petits/anglais/histoires/${s.slug}` as const,
    emoji: s.emoji,
    title: s.title_fr,
    sub: s.title_en,
    color: s.color,
  }));

  return (
    <div className="min-h-screen bg-cream pb-12">
      <header className="px-5 py-4 flex items-center justify-between bg-white border-b border-pale-blue sticky top-0 z-30">
        <Link
          href="/petits"
          className="w-10 h-10 rounded-full hover:bg-pale-blue/40 flex items-center justify-center text-navy"
          aria-label={tBack("back")}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </Link>
        <div className="text-center">
          <h1 className="font-bold text-navy text-lg">{t("page_title")}</h1>
          <div className="text-xs text-fg-soft font-ar" dir="rtl">{t("page_title_ar")}</div>
        </div>
        <div className="w-10" />
      </header>

      <main className="max-w-5xl mx-auto px-5 md:px-8 py-6">
        {/* Hero */}
        <section className="mb-7 bg-gradient-to-br from-navy to-navy/90 text-cream rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute -bottom-4 -end-3 text-7xl opacity-90">🇬🇧</div>
          <div className="relative">
            <div className="text-xs uppercase tracking-widest text-gold font-bold mb-1.5">English</div>
            <p className="text-xl font-bold leading-tight max-w-[75%]">{t("hero_title")}</p>
            <p className="text-sm opacity-80 mt-2 max-w-[75%]">{t("hero_subtitle")}</p>
          </div>
        </section>

        <div className="space-y-7">
          <SubGroup label={t("lessons_title")} sub={t("lessons_sub")}>
            {lessonTiles.map((tile) => (
              <Tile key={tile.href} href={tile.href} emoji={tile.emoji} title={tile.title} sub={tile.sub} color={tile.color} />
            ))}
          </SubGroup>

          <SubGroup label={t("games_title")} sub={t("games_sub")}>
            {gameTiles.map((tile) => (
              <Tile key={tile.href} href={tile.href} emoji={tile.emoji} title={tile.title} sub={tile.sub} color={tile.color} />
            ))}
          </SubGroup>

          <SubGroup label={t("quiz_title")} sub={t("quiz_sub")}>
            {quizTiles.map((tile) => (
              <Tile key={tile.href} href={tile.href} emoji={tile.emoji} title={tile.title} sub={tile.sub} color={tile.color} />
            ))}
          </SubGroup>

          <SubGroup label={t("stories_title")} sub={t("stories_sub")}>
            {storyTiles.map((tile) => (
              <Tile key={tile.href} href={tile.href} emoji={tile.emoji} title={tile.title} sub={tile.sub} color={tile.color} />
            ))}
          </SubGroup>
        </div>
      </main>
    </div>
  );
}

function SubGroup({
  label, sub, children,
}: {
  label: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-baseline justify-between mb-3 ms-1">
        <h2 className="text-base font-bold text-navy uppercase tracking-wide">{label}</h2>
        <span className="text-xs text-fg-soft">{sub}</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {children}
      </div>
    </section>
  );
}

function Tile({
  href, emoji, title, sub, color,
}: {
  href: string;
  emoji: string;
  title: string;
  sub: string;
  color: string;
}) {
  return (
    <Link
      href={href as never}
      className={`${color} rounded-3xl aspect-[4/3] p-4 md:p-5 flex flex-col items-center justify-center text-center gap-1.5 active:scale-95 hover:scale-[1.03] hover:shadow-card-hover transition-all`}
    >
      <span className="text-4xl md:text-5xl">{emoji}</span>
      <span className="font-bold text-sm md:text-base leading-tight">{title}</span>
      <span className="text-[11px] opacity-70 leading-tight">{sub}</span>
    </Link>
  );
}
