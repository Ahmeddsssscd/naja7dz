/**
 * Post-payment landing page. Two important behaviors:
 *
 * 1. NEVER logs the user out. The Chargily redirect drops the user back here
 *    via a top-level GET, so the Supabase auth cookie (SameSite=Lax) survives.
 *    This page does NOT call any auth-mutating endpoints — it just reads the
 *    checkout session and the user's subscription, and shows status.
 *
 * 2. Webhook recovery. If the Chargily webhook hasn't fired yet by the time
 *    the user lands here, calling activate_subscription_from_checkout RPC
 *    is idempotent — it activates the sub if the checkout is already paid.
 *    If the checkout is still pending (Chargily took the user's card but
 *    hasn't notified us), we show "en cours de confirmation" and the page
 *    will reflect the active sub on next visit.
 */
import { PageShell } from "@/components/landing/PageShell";
import { Link } from "@/i18n/routing";
import { CheckIcon } from "@/components/Icon";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import { getActiveSubscription } from "@/lib/subscriptions";
import { getLocale } from "next-intl/server";

export const metadata = { title: "Merci" };

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session?: string }>;
}) {
  const { session: sessionId } = await searchParams;
  const locale = await getLocale();
  const isAr = locale === "ar";

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const admin = createAdminClient();

  // Pull the checkout session.
  let checkout: {
    plan_id: string;
    amount_dzd: number;
    status: string;
    plan_name?: string;
  } | null = null;
  if (sessionId) {
    const { data } = await admin
      .from("checkout_sessions")
      .select("plan_id, amount_dzd, status, plans(name_fr, name_ar)")
      .eq("id", sessionId)
      .maybeSingle();
    if (data) {
      const plan = Array.isArray(data.plans) ? data.plans[0] : data.plans;
      checkout = {
        plan_id: data.plan_id,
        amount_dzd: data.amount_dzd,
        status: data.status,
        plan_name: (isAr && plan?.name_ar) || plan?.name_fr,
      };
    }
  }

  // Webhook-recovery: if the checkout is "paid" and the user is logged in,
  // make sure the subscription is activated. RPC is idempotent.
  if (checkout?.status === "paid" && user) {
    await admin.rpc("activate_subscription_from_checkout", {
      p_checkout_id: sessionId!,
    });
  }

  // Read current subscription (after potential activation).
  const sub = user ? await getActiveSubscription(user.id) : null;

  const isPaid = checkout?.status === "paid";
  const isPending = checkout?.status === "pending";

  return (
    <PageShell>
      <section className="bg-surface-2 py-20 md:py-26 min-h-[60vh] flex items-center">
        <div className="container-x max-w-lg text-center">
          <div className={`inline-flex w-16 h-16 rounded-full items-center justify-center mb-6 ${
            isPaid ? "bg-gold text-navy" : isPending ? "bg-pale-blue text-navy" : "bg-pale-blue text-navy"
          }`}>
            {isPaid ? <CheckIcon size={32} /> : <ClockIcon />}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-fg mb-3">
            {isPaid ? "Paiement confirmé." : "Paiement en cours…"}
          </h1>
          <p className="text-lg text-fg-soft mb-8">
            {isPaid
              ? user
                ? "Ton abonnement est actif. Tu peux maintenant accéder à tout le contenu de Najaح."
                : "Ton paiement est confirmé. Connecte-toi avec l'email que tu as utilisé pour activer ton accès."
              : "Ton paiement est en cours de confirmation par Chargily. Cela prend généralement quelques secondes. Reviens sur cette page dans un moment, ou attends notre email."}
          </p>

          {/* Receipt */}
          {checkout && (
            <div className="bg-surface border border-line rounded-card p-6 mb-8 text-start">
              <div className="text-xs text-fg-soft uppercase tracking-wider mb-3">
                Récapitulatif
              </div>
              <div className="flex justify-between mb-1.5 text-sm">
                <span className="text-fg-soft">Plan</span>
                <span className="text-fg font-semibold">{checkout.plan_name ?? checkout.plan_id}</span>
              </div>
              <div className="flex justify-between mb-1.5 text-sm">
                <span className="text-fg-soft">Montant</span>
                <span className="text-fg font-semibold">
                  <bdi>{checkout.amount_dzd.toLocaleString(isAr ? "ar-DZ" : "fr-DZ")}</bdi> {isAr ? "د.ج" : "DA"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-fg-soft">Statut</span>
                <span className={`font-semibold ${isPaid ? "text-green-600" : "text-amber-600"}`}>
                  {isPaid ? "✓ Payé" : "En attente"}
                </span>
              </div>
            </div>
          )}

          {/* Active subscription summary */}
          {sub && (
            <div className="accent-block rounded-card p-5 mb-8 text-center">
              <div className="text-xs text-gold uppercase tracking-wider mb-2">
                Abonnement actif
              </div>
              <div className="text-white font-semibold mb-1">{sub.plan_name_fr}</div>
              <div className="text-white/70 text-xs">
                Valide jusqu&apos;au{" "}
                {new Date(sub.expires_at).toLocaleDateString(isAr ? "ar-DZ" : "fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>
          )}

          {/* CTAs — depend on auth + status */}
          <div className="flex gap-3 justify-center flex-wrap">
            {user ? (
              <>
                <Link href="/parent" className="btn btn-primary btn-lg">
                  Découvrir mon espace →
                </Link>
                <Link href="/parent/abonnement" className="btn btn-outline btn-lg">
                  Voir mon abonnement
                </Link>
              </>
            ) : (
              <>
                <Link href="/connexion" className="btn btn-primary btn-lg">
                  Se connecter
                </Link>
                <Link href="/inscription" className="btn btn-outline btn-lg">
                  Créer un compte
                </Link>
              </>
            )}
          </div>

          {!user && isPaid && (
            <p className="text-xs text-fg-faint mt-6 max-w-prose mx-auto">
              Crée ton compte avec l&apos;email <strong className="text-fg">utilisé pour
              le paiement</strong> — ton abonnement sera automatiquement activé.
            </p>
          )}
        </div>
      </section>
    </PageShell>
  );
}

function ClockIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
