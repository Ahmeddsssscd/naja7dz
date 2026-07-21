"use client";

/**
 * Mesures — which unit measures this?
 *
 * Everyday estimation game for 8-11 year olds (aligned with the 4AP/5AP
 * "grandeurs et mesures" block). Each round shows an everyday item with an
 * emoji; the kid picks the sensible unit (km, m, cm, kg, g, L, min, h).
 * 10 random items per game out of a pool of 16.
 */

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useGameBack } from "./useGameBack";
import { MascotCelebration } from "@/components/app/MascotCelebration";
import confetti from "canvas-confetti";

const STORAGE_KEY = "najah:mesures:best";
const ROUNDS = 10;

const UNITS = ["km", "m", "cm", "kg", "g", "L", "min", "h"] as const;
type Unit = typeof UNITS[number];

const UNIT_AR: Record<Unit, string> = {
  km: "كلم", m: "م", cm: "سم", kg: "كغ", g: "غ", L: "ل", min: "د", h: "سا",
};

interface Item {
  emoji: string;
  fr: string; ar: string;
  unit: Unit;
}

const ITEMS: Item[] = [
  { emoji: "🚗", fr: "La distance Alger — Oran",          ar: "المسافة بين الجزائر ووهران",   unit: "km" },
  { emoji: "🚪", fr: "La hauteur d'une porte",            ar: "ارتفاع الباب",                  unit: "m" },
  { emoji: "✏️", fr: "La longueur d'un crayon",           ar: "طول قلم الرصاص",               unit: "cm" },
  { emoji: "🍉", fr: "La masse d'une pastèque",           ar: "كتلة دلاعة",                   unit: "kg" },
  { emoji: "🪙", fr: "La masse d'une pièce de monnaie",   ar: "كتلة قطعة نقدية",              unit: "g" },
  { emoji: "🧃", fr: "Le contenu d'une bouteille d'eau",  ar: "محتوى قارورة ماء",             unit: "L" },
  { emoji: "⚽", fr: "La durée d'une mi-temps de foot",   ar: "مدة شوط كرة القدم",            unit: "min" },
  { emoji: "😴", fr: "La durée d'une nuit de sommeil",    ar: "مدة النوم في الليل",           unit: "h" },
  { emoji: "🐘", fr: "La masse d'un éléphant",            ar: "كتلة فيل",                     unit: "kg" },
  { emoji: "📏", fr: "La largeur d'un cahier",            ar: "عرض الكراس",                   unit: "cm" },
  { emoji: "🏊", fr: "La longueur d'une piscine",         ar: "طول المسبح",                   unit: "m" },
  { emoji: "🛣️", fr: "La longueur de l'autoroute Est-Ouest", ar: "طول الطريق السيار شرق-غرب", unit: "km" },
  { emoji: "🥛", fr: "Le lait pour une recette de gâteau",ar: "الحليب لوصفة كعكة",            unit: "L" },
  { emoji: "🍬", fr: "La masse d'un bonbon",              ar: "كتلة حلوى",                    unit: "g" },
  { emoji: "🦷", fr: "Le brossage des dents",             ar: "مدة تفريش الأسنان",            unit: "min" },
  { emoji: "✈️", fr: "Un vol Alger — Tamanrasset",        ar: "رحلة جوية الجزائر — تمنراست",  unit: "h" },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 4 unit options: the right one + 3 distinct others. */
function buildOptions(correct: Unit): Unit[] {
  const others = shuffle(UNITS.filter((u) => u !== correct)).slice(0, 3);
  return shuffle([correct, ...others]);
}

export function Mesures() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const goBack = useGameBack();

  const [items, setItems] = useState<Item[]>(() => shuffle(ITEMS).slice(0, ROUNDS));
  const [round, setRound] = useState(0);
  const [options, setOptions] = useState<Unit[]>(() => []);
  const [picked, setPicked] = useState<Unit | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [best, setBest] = useState<number | null>(null);

  const item = items[round];

  useEffect(() => {
    setOptions(buildOptions(items[round].unit));
  }, [round, items]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const v = Number(window.localStorage.getItem(STORAGE_KEY));
    if (Number.isFinite(v) && v > 0) setBest(v);
  }, []);

  const pick = (u: Unit) => {
    if (picked !== null) return;
    setPicked(u);
    const good = u === item.unit;
    if (good) {
      setScore((s) => s + 1);
      try { confetti({ particleCount: 25, spread: 50, origin: { y: 0.6 } }); } catch { /* ignore */ }
    }
    setTimeout(() => {
      if (round + 1 >= ROUNDS) {
        const final = score + (good ? 1 : 0);
        setDone(true);
        if (best === null || final > best) {
          setBest(final);
          try { window.localStorage.setItem(STORAGE_KEY, String(final)); } catch { /* ignore */ }
        }
        if (final === ROUNDS) {
          try { confetti({ particleCount: 150, spread: 110, colors: ["#D4A72C", "#0F1B33", "#1AD18C"] }); } catch { /* ignore */ }
        }
      } else {
        setRound((r) => r + 1);
        setPicked(null);
      }
    }, 900);
  };

  const restart = () => {
    setItems(shuffle(ITEMS).slice(0, ROUNDS));
    setRound(0); setPicked(null); setScore(0); setDone(false);
  };

  if (done) {
    const stars = score >= 9 ? 3 : score >= 6 ? 2 : 1;
    return (
      <div className="min-h-screen bg-cream dark:bg-surface-2 flex items-center justify-center px-5">
        <MascotCelebration trigger={score === ROUNDS} locale={isAr ? "ar" : "fr"} />
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">{score >= 9 ? "🏆" : score >= 6 ? "🌟" : "✨"}</div>
          <h1 className="text-3xl font-bold text-navy mb-2">{isAr ? "أحسنت !" : "Bravo !"}</h1>
          <div className="text-2xl mb-2">{"★".repeat(stars)}<span className="text-line">{"☆".repeat(3 - stars)}</span></div>
          <div className="text-5xl font-bold text-gold my-2">{score}<span className="text-2xl text-fg-soft"> / {ROUNDS}</span></div>
          {best !== null && (
            <div className="text-xs text-fg-soft mt-1">{isAr ? "أفضل نتيجة" : "Record"} : {best}/{ROUNDS}</div>
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
          {isAr ? "وحدات القياس" : "Les mesures"} <span className="text-xl">📏</span>
        </h1>
        <div className="text-xs font-bold text-fg-soft">{round + 1}/{ROUNDS}</div>
      </header>

      <main className="flex-1 px-5 py-6 max-w-md mx-auto w-full flex flex-col justify-center">
        <p className="text-sm md:text-base text-fg-soft text-center mb-6">
          {isAr ? "بأي وحدة نقيس هذا؟" : "Avec quelle unité mesure-t-on cela ?"}
        </p>

        <div className="bg-surface border-4 border-pale-blue rounded-3xl p-8 mb-6 text-center">
          <div className="text-7xl mb-4">{item.emoji}</div>
          <div className="text-lg md:text-xl font-bold text-navy leading-snug">
            {isAr ? item.ar : item.fr}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {options.map((u) => {
            const state =
              picked === null ? "idle"
              : u === item.unit ? "good"
              : u === picked ? "bad"
              : "idle";
            return (
              <button
                key={u}
                onClick={() => pick(u)}
                disabled={picked !== null}
                className={`rounded-2xl border-4 py-4 text-2xl font-bold transition active:scale-95 ${
                  state === "good" ? "bg-emerald-100 border-emerald-500 text-emerald-800"
                  : state === "bad" ? "bg-red-100 border-red-400 text-red-700"
                  : "bg-surface border-pale-blue text-navy hover:border-gold"
                }`}
              >
                {isAr ? UNIT_AR[u] : u}
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
