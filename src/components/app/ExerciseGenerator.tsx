"use client";

/**
 * Teacher exercise generator UI. Posts to /api/teacher/generate-exercises,
 * shows the generated exercises, and offers copy + print (a teacher can hand
 * them straight to a class).
 */

import { useState } from "react";
import { toast } from "sonner";

interface Exercise {
  prompt: string;
  options?: string[];
  answer: string;
  explanation?: string;
}

const GRADES = ["1AP", "2AP", "3AP", "4AP", "5AP", "1AM", "2AM", "3AM", "4AM", "1AS", "2AS", "3AS"];

export function ExerciseGenerator({ locale }: { locale: "fr" | "ar" }) {
  const isAr = locale === "ar";
  const [form, setForm] = useState({
    subject: "Mathématiques",
    grade: "4AM",
    topic: "",
    count: 5,
    difficulty: "moyen",
    kind: "mcq",
  });
  const [busy, setBusy] = useState(false);
  const [exercises, setExercises] = useState<Exercise[] | null>(null);
  const [showAnswers, setShowAnswers] = useState(true);

  const set = (k: string, v: string | number) => setForm((f) => ({ ...f, [k]: v }));

  const generate = async () => {
    if (!form.topic.trim()) {
      toast.error(isAr ? "أدخل الدرس أو الموضوع" : "Indique le chapitre ou le thème");
      return;
    }
    setBusy(true);
    setExercises(null);
    try {
      const res = await fetch("/api/teacher/generate-exercises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, locale }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Erreur");
      setExercises(json.exercises as Exercise[]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally {
      setBusy(false);
    }
  };

  const copyAll = () => {
    if (!exercises) return;
    const text = exercises
      .map((ex, i) => {
        let s = `${i + 1}. ${ex.prompt}`;
        if (ex.options) s += "\n" + ex.options.map((o, j) => `   ${String.fromCharCode(65 + j)}. ${o}`).join("\n");
        s += `\n   → ${ex.answer}`;
        return s;
      })
      .join("\n\n");
    navigator.clipboard?.writeText(text).then(
      () => toast.success(isAr ? "نُسخت التمارين" : "Exercices copiés"),
      () => {},
    );
  };

  const inputClass =
    "w-full bg-surface border border-line-strong rounded-btn px-3 py-2 text-sm text-fg focus:outline-none focus:border-fg";

  return (
    <div>
      {/* Form */}
      <div className="bg-surface border border-line rounded-card p-5 mb-6 print:hidden">
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="block text-xs font-semibold text-fg-soft mb-1">{isAr ? "المادة" : "Matière"}</span>
            <input value={form.subject} onChange={(e) => set("subject", e.target.value)} className={inputClass} />
          </label>
          <label className="block">
            <span className="block text-xs font-semibold text-fg-soft mb-1">{isAr ? "المستوى" : "Niveau"}</span>
            <select value={form.grade} onChange={(e) => set("grade", e.target.value)} className={inputClass}>
              {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </label>
          <label className="block col-span-2">
            <span className="block text-xs font-semibold text-fg-soft mb-1">{isAr ? "الدرس / الموضوع" : "Chapitre / thème"}</span>
            <input
              value={form.topic}
              onChange={(e) => set("topic", e.target.value)}
              placeholder={isAr ? "مثال: نظرية فيثاغورس" : "Ex : théorème de Pythagore"}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="block text-xs font-semibold text-fg-soft mb-1">{isAr ? "العدد" : "Nombre"}</span>
            <select value={form.count} onChange={(e) => set("count", Number(e.target.value))} className={inputClass}>
              {[3, 5, 8, 10].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="block text-xs font-semibold text-fg-soft mb-1">{isAr ? "الصعوبة" : "Difficulté"}</span>
            <select value={form.difficulty} onChange={(e) => set("difficulty", e.target.value)} className={inputClass}>
              <option value="facile">{isAr ? "سهل" : "Facile"}</option>
              <option value="moyen">{isAr ? "متوسط" : "Moyen"}</option>
              <option value="difficile">{isAr ? "صعب" : "Difficile"}</option>
            </select>
          </label>
          <label className="block col-span-2">
            <span className="block text-xs font-semibold text-fg-soft mb-1">{isAr ? "النوع" : "Type"}</span>
            <select value={form.kind} onChange={(e) => set("kind", e.target.value)} className={inputClass}>
              <option value="mcq">{isAr ? "أسئلة متعددة الخيارات (QCM)" : "QCM à choix multiples"}</option>
              <option value="open">{isAr ? "أسئلة مفتوحة مع التصحيح" : "Questions ouvertes avec corrigé"}</option>
            </select>
          </label>
        </div>
        <button onClick={generate} disabled={busy} className="btn btn-primary w-full mt-4 disabled:opacity-60">
          {busy ? (isAr ? "جارٍ التوليد…" : "Génération en cours…") : (isAr ? "توليد التمارين" : "Générer les exercices")}
        </button>
      </div>

      {/* Results */}
      {exercises && exercises.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4 print:hidden">
            <h2 className="text-lg font-bold text-fg">{exercises.length} {isAr ? "تمرين" : "exercices"}</h2>
            <div className="flex gap-2">
              <button onClick={() => setShowAnswers((v) => !v)} className="btn btn-outline btn-sm">
                {showAnswers ? (isAr ? "إخفاء التصحيح" : "Masquer le corrigé") : (isAr ? "إظهار التصحيح" : "Afficher le corrigé")}
              </button>
              <button onClick={copyAll} className="btn btn-outline btn-sm">{isAr ? "نسخ" : "Copier"}</button>
              <button onClick={() => window.print()} className="btn btn-primary btn-sm">{isAr ? "طباعة" : "Imprimer"}</button>
            </div>
          </div>

          <div className="space-y-4">
            {exercises.map((ex, i) => (
              <div key={i} className="bg-surface border border-line rounded-card p-5">
                <p className="font-semibold text-fg mb-2">
                  <span className="text-gold">{i + 1}.</span> {ex.prompt}
                </p>
                {ex.options && (
                  <ul className="space-y-1 mb-2">
                    {ex.options.map((o, j) => (
                      <li key={j} className="text-sm text-fg flex gap-2">
                        <span className="font-semibold text-fg-soft">{String.fromCharCode(65 + j)}.</span>
                        {o}
                      </li>
                    ))}
                  </ul>
                )}
                {showAnswers && (
                  <div className="mt-2 pt-2 border-t border-line">
                    <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">
                      ✓ {isAr ? "الإجابة" : "Réponse"} : {ex.answer}
                    </p>
                    {ex.explanation && (
                      <p className="text-xs text-fg-soft mt-1">{ex.explanation}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
