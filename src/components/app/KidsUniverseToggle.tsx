"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { toast } from "sonner";

/**
 * Per-child switch to enable the playful Kids Universe (/petits). Off by
 * default so children land on their academic space; the parent turns it on
 * when they want the games.
 */
export function KidsUniverseToggle({
  childId,
  initialEnabled,
  childName,
}: {
  childId: string;
  initialEnabled: boolean;
  childName: string;
}) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const [enabled, setEnabled] = useState(initialEnabled);
  const [busy, setBusy] = useState(false);

  const toggle = async () => {
    const next = !enabled;
    setBusy(true);
    setEnabled(next); // optimistic
    try {
      const res = await fetch("/api/children/kids-universe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childId, enabled: next }),
      });
      if (!res.ok) throw new Error();
      toast.success(
        next
          ? (isAr ? `تم تفعيل عالم الصغار لـ ${childName}` : `Univers des petits activé pour ${childName}`)
          : (isAr ? `تم إيقاف عالم الصغار` : `Univers des petits désactivé`),
      );
    } catch {
      setEnabled(!next); // revert
      toast.error(isAr ? "تعذّر الحفظ" : "Impossible d'enregistrer");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 bg-surface-2 border border-line rounded-xl px-4 py-3">
      <div className="min-w-0">
        <div className="text-sm font-medium text-fg flex items-center gap-1.5">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-fg-soft"><circle cx="13.5" cy="6.5" r="1.5"/><circle cx="17.5" cy="10.5" r="1.5"/><circle cx="8.5" cy="7.5" r="1.5"/><circle cx="6.5" cy="12.5" r="1.5"/><path d="M12 2a10 10 0 0 0 0 20c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.2 0-1.1.9-2 2-2h2.3c2.6 0 4.7-2.1 4.7-4.7C22 6.5 17.5 2 12 2z"/></svg>
          {isAr ? "عالم الصغار (ألعاب)" : "Univers des petits (jeux)"}
        </div>
        <div className="text-xs text-fg-soft mt-0.5">
          {isAr
            ? "افتراضيًا يرى الطفل دروسه أولاً. فعّله للألعاب التعليمية."
            : "Par défaut, l'enfant voit d'abord ses cours. Active pour les jeux éducatifs."}
        </div>
      </div>
      <button
        role="switch"
        aria-checked={enabled}
        onClick={toggle}
        disabled={busy}
        className={`relative w-12 h-7 rounded-full transition-colors flex-shrink-0 ${
          enabled ? "bg-gold" : "bg-line-strong"
        } ${busy ? "opacity-60" : ""}`}
        aria-label={isAr ? "تبديل عالم الصغار" : "Basculer l'univers des petits"}
      >
        <span
          className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
