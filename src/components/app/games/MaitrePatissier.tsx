"use client";

/**
 * Maître pâtissier — sneaky-maths via cooking recipes.
 *
 * Each round shows a recipe card ("Crêpes pour 4 personnes : 200g farine,
 * 2 œufs, 500ml lait..."). The kid is asked a math question hidden inside
 * the recipe — like "Combien de farine pour 8 personnes ?" — and picks
 * from 4 numeric answers. Fractions, multiplications, ratios, all framed
 * as kitchen choices so it feels like cooking, not maths.
 *
 * 8 rounds, 3 difficulty modes. Recipes use Algerian/Maghrebi sweets when
 * possible (msemen, makrout, baklava) so kids see familiar food.
 */

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { useGameBack } from "./useGameBack";
import { MascotCelebration } from "@/components/app/MascotCelebration";
import confetti from "canvas-confetti";

interface RecipeQ {
  k: string;
  recipe_fr: string;
  recipe_ar: string;
  emoji: string;
  q_fr: string;
  q_ar: string;
  answer: number;
  unit_fr: string;
  unit_ar: string;
  /** Distractors */
  bad: number[];
}

const RECIPES: RecipeQ[] = [
  // ===== Easy ratios — double / half =====
  {
    k: "crepes-double", emoji: "🥞",
    recipe_fr: "Crêpes pour 4 : 200g de farine.",
    recipe_ar: "كريب لـ ٤ : ٢٠٠ غرام دقيق.",
    q_fr: "Pour 8 personnes ? (le double)",
    q_ar: "لـ ٨ أشخاص ؟ (الضعف)",
    answer: 400,
    unit_fr: "g", unit_ar: "غرام",
    bad: [200, 800, 100],
  },
  {
    k: "msemen-half", emoji: "🫓",
    recipe_fr: "Msemen pour 6 : 300g de semoule.",
    recipe_ar: "مسمن لـ ٦ : ٣٠٠ غرام سميد.",
    q_fr: "Pour 3 personnes ? (la moitié)",
    q_ar: "لـ ٣ أشخاص ؟ (النصف)",
    answer: 150,
    unit_fr: "g", unit_ar: "غرام",
    bad: [300, 600, 100],
  },
  {
    k: "lait-x3", emoji: "🥛",
    recipe_fr: "Riz au lait pour 2 : 250ml de lait.",
    recipe_ar: "أرز بالحليب لـ ٢ : ٢٥٠ مل حليب.",
    q_fr: "Pour 6 ? (×3)",
    q_ar: "لـ ٦ ؟ (×٣)",
    answer: 750,
    unit_fr: "ml", unit_ar: "مل",
    bad: [500, 250, 1000],
  },
  {
    k: "oeufs-quarter", emoji: "🥚",
    recipe_fr: "Gâteau pour 8 : 4 œufs.",
    recipe_ar: "كعكة لـ ٨ : ٤ بيضات.",
    q_fr: "Pour 2 personnes ? (le quart)",
    q_ar: "لـ ٢ ؟ (الربع)",
    answer: 1,
    unit_fr: "œuf", unit_ar: "بيضة",
    bad: [2, 4, 8],
  },

  // ===== Medium — addition / multiplication =====
  {
    k: "makrout-12", emoji: "🍯",
    recipe_fr: "Une plaque de makrout = 12 pièces.",
    recipe_ar: "صينية مقروط = ١٢ قطعة.",
    q_fr: "Combien font 5 plaques ?",
    q_ar: "كم تساوي ٥ صواني ؟",
    answer: 60,
    unit_fr: "pièces", unit_ar: "قطعة",
    bad: [50, 75, 17],
  },
  {
    k: "baklava-grams", emoji: "🍰",
    recipe_fr: "Baklava : 300g de sucre + 250g de miel.",
    recipe_ar: "بقلاوة : ٣٠٠ غ سكر + ٢٥٠ غ عسل.",
    q_fr: "Total sucre + miel ?",
    q_ar: "مجموع السكر والعسل ؟",
    answer: 550,
    unit_fr: "g", unit_ar: "غرام",
    bad: [50, 600, 500],
  },
  {
    k: "biscuits-x4", emoji: "🍪",
    recipe_fr: "1 boîte = 8 biscuits.",
    recipe_ar: "علبة = ٨ بسكويتات.",
    q_fr: "Combien dans 4 boîtes ?",
    q_ar: "كم في ٤ علب ؟",
    answer: 32,
    unit_fr: "biscuits", unit_ar: "بسكويت",
    bad: [12, 24, 40],
  },
  {
    k: "mhalbi-1L", emoji: "🥣",
    recipe_fr: "Mhalbi : 1L de lait pour 4 bols.",
    recipe_ar: "محلبي : ١ لتر حليب لـ ٤ أوعية.",
    q_fr: "Pour 1 bol ?",
    q_ar: "لوعاء واحد ؟",
    answer: 250,
    unit_fr: "ml", unit_ar: "مل",
    bad: [500, 100, 1000],
  },

  // ===== Harder — division / multiple steps =====
  {
    k: "kalbelouz-share", emoji: "🍰",
    recipe_fr: "30 morceaux de kalbelouz à partager entre 6 enfants.",
    recipe_ar: "٣٠ قطعة كعب الغزال نقسمها على ٦ أطفال.",
    q_fr: "Combien chacun ?",
    q_ar: "كم لكلّ واحد ؟",
    answer: 5,
    unit_fr: "morceaux", unit_ar: "قطع",
    bad: [4, 6, 24],
  },
  {
    k: "tea-trays", emoji: "🫖",
    recipe_fr: "Sur 1 plateau : 6 verres de thé.",
    recipe_ar: "في صينية : ٦ كؤوس شاي.",
    q_fr: "3 plateaux pour 12 invités, combien de verres en plus ?",
    q_ar: "٣ صواني لـ ١٢ ضيف، كم كأس إضافي ؟",
    answer: 6,
    unit_fr: "verres", unit_ar: "كأس",
    bad: [12, 18, 0],
  },
];

const STORAGE_KEY = "najah:patissier:best";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const TOTAL = 8;

export function MaitrePatissier() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const goBack = useGameBack();

  const [rounds, setRounds] = useState(() => shuffle(RECIPES).slice(0, TOTAL));
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [best, setBest] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const v = Number(window.localStorage.getItem(STORAGE_KEY));
    if (Number.isFinite(v) && v > 0) setBest(v);
  }, []);

  const current = rounds[idx];

  const choices = useMemo(() => {
    return shuffle([current.answer, ...current.bad]);
  }, [current]);

  const onPick = (n: number) => {
    if (picked !== null) return;
    setPicked(n);
    if (n === current.answer) {
      setScore((s) => s + 1);
      try { confetti({ particleCount: 25, spread: 50, origin: { y: 0.6 } }); } catch { /* ignore */ }
    }
    window.setTimeout(() => {
      setPicked(null);
      if (idx + 1 >= rounds.length) setDone(true);
      else setIdx((i) => i + 1);
    }, 1100);
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
    setRounds(shuffle(RECIPES).slice(0, TOTAL));
    setIdx(0); setPicked(null); setScore(0); setDone(false);
  };

  if (done) {
    const stars = score >= 7 ? 3 : score >= 5 ? 2 : 1;
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-5">
        <MascotCelebration trigger={score === rounds.length} locale={isAr ? "ar" : "fr"} />
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">{score === rounds.length ? "🏆" : score >= 5 ? "🌟" : "✨"}</div>
          <h1 className="text-3xl font-bold text-navy mb-2">{isAr ? "أحسنت !" : "Bravo, chef !"}</h1>
          <div className="text-2xl mb-2">{"★".repeat(stars)}<span className="text-line">{"☆".repeat(3 - stars)}</span></div>
          <div className="text-5xl font-bold text-gold my-2">{score}<span className="text-2xl text-fg-soft"> / {rounds.length}</span></div>
          {best !== null && (<div className="text-xs text-fg-soft mt-1">{isAr ? "أفضل" : "Record"} : {best}/{rounds.length}</div>)}
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
          {isAr ? "حلواني صغير" : "Maître pâtissier"} <span className="text-xl">👨‍🍳</span>
        </h1>
        <div className="text-xs font-bold text-fg-soft">{idx + 1}/{rounds.length} · ⭐{score}</div>
      </header>

      <main className="flex-1 px-5 py-6 max-w-md md:max-w-3xl mx-auto w-full">
        {/* Recipe card */}
        <div className="bg-white border-4 border-amber-400 rounded-3xl p-5 md:p-6 mb-5 shadow-card text-center">
          <div className="text-6xl md:text-7xl mb-2">{current.emoji}</div>
          <div className="text-xs uppercase tracking-wider text-amber-700 font-bold mb-2">
            {isAr ? "وصفة" : "Recette"}
          </div>
          <p className="text-base md:text-lg font-semibold text-navy" dir={isAr ? "rtl" : "ltr"}>
            {isAr ? current.recipe_ar : current.recipe_fr}
          </p>
        </div>

        {/* Question */}
        <div className="bg-navy text-cream rounded-2xl p-4 mb-4 text-center">
          <div className="text-xs uppercase tracking-wider text-gold font-bold mb-1">{isAr ? "السؤال" : "Question"}</div>
          <div className="text-base md:text-lg font-bold" dir={isAr ? "rtl" : "ltr"}>
            {isAr ? current.q_ar : current.q_fr}
          </div>
        </div>

        {/* Numeric choices */}
        <div className="grid grid-cols-2 gap-3">
          {choices.map((n) => {
            const isPicked = picked === n;
            const showCorrect = picked !== null && n === current.answer;
            const showWrong = isPicked && n !== current.answer;
            return (
              <button key={n}
                onClick={() => onPick(n)}
                disabled={picked !== null}
                className={`bg-white rounded-2xl border-4 py-5 px-3 text-2xl font-bold text-navy transition active:scale-95 ${
                  showCorrect ? "border-emerald-500 ring-4 ring-emerald-200 bg-emerald-50"
                  : showWrong ? "border-red-500 ring-4 ring-red-200 bg-red-50"
                  : picked !== null ? "border-pale-blue opacity-60"
                  : "border-pale-blue hover:border-gold"
                }`}
              >
                {n} <span className="text-base text-fg-soft font-semibold">{isAr ? current.unit_ar : current.unit_fr}</span>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
