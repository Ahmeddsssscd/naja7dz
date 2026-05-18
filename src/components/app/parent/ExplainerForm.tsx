"use client";

/**
 * ExplainerForm — client UI for "comment expliquer X à un Y ?"
 *
 * Posts to /api/parent/explain. The API stores the question and returns
 * a structured 4-step framework (bilingual FR + AR). Real AI plugs into
 * the API later — UI never has to change.
 */

import { useState } from "react";
import { useLocale } from "next-intl";

const GRADES = [
  "1AP", "2AP", "3AP", "4AP", "5AP",
  "1AM", "2AM", "3AM", "4AM",
  "1AS", "2AS", "3AS",
];

const SUBJECTS_FR = ["Mathématiques", "Sciences", "Français", "Arabe", "Anglais", "Histoire", "Éducation islamique", "Autre"];
const SUBJECTS_AR = ["رياضيات", "علوم", "فرنسية", "عربية", "إنجليزية", "تاريخ", "تربية إسلامية", "أخرى"];

interface Reply {
  fr: string[];
  ar: string[];
  takeaway_fr: string;
  takeaway_ar: string;
}

export function ExplainerForm() {
  const locale = useLocale();
  const isAr = locale === "ar";

  const [question, setQuestion] = useState("");
  const [grade, setGrade] = useState("3AP");
  const [subject, setSubject] = useState(0); // index into SUBJECTS arrays
  const [submitting, setSubmitting] = useState(false);
  const [reply, setReply] = useState<Reply | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const submit = async () => {
    if (question.trim().length < 8) return;
    setSubmitting(true); setErr(null); setReply(null);
    try {
      const r = await fetch("/api/parent/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.trim(),
          grade,
          subject_fr: SUBJECTS_FR[subject],
          subject_ar: SUBJECTS_AR[subject],
        }),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j.error ?? "Erreur");
      }
      const json = await r.json();
      setReply(json.reply);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-surface rounded-3xl border-2 border-pale-blue p-5 md:p-6">
        <label className="block text-xs font-bold text-navy mb-1">
          {isAr ? "ما هو سؤالك ؟" : "Quelle est ta question ?"} <span className="text-red-600">*</span>
        </label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={3}
          placeholder={isAr ? "مثال: كيف أشرح التمثيل الضوئي لطفل في ٤ ابتدائي ؟" : "Ex : comment expliquer la photosynthèse à un 4AP ?"}
          className="w-full rounded-xl border-2 border-pale-blue px-3 py-2.5 text-sm focus:outline-none focus:border-gold mb-4"
        />

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-xs font-bold text-navy mb-1">{isAr ? "السنة" : "Niveau"}</label>
            <select value={grade} onChange={(e) => setGrade(e.target.value)}
              className="w-full rounded-xl border-2 border-pale-blue px-3 py-2 text-sm focus:outline-none focus:border-gold">
              {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-navy mb-1">{isAr ? "المادة" : "Matière"}</label>
            <select value={subject} onChange={(e) => setSubject(Number(e.target.value))}
              className="w-full rounded-xl border-2 border-pale-blue px-3 py-2 text-sm focus:outline-none focus:border-gold">
              {(isAr ? SUBJECTS_AR : SUBJECTS_FR).map((s, i) => <option key={i} value={i}>{s}</option>)}
            </select>
          </div>
        </div>

        {err && <div className="bg-red-50 text-red-700 rounded-lg p-2 text-sm mb-3">{err}</div>}

        <button onClick={submit} disabled={question.trim().length < 8 || submitting}
          className={`btn w-full ${question.trim().length < 8 ? "btn-outline opacity-50" : "btn-primary"}`}>
          {submitting ? (isAr ? "جاري التحضير..." : "Préparation…") : (isAr ? "احصل على شرح" : "Obtenir une explication")}
        </button>
      </div>

      {reply && (
        <div className="space-y-3">
          {/* FR card */}
          <div className="bg-surface rounded-3xl border-2 border-gold p-5">
            <div className="text-[10px] uppercase tracking-wider font-bold text-gold mb-2">FR · En français</div>
            <ol className="space-y-2.5 text-sm md:text-base text-navy list-decimal list-inside">
              {reply.fr.map((step, i) => <li key={i} className="leading-relaxed">{step}</li>)}
            </ol>
            <div className="mt-3 pt-3 border-t border-pale-blue text-sm">
              <strong className="text-gold">{isAr ? "خلاصة" : "À retenir"}: </strong>
              <span className="text-navy">{reply.takeaway_fr}</span>
            </div>
          </div>

          {/* AR card */}
          <div className="bg-surface rounded-3xl border-2 border-emerald-400 p-5" dir="rtl">
            <div className="text-[10px] uppercase tracking-wider font-bold text-emerald-700 mb-2">AR · بالعربية</div>
            <ol className="space-y-2.5 text-sm md:text-base text-navy list-decimal list-inside">
              {reply.ar.map((step, i) => <li key={i} className="leading-relaxed">{step}</li>)}
            </ol>
            <div className="mt-3 pt-3 border-t border-pale-blue text-sm">
              <strong className="text-emerald-700">خلاصة: </strong>
              <span className="text-navy">{reply.takeaway_ar}</span>
            </div>
          </div>

          <div className="bg-pale-blue/30 rounded-2xl p-3 text-xs text-fg-soft text-center">
            {isAr
              ? "ستتلقى إجابة أعمق من فريق Najah خلال ٤٨ ساعة عبر بريدك الإلكتروني."
              : "Une réponse plus poussée d'un tuteur Najah te sera envoyée par email sous 48h."}
          </div>
        </div>
      )}
    </div>
  );
}
