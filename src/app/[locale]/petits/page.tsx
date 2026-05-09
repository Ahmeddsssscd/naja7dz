import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/routing";
import { LangSwitch } from "@/components/LangSwitch";
import { ThemeToggle } from "@/components/ThemeToggle";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { requireKidsAccess } from "@/lib/subscriptions";

export const metadata = { title: "Mon univers" };

export default async function KidsHome() {
  const t = await getTranslations("Petits");
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  // Hard paywall: kids universe is full-tier only (eleve / famille). Pack Bac
  // users get redirected to upgrade.
  await requireKidsAccess(user.id);

  const { data: child } = await supabase
    .from("children").select("*").eq("parent_id", user.id).limit(1).maybeSingle();

  const firstName = child?.full_name?.split(" ")[0];

  // Feature flags — admin can hide tiles from the kid universe.
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
            {(child?.full_name ?? "?").split(" ").map((s: string) => s[0]).slice(0, 2).join("")}
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

      {/* Tile grid — responsive: 2 cols mobile, 3 md, 4 lg.
          aspect-square removed so tiles size to content; min-h keeps them
          tap-friendly on mobile without exploding to 750px on desktop. */}
      <section className="max-w-5xl mx-auto mt-5 px-5 lg:px-8 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {coloringOn && <Tile href="/petits/coloriage" emoji="🎨" title={t("tile_coloring")} subtitle={t("tile_coloring_sub")} color="bg-pink-100 dark:bg-pink-950/30 text-pink-900 dark:text-pink-100" />}
          {mathsOn && <Tile href="/petits/maths" emoji="🧮" title={t("tile_maths")} subtitle={t("tile_maths_sub")} color="bg-blue-100 dark:bg-blue-950/30 text-blue-900 dark:text-blue-100" />}
          {smartOn && <Tile href="/petits/jeux-malins" emoji="🧩" title={t("tile_smart")} subtitle={t("tile_smart_sub")} color="bg-emerald-100 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-100" />}
          {worldOn && <Tile href="/petits/monde-reel" emoji="🌍" title={t("tile_world")} subtitle={t("tile_world_sub")} color="bg-amber-100 dark:bg-amber-950/30 text-amber-900 dark:text-amber-100" />}
          {readingOn && <Tile href="/petits/lecture" emoji="📖" title={t("tile_reading")} subtitle={t("tile_reading_sub")} color="bg-purple-100 dark:bg-purple-950/30 text-purple-900 dark:text-purple-100" />}
          {quranOn && <Tile href="/petits/quran" emoji="📿" title={t("tile_quran")} subtitle={t("tile_quran_sub")} color="bg-rose-100 dark:bg-rose-950/30 text-rose-900 dark:text-rose-100" />}
          {englishOn && <Tile href="/petits/anglais" emoji="🇬🇧" title={t("tile_english")} subtitle={t("tile_english_sub")} color="bg-indigo-100 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-100" />}
        </div>
      </section>
    </div>
  );
}

function Tile({
  href, emoji, title, subtitle, color,
}: { href: string; emoji: string; title: string; subtitle: string; color: string }) {
  return (
    <Link
      href={href as never}
      className={`${color} rounded-3xl p-5 min-h-[150px] md:min-h-[170px] flex flex-col justify-between gap-3 active:scale-95 hover:scale-[1.02] hover:shadow-card-hover transition-all`}
    >
      <div className="text-4xl md:text-5xl">{emoji}</div>
      <div>
        <div className="font-bold text-base md:text-lg leading-tight">{title}</div>
        <div className="text-xs md:text-sm opacity-75 mt-1 leading-snug">{subtitle}</div>
      </div>
    </Link>
  );
}
