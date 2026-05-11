"use client";

/**
 * Émotions — emotion-recognition game (CASEL-aligned SEL skill).
 *
 * 8 emotions rendered as expressive inline-SVG faces (no emoji — bigger,
 * clearer, more readable for 4-7yo). Each round shows one face and 3
 * labelled chips to pick from. After 8 rounds we show stars + best score.
 *
 * Why this matters: emotion-vocabulary is one of the strongest predictors
 * of later social-emotional regulation. Algerian school curricula don't
 * cover SEL — we fill the gap.
 */

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { useGameBack } from "./useGameBack";
import { MascotCelebration } from "@/components/app/MascotCelebration";
import confetti from "canvas-confetti";

type Mood = "happy" | "sad" | "angry" | "surprised" | "scared" | "tired" | "calm" | "love";

interface Emotion {
  key: Mood;
  fr: string;
  ar: string;
  /** SVG-only (no emoji) — drawn into a 200×200 viewbox face. */
  draw: () => React.ReactElement;
}

/**
 * Each face shares a common round head + cheeks + eyebrows skeleton, then
 * the eyes + mouth differ per emotion. We render them as inline SVG so we
 * can color-code (gold for happy, blue for sad, red for angry, etc.) and
 * scale crisp on retina.
 */
const FACE_BG = "#FDE68A"; // warm gold-ish base
const STROKE = "#0F1B33";

function FaceBase({ tint = FACE_BG, children }: { tint?: string; children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <circle cx="100" cy="100" r="90" fill={tint} stroke={STROKE} strokeWidth="5" />
      {children}
    </svg>
  );
}

const EMOTIONS: Emotion[] = [
  {
    key: "happy",
    fr: "Heureux",
    ar: "سعيد",
    draw: () => (
      <FaceBase tint="#FCD34D">
        {/* eyes — closed-arch smile shape */}
        <path d="M65 90 Q75 80 85 90" fill="none" stroke={STROKE} strokeWidth="5" strokeLinecap="round" />
        <path d="M115 90 Q125 80 135 90" fill="none" stroke={STROKE} strokeWidth="5" strokeLinecap="round" />
        {/* big smile */}
        <path d="M60 125 Q100 165 140 125" fill="#C53030" stroke={STROKE} strokeWidth="5" strokeLinejoin="round" />
        {/* cheeks */}
        <circle cx="60" cy="120" r="8" fill="#F87171" opacity="0.6" />
        <circle cx="140" cy="120" r="8" fill="#F87171" opacity="0.6" />
      </FaceBase>
    ),
  },
  {
    key: "sad",
    fr: "Triste",
    ar: "حزين",
    draw: () => (
      <FaceBase tint="#93C5FD">
        <circle cx="75" cy="90" r="6" fill={STROKE} />
        <circle cx="125" cy="90" r="6" fill={STROKE} />
        {/* tear */}
        <path d="M75 100 L75 125" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round" />
        <circle cx="75" cy="128" r="4" fill="#3B82F6" />
        {/* frown */}
        <path d="M65 145 Q100 115 135 145" fill="none" stroke={STROKE} strokeWidth="5" strokeLinecap="round" />
      </FaceBase>
    ),
  },
  {
    key: "angry",
    fr: "En colère",
    ar: "غاضب",
    draw: () => (
      <FaceBase tint="#FCA5A5">
        {/* angled eyebrows */}
        <path d="M55 80 L90 95" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
        <path d="M145 80 L110 95" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
        <circle cx="75" cy="100" r="5" fill={STROKE} />
        <circle cx="125" cy="100" r="5" fill={STROKE} />
        {/* zigzag mouth */}
        <path d="M65 145 L80 135 L95 145 L110 135 L125 145 L135 137" fill="none" stroke={STROKE} strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" />
      </FaceBase>
    ),
  },
  {
    key: "surprised",
    fr: "Surpris",
    ar: "متفاجئ",
    draw: () => (
      <FaceBase tint="#FDE68A">
        {/* raised brows */}
        <path d="M58 75 Q75 65 92 75" fill="none" stroke={STROKE} strokeWidth="5" strokeLinecap="round" />
        <path d="M108 75 Q125 65 142 75" fill="none" stroke={STROKE} strokeWidth="5" strokeLinecap="round" />
        {/* big round eyes */}
        <circle cx="75" cy="95" r="9" fill="#fff" stroke={STROKE} strokeWidth="3" />
        <circle cx="75" cy="95" r="4" fill={STROKE} />
        <circle cx="125" cy="95" r="9" fill="#fff" stroke={STROKE} strokeWidth="3" />
        <circle cx="125" cy="95" r="4" fill={STROKE} />
        {/* O mouth */}
        <ellipse cx="100" cy="140" rx="14" ry="18" fill={STROKE} />
      </FaceBase>
    ),
  },
  {
    key: "scared",
    fr: "Apeuré",
    ar: "خائف",
    draw: () => (
      <FaceBase tint="#DDD6FE">
        {/* worried brows */}
        <path d="M58 88 Q75 78 92 88" fill="none" stroke={STROKE} strokeWidth="5" strokeLinecap="round" />
        <path d="M108 88 Q125 78 142 88" fill="none" stroke={STROKE} strokeWidth="5" strokeLinecap="round" />
        <circle cx="75" cy="100" r="5" fill={STROKE} />
        <circle cx="125" cy="100" r="5" fill={STROKE} />
        {/* trembling mouth */}
        <path d="M70 140 Q80 132 90 140 Q100 148 110 140 Q120 132 130 140" fill="none" stroke={STROKE} strokeWidth="5" strokeLinecap="round" />
        {/* sweat drop */}
        <ellipse cx="155" cy="80" rx="6" ry="10" fill="#3B82F6" />
      </FaceBase>
    ),
  },
  {
    key: "tired",
    fr: "Fatigué",
    ar: "تعبان",
    draw: () => (
      <FaceBase tint="#E5E7EB">
        {/* half-closed eyes */}
        <path d="M60 95 L90 95" stroke={STROKE} strokeWidth="5" strokeLinecap="round" />
        <path d="M110 95 L140 95" stroke={STROKE} strokeWidth="5" strokeLinecap="round" />
        {/* under-eye bags */}
        <path d="M62 105 Q75 110 88 105" fill="none" stroke={STROKE} strokeWidth="2" />
        <path d="M112 105 Q125 110 138 105" fill="none" stroke={STROKE} strokeWidth="2" />
        {/* small mouth */}
        <line x1="85" y1="140" x2="115" y2="140" stroke={STROKE} strokeWidth="5" strokeLinecap="round" />
        {/* Z's */}
        <text x="150" y="65" fontSize="22" fontWeight="700" fill={STROKE}>Z</text>
        <text x="165" y="50" fontSize="16" fontWeight="700" fill={STROKE}>z</text>
      </FaceBase>
    ),
  },
  {
    key: "calm",
    fr: "Calme",
    ar: "هادئ",
    draw: () => (
      <FaceBase tint="#A7F3D0">
        {/* soft closed-eye arcs */}
        <path d="M65 95 Q75 90 85 95" fill="none" stroke={STROKE} strokeWidth="5" strokeLinecap="round" />
        <path d="M115 95 Q125 90 135 95" fill="none" stroke={STROKE} strokeWidth="5" strokeLinecap="round" />
        {/* soft smile */}
        <path d="M75 135 Q100 150 125 135" fill="none" stroke={STROKE} strokeWidth="5" strokeLinecap="round" />
      </FaceBase>
    ),
  },
  {
    key: "love",
    fr: "Amoureux",
    ar: "محب",
    draw: () => (
      <FaceBase tint="#FBCFE8">
        {/* heart eyes */}
        <path d="M75 95 C68 87 55 92 60 102 C63 108 75 115 75 115 C75 115 87 108 90 102 C95 92 82 87 75 95 Z" fill="#E11D48" />
        <path d="M125 95 C118 87 105 92 110 102 C113 108 125 115 125 115 C125 115 137 108 140 102 C145 92 132 87 125 95 Z" fill="#E11D48" />
        {/* smile */}
        <path d="M70 140 Q100 165 130 140" fill="#C53030" stroke={STROKE} strokeWidth="4" strokeLinejoin="round" />
      </FaceBase>
    ),
  },
];

const STORAGE_KEY = "najah:emotions:best";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function Emotions() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const goBack = useGameBack();

  // Build a fresh 8-question round (one per emotion, shuffled).
  const [rounds, setRounds] = useState(() => shuffle(EMOTIONS));
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<Mood | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [best, setBest] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = Number(window.localStorage.getItem(STORAGE_KEY));
    if (Number.isFinite(saved) && saved > 0) setBest(saved);
  }, []);

  // Distractor chips: 1 correct + 2 random others, shuffled
  const choices = useMemo<Emotion[]>(() => {
    const correct = rounds[idx];
    const others = shuffle(EMOTIONS.filter((e) => e.key !== correct.key)).slice(0, 2);
    return shuffle([correct, ...others]);
  }, [rounds, idx]);

  const onPick = (k: Mood) => {
    if (picked) return;
    setPicked(k);
    if (k === rounds[idx].key) {
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
    setRounds(shuffle(EMOTIONS));
    setIdx(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  };

  if (done) {
    const stars = score >= 7 ? 3 : score >= 5 ? 2 : 1;
    return (
      <div className="min-h-screen bg-cream dark:bg-surface-2 flex items-center justify-center px-5">
        <MascotCelebration trigger={score === rounds.length} locale={isAr ? "ar" : "fr"} />
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">{score === rounds.length ? "🏆" : score >= 5 ? "🌟" : "✨"}</div>
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

  const current = rounds[idx];
  const correctKey = current.key;

  return (
    <div className="min-h-screen bg-cream dark:bg-surface-2 flex flex-col">
      <header className="px-5 py-4 flex items-center justify-between bg-surface border-b border-line">
        <button onClick={goBack} className="w-10 h-10 rounded-full bg-surface border border-pale-blue flex items-center justify-center text-navy" aria-label={isAr ? "رجوع" : "Retour"}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h1 className="text-base md:text-lg font-bold text-navy">
          {isAr ? "المشاعر" : "Les émotions"} <span className="text-xl">😊</span>
        </h1>
        <div className="text-xs font-bold text-fg-soft">{idx + 1}/{rounds.length} · ⭐{score}</div>
      </header>

      <main className="flex-1 px-5 py-6 max-w-md md:max-w-3xl mx-auto w-full text-center">
        <div className="text-sm md:text-base text-fg-soft mb-3">
          {isAr ? "ماذا يشعر هذا الوجه ؟" : "Que ressent ce visage ?"}
        </div>

        {/* Big face card */}
        <div className="bg-surface border-4 border-navy rounded-3xl p-4 md:p-6 mb-6 shadow-card mx-auto" style={{ maxWidth: 320 }}>
          <div className="aspect-square">{current.draw()}</div>
        </div>

        {/* 3 choice chips */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
          {choices.map((c) => {
            const isPicked = picked === c.key;
            const showCorrect = picked && c.key === correctKey;
            const showWrong = isPicked && c.key !== correctKey;
            return (
              <button
                key={c.key}
                onClick={() => onPick(c.key)}
                disabled={!!picked}
                className={`py-4 px-4 rounded-2xl border-2 font-bold text-base md:text-lg transition active:scale-[0.98] ${
                  showCorrect ? "bg-emerald-100 border-emerald-500 text-emerald-900"
                  : showWrong ? "bg-red-100 border-red-500 text-red-900"
                  : picked ? "bg-surface border-pale-blue text-navy/60"
                  : "bg-surface border-pale-blue text-navy hover:border-gold hover:bg-pale-blue/30"
                }`}
              >
                {isAr ? c.ar : c.fr}
                {showCorrect && <span className="ms-2">✓</span>}
                {showWrong && <span className="ms-2">✗</span>}
              </button>
            );
          })}
        </div>

        {best !== null && (
          <div className="text-xs text-fg-soft mt-6">
            {isAr ? "أفضل نتيجة" : "Record"}: <span className="font-bold text-navy">{best}/{rounds.length}</span>
          </div>
        )}
      </main>
    </div>
  );
}
