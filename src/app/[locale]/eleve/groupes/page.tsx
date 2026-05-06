import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { StudentShell } from "@/components/app/StudentShell";

export const metadata = { title: "Groupes d'étude" };

export default async function GroupsPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: child } = await supabase
    .from("children").select("*").eq("parent_id", user.id).limit(1).maybeSingle();

  return (
    <StudentShell active="profile" childName={child?.full_name} childGrade={child?.grade}>
      <h1 className="text-2xl font-bold text-fg mb-2">Groupes d&apos;étude</h1>
      <p className="text-fg-soft text-sm mb-6">
        Étudie avec tes amis. 5 à 10 membres par groupe maximum, modération automatique.
      </p>

      <div className="bg-surface border border-line rounded-card p-6 mb-6">
        <h2 className="font-semibold text-fg mb-3">Créer un nouveau groupe</h2>
        <p className="text-fg-soft text-sm mb-4">
          Tu deviens administrateur du groupe. Tu peux inviter jusqu&apos;à 9 amis avec un code.
        </p>
        <button className="btn btn-primary" disabled>
          + Créer un groupe (validation parent requise)
        </button>
      </div>

      <div className="bg-surface border border-line rounded-card p-6 mb-6">
        <h2 className="font-semibold text-fg mb-3">Rejoindre un groupe</h2>
        <p className="text-fg-soft text-sm mb-4">
          Un ami t&apos;a envoyé un code ? Saisis-le ci-dessous.
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="ABC12345"
            maxLength={8}
            className="flex-1 h-11 px-4 bg-surface border border-line-strong rounded-btn text-fg uppercase tracking-widest font-mono focus:outline-none focus:border-fg"
            disabled
          />
          <button className="btn btn-primary" disabled>Rejoindre</button>
        </div>
      </div>

      <div className="bg-surface border border-line rounded-card p-8 text-center">
        <p className="text-fg-soft mb-2">Tu n&apos;es dans aucun groupe pour le moment.</p>
        <p className="text-xs text-fg-faint">
          Cette fonction sera entièrement active dès la prochaine mise à jour. Tes parents
          devront approuver chaque demande d&apos;ami.
        </p>
      </div>
    </StudentShell>
  );
}
