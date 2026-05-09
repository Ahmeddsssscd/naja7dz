"use client";

/**
 * Standalone comprehension quizzes — accessible from the Quiz section of
 * the hub. Each quiz is a 5-question MCQ on one of 3 themes:
 *   - colors-animals : mixes the two simplest decks
 *   - family-school  : everyday environment
 *   - food-numbers   : harder — pairs Food vocab with the Numbers decoy
 *
 * Quizzes don't track lesson progress (those live under the lesson page);
 * instead they store a "best score" per quiz under `najah:english:quiz:{id}`.
 */

import { useEffect, useState } from "react";
import { useGameBack } from "../useGameBack";
import { useSpeak } from "./useSpeak";
import { type EnglishCard } from "./englishData";
import { QUIZZES } from "./quizMeta";
import confetti from "canvas-confetti";

type Phase = "intro" | "play" | "done";

// Re-export server-safe metadata for any other client component that wants it.
export { QUIZ_IDS, QUIZ_META } from "./quizMeta";

interface Question {
  card: EnglishCard;
  type: "en-to-fr" | "fr-to-en" | "listen";
  options: string[];
  answer: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuestions(pool: EnglishCard[]): Question[] {
  const targets = shuffle(pool).slice(0, 5);
  const types: Question["type"][] = ["en-to-fr", "fr-to-en", "listen", "en-to-fr", "fr-to-en"];
  return targets.map((card, i) => {
    const type = types[i];
    const distractors = shuffle(pool.filter((c) => c.en !== card.en)).slice(0, 3);
    if (type === "en-to-fr") {
      const answer = card.fr;
      return { card, type, options: shuffle([answer, ...distractors.map((d) => d.fr)]), answer };
    } else if (type === "fr-to-en") {
      const answer = card.en;
      return { card, type, options: shuffle([answer, ...distractors.map((d) => d.en)]), answer };
    } else {
      const answer = card.en;
      return { card, type, options: shuffle([answer, ...distractors.map((d) => d.en)]), answer };
    }
  });
}

interface Props {
  quizId: string;
}

export function EnglishQuiz({ quizId }: Props) {
  const goBack = useGameBack("/petits/anglais");
  const { speak, isSpeaking, supported } = useSpeak();
  const meta = QUIZZES[quizId] ?? QUIZZES["colors-animals"];

  const [phase, setPhase] = useState<Phase>("intro");
  const [questions, setQuestions] = useState<Question[]>(() => buildQuestions(meta.pool));
  const [qIdx, setQIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);

  const storageKey = `najah:english:quiz:${quizId}`;
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(storageKey);
    if (saved) setBest(Number(saved) || 0);
  }, [storageKey]);

  const begin = () => {
    setQuestions(buildQuestions(meta.pool));
    setQIdx(0);
    setPicked(null);
    setScore(0);
    setPhase("play");
  };

  const current = questions[qIdx];
  const isLast = qIdx >= questions.length - 1;

  const onPick = (opt: string) => {
    if (picked) return;
    setPicked(opt);
    if (opt === current.answer) setScore((s) => s + 1);
  };

  const next = () => {
    setPicked(null);
    if (isLast) {
      const finalScore = score;
      if (finalScore > best) {
        setBest(finalScore);
        try { window.localStorage.setItem(storageKey, String(finalScore)); } catch { /* ignore */ }
      }
      if (finalScore === questions.length) {
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
        <Header title={meta.name_fr} subtitle={meta.name_ar} emoji={meta.emoji} onBack={goBack} />
        <main className="flex-1 px-5 py-6 max-w-md mx-auto w-full text-center">
          <div className="text-7xl mb-4">📝</div>
          <h2 className="text-2xl font-bold text-navy mb-2">{meta.name_fr}</h2>
          <p className="text-sm text-fg-soft mb-1">5 questions · choix multiples</p>
          <p className="text-xs font-ar text-fg-soft mb-5" dir="rtl">٥ أسئلة · اختيار متعدّد</p>

          <div className="bg-white border-2 border-pale-blue rounded-2xl p-4 mb-5 inline-block">
            <div className="text-xs text-fg-soft">Meilleur score</div>
            <div className="text-3xl font-bold text-gold">{best}<span className="text-base text-fg-soft">/5</span></div>
          </div>
          <button onClick={begin} className="w-full py-4 rounded-2xl bg-navy text-white font-bold text-lg active:scale-95 shadow-card">
            ▶ Commencer le quiz
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
          <div className="text-7xl mb-4">{pct === 100 ? "🏆" : pct >= 60 ? "✨" : "💪"}</div>
          <h1 className="text-3xl font-bold text-navy mb-2">
            {pct === 100 ? "Parfait !" : pct >= 60 ? "Bien joué !" : "Continue !"}
          </h1>
          <div className="text-5xl font-bold text-gold mb-1">{score}<span className="text-2xl text-fg-soft"> / {questions.length}</span></div>
          <div className="flex flex-col gap-2.5 mt-6">
            <button onClick={begin} className="py-3 rounded-2xl bg-navy text-white font-bold active:scale-95">Recommencer</button>
            <button onClick={goBack} className="py-3 rounded-2xl bg-pale-blue/40 text-navy font-bold active:scale-95">Retour</button>
          </div>
        </div>
      </div>
    );
  }

  const isCorrect = picked === current.answer;

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Header title={meta.name_fr} subtitle={`${qIdx + 1}/${questions.length} · ⭐ ${score}`} emoji={meta.emoji} onBack={() => setPhase("intro")} />

      <main className="flex-1 px-5 py-6 max-w-md mx-auto w-full">
        <div className="bg-white border-4 border-navy rounded-3xl p-5 mb-5 shadow-card text-center">
          {current.type === "listen" ? (
            <>
              <div className="text-sm font-bold text-navy/70 mb-3">Écoute et choisis le mot</div>
              <button
                onClick={() => speak(current.card.en)}
                className="bg-gold w-20 h-20 rounded-full text-4xl mx-auto flex items-center justify-center active:scale-95 transition-transform"
                disabled={!supported}
                aria-label="Écouter"
              >
                {isSpeaking ? "🔉" : "🔊"}
              </button>
              {!supported && <div className="text-xs text-fg-soft mt-3">Mot : <strong>{current.card.en}</strong></div>}
            </>
          ) : current.type === "en-to-fr" ? (
            <>
              <div className="text-sm font-bold text-navy/70 mb-2">Que veut dire ce mot en français ?</div>
              <div className="text-5xl mb-2">{current.card.emoji}</div>
              <div className="text-3xl font-bold text-navy">{current.card.en}</div>
              <button onClick={() => speak(current.card.en)} className="text-xs text-fg-soft underline mt-2" disabled={!supported}>
                🔊 Écouter
              </button>
            </>
          ) : (
            <>
              <div className="text-sm font-bold text-navy/70 mb-2">Comment dit-on en anglais ?</div>
              <div className="text-5xl mb-2">{current.card.emoji}</div>
              <div className="text-3xl font-bold text-navy">{current.card.fr}</div>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 gap-2.5 mb-4">
          {current.options.map((opt) => {
            const isAnswer = opt === current.answer;
            const isPicked = opt === picked;
            const showCorrect = picked && isAnswer;
            const showWrong = isPicked && !isAnswer;
            return (
              <button
                key={opt}
                onClick={() => onPick(opt)}
                disabled={!!picked}
                className={`py-4 px-4 rounded-2xl border-2 font-bold text-base text-start transition-all active:scale-[0.98] ${
                  showCorrect
                    ? "bg-green-100 border-green-500 text-green-900"
                    : showWrong
                    ? "bg-red-100 border-red-500 text-red-900"
                    : picked
                    ? "bg-white border-pale-blue text-navy/60"
                    : "bg-white border-pale-blue text-navy hover:border-gold hover:bg-pale-blue/30"
                }`}
              >
                {opt}
                {showCorrect && <span className="float-end">✓</span>}
                {showWrong && <span className="float-end">✗</span>}
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
        <div className="text-xs text-fg-soft font-ar" dir="rtl">{subtitle}</div>
      </div>
      <div className="w-10" />
    </header>
  );
}

// QUIZ_IDS and QUIZ_META are re-exported from ./quizMeta at the top of the
// file (server-safe import path).
