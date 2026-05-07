/**
 * Branded loading screens. Server component — no client JS, instant paint.
 *
 * Variants:
 *   - "page"     : full-page logo + spinner + brand color background. Used by
 *                  public pages and auth pages.
 *   - "dashboard": skeleton grid that mirrors AppShell layout (sidebar + grid).
 *                  Used by /parent and /admin loading.
 *   - "student"  : compact phone-shaped skeleton matching StudentShell.
 *                  Used by /eleve loading.
 *   - "kids"     : playful gold pulse with mascot. Used by /petits loading.
 */

import { Logo } from "@/components/Logo";

interface Props {
  variant?: "page" | "dashboard" | "student" | "kids";
}

export function LoadingScreen({ variant = "page" }: Props) {
  if (variant === "dashboard") return <DashboardSkeleton />;
  if (variant === "student") return <StudentSkeleton />;
  if (variant === "kids") return <KidsSpinner />;
  return <PageSpinner />;
}

function PageSpinner() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-6">
      <Logo height={48} />
      <Spinner />
    </div>
  );
}

function Spinner() {
  return (
    <div
      className="w-8 h-8 rounded-full border-2 border-line border-t-gold animate-spin"
      role="status"
      aria-label="Chargement"
    />
  );
}

function DashboardSkeleton() {
  return (
    <div className="bg-surface-2 min-h-screen">
      {/* Top bar */}
      <header className="bg-surface border-b border-line h-16 flex items-center justify-between px-6">
        <Skel className="h-7 w-28" />
        <div className="flex items-center gap-3">
          <Skel className="h-8 w-8 rounded-full" />
          <Skel className="h-7 w-7 rounded-md" />
        </div>
      </header>

      <div className="flex-1 grid lg:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <aside className="hidden lg:block bg-surface border-e border-line p-4">
          {[...Array(6)].map((_, i) => (
            <Skel key={i} className="h-10 w-full rounded-btn mb-1" />
          ))}
        </aside>

        {/* Main */}
        <main className="p-6 md:p-10">
          <Skel className="h-9 w-64 mb-2" />
          <Skel className="h-5 w-96 mb-8" />

          {/* KPI grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-surface border border-line rounded-card p-5 space-y-3">
                <Skel className="h-3 w-16" />
                <Skel className="h-7 w-20" />
                <Skel className="h-3 w-24" />
              </div>
            ))}
          </div>

          {/* Hero block */}
          <div className="bg-surface border border-line rounded-card p-6 mb-8">
            <Skel className="h-4 w-24 mb-3" />
            <Skel className="h-7 w-3/4 mb-3" />
            <Skel className="h-4 w-full mb-1.5" />
            <Skel className="h-4 w-2/3" />
          </div>
        </main>
      </div>
    </div>
  );
}

function StudentSkeleton() {
  return (
    <div className="bg-surface-2 min-h-screen pb-24">
      <header className="bg-surface border-b border-line">
        <div className="max-w-md mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skel className="h-9 w-9 rounded-full" />
            <div className="space-y-2">
              <Skel className="h-3.5 w-24" />
              <Skel className="h-3 w-16" />
            </div>
          </div>
          <Skel className="h-7 w-7 rounded-md" />
        </div>
      </header>

      <main className="max-w-md mx-auto px-5 py-6 space-y-4">
        {/* Hero card */}
        <div className="bg-navy/95 rounded-modal p-6 space-y-3">
          <Skel className="h-3 w-20 bg-white/15" />
          <Skel className="h-6 w-3/4 bg-white/15" />
          <Skel className="h-4 w-1/2 bg-white/15" />
        </div>

        {/* Mission cards */}
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-surface border border-line rounded-card p-3.5 flex items-center gap-3">
            <Skel className="h-10 w-10 rounded-[10px]" />
            <div className="flex-1 space-y-2">
              <Skel className="h-3.5 w-3/4" />
              <Skel className="h-3 w-1/2" />
            </div>
            <Skel className="h-3 w-10" />
          </div>
        ))}
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 bg-surface border-t border-line">
        <div className="max-w-md mx-auto grid grid-cols-5 py-3 gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <Skel className="h-5 w-5 rounded" />
              <Skel className="h-2.5 w-10" />
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}

function KidsSpinner() {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-6">
      <div className="text-7xl animate-bounce" aria-hidden>🦊</div>
      <div className="text-navy font-bold text-xl">Najaح</div>
      <div className="flex gap-1.5" aria-label="Chargement">
        <span className="w-2.5 h-2.5 rounded-full bg-gold animate-pulse" style={{ animationDelay: "0ms" }} />
        <span className="w-2.5 h-2.5 rounded-full bg-gold animate-pulse" style={{ animationDelay: "150ms" }} />
        <span className="w-2.5 h-2.5 rounded-full bg-gold animate-pulse" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}

function Skel({ className = "" }: { className?: string }) {
  return <div className={`bg-line/60 dark:bg-surface-3 rounded animate-pulse ${className}`} />;
}
