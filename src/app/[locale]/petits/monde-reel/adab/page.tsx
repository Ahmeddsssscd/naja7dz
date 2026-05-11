import { redirect } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/routing";
import { requireKidsAccess } from "@/lib/subscriptions";

export const metadata = { title: "Manières" };

export default async function AdabPage() {
  const t = await getTranslations("PetitsAdab");
  const locale = await getLocale();
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  // Hard paywall: kids universe is full-tier only.
  await requireKidsAccess(user.id);

  const admin = createAdminClient();
  const { data: lessons } = await admin.from("adab_lessons").select("*").order("sort_order");
  const isAr = locale === "ar";

  return (
    <div className="min-h-screen bg-cream dark:bg-surface-2 pb-12">
      <header className="px-5 py-4 flex items-center justify-between bg-surface border-b border-line">
        <Link href="/petits" className="w-10 h-10 rounded-full hover:bg-pale-blue/40 flex items-center justify-center text-navy" aria-label={t("back")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </Link>
        <h1 className="font-bold text-navy">{t("page_title")}</h1>
        <div className="w-10" />
      </header>

      <main className="max-w-md mx-auto px-5 py-6">
        <p className="text-fg-soft text-center mb-6">{t("subtitle")}</p>

        <div className="space-y-3">
          {(lessons ?? []).map((l, i) => (
            <article key={l.id} className="bg-surface border-2 border-pale-blue rounded-2xl p-5">
              <div className="flex items-start gap-4">
                <span className="w-10 h-10 rounded-full bg-gold text-navy font-bold text-sm flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1">
                  {/* Show locale-preferred title first, fall back to the other lang */}
                  <h2 className="font-bold text-navy mb-1" {...(isAr ? { dir: "rtl" as const } : {})}>
                    {(isAr ? l.title_ar : l.title_fr) || l.title_fr || l.title_ar}
                  </h2>
                  <p className="text-sm text-fg leading-relaxed" {...(isAr ? { dir: "rtl" as const } : {})}>
                    {(isAr ? l.body_ar : l.body_fr) || l.body_fr || l.body_ar}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
        {(!lessons || lessons.length === 0) && (
          <div className="bg-surface border border-pale-blue rounded-card p-8 text-center text-fg-soft">
            {t("no_lessons")}
          </div>
        )}
      </main>
    </div>
  );
}
