import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/routing";
import { LangSwitch } from "@/components/LangSwitch";
import { ThemeToggle } from "@/components/ThemeToggle";

export const metadata = { title: "Mon univers" };

export default async function KidsHome() {
  const t = await getTranslations("Petits");
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: child } = await supabase
    .from("children").select("*").eq("parent_id", user.id).limit(1).maybeSingle();

  const firstName = child?.full_name?.split(" ")[0];

  return (
    <div className="min-h-screen bg-cream pb-12">
      {/* Top bar */}
      <header className="px-5 pt-5 pb-3 flex items-center justify-between">
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

      {/* Hero with mascot */}
      <section className="mx-5 mb-5 accent-block rounded-[28px] p-6 relative overflow-hidden">
        <div className="absolute -bottom-6 -end-3 text-7xl">🦊</div>
        <div className="relative">
          <div className="text-xs font-bold text-gold uppercase tracking-wider mb-2">{t("fennec_says")}</div>
          <p className="text-lg font-semibold leading-snug max-w-[70%]">{t("welcome")}</p>
        </div>
      </section>

      {/* 2x3 tiles */}
      <section className="grid grid-cols-2 gap-3 px-5 mb-6">
        <Tile href="/petits/coloriage" emoji="🎨" title={t("tile_coloring")} subtitle={t("tile_coloring_sub")} color="bg-pink-100 dark:bg-pink-950/30 text-pink-900 dark:text-pink-100" />
        <Tile href="/petits/maths" emoji="🧮" title={t("tile_maths")} subtitle={t("tile_maths_sub")} color="bg-blue-100 dark:bg-blue-950/30 text-blue-900 dark:text-blue-100" />
        <Tile href="/petits/jeux-malins" emoji="🧩" title={t("tile_smart")} subtitle={t("tile_smart_sub")} color="bg-emerald-100 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-100" />
        <Tile href="/petits/monde-reel" emoji="🌍" title={t("tile_world")} subtitle={t("tile_world_sub")} color="bg-amber-100 dark:bg-amber-950/30 text-amber-900 dark:text-amber-100" />
        <Tile href="/petits/lecture" emoji="📖" title={t("tile_reading")} subtitle={t("tile_reading_sub")} color="bg-purple-100 dark:bg-purple-950/30 text-purple-900 dark:text-purple-100" />
        <Tile href="/petits/quran" emoji="📿" title={t("tile_quran")} subtitle={t("tile_quran_sub")} color="bg-rose-100 dark:bg-rose-950/30 text-rose-900 dark:text-rose-100" />
      </section>
    </div>
  );
}

function Tile({
  href, emoji, title, subtitle, color,
}: { href: string; emoji: string; title: string; subtitle: string; color: string }) {
  return (
    <Link href={href as never} className={`${color} rounded-3xl p-5 aspect-square flex flex-col justify-between active:scale-95 transition-transform`}>
      <div className="text-4xl">{emoji}</div>
      <div>
        <div className="font-bold text-base">{title}</div>
        <div className="text-xs opacity-70">{subtitle}</div>
      </div>
    </Link>
  );
}
