"use client";

/**
 * English Hangman. Same UX as `Hangman.tsx` (gallows + 6-strike loss) but the
 * word bank and on-screen keyboard are English-only.
 *
 * Bonus: a "🔊 Hint" button speaks the secret word using TTS — for
 * pronunciation reinforcement after the kid wins/loses.
 */

import { useEffect, useMemo, useState } from "react";
import { useGameBack } from "../useGameBack";
import { useSpeak } from "./useSpeak";
import confetti from "canvas-confetti";

const WORDS = [
  // Animals
  "CAT", "DOG", "LION", "BIRD", "FISH", "HORSE", "MONKEY", "ELEPHANT",
  // Family
  "MOTHER", "FATHER", "SISTER", "BROTHER", "UNCLE", "AUNT",
  // School
  "BOOK", "PEN", "DESK", "CHAIR", "TEACHER", "STUDENT",
  // Food
  "BREAD", "MILK", "WATER", "RICE", "MEAT", "CHEESE", "APPLE",
  // Colors
  "RED", "BLUE", "GREEN", "YELLOW", "BLACK", "WHITE", "ORANGE", "PURPLE",
  // Misc
  "SUN", "MOON", "STAR", "TREE", "RAIN", "CAR", "HOUSE", "FRIEND",
];

const KEYBOARD = [
  "QWERTYUIOP".split(""),
  "ASDFGHJKL".split(""),
  "ZXCVBNM".split(""),
];

export function EnglishHangman() {
  const goBack = useGameBack("/petits/anglais");
  const { speak, supported } = useSpeak();

  const [seed, setSeed] = useState(0);
  const word = useMemo(() => {
    void seed;
    return WORDS[Math.floor(Math.random() * WORDS.length)];
  }, [seed]);

  const letters = useMemo(() => Array.from(word), [word]);
  const [guessed, setGuessed] = useState<Set<string>>(new Set());

  const wrongGuesses = useMemo(
    () => Array.from(guessed).filter((g) => !letters.includes(g)),
    [guessed, letters],
  );
  const wrongCount = wrongGuesses.length;
  const allRevealed = letters.every((l) => guessed.has(l));
  const lost = wrongCount >= 6;
  const won = allRevealed && !lost;
  const finished = won || lost;

  useEffect(() => {
    if (won) {
      confetti({ particleCount: 80, spread: 90, colors: ["#D4A72C", "#0F1B33"] });
      // Speak the word once on win — pronunciation reinforcement.
      const id = setTimeout(() => speak(word), 400);
      return () => clearTimeout(id);
    }
    if (lost) {
      // Also speak on loss so kid hears the answer.
      const id = setTimeout(() => speak(word), 400);
      return () => clearTimeout(id);
    }
  }, [won, lost, word, speak]);

  const onLetter = (l: string) => {
    if (finished || guessed.has(l)) return;
    setGuessed((s) => new Set(s).add(l));
  };

  const onRestart = () => {
    setGuessed(new Set());
    setSeed((s) => s + 1);
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="px-5 py-4 flex items-center justify-between bg-white border-b border-pale-blue">
        <button onClick={goBack} className="w-10 h-10 rounded-full hover:bg-pale-blue/40 flex items-center justify-center text-navy" aria-label="Retour">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div className="text-center">
          <h1 className="font-bold text-navy">English Hangman</h1>
          <div className="text-xs text-fg-soft font-ar" dir="rtl">المشنقة بالإنجليزية</div>
        </div>
        <div className="w-10" />
      </header>

      <main className="flex-1 flex flex-col items-center px-4 py-4 gap-4">
        <div className="text-xs text-fg-soft text-center max-w-sm">
          Devine le mot avant que le bonhomme ne soit complet.
        </div>

        <div className="bg-white rounded-2xl border-4 border-navy p-4 shadow-card">
          <HangmanSVG step={wrongCount} />
        </div>

        <div className="flex gap-2 flex-wrap justify-center">
          {letters.map((l, i) => {
            const reveal = guessed.has(l) || lost;
            return (
              <span
                key={i}
                className={`w-10 h-12 sm:w-12 sm:h-14 border-b-4 border-navy flex items-end justify-center pb-1 text-2xl sm:text-3xl font-bold ${
                  reveal ? "text-navy" : "text-transparent"
                } ${lost && !guessed.has(l) ? "text-red-500" : ""}`}
              >
                {l}
              </span>
            );
          })}
        </div>

        <div className="text-xs text-fg-soft">Erreurs : {wrongCount}/6</div>

        <div className="flex flex-col gap-2 items-center w-full max-w-md">
          {KEYBOARD.map((row, ri) => (
            <div key={ri} className="flex gap-1 justify-center flex-wrap">
              {row.map((l) => {
                const used = guessed.has(l);
                const isWrong = used && !letters.includes(l);
                const isRight = used && letters.includes(l);
                return (
                  <button
                    key={l}
                    onClick={() => onLetter(l)}
                    disabled={used || finished}
                    className={`w-8 h-10 sm:w-9 sm:h-11 rounded-lg text-base sm:text-lg font-bold transition-all ${
                      isRight
                        ? "bg-gold text-navy"
                        : isWrong
                        ? "bg-red-200 text-red-700"
                        : "bg-white text-navy border-2 border-pale-blue hover:bg-pale-blue/40 active:scale-95"
                    } disabled:opacity-60`}
                  >
                    {l}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {finished && (
          <div className="bg-white rounded-2xl p-5 border-4 border-gold w-full max-w-md text-center shadow-card">
            <div className="text-5xl mb-2">{won ? "🎉" : "😢"}</div>
            <div className="font-bold text-navy text-lg mb-1">
              {won ? "You won!" : "You lost…"}
            </div>
            <div className="text-sm text-fg-soft mb-1">
              Le mot était : <strong className="text-navy">{word}</strong>
            </div>
            <button
              onClick={() => speak(word)}
              className="text-xs text-navy/70 underline mb-3"
              disabled={!supported}
            >
              🔊 Réécouter
            </button>
            <div />
            <button
              onClick={onRestart}
              className="bg-navy text-white px-6 py-3 rounded-2xl font-bold active:scale-95 transition-transform"
            >
              Rejouer
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

function HangmanSVG({ step }: { step: number }) {
  return (
    <svg viewBox="0 0 120 140" width="140" height="160" className="text-navy">
      <line x1="10" y1="130" x2="110" y2="130" stroke="currentColor" strokeWidth="4" />
      <line x1="30" y1="130" x2="30" y2="10" stroke="currentColor" strokeWidth="4" />
      <line x1="30" y1="10" x2="80" y2="10" stroke="currentColor" strokeWidth="4" />
      <line x1="80" y1="10" x2="80" y2="25" stroke="currentColor" strokeWidth="4" />
      {step >= 1 && <circle cx="80" cy="38" r="13" stroke="currentColor" strokeWidth="3" fill="none" />}
      {step >= 2 && <line x1="80" y1="51" x2="80" y2="90" stroke="currentColor" strokeWidth="3" />}
      {step >= 3 && <line x1="80" y1="60" x2="65" y2="78" stroke="currentColor" strokeWidth="3" />}
      {step >= 4 && <line x1="80" y1="60" x2="95" y2="78" stroke="currentColor" strokeWidth="3" />}
      {step >= 5 && <line x1="80" y1="90" x2="68" y2="115" stroke="currentColor" strokeWidth="3" />}
      {step >= 6 && <line x1="80" y1="90" x2="92" y2="115" stroke="currentColor" strokeWidth="3" />}
      {step >= 6 && (
        <>
          <line x1="74" y1="34" x2="78" y2="38" stroke="red" strokeWidth="2" />
          <line x1="78" y1="34" x2="74" y2="38" stroke="red" strokeWidth="2" />
          <line x1="82" y1="34" x2="86" y2="38" stroke="red" strokeWidth="2" />
          <line x1="86" y1="34" x2="82" y2="38" stroke="red" strokeWidth="2" />
        </>
      )}
    </svg>
  );
}
