/**
 * Reusable skeleton loaders for data-fetching pages.
 * Pulse animation tied to brand surface tones.
 */
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-surface-3 rounded ${className}`} aria-hidden />
  );
}

export function SkeletonText({ lines = 3, className = "" }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`h-4 ${i === lines - 1 ? "w-2/3" : "w-full"}`} />
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-surface border border-line rounded-card p-6">
      <Skeleton className="h-6 w-1/3 mb-4" />
      <SkeletonText lines={2} />
      <Skeleton className="h-10 w-32 mt-4" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="bg-surface border border-line rounded-card p-5 flex items-center gap-4">
      <Skeleton className="w-12 h-12 rounded-full" />
      <div className="flex-1">
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}

export function SkeletonStat() {
  return (
    <div className="bg-surface border border-line rounded-card p-5">
      <Skeleton className="h-3 w-1/2 mb-3" />
      <Skeleton className="h-7 w-2/3 mb-2" />
      <Skeleton className="h-3 w-1/3" />
    </div>
  );
}
