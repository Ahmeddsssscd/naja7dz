import { PageShell } from "@/components/landing/PageShell";
import { Link } from "@/i18n/routing";
import { Logo } from "@/components/Logo";
import { ResetForm } from "@/components/auth/ResetForm";

export const metadata = { title: "Mot de passe oublié — Najaح" };

export default function ForgotPasswordPage() {
  return (
    <PageShell>
      <section className="bg-surface-2 py-16 md:py-24 min-h-[80vh] flex items-center">
        <div className="container-x max-w-md">
          <div className="bg-surface border border-line rounded-modal shadow-card p-8 md:p-10">
            <div className="flex justify-center mb-6"><Logo height={44} /></div>
            <h1 className="text-center text-2xl font-bold text-fg mb-1">
              Réinitialiser ton mot de passe
            </h1>
            <p className="text-center text-fg-soft text-sm mb-8">
              Entre ton email et on t&apos;enverra un lien sécurisé.
            </p>
            <ResetForm />
            <p className="text-center text-fg-faint text-sm mt-8">
              <Link href="/connexion" className="hover:text-fg">← Retour à la connexion</Link>
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
