"use client";

import { useState } from "react";
import { useGameBack } from "./useGameBack";
import { toast } from "sonner";
import confetti from "canvas-confetti";

interface Riddle {
  id: string;
  question_fr: string;
  question_ar: string | null;
  answer: string;
  hint_fr: string | null;
}

export function LogicRiddle({ riddle }: { riddle: Riddle | null }) {
  const goBack = useGameBack("/petits");
  const [guess, setGuess] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [tries, setTries] = useState(0);

  if (!riddle) {
    return (
      <div className="min-h-screen bg-cream dark:bg-surface-2 flex items-center justify-center">
        <p className="text-fg-soft">Pas d&apos;énigme aujourd&apos;hui — applique migration 5.</p>
      </div>
    );
  }

  const onCheck = () => {
    setTries((t) => t + 1);
    if (guess.trim().toLowerCase() === riddle.answer.toLowerCase()) {
      setRevealed(true);
      confetti({ particleCount: 100, spread: 100, colors: ["#D4A72C", "#0F1B33"] });
      toast.success("Tu as trouvé ! 🧠");
    } else {
      toast.error("Essaie encore !");
    }
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-surface-2 flex flex-col">
      <header className="px-5 py-4 flex items-center justify-between">
        <button onClick={goBack} className="w-10 h-10 rounded-full bg-surface border border-pale-blue flex items-center justify-center text-navy" aria-label="Retour">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h1 className="font-bold text-navy">Énigme du jour</h1>
        <div className="w-10" />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-5 max-w-md md:max-w-2xl lg:max-w-3xl mx-auto w-full">
        <div className="text-6xl mb-6">🧩</div>
        <div className="bg-surface border-2 border-navy rounded-3xl p-7 shadow-card mb-5 text-center">
          <p className="text-lg font-medium text-navy leading-relaxed">{riddle.question_fr}</p>
          {riddle.question_ar && (
            <p className="text-sm text-fg-soft mt-3 font-arabic" dir="rtl">{riddle.question_ar}</p>
          )}
        </div>

        {!revealed ? (
          <>
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onCheck()}
              placeholder="Ta réponse…"
              className="w-full px-4 py-3 bg-surface border-2 border-pale-blue rounded-2xl text-navy text-lg text-center focus:outline-none focus:border-gold mb-3"
            />
            <button onClick={onCheck} className="btn btn-primary w-full">Vérifier</button>

            {showHint && riddle.hint_fr ? (
              <div className="mt-4 bg-gold/10 border-l-4 border-gold rounded-card p-4 w-full">
                <div className="text-xs uppercase tracking-wider text-gold font-bold mb-1">Indice</div>
                <p className="text-sm text-navy">{riddle.hint_fr}</p>
              </div>
            ) : tries >= 2 && riddle.hint_fr ? (
              <button onClick={() => setShowHint(true)} className="text-sm text-fg-soft hover:text-gold mt-3">💡 Voir un indice</button>
            ) : null}
          </>
        ) : (
          <div className="bg-green-100 border-2 border-green-500 rounded-card p-5 w-full text-center">
            <div className="text-3xl mb-2">🎉</div>
            <p className="font-semibold text-green-900 mb-1">La réponse était : {riddle.answer}</p>
            <p className="text-xs text-green-800">Tu as trouvé en {tries} essai{tries > 1 ? "s" : ""}.</p>
            <button onClick={goBack} className="btn btn-primary mt-4 w-full">Retour</button>
          </div>
        )}
      </main>
    </div>
  );
}
