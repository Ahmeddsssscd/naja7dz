"use client";

/**
 * Comparaison — the crocodile always eats the bigger number.
 *
 * Classic primary-school trick for < / > / =. Two numbers appear; the kid
 * picks the right symbol. The crocodile mouth (the symbol) always opens
 * toward the bigger number. Difficulty ramps: rounds 1-4 use 0-20,
 * rounds 5-8 use 0-100, rounds 9-12 use 100-999.
 */

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useGameBack } from "./useGameBack";
import { MascotCelebration } from "@/components/app/MascotCelebration";
import confetti from "canvas-confetti";

const STORAGE_KEY = "najah:comparaison:best";
const TOTAL_ROUNDS = 12;

type Sym = "<" | ">" | "=";

interface Round { a: number; b: number; answer: Sym }

function buildRound(idx: number): Round {
  const max = idx < 4 ? 20 : idx < 8 ? 100 : 999;
  const min = idx < 8 ? 0 : 100;
  const rnd = () => min + Math.floor(Math.random() * (max - min + 1));
  const a = rnd();
  // 1-in-5 rounds force equality so "=" stays a live option.
  const b = Math.random() < 0.2 ? a : rnd();
  return { a, b, answer: a < b ? "<" : a > b ? ">" : "=" };
}

function Croc({ dir }: { dir: "left" | "right" | "flat" }) {
  // Simple crocodile head; mouth opens toward `dir`.
  const flip = dir === "left";
  return (
    <svg viewBox="0 0 120 80" className={`w-20 h-14 ${flip ? "-scale-x-100" : ""}`}>
      {dir === "flat" ? (
        <>
          <rect x="20" y="34" width="80" height="12" rx="6" fill="#16A34A" stroke="#0F1B33" strokeWidth="2.5" />
          <circle cx="88" cy="30" r="5" fill="#fff" stroke="#0F1B33" strokeWidth="2" />
          <circle cx="89" cy="30" r="2" fill="#0F1B33" />
        </>
      ) : (
        <>
          <path d="M15 40 L95 18 Q108 15 110 24 L110 30 Z" fill="#16A34A" stroke="#0F1B33" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M15 40 L95 62 Q108 65 110 56 L110 50 Z" fill="#15803D" stroke="#0F1B33" strokeWidth="2.5" strokeLinejoin="round" />
          <circle cx="92" cy="26" r="5" fill="#fff" stroke="#0F1B33" strokeWidth="2" />
          <circle cx="93" cy="26" r="2" fill="#0F1B33" />
          {[35, 50, 65].map((x) => (
            <path key={x} d={`M${x} ${33 - (x - 15) * 0.27} l4 6 l4 -7`} fill="#fff" stroke="#0F1B33" strokeWidth="1.2" />
          ))}
        </>
      )}
    </svg>
  );
}

export function Comparaison() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const goBack = useGameBack();

  const [round, setRound] = useState(0);
  const [data, setData] = useState<Round>(() => buildRound(0));
  const [picked, setPicked] = useState<Sym | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [best, setBest] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const v = Number(window.localStorage.getItem(STORAGE_KEY));
    if (Number.isFinite(v) && v > 0) setBest(v);
  }, []);

  const pick = (s: Sym) => {
    if (picked !== null) return;
    setPicked(s);
    const good = s === data.answer;
    if (good) {
      setScore((v) => v + 1);
      try { confetti({ particleCount: 25, spread: 50, origin: { y: 0.6 } }); } catch { /* ignore */ }
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
        setData(buildRound(round + 1));
        setPicked(null);
      }
    }, 900);
  };

  const restart = () => {
    setRound(0); setData(buildRound(0)); setPicked(null); setScore(0); setDone(false);
  };

  if (done) {
    const stars = score >= 11 ? 3 : score >= 8 ? 2 : 1;
    return (
      <div className="min-h-screen bg-cream dark:bg-surface-2 flex items-center justify-center px-5">
        <MascotCelebration trigger={score === TOTAL_ROUNDS} locale={isAr ? "ar" : "fr"} />
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">{score >= 11 ? "🏆" : score >= 8 ? "🌟" : "✨"}</div>
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

  const symbols: { s: Sym; dir: "left" | "right" | "flat" }[] = [
    { s: "<", dir: "right" },
    { s: "=", dir: "flat" },
    { s: ">", dir: "left" },
  ];

  return (
    <div className="min-h-screen bg-cream dark:bg-surface-2 flex flex-col">
      <header className="px-5 py-4 flex items-center justify-between bg-surface border-b border-line">
        <button onClick={goBack} className="w-10 h-10 rounded-full bg-surface border border-pale-blue flex items-center justify-center text-navy" aria-label={isAr ? "رجوع" : "Retour"}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h1 className="text-base md:text-lg font-bold text-navy">
          {isAr ? "قارن الأعداد" : "Compare les nombres"} <span className="text-xl">🐊</span>
        </h1>
        <div className="text-xs font-bold text-fg-soft">{round + 1}/{TOTAL_ROUNDS}</div>
      </header>

      <main className="flex-1 px-5 py-6 max-w-md mx-auto w-full flex flex-col justify-center">
        <p className="text-sm md:text-base text-fg-soft text-center mb-6">
          {isAr ? "التمساح يأكل دائمًا العدد الأكبر !" : "Le crocodile mange toujours le plus grand nombre !"}
        </p>

        {/* The comparison, LTR always (numbers) */}
        <div dir="ltr" className="flex items-center justify-center gap-4 mb-8">
          <span className="text-5xl md:text-6xl font-bold text-navy tabular-nums">{data.a}</span>
          <span className={`text-5xl font-bold w-16 text-center ${
            picked === null ? "text-line" : picked === data.answer ? "text-emerald-600" : "text-red-500"
          }`}>
            {picked ?? "?"}
          </span>
          <span className="text-5xl md:text-6xl font-bold text-navy tabular-nums">{data.b}</span>
        </div>

        <div dir="ltr" className="grid grid-cols-3 gap-3">
          {symbols.map(({ s, dir }) => {
            const state =
              picked === null ? "idle"
              : s === data.answer ? "good"
              : s === picked ? "bad"
              : "idle";
            return (
              <button
                key={s}
                onClick={() => pick(s)}
                disabled={picked !== null}
                className={`rounded-2xl border-4 py-3 flex flex-col items-center gap-1 transition active:scale-95 ${
                  state === "good" ? "bg-emerald-100 border-emerald-500"
                  : state === "bad" ? "bg-red-100 border-red-400"
                  : "bg-surface border-pale-blue hover:border-gold"
                }`}
              >
                <Croc dir={dir} />
                <span className="text-2xl font-bold text-navy">{s}</span>
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
