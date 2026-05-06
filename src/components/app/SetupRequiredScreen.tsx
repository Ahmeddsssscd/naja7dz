import { Logo } from "@/components/Logo";

/**
 * Friendly fallback shown when the database schema is incomplete.
 * Server-rendered. Includes copy-paste instructions for the admin.
 */
export function SetupRequiredScreen({ missing = [] as string[] }: { missing?: string[] }) {
  return (
    <div className="min-h-screen bg-surface-2 flex items-center justify-center px-5 py-10">
      <div className="bg-surface border border-line rounded-modal p-8 md:p-10 max-w-2xl w-full">
        <div className="flex justify-center mb-6"><Logo height={36} /></div>

        <div className="text-center mb-6">
          <span className="inline-flex w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 9v4M12 17h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
            </svg>
          </span>
          <h1 className="text-2xl font-bold text-fg mb-2">Configuration requise</h1>
          <p className="text-fg-soft">
            La base de données Supabase n&apos;est pas complètement configurée. Pour activer cette page,
            il faut appliquer le script de configuration une seule fois.
          </p>
        </div>

        <div className="bg-surface-2 border border-line rounded-card p-5 mb-6">
          <h2 className="font-semibold text-fg mb-3">À faire en 1 minute</h2>
          <ol className="text-sm text-fg space-y-2 list-decimal ms-5">
            <li>
              Ouvre l&apos;éditeur SQL Supabase :{" "}
              <a
                href="https://supabase.com/dashboard/project/cyabavzunccvlfwvuyuj/sql/new"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold underline font-medium"
              >
                supabase.com/dashboard/.../sql/new
              </a>
            </li>
            <li>
              Sur ton ordinateur, ouvre le fichier{" "}
              <code className="px-1.5 py-0.5 bg-surface-3 rounded text-xs font-mono">database/SETUP.sql</code> dans le projet
            </li>
            <li>Copie tout le contenu et colle-le dans l&apos;éditeur SQL</li>
            <li>Clique <strong>Run</strong> en bas à droite</li>
            <li>Recharge cette page — tout fonctionnera</li>
          </ol>
        </div>

        {missing.length > 0 && (
          <details className="bg-surface-2 border border-line rounded-card p-4 mb-6 text-sm">
            <summary className="cursor-pointer font-semibold text-fg-soft">
              Tables manquantes ({missing.length})
            </summary>
            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-fg-faint font-mono">
              {missing.map((t) => <span key={t}>• {t}</span>)}
            </div>
          </details>
        )}

        <div className="text-xs text-fg-faint text-center">
          Le script est <strong>idempotent</strong> — tu peux le relancer sans risque
          (rien n&apos;est dupliqué).
        </div>
      </div>
    </div>
  );
}
