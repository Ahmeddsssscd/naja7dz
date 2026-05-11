"use client";

import { useEffect, useRef, useState } from "react";
import { useGameBack } from "./useGameBack";
import { useLocale, useTranslations } from "next-intl";
import confetti from "canvas-confetti";

/**
 * Math race — 60-second sprint of arithmetic problems.
 *
 * Three difficulties:
 *  - facile : a +/- b within 1..20
 *  - moyen  : adds × within 1..12
 *  - difficile : numbers up to 50, all four operations (no division by zero,
 *               division is restricted to integer results)
 *
 * Best score per difficulty is persisted in localStorage.
 */

type Diff = "facile" | "moyen" | "difficile";

type Problem = { text: string; answer: number };

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gen(diff: Diff): Problem {
  if (diff === "facile") {
    const a = rand(1, 20);
    const b = rand(1, 20);
    if (Math.random() < 0.5) return { text: `${a} + ${b}`, answer: a + b };
    const big = Math.max(a, b);
    const small = Math.min(a, b);
    return { text: `${big} − ${small}`, answer: big - small };
  }
  if (diff === "moyen") {
    const op = rand(0, 2);
    if (op === 0) {
      const a = rand(1, 25);
      const b = rand(1, 25);
      return { text: `${a} + ${b}`, answer: a + b };
    }
    if (op === 1) {
      const a = rand(1, 30);
      const b = rand(1, 30);
      const big = Math.max(a, b);
      const small = Math.min(a, b);
      return { text: `${big} − ${small}`, answer: big - small };
    }
    const a = rand(2, 12);
    const b = rand(2, 12);
    return { text: `${a} × ${b}`, answer: a * b };
  }
  // difficile
  const op = rand(0, 3);
  if (op === 0) {
    const a = rand(10, 50);
    const b = rand(10, 50);
    return { text: `${a} + ${b}`, answer: a + b };
  }
  if (op === 1) {
    const a = rand(10, 50);
    const b = rand(10, 50);
    const big = Math.max(a, b);
    const small = Math.min(a, b);
    return { text: `${big} − ${small}`, answer: big - small };
  }
  if (op === 2) {
    const a = rand(2, 15);
    const b = rand(2, 15);
    return { text: `${a} × ${b}`, answer: a * b };
  }
  // division producing an integer
  const b = rand(2, 12);
  const ans = rand(2, 12);
  const a = b * ans;
  return { text: `${a} ÷ ${b}`, answer: ans };
}

const STORAGE_KEY = "najah:mathrace:best";

function loadBest(): Record<Diff, number> {
  if (typeof window === "undefined") return { facile: 0, moyen: 0, difficile: 0 };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { facile: 0, moyen: 0, difficile: 0 };
    const parsed = JSON.parse(raw) as Partial<Record<Diff, number>>;
    return {
      facile: Number(parsed.facile) || 0,
      moyen: Number(parsed.moyen) || 0,
      difficile: Number(parsed.difficile) || 0,
    };
  } catch {
    return { facile: 0, moyen: 0, difficile: 0 };
  }
}

function saveBest(b: Record<Diff, number>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(b));
  } catch {
    /* ignore */
  }
}

export function MathRace() {
  const goBack = useGameBack();
  const t = useTranslations("PetitsGameMathRace");
  const locale = useLocale();
  const isAR = locale === "ar";

  const [phase, setPhase] = useState<"setup" | "play" | "done">("setup");
  const [diff, setDiff] = useState<Diff>("facile");
  const [time, setTime] = useState(60);
  const [problem, setProblem] = useState<Problem>(() => gen("facile"));
  const [input, setInput] = useState("");
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [feedback, setFeedback] = useState<"none" | "good" | "bad">("none");
  const [best, setBest] = useState<Record<Diff, number>>({ facile: 0, moyen: 0, difficile: 0 });

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setBest(loadBest());
  }, []);

  useEffect(() => {
    if (phase !== "play") return;
    if (time <= 0) {
      setPhase("done");
      const newBest = { ...best };
      if (correct > newBest[diff]) {
        newBest[diff] = correct;
        setBest(newBest);
        saveBest(newBest);
        confetti({ particleCount: 100, spread: 90, colors: ["#D4A72C", "#0F1B33"] });
      }
      return;
    }
    const id = setInterval(() => setTime((t) => t - 1), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, time]);

  useEffect(() => {
    if (phase === "play") inputRef.current?.focus();
  }, [phase]);

  const start = (d: Diff) => {
    setDiff(d);
    setTime(60);
    setCorrect(0);
    setWrong(0);
    setProblem(gen(d));
    setInput("");
    setFeedback("none");
    setPhase("play");
  };

  const submit = () => {
    if (phase !== "play") return;
    if (input.trim() === "") return;
    const guess = parseInt(input.trim(), 10);
    if (Number.isNaN(guess)) {
      setInput("");
      return;
    }
    if (guess === problem.answer) {
      setCorrect((c) => c + 1);
      setFeedback("good");
    } else {
      setWrong((w) => w + 1);
      setFeedback("bad");
    }
    setProblem(gen(diff));
    setInput("");
    setTimeout(() => setFeedback("none"), 250);
  };

  if (phase === "setup") {
    return (
      <div className="min-h-screen bg-cream dark:bg-surface-2 flex flex-col" dir={isAR ? "rtl" : "ltr"}>
        <header className="px-5 py-4 flex items-center justify-between bg-surface border-b border-line">
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
        <main className="flex-1 flex flex-col items-center justify-center px-5 gap-4">
          <div className="text-6xl">⏱️</div>
          <p className="text-center text-fg-soft max-w-sm">{t("instructions")}</p>
          <div className="flex flex-col gap-3 w-full max-w-sm">
            {(["facile", "moyen", "difficile"] as const).map((d) => (
              <button
                key={d}
                onClick={() => start(d)}
                className="bg-surface rounded-2xl border-2 border-pale-blue px-5 py-4 flex items-center justify-between hover:border-gold active:scale-95 transition-all"
              >
                <div className="text-start">
                  <div className="font-bold text-navy">{t(`diff_${d}`)}</div>
                  <div className="text-xs text-fg-soft">{t(`diff_${d}_sub`)}</div>
                </div>
                <div className="text-sm text-gold font-bold">
                  {t("best")}: {best[d]}
                </div>
              </button>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (phase === "done") {
    const isNewBest = correct >= best[diff] && correct > 0;
    return (
      <div className="min-h-screen bg-cream dark:bg-surface-2 flex flex-col items-center justify-center px-5" dir={isAR ? "rtl" : "ltr"}>
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-3">{correct > 0 ? "🏁" : "😅"}</div>
          <h1 className="text-3xl font-bold text-navy mb-1">{t("time_up")}</h1>
          {isNewBest && (
            <div className="text-gold font-bold mb-2">{t("new_best")}</div>
          )}
          <div className="text-sm text-fg-soft mb-1">{t("difficulty")}: {t(`diff_${diff}`)}</div>
          <div className="grid grid-cols-2 gap-3 my-5">
            <div className="bg-emerald-100 rounded-2xl p-3">
              <div className="text-xs text-emerald-900 font-bold uppercase">{t("correct")}</div>
              <div className="text-3xl font-bold text-emerald-900">{correct}</div>
            </div>
            <div className="bg-red-100 rounded-2xl p-3">
              <div className="text-xs text-red-900 font-bold uppercase">{t("wrong")}</div>
              <div className="text-3xl font-bold text-red-900">{wrong}</div>
            </div>
          </div>
          <div className="text-sm text-fg-soft mb-5">
            {t("best")}: <strong className="text-navy">{best[diff]}</strong>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setPhase("setup")}
              className="flex-1 bg-surface border-2 border-navy text-navy rounded-2xl px-4 py-3 font-bold active:scale-95"
            >
              {t("change_difficulty")}
            </button>
            <button
              onClick={() => start(diff)}
              className="flex-1 bg-navy text-white rounded-2xl px-4 py-3 font-bold active:scale-95"
            >
              {t("restart")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // play phase
  const fbCls =
    feedback === "good"
      ? "ring-4 ring-green-400"
      : feedback === "bad"
      ? "ring-4 ring-red-400"
      : "";

  return (
    <div className="min-h-screen bg-cream dark:bg-surface-2 flex flex-col" dir={isAR ? "rtl" : "ltr"}>
      <header className="px-5 py-4 flex items-center justify-between bg-surface border-b border-line">
        <button
          onClick={() => setPhase("setup")}
          className="w-10 h-10 rounded-full hover:bg-pale-blue/40 flex items-center justify-center text-navy"
          aria-label={t("back")}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points={isAR ? "9 18 15 12 9 6" : "15 18 9 12 15 6"} />
          </svg>
        </button>
        <div className="flex items-center gap-4 text-sm">
          <span className="font-bold text-emerald-700">✓ {correct}</span>
          <span className="font-bold text-red-600">✗ {wrong}</span>
          <span className={`font-bold tabular-nums ${time <= 10 ? "text-red-500 animate-pulse" : "text-navy"}`}>⏱ {time}s</span>
        </div>
        <div className="w-10" />
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-5 gap-6">
        <div className={`bg-surface border-4 border-navy rounded-3xl px-10 py-8 shadow-card text-5xl sm:text-6xl font-bold text-navy ${fbCls}`}>
          {problem.text} = ?
        </div>
        <input
          ref={inputRef}
          type="number"
          inputMode="numeric"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          className="w-44 text-center text-4xl font-bold rounded-2xl bg-surface border-4 border-pale-blue focus:border-gold focus:outline-none px-3 py-3 text-navy"
          placeholder="?"
        />
        <button
          onClick={submit}
          className="bg-navy text-white rounded-2xl px-8 py-3 font-bold active:scale-95"
        >
          {t("submit")}
        </button>
      </main>
    </div>
  );
}
