import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/routing";
import { LangSwitch } from "@/components/LangSwitch";
import { ThemeToggle } from "@/components/ThemeToggle";

export const metadata = { title: "Mon univers — Najaح" };

export default async function KidsHome() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: child } = await supabase
    .from("children").select("*").eq("parent_id", user.id).limit(1).maybeSingle();

  return (
    <div className="min-h-screen bg-cream pb-12">
      {/* Top bar */}
      <header className="px-5 pt-5 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-12 h-12 rounded-full bg-gold text-navy text-xl font-bold flex items-center justify-center shadow-card">
            {(child?.full_name ?? "?").split(" ").map((s: string) => s[0]).slice(0, 2).join("")}
          </span>
          <div>
            <div className="font-bold text-navy text-lg">Salut {child?.full_name?.split(" ")[0] ?? "petit champion"} !</div>
            <div className="text-xs text-fg-soft">⭐ 0 étoiles · 🏆 0 trophées</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <LangSwitch />
        </div>
      </header>

      {/* Hero with mascot */}
      <section className="mx-5 mb-5 bg-navy text-white rounded-[28px] p-6 relative overflow-hidden">
        <div className="absolute -bottom-6 -end-3 text-7xl">🦊</div>
        <div className="relative">
          <div className="text-xs font-bold text-gold uppercase tracking-wider mb-2">Fennec dit</div>
          <p className="text-lg font-semibold leading-snug max-w-[70%]">
            Bienvenue ! Choisis un jeu pour commencer ton aventure.
          </p>
        </div>
      </section>

      {/* 2x2 huge tiles */}
      <section className="grid grid-cols-2 gap-3 px-5 mb-6">
        <Tile href="/petits/coloriage" emoji="🎨" title="Coloriage" subtitle="Maths cachées" color="bg-pink-100 dark:bg-pink-950/30 text-pink-900 dark:text-pink-100" />
        <Tile href="/petits/maths" emoji="🧮" title="Jeux de maths" subtitle="Ninja, détective, souk" color="bg-blue-100 dark:bg-blue-950/30 text-blue-900 dark:text-blue-100" />
        <Tile href="/petits/lecture" emoji="📖" title="Lis avec moi" subtitle="Histoires + dessins" color="bg-amber-100 dark:bg-amber-950/30 text-amber-900 dark:text-amber-100" />
        <Tile href="/petits/jeux-malins" emoji="🧩" title="Jeux malins" subtitle="Sudoku, mémoire, échecs" color="bg-emerald-100 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-100" />
      </section>

      {/* Trophy strip */}
      <section className="px-5">
        <h2 className="text-lg font-bold text-navy mb-3">Mes trophées</h2>
        <div className="flex gap-3 overflow-x-auto -mx-5 px-5 pb-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex-none w-20 h-20 bg-white border-2 border-pale-blue rounded-3xl flex items-center justify-center text-3xl text-fg-faint shadow-card">
              🔒
            </div>
          ))}
        </div>
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
