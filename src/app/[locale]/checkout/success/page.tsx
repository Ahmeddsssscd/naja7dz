import { PageShell } from "@/components/landing/PageShell";
import { Link } from "@/i18n/routing";
import { CheckIcon } from "@/components/Icon";
import { createAdminClient } from "@/lib/supabase/server";

export const metadata = { title: "Merci" };

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session?: string }>;
}) {
  const { session: sessionId } = await searchParams;

  let summary: { plan?: string; amount?: number; status?: string } = {};
  if (sessionId) {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("checkout_sessions")
      .select("plan_id, amount_dzd, status, plans(name_fr)")
      .eq("id", sessionId)
      .maybeSingle();
    if (data) {
      summary = {
        plan: (data.plans as { name_fr?: string } | null)?.name_fr ?? data.plan_id,
        amount: data.amount_dzd,
        status: data.status,
      };
    }
  }

  // Status may still be "pending" if the webhook hasn't fired yet — we show
  // optimistic success and tell the user we'll email them once confirmed.
  return (
    <PageShell>
      <section className="bg-surface-2 py-20 md:py-26 min-h-[60vh] flex items-center">
        <div className="container-x max-w-lg text-center">
          <div className="inline-flex w-16 h-16 rounded-full bg-gold text-navy items-center justify-center mb-6">
            <CheckIcon size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-fg mb-3">
            Merci pour ta confiance.
          </h1>
          <p className="text-lg text-fg-soft mb-8">
            Ton paiement est en cours de confirmation. Tu recevras un email dans quelques
            instants avec ton accès complet à Najaح.
          </p>

          {summary.plan && (
            <div className="bg-surface border border-line rounded-card p-6 mb-8 text-start">
              <div className="text-xs text-fg-soft uppercase tracking-wider mb-2">Récapitulatif</div>
              <div className="flex justify-between mb-1">
                <span className="text-fg-soft">Plan</span>
                <span className="text-fg font-semibold">{summary.plan}</span>
              </div>
              {summary.amount !== undefined && (
                <div className="flex justify-between">
                  <span className="text-fg-soft">Montant</span>
                  <span className="text-fg font-semibold">
                    {summary.amount.toLocaleString("fr-DZ")} DA
                  </span>
                </div>
              )}
            </div>
          )}

          <Link href="/" className="btn btn-primary btn-lg">
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
