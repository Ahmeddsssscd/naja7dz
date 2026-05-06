import { PageShell } from "@/components/landing/PageShell";
import { EmailCapture } from "@/components/EmailCapture";
import { Link } from "@/i18n/routing";

export const metadata = {
  title: "Blog",
  description: "Conseils, retours d'expérience, et actualités de la plateforme éducative algérienne.",
};

const PLANNED_TOPICS = [
  {
    cat: "Bac & BEM",
    items: [
      "10 erreurs à éviter en physique au Bac",
      "Comment organiser ses 90 derniers jours avant le Bac",
      "BEM : les chapitres incontournables en mathématiques",
    ],
  },
  {
    cat: "Pour les parents",
    items: [
      "Combien d'heures d'étude par jour selon l'âge ?",
      "Comment motiver un enfant qui décroche",
      "Le coût caché des cours particuliers en Algérie",
    ],
  },
  {
    cat: "Méthodologie",
    items: [
      "La technique des questions actives",
      "Faire des fiches qui servent vraiment",
      "Préparer un examen en 5 étapes",
    ],
  },
];

export default function BlogPage() {
  return (
    <PageShell>
      {/* HERO */}
      <section className="bg-surface-2 py-20 md:py-26 text-center">
        <div className="container-x max-w-3xl">
          <span className="eyebrow mb-3 block">Le blog</span>
          <h1 className="text-[clamp(34px,5vw,52px)] font-bold tracking-tight text-fg mb-5 leading-tight">
            Bientôt — des conseils utiles, sans bla-bla.
          </h1>
          <p className="text-lg text-fg-soft mb-8">
            Articles courts, lisibles en 5 minutes, écrits par des enseignants algériens.
            Aucune théorie creuse — juste ce qui aide ton enfant à progresser.
          </p>
          <div className="flex justify-center">
            <EmailCapture />
          </div>
          <p className="text-xs text-fg-faint mt-3">
            Tu recevras le premier article dans ta boîte dès publication.
          </p>
        </div>
      </section>

      {/* ROADMAP */}
      <section className="py-20 bg-surface">
        <div className="container-x max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-fg text-center mb-3">
            Sujets à venir
          </h2>
          <p className="text-fg-soft text-center mb-12 max-w-2xl mx-auto">
            Voici les premiers articles en préparation. Tu peux nous suggérer un sujet en
            réponse à l&apos;email d&apos;inscription.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {PLANNED_TOPICS.map((cat, i) => (
              <article
                key={i}
                className="bg-surface border border-line rounded-card p-6"
              >
                <h3 className="text-xs font-semibold text-gold uppercase tracking-[0.08em] mb-4">
                  {cat.cat}
                </h3>
                <ul className="space-y-3">
                  {cat.items.map((title, j) => (
                    <li key={j} className="text-fg text-base leading-snug">
                      {title}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="text-center mt-14">
            <p className="text-fg-soft mb-3">Une question, une suggestion ?</p>
            <Link href="/contact" className="btn btn-outline">
              Nous écrire
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
