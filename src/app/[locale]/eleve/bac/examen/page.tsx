import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { StudentShell } from "@/components/app/StudentShell";

export const metadata = { title: "Examen blanc — Najaح" };

export default async function MockExamPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: child } = await supabase
    .from("children").select("*").eq("parent_id", user.id).limit(1).maybeSingle();

  return (
    <StudentShell active="subjects" childName={child?.full_name} childGrade={child?.grade}>
      <h1 className="text-2xl font-bold text-fg mb-2">Examen blanc</h1>
      <p className="text-fg-soft text-sm mb-6">
        Format officiel · chronométré · une fois lancé, tu ne peux pas quitter.
      </p>

      <div className="bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 rounded-card p-5 mb-6">
        <h2 className="font-semibold text-fg mb-2">⚠ Mode bloqué</h2>
        <p className="text-fg-soft text-sm leading-relaxed">
          Une fois l&apos;examen démarré, tu auras 4 heures (Bac) ou 2 heures (BEM) pour le
          terminer. Pas de pause, pas de retour. Comme le vrai jour J.
        </p>
      </div>

      <div className="bg-surface border border-line rounded-card p-6 mb-6">
        <h3 className="font-semibold text-fg mb-3">Bac blanc · Mathématiques</h3>
        <ul className="text-sm text-fg-soft space-y-1.5 mb-5">
          <li>• Durée : 4 heures</li>
          <li>• Format : sujet officiel ONEC 2024</li>
          <li>• Filière : Sciences expérimentales</li>
          <li>• Note finale calculée automatiquement</li>
        </ul>
        <button className="btn btn-primary w-full" disabled>
          Démarrer l&apos;examen blanc (bientôt)
        </button>
      </div>

      <p className="text-center text-xs text-fg-faint">
        Le mode bloqué + le minuteur officiel s&apos;activent dans la prochaine mise à jour.
      </p>
    </StudentShell>
  );
}
