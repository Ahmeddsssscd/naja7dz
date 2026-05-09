/**
 * /fac/universites/[slug] — single university detail page.
 *
 * Dynamic route fed from UNIVERSITIES catalogue. Returns 404 if unknown.
 */
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { UNIVERSITIES } from "@/components/app/fac/universities";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const u = UNIVERSITIES.find((x) => x.slug === slug);
  return { title: u?.name_fr ?? "Université" };
}

export default async function UniversityDetail({ params }: Props) {
  const { slug } = await params;
  const u = UNIVERSITIES.find((x) => x.slug === slug);
  if (!u) notFound();

  const t = await getTranslations("Fac");
  const locale = await getLocale();
  const isAr = locale === "ar";

  // Recommend related unis sharing at least 1 domain
  const related = UNIVERSITIES
    .filter((x) => x.slug !== u.slug && x.domains.some((d) => u.domains.includes(d)))
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-cream pb-12">
      <header className="px-5 lg:px-8 pt-5 pb-4 max-w-3xl mx-auto">
        <Link href="/fac/universites" className="text-xs text-fg-soft hover:text-navy">← {t("back_to_unis")}</Link>
      </header>

      <main className="max-w-3xl mx-auto px-5 lg:px-8 space-y-5">
        {/* Hero */}
        <div className="bg-white rounded-3xl border border-pale-blue p-6 md:p-8">
          <div className="flex items-start gap-4">
            <span className="text-6xl">{u.emoji ?? "🎓"}</span>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold text-navy leading-tight">
                {isAr ? u.name_ar : u.name_fr}
              </h1>
              <p className="text-sm text-fg-soft mt-1">📍 {u.city}</p>
              <p className="text-base text-navy mt-3">{isAr ? u.highlight_ar : u.highlight_fr}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Stat label={t("stat_min_avg")} value={u.min_avg !== undefined ? `${u.min_avg}+` : "—"} />
          <Stat label={t("stat_streams")} value={String(u.streams.length)} />
          <Stat label={t("stat_domains")} value={String(u.domains.length)} />
        </div>

        {/* Streams */}
        <div className="bg-white rounded-3xl border border-pale-blue p-5">
          <h2 className="font-bold text-navy mb-2">{t("section_streams")}</h2>
          <div className="flex flex-wrap gap-2">
            {u.streams.map((s) => (
              <span key={s} className="text-xs font-bold bg-gold/20 text-navy px-3 py-1.5 rounded-full">{s}</span>
            ))}
          </div>
        </div>

        {/* Domains */}
        <div className="bg-white rounded-3xl border border-pale-blue p-5">
          <h2 className="font-bold text-navy mb-2">{t("section_domains")}</h2>
          <div className="flex flex-wrap gap-2">
            {u.domains.map((d) => (
              <span key={d} className="text-xs font-bold bg-pale-blue/40 text-navy px-3 py-1.5 rounded-full">{d}</span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-navy text-cream rounded-3xl p-6 text-center">
          <p className="text-sm md:text-base mb-3">{t("uni_cta_text")}</p>
          <Link href="/fac/services" className="bg-gold text-navy font-bold rounded-full px-5 py-2.5 inline-block hover:bg-gold/80 transition">
            {t("uni_cta_button")} →
          </Link>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h2 className="font-bold text-navy text-lg mb-3">{t("section_related")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {related.map((r) => (
                <Link key={r.slug} href={`/fac/universites/${r.slug}` as never}
                  className="bg-white border border-pale-blue rounded-2xl p-3 hover:border-gold hover:shadow-card-hover transition flex items-center gap-3"
                >
                  <span className="text-3xl">{r.emoji ?? "🎓"}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-navy text-sm leading-tight">{isAr ? r.name_ar : r.name_fr}</div>
                    <div className="text-xs text-fg-soft">{r.city}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-2xl border border-pale-blue p-4 text-center">
      <div className="text-3xl font-bold text-gold">{value}</div>
      <div className="text-xs text-fg-soft uppercase tracking-wider mt-1">{label}</div>
    </div>
  );
}
