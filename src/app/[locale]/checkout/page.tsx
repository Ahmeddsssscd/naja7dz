import { getTranslations, getLocale } from "next-intl/server";
import { PageShell } from "@/components/landing/PageShell";
import { CheckoutForm } from "@/components/CheckoutForm";
import { createAdminClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/routing";

export const metadata = { title: "Finaliser ta commande" };

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const { plan: planId } = await searchParams;
  const t = await getTranslations("Checkout");
  const locale = await getLocale();

  if (!planId) {
    return (
      <PageShell>
        <div className="container-x max-w-md py-20 text-center">
          <h1 className="text-2xl font-bold text-fg mb-3">{t("missing_title")}</h1>
          <p className="text-fg-soft mb-6">{t("missing_text")}</p>
          <Link href="/tarifs" className="btn btn-primary">
            {t("missing_cta")}
          </Link>
        </div>
      </PageShell>
    );
  }

  // Look up the plan to display
  const supabase = createAdminClient();
  const { data: plan } = await supabase
    .from("plans")
    .select("id, name_fr, name_ar, amount_dzd, period, description_fr, description_ar")
    .eq("id", planId)
    .eq("active", true)
    .maybeSingle();

  if (!plan) {
    return (
      <PageShell>
        <div className="container-x max-w-md py-20 text-center">
          <h1 className="text-2xl font-bold text-fg mb-3">{t("notfound_title")}</h1>
          <p className="text-fg-soft mb-6">{t("notfound_text")}</p>
          <Link href="/tarifs" className="btn btn-primary">
            {t("missing_cta")}
          </Link>
        </div>
      </PageShell>
    );
  }

  const planName = locale === "ar" && plan.name_ar ? plan.name_ar : plan.name_fr;
  const planDesc = locale === "ar" && plan.description_ar ? plan.description_ar : plan.description_fr;
  const periodLabel =
    plan.period === "monthly" ? t("period_monthly")
    : plan.period === "annual" ? t("period_annual")
    : t("period_one_time");

  // Format the amount with locale-aware grouping. Always render inside <bdi>
  // so multi-token numbers (e.g. "1 990") stay LTR atomic in RTL layout.
  const amountFormatted = plan.amount_dzd.toLocaleString(locale === "ar" ? "ar-DZ" : "fr-DZ");

  return (
    <PageShell>
      <section className="py-16 md:py-20 bg-surface-2">
        <div className="container-x max-w-4xl grid md:grid-cols-2 gap-10">
          {/* Order summary */}
          <aside className="bg-surface border border-line rounded-card p-7 h-fit">
            <span className="eyebrow mb-2 block">{t("order_eyebrow")}</span>
            <h2 className="text-2xl font-bold text-fg mb-4">{planName}</h2>
            {planDesc && (
              <p className="text-fg-soft mb-6 text-sm">{planDesc}</p>
            )}
            <div className="border-t border-line pt-6">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-fg-soft">{t("total")}</span>
                <span className="text-3xl font-bold text-fg">
                  <bdi>{amountFormatted}</bdi>{" "}
                  <span className="text-base font-medium">{t("currency")}</span>
                </span>
              </div>
              <div className="text-sm text-fg-soft text-end">{periodLabel}</div>
            </div>
            <div className="mt-6 pt-6 border-t border-line text-xs text-fg-soft space-y-2">
              <p>
                ✓ {t("trust_chargily_pre")}{" "}
                <strong className="text-fg">{t("trust_chargily_brand")}</strong>
              </p>
              <p>✓ {t("trust_cards")}</p>
              <p>✓ {t("trust_cancel")}</p>
            </div>
          </aside>

          {/* Checkout form */}
          <div className="bg-surface border border-line rounded-card p-7">
            <h2 className="text-xl font-semibold text-fg mb-5">{t("form_title")}</h2>
            <CheckoutForm planId={plan.id} />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
