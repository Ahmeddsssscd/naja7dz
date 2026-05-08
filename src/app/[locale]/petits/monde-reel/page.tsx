import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/routing";
import { requireKidsAccess } from "@/lib/subscriptions";

export const metadata = { title: "Le monde réel" };

export default async function MondeReelHub() {
  const t = await getTranslations("PetitsWorld");
  const tBack = await getTranslations("Petits");
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  // Hard paywall: kids universe is full-tier only.
  await requireKidsAccess(user.id);

  const tiles = [
    { href: "/petits/monde-reel/heure", emoji: "⏰", title: t("tile_clock"), subtitle: t("tile_clock_sub"), color: "bg-blue-100 dark:bg-blue-950/30 text-blue-900 dark:text-blue-100" },
    { href: "/petits/monde-reel/wilayas", emoji: "🇩🇿", title: t("tile_wilayas"), subtitle: t("tile_wilayas_sub"), color: "bg-amber-100 dark:bg-amber-950/30 text-amber-900 dark:text-amber-100" },
    { href: "/petits/monde-reel/adab", emoji: "🤲", title: t("tile_adab"), subtitle: t("tile_adab_sub"), color: "bg-emerald-100 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-100" },
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
        <div className="grid grid-cols-1 gap-3">
          {tiles.map((tile) => (
            <Link key={tile.href} href={tile.href as never} className={`${tile.color} rounded-3xl p-5 flex items-center gap-4 active:scale-95 transition-transform`}>
              <span className="text-5xl">{tile.emoji}</span>
              <div>
                <div className="font-bold text-lg">{tile.title}</div>
                <div className="text-xs opacity-70">{tile.subtitle}</div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
