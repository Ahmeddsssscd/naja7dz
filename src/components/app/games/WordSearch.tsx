"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useGameBack } from "./useGameBack";
import { useLocale, useTranslations } from "next-intl";
import confetti from "canvas-confetti";

/**
 * Word search game on an 8x8 grid.
 *
 * Five themed word lists. AR locale gets a dedicated Arabic-letter list.
 * Player drags from one cell to another in a straight line (horizontal,
 * vertical or diagonal). When the cells under the drag spell a target word
 * (forwards or backwards) the cells are locked in gold and the word in the
 * sidebar is struck through.
 *
 * Generation strategy: place each word in a random direction at a random
 * starting cell. Retry up to N times per word. Fill the rest of the grid with
 * random letters drawn from the union of word letters (so distractors look
 * native to the alphabet of the locale rather than e.g. 'Q' next to Arabic).
 */

const SIZE = 8;

type Theme = {
  key: "animals" | "fruits" | "colors" | "body" | "arabic";
  words: string[];
};

const THEMES_FR: Theme[] = [
  { key: "animals", words: ["CHAT", "CHIEN", "LION", "POISSON", "OURS"] },
  { key: "fruits", words: ["POMME", "ORANGE", "BANANE", "FRAISE", "KIWI"] },
  { key: "colors", words: ["ROUGE", "BLEU", "VERT", "JAUNE", "NOIR"] },
  { key: "body", words: ["MAIN", "PIED", "TETE", "OEIL", "NEZ"] },
];

const THEMES_AR: Theme[] = [
  // Arabic letters used as a single-codepoint alphabet for the puzzle.
  // Words are kept short to fit on an 8x8 grid.
  { key: "arabic", words: ["قط", "كلب", "أسد", "ورد", "بحر", "جبل", "شمس"] },
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

  // Place words longest-first to avoid late failures.
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
      // Check fit
      let ok = true;
      for (let i = 0; i < len; i++) {
        const r = r0 + dr * i;
        const c = c0 + dc * i;
        const existing = grid[r][c];
        if (existing !== null && existing !== letters[i]) {
          ok = false;
          break;
        }
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

  // Fill blanks with random letters drawn from the union of placed letters
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
  // Must be horizontal, vertical or perfectly diagonal.
  if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) return null;
  const len = Math.max(Math.abs(dr), Math.abs(dc)) + 1;
  const stepR = dr === 0 ? 0 : dr / Math.abs(dr);
  const stepC = dc === 0 ? 0 : dc / Math.abs(dc);
  const cells: { r: number; c: number }[] = [];
  for (let i = 0; i < len; i++) cells.push({ r: a.r + stepR * i, c: a.c + stepC * i });
  return cells;
}

export function WordSearch() {
  const goBack = useGameBack();
  const t = useTranslations("PetitsGameWordSearch");
  const locale = useLocale();
  const isAR = locale === "ar";

  const themeList: Theme[] = isAR ? THEMES_AR : THEMES_FR;
  const [themeIdx, setThemeIdx] = useState(0);
  const theme = themeList[themeIdx];

  const built = useMemo(() => buildGrid(theme.words), [theme]);
  const [grid, setGrid] = useState<Cell[][]>(built.grid);
  const [placements] = useState<Placement[]>(built.placements);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());

  // Keep grid in sync if theme changes
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

  const onPointerDown = (r: number, c: number) => {
    setDragStart({ r, c });
    setDragEnd({ r, c });
  };

  const onPointerEnter = (r: number, c: number) => {
    if (!dragStart) return;
    setDragEnd({ r, c });
  };

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

  // Touch handlers (mobile drag across grid)
  const onTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    const cell = cellFromTouch(touch.clientX, touch.clientY);
    if (cell) onPointerEnter(cell.r, cell.c);
  };

  const onRestart = () => {
    setThemeIdx((i) => (i + 1) % themeList.length);
  };

  const themeLabel = t(`theme_${theme.key}`);

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

      <main className="flex-1 flex flex-col items-center px-3 py-4 gap-4">
        <div className="text-center">
          <div className="text-xs uppercase tracking-widest text-gold font-bold">{t("theme_label")}</div>
          <div className="text-xl font-bold text-navy">{themeLabel}</div>
          <div className="text-xs text-fg-soft mt-1">{t("instructions")}</div>
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
                const inPreview =
                  previewCells?.some((p) => p.r === r && p.c === c) ?? false;
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
            <span className="text-xs uppercase tracking-widest text-gold font-bold">{t("words_label")}</span>
            <span className="text-xs text-fg-soft">
              {t("score", { found: foundWords.size, total: placements.length })}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {placements.map(({ word }) => {
              const found = foundWords.has(word);
              return (
                <span
                  key={word}
                  className={`px-3 py-1 rounded-full text-sm font-bold ${
                    found
                      ? "bg-gold/30 text-navy line-through"
                      : "bg-pale-blue/40 text-navy"
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
            <div className="font-bold text-navy text-lg mb-3">{t("you_win")}</div>
            <button
              onClick={onRestart}
              className="bg-navy text-white px-6 py-3 rounded-2xl font-bold active:scale-95 transition-transform"
            >
              {t("next_theme")}
            </button>
          </div>
        )}

        {!allFound && (
          <button
            onClick={onRestart}
            className="text-sm text-fg-soft underline hover:text-navy"
          >
            {t("change_theme")}
          </button>
        )}
      </main>
    </div>
  );
}
