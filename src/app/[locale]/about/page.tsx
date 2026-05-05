import { Link } from "@/i18n/routing";
import { PageShell } from "@/components/landing/PageShell";

export const metadata = {
  title: "À propos — Najaح",
  description: "Notre mission : aider les enfants algériens à réussir, du primaire au Bac.",
};

export default function AboutPage() {
  return (
    <PageShell>
      {/* HERO */}
      <section className="bg-surface-2 py-20 md:py-26">
        <div className="container-x max-w-3xl text-center">
          <span className="eyebrow mb-3 block">Notre mission</span>
          <h1 className="text-[clamp(34px,5vw,52px)] font-bold tracking-tight text-fg mb-5 leading-tight">
            Donner à chaque enfant algérien les outils pour réussir.
          </h1>
          <p className="text-lg text-fg-soft">
            Najaح est née d&apos;une conviction simple : chaque famille mérite l&apos;accès
            à un accompagnement scolaire de qualité, à un prix juste, dans la langue de son
            choix.
          </p>
        </div>
      </section>

      {/* STORY */}
      <section className="py-20 bg-surface">
        <div className="container-x max-w-3xl prose-najah">
          <h2>Pourquoi Najaح ?</h2>
          <p>
            En Algérie, des centaines de milliers de familles dépensent chaque mois entre
            5 000 et 30 000 DA en cours particuliers, parfois sans savoir si la qualité
            justifie le prix. Les bons professeurs sont rares dans certaines wilayas.
            Le programme officiel est dense, exigeant, et les enfants peuvent vite
            décrocher.
          </p>
          <p>
            Najaح propose une alternative : une plateforme accessible 24h/24, alignée sur
            le programme national, en arabe et en français, à un prix qui rend
            l&apos;accompagnement scolaire abordable pour la grande majorité des familles
            — soit moins qu&apos;un seul cours particulier par mois.
          </p>

          <h2>Ce que nous croyons</h2>
          <ul>
            <li>
              <strong>L&apos;éducation est un droit, pas un privilège.</strong> Chaque
              enfant doit pouvoir réussir, peu importe la wilaya, peu importe le revenu
              familial.
            </li>
            <li>
              <strong>La technologie au service de l&apos;humain.</strong> Najaح
              accompagne, mais ne remplace ni l&apos;école, ni le parent, ni le professeur.
            </li>
            <li>
              <strong>Bilingue par identité.</strong> L&apos;arabe et le français vivent
              ensemble dans le quotidien algérien — Najaح aussi.
            </li>
            <li>
              <strong>La sécurité avant tout.</strong> Pas de publicité, pas de pistage,
              pas d&apos;achats cachés. Loi 18-07 respectée à la lettre.
            </li>
            <li>
              <strong>Local.</strong> Najaح est conçu en Algérie, pour l&apos;Algérie.
              Programme officiel, paiement local, support local.
            </li>
          </ul>

          <h2>Comment nous travaillons</h2>
          <p>
            Najaح est en construction publique. Le code source, la roadmap et les choix
            techniques sont ouverts à qui veut les regarder. Chaque mise à jour est
            documentée. Chaque utilisateur peut signaler un bug, suggérer une
            amélioration, ou demander une fonctionnalité.
          </p>
          <p>
            Nous publierons régulièrement des mises à jour sur notre blog : chiffres
            d&apos;utilisation, leçons apprises, et notre feuille de route à venir.
          </p>

          <h2>Rejoignez-nous</h2>
          <p>
            Najaح est encore jeune. Plus tôt vous nous rejoignez, plus vous pesez sur la
            direction du produit. Vos retours guident chaque décision.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="accent-block py-20 text-center">
        <div className="container-x">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 max-w-2xl mx-auto">
            Prêt à voir ton enfant najah ?
          </h2>
          <Link href="/inscription" className="btn btn-secondary btn-lg mt-2">
            Commencer gratuitement
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
