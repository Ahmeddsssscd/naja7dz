import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { StudentShell } from "@/components/app/StudentShell";

export const metadata = { title: "Bac countdown — Najaح" };

// Bac usually starts mid-June. Use next June 15 as placeholder.
function daysUntilBac() {
  const now = new Date();
  const target = new Date(now.getFullYear(), 5, 15);
  if (target < now) target.setFullYear(target.getFullYear() + 1);
  const ms = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

export default async function BacCountdownPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: child } = await supabase
    .from("children").select("*").eq("parent_id", user.id).limit(1).maybeSingle();

  const days = daysUntilBac();

  return (
    <StudentShell active="subjects" childName={child?.full_name} childGrade={child?.grade}>
      <div className="accent-block rounded-modal p-8 text-center mb-6 relative overflow-hidden">
        <div className="text-xs uppercase tracking-widest text-gold mb-2">Compte à rebours</div>
        <div className="text-7xl font-bold mb-1 leading-none">{days}</div>
        <div className="text-white/80 mb-4">jours avant le Bac</div>
        <div className="text-xs text-white/60">
          Cible : 15 juin · Tu peux le faire.
        </div>
      </div>

      <div className="bg-surface border-l-4 border-gold rounded-card p-5 mb-6">
        <div className="text-xs uppercase tracking-wider text-gold mb-2">Pensée du jour</div>
        <p className="text-fg italic">
          « La réussite au Bac n&apos;est pas une question de talent — c&apos;est une question
          de répétition. Cinquante minutes par jour, tous les jours, sans rater. »
        </p>
        <p className="text-xs text-fg-faint mt-3">— En attente de la première soumission</p>
      </div>

      <h2 className="text-base font-semibold text-fg mb-3">Plan d&apos;aujourd&apos;hui</h2>
      <div className="space-y-2 mb-6">
        <Task title="Quiz · Équations" meta="20 min · Mathématiques" />
        <Task title="Lecture · Fiche révision" meta="15 min · Physique" />
        <Task title="Examen blanc partiel" meta="40 min · Format Bac" />
      </div>
    </StudentShell>
  );
}

function Task({ title, meta }: { title: string; meta: string }) {
  return (
    <div className="bg-surface border border-line rounded-card p-4 flex items-center gap-3">
      <span className="w-9 h-9 rounded-full border-2 border-line-strong" />
      <div className="flex-1">
        <div className="text-sm font-semibold text-fg">{title}</div>
        <div className="text-xs text-fg-soft">{meta}</div>
      </div>
    </div>
  );
}
