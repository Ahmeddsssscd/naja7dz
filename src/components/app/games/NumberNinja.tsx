"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import confetti from "canvas-confetti";

/**
 * Number Ninja — math arcade.
 * Display a sum, kid taps the right answer from 4 choices, score points
 * before the timer runs out. Wrong answer costs a heart.
 */

type Q = { sum: string; correct: number; opts: number[] };

function pick(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function genQuestion(level: number): Q {
  const range = Math.min(5 + level * 3, 30);
  const a = pick(1, range);
  const b = pick(1, range);
  const ops = ["+", "-", "×"] as const;
  const op = level >= 3 ? ops[pick(0, 2)] : ops[pick(0, 1)];
  let correct = 0;
  if (op === "+") correct = a + b;
  if (op === "-") correct = Math.abs(a - b);
  if (op === "×") correct = a * b;
  // Always show correct as one of the options + 3 distractors
  const opts = new Set<number>([correct]);
  while (opts.size < 4) opts.add(Math.max(0, correct + pick(-5, 5)));
  return {
    sum: op === "-" ? `${Math.max(a, b)} ${op} ${Math.min(a, b)}` : `${a} ${op} ${b}`,
    correct,
    opts: shuffle(Array.from(opts)),
  };
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function NumberNinja() {
  const router = useRouter();
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [time, setTime] = useState(45);
  const [q, setQ] = useState<Q>(() => genQuestion(1));
  const [feedback, setFeedback] = useState<"none" | "good" | "bad">("none");
  const [running, setRunning] = useState(true);

  const level = Math.floor(score / 5) + 1;

  const next = useCallback(() => {
    setQ(genQuestion(level));
    setFeedback("none");
  }, [level]);

  useEffect(() => {
    if (!running) return;
    if (time <= 0 || hearts <= 0) {
      setRunning(false);
      return;
    }
    const id = setInterval(() => setTime((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [running, time, hearts]);

  // Fire confetti once when the game ends with a winning score, NOT on every
  // re-render of the game-over screen. The previous version called
  // setTimeout(confetti) inside the render body which queued infinite timers.
  useEffect(() => {
    if (!running && score >= 10) {
      const id = setTimeout(
        () => confetti({ particleCount: 80, spread: 100, colors: ["#D4A72C", "#0F1B33"] }),
        100,
      );
      return () => clearTimeout(id);
    }
  }, [running, score]);

  const onPick = (n: number) => {
    if (!running || feedback !== "none") return;
    if (n === q.correct) {
      setScore((s) => s + 1);
      setFeedback("good");
      toast.success("+1", { duration: 600 });
      setTime((t) => Math.min(t + 2, 60));
      setTimeout(next, 350);
    } else {
      setHearts((h) => h - 1);
      setFeedback("bad");
      setTimeout(next, 700);
    }
  };

  const onRestart = () => {
    setScore(0); setHearts(3); setTime(45); setRunning(true); next();
  };

  if (!running) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-5">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">{score >= 10 ? "🥷✨" : "🥷"}</div>
          <h1 className="text-3xl font-bold text-navy mb-2">Partie terminée !</h1>
          <p className="text-fg-soft mb-1">Tu as marqué</p>
          <div className="text-6xl font-bold text-gold mb-2">{score}</div>
          <p className="text-fg-soft mb-8">points en niveau {level}</p>
          <div className="flex gap-3">
            <button onClick={() => router.push("/petits")} className="btn btn-outline flex-1">Retour</button>
            <button onClick={onRestart} className="btn btn-primary flex-1">Rejouer</button>
          </div>
        </div>
      </div>
    );
  }

  const fbCls =
    feedback === "good"
      ? "ring-4 ring-green-400"
      : feedback === "bad"
      ? "ring-4 ring-red-400 animate-shake"
      : "";

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="px-5 py-4 flex items-center justify-between">
        <button onClick={() => router.push("/petits")} className="w-10 h-10 rounded-full bg-white border border-pale-blue flex items-center justify-center text-navy" aria-label="Retour">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div className="flex items-center gap-4 text-sm">
          <span className="font-bold text-red-500">{"❤".repeat(hearts)}{"♡".repeat(3 - hearts)}</span>
          <span className="font-bold text-navy">⭐ {score}</span>
          <span className={`font-bold tabular-nums ${time <= 5 ? "text-red-500 animate-pulse" : "text-navy"}`}>⏱ {time}s</span>
        </div>
        <div className="w-10" />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-5">
        <div className="text-xs uppercase tracking-widest text-gold mb-2 font-bold">Niveau {level}</div>
        <div className={`bg-white border-4 border-navy rounded-3xl px-12 py-10 shadow-card mb-8 text-5xl md:text-7xl font-bold text-navy ${fbCls}`}>
          {q.sum} = ?
        </div>
        <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
          {q.opts.map((n) => (
            <button
              key={n}
              onClick={() => onPick(n)}
              className="aspect-square bg-white border-2 border-pale-blue rounded-2xl text-3xl font-bold text-navy hover:border-gold hover:bg-gold/10 active:scale-95 transition-all"
            >
              {n}
            </button>
          ))}
        </div>
      </main>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-shake { animation: shake 0.3s; }
      `}</style>
    </div>
  );
}
