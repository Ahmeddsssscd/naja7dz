import { useTranslations } from "next-intl";
import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { PageShell } from "@/components/landing/PageShell";
import { CheckIcon } from "@/components/Icon";
import { createServerClient } from "@/lib/supabase/server";

interface DbPlan {
  id: string;
  name_fr: string;
  name_ar: string | null;
  amount_dzd: number;
  period: string;
  description_fr: string | null;
  description_ar: string | null;
}

export default async function TarifsPage() {
  const locale = await getLocale();
  // Public read (anon policy allows active plans). Prices/names come from the
  // DB so admins can edit them in /admin/tarifs; feature bullets stay in i18n.
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("plans")
    .select("id, name_fr, name_ar, amount_dzd, period, description_fr, description_ar, active")
    .eq("active", true);
  const plans = new Map<string, DbPlan>();
  for (const p of (data ?? []) as DbPlan[]) plans.set(p.id, p);

  return (
    <PageShell active="tarifs">
      <Hero />
      <Plans plans={plans} isAr={locale === "ar"} />
      <ComparisonTable />
      <TrustBar />
      <FAQTeaser />
    </PageShell>
  );
}

function fmtPrice(n: number): string {
  return n.toLocaleString("fr-DZ");
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

function Plans({ plans, isAr }: { plans: Map<string, DbPlan>; isAr: boolean }) {
  const t = useTranslations("Pricing");

  // DB price/name if the plan exists, else fall back to the i18n defaults.
  const eleve = plans.get("eleve_monthly");
  const famille = plans.get("famille_monthly");

  return (
    <section className="py-20 bg-surface">
      <div className="container-x">
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Plan
            planId="eleve_monthly"
            name={eleve ? ((isAr && eleve.name_ar) || eleve.name_fr) : t("eleve_name")}
            price={eleve ? fmtPrice(eleve.amount_dzd) : t("eleve_price")}
            currency={t("eleve_currency")}
            period={t("per_month")}
            features={[t("eleve_f1"), t("eleve_f2"), t("eleve_f3"), t("eleve_f4")]}
            cta={t("eleve_cta")}
          />
          <Plan
            planId="famille_monthly"
            name={famille ? ((isAr && famille.name_ar) || famille.name_fr) : t("famille_name")}
            price={famille ? fmtPrice(famille.amount_dzd) : t("famille_price")}
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
          {/* Pack École — B2B "sur devis". No fixed price; CTA goes to a
              quote-request form rather than the consumer checkout. */}
          <Plan
            quoteHref="/ecole"
            name={t("ecole_name")}
            price={t("ecole_price")}
            currency=""
            period={t("ecole_period")}
            features={[
              t("ecole_f1"),
              t("ecole_f2"),
              t("ecole_f3"),
              t("ecole_f4"),
              t("ecole_f5"),
              t("ecole_f6"),
            ]}
            cta={t("ecole_cta")}
          />
        </div>
        <p className="text-center text-xs text-fg-faint mt-6">
          {isAr
            ? "الأسعار بالدينار الجزائري، تشمل جميع الرسوم."
            : "Prix en dinars algériens, toutes taxes comprises."}
        </p>
      </div>
    </section>
  );
}

function Plan({
  planId,
  quoteHref,
  name,
  price,
  currency,
  period,
  features,
  cta,
  featured,
  badge,
}: {
  /** Standard plan: posts to /checkout?plan=<id>. */
  planId?: string;
  /** Quote-request plan: links to a sales page instead of checkout. */
  quoteHref?: string;
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
        href={
          quoteHref
            ? { pathname: quoteHref }
            : { pathname: "/checkout", query: { plan: planId ?? "eleve_monthly" } }
        }
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
  // Build rows as tuples: [labelKey, eleveCell, familleCell, ecoleCell].
  // École column always = ✓ except for the per-family count row.
  const rows: Array<[string, string, string, string]> = [
    ["row_children", tt("row_children_eleve"), tt("row_children_famille"), tt("row_children_ecole")],
    ["row_subjects", "✓", "✓", "✓"],
    ["row_quiz", "✓", "✓", "✓"],
    ["row_tutor", "✓", "✓", "✓"],
    ["row_homework", "✓", "✓", "✓"],
    ["row_archive", "✓", "✓", "✓"],
    ["row_kids", "—", "✓", "✓"],
    ["row_parents", "—", "✓", "✓"],
    ["row_reports", "—", "✓", "✓"],
    ["row_teacher_dashboard", "—", "—", "✓"],
    ["row_bulk_import", "—", "—", "✓"],
    ["row_class_results", "—", "—", "✓"],
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
                <th className="text-center font-semibold text-fg p-5">{t("compare_ecole")}</th>
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
