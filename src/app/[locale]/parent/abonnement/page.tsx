import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/app/AppShell";
import { Link } from "@/i18n/routing";

export const metadata = { title: "Abonnement" };

export default async function SubscriptionPage() {
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
    .select("plan_id, amount_dzd, status, paid_at, plans(name_fr)")
    .eq("email", user.email!)
    .eq("status", "paid")
    .order("paid_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const plans = await supabase.from("plans").select("*").eq("active", true).order("amount_dzd");

  return (
    <AppShell active="subscription" parentName={profile?.full_name ?? ""}>
      <div className="max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-bold text-fg mb-2">Abonnement</h1>
        <p className="text-fg-soft mb-8">Gère ton plan et ton historique de paiement.</p>

        {latestPayment ? (
          <div className="bg-surface border border-line rounded-card p-7 mb-8">
            <span className="text-xs uppercase tracking-wider text-fg-soft font-semibold">
              Plan actuel
            </span>
            <h2 className="text-xl font-bold text-fg mt-1 mb-2">
              {(latestPayment.plans as { name_fr?: string } | null)?.name_fr ?? latestPayment.plan_id}
            </h2>
            <p className="text-fg-soft text-sm">
              Dernière facturation : {latestPayment.amount_dzd?.toLocaleString("fr-DZ")} DA
              {latestPayment.paid_at &&
                ` · ${new Date(latestPayment.paid_at).toLocaleDateString("fr-FR")}`}
            </p>
          </div>
        ) : (
          <div className="bg-surface border border-line rounded-card p-7 mb-8 text-center">
            <h3 className="text-lg font-semibold text-fg mb-2">Aucun abonnement actif</h3>
            <p className="text-fg-soft text-sm mb-5">
              Choisis un plan pour débloquer Najaح pour ton enfant.
            </p>
            <Link href="/tarifs" className="btn btn-primary">Voir les plans</Link>
          </div>
        )}

        <h3 className="text-lg font-semibold text-fg mb-4">Plans disponibles</h3>
        <div className="space-y-3">
          {(plans.data ?? []).map((p) => (
            <div key={p.id} className="bg-surface border border-line rounded-card p-5 flex items-center justify-between">
              <div>
                <div className="font-semibold text-fg">{p.name_fr}</div>
                <div className="text-xs text-fg-soft">{p.description_fr}</div>
              </div>
              <div className="text-end">
                <div className="font-bold text-fg">{p.amount_dzd.toLocaleString("fr-DZ")} DA</div>
                <Link
                  href={{ pathname: "/checkout", query: { plan: p.id } }}
                  className="text-xs text-gold font-semibold hover:underline"
                >
                  Choisir →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
