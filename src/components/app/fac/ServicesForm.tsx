"use client";

/**
 * Services request form.
 *
 * 5 service types as radio cards (typography-only, no emoji) + free-text
 * détails + contact-method preference. POSTs to /api/fac/services.
 */

import { useState } from "react";
import { useLocale } from "next-intl";
import { CheckIcon } from "@/components/Icon";

type Service = "orientation" | "dossier" | "memoire" | "bourse" | "autre";

const SERVICES: { key: Service; fr: string; ar: string; sub_fr: string; sub_ar: string }[] = [
  { key: "orientation", fr: "Orientation post-Bac",     ar: "توجيه بعد البكالوريا", sub_fr: "Appel vidéo de 30 min avec un conseiller", sub_ar: "مكالمة فيديو ٣٠ دقيقة مع مرشد" },
  { key: "dossier",     fr: "Relecture de dossier",     ar: "مراجعة ملف",          sub_fr: "CV, lettre de motivation, dossier d'inscription", sub_ar: "السيرة الذاتية، رسالة الدوافع، ملف التسجيل" },
  { key: "memoire",     fr: "Aide PFE / mémoire",       ar: "مساعدة المذكرة",       sub_fr: "Structure, relecture, références",     sub_ar: "البنية، المراجعة، المراجع" },
  { key: "bourse",      fr: "Recherche de bourses",     ar: "بحث عن منح",          sub_fr: "Erasmus, Campus France, bourses nationales", sub_ar: "إيراسموس، كامبوس فرانس، منح وطنية" },
  { key: "autre",       fr: "Autre demande",            ar: "طلب آخر",              sub_fr: "Décris ton besoin librement",          sub_ar: "اشرح حاجتك بحرية" },
];

interface Props { userEmail: string }

export function ServicesForm({ userEmail }: Props) {
  const locale = useLocale();
  const isAr = locale === "ar";

  const [service, setService] = useState<Service | null>(null);
  const [details, setDetails] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async () => {
    if (!service) return;
    setSubmitting(true); setErr(null);
    try {
      const r = await fetch("/api/fac/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service, details, phone }),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j.error ?? "Erreur");
      }
      setDone(true);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="bg-surface border border-line rounded-card p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-surface-3 text-fg inline-flex items-center justify-center mb-5">
          <CheckIcon size={22} />
        </div>
        <h2 className="text-xl font-semibold text-fg mb-2">{isAr ? "تمّ إرسال طلبك" : "Demande reçue"}</h2>
        <p className="text-base text-fg-soft max-w-prose mx-auto">
          {isAr
            ? `سيتواصل معك فريق Najah خلال ٢٤-٤٨ ساعة على ${userEmail}.`
            : `L'équipe Najah te contactera sous 24-48h sur ${userEmail}.`}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-line rounded-card p-6 md:p-8">
      <h2 className="text-lg md:text-xl font-semibold text-fg mb-1">
        {isAr ? "ما الخدمة المطلوبة ؟" : "Quel service souhaites-tu ?"}
      </h2>
      <p className="text-xs text-fg-soft mb-5">{isAr ? "اختر واحدة" : "Choisis-en une"}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        {SERVICES.map((s) => (
          <button
            key={s.key}
            onClick={() => setService(s.key)}
            className={`text-start rounded-card border p-4 transition-all hover:shadow-card-hover ${
              service === s.key ? "border-fg bg-surface-3" : "border-line bg-surface hover:border-fg/40"
            }`}
          >
            <div className="font-semibold text-fg text-sm md:text-base mb-0.5">{isAr ? s.ar : s.fr}</div>
            <div className="text-xs text-fg-soft">{isAr ? s.sub_ar : s.sub_fr}</div>
          </button>
        ))}
      </div>

      <Field label={isAr ? "تفاصيل الطلب" : "Détails de ta demande"} required>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={4}
          placeholder={isAr ? "اشرح بالتفصيل ما تحتاج..." : "Décris ton besoin en détail..."}
          className="input"
        />
      </Field>

      <Field label={isAr ? "رقم الهاتف (اختياري)" : "Téléphone (facultatif)"}>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          type="tel"
          placeholder="+213…"
          className="input"
        />
      </Field>

      {err && <div className="bg-red-50 dark:bg-red-950/30 border border-red-300 text-red-700 dark:text-red-400 rounded-btn p-3 text-sm mb-4">{err}</div>}

      <button
        onClick={submit}
        disabled={!service || details.trim().length < 10 || submitting}
        className={`btn w-full ${!service || details.trim().length < 10 ? "btn-outline opacity-50" : "btn-primary"}`}
      >
        {submitting ? (isAr ? "جاري الإرسال..." : "Envoi…") : (isAr ? "إرسال الطلب" : "Envoyer ma demande")}
      </button>

      <p className="text-[11px] text-fg-faint text-center mt-3">
        {isAr ? `سنتصل بك على ${userEmail}` : `On te contactera sur ${userEmail}`}
      </p>

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 10px;
          border: 1px solid var(--color-line);
          background: var(--color-surface);
          color: var(--color-fg);
          padding: 0.6rem 0.85rem;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.15s;
        }
        .input:focus {
          border-color: var(--color-fg);
        }
      `}</style>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold text-fg mb-1.5">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      {children}
    </div>
  );
}
