"use client";

/**
 * EcoleQuoteForm — quote-request form for Pack École.
 *
 * Captures: school name, contact name + role, email, phone, wilaya,
 * student count range, levels covered, special needs / message. Submits
 * to /api/ecole/contact which stores in school_quote_requests + (later)
 * emails the sales inbox.
 *
 * Available without login — schools shouldn't have to sign up to ask for
 * a price.
 */

import { useState } from "react";
import { useLocale } from "next-intl";

const WILAYAS = [
  "Alger", "Oran", "Constantine", "Annaba", "Blida", "Sétif", "Batna", "Tlemcen",
  "Biskra", "Bejaia", "Mostaganem", "Tizi-Ouzou", "Béchar", "Tamanrasset", "Adrar",
  "Ghardaïa", "Ouargla", "El Oued", "Skikda", "Boumerdès", "Médéa", "Relizane",
  "Mascara", "Saïda", "Tiaret", "Djelfa", "Bouira", "M'Sila", "Bordj Bou Arréridj",
  "Khenchela", "Tébessa", "Souk Ahras", "Aïn Defla", "Aïn Témouchent", "Naâma",
  "Mila", "Tipaza", "Tindouf", "Illizi", "El Bayadh", "El Tarf", "Sidi Bel Abbès",
  "Chlef", "Laghouat", "Jijel", "Guelma", "Oum El Bouaghi", "Autre",
];

const SIZE_BUCKETS = [
  { v: "<100",     fr: "Moins de 100",    ar: "أقل من ١٠٠" },
  { v: "100-300",  fr: "100 à 300",       ar: "١٠٠ إلى ٣٠٠" },
  { v: "300-600",  fr: "300 à 600",       ar: "٣٠٠ إلى ٦٠٠" },
  { v: "600-1000", fr: "600 à 1000",      ar: "٦٠٠ إلى ١٠٠٠" },
  { v: ">1000",    fr: "Plus de 1000",    ar: "أكثر من ١٠٠٠" },
];

const LEVELS_FR = ["Maternelle", "Primaire (1AP-5AP)", "Moyen (1AM-4AM)", "Secondaire (1AS-3AS)"];
const LEVELS_AR = ["تحضيري", "ابتدائي (١-٥)", "متوسط (١-٤)", "ثانوي (١-٣)"];

export function EcoleQuoteForm() {
  const locale = useLocale();
  const isAr = locale === "ar";

  const [schoolName, setSchoolName] = useState("");
  const [contactName, setContactName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [wilaya, setWilaya] = useState("Alger");
  const [studentCount, setStudentCount] = useState("100-300");
  const [levels, setLevels] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const toggleLevel = (l: string) => {
    setLevels((prev) => (prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]));
  };

  const submit = async () => {
    if (schoolName.trim().length < 2) { setErr(isAr ? "اسم المدرسة مطلوب" : "Nom de l'école requis"); return; }
    if (!email.includes("@")) { setErr(isAr ? "بريد إلكتروني غير صالح" : "Email invalide"); return; }
    setSubmitting(true); setErr(null);
    try {
      const r = await fetch("/api/ecole/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schoolName: schoolName.trim(),
          contactName: contactName.trim(),
          role: role.trim(),
          email: email.trim(),
          phone: phone.trim(),
          wilaya,
          studentCount,
          levels,
          message: message.trim(),
        }),
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
      <div className="bg-surface border-2 border-emerald-500/50 rounded-card p-8 text-center">
        <div className="inline-flex w-14 h-14 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 items-center justify-center mb-3">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
        </div>
        <h3 className="text-xl font-bold text-fg mb-2">{isAr ? "شكراً ! تمّ استلام طلبك" : "Merci ! Demande reçue"}</h3>
        <p className="text-base text-fg-soft mb-1 max-w-prose mx-auto">
          {isAr
            ? "سيتواصل معك فريق Najah خلال ٢٤-٤٨ ساعة لمناقشة احتياجات مدرستك واقتراح عرض مخصّص."
            : "L'équipe Najah te contactera sous 24-48h pour comprendre les besoins de ton établissement et proposer un devis adapté."}
        </p>
        <p className="text-xs text-fg-faint">{isAr ? `بريدك: ${email}` : `Sur ${email}`}</p>
      </div>
    );
  }

  const labels = isAr ? LEVELS_AR : LEVELS_FR;

  return (
    <div className="bg-surface border-2 border-line rounded-card p-6 md:p-8 space-y-4">
      {/* School identity */}
      <div className="grid md:grid-cols-2 gap-4">
        <Field label={isAr ? "اسم المدرسة" : "Nom de l'école"} required>
          <input value={schoolName} onChange={(e) => setSchoolName(e.target.value)}
            placeholder={isAr ? "ابتدائية حسيبة بن بوعلي" : "École Hassiba Ben Bouali"}
            className="input" />
        </Field>
        <Field label={isAr ? "الولاية" : "Wilaya"}>
          <select value={wilaya} onChange={(e) => setWilaya(e.target.value)} className="input">
            {WILAYAS.map((w) => <option key={w}>{w}</option>)}
          </select>
        </Field>
      </div>

      {/* Contact */}
      <div className="grid md:grid-cols-2 gap-4">
        <Field label={isAr ? "اسمك" : "Ton nom"}>
          <input value={contactName} onChange={(e) => setContactName(e.target.value)}
            placeholder={isAr ? "السيدة فاطمة..." : "Mme Fatima..."}
            className="input" />
        </Field>
        <Field label={isAr ? "وظيفتك" : "Ton rôle"}>
          <input value={role} onChange={(e) => setRole(e.target.value)}
            placeholder={isAr ? "مديرة، أستاذ، إدارة..." : "Directrice, prof, administration..."}
            className="input" />
        </Field>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Field label={isAr ? "البريد الإلكتروني" : "Email"} required>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email"
            placeholder="contact@ecole.dz" className="input" />
        </Field>
        <Field label={isAr ? "الهاتف" : "Téléphone"}>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel"
            placeholder="+213…" className="input" />
        </Field>
      </div>

      {/* Size + levels */}
      <Field label={isAr ? "عدد التلاميذ" : "Nombre d'élèves"}>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {SIZE_BUCKETS.map((b) => (
            <button key={b.v} type="button" onClick={() => setStudentCount(b.v)}
              className={`rounded-btn border-2 px-3 py-2 text-sm font-semibold transition ${
                studentCount === b.v ? "border-gold bg-gold/15 text-fg" : "border-line bg-surface text-fg-soft hover:border-gold"
              }`}>
              {isAr ? b.ar : b.fr}
            </button>
          ))}
        </div>
      </Field>

      <Field label={isAr ? "المستويات المعنية" : "Niveaux concernés"}>
        <div className="flex flex-wrap gap-2">
          {labels.map((l, i) => {
            const v = LEVELS_FR[i]; // store FR canonical value regardless of UI lang
            const on = levels.includes(v);
            return (
              <button key={v} type="button" onClick={() => toggleLevel(v)}
                className={`rounded-full border-2 px-3 py-1.5 text-sm font-semibold transition ${
                  on ? "border-gold bg-gold/15 text-fg" : "border-line bg-surface text-fg-soft hover:border-gold"
                }`}>
                {l}
              </button>
            );
          })}
        </div>
      </Field>

      <Field label={isAr ? "رسالتك (اختياري)" : "Ton message (facultatif)"}>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4}
          placeholder={isAr ? "هل لديك احتياجات خاصة ؟" : "Des besoins spécifiques ? Une langue préférée ?"}
          className="input" />
      </Field>

      {err && <div className="bg-red-50 dark:bg-red-950/30 border border-red-300 text-red-700 dark:text-red-400 rounded-btn p-3 text-sm">{err}</div>}

      <button onClick={submit} disabled={submitting}
        className="btn btn-primary w-full">
        {submitting ? (isAr ? "جاري الإرسال..." : "Envoi…") : (isAr ? "أرسل الطلب" : "Envoyer ma demande de devis")}
      </button>

      <p className="text-xs text-fg-faint text-center">
        {isAr ? "بياناتك محمية. لا نشاركها مع أيّ طرف ثالث." : "Données protégées. Aucun partage avec des tiers."}
      </p>

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 12px;
          border: 2px solid var(--color-line);
          background: var(--color-surface);
          color: var(--color-fg);
          padding: 0.55rem 0.85rem;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.15s;
        }
        .input:focus {
          border-color: var(--color-gold);
        }
      `}</style>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold text-fg mb-1.5">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      {children}
    </div>
  );
}
