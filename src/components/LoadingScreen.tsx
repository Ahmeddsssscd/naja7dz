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
  // Mirror the responsive StudentShell layout: phone-shaped on mobile,
  // sidebar + wide content on desktop. The old skeleton was a 448px
  // column even on desktop which felt like a phone in the middle of the
  // screen.
  return (
    <div className="bg-surface-2 min-h-screen pb-24 lg:pb-0 student-load-grid">
      {/* Top bar — full-width on desktop */}
      <header className="student-load-top bg-surface border-b border-line">
        <div className="h-16 flex items-center justify-between px-5 lg:px-6 max-w-md lg:max-w-none mx-auto lg:mx-0">
          <div className="flex items-center gap-3">
            {/* Logo placeholder on desktop */}
            <Skel className="hidden lg:block h-7 w-24" />
            {/* Avatar pill */}
            <Skel className="h-9 w-9 rounded-full" />
            <div className="space-y-2">
              <Skel className="h-3.5 w-24" />
              <Skel className="h-3 w-16" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skel className="h-7 w-7 rounded-md" />
            <Skel className="h-7 w-7 rounded-md" />
            <Skel className="hidden lg:block h-7 w-7 rounded-md" />
          </div>
        </div>
      </header>

      {/* Sidebar (desktop only) */}
      <aside className="student-load-side hidden lg:block bg-surface border-e border-line p-4">
        {[...Array(5)].map((_, i) => (
          <Skel key={i} className="h-10 w-full rounded-btn mb-1" />
        ))}
      </aside>

      {/* Main content */}
      <main className="student-load-main">
        <div className="max-w-md lg:max-w-5xl mx-auto px-5 lg:px-10 py-6 lg:py-10 space-y-4">
          {/* Title row */}
          <div className="flex items-baseline justify-between mb-4">
            <Skel className="h-8 lg:h-9 w-40 lg:w-56" />
            <Skel className="h-5 w-12" />
          </div>
          <Skel className="h-4 w-3/4 mb-6" />

          {/* Hero card */}
          <div className="bg-navy/95 rounded-modal p-6 space-y-3 mb-4">
            <Skel className="h-3 w-20 bg-white/15" />
            <Skel className="h-6 w-3/4 bg-white/15" />
            <Skel className="h-4 w-1/2 bg-white/15" />
          </div>

          {/* Section header */}
          <Skel className="h-5 w-32 mt-6 mb-3" />

          {/* Card grid — 2 cols on desktop, 1 on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-surface border border-line rounded-card p-3.5 flex items-center gap-3">
                <Skel className="h-11 w-11 rounded-[12px]" />
                <div className="flex-1 space-y-2">
                  <Skel className="h-3.5 w-3/4" />
                  <Skel className="h-3 w-1/2" />
                </div>
                <Skel className="h-5 w-16 rounded-btn" />
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Mobile bottom nav (hidden on desktop) */}
      <nav className="fixed bottom-0 inset-x-0 bg-surface border-t border-line lg:hidden">
        <div className="max-w-md mx-auto grid grid-cols-5 py-3 gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <Skel className="h-5 w-5 rounded" />
              <Skel className="h-2.5 w-10" />
            </div>
          ))}
        </div>
      </nav>

      <style>{`
        .student-load-grid {
          display: grid;
          grid-template-rows: 64px 1fr;
          grid-template-columns: 1fr;
        }
        @media (min-width: 1024px) {
          .student-load-grid {
            grid-template-columns: 240px 1fr;
            grid-template-rows: 64px 1fr;
          }
          .student-load-top { grid-column: 1 / -1; }
          .student-load-side { grid-row: 2; height: calc(100vh - 64px); overflow-y: auto; }
          .student-load-main { grid-column: 2; }
        }
      `}</style>
    </div>
  );
}

function KidsSpinner() {
  // Floating mascot + a soft "Chargement" line + 3 bouncing dots. The cream
  // background and bouncing fox keep it on-brand for the kids universe.
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-5 px-6">
      <div className="relative">
        <div className="text-8xl animate-bounce" aria-hidden>🦊</div>
        <div
          aria-hidden
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-2 rounded-full bg-navy/15 blur-sm"
        />
      </div>
      <div className="text-navy font-bold text-2xl tracking-tight">Najaح</div>
      <p className="text-navy/60 text-sm">Le fennec prépare tes activités…</p>
      <div className="flex gap-2" aria-label="Chargement">
        <span className="w-3 h-3 rounded-full bg-gold animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-3 h-3 rounded-full bg-gold animate-bounce" style={{ animationDelay: "120ms" }} />
        <span className="w-3 h-3 rounded-full bg-gold animate-bounce" style={{ animationDelay: "240ms" }} />
      </div>
    </div>
  );
}

function Skel({ className = "" }: { className?: string }) {
  return <div className={`bg-line/60 dark:bg-surface-3 rounded animate-pulse ${className}`} />;
}
