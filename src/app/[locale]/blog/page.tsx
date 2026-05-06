import { useTranslations } from "next-intl";
import { PageShell } from "@/components/landing/PageShell";
import { EmailCapture } from "@/components/EmailCapture";
import { Link } from "@/i18n/routing";

export const metadata = {
  title: "Blog",
  description: "Conseils, retours d'expérience, et actualités de la plateforme éducative algérienne.",
};

const CATEGORIES = ["cat1", "cat2", "cat3"] as const;
const TOPIC_KEYS = ["t1", "t2", "t3"] as const;

export default function BlogPage() {
  const t = useTranslations("BlogPage");

  return (
    <PageShell>
      {/* HERO */}
      <section className="bg-surface-2 py-20 md:py-26 text-center">
        <div className="container-x max-w-3xl">
          <span className="eyebrow mb-3 block">{t("eyebrow")}</span>
          <h1 className="text-[clamp(34px,5vw,52px)] font-bold tracking-tight text-fg mb-5 leading-tight">
            {t("title")}
          </h1>
          <p className="text-lg text-fg-soft mb-8">{t("lead")}</p>
          <div className="flex justify-center">
            <EmailCapture />
          </div>
          <p className="text-xs text-fg-faint mt-3">{t("capture_hint")}</p>
        </div>
      </section>

      {/* ROADMAP */}
      <section className="py-20 bg-surface">
        <div className="container-x max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-fg text-center mb-3">
            {t("topics_title")}
          </h2>
          <p className="text-fg-soft text-center mb-12 max-w-2xl mx-auto">
            {t("topics_lead")}
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {CATEGORIES.map((cat) => (
              <article
                key={cat}
                className="bg-surface border border-line rounded-card p-6"
              >
                <h3 className="text-xs font-semibold text-gold uppercase tracking-[0.08em] mb-4">
                  {t(`${cat}_title`)}
                </h3>
                <ul className="space-y-3">
                  {TOPIC_KEYS.map((tk) => (
                    <li key={tk} className="text-fg text-base leading-snug">
                      {t(`${cat}_${tk}`)}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="text-center mt-14">
            <p className="text-fg-soft mb-3">{t("cta_lead")}</p>
            <Link href="/contact" className="btn btn-outline">
              {t("cta_button")}
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
