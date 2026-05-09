"use client";

/**
 * Métiers — "Qui fait quoi ?" quiz on 16 jobs.
 *
 * Each round shows a short description ("Soigne les malades à l'hôpital")
 * with 4 picture-buttons (jobs as inline-SVG avatars). Kid taps the right
 * one. Mix of universal jobs + Algerian-specific ones (imam, fellah,
 * pêcheur). 12 rounds, stars on score.
 */

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { useGameBack } from "./useGameBack";
import { MascotCelebration } from "@/components/app/MascotCelebration";
import confetti from "canvas-confetti";

interface Job {
  k: string;
  fr: string;
  ar: string;
  /** Short description used as the question prompt. */
  desc_fr: string;
  desc_ar: string;
  emoji: string;
  /** Optional SVG avatar — fallback to emoji if absent. */
  draw?: () => React.ReactElement;
}

const JOBS: Job[] = [
  { k: "doctor",   fr: "Médecin",       ar: "طبيب",    desc_fr: "Soigne les malades à l'hôpital",       desc_ar: "يعالج المرضى في المستشفى",     emoji: "🩺" },
  { k: "teacher",  fr: "Enseignant",    ar: "معلم",    desc_fr: "Apprend aux enfants à l'école",         desc_ar: "يعلّم الأطفال في المدرسة",      emoji: "👨‍🏫" },
  { k: "firefighter", fr: "Pompier",   ar: "إطفائي",  desc_fr: "Éteint les incendies, sauve les gens",   desc_ar: "يطفئ الحرائق وينقذ الناس",      emoji: "👨‍🚒" },
  { k: "police",   fr: "Policier",      ar: "شرطي",    desc_fr: "Protège les citoyens, dirige la circulation", desc_ar: "يحمي المواطنين وينظّم المرور", emoji: "👮" },
  { k: "baker",    fr: "Boulanger",     ar: "خباز",    desc_fr: "Fait du pain et des croissants chaque matin", desc_ar: "يصنع الخبز والكرواسون كلّ صباح", emoji: "👨‍🍳" },
  { k: "farmer",   fr: "Agriculteur",   ar: "فلاح",    desc_fr: "Cultive la terre et récolte les légumes", desc_ar: "يزرع الأرض ويجمع الخضر",        emoji: "🧑‍🌾" },
  { k: "fisher",   fr: "Pêcheur",       ar: "صياد",    desc_fr: "Attrape des poissons en mer",            desc_ar: "يصطاد السمك في البحر",           emoji: "🎣" },
  { k: "imam",     fr: "Imam",          ar: "إمام",    desc_fr: "Dirige la prière à la mosquée",          desc_ar: "يؤمّ الصلاة في المسجد",          emoji: "🕌" },
  { k: "pilot",    fr: "Pilote",        ar: "طيّار",   desc_fr: "Conduit des avions",                     desc_ar: "يقود الطائرات",                  emoji: "✈️" },
  { k: "vet",      fr: "Vétérinaire",   ar: "طبيب بيطري", desc_fr: "Soigne les animaux",                  desc_ar: "يعالج الحيوانات",                emoji: "🐾" },
  { k: "carpenter", fr: "Menuisier",    ar: "نجار",    desc_fr: "Fabrique des meubles en bois",           desc_ar: "يصنع الأثاث من الخشب",           emoji: "🪚" },
  { k: "plumber",  fr: "Plombier",      ar: "سبّاك",   desc_fr: "Répare les tuyaux et la plomberie",      desc_ar: "يصلح الأنابيب",                  emoji: "🔧" },
  { k: "driver",   fr: "Chauffeur",     ar: "سائق",    desc_fr: "Conduit le bus ou le taxi",              desc_ar: "يقود الحافلة أو سيارة الأجرة",   emoji: "🚌" },
  { k: "tailor",   fr: "Couturier",     ar: "خيّاط",   desc_fr: "Coud des vêtements",                     desc_ar: "يخيط الملابس",                   emoji: "🧵" },
  { k: "chef",     fr: "Cuisinier",     ar: "طبّاخ",   desc_fr: "Prépare des plats au restaurant",        desc_ar: "يحضّر الأطباق في المطعم",        emoji: "🍳" },
  { k: "engineer", fr: "Ingénieur",     ar: "مهندس",   desc_fr: "Conçoit des machines et des bâtiments",  desc_ar: "يصمّم الآلات والبنايات",         emoji: "👷" },
];

const STORAGE_KEY = "najah:metiers:best";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const TOTAL = 12;

export function Metiers() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const goBack = useGameBack();

  const [rounds, setRounds] = useState(() => shuffle(JOBS).slice(0, TOTAL));
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [best, setBest] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const v = Number(window.localStorage.getItem(STORAGE_KEY));
    if (Number.isFinite(v) && v > 0) setBest(v);
  }, []);

  const current = rounds[idx];

  // 4 choices per round: correct + 3 distractors
  const choices = useMemo<Job[]>(() => {
    const others = shuffle(JOBS.filter((j) => j.k !== current.k)).slice(0, 3);
    return shuffle([current, ...others]);
  }, [current]);

  const onPick = (k: string) => {
    if (picked) return;
    setPicked(k);
    if (k === current.k) {
      setScore((s) => s + 1);
      try { confetti({ particleCount: 25, spread: 55, origin: { y: 0.6 } }); } catch { /* ignore */ }
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
    setRounds(shuffle(JOBS).slice(0, TOTAL));
    setIdx(0); setPicked(null); setScore(0); setDone(false);
  };

  if (done) {
    const stars = score >= 11 ? 3 : score >= 8 ? 2 : 1;
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-5">
        <MascotCelebration trigger={score === rounds.length} locale={isAr ? "ar" : "fr"} />
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">{score === rounds.length ? "🏆" : score >= 8 ? "🌟" : "✨"}</div>
          <h1 className="text-3xl font-bold text-navy mb-2">{isAr ? "أحسنت !" : "Bravo !"}</h1>
          <div className="text-2xl mb-2">{"★".repeat(stars)}<span className="text-line">{"☆".repeat(3 - stars)}</span></div>
          <div className="text-5xl font-bold text-gold my-2">{score}<span className="text-2xl text-fg-soft"> / {rounds.length}</span></div>
          {best !== null && (
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
          {isAr ? "المهن" : "Les métiers"} <span className="text-xl">👷</span>
        </h1>
        <div className="text-xs font-bold text-fg-soft">{idx + 1}/{rounds.length} · ⭐{score}</div>
      </header>

      <main className="flex-1 px-5 py-6 max-w-md md:max-w-3xl mx-auto w-full">
        {/* Description prompt */}
        <div className="bg-white border-4 border-navy rounded-3xl p-4 md:p-6 mb-6 text-center shadow-card">
          <div className="text-xs uppercase tracking-wider text-gold font-bold mb-1">{isAr ? "من يفعل هذا ؟" : "Qui fait ça ?"}</div>
          <p className="text-lg md:text-xl font-bold text-navy" dir={isAr ? "rtl" : "ltr"}>
            {isAr ? current.desc_ar : current.desc_fr}
          </p>
        </div>

        {/* 2x2 picture grid */}
        <div className="grid grid-cols-2 gap-3">
          {choices.map((c) => {
            const isPicked = picked === c.k;
            const showCorrect = picked && c.k === current.k;
            const showWrong = isPicked && c.k !== current.k;
            return (
              <button
                key={c.k}
                onClick={() => onPick(c.k)}
                disabled={!!picked}
                className={`bg-white rounded-2xl border-4 p-4 flex flex-col items-center gap-2 transition active:scale-95 ${
                  showCorrect ? "border-emerald-500 ring-4 ring-emerald-200 bg-emerald-50"
                  : showWrong ? "border-red-500 ring-4 ring-red-200 bg-red-50"
                  : picked ? "border-pale-blue opacity-60"
                  : "border-pale-blue hover:border-gold"
                }`}
              >
                <span className="text-5xl md:text-6xl">{c.emoji}</span>
                <span className="font-bold text-sm md:text-base text-navy">{isAr ? c.ar : c.fr}</span>
                {showCorrect && <span className="text-emerald-600 text-xs">✓ {isAr ? "صحيح" : "Bravo"}</span>}
                {showWrong && <span className="text-red-600 text-xs">✗</span>}
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
