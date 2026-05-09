"use client";

/**
 * Mon assiette — sort foods into the 4 nutrition groups.
 *
 * Rounds: 12 foods, one at a time. Kid taps which of 4 group cards the
 * food belongs to. Groups: fruits & légumes / protéines / céréales /
 * laitages. Foods are rendered as inline-SVG illustrations (kept simple
 * so they stay recognisable at chip size).
 *
 * Curriculum tie-in: Algerian primary "Éducation islamique et civique"
 * touches on hygiene + food balance, and primary science (1AP-3AP) covers
 * the food groups.
 */

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { useGameBack } from "./useGameBack";
import { MascotCelebration } from "@/components/app/MascotCelebration";
import confetti from "canvas-confetti";

type Group = "veggies" | "protein" | "grains" | "dairy";

interface Food {
  k: string;
  fr: string;
  ar: string;
  group: Group;
  draw: () => React.ReactElement;
}

const GROUPS: { key: Group; fr: string; ar: string; bg: string; emoji: string }[] = [
  { key: "veggies", fr: "Fruits & légumes", ar: "الفواكه والخضر", bg: "bg-emerald-100 text-emerald-900", emoji: "🥬" },
  { key: "protein", fr: "Protéines",        ar: "البروتينات",   bg: "bg-rose-100 text-rose-900",         emoji: "🍗" },
  { key: "grains",  fr: "Céréales & pain",  ar: "الحبوب والخبز", bg: "bg-amber-100 text-amber-900",       emoji: "🌾" },
  { key: "dairy",   fr: "Laitages",         ar: "منتجات الحليب", bg: "bg-blue-100 text-blue-900",         emoji: "🥛" },
];

function Bg({ tint }: { tint: string }) {
  return <rect x="0" y="0" width="200" height="200" rx="22" fill={tint} />;
}

const FOODS: Food[] = [
  // ===== veggies =====
  {
    k: "apple", fr: "Une pomme", ar: "تفاحة", group: "veggies",
    draw: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <Bg tint="#D1FAE5" />
        <circle cx="100" cy="115" r="55" fill="#EF4444" stroke="#0F1B33" strokeWidth="4" />
        <path d="M100 65 Q105 50 95 40" fill="none" stroke="#16A34A" strokeWidth="4" strokeLinecap="round" />
        <ellipse cx="92" cy="48" rx="10" ry="4" transform="rotate(-30 92 48)" fill="#16A34A" />
        {/* shine */}
        <ellipse cx="80" cy="95" rx="10" ry="14" fill="#fff" opacity="0.5" />
      </svg>
    ),
  },
  {
    k: "carrot", fr: "Une carotte", ar: "جزرة", group: "veggies",
    draw: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <Bg tint="#D1FAE5" />
        <path d="M100 60 L80 170 Q100 175 120 170 Z" fill="#F97316" stroke="#0F1B33" strokeWidth="3" />
        {/* leaves */}
        <path d="M100 60 Q90 30 75 35" fill="none" stroke="#16A34A" strokeWidth="6" strokeLinecap="round" />
        <path d="M100 60 Q100 30 100 25" fill="none" stroke="#16A34A" strokeWidth="6" strokeLinecap="round" />
        <path d="M100 60 Q110 30 125 35" fill="none" stroke="#16A34A" strokeWidth="6" strokeLinecap="round" />
        {/* lines */}
        <line x1="90" y1="100" x2="105" y2="100" stroke="#0F1B33" strokeWidth="2" />
        <line x1="88" y1="125" x2="108" y2="125" stroke="#0F1B33" strokeWidth="2" />
        <line x1="86" y1="150" x2="110" y2="150" stroke="#0F1B33" strokeWidth="2" />
      </svg>
    ),
  },
  {
    k: "tomato", fr: "Une tomate", ar: "طماطم", group: "veggies",
    draw: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <Bg tint="#D1FAE5" />
        <circle cx="100" cy="115" r="55" fill="#DC2626" stroke="#0F1B33" strokeWidth="4" />
        {/* leaves on top */}
        <path d="M70 70 Q85 60 100 65 Q115 60 130 70 Q120 80 100 78 Q80 80 70 70 Z" fill="#16A34A" stroke="#0F1B33" strokeWidth="3" />
        <path d="M100 65 L100 50" stroke="#16A34A" strokeWidth="4" strokeLinecap="round" />
        <ellipse cx="80" cy="105" rx="6" ry="14" fill="#fff" opacity="0.4" />
      </svg>
    ),
  },

  // ===== protein =====
  {
    k: "chicken", fr: "Du poulet", ar: "دجاج", group: "protein",
    draw: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <Bg tint="#FCE7F3" />
        {/* drumstick */}
        <ellipse cx="120" cy="80" rx="40" ry="35" fill="#FCD34D" stroke="#0F1B33" strokeWidth="3" />
        <path d="M90 100 L60 140 Q70 155 85 145 L120 110 Z" fill="#FCD34D" stroke="#0F1B33" strokeWidth="3" />
        {/* bone */}
        <ellipse cx="55" cy="148" rx="10" ry="8" fill="#fff" stroke="#0F1B33" strokeWidth="2.5" />
        <ellipse cx="65" cy="155" rx="10" ry="8" fill="#fff" stroke="#0F1B33" strokeWidth="2.5" />
      </svg>
    ),
  },
  {
    k: "egg", fr: "Un œuf", ar: "بيضة", group: "protein",
    draw: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <Bg tint="#FCE7F3" />
        <ellipse cx="100" cy="105" rx="55" ry="65" fill="#fff" stroke="#0F1B33" strokeWidth="4" />
        {/* yolk */}
        <circle cx="100" cy="115" r="22" fill="#FCD34D" stroke="#0F1B33" strokeWidth="2" />
        <ellipse cx="92" cy="108" rx="6" ry="4" fill="#FEF3C7" />
      </svg>
    ),
  },
  {
    k: "fish", fr: "Du poisson", ar: "سمك", group: "protein",
    draw: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <Bg tint="#FCE7F3" />
        {/* body */}
        <path d="M40 100 Q90 50 150 100 Q90 150 40 100 Z" fill="#3B82F6" stroke="#0F1B33" strokeWidth="3" />
        {/* tail */}
        <path d="M150 100 L185 70 L185 130 Z" fill="#3B82F6" stroke="#0F1B33" strokeWidth="3" />
        {/* eye */}
        <circle cx="65" cy="92" r="6" fill="#fff" />
        <circle cx="65" cy="92" r="3" fill="#0F1B33" />
        {/* fin */}
        <path d="M100 80 Q110 65 120 80" fill="#1E40AF" stroke="#0F1B33" strokeWidth="2" />
        {/* scales */}
        <path d="M85 100 Q95 90 105 100 Q115 90 125 100 Q135 90 145 100" fill="none" stroke="#0F1B33" strokeWidth="1.5" />
      </svg>
    ),
  },

  // ===== grains =====
  {
    k: "bread", fr: "Du pain", ar: "خبز", group: "grains",
    draw: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <Bg tint="#FEF3C7" />
        <path d="M30 130 Q30 80 70 70 Q90 50 110 70 Q150 60 165 90 Q180 130 165 150 L40 150 Q25 145 30 130 Z" fill="#D97706" stroke="#0F1B33" strokeWidth="3.5" />
        {/* slits */}
        <path d="M55 100 Q65 90 75 100" fill="none" stroke="#0F1B33" strokeWidth="2" />
        <path d="M85 95 Q95 85 105 95" fill="none" stroke="#0F1B33" strokeWidth="2" />
        <path d="M115 100 Q130 90 145 100" fill="none" stroke="#0F1B33" strokeWidth="2" />
        {/* shine */}
        <ellipse cx="60" cy="85" rx="8" ry="4" fill="#FEF3C7" opacity="0.6" />
      </svg>
    ),
  },
  {
    k: "rice", fr: "Du riz", ar: "أرز", group: "grains",
    draw: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <Bg tint="#FEF3C7" />
        {/* bowl */}
        <ellipse cx="100" cy="110" rx="70" ry="12" fill="#0F1B33" />
        <path d="M30 110 L45 165 Q100 175 155 165 L170 110" fill="#fff" stroke="#0F1B33" strokeWidth="3" />
        {/* rice grains */}
        {[[60,108],[80,103],[100,100],[120,103],[140,108],[70,112],[90,110],[110,108],[130,112],[100,113]].map(([x, y], i) => (
          <ellipse key={i} cx={x} cy={y} rx="4" ry="2.2" fill="#fff" stroke="#0F1B33" strokeWidth="1" />
        ))}
      </svg>
    ),
  },
  {
    k: "couscous", fr: "Du couscous", ar: "كسكس", group: "grains",
    draw: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <Bg tint="#FEF3C7" />
        {/* plate */}
        <ellipse cx="100" cy="130" rx="80" ry="20" fill="#fff" stroke="#0F1B33" strokeWidth="3" />
        {/* couscous heap */}
        <path d="M40 130 Q100 60 160 130 Z" fill="#FDE68A" stroke="#0F1B33" strokeWidth="2.5" />
        {/* speckles */}
        {[[70,110],[85,95],[100,80],[115,95],[130,110],[80,120],[120,120],[100,105]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2" fill="#92400E" />
        ))}
        {/* veggie on top */}
        <circle cx="100" cy="75" r="6" fill="#16A34A" />
        <circle cx="85" cy="85" r="5" fill="#F97316" />
      </svg>
    ),
  },

  // ===== dairy =====
  {
    k: "milk", fr: "Du lait", ar: "حليب", group: "dairy",
    draw: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <Bg tint="#DBEAFE" />
        {/* glass */}
        <path d="M65 60 L75 175 Q100 180 125 175 L135 60 Z" fill="#fff" stroke="#0F1B33" strokeWidth="3.5" />
        {/* milk fill */}
        <path d="M68 80 L77 170 Q100 175 123 170 L132 80 Q100 78 68 80 Z" fill="#fff" />
        <ellipse cx="100" cy="80" rx="32" ry="6" fill="#fff" stroke="#0F1B33" strokeWidth="2" />
        {/* drop on top */}
        <ellipse cx="105" cy="40" rx="8" ry="14" fill="#fff" stroke="#0F1B33" strokeWidth="2" />
      </svg>
    ),
  },
  {
    k: "cheese", fr: "Du fromage", ar: "جبن", group: "dairy",
    draw: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <Bg tint="#DBEAFE" />
        {/* triangle */}
        <path d="M40 140 L150 60 L160 140 Z" fill="#FDE047" stroke="#0F1B33" strokeWidth="4" />
        {/* holes */}
        <circle cx="80" cy="115" r="6" fill="#FEF3C7" stroke="#0F1B33" strokeWidth="2" />
        <circle cx="105" cy="100" r="4" fill="#FEF3C7" stroke="#0F1B33" strokeWidth="2" />
        <circle cx="120" cy="120" r="5" fill="#FEF3C7" stroke="#0F1B33" strokeWidth="2" />
        <circle cx="60" cy="130" r="4" fill="#FEF3C7" stroke="#0F1B33" strokeWidth="2" />
      </svg>
    ),
  },
  {
    k: "yogurt", fr: "Du yaourt", ar: "زبادي", group: "dairy",
    draw: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <Bg tint="#DBEAFE" />
        {/* pot */}
        <path d="M55 70 L60 170 Q100 178 140 170 L145 70 Z" fill="#fff" stroke="#0F1B33" strokeWidth="3" />
        {/* lid */}
        <rect x="50" y="55" width="100" height="20" rx="5" fill="#F472B6" stroke="#0F1B33" strokeWidth="3" />
        {/* fruit hint on lid */}
        <circle cx="80" cy="65" r="4" fill="#fff" />
        <circle cx="120" cy="65" r="4" fill="#fff" />
        {/* spoon */}
        <ellipse cx="105" cy="100" rx="8" ry="6" fill="#E5E7EB" stroke="#0F1B33" strokeWidth="2" transform="rotate(20 105 100)" />
        <line x1="115" y1="100" x2="135" y2="80" stroke="#E5E7EB" strokeWidth="4" strokeLinecap="round" />
      </svg>
    ),
  },
];

const STORAGE_KEY = "najah:assiette:best";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function MonAssiette() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const goBack = useGameBack();

  const [rounds, setRounds] = useState(() => shuffle(FOODS).slice(0, 10));
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<Group | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [best, setBest] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = Number(window.localStorage.getItem(STORAGE_KEY));
    if (Number.isFinite(saved) && saved > 0) setBest(saved);
  }, []);

  const current = rounds[idx];

  const onPick = (g: Group) => {
    if (picked) return;
    setPicked(g);
    if (g === current.group) {
      setScore((s) => s + 1);
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
    setRounds(shuffle(FOODS).slice(0, 10));
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
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="px-5 py-4 flex items-center justify-between bg-white border-b border-pale-blue">
        <button onClick={goBack} className="w-10 h-10 rounded-full bg-white border border-pale-blue flex items-center justify-center text-navy" aria-label={isAr ? "رجوع" : "Retour"}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h1 className="text-base md:text-lg font-bold text-navy">
          {isAr ? "صحني" : "Mon assiette"} <span className="text-xl">🍎</span>
        </h1>
        <div className="text-xs font-bold text-fg-soft">{idx + 1}/{rounds.length} · ⭐{score}</div>
      </header>

      <main className="flex-1 px-5 py-6 max-w-md md:max-w-3xl mx-auto w-full">
        <p className="text-sm md:text-base text-fg-soft text-center mb-3">
          {isAr ? "في أي مجموعة تضعه ؟" : "Dans quel groupe le ranger ?"}
        </p>

        {/* Food card with SVG illustration + bilingual label */}
        <div className="bg-white border-4 border-navy rounded-3xl p-4 md:p-6 mb-6 shadow-card mx-auto" style={{ maxWidth: 360 }}>
          <div className="aspect-square">{current.draw()}</div>
          <div className="mt-3 text-center">
            <div className="text-xl md:text-2xl font-bold text-navy">{isAr ? current.ar : current.fr}</div>
            <div className="text-sm font-ar text-fg-soft" dir="rtl">{isAr ? current.fr : current.ar}</div>
          </div>
        </div>

        {/* 2x2 group grid */}
        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
          {GROUPS.map((g) => {
            const isPicked = picked === g.key;
            const showCorrect = picked && g.key === current.group;
            const showWrong = isPicked && g.key !== current.group;
            return (
              <button
                key={g.key}
                onClick={() => onPick(g.key)}
                disabled={!!picked}
                className={`${g.bg} py-4 px-3 rounded-2xl border-4 font-bold text-sm md:text-base transition active:scale-[0.98] flex flex-col items-center gap-1 ${
                  showCorrect ? "border-emerald-500 ring-4 ring-emerald-200"
                  : showWrong ? "border-red-500 ring-4 ring-red-200"
                  : picked ? "border-pale-blue opacity-60"
                  : "border-pale-blue hover:border-gold"
                }`}
              >
                <span className="text-2xl">{g.emoji}</span>
                <span className="leading-tight text-center">{isAr ? g.ar : g.fr}</span>
                {showCorrect && <span className="text-emerald-600 text-xs">✓ {isAr ? "صحيح" : "Bravo"}</span>}
                {showWrong && <span className="text-red-600 text-xs">✗</span>}
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
