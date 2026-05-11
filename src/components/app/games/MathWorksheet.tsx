"use client";

/**
 * Math Worksheet — sheet of 20 fill-in-the-blank arithmetic problems shown
 * ALL AT ONCE on the page (the kid asked for "huge list, not one question
 * at a time"). Each row has a single blank that takes a numeric input;
 * tapping it pops a number-pad chooser so the kid never has to context-
 * switch to a real keyboard. Live correctness lights up green/red as soon
 * as the kid types the right answer.
 *
 * Difficulty levels:
 *   - Facile  : 1-digit + and - (1-9, sums up to 10)
 *   - Moyen   : 2-digit + and - (10-50)
 *   - Difficile : × tables 2-9, mixed
 *
 * The blank can be in any of the 3 positions of the operation:
 *   ?+3=5  ·  4+?=7  ·  4+3=?
 * which forces the kid to actually understand inverse operations rather
 * than just compute left-to-right.
 *
 * Stars: 18+/20 = 3⭐, 14-17 = 2⭐, anything less = 1⭐. Best score per
 * level is persisted to localStorage.
 */

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { useGameBack } from "./useGameBack";
import { MascotCelebration } from "@/components/app/MascotCelebration";
import confetti from "canvas-confetti";

type Level = "facile" | "moyen" | "difficile";
type Op = "+" | "-" | "×";
type Slot = "a" | "b" | "result";

interface Problem {
  id: number;
  a: number;
  b: number;
  op: Op;
  result: number;
  /** which slot is the blank */
  blank: Slot;
}

function pick(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildProblems(level: Level, count = 20): Problem[] {
  const out: Problem[] = [];
  for (let i = 0; i < count; i++) {
    let a: number, b: number, op: Op;
    if (level === "facile") {
      op = Math.random() < 0.6 ? "+" : "-";
      if (op === "+") {
        a = pick(1, 8); b = pick(1, 9 - a + 1);
      } else {
        a = pick(2, 9); b = pick(1, a - 1);
      }
    } else if (level === "moyen") {
      op = Math.random() < 0.55 ? "+" : "-";
      if (op === "+") {
        a = pick(5, 30); b = pick(5, 25);
      } else {
        a = pick(15, 50); b = pick(5, a - 5);
      }
    } else {
      // difficile — multiplication 2..9 mostly, occasional addition
      const r = Math.random();
      if (r < 0.7) { op = "×"; a = pick(2, 9); b = pick(2, 9); }
      else if (r < 0.85) { op = "+"; a = pick(20, 99); b = pick(10, 60); }
      else { op = "-"; a = pick(50, 99); b = pick(10, 49); }
    }
    const result = op === "+" ? a + b : op === "-" ? a - b : a * b;
    const slot: Slot = (["a", "b", "result"] as const)[pick(0, 2)];
    out.push({ id: i, a, b, op, result, blank: slot });
  }
  return out;
}

function answerFor(p: Problem): number {
  return p.blank === "a" ? p.a : p.blank === "b" ? p.b : p.result;
}

const STORAGE_PREFIX = "najah:mathworksheet:best";

function bestKey(level: Level) { return `${STORAGE_PREFIX}:${level}`; }

export function MathWorksheet() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const goBack = useGameBack();

  const [level, setLevel] = useState<Level>("facile");
  const [problems, setProblems] = useState<Problem[]>(() => buildProblems("facile"));
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [best, setBest] = useState<Record<Level, number>>({ facile: 0, moyen: 0, difficile: 0 });

  // Number-pad popover
  const [padOpen, setPadOpen] = useState<{ id: number; x: number; y: number } | null>(null);

  // Load best scores
  useEffect(() => {
    if (typeof window === "undefined") return;
    setBest({
      facile: Number(window.localStorage.getItem(bestKey("facile"))) || 0,
      moyen: Number(window.localStorage.getItem(bestKey("moyen"))) || 0,
      difficile: Number(window.localStorage.getItem(bestKey("difficile"))) || 0,
    });
  }, []);

  const score = useMemo(() => {
    return problems.reduce((acc, p) => {
      const got = answers[p.id];
      if (got === undefined || got === "") return acc;
      return Number(got) === answerFor(p) ? acc + 1 : acc;
    }, 0);
  }, [answers, problems]);

  const filled = useMemo(() => problems.filter((p) => answers[p.id] !== undefined && answers[p.id] !== "").length, [answers, problems]);

  const restart = (newLevel?: Level) => {
    const lv = newLevel ?? level;
    setLevel(lv);
    setProblems(buildProblems(lv));
    setAnswers({});
    setSubmitted(false);
    setPadOpen(null);
  };

  const onSubmit = () => {
    setSubmitted(true);
    if (score > best[level]) {
      setBest((b) => ({ ...b, [level]: score }));
      try { window.localStorage.setItem(bestKey(level), String(score)); } catch { /* ignore */ }
    }
    if (score >= 18) {
      try { confetti({ particleCount: 160, spread: 110, colors: ["#D4A72C", "#0F1B33", "#1AD18C"] }); } catch { /* ignore */ }
    }
  };

  const stars = score >= 18 ? 3 : score >= 14 ? 2 : 1;

  // ===== After-submit summary =====
  if (submitted) {
    return (
      <div className="min-h-screen bg-cream dark:bg-surface-2 flex flex-col">
        <Header isAr={isAr} onBack={goBack} title={isAr ? "ورقة الرياضيات" : "Feuille de maths"} />
        <main className="flex-1 px-5 py-6 max-w-md md:max-w-3xl mx-auto w-full">
          <MascotCelebration trigger={score === 20} locale={isAr ? "ar" : "fr"} />
          <div className="text-center mb-6">
            <div className="text-6xl mb-3">{score === 20 ? "🏆" : score >= 14 ? "🌟" : "✨"}</div>
            <div className="text-2xl mb-1">{"★".repeat(stars)}<span className="text-line">{"☆".repeat(3 - stars)}</span></div>
            <div className="text-5xl font-bold text-gold">{score}<span className="text-2xl text-fg-soft"> / {problems.length}</span></div>
            {best[level] > 0 && (
              <div className="text-xs text-fg-soft mt-1">{isAr ? "أفضل نتيجة" : "Record"} · {LEVEL_LABEL[level][isAr ? "ar" : "fr"]} : {best[level]}/20</div>
            )}
          </div>

          {/* Re-render problems with green/red marks */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-5">
            {problems.map((p) => {
              const got = answers[p.id];
              const correct = got !== undefined && got !== "" && Number(got) === answerFor(p);
              return (
                <div key={p.id} className={`rounded-xl p-3 border-2 text-base font-bold text-center ${correct ? "bg-emerald-50 border-emerald-400 text-emerald-900" : "bg-red-50 border-red-400 text-red-900"}`}>
                  <div className="flex items-center justify-center gap-1.5">
                    {renderProblemDisplay(p, got, correct)}
                  </div>
                  {!correct && (
                    <div className="text-xs text-fg-soft mt-1">{isAr ? "الجواب" : "Réponse"} : <strong>{answerFor(p)}</strong></div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <button onClick={goBack} className="btn btn-outline flex-1">{isAr ? "خروج" : "Quitter"}</button>
            <button onClick={() => restart()} className="btn btn-primary flex-1">{isAr ? "ورقة جديدة" : "Nouvelle feuille"}</button>
          </div>
        </main>
      </div>
    );
  }

  // ===== Active worksheet =====
  return (
    <div className="min-h-screen bg-cream dark:bg-surface-2 flex flex-col" onClick={() => setPadOpen(null)}>
      <Header isAr={isAr} onBack={goBack} title={isAr ? "ورقة الرياضيات" : "Feuille de maths"} />

      <main className="flex-1 px-5 py-5 max-w-md md:max-w-3xl mx-auto w-full">
        {/* Level selector */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {(["facile", "moyen", "difficile"] as Level[]).map((lv) => (
            <button
              key={lv}
              onClick={(e) => { e.stopPropagation(); restart(lv); }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 ${
                level === lv ? "bg-navy text-cream border-navy" : "bg-white text-navy border-pale-blue hover:border-gold"
              }`}
            >
              {LEVEL_LABEL[lv][isAr ? "ar" : "fr"]}
              {best[lv] > 0 && <span className="ms-2 text-[10px] opacity-70">★{best[lv]}</span>}
            </button>
          ))}
          <span className="text-xs text-fg-soft ms-auto">
            {filled}/{problems.length}
          </span>
        </div>

        {/* The worksheet itself — 20 problems in a responsive grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-5">
          {problems.map((p) => {
            const value = answers[p.id] ?? "";
            const isFilled = value !== "";
            const isCorrect = isFilled && Number(value) === answerFor(p);
            return (
              <button
                key={p.id}
                onClick={(e) => {
                  e.stopPropagation();
                  const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
                  setPadOpen({ id: p.id, x: r.left + r.width / 2, y: r.top + r.height + 6 });
                }}
                className={`rounded-xl p-3 border-2 text-base md:text-lg font-bold text-center transition active:scale-95 ${
                  padOpen?.id === p.id ? "ring-4 ring-gold/50 border-gold bg-yellow-50"
                  : isCorrect ? "bg-emerald-50 border-emerald-400 text-emerald-900"
                  : isFilled ? "bg-red-50 border-red-400 text-red-900"
                  : "bg-surface border-pale-blue text-navy hover:border-gold"
                }`}
              >
                <div className="flex items-center justify-center gap-1.5">
                  {renderProblemDisplay(p, value, isCorrect)}
                </div>
              </button>
            );
          })}
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button onClick={() => setAnswers({})} className="btn btn-outline flex-1">{isAr ? "مسح" : "Effacer"}</button>
          <button
            onClick={onSubmit}
            disabled={filled === 0}
            className={`btn flex-1 ${filled === 0 ? "btn-outline opacity-40" : "btn-primary"}`}
          >
            {isAr ? `تحقق (${filled}/${problems.length})` : `Valider (${filled}/${problems.length})`}
          </button>
        </div>
      </main>

      {/* Number-pad popover — appears next to the tapped blank */}
      {padOpen && (() => {
        const p = problems.find((x) => x.id === padOpen.id)!;
        const current = answers[p.id] ?? "";
        const setVal = (v: string) => setAnswers((a) => ({ ...a, [p.id]: v }));
        return (
          <div
            className="fixed z-40 bg-surface border-2 border-navy rounded-2xl p-2 shadow-xl"
            style={{ left: Math.max(8, Math.min(padOpen.x - 110, (typeof window !== "undefined" ? window.innerWidth : 800) - 230)), top: padOpen.y }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-pale-blue/30 rounded-xl px-3 py-2 mb-2 text-center text-2xl font-bold text-navy min-h-[48px] flex items-center justify-center">
              {current || <span className="text-fg-soft">—</span>}
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <button
                  key={n}
                  onClick={() => setVal((current + String(n)).slice(0, 3))}
                  className="bg-cream dark:bg-surface-2 hover:bg-gold/20 active:scale-95 rounded-lg w-12 h-12 text-xl font-bold text-navy"
                >
                  {n}
                </button>
              ))}
              <button onClick={() => setVal("")} className="bg-red-50 hover:bg-red-100 active:scale-95 rounded-lg w-12 h-12 text-sm font-bold text-red-700">⌫</button>
              <button onClick={() => setVal((current + "0").slice(0, 3))} className="bg-cream dark:bg-surface-2 hover:bg-gold/20 active:scale-95 rounded-lg w-12 h-12 text-xl font-bold text-navy">0</button>
              <button onClick={() => setPadOpen(null)} className="bg-emerald-100 hover:bg-emerald-200 active:scale-95 rounded-lg w-12 h-12 text-sm font-bold text-emerald-800">✓</button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

const LEVEL_LABEL: Record<Level, { fr: string; ar: string }> = {
  facile:    { fr: "Facile",    ar: "سهل" },
  moyen:     { fr: "Moyen",     ar: "متوسط" },
  difficile: { fr: "Difficile", ar: "صعب" },
};

/** Render the visual `a OP b = result` with one slot replaced by the input/answer. */
function renderProblemDisplay(p: Problem, value: string, isCorrect: boolean) {
  const slotClass = `inline-block min-w-[28px] px-2 py-0.5 rounded border-2 border-dashed text-center ${
    value !== "" ? (isCorrect ? "border-emerald-500 text-emerald-700" : "border-red-500 text-red-700") : "border-navy/40 text-navy/60"
  }`;
  const A = p.blank === "a" ? <span className={slotClass}>{value || "?"}</span> : <span>{p.a}</span>;
  const B = p.blank === "b" ? <span className={slotClass}>{value || "?"}</span> : <span>{p.b}</span>;
  const R = p.blank === "result" ? <span className={slotClass}>{value || "?"}</span> : <span>{p.result}</span>;
  return (
    <>
      {A}<span className="px-0.5">{p.op}</span>{B}<span className="px-0.5">=</span>{R}
    </>
  );
}

function Header({ isAr, onBack, title }: { isAr: boolean; onBack: () => void; title: string }) {
  return (
    <header className="px-5 py-4 flex items-center justify-between bg-surface border-b border-line">
      <button onClick={onBack} className="w-10 h-10 rounded-full bg-surface border border-pale-blue flex items-center justify-center text-navy" aria-label={isAr ? "رجوع" : "Retour"}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <h1 className="text-base md:text-lg font-bold text-navy">{title} <span className="text-xl">📝</span></h1>
      <div className="w-10" />
    </header>
  );
}
