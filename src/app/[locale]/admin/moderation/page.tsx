import { AdminShell, requireAdmin } from "@/components/app/AdminShell";

export const metadata = { title: "Admin · Modération — Najaح" };

export default async function ModerationPage() {
  const { profile } = await requireAdmin();
  return (
    <AdminShell active="moderation" adminName={profile.full_name}>
      <h1 className="text-2xl md:text-3xl font-bold text-fg mb-2">Modération</h1>
      <p className="text-fg-soft mb-8">Messages, photos et publications signalés par l&apos;IA ou les utilisateurs.</p>
      <div className="bg-surface border border-line rounded-card p-12 text-center text-fg-soft">
        Pas de contenu à modérer pour le moment. Les contenus signalés apparaîtront ici.
      </div>
    </AdminShell>
  );
}
