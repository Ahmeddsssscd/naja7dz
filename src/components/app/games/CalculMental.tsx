"use client";

/**
 * Calcul mental — 60-second timed mental arithmetic.
 *
 * 3 difficulty levels (Facile, Moyen, Difficile). Pick one, the timer starts,
 * answer as many problems as possible in 60 seconds. Best score per difficulty
 * is persisted in localStorage. MascotCelebration triggers when score >= 25.
 *
 * Pure client-side, no backend.
 */

import { useEffect, useRef, useState } from "react";
import { useGameBack } from "./useGameBack";
import { MascotCelebration } from "@/components/app/MascotCelebration";

type Phase = "pick" | "play" | "done";
type Difficulty = "facile" | "moyen" | "difficile";

interface Problem {
  text: string;
  answer: number;
}

const STORAGE_KEY = "najah:calcul-mental:best";
const DURATION = 60; // seconds

const DIFFICULTY_META: Record<Difficulty, { label: string; sub: string; emoji: string }> = {
  facile:    { label: "Facile",    sub: "+ et − jusqu'à 20",        emoji: "🌱" },
  moyen:     { label: "Moyen",     sub: "+ − et × jusqu'à 12",      emoji: "⚡" },
  difficile: { label: "Difficile", sub: "+ − × ÷ jusqu'à 50",       emoji: "🔥" },
};

interface BestRecord {
  [key: string]: { score: number; accuracy: number };
}

function loadBest(): BestRecord {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") as BestRecord;
  } catch { return {}; }
}

function saveBest(b: BestRecord) {
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(b)); } catch { /* ignore */ }
}

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeProblem(diff: Difficulty): Problem {
  if (diff === "facile") {
    const op = Math.random() < 0.5 ? "+" : "−";
    const a = rand(2, 20);
    const b = rand(1, op === "+" ? 20 - a : a - 1);
    return op === "+"
      ? { text: `${a} + ${b}`, answer: a + b }
      : { text: `${a} − ${b}`, answer: a - b };
  }
  if (diff === "moyen") {
    const ops = ["+", "−", "×"] as const;
    const op = ops[rand(0, 2)];
    if (op === "×") {
      const a = rand(2, 12);
      const b = rand(2, 12);
      return { text: `${a} × ${b}`, answer: a * b };
    }
    if (op === "+") {
      const a = rand(2, 30);
      const b = rand(2, 30);
      return { text: `${a} + ${b}`, answer: a + b };
    }
    const a = rand(5, 30);
    const b = rand(1, a - 1);
    return { text: `${a} − ${b}`, answer: a - b };
  }
  // difficile
  const ops = ["+", "−", "×", "÷"] as const;
  const op = ops[rand(0, 3)];
  if (op === "÷") {
    // Build divisible pair
    const b = rand(2, 12);
    const q = rand(2, 12);
    const a = b * q;
    return { text: `${a} ÷ ${b}`, answer: q };
  }
  if (op === "×") {
    const a = rand(2, 15);
    const b = rand(2, 12);
    return { text: `${a} × ${b}`, answer: a * b };
  }
  if (op === "+") {
    const a = rand(10, 50);
    const b = rand(10, 50);
    return { text: `${a} + ${b}`, answer: a + b };
  }
  const a = rand(20, 50);
  const b = rand(2, a - 1);
  return { text: `${a} − ${b}`, answer: a - b };
}

export function CalculMental() {
  const goBack = useGameBack();
  const [phase, setPhase] = useState<Phase>("pick");
  const [difficulty, setDifficulty] = useState<Difficulty>("facile");
  const [problem, setProblem] = useState<Problem | null>(null);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [bests, setBests] = useState<BestRecord>({});
  const [feedback, setFeedback] = useState<"good" | "bad" | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => { setBests(loadBest()); }, []);

  // Timer tick
  useEffect(() => {
    if (phase !== "play") return;
    tickRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (tickRef.current) clearInterval(tickRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, [phase]);

  // End the game when timer hits 0
  useEffect(() => {
    if (phase === "play" && timeLeft === 0) {
      const accuracy = attempts === 0 ? 0 : Math.round((score / attempts) * 100);
      const prev = bests[difficulty];
      if (!prev || score > prev.score) {
        const next = { ...bests, [difficulty]: { score, accuracy } };
        setBests(next);
        saveBest(next);
      }
      setPhase("done");
    }
  }, [phase, timeLeft, attempts, score, difficulty, bests]);

  const startGame = (diff: Difficulty) => {
    setDifficulty(diff);
    setScore(0);
    setAttempts(0);
    setTimeLeft(DURATION);
    setInput("");
    setFeedback(null);
    setProblem(makeProblem(diff));
    setPhase("play");
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phase !== "play" || !problem) return;
    const val = Number(input.trim());
    if (!Number.isFinite(val)) return;
    const correct = val === problem.answer;
    setAttempts((a) => a + 1);
    if (correct) {
      setScore((s) => s + 1);
      setFeedback("good");
    } else {
      setFeedback("bad");
    }
    setTimeout(() => {
      setFeedback(null);
      setInput("");
      setProblem(makeProblem(difficulty));
    }, correct ? 250 : 600);
  };

  if (phase === "pick") {
    return (
      <div className="min-h-screen bg-cream dark:bg-surface-2 flex flex-col">
        <header className="px-5 py-4 flex items-center justify-between bg-surface border-b border-line">
          <button onClick={goBack} className="w-10 h-10 rounded-full bg-surface border border-pale-blue flex items-center justify-center text-navy" aria-label="Retour">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <h1 className="text-base font-bold text-navy">Calcul mental</h1>
          <div className="w-10" />
        </header>
        <main className="flex-1 px-5 py-6 max-w-md md:max-w-2xl lg:max-w-3xl mx-auto w-full">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">🧮</div>
            <p className="text-fg-soft text-sm">
              60 secondes pour résoudre un maximum de calculs.
              Choisis ta difficulté !
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {(Object.keys(DIFFICULTY_META) as Difficulty[]).map((d) => {
              const meta = DIFFICULTY_META[d];
              const best = bests[d];
              return (
                <button
                  key={d}
                  onClick={() => startGame(d)}
                  className="bg-surface border-2 border-pale-blue rounded-2xl p-5 flex items-center gap-4 hover:border-gold hover:scale-[1.02] active:scale-95 transition-all text-left"
                >
                  <span className="text-4xl">{meta.emoji}</span>
                  <div className="flex-1">
                    <div className="text-lg font-bold text-navy">{meta.label}</div>
                    <div className="text-xs text-fg-soft">{meta.sub}</div>
                  </div>
                  {best && (
                    <div className="text-right">
                      <div className="text-xs text-fg-soft">Record</div>
                      <div className="text-lg font-bold text-gold">{best.score}</div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </main>
      </div>
    );
  }

  if (phase === "done") {
    const accuracy = attempts === 0 ? 0 : Math.round((score / attempts) * 100);
    return (
      <div className="min-h-screen bg-cream dark:bg-surface-2 flex items-center justify-center px-5">
        <MascotCelebration trigger={score >= 25} locale="fr" />
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">{score >= 25 ? "🏆" : score >= 15 ? "🌟" : score >= 8 ? "✨" : "📝"}</div>
          <h1 className="text-3xl font-bold text-navy mb-2">Temps écoulé !</h1>
          <div className="text-5xl font-bold text-gold mb-1">{score}</div>
          <div className="text-base text-fg-soft mb-1">bonne{score > 1 ? "s" : ""} réponse{score > 1 ? "s" : ""}</div>
          <div className="text-sm text-fg-soft mb-6">
            {attempts} essai{attempts > 1 ? "s" : ""} · {accuracy}% de précision
          </div>
          <div className="flex gap-3">
            <button onClick={() => setPhase("pick")} className="btn btn-outline flex-1">Difficulté</button>
            <button onClick={() => startGame(difficulty)} className="btn btn-primary flex-1">Rejouer</button>
          </div>
        </div>
      </div>
    );
  }

  // play
  const pct = (timeLeft / DURATION) * 100;
  const accuracy = attempts === 0 ? 0 : Math.round((score / attempts) * 100);
  return (
    <div className="min-h-screen bg-cream dark:bg-surface-2 flex flex-col">
      <header className="px-5 py-4 flex items-center justify-between bg-surface border-b border-line">
        <button onClick={() => setPhase("pick")} className="w-10 h-10 rounded-full bg-surface border border-pale-blue flex items-center justify-center text-navy" aria-label="Quitter">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div className="text-sm font-bold text-navy">⭐ {score} · {accuracy}%</div>
        <div className={`text-sm font-mono font-bold tabular-nums ${timeLeft <= 10 ? "text-red-600" : "text-navy"}`}>⏱ {timeLeft}s</div>
      </header>

      {/* Timer bar */}
      <div className="h-2 bg-pale-blue overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 linear ${timeLeft <= 10 ? "bg-red-500" : "bg-gold"}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-5 gap-5">
        <div className={`bg-surface border-4 rounded-3xl p-7 text-center shadow-card transition-all ${feedback === "good" ? "border-green-400" : feedback === "bad" ? "border-red-400 animate-shake" : "border-navy"}`}>
          <div className="text-xs uppercase font-semibold text-fg-soft mb-2">Combien font</div>
          <div className="text-5xl md:text-6xl font-bold text-navy">{problem?.text}</div>
          <div className="text-base text-fg-soft mt-2">= ?</div>
        </div>

        <form onSubmit={onSubmit} className="w-full max-w-xs">
          <input
            type="number"
            inputMode="numeric"
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={feedback !== null}
            className="w-full text-center text-3xl font-bold py-4 rounded-xl border-2 border-pale-blue focus:border-gold focus:outline-none bg-white text-navy"
            placeholder="?"
          />
          <button
            type="submit"
            disabled={!input || feedback !== null}
            className="w-full mt-3 btn btn-primary btn-lg disabled:opacity-50"
          >
            Valider
          </button>
        </form>

        {feedback === "good" && <div className="text-green-600 font-bold text-lg">✓ Bravo !</div>}
        {feedback === "bad" && <div className="text-red-600 font-bold text-lg">✗ Réponse : {problem?.answer}</div>}
      </main>
    </div>
  );
}
