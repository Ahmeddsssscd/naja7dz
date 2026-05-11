"use client";

import { useState } from "react";
import { useGameBack } from "./useGameBack";
import { toast } from "sonner";
import confetti from "canvas-confetti";

interface Puzzle {
  sequence: string[];
  correct: string;
  options: string[];
}

const SHAPES = ["🔴", "🟡", "🔵", "🟢", "⭐", "🌙", "❤️", "🔶"];

function shuffleArr<T>(a: T[]) { return [...a].sort(() => Math.random() - 0.5); }

function genPuzzle(level: number): Puzzle {
  // Two patterns: ABAB or ABCABC depending on level
  if (level <= 2) {
    const a = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    let b = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    while (b === a) b = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const seq = [a, b, a, b, a];
    const correct = b;
    const distractors = shuffleArr(SHAPES.filter((s) => s !== correct)).slice(0, 3);
    return { sequence: seq, correct, options: shuffleArr([correct, ...distractors]) };
  }
  // Higher levels: increasing number sequences
  const start = Math.floor(Math.random() * 5);
  const step = Math.floor(Math.random() * 3) + 1;
  const seq = [start, start + step, start + 2 * step, start + 3 * step, start + 4 * step].map(String);
  const correct = String(start + 5 * step);
  const distractors = [String(start + 5 * step + 1), String(start + 5 * step - 1), String(start + 4 * step)];
  return { sequence: seq, correct, options: shuffleArr([correct, ...distractors]) };
}

export function PatternPuzzles() {
  const goBack = useGameBack("/petits");
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [puzzle, setPuzzle] = useState<Puzzle>(() => genPuzzle(1));
  const [picked, setPicked] = useState<string | null>(null);

  const finished = round >= 5 && picked !== null;

  const onPick = (opt: string) => {
    if (picked !== null) return;
    setPicked(opt);
    if (opt === puzzle.correct) {
      setScore((s) => s + 1);
      toast.success("Tu as trouvé !");
    }
    setTimeout(() => {
      if (round >= 5) {
        if (score + (opt === puzzle.correct ? 1 : 0) >= 4) {
          confetti({ particleCount: 80, spread: 90, colors: ["#D4A72C", "#0F1B33"] });
        }
      } else {
        setRound((r) => r + 1);
        setPuzzle(genPuzzle(round + 1));
        setPicked(null);
      }
    }, 1000);
  };

  if (finished) {
    return (
      <div className="min-h-screen bg-cream dark:bg-surface-2 flex items-center justify-center px-5">
        <div className="text-center">
          <div className="text-6xl mb-4">🧩</div>
          <h1 className="text-3xl font-bold text-navy mb-2">Très bien !</h1>
          <p className="text-fg-soft mb-6">Score : <strong className="text-navy">{score} / 5</strong></p>
          <div className="flex gap-3 justify-center">
            <button onClick={goBack} className="btn btn-outline flex-1">Retour</button>
            <button onClick={() => { setScore(0); setRound(1); setPicked(null); setPuzzle(genPuzzle(1)); }} className="btn btn-primary flex-1">Rejouer</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-surface-2 flex flex-col">
      <header className="px-5 py-4 flex items-center justify-between">
        <button onClick={goBack} className="w-10 h-10 rounded-full bg-surface border border-pale-blue flex items-center justify-center text-navy" aria-label="Retour">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div className="text-sm font-bold text-navy">Q {round}/5  ·  ⭐ {score}</div>
        <div className="w-10" />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-5 gap-8">
        <h2 className="text-xl font-bold text-navy text-center">Quel élément vient ensuite ?</h2>

        <div className="bg-surface border-2 border-navy rounded-3xl p-5 flex items-center gap-3 flex-wrap justify-center max-w-md shadow-card">
          {puzzle.sequence.map((s, i) => (
            <div key={i} className="text-4xl bg-pale-blue rounded-2xl w-14 h-14 flex items-center justify-center text-navy font-bold">
              {s}
            </div>
          ))}
          <div className="text-4xl bg-gold/30 border-2 border-dashed border-gold rounded-2xl w-14 h-14 flex items-center justify-center font-bold text-gold">?</div>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
          {puzzle.options.map((o) => {
            const isPickedHere = picked === o;
            const isCorrect = o === puzzle.correct;
            const showCorrect = picked !== null && isCorrect;
            const showWrong = picked !== null && isPickedHere && !isCorrect;
            return (
              <button
                key={o}
                onClick={() => onPick(o)}
                disabled={picked !== null}
                className={`py-5 text-3xl font-bold rounded-2xl border-2 transition-all ${
                  showCorrect ? "bg-green-100 border-green-500 text-green-900" :
                  showWrong ? "bg-red-100 border-red-500 text-red-900" :
                  "bg-surface border-pale-blue text-navy hover:border-gold active:scale-95"
                }`}
              >
                {o}
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
