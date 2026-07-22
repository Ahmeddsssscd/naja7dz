import { AdminShell, requireAdmin } from "@/components/app/AdminShell";
import { createAdminClient } from "@/lib/supabase/server";
import { PlansAdmin, type PlanRow } from "@/components/app/PlansAdmin";

export const metadata = { title: "Admin · Tarifs" };

export default async function AdminPricingPage() {
  const { profile } = await requireAdmin();
  const admin = createAdminClient();
  const { data: rows } = await admin
    .from("plans")
    .select("id, name_fr, name_ar, amount_dzd, period, description_fr, description_ar, active")
    .order("amount_dzd");

  return (
    <AdminShell active="pricing" adminName={profile.full_name}>
      <h1 className="text-2xl md:text-3xl font-bold text-fg mb-2">Tarifs &amp; abonnements</h1>
      <p className="text-fg-soft mb-8">
        Modifie les prix, noms et descriptions des offres. Les changements
        s&apos;affichent immédiatement sur la page publique <code className="text-xs">/tarifs</code>.
        L&apos;identifiant d&apos;un plan est utilisé par le paiement — ne le change pas sur un plan déjà en vente.
      </p>

      <PlansAdmin initialRows={(rows ?? []) as PlanRow[]} />
    </AdminShell>
  );
}
