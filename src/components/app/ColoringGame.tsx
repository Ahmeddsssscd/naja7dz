"use client";

/**
 * Color-by-numbers game.
 *
 * Grid of cells, each labeled with a math expression (1+2, 2×3, etc.) whose
 * answer is between 1-9. The kid taps a cell, then taps a numbered color in
 * the palette. If the color matches the answer to the cell's math, it fills.
 *
 * "Hidden math" — the kid thinks they're coloring, but they're solving sums.
 */

import { useState } from "react";
import { useRouter } from "@/i18n/routing";

const COLORS: Record<number, string> = {
  1: "#EF4444", // red
  2: "#F97316", // orange
  3: "#EAB308", // yellow
  4: "#22C55E", // green
  5: "#3B82F6", // blue
  6: "#8B5CF6", // purple
  7: "#EC4899", // pink
  8: "#0F1B33", // navy
  9: "#A16207", // brown
};

const PALETTE: { label: string; answer: number }[] = [
  { label: "1", answer: 1 },
  { label: "1+1", answer: 2 },
  { label: "2+1", answer: 3 },
  { label: "2+2", answer: 4 },
  { label: "3+2", answer: 5 },
  { label: "3+3", answer: 6 },
  { label: "4+3", answer: 7 },
  { label: "4+4", answer: 8 },
  { label: "5+4", answer: 9 },
];

// 8x6 grid representing a stylized fennec face — each cell is the "expected answer"
// (which color it should end up being).
const PATTERN: number[][] = [
  [0, 0, 5, 5, 5, 5, 0, 0],
  [0, 5, 5, 3, 3, 5, 5, 0],
  [5, 5, 3, 3, 3, 3, 5, 5],
  [5, 3, 3, 8, 3, 8, 3, 5],
  [5, 3, 3, 3, 1, 3, 3, 5],
  [0, 5, 3, 3, 3, 3, 5, 0],
];

export function ColoringGame() {
  const router = useRouter();
  // Each cell stores the user's currently filled color (0 = empty)
  const [filled, setFilled] = useState<number[][]>(() =>
    PATTERN.map((row) => row.map(() => 0)),
  );
  const [pickedAnswer, setPickedAnswer] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);

  const onCellTap = (r: number, c: number) => {
    if (PATTERN[r][c] === 0 || pickedAnswer === null) return;
    setFilled((prev) => {
      const next = prev.map((row) => [...row]);
      // Only fill if the picked answer matches the expected pattern value
      if (PATTERN[r][c] === pickedAnswer) {
        next[r][c] = pickedAnswer;
      }
      // Check completion
      const done = PATTERN.every((row, i) =>
        row.every((expected, j) => expected === 0 || next[i][j] === expected),
      );
      if (done) setCompleted(true);
      return next;
    });
  };

  const totalToFill = PATTERN.flat().filter((v) => v !== 0).length;
  const filledCount = filled.flat().filter((v) => v !== 0).length;
  const pct = Math.round((filledCount / totalToFill) * 100);

  if (completed) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-5">
        <div className="text-center">
          <div className="text-7xl mb-4">✨🦊✨</div>
          <h1 className="text-3xl font-bold text-navy mb-2">Bravo !</h1>
          <p className="text-fg-soft mb-6">Tu as terminé le coloriage du fennec.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => router.push("/petits")} className="btn btn-outline">
              Retour
            </button>
            <button
              onClick={() => {
                setFilled(PATTERN.map((r) => r.map(() => 0)));
                setCompleted(false);
                setPickedAnswer(null);
              }}
              className="btn btn-primary"
            >
              Recommencer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Top bar */}
      <header className="px-5 py-4 flex items-center justify-between">
        <button onClick={() => router.push("/petits")} aria-label="Retour" className="w-10 h-10 rounded-full bg-white border border-pale-blue flex items-center justify-center text-navy">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div className="text-sm font-bold text-navy">Coloriage du Fennec</div>
        <div className="w-10 text-center text-sm font-semibold text-navy">{pct}%</div>
      </header>

      {/* Canvas */}
      <main className="flex-1 flex flex-col items-center justify-center px-5 py-4">
        <div className="bg-white rounded-3xl p-3 shadow-card border border-pale-blue mb-6">
          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${PATTERN[0].length}, 1fr)` }}
          >
            {PATTERN.map((row, r) =>
              row.map((expected, c) => {
                const isOutline = expected === 0;
                const fillNum = filled[r][c];
                const bg = isOutline ? "transparent" : fillNum ? COLORS[fillNum] : "#F4F4F5";
                return (
                  <button
                    key={`${r}-${c}`}
                    onClick={() => onCellTap(r, c)}
                    disabled={isOutline}
                    className={`w-9 h-9 sm:w-12 sm:h-12 rounded-md border ${isOutline ? "border-transparent" : "border-pale-blue"} flex items-center justify-center text-[10px] font-bold transition-colors`}
                    style={{ background: bg, color: fillNum ? "#fff" : "#0F1B33" }}
                  >
                    {!isOutline && !fillNum ? expected : ""}
                  </button>
                );
              }),
            )}
          </div>
        </div>

        <p className="text-sm text-fg-soft text-center mb-3">
          Tape un calcul ci-dessous, puis tape une case avec le même chiffre !
        </p>
      </main>

      {/* Palette */}
      <footer className="bg-white border-t border-pale-blue p-3">
        <div className="grid grid-cols-9 gap-2 max-w-md mx-auto">
          {PALETTE.map((p) => {
            const isPicked = pickedAnswer === p.answer;
            return (
              <button
                key={p.answer}
                onClick={() => setPickedAnswer(p.answer)}
                className={`aspect-square rounded-xl flex items-center justify-center text-[11px] font-bold border-2 transition-all ${
                  isPicked ? "border-navy scale-105 shadow-card" : "border-transparent"
                }`}
                style={{ background: COLORS[p.answer], color: "#fff" }}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </footer>
    </div>
  );
}
