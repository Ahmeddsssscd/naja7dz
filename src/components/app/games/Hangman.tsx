"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import confetti from "canvas-confetti";

/**
 * Hangman / jeu du pendu.
 *
 * Word bank per locale (~20 simple words). 6 wrong guesses allowed; each wrong
 * guess draws another body part of the hanged figure. On-screen keyboard
 * scopes letters to the locale alphabet (FR uppercase A-Z, AR basic letters).
 */

const WORDS_FR = [
  // animals
  "CHAT", "CHIEN", "LION", "GIRAFE", "OURS", "POISSON", "LAPIN",
  // fruits
  "POMME", "BANANE", "ORANGE", "FRAISE", "RAISIN",
  // family / everyday
  "MAMAN", "PAPA", "FRERE", "SOEUR", "ECOLE", "MAISON", "LIVRE", "PAIN",
];

// Arabic words use a simplified alphabet (no shadda / damma / etc).
const WORDS_AR = [
  "قط", "كلب", "أسد", "زرافة", "دب", "سمك", "أرنب",
  "تفاح", "موز", "برتقال", "فراولة", "عنب",
  "أم", "أب", "أخ", "أخت", "مدرسة", "بيت", "كتاب", "خبز",
];

const FR_KEYBOARD = [
  "AZERTYUIOP".split(""),
  "QSDFGHJKLM".split(""),
  "WXCVBN".split(""),
];

// Basic Arabic letter set; covers all WORDS_AR letters.
const AR_KEYBOARD = [
  "أبتثجحخدذ".split(""),
  "رزسشصضطظع".split(""),
  "غفقكلمنهوي".split(""),
  "ةى".split(""),
];

export function Hangman() {
  const router = useRouter();
  const t = useTranslations("PetitsGameHangman");
  const locale = useLocale();
  const isAR = locale === "ar";

  const wordBank = isAR ? WORDS_AR : WORDS_FR;
  const keyboard = isAR ? AR_KEYBOARD : FR_KEYBOARD;

  const [seed, setSeed] = useState(0);
  const word = useMemo(() => {
    void seed; // keeps memo tied to restart counter
    return wordBank[Math.floor(Math.random() * wordBank.length)];
  }, [wordBank, seed]);

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
    if (won) confetti({ particleCount: 80, spread: 90, colors: ["#D4A72C", "#0F1B33"] });
  }, [won]);

  const onLetter = (l: string) => {
    if (finished) return;
    if (guessed.has(l)) return;
    setGuessed((s) => new Set(s).add(l));
  };

  const onRestart = () => {
    setGuessed(new Set());
    setSeed((s) => s + 1);
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col" dir={isAR ? "rtl" : "ltr"}>
      <header className="px-5 py-4 flex items-center justify-between bg-white border-b border-pale-blue">
        <button
          onClick={() => router.push("/petits/jeux-malins")}
          className="w-10 h-10 rounded-full hover:bg-pale-blue/40 flex items-center justify-center text-navy"
          aria-label={t("back")}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points={isAR ? "9 18 15 12 9 6" : "15 18 9 12 15 6"} />
          </svg>
        </button>
        <h1 className="font-bold text-navy">{t("page_title")}</h1>
        <div className="w-10" />
      </header>

      <main className="flex-1 flex flex-col items-center px-4 py-4 gap-4">
        <div className="text-xs text-fg-soft text-center max-w-sm">{t("instructions")}</div>

        {/* Hanged figure */}
        <div className="bg-white rounded-2xl border-4 border-navy p-4 shadow-card">
          <HangmanSVG step={wrongCount} />
        </div>

        {/* Word display */}
        <div className="flex gap-2 flex-wrap justify-center" lang={isAR ? "ar" : "fr"}>
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

        <div className="text-xs text-fg-soft">
          {t("wrong_guesses", { count: wrongCount, max: 6 })}
        </div>

        {/* Keyboard */}
        <div className="flex flex-col gap-2 items-center w-full max-w-md">
          {keyboard.map((row, ri) => (
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
                    className={`w-8 h-10 sm:w-10 sm:h-12 rounded-lg text-base sm:text-lg font-bold transition-all ${
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
              {won ? t("you_win") : t("you_lose")}
            </div>
            <div className="text-sm text-fg-soft mb-3">
              {t("the_word_was")} <strong className="text-navy">{word}</strong>
            </div>
            <button
              onClick={onRestart}
              className="bg-navy text-white px-6 py-3 rounded-2xl font-bold active:scale-95 transition-transform"
            >
              {t("try_again")}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

function HangmanSVG({ step }: { step: number }) {
  // Step 0..6. Draws gallows always, then progressively the body.
  return (
    <svg viewBox="0 0 120 140" width="140" height="160" className="text-navy">
      {/* Gallows */}
      <line x1="10" y1="130" x2="110" y2="130" stroke="currentColor" strokeWidth="4" />
      <line x1="30" y1="130" x2="30" y2="10" stroke="currentColor" strokeWidth="4" />
      <line x1="30" y1="10" x2="80" y2="10" stroke="currentColor" strokeWidth="4" />
      <line x1="80" y1="10" x2="80" y2="25" stroke="currentColor" strokeWidth="4" />
      {/* Head */}
      {step >= 1 && <circle cx="80" cy="38" r="13" stroke="currentColor" strokeWidth="3" fill="none" />}
      {/* Body */}
      {step >= 2 && <line x1="80" y1="51" x2="80" y2="90" stroke="currentColor" strokeWidth="3" />}
      {/* Left arm */}
      {step >= 3 && <line x1="80" y1="60" x2="65" y2="78" stroke="currentColor" strokeWidth="3" />}
      {/* Right arm */}
      {step >= 4 && <line x1="80" y1="60" x2="95" y2="78" stroke="currentColor" strokeWidth="3" />}
      {/* Left leg */}
      {step >= 5 && <line x1="80" y1="90" x2="68" y2="115" stroke="currentColor" strokeWidth="3" />}
      {/* Right leg */}
      {step >= 6 && <line x1="80" y1="90" x2="92" y2="115" stroke="currentColor" strokeWidth="3" />}
      {/* X eyes when lost */}
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
