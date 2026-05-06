import { PageShell } from "@/components/landing/PageShell";
import { Link } from "@/i18n/routing";
import { Logo } from "@/components/Logo";
import { LoginForm } from "@/components/auth/LoginForm";
import { Suspense } from "react";

export const metadata = { title: "Connexion" };

export default function ConnexionPage() {
  return (
    <PageShell>
      <section className="bg-surface-2 py-16 md:py-24 min-h-[80vh] flex items-center">
        <div className="container-x max-w-md">
          <div className="bg-surface border border-line rounded-modal shadow-card p-8 md:p-10">
            <div className="flex justify-center mb-6"><Logo height={44} /></div>
            <h1 className="text-center text-2xl font-bold text-fg mb-1">Bon retour</h1>
            <p className="text-center text-fg-soft text-sm mb-8">
              Connecte-toi pour accéder à l&apos;espace parent.
            </p>
            <Suspense>
              <LoginForm />
            </Suspense>
            <div className="mt-8 pt-6 border-t border-line text-center">
              <p className="text-sm text-fg-soft">
                Pas encore de compte ?{" "}
                <Link href="/inscription" className="text-fg font-semibold underline">
                  Créer un compte
                </Link>
              </p>
            </div>
          </div>
          <p className="text-center text-fg-faint text-sm mt-6">
            <Link href="/" className="hover:text-fg">← Retour à l&apos;accueil</Link>
          </p>
        </div>
      </section>
    </PageShell>
  );
}
