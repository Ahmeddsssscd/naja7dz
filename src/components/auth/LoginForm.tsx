"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import { SocialAuth } from "@/components/auth/SocialAuth";

export function LoginForm() {
  const t = useTranslations("Connexion");
  const params = useSearchParams();
  // /espace inspects the active child's grade and dispatches:
  // primaire → /petits (Kids Universe), collège/lycée → /eleve, no child → /parent.
  const next = params.get("next") || "/espace";

  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "err">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? t("generic_error"));
      // Use full reload so middleware picks up the new session cookies
      window.location.href = next;
    } catch (err) {
      setStatus("err");
      setErrorMsg(err instanceof Error ? err.message : t("generic_error"));
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block">
        <span className="block text-sm font-medium text-fg mb-1.5">{t("field_email")}</span>
        <input
          name="email"
          type="email"
          required
          value={form.email}
          onChange={onChange}
          className="auth-input"
          placeholder={t("field_email_placeholder")}
          autoComplete="email"
        />
      </label>

      <label className="block">
        <span className="flex justify-between items-center text-sm font-medium text-fg mb-1.5">
          <span>{t("field_password")}</span>
          <Link href="/connexion/oublie" className="text-xs text-fg-soft hover:text-gold font-normal">
            {t("forgot_password")}
          </Link>
        </span>
        <input
          name="password"
          type="password"
          required
          value={form.password}
          onChange={onChange}
          className="auth-input"
          placeholder={t("field_password_placeholder")}
          autoComplete="current-password"
        />
      </label>

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn btn-primary w-full btn-lg disabled:opacity-60"
      >
        {status === "loading" ? t("submitting") : t("submit")}
      </button>

      {status === "err" && (
        <p className="text-sm text-red-500 text-center" role="alert">
          {errorMsg}
        </p>
      )}

      <SocialAuth next={next} />

      <style jsx>{`
        :global(.auth-input) {
          width: 100%; padding: 12px 14px; background: var(--surface);
          border: 1.5px solid var(--line-strong); border-radius: 8px;
          color: var(--fg); font-size: 15px; font-family: inherit;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        :global(.auth-input:focus) {
          outline: none; border-color: var(--fg);
          box-shadow: 0 0 0 3px rgba(212, 167, 44, 0.2);
        }
        :global(.auth-input::placeholder) { color: var(--fg-faint); }
      `}</style>
    </form>
  );
}
