import { PageShell } from "@/components/landing/PageShell";
import { Link } from "@/i18n/routing";
import { Logo } from "@/components/Logo";

export const metadata = { title: "Mot de passe oublié — Najaح" };

export default function ForgotPasswordPage() {
  return (
    <PageShell>
      <section className="bg-surface-2 py-16 md:py-24 min-h-[80vh] flex items-center">
        <div className="container-x max-w-md">
          <div className="bg-surface border border-line rounded-modal shadow-card p-8 md:p-10">
            <div className="flex justify-center mb-6">
              <Logo height={44} />
            </div>

            <h1 className="text-center text-2xl font-bold text-fg mb-1">
              Réinitialiser ton mot de passe
            </h1>
            <p className="text-center text-fg-soft text-sm mb-8">
              Entre ton email et on t&apos;enverra un lien sécurisé.
            </p>

            <form className="space-y-4">
              <label className="block">
                <span className="block text-sm font-medium text-fg mb-1.5">
                  Adresse email du compte
                </span>
                <input
                  type="email"
                  className="forgot-input"
                  placeholder="parent@email.com"
                  autoComplete="email"
                  disabled
                />
              </label>
              <button
                type="button"
                disabled
                className="btn btn-primary btn-block btn-lg opacity-60 cursor-not-allowed w-full"
              >
                Envoyer le lien
              </button>
            </form>

            <p className="text-sm text-fg-soft text-center mt-8">
              La réinitialisation s&apos;active au lancement complet de Najaح.
            </p>

            <p className="text-center text-fg-faint text-sm mt-6">
              <Link href="/connexion" className="hover:text-fg">
                ← Retour à la connexion
              </Link>
            </p>
          </div>
        </div>
      </section>

      <style>{`
        .forgot-input {
          width: 100%;
          padding: 12px 14px;
          background: var(--surface);
          border: 1.5px solid var(--line-strong);
          border-radius: 8px;
          color: var(--fg);
          font-size: 15px;
        }
        .forgot-input::placeholder { color: var(--fg-faint); }
        .forgot-input:disabled { background: var(--surface-2); cursor: not-allowed; }
      `}</style>
    </PageShell>
  );
}
