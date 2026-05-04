import { PageShell } from "@/components/landing/PageShell";

/**
 * Legal page wrapper. Title at top, last-updated date, then content.
 * Pass children as the body — they get prose styling automatically.
 */
export function LegalShell({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <PageShell>
      <article className="bg-surface py-16 md:py-20">
        <div className="container-x max-w-3xl">
          <header className="mb-12 pb-8 border-b border-line">
            <span className="eyebrow mb-2 block">Légal</span>
            <h1 className="text-[clamp(28px,4vw,40px)] font-bold tracking-tight text-fg mb-3">
              {title}
            </h1>
            <p className="text-sm text-fg-soft">Dernière mise à jour : {updated}</p>
          </header>
          <div className="prose-najah">{children}</div>
        </div>
      </article>
    </PageShell>
  );
}
