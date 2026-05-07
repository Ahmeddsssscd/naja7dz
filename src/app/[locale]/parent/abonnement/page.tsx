import { redirect } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/app/AppShell";
import { Link } from "@/i18n/routing";
import { getActiveSubscription } from "@/lib/subscriptions";

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

  // Real source of truth: the subscriptions table.
  const sub = await getActiveSubscription(user.id);

  // Use admin client for catalog reads — these are public anyway.
  const admin = createAdminClient();
  const { data: plans } = await admin
    .from("plans")
    .select("id, name_fr, name_ar, description_fr, description_ar, amount_dzd, period, tier")
    .eq("active", true)
    .order("amount_dzd");

  // Past payment history (all paid checkouts for this user — by user_id with
  // email fallback for legacy rows).
  const { data: history } = await admin
    .from("checkout_sessions")
    .select("id, plan_id, amount_dzd, paid_at, status, plans(name_fr, name_ar)")
    .or(`user_id.eq.${user.id},email.eq.${user.email!}`)
    .eq("status", "paid")
    .order("paid_at", { ascending: false })
    .limit(10);

  const isAr = locale === "ar";
  const localizedPlanName = (p: { name_fr?: string | null; name_ar?: string | null }) =>
    (isAr && p?.name_ar) || p?.name_fr || "";
  const fmt = (n: number) => n.toLocaleString(isAr ? "ar-DZ" : "fr-DZ");
  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString(isAr ? "ar-DZ" : "fr-FR", {
      day: "numeric", month: "long", year: "numeric",
    });

  return (
    <AppShell active="subscription" parentName={profile?.full_name ?? ""}>
      <div className="max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-bold text-fg mb-2">{t("page_title")}</h1>
        <p className="text-fg-soft mb-8">{t("subtitle")}</p>

        {/* Active subscription block */}
        {sub ? (
          <div className="accent-block rounded-card p-7 mb-8 text-white">
            <span className="text-xs uppercase tracking-wider text-gold font-semibold">
              {t("current_plan")}
            </span>
            <h2 className="text-2xl font-bold mt-1 mb-3">
              {(isAr && sub.plan_name_ar) || sub.plan_name_fr}
            </h2>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/85 mb-2">
              <div>
                <div className="text-xs text-white/60">Statut</div>
                <div className="font-semibold">✓ Actif</div>
              </div>
              <div>
                <div className="text-xs text-white/60">Expire</div>
                <div className="font-semibold">{fmtDate(sub.expires_at)}</div>
              </div>
              <div>
                <div className="text-xs text-white/60">Type</div>
                <div className="font-semibold">
                  {sub.tier === "bac_only" ? "Pack Bac (3AS · 4AM)" : "Plein accès"}
                </div>
              </div>
            </div>
            {daysUntil(sub.expires_at) <= 7 && (
              <div className="mt-4 text-xs bg-white/10 rounded-btn px-3 py-2">
                ⏰ Expire bientôt — pense à renouveler.
              </div>
            )}
          </div>
        ) : (
          <div className="bg-surface border border-line rounded-card p-7 mb-8 text-center">
            <h3 className="text-lg font-semibold text-fg mb-2">{t("no_active")}</h3>
            <p className="text-fg-soft text-sm mb-5">{t("no_active_text")}</p>
            <Link href="/tarifs" className="btn btn-primary">{t("view_plans")}</Link>
          </div>
        )}

        {/* Available plans (catalog) */}
        <h3 className="text-lg font-semibold text-fg mb-4">{t("available_plans")}</h3>
        <div className="space-y-3 mb-10">
          {(plans ?? []).map((p) => {
            const isCurrent = sub?.plan_id === p.id;
            return (
              <div
                key={p.id}
                className={`bg-surface border rounded-card p-5 flex items-center justify-between ${
                  isCurrent ? "border-gold" : "border-line"
                }`}
              >
                <div>
                  <div className="font-semibold text-fg flex items-center gap-2">
                    {localizedPlanName(p)}
                    {isCurrent && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gold text-navy font-bold">
                        Actuel
                      </span>
                    )}
                    {p.tier === "bac_only" && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-pale-blue text-navy">
                        Bac uniquement
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-fg-soft">
                    {(isAr ? p.description_ar : null) || p.description_fr}
                  </div>
                </div>
                <div className="text-end">
                  <div className="font-bold text-fg">
                    <bdi>{fmt(p.amount_dzd)}</bdi> {tc("currency")}
                  </div>
                  <Link
                    href={{ pathname: "/checkout", query: { plan: p.id } }}
                    className="text-xs text-gold font-semibold hover:underline"
                  >
                    {isCurrent ? "Renouveler" : t("choose")}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Payment history */}
        {history && history.length > 0 && (
          <>
            <h3 className="text-lg font-semibold text-fg mb-4">Historique des paiements</h3>
            <div className="bg-surface border border-line rounded-card overflow-hidden">
              {history.map((h) => {
                const planObj = Array.isArray(h.plans) ? h.plans[0] : h.plans;
                return (
                  <div key={h.id} className="px-5 py-3 border-b last:border-b-0 border-line flex items-center justify-between text-sm">
                    <div>
                      <div className="text-fg font-medium">
                        {localizedPlanName(planObj as { name_fr?: string | null; name_ar?: string | null } ?? {}) || h.plan_id}
                      </div>
                      <div className="text-xs text-fg-soft">{h.paid_at ? fmtDate(h.paid_at) : "—"}</div>
                    </div>
                    <div className="text-fg font-semibold">
                      <bdi>{fmt(h.amount_dzd)}</bdi> {tc("currency")}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}

function daysUntil(iso: string): number {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}
