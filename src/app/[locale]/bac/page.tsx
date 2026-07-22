import { PageShell } from '@/components/landing/PageShell';
import { BacFilterGrid } from '@/components/bac/BacFilterGrid';
import { Link } from '@/i18n/routing';
import { CheckIcon } from '@/components/Icon';

export const metadata = {
  title: 'BAC Algérie — Sujets & Corrections | Najaح',
  description: 'Accède aux sujets et corrections du baccalauréat algérien (2019–2024) par branche et matière, et prépare-toi avec un coach IA.',
};

const FEATURES = [
  'Sujets officiels de 2019 à 2024 — toutes filières',
  'Corrections détaillées pour chaque épreuve',
  'Coach IA qui explique chaque solution étape par étape',
  'Quiz adaptatif pour tester tes connaissances avant le jour J',
  'Compte à rebours et mode examen blanc',
];

export default function BacPage() {
  return (
    <PageShell active="bac">

      {/* Hero */}
      <section className="bg-surface-2 py-16 md:py-24 border-b border-line">
        <div className="container-x max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="eyebrow mb-4 block">Baccalauréat Algérien</span>
            <h1 className="text-[clamp(28px,5vw,48px)] font-bold leading-tight tracking-tight text-fg mb-5">
              Prépare ton BAC avec les vraies épreuves
            </h1>
            <p className="text-lg text-fg-soft mb-8 max-w-md">
              Accède aux sujets et corrections officiels de 2019 à 2024, puis entraîne-toi avec un coach IA qui s&apos;adapte à ton niveau.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/inscription" className="btn btn-primary btn-lg">
                Commencer gratuitement
              </Link>
              <Link href="/bac/professeurs" className="btn btn-outline btn-lg">
                Trouver un professeur
              </Link>
            </div>
          </div>

          {/* Feature list */}
          <ul className="space-y-3">
            {FEATURES.map((f, i) => (
              <li key={i} className="flex items-start gap-3 bg-surface border border-line rounded-card p-4">
                <CheckIcon size={18} className="text-gold mt-0.5 flex-shrink-0" />
                <span className="text-fg text-sm">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Free archive */}
      <section className="py-14 bg-surface">
        <div className="container-x max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="eyebrow mb-3 block">Archive gratuite</span>
            <h2 className="text-2xl md:text-3xl font-bold text-fg tracking-tight mb-2">
              Sujets &amp; Corrections BAC — 2019 à 2024
            </h2>
            <p className="text-fg-soft text-sm max-w-md mx-auto">
              Sélectionne une année et une filière pour accéder aux épreuves.
            </p>
          </div>
          <BacFilterGrid />
        </div>
      </section>

      {/* Disclaimer */}
      <div className="bg-surface-2 border-t border-line py-5">
        <p className="container-x max-w-3xl mx-auto text-center text-xs text-fg-faint">
          Les documents ci-dessus sont hébergés sur des sites tiers (bac-algerie.net).
          Najaح n&apos;est pas affilié à ces sites et ne garantit pas la disponibilité des liens.
        </p>
      </div>

      {/* Premium CTA */}
      <section className="accent-block py-16 text-center">
        <div className="container-x max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Va plus loin avec le coach IA
          </h2>
          <p className="text-white/70 mb-7 max-w-md mx-auto">
            Explications personnalisées, quiz adaptatif, mode examen blanc et suivi de progression — tout ce qu&apos;il faut pour réussir.
          </p>
          <Link href="/inscription" className="btn btn-secondary btn-lg">
            Commencer gratuitement
          </Link>
        </div>
      </section>

    </PageShell>
  );
}
