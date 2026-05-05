import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/app/AppShell";

export const metadata = { title: "Paramètres — Najaح" };

export default async function SettingsPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: profile } = await supabase
    .from("parent_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <AppShell active="settings" parentName={profile?.full_name ?? ""}>
      <div className="max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-bold text-fg mb-2">Paramètres</h1>
        <p className="text-fg-soft mb-8">Profil, langue, notifications, sécurité.</p>

        <section className="bg-surface border border-line rounded-card p-7 mb-6">
          <h2 className="text-lg font-semibold text-fg mb-4">Profil</h2>
          <dl className="space-y-3 text-sm">
            <Row label="Nom complet" value={profile?.full_name ?? "—"} />
            <Row label="Email" value={user.email ?? "—"} />
            <Row label="Téléphone" value={profile?.phone ?? "—"} />
            <Row label="Wilaya" value={profile?.wilaya ?? "—"} />
            <Row label="Langue préférée" value={profile?.language_pref === "ar" ? "العربية" : "Français"} />
          </dl>
        </section>

        <section className="bg-surface border border-line rounded-card p-7">
          <h2 className="text-lg font-semibold text-fg mb-3">Suppression du compte</h2>
          <p className="text-fg-soft text-sm mb-4">
            Tu peux supprimer ton compte à tout moment. Toutes les données sont effacées
            sous 30 jours, conformément à la Loi 18-07.
          </p>
          <p className="text-xs text-fg-faint">
            Pour supprimer ton compte, écris à <a href="mailto:privacy@naja7dz.com" className="underline">privacy@naja7dz.com</a>.
          </p>
        </section>
      </div>
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-line pb-3 last:border-b-0 last:pb-0">
      <dt className="text-fg-soft">{label}</dt>
      <dd className="text-fg font-medium">{value}</dd>
    </div>
  );
}
