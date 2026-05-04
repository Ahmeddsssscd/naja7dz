import { Link } from "@/i18n/routing";
import { Logo } from "@/components/Logo";

export default function InscriptionPage() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="bg-white rounded-modal shadow-card border border-pale-blue p-10 max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <h1 className="text-2xl font-bold text-navy mb-2">Bientôt disponible</h1>
        <p className="text-ink-soft mb-6">
          L&apos;inscription ouvre dans la prochaine étape. Pour l&apos;instant, le site
          présente Najaح aux futures familles.
        </p>
        <Link href="/" className="btn btn-primary">
          ← Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
