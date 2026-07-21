"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";

/**
 * Locked-mode mock exam — real questions from the quiz bank.
 *
 * Flow: intro gate → fetch questions from /api/exam/start → timed MCQ run
 * (no exit, beforeunload guard, auto-submit at 0:00) → real score +
 * question-by-question correction with explanations.
 */

interface ExamQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  chapter: string;
}

export function MockExamMode({
  examTitle,
  subjectSlug,
  durationMinutes = 40,
  questionCount = 20,
  locale = "fr",
}: {
  examTitle: string;
  /** Subject slug to restrict the exam to; omit for all-subject mix. */
  subjectSlug?: string;
  durationMinutes?: number;
  questionCount?: number;
  locale?: "fr" | "ar";
}) {
  const router = useRouter();
  const [stage, setStage] = useState<"intro" | "loading" | "running" | "done">("intro");
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(durationMinutes * 60);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [current, setCurrent] = useState(0);
  const startedAt = useRef<number | null>(null);

  const total = questions.length || questionCount;

  useEffect(() => {
    if (stage !== "running") return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          setStage("done");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [stage]);

  // Block accidental tab close while running
  useEffect(() => {
    if (stage !== "running") return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [stage]);

  const start = async () => {
    setStage("loading");
    setLoadError(null);
    try {
      const res = await fetch("/api/exam/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: subjectSlug, count: questionCount, locale }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Erreur de chargement");
      setQuestions(json.questions);
      startedAt.current = Date.now();
      setStage("running");
      toast.info("Examen démarré · bonne chance !", { duration: 3000 });
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Erreur de chargement");
      setStage("intro");
    }
  };

  if (stage === "intro" || stage === "loading") {
    return (
      <div className="min-h-screen bg-surface-2 flex items-center justify-center px-5">
        <div className="bg-surface border-2 border-amber-500 rounded-modal p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-fg mb-3">Mode examen blanc — bloqué</h1>
          <p className="text-fg-soft mb-5 text-sm leading-relaxed">
            Tu es sur le point de commencer un examen blanc en mode{" "}
            <strong className="text-fg">bloqué</strong>. Les questions sont tirées au hasard
            de tous les chapitres de ton niveau.
          </p>
          <ul className="text-sm text-fg-soft space-y-2 mb-6 list-disc ms-5">
            <li>Durée : <strong className="text-fg">{durationMinutes} minutes</strong></li>
            <li>{questionCount} questions à choix multiples</li>
            <li>Tu ne pourras pas quitter l&apos;examen avant la fin</li>
            <li>Auto-soumission à la fin du temps</li>
            <li>Correction détaillée à la fin</li>
          </ul>
          {loadError && (
            <p className="text-sm text-red-500 mb-4" role="alert">{loadError}</p>
          )}
          <div className="flex gap-3">
            <button onClick={() => router.push("/eleve/bac")} className="btn btn-outline flex-1">
              Annuler
            </button>
            <button
              onClick={() => {
                if (confirm("Es-tu sûr ? Le minuteur démarre maintenant et tu ne peux plus quitter.")) {
                  void start();
                }
              }}
              disabled={stage === "loading"}
              className="btn btn-primary flex-1 disabled:opacity-60"
            >
              {stage === "loading" ? "Chargement…" : "Je suis prêt"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === "done") {
    const answered = Object.keys(answers).length;
    const correct = questions.reduce(
      (acc, q, i) => acc + (answers[i] === q.correctIndex ? 1 : 0),
      0,
    );
    const pct = Math.round((correct / total) * 100);
    const note20 = Math.round((correct / total) * 20 * 10) / 10;
    const spentMin = startedAt.current
      ? Math.max(1, Math.round((Date.now() - startedAt.current) / 60000))
      : durationMinutes;

    return (
      <div className="min-h-screen bg-surface-2 py-10 px-5">
        <div className="max-w-2xl mx-auto">
          {/* Score card */}
          <div className="bg-surface rounded-modal p-8 text-center border border-line mb-6">
            <h1 className="text-2xl font-bold text-fg mb-1">Examen terminé</h1>
            <p className="text-fg-soft text-sm mb-6">
              {answered}/{total} répondues · {spentMin} min
            </p>
            <div className={`text-6xl font-bold mb-1 ${pct >= 50 ? "text-emerald-600" : "text-red-500"}`}>
              <bdi>{note20}</bdi><span className="text-2xl text-fg-soft"> / 20</span>
            </div>
            <p className="text-sm text-fg-soft mb-2">{correct} bonnes réponses sur {total}</p>
            <p className={`text-sm font-semibold ${pct >= 50 ? "text-emerald-600" : "text-red-500"}`}>
              {pct >= 80 ? "Excellent — niveau examen !" : pct >= 50 ? "Admis — continue comme ça" : "En dessous de la moyenne — révise les chapitres en rouge"}
            </p>
          </div>

          {/* Corrections */}
          <h2 className="text-lg font-bold text-fg mb-3">Correction détaillée</h2>
          <div className="space-y-3 mb-8">
            {questions.map((q, i) => {
              const mine = answers[i];
              const good = mine === q.correctIndex;
              return (
                <div
                  key={q.id}
                  className={`bg-surface border rounded-card p-5 ${good ? "border-emerald-300 dark:border-emerald-800" : "border-red-300 dark:border-red-900"}`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-xs font-bold text-fg-faint">Q{i + 1} · {q.chapter}</span>
                    <span className={`text-xs font-bold ${good ? "text-emerald-600" : "text-red-500"}`}>
                      {good ? "✓ Juste" : mine === undefined ? "Sans réponse" : "✗ Faux"}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-fg mb-2">{q.prompt}</p>
                  <p className="text-sm text-emerald-700 dark:text-emerald-400 mb-1">
                    Bonne réponse : {q.options[q.correctIndex]}
                  </p>
                  {!good && mine !== undefined && (
                    <p className="text-sm text-red-500 mb-1">Ta réponse : {q.options[mine]}</p>
                  )}
                  {q.explanation && (
                    <p className="text-xs text-fg-soft mt-2 leading-relaxed">{q.explanation}</p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <button onClick={() => router.push("/eleve/bac")} className="btn btn-outline flex-1">
              Retour aux examens
            </button>
            <button onClick={() => window.location.reload()} className="btn btn-primary flex-1">
              Refaire un examen
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Running
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const isLowTime = secondsLeft < 5 * 60;
  const q = questions[current];

  return (
    <div className="fixed inset-0 bg-surface z-[100] flex flex-col">
      <header className="h-14 border-b border-line flex items-center justify-between px-5 bg-surface-2">
        <div className="text-sm text-fg-soft truncate">{examTitle}</div>
        <div className={`text-base font-bold tabular-nums ${isLowTime ? "text-red-500 animate-pulse" : "text-fg"}`}>
          {minutes}:{seconds.toString().padStart(2, "0")}
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-5 py-8 overflow-y-auto pb-32">
        <div className="text-xs uppercase tracking-wider text-gold font-bold mb-1">
          Question {current + 1} / {total}
        </div>
        {q.chapter && <div className="text-xs text-fg-faint mb-3">{q.chapter}</div>}
        <div className="text-xl font-semibold text-fg mb-6 leading-snug">{q.prompt}</div>

        <div className="space-y-3">
          {q.options.map((opt, oi) => {
            const selected = answers[current] === oi;
            return (
              <button
                key={oi}
                onClick={() => setAnswers((a) => ({ ...a, [current]: oi }))}
                className={`w-full text-start p-4 rounded-card border-2 transition-all text-base ${
                  selected
                    ? "border-navy dark:border-gold bg-navy/5 dark:bg-gold/10 font-semibold text-fg"
                    : "border-line bg-surface-2 text-fg hover:border-fg/40"
                }`}
              >
                <span className={`inline-flex w-6 h-6 rounded-full border-2 me-3 text-xs items-center justify-center font-bold ${
                  selected ? "border-navy dark:border-gold bg-navy dark:bg-gold text-white dark:text-navy" : "border-line-strong text-fg-soft"
                }`}>
                  {String.fromCharCode(65 + oi)}
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex justify-between text-xs text-fg-soft">
          <span>{Object.keys(answers).length} / {total} questions répondues</span>
          <span className={isLowTime ? "text-red-500 font-bold" : ""}>
            {isLowTime ? "Temps presque écoulé !" : "Reste concentré"}
          </span>
        </div>
      </main>

      <footer className="border-t border-line bg-surface-2 p-4 flex items-center justify-between gap-3">
        <button
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          className="btn btn-outline disabled:opacity-40"
        >
          ← Précédente
        </button>
        <div className="flex gap-1 items-center text-xs text-fg-faint flex-wrap justify-center">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-6 h-6 rounded-full text-[10px] font-bold ${
                i === current ? "bg-navy text-white" : answers[i] !== undefined ? "bg-gold text-navy" : "bg-surface-3 text-fg-soft"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        {current === total - 1 ? (
          <button
            onClick={() => {
              if (confirm("Soumettre l'examen maintenant ?")) setStage("done");
            }}
            className="btn btn-primary"
          >
            Soumettre
          </button>
        ) : (
          <button onClick={() => setCurrent((c) => Math.min(total - 1, c + 1))} className="btn btn-primary">
            Suivante →
          </button>
        )}
      </footer>
    </div>
  );
}
