import { PageShell } from "@/components/landing/PageShell";
import { Link } from "@/i18n/routing";

export const metadata = { title: "Espace enseignant — Najaح" };

const TOOLS = [
  {
    title: "Générateur de feuilles d'exercices",
    desc: "Crée des feuilles d'exercices alignées au programme officiel en quelques clics.",
    icon: "📝",
  },
  {
    title: "Banque de questions",
    desc: "Plus de 5 000 questions classées par niveau, matière et chapitre. À utiliser librement.",
    icon: "🗂",
  },
  {
    title: "Communauté d'enseignants",
    desc: "Partage tes meilleures fiches avec des collègues de toute l'Algérie.",
    icon: "👨‍🏫",
  },
  {
    title: "Modèles de cours",
    desc: "Fiches de séquence, plans de leçon, outils d'évaluation — clé en main.",
    icon: "📚",
  },
];

export default function TeacherZone() {
  return (
    <PageShell>
      <section className="py-20 md:py-26 bg-surface-2 text-center">
        <div className="container-x max-w-3xl">
          <span className="eyebrow mb-3 block">Espace enseignant</span>
          <h1 className="text-[clamp(34px,5vw,48px)] font-bold tracking-tight text-fg mb-4">
            Des outils gratuits pour les enseignants algériens.
          </h1>
          <p className="text-lg text-fg-soft mb-8">
            Najaح soutient les profs qui font la différence. Outils gratuits, communauté, partage de ressources —
            sans publicité, sans abonnement.
          </p>
          <Link href="/inscription" className="btn btn-primary btn-lg">
            Créer mon compte enseignant (bientôt)
          </Link>
        </div>
      </section>

      <section className="py-20 bg-surface">
        <div className="container-x max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-fg text-center mb-12">
            Ce que tu auras à disposition
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {TOOLS.map((tool, i) => (
              <article key={i} className="bg-surface border border-line rounded-card p-6">
                <div className="text-4xl mb-4">{tool.icon}</div>
                <h3 className="font-semibold text-fg mb-2">{tool.title}</h3>
                <p className="text-sm text-fg-soft">{tool.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="accent-block py-16 text-center">
        <div className="container-x">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Pour les écoles : licence B2B
          </h2>
          <p className="text-white/70 mb-6 max-w-prose mx-auto">
            Vous gérez une école et voulez Najaح pour tous vos élèves ? On a une formule dédiée.
          </p>
          <Link href="/contact" className="btn btn-secondary">Nous contacter</Link>
        </div>
      </section>
    </PageShell>
  );
}
