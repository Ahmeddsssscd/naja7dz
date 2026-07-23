"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CheckIcon } from "@/components/Icon";
import { SocialAuth } from "@/components/auth/SocialAuth";

const WILAYAS = [
  "Alger","Oran","Constantine","Annaba","Blida","Sétif","Tlemcen","Béjaïa","Tizi Ouzou","Batna",
  "Béchar","Ouargla","Mostaganem","Médéa","Skikda","Bordj Bou Arreridj","Boumerdès","Chlef","Djelfa",
  "Ghardaïa","Tiaret","Tipaza","Adrar","Aïn Defla","Aïn Témouchent","Biskra","Bouira","El Bayadh",
  "El Oued","El Tarf","Guelma","Illizi","Jijel","Khenchela","Laghouat","Mascara","M'Sila",
  "Naâma","Oum El Bouaghi","Relizane","Saïda","Sidi Bel Abbès","Souk Ahras","Tamanrasset","Tébessa",
  "Tindouf","Tissemsilt",
];

export function SignupForm() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const t = useTranslations("Inscription");
  const [role, setRole] = useState<"parent" | "student" | "teacher" | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    wilaya: "",
    grade: "",
    accepted: false,
  });
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const GRADES = [
    "1AP", "2AP", "3AP", "4AP", "5AP", "1AM", "2AM", "3AM", "4AM", "1AS", "2AS", "3AS",
  ];

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;
    const value = target.type === "checkbox" ? (target as HTMLInputElement).checked : target.value;
    setForm((f) => ({ ...f, [target.name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.accepted) {
      setStatus("err");
      setErrorMsg(t("must_accept"));
      return;
    }
    if (role === "student" && !form.grade) {
      setStatus("err");
      setErrorMsg(isAr ? "اختر مستواك الدراسي" : "Choisis ton niveau scolaire");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role: role ?? "parent", locale }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.setupRequired) {
          setStatus("err");
          setErrorMsg(t("setup_required"));
          return;
        }
        throw new Error(data.error ?? t("generic_error"));
      }
      setStatus("ok");
    } catch (err) {
      setStatus("err");
      setErrorMsg(err instanceof Error ? err.message : t("generic_error"));
    }
  };

  if (status === "ok") {
    return (
      <div className="text-center py-6">
        <span className="inline-flex w-14 h-14 rounded-full bg-gold text-navy items-center justify-center mb-4">
          <CheckIcon size={28} />
        </span>
        <h3 className="text-lg font-semibold text-fg mb-2">{t("success_title")}</h3>
        <p className="text-fg-soft text-sm">
          {t("success_text", { email: form.email })}
        </p>
      </div>
    );
  }

  // Step 1 — pick the account type.
  if (!role) {
    const roles: { key: "parent" | "student" | "teacher"; fr: string; ar: string; desc_fr: string; desc_ar: string; icon: React.ReactNode }[] = [
      { key: "parent", fr: "Parent", ar: "وليّ أمر", desc_fr: "Je gère la scolarité de mes enfants", desc_ar: "أتابع دراسة أبنائي",
        icon: <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /> },
      { key: "student", fr: "Élève", ar: "تلميذ", desc_fr: "J'apprends et je révise moi-même", desc_ar: "أتعلّم وأراجع بنفسي",
        icon: <><path d="M22 10L12 5 2 10l10 5 10-5z" /><path d="M6 12v5c0 1 2.5 3 6 3s6-2 6-3v-5" /></> },
      { key: "teacher", fr: "Enseignant", ar: "أستاذ", desc_fr: "J'enseigne et j'accompagne des élèves", desc_ar: "أُدرّس وأرافق التلاميذ",
        icon: <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></> },
    ];
    return (
      <div className="space-y-3">
        <p className="text-sm text-fg-soft mb-1">{isAr ? "من أنت؟" : "Je crée un compte en tant que :"}</p>
        {roles.map((r) => (
          <button
            key={r.key}
            type="button"
            onClick={() => setRole(r.key)}
            className="w-full flex items-center gap-4 text-start bg-surface border border-line rounded-card p-4 hover:border-gold hover:shadow-card-hover transition-all"
          >
            <span className="w-11 h-11 rounded-xl bg-surface-3 text-fg inline-flex items-center justify-center flex-shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{r.icon}</svg>
            </span>
            <span className="flex-1 min-w-0">
              <span className="font-semibold text-fg flex items-center gap-2">
                {isAr ? r.ar : r.fr}
                {r.key === "teacher" && (
                  <span className="text-[10px] font-bold bg-gold text-navy rounded px-1.5 py-0.5">PRO</span>
                )}
              </span>
              <span className="block text-xs text-fg-soft mt-0.5">{isAr ? r.desc_ar : r.desc_fr}</span>
            </span>
            <span className="text-fg-faint">→</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Chosen role + change */}
      <div className="flex items-center justify-between bg-surface-2 border border-line rounded-btn px-3 py-2">
        <span className="text-sm text-fg font-medium flex items-center gap-2">
          {isAr ? "الحساب" : "Compte"} :{" "}
          {role === "parent" ? (isAr ? "وليّ أمر" : "Parent") : role === "student" ? (isAr ? "تلميذ" : "Élève") : (isAr ? "أستاذ" : "Enseignant")}
          {role === "teacher" && <span className="text-[10px] font-bold bg-gold text-navy rounded px-1.5 py-0.5">PRO</span>}
        </span>
        <button type="button" onClick={() => setRole(null)} className="text-xs text-fg-soft hover:text-fg underline">
          {isAr ? "تغيير" : "Changer"}
        </button>
      </div>

      <Field label={role === "student" ? (isAr ? "اسمك الكامل" : "Ton nom complet") : t("field_name")}>
        <input name="fullName" type="text" required value={form.fullName} onChange={onChange}
          className="auth-input" placeholder={t("field_name_placeholder")} autoComplete="name" />
      </Field>

      {role === "student" && (
        <Field label={isAr ? "مستواك الدراسي" : "Ton niveau scolaire"}>
          <select name="grade" value={form.grade} onChange={onChange} className="auth-input" required>
            <option value="">{isAr ? "اختر…" : "Choisir…"}</option>
            {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </Field>
      )}
      <Field label={t("field_email")}>
        <input name="email" type="email" required value={form.email} onChange={onChange}
          className="auth-input" placeholder={t("field_email_placeholder")} autoComplete="email" />
      </Field>
      <Field label={t("field_password")}>
        <input name="password" type="password" required minLength={8} value={form.password} onChange={onChange}
          className="auth-input" placeholder={t("field_password_placeholder")} autoComplete="new-password" />
        <span className="text-xs text-fg-faint mt-1.5 block">{t("password_hint")}</span>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label={t("field_phone")}>
          <input name="phone" type="tel" value={form.phone} onChange={onChange}
            className="auth-input" placeholder={t("field_phone_placeholder")} />
        </Field>
        <Field label={t("field_wilaya")}>
          <select name="wilaya" value={form.wilaya} onChange={onChange} className="auth-input">
            <option value="">{t("wilaya_choose")}</option>
            {WILAYAS.map((w) => <option key={w} value={w}>{w}</option>)}
            <option value="other">{t("wilaya_other")}</option>
          </select>
        </Field>
      </div>

      <label className="flex items-start gap-2.5 text-sm text-fg-soft cursor-pointer pt-1">
        <input
          type="checkbox"
          name="accepted"
          checked={form.accepted}
          onChange={onChange}
          className="mt-1 w-4 h-4 accent-navy flex-shrink-0"
        />
        <span>
          {t("accept_pre")}{" "}
          <a href="/legal/conditions" target="_blank" className="text-fg underline">{t("accept_terms")}</a>
          {" "}{t("accept_and")}{" "}
          <a href="/legal/confidentialite" target="_blank" className="text-fg underline">{t("accept_privacy")}</a>
          {t("accept_post")}
        </span>
      </label>

      <button type="submit" disabled={status === "loading"}
        className="btn btn-primary w-full btn-lg disabled:opacity-60 mt-2">
        {status === "loading" ? t("submitting") : t("submit")}
      </button>

      {status === "err" && (
        <p className="text-sm text-red-500 text-center" role="alert">{errorMsg}</p>
      )}

      <SocialAuth next="/espace" />

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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-fg mb-1.5">{label}</span>
      {children}
    </label>
  );
}
