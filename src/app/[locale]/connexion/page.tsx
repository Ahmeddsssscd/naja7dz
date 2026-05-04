import { PageShell } from "@/components/landing/PageShell";
import { Link } from "@/i18n/routing";
import { Logo } from "@/components/Logo";

export const metadata = { title: "Connexion — Najaح" };

export default function ConnexionPage() {
  return (
    <PageShell>
      <section className="bg-surface-2 py-16 md:py-24 min-h-[80vh] flex items-center">
        <div className="container-x max-w-md">
          <div className="bg-surface border border-line rounded-modal shadow-card p-8 md:p-10">
            <div className="flex justify-center mb-6">
              <Logo height={44} />
            </div>

            <h1 className="text-center text-2xl font-bold text-fg mb-1">Bon retour</h1>
            <p className="text-center text-fg-soft text-sm mb-8">
              Connecte-toi pour accéder à l&apos;espace parent.
            </p>

            <form className="space-y-4">
              <Field label="Adresse email">
                <input
                  type="email"
                  className="login-input"
                  placeholder="parent@email.com"
                  autoComplete="email"
                  disabled
                />
              </Field>
              <Field
                label={
                  <span className="flex justify-between items-center w-full">
                    <span>Mot de passe</span>
                    <Link
                      href="/connexion/oublie"
                      className="text-xs text-fg-soft hover:text-gold font-normal"
                    >
                      Mot de passe oublié ?
                    </Link>
                  </span>
                }
              >
                <input
                  type="password"
                  className="login-input"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled
                />
              </Field>
              <button
                type="button"
                disabled
                className="btn btn-primary btn-block btn-lg opacity-60 cursor-not-allowed w-full"
              >
                Se connecter
              </button>
            </form>

            <div className="mt-8 p-4 bg-surface-2 rounded-card border border-line">
              <p className="text-sm text-fg-soft text-center mb-3">
                <strong className="text-fg">Najaح ouvre bientôt.</strong> L&apos;inscription
                complète et la connexion s&apos;activent dès le lancement.
              </p>
              <Link
                href="/inscription"
                className="btn btn-secondary w-full"
              >
                Rejoindre la liste d&apos;attente →
              </Link>
            </div>
          </div>

          <p className="text-center text-fg-faint text-sm mt-6">
            <Link href="/" className="hover:text-fg">← Retour à l&apos;accueil</Link>
          </p>
        </div>
      </section>

      <style>{`
        .login-input {
          width: 100%;
          padding: 12px 14px;
          background: var(--surface);
          border: 1.5px solid var(--line-strong);
          border-radius: 8px;
          color: var(--fg);
          font-size: 15px;
          font-family: inherit;
        }
        .login-input::placeholder { color: var(--fg-faint); }
        .login-input:disabled { background: var(--surface-2); cursor: not-allowed; }
      `}</style>
    </PageShell>
  );
}

function Field({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-fg mb-1.5">{label}</span>
      {children}
    </label>
  );
}
