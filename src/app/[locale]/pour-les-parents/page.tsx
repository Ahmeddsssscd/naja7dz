import { Link } from "@/i18n/routing";
import { PageShell } from "@/components/landing/PageShell";
import { CheckIcon } from "@/components/Icon";

export const metadata = { title: "Pour les parents | Najaح" };

/* ── SVG Icons ── */
function ShieldIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
function ChartBarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  );
}
function BellIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  );
}
function UsersIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}
function LockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}
function BookOpenIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  );
}

const PILLARS = [
  {
    icon: <ChartBarIcon />,
    title: "Suivi en temps réel",
    text: "Tableau de bord dédié aux parents : scores, temps d'étude, progression par matière et tendance sur 7 jours — tout en un coup d'œil.",
  },
  {
    icon: <BellIcon />,
    title: "Alertes & rapports hebdomadaires",
    text: "Reçois un rapport chaque semaine avec les points forts, les lacunes détectées par l'IA, et les recommandations pour la semaine suivante.",
  },
  {
    icon: <BookOpenIcon />,
    title: "Programme officiel algérien",
    text: "Tout le contenu est aligné sur les curricula du Ministère de l'Éducation Nationale — de la 1ère à la Terminale, arabe, français et maths.",
  },
  {
    icon: <UsersIcon />,
    title: "Plusieurs enfants, un seul compte",
    text: "Gère jusqu'à 5 profils enfants depuis un seul compte parent. Chaque enfant a son propre espace et ses propres missions.",
  },
  {
    icon: <ShieldIcon />,
    title: "Environnement 100 % sécurisé",
    text: "Pas de publicités, pas de réseaux sociaux, pas de contenu externe non contrôlé. Ton enfant apprend dans un espace fermé et bienveillant.",
  },
  {
    icon: <LockIcon />,
    title: "Contrôle parental total",
    text: "Active ou désactive des fonctionnalités selon l'âge. Fixe des limites de temps de session. Tu restes maître des accès.",
  },
];

const STEPS = [
  { n: "01", title: "Crée ton compte", text: "Inscription en moins de 2 minutes. Aucune carte bancaire requise pour l'essai." },
  { n: "02", title: "Ajoute ton enfant", text: "Renseigne son prénom, sa classe et sa filière. L'IA adapte aussitôt le contenu à son niveau." },
  { n: "03", title: "Suis ses progrès", text: "Consulte son tableau de bord chaque semaine depuis ton espace parent et reçois les rapports par e-mail." },
];

export default function PourLesParentsPage() {
  return (
    <PageShell active="parents">

      {/* Hero */}
      <section className="py-20 md:py-28 bg-surface-2 border-b border-line">
        <div className="container-x max-w-4xl text-center">
          <span className="eyebrow mb-4 block">Espace parents</span>
          <h1 className="text-[clamp(32px,5vw,52px)] font-bold tracking-tight text-fg mb-5 leading-tight">
            Accompagne la réussite de ton enfant,<br className="hidden md:block" /> sans t&apos;y perdre
          </h1>
          <p className="text-lg text-fg-soft max-w-2xl mx-auto mb-8">
            Najaح donne aux parents une visibilité complète sur le parcours scolaire de leur enfant — et à l&apos;enfant un espace d&apos;apprentissage sérieux, sécurisé et motivant.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/inscription" className="btn btn-primary btn-lg">Créer un compte parent</Link>
            <Link href="/tarifs" className="btn btn-outline btn-lg">Voir les offres</Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-surface">
        <div className="container-x max-w-4xl">
          <div className="text-center mb-12">
            <span className="eyebrow mb-3 block">Démarrage rapide</span>
            <h2 className="text-2xl md:text-3xl font-bold text-fg tracking-tight">Opérationnel en 3 étapes</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map((s) => (
              <div key={s.n} className="bg-surface-2 border border-line rounded-card p-6">
                <div className="text-3xl font-bold text-gold/60 mb-3 font-mono">{s.n}</div>
                <h3 className="text-base font-semibold text-fg mb-2">{s.title}</h3>
                <p className="text-fg-soft text-sm leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-20 bg-surface-2">
        <div className="container-x">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <span className="eyebrow mb-3 block">Ce que tu obtiens</span>
            <h2 className="text-2xl md:text-3xl font-bold text-fg tracking-tight">Tout ce dont un parent a besoin</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {PILLARS.map((p, i) => (
              <article key={i} className="bg-surface border border-line rounded-card p-6 hover:shadow-card-hover hover:border-transparent transition-all duration-200">
                <div className="w-11 h-11 rounded-[10px] bg-surface-3 text-fg inline-flex items-center justify-center mb-5">
                  {p.icon}
                </div>
                <h3 className="text-base font-semibold text-fg mb-2">{p.title}</h3>
                <p className="text-sm text-fg-soft leading-relaxed">{p.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Reassurance strip */}
      <section className="py-12 bg-surface border-y border-line">
        <div className="container-x max-w-4xl">
          <ul className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { label: "Sans pub", sub: "Espace publicitaire zéro" },
              { label: "Annulation libre", sub: "Résiliable à tout moment" },
              { label: "Données privées", sub: "Aucune revente à des tiers" },
              { label: "Support humain", sub: "Réponse en moins de 24 h" },
            ].map((item) => (
              <li key={item.label} className="flex flex-col gap-1">
                <span className="text-sm font-bold text-fg flex items-center justify-center gap-1.5">
                  <CheckIcon size={14} className="text-gold" /> {item.label}
                </span>
                <span className="text-xs text-fg-faint">{item.sub}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="accent-block py-20 text-center">
        <div className="container-x max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
            Prêt à voir ton enfant najah ?
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-prose mx-auto">
            Inscription gratuite. Tu testes avant de t&apos;engager. Annulation en un clic.
          </p>
          <Link href="/inscription" className="btn btn-secondary btn-lg">
            Commencer gratuitement
          </Link>
        </div>
      </section>

    </PageShell>
  );
}
