"use client";

/**
 * Inline child switcher pill row. Shown above kid-universe / student pages
 * when the parent has 2+ children. Clicking a pill writes the active-child
 * cookie via a tiny API route and reloads the page with `?child=<id>`.
 */

import { useRouter } from "next/navigation";
import { usePathname, useSearchParams } from "next/navigation";

interface Child {
  id: string;
  full_name: string;
  grade: string | null;
}

export function ChildSwitcher({
  kids,
  activeId,
  label,
}: {
  kids: Child[];
  activeId: string | null;
  label: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();

  const onPick = (id: string) => {
    // Persist to cookie so other pages remember (fire-and-forget API call).
    fetch("/api/active-child", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ childId: id }),
    }).catch(() => { /* not critical — query string still wins */ });

    // Update URL ?child=ID and refresh server data
    const params = new URLSearchParams(search.toString());
    params.set("child", id);
    router.push(`${pathname}?${params.toString()}`);
  };

  if (kids.length < 2) return null;

  return (
    <div className="bg-white/70 dark:bg-surface-3/60 border border-pale-blue rounded-2xl p-3 mb-5 flex items-center gap-2 flex-wrap">
      <span className="text-xs font-semibold text-navy/70 uppercase tracking-wider me-2">
        {label}
      </span>
      {kids.map((c) => {
        const initials = c.full_name.split(" ").map((s) => s[0]).slice(0, 2).join("");
        const active = c.id === activeId;
        return (
          <button
            key={c.id}
            onClick={() => onPick(c.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
              active
                ? "bg-navy text-white shadow-card"
                : "bg-pale-blue text-navy hover:bg-gold/30 active:scale-95"
            }`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${active ? "bg-gold text-navy" : "bg-white text-navy"}`}>
              {initials}
            </span>
            <span>{c.full_name}</span>
            {c.grade && <span className={`text-[10px] font-mono ${active ? "text-white/70" : "text-navy/60"}`}>{c.grade}</span>}
          </button>
        );
      })}
    </div>
  );
}
