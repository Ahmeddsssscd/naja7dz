/**
 * /enseignant — Espace enseignant landing.
 *
 * Three states:
 *   - Anonymous: full marketing landing + CTA to /inscription.
 *   - Logged in, no teacher profile: inline TeacherSignupForm.
 *   - Logged in with profile: redirect to dashboard.
 */
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { PageShell } from "@/components/landing/PageShell";
import { Link } from "@/i18n/routing";
import { TeacherSignupForm } from "@/components/app/enseignant/TeacherSignupForm";
import { CheckIcon } from "@/components/Icon";

export const metadata = { title: "Espace enseignant | Najaح" };

/* ── SVG Icons ── */
function ClassIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  );
}
function ClipboardIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
      <rect x="8" y="2" width="8" height="4" rx="1"/>
    </svg>
  );
}
function ChartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  );
}
function NetworkIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="3"/><circle cx="5" cy="19" r="3"/><circle cx="19" cy="19" r="3"/>
      <line x1="12" y1="8" x2="5" y2="16"/><line x1="12" y1="8" x2="19" y2="16"/>
    </svg>
  );
}

const TOOLS = [
  {
    icon: <ClassIcon />,
    title: "Gestion des classes",
    text: "Crée tes classes, importe tes élèves et suis l'avancement de chacun depuis un tableau de bord centralisé.",
  },
  {
    icon: <ClipboardIcon />,
    title: "Devoirs & exercices",
    text: "Assigne des exercices, fixe des délais et reçois les résultats automatiquement — sans correction manuelle.",
  },
  {
    icon: <ChartIcon />,
    title: "Résultats & analyses",
    text: "Visualise les scores de la classe, identifie les notions mal comprises et repère les élèves en difficulté.",
  },
  {
    icon: <NetworkIcon />,
    title: "Réseau enseignants",
    text: "Rejoins la communauté des enseignants Najaح, partage des ressources et échange avec tes pairs à travers l'Algérie.",
  },
];

const FEATURES = [
  "Tableau de bord par classe avec statistiques en temps réel",
  "Assignation de chapitres et quiz en quelques clics",
  "Rapports individuels par élève téléchargeables",
  "Bibliothèque de ressources pédagogiques alignées au programme",
  "Messagerie intégrée avec les parents d'élèves",
  "Accès gratuit pour les enseignants pendant la phase bêta",
];

export default async function TeacherZone() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data: prof } = await supabase
      .from("teacher_profiles")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (prof) redirect("/enseignant/dashboard");
  }

  return (
    <PageShell active="teacher">

      {/* Hero */}
      <section className="py-20 md:py-28 bg-surface-2 border-b border-line">
        <div className="container-x max-w-4xl text-center">
          <span className="eyebrow mb-4 block">Espace enseignant</span>
          <h1 className="text-[clamp(32px,5vw,52px)] font-bold tracking-tight text-fg mb-5 leading-tight">
            L&apos;outil numérique pensé<br className="hidden md:block" /> pour l&apos;enseignant algérien
          </h1>
          <p className="text-lg text-fg-soft max-w-2xl mx-auto mb-8">
            Gère tes classes, assigne des exercices, suis les résultats de chaque élève et rejoins une communauté d&apos;enseignants engagés — le tout sur une seule plateforme.
          </p>
          {!user && (
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/inscription?role=teacher" className="btn btn-primary btn-lg">
                Rejoindre en tant qu&apos;enseignant
              </Link>
              <Link href="/connexion" className="btn btn-outline btn-lg">
                Se connecter
              </Link>
            </div>
          )}
        </div>
      </section>

      {user ? (
        /* Logged-in but no profile yet — inline activation form */
        <section className="py-14 bg-surface">
          <div className="container-x max-w-2xl">
            <h2 className="text-xl font-bold text-fg mb-6 text-center">Crée ton profil enseignant</h2>
            <TeacherSignupForm userEmail={user.email ?? ""} />
          </div>
        </section>
      ) : (
        <>
          {/* 4 tool cards */}
          <section className="py-20 bg-surface">
            <div className="container-x">
              <div className="text-center mb-12 max-w-2xl mx-auto">
                <span className="eyebrow mb-3 block">Tes outils</span>
                <h2 className="text-2xl md:text-3xl font-bold text-fg tracking-tight">
                  Tout ce qu&apos;il te faut en classe et hors classe
                </h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
                {TOOLS.map((tool, i) => (
                  <article key={i} className="bg-surface-2 border border-line rounded-card p-6 hover:shadow-card-hover hover:border-transparent transition-all duration-200">
                    <div className="w-11 h-11 rounded-[10px] bg-surface text-fg inline-flex items-center justify-center mb-5 border border-line">
                      {tool.icon}
                    </div>
                    <h3 className="text-base font-semibold text-fg mb-2">{tool.title}</h3>
                    <p className="text-sm text-fg-soft leading-relaxed">{tool.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Feature checklist */}
          <section className="py-20 bg-surface-2">
            <div className="container-x max-w-3xl">
              <div className="text-center mb-10">
                <span className="eyebrow mb-3 block">Ce qui est inclus</span>
                <h2 className="text-2xl md:text-3xl font-bold text-fg tracking-tight">
                  Fonctionnalités disponibles dès l&apos;inscription
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {FEATURES.map((f, i) => (
                  <div key={i} className="flex items-start gap-3 bg-surface border border-line rounded-card p-4">
                    <CheckIcon size={18} className="text-gold mt-0.5 flex-shrink-0" />
                    <span className="text-fg text-sm">{f}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <Link href="/enseignant/reseau" className="text-sm font-semibold text-fg-soft hover:text-fg inline-flex items-center gap-1.5 transition-colors">
                  Voir le réseau des enseignants →
                </Link>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="accent-block py-20 text-center">
            <div className="container-x max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
                Rejoins des centaines d&apos;enseignants
              </h2>
              <p className="text-white/70 text-lg mb-8 max-w-prose mx-auto">
                Gratuit pendant la phase bêta. Crée ton compte enseignant en 2 minutes.
              </p>
              <Link href="/inscription?role=teacher" className="btn btn-secondary btn-lg">
                Créer mon compte enseignant
              </Link>
              <p className="text-sm text-white/65 mt-5">
                Déjà inscrit ?{" "}
                <Link href="/connexion" className="text-white underline underline-offset-4 hover:text-gold">
                  Se connecter
                </Link>
              </p>
            </div>
          </section>
        </>
      )}

    </PageShell>
  );
}
