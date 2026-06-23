"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CheckIcon, MailIcon, ArrowRightIcon } from "@/components/Icon";

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
      <div className="flex items-center gap-3 p-4 bg-surface border-2 border-gold/40 rounded-modal max-w-md shadow-card animate-[_ec_in_.3s_cubic-bezier(.34,1.56,.64,1)_both]">
        <style>{`@keyframes _ec_in { from{opacity:0;transform:scale(.92)} to{opacity:1;transform:scale(1)} }`}</style>
        <span className="inline-flex w-9 h-9 rounded-full bg-gold text-navy items-center justify-center flex-shrink-0">
          <CheckIcon size={18} />
        </span>
        <p className="text-fg font-semibold leading-snug">{message}</p>
      </div>
    );
  }

  const isLoading = status === "loading";
  const isError = status === "err";

  return (
    <form onSubmit={onSubmit} className="max-w-md">
      <div
        className={`flex flex-col sm:flex-row gap-2 sm:gap-1.5 p-1.5 rounded-[18px] sm:rounded-full border-2 transition-colors bg-surface ${
          isError
            ? "border-red-300 dark:border-red-700"
            : "border-line-strong focus-within:border-gold"
        }`}
      >
        <div className="relative flex-1 flex items-center">
          <MailIcon
            size={18}
            className={`absolute start-4 pointer-events-none ${isError ? "text-red-400" : "text-fg-faint"}`}
          />
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("placeholder")}
            aria-label={t("placeholder")}
            aria-invalid={isError}
            className="w-full h-12 ps-11 pe-4 bg-transparent text-fg placeholder:text-fg-faint focus:outline-none disabled:opacity-60"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary h-12 px-6 rounded-2xl sm:rounded-full inline-flex items-center justify-center gap-2 disabled:opacity-70"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              {t("sending")}
            </>
          ) : (
            <>
              {t("cta")}
              <ArrowRightIcon size={15} />
            </>
          )}
        </button>
      </div>
      {isError && (
        <p className="text-sm text-red-500 mt-2 ps-2 flex items-center gap-1.5" role="alert">
          {message}
        </p>
      )}
    </form>
  );
}
