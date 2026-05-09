"use client";

/**
 * Services request form.
 *
 * 5 service types as radio cards + free-text "détails" + contact-method
 * preference. POSTs to /api/fac/services. Server saves to a table and
 * sends an email to the Najah staff inbox.
 */

import { useState } from "react";
import { useLocale } from "next-intl";

type Service = "orientation" | "dossier" | "memoire" | "bourse" | "autre";

const SERVICES: { key: Service; fr: string; ar: string; sub_fr: string; sub_ar: string; emoji: string }[] = [
  { key: "orientation", fr: "Orientation post-Bac",     ar: "توجيه بعد البكالوريا", sub_fr: "Appel vidéo 30 min avec un conseiller", sub_ar: "مكالمة فيديو ٣٠ دقيقة مع مرشد", emoji: "🎯" },
  { key: "dossier",     fr: "Relecture de dossier",     ar: "مراجعة ملف",          sub_fr: "CV, lettre de motivation, dossier d'inscription", sub_ar: "السيرة الذاتية، رسالة الدوافع، ملف التسجيل", emoji: "📋" },
  { key: "memoire",     fr: "Aide PFE / mémoire",       ar: "مساعدة المذكرة",       sub_fr: "Structure, relecture, références",     sub_ar: "البنية، المراجعة، المراجع", emoji: "📚" },
  { key: "bourse",      fr: "Recherche de bourses",     ar: "بحث عن منح",          sub_fr: "Erasmus, Campus France, bourses nationales", sub_ar: "إيراسموس، كامبوس فرانس، منح وطنية", emoji: "💰" },
  { key: "autre",       fr: "Autre demande",            ar: "طلب آخر",              sub_fr: "Décris ton besoin librement",          sub_ar: "اشرح حاجتك بحرية", emoji: "💬" },
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
      <div className="bg-white rounded-3xl border-2 border-emerald-300 p-6 text-center">
        <div className="text-6xl mb-3">✅</div>
        <h2 className="text-xl font-bold text-navy mb-2">{isAr ? "تمّ إرسال طلبك !" : "Demande envoyée !"}</h2>
        <p className="text-sm text-fg-soft">
          {isAr
            ? `سيتواصل معك فريق Najah خلال ٢٤-٤٨ ساعة على ${userEmail}.`
            : `L'équipe Najah te contactera sous 24-48h sur ${userEmail}.`}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border-2 border-pale-blue p-5 md:p-6">
      <h2 className="text-lg md:text-xl font-bold text-navy mb-1">{isAr ? "ما الخدمة المطلوبة ؟" : "Quel service souhaites-tu ?"}</h2>
      <p className="text-xs text-fg-soft mb-4">{isAr ? "اختر واحدة" : "Choisis-en une"}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mb-5">
        {SERVICES.map((s) => (
          <button key={s.key} onClick={() => setService(s.key)}
            className={`text-start rounded-2xl border-2 p-3 transition active:scale-[0.99] ${service === s.key ? "border-gold bg-gold/15" : "border-pale-blue bg-pale-blue/20 hover:border-gold"}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl flex-shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-navy text-sm md:text-base">{isAr ? s.ar : s.fr}</div>
                <div className="text-xs text-fg-soft mt-0.5">{isAr ? s.sub_ar : s.sub_fr}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <label className="block text-xs font-bold text-navy mb-1">
        {isAr ? "تفاصيل الطلب" : "Détails de ta demande"} <span className="text-red-600">*</span>
      </label>
      <textarea
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        rows={4}
        placeholder={isAr ? "اشرح بالتفصيل ما تحتاج..." : "Décris ton besoin en détail..."}
        className="w-full rounded-xl border-2 border-pale-blue px-3 py-2 text-sm focus:outline-none focus:border-gold mb-4"
      />

      <label className="block text-xs font-bold text-navy mb-1">
        {isAr ? "رقم الهاتف (اختياري)" : "Téléphone (facultatif)"}
      </label>
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        type="tel"
        placeholder="+213…"
        className="w-full rounded-xl border-2 border-pale-blue px-3 py-2 text-sm focus:outline-none focus:border-gold mb-4"
      />

      {err && <div className="bg-red-50 text-red-700 rounded-lg p-2 text-sm mb-3">{err}</div>}

      <button
        onClick={submit}
        disabled={!service || details.trim().length < 10 || submitting}
        className={`btn w-full ${!service || details.trim().length < 10 ? "btn-outline opacity-50" : "btn-primary"}`}
      >
        {submitting ? (isAr ? "جاري الإرسال..." : "Envoi…") : (isAr ? "إرسال الطلب" : "Envoyer ma demande")}
      </button>

      <p className="text-[11px] text-fg-soft text-center mt-3">
        {isAr ? `سنتصل بك على ${userEmail}` : `On te contactera sur ${userEmail}`}
      </p>
    </div>
  );
}
