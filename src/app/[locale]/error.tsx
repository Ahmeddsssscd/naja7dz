"use client";

/**
 * Locale-level error boundary. Catches any uncaught error in the public
 * route tree and shows a branded fallback instead of the raw stack trace.
 *
 * MUST be a client component — Next.js requirement for error boundaries.
 */

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Logo } from "@/components/Logo";
import { Link } from "@/i18n/routing";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("[locale-error-boundary]", error);
  }, [error]);

  return (
    <ErrorScreen reset={reset} digest={error.digest} />
  );
}

function ErrorScreen({ reset, digest }: { reset: () => void; digest?: string }) {
  // Use translations defensively — if next-intl context is what crashed, fall
  // back to plain strings so this doesn't itself throw.
  let title = "Quelque chose s'est mal passé";
  let lead =
    "On enquête déjà. Tu peux essayer à nouveau, ou retourner à l'accueil.";
  let retry = "Réessayer";
  let home = "← Retour à l'accueil";
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const t = useTranslations("ErrorBoundary");
    title = t("title");
    lead = t("lead");
    retry = t("retry");
    home = t("home");
  } catch {
    /* fallback strings already set */
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-6 text-center">
      <div className="mb-6">
        <Logo height={44} />
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-fg mb-3 max-w-prose">
        {title}
      </h1>
      <p className="text-fg-soft mb-8 max-w-prose">{lead}</p>
      <div className="flex gap-3">
        <button onClick={() => reset()} className="btn btn-primary">
          {retry}
        </button>
        <Link href="/" className="btn btn-outline">
          {home}
        </Link>
      </div>
      {digest && (
        <p className="text-xs text-fg-faint mt-10 font-mono">ref: {digest}</p>
      )}
    </div>
  );
}
