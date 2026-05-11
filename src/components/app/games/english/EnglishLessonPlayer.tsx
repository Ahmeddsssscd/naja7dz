"use client";

/**
 * Generic lesson player used by every `/petits/anglais/{slug}` route.
 *
 * Three phases — driven by a `phase` state machine:
 *   1. "study"  – browse vocabulary cards (paginated, ~6 per page) with TTS
 *   2. "quiz"   – 5 random MCQ questions (4 options each) drawn from the deck
 *   3. "done"   – score recap + actions (review / retry / next lesson)
 *
 * Persistence: under `najah:english:lesson:{slug}` we save `{ best: number,
 * completed: boolean, last: number }`. The hub uses this to render the
 * "✓ Terminée" / "0/5" badge on each tile.
 *
 * The component is fully bilingual: every UI string is rendered in FR with
 * an AR translation underneath. The English vocabulary stays English (that's
 * the whole point of the lesson).
 */

import { useEffect, useState } from "react";
import { useGameBack } from "../useGameBack";
import { useSpeak } from "./useSpeak";
import type { EnglishCard, EnglishLesson } from "./englishData";
import confetti from "canvas-confetti";

type Phase = "study" | "quiz" | "done";

interface QuizQuestion {
  /** The card we're asking about. */
  card: EnglishCard;
  /** Type of prompt — varies per question to keep things fresh. */
  type: "en-to-fr" | "fr-to-en" | "listen-to-text";
  /** 4 options (one is correct). Already shuffled. */
  options: string[];
  /** The correct option string. */
  answer: string;
}

interface Props {
  lesson: EnglishLesson;
  /**
   * Translated, pre-localized strings the parent server component pulled out
   * of `next-intl`. The component itself is "use client" so we can't call
   * `getTranslations` here — the parent passes labels in.
   */
  labels: {
    title_fr: string;
    title_ar: string;
    study_intro: string;
    study_intro_ar: string;
    listen: string;
    next: string;
    previous: string;
    start_quiz: string;
    quiz_title: string;
    quiz_intro: string;
    fr_to_en_prompt: string;
    en_to_fr_prompt: string;
    listen_to_text_prompt: string;
    play_again: string;
    review_lesson: string;
    back_to_hub: string;
    you_scored: string;
    perfect: string;
    great: string;
    keep_going: string;
    cards_count: string;
    progress: string;
  };
}

const PAGE_SIZE = 6;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuiz(cards: EnglishCard[], count: number = 5): QuizQuestion[] {
  // Pick `count` distinct target cards. If the deck has fewer than `count`
  // entries (e.g. only 8) we fall back to repeating, which is fine — the
  // shuffle keeps it varied.
  const targets = shuffle(cards).slice(0, count);
  while (targets.length < count) targets.push(cards[Math.floor(Math.random() * cards.length)]);
  const types: QuizQuestion["type"][] = ["en-to-fr", "fr-to-en", "listen-to-text"];

  return targets.map((card, i) => {
    const type = types[i % types.length];
    // Build distractor pool from the same deck (avoid the answer itself).
    const distractorPool = cards.filter((c) => c.en !== card.en);
    const distractors = shuffle(distractorPool).slice(0, 3);
    let answer: string;
    let options: string[];

    if (type === "en-to-fr") {
      answer = card.fr;
      options = shuffle([answer, ...distractors.map((d) => d.fr)]);
    } else if (type === "fr-to-en") {
      answer = card.en;
      options = shuffle([answer, ...distractors.map((d) => d.en)]);
    } else {
      // listen-to-text: TTS plays card.en, options are English words
      answer = card.en;
      options = shuffle([answer, ...distractors.map((d) => d.en)]);
    }

    return { card, type, options, answer };
  });
}

export function EnglishLessonPlayer({ lesson, labels }: Props) {
  const goBack = useGameBack("/petits/anglais");
  const { speak, isSpeaking, supported: ttsSupported } = useSpeak();

  const [phase, setPhase] = useState<Phase>("study");
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(lesson.cards.length / PAGE_SIZE));
  const visibleCards = lesson.cards.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const [quiz, setQuiz] = useState<QuizQuestion[]>(() => buildQuiz(lesson.cards));
  const [qIndex, setQIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [storage, setStorage] = useState<{ best: number; completed: boolean; last: number } | null>(null);

  const storageKey = `najah:english:lesson:${lesson.slug}`;

  // Load saved progress on mount so we can show "Best: 5/5" hint, etc.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) setStorage(JSON.parse(raw));
    } catch { /* ignore */ }
  }, [storageKey]);

  const currentQ = quiz[qIndex];
  const isLastQ = qIndex >= quiz.length - 1;

  const answerQuiz = (option: string) => {
    if (picked) return; // already locked in
    setPicked(option);
    if (option === currentQ.answer) setScore((s) => s + 1);
  };

  const nextQuiz = () => {
    setPicked(null);
    if (isLastQ) {
      // Compute final score (the latest answer might still be "picked" but
      // score is updated synchronously above, so just read it).
      const final = score; // last answer already counted by answerQuiz()
      const next = {
        best: Math.max(storage?.best ?? 0, final),
        completed: final >= 4 || (storage?.completed ?? false),
        last: final,
      };
      setStorage(next);
      try { window.localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* ignore */ }
      if (final === quiz.length) {
        confetti({ particleCount: 120, spread: 100, colors: ["#D4A72C", "#0F1B33", "#1AD18C"] });
      }
      setPhase("done");
    } else {
      setQIndex((i) => i + 1);
    }
  };

  const restart = () => {
    setQuiz(buildQuiz(lesson.cards));
    setQIndex(0);
    setPicked(null);
    setScore(0);
    setPhase("quiz");
  };

  // ----- STUDY PHASE -----
  if (phase === "study") {
    return (
      <div className="min-h-screen bg-cream dark:bg-surface-2 flex flex-col">
        <Header title_fr={labels.title_fr} title_ar={labels.title_ar} emoji={lesson.emoji} onBack={goBack} />

        <main className="flex-1 max-w-2xl mx-auto w-full px-5 py-5">
          <p className="text-fg-soft text-sm text-center mb-1">{labels.study_intro}</p>
          <p className="text-fg-soft text-xs text-center mb-5 font-ar" dir="rtl">{labels.study_intro_ar}</p>

          <div className="text-xs text-fg-soft text-center mb-3">
            {labels.progress}: {page + 1}/{totalPages} · {labels.cards_count.replace("{count}", String(lesson.cards.length))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            {visibleCards.map((card) => (
              <CardRow key={card.en} card={card} onSpeak={() => speak(card.en)} ttsActive={isSpeaking} ttsSupported={ttsSupported} listenLabel={labels.listen} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between gap-3 mb-5">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="flex-1 py-3 rounded-2xl bg-surface border-2 border-pale-blue text-navy font-bold disabled:opacity-40 active:scale-95 transition-transform"
            >
              ← {labels.previous}
            </button>
            {page < totalPages - 1 ? (
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                className="flex-1 py-3 rounded-2xl bg-navy text-white font-bold active:scale-95 transition-transform"
              >
                {labels.next} →
              </button>
            ) : (
              <button
                onClick={() => setPhase("quiz")}
                className="flex-1 py-3 rounded-2xl bg-gold text-navy font-bold active:scale-95 transition-transform shadow-card"
              >
                {labels.start_quiz} 🏁
              </button>
            )}
          </div>

          {storage && storage.best > 0 && (
            <div className="text-xs text-fg-soft text-center">
              ⭐ Meilleur score : {storage.best}/{quiz.length}
            </div>
          )}
        </main>
      </div>
    );
  }

  // ----- QUIZ PHASE -----
  if (phase === "quiz") {
    const isCorrect = picked === currentQ.answer;
    return (
      <div className="min-h-screen bg-cream dark:bg-surface-2 flex flex-col">
        <Header title_fr={labels.quiz_title} title_ar={labels.title_ar} emoji="🏁" onBack={() => setPhase("study")} />

        <main className="flex-1 max-w-md md:max-w-2xl lg:max-w-3xl mx-auto w-full px-5 py-6 flex flex-col">
          <div className="text-center mb-2">
            <div className="text-xs uppercase tracking-widest text-gold font-bold">
              {labels.quiz_intro}
            </div>
            <div className="text-sm text-fg-soft">
              {qIndex + 1} / {quiz.length} · ⭐ {score}
            </div>
          </div>

          <div className="bg-surface border-4 border-navy rounded-3xl p-5 mb-5 shadow-card text-center">
            {currentQ.type === "listen-to-text" ? (
              <>
                <div className="text-sm font-bold text-navy/70 mb-3">{labels.listen_to_text_prompt}</div>
                <button
                  onClick={() => speak(currentQ.card.en)}
                  className="bg-gold text-navy w-20 h-20 rounded-full text-4xl font-bold mx-auto flex items-center justify-center active:scale-95 transition-transform shadow-card-hover"
                  aria-label={labels.listen}
                  disabled={!ttsSupported}
                >
                  {isSpeaking ? "🔉" : "🔊"}
                </button>
                {!ttsSupported && (
                  <div className="text-xs text-fg-soft mt-3">
                    Audio indisponible · le mot est : <strong>{currentQ.card.en}</strong>
                  </div>
                )}
              </>
            ) : currentQ.type === "en-to-fr" ? (
              <>
                <div className="text-sm font-bold text-navy/70 mb-2">{labels.en_to_fr_prompt}</div>
                <div className="text-5xl mb-2">{currentQ.card.emoji}</div>
                <div className="text-3xl font-bold text-navy">{currentQ.card.en}</div>
                <button
                  onClick={() => speak(currentQ.card.en)}
                  className="text-xs text-fg-soft underline mt-2"
                  disabled={!ttsSupported}
                >
                  🔊 {labels.listen}
                </button>
              </>
            ) : (
              <>
                <div className="text-sm font-bold text-navy/70 mb-2">{labels.fr_to_en_prompt}</div>
                <div className="text-5xl mb-2">{currentQ.card.emoji}</div>
                <div className="text-3xl font-bold text-navy">{currentQ.card.fr}</div>
                <div className="text-base font-ar text-fg-soft mt-1" dir="rtl">{currentQ.card.ar}</div>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 gap-2.5 mb-4">
            {currentQ.options.map((opt) => {
              const isAnswer = opt === currentQ.answer;
              const isPicked = opt === picked;
              const showCorrect = picked && isAnswer;
              const showWrong = isPicked && !isAnswer;
              return (
                <button
                  key={opt}
                  onClick={() => answerQuiz(opt)}
                  disabled={!!picked}
                  className={`py-4 px-4 rounded-2xl border-2 font-bold text-base text-start transition-all active:scale-[0.98] ${
                    showCorrect
                      ? "bg-green-100 border-green-500 text-green-900"
                      : showWrong
                      ? "bg-red-100 border-red-500 text-red-900"
                      : picked
                      ? "bg-surface border-pale-blue text-navy/60"
                      : "bg-surface border-pale-blue text-navy hover:border-gold hover:bg-pale-blue/30"
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
              onClick={nextQuiz}
              className={`w-full py-4 rounded-2xl font-bold active:scale-95 transition-transform ${
                isCorrect ? "bg-green-500 text-white" : "bg-navy text-white"
              }`}
            >
              {isLastQ ? "Voir le score" : labels.next + " →"}
            </button>
          )}
        </main>
      </div>
    );
  }

  // ----- DONE PHASE -----
  const total = quiz.length;
  const headline =
    score === total ? labels.perfect : score >= total - 1 ? labels.great : labels.keep_going;
  const emoji = score === total ? "🏆" : score >= total - 1 ? "✨" : "💪";

  return (
    <div className="min-h-screen bg-cream dark:bg-surface-2 flex flex-col items-center justify-center px-5">
      <div className="text-center max-w-sm">
        <div className="text-7xl mb-4">{emoji}</div>
        <h1 className="text-3xl font-bold text-navy mb-1">{headline}</h1>
        <div className="text-5xl font-bold text-gold mt-3">
          {score}<span className="text-2xl text-fg-soft"> / {total}</span>
        </div>
        <div className="text-sm text-fg-soft mt-1 mb-6">
          {labels.you_scored} · {lesson.cards.length} mots étudiés
        </div>
        <div className="flex flex-col gap-2.5">
          <button
            onClick={restart}
            className="py-3 px-5 rounded-2xl bg-navy text-white font-bold active:scale-95"
          >
            {labels.play_again}
          </button>
          <button
            onClick={() => { setPhase("study"); setPage(0); }}
            className="py-3 px-5 rounded-2xl bg-surface border-2 border-pale-blue text-navy font-bold active:scale-95"
          >
            {labels.review_lesson}
          </button>
          <button
            onClick={goBack}
            className="py-3 px-5 rounded-2xl bg-pale-blue/40 text-navy font-bold active:scale-95"
          >
            {labels.back_to_hub}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function Header({ title_fr, title_ar, emoji, onBack }: { title_fr: string; title_ar: string; emoji: string; onBack: () => void }) {
  return (
    <header className="px-5 py-4 flex items-center justify-between bg-surface border-b border-line sticky top-0 z-30">
      <button onClick={onBack} className="w-10 h-10 rounded-full hover:bg-pale-blue/40 flex items-center justify-center text-navy" aria-label="Retour">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <div className="text-center">
        <h1 className="font-bold text-navy text-base flex items-center gap-2 justify-center">
          <span>{emoji}</span>
          <span>{title_fr}</span>
        </h1>
        <div className="text-xs text-fg-soft font-ar" dir="rtl">{title_ar}</div>
      </div>
      <div className="w-10" />
    </header>
  );
}

function CardRow({
  card, onSpeak, ttsActive, ttsSupported, listenLabel,
}: {
  card: EnglishCard;
  onSpeak: () => void;
  ttsActive: boolean;
  ttsSupported: boolean;
  listenLabel: string;
}) {
  return (
    <div className="bg-surface border-2 border-pale-blue rounded-2xl p-4 flex items-center gap-3 hover:border-gold transition-colors">
      <span className="text-4xl flex-shrink-0" aria-hidden>{card.emoji}</span>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-navy text-lg leading-tight">{card.en}</div>
        <div className="text-sm text-fg-soft truncate">{card.fr}</div>
        <div className="text-sm font-ar text-fg-soft truncate" dir="rtl">{card.ar}</div>
        {card.example && <div className="text-xs text-navy/50 mt-1 italic truncate">{card.example}</div>}
      </div>
      <button
        onClick={onSpeak}
        className={`flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-xl active:scale-90 transition-all ${
          ttsActive ? "bg-gold text-navy animate-pulse" : "bg-pale-blue text-navy hover:bg-gold/30"
        }`}
        aria-label={listenLabel}
        disabled={!ttsSupported}
      >
        🔊
      </button>
    </div>
  );
}
