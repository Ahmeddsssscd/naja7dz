"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CheckIcon } from "@/components/Icon";

export function ContactForm() {
  const locale = useLocale();
  const t = useTranslations("Contact");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, locale }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? t("form_error"));
      setStatus("ok");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus("err");
      setErrorMsg(err instanceof Error ? err.message : t("form_error"));
    }
  };

  if (status === "ok") {
    return (
      <div className="rounded-card border-2 border-gold/40 bg-surface p-8 flex flex-col items-center text-center">
        <span className="inline-flex w-12 h-12 rounded-full bg-gold text-navy items-center justify-center mb-4">
          <CheckIcon size={24} />
        </span>
        <h3 className="text-lg font-semibold text-fg mb-1">{t("form_success")}</h3>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 bg-surface border border-line rounded-card p-7">
      <Field label={t("form_name")}>
        <input
          name="name"
          type="text"
          required
          value={form.name}
          onChange={onChange}
          className="input-base"
          placeholder="Ahmed Benali"
        />
      </Field>
      <Field label={t("form_email")}>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          value={form.email}
          onChange={onChange}
          className="input-base"
          placeholder="parent@email.com"
        />
      </Field>
      <Field label={t("form_subject")}>
        <input
          name="subject"
          type="text"
          required
          value={form.subject}
          onChange={onChange}
          className="input-base"
          placeholder="Question sur l'abonnement Famille…"
        />
      </Field>
      <Field label={t("form_message")}>
        <textarea
          name="message"
          required
          rows={5}
          value={form.message}
          onChange={onChange}
          className="input-base"
          placeholder="Décris ta question ou ton problème…"
        />
      </Field>
      <button
        type="submit"
        disabled={status === "loading"}
        className="btn btn-primary w-full disabled:opacity-60"
      >
        {status === "loading" ? t("form_sending") : t("form_send")}
      </button>
      {status === "err" && (
        <p className="text-sm text-red-500 text-center" role="alert">
          {errorMsg}
        </p>
      )}
      <style jsx>{`
        :global(.input-base) {
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
        :global(.input-base:focus) {
          outline: none;
          border-color: var(--fg);
          box-shadow: 0 0 0 3px rgba(212, 167, 44, 0.2);
        }
        :global(.input-base::placeholder) {
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
