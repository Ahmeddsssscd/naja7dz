"use client";

/**
 * Saisons — match items (clothing, weather, food) to the right season.
 *
 * Each round shows one item (rendered as an inline SVG illustration, big
 * and clear) and 4 season cards. Kid taps the season they think the item
 * belongs to. We mark right/wrong with green/red ring and explain briefly.
 *
 * 12 items, drawn from 4 seasons × 3 items each. Kids learn vocabulary +
 * cultural seasonal patterns (Algerian winters are wet not snowy, summers
 * are very hot — content reflects that).
 */

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { useGameBack } from "./useGameBack";
import { MascotCelebration } from "@/components/app/MascotCelebration";
import confetti from "canvas-confetti";

type Season = "winter" | "spring" | "summer" | "autumn";

interface Item {
  /** unique key */
  k: string;
  fr: string;
  ar: string;
  season: Season;
  /** SVG illustration in 200×200 viewbox */
  draw: () => React.ReactElement;
}

const SEASONS: { key: Season; fr: string; ar: string; bg: string; emoji: string }[] = [
  { key: "winter", fr: "Hiver",     ar: "الشتاء",  bg: "bg-blue-100 text-blue-900",      emoji: "❄️" },
  { key: "spring", fr: "Printemps", ar: "الربيع",  bg: "bg-emerald-100 text-emerald-900", emoji: "🌸" },
  { key: "summer", fr: "Été",       ar: "الصيف",   bg: "bg-amber-100 text-amber-900",     emoji: "☀️" },
  { key: "autumn", fr: "Automne",   ar: "الخريف",  bg: "bg-orange-100 text-orange-900",   emoji: "🍂" },
];

// Tiny helper components for the SVG illustrations (keeps each item ~10
// lines instead of duplicating boilerplate)
function Sky({ tint }: { tint: string }) {
  return <rect x="0" y="0" width="200" height="200" rx="20" fill={tint} />;
}

const ITEMS: Item[] = [
  // ===== WINTER =====
  {
    k: "scarf", fr: "Une écharpe", ar: "وشاح", season: "winter",
    draw: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <Sky tint="#DBEAFE" />
        <path d="M60 80 L140 80 L150 130 L120 145 L80 145 L50 130 Z" fill="#E11D48" stroke="#0F1B33" strokeWidth="4" />
        <path d="M50 130 L40 175 L70 165 Z" fill="#E11D48" stroke="#0F1B33" strokeWidth="4" />
        <path d="M150 130 L160 175 L130 165 Z" fill="#E11D48" stroke="#0F1B33" strokeWidth="4" />
        {/* fringe */}
        <path d="M48 178 L52 188 M55 175 L60 188 M62 173 L66 188" stroke="#0F1B33" strokeWidth="2.5" />
      </svg>
    ),
  },
  {
    k: "umbrella", fr: "Un parapluie", ar: "مظلة", season: "winter",
    draw: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <Sky tint="#CBD5E1" />
        {/* rain */}
        <line x1="40" y1="20" x2="35" y2="40" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
        <line x1="160" y1="25" x2="155" y2="45" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
        <line x1="60" y1="30" x2="55" y2="50" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
        {/* canopy */}
        <path d="M30 110 Q100 30 170 110 Z" fill="#1F4F8F" stroke="#0F1B33" strokeWidth="4" />
        <path d="M30 110 Q60 100 75 110 M75 110 Q90 95 100 110 M100 110 Q115 95 125 110 M125 110 Q145 100 170 110" fill="none" stroke="#0F1B33" strokeWidth="2" />
        {/* handle */}
        <line x1="100" y1="110" x2="100" y2="170" stroke="#92400E" strokeWidth="6" strokeLinecap="round" />
        <path d="M100 170 Q100 185 115 185" fill="none" stroke="#92400E" strokeWidth="6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    k: "hot-soup", fr: "La chorba", ar: "الشربة", season: "winter",
    draw: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <Sky tint="#FEF3C7" />
        {/* steam */}
        <path d="M75 35 Q72 50 80 60 Q72 75 80 90" fill="none" stroke="#9CA3AF" strokeWidth="4" strokeLinecap="round" />
        <path d="M100 25 Q97 45 105 60 Q97 75 105 90" fill="none" stroke="#9CA3AF" strokeWidth="4" strokeLinecap="round" />
        <path d="M125 35 Q122 50 130 60 Q122 75 130 90" fill="none" stroke="#9CA3AF" strokeWidth="4" strokeLinecap="round" />
        {/* bowl */}
        <ellipse cx="100" cy="105" rx="70" ry="10" fill="#C53030" stroke="#0F1B33" strokeWidth="3" />
        <path d="M30 105 L45 165 Q100 175 155 165 L170 105" fill="#fff" stroke="#0F1B33" strokeWidth="3" />
        <ellipse cx="100" cy="115" rx="55" ry="8" fill="#DC2626" />
      </svg>
    ),
  },

  // ===== SPRING =====
  {
    k: "flower", fr: "Une fleur", ar: "زهرة", season: "spring",
    draw: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <Sky tint="#D1FAE5" />
        {/* stem */}
        <path d="M100 100 L100 175" stroke="#16A34A" strokeWidth="6" strokeLinecap="round" />
        <path d="M100 130 Q120 125 125 110" fill="#16A34A" />
        <path d="M100 145 Q80 142 75 128" fill="#16A34A" />
        {/* petals */}
        <circle cx="100" cy="65" r="20" fill="#F472B6" />
        <circle cx="75" cy="85" r="20" fill="#F472B6" />
        <circle cx="125" cy="85" r="20" fill="#F472B6" />
        <circle cx="100" cy="105" r="20" fill="#F472B6" />
        <circle cx="100" cy="85" r="14" fill="#FCD34D" stroke="#0F1B33" strokeWidth="2" />
      </svg>
    ),
  },
  {
    k: "butterfly", fr: "Un papillon", ar: "فراشة", season: "spring",
    draw: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <Sky tint="#D1FAE5" />
        {/* body */}
        <ellipse cx="100" cy="100" rx="6" ry="40" fill="#0F1B33" />
        {/* wings */}
        <path d="M100 80 Q60 50 40 90 Q50 120 100 100 Z" fill="#F59E0B" stroke="#0F1B33" strokeWidth="3" />
        <path d="M100 80 Q140 50 160 90 Q150 120 100 100 Z" fill="#F59E0B" stroke="#0F1B33" strokeWidth="3" />
        <path d="M100 100 Q60 130 50 160 Q90 150 100 120 Z" fill="#FBBF24" stroke="#0F1B33" strokeWidth="3" />
        <path d="M100 100 Q140 130 150 160 Q110 150 100 120 Z" fill="#FBBF24" stroke="#0F1B33" strokeWidth="3" />
        {/* spots */}
        <circle cx="65" cy="85" r="4" fill="#0F1B33" />
        <circle cx="135" cy="85" r="4" fill="#0F1B33" />
        {/* antennae */}
        <path d="M97 65 Q90 50 85 45" fill="none" stroke="#0F1B33" strokeWidth="3" strokeLinecap="round" />
        <path d="M103 65 Q110 50 115 45" fill="none" stroke="#0F1B33" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    k: "rainbow", fr: "Un arc-en-ciel", ar: "قوس قزح", season: "spring",
    draw: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <Sky tint="#DBEAFE" />
        <path d="M20 160 A80 80 0 0 1 180 160" fill="none" stroke="#EF4444" strokeWidth="14" />
        <path d="M30 160 A70 70 0 0 1 170 160" fill="none" stroke="#F59E0B" strokeWidth="14" />
        <path d="M40 160 A60 60 0 0 1 160 160" fill="none" stroke="#FCD34D" strokeWidth="14" />
        <path d="M50 160 A50 50 0 0 1 150 160" fill="none" stroke="#10B981" strokeWidth="14" />
        <path d="M60 160 A40 40 0 0 1 140 160" fill="none" stroke="#3B82F6" strokeWidth="14" />
        <path d="M70 160 A30 30 0 0 1 130 160" fill="none" stroke="#8B5CF6" strokeWidth="14" />
        <ellipse cx="20" cy="160" rx="15" ry="10" fill="#fff" />
        <ellipse cx="180" cy="160" rx="15" ry="10" fill="#fff" />
      </svg>
    ),
  },

  // ===== SUMMER =====
  {
    k: "sun", fr: "Le soleil", ar: "الشمس", season: "summer",
    draw: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <Sky tint="#FEF3C7" />
        <circle cx="100" cy="100" r="40" fill="#F59E0B" stroke="#0F1B33" strokeWidth="4" />
        {/* rays */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
          <line key={i}
            x1={100 + Math.cos(a * Math.PI / 180) * 50}
            y1={100 + Math.sin(a * Math.PI / 180) * 50}
            x2={100 + Math.cos(a * Math.PI / 180) * 75}
            y2={100 + Math.sin(a * Math.PI / 180) * 75}
            stroke="#F59E0B" strokeWidth="6" strokeLinecap="round"
          />
        ))}
        {/* face */}
        <circle cx="88" cy="92" r="4" fill="#0F1B33" />
        <circle cx="112" cy="92" r="4" fill="#0F1B33" />
        <path d="M85 110 Q100 122 115 110" fill="none" stroke="#0F1B33" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    k: "watermelon", fr: "Une pastèque", ar: "البطيخ", season: "summer",
    draw: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <Sky tint="#FEF3C7" />
        <path d="M30 130 A75 75 0 0 1 170 130 L150 140 L30 140 Z" fill="#16A34A" stroke="#0F1B33" strokeWidth="3" />
        <path d="M40 140 A70 70 0 0 1 160 140 Z" fill="#FB7185" stroke="#0F1B33" strokeWidth="3" />
        {/* seeds */}
        <ellipse cx="80" cy="110" rx="3" ry="6" fill="#0F1B33" />
        <ellipse cx="100" cy="100" rx="3" ry="6" fill="#0F1B33" />
        <ellipse cx="120" cy="115" rx="3" ry="6" fill="#0F1B33" />
        <ellipse cx="65" cy="125" rx="3" ry="6" fill="#0F1B33" />
        <ellipse cx="135" cy="125" rx="3" ry="6" fill="#0F1B33" />
      </svg>
    ),
  },
  {
    k: "beach", fr: "La plage", ar: "الشاطئ", season: "summer",
    draw: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <Sky tint="#7DD3FC" />
        {/* sand */}
        <rect x="0" y="140" width="200" height="60" fill="#FCD34D" />
        {/* sea waves */}
        <path d="M0 130 Q50 120 100 130 T200 130 L200 140 L0 140 Z" fill="#3B82F6" />
        {/* sun */}
        <circle cx="40" cy="50" r="20" fill="#F59E0B" />
        {/* parasol */}
        <path d="M130 100 Q150 60 170 100 Z" fill="#E11D48" stroke="#0F1B33" strokeWidth="3" />
        <line x1="150" y1="100" x2="150" y2="160" stroke="#0F1B33" strokeWidth="4" />
        {/* ball */}
        <circle cx="80" cy="160" r="14" fill="#fff" stroke="#0F1B33" strokeWidth="2" />
        <path d="M80 146 Q70 160 80 174 M80 146 Q90 160 80 174" fill="none" stroke="#E11D48" strokeWidth="2" />
      </svg>
    ),
  },

  // ===== AUTUMN =====
  {
    k: "leaf", fr: "Une feuille", ar: "ورقة", season: "autumn",
    draw: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <Sky tint="#FED7AA" />
        <path d="M100 30 Q160 80 100 170 Q40 80 100 30 Z" fill="#EA580C" stroke="#0F1B33" strokeWidth="3" />
        <line x1="100" y1="35" x2="100" y2="170" stroke="#0F1B33" strokeWidth="2" />
        <line x1="100" y1="80" x2="65" y2="100" stroke="#0F1B33" strokeWidth="1.5" />
        <line x1="100" y1="80" x2="135" y2="100" stroke="#0F1B33" strokeWidth="1.5" />
        <line x1="100" y1="120" x2="60" y2="140" stroke="#0F1B33" strokeWidth="1.5" />
        <line x1="100" y1="120" x2="140" y2="140" stroke="#0F1B33" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    k: "pumpkin", fr: "Une citrouille", ar: "اليقطين", season: "autumn",
    draw: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <Sky tint="#FED7AA" />
        <ellipse cx="100" cy="120" rx="65" ry="50" fill="#F97316" stroke="#0F1B33" strokeWidth="3" />
        <ellipse cx="100" cy="120" rx="22" ry="50" fill="none" stroke="#0F1B33" strokeWidth="2" />
        <ellipse cx="65" cy="120" rx="20" ry="48" fill="none" stroke="#0F1B33" strokeWidth="2" />
        <ellipse cx="135" cy="120" rx="20" ry="48" fill="none" stroke="#0F1B33" strokeWidth="2" />
        {/* stem */}
        <path d="M95 70 L100 50 Q110 55 105 75 Z" fill="#16A34A" stroke="#0F1B33" strokeWidth="2" />
      </svg>
    ),
  },
  {
    k: "tree-bare", fr: "Un arbre nu", ar: "شجرة عارية", season: "autumn",
    draw: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <Sky tint="#FED7AA" />
        {/* trunk */}
        <path d="M85 175 L90 100 L85 60 L100 50 L115 60 L110 100 L115 175 Z" fill="#92400E" stroke="#0F1B33" strokeWidth="3" />
        {/* branches */}
        <path d="M90 100 Q70 90 50 70" fill="none" stroke="#92400E" strokeWidth="5" strokeLinecap="round" />
        <path d="M110 100 Q130 90 150 70" fill="none" stroke="#92400E" strokeWidth="5" strokeLinecap="round" />
        <path d="M95 75 L80 50" fill="none" stroke="#92400E" strokeWidth="4" strokeLinecap="round" />
        <path d="M105 75 L120 50" fill="none" stroke="#92400E" strokeWidth="4" strokeLinecap="round" />
        {/* falling leaves */}
        <path d="M40 80 Q43 75 45 80 Q43 85 40 80" fill="#EA580C" />
        <path d="M155 90 Q158 85 160 90 Q158 95 155 90" fill="#F59E0B" />
        <path d="M60 130 Q63 125 65 130 Q63 135 60 130" fill="#EA580C" />
      </svg>
    ),
  },
];

const STORAGE_KEY = "najah:saisons:best";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function Saisons() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const goBack = useGameBack();

  const [rounds, setRounds] = useState(() => shuffle(ITEMS).slice(0, 10));
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<Season | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [best, setBest] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = Number(window.localStorage.getItem(STORAGE_KEY));
    if (Number.isFinite(saved) && saved > 0) setBest(saved);
  }, []);

  const current = rounds[idx];

  const onPick = (s: Season) => {
    if (picked) return;
    setPicked(s);
    if (s === current.season) {
      setScore((sc) => sc + 1);
      try { confetti({ particleCount: 25, spread: 50, origin: { y: 0.6 } }); } catch { /* ignore */ }
    }
    window.setTimeout(() => {
      setPicked(null);
      if (idx + 1 >= rounds.length) {
        setDone(true);
      } else {
        setIdx((i) => i + 1);
      }
    }, 900);
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
    setRounds(shuffle(ITEMS).slice(0, 10));
    setIdx(0); setPicked(null); setScore(0); setDone(false);
  };

  if (done) {
    const stars = score >= 9 ? 3 : score >= 7 ? 2 : 1;
    return (
      <div className="min-h-screen bg-cream dark:bg-surface-2 flex items-center justify-center px-5">
        <MascotCelebration trigger={score === rounds.length} locale={isAr ? "ar" : "fr"} />
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">{score === rounds.length ? "🏆" : score >= 7 ? "🌟" : "✨"}</div>
          <h1 className="text-3xl font-bold text-navy mb-2">{isAr ? "أحسنت !" : "Bravo !"}</h1>
          <div className="text-2xl mb-2">{"★".repeat(stars)}<span className="text-line">{"☆".repeat(3 - stars)}</span></div>
          <div className="text-5xl font-bold text-gold my-2">{score}<span className="text-2xl text-fg-soft"> / {rounds.length}</span></div>
          {best !== null && best !== score && (
            <div className="text-xs text-fg-soft mt-1">{isAr ? "أفضل نتيجة" : "Record"} : {best}/{rounds.length}</div>
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
          {isAr ? "الفصول" : "Les saisons"} <span className="text-xl">🌈</span>
        </h1>
        <div className="text-xs font-bold text-fg-soft">{idx + 1}/{rounds.length} · ⭐{score}</div>
      </header>

      <main className="flex-1 px-5 py-6 max-w-md md:max-w-3xl mx-auto w-full">
        <p className="text-sm md:text-base text-fg-soft text-center mb-3">
          {isAr ? "في أي فصل نجد هذا ؟" : "À quelle saison appartient ceci ?"}
        </p>

        {/* Item card with SVG illustration + bilingual caption */}
        <div className="bg-surface border-4 border-navy rounded-3xl p-4 md:p-6 mb-6 shadow-card mx-auto" style={{ maxWidth: 360 }}>
          <div className="aspect-square">{current.draw()}</div>
          <div className="mt-3 text-center">
            <div className="text-xl md:text-2xl font-bold text-navy">{isAr ? current.ar : current.fr}</div>
            <div className="text-sm font-ar text-fg-soft" dir="rtl">{isAr ? current.fr : current.ar}</div>
          </div>
        </div>

        {/* 2x2 season grid */}
        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
          {SEASONS.map((s) => {
            const isPicked = picked === s.key;
            const showCorrect = picked && s.key === current.season;
            const showWrong = isPicked && s.key !== current.season;
            return (
              <button
                key={s.key}
                onClick={() => onPick(s.key)}
                disabled={!!picked}
                className={`${s.bg} py-5 px-3 rounded-2xl border-4 font-bold text-base md:text-lg transition active:scale-[0.98] flex flex-col items-center gap-1 ${
                  showCorrect ? "border-emerald-500 ring-4 ring-emerald-200"
                  : showWrong ? "border-red-500 ring-4 ring-red-200"
                  : picked ? "border-pale-blue opacity-60"
                  : "border-pale-blue hover:border-gold"
                }`}
              >
                <span className="text-3xl">{s.emoji}</span>
                <span>{isAr ? s.ar : s.fr}</span>
                {showCorrect && <span className="text-emerald-600 text-sm">✓ {isAr ? "صحيح" : "Bravo"}</span>}
                {showWrong && <span className="text-red-600 text-sm">✗</span>}
              </button>
            );
          })}
        </div>

        {best !== null && (
          <div className="text-xs text-fg-soft mt-6 text-center">
            {isAr ? "أفضل نتيجة" : "Record"}: <span className="font-bold text-navy">{best}/{rounds.length}</span>
          </div>
        )}
      </main>
    </div>
  );
}
