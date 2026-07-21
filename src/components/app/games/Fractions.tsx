"use client";

/**
 * Fractions — visual pizza fractions for 8-11 year olds (4AP/5AP program).
 *
 * Each round draws a "pizza" (SVG circle) cut into N equal slices with K
 * slices shaded gold. The kid picks which fraction matches from 4 choices.
 * 10 rounds, 3-star scoring, localStorage best score — same shape as the
 * other jeux-malins games.
 */

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useGameBack } from "./useGameBack";
import { MascotCelebration } from "@/components/app/MascotCelebration";
import confetti from "canvas-confetti";

const STORAGE_KEY = "najah:fractions:best";
const TOTAL_ROUNDS = 10;

interface Round {
  num: number;   // shaded slices
  den: number;   // total slices
  options: string[]; // "num/den" strings, shuffled
  correct: number;   // index into options
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildRound(): Round {
  const dens = [2, 3, 4, 5, 6, 8];
  const den = dens[Math.floor(Math.random() * dens.length)];
  const num = 1 + Math.floor(Math.random() * (den - 1));
  const correct = `${num}/${den}`;

  // Build 3 plausible wrong answers
  const wrongs = new Set<string>();
  wrongs.add(`${den}/${num}`); // inverted
  if (num + 1 < den) wrongs.add(`${num + 1}/${den}`);
  if (num - 1 >= 1) wrongs.add(`${num - 1}/${den}`);
  wrongs.add(`${num}/${den + 2}`);
  wrongs.delete(correct);
  const options = shuffle([correct, ...shuffle([...wrongs]).slice(0, 3)]);
  return { num, den, options, correct: options.indexOf(correct) };
}

/** SVG pizza: `den` equal slices, first `num` shaded. */
function Pizza({ num, den }: { num: number; den: number }) {
  const cx = 100, cy = 100, r = 88;
  const slices = [];
  for (let i = 0; i < den; i++) {
    const a0 = (i / den) * 2 * Math.PI - Math.PI / 2;
    const a1 = ((i + 1) / den) * 2 * Math.PI - Math.PI / 2;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const large = 1 / den > 0.5 ? 1 : 0;
    slices.push(
      <path
        key={i}
        d={`M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`}
        fill={i < num ? "#D4A72C" : "#FEF6E0"}
        stroke="#0F1B33"
        strokeWidth="2.5"
      />,
    );
  }
  return (
    <svg viewBox="0 0 200 200" className="w-52 h-52 md:w-64 md:h-64 mx-auto drop-shadow-md">
      {slices}
    </svg>
  );
}

export function Fractions() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const goBack = useGameBack();

  const [round, setRound] = useState(0);
  const [data, setData] = useState<Round>(() => buildRound());
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [best, setBest] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const v = Number(window.localStorage.getItem(STORAGE_KEY));
    if (Number.isFinite(v) && v > 0) setBest(v);
  }, []);

  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    const good = i === data.correct;
    if (good) {
      setScore((s) => s + 1);
      try { confetti({ particleCount: 30, spread: 55, origin: { y: 0.6 } }); } catch { /* ignore */ }
    }
    setTimeout(() => {
      if (round + 1 >= TOTAL_ROUNDS) {
        const final = score + (good ? 1 : 0);
        setDone(true);
        if (best === null || final > best) {
          setBest(final);
          try { window.localStorage.setItem(STORAGE_KEY, String(final)); } catch { /* ignore */ }
        }
        if (final === TOTAL_ROUNDS) {
          try { confetti({ particleCount: 150, spread: 110, colors: ["#D4A72C", "#0F1B33", "#1AD18C"] }); } catch { /* ignore */ }
        }
      } else {
        setRound((r) => r + 1);
        setData(buildRound());
        setPicked(null);
      }
    }, 900);
  };

  const restart = () => {
    setRound(0); setData(buildRound()); setPicked(null); setScore(0); setDone(false);
  };

  if (done) {
    const stars = score >= 9 ? 3 : score >= 6 ? 2 : 1;
    return (
      <div className="min-h-screen bg-cream dark:bg-surface-2 flex items-center justify-center px-5">
        <MascotCelebration trigger={score === TOTAL_ROUNDS} locale={isAr ? "ar" : "fr"} />
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">{score >= 9 ? "🏆" : score >= 6 ? "🌟" : "✨"}</div>
          <h1 className="text-3xl font-bold text-navy mb-2">{isAr ? "أحسنت !" : "Bravo !"}</h1>
          <div className="text-2xl mb-2">{"★".repeat(stars)}<span className="text-line">{"☆".repeat(3 - stars)}</span></div>
          <div className="text-5xl font-bold text-gold my-2">{score}<span className="text-2xl text-fg-soft"> / {TOTAL_ROUNDS}</span></div>
          {best !== null && (
            <div className="text-xs text-fg-soft mt-1">{isAr ? "أفضل نتيجة" : "Record"} : {best}/{TOTAL_ROUNDS}</div>
          )}
          <div className="flex gap-3 mt-6">
            <button onClick={goBack} className="btn btn-outline flex-1">{isAr ? "خروج" : "Quitter"}</button>
            <button onClick={restart} className="btn btn-primary flex-1">{isAr ? "إعادة" : "Rejouer"}</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-surface-2 flex flex-col">
      <header className="px-5 py-4 flex items-center justify-between bg-surface border-b border-line">
        <button onClick={goBack} className="w-10 h-10 rounded-full bg-surface border border-pale-blue flex items-center justify-center text-navy" aria-label={isAr ? "رجوع" : "Retour"}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h1 className="text-base md:text-lg font-bold text-navy">
          {isAr ? "الكسور" : "Les fractions"} <span className="text-xl">🍕</span>
        </h1>
        <div className="text-xs font-bold text-fg-soft">{round + 1}/{TOTAL_ROUNDS}</div>
      </header>

      <main className="flex-1 px-5 py-6 max-w-md mx-auto w-full flex flex-col justify-center">
        <p className="text-sm md:text-base text-fg-soft text-center mb-4">
          {isAr ? "أي كسر يمثل الجزء الملوّن؟" : "Quelle fraction représente la partie colorée ?"}
        </p>

        <Pizza num={data.num} den={data.den} />

        <div className="grid grid-cols-2 gap-3 mt-6">
          {data.options.map((opt, i) => {
            const state =
              picked === null ? "idle"
              : i === data.correct ? "good"
              : i === picked ? "bad"
              : "idle";
            return (
              <button
                key={i}
                onClick={() => pick(i)}
                disabled={picked !== null}
                className={`rounded-2xl border-4 py-4 text-2xl font-bold transition active:scale-95 ${
                  state === "good" ? "bg-emerald-100 border-emerald-500 text-emerald-800"
                  : state === "bad" ? "bg-red-100 border-red-400 text-red-700"
                  : "bg-surface border-pale-blue text-navy hover:border-gold"
                }`}
              >
                <bdi>{opt}</bdi>
              </button>
            );
          })}
        </div>

        <div className="text-center text-xs text-fg-soft mt-5">
          {isAr ? "النقاط" : "Score"} · <span className="font-bold text-emerald-700">{score}</span>
        </div>
      </main>
    </div>
  );
}
