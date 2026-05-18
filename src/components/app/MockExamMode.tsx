"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";

/**
 * Locked-mode mock exam shell.
 * - Confirmation gate before entering
 * - Once started: full screen, countdown timer, no exit
 * - Auto-submit on timer end
 * - On submit: shows score (mocked for now)
 *
 * Real questions are stubbed; the locked-mode behavior is the deliverable.
 */
export function MockExamMode({
  examTitle,
  durationMinutes = 240,
  questionCount = 10,
}: {
  examTitle: string;
  durationMinutes?: number;
  questionCount?: number;
}) {
  const router = useRouter();
  const [stage, setStage] = useState<"intro" | "running" | "done">("intro");
  const [secondsLeft, setSecondsLeft] = useState(durationMinutes * 60);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [current, setCurrent] = useState(0);
  const beforeUnloadRef = useRef<((e: BeforeUnloadEvent) => void) | null>(null);

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
    beforeUnloadRef.current = handler;
    window.addEventListener("beforeunload", handler);
    return () => {
      window.removeEventListener("beforeunload", handler);
    };
  }, [stage]);

  if (stage === "intro") {
    return (
      <div className="min-h-screen bg-surface-2 flex items-center justify-center px-5">
        <div className="bg-surface border-2 border-amber-500 rounded-modal p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-fg mb-3">Mode examen blanc — bloqué</h1>
          <p className="text-fg-soft mb-5 text-sm leading-relaxed">
            Tu es sur le point de commencer un examen blanc en mode <strong className="text-fg">bloqué</strong>.
          </p>
          <ul className="text-sm text-fg-soft space-y-2 mb-6 list-disc ms-5">
            <li>Durée : <strong className="text-fg">{durationMinutes} minutes</strong></li>
            <li>{questionCount} questions au format officiel</li>
            <li>Tu ne pourras pas quitter l&apos;examen avant la fin</li>
            <li>Le minuteur ne s&apos;arrêtera pas</li>
            <li>Auto-soumission à la fin du temps</li>
          </ul>
          <div className="flex gap-3">
            <button onClick={() => router.push("/eleve/bac")} className="btn btn-outline flex-1">
              Annuler
            </button>
            <button
              onClick={() => {
                if (confirm("Es-tu sûr ? Le minuteur démarre maintenant et tu ne peux plus quitter.")) {
                  setStage("running");
                  toast.info("Examen démarré · bonne chance !", { duration: 3000 });
                }
              }}
              className="btn btn-primary flex-1"
            >
              Je suis prêt
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === "done") {
    const answered = Object.keys(answers).length;
    const pct = Math.round((answered / questionCount) * 100);
    return (
      <div className="min-h-screen bg-surface-2 flex items-center justify-center px-5">
        <div className="bg-surface rounded-modal p-8 max-w-md w-full text-center border border-line">
          <h1 className="text-2xl font-bold text-fg mb-2">Examen terminé</h1>
          <p className="text-fg-soft mb-6">Tu as répondu à {answered} / {questionCount} questions.</p>
          <div className="text-5xl font-bold text-navy dark:text-cream mb-1">{pct}%</div>
          <p className="text-sm text-fg-soft mb-8">de complétion (note IA à venir)</p>
          <button onClick={() => router.push("/eleve/bac")} className="btn btn-primary w-full">
            Retour aux examens
          </button>
        </div>
      </div>
    );
  }

  // Running
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const isLowTime = secondsLeft < 5 * 60;

  return (
    <div className="fixed inset-0 bg-surface z-[100] flex flex-col">
      {/* Top bar — locked, no exit */}
      <header className="h-14 border-b border-line flex items-center justify-between px-5 bg-surface-2">
        <div className="text-sm text-fg-soft truncate">{examTitle}</div>
        <div className={`text-base font-bold tabular-nums ${isLowTime ? "text-red-500 animate-pulse" : "text-fg"}`}>
          {minutes}:{seconds.toString().padStart(2, "0")}
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-5 py-8 overflow-y-auto pb-32">
        <div className="text-xs uppercase tracking-wider text-gold font-bold mb-3">Question {current + 1} / {questionCount}</div>
        <div className="text-xl font-semibold text-fg mb-6 leading-snug">
          [Question {current + 1}] — Le contenu réel des questions sera importé une fois l&apos;archive officielle
          chargée par l&apos;administrateur.
        </div>
        <textarea
          rows={8}
          value={answers[current] ?? ""}
          onChange={(e) => setAnswers((a) => ({ ...a, [current]: e.target.value }))}
          placeholder="Écris ta réponse ici…"
          className="w-full p-5 bg-surface-2 border border-line-strong rounded-card text-fg leading-relaxed text-base resize-none focus:outline-none focus:border-fg"
        />

        <div className="mt-4 flex justify-between text-xs text-fg-soft">
          <span>{Object.keys(answers).length} / {questionCount} questions répondues</span>
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
        <div className="flex gap-1 items-center text-xs text-fg-faint">
          {Array.from({ length: questionCount }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-6 h-6 rounded-full text-[10px] font-bold ${
                i === current ? "bg-navy text-white" : answers[i] ? "bg-gold text-navy" : "bg-surface-3 text-fg-soft"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        {current === questionCount - 1 ? (
          <button
            onClick={() => {
              if (confirm("Soumettre l'examen maintenant ?")) setStage("done");
            }}
            className="btn btn-primary"
          >
            Soumettre
          </button>
        ) : (
          <button onClick={() => setCurrent((c) => Math.min(questionCount - 1, c + 1))} className="btn btn-primary">
            Suivante →
          </button>
        )}
      </footer>
    </div>
  );
}
