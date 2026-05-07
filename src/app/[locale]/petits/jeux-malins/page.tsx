import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/routing";

export const metadata = { title: "Jeux malins" };

export default async function MalinsHub() {
  const t = await getTranslations("PetitsSmart");
  const tBack = await getTranslations("Petits");
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const tWS = await getTranslations("PetitsGameWordSearch");
  const tHM = await getTranslations("PetitsGameHangman");
  const tMR = await getTranslations("PetitsGameMathRace");
  const tTTT = await getTranslations("PetitsGameTicTacToe");
  const tCC = await getTranslations("PetitsGameCoinCounting");

  const tiles = [
    { href: "/petits/jeux-malins/sudoku", emoji: "🧩", title: t("tile_sudoku"), color: "bg-blue-100 dark:bg-blue-950/30 text-blue-900 dark:text-blue-100" },
    { href: "/petits/jeux-malins/memoire", emoji: "🧠", title: t("tile_memory"), color: "bg-purple-100 dark:bg-purple-950/30 text-purple-900 dark:text-purple-100" },
    { href: "/petits/jeux-malins/motifs", emoji: "🔷", title: t("tile_pattern"), color: "bg-emerald-100 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-100" },
    { href: "/petits/jeux-malins/enigme", emoji: "🤔", title: t("tile_riddle"), color: "bg-amber-100 dark:bg-amber-950/30 text-amber-900 dark:text-amber-100" },
    { href: "/petits/jeux-malins/mots-caches", emoji: "🔤", title: tWS("page_title"), color: "bg-pink-100 dark:bg-pink-950/30 text-pink-900 dark:text-pink-100" },
    { href: "/petits/jeux-malins/pendu", emoji: "🪢", title: tHM("page_title"), color: "bg-rose-100 dark:bg-rose-950/30 text-rose-900 dark:text-rose-100" },
    { href: "/petits/jeux-malins/course-maths", emoji: "🧮", title: tMR("page_title"), color: "bg-orange-100 dark:bg-orange-950/30 text-orange-900 dark:text-orange-100" },
    { href: "/petits/jeux-malins/morpion", emoji: "🦊", title: tTTT("page_title"), color: "bg-teal-100 dark:bg-teal-950/30 text-teal-900 dark:text-teal-100" },
    { href: "/petits/jeux-malins/pieces", emoji: "🪙", title: tCC("page_title"), color: "bg-yellow-100 dark:bg-yellow-950/30 text-yellow-900 dark:text-yellow-100" },
  ];

  return (
    <div className="min-h-screen bg-cream pb-12">
      <header className="px-5 py-4 flex items-center justify-between bg-white border-b border-pale-blue">
        <Link href="/petits" className="w-10 h-10 rounded-full hover:bg-pale-blue/40 flex items-center justify-center text-navy" aria-label={tBack("back")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </Link>
        <h1 className="font-bold text-navy">{t("page_title")}</h1>
        <div className="w-10" />
      </header>

      <main className="max-w-md mx-auto px-5 py-6">
        <div className="grid grid-cols-2 gap-3">
          {tiles.map((tile) => (
            <Link key={tile.href} href={tile.href as never} className={`${tile.color} rounded-3xl aspect-square p-5 flex flex-col items-center justify-center gap-3 active:scale-95 transition-transform`}>
              <span className="text-5xl">{tile.emoji}</span>
              <span className="font-bold text-center">{tile.title}</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
