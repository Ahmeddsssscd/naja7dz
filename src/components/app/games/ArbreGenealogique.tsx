"use client";

/**
 * Mon arbre généalogique — drag/place family-member emojis into the right
 * slot of a family-tree diagram.
 *
 * The tree shows 9 slots: papi & mami (top row), oncle/tante & papa & maman
 * (middle row), frère/cousin/sœur and YOU in the middle (bottom rows). On
 * each round we shuffle the pool of person-cards and the kid taps a slot
 * + then taps a person to place. Wrong placements bounce back; right ones
 * lock in. After all 9 slots filled we celebrate.
 */

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { useGameBack } from "./useGameBack";
import { MascotCelebration } from "@/components/app/MascotCelebration";
import confetti from "canvas-confetti";

type SlotKey = "papi" | "mami" | "papa" | "maman" | "oncle" | "tante" | "frere" | "soeur" | "moi";

interface SlotDef {
  key: SlotKey;
  fr: string;
  ar: string;
  emoji: string;
  /** Where on the SVG canvas to draw the slot box */
  x: number;
  y: number;
}

const SLOTS: SlotDef[] = [
  { key: "papi",  fr: "Papi",  ar: "جدّي",   emoji: "👴", x:  60, y:  30 },
  { key: "mami",  fr: "Mami",  ar: "جدّتي",  emoji: "👵", x: 200, y:  30 },
  { key: "oncle", fr: "Oncle", ar: "عمّي",   emoji: "👨", x: 300, y: 130 },
  { key: "tante", fr: "Tante", ar: "عمّتي",  emoji: "👩", x:  20, y: 130 },
  { key: "papa",  fr: "Papa",  ar: "أبي",    emoji: "👨‍🦱", x: 100, y: 130 },
  { key: "maman", fr: "Maman", ar: "أمّي",   emoji: "👩‍🦱", x: 220, y: 130 },
  { key: "frere", fr: "Frère", ar: "أخي",    emoji: "🧒", x:  60, y: 240 },
  { key: "soeur", fr: "Sœur",  ar: "أختي",   emoji: "👧", x: 270, y: 240 },
  { key: "moi",   fr: "Moi",   ar: "أنا",    emoji: "🌟", x: 165, y: 240 },
];

const STORAGE_KEY = "najah:arbre:done";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function ArbreGenealogique() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const goBack = useGameBack();

  const [pool, setPool] = useState(() => shuffle(SLOTS));
  const [placed, setPlaced] = useState<Set<SlotKey>>(new Set());
  const [selected, setSelected] = useState<SlotKey | null>(null); // chosen target slot
  const [misses, setMisses] = useState(0);
  const [bestMisses, setBestMisses] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const v = window.localStorage.getItem(STORAGE_KEY);
    if (v) setBestMisses(Number(v));
  }, []);

  const allDone = placed.size === SLOTS.length;

  useEffect(() => {
    if (!allDone || done) return;
    setDone(true);
    if (bestMisses === null || misses < bestMisses) {
      setBestMisses(misses);
      try { window.localStorage.setItem(STORAGE_KEY, String(misses)); } catch { /* ignore */ }
    }
    if (misses === 0) {
      try { confetti({ particleCount: 140, spread: 110, colors: ["#D4A72C", "#0F1B33", "#1AD18C"] }); } catch { /* ignore */ }
    }
  }, [allDone]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSelectSlot = (k: SlotKey) => {
    if (placed.has(k)) return;
    setSelected(k);
  };

  const onPickPerson = (k: SlotKey) => {
    if (selected === null) {
      // No slot picked first — let kid tap a person and we'll prompt
      // them to pick a slot afterwards via subtle highlight (we just
      // hold this card as "active" for next slot tap).
      setSelected(k); // reuse selection state for person too — both use SlotKey
      return;
    }
    if (k === selected) {
      // CORRECT — slot key matches person key
      setPlaced((p) => new Set(p).add(k));
      try { confetti({ particleCount: 25, spread: 50, origin: { y: 0.6 } }); } catch { /* ignore */ }
    } else {
      setMisses((m) => m + 1);
    }
    setSelected(null);
  };

  const restart = () => {
    setPool(shuffle(SLOTS));
    setPlaced(new Set());
    setSelected(null);
    setMisses(0);
    setDone(false);
  };

  const remaining = useMemo(() => pool.filter((s) => !placed.has(s.key)), [pool, placed]);

  if (done) {
    const stars = misses === 0 ? 3 : misses <= 2 ? 2 : 1;
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-5">
        <MascotCelebration trigger={misses === 0} locale={isAr ? "ar" : "fr"} />
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">{misses === 0 ? "🏆" : misses <= 2 ? "🌟" : "✨"}</div>
          <h1 className="text-3xl font-bold text-navy mb-2">{isAr ? "أحسنت !" : "Bravo !"}</h1>
          <div className="text-2xl mb-2">{"★".repeat(stars)}<span className="text-line">{"☆".repeat(3 - stars)}</span></div>
          <div className="text-base text-fg-soft">{isAr ? "أخطاء" : "Erreurs"} : {misses}</div>
          {bestMisses !== null && bestMisses < misses && (
            <div className="text-xs text-fg-soft mt-1">{isAr ? "أفضل" : "Record"} : {bestMisses} {isAr ? "أخطاء" : "erreurs"}</div>
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
          {isAr ? "شجرة العائلة" : "Mon arbre généalogique"} <span className="text-xl">🌳</span>
        </h1>
        <div className="text-xs font-bold text-fg-soft">{placed.size}/{SLOTS.length}</div>
      </header>

      <main className="flex-1 px-3 py-5 max-w-md md:max-w-3xl mx-auto w-full">
        <p className="text-sm md:text-base text-fg-soft text-center mb-3">
          {isAr ? "اختر فرداً ثم ضعه في مكانه" : "Touche un personnage puis place-le au bon endroit"}
        </p>

        {/* The tree canvas — slots as labelled boxes connected by lines */}
        <div className="bg-white rounded-2xl border-4 border-pale-blue p-2 md:p-4 shadow-card relative">
          <svg viewBox="0 0 360 320" className="w-full h-auto">
            {/* Connection lines */}
            {/* Papi <-> Mami line */}
            <line x1="100" y1="60" x2="240" y2="60" stroke="#0F1B33" strokeWidth="2" strokeDasharray="4 3" />
            {/* Down to papa+oncle+tante */}
            <line x1="170" y1="60" x2="170" y2="100" stroke="#0F1B33" strokeWidth="2" />
            <line x1="60" y1="100" x2="340" y2="100" stroke="#0F1B33" strokeWidth="2" />
            <line x1="60" y1="100" x2="60" y2="130" stroke="#0F1B33" strokeWidth="2" />
            <line x1="140" y1="100" x2="140" y2="130" stroke="#0F1B33" strokeWidth="2" />
            <line x1="260" y1="100" x2="260" y2="130" stroke="#0F1B33" strokeWidth="2" />
            <line x1="340" y1="100" x2="340" y2="130" stroke="#0F1B33" strokeWidth="2" />
            {/* Papa <-> Maman line */}
            <line x1="140" y1="160" x2="260" y2="160" stroke="#0F1B33" strokeWidth="2" strokeDasharray="4 3" />
            <line x1="200" y1="160" x2="200" y2="210" stroke="#0F1B33" strokeWidth="2" />
            <line x1="100" y1="210" x2="310" y2="210" stroke="#0F1B33" strokeWidth="2" />
            <line x1="100" y1="210" x2="100" y2="240" stroke="#0F1B33" strokeWidth="2" />
            <line x1="200" y1="210" x2="200" y2="240" stroke="#0F1B33" strokeWidth="2" />
            <line x1="310" y1="210" x2="310" y2="240" stroke="#0F1B33" strokeWidth="2" />

            {/* Slot boxes */}
            {SLOTS.map((s) => {
              const isFilled = placed.has(s.key);
              const isSelected = selected === s.key;
              return (
                <g key={s.key} transform={`translate(${s.x} ${s.y})`}
                  onClick={() => onSelectSlot(s.key)}
                  style={{ cursor: isFilled ? "default" : "pointer" }}
                >
                  <rect width="80" height="60" rx="10"
                    fill={isFilled ? "#D1FAE5" : isSelected ? "#FEF3C7" : "#fff"}
                    stroke={isFilled ? "#10B981" : isSelected ? "#D4A72C" : "#0F1B33"}
                    strokeWidth="3"
                    strokeDasharray={isFilled ? "" : "5 3"}
                  />
                  <text x="40" y="32" textAnchor="middle" fontSize={isFilled ? "26" : "12"} fontWeight="700" fill="#0F1B33">
                    {isFilled ? s.emoji : (isAr ? s.ar : s.fr)}
                  </text>
                  {isFilled && <text x="40" y="52" textAnchor="middle" fontSize="9" fontWeight="600" fill="#0F1B33">{isAr ? s.ar : s.fr}</text>}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Person pool */}
        <div className="mt-5">
          <div className="text-xs font-bold text-navy/70 uppercase mb-2 ms-1">
            {isAr ? "اختر فرداً" : "Choisis un membre"}
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {remaining.map((p) => (
              <button key={p.key}
                onClick={() => onPickPerson(p.key)}
                className={`rounded-2xl border-4 p-2 text-center transition active:scale-95 ${
                  selected === p.key ? "bg-yellow-50 border-gold ring-4 ring-gold/30" : "bg-white border-pale-blue hover:border-gold"
                }`}
              >
                <div className="text-3xl">{p.emoji}</div>
                <div className="text-xs font-bold text-navy mt-1">{isAr ? p.ar : p.fr}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="text-center text-xs text-fg-soft mt-4">
          {isAr ? "أخطاء" : "Erreurs"}: <span className="font-bold text-red-600">{misses}</span>
        </div>
      </main>
    </div>
  );
}
