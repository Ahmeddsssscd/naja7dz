import { PageShell } from '@/components/landing/PageShell';
import { BacFilterGrid } from '@/components/bac/BacFilterGrid';
import { Link } from '@/i18n/routing';

export const metadata = {
  title: 'BAC Algérie — Sujets & Corrections | Najaح',
  description: 'Consultez les sujets et corrections du baccalauréat algérien (2019-2024) par branche et matière.',
};

export default function BacPage() {
  return (
    <PageShell active="bac">
      {/* Hero */}
      <section className="bg-surface-2 py-16 md:py-20 border-b border-line">
        <div className="container-x text-center max-w-3xl mx-auto">
          <span className="eyebrow mb-4">📋 Baccalauréat Algérien</span>
          <h1 className="text-[clamp(28px,5vw,48px)] font-bold leading-tight tracking-tight text-fg mb-4">
            Sujets & Corrections BAC
          </h1>
          <p className="text-lg text-fg-soft max-w-xl mx-auto">
            Accédez aux examens officiels du BAC de <strong>2019 à 2024</strong> — toutes branches et matières — et entraînez-vous avec les vraies épreuves.
          </p>
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="py-14 bg-surface">
        <div className="container-x max-w-5xl mx-auto">
          <BacFilterGrid />
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-surface-2 border-t border-line py-8">
        <div className="container-x max-w-3xl mx-auto text-center text-sm text-fg-faint space-y-1">
          <p>
            Les documents ci-dessus sont hébergés sur des sites tiers et redirigent vers{' '}
            <a href="https://bac-algerie.net" target="_blank" rel="noopener noreferrer" className="underline">bac-algerie.net</a>.
            Najaح n&apos;est pas affilié à ce site et ne garantit pas la disponibilité des liens.
          </p>
        </div>
      </section>

      {/* Premium CTA */}
      <section className="accent-block py-16 text-center">
        <div className="container-x max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Prépare ton BAC avec un coach IA
          </h2>
          <p className="text-white/70 mb-7">
            Explications personnalisées, quiz adaptatif et suivi de progression — bien plus qu&apos;un simple recueil de sujets.
          </p>
          <Link href="/inscription" className="btn btn-secondary btn-lg">
            Commencer gratuitement →
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
