/**
 * /parent/universite — University-prep hub inside the parent dashboard.
 *
 * Helps parents understand the Algerian university landscape and plan their
 * children's academic path. Links to the full /fac guide for more detail.
 */

import { redirect } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/app/AppShell";
import { Link } from "@/i18n/routing";
import { UNIVERSITIES } from "@/components/app/fac/universities";

export const metadata = { title: "Université — Espace parent" };

export default async function ParentUniversitePage() {
  const t = await getTranslations("ParentUni");
  const locale = await getLocale();
  const isAr = locale === "ar";
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: children } = await supabase
    .from("children")
    .select("id, full_name, grade")
    .eq("parent_id", user.id)
    .order("created_at");

  const kids = children ?? [];

  // Show top 6 universities sorted by min_avg desc
  const topUnis = [...UNIVERSITIES]
    .sort((a, b) => (b.min_avg ?? 0) - (a.min_avg ?? 0))
    .slice(0, 6);

  return (
    <AppShell active="fac">
      <div className="max-w-5xl mx-auto">

        {/* Hero */}
        <div className="mb-8">
          <p className="eyebrow mb-2">{isAr ? "مسار التحضير" : "Préparation universitaire"}</p>
          <h1 className="text-2xl md:text-3xl font-bold text-fg mb-2">
            {isAr ? "جامعات الجزائر" : "Les universités algériennes"}
          </h1>
          <p className="text-fg-soft text-sm md:text-base max-w-2xl">
            {isAr
              ? "ساعد ابنك على التخطيط لمستقبله الجامعي — اكتشف الجامعات، متطلبات القبول، والتخصصات المتاحة."
              : "Aidez votre enfant à planifier son avenir universitaire — découvrez les établissements, les moyennes requises et les filières disponibles."}
          </p>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <Link
            href="/fac"
            className="bg-navy text-white rounded-2xl p-5 flex flex-col gap-2 hover:bg-navy/90 transition group"
          >
            <span className="text-2xl">🎓</span>
            <div className="font-bold text-base">
              {isAr ? "دليل الباكالوريا" : "Guide DZ-Fac"}
            </div>
            <div className="text-sm text-white/70 group-hover:text-white/90 transition">
              {isAr ? "كل ما تحتاجه عن التوجيه الجامعي" : "Tout sur l'orientation universitaire algérienne"}
            </div>
          </Link>

          <Link
            href="/fac/diagnostic"
            className="bg-gold/20 dark:bg-gold/10 border border-gold/30 rounded-2xl p-5 flex flex-col gap-2 hover:bg-gold/30 transition group"
          >
            <span className="text-2xl">🔍</span>
            <div className="font-bold text-base text-fg">
              {isAr ? "التشخيص المهني" : "Diagnostic orientation"}
            </div>
            <div className="text-sm text-fg-soft">
              {isAr ? "اكتشف الفلير المناسب لطفلك" : "Trouvez la filière idéale pour votre enfant"}
            </div>
          </Link>

          <Link
            href="/fac/universites"
            className="bg-surface border border-line rounded-2xl p-5 flex flex-col gap-2 hover:bg-surface-3 transition group"
          >
            <span className="text-2xl">🏫</span>
            <div className="font-bold text-base text-fg">
              {isAr ? "كل الجامعات" : "Toutes les universités"}
            </div>
            <div className="text-sm text-fg-soft">
              {isAr ? `${UNIVERSITIES.length} جامعة جزائرية` : `${UNIVERSITIES.length} établissements`}
            </div>
          </Link>
        </div>

        {/* Children quick recap (if any) */}
        {kids.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-bold text-fg mb-4">
              {isAr ? "أبناؤك" : "Mes enfants"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {kids.map(kid => (
                <div key={kid.id} className="bg-surface border border-line rounded-xl p-4 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-navy text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                    {kid.full_name.split(" ").map((s: string) => s[0]).slice(0, 2).join("")}
                  </span>
                  <div className="min-w-0">
                    <div className="font-semibold text-fg text-sm truncate">{kid.full_name}</div>
                    {kid.grade && (
                      <div className="text-xs text-fg-soft">{kid.grade}</div>
                    )}
                  </div>
                  <Link
                    href="/fac/diagnostic"
                    className="ms-auto text-xs font-semibold text-navy dark:text-gold hover:underline flex-shrink-0"
                  >
                    {isAr ? "تشخيص" : "Diagnostiquer"}
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Top universities preview */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-fg">
              {isAr ? "أبرز الجامعات" : "Universités à la une"}
            </h2>
            <Link
              href="/fac/universites"
              className="text-sm font-semibold text-navy dark:text-gold hover:underline"
            >
              {isAr ? "عرض الكل" : "Voir tout"}
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topUnis.map(uni => (
              <Link
                key={uni.slug}
                href={`/fac/universites/${uni.slug}` as never}
                className="bg-surface border border-line rounded-xl p-4 hover:shadow-card-hover hover:border-navy/20 transition group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-10 h-10 rounded-lg bg-navy/10 dark:bg-navy/30 flex items-center justify-center font-bold text-navy dark:text-gold text-sm flex-shrink-0">
                    {uni.short.slice(0, 3)}
                  </span>
                  <div className="min-w-0">
                    <div className="font-semibold text-fg text-sm leading-tight truncate">
                      {isAr ? uni.name_ar : uni.name_fr}
                    </div>
                    <div className="text-xs text-fg-soft">{uni.city}</div>
                  </div>
                </div>
                <p className="text-xs text-fg-soft line-clamp-2 mb-3">
                  {isAr ? uni.highlight_ar : uni.highlight_fr}
                </p>
                {uni.min_avg && (
                  <div className="inline-flex items-center gap-1.5 bg-gold/10 dark:bg-gold/20 text-navy dark:text-gold rounded-full px-2.5 py-1 text-[11px] font-semibold">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                    {isAr ? `المعدل المطلوب: ${uni.min_avg}/20` : `Moy. ~${uni.min_avg}/20`}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-10 py-8 border-t border-line text-center">
          <p className="text-fg-soft text-sm mb-3">
            {isAr
              ? "هل تريد معرفة المزيد عن التوجيه الجامعي في الجزائر؟"
              : "Vous voulez en savoir plus sur l'orientation en Algérie ?"}
          </p>
          <Link
            href="/fac"
            className="inline-flex items-center gap-2 bg-navy text-white px-5 py-2.5 rounded-btn text-sm font-semibold hover:bg-navy/90 transition"
          >
            {isAr ? "استكشاف دليل الجامعات الكامل" : "Explorer le guide complet DZ-Fac"}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>

      </div>
    </AppShell>
  );
}
