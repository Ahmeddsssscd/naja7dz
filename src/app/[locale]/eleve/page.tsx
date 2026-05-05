import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { StudentShell } from "@/components/app/StudentShell";
import { Link } from "@/i18n/routing";

export const metadata = { title: "Mon espace — Najaح" };

export default async function StudentHome() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  // Pick the parent's first child as the "active" student (basic for now)
  const { data: child } = await supabase
    .from("children")
    .select("*")
    .eq("parent_id", user.id)
    .order("created_at")
    .limit(1)
    .maybeSingle();

  return (
    <StudentShell active="home" childName={child?.full_name ?? "Étudiant"} childGrade={child?.grade}>
      {/* Hero mission card */}
      <div className="bg-navy text-white rounded-modal p-6 mb-6 relative overflow-hidden">
        <span className="text-xs font-semibold text-gold uppercase tracking-wider">Aujourd&apos;hui</span>
        <h1 className="text-xl font-bold mt-2 mb-1">Commence ton parcours</h1>
        <p className="text-white/70 text-sm mb-4">3 missions · 25 minutes</p>
        <Link
          href={{ pathname: "/eleve/quiz/[id]", params: { id: "demo" } } as never}
          className="bg-gold text-navy font-semibold px-4 py-2 rounded-btn text-sm inline-block"
        >
          Continuer →
        </Link>
      </div>

      {/* Today's missions */}
      <div className="flex justify-between items-baseline mb-3">
        <h2 className="text-base font-semibold text-fg">Missions du jour</h2>
      </div>
      <div className="space-y-2 mb-8">
        <Mission title="Quiz · Équations du 1er degré" meta="8 min · Mathématiques" xp="+50 XP" />
        <Mission title="Lecture · chapitre 3" meta="10 min · Français" xp="+30 XP" />
        <Mission title="Révision · erreurs d'hier" meta="7 min · 5 questions" xp="+40 XP" />
      </div>

      {/* Quick access */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <Quick href="/eleve/tuteur" title="Tuteur" subtitle="Pose une question" />
        <Quick href="/eleve/devoirs" title="Aide aux devoirs" subtitle="Photo de l'exercice" />
        <Quick href="/eleve/bac" title="Bac · Sujets" subtitle="Archive complète" />
        <Quick href="/eleve/bac/examen" title="Examen blanc" subtitle="Mode chronométré" />
      </div>

      {/* Subjects scroll */}
      <div className="flex justify-between items-baseline mb-3">
        <h2 className="text-base font-semibold text-fg">Mes matières</h2>
        <Link href="/eleve/matieres" className="text-xs text-fg-soft">Tout voir</Link>
      </div>
      <div className="-mx-5 px-5 flex gap-3 overflow-x-auto scrollbar-hide">
        {["Mathématiques", "Physique", "Arabe", "Français", "Anglais"].map((s) => (
          <div key={s} className="flex-none w-40 bg-surface border border-line rounded-card p-4">
            <div className="w-9 h-9 rounded-full bg-pale-blue text-navy mb-3 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            </div>
            <div className="text-sm font-semibold text-fg">{s}</div>
            <div className="text-xs text-fg-soft mt-1">0% · — chap.</div>
          </div>
        ))}
      </div>
    </StudentShell>
  );
}

function Mission({ title, meta, xp }: { title: string; meta: string; xp: string }) {
  return (
    <Link
      href={{ pathname: "/eleve/quiz/[id]", params: { id: "demo" } } as never}
      className="bg-surface border border-line rounded-card p-3.5 flex items-center gap-3 hover:border-fg/30 transition-colors"
    >
      <span className="w-10 h-10 rounded-[10px] bg-pale-blue text-navy flex items-center justify-center flex-shrink-0">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-fg">{title}</div>
        <div className="text-xs text-fg-soft">{meta}</div>
      </div>
      <span className="text-xs font-bold text-gold">{xp}</span>
    </Link>
  );
}

function Quick({ href, title, subtitle }: { href: string; title: string; subtitle: string }) {
  return (
    <Link
      href={href as never}
      className="bg-surface border border-line rounded-card p-4 hover:border-fg/30 transition-colors"
    >
      <div className="w-9 h-9 rounded-lg bg-pale-blue text-navy mb-3 flex items-center justify-center">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
      </div>
      <div className="text-sm font-semibold text-fg">{title}</div>
      <div className="text-xs text-fg-soft">{subtitle}</div>
    </Link>
  );
}
