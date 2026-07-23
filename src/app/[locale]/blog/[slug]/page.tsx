import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import type { Metadata } from "next";
import { PageShell } from "@/components/landing/PageShell";
import { Link } from "@/i18n/routing";
import { ARTICLES, getArticle, formatDate } from "@/lib/blog-articles";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Article introuvable" };
  return { title: `${article.title} — Blog Najaح`, description: article.excerpt };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const article = getArticle(slug);
  if (!article) notFound();

  const related = ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 2);

  return (
    <PageShell>
      <article className="py-12 md:py-16">
        <div className="container-x max-w-2xl">
          <Link href="/blog" className="text-sm text-fg-soft hover:text-fg inline-flex items-center gap-1 mb-8">
            ← Retour au blog
          </Link>

          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-surface-3 flex items-center justify-center text-3xl font-bold text-gold">{article.title.charAt(0)}</div>
            <span className="text-xs font-semibold text-gold uppercase tracking-wider">
              {article.category}
            </span>
            <h1 className="text-[clamp(26px,4vw,38px)] font-bold text-fg mt-3 mb-4 leading-tight">
              {article.title}
            </h1>
            <div className="flex items-center justify-center gap-3 text-sm text-fg-faint">
              <span>{article.author}</span>
              <span>·</span>
              <span>{formatDate(article.date, locale)}</span>
              <span>·</span>
              <span>{article.readMinutes} min de lecture</span>
            </div>
          </div>

          {/* Lead */}
          <p className="text-lg text-fg-soft leading-relaxed border-s-2 border-gold ps-5 mb-10">
            {article.excerpt}
          </p>

          {/* Body */}
          <div className="space-y-8">
            {article.sections.map((section, i) => (
              <section key={i}>
                <h2 className="text-xl font-bold text-fg mb-3 leading-snug">{section.heading}</h2>
                <div className="space-y-4">
                  {section.paragraphs.map((p, j) => (
                    <p key={j} className="text-fg text-base leading-relaxed">{p}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 bg-navy rounded-card p-7 text-center">
            <h3 className="text-white text-lg font-bold mb-2">
              Accompagnez votre enfant avec Najaح
            </h3>
            <p className="text-white/70 text-sm mb-5">
              Cours, quiz et examens blancs alignés sur le programme algérien officiel.
            </p>
            <Link href="/inscription" className="btn bg-gold text-navy hover:bg-gold-soft">
              Commencer gratuitement →
            </Link>
          </div>
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="py-14 bg-surface-2 border-t border-line">
          <div className="container-x max-w-2xl">
            <h2 className="text-lg font-bold text-fg mb-5">À lire aussi</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {related.map((a) => (
                <Link
                  key={a.slug}
                  href={`/blog/${a.slug}` as never}
                  className="bg-surface border border-line rounded-card p-5 hover:border-gold hover:shadow-card-hover transition-all group flex gap-4 items-start"
                >
                  <span className="w-10 h-10 flex-shrink-0 rounded-lg bg-surface-3 flex items-center justify-center text-lg font-bold text-fg-faint">{a.title.charAt(0)}</span>
                  <div>
                    <h3 className="text-sm font-bold text-fg leading-snug group-hover:text-gold transition-colors">
                      {a.title}
                    </h3>
                    <p className="text-xs text-fg-faint mt-1">{a.readMinutes} min de lecture</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </PageShell>
  );
}
