"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CheckIcon } from "@/components/Icon";

/**
 * Hero email capture — sends to /api/waitlist which inserts into Supabase
 * `early_access_signups` table (anon key + RLS insert-only policy).
 */
export function EmailCapture() {
  const locale = useLocale();
  const t = useTranslations("Waitlist");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [message, setMessage] = useState<string>("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale, source: "landing-hero" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setStatus("ok");
      setMessage(t("success"));
      setEmail("");
    } catch (err) {
      setStatus("err");
      setMessage(err instanceof Error ? err.message : t("error"));
    }
  };

  if (status === "ok") {
    return (
      <div className="flex items-center gap-3 p-4 bg-surface border-2 border-gold/40 rounded-btn max-w-md">
        <span className="inline-flex w-8 h-8 rounded-full bg-gold text-navy items-center justify-center flex-shrink-0">
          <CheckIcon size={18} />
        </span>
        <p className="text-fg font-medium">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2 max-w-md">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("placeholder")}
          aria-label={t("placeholder")}
          className="flex-1 h-12 px-4 bg-surface border border-line-strong rounded-btn text-fg placeholder:text-fg-faint focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-colors"
          disabled={status === "loading"}
        />
        <button
          type="submit"
          className="btn btn-primary h-12 px-6"
          disabled={status === "loading"}
        >
          {status === "loading" ? t("sending") : t("cta")}
        </button>
      </div>
      {status === "err" && (
        <p className="text-sm text-red-500" role="alert">
          {message}
        </p>
      )}
    </form>
  );
}
