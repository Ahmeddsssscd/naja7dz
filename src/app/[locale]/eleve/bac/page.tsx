import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { StudentShell } from "@/components/app/StudentShell";
import { Link } from "@/i18n/routing";

export const metadata = { title: "Bac & BEM — Najaح" };

const SAMPLE_PAPERS = [
  { exam: "Bac 2024", subject: "Mathématiques", filiere: "Sciences exp." },
  { exam: "Bac 2024", subject: "Physique", filiere: "Sciences exp." },
  { exam: "Bac 2023", subject: "Mathématiques", filiere: "Math" },
  { exam: "BEM 2024", subject: "Mathématiques", filiere: "Tronc commun" },
  { exam: "BEM 2024", subject: "Sciences", filiere: "Tronc commun" },
];

export default async function BacListPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: child } = await supabase
    .from("children").select("*").eq("parent_id", user.id).limit(1).maybeSingle();

  return (
    <StudentShell active="subjects" childName={child?.full_name} childGrade={child?.grade}>
      <h1 className="text-2xl font-bold text-fg mb-2">Bac & BEM</h1>
      <p className="text-fg-soft text-sm mb-6">
        Sujets officiels archivés + examens blancs chronométrés.
      </p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <Link href="/eleve/bac/countdown" className="accent-block rounded-card p-4">
          <div className="text-xs text-gold uppercase tracking-wider mb-1">Compte à rebours</div>
          <div className="text-2xl font-bold">— jours</div>
          <div className="text-xs text-white/60 mt-1">avant le Bac</div>
        </Link>
        <Link href="/eleve/bac/examen" className="bg-surface border border-line rounded-card p-4">
          <div className="text-xs text-gold uppercase tracking-wider mb-1">Examen blanc</div>
          <div className="text-fg font-semibold mb-1">Mode chronométré</div>
          <div className="text-xs text-fg-soft">Format officiel</div>
        </Link>
      </div>

      <h2 className="text-base font-semibold text-fg mb-3">Sujets disponibles</h2>
      <div className="space-y-2">
        {SAMPLE_PAPERS.map((p, i) => (
          <div key={i} className="bg-surface border border-line rounded-card p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-gold uppercase tracking-wider">{p.exam}</span>
              <span className="text-xs text-fg-faint">{p.filiere}</span>
            </div>
            <div className="text-fg font-medium text-sm">{p.subject}</div>
            <div className="text-xs text-fg-soft mt-2">PDF + solution corrigée</div>
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-fg-faint mt-6">
        L&apos;archive complète est en cours de constitution. Plus de sujets ajoutés chaque semaine.
      </p>
    </StudentShell>
  );
}
