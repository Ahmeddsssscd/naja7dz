"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export function ChangePasswordForm() {
  const t = useTranslations("ChangePassword");
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw !== confirm) { toast.error(t("mismatch")); return; }
    if (pw.length < 8) { toast.error(t("min_chars")); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: pw }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? t("generic_error"));
      toast.success(t("success"));
      setPw(""); setConfirm("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("generic_error"));
    } finally { setSaving(false); }
  };

  return (
    <form onSubmit={onSubmit} className="bg-surface border border-line rounded-card p-7 space-y-4">
      <label className="block">
        <span className="block text-sm font-medium text-fg mb-1.5">{t("field_new")}</span>
        <input type="password" required minLength={8} value={pw} onChange={(e) => setPw(e.target.value)}
          className="cp-input" autoComplete="new-password" />
      </label>
      <label className="block">
        <span className="block text-sm font-medium text-fg mb-1.5">{t("field_confirm")}</span>
        <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)}
          className="cp-input" autoComplete="new-password" />
      </label>
      <button type="submit" disabled={saving} className="btn btn-primary w-full disabled:opacity-60">
        {saving ? t("submitting") : t("submit")}
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
