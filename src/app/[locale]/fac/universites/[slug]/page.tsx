/**
 * /fac/universites/[slug] — single university detail page.
 *
 * Editorial style: monogram avatar, surface/line tokens, no emoji.
 */
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { PageShell } from "@/components/landing/PageShell";
import { Link } from "@/i18n/routing";
import { UNIVERSITIES } from "@/components/app/fac/universities";
import { ArrowRightIcon, MapPinIcon, HandshakeIcon } from "@/components/Icon";

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

  const related = UNIVERSITIES
    .filter((x) => x.slug !== u.slug && x.domains.some((d) => u.domains.includes(d)))
    .slice(0, 4);

  const monogram = (u.short || u.name_fr).slice(0, 3).toUpperCase();

  return (
    <PageShell active="fac">
      {/* Breadcrumb */}
      <section className="py-6 bg-surface border-b border-line">
        <div className="container-x max-w-4xl">
          <Link href="/fac/universites" className="text-xs text-fg-soft hover:text-fg inline-flex items-center gap-1">
            ← {t("back_to_unis")}
          </Link>
        </div>
      </section>

      {/* Hero */}
      <section className="py-16 md:py-20 bg-surface-2">
        <div className="container-x max-w-4xl">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-card bg-surface-3 text-fg font-bold text-base inline-flex items-center justify-center flex-shrink-0">
              {monogram}
            </div>
            <div className="flex-1 min-w-0">
              <span className="eyebrow mb-2 block">{u.short}</span>
              <h1 className="text-[clamp(24px,3.5vw,38px)] font-bold tracking-tight text-fg leading-tight">
                {isAr ? u.name_ar : u.name_fr}
              </h1>
              <div className="flex items-center gap-1.5 text-sm text-fg-soft mt-2">
                <MapPinIcon size={14} />
                <span>{u.city}</span>
              </div>
              <p className="text-base md:text-lg text-fg mt-4 max-w-prose">
                {isAr ? u.highlight_ar : u.highlight_fr}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-surface">
        <div className="container-x max-w-4xl">
          <div className="grid grid-cols-3 gap-4">
            <Stat label={t("stat_min_avg")} value={u.min_avg !== undefined ? `${u.min_avg}+` : "—"} />
            <Stat label={t("stat_streams")} value={String(u.streams.length)} />
            <Stat label={t("stat_domains")} value={String(u.domains.length)} />
          </div>
        </div>
      </section>

      {/* Two-column detail */}
      <section className="py-12 bg-surface">
        <div className="container-x max-w-4xl">
          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-surface border border-line rounded-card p-6">
              <h2 className="font-semibold text-fg mb-3">{t("section_streams")}</h2>
              <div className="flex flex-wrap gap-2">
                {u.streams.map((s) => (
                  <span key={s} className="text-xs font-medium bg-surface-3 text-fg px-3 py-1.5 rounded-full border border-line">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-surface border border-line rounded-card p-6">
              <h2 className="font-semibold text-fg mb-3">{t("section_domains")}</h2>
              <div className="flex flex-wrap gap-2">
                {u.domains.map((d) => (
                  <span key={d} className="text-xs font-medium bg-surface-3 text-fg px-3 py-1.5 rounded-full border border-line">
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="accent-block py-14">
        <div className="container-x max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
            {t("uni_cta_text")}
          </h2>
          <Link href="/fac/services" className="btn btn-secondary btn-lg inline-flex items-center gap-2">
            <HandshakeIcon size={18} /> {t("uni_cta_button")}
          </Link>
        </div>
      </section>

      {/* Related universities */}
      {related.length > 0 && (
        <section className="py-16 bg-surface-2">
          <div className="container-x max-w-4xl">
            <h2 className="font-bold text-fg text-xl mb-5">{t("section_related")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {related.map((r) => {
                const m = (r.short || r.name_fr).slice(0, 3).toUpperCase();
                return (
                  <Link
                    key={r.slug}
                    href={`/fac/universites/${r.slug}` as never}
                    className="bg-surface border border-line rounded-card p-4 hover:shadow-card-hover hover:border-fg/40 transition flex items-center gap-3"
                  >
                    <div className="w-11 h-11 rounded-[10px] bg-surface-3 text-fg font-bold text-xs inline-flex items-center justify-center flex-shrink-0">
                      {m}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-fg text-sm leading-tight">
                        {isAr ? r.name_ar : r.name_fr}
                      </div>
                      <div className="text-xs text-fg-soft mt-0.5">{r.city}</div>
                    </div>
                    <ArrowRightIcon size={14} className="text-fg-faint flex-shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </PageShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface border border-line rounded-card p-5 text-center">
      <div className="text-3xl md:text-4xl font-bold text-fg leading-none">{value}</div>
      <div className="text-xs text-fg-faint uppercase tracking-wider mt-2">{label}</div>
    </div>
  );
}
