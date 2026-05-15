/**
 * /fac — Section Faculté hub.
 *
 * Full marketing page for university students seeking orientation,
 * peer help and academic services.
 */
import { PageShell } from "@/components/landing/PageShell";
import { Link } from "@/i18n/routing";
import { CheckIcon } from "@/components/Icon";

export const metadata = { title: "Section Faculté | Najaح" };

/* ── SVG Icons ── */
function CompassIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
    </svg>
  );
}
function BuildingIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M3 9h18M9 21V9"/>
    </svg>
  );
}
function HandshakeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"/>
    </svg>
  );
}
function GradCapIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  );
}
function FileIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  );
}
function ChatIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  );
}

const SERVICES = [
  {
    icon: <CompassIcon />,
    tag: "Orientation",
    title: "Diagnostic & orientation",
    text: "Réponds à un questionnaire intelligent. L'IA analyse ton profil académique et te propose les filières et universités qui correspondent le mieux à tes notes et aspirations.",
    href: "/fac/diagnostic",
    cta: "Faire mon diagnostic",
  },
  {
    icon: <BuildingIcon />,
    tag: "Universités",
    title: "Catalogue des universités",
    text: "Explore les universités algériennes par wilaya, filière ou classement. Consulte les conditions d'admission, les débouchés et les témoignages d'étudiants.",
    href: "/fac/universites",
    cta: "Explorer les universités",
  },
  {
    icon: <HandshakeIcon />,
    tag: "Entraide",
    title: "Aide entre étudiants",
    text: "Pose une question, obtiens une réponse d'un pair ou d'un helper certifié. Partage tes cours, résume un document, ou aide les autres et gagne des points.",
    href: "/fac/aide",
    cta: "Poser une question",
  },
];

const FEATURES = [
  "Diagnostic d'orientation personnalisé par intelligence artificielle",
  "Base de données de toutes les universités publiques algériennes",
  "Forum d'entraide entre étudiants modéré par notre équipe",
  "Helpers certifiés disponibles pour des réponses rapides",
  "Résumés de cours et fiches de révision partagés par la communauté",
  "Accès gratuit — aucun abonnement requis pour les fonctions de base",
];

const FOR_WHOM = [
  { label: "Lycéens en Terminale", text: "Prépare ton orientation post-BAC avant les résultats." },
  { label: "Étudiants en 1ère année", text: "Trouve tes repères et obtiens de l'aide sur les cours de fac." },
  { label: "Étudiants avancés", text: "Deviens helper, partage ton expérience et aide les plus jeunes." },
];

export default function FacHub() {
  return (
    <PageShell active="fac">

      {/* Hero */}
      <section className="py-20 md:py-28 bg-surface-2 border-b border-line">
        <div className="container-x max-w-4xl text-center">
          <span className="eyebrow mb-4 block">Section Faculté</span>
          <h1 className="text-[clamp(32px,5vw,52px)] font-bold tracking-tight text-fg mb-5 leading-tight">
            Ton espace pour réussir<br className="hidden md:block" /> la transition vers la fac
          </h1>
          <p className="text-lg text-fg-soft max-w-2xl mx-auto mb-8">
            Orientation post-BAC, catalogue des universités algériennes, entraide entre étudiants — tout ce qu&apos;il faut pour démarrer sereinement.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/fac/diagnostic" className="btn btn-primary btn-lg">
              Faire mon diagnostic d&apos;orientation
            </Link>
            <Link href="/fac/universites" className="btn btn-outline btn-lg">
              Explorer les universités
            </Link>
          </div>
        </div>
      </section>

      {/* 3 service cards */}
      <section className="py-20 bg-surface">
        <div className="container-x">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <span className="eyebrow mb-3 block">Nos services</span>
            <h2 className="text-2xl md:text-3xl font-bold text-fg tracking-tight">
              Trois outils pour ton parcours universitaire
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {SERVICES.map((s, i) => (
              <article key={i} className="bg-surface-2 border border-line rounded-card p-7 flex flex-col hover:shadow-card-hover hover:border-transparent transition-all duration-200">
                <div className="w-11 h-11 rounded-[10px] bg-surface text-fg inline-flex items-center justify-center mb-4 border border-line">
                  {s.icon}
                </div>
                <span className="text-xs font-semibold text-fg-faint uppercase tracking-wider mb-2">{s.tag}</span>
                <h3 className="text-lg font-semibold text-fg mb-2">{s.title}</h3>
                <p className="text-sm text-fg-soft mb-6 flex-1 leading-relaxed">{s.text}</p>
                <Link href={s.href as never} className="btn btn-outline w-full justify-center text-sm">
                  {s.cta} →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* For whom */}
      <section className="py-20 bg-surface-2">
        <div className="container-x max-w-4xl">
          <div className="text-center mb-12">
            <span className="eyebrow mb-3 block">À qui ça s&apos;adresse</span>
            <h2 className="text-2xl md:text-3xl font-bold text-fg tracking-tight">
              Que tu sois lycéen ou déjà à l&apos;université
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {FOR_WHOM.map((w, i) => (
              <div key={i} className="bg-surface border border-line rounded-card p-6">
                <div className="text-sm font-bold text-navy dark:text-gold mb-2">{w.label}</div>
                <p className="text-sm text-fg-soft leading-relaxed">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature list */}
      <section className="py-20 bg-surface">
        <div className="container-x max-w-3xl">
          <div className="text-center mb-10">
            <span className="eyebrow mb-3 block">Ce qui est disponible</span>
            <h2 className="text-2xl md:text-3xl font-bold text-fg tracking-tight">
              Tout est là, sans frais cachés
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-start gap-3 bg-surface-2 border border-line rounded-card p-4">
                <CheckIcon size={18} className="text-gold mt-0.5 flex-shrink-0" />
                <span className="text-fg text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Become a helper CTA */}
      <section className="py-14 bg-surface-2 border-y border-line">
        <div className="container-x max-w-4xl grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="w-11 h-11 rounded-[10px] bg-surface border border-line text-fg inline-flex items-center justify-center mb-4">
              <GradCapIcon />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-fg mb-3">Deviens un Helper certifié</h2>
            <p className="text-fg-soft text-sm leading-relaxed mb-5">
              Tu es étudiant avancé ou jeune diplômé ? Aide les lycéens et étudiants en 1ère année. Accumule des points, obtiens un badge et valorise ton profil.
            </p>
            <Link href="/fac/devenir-helper" className="btn btn-primary">
              Devenir helper →
            </Link>
          </div>
          <div className="space-y-3">
            {[
              { icon: <FileIcon />, text: "Réponds aux questions dans ta spécialité" },
              { icon: <ChatIcon />, text: "Chat 1-à-1 avec les étudiants qui ont besoin d'aide" },
              { icon: <GradCapIcon />, text: "Obtiens un badge «Helper vérifié» sur ton profil" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-surface border border-line rounded-card p-4">
                <div className="text-fg-soft flex-shrink-0">{item.icon}</div>
                <span className="text-sm text-fg">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="accent-block py-20 text-center">
        <div className="container-x max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
            Commence ton orientation dès maintenant
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-prose mx-auto">
            Le diagnostic est gratuit et prend moins de 5 minutes. Aucune inscription requise pour commencer.
          </p>
          <Link href="/fac/diagnostic" className="btn btn-secondary btn-lg">
            Faire mon diagnostic d&apos;orientation
          </Link>
        </div>
      </section>

    </PageShell>
  );
}
