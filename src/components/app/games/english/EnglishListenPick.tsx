"use client";

/**
 * Listening comprehension: TTS speaks an English word, the kid picks it from
 * 4 visual options (each shown as emoji + EN word). 10 questions per round.
 *
 * Vocabulary is drawn from animals + colors + family + food (45 cards in
 * total — plenty of distractors, no repeats inside a round).
 */

import { useEffect, useState } from "react";
import { useGameBack } from "../useGameBack";
import { useSpeak } from "./useSpeak";
import {
  ANIMALS_LESSON, COLORS_LESSON, FAMILY_LESSON, FOOD_LESSON,
  type EnglishCard,
} from "./englishData";
import confetti from "canvas-confetti";

type Phase = "intro" | "play" | "done";

const POOL: EnglishCard[] = [
  ...ANIMALS_LESSON.cards,
  ...COLORS_LESSON.cards,
  ...FAMILY_LESSON.cards,
  ...FOOD_LESSON.cards,
];

const ROUND_SIZE = 10;
const STORAGE_KEY = "najah:english:listen:best";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Question {
  target: EnglishCard;
  options: EnglishCard[];
}

function buildRound(): Question[] {
  const targets = shuffle(POOL).slice(0, ROUND_SIZE);
  return targets.map((target) => {
    // Distractors: pick 3 cards whose `en` differs from the target.
    const distractors = shuffle(POOL.filter((c) => c.en !== target.en)).slice(0, 3);
    const options = shuffle([target, ...distractors]);
    return { target, options };
  });
}

export function EnglishListenPick() {
  const goBack = useGameBack("/petits/anglais");
  const { speak, isSpeaking, supported } = useSpeak();

  const [phase, setPhase] = useState<Phase>("intro");
  const [questions, setQuestions] = useState<Question[]>(() => buildRound());
  const [qIdx, setQIdx] = useState(0);
  const [picked, setPicked] = useState<EnglishCard | null>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) setBest(Number(saved) || 0);
  }, []);

  const current = questions[qIdx];
  const isLast = qIdx >= questions.length - 1;

  // Auto-play the prompt when the question changes.
  useEffect(() => {
    if (phase !== "play" || !current || picked) return;
    // Delay a hair so the animation settles.
    const id = setTimeout(() => speak(current.target.en), 250);
    return () => clearTimeout(id);
  }, [phase, qIdx, current, picked, speak]);

  const begin = () => {
    setQuestions(buildRound());
    setQIdx(0);
    setPicked(null);
    setScore(0);
    setPhase("play");
  };

  const onPick = (card: EnglishCard) => {
    if (picked) return;
    setPicked(card);
    if (card.en === current.target.en) {
      setScore((s) => s + 1);
    }
  };

  const next = () => {
    setPicked(null);
    if (isLast) {
      const finalScore = score;
      if (finalScore > best) {
        setBest(finalScore);
        try { window.localStorage.setItem(STORAGE_KEY, String(finalScore)); } catch { /* ignore */ }
      }
      if (finalScore >= 9) {
        confetti({ particleCount: 120, spread: 100, colors: ["#D4A72C", "#0F1B33", "#1AD18C"] });
      }
      setPhase("done");
    } else {
      setQIdx((i) => i + 1);
    }
  };

  if (phase === "intro") {
    return (
      <div className="min-h-screen bg-cream flex flex-col">
        <Header title="Listen & Pick" subtitle="استمع واختر" emoji="🎧" onBack={goBack} />
        <main className="flex-1 px-5 py-6 max-w-md mx-auto w-full text-center">
          <div className="text-7xl mb-4">🎧</div>
          <h2 className="text-2xl font-bold text-navy mb-2">Écoute et choisis</h2>
          <p className="text-sm text-fg-soft mb-1">
            Tu vas entendre un mot en anglais. Touche la bonne image !
          </p>
          <p className="text-sm font-ar text-fg-soft mb-5" dir="rtl">
            ستسمع كلمة بالإنجليزية، اختر الصورة الصحيحة!
          </p>
          {!supported && (
            <div className="bg-amber-100 text-amber-900 rounded-xl p-3 text-xs mb-5">
              Ton navigateur ne supporte pas l'audio. Le mot s'affichera quand même.
            </div>
          )}
          <div className="bg-white border-2 border-pale-blue rounded-2xl p-4 mb-5 inline-block">
            <div className="text-xs text-fg-soft">Meilleur score</div>
            <div className="text-3xl font-bold text-gold">{best}<span className="text-base text-fg-soft">/{ROUND_SIZE}</span></div>
          </div>
          <button onClick={begin} className="w-full py-4 rounded-2xl bg-navy text-white font-bold text-lg active:scale-95 shadow-card">
            ▶ Commencer
          </button>
        </main>
      </div>
    );
  }

  if (phase === "done") {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-5">
        <div className="text-center max-w-sm">
          <div className="text-7xl mb-4">{pct === 100 ? "🏆" : pct >= 70 ? "✨" : "💪"}</div>
          <h1 className="text-3xl font-bold text-navy mb-2">
            {pct === 100 ? "Parfait !" : pct >= 70 ? "Bravo !" : "Continue !"}
          </h1>
          <div className="text-5xl font-bold text-gold mb-1">{score}<span className="text-2xl text-fg-soft"> / {questions.length}</span></div>
          {score > best && score === questions.length && <div className="text-sm text-gold font-bold">⭐ Nouveau record !</div>}
          <div className="flex flex-col gap-2.5 mt-6">
            <button onClick={begin} className="py-3 rounded-2xl bg-navy text-white font-bold active:scale-95">Rejouer</button>
            <button onClick={goBack} className="py-3 rounded-2xl bg-pale-blue/40 text-navy font-bold active:scale-95">Retour aux jeux</button>
          </div>
        </div>
      </div>
    );
  }

  const isCorrect = picked?.en === current.target.en;

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Header title={`Question ${qIdx + 1}/${questions.length}`} subtitle={`⭐ ${score}`} emoji="🎧" onBack={() => setPhase("intro")} />

      <main className="flex-1 px-5 py-6 max-w-md mx-auto w-full flex flex-col">
        <div className="bg-white border-4 border-navy rounded-3xl p-6 mb-5 text-center shadow-card">
          <div className="text-xs uppercase tracking-widest text-gold font-bold mb-2">Touche pour entendre</div>
          <button
            onClick={() => speak(current.target.en)}
            className="bg-gold w-24 h-24 rounded-full text-5xl mx-auto flex items-center justify-center active:scale-90 transition-transform shadow-card-hover"
            disabled={!supported}
            aria-label="Écouter le mot"
          >
            {isSpeaking ? "🔉" : "🔊"}
          </button>
          {!supported && (
            <div className="text-xs text-fg-soft mt-3">
              Audio off · le mot est : <strong>{current.target.en}</strong>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          {current.options.map((opt) => {
            const isAnswer = opt.en === current.target.en;
            const isPicked = picked?.en === opt.en;
            const showCorrect = picked && isAnswer;
            const showWrong = isPicked && !isAnswer;
            return (
              <button
                key={opt.en}
                onClick={() => onPick(opt)}
                disabled={!!picked}
                className={`bg-white rounded-2xl p-4 border-2 flex flex-col items-center gap-2 transition-all active:scale-[0.97] ${
                  showCorrect
                    ? "border-green-500 bg-green-50"
                    : showWrong
                    ? "border-red-500 bg-red-50"
                    : picked
                    ? "border-pale-blue opacity-60"
                    : "border-pale-blue hover:border-gold"
                }`}
              >
                <span className="text-5xl" aria-hidden>{opt.emoji}</span>
                <span className="font-bold text-navy text-sm">{opt.en}</span>
                {showCorrect && <span className="text-green-600 text-2xl">✓</span>}
                {showWrong && <span className="text-red-500 text-2xl">✗</span>}
              </button>
            );
          })}
        </div>

        {picked && (
          <button
            onClick={next}
            className={`w-full py-4 rounded-2xl font-bold active:scale-95 transition-transform ${
              isCorrect ? "bg-green-500 text-white" : "bg-navy text-white"
            }`}
          >
            {isLast ? "Voir le score 🎯" : "Suivant →"}
          </button>
        )}
      </main>
    </div>
  );
}

function Header({ title, subtitle, emoji, onBack }: { title: string; subtitle: string; emoji: string; onBack: () => void }) {
  return (
    <header className="px-5 py-4 flex items-center justify-between bg-white border-b border-pale-blue">
      <button onClick={onBack} className="w-10 h-10 rounded-full hover:bg-pale-blue/40 flex items-center justify-center text-navy" aria-label="Retour">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <div className="text-center">
        <h1 className="font-bold text-navy text-base flex items-center gap-2 justify-center">
          <span>{emoji}</span><span>{title}</span>
        </h1>
        <div className="text-xs text-fg-soft">{subtitle}</div>
      </div>
      <div className="w-10" />
    </header>
  );
}
