import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/routing";

export const metadata = { title: "Jeux de maths" };

const TILES = [
  { href: "/petits/maths/number-ninja", emoji: "🥷", title: "Number Ninja", color: "bg-red-100 dark:bg-red-950/30 text-red-900 dark:text-red-100" },
  { href: "/petits/maths/souk", emoji: "🛒", title: "Le Souk", color: "bg-amber-100 dark:bg-amber-950/30 text-amber-900 dark:text-amber-100" },
];

export default async function MathsHub() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  return (
    <div className="min-h-screen bg-cream pb-12">
      <header className="px-5 py-4 flex items-center justify-between bg-white border-b border-pale-blue">
        <Link href="/petits" className="w-10 h-10 rounded-full hover:bg-pale-blue/40 flex items-center justify-center text-navy" aria-label="Retour">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </Link>
        <h1 className="font-bold text-navy">Jeux de maths</h1>
        <div className="w-10" />
      </header>

      <main className="max-w-md mx-auto px-5 py-6">
        <div className="grid grid-cols-1 gap-3">
          {TILES.map((t) => (
            <Link key={t.href} href={t.href as never} className={`${t.color} rounded-3xl p-5 flex items-center gap-4 active:scale-95 transition-transform`}>
              <span className="text-5xl">{t.emoji}</span>
              <span className="font-bold text-lg">{t.title}</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
