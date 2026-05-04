import { PageShell } from "@/components/landing/PageShell";
import { CheckoutForm } from "@/components/CheckoutForm";
import { createServerClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/routing";

export const metadata = { title: "Finaliser ta commande — Najaح" };

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const { plan: planId } = await searchParams;

  if (!planId) {
    return (
      <PageShell>
        <div className="container-x max-w-md py-20 text-center">
          <h1 className="text-2xl font-bold text-fg mb-3">Plan manquant</h1>
          <p className="text-fg-soft mb-6">Choisis un plan pour continuer.</p>
          <Link href="/tarifs" className="btn btn-primary">
            Voir les tarifs
          </Link>
        </div>
      </PageShell>
    );
  }

  // Look up the plan to display
  const supabase = createServerClient();
  const { data: plan } = await supabase
    .from("plans")
    .select("id, name_fr, amount_dzd, period, description_fr")
    .eq("id", planId)
    .eq("active", true)
    .maybeSingle();

  if (!plan) {
    return (
      <PageShell>
        <div className="container-x max-w-md py-20 text-center">
          <h1 className="text-2xl font-bold text-fg mb-3">Plan introuvable</h1>
          <p className="text-fg-soft mb-6">Ce plan n&apos;existe pas ou n&apos;est plus disponible.</p>
          <Link href="/tarifs" className="btn btn-primary">
            Voir les tarifs
          </Link>
        </div>
      </PageShell>
    );
  }

  const periodLabel =
    plan.period === "monthly" ? "/ mois" : plan.period === "annual" ? "/ an" : "paiement unique";

  return (
    <PageShell>
      <section className="py-16 md:py-20 bg-surface-2">
        <div className="container-x max-w-4xl grid md:grid-cols-2 gap-10">
          {/* Order summary */}
          <aside className="bg-surface border border-line rounded-card p-7 h-fit">
            <span className="eyebrow mb-2 block">Ta commande</span>
            <h2 className="text-2xl font-bold text-fg mb-4">{plan.name_fr}</h2>
            {plan.description_fr && (
              <p className="text-fg-soft mb-6 text-sm">{plan.description_fr}</p>
            )}
            <div className="border-t border-line pt-6">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-fg-soft">Total</span>
                <span className="text-3xl font-bold text-fg">
                  {plan.amount_dzd.toLocaleString("fr-DZ")} <span className="text-base font-medium">DA</span>
                </span>
              </div>
              <div className="text-sm text-fg-soft text-end">{periodLabel}</div>
            </div>
            <div className="mt-6 pt-6 border-t border-line text-xs text-fg-soft space-y-2">
              <p>✓ Paiement sécurisé via <strong className="text-fg">Chargily Pay</strong></p>
              <p>✓ Cartes CIB, EDAHABIA, BaridiMob</p>
              <p>✓ Annulation en un clic à tout moment</p>
            </div>
          </aside>

          {/* Checkout form */}
          <div className="bg-surface border border-line rounded-card p-7">
            <h2 className="text-xl font-semibold text-fg mb-5">Tes informations</h2>
            <CheckoutForm planId={plan.id} />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
