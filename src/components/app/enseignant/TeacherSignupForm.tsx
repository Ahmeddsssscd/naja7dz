"use client";

/**
 * TeacherSignupForm — creates the teacher_profiles row for an already-
 * authenticated user. Editorial style, no emoji.
 */

import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

const WILAYAS = [
  "Alger", "Oran", "Constantine", "Annaba", "Blida", "Sétif", "Batna", "Tlemcen",
  "Biskra", "Bejaia", "Mostaganem", "Tizi-Ouzou", "Béchar", "Tamanrasset", "Adrar",
  "Ghardaïa", "Ouargla", "El Oued", "Skikda", "Boumerdès", "Médéa", "Relizane",
  "Mascara", "Saïda", "Tiaret", "Djelfa", "Bouira", "M'Sila", "Bordj Bou Arréridj",
  "Khenchela", "Tébessa", "Souk Ahras", "Aïn Defla", "Aïn Témouchent", "Naâma",
  "Mila", "Tipaza", "Tindouf", "Illizi", "El Bayadh", "El Tarf", "Sidi Bel Abbès",
  "Chlef", "Médéa", "Laghouat", "Jijel", "Guelma", "Oum El Bouaghi",
];

interface Props { userEmail: string }

export function TeacherSignupForm({ userEmail }: Props) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [school, setSchool] = useState("");
  const [wilaya, setWilaya] = useState("Alger");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async () => {
    if (fullName.trim().length < 3) return;
    setSubmitting(true); setErr(null);
    try {
      const r = await fetch("/api/teacher/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: fullName.trim(), school, wilaya, phone, bio }),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j.error ?? "Erreur");
      }
      router.push("/enseignant/dashboard");
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erreur");
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-surface border border-line rounded-card p-6 md:p-8">
      <div className="mb-6 pb-5 border-b border-line">
        <span className="eyebrow mb-2 block">{isAr ? "تفعيل" : "Activation"}</span>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-fg">
          {isAr ? "أنشئ ملفّك التعليمي" : "Active ton compte enseignant"}
        </h2>
        <p className="text-sm text-fg-soft mt-1">
          {isAr ? `بريدك الإلكتروني: ${userEmail}` : `Email associé : ${userEmail}`}
        </p>
      </div>

      <div className="space-y-4">
        <Field label={isAr ? "الاسم الكامل" : "Nom complet"} required>
          <input
            value={fullName} onChange={(e) => setFullName(e.target.value)}
            placeholder={isAr ? "مثال: السيد أحمد بن علي" : "Ex : M. Ahmed Benali"}
            className="input"
          />
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label={isAr ? "اسم المدرسة" : "Nom de l'école"}>
            <input
              value={school} onChange={(e) => setSchool(e.target.value)}
              placeholder={isAr ? "ابتدائية حسيبة بن بوعلي" : "École Hassiba Ben Bouali"}
              className="input"
            />
          </Field>
          <Field label={isAr ? "الولاية" : "Wilaya"}>
            <select value={wilaya} onChange={(e) => setWilaya(e.target.value)} className="input">
              {WILAYAS.map((w) => <option key={w}>{w}</option>)}
            </select>
          </Field>
        </div>

        <Field label={isAr ? "رقم الهاتف (اختياري)" : "Téléphone (facultatif)"}>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="+213…" className="input" />
        </Field>

        <Field label={isAr ? "نبذة عنك (اختياري)" : "Présente-toi en une phrase (facultatif)"}>
          <textarea
            value={bio} onChange={(e) => setBio(e.target.value)} rows={2}
            placeholder={isAr ? "مثال: أُدرّس الرياضيات منذ ١٠ سنوات في ٥ ابتدائي." : "Ex : J'enseigne les maths depuis 10 ans en 5AP."}
            className="input"
          />
        </Field>

        {err && <div className="bg-red-50 dark:bg-red-950/30 border border-red-300 text-red-700 dark:text-red-400 rounded-btn p-3 text-sm">{err}</div>}

        <button onClick={submit} disabled={fullName.trim().length < 3 || submitting}
          className={`btn w-full ${fullName.trim().length < 3 ? "btn-outline opacity-50" : "btn-primary"}`}>
          {submitting ? (isAr ? "جاري التفعيل..." : "Activation…") : (isAr ? "تفعيل الحساب" : "Activer mon compte enseignant")}
        </button>
      </div>

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
    <div>
      <label className="block text-xs font-semibold text-fg mb-1.5">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      {children}
    </div>
  );
}
