"use client";

/**
 * TeacherSignupForm — creates the teacher_profiles row for an already-
 * authenticated user. Asks for full_name, school, wilaya, phone, bio.
 *
 * Once submitted, the page reloads and the server redirects them to the
 * dashboard (since the profile now exists).
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
  "Chlef", "Médéa", "Laghouat", "Jijel", "Guelma", "Oum El Bouaghi", "Aïn Salah",
  "Bordj Badji Mokhtar", "Béni Abbès", "El M'Ghair", "El Menia", "Ouled Djellal",
  "In Guezzam", "Djanet", "Timimoun", "Touggourt",
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
      // Success — the redirect will pick up the new profile
      router.push("/enseignant/dashboard");
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erreur");
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-gold p-5 md:p-6">
      <div className="mb-4">
        <h2 className="text-lg md:text-xl font-bold text-navy">
          🎒 {isAr ? "تفعيل وضع الأستاذ" : "Active ton compte enseignant"}
        </h2>
        <p className="text-xs text-fg-soft">{isAr ? `بريدك: ${userEmail}` : `Email: ${userEmail}`}</p>
      </div>

      <div className="space-y-3">
        <Field label={isAr ? "الاسم الكامل" : "Nom complet"} required>
          <input value={fullName} onChange={(e) => setFullName(e.target.value)}
            placeholder={isAr ? "مثال: السيد أحمد بن علي" : "Ex : M. Ahmed Benali"}
            className="w-full rounded-xl border-2 border-pale-blue px-3 py-2 text-sm focus:outline-none focus:border-gold" />
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label={isAr ? "اسم المدرسة" : "Nom de l'école"}>
            <input value={school} onChange={(e) => setSchool(e.target.value)}
              placeholder={isAr ? "مثال: ابتدائية حسيبة بن بوعلي" : "Ex : École Hassiba Ben Bouali"}
              className="w-full rounded-xl border-2 border-pale-blue px-3 py-2 text-sm focus:outline-none focus:border-gold" />
          </Field>
          <Field label={isAr ? "الولاية" : "Wilaya"}>
            <select value={wilaya} onChange={(e) => setWilaya(e.target.value)}
              className="w-full rounded-xl border-2 border-pale-blue px-3 py-2 text-sm focus:outline-none focus:border-gold">
              {WILAYAS.map((w) => <option key={w}>{w}</option>)}
            </select>
          </Field>
        </div>

        <Field label={isAr ? "رقم الهاتف (اختياري)" : "Téléphone (facultatif)"}>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="+213…"
            className="w-full rounded-xl border-2 border-pale-blue px-3 py-2 text-sm focus:outline-none focus:border-gold" />
        </Field>

        <Field label={isAr ? "نبذة عنك (اختياري)" : "Présente-toi en 1 phrase (facultatif)"}>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={2}
            placeholder={isAr ? "مثال: أُدرّس الرياضيات منذ ١٠ سنوات" : "Ex : J'enseigne les maths depuis 10 ans en 5AP."}
            className="w-full rounded-xl border-2 border-pale-blue px-3 py-2 text-sm focus:outline-none focus:border-gold" />
        </Field>

        {err && <div className="bg-red-50 text-red-700 rounded-lg p-2 text-sm">{err}</div>}

        <button onClick={submit} disabled={fullName.trim().length < 3 || submitting}
          className={`btn w-full ${fullName.trim().length < 3 ? "btn-outline opacity-50" : "btn-primary"}`}>
          {submitting ? (isAr ? "جاري التفعيل..." : "Activation…") : (isAr ? "فعّل حسابي" : "Activer mon compte enseignant")}
        </button>
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold text-navy mb-1">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      {children}
    </div>
  );
}
