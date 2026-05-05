"use client";

import { useState } from "react";

const GRADES = ["1AP","2AP","3AP","4AP","5AP","1AM","2AM","3AM","4AM","1AS","2AS","3AS"] as const;

export function AddChildForm() {
  const [form, setForm] = useState({ fullName: "", age: "", grade: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "err">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/children", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          age: form.age ? Number(form.age) : null,
          grade: form.grade || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur");
      window.location.href = "/parent/enfants";
    } catch (err) {
      setStatus("err");
      setErrorMsg(err instanceof Error ? err.message : "Erreur");
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label="Prénom de l'enfant">
        <input type="text" required value={form.fullName}
          onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
          className="addchild-input" placeholder="Yacine" />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Âge">
          <input type="number" min={5} max={18} required value={form.age}
            onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
            className="addchild-input" placeholder="14" />
        </Field>
        <Field label="Classe">
          <select required value={form.grade}
            onChange={(e) => setForm((f) => ({ ...f, grade: e.target.value }))}
            className="addchild-input">
            <option value="">Choisir…</option>
            {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </Field>
      </div>
      <button type="submit" disabled={status === "loading"}
        className="btn btn-primary w-full btn-lg disabled:opacity-60 mt-2">
        {status === "loading" ? "Ajout…" : "Ajouter cet enfant"}
      </button>
      {status === "err" && <p className="text-sm text-red-500 text-center">{errorMsg}</p>}
      <style jsx>{`
        :global(.addchild-input) {
          width: 100%; padding: 12px 14px; background: var(--surface);
          border: 1.5px solid var(--line-strong); border-radius: 8px;
          color: var(--fg); font-size: 15px; font-family: inherit;
        }
        :global(.addchild-input:focus) {
          outline: none; border-color: var(--fg);
          box-shadow: 0 0 0 3px rgba(212, 167, 44, 0.2);
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
