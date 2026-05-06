import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { PageShell } from "@/components/landing/PageShell";

export const metadata = {
  title: "À propos",
  description: "Notre mission : aider les enfants algériens à réussir, du primaire au Bac.",
};

export default function AboutPage() {
  const t = useTranslations("AboutPage");
  return (
    <PageShell>
      {/* HERO */}
      <section className="bg-surface-2 py-20 md:py-26">
        <div className="container-x max-w-3xl text-center">
          <span className="eyebrow mb-3 block">{t("eyebrow")}</span>
          <h1 className="text-[clamp(34px,5vw,52px)] font-bold tracking-tight text-fg mb-5 leading-tight">
            {t("title")}
          </h1>
          <p className="text-lg text-fg-soft">{t("lead")}</p>
        </div>
      </section>

      {/* STORY */}
      <section className="py-20 bg-surface">
        <div className="container-x max-w-3xl prose-najah">
          <h2>{t("s1_title")}</h2>
          <p>{t("s1_p1")}</p>
          <p>{t("s1_p2")}</p>

          <h2>{t("s2_title")}</h2>
          <ul>
            {[1, 2, 3, 4, 5].map((n) => (
              <li key={n}>
                <strong>{t(`s2_li${n}_strong`)}</strong> {t(`s2_li${n}`)}
              </li>
            ))}
          </ul>

          <h2>{t("s3_title")}</h2>
          <p>{t("s3_p1")}</p>
          <p>{t("s3_p2")}</p>

          <h2>{t("s4_title")}</h2>
          <p>{t("s4_p1")}</p>
        </div>
      </section>

      {/* CTA */}
      <section className="accent-block py-20 text-center">
        <div className="container-x">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 max-w-2xl mx-auto">
            {t("cta_title")}
          </h2>
          <Link href="/inscription" className="btn btn-secondary btn-lg mt-2">
            {t("cta_button")}
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
