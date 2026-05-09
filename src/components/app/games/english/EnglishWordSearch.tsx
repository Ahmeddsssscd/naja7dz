"use client";

/**
 * English-only Word Search — same engine/UX as `WordSearch.tsx` but the word
 * lists are uppercase ASCII English words drawn from 4 themes:
 *  - Animals (DOG, CAT, LION, BIRD, FISH, HORSE, MONKEY, ELEPHANT)
 *  - Colors (RED, BLUE, GREEN, YELLOW, BLACK, WHITE, ORANGE, PURPLE)
 *  - Family (MOTHER, FATHER, BROTHER, SISTER, UNCLE, AUNT, GRANDMA, GRANDPA)
 *  - Numbers (ONE, TWO, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT)
 *
 * 8x8 grid. Generation is identical to the FR/AR version — words placed in
 * any of 8 directions, blanks filled with random letters from the union of
 * placed letters (looks more "native" than full A-Z noise).
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { useGameBack } from "../useGameBack";
import confetti from "canvas-confetti";

const SIZE = 8;

type Theme = {
  key: "animals" | "colors" | "family" | "numbers";
  name_fr: string;
  name_ar: string;
  emoji: string;
  words: string[];
};

const THEMES: Theme[] = [
  { key: "animals", name_fr: "Animaux", name_ar: "حيوانات", emoji: "🦁",
    words: ["DOG", "CAT", "LION", "BIRD", "FISH", "HORSE", "MONKEY"] },
  { key: "colors", name_fr: "Couleurs", name_ar: "ألوان", emoji: "🎨",
    words: ["RED", "BLUE", "GREEN", "YELLOW", "BLACK", "WHITE", "PINK"] },
  { key: "family", name_fr: "Famille", name_ar: "العائلة", emoji: "👨‍👩‍👧‍👦",
    words: ["MOTHER", "FATHER", "BROTHER", "SISTER", "UNCLE", "AUNT"] },
  { key: "numbers", name_fr: "Nombres", name_ar: "الأرقام", emoji: "🔢",
    words: ["ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT"] },
];

type Cell = { letter: string; found: boolean };
type Placement = { word: string; cells: { r: number; c: number }[] };

const DIRECTIONS = [
  [0, 1], [0, -1], [1, 0], [-1, 0],
  [1, 1], [1, -1], [-1, 1], [-1, -1],
] as const;

function buildGrid(words: string[]): { grid: Cell[][]; placements: Placement[] } {
  const grid: (string | null)[][] = Array.from({ length: SIZE }, () =>
    Array.from({ length: SIZE }, () => null),
  );
  const placements: Placement[] = [];

  const sorted = [...words].sort((a, b) => b.length - a.length);
  for (const word of sorted) {
    let placed = false;
    for (let attempt = 0; attempt < 200 && !placed; attempt++) {
      const [dr, dc] = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
      const letters = Array.from(word);
      const len = letters.length;
      const r0 = Math.floor(Math.random() * SIZE);
      const c0 = Math.floor(Math.random() * SIZE);
      const rEnd = r0 + dr * (len - 1);
      const cEnd = c0 + dc * (len - 1);
      if (rEnd < 0 || rEnd >= SIZE || cEnd < 0 || cEnd >= SIZE) continue;
      let ok = true;
      for (let i = 0; i < len; i++) {
        const r = r0 + dr * i;
        const c = c0 + dc * i;
        const existing = grid[r][c];
        if (existing !== null && existing !== letters[i]) { ok = false; break; }
      }
      if (!ok) continue;
      const cells: { r: number; c: number }[] = [];
      for (let i = 0; i < len; i++) {
        const r = r0 + dr * i;
        const c = c0 + dc * i;
        grid[r][c] = letters[i];
        cells.push({ r, c });
      }
      placements.push({ word, cells });
      placed = true;
    }
  }

  // Fill blanks with random letters drawn from the alphabet of placed words.
  const alphabet = Array.from(new Set(words.join("").split("")));
  const out: Cell[][] = Array.from({ length: SIZE }, (_, r) =>
    Array.from({ length: SIZE }, (_, c) => ({
      letter: grid[r][c] ?? alphabet[Math.floor(Math.random() * alphabet.length)],
      found: false,
    })),
  );

  return { grid: out, placements };
}

function lineCells(a: { r: number; c: number }, b: { r: number; c: number }) {
  const dr = b.r - a.r;
  const dc = b.c - a.c;
  if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) return null;
  const len = Math.max(Math.abs(dr), Math.abs(dc)) + 1;
  const stepR = dr === 0 ? 0 : dr / Math.abs(dr);
  const stepC = dc === 0 ? 0 : dc / Math.abs(dc);
  const cells: { r: number; c: number }[] = [];
  for (let i = 0; i < len; i++) cells.push({ r: a.r + stepR * i, c: a.c + stepC * i });
  return cells;
}

export function EnglishWordSearch() {
  const goBack = useGameBack("/petits/anglais");
  const [themeIdx, setThemeIdx] = useState(0);
  const theme = THEMES[themeIdx];

  const built = useMemo(() => buildGrid(theme.words), [theme]);
  const [grid, setGrid] = useState<Cell[][]>(built.grid);
  const [placements] = useState<Placement[]>(built.placements);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());

  useEffect(() => {
    setGrid(built.grid);
    setFoundWords(new Set());
  }, [built]);

  const [dragStart, setDragStart] = useState<{ r: number; c: number } | null>(null);
  const [dragEnd, setDragEnd] = useState<{ r: number; c: number } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const allFound = foundWords.size === placements.length && placements.length > 0;

  useEffect(() => {
    if (allFound) {
      confetti({ particleCount: 100, spread: 90, colors: ["#D4A72C", "#0F1B33"] });
    }
  }, [allFound]);

  const previewCells = dragStart && dragEnd ? lineCells(dragStart, dragEnd) : null;

  const cellFromTouch = (clientX: number, clientY: number) => {
    if (!gridRef.current) return null;
    const el = document.elementFromPoint(clientX, clientY) as HTMLElement | null;
    if (!el) return null;
    const target = el.closest<HTMLElement>("[data-cell]");
    if (!target) return null;
    const r = Number(target.dataset.r);
    const c = Number(target.dataset.c);
    if (Number.isNaN(r) || Number.isNaN(c)) return null;
    return { r, c };
  };

  const onPointerDown = (r: number, c: number) => { setDragStart({ r, c }); setDragEnd({ r, c }); };
  const onPointerEnter = (r: number, c: number) => { if (!dragStart) return; setDragEnd({ r, c }); };

  const finishDrag = () => {
    if (dragStart && dragEnd) {
      const cells = lineCells(dragStart, dragEnd);
      if (cells) {
        const word = cells.map(({ r, c }) => grid[r][c].letter).join("");
        const reversed = word.split("").reverse().join("");
        const match = placements.find(
          (p) => (p.word === word || p.word === reversed) && !foundWords.has(p.word),
        );
        if (match) {
          setFoundWords((s) => new Set(s).add(match.word));
          setGrid((g) => {
            const next = g.map((row) => row.map((cell) => ({ ...cell })));
            for (const { r, c } of match.cells) next[r][c].found = true;
            return next;
          });
        }
      }
    }
    setDragStart(null);
    setDragEnd(null);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    const cell = cellFromTouch(touch.clientX, touch.clientY);
    if (cell) onPointerEnter(cell.r, cell.c);
  };

  const onNextTheme = () => setThemeIdx((i) => (i + 1) % THEMES.length);

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="px-5 py-4 flex items-center justify-between bg-white border-b border-pale-blue">
        <button onClick={goBack} className="w-10 h-10 rounded-full hover:bg-pale-blue/40 flex items-center justify-center text-navy" aria-label="Retour">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div className="text-center">
          <h1 className="font-bold text-navy">English Word Search</h1>
          <div className="text-xs text-fg-soft font-ar" dir="rtl">كلمات إنجليزية مخفية</div>
        </div>
        <div className="w-10" />
      </header>

      <main className="flex-1 flex flex-col items-center px-3 py-4 gap-4">
        <div className="text-center">
          <div className="text-xs uppercase tracking-widest text-gold font-bold">Theme</div>
          <div className="text-xl font-bold text-navy">{theme.emoji} {theme.name_fr}</div>
          <div className="text-xs text-fg-soft mt-1">Glisse ton doigt pour relier les lettres en anglais</div>
        </div>

        <div
          ref={gridRef}
          className="bg-white rounded-2xl p-2 border-4 border-navy shadow-card select-none touch-none"
          onTouchMove={onTouchMove}
          onTouchEnd={finishDrag}
          onMouseUp={finishDrag}
          onMouseLeave={finishDrag}
        >
          <div className="grid grid-cols-8 gap-1">
            {grid.map((row, r) =>
              row.map((cell, c) => {
                const inPreview = previewCells?.some((p) => p.r === r && p.c === c) ?? false;
                return (
                  <button
                    key={`${r}-${c}`}
                    data-cell="1"
                    data-r={r}
                    data-c={c}
                    onMouseDown={() => onPointerDown(r, c)}
                    onMouseEnter={() => onPointerEnter(r, c)}
                    onTouchStart={() => onPointerDown(r, c)}
                    className={`w-9 h-9 sm:w-11 sm:h-11 rounded-md text-sm sm:text-base font-bold uppercase transition-colors ${
                      cell.found
                        ? "bg-gold text-navy"
                        : inPreview
                        ? "bg-pale-blue text-navy ring-2 ring-gold"
                        : "bg-white text-navy border border-pale-blue hover:bg-pale-blue/40"
                    }`}
                  >
                    {cell.letter}
                  </button>
                );
              }),
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-3 border border-pale-blue w-full max-w-md">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-xs uppercase tracking-widest text-gold font-bold">Words</span>
            <span className="text-xs text-fg-soft">{foundWords.size}/{placements.length}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {placements.map(({ word }) => {
              const found = foundWords.has(word);
              return (
                <span
                  key={word}
                  className={`px-3 py-1 rounded-full text-sm font-bold ${
                    found ? "bg-gold/30 text-navy line-through" : "bg-pale-blue/40 text-navy"
                  }`}
                >
                  {word}
                </span>
              );
            })}
          </div>
        </div>

        {allFound && (
          <div className="bg-white rounded-2xl p-5 border-4 border-gold w-full max-w-md text-center shadow-card">
            <div className="text-5xl mb-2">🎉</div>
            <div className="font-bold text-navy text-lg mb-3">Bravo, tous les mots !</div>
            <button onClick={onNextTheme} className="bg-navy text-white px-6 py-3 rounded-2xl font-bold active:scale-95 transition-transform">
              Thème suivant →
            </button>
          </div>
        )}

        {!allFound && (
          <button onClick={onNextTheme} className="text-sm text-fg-soft underline hover:text-navy">
            Changer de thème
          </button>
        )}
      </main>
    </div>
  );
}
