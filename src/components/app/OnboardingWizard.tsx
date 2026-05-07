"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { CheckIcon } from "@/components/Icon";

const GRADES = ["1AP","2AP","3AP","4AP","5AP","1AM","2AM","3AM","4AM","1AS","2AS","3AS"] as const;

export function OnboardingWizard({ parentName }: { parentName: string }) {
  const t = useTranslations("Onboarding");
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
      if (!res.ok) {
        if (data.setupRequired) {
          throw new Error(t("setup_required"));
        }
        throw new Error(data.error ?? t("generic_error"));
      }
      setStep(3);
    } catch (err) {
      setStatus("err");
      setErrorMsg(err instanceof Error ? err.message : t("generic_error"));
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
        {t("step_label", { current: step, total: 3 })}
      </div>

      {step === 1 && (
        <>
          <h1 className="text-2xl md:text-3xl font-bold text-fg mb-3">
            {firstName ? t("s1_welcome_named", { name: firstName }) : t("s1_welcome_default")}
          </h1>
          <p className="text-fg-soft mb-8">{t("s1_lead")}</p>
          <button onClick={() => setStep(2)} className="btn btn-primary btn-lg w-full">
            {t("s1_cta")}
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <h2 className="text-2xl font-bold text-fg mb-2">{t("s2_title")}</h2>
          <p className="text-fg-soft mb-8">{t("s2_lead")}</p>
          <form onSubmit={onSubmitChild} className="space-y-4">
            <Field label={t("s2_field_name")}>
              <input
                type="text"
                required
                value={child.fullName}
                onChange={(e) => setChild((c) => ({ ...c, fullName: e.target.value }))}
                className="onb-input"
                placeholder={t("s2_field_name_placeholder")}
                autoFocus
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label={t("s2_field_age")}>
                <input
                  type="number"
                  min={5}
                  max={18}
                  required
                  value={child.age}
                  onChange={(e) => setChild((c) => ({ ...c, age: e.target.value }))}
                  className="onb-input"
                  placeholder={t("s2_field_age_placeholder")}
                />
              </Field>
              <Field label={t("s2_field_grade")}>
                <select
                  required
                  value={child.grade}
                  onChange={(e) => setChild((c) => ({ ...c, grade: e.target.value as (typeof GRADES)[number] }))}
                  className="onb-input"
                >
                  <option value="">{t("s2_grade_choose")}</option>
                  {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </Field>
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="btn btn-primary btn-lg w-full mt-2 disabled:opacity-60"
            >
              {status === "loading" ? t("s2_submitting") : t("s2_submit")}
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="btn btn-ghost w-full"
            >
              {t("s2_back")}
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
          <h2 className="text-2xl font-bold text-fg mb-3">{t("s3_title")}</h2>
          <p className="text-fg-soft mb-8 max-w-prose mx-auto">{t("s3_lead")}</p>
          <Link href="/parent" className="btn btn-primary btn-lg w-full">
            {t("s3_cta")}
          </Link>
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
