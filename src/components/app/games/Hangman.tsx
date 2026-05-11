"use client";

import { useEffect, useMemo, useState } from "react";
import { useGameBack } from "./useGameBack";
import { useLocale, useTranslations } from "next-intl";
import confetti from "canvas-confetti";

/**
 * Hangman / jeu du pendu.
 *
 * Each word now carries a category + emoji + 1-line hint so the kid always
 * sees a clue ("🐾 Animal — Mon préféré dort beaucoup"). Two passive hints:
 *
 *   - Category badge: shown immediately above the slots from the start.
 *   - 💡 Indice: button that reveals one un-guessed letter. Limited to 2
 *     uses per game so it doesn't trivialise the puzzle.
 *
 * Word bank per locale (~25 words across 5 categories).
 */

interface Entry {
  word: string;
  cat: "animal" | "fruit" | "famille" | "ecole" | "objet";
  emoji: string;
  hint_fr: string;
  hint_ar: string;
}

const CAT_LABEL: Record<Entry["cat"], { fr: string; ar: string; emoji: string }> = {
  animal:  { fr: "Animal",   ar: "حيوان", emoji: "🐾" },
  fruit:   { fr: "Fruit",    ar: "فاكهة", emoji: "🍎" },
  famille: { fr: "Famille",  ar: "عائلة", emoji: "👨‍👩‍👧" },
  ecole:   { fr: "École",    ar: "مدرسة", emoji: "🎒" },
  objet:   { fr: "Objet",    ar: "شيء",  emoji: "🧸" },
};

const ENTRIES_FR: Entry[] = [
  { word: "CHAT",    cat: "animal",  emoji: "🐱", hint_fr: "Petit félin qui ronronne",          hint_ar: "" },
  { word: "CHIEN",   cat: "animal",  emoji: "🐶", hint_fr: "Le meilleur ami de l'humain",        hint_ar: "" },
  { word: "LION",    cat: "animal",  emoji: "🦁", hint_fr: "Roi de la savane",                   hint_ar: "" },
  { word: "GIRAFE",  cat: "animal",  emoji: "🦒", hint_fr: "Grand cou, plus haut animal",        hint_ar: "" },
  { word: "OURS",    cat: "animal",  emoji: "🐻", hint_fr: "Aime le miel et hiberne",            hint_ar: "" },
  { word: "POISSON", cat: "animal",  emoji: "🐟", hint_fr: "Vit dans l'eau",                     hint_ar: "" },
  { word: "LAPIN",   cat: "animal",  emoji: "🐰", hint_fr: "Saute et adore les carottes",        hint_ar: "" },
  { word: "POMME",   cat: "fruit",   emoji: "🍎", hint_fr: "Rouge, croquante, dans l'arbre",     hint_ar: "" },
  { word: "BANANE",  cat: "fruit",   emoji: "🍌", hint_fr: "Jaune, le singe l'adore",            hint_ar: "" },
  { word: "ORANGE",  cat: "fruit",   emoji: "🍊", hint_fr: "Couleur dans son nom",               hint_ar: "" },
  { word: "FRAISE",  cat: "fruit",   emoji: "🍓", hint_fr: "Petite, rouge, en confiture",        hint_ar: "" },
  { word: "RAISIN",  cat: "fruit",   emoji: "🍇", hint_fr: "En grappe, fait du jus",             hint_ar: "" },
  { word: "MAMAN",   cat: "famille", emoji: "👩", hint_fr: "Celle qui te berce",                 hint_ar: "" },
  { word: "PAPA",    cat: "famille", emoji: "👨", hint_fr: "Le mari de maman",                   hint_ar: "" },
  { word: "FRERE",   cat: "famille", emoji: "👦", hint_fr: "Garçon de la même famille",          hint_ar: "" },
  { word: "SOEUR",   cat: "famille", emoji: "👧", hint_fr: "Fille de la même famille",           hint_ar: "" },
  { word: "ECOLE",   cat: "ecole",   emoji: "🏫", hint_fr: "On y apprend chaque matin",          hint_ar: "" },
  { word: "MAISON",  cat: "objet",   emoji: "🏠", hint_fr: "Là où tu dors la nuit",              hint_ar: "" },
  { word: "LIVRE",   cat: "ecole",   emoji: "📖", hint_fr: "Plein de mots et d'images",          hint_ar: "" },
  { word: "PAIN",    cat: "objet",   emoji: "🥖", hint_fr: "Croustillant, du four",              hint_ar: "" },
];

const ENTRIES_AR: Entry[] = [
  { word: "قط",     cat: "animal",  emoji: "🐱", hint_fr: "", hint_ar: "حيوان صغير يموء" },
  { word: "كلب",    cat: "animal",  emoji: "🐶", hint_fr: "", hint_ar: "صديق الإنسان الوفي" },
  { word: "أسد",    cat: "animal",  emoji: "🦁", hint_fr: "", hint_ar: "ملك الغابة" },
  { word: "زرافة",  cat: "animal",  emoji: "🦒", hint_fr: "", hint_ar: "أطول الحيوانات" },
  { word: "دب",     cat: "animal",  emoji: "🐻", hint_fr: "", hint_ar: "يحب العسل" },
  { word: "سمك",    cat: "animal",  emoji: "🐟", hint_fr: "", hint_ar: "يعيش في الماء" },
  { word: "أرنب",   cat: "animal",  emoji: "🐰", hint_fr: "", hint_ar: "يقفز ويحب الجزر" },
  { word: "تفاح",   cat: "fruit",   emoji: "🍎", hint_fr: "", hint_ar: "أحمر وحلو" },
  { word: "موز",    cat: "fruit",   emoji: "🍌", hint_fr: "", hint_ar: "أصفر، يحبه القرد" },
  { word: "برتقال", cat: "fruit",   emoji: "🍊", hint_fr: "", hint_ar: "اسمه لون" },
  { word: "فراولة", cat: "fruit",   emoji: "🍓", hint_fr: "", hint_ar: "صغيرة وحمراء" },
  { word: "عنب",    cat: "fruit",   emoji: "🍇", hint_fr: "", hint_ar: "في عنقود" },
  { word: "أم",     cat: "famille", emoji: "👩", hint_fr: "", hint_ar: "والدتك" },
  { word: "أب",     cat: "famille", emoji: "👨", hint_fr: "", hint_ar: "والدك" },
  { word: "أخ",     cat: "famille", emoji: "👦", hint_fr: "", hint_ar: "ولد من نفس العائلة" },
  { word: "أخت",    cat: "famille", emoji: "👧", hint_fr: "", hint_ar: "بنت من نفس العائلة" },
  { word: "مدرسة",  cat: "ecole",   emoji: "🏫", hint_fr: "", hint_ar: "نتعلم فيها" },
  { word: "بيت",    cat: "objet",   emoji: "🏠", hint_fr: "", hint_ar: "نسكن فيه" },
  { word: "كتاب",   cat: "ecole",   emoji: "📖", hint_fr: "", hint_ar: "مليء بالكلمات" },
  { word: "خبز",    cat: "objet",   emoji: "🥖", hint_fr: "", hint_ar: "نأكله مع الفطور" },
];

const FR_KEYBOARD = [
  "AZERTYUIOP".split(""),
  "QSDFGHJKLM".split(""),
  "WXCVBN".split(""),
];

const AR_KEYBOARD = [
  "أبتثجحخدذ".split(""),
  "رزسشصضطظع".split(""),
  "غفقكلمنهوي".split(""),
  "ةى".split(""),
];

const MAX_HINTS = 2;

export function Hangman() {
  const goBack = useGameBack();
  const t = useTranslations("PetitsGameHangman");
  const locale = useLocale();
  const isAR = locale === "ar";

  const bank = isAR ? ENTRIES_AR : ENTRIES_FR;
  const keyboard = isAR ? AR_KEYBOARD : FR_KEYBOARD;

  const [seed, setSeed] = useState(0);
  const entry = useMemo(() => {
    void seed;
    return bank[Math.floor(Math.random() * bank.length)];
  }, [bank, seed]);

  const letters = useMemo(() => Array.from(entry.word), [entry]);
  const [guessed, setGuessed] = useState<Set<string>>(new Set());
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showEmoji, setShowEmoji] = useState(false);

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

  const useHint = () => {
    if (finished) return;
    if (hintsUsed >= MAX_HINTS) return;
    // Reveal a random un-guessed letter from the word
    const remaining = letters.filter((l) => !guessed.has(l));
    if (remaining.length === 0) return;
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    setGuessed((s) => new Set(s).add(pick));
    setHintsUsed((n) => n + 1);
  };

  const onRestart = () => {
    setGuessed(new Set());
    setHintsUsed(0);
    setShowEmoji(false);
    setSeed((s) => s + 1);
  };

  const cat = CAT_LABEL[entry.cat];
  const hintText = isAR ? entry.hint_ar : entry.hint_fr;

  return (
    <div className="min-h-screen bg-cream dark:bg-surface-2 flex flex-col" dir={isAR ? "rtl" : "ltr"}>
      <header className="px-5 py-4 flex items-center justify-between bg-surface border-b border-line">
        <button
          onClick={goBack}
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

        {/* Category + textual hint badge — always visible. Helps the kid
            narrow down what kind of word they're hunting before any guess. */}
        <div className="bg-surface border-2 border-gold rounded-2xl px-4 py-3 max-w-sm w-full text-center shadow-card">
          <div className="text-xs uppercase tracking-wider text-gold font-bold">
            {cat.emoji} {cat[isAR ? "ar" : "fr"]}
          </div>
          <div className="text-sm text-navy mt-1 font-semibold">{hintText}</div>
        </div>

        {/* Hanged figure */}
        <div className="bg-surface rounded-2xl border-4 border-navy p-4 shadow-card">
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

        {/* Hint controls */}
        {!finished && (
          <div className="flex gap-2">
            <button
              onClick={useHint}
              disabled={hintsUsed >= MAX_HINTS}
              className="bg-gold/20 border-2 border-gold text-navy text-xs font-bold rounded-full px-3 py-1.5 disabled:opacity-40 active:scale-95"
            >
              💡 {isAR ? "إشارة" : "Indice"} ({MAX_HINTS - hintsUsed}/{MAX_HINTS})
            </button>
            <button
              onClick={() => setShowEmoji((v) => !v)}
              className="bg-pale-blue/40 border-2 border-pale-blue text-navy text-xs font-bold rounded-full px-3 py-1.5 active:scale-95"
            >
              {showEmoji ? "🙈" : "👁️"} {isAR ? "صورة" : "Image"}
            </button>
          </div>
        )}

        {showEmoji && (
          <div className="text-6xl my-1" aria-label="emoji clue">{entry.emoji}</div>
        )}

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
          <div className="bg-surface rounded-2xl p-5 border-4 border-gold w-full max-w-md text-center shadow-card">
            <div className="text-5xl mb-2">{won ? "🎉" : "😢"}</div>
            <div className="font-bold text-navy text-lg mb-1">
              {won ? t("you_win") : t("you_lose")}
            </div>
            <div className="text-sm text-fg-soft mb-3">
              {t("the_word_was")} <strong className="text-navy">{entry.word}</strong> <span className="text-2xl">{entry.emoji}</span>
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
