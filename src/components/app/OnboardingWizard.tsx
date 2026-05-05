"use client";

import { useState } from "react";
import { CheckIcon } from "@/components/Icon";

const GRADES = ["1AP","2AP","3AP","4AP","5AP","1AM","2AM","3AM","4AM","1AS","2AS","3AS"] as const;

export function OnboardingWizard({ parentName }: { parentName: string }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [child, setChild] = useState({ fullName: "", age: "", grade: "" as (typeof GRADES)[number] | "" });
  const [status, setStatus] = useState<"idle" | "loading" | "err">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmitChild = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/children", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: child.fullName,
          age: child.age ? Number(child.age) : null,
          grade: child.grade || null,
          markOnboarded: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur");
      setStep(3);
    } catch (err) {
      setStatus("err");
      setErrorMsg(err instanceof Error ? err.message : "Erreur");
    }
  };

  const firstName = parentName.split(" ")[0] || "";

  return (
    <div className="bg-surface border border-line rounded-modal shadow-card p-8 md:p-10">
      {/* Stepper */}
      <div className="flex items-center gap-2 mb-8">
        <div className={`flex-1 h-1 rounded ${step >= 1 ? "bg-gold" : "bg-line"}`} />
        <div className={`flex-1 h-1 rounded ${step >= 2 ? "bg-gold" : "bg-line"}`} />
        <div className={`flex-1 h-1 rounded ${step >= 3 ? "bg-gold" : "bg-line"}`} />
      </div>
      <div className="text-xs uppercase tracking-wider text-fg-soft mb-6">
        Étape {step} sur 3
      </div>

      {step === 1 && (
        <>
          <h1 className="text-2xl md:text-3xl font-bold text-fg mb-3">
            Bienvenue {firstName ? firstName : "dans Najaح"} 👋
          </h1>
          <p className="text-fg-soft mb-8">
            On va configurer ton compte en deux minutes. À chaque étape, tu peux modifier
            tes choix plus tard depuis ton espace.
          </p>
          <button onClick={() => setStep(2)} className="btn btn-primary btn-lg w-full">
            Commencer →
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <h2 className="text-2xl font-bold text-fg mb-2">Ton premier enfant</h2>
          <p className="text-fg-soft mb-8">
            Tu pourras ajouter d&apos;autres enfants dès la prochaine étape.
          </p>
          <form onSubmit={onSubmitChild} className="space-y-4">
            <Field label="Prénom de l'enfant">
              <input
                type="text"
                required
                value={child.fullName}
                onChange={(e) => setChild((c) => ({ ...c, fullName: e.target.value }))}
                className="onb-input"
                placeholder="Yacine"
                autoFocus
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Âge">
                <input
                  type="number"
                  min={5}
                  max={18}
                  required
                  value={child.age}
                  onChange={(e) => setChild((c) => ({ ...c, age: e.target.value }))}
                  className="onb-input"
                  placeholder="14"
                />
              </Field>
              <Field label="Classe">
                <select
                  required
                  value={child.grade}
                  onChange={(e) => setChild((c) => ({ ...c, grade: e.target.value as (typeof GRADES)[number] }))}
                  className="onb-input"
                >
                  <option value="">Choisir…</option>
                  {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </Field>
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="btn btn-primary btn-lg w-full mt-2 disabled:opacity-60"
            >
              {status === "loading" ? "Création…" : "Continuer"}
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="btn btn-ghost w-full"
            >
              ← Retour
            </button>
            {status === "err" && <p className="text-sm text-red-500" role="alert">{errorMsg}</p>}
          </form>
        </>
      )}

      {step === 3 && (
        <div className="text-center">
          <span className="inline-flex w-16 h-16 rounded-full bg-gold text-navy items-center justify-center mb-6">
            <CheckIcon size={32} />
          </span>
          <h2 className="text-2xl font-bold text-fg mb-3">Tout est prêt 🎉</h2>
          <p className="text-fg-soft mb-8 max-w-prose mx-auto">
            Tu peux maintenant explorer ton espace, ajouter d&apos;autres enfants, ou
            laisser ton enfant commencer son premier exercice.
          </p>
          <a href="/parent" className="btn btn-primary btn-lg w-full">
            Découvrir mon espace →
          </a>
        </div>
      )}

      <style jsx>{`
        :global(.onb-input) {
          width: 100%; padding: 12px 14px; background: var(--surface);
          border: 1.5px solid var(--line-strong); border-radius: 8px;
          color: var(--fg); font-size: 15px; font-family: inherit;
        }
        :global(.onb-input:focus) {
          outline: none; border-color: var(--fg);
          box-shadow: 0 0 0 3px rgba(212, 167, 44, 0.2);
        }
      `}</style>
    </div>
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
