"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export function CheckoutForm({
  planId,
  prefill,
}: {
  planId: string;
  prefill?: { name?: string; email?: string; phone?: string };
}) {
  const locale = useLocale();
  const t = useTranslations("Checkout");
  const [form, setForm] = useState({
    name: prefill?.name ?? "",
    email: prefill?.email ?? "",
    phone: prefill?.phone ?? "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "err">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, planId, locale }),
      });
      const data = await res.json();
      if (!res.ok || !data.checkoutUrl) {
        throw new Error(data.error ?? t("generic_error"));
      }
      // Redirect to Chargily hosted checkout
      window.location.href = data.checkoutUrl;
    } catch (err) {
      setStatus("err");
      setErrorMsg(err instanceof Error ? err.message : t("generic_error"));
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label={t("field_name")}>
        <input
          name="name"
          type="text"
          required
          value={form.name}
          onChange={onChange}
          className="checkout-input"
          placeholder={t("field_name_placeholder")}
          autoComplete="name"
        />
      </Field>
      <Field label={t("field_email")}>
        <input
          name="email"
          type="email"
          required
          value={form.email}
          onChange={onChange}
          className="checkout-input"
          placeholder={t("field_email_placeholder")}
          autoComplete="email"
        />
      </Field>
      <Field label={t("field_phone")}>
        <input
          name="phone"
          type="tel"
          value={form.phone}
          onChange={onChange}
          className="checkout-input"
          placeholder={t("field_phone_placeholder")}
          autoComplete="tel"
        />
      </Field>

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

      <p className="text-xs text-fg-faint text-center mt-4">
        {t("terms_pre")}{" "}
        <Link href="/legal/conditions" className="underline hover:text-fg">
          {t("terms_link")}
        </Link>
        .
      </p>

      <style jsx>{`
        :global(.checkout-input) {
          width: 100%;
          padding: 12px 14px;
          background: var(--surface);
          border: 1.5px solid var(--line-strong);
          border-radius: 8px;
          color: var(--fg);
          font-size: 15px;
          font-family: inherit;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        :global(.checkout-input:focus) {
          outline: none;
          border-color: var(--fg);
          box-shadow: 0 0 0 3px rgba(212, 167, 44, 0.2);
        }
        :global(.checkout-input::placeholder) {
          color: var(--fg-faint);
        }
      `}</style>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-fg mb-1.5">{label}</span>
      {children}
    </label>
  );
}
