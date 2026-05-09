"use client";

/**
 * Tables de multiplication — pick a table (2 → 12), drill through 12 questions
 * in random order, get a star rating (1-3 stars based on accuracy + speed).
 * Best score per table is persisted in localStorage so kids feel progression.
 *
 * Pure client-side, no backend.
 */

import { useEffect, useState } from "react";
import { useGameBack } from "./useGameBack";
import { toast } from "sonner";
import confetti from "canvas-confetti";

type Phase = "pick-table" | "drill" | "done";

const TABLES = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

const STORAGE_KEY = "najah:tables:best";

interface BestRecord {
  [table: number]: { score: number; seconds: number };
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

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function TablesMultiplication() {
  const goBack = useGameBack();
  const [phase, setPhase] = useState<Phase>("pick-table");
  const [table, setTable] = useState<number>(2);
  const [queue, setQueue] = useState<number[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [input, setInput] = useState("");
  const [start, setStart] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [bests, setBests] = useState<BestRecord>({});
  const [feedback, setFeedback] = useState<"good" | "bad" | null>(null);

  useEffect(() => { setBests(loadBest()); }, []);

  // Live elapsed timer during drill
  useEffect(() => {
    if (phase !== "drill") return;
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - start) / 1000)), 200);
    return () => clearInterval(id);
  }, [phase, start]);

  const startDrill = (n: number) => {
    setTable(n);
    // Random order of multipliers 1..12 — 12 questions per table.
    setQueue(shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]));
    setIndex(0);
    setScore(0);
    setInput("");
    setStart(Date.now());
    setElapsed(0);
    setFeedback(null);
    setPhase("drill");
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phase !== "drill") return;
    const expected = table * queue[index];
    const correct = Number(input.trim()) === expected;
    if (correct) {
      setScore((s) => s + 1);
      setFeedback("good");
    } else {
      setFeedback("bad");
    }
    setTimeout(() => {
      setFeedback(null);
      if (index + 1 >= queue.length) {
        // Done — persist best.
        const totalSeconds = Math.floor((Date.now() - start) / 1000);
        const finalScore = score + (correct ? 1 : 0);
        const prev = bests[table];
        const better = !prev || finalScore > prev.score || (finalScore === prev.score && totalSeconds < prev.seconds);
        if (better) {
          const next = { ...bests, [table]: { score: finalScore, seconds: totalSeconds } };
          setBests(next);
          saveBest(next);
        }
        if (finalScore >= 10) {
          confetti({ particleCount: 80, spread: 90, colors: ["#D4A72C", "#0F1B33"] });
        }
        setElapsed(totalSeconds);
        setPhase("done");
      } else {
        setIndex((i) => i + 1);
        setInput("");
      }
    }, correct ? 350 : 800);
  };

  const stars = (s: number) => {
    if (s >= 12) return 3;
    if (s >= 9) return 2;
    if (s >= 6) return 1;
    return 0;
  };

  if (phase === "pick-table") {
    return (
      <div className="min-h-screen bg-cream flex flex-col">
        <header className="px-5 py-4 flex items-center justify-between bg-white border-b border-pale-blue">
          <button onClick={goBack} className="w-10 h-10 rounded-full bg-white border border-pale-blue flex items-center justify-center text-navy" aria-label="Retour">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <h1 className="text-base font-bold text-navy">Tables de multiplication</h1>
          <div className="w-10" />
        </header>
        <main className="flex-1 px-5 py-6 max-w-md mx-auto w-full">
          <p className="text-fg-soft text-sm text-center mb-6">
            Choisis une table à pratiquer. Tu as 12 questions par table.
          </p>
          <div className="grid grid-cols-3 gap-3">
            {TABLES.map((n) => {
              const best = bests[n];
              const s = best ? stars(best.score) : 0;
              return (
                <button
                  key={n}
                  onClick={() => startDrill(n)}
                  className="bg-white border-2 border-pale-blue rounded-2xl p-4 hover:border-gold hover:scale-[1.03] active:scale-95 transition-all"
                >
                  <div className="text-3xl font-bold text-navy mb-1">×{n}</div>
                  <div className="text-xs text-fg-soft mb-2">12 questions</div>
                  <div className="text-sm" aria-label={`${s} étoiles`}>
                    {"★".repeat(s)}<span className="text-line">{"☆".repeat(3 - s)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </main>
      </div>
    );
  }

  if (phase === "done") {
    const s = stars(score);
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-5">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">{s === 3 ? "🏆" : s === 2 ? "🌟" : s === 1 ? "✨" : "📝"}</div>
          <h1 className="text-3xl font-bold text-navy mb-2">Table de ×{table}</h1>
          <div className="text-5xl font-bold text-gold mb-2">{score}<span className="text-2xl text-fg-soft"> / 12</span></div>
          <div className="text-2xl mb-4">{"★".repeat(s)}<span className="text-line">{"☆".repeat(3 - s)}</span></div>
          <p className="text-fg-soft text-sm mb-6">
            En {elapsed}s · {Math.round((elapsed / 12) * 10) / 10}s par question
          </p>
          <div className="flex gap-3">
            <button onClick={() => setPhase("pick-table")} className="btn btn-outline flex-1">Autre table</button>
            <button onClick={() => startDrill(table)} className="btn btn-primary flex-1">Rejouer</button>
          </div>
        </div>
      </div>
    );
  }

  // Drill phase
  const multiplier = queue[index];
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="px-5 py-4 flex items-center justify-between bg-white border-b border-pale-blue">
        <button onClick={() => setPhase("pick-table")} className="w-10 h-10 rounded-full bg-white border border-pale-blue flex items-center justify-center text-navy" aria-label="Quitter">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div className="text-sm font-bold text-navy">×{table}  ·  {index + 1}/12  ·  ⭐ {score}</div>
        <div className="text-xs font-mono text-fg-soft tabular-nums">⏱ {elapsed}s</div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-5 gap-5">
        <div className={`bg-white border-4 rounded-3xl p-7 text-center shadow-card transition-all ${feedback === "good" ? "border-green-400" : feedback === "bad" ? "border-red-400 animate-shake" : "border-navy"}`}>
          <div className="text-xs uppercase font-semibold text-fg-soft mb-2">Combien font</div>
          <div className="text-5xl md:text-6xl font-bold text-navy">{table} × {multiplier}</div>
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
        {feedback === "bad" && <div className="text-red-600 font-bold text-lg">✗ La réponse était {table * multiplier}</div>}
      </main>
    </div>
  );
}
