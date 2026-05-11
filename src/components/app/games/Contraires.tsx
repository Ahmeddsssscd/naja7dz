"use client";

/**
 * Contraires — match each word to its opposite.
 *
 * 6 pairs per round (12 chips total). Kid taps one chip then the matching
 * chip on the other side; if it's the right opposite they both stay
 * highlighted in green and become non-interactive. After 5 rounds we show
 * stars + best score. Pairs are reshuffled each round so the same kid can
 * play multiple sessions without memorising positions.
 *
 * Each chip carries an SVG illustration so non-readers can play by image.
 */

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { useGameBack } from "./useGameBack";
import { MascotCelebration } from "@/components/app/MascotCelebration";
import confetti from "canvas-confetti";

interface Pair {
  k: string;
  a_fr: string; a_ar: string; a_draw: () => React.ReactElement;
  b_fr: string; b_ar: string; b_draw: () => React.ReactElement;
}

// Tiny illustration helpers
const Sun = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <circle cx="50" cy="50" r="22" fill="#F59E0B" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
      <line key={i} x1={50 + Math.cos(a * Math.PI / 180) * 28} y1={50 + Math.sin(a * Math.PI / 180) * 28}
        x2={50 + Math.cos(a * Math.PI / 180) * 40} y2={50 + Math.sin(a * Math.PI / 180) * 40}
        stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
    ))}
  </svg>
);
const Moon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <path d="M50 20 A30 30 0 1 0 80 50 A22 22 0 0 1 50 20 Z" fill="#94A3B8" stroke="#0F1B33" strokeWidth="2" />
    <circle cx="55" cy="35" r="3" fill="#0F1B33" />
    <circle cx="62" cy="48" r="2" fill="#0F1B33" />
  </svg>
);
const Big = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <circle cx="50" cy="55" r="35" fill="#3B82F6" stroke="#0F1B33" strokeWidth="3" />
  </svg>
);
const Small = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <circle cx="50" cy="60" r="12" fill="#3B82F6" stroke="#0F1B33" strokeWidth="3" />
  </svg>
);
const Hot = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <path d="M50 25 Q42 50 50 70 Q58 50 50 25 Z" fill="#EF4444" stroke="#0F1B33" strokeWidth="2" />
    <text x="50" y="92" textAnchor="middle" fontSize="14" fill="#0F1B33">🔥</text>
  </svg>
);
const Cold = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <path d="M50 20 V80 M30 30 L70 70 M30 70 L70 30 M50 30 L42 38 M50 30 L58 38 M50 70 L42 62 M50 70 L58 62" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round" />
  </svg>
);
const Up = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <path d="M50 75 V30 M30 50 L50 30 L70 50" fill="none" stroke="#10B981" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Down = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <path d="M50 25 V70 M30 50 L50 70 L70 50" fill="none" stroke="#EF4444" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const FastCar = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <rect x="20" y="50" width="55" height="20" rx="6" fill="#EF4444" stroke="#0F1B33" strokeWidth="2" />
    <circle cx="32" cy="72" r="6" fill="#0F1B33" /><circle cx="65" cy="72" r="6" fill="#0F1B33" />
    <line x1="0" y1="55" x2="18" y2="55" stroke="#0F1B33" strokeWidth="2" /><line x1="0" y1="62" x2="15" y2="62" stroke="#0F1B33" strokeWidth="2" />
  </svg>
);
const SlowTurtle = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <ellipse cx="50" cy="60" rx="30" ry="18" fill="#16A34A" stroke="#0F1B33" strokeWidth="2.5" />
    <circle cx="78" cy="55" r="9" fill="#16A34A" stroke="#0F1B33" strokeWidth="2" />
    <circle cx="32" cy="78" r="5" fill="#16A34A" /><circle cx="68" cy="78" r="5" fill="#16A34A" />
    <path d="M40 55 L60 55 M45 50 L55 50" stroke="#0F1B33" strokeWidth="1.5" />
  </svg>
);
const Happy = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <circle cx="50" cy="50" r="35" fill="#FCD34D" stroke="#0F1B33" strokeWidth="3" />
    <circle cx="40" cy="42" r="4" fill="#0F1B33" /><circle cx="60" cy="42" r="4" fill="#0F1B33" />
    <path d="M35 60 Q50 75 65 60" fill="none" stroke="#0F1B33" strokeWidth="3" strokeLinecap="round" />
  </svg>
);
const Sad = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <circle cx="50" cy="50" r="35" fill="#93C5FD" stroke="#0F1B33" strokeWidth="3" />
    <circle cx="40" cy="42" r="4" fill="#0F1B33" /><circle cx="60" cy="42" r="4" fill="#0F1B33" />
    <path d="M35 65 Q50 55 65 65" fill="none" stroke="#0F1B33" strokeWidth="3" strokeLinecap="round" />
    <path d="M40 50 L40 55" stroke="#3B82F6" strokeWidth="3" />
  </svg>
);
const Open = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <rect x="20" y="20" width="50" height="60" rx="4" fill="#FDE68A" stroke="#0F1B33" strokeWidth="3" transform="rotate(-15 45 50)" />
    <circle cx="60" cy="50" r="3" fill="#0F1B33" />
  </svg>
);
const Closed = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <rect x="25" y="20" width="50" height="60" rx="4" fill="#FCD34D" stroke="#0F1B33" strokeWidth="3" />
    <circle cx="63" cy="50" r="3" fill="#0F1B33" />
  </svg>
);
const Full = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <path d="M30 35 L30 80 Q50 88 70 80 L70 35 Z" fill="#fff" stroke="#0F1B33" strokeWidth="3" />
    <rect x="30" y="40" width="40" height="40" fill="#3B82F6" />
  </svg>
);
const Empty = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <path d="M30 35 L30 80 Q50 88 70 80 L70 35 Z" fill="#fff" stroke="#0F1B33" strokeWidth="3" />
  </svg>
);

const PAIRS: Pair[] = [
  { k: "day-night",   a_fr: "Jour",    a_ar: "نهار", a_draw: Sun,        b_fr: "Nuit",   b_ar: "ليل",  b_draw: Moon },
  { k: "big-small",   a_fr: "Grand",   a_ar: "كبير", a_draw: Big,        b_fr: "Petit",  b_ar: "صغير", b_draw: Small },
  { k: "hot-cold",    a_fr: "Chaud",   a_ar: "حار",  a_draw: Hot,        b_fr: "Froid",  b_ar: "بارد", b_draw: Cold },
  { k: "up-down",     a_fr: "Haut",    a_ar: "فوق", a_draw: Up,         b_fr: "Bas",    b_ar: "تحت", b_draw: Down },
  { k: "fast-slow",   a_fr: "Rapide",  a_ar: "سريع", a_draw: FastCar,    b_fr: "Lent",   b_ar: "بطيء", b_draw: SlowTurtle },
  { k: "happy-sad",   a_fr: "Heureux", a_ar: "سعيد", a_draw: Happy,      b_fr: "Triste", b_ar: "حزين", b_draw: Sad },
  { k: "open-closed", a_fr: "Ouvert",  a_ar: "مفتوح",a_draw: Open,       b_fr: "Fermé",  b_ar: "مغلق", b_draw: Closed },
  { k: "full-empty",  a_fr: "Plein",   a_ar: "ممتلئ",a_draw: Full,       b_fr: "Vide",   b_ar: "فارغ", b_draw: Empty },
];

const STORAGE_KEY = "najah:contraires:best";

interface Chip {
  pairKey: string;
  side: "a" | "b";
  fr: string; ar: string;
  draw: () => React.ReactElement;
  matched: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildRound(): Chip[] {
  const sample = shuffle(PAIRS).slice(0, 6);
  const chips: Chip[] = [];
  sample.forEach((p) => {
    chips.push({ pairKey: p.k, side: "a", fr: p.a_fr, ar: p.a_ar, draw: p.a_draw, matched: false });
    chips.push({ pairKey: p.k, side: "b", fr: p.b_fr, ar: p.b_ar, draw: p.b_draw, matched: false });
  });
  return shuffle(chips);
}

const TOTAL_ROUNDS = 5;

export function Contraires() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const goBack = useGameBack();

  const [round, setRound] = useState(0);
  const [chips, setChips] = useState<Chip[]>(() => buildRound());
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [done, setDone] = useState(false);
  const [best, setBest] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const v = Number(window.localStorage.getItem(STORAGE_KEY));
    if (Number.isFinite(v) && v > 0) setBest(v);
  }, []);

  const allMatched = chips.every((c) => c.matched);

  useEffect(() => {
    if (!allMatched) return;
    if (round + 1 >= TOTAL_ROUNDS) {
      setDone(true);
      const final = score + 6;
      setScore(final);
      if (best === null || final > best) {
        setBest(final);
        try { window.localStorage.setItem(STORAGE_KEY, String(final)); } catch { /* ignore */ }
      }
      if (misses === 0) {
        try { confetti({ particleCount: 140, spread: 110, colors: ["#D4A72C", "#0F1B33", "#1AD18C"] }); } catch { /* ignore */ }
      }
    } else {
      setScore((s) => s + 6);
      setRound((r) => r + 1);
      setChips(buildRound());
      setSelected(null);
    }
  }, [allMatched]); // eslint-disable-line react-hooks/exhaustive-deps

  const onTap = (idx: number) => {
    if (done || chips[idx].matched) return;
    if (selected === null) { setSelected(idx); return; }
    if (selected === idx) { setSelected(null); return; }
    const a = chips[selected];
    const b = chips[idx];
    if (a.pairKey === b.pairKey && a.side !== b.side) {
      setChips((cs) => cs.map((c, i) => (i === selected || i === idx ? { ...c, matched: true } : c)));
      try { confetti({ particleCount: 25, spread: 50, origin: { y: 0.55 } }); } catch { /* ignore */ }
    } else {
      setMisses((m) => m + 1);
    }
    setSelected(null);
  };

  const restart = () => {
    setRound(0); setChips(buildRound()); setSelected(null); setScore(0); setMisses(0); setDone(false);
  };

  if (done) {
    const total = TOTAL_ROUNDS * 6;
    const stars = misses === 0 ? 3 : misses <= 4 ? 2 : 1;
    return (
      <div className="min-h-screen bg-cream dark:bg-surface-2 flex items-center justify-center px-5">
        <MascotCelebration trigger={misses === 0} locale={isAr ? "ar" : "fr"} />
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">{misses === 0 ? "🏆" : misses <= 4 ? "🌟" : "✨"}</div>
          <h1 className="text-3xl font-bold text-navy mb-2">{isAr ? "أحسنت !" : "Bravo !"}</h1>
          <div className="text-2xl mb-2">{"★".repeat(stars)}<span className="text-line">{"☆".repeat(3 - stars)}</span></div>
          <div className="text-5xl font-bold text-gold my-2">{score}<span className="text-2xl text-fg-soft"> / {total}</span></div>
          <div className="text-xs text-fg-soft mt-1">{isAr ? "أخطاء" : "Erreurs"} : {misses}</div>
          {best !== null && (
            <div className="text-xs text-fg-soft mt-1">{isAr ? "أفضل نتيجة" : "Record"} : {best}/{total}</div>
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
          {isAr ? "الأضداد" : "Les contraires"} <span className="text-xl">↔️</span>
        </h1>
        <div className="text-xs font-bold text-fg-soft">{round + 1}/{TOTAL_ROUNDS}</div>
      </header>

      <main className="flex-1 px-5 py-6 max-w-md md:max-w-3xl mx-auto w-full">
        <p className="text-sm md:text-base text-fg-soft text-center mb-4">
          {isAr ? "اربط كلّ كلمة بضدها" : "Relie chaque mot à son contraire"}
        </p>

        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
          {chips.map((c, i) => (
            <button
              key={i}
              onClick={() => onTap(i)}
              disabled={c.matched}
              className={`rounded-2xl border-4 p-2 transition active:scale-95 ${
                c.matched ? "bg-emerald-100 border-emerald-500 opacity-70"
                : selected === i ? "bg-yellow-50 border-gold ring-4 ring-gold/30"
                : "bg-surface border-pale-blue hover:border-gold"
              }`}
            >
              <div className="aspect-square mb-1">{c.draw()}</div>
              <div className="text-sm md:text-base font-bold text-navy text-center leading-tight">
                {isAr ? c.ar : c.fr}
              </div>
            </button>
          ))}
        </div>

        <div className="text-center text-xs text-fg-soft mt-5">
          {isAr ? "الإجابات الصحيحة" : "Bonnes paires"} · <span className="font-bold text-emerald-700">{score + chips.filter((c) => c.matched).length / 2}</span> · {isAr ? "أخطاء" : "Erreurs"} · <span className="font-bold text-red-600">{misses}</span>
        </div>
      </main>
    </div>
  );
}
