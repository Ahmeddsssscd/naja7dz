"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function SpeechModerationActions({ id }: { id: string }) {
  const router = useRouter();
  const [pending, setPending] = useState<"approve" | "reject" | null>(null);

  const act = async (action: "approve" | "reject") => {
    setPending(action);
    try {
      const res = await fetch("/api/admin/speeches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      if (!res.ok) throw new Error();
      toast.success(action === "approve" ? "Discours approuvé" : "Discours rejeté");
      router.refresh();
    } catch {
      toast.error("Erreur — réessaie");
      setPending(null);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => act("approve")}
        disabled={pending !== null}
        className="btn btn-primary btn-sm flex-1 disabled:opacity-50"
      >
        {pending === "approve" ? "Approbation…" : "✓ Approuver"}
      </button>
      <button
        onClick={() => act("reject")}
        disabled={pending !== null}
        className="btn btn-outline btn-sm flex-1 disabled:opacity-50"
      >
        {pending === "reject" ? "Rejet…" : "✗ Rejeter"}
      </button>
    </div>
  );
}
