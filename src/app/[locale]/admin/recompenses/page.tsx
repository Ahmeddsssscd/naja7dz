import { AdminShell, requireAdmin } from "@/components/app/AdminShell";

export const metadata = { title: "Admin · Récompenses" };

export default async function AdminRewards() {
  const { profile } = await requireAdmin();
  return (
    <AdminShell adminName={profile.full_name}>
      <h1 className="text-2xl md:text-3xl font-bold text-fg mb-2">Programme de récompenses</h1>
      <p className="text-fg-soft mb-8">Voyage offert aux meilleurs élèves qui partagent leurs résultats + un témoignage.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Stat label="Élèves éligibles ce mois" value="—" />
        <Stat label="Témoignages reçus" value="0" />
        <Stat label="Voyages attribués · 2026" value="0" />
      </div>

      <div className="bg-surface border border-line rounded-card p-12 text-center">
        <p className="text-fg-soft mb-2">Aucun candidat éligible pour le moment.</p>
        <p className="text-xs text-fg-faint">
          Les élèves apparaîtront ici après avoir : (1) progressé d&apos;au moins 30% sur 2 mois,
          (2) partagé leur résultat publiquement, (3) soumis un témoignage approuvé.
        </p>
      </div>
    </AdminShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface border border-line rounded-card p-5">
      <div className="text-xs font-semibold text-fg-soft uppercase tracking-wider mb-2">{label}</div>
      <div className="text-2xl font-bold text-fg">{value}</div>
    </div>
  );
}
