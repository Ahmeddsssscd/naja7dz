import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { PageShell } from "@/components/landing/PageShell";

const ICONS: Record<string, React.ReactNode> = {
  shield: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  clock: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  report: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M8 13l3 3 5-5" />
    </svg>
  ),
  curriculum: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  lock: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  moderate: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
};

export default function PourLesParentsPage() {
  const t = useTranslations("Parents");
  const pillars = [
    { icon: "shield", title: t("p1_title"), text: t("p1_text") },
    { icon: "clock", title: t("p2_title"), text: t("p2_text") },
    { icon: "report", title: t("p3_title"), text: t("p3_text") },
    { icon: "curriculum", title: t("p4_title"), text: t("p4_text") },
    { icon: "lock", title: t("p5_title"), text: t("p5_text") },
    { icon: "moderate", title: t("p6_title"), text: t("p6_text") },
  ];

  return (
    <PageShell active="parents">
      <section className="py-20 md:py-30 bg-surface-2">
        <div className="container-x max-w-4xl text-center">
          <span className="eyebrow mb-3 block">{t("eyebrow")}</span>
          <h1 className="text-[clamp(34px,5vw,52px)] font-bold tracking-tight text-fg mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-fg-soft max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>
      </section>

      <section className="py-20 bg-surface">
        <div className="container-x">
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {pillars.map((p, i) => (
              <article
                key={i}
                className="bg-surface border border-line rounded-card p-7 hover:shadow-card-hover hover:border-transparent transition-all duration-200"
              >
                <div className="w-11 h-11 rounded-[10px] bg-surface-3 text-fg inline-flex items-center justify-center mb-5">
                  {ICONS[p.icon]}
                </div>
                <h3 className="text-lg font-semibold text-fg mb-2">{p.title}</h3>
                <p className="text-base text-fg-soft">{p.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="accent-block py-20 text-center">
        <div className="container-x">
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4 max-w-2xl mx-auto">
            Prêt à voir ton enfant najah ?
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-prose mx-auto">
            Inscription gratuite. Tu testes avant de t&apos;engager. Annulation en un clic.
          </p>
          <Link href="/inscription" className="btn btn-secondary btn-lg">
            Commencer gratuitement
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
