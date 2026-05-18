"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { CheckIcon } from "@/components/Icon";

const GRADES = [
  "1AP", "2AP", "3AP", "4AP", "5AP",
  "1AM", "2AM", "3AM", "4AM",
  "1AS", "2AS", "3AS",
];

export function SignupWaitlistForm() {
  const locale = useLocale();
  const [form, setForm] = useState({
    parentName: "",
    email: "",
    childCount: "1",
    childGrade: "",
    wilaya: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      // Save to existing waitlist endpoint with rich source metadata
      const sourceLabel = `signup-${form.childCount}child-${form.childGrade || "any"}-${form.wilaya || "any"}`;
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          locale,
          source: sourceLabel.slice(0, 64),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur");
      setStatus("ok");
    } catch (err) {
      setStatus("err");
      setErrorMsg(err instanceof Error ? err.message : "Erreur");
    }
  };

  if (status === "ok") {
    return (
      <div className="text-center py-6">
        <span className="inline-flex w-14 h-14 rounded-full bg-gold text-navy items-center justify-center mb-4">
          <CheckIcon size={28} />
        </span>
        <h3 className="text-lg font-semibold text-fg mb-2">Tu es sur la liste</h3>
        <p className="text-fg-soft text-sm">
          On t&apos;envoie un email à <strong className="text-fg">{form.email}</strong> dès
          que l&apos;inscription complète ouvre. À très vite.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label="Ton prénom et nom">
        <input
          name="parentName"
          type="text"
          required
          value={form.parentName}
          onChange={onChange}
          className="auth-input"
          placeholder="Ahmed Benali"
          autoComplete="name"
        />
      </Field>
      <Field label="Ton email">
        <input
          name="email"
          type="email"
          required
          value={form.email}
          onChange={onChange}
          className="auth-input"
          placeholder="parent@email.com"
          autoComplete="email"
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Combien d'enfants ?">
          <select
            name="childCount"
            value={form.childCount}
            onChange={onChange}
            className="auth-input"
          >
            <option value="1">1 enfant</option>
            <option value="2">2 enfants</option>
            <option value="3">3 enfants</option>
            <option value="4">4+ enfants</option>
          </select>
        </Field>
        <Field label="Classe principale">
          <select
            name="childGrade"
            value={form.childGrade}
            onChange={onChange}
            className="auth-input"
          >
            <option value="">Choisir…</option>
            {GRADES.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Wilaya">
        <input
          name="wilaya"
          type="text"
          value={form.wilaya}
          onChange={onChange}
          className="auth-input"
          placeholder="Alger, Oran, Constantine…"
        />
      </Field>

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn btn-primary w-full btn-lg disabled:opacity-60 mt-2"
      >
        {status === "loading" ? "Inscription…" : "Rejoindre la liste"}
      </button>

      {status === "err" && (
        <p className="text-sm text-red-500 text-center" role="alert">
          {errorMsg}
        </p>
      )}

      <p className="text-xs text-fg-faint text-center">
        Sans engagement. Pas de carte bancaire.
      </p>

      <style jsx>{`
        :global(.auth-input) {
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
        :global(.auth-input:focus) {
          outline: none;
          border-color: var(--fg);
          box-shadow: 0 0 0 3px rgba(212, 167, 44, 0.2);
        }
        :global(.auth-input::placeholder) {
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
