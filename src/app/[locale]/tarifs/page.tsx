import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { PageShell } from "@/components/landing/PageShell";
import { CheckIcon } from "@/components/Icon";

export default function TarifsPage() {
  return (
    <PageShell active="tarifs">
      <Hero />
      <Plans />
      <ComparisonTable />
      <TrustBar />
      <FAQTeaser />
    </PageShell>
  );
}

function Hero() {
  const t = useTranslations("Tarifs");
  const tn = useTranslations("Pricing");
  return (
    <section className="bg-surface-2 py-20 md:py-26 text-center">
      <div className="container-x max-w-3xl">
        <span className="eyebrow mb-3 block">{tn("eyebrow")}</span>
        <h1 className="text-[clamp(34px,5vw,48px)] font-bold tracking-tight text-fg mb-4">
          {t("title")}
        </h1>
        <p className="text-lg text-fg-soft">{t("subtitle")}</p>
      </div>
    </section>
  );
}

function Plans() {
  const t = useTranslations("Pricing");
  return (
    <section className="py-20 bg-surface">
      <div className="container-x">
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Plan
            planId="eleve_monthly"
            name={t("eleve_name")}
            price={t("eleve_price")}
            currency={t("eleve_currency")}
            period={t("per_month")}
            features={[t("eleve_f1"), t("eleve_f2"), t("eleve_f3"), t("eleve_f4")]}
            cta={t("eleve_cta")}
          />
          <Plan
            planId="famille_monthly"
            name={t("famille_name")}
            price={t("famille_price")}
            currency={t("famille_currency")}
            period={t("per_month")}
            features={[
              t("famille_f1"),
              t("famille_f2"),
              t("famille_f3"),
              t("famille_f4"),
              t("famille_f5"),
            ]}
            cta={t("famille_cta")}
            featured
            badge={t("popular")}
          />
          <Plan
            planId="pack_bac"
            name={t("bac_name")}
            price={t("bac_price")}
            currency={t("bac_currency")}
            period={t("one_time")}
            features={[t("bac_f1"), t("bac_f2"), t("bac_f3"), t("bac_f4")]}
            cta={t("bac_cta")}
          />
        </div>
      </div>
    </section>
  );
}

function Plan({
  planId,
  name,
  price,
  currency,
  period,
  features,
  cta,
  featured,
  badge,
}: {
  planId: string;
  name: string;
  price: string;
  currency: string;
  period: string;
  features: string[];
  cta: string;
  featured?: boolean;
  badge?: string;
}) {
  return (
    <div
      className={`relative rounded-card p-8 flex flex-col ${
        featured
          ? "bg-navy text-white border-2 border-navy dark:border-gold"
          : "bg-surface border border-line text-fg"
      }`}
    >
      {badge && (
        <span className="absolute -top-3 end-6 bg-gold text-navy text-xs font-bold px-3 py-1 rounded-full tracking-wider">
          {badge}
        </span>
      )}
      <div
        className={`text-sm font-semibold uppercase tracking-wider mb-3 ${
          featured ? "text-white/70" : "text-fg-soft"
        }`}
      >
        {name}
      </div>
      <div className={`text-4xl font-bold leading-none mb-1 ${featured ? "text-white" : "text-fg"}`}>
        {/* bdi keeps multi-token numbers (e.g. "1 990") as a single LTR atom in RTL layout */}
        <bdi>{price}</bdi> <span className="text-base font-medium">{currency}</span>
      </div>
      <div className={`text-sm mb-7 ${featured ? "text-white/65" : "text-fg-soft"}`}>{period}</div>
      <ul className="flex-1 mb-7 space-y-2">
        {features.map((f, i) => (
          <li
            key={i}
            className={`flex items-start gap-2.5 text-base ${featured ? "text-white" : "text-fg"}`}
          >
            <CheckIcon size={16} className="mt-1 flex-shrink-0 text-gold" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Link
        href={{ pathname: "/checkout", query: { plan: planId } }}
        className={`btn w-full ${
          featured ? "bg-gold text-navy hover:bg-gold-soft" : "btn-primary"
        }`}
      >
        {cta}
      </Link>
    </div>
  );
}

function ComparisonTable() {
  const t = useTranslations("Tarifs");
  const tt = useTranslations("TarifsTable");
  // Build rows as tuples: [labelKey, eleveCell, familleCell, bacCell].
  // Cells that are non-translated symbols are inlined; the children-row uses
  // localized values from TarifsTable.
  const rows: Array<[string, string, string, string]> = [
    ["row_children", tt("row_children_eleve"), tt("row_children_famille"), tt("row_children_bac")],
    ["row_subjects", "✓", "✓", "✓"],
    ["row_quiz", "✓", "✓", "✓"],
    ["row_tutor", "✓", "✓", "✓"],
    ["row_homework", "✓", "✓", "✓"],
    ["row_archive", "✓", "✓", "✓"],
    ["row_kids", "—", "✓", "—"],
    ["row_parents", "—", "✓", "—"],
    ["row_reports", "—", "✓", "—"],
    ["row_bac90", "—", "—", "✓"],
    ["row_mockexams", "—", "—", "✓"],
    ["row_priority", "—", "✓", "✓"],
  ];

  return (
    <section className="py-20 bg-surface-2">
      <div className="container-x max-w-5xl">
        <h2 className="text-2xl font-bold text-fg text-center mb-10">{t("compare_title")}</h2>
        <div className="bg-surface border border-line rounded-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className="text-start font-semibold text-fg-soft uppercase tracking-wider text-xs p-5">
                  {tt("feature")}
                </th>
                <th className="text-center font-semibold text-fg p-5">{t("compare_eleve")}</th>
                <th className="text-center font-semibold text-fg p-5 bg-surface-3/50">
                  {t("compare_famille")}
                </th>
                <th className="text-center font-semibold text-fg p-5">{t("compare_bac")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([labelKey, a, b, c]) => (
                <tr key={labelKey} className="border-b last:border-b-0 border-line">
                  <td className="p-4 text-fg">{tt(labelKey)}</td>
                  <td className="p-4 text-center text-fg-soft">{a}</td>
                  <td className="p-4 text-center text-fg-soft bg-surface-3/30">{b}</td>
                  <td className="p-4 text-center text-fg-soft">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  const t = useTranslations("Tarifs");
  return (
    <section className="py-12 bg-surface border-y border-line">
      <div className="container-x text-center">
        <p className="text-sm font-medium text-fg-soft mb-2">{t("trust_chargily")}</p>
        <p className="text-xs text-fg-faint">{t("trust_cards")}</p>
      </div>
    </section>
  );
}

function FAQTeaser() {
  const tt = useTranslations("TarifsTable");
  return (
    <section className="py-16 bg-surface text-center">
      <p className="text-fg-soft mb-3">{tt("faq_lead")}</p>
      <Link href="/faq" className="btn btn-outline">
        {tt("faq_button")}
      </Link>
    </section>
  );
}
