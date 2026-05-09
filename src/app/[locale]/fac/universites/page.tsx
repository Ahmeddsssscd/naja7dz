/**
 * /fac/universites — full catalogue of Algerian universities.
 *
 * Searchable + filterable card grid. Each card links to a detail page.
 */
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { UNIVERSITIES } from "@/components/app/fac/universities";

export const metadata = { title: "Universités algériennes" };

export default async function UniversitiesPage() {
  const t = await getTranslations("Fac");
  const locale = await getLocale();
  const isAr = locale === "ar";

  // Sort by min_avg DESC so the most competitive show first — gives the
  // page an aspirational feel ("here's where the top kids go").
  const sorted = [...UNIVERSITIES].sort((a, b) => (b.min_avg ?? 0) - (a.min_avg ?? 0));

  return (
    <div className="min-h-screen bg-cream pb-12">
      <header className="px-5 lg:px-8 pt-5 pb-4 max-w-5xl mx-auto">
        <Link href="/fac" className="text-xs text-fg-soft hover:text-navy">← {t("back_to_fac")}</Link>
        <h1 className="text-2xl md:text-3xl font-bold text-navy mt-2">🏛️ {t("unis_page_title")}</h1>
        <p className="text-sm text-fg-soft mt-1">{t("unis_page_sub", { count: UNIVERSITIES.length })}</p>
      </header>

      <main className="max-w-5xl mx-auto px-5 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {sorted.map((u) => (
            <Link key={u.slug} href={`/fac/universites/${u.slug}` as never}
              className="bg-white border border-pale-blue rounded-2xl p-4 hover:border-gold hover:shadow-card-hover transition active:scale-[0.99]"
            >
              <div className="flex items-start gap-3">
                <span className="text-4xl flex-shrink-0">{u.emoji ?? "🎓"}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {u.min_avg !== undefined && (
                      <span className="text-[10px] font-bold text-gold bg-gold/15 px-2 py-0.5 rounded-full">
                        {isAr ? "معدل ≥" : "Moy. ≥"} {u.min_avg}
                      </span>
                    )}
                    <span className="text-xs text-fg-soft">{u.city}</span>
                  </div>
                  <h3 className="font-bold text-navy text-base leading-tight mt-1">
                    {isAr ? u.name_ar : u.name_fr}
                  </h3>
                  <p className="text-xs md:text-sm text-fg-soft mt-1.5 line-clamp-2">
                    {isAr ? u.highlight_ar : u.highlight_fr}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {u.domains.slice(0, 3).map((d) => (
                      <span key={d} className="text-[10px] bg-pale-blue/40 text-navy px-2 py-0.5 rounded-full font-mono">{d}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/fac/diagnostic" className="btn btn-primary">
            🎯 {t("cta_diagnostic")} →
          </Link>
        </div>
      </main>
    </div>
  );
}
