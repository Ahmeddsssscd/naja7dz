import { redirect } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/app/AppShell";
import { Link } from "@/i18n/routing";

export const metadata = { title: "Abonnement" };

export default async function SubscriptionPage() {
  const t = await getTranslations("ParentSubscription");
  const tc = await getTranslations("Checkout");
  const locale = await getLocale();
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: profile } = await supabase
    .from("parent_profiles")
    .select("full_name")
    .eq("user_id", user.id)
    .maybeSingle();

  // Latest paid checkout for this email
  const { data: latestPayment } = await supabase
    .from("checkout_sessions")
    .select("plan_id, amount_dzd, status, paid_at, plans(name_fr, name_ar)")
    .eq("email", user.email!)
    .eq("status", "paid")
    .order("paid_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const plans = await supabase.from("plans").select("*").eq("active", true).order("amount_dzd");

  const isAr = locale === "ar";
  const localizedPlanName = (p: { name_fr?: string | null; name_ar?: string | null }) =>
    (isAr && p?.name_ar) || p?.name_fr || "";
  const formatPrice = (n: number) => n.toLocaleString(isAr ? "ar-DZ" : "fr-DZ");

  return (
    <AppShell active="subscription" parentName={profile?.full_name ?? ""}>
      <div className="max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-bold text-fg mb-2">{t("page_title")}</h1>
        <p className="text-fg-soft mb-8">{t("subtitle")}</p>

        {latestPayment ? (
          <div className="bg-surface border border-line rounded-card p-7 mb-8">
            <span className="text-xs uppercase tracking-wider text-fg-soft font-semibold">
              {t("current_plan")}
            </span>
            <h2 className="text-xl font-bold text-fg mt-1 mb-2">
              {localizedPlanName(latestPayment.plans as { name_fr?: string | null; name_ar?: string | null } | null ?? {}) ||
                latestPayment.plan_id}
            </h2>
            <p className="text-fg-soft text-sm">
              {t("last_billed")}:{" "}
              <bdi>{latestPayment.amount_dzd ? formatPrice(latestPayment.amount_dzd) : "—"}</bdi>{" "}
              {tc("currency")}
              {latestPayment.paid_at &&
                ` · ${new Date(latestPayment.paid_at).toLocaleDateString(isAr ? "ar-DZ" : "fr-FR")}`}
            </p>
          </div>
        ) : (
          <div className="bg-surface border border-line rounded-card p-7 mb-8 text-center">
            <h3 className="text-lg font-semibold text-fg mb-2">{t("no_active")}</h3>
            <p className="text-fg-soft text-sm mb-5">{t("no_active_text")}</p>
            <Link href="/tarifs" className="btn btn-primary">{t("view_plans")}</Link>
          </div>
        )}

        <h3 className="text-lg font-semibold text-fg mb-4">{t("available_plans")}</h3>
        <div className="space-y-3">
          {(plans.data ?? []).map((p) => (
            <div key={p.id} className="bg-surface border border-line rounded-card p-5 flex items-center justify-between">
              <div>
                <div className="font-semibold text-fg">{localizedPlanName(p)}</div>
                <div className="text-xs text-fg-soft">
                  {(isAr ? p.description_ar : null) || p.description_fr}
                </div>
              </div>
              <div className="text-end">
                <div className="font-bold text-fg">
                  <bdi>{formatPrice(p.amount_dzd)}</bdi> {tc("currency")}
                </div>
                <Link
                  href={{ pathname: "/checkout", query: { plan: p.id } }}
                  className="text-xs text-gold font-semibold hover:underline"
                >
                  {t("choose")}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
