"use client";

/**
 * Anagrammes — drag-and-drop letter rearrangement puzzle.
 *
 * Show a scrambled word, the player taps letters in the correct order to
 * build the answer. 8 rounds, mixed FR + AR vocabulary. Best-score persisted
 * in localStorage.
 */

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { useGameBack } from "./useGameBack";
import { toast } from "sonner";
import confetti from "canvas-confetti";

const ROUNDS = 8;

const WORDS_FR = [
  "ECOLE", "MAISON", "FAMILLE", "JARDIN", "OISEAU", "VOITURE", "MUSIQUE", "ETOILE",
  "AMOUR", "SOLEIL", "ARABE", "ALGER", "DESERT", "MONTAGNE", "FLEUVE", "OASIS",
];

const WORDS_AR = [
  "مدرسة", "بيت", "عائلة", "حديقة", "طائر", "سيارة", "موسيقى", "نجمة",
  "حب", "شمس", "كتاب", "قلم", "صديق", "ذاكرة", "أمل", "نور",
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRound(locale: "fr" | "ar"): { word: string; scrambled: string[] } {
  const pool = locale === "ar" ? WORDS_AR : WORDS_FR;
  const word = pool[Math.floor(Math.random() * pool.length)];
  let scrambled: string[];
  // Avoid the rare case where the shuffle output equals the word itself.
  do {
    scrambled = shuffle(word.split(""));
  } while (scrambled.join("") === word && word.length > 1);
  return { word, scrambled };
}

const STORAGE_KEY = "najah:anagrammes:best";

export function Anagrammes() {
  const goBack = useGameBack();
  const localeStr = useLocale();
  const locale = localeStr === "ar" ? "ar" : "fr";

  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [building, setBuilding] = useState<number[]>([]); // indices into pool
  const [pool, setPool] = useState<string[]>([]);
  const [target, setTarget] = useState<string>("");
  const [done, setDone] = useState(false);

  const startRound = useMemo(() => () => {
    const { word, scrambled } = pickRound(locale);
    setTarget(word);
    setPool(scrambled);
    setBuilding([]);
  }, [locale]);

  // Load best score and start the first round.
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = Number(window.localStorage.getItem(STORAGE_KEY));
      if (Number.isFinite(saved)) setBestScore(saved);
    }
    startRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const built = building.map((i) => pool[i]).join("");
  const correct = built === target;
  const [solving, setSolving] = useState(false);

  const onPickLetter = (idx: number) => {
    if (building.includes(idx) || correct || solving) return;
    setBuilding((b) => [...b, idx]);
  };

  const onUndo = () => {
    if (correct || solving) return;
    setBuilding((b) => b.slice(0, -1));
  };

  // Auto-advance when the answer is fully built. We watch `correct` becoming
  // true rather than using a separate Valider button — the player just spells
  // the word and we celebrate immediately.
  useEffect(() => {
    if (!correct || solving || done) return;
    setSolving(true);
    toast.success("✓ Bravo !");
    confetti({ particleCount: 40, spread: 60, colors: ["#D4A72C", "#0F1B33"] });
    setScore((s) => s + 1);
    const id = setTimeout(() => {
      if (round >= ROUNDS) {
        const final = score + 1;
        if (final > bestScore) {
          setBestScore(final);
          try { window.localStorage.setItem(STORAGE_KEY, String(final)); } catch { /* ignore */ }
        }
        setDone(true);
      } else {
        setRound((r) => r + 1);
        startRound();
      }
      setSolving(false);
    }, 900);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [correct]);

  const onValidate = () => {
    if (built === target) return; // handled by the effect above
    // Wrong attempt at full length — flash error and reset the build.
    toast.error("✗ Pas tout à fait", { description: `Réessaie` });
    setBuilding([]);
  };

  const onSkip = () => {
    if (round >= ROUNDS) {
      setDone(true);
    } else {
      setRound((r) => r + 1);
      startRound();
    }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-cream dark:bg-surface-2 flex items-center justify-center px-5">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">{score >= 6 ? "🏆" : score >= 3 ? "✨" : "📝"}</div>
          <h1 className="text-3xl font-bold text-navy mb-2">Bravo !</h1>
          <p className="text-fg-soft mb-1">Tu as trouvé</p>
          <div className="text-6xl font-bold text-gold mb-2">{score}<span className="text-2xl text-fg-soft"> / {ROUNDS}</span></div>
          {bestScore > 0 && (
            <p className="text-sm text-fg-soft mb-4">🔥 Meilleur score : {bestScore} / {ROUNDS}</p>
          )}
          <div className="flex gap-3 mt-4">
            <button onClick={goBack} className="btn btn-outline flex-1">Retour</button>
            <button onClick={() => { setRound(1); setScore(0); setDone(false); startRound(); }} className="btn btn-primary flex-1">Rejouer</button>
          </div>
        </div>
      </div>
    );
  }

  const isAr = locale === "ar";

  return (
    <div className="min-h-screen bg-cream dark:bg-surface-2 flex flex-col" dir={isAr ? "rtl" : "ltr"}>
      <header className="px-5 py-4 flex items-center justify-between bg-surface border-b border-line">
        <button onClick={goBack} className="w-10 h-10 rounded-full bg-surface border border-pale-blue flex items-center justify-center text-navy" aria-label="Retour">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points={isAr ? "9 18 15 12 9 6" : "15 18 9 12 15 6"}/>
          </svg>
        </button>
        <div className="text-sm font-bold text-navy">{isAr ? "تأليف الكلمات" : "Anagrammes"}</div>
        <div className="text-sm font-bold text-gold">{round}/{ROUNDS} · ⭐ {score}</div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-5 gap-7">
        <div className="text-sm text-fg-soft text-center">
          {isAr ? "اضغط على الحروف بالترتيب الصحيح" : "Tape les lettres dans le bon ordre"}
        </div>

        {/* Built word */}
        <div className="bg-surface border-2 border-navy rounded-3xl p-5 min-h-[80px] min-w-[260px] flex items-center justify-center gap-2 shadow-card">
          {building.length === 0 ? (
            <span className="text-fg-faint text-sm">{isAr ? "ابدأ بالضغط على حرف" : "Touche une lettre"}</span>
          ) : (
            building.map((i, k) => (
              <span key={k} className={`inline-flex w-9 h-11 rounded-lg items-center justify-center text-xl font-bold ${correct ? "bg-green-100 text-green-900" : "bg-pale-blue text-navy"}`}>
                {pool[i]}
              </span>
            ))
          )}
        </div>

        {/* Letter pool */}
        <div className="flex gap-2 flex-wrap justify-center max-w-md">
          {pool.map((letter, i) => (
            <button
              key={i}
              onClick={() => onPickLetter(i)}
              disabled={building.includes(i) || correct}
              className={`w-12 h-14 rounded-xl text-2xl font-bold transition-all ${
                building.includes(i)
                  ? "bg-line/40 text-fg-faint border border-line"
                  : "bg-gold text-navy hover:scale-105 active:scale-95 shadow-card"
              }`}
            >
              {letter}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-2">
          <button
            onClick={onUndo}
            disabled={building.length === 0 || correct}
            className="btn btn-outline text-sm disabled:opacity-50"
          >
            ↶ {isAr ? "تراجع" : "Annuler"}
          </button>
          <button
            onClick={onValidate}
            disabled={building.length !== target.length || correct}
            className="btn btn-primary text-sm disabled:opacity-50"
          >
            ✓ {isAr ? "تحقّق" : "Valider"}
          </button>
          <button onClick={onSkip} className="btn btn-outline text-sm text-fg-soft">
            {isAr ? "تخطّى" : "Passer"} ›
          </button>
        </div>
      </main>
    </div>
  );
}
