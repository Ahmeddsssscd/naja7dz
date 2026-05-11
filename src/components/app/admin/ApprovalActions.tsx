"use client";

/**
 * ApprovalActions — Approve / Reject buttons on each pending row.
 * Posts to /api/admin/approvals; refreshes the page on success.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  kind: "helper" | "teacher";
  /** helper_profiles.id for kind=helper, teacher_profiles.user_id for kind=teacher */
  id: string;
}

export function ApprovalActions({ kind, id }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState<null | "approve" | "reject">(null);
  const [rejectNote, setRejectNote] = useState("");
  const [showReject, setShowReject] = useState(false);

  const act = async (action: "approve" | "reject", note?: string) => {
    setPending(action);
    try {
      const r = await fetch("/api/admin/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, id, action, note }),
      });
      if (r.ok) router.refresh();
    } finally {
      setPending(null);
      setShowReject(false);
      setRejectNote("");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => act("approve")}
        disabled={!!pending}
        className="text-xs font-semibold bg-emerald-600 text-white rounded-btn px-3 py-1.5 hover:bg-emerald-700 disabled:opacity-50"
      >
        {pending === "approve" ? "..." : "✓ Approuver"}
      </button>
      <button
        onClick={() => setShowReject(true)}
        disabled={!!pending}
        className="text-xs font-semibold bg-surface text-fg-soft border border-line rounded-btn px-3 py-1.5 hover:border-red-400 hover:text-red-600 disabled:opacity-50"
      >
        ✕ Rejeter
      </button>

      {showReject && (
        <div className="fixed inset-0 z-50 bg-fg/60 flex items-center justify-center p-4" onClick={() => setShowReject(false)}>
          <div className="bg-surface border border-line rounded-card p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-fg mb-3">Raison du rejet</h3>
            <textarea
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              rows={4}
              placeholder="Bio trop courte, profil incomplet..."
              className="w-full rounded-btn border border-line bg-surface text-fg px-3 py-2 text-sm focus:outline-none focus:border-fg/40 mb-4"
            />
            <div className="flex gap-2">
              <button onClick={() => setShowReject(false)} className="btn btn-outline flex-1">Annuler</button>
              <button onClick={() => act("reject", rejectNote.trim() || "Profil non conforme.")} disabled={!!pending} className="btn btn-primary flex-1">
                Confirmer le rejet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
