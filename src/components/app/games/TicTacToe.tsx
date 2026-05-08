"use client";

import { useEffect, useState } from "react";
import { useGameBack } from "./useGameBack";
import { useLocale, useTranslations } from "next-intl";
import confetti from "canvas-confetti";

/**
 * Tic-tac-toe vs the computer.
 *
 * Player is the fox 🦊 ("X" internally), computer is the turtle 🐢 ("O").
 * The computer uses minimax over the small 3x3 game tree, which is optimal —
 * a perfect player can never lose tic-tac-toe. To keep things winnable for
 * kids we add a 25% chance to play a random legal move instead of the optimal
 * one. Score across multiple games is kept in component state.
 */

type Mark = "X" | "O" | null;
type Board = Mark[];

const LINES: number[][] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6],            // diagonals
];

function winnerOf(board: Board): { mark: Mark; line: number[] | null } {
  for (const line of LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { mark: board[a], line };
    }
  }
  return { mark: null, line: null };
}

function isFull(board: Board) {
  return board.every((c) => c !== null);
}

// Minimax: returns { score, move } for the player to move ("O" maximizes
// computer wins, "X" minimizes them).
function minimax(board: Board, turn: "X" | "O"): { score: number; move: number } {
  const w = winnerOf(board).mark;
  if (w === "O") return { score: 10, move: -1 };
  if (w === "X") return { score: -10, move: -1 };
  if (isFull(board)) return { score: 0, move: -1 };

  const candidates: { score: number; move: number }[] = [];
  for (let i = 0; i < 9; i++) {
    if (board[i] !== null) continue;
    const next = board.slice();
    next[i] = turn;
    const sub = minimax(next, turn === "O" ? "X" : "O");
    candidates.push({ score: sub.score, move: i });
  }
  if (turn === "O") {
    candidates.sort((a, b) => b.score - a.score);
  } else {
    candidates.sort((a, b) => a.score - b.score);
  }
  return candidates[0];
}

function pickComputerMove(board: Board): number {
  const empties = board.flatMap((c, i) => (c === null ? [i] : []));
  if (empties.length === 0) return -1;
  // 25% random for fun
  if (Math.random() < 0.25) {
    return empties[Math.floor(Math.random() * empties.length)];
  }
  return minimax(board, "O").move;
}

export function TicTacToe() {
  const goBack = useGameBack();
  const t = useTranslations("PetitsGameTicTacToe");
  const locale = useLocale();
  const isAR = locale === "ar";

  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [turn, setTurn] = useState<"X" | "O">("X");
  const [score, setScore] = useState({ player: 0, computer: 0, draws: 0 });

  const { mark: winnerMark, line: winLine } = winnerOf(board);
  const draw = !winnerMark && isFull(board);
  const finished = !!winnerMark || draw;

  // Computer move
  useEffect(() => {
    if (finished) return;
    if (turn !== "O") return;
    const id = setTimeout(() => {
      const move = pickComputerMove(board);
      if (move < 0) return;
      const next = board.slice();
      next[move] = "O";
      setBoard(next);
      setTurn("X");
    }, 500);
    return () => clearTimeout(id);
  }, [turn, board, finished]);

  // Score on finish
  useEffect(() => {
    if (!finished) return;
    if (winnerMark === "X") {
      setScore((s) => ({ ...s, player: s.player + 1 }));
      confetti({ particleCount: 80, spread: 90, colors: ["#D4A72C", "#0F1B33"] });
    } else if (winnerMark === "O") {
      setScore((s) => ({ ...s, computer: s.computer + 1 }));
    } else if (draw) {
      setScore((s) => ({ ...s, draws: s.draws + 1 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  const onCell = (i: number) => {
    if (finished) return;
    if (turn !== "X") return;
    if (board[i] !== null) return;
    const next = board.slice();
    next[i] = "X";
    setBoard(next);
    setTurn("O");
  };

  const onRestart = () => {
    setBoard(Array(9).fill(null));
    setTurn("X");
  };

  const onResetScore = () => {
    setScore({ player: 0, computer: 0, draws: 0 });
    onRestart();
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col" dir={isAR ? "rtl" : "ltr"}>
      <header className="px-5 py-4 flex items-center justify-between bg-white border-b border-pale-blue">
        <button
          onClick={goBack}
          className="w-10 h-10 rounded-full hover:bg-pale-blue/40 flex items-center justify-center text-navy"
          aria-label={t("back")}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points={isAR ? "9 18 15 12 9 6" : "15 18 9 12 15 6"} />
          </svg>
        </button>
        <h1 className="font-bold text-navy">{t("page_title")}</h1>
        <div className="w-10" />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-5 gap-5">
        <div className="flex gap-3 items-center text-sm">
          <span className="bg-amber-100 text-amber-900 rounded-full px-3 py-1 font-bold">
            🦊 {t("you")}: {score.player}
          </span>
          <span className="bg-emerald-100 text-emerald-900 rounded-full px-3 py-1 font-bold">
            🐢 {t("computer")}: {score.computer}
          </span>
          <span className="bg-pale-blue/40 text-navy rounded-full px-3 py-1 font-bold">
            = {score.draws}
          </span>
        </div>

        <div className="bg-white rounded-3xl p-3 border-4 border-navy shadow-card">
          <div className="grid grid-cols-3 gap-2">
            {board.map((cell, i) => {
              const inWin = winLine?.includes(i) ?? false;
              return (
                <button
                  key={i}
                  onClick={() => onCell(i)}
                  disabled={finished || turn !== "X" || cell !== null}
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl text-4xl sm:text-5xl flex items-center justify-center transition-all ${
                    inWin
                      ? "bg-gold/40 ring-4 ring-gold"
                      : "bg-pale-blue/30 hover:bg-pale-blue/60 active:scale-95"
                  } disabled:opacity-90`}
                >
                  {cell === "X" ? "🦊" : cell === "O" ? "🐢" : ""}
                </button>
              );
            })}
          </div>
        </div>

        <div className="text-center min-h-[60px]">
          {finished ? (
            <>
              <div className="font-bold text-navy text-lg mb-2">
                {winnerMark === "X" ? t("you_win") : winnerMark === "O" ? t("you_lose") : t("draw")}
              </div>
              <button
                onClick={onRestart}
                className="bg-navy text-white px-6 py-3 rounded-2xl font-bold active:scale-95"
              >
                {t("play_again")}
              </button>
            </>
          ) : (
            <div className="text-fg-soft text-sm">
              {turn === "X" ? t("your_turn") : t("computer_turn")}
            </div>
          )}
        </div>

        <button
          onClick={onResetScore}
          className="text-xs text-fg-soft underline hover:text-navy"
        >
          {t("reset_score")}
        </button>
      </main>
    </div>
  );
}
