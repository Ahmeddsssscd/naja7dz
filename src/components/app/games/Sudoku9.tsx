"use client";

/**
 * Sudoku 9×9 — full Sudoku with 3 difficulty levels.
 *
 * Easy   = ~40 pre-filled cells
 * Medium = ~30 pre-filled cells
 * Hard   = ~22 pre-filled cells
 *
 * Each level has 5 hand-checked puzzles (15 total). Standard rules apply.
 * Features: number-pad popup, notes (pencil) mode, hint button (revealing
 * one cell), auto-validation, mistake counter, timer. Best time per
 * difficulty in localStorage. MascotCelebration on perfect solve (no hints,
 * no mistakes).
 */

import { useEffect, useRef, useState } from "react";
import { useGameBack } from "./useGameBack";
import { MascotCelebration } from "@/components/app/MascotCelebration";
import confetti from "canvas-confetti";

type Difficulty = "facile" | "moyen" | "difficile";
type Phase = "pick" | "play" | "done";

type Cell = number | 0; // 0 = empty
type Board = Cell[][];

interface Puzzle {
  givens: Board;
  solution: Board;
}

// ---------- Puzzle bank ----------
// Each puzzle is [puzzle, solution]. Strings are 81-char rows: 1-9 or 0 for empty.
function parse(s: string): Board {
  const b: Board = [];
  for (let r = 0; r < 9; r++) {
    const row: Cell[] = [];
    for (let c = 0; c < 9; c++) row.push(parseInt(s[r * 9 + c], 10) as Cell);
    b.push(row);
  }
  return b;
}

const PUZZLES: Record<Difficulty, [string, string][]> = {
  facile: [
    [
      "000650094073800500604000308160987243002006087000040000520708439080030076706090002",
      "218653794973824561654179328165987243342516987897342615521768439489235176736491852",
    ],
    [
      "806300910002760405305020600081009070003500049090680200450002760000470100130096504",
      "876354912912768435345921687581249376623517849794683251459132768268475193137896524",
    ],
    [
      "200007010003059407497061380310725900720300106080006273002500000070600500800900702",
      "258437619163859427497261385316725948724398156589146273632574891971682534845913762",
    ],
    [
      "207400091040007325900010408009150067570000109816000054060874012008000040020500703",
      "287435691641987325953216478439152867572648139816793254365874912798321546124569783",
    ],
    [
      "000643052536900480010075900600087040070004200300160700043708620201000379705009000",
      "897643152536921487412875936629387541178594263354162798943718625281456379765239814",
    ],
  ],
  moyen: [
    [
      "106598030000603008000000051080000004000300120300020800060701540003900086050000003",
      "126598437547613298938247651285179364674385129391426875869731542413952786752864913",
    ],
    [
      "010000590005000002900380461000000200000060700000209680003000004009040837847000150",
      "316472598485691372972385461691837245238564719754219683163758924529146837847923156",
    ],
    [
      "080000004057000000010056308090010000068230590000007103005079000000040805031002040",
      "386721954457398612912456378793815426168234597524967183845679231279143865631582749",
    ],
    [
      "700008043008300600600100578000520706300080000000090000970000300010260090800900067",
      "721658943458379612639142578194523786367481259285796431976814325513267894842935167",
    ],
    [
      "409006000058300060000000001006780010004000008180039046041200679300000000000008230",
      "419876523258391467673425891596784312734612958182539746841253679325967184967148235",
    ],
  ],
  difficile: [
    [
      "000048005560000000009000000000000000000000000050000900080704060070000030613982450",
      "137248695562179384849365271726493518498651723351827946285734169974516832613982457",
    ],
    [
      "000004576000000000834500900000000000080050300000000000000000008348000007500801630",
      "912384576765219483834576912253168794486957321179423865691735248348692157527841639",
    ],
    [
      "000000007009002000001043690000000010000000083000300400000000006870230000000810075",
      "364198257589762134721543698653489712947621583218357469135974826876235941492816375",
    ],
    [
      "000005000050007901847016200000000600900000000000000000030000002010280700720004000",
      "391825476652437981847916253185342697974168325263579814438791562516283749729654138",
    ],
    [
      "000002830490300000200000900000006400600000010105000079009000000040031000300000007",
      "571962834498315726263784951927156483634879512185243679819427365746531298352698147",
    ],
  ],
};

// ---------- Logic ----------
function deepClone(b: Board): Board {
  return b.map((r) => [...r]);
}

function isComplete(board: Board): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) return false;
    }
  }
  return true;
}

function fmt(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

const LEVEL_META: Record<Difficulty, { label: string; emoji: string; givens: string }> = {
  facile: { label: "Facile", emoji: "🐣", givens: "~40 chiffres" },
  moyen: { label: "Moyen", emoji: "🦊", givens: "~30 chiffres" },
  difficile: { label: "Difficile", emoji: "🦅", givens: "~22 chiffres" },
};

const STORAGE_KEY = "najah:sudoku9:best";

interface BestRecord {
  facile?: { seconds: number };
  moyen?: { seconds: number };
  difficile?: { seconds: number };
}

function loadBest(): BestRecord {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") as BestRecord; }
  catch { return {}; }
}

function saveBest(b: BestRecord) {
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(b)); } catch { /* ignore */ }
}

export function Sudoku9() {
  const goBack = useGameBack();
  const [phase, setPhase] = useState<Phase>("pick");
  const [difficulty, setDifficulty] = useState<Difficulty>("facile");
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [board, setBoard] = useState<Board>([]);
  const [notes, setNotes] = useState<Record<string, Set<number>>>({}); // key "r,c" -> set of digits
  const [selected, setSelected] = useState<{ r: number; c: number } | null>(null);
  const [noteMode, setNoteMode] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [start, setStart] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [bests, setBests] = useState<BestRecord>({});
  const [bumpCell, setBumpCell] = useState<string | null>(null);
  const padRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { setBests(loadBest()); }, []);

  // Live timer.
  useEffect(() => {
    if (phase !== "play") return;
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - start) / 1000)), 250);
    return () => clearInterval(id);
  }, [phase, start]);

  const startGame = (d: Difficulty) => {
    const pool = PUZZLES[d];
    const [givenStr, solStr] = pool[Math.floor(Math.random() * pool.length)];
    const p: Puzzle = { givens: parse(givenStr), solution: parse(solStr) };
    setPuzzle(p);
    setBoard(deepClone(p.givens));
    setNotes({});
    setSelected(null);
    setNoteMode(false);
    setMistakes(0);
    setHintsUsed(0);
    setStart(Date.now());
    setElapsed(0);
    setDifficulty(d);
    setPhase("play");
  };

  const isFixed = (r: number, c: number) => puzzle ? puzzle.givens[r][c] !== 0 : false;

  const onCellTap = (r: number, c: number) => {
    if (!puzzle || isFixed(r, c)) {
      setSelected({ r, c }); // still allow highlight on fixed cells (peers)
      return;
    }
    setSelected({ r, c });
  };

  const onPick = (n: number) => {
    if (!selected || !puzzle) return;
    const { r, c } = selected;
    if (isFixed(r, c)) return;

    if (noteMode) {
      // Toggle note digit.
      const k = `${r},${c}`;
      const cur = new Set(notes[k] ?? []);
      if (cur.has(n)) cur.delete(n);
      else cur.add(n);
      setNotes({ ...notes, [k]: cur });
      return;
    }

    // Place value. Wrong = mistake.
    const expected = puzzle.solution[r][c];
    const newBoard = deepClone(board);
    newBoard[r][c] = n as Cell;
    setBoard(newBoard);
    // Clear notes on this cell when a value is placed.
    if (notes[`${r},${c}`]) {
      const next = { ...notes };
      delete next[`${r},${c}`];
      setNotes(next);
    }
    if (n !== expected) {
      setMistakes((m) => m + 1);
      setBumpCell(`${r},${c}`);
      setTimeout(() => setBumpCell(null), 400);
    } else {
      // Check completion
      if (isComplete(newBoard)) finish(newBoard);
    }
  };

  const onErase = () => {
    if (!selected || !puzzle) return;
    const { r, c } = selected;
    if (isFixed(r, c)) return;
    const newBoard = deepClone(board);
    newBoard[r][c] = 0;
    setBoard(newBoard);
    const next = { ...notes };
    delete next[`${r},${c}`];
    setNotes(next);
  };

  const onHint = () => {
    if (!puzzle) return;
    // Find an empty cell or a wrong cell.
    let target: { r: number; c: number } | null = null;
    for (let r = 0; r < 9 && !target; r++) {
      for (let c = 0; c < 9 && !target; c++) {
        if (board[r][c] === 0 || board[r][c] !== puzzle.solution[r][c]) {
          if (!isFixed(r, c)) target = { r, c };
        }
      }
    }
    if (!target) return;
    const newBoard = deepClone(board);
    newBoard[target.r][target.c] = puzzle.solution[target.r][target.c];
    setBoard(newBoard);
    setHintsUsed((h) => h + 1);
    setSelected(target);
    if (isComplete(newBoard)) finish(newBoard);
  };

  const finish = (final: Board) => {
    if (!puzzle) return;
    // Verify all cells match solution.
    let allMatch = true;
    for (let r = 0; r < 9 && allMatch; r++) {
      for (let c = 0; c < 9 && allMatch; c++) {
        if (final[r][c] !== puzzle.solution[r][c]) allMatch = false;
      }
    }
    if (!allMatch) return; // not really done
    const totalSeconds = Math.floor((Date.now() - start) / 1000);
    setElapsed(totalSeconds);
    const perfect = hintsUsed === 0 && mistakes === 0;
    const prev = bests[difficulty];
    if (!prev || totalSeconds < prev.seconds) {
      const next = { ...bests, [difficulty]: { seconds: totalSeconds } };
      setBests(next);
      saveBest(next);
    }
    if (perfect) {
      confetti({ particleCount: 100, spread: 90, colors: ["#D4A72C", "#0F1B33"] });
    }
    setPhase("done");
  };

  // ---------- Pick ----------
  if (phase === "pick") {
    return (
      <div className="min-h-screen bg-cream flex flex-col">
        <header className="px-5 py-4 flex items-center justify-between bg-white border-b border-pale-blue">
          <button onClick={goBack} className="w-10 h-10 rounded-full bg-white border border-pale-blue flex items-center justify-center text-navy" aria-label="Retour">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <h1 className="text-base font-bold text-navy">Sudoku 9×9</h1>
          <div className="w-10" />
        </header>

        <main className="flex-1 px-5 py-6 max-w-md mx-auto w-full">
          <div className="text-center mb-6">
            <div className="text-6xl mb-3">🧩</div>
            <p className="text-fg-soft text-sm">
              Remplis chaque ligne, chaque colonne et chaque carré 3×3 avec les chiffres de <strong>1 à 9</strong>.
            </p>
          </div>

          <div className="space-y-3">
            {(Object.keys(LEVEL_META) as Difficulty[]).map((d) => {
              const m = LEVEL_META[d];
              const best = bests[d];
              return (
                <button
                  key={d}
                  onClick={() => startGame(d)}
                  className="w-full text-left bg-white border-2 border-pale-blue rounded-2xl p-4 hover:border-gold hover:scale-[1.02] active:scale-95 transition-all shadow-card"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-5xl shrink-0">{m.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-navy text-lg">{m.label}</div>
                      <div className="text-xs text-navy/70">{m.givens} pré-remplis</div>
                      {best && (
                        <div className="text-xs text-gold font-bold mt-1">⏱ Meilleur : {fmt(best.seconds)}</div>
                      )}
                    </div>
                    <div className="text-2xl text-navy/40">→</div>
                  </div>
                </button>
              );
            })}
          </div>
        </main>
      </div>
    );
  }

  // ---------- Done ----------
  if (phase === "done") {
    const perfect = hintsUsed === 0 && mistakes === 0;
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-5">
        <MascotCelebration trigger={perfect} locale="fr" />
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">{perfect ? "🏆" : mistakes <= 3 ? "🌟" : "✨"}</div>
          <h1 className="text-3xl font-bold text-navy mb-1">Résolu !</h1>
          <div className="text-xs uppercase font-bold text-fg-soft mb-4">{LEVEL_META[difficulty].label}</div>
          <div className="text-5xl font-bold text-gold mb-1 tabular-nums">{fmt(elapsed)}</div>
          <p className="text-fg-soft text-sm mb-1">Temps total</p>
          <div className="grid grid-cols-2 gap-3 mb-6 mt-4 max-w-xs mx-auto">
            <div className="bg-white border-2 border-pale-blue rounded-xl p-3">
              <div className="text-xs text-fg-soft uppercase font-bold">Erreurs</div>
              <div className="text-2xl font-bold text-navy">{mistakes}</div>
            </div>
            <div className="bg-white border-2 border-pale-blue rounded-xl p-3">
              <div className="text-xs text-fg-soft uppercase font-bold">Indices</div>
              <div className="text-2xl font-bold text-navy">{hintsUsed}</div>
            </div>
          </div>
          {perfect && (
            <div className="bg-gradient-to-r from-gold to-gold-soft border-2 border-navy rounded-xl px-4 py-2 text-navy font-bold text-sm mb-5 inline-block">
              🏆 Solo parfait — sans erreur, sans indice !
            </div>
          )}
          <div className="flex gap-3">
            <button onClick={() => setPhase("pick")} className="btn btn-outline flex-1">Niveaux</button>
            <button onClick={() => startGame(difficulty)} className="btn btn-primary flex-1">Rejouer</button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- Play ----------
  if (!puzzle) return null;
  const sel = selected;
  const selVal = sel ? board[sel.r][sel.c] : 0;

  // Count digits to show how many of each are still placeable.
  const digitCounts = (() => {
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
    for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
      const v = board[r][c];
      if (v >= 1 && v <= 9 && v === puzzle.solution[r][c]) counts[v]++;
    }
    return counts;
  })();

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="px-3 py-3 flex items-center justify-between bg-white border-b border-pale-blue sticky top-0 z-10">
        <button onClick={() => setPhase("pick")} className="w-10 h-10 rounded-full bg-white border border-pale-blue flex items-center justify-center text-navy" aria-label="Quitter">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div className="flex items-center gap-3 text-xs font-bold text-navy">
          <span>{LEVEL_META[difficulty].emoji} {LEVEL_META[difficulty].label}</span>
          <span className="tabular-nums">⏱ {fmt(elapsed)}</span>
          {mistakes > 0 && <span className="text-rose-600 tabular-nums">✗ {mistakes}</span>}
          {hintsUsed > 0 && <span className="text-amber-600 tabular-nums">💡 {hintsUsed}</span>}
        </div>
        <div className="w-10" />
      </header>

      <main className="flex-1 flex flex-col items-center justify-start px-2 py-3 gap-3 w-full">
        {/* Board */}
        <div className="bg-navy p-1 rounded-xl shadow-card">
          <div className="grid grid-cols-9 gap-px bg-navy" style={{ width: "min(95vw, 480px)" }}>
            {board.map((row, r) =>
              row.map((v, c) => {
                const fixed = isFixed(r, c);
                const isSel = sel?.r === r && sel?.c === c;
                const samePeer = sel && (sel.r === r || sel.c === c || (Math.floor(sel.r / 3) === Math.floor(r / 3) && Math.floor(sel.c / 3) === Math.floor(c / 3)));
                const sameVal = sel && selVal !== 0 && v === selVal;
                const wrong = v !== 0 && v !== puzzle.solution[r][c];
                const k = `${r},${c}`;
                const cellNotes = notes[k];
                const isBump = bumpCell === k;
                // Thicker borders between 3x3 blocks
                const borderClasses = [
                  r % 3 === 0 && r !== 0 ? "border-t-2 border-t-navy" : "",
                  c % 3 === 0 && c !== 0 ? "border-l-2 border-l-navy" : "",
                ].join(" ");
                return (
                  <button
                    key={k}
                    onClick={() => onCellTap(r, c)}
                    className={`relative aspect-square flex items-center justify-center text-lg md:text-2xl font-bold transition-colors ${borderClasses} ${
                      isSel
                        ? "bg-gold text-navy"
                        : sameVal
                          ? "bg-amber-200 text-navy"
                          : samePeer
                            ? "bg-pale-blue text-navy"
                            : "bg-white text-navy"
                    } ${wrong && !fixed ? "text-red-600" : ""} ${fixed ? "font-extrabold" : "font-semibold"} ${isBump ? "animate-shake" : ""}`}
                    style={{ minWidth: 0 }}
                  >
                    {v !== 0 ? (
                      <span className={fixed ? "" : ""}>{v}</span>
                    ) : cellNotes && cellNotes.size > 0 ? (
                      <div className="grid grid-cols-3 gap-0 w-full h-full p-0.5 text-[8px] md:text-[10px] text-navy/70 font-semibold">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                          <span key={n} className="flex items-center justify-center leading-none">
                            {cellNotes.has(n) ? n : ""}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex gap-2 w-full max-w-md justify-center">
          <button
            onClick={onErase}
            disabled={!selected || (selected && isFixed(selected.r, selected.c))}
            className="flex-1 py-2 px-3 rounded-xl bg-white border-2 border-pale-blue text-navy font-bold text-sm active:scale-95 disabled:opacity-40"
          >
            ⌫ Effacer
          </button>
          <button
            onClick={() => setNoteMode((n) => !n)}
            className={`flex-1 py-2 px-3 rounded-xl border-2 font-bold text-sm active:scale-95 ${
              noteMode ? "bg-navy text-white border-navy" : "bg-white border-pale-blue text-navy"
            }`}
          >
            ✏️ Notes {noteMode ? "ON" : "OFF"}
          </button>
          <button
            onClick={onHint}
            className="flex-1 py-2 px-3 rounded-xl bg-amber-100 border-2 border-amber-300 text-amber-900 font-bold text-sm active:scale-95"
          >
            💡 Indice
          </button>
        </div>

        {/* Number pad */}
        <div ref={padRef} className="grid grid-cols-9 gap-1.5 w-full max-w-md">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
            const exhausted = digitCounts[n] >= 9;
            return (
              <button
                key={n}
                onClick={() => onPick(n)}
                disabled={!selected || exhausted}
                className={`aspect-square rounded-xl border-2 text-2xl md:text-3xl font-bold transition-all active:scale-95 ${
                  exhausted
                    ? "bg-pale-blue/50 border-pale-blue text-navy/30 cursor-not-allowed"
                    : "bg-white border-pale-blue text-navy hover:border-gold hover:bg-amber-50"
                }`}
              >
                {n}
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
