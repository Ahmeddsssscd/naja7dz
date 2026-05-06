"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CheckIcon } from "@/components/Icon";

export function ResetForm() {
  const locale = useLocale();
  const t = useTranslations("ResetPassword");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok">("idle");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    await fetch("/api/auth/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, locale }),
    });
    // Always show success even on error (don't leak which emails exist)
    setStatus("ok");
  };

  if (status === "ok") {
    return (
      <div className="text-center py-4">
        <span className="inline-flex w-14 h-14 rounded-full bg-gold text-navy items-center justify-center mb-4">
          <CheckIcon size={28} />
        </span>
        <h3 className="text-lg font-semibold text-fg mb-2">{t("success_title")}</h3>
        <p className="text-fg-soft text-sm">{t("success_text")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block">
        <span className="block text-sm font-medium text-fg mb-1.5">{t("field_email")}</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="reset-input"
          placeholder={t("field_email_placeholder")}
          autoComplete="email"
        />
      </label>
      <button type="submit" disabled={status === "loading"}
        className="btn btn-primary w-full btn-lg disabled:opacity-60">
        {status === "loading" ? t("submitting") : t("submit")}
      </button>
      <style jsx>{`
        :global(.reset-input) {
          width: 100%; padding: 12px 14px; background: var(--surface);
          border: 1.5px solid var(--line-strong); border-radius: 8px;
          color: var(--fg); font-size: 15px; font-family: inherit;
        }
        :global(.reset-input:focus) {
          outline: none; border-color: var(--fg);
          box-shadow: 0 0 0 3px rgba(212, 167, 44, 0.2);
        }
        :global(.reset-input::placeholder) { color: var(--fg-faint); }
      `}</style>
    </form>
  );
}
