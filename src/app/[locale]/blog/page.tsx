import { getLocale } from "next-intl/server";
import { PageShell } from "@/components/landing/PageShell";
import { EmailCapture } from "@/components/EmailCapture";
import { Link } from "@/i18n/routing";
import { ARTICLES, formatDate } from "@/lib/blog-articles";

export const metadata = {
  title: "Blog",
  description: "Conseils, retours d'expérience, et actualités de la plateforme éducative algérienne.",
};

export default async function BlogPage() {
  const locale = await getLocale();
  const articles = [...ARTICLES].sort((a, b) => b.date.localeCompare(a.date));
  const [featured, ...rest] = articles;

  return (
    <PageShell>
      {/* HERO */}
      <section className="bg-surface-2 py-16 md:py-20 text-center">
        <div className="container-x max-w-3xl">
          <span className="eyebrow mb-3 block">Blog Najaح</span>
          <h1 className="text-[clamp(32px,5vw,48px)] font-bold tracking-tight text-fg mb-4 leading-tight">
            Conseils pour parents et élèves
          </h1>
          <p className="text-lg text-fg-soft">
            Réussite scolaire, motivation, examens : nos articles pour accompagner
            la scolarité de votre enfant en Algérie.
          </p>
        </div>
      </section>

      {/* ARTICLES */}
      <section className="py-14 bg-surface">
        <div className="container-x max-w-5xl">
          {/* Featured */}
          {featured && (
            <Link
              href={`/blog/${featured.slug}` as never}
              className="block bg-surface-2 border border-line rounded-card overflow-hidden hover:shadow-card-hover hover:border-transparent transition-all mb-8 group"
            >
              <div className="md:flex">
                <div className="md:w-2/5 bg-navy flex items-center justify-center py-12 md:py-0">
                  <span className="text-6xl font-bold text-gold">{featured.title.charAt(0)}</span>
                </div>
                <div className="md:w-3/5 p-7 md:p-9">
                  <span className="text-xs font-semibold text-gold uppercase tracking-wider">
                    {featured.category}
                  </span>
                  <h2 className="text-2xl font-bold text-fg mt-2 mb-3 leading-tight group-hover:text-gold transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-fg-soft text-base mb-5 leading-relaxed">{featured.excerpt}</p>
                  <div className="flex items-center gap-3 text-xs text-fg-faint">
                    <span>{formatDate(featured.date, locale)}</span>
                    <span>·</span>
                    <span>{featured.readMinutes} min de lecture</span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Grid */}
          <div className="grid md:grid-cols-3 gap-5">
            {rest.map((a) => (
              <Link
                key={a.slug}
                href={`/blog/${a.slug}` as never}
                className="bg-surface border border-line rounded-card overflow-hidden hover:shadow-card-hover hover:-translate-y-0.5 hover:border-transparent transition-all group flex flex-col"
              >
                <div className="bg-surface-2 border-b border-line flex items-center justify-center py-8">
                  <span className="text-4xl font-bold text-fg-faint">{a.title.charAt(0)}</span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <span className="text-[11px] font-semibold text-gold uppercase tracking-wider">
                    {a.category}
                  </span>
                  <h3 className="text-base font-bold text-fg mt-1.5 mb-2 leading-snug group-hover:text-gold transition-colors">
                    {a.title}
                  </h3>
                  <p className="text-sm text-fg-soft leading-relaxed flex-1">{a.excerpt}</p>
                  <div className="flex items-center gap-2 text-xs text-fg-faint mt-4">
                    <span>{formatDate(a.date, locale)}</span>
                    <span>·</span>
                    <span>{a.readMinutes} min</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-16 bg-surface-2 border-t border-line">
        <div className="container-x max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-fg mb-3">Reçois nos conseils par email</h2>
          <p className="text-fg-soft mb-6">
            Un article utile de temps en temps, jamais de spam.
          </p>
          <div className="flex justify-center">
            <EmailCapture />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
