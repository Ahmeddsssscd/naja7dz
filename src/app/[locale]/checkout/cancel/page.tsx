import { PageShell } from "@/components/landing/PageShell";
import { Link } from "@/i18n/routing";

export const metadata = { title: "Paiement annulé" };

export default function CheckoutCancelPage() {
  return (
    <PageShell>
      <section className="bg-surface-2 py-20 md:py-26 min-h-[60vh] flex items-center">
        <div className="container-x max-w-lg text-center">
          <div className="inline-flex w-16 h-16 rounded-full bg-surface-3 text-fg items-center justify-center mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-fg mb-3">
            Paiement non finalisé
          </h1>
          <p className="text-lg text-fg-soft mb-8">
            Pas de souci — aucune somme n&apos;a été débitée. Tu peux réessayer quand tu veux.
            Si tu as rencontré un problème, on est là pour aider.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/tarifs" className="btn btn-primary btn-lg">
              Réessayer
            </Link>
            <Link href="/contact" className="btn btn-outline btn-lg">
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
