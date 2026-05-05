import { AdminShell, requireAdmin } from "@/components/app/AdminShell";
import { createAdminClient } from "@/lib/supabase/server";

export const metadata = { title: "Admin · Vue d'ensemble — Najaح" };

export default async function AdminOverview() {
  const { profile } = await requireAdmin();
  const admin = createAdminClient();

  // KPI aggregations
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [
    { count: totalParents },
    { count: totalChildren },
    { count: signupsThisWeek },
    { count: activeQuizzes },
    { count: pendingSpeeches },
    { count: paidSubs },
  ] = await Promise.all([
    admin.from("parent_profiles").select("*", { count: "exact", head: true }),
    admin.from("children").select("*", { count: "exact", head: true }),
    admin.from("parent_profiles").select("*", { count: "exact", head: true }).gte("created_at", sevenDaysAgo),
    admin.from("quizzes").select("*", { count: "exact", head: true }).gte("started_at", sevenDaysAgo),
    admin.from("motivational_speeches").select("*", { count: "exact", head: true }).eq("status", "pending"),
    admin.from("checkout_sessions").select("*", { count: "exact", head: true }).eq("status", "paid"),
  ]);

  return (
    <AdminShell active="overview" adminName={profile.full_name}>
      <h1 className="text-2xl md:text-3xl font-bold text-fg mb-2">Vue d&apos;ensemble</h1>
      <p className="text-fg-soft mb-8">État de la plateforme en temps réel.</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <Kpi label="Parents" value={totalParents ?? 0} hint={`+${signupsThisWeek ?? 0} cette semaine`} />
        <Kpi label="Enfants" value={totalChildren ?? 0} hint="comptes créés" />
        <Kpi label="Quiz · 7j" value={activeQuizzes ?? 0} hint="lancés cette semaine" />
        <Kpi label="Abonnements payés" value={paidSubs ?? 0} hint="cumul" />
        <Kpi label="Discours en attente" value={pendingSpeeches ?? 0} hint="à modérer" highlight={!!pendingSpeeches && pendingSpeeches > 0} />
        <Kpi label="MRR estimé" value="—" hint="à calculer" />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-surface border border-line rounded-card p-6">
          <h2 className="font-semibold text-fg mb-4">Files d&apos;attente</h2>
          <ul className="text-sm space-y-2">
            <Row label="Discours à approuver" value={pendingSpeeches ?? 0} href="/admin/discours" />
            <Row label="Modération" value={0} href="/admin/moderation" />
            <Row label="Tickets support" value={0} href="/admin/support" />
            <Row label="Solutions IA à vérifier" value={0} href="/admin/contenu" />
          </ul>
        </div>

        <div className="bg-surface border border-line rounded-card p-6">
          <h2 className="font-semibold text-fg mb-4">À faire aujourd&apos;hui</h2>
          <ul className="text-sm text-fg-soft space-y-2">
            <li>• Vérifier les revenus du jour</li>
            <li>• Examiner les drapeaux qualité IA</li>
            <li>• Approuver / rejeter les discours en attente</li>
            <li>• Vérifier les tickets support {">"} 24h</li>
          </ul>
        </div>
      </div>
    </AdminShell>
  );
}

function Kpi({ label, value, hint, highlight }: { label: string; value: number | string; hint: string; highlight?: boolean }) {
  return (
    <div className={`bg-surface border rounded-card p-5 ${highlight ? "border-gold" : "border-line"}`}>
      <div className="text-xs font-semibold text-fg-soft uppercase tracking-wider mb-2">{label}</div>
      <div className="text-2xl font-bold text-fg leading-none mb-2">{value}</div>
      <div className="text-xs text-fg-faint">{hint}</div>
    </div>
  );
}

function Row({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <li className="flex items-center justify-between py-2 border-b last:border-b-0 border-line">
      <a href={href} className="text-fg hover:text-gold transition-colors">{label}</a>
      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${value > 0 ? "bg-gold text-navy" : "bg-surface-3 text-fg-soft"}`}>
        {value}
      </span>
    </li>
  );
}
