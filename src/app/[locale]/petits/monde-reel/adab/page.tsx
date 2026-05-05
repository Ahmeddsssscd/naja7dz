import { redirect } from "next/navigation";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import { useRouter } from "@/i18n/routing";
import { Link } from "@/i18n/routing";

export const metadata = { title: "Manières — Najaح" };

export default async function AdabPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const admin = createAdminClient();
  const { data: lessons } = await admin.from("adab_lessons").select("*").order("sort_order");

  return (
    <div className="min-h-screen bg-cream pb-12">
      <header className="px-5 py-4 flex items-center justify-between bg-white border-b border-pale-blue">
        <Link href="/petits" className="w-10 h-10 rounded-full hover:bg-pale-blue/40 flex items-center justify-center text-navy" aria-label="Retour">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </Link>
        <h1 className="font-bold text-navy">Bonnes manières</h1>
        <div className="w-10" />
      </header>

      <main className="max-w-md mx-auto px-5 py-6">
        <p className="text-fg-soft text-center mb-6">
          Apprends les bonnes manières du quotidien, à la maison et avec les autres.
        </p>

        <div className="space-y-3">
          {(lessons ?? []).map((l, i) => (
            <article key={l.id} className="bg-white border-2 border-pale-blue rounded-2xl p-5">
              <div className="flex items-start gap-4">
                <span className="w-10 h-10 rounded-full bg-gold text-navy font-bold text-sm flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <h2 className="font-bold text-navy mb-1">{l.title_fr}</h2>
                  {l.title_ar && <h3 className="text-sm text-fg-soft font-arabic mb-2" dir="rtl">{l.title_ar}</h3>}
                  <p className="text-sm text-fg leading-relaxed">{l.body_fr}</p>
                  {l.body_ar && (
                    <p className="text-xs text-fg-soft mt-2 font-arabic leading-relaxed" dir="rtl">{l.body_ar}</p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
        {(!lessons || lessons.length === 0) && (
          <div className="bg-white border border-pale-blue rounded-card p-8 text-center text-fg-soft">
            Pas de leçons disponibles. Applique migration 5.
          </div>
        )}
      </main>
    </div>
  );
}
