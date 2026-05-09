"use client";

/**
 * Mon corps — interactive human-anatomy game.
 *
 * A stylised friendly child figure rendered in inline SVG. Each labelled
 * region (head, eye, ear, nose, mouth, hand, arm, leg, foot, knee, belly,
 * heart) is its own clickable hit-zone with a pulsing prompt outline.
 *
 * Two modes:
 *   - "discover": kid taps a part → label appears in FR + AR with a TTS
 *     pronunciation. No pressure, no score. Helps build vocabulary first.
 *   - "quiz": prompt asks for one part by name (alternates FR/AR), kid
 *     taps the right region. 10 prompts, 1 star per 4 correct.
 *
 * Audience: 4-8 yo. The visuals carry the meaning — kids who can't read
 * yet can play "discover" mode by emoji + TTS alone. Bilingual labels
 * support our French L1 + Arabic L2 learners.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { useGameBack } from "./useGameBack";
import { MascotCelebration } from "@/components/app/MascotCelebration";
import confetti from "canvas-confetti";

type PartKey =
  | "head" | "eye" | "ear" | "nose" | "mouth"
  | "hand" | "arm" | "leg" | "foot" | "knee"
  | "belly" | "heart";

interface Part {
  key: PartKey;
  fr: string;
  ar: string;
  emoji: string;
  /** absolute x,y in our 320×420 viewbox where the label tooltip should appear */
  labelAt: { x: number; y: number };
}

const PARTS: Part[] = [
  { key: "head",  fr: "La tête",     ar: "الرأس",   emoji: "🧠", labelAt: { x: 200, y: 60 } },
  { key: "eye",   fr: "L'œil",       ar: "العين",   emoji: "👁️", labelAt: { x: 230, y: 70 } },
  { key: "ear",   fr: "L'oreille",   ar: "الأذن",   emoji: "👂", labelAt: { x: 250, y: 78 } },
  { key: "nose",  fr: "Le nez",      ar: "الأنف",   emoji: "👃", labelAt: { x: 200, y: 90 } },
  { key: "mouth", fr: "La bouche",   ar: "الفم",    emoji: "👄", labelAt: { x: 200, y: 105 } },
  { key: "arm",   fr: "Le bras",     ar: "الذراع",  emoji: "💪", labelAt: { x: 100, y: 200 } },
  { key: "hand",  fr: "La main",     ar: "اليد",    emoji: "✋", labelAt: { x: 70, y: 245 } },
  { key: "belly", fr: "Le ventre",   ar: "البطن",   emoji: "🤰", labelAt: { x: 200, y: 220 } },
  { key: "heart", fr: "Le cœur",     ar: "القلب",   emoji: "❤️", labelAt: { x: 175, y: 175 } },
  { key: "leg",   fr: "La jambe",    ar: "الساق",   emoji: "🦵", labelAt: { x: 175, y: 320 } },
  { key: "knee",  fr: "Le genou",    ar: "الركبة",  emoji: "🦵", labelAt: { x: 225, y: 320 } },
  { key: "foot",  fr: "Le pied",     ar: "القدم",   emoji: "🦶", labelAt: { x: 215, y: 400 } },
];

const STORAGE_KEY = "najah:moncorps:best";

export function MonCorps() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const goBack = useGameBack();

  type Mode = "discover" | "quiz";
  const [mode, setMode] = useState<Mode>("discover");

  // Discover mode state — last tapped part for the floating label.
  const [revealed, setRevealed] = useState<PartKey | null>(null);

  // Quiz mode state
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [done, setDone] = useState(false);
  const [best, setBest] = useState<number | null>(null);

  // Random sequence of 10 prompts (each part can repeat once)
  const prompts = useMemo<PartKey[]>(() => {
    const pool = [...PARTS, ...PARTS].map((p) => p.key);
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, 10);
  }, [mode === "quiz" ? round === 0 : false]); // regen each fresh quiz

  // Alternate FR/AR for prompt language so kids hear both names.
  const promptLang: "fr" | "ar" = round % 2 === 0 ? (isAr ? "ar" : "fr") : isAr ? "fr" : "ar";

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = Number(window.localStorage.getItem(STORAGE_KEY));
    if (Number.isFinite(saved) && saved > 0) setBest(saved);
  }, []);

  const speak = (text: string, lang: "fr" | "ar") => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang === "ar" ? "ar-SA" : "fr-FR";
      u.rate = 0.85;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch { /* ignore */ }
  };

  const onTapPart = (key: PartKey) => {
    const part = PARTS.find((p) => p.key === key)!;
    if (mode === "discover") {
      setRevealed(key);
      speak(isAr ? part.ar : part.fr, isAr ? "ar" : "fr");
      // After 2.5s clear so the label doesn't linger forever
      window.setTimeout(() => setRevealed((r) => (r === key ? null : r)), 2500);
      return;
    }
    // quiz
    const target = prompts[round];
    if (key === target) {
      setFeedback("correct");
      setScore((s) => s + 1);
      try { confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } }); } catch { /* ignore */ }
      window.setTimeout(() => {
        setFeedback(null);
        if (round + 1 >= prompts.length) {
          setDone(true);
        } else {
          setRound((r) => r + 1);
        }
      }, 600);
    } else {
      setFeedback("wrong");
      window.setTimeout(() => setFeedback(null), 600);
    }
  };

  // Persist best on quiz completion
  useEffect(() => {
    if (!done) return;
    if (best === null || score > best) {
      setBest(score);
      try { window.localStorage.setItem(STORAGE_KEY, String(score)); } catch { /* ignore */ }
    }
    if (score === prompts.length) {
      try { confetti({ particleCount: 140, spread: 110, colors: ["#D4A72C", "#0F1B33", "#1AD18C"] }); } catch { /* ignore */ }
    }
  }, [done]); // eslint-disable-line react-hooks/exhaustive-deps

  const restart = () => {
    setRound(0); setScore(0); setFeedback(null); setDone(false);
    setRevealed(null);
  };

  // ===== Result screen =====
  if (mode === "quiz" && done) {
    const pct = Math.round((score / prompts.length) * 100);
    const stars = score >= 9 ? 3 : score >= 7 ? 2 : 1;
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-5">
        <MascotCelebration trigger={score === prompts.length} locale={isAr ? "ar" : "fr"} />
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">{pct === 100 ? "🏆" : pct >= 70 ? "🌟" : "✨"}</div>
          <h1 className="text-3xl font-bold text-navy mb-2">{isAr ? "أحسنت !" : "Bravo !"}</h1>
          <div className="text-2xl mb-2">{"★".repeat(stars)}<span className="text-line">{"☆".repeat(3 - stars)}</span></div>
          <div className="text-5xl font-bold text-gold my-2">{score}<span className="text-2xl text-fg-soft"> / {prompts.length}</span></div>
          {best !== null && best !== score && (
            <div className="text-xs text-fg-soft mt-1">{isAr ? "أفضل نتيجة" : "Record"} : {best}/{prompts.length}</div>
          )}
          <div className="flex gap-3 mt-6">
            <button onClick={goBack} className="btn btn-outline flex-1">{isAr ? "خروج" : "Quitter"}</button>
            <button onClick={restart} className="btn btn-primary flex-1">{isAr ? "إعادة" : "Rejouer"}</button>
          </div>
        </div>
      </div>
    );
  }

  // ===== Active game =====
  const currentPrompt = mode === "quiz" ? PARTS.find((p) => p.key === prompts[round])! : null;
  const promptText = currentPrompt
    ? promptLang === "ar"
      ? currentPrompt.ar
      : currentPrompt.fr
    : "";

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <header className="px-5 py-4 flex items-center justify-between bg-white border-b border-pale-blue">
        <button onClick={goBack} className="w-10 h-10 rounded-full bg-white border border-pale-blue flex items-center justify-center text-navy" aria-label={isAr ? "رجوع" : "Retour"}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h1 className="text-base md:text-lg font-bold text-navy">
          {isAr ? "جسمي" : "Mon corps"} <span className="text-xl">🧒</span>
        </h1>
        <button onClick={() => setMode(mode === "discover" ? "quiz" : "discover")}
          className="text-xs font-semibold text-navy bg-pale-blue/40 rounded-full px-3 py-1.5">
          {mode === "discover" ? (isAr ? "اختبار ←" : "Quiz →") : (isAr ? "← اكتشاف" : "← Découvrir")}
        </button>
      </header>

      <main className="flex-1 px-4 py-5 max-w-md md:max-w-3xl mx-auto w-full">
        {/* Mode caption / quiz prompt */}
        <div className="text-center mb-4">
          {mode === "discover" ? (
            <p className="text-sm md:text-base text-fg-soft">
              {isAr ? "اضغط على الجزء لمعرفة اسمه 🔊" : "Touche une partie pour entendre son nom 🔊"}
            </p>
          ) : (
            <div className="bg-white border-4 border-navy rounded-2xl py-3 px-4 inline-block min-w-[260px]">
              <div className="text-xs text-fg-soft mb-1">{round + 1} / {prompts.length} · ⭐ {score}</div>
              <div className="text-2xl md:text-3xl font-bold text-navy" dir={promptLang === "ar" ? "rtl" : "ltr"}>
                {isAr && promptLang === "ar" ? "أين" : promptLang === "ar" ? "أين" : "Où est"} {promptText} ?
              </div>
            </div>
          )}
        </div>

        {/* SVG figure — kid-friendly proportions, friendly pastel skin */}
        <div className="relative bg-gradient-to-b from-pale-blue/40 to-cream rounded-3xl p-4 md:p-8 mx-auto">
          <svg viewBox="0 0 320 420" className="w-full max-w-[420px] mx-auto h-auto" role="img" aria-label="Body figure">
            {/* Background subtle dots */}
            <defs>
              <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="#D4A72C" opacity="0.08" />
              </pattern>
            </defs>
            <rect width="320" height="420" fill="url(#dots)" />

            {/* === BODY === */}
            {/* Hair / scalp */}
            <ellipse cx="160" cy="55" rx="46" ry="38" fill="#3A2618" />
            {/* Head */}
            <BodyZone
              ariaLabel="head"
              onClick={() => onTapPart("head")}
              highlight={mode === "quiz" && prompts[round] === "head"}
              feedback={mode === "quiz" && prompts[round] === "head" ? feedback : null}
            >
              <ellipse cx="160" cy="75" rx="40" ry="42" fill="#F4C9A0" stroke="#3A2618" strokeWidth="2.5" />
            </BodyZone>

            {/* Ears */}
            <BodyZone ariaLabel="ear" onClick={() => onTapPart("ear")} highlight={mode === "quiz" && prompts[round] === "ear"} feedback={mode === "quiz" && prompts[round] === "ear" ? feedback : null}>
              <ellipse cx="121" cy="80" rx="6" ry="9" fill="#E5B589" stroke="#3A2618" strokeWidth="1.8" />
              <ellipse cx="199" cy="80" rx="6" ry="9" fill="#E5B589" stroke="#3A2618" strokeWidth="1.8" />
            </BodyZone>

            {/* Eyes */}
            <BodyZone ariaLabel="eye" onClick={() => onTapPart("eye")} highlight={mode === "quiz" && prompts[round] === "eye"} feedback={mode === "quiz" && prompts[round] === "eye" ? feedback : null}>
              <circle cx="146" cy="73" r="5" fill="#fff" stroke="#0F1B33" strokeWidth="1.5" />
              <circle cx="146" cy="74" r="2.4" fill="#0F1B33" />
              <circle cx="174" cy="73" r="5" fill="#fff" stroke="#0F1B33" strokeWidth="1.5" />
              <circle cx="174" cy="74" r="2.4" fill="#0F1B33" />
            </BodyZone>

            {/* Nose */}
            <BodyZone ariaLabel="nose" onClick={() => onTapPart("nose")} highlight={mode === "quiz" && prompts[round] === "nose"} feedback={mode === "quiz" && prompts[round] === "nose" ? feedback : null}>
              <path d="M160 78 L156 92 Q160 95 164 92 Z" fill="#E5B589" stroke="#3A2618" strokeWidth="1.5" />
            </BodyZone>

            {/* Mouth */}
            <BodyZone ariaLabel="mouth" onClick={() => onTapPart("mouth")} highlight={mode === "quiz" && prompts[round] === "mouth"} feedback={mode === "quiz" && prompts[round] === "mouth" ? feedback : null}>
              <path d="M148 100 Q160 110 172 100" fill="none" stroke="#C53030" strokeWidth="3" strokeLinecap="round" />
              <path d="M150 102 Q160 107 170 102" fill="#FCA5A5" />
            </BodyZone>

            {/* Neck */}
            <rect x="148" y="115" width="24" height="14" fill="#F4C9A0" stroke="#3A2618" strokeWidth="2" />

            {/* Torso (t-shirt) */}
            <BodyZone ariaLabel="belly" onClick={() => onTapPart("belly")} highlight={mode === "quiz" && prompts[round] === "belly"} feedback={mode === "quiz" && prompts[round] === "belly" ? feedback : null}>
              <path d="M115 130 L205 130 Q215 135 218 165 L222 230 L98 230 L102 165 Q105 135 115 130 Z"
                fill="#1AD18C" stroke="#0F1B33" strokeWidth="2.5" />
              {/* Stripe */}
              <rect x="100" y="180" width="120" height="10" fill="#FAF9F6" />
            </BodyZone>

            {/* Heart icon on chest */}
            <BodyZone ariaLabel="heart" onClick={() => onTapPart("heart")} highlight={mode === "quiz" && prompts[round] === "heart"} feedback={mode === "quiz" && prompts[round] === "heart" ? feedback : null}>
              <path d="M160 165 C150 152, 130 158, 138 174 C144 184, 160 195, 160 195 C160 195, 176 184, 182 174 C190 158, 170 152, 160 165 Z"
                fill="#E53E3E" stroke="#fff" strokeWidth="2" />
            </BodyZone>

            {/* Arms */}
            <BodyZone ariaLabel="arm" onClick={() => onTapPart("arm")} highlight={mode === "quiz" && prompts[round] === "arm"} feedback={mode === "quiz" && prompts[round] === "arm" ? feedback : null}>
              <path d="M115 132 Q95 165 88 220 Q86 240 95 248 L108 245 Q108 200 122 162 Z" fill="#F4C9A0" stroke="#3A2618" strokeWidth="2" />
              <path d="M205 132 Q225 165 232 220 Q234 240 225 248 L212 245 Q212 200 198 162 Z" fill="#F4C9A0" stroke="#3A2618" strokeWidth="2" />
            </BodyZone>

            {/* Hands */}
            <BodyZone ariaLabel="hand" onClick={() => onTapPart("hand")} highlight={mode === "quiz" && prompts[round] === "hand"} feedback={mode === "quiz" && prompts[round] === "hand" ? feedback : null}>
              <circle cx="91" cy="252" r="13" fill="#F4C9A0" stroke="#3A2618" strokeWidth="2" />
              <circle cx="229" cy="252" r="13" fill="#F4C9A0" stroke="#3A2618" strokeWidth="2" />
            </BodyZone>

            {/* Shorts */}
            <path d="M105 230 L215 230 L210 270 L168 268 L160 290 L152 268 L110 270 Z" fill="#1F4F8F" stroke="#0F1B33" strokeWidth="2.5" />

            {/* Legs */}
            <BodyZone ariaLabel="leg" onClick={() => onTapPart("leg")} highlight={mode === "quiz" && prompts[round] === "leg"} feedback={mode === "quiz" && prompts[round] === "leg" ? feedback : null}>
              <path d="M122 270 L118 380 L138 384 L150 270 Z" fill="#F4C9A0" stroke="#3A2618" strokeWidth="2" />
              <path d="M170 270 L182 384 L202 380 L198 270 Z" fill="#F4C9A0" stroke="#3A2618" strokeWidth="2" />
            </BodyZone>

            {/* Knees (small caps) */}
            <BodyZone ariaLabel="knee" onClick={() => onTapPart("knee")} highlight={mode === "quiz" && prompts[round] === "knee"} feedback={mode === "quiz" && prompts[round] === "knee" ? feedback : null}>
              <circle cx="132" cy="325" r="8" fill="#E5B589" stroke="#3A2618" strokeWidth="1.8" />
              <circle cx="188" cy="325" r="8" fill="#E5B589" stroke="#3A2618" strokeWidth="1.8" />
            </BodyZone>

            {/* Feet */}
            <BodyZone ariaLabel="foot" onClick={() => onTapPart("foot")} highlight={mode === "quiz" && prompts[round] === "foot"} feedback={mode === "quiz" && prompts[round] === "foot" ? feedback : null}>
              <ellipse cx="124" cy="390" rx="18" ry="9" fill="#0F1B33" stroke="#0F1B33" />
              <ellipse cx="196" cy="390" rx="18" ry="9" fill="#0F1B33" stroke="#0F1B33" />
            </BodyZone>

            {/* Floating label for the revealed part (discover mode) */}
            {mode === "discover" && revealed && (() => {
              const p = PARTS.find((x) => x.key === revealed)!;
              return (
                <g>
                  <rect x={p.labelAt.x - 50} y={p.labelAt.y - 22} width="100" height="38" rx="10"
                    fill="#0F1B33" opacity="0.95" />
                  <text x={p.labelAt.x} y={p.labelAt.y - 6} textAnchor="middle"
                    fill="#D4A72C" fontSize="13" fontWeight="700">
                    {p.fr}
                  </text>
                  <text x={p.labelAt.x} y={p.labelAt.y + 9} textAnchor="middle"
                    fill="#FAF9F6" fontSize="13" fontWeight="600">
                    {p.ar}
                  </text>
                </g>
              );
            })()}
          </svg>

          {/* Quiz feedback ribbon */}
          {feedback && (
            <div className={`absolute inset-x-0 top-2 mx-auto w-fit px-4 py-1.5 rounded-full text-sm font-bold ${
              feedback === "correct" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
            }`}>
              {feedback === "correct" ? (isAr ? "أحسنت !" : "Bravo !") : (isAr ? "أعد المحاولة" : "Réessaie")}
            </div>
          )}
        </div>

        {/* Discover mode: list all parts as chips so kid can browse without
            having to find each one on the figure. Tapping a chip both
            speaks the word and highlights the part visually. */}
        {mode === "discover" && (
          <div className="mt-5 grid grid-cols-3 sm:grid-cols-4 gap-2">
            {PARTS.map((p) => (
              <button
                key={p.key}
                onClick={() => onTapPart(p.key)}
                className={`rounded-2xl px-2 py-2 text-xs font-bold border-2 transition ${
                  revealed === p.key
                    ? "bg-navy text-cream border-navy"
                    : "bg-white text-navy border-pale-blue hover:border-gold"
                }`}
              >
                <div className="text-lg leading-none mb-1">{p.emoji}</div>
                <div>{isAr ? p.ar : p.fr}</div>
              </button>
            ))}
          </div>
        )}

        {best !== null && (
          <div className="text-center text-xs text-fg-soft mt-5">
            {isAr ? "أفضل نتيجة في الاختبار" : "Meilleur score quiz"}: <span className="font-bold text-navy">{best}/10</span>
          </div>
        )}
      </main>
    </div>
  );
}

/**
 * Wraps a body region in a clickable group with optional pulsing highlight
 * (used by quiz mode to show "this is the correct one to tap" indirectly —
 * actually we don't reveal the answer, the highlight just appears on
 * correct/wrong via the `feedback` prop). The whole zone gets a transparent
 * tappable hit-area + tap-target outline pulse on hover.
 */
function BodyZone({
  children,
  ariaLabel,
  onClick,
  highlight,
  feedback,
}: {
  children: React.ReactNode;
  ariaLabel: string;
  onClick: () => void;
  highlight: boolean;
  feedback: "correct" | "wrong" | null;
}) {
  const ringColor =
    feedback === "correct" ? "#10B981" :
    feedback === "wrong"   ? "#EF4444" :
    null;
  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick(); }}
      className="cursor-pointer outline-none"
      style={{ filter: ringColor ? `drop-shadow(0 0 6px ${ringColor})` : undefined }}
    >
      {children}
      {highlight && !feedback && (
        // Subtle pulsing nudge so quizmode players know the figure is interactive
        <></>
      )}
    </g>
  );
}
