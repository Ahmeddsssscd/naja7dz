/**
 * /support — central support page.
 *
 * Editorial PageShell style. Three sections: contact channels, common-
 * problems FAQ, and a "We respond within 24h" trust block. Anonymous-
 * accessible — both visitors and logged-in users land here.
 */
import { getTranslations } from "next-intl/server";
import { PageShell } from "@/components/landing/PageShell";
import { Link } from "@/i18n/routing";
import {
  MailIcon,
  HandshakeIcon,
  ShieldIcon,
  ClipboardIcon,
  CheckIcon,
} from "@/components/Icon";

export const metadata = { title: "Aide & Support" };

export default async function SupportPage() {
  const t = await getTranslations("Support");

  return (
    <PageShell>
      {/* Hero */}
      <section className="py-20 md:py-26 bg-surface-2">
        <div className="container-x max-w-4xl text-center">
          <span className="eyebrow mb-3 block">{t("eyebrow")}</span>
          <h1 className="text-[clamp(34px,5vw,52px)] font-bold tracking-tight text-fg mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-fg-soft max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>
      </section>

      {/* Contact channels */}
      <section className="py-16 bg-surface">
        <div className="container-x max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-fg text-center mb-10">
            {t("channels_title")}
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            <Channel
              icon={<MailIcon />}
              title={t("ch_email_title")}
              text={t("ch_email_sub")}
              cta={t("ch_email_cta")}
              href="mailto:support@naja7dz.com"
            />
            <Channel
              icon={<ClipboardIcon />}
              title={t("ch_form_title")}
              text={t("ch_form_sub")}
              cta={t("ch_form_cta")}
              href="/contact"
            />
            <Channel
              icon={<HandshakeIcon />}
              title={t("ch_school_title")}
              text={t("ch_school_sub")}
              cta={t("ch_school_cta")}
              href="/ecole"
            />
          </div>
        </div>
      </section>

      {/* Self-serve checklist */}
      <section className="py-16 bg-surface-2">
        <div className="container-x max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-fg mb-2 text-center">
            {t("selfserve_title")}
          </h2>
          <p className="text-sm md:text-base text-fg-soft text-center mb-8">{t("selfserve_sub")}</p>
          <ul className="space-y-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <li key={i} className="flex gap-3 items-start bg-surface border border-line rounded-card p-4">
                <CheckIcon size={20} className="mt-0.5 flex-shrink-0 text-gold" />
                <div>
                  <div className="font-semibold text-fg">{t(`q${i}` as "q1")}</div>
                  <p className="text-sm text-fg-soft mt-1">{t(`a${i}` as "a1")}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Promise */}
      <section className="py-14 bg-surface">
        <div className="container-x max-w-3xl">
          <div className="bg-surface border border-line rounded-card p-7 flex items-start gap-4">
            <div className="w-12 h-12 rounded-[10px] bg-surface-3 text-fg inline-flex items-center justify-center flex-shrink-0">
              <ShieldIcon size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-fg">{t("promise_title")}</h3>
              <p className="text-sm text-fg-soft mt-1">{t("promise_text")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="accent-block py-16 text-center">
        <div className="container-x">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 max-w-2xl mx-auto leading-tight">
            {t("cta_title")}
          </h2>
          <p className="text-white/70 text-base md:text-lg mb-7 max-w-prose mx-auto">
            {t("cta_sub")}
          </p>
          <Link href="/contact" className="btn btn-secondary btn-lg">
            {t("cta_button")}
          </Link>
        </div>
      </section>
    </PageShell>
  );
}

function Channel({
  icon, title, text, cta, href,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  cta: string;
  href: string;
}) {
  return (
    <article className="bg-surface border border-line rounded-card p-7 flex flex-col hover:shadow-card-hover hover:border-transparent transition-all duration-200">
      <div className="w-11 h-11 rounded-[10px] bg-surface-3 text-fg inline-flex items-center justify-center mb-5">
        {icon}
      </div>
      <h3 className="font-semibold text-fg text-base md:text-lg mb-2">{title}</h3>
      <p className="text-sm md:text-base text-fg-soft mb-6 flex-1">{text}</p>
      <a href={href} className="btn btn-outline w-full justify-center">
        {cta}
      </a>
    </article>
  );
}
