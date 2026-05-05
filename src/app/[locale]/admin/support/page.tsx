import { AdminShell, requireAdmin } from "@/components/app/AdminShell";

export const metadata = { title: "Admin · Support — Najaح" };

export default async function AdminSupport() {
  const { profile } = await requireAdmin();
  return (
    <AdminShell active="support" adminName={profile.full_name}>
      <h1 className="text-2xl md:text-3xl font-bold text-fg mb-2">Support</h1>
      <p className="text-fg-soft mb-8">Tickets entrants depuis la page contact ou l&apos;app.</p>
      <div className="bg-surface border border-line rounded-card p-12 text-center text-fg-soft">
        Aucun ticket pour le moment. Les messages du formulaire de contact arriveront ici une fois la table support_messages active.
      </div>
    </AdminShell>
  );
}
