"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { toast } from "sonner";

interface Feedback {
  score: number;
  strengths: string[];
  improvements: string[];
  comment: string;
}

export function WritingPad({ prompt, promptAr }: { prompt: string; promptAr?: string }) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const charCount = text.length;
  const lineCount = text.split("\n").length;

  const onSubmit = async () => {
    if (wordCount < 10) {
      toast.error(isAr ? "اكتب 10 كلمات على الأقل." : "Écris au moins 10 mots avant de soumettre.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/writing/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, text, locale: isAr ? "ar" : "fr" }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Erreur");
      setFeedback(json.feedback as Feedback);
      toast.success(isAr ? "تم تصحيح رسالتك ✓" : "Ta rédaction est corrigée ✓");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  if (feedback) {
    const pct = Math.round((feedback.score / 20) * 100);
    return (
      <div className="space-y-5 max-w-2xl">
        {/* Score */}
        <div className="bg-surface border border-line rounded-card p-6 text-center">
          <div className="text-xs font-semibold text-gold uppercase tracking-wider mb-2">
            {isAr ? "تقييمك" : "Ton évaluation"}
          </div>
          <div className={`text-5xl font-bold ${pct >= 50 ? "text-emerald-600" : "text-red-500"}`}>
            <bdi>{feedback.score}</bdi>
            <span className="text-2xl text-fg-soft"> / 20</span>
          </div>
        </div>

        {/* Strengths */}
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-card p-5">
          <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-300 mb-3">
            ✓ {isAr ? "نقاط القوة" : "Tes points forts"}
          </h3>
          <ul className="space-y-2">
            {feedback.strengths.map((s, i) => (
              <li key={i} className="text-sm text-fg flex items-start gap-2">
                <span className="text-emerald-600 mt-0.5">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Improvements */}
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-card p-5">
          <h3 className="text-sm font-bold text-amber-800 dark:text-amber-300 mb-3">
            ↗ {isAr ? "لتتحسّن أكثر" : "Pour progresser"}
          </h3>
          <ul className="space-y-2">
            {feedback.improvements.map((s, i) => (
              <li key={i} className="text-sm text-fg flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Comment */}
        <div className="bg-navy rounded-card p-5">
          <p className="text-white text-sm leading-relaxed">{feedback.comment}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setFeedback(null)}
            className="btn btn-outline flex-1"
          >
            {isAr ? "تعديل نصي" : "Modifier mon texte"}
          </button>
          <button
            onClick={() => { setText(""); setFeedback(null); }}
            className="btn btn-primary flex-1"
          >
            {isAr ? "كتابة نص جديد" : "Écrire une autre"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-surface border border-line rounded-card p-5">
        <div className="text-xs font-semibold text-gold uppercase tracking-wider mb-2">
          {isAr ? "الموضوع" : "Sujet"}
        </div>
        <p className="text-fg font-medium">{prompt}</p>
        {promptAr && !isAr && (
          <p className="text-fg-soft text-sm mt-2 font-arabic" dir="rtl">{promptAr}</p>
        )}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={12}
        placeholder={isAr ? "ابدأ الكتابة هنا…" : "Commence à écrire ici…"}
        dir={isAr ? "rtl" : "ltr"}
        className="w-full p-5 bg-surface border border-line-strong rounded-card text-fg font-medium leading-relaxed text-base resize-none focus:outline-none focus:border-fg focus:ring-2 focus:ring-gold/20"
      />

      <div className="flex justify-between text-xs text-fg-soft">
        <span>
          {lineCount} {lineCount > 1 ? (isAr ? "أسطر" : "lignes") : (isAr ? "سطر" : "ligne")} ·{" "}
          {wordCount} {isAr ? "كلمة" : "mots"} · {charCount} {isAr ? "حرف" : "caractères"}
        </span>
        <span className={wordCount < 10 ? "text-fg-faint" : "text-green-600 font-semibold"}>
          {wordCount < 10 ? (isAr ? "10 كلمات على الأقل" : "Minimum 10 mots") : (isAr ? "جاهز ✓" : "Prêt ✓")}
        </span>
      </div>

      <button
        onClick={onSubmit}
        className="btn btn-primary btn-lg w-full disabled:opacity-50"
        disabled={wordCount < 10 || loading}
      >
        {loading
          ? (isAr ? "جارٍ التصحيح…" : "Correction en cours…")
          : (isAr ? "صحّح رسالتي" : "Corriger ma rédaction")}
      </button>
    </div>
  );
}
