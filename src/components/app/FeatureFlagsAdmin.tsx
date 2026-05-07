"use client";

/**
 * Toggle UI for feature_flags. Grouped by group_name. Each row is a toggle
 * the admin can flip — change is sent immediately via PATCH and shows a
 * toast on success.
 */

import { useState } from "react";
import { toast } from "sonner";

export interface FlagRow {
  key: string;
  enabled: boolean;
  label_fr: string;
  description_fr: string | null;
  group_name: string | null;
  sort_order: number;
}

const GROUP_LABELS: Record<string, string> = {
  kids: "Univers des petits (5–10 ans)",
  eleve: "Espace élève",
  parent: "Espace parent",
};

export function FeatureFlagsAdmin({ initial }: { initial: FlagRow[] }) {
  const [flags, setFlags] = useState<FlagRow[]>(initial);
  const [pendingKey, setPendingKey] = useState<string | null>(null);

  const toggle = async (key: string, enabled: boolean) => {
    setPendingKey(key);
    // Optimistic
    setFlags((cur) => cur.map((f) => (f.key === key ? { ...f, enabled } : f)));
    try {
      const res = await fetch(`/api/admin/feature-flags?key=${encodeURIComponent(key)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled }),
      });
      if (!res.ok) throw new Error();
      toast.success(enabled ? "Activé ✓" : "Désactivé ✓");
    } catch {
      // Revert
      setFlags((cur) => cur.map((f) => (f.key === key ? { ...f, enabled: !enabled } : f)));
      toast.error("Erreur — réessaie");
    } finally {
      setPendingKey(null);
    }
  };

  // Group rows by group_name.
  const groups: Record<string, FlagRow[]> = {};
  for (const f of flags) {
    const g = f.group_name ?? "other";
    (groups[g] ??= []).push(f);
  }

  return (
    <div className="space-y-8">
      {Object.entries(groups).map(([group, rows]) => (
        <section key={group}>
          <h2 className="text-lg font-semibold text-fg mb-3">
            {GROUP_LABELS[group] ?? group}
          </h2>
          <div className="bg-surface border border-line rounded-card divide-y divide-line">
            {rows.map((f) => (
              <div key={f.key} className="p-5 flex items-start gap-4">
                <div className="flex-1">
                  <div className="text-sm font-medium text-fg">{f.label_fr}</div>
                  {f.description_fr && (
                    <div className="text-xs text-fg-soft mt-1">{f.description_fr}</div>
                  )}
                  <code className="text-xs text-fg-faint font-mono mt-1.5 block">{f.key}</code>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={f.enabled}
                  onClick={() => toggle(f.key, !f.enabled)}
                  disabled={pendingKey === f.key}
                  className={`relative w-12 h-7 rounded-full transition-colors flex-shrink-0 ${
                    f.enabled ? "bg-navy" : "bg-pale-blue dark:bg-surface-3"
                  } ${pendingKey === f.key ? "opacity-60" : ""}`}
                >
                  <span
                    className={`absolute top-0.5 ${f.enabled ? "end-0.5" : "start-0.5"} w-6 h-6 rounded-full bg-white shadow transition-all`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
