import { Link } from "@/i18n/routing";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <Logo height={40} />
        </div>
        <p className="eyebrow mb-3">404</p>
        <h1 className="text-3xl font-bold text-navy mb-3">Page introuvable</h1>
        <p className="text-ink-soft mb-8 max-w-prose">
          Cette page n&apos;existe pas ou a été déplacée. Retourne à l&apos;accueil pour
          continuer.
        </p>
        <Link href="/" className="btn btn-primary">
          ← Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
