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
  const t = useTranslations("Inscription");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    wilaya: "",
    accepted: false,
  });
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [errorMsg, setErrorMsg] = useState("");

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
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, locale }),
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

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label={t("field_name")}>
        <input name="fullName" type="text" required value={form.fullName} onChange={onChange}
          className="auth-input" placeholder={t("field_name_placeholder")} autoComplete="name" />
      </Field>
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
