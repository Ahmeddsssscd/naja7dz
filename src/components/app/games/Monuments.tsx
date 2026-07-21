"use client";

/**
 * Monuments d'Algérie — where is this monument?
 *
 * Cultural geography for 7-12 year olds. Each round shows a hand-drawn SVG
 * of a famous Algerian monument or site + its name; the kid picks the city
 * (wilaya) among 4 options. All 8 monuments appear once per game.
 */

import type React from "react";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useGameBack } from "./useGameBack";
import { MascotCelebration } from "@/components/app/MascotCelebration";
import confetti from "canvas-confetti";

const STORAGE_KEY = "najah:monuments:best";

interface Monument {
  k: string;
  name_fr: string; name_ar: string;
  city_fr: string; city_ar: string;
  draw: () => React.ReactElement;
}

const MaqamEchahid = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full">
    <rect x="0" y="130" width="200" height="30" fill="#D6E4F0" />
    {/* three concrete palms meeting at top */}
    <path d="M100 20 L78 130 L92 130 L100 45 Z" fill="#94A3B8" stroke="#0F1B33" strokeWidth="2.5" />
    <path d="M100 20 L122 130 L108 130 L100 45 Z" fill="#CBD5E1" stroke="#0F1B33" strokeWidth="2.5" />
    <path d="M100 20 L100 130 L106 130 L103 45 Z" fill="#64748B" stroke="#0F1B33" strokeWidth="1.5" />
    <circle cx="100" cy="30" r="7" fill="#D4A72C" stroke="#0F1B33" strokeWidth="2" />
  </svg>
);
const Timgad = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full">
    <rect x="0" y="130" width="200" height="30" fill="#FDE68A" />
    {/* Roman arch + columns */}
    <rect x="40" y="60" width="14" height="70" fill="#FBBF77" stroke="#0F1B33" strokeWidth="2.5" />
    <rect x="146" y="60" width="14" height="70" fill="#FBBF77" stroke="#0F1B33" strokeWidth="2.5" />
    <rect x="88" y="75" width="10" height="55" fill="#FBBF77" stroke="#0F1B33" strokeWidth="2" />
    <rect x="102" y="75" width="10" height="55" fill="#FBBF77" stroke="#0F1B33" strokeWidth="2" />
    <path d="M30 60 L170 60 L170 48 L30 48 Z" fill="#F59E0B" stroke="#0F1B33" strokeWidth="2.5" />
    <path d="M64 130 L64 90 A36 36 0 0 1 136 90 L136 130 L122 130 L122 92 A22 22 0 0 0 78 92 L78 130 Z" fill="#FBBF77" stroke="#0F1B33" strokeWidth="2.5" />
  </svg>
);
const PontConstantine = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full">
    {/* gorge */}
    <path d="M0 160 L0 60 L55 80 L55 160 Z" fill="#A16207" stroke="#0F1B33" strokeWidth="2.5" />
    <path d="M200 160 L200 60 L145 80 L145 160 Z" fill="#A16207" stroke="#0F1B33" strokeWidth="2.5" />
    {/* suspended bridge */}
    <line x1="40" y1="78" x2="160" y2="78" stroke="#0F1B33" strokeWidth="4" />
    <path d="M40 78 Q100 118 160 78" fill="none" stroke="#DC2626" strokeWidth="3" />
    {[55, 75, 100, 125, 145].map((x, i) => (
      <line key={i} x1={x} y1="78" x2={x} y2={78 + 38 - Math.abs(x - 100) * 0.55} stroke="#DC2626" strokeWidth="2" />
    ))}
  </svg>
);
const SantaCruz = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full">
    {/* mountain + fort */}
    <path d="M0 160 L60 55 L130 160 Z" fill="#65A30D" stroke="#0F1B33" strokeWidth="2.5" />
    <rect x="42" y="52" width="40" height="26" fill="#E7E5E4" stroke="#0F1B33" strokeWidth="2.5" />
    <path d="M42 52 L46 42 L52 52 M58 52 L62 42 L68 52 M74 52 L78 42 L82 52" fill="#E7E5E4" stroke="#0F1B33" strokeWidth="2" />
    <path d="M140 160 Q160 120 195 130 L200 160 Z" fill="#38BDF8" stroke="#0F1B33" strokeWidth="2" />
  </svg>
);
const Hoggar = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full">
    <rect x="0" y="130" width="200" height="30" fill="#FDBA74" />
    {/* volcanic peaks */}
    <path d="M20 130 L45 55 L58 90 L75 40 L95 130 Z" fill="#9A3412" stroke="#0F1B33" strokeWidth="2.5" />
    <path d="M90 130 L120 60 L140 100 L158 70 L185 130 Z" fill="#C2410C" stroke="#0F1B33" strokeWidth="2.5" />
    <circle cx="165" cy="35" r="14" fill="#FCD34D" stroke="#0F1B33" strokeWidth="2" />
  </svg>
);
const Ghardaia = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full">
    <rect x="0" y="135" width="200" height="25" fill="#FDE68A" />
    {/* stacked cubic houses on a hill + minaret */}
    <path d="M20 135 Q100 55 180 135 Z" fill="#FBBF77" stroke="#0F1B33" strokeWidth="2.5" />
    <rect x="55" y="105" width="24" height="20" fill="#FEF3C7" stroke="#0F1B33" strokeWidth="2" />
    <rect x="90" y="90" width="26" height="22" fill="#FDE68A" stroke="#0F1B33" strokeWidth="2" />
    <rect x="126" y="105" width="22" height="20" fill="#FEF3C7" stroke="#0F1B33" strokeWidth="2" />
    <path d="M96 90 L96 52 L104 44 L112 52 L112 90" fill="#F59E0B" stroke="#0F1B33" strokeWidth="2.5" />
  </svg>
);
const Djemila = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full">
    <rect x="0" y="130" width="200" height="30" fill="#A7F3D0" />
    {/* row of Roman columns on green hills */}
    {[40, 75, 110, 145].map((x, i) => (
      <g key={i}>
        <rect x={x} y="65" width="12" height="65" fill="#E7E5E4" stroke="#0F1B33" strokeWidth="2.5" />
        <rect x={x - 4} y="58" width="20" height="9" fill="#D6D3D1" stroke="#0F1B33" strokeWidth="2" />
      </g>
    ))}
    <line x1="30" y1="56" x2="170" y2="56" stroke="#0F1B33" strokeWidth="3" />
  </svg>
);
const KalaaBeniHammad = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full">
    <rect x="0" y="130" width="200" height="30" fill="#FED7AA" />
    {/* fortress wall + central minaret ruin */}
    <path d="M25 130 L25 95 L40 95 L40 105 L55 105 L55 95 L70 95 L70 130 Z" fill="#D97706" stroke="#0F1B33" strokeWidth="2.5" />
    <path d="M130 130 L130 95 L145 95 L145 105 L160 105 L160 95 L175 95 L175 130 Z" fill="#D97706" stroke="#0F1B33" strokeWidth="2.5" />
    <rect x="88" y="50" width="24" height="80" fill="#F59E0B" stroke="#0F1B33" strokeWidth="2.5" />
    <rect x="93" y="60" width="6" height="9" fill="#0F1B33" />
    <rect x="102" y="60" width="6" height="9" fill="#0F1B33" />
    <rect x="93" y="78" width="6" height="9" fill="#0F1B33" />
  </svg>
);
const GrandeMosquee = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full">
    <rect x="0" y="130" width="200" height="30" fill="#BAE6FD" />
    {/* modern mosque + very tall minaret */}
    <rect x="30" y="95" width="90" height="35" fill="#E0F2FE" stroke="#0F1B33" strokeWidth="2.5" />
    <path d="M45 95 A30 30 0 0 1 105 95" fill="#7DD3FC" stroke="#0F1B33" strokeWidth="2.5" />
    <circle cx="75" cy="62" r="4" fill="#D4A72C" stroke="#0F1B33" strokeWidth="1.5" />
    <rect x="148" y="25" width="20" height="105" fill="#E0F2FE" stroke="#0F1B33" strokeWidth="2.5" />
    <rect x="152" y="35" width="12" height="6" fill="#7DD3FC" />
    <rect x="152" y="55" width="12" height="6" fill="#7DD3FC" />
    <rect x="152" y="75" width="12" height="6" fill="#7DD3FC" />
    <circle cx="158" cy="18" r="5" fill="#D4A72C" stroke="#0F1B33" strokeWidth="1.5" />
  </svg>
);

const MONUMENTS: Monument[] = [
  { k: "maqam",   name_fr: "Maqam Echahid",            name_ar: "مقام الشهيد",          city_fr: "Alger",        city_ar: "الجزائر العاصمة", draw: MaqamEchahid },
  { k: "timgad",  name_fr: "Ruines de Timgad",         name_ar: "آثار تيمقاد",          city_fr: "Batna",        city_ar: "باتنة",           draw: Timgad },
  { k: "pont",    name_fr: "Pont Sidi M'Cid",          name_ar: "جسر سيدي مسيد",        city_fr: "Constantine",  city_ar: "قسنطينة",         draw: PontConstantine },
  { k: "santa",   name_fr: "Fort Santa Cruz",          name_ar: "حصن سانتا كروز",       city_fr: "Oran",         city_ar: "وهران",           draw: SantaCruz },
  { k: "hoggar",  name_fr: "Le Hoggar (Assekrem)",     name_ar: "جبال الهقار",          city_fr: "Tamanrasset",  city_ar: "تمنراست",         draw: Hoggar },
  { k: "mzab",    name_fr: "Vallée du M'Zab",          name_ar: "وادي ميزاب",           city_fr: "Ghardaïa",     city_ar: "غرداية",          draw: Ghardaia },
  { k: "djemila", name_fr: "Ruines de Djémila",        name_ar: "آثار جميلة",           city_fr: "Sétif",        city_ar: "سطيف",            draw: Djemila },
  { k: "kalaa",   name_fr: "Kalâa des Béni Hammad",    name_ar: "قلعة بني حماد",        city_fr: "M'Sila",       city_ar: "المسيلة",         draw: KalaaBeniHammad },
  { k: "djamaa",  name_fr: "Djamaâ El Djazaïr",        name_ar: "جامع الجزائر",         city_fr: "Alger",        city_ar: "الجزائر العاصمة", draw: GrandeMosquee },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function Monuments() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const goBack = useGameBack();

  const [order, setOrder] = useState<Monument[]>(() => shuffle(MONUMENTS));
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [best, setBest] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const v = Number(window.localStorage.getItem(STORAGE_KEY));
    if (Number.isFinite(v) && v > 0) setBest(v);
  }, []);

  const m = order[round];
  // 4 city options: the right one + 3 others, stable per round.
  const [options, setOptions] = useState<Monument[]>([]);
  useEffect(() => {
    // Wrong options must be 3 DISTINCT cities different from the answer
    // (several monuments share a city, e.g. Alger).
    const seen = new Set<string>([m.city_fr]);
    const others: Monument[] = [];
    for (const x of shuffle(MONUMENTS)) {
      if (seen.has(x.city_fr)) continue;
      seen.add(x.city_fr);
      others.push(x);
      if (others.length === 3) break;
    }
    setOptions(shuffle([m, ...others]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, order]);

  const pick = (cityFr: string) => {
    if (picked !== null) return;
    setPicked(cityFr);
    const good = cityFr === m.city_fr;
    if (good) {
      setScore((s) => s + 1);
      try { confetti({ particleCount: 30, spread: 55, origin: { y: 0.6 } }); } catch { /* ignore */ }
    }
    setTimeout(() => {
      if (round + 1 >= MONUMENTS.length) {
        const final = score + (good ? 1 : 0);
        setDone(true);
        if (best === null || final > best) {
          setBest(final);
          try { window.localStorage.setItem(STORAGE_KEY, String(final)); } catch { /* ignore */ }
        }
        if (final === MONUMENTS.length) {
          try { confetti({ particleCount: 150, spread: 110, colors: ["#D4A72C", "#0F1B33", "#1AD18C"] }); } catch { /* ignore */ }
        }
      } else {
        setRound((r) => r + 1);
        setPicked(null);
      }
    }, 1100);
  };

  const restart = () => {
    setOrder(shuffle(MONUMENTS)); setRound(0); setPicked(null); setScore(0); setDone(false);
  };

  if (done) {
    const total = MONUMENTS.length;
    const stars = score >= total - 1 ? 3 : score >= total - 3 ? 2 : 1;
    return (
      <div className="min-h-screen bg-cream dark:bg-surface-2 flex items-center justify-center px-5">
        <MascotCelebration trigger={score === total} locale={isAr ? "ar" : "fr"} />
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">{score >= total - 1 ? "🏆" : score >= total - 3 ? "🌟" : "✨"}</div>
          <h1 className="text-3xl font-bold text-navy mb-2">{isAr ? "أحسنت !" : "Bravo !"}</h1>
          <div className="text-2xl mb-2">{"★".repeat(stars)}<span className="text-line">{"☆".repeat(3 - stars)}</span></div>
          <div className="text-5xl font-bold text-gold my-2">{score}<span className="text-2xl text-fg-soft"> / {total}</span></div>
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
          {isAr ? "معالم الجزائر" : "Monuments d'Algérie"} <span className="text-xl">🏛️</span>
        </h1>
        <div className="text-xs font-bold text-fg-soft">{round + 1}/{MONUMENTS.length}</div>
      </header>

      <main className="flex-1 px-5 py-6 max-w-md mx-auto w-full flex flex-col justify-center">
        <div className="bg-surface border-4 border-pale-blue rounded-3xl p-4 mb-4">
          <div className="aspect-[5/4] max-h-52 mx-auto">{m.draw()}</div>
          <div className="text-center font-bold text-navy text-lg mt-2">
            {isAr ? m.name_ar : m.name_fr}
          </div>
        </div>

        <p className="text-sm text-fg-soft text-center mb-4">
          {isAr ? "في أي مدينة يوجد هذا المعلم؟" : "Dans quelle ville se trouve ce monument ?"}
        </p>

        <div className="grid grid-cols-2 gap-3">
          {options.map((o) => {
            const state =
              picked === null ? "idle"
              : o.city_fr === m.city_fr ? "good"
              : o.city_fr === picked ? "bad"
              : "idle";
            return (
              <button
                key={o.city_fr}
                onClick={() => pick(o.city_fr)}
                disabled={picked !== null}
                className={`rounded-2xl border-4 py-4 px-2 text-base font-bold transition active:scale-95 ${
                  state === "good" ? "bg-emerald-100 border-emerald-500 text-emerald-800"
                  : state === "bad" ? "bg-red-100 border-red-400 text-red-700"
                  : "bg-surface border-pale-blue text-navy hover:border-gold"
                }`}
              >
                {isAr ? o.city_ar : o.city_fr}
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
