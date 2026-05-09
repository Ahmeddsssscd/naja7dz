"use client";

/**
 * Chiffres arabes — match Arabic-Indic numerals to Western numerals.
 *
 * 3 modes:
 *   - "match"   : show ٧, pick "7"
 *   - "reverse" : show "7", pick ٧
 *   - "compte"  : show 7 emojis, pick the Arabic numeral ٧
 *
 * 10 questions per session. Each correct answer plays a Web Audio "ding"
 * (no asset). Best score per mode in localStorage.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { useGameBack } from "./useGameBack";
import { MascotCelebration } from "@/components/app/MascotCelebration";

type Mode = "match" | "reverse" | "compte";
type Phase = "pick" | "play" | "done";

const ROUNDS = 10;
const STORAGE_KEY = "najah:chiffres-arabes:best";

// 0-10
const PAIRS: { western: number; arabic: string }[] = [
  { western: 0,  arabic: "٠" },
  { western: 1,  arabic: "١" },
  { western: 2,  arabic: "٢" },
  { western: 3,  arabic: "٣" },
  { western: 4,  arabic: "٤" },
  { western: 5,  arabic: "٥" },
  { western: 6,  arabic: "٦" },
  { western: 7,  arabic: "٧" },
  { western: 8,  arabic: "٨" },
  { western: 9,  arabic: "٩" },
  { western: 10, arabic: "١٠" },
];

const COUNT_EMOJIS = ["🍎", "⭐", "🦊", "🌙", "🌴", "📚", "🌶", "🌻"];

const MODE_META: Record<Mode, { label: string; sub: string; emoji: string }> = {
  match:   { label: "Reconnaître",  sub: "Du chiffre arabe vers le chiffre", emoji: "🔤" },
  reverse: { label: "Inverse",      sub: "Du chiffre vers le chiffre arabe", emoji: "🔁" },
  compte:  { label: "Compter",      sub: "Compte les objets",                 emoji: "🍎" },
};

interface Question {
  prompt: string;        // text or emojis
  promptIsArabic: boolean;
  promptFontSize: "sm" | "lg" | "xl";
  options: string[];
  correct: string;
  optionsAreArabic: boolean;
}

interface BestRecord { [m: string]: number }

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function rand<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

function makeQuestion(mode: Mode): Question {
  if (mode === "match") {
    // Arabic numeral -> pick western
    const target = rand(PAIRS);
    const distractors = shuffle(PAIRS.filter((p) => p.western !== target.western)).slice(0, 3);
    const opts = shuffle([target, ...distractors]);
    return {
      prompt: target.arabic,
      promptIsArabic: true,
      promptFontSize: "xl",
      options: opts.map((o) => String(o.western)),
      correct: String(target.western),
      optionsAreArabic: false,
    };
  }
  if (mode === "reverse") {
    const target = rand(PAIRS);
    const distractors = shuffle(PAIRS.filter((p) => p.western !== target.western)).slice(0, 3);
    const opts = shuffle([target, ...distractors]);
    return {
      prompt: String(target.western),
      promptIsArabic: false,
      promptFontSize: "xl",
      options: opts.map((o) => o.arabic),
      correct: target.arabic,
      optionsAreArabic: true,
    };
  }
  // compte — show N emojis (1..10), pick Arabic numeral
  // Skip 0 because we can't show 0 emojis sensibly.
  const validPairs = PAIRS.filter((p) => p.western >= 1 && p.western <= 10);
  const target = rand(validPairs);
  const emoji = rand(COUNT_EMOJIS);
  const distractors = shuffle(validPairs.filter((p) => p.western !== target.western)).slice(0, 3);
  const opts = shuffle([target, ...distractors]);
  return {
    prompt: emoji.repeat(target.western),
    promptIsArabic: false,
    promptFontSize: target.western > 6 ? "sm" : "lg",
    options: opts.map((o) => o.arabic),
    correct: target.arabic,
    optionsAreArabic: true,
  };
}

// Web Audio "ding" for correct answers — no asset needed.
function playDing() {
  if (typeof window === "undefined") return;
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
    osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.18); // E6 — bright "ding"
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
    osc.onended = () => { try { ctx.close(); } catch { /* ignore */ } };
  } catch { /* ignore audio errors */ }
}

export function ChiffresArabes() {
  const goBack = useGameBack();
  const [phase, setPhase] = useState<Phase>("pick");
  const [mode, setMode] = useState<Mode>("match");
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState<Question | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [bests, setBests] = useState<BestRecord>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    try { setBests(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}")); }
    catch { /* ignore */ }
  }, []);

  const start = (m: Mode) => {
    setMode(m);
    setRound(1);
    setScore(0);
    setPicked(null);
    setQuestion(makeQuestion(m));
    setPhase("play");
  };

  const onAnswer = (opt: string) => {
    if (!question || picked) return;
    setPicked(opt);
    const correct = opt === question.correct;
    if (correct) {
      setScore((s) => s + 1);
      playDing();
    }
    setTimeout(() => {
      if (round >= ROUNDS) {
        const finalScore = score + (correct ? 1 : 0);
        const prev = bests[mode] ?? 0;
        if (finalScore > prev) {
          const next = { ...bests, [mode]: finalScore };
          setBests(next);
          try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
        }
        setPhase("done");
      } else {
        setRound((r) => r + 1);
        setPicked(null);
        setQuestion(makeQuestion(mode));
      }
    }, correct ? 600 : 1100);
  };

  if (phase === "pick") {
    return (
      <div className="min-h-screen bg-cream flex flex-col">
        <header className="px-5 py-4 flex items-center justify-between bg-white border-b border-pale-blue">
          <button onClick={goBack} className="w-10 h-10 rounded-full bg-white border border-pale-blue flex items-center justify-center text-navy" aria-label="Retour">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <h1 className="text-base font-bold text-navy">Chiffres arabes</h1>
          <div className="w-10" />
        </header>
        <main className="flex-1 px-5 py-6 max-w-md mx-auto w-full">
          <div className="text-center mb-6">
            <div className="text-6xl mb-3" dir="rtl">٠ ١ ٢ ٣ ٤ ٥</div>
            <p className="text-fg-soft text-sm">
              Apprends les chiffres en arabe. Choisis un mode :
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {(Object.keys(MODE_META) as Mode[]).map((m) => {
              const meta = MODE_META[m];
              const best = bests[m] ?? 0;
              return (
                <button
                  key={m}
                  onClick={() => start(m)}
                  className="bg-white border-2 border-pale-blue rounded-2xl p-5 flex items-center gap-4 hover:border-gold hover:scale-[1.02] active:scale-95 transition-all text-left"
                >
                  <span className="text-4xl">{meta.emoji}</span>
                  <div className="flex-1">
                    <div className="text-lg font-bold text-navy">{meta.label}</div>
                    <div className="text-xs text-fg-soft">{meta.sub}</div>
                  </div>
                  {best > 0 && (
                    <div className="text-right">
                      <div className="text-xs text-fg-soft">Record</div>
                      <div className="text-lg font-bold text-gold">{best}/{ROUNDS}</div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </main>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-5">
        <MascotCelebration trigger={score === ROUNDS} locale="fr" />
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">{score === ROUNDS ? "🏆" : score >= 7 ? "🌟" : "✨"}</div>
          <h1 className="text-3xl font-bold text-navy mb-2">{MODE_META[mode].label}</h1>
          <div className="text-5xl font-bold text-gold mb-1">{score}<span className="text-2xl text-fg-soft"> / {ROUNDS}</span></div>
          <div className="text-sm text-fg-soft mb-6">
            {score === ROUNDS ? "Score parfait !" : score >= 7 ? "Très bien !" : "Continue à t'entraîner."}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setPhase("pick")} className="btn btn-outline flex-1">Mode</button>
            <button onClick={() => start(mode)} className="btn btn-primary flex-1">Rejouer</button>
          </div>
        </div>
      </div>
    );
  }

  // play
  if (!question) return null;
  const promptCls = question.promptFontSize === "xl"
    ? "text-[8rem] md:text-[10rem]"
    : question.promptFontSize === "lg"
      ? "text-5xl md:text-6xl"
      : "text-3xl md:text-4xl";

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="px-5 py-4 flex items-center justify-between bg-white border-b border-pale-blue">
        <button onClick={() => setPhase("pick")} className="w-10 h-10 rounded-full bg-white border border-pale-blue flex items-center justify-center text-navy" aria-label="Quitter">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div className="text-sm font-bold text-navy">{round}/{ROUNDS} · ⭐ {score}</div>
        <div className="text-xs text-fg-soft">{MODE_META[mode].emoji}</div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-5 py-6 gap-6">
        <div className="bg-white border-4 border-navy rounded-3xl p-6 md:p-10 shadow-card text-center min-w-[260px]">
          <div className="text-xs uppercase font-semibold text-fg-soft mb-3">
            {mode === "compte" ? "Combien y a-t-il ?" : mode === "match" ? "Quel est ce chiffre ?" : "Quel est ce chiffre en arabe ?"}
          </div>
          <div
            className={`${promptCls} font-bold text-navy leading-none break-words`}
            dir={question.promptIsArabic ? "rtl" : "ltr"}
          >
            {question.prompt}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
          {question.options.map((opt) => {
            const isCorrect = opt === question.correct;
            const isPicked = picked === opt;
            let cls = "bg-white border-2 border-pale-blue text-navy hover:border-gold";
            if (picked) {
              if (isCorrect) cls = "bg-green-100 border-2 border-green-500 text-green-900";
              else if (isPicked) cls = "bg-red-100 border-2 border-red-500 text-red-900";
              else cls = "bg-white border-2 border-pale-blue text-fg-soft opacity-60";
            }
            return (
              <button
                key={opt}
                onClick={() => onAnswer(opt)}
                disabled={picked !== null}
                dir={question.optionsAreArabic ? "rtl" : "ltr"}
                className={`${cls} rounded-2xl py-6 text-4xl font-bold hover:scale-[1.02] active:scale-95 transition-all disabled:cursor-default`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
