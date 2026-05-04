import { Link } from "@/i18n/routing";
import { Logo } from "@/components/Logo";

export default function ConnexionPage() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="bg-white rounded-modal shadow-card border border-pale-blue p-10 max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <h1 className="text-2xl font-bold text-navy mb-2">Bientôt disponible</h1>
        <p className="text-ink-soft mb-6">
          La connexion ouvre dans la prochaine étape, après la mise en place de
          l&apos;authentification.
        </p>
        <Link href="/" className="btn btn-primary">
          ← Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
