/**
 * /fac — Faculté hub.
 *
 * Professional editorial style matching /pour-les-parents — PageShell,
 * stroke-only icons, no emoji, eyebrow + tracking-tight headings,
 * bordered cards, accent-block CTA at the bottom.
 *
 * Three sub-areas: /fac/diagnostic, /fac/universites, /fac/services.
 */
import { getTranslations } from "next-intl/server";
import { PageShell } from "@/components/landing/PageShell";
import { Link } from "@/i18n/routing";
import {
  CompassIcon,
  BuildingIcon,
  HandshakeIcon,
  CheckIcon,
  ArrowRightIcon,
} from "@/components/Icon";

export const metadata = { title: "Section Faculté" };

export default async function FacHub() {
  const t = await getTranslations("Fac");

  return (
    <PageShell active="fac">
      {/* Hero */}
      <section className="py-20 md:py-30 bg-surface-2">
        <div className="container-x max-w-4xl text-center">
          <span className="eyebrow mb-3 block">{t("eyebrow")}</span>
          <h1 className="text-[clamp(34px,5vw,52px)] font-bold tracking-tight text-fg mb-4">
            {t("page_title")}
          </h1>
          <p className="text-lg text-fg-soft max-w-2xl mx-auto">{t("page_sub")}</p>
        </div>
      </section>

      {/* 3 main cards — same shape as the Parents page pillars */}
      <section className="py-20 bg-surface">
        <div className="container-x">
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card
              icon={<CompassIcon />}
              title={t("card_diagnostic_title")}
              text={t("card_diagnostic_sub")}
              tag={t("card_diagnostic_tag")}
              href="/fac/diagnostic"
              cta={t("cta_diagnostic")}
            />
            <Card
              icon={<BuildingIcon />}
              title={t("card_unis_title")}
              text={t("card_unis_sub")}
              tag={t("card_unis_tag")}
              href="/fac/universites"
              cta={t("cta_catalogue")}
            />
            <Card
              icon={<HandshakeIcon />}
              title={t("card_services_title")}
              text={t("card_services_sub")}
              tag={t("card_services_tag")}
              href="/fac/services"
              cta={t("services_login_cta")}
            />
          </div>
        </div>
      </section>

      {/* "Ce que tu peux faire ici" — editorial info block */}
      <section className="py-20 bg-surface-2">
        <div className="container-x max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-fg mb-6 text-center">
            {t("info_title")}
          </h2>
          <ul className="space-y-3">
            {[t("info_1"), t("info_2"), t("info_3"), t("info_4")].map((item, i) => (
              <li key={i} className="flex gap-3 items-start bg-surface border border-line rounded-card p-4">
                <CheckIcon size={20} className="mt-0.5 flex-shrink-0 text-gold" />
                <span className="text-fg">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="accent-block py-20 text-center">
        <div className="container-x">
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4 max-w-2xl mx-auto">
            {t("cta_title")}
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-prose mx-auto">{t("cta_sub")}</p>
          <Link href="/fac/diagnostic" className="btn btn-secondary btn-lg">
            {t("cta_diagnostic")}
          </Link>
        </div>
      </section>
    </PageShell>
  );
}

function Card({
  icon, title, text, tag, href, cta,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  tag: string;
  href: string;
  cta: string;
}) {
  return (
    <article className="bg-surface border border-line rounded-card p-7 flex flex-col hover:shadow-card-hover hover:border-transparent transition-all duration-200">
      <div className="w-11 h-11 rounded-[10px] bg-surface-3 text-fg inline-flex items-center justify-center mb-5">
        {icon}
      </div>
      <span className="text-xs font-semibold text-fg-faint uppercase tracking-wider mb-2">{tag}</span>
      <h3 className="text-lg font-semibold text-fg mb-2">{title}</h3>
      <p className="text-base text-fg-soft mb-6 flex-1">{text}</p>
      <Link href={href as never} className="btn btn-outline w-full justify-center inline-flex items-center gap-2">
        {cta} <ArrowRightIcon size={14} />
      </Link>
    </article>
  );
}
