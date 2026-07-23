"use client";

/**
 * "Message" button shown on réseau teacher cards for approved teachers.
 * Opens a small composer that sends a DM via /api/teacher/messages; the
 * conversation then appears in both parties' message centers.
 */

import { useState } from "react";
import { useLocale } from "next-intl";
import { toast } from "sonner";

export function ContactProfButton({ peerId, peerName }: { peerId: string; peerName: string }) {
  const isAr = useLocale() === "ar";
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);

  const send = async () => {
    if (body.trim().length < 1) return;
    setBusy(true);
    try {
      const res = await fetch("/api/teacher/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientId: peerId, body: body.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Erreur");
      toast.success(isAr ? "أُرسلت الرسالة ✓" : "Message envoyé ✓");
      setOpen(false); setBody("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn btn-outline btn-sm w-full mt-3">
        {isAr ? "مراسلة" : "Message"}
      </button>
      {open && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center px-4" onClick={() => setOpen(false)}>
          <div className="bg-surface rounded-modal max-w-sm w-full p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-fg">{isAr ? "مراسلة" : "Message à"} {peerName}</h3>
              <button onClick={() => setOpen(false)} className="text-fg-faint hover:text-fg" aria-label="Fermer">✕</button>
            </div>
            <textarea
              value={body} onChange={(e) => setBody(e.target.value)} rows={4}
              placeholder={isAr ? "اكتب رسالتك…" : "Écris ton message…"}
              className="w-full bg-surface-2 border border-line-strong rounded-btn px-3 py-2 text-sm text-fg focus:outline-none focus:border-fg"
            />
            <button onClick={send} disabled={busy || body.trim().length < 1} className="btn btn-primary w-full mt-3 disabled:opacity-60">
              {busy ? (isAr ? "جارٍ الإرسال…" : "Envoi…") : (isAr ? "إرسال" : "Envoyer")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
