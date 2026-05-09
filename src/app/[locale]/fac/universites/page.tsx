/**
 * /fac/universites — full catalogue of Algerian universities.
 *
 * Editorial card grid using surface/line tokens — no emoji. The university
 * monogram (first letter of `short`) replaces the previous emoji avatar.
 */
import { getTranslations, getLocale } from "next-intl/server";
import { PageShell } from "@/components/landing/PageShell";
import { Link } from "@/i18n/routing";
import { UNIVERSITIES } from "@/components/app/fac/universities";
import { ArrowRightIcon, MapPinIcon, CompassIcon } from "@/components/Icon";

export const metadata = { title: "Universités algériennes" };

export default async function UniversitiesPage() {
  const t = await getTranslations("Fac");
  const locale = await getLocale();
  const isAr = locale === "ar";

  // Sort by min_avg DESC so the most competitive show first — gives the
  // page an aspirational feel.
  const sorted = [...UNIVERSITIES].sort((a, b) => (b.min_avg ?? 0) - (a.min_avg ?? 0));

  return (
    <PageShell active="fac">
      {/* Hero */}
      <section className="py-16 md:py-20 bg-surface-2">
        <div className="container-x max-w-4xl text-center">
          <span className="eyebrow mb-3 block">{t("eyebrow")}</span>
          <h1 className="text-[clamp(28px,4.5vw,42px)] font-bold tracking-tight text-fg mb-3">
            {t("unis_page_title")}
          </h1>
          <p className="text-base md:text-lg text-fg-soft">
            {t("unis_page_sub", { count: UNIVERSITIES.length })}
          </p>
        </div>
      </section>

      {/* Catalogue */}
      <section className="py-16 bg-surface">
        <div className="container-x max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sorted.map((u) => {
              const monogram = (u.short || u.name_fr).slice(0, 3).toUpperCase();
              return (
                <Link
                  key={u.slug}
                  href={`/fac/universites/${u.slug}` as never}
                  className="bg-surface border border-line rounded-card p-5 hover:shadow-card-hover hover:border-fg/40 transition flex flex-col"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-11 h-11 rounded-[10px] bg-surface-3 text-fg font-bold text-xs inline-flex items-center justify-center flex-shrink-0">
                      {monogram}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-fg leading-tight">
                        {isAr ? u.name_ar : u.name_fr}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-fg-soft mt-1">
                        <MapPinIcon size={12} />
                        <span>{u.city}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-fg-soft line-clamp-2 mb-3 flex-1">
                    {isAr ? u.highlight_ar : u.highlight_fr}
                  </p>

                  <div className="flex items-center justify-between border-t border-line pt-3 mt-auto">
                    <div className="flex flex-wrap gap-1.5">
                      {u.min_avg !== undefined && (
                        <span className="text-[11px] font-mono font-semibold text-fg bg-surface-3 px-2 py-0.5 rounded-full">
                          {isAr ? "معدل ≥" : "Moy. ≥"} {u.min_avg}
                        </span>
                      )}
                      <span className="text-[11px] text-fg-soft bg-surface-3 px-2 py-0.5 rounded-full">
                        {u.domains.length} {isAr ? "مجال" : "domaines"}
                      </span>
                    </div>
                    <ArrowRightIcon size={14} className="text-fg-faint flex-shrink-0" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="accent-block py-16 text-center">
        <div className="container-x">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            {isAr ? "ما زلت متردداً ؟" : "Tu hésites encore ?"}
          </h2>
          <p className="text-white/70 text-base md:text-lg mb-7 max-w-prose mx-auto">
            {isAr
              ? "خذ ٥ دقائق لإجراء التشخيص. سنقترح عليك الجامعات الأنسب لملفّك."
              : "Cinq minutes de diagnostic suffisent. On te propose les universités qui collent à ton profil."}
          </p>
          <Link href="/fac/diagnostic" className="btn btn-secondary btn-lg inline-flex items-center gap-2">
            <CompassIcon size={18} /> {t("cta_diagnostic")}
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
