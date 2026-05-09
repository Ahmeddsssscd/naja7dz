"use client";

/**
 * Transports — sort 12 vehicles into 3 categories: air, land, sea.
 *
 * Each round shows one vehicle (inline-SVG illustration) with 3 zone
 * buttons. Quick game: 10 rounds, instant feedback, stars at the end.
 */

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { useGameBack } from "./useGameBack";
import { MascotCelebration } from "@/components/app/MascotCelebration";
import confetti from "canvas-confetti";

type Mode = "air" | "land" | "sea";

interface Vehicle {
  k: string;
  fr: string; ar: string;
  mode: Mode;
  draw: () => React.ReactElement;
}

const MODES: { key: Mode; fr: string; ar: string; bg: string; emoji: string }[] = [
  { key: "air",  fr: "Air",  ar: "جو",  bg: "bg-blue-100 text-blue-900",      emoji: "✈️" },
  { key: "land", fr: "Terre", ar: "بر",  bg: "bg-amber-100 text-amber-900",   emoji: "🚗" },
  { key: "sea",  fr: "Mer",  ar: "بحر", bg: "bg-cyan-100 text-cyan-900",      emoji: "🚢" },
];

function Bg({ tint }: { tint: string }) { return <rect x="0" y="0" width="200" height="200" rx="20" fill={tint} />; }

const VEHICLES: Vehicle[] = [
  // ===== AIR =====
  { k: "plane", fr: "Avion", ar: "طائرة", mode: "air", draw: () => (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <Bg tint="#DBEAFE" />
      <path d="M30 100 L100 80 L170 95 L170 105 L100 110 L40 130 Z" fill="#fff" stroke="#0F1B33" strokeWidth="3" />
      <path d="M100 80 L120 50 L130 80 Z" fill="#fff" stroke="#0F1B33" strokeWidth="3" />
      <path d="M100 110 L120 140 L130 110 Z" fill="#fff" stroke="#0F1B33" strokeWidth="3" />
      <circle cx="155" cy="98" r="3" fill="#3B82F6" />
      <circle cx="145" cy="100" r="3" fill="#3B82F6" />
    </svg>
  )},
  { k: "helicopter", fr: "Hélicoptère", ar: "مروحية", mode: "air", draw: () => (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <Bg tint="#DBEAFE" />
      <line x1="20" y1="60" x2="180" y2="60" stroke="#0F1B33" strokeWidth="4" strokeLinecap="round" />
      <line x1="100" y1="55" x2="100" y2="80" stroke="#0F1B33" strokeWidth="4" />
      <ellipse cx="100" cy="110" rx="55" ry="30" fill="#EF4444" stroke="#0F1B33" strokeWidth="3" />
      <circle cx="120" cy="105" r="14" fill="#fff" stroke="#0F1B33" strokeWidth="2" />
      <path d="M155 110 L185 110" stroke="#0F1B33" strokeWidth="3" strokeLinecap="round" />
      <path d="M180 105 L185 110 L180 115" fill="#EF4444" stroke="#0F1B33" strokeWidth="2" />
      <line x1="80" y1="140" x2="120" y2="140" stroke="#0F1B33" strokeWidth="3" />
      <line x1="80" y1="140" x2="80" y2="155" stroke="#0F1B33" strokeWidth="3" />
      <line x1="120" y1="140" x2="120" y2="155" stroke="#0F1B33" strokeWidth="3" />
      <line x1="70" y1="155" x2="130" y2="155" stroke="#0F1B33" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )},
  { k: "balloon", fr: "Montgolfière", ar: "منطاد", mode: "air", draw: () => (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <Bg tint="#DBEAFE" />
      <path d="M70 100 Q70 30 100 30 Q130 30 130 100 Q130 130 100 130 Q70 130 70 100 Z" fill="#EF4444" stroke="#0F1B33" strokeWidth="3" />
      <path d="M85 30 Q85 100 85 130" fill="none" stroke="#0F1B33" strokeWidth="2" />
      <path d="M115 30 Q115 100 115 130" fill="none" stroke="#0F1B33" strokeWidth="2" />
      <line x1="80" y1="130" x2="85" y2="160" stroke="#0F1B33" strokeWidth="2" />
      <line x1="120" y1="130" x2="115" y2="160" stroke="#0F1B33" strokeWidth="2" />
      <rect x="80" y="160" width="40" height="22" rx="3" fill="#92400E" stroke="#0F1B33" strokeWidth="2.5" />
    </svg>
  )},
  { k: "rocket", fr: "Fusée", ar: "صاروخ", mode: "air", draw: () => (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <Bg tint="#0F1B33" />
      {[20, 40, 80, 130, 165, 180].map((x, i) => (<circle key={i} cx={x} cy={i * 20 + 30} r="2" fill="#fff" />))}
      <path d="M100 30 Q120 60 120 110 L120 150 L80 150 L80 110 Q80 60 100 30 Z" fill="#fff" stroke="#3B82F6" strokeWidth="3" />
      <circle cx="100" cy="80" r="10" fill="#3B82F6" />
      <path d="M80 110 L60 150 L80 150 Z" fill="#EF4444" stroke="#0F1B33" strokeWidth="2" />
      <path d="M120 110 L140 150 L120 150 Z" fill="#EF4444" stroke="#0F1B33" strokeWidth="2" />
      <path d="M85 150 Q90 175 95 150 M100 150 Q103 180 106 150 M111 150 Q114 175 117 150" fill="#F59E0B" stroke="#EF4444" strokeWidth="1" />
    </svg>
  )},

  // ===== LAND =====
  { k: "car", fr: "Voiture", ar: "سيارة", mode: "land", draw: () => (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <Bg tint="#FEF3C7" />
      <rect x="30" y="100" width="140" height="35" rx="6" fill="#EF4444" stroke="#0F1B33" strokeWidth="3" />
      <path d="M55 100 L70 70 L130 70 L145 100 Z" fill="#FCA5A5" stroke="#0F1B33" strokeWidth="3" />
      <line x1="100" y1="70" x2="100" y2="100" stroke="#0F1B33" strokeWidth="2" />
      <circle cx="60" cy="138" r="14" fill="#0F1B33" />
      <circle cx="140" cy="138" r="14" fill="#0F1B33" />
      <circle cx="60" cy="138" r="6" fill="#fff" />
      <circle cx="140" cy="138" r="6" fill="#fff" />
    </svg>
  )},
  { k: "bus", fr: "Autobus", ar: "حافلة", mode: "land", draw: () => (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <Bg tint="#FEF3C7" />
      <rect x="20" y="60" width="160" height="80" rx="6" fill="#FCD34D" stroke="#0F1B33" strokeWidth="3" />
      {[40, 70, 100, 130, 160].map((x) => (<rect key={x} x={x - 10} y="75" width="20" height="20" fill="#DBEAFE" stroke="#0F1B33" strokeWidth="2" />))}
      <rect x="155" y="100" width="20" height="35" fill="#fff" stroke="#0F1B33" strokeWidth="2" />
      <circle cx="55" cy="148" r="13" fill="#0F1B33" />
      <circle cx="145" cy="148" r="13" fill="#0F1B33" />
    </svg>
  )},
  { k: "bike", fr: "Vélo", ar: "دراجة", mode: "land", draw: () => (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <Bg tint="#FEF3C7" />
      <circle cx="55" cy="130" r="28" fill="none" stroke="#0F1B33" strokeWidth="4" />
      <circle cx="145" cy="130" r="28" fill="none" stroke="#0F1B33" strokeWidth="4" />
      <line x1="55" y1="130" x2="100" y2="80" stroke="#EF4444" strokeWidth="4" />
      <line x1="100" y1="80" x2="145" y2="130" stroke="#EF4444" strokeWidth="4" />
      <line x1="100" y1="80" x2="100" y2="130" stroke="#EF4444" strokeWidth="4" />
      <line x1="100" y1="130" x2="55" y2="130" stroke="#EF4444" strokeWidth="4" />
      <circle cx="100" cy="130" r="5" fill="#0F1B33" />
      <line x1="145" y1="130" x2="135" y2="70" stroke="#0F1B33" strokeWidth="3" />
      <line x1="125" y1="65" x2="145" y2="75" stroke="#0F1B33" strokeWidth="4" />
    </svg>
  )},
  { k: "train", fr: "Train", ar: "قطار", mode: "land", draw: () => (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <Bg tint="#FEF3C7" />
      <rect x="20" y="80" width="160" height="60" rx="6" fill="#3B82F6" stroke="#0F1B33" strokeWidth="3" />
      <rect x="30" y="60" width="40" height="25" rx="3" fill="#3B82F6" stroke="#0F1B33" strokeWidth="3" />
      <rect x="80" y="90" width="20" height="25" fill="#DBEAFE" stroke="#0F1B33" strokeWidth="2" />
      <rect x="110" y="90" width="20" height="25" fill="#DBEAFE" stroke="#0F1B33" strokeWidth="2" />
      <rect x="140" y="90" width="20" height="25" fill="#DBEAFE" stroke="#0F1B33" strokeWidth="2" />
      <line x1="20" y1="155" x2="180" y2="155" stroke="#0F1B33" strokeWidth="3" />
      <circle cx="50" cy="148" r="8" fill="#0F1B33" />
      <circle cx="100" cy="148" r="8" fill="#0F1B33" />
      <circle cx="150" cy="148" r="8" fill="#0F1B33" />
    </svg>
  )},
  { k: "truck", fr: "Camion", ar: "شاحنة", mode: "land", draw: () => (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <Bg tint="#FEF3C7" />
      <rect x="20" y="70" width="100" height="70" fill="#fff" stroke="#0F1B33" strokeWidth="3" />
      <path d="M120 95 L160 95 L175 110 L175 140 L120 140 Z" fill="#EF4444" stroke="#0F1B33" strokeWidth="3" />
      <rect x="125" y="100" width="25" height="20" fill="#DBEAFE" stroke="#0F1B33" strokeWidth="2" />
      <circle cx="50" cy="148" r="11" fill="#0F1B33" />
      <circle cx="100" cy="148" r="11" fill="#0F1B33" />
      <circle cx="155" cy="148" r="11" fill="#0F1B33" />
    </svg>
  )},

  // ===== SEA =====
  { k: "boat", fr: "Bateau", ar: "قارب", mode: "sea", draw: () => (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <Bg tint="#7DD3FC" />
      <path d="M0 130 Q50 122 100 130 T200 130 L200 145 L0 145 Z" fill="#3B82F6" />
      <path d="M40 110 L160 110 L150 140 L50 140 Z" fill="#EF4444" stroke="#0F1B33" strokeWidth="3" />
      <line x1="100" y1="40" x2="100" y2="115" stroke="#0F1B33" strokeWidth="3" />
      <path d="M100 50 L100 100 L60 100 Z" fill="#fff" stroke="#0F1B33" strokeWidth="2" />
      <path d="M105 55 L105 95 L140 95 Z" fill="#fff" stroke="#0F1B33" strokeWidth="2" />
    </svg>
  )},
  { k: "ship", fr: "Navire", ar: "سفينة", mode: "sea", draw: () => (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <Bg tint="#7DD3FC" />
      <path d="M0 130 Q50 122 100 130 T200 130 L200 145 L0 145 Z" fill="#3B82F6" />
      <path d="M20 110 L180 110 L160 140 L40 140 Z" fill="#fff" stroke="#0F1B33" strokeWidth="3" />
      <rect x="55" y="80" width="90" height="32" fill="#EF4444" stroke="#0F1B33" strokeWidth="3" />
      <rect x="80" y="60" width="40" height="22" fill="#fff" stroke="#0F1B33" strokeWidth="3" />
      <rect x="65" y="92" width="10" height="10" fill="#FCD34D" stroke="#0F1B33" strokeWidth="1" />
      <rect x="85" y="92" width="10" height="10" fill="#FCD34D" stroke="#0F1B33" strokeWidth="1" />
      <rect x="105" y="92" width="10" height="10" fill="#FCD34D" stroke="#0F1B33" strokeWidth="1" />
      <rect x="125" y="92" width="10" height="10" fill="#FCD34D" stroke="#0F1B33" strokeWidth="1" />
      <rect x="98" y="40" width="6" height="22" fill="#0F1B33" />
      <path d="M105 45 L120 45 L120 55 L105 55 Z" fill="#EF4444" />
    </svg>
  )},
  { k: "submarine", fr: "Sous-marin", ar: "غواصة", mode: "sea", draw: () => (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <Bg tint="#1E40AF" />
      <ellipse cx="100" cy="110" rx="65" ry="25" fill="#FCD34D" stroke="#0F1B33" strokeWidth="3" />
      <rect x="85" y="80" width="30" height="20" fill="#FCD34D" stroke="#0F1B33" strokeWidth="3" />
      <rect x="95" y="60" width="10" height="22" fill="#0F1B33" />
      <circle cx="80" cy="110" r="6" fill="#0F1B33" />
      <circle cx="100" cy="110" r="6" fill="#0F1B33" />
      <circle cx="120" cy="110" r="6" fill="#0F1B33" />
      <path d="M165 105 L185 95 L185 125 L165 115 Z" fill="#FCD34D" stroke="#0F1B33" strokeWidth="2" />
      {[20, 40, 60].map((x, i) => (<circle key={i} cx={x} cy={i * 30 + 40} r="2" fill="#fff" />))}
    </svg>
  )},
];

const STORAGE_KEY = "najah:transports:best";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const TOTAL = 10;

export function Transports() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const goBack = useGameBack();

  const [rounds, setRounds] = useState(() => shuffle(VEHICLES).slice(0, TOTAL));
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<Mode | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [best, setBest] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const v = Number(window.localStorage.getItem(STORAGE_KEY));
    if (Number.isFinite(v) && v > 0) setBest(v);
  }, []);

  const current = rounds[idx];

  const onPick = (m: Mode) => {
    if (picked) return;
    setPicked(m);
    if (m === current.mode) {
      setScore((s) => s + 1);
      try { confetti({ particleCount: 25, spread: 50, origin: { y: 0.6 } }); } catch { /* ignore */ }
    }
    window.setTimeout(() => {
      setPicked(null);
      if (idx + 1 >= rounds.length) setDone(true);
      else setIdx((i) => i + 1);
    }, 800);
  };

  useEffect(() => {
    if (!done) return;
    if (best === null || score > best) {
      setBest(score);
      try { window.localStorage.setItem(STORAGE_KEY, String(score)); } catch { /* ignore */ }
    }
    if (score === rounds.length) {
      try { confetti({ particleCount: 140, spread: 110, colors: ["#D4A72C", "#0F1B33", "#1AD18C"] }); } catch { /* ignore */ }
    }
  }, [done]); // eslint-disable-line react-hooks/exhaustive-deps

  const restart = () => {
    setRounds(shuffle(VEHICLES).slice(0, TOTAL));
    setIdx(0); setPicked(null); setScore(0); setDone(false);
  };

  if (done) {
    const stars = score >= 9 ? 3 : score >= 7 ? 2 : 1;
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-5">
        <MascotCelebration trigger={score === rounds.length} locale={isAr ? "ar" : "fr"} />
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">{score === rounds.length ? "🏆" : score >= 7 ? "🌟" : "✨"}</div>
          <h1 className="text-3xl font-bold text-navy mb-2">{isAr ? "أحسنت !" : "Bravo !"}</h1>
          <div className="text-2xl mb-2">{"★".repeat(stars)}<span className="text-line">{"☆".repeat(3 - stars)}</span></div>
          <div className="text-5xl font-bold text-gold my-2">{score}<span className="text-2xl text-fg-soft"> / {rounds.length}</span></div>
          {best !== null && (<div className="text-xs text-fg-soft mt-1">{isAr ? "أفضل نتيجة" : "Record"} : {best}/{rounds.length}</div>)}
          <div className="flex gap-3 mt-6">
            <button onClick={goBack} className="btn btn-outline flex-1">{isAr ? "خروج" : "Quitter"}</button>
            <button onClick={restart} className="btn btn-primary flex-1">{isAr ? "إعادة" : "Rejouer"}</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="px-5 py-4 flex items-center justify-between bg-white border-b border-pale-blue">
        <button onClick={goBack} className="w-10 h-10 rounded-full bg-white border border-pale-blue flex items-center justify-center text-navy" aria-label={isAr ? "رجوع" : "Retour"}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h1 className="text-base md:text-lg font-bold text-navy">
          {isAr ? "وسائل النقل" : "Les transports"} <span className="text-xl">🚀</span>
        </h1>
        <div className="text-xs font-bold text-fg-soft">{idx + 1}/{rounds.length} · ⭐{score}</div>
      </header>

      <main className="flex-1 px-5 py-6 max-w-md md:max-w-3xl mx-auto w-full">
        <p className="text-sm md:text-base text-fg-soft text-center mb-4">
          {isAr ? "أين يسير هذا ؟" : "Où circule-t-il ?"}
        </p>

        <div className="bg-white border-4 border-navy rounded-3xl p-4 md:p-6 mb-6 shadow-card mx-auto" style={{ maxWidth: 360 }}>
          <div className="aspect-square">{current.draw()}</div>
          <div className="mt-3 text-center">
            <div className="text-xl md:text-2xl font-bold text-navy">{isAr ? current.ar : current.fr}</div>
            <div className="text-sm font-ar text-fg-soft" dir="rtl">{isAr ? current.fr : current.ar}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto">
          {MODES.map((m) => {
            const isPicked = picked === m.key;
            const showCorrect = picked && m.key === current.mode;
            const showWrong = isPicked && m.key !== current.mode;
            return (
              <button
                key={m.key}
                onClick={() => onPick(m.key)}
                disabled={!!picked}
                className={`${m.bg} py-5 px-3 rounded-2xl border-4 font-bold text-lg transition active:scale-95 flex flex-col items-center gap-1 ${
                  showCorrect ? "border-emerald-500 ring-4 ring-emerald-200"
                  : showWrong ? "border-red-500 ring-4 ring-red-200"
                  : picked ? "border-pale-blue opacity-60"
                  : "border-pale-blue hover:border-gold"
                }`}
              >
                <span className="text-3xl">{m.emoji}</span>
                <span>{isAr ? m.ar : m.fr}</span>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
