"use client";

import { useState, useEffect } from "react";
import { useGameBack } from "./useGameBack";
import confetti from "canvas-confetti";

/**
 * 4x4 sudoku for kids. Each row, column, and 2x2 box must contain 1-4.
 * Pre-built easy puzzles; one is chosen at random.
 */

type Cell = number | null;
type Board = Cell[][];

// We use a simpler approach: any valid 4x4 sudoku fill is accepted.
// Validate each cell against rules (row/col/2x2 box) instead of comparing to
// a single fixed solution — kids learn by exploration.
const SIMPLE_PUZZLES: Board[] = [
  [
    [1, null, null, 4],
    [null, null, 1, null],
    [null, 1, null, null],
    [4, null, null, 3],
  ],
  [
    [null, 2, 3, null],
    [4, null, null, 2],
    [3, null, null, 4],
    [null, 4, 1, null],
  ],
  [
    [1, null, 3, null],
    [null, 4, null, 2],
    [3, null, 4, null],
    [null, 2, null, 1],
  ],
];

function isValidPlacement(board: Board, row: number, col: number, val: number): boolean {
  // Row check
  for (let c = 0; c < 4; c++) if (c !== col && board[row][c] === val) return false;
  // Col check
  for (let r = 0; r < 4; r++) if (r !== row && board[r][col] === val) return false;
  // 2x2 box check
  const br = Math.floor(row / 2) * 2;
  const bc = Math.floor(col / 2) * 2;
  for (let r = br; r < br + 2; r++) {
    for (let c = bc; c < bc + 2; c++) {
      if ((r !== row || c !== col) && board[r][c] === val) return false;
    }
  }
  return true;
}

function isComplete(board: Board): boolean {
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) if (board[r][c] === null) return false;
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const v = board[r][c]!;
      // Temporarily remove and check
      board[r][c] = null;
      if (!isValidPlacement(board, r, c, v)) {
        board[r][c] = v;
        return false;
      }
      board[r][c] = v;
    }
  }
  return true;
}

export function KidSudoku() {
  const goBack = useGameBack("/petits");
  const [original] = useState<Board>(() => SIMPLE_PUZZLES[Math.floor(Math.random() * SIMPLE_PUZZLES.length)].map((r) => [...r]));
  const [board, setBoard] = useState<Board>(() => original.map((r) => [...r]));
  const [selected, setSelected] = useState<{ r: number; c: number } | null>(null);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isComplete(board.map((r) => [...r]))) {
      setDone(true);
      confetti({ particleCount: 100, spread: 90, colors: ["#D4A72C", "#0F1B33"] });
    }
  }, [board]);

  const isFixed = (r: number, c: number) => original[r][c] !== null;

  const onCellTap = (r: number, c: number) => {
    if (isFixed(r, c) || done) return;
    setSelected({ r, c });
  };

  const onNumber = (n: number) => {
    if (!selected || done) return;
    const { r, c } = selected;
    if (isFixed(r, c)) return;
    const newBoard = board.map((row) => [...row]);
    newBoard[r][c] = n;
    setBoard(newBoard);
    // Mark error if invalid
    const key = `${r}-${c}`;
    const newErrors = new Set(errors);
    if (!isValidPlacement(newBoard, r, c, n)) newErrors.add(key);
    else newErrors.delete(key);
    setErrors(newErrors);
  };

  const onErase = () => {
    if (!selected || done) return;
    const { r, c } = selected;
    if (isFixed(r, c)) return;
    const newBoard = board.map((row) => [...row]);
    newBoard[r][c] = null;
    setBoard(newBoard);
    const newErrors = new Set(errors);
    newErrors.delete(`${r}-${c}`);
    setErrors(newErrors);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-5">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">🧩✨</div>
          <h1 className="text-3xl font-bold text-navy mb-2">Excellent !</h1>
          <p className="text-fg-soft mb-6">Tu as résolu le sudoku.</p>
          <div className="flex gap-3">
            <button onClick={goBack} className="btn btn-outline flex-1">Retour</button>
            <button onClick={() => window.location.reload()} className="btn btn-primary flex-1">Nouveau</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="px-5 py-4 flex items-center justify-between">
        <button onClick={goBack} className="w-10 h-10 rounded-full bg-white border border-pale-blue flex items-center justify-center text-navy" aria-label="Retour">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h1 className="font-bold text-navy">Sudoku 4×4</h1>
        <div className="w-10" />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-5 gap-6">
        <div className="bg-white rounded-3xl p-3 border-4 border-navy shadow-card">
          <div className="grid grid-cols-4 gap-1">
            {board.map((row, r) =>
              row.map((cell, c) => {
                const isFixedCell = isFixed(r, c);
                const isSelected = selected?.r === r && selected?.c === c;
                const hasError = errors.has(`${r}-${c}`);
                // Box separator: thicker border on right of col 1, bottom of row 1
                const borderRight = c === 1 ? "border-r-4 border-navy" : "";
                const borderBottom = r === 1 ? "border-b-4 border-navy" : "";
                return (
                  <button
                    key={`${r}-${c}`}
                    onClick={() => onCellTap(r, c)}
                    className={`w-14 h-14 sm:w-16 sm:h-16 text-2xl font-bold rounded-md transition-all ${borderRight} ${borderBottom} ${
                      isFixedCell
                        ? "bg-pale-blue text-navy"
                        : isSelected
                        ? "bg-gold/30 text-navy ring-2 ring-gold"
                        : hasError
                        ? "bg-red-100 text-red-600"
                        : "bg-white text-navy hover:bg-pale-blue/40"
                    }`}
                  >
                    {cell ?? ""}
                  </button>
                );
              }),
            )}
          </div>
        </div>

        <div className="flex gap-3">
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              onClick={() => onNumber(n)}
              className="w-14 h-14 sm:w-16 sm:h-16 bg-navy text-white text-2xl font-bold rounded-2xl active:scale-95 transition-transform"
            >
              {n}
            </button>
          ))}
          <button
            onClick={onErase}
            className="w-14 h-14 sm:w-16 sm:h-16 bg-white border-2 border-pale-blue text-navy rounded-2xl flex items-center justify-center active:scale-95"
            aria-label="Effacer"
          >
            ⌫
          </button>
        </div>
      </main>
    </div>
  );
}
