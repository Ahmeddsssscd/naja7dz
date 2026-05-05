"use client";

import { useState } from "react";
import { toast } from "sonner";

export function ChangePasswordForm() {
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw !== confirm) { toast.error("Les deux mots de passe sont différents"); return; }
    if (pw.length < 8) { toast.error("8 caractères minimum"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: pw }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur");
      toast.success("Mot de passe mis à jour ✓");
      setPw(""); setConfirm("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    } finally { setSaving(false); }
  };

  return (
    <form onSubmit={onSubmit} className="bg-surface border border-line rounded-card p-7 space-y-4">
      <label className="block">
        <span className="block text-sm font-medium text-fg mb-1.5">Nouveau mot de passe</span>
        <input type="password" required minLength={8} value={pw} onChange={(e) => setPw(e.target.value)}
          className="cp-input" autoComplete="new-password" />
      </label>
      <label className="block">
        <span className="block text-sm font-medium text-fg mb-1.5">Confirmer le mot de passe</span>
        <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)}
          className="cp-input" autoComplete="new-password" />
      </label>
      <button type="submit" disabled={saving} className="btn btn-primary w-full disabled:opacity-60">
        {saving ? "Enregistrement…" : "Mettre à jour"}
      </button>
      <style jsx>{`
        :global(.cp-input) {
          width: 100%; padding: 12px 14px; background: var(--surface);
          border: 1.5px solid var(--line-strong); border-radius: 8px;
          color: var(--fg); font-size: 15px;
        }
        :global(.cp-input:focus) { outline: none; border-color: var(--fg); }
      `}</style>
    </form>
  );
}
