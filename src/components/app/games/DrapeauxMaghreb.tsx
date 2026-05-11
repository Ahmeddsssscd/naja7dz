"use client";

/**
 * Drapeaux — flag identification quiz covering the Arab world + African
 * neighbours. 10 random questions per round with 4-option multiple choice,
 * a "hint" button that reveals the continent. Best score in localStorage,
 * MascotCelebration triggers on 9+/10.
 */

import { useEffect, useState } from "react";
import { useGameBack } from "./useGameBack";
import { MascotCelebration } from "@/components/app/MascotCelebration";

type Phase = "intro" | "play" | "done";
type Continent = "Afrique" | "Asie" | "Maghreb" | "Moyen-Orient";

interface Country {
  flag: string;
  fr: string;
  ar: string;
  continent: Continent;
}

// 22 Arab countries + 8 African neighbours.
const COUNTRIES: Country[] = [
  // Maghreb
  { flag: "🇩🇿", fr: "Algérie",     ar: "الجزائر",   continent: "Maghreb" },
  { flag: "🇲🇦", fr: "Maroc",       ar: "المغرب",    continent: "Maghreb" },
  { flag: "🇹🇳", fr: "Tunisie",     ar: "تونس",      continent: "Maghreb" },
  { flag: "🇱🇾", fr: "Libye",       ar: "ليبيا",     continent: "Maghreb" },
  { flag: "🇲🇷", fr: "Mauritanie",  ar: "موريتانيا", continent: "Maghreb" },
  { flag: "🇪🇭", fr: "Sahara occ.", ar: "الصحراء",   continent: "Maghreb" },
  // Afrique non-Maghreb (Arab)
  { flag: "🇪🇬", fr: "Égypte",      ar: "مصر",       continent: "Afrique" },
  { flag: "🇸🇩", fr: "Soudan",      ar: "السودان",   continent: "Afrique" },
  { flag: "🇸🇴", fr: "Somalie",     ar: "الصومال",   continent: "Afrique" },
  { flag: "🇩🇯", fr: "Djibouti",    ar: "جيبوتي",    continent: "Afrique" },
  { flag: "🇰🇲", fr: "Comores",     ar: "جزر القمر", continent: "Afrique" },
  // Moyen-Orient
  { flag: "🇸🇦", fr: "Arabie saoudite", ar: "السعودية", continent: "Moyen-Orient" },
  { flag: "🇶🇦", fr: "Qatar",       ar: "قطر",       continent: "Moyen-Orient" },
  { flag: "🇰🇼", fr: "Koweït",      ar: "الكويت",    continent: "Moyen-Orient" },
  { flag: "🇧🇭", fr: "Bahreïn",     ar: "البحرين",   continent: "Moyen-Orient" },
  { flag: "🇴🇲", fr: "Oman",        ar: "عُمان",      continent: "Moyen-Orient" },
  { flag: "🇦🇪", fr: "Émirats",     ar: "الإمارات",  continent: "Moyen-Orient" },
  { flag: "🇮🇶", fr: "Irak",        ar: "العراق",    continent: "Moyen-Orient" },
  { flag: "🇯🇴", fr: "Jordanie",    ar: "الأردن",    continent: "Moyen-Orient" },
  { flag: "🇵🇸", fr: "Palestine",   ar: "فلسطين",    continent: "Moyen-Orient" },
  { flag: "🇱🇧", fr: "Liban",       ar: "لبنان",     continent: "Moyen-Orient" },
  { flag: "🇸🇾", fr: "Syrie",       ar: "سوريا",     continent: "Moyen-Orient" },
  { flag: "🇾🇪", fr: "Yémen",       ar: "اليمن",     continent: "Moyen-Orient" },
  // 8 African neighbours (non-Arab)
  { flag: "🇲🇱", fr: "Mali",        ar: "مالي",      continent: "Afrique" },
  { flag: "🇳🇪", fr: "Niger",       ar: "النيجر",    continent: "Afrique" },
  { flag: "🇸🇳", fr: "Sénégal",     ar: "السنغال",   continent: "Afrique" },
  { flag: "🇨🇮", fr: "Côte d'Ivoire", ar: "ساحل العاج", continent: "Afrique" },
  { flag: "🇧🇫", fr: "Burkina Faso", ar: "بوركينا",  continent: "Afrique" },
  { flag: "🇬🇭", fr: "Ghana",       ar: "غانا",      continent: "Afrique" },
  { flag: "🇹🇩", fr: "Tchad",       ar: "تشاد",      continent: "Afrique" },
  { flag: "🇳🇬", fr: "Nigéria",     ar: "نيجيريا",   continent: "Afrique" },
];

const ROUNDS = 10;
const STORAGE_KEY = "najah:drapeaux:best";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Question {
  country: Country;
  options: Country[]; // 4 incl. correct
}

function makeQuestions(): Question[] {
  const queue = shuffle(COUNTRIES).slice(0, ROUNDS);
  return queue.map((c) => {
    const distractors = shuffle(COUNTRIES.filter((x) => x.fr !== c.fr)).slice(0, 3);
    const options = shuffle([c, ...distractors]);
    return { country: c, options };
  });
}

export function DrapeauxMaghreb() {
  const goBack = useGameBack();
  const [phase, setPhase] = useState<Phase>("intro");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [hintShown, setHintShown] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = Number(window.localStorage.getItem(STORAGE_KEY));
    if (Number.isFinite(saved)) setBest(saved);
  }, []);

  const start = () => {
    setQuestions(makeQuestions());
    setIndex(0);
    setScore(0);
    setPicked(null);
    setHintShown(false);
    setHintsUsed(0);
    setPhase("play");
  };

  const onAnswer = (opt: Country) => {
    if (picked) return;
    setPicked(opt.fr);
    const correct = opt.fr === questions[index].country.fr;
    if (correct) setScore((s) => s + 1);
    setTimeout(() => {
      if (index + 1 >= questions.length) {
        const finalScore = score + (correct ? 1 : 0);
        if (finalScore > best) {
          setBest(finalScore);
          try { window.localStorage.setItem(STORAGE_KEY, String(finalScore)); } catch { /* ignore */ }
        }
        setPhase("done");
      } else {
        setIndex((i) => i + 1);
        setPicked(null);
        setHintShown(false);
      }
    }, correct ? 800 : 1400);
  };

  if (phase === "intro") {
    return (
      <div className="min-h-screen bg-cream dark:bg-surface-2 flex flex-col">
        <header className="px-5 py-4 flex items-center justify-between bg-surface border-b border-line">
          <button onClick={goBack} className="w-10 h-10 rounded-full bg-surface border border-pale-blue flex items-center justify-center text-navy" aria-label="Retour">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <h1 className="text-base font-bold text-navy">Drapeaux du monde arabe</h1>
          <div className="w-10" />
        </header>
        <main className="flex-1 px-5 py-6 max-w-md md:max-w-2xl lg:max-w-3xl mx-auto w-full text-center">
          <div className="text-7xl mb-4 leading-none">🇩🇿 🇲🇦 🇪🇬</div>
          <h2 className="text-2xl font-bold text-navy mb-2">Reconnais les drapeaux !</h2>
          <p className="text-fg-soft text-sm mb-6">
            10 questions à choix multiple. Bouton « Indice » pour révéler le continent.
          </p>
          {best > 0 && (
            <div className="bg-surface border border-pale-blue rounded-xl py-3 mb-6">
              <div className="text-xs text-fg-soft uppercase">Ton record</div>
              <div className="text-3xl font-bold text-gold">{best} / {ROUNDS}</div>
            </div>
          )}
          <button onClick={start} className="btn btn-primary btn-lg w-full">
            Commencer
          </button>
        </main>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div className="min-h-screen bg-cream dark:bg-surface-2 flex items-center justify-center px-5">
        <MascotCelebration trigger={score >= 9} locale="fr" />
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">{score === 10 ? "🏆" : score >= 7 ? "🌟" : score >= 4 ? "✨" : "📝"}</div>
          <h1 className="text-3xl font-bold text-navy mb-2">Bien joué !</h1>
          <div className="text-5xl font-bold text-gold mb-1">{score}<span className="text-2xl text-fg-soft"> / {ROUNDS}</span></div>
          {hintsUsed > 0 && (
            <div className="text-sm text-fg-soft mb-2">{hintsUsed} indice{hintsUsed > 1 ? "s" : ""} utilisé{hintsUsed > 1 ? "s" : ""}</div>
          )}
          <div className="text-base text-fg-soft mb-6">
            {score === 10 ? "Score parfait !" : score >= 7 ? "Excellent !" : score >= 4 ? "Continue !" : "À retenter !"}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setPhase("intro")} className="btn btn-outline flex-1">Quitter</button>
            <button onClick={start} className="btn btn-primary flex-1">Rejouer</button>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[index];
  const correctName = q.country.fr;

  return (
    <div className="min-h-screen bg-cream dark:bg-surface-2 flex flex-col">
      <header className="px-5 py-4 flex items-center justify-between bg-surface border-b border-line">
        <button onClick={() => setPhase("intro")} className="w-10 h-10 rounded-full bg-surface border border-pale-blue flex items-center justify-center text-navy" aria-label="Quitter">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div className="text-sm font-bold text-navy">{index + 1}/{ROUNDS} · ⭐ {score}</div>
        <div className="w-10" />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-5 py-6 gap-5">
        <div className="bg-surface border-4 border-navy rounded-3xl p-8 shadow-card">
          <div className="text-[7rem] md:text-[10rem] leading-none text-center" aria-label={`Drapeau ${q.country.fr}`}>{q.country.flag}</div>
        </div>

        <button
          onClick={() => { if (!hintShown) { setHintShown(true); setHintsUsed((h) => h + 1); } }}
          disabled={hintShown || picked !== null}
          className="text-sm text-navy underline-offset-2 hover:underline disabled:opacity-50 disabled:no-underline"
        >
          {hintShown ? `💡 Continent : ${q.country.continent}` : "💡 Indice (révéler le continent)"}
        </button>

        <div className="grid grid-cols-2 gap-3 w-full max-w-md">
          {q.options.map((opt) => {
            const isCorrect = opt.fr === correctName;
            const isPicked = picked === opt.fr;
            let cls = "bg-surface border-2 border-pale-blue text-navy hover:border-gold";
            if (picked) {
              if (isCorrect) cls = "bg-green-100 border-2 border-green-500 text-green-900";
              else if (isPicked) cls = "bg-red-100 border-2 border-red-500 text-red-900";
              else cls = "bg-surface border-2 border-pale-blue text-fg-soft opacity-60";
            }
            return (
              <button
                key={opt.fr}
                onClick={() => onAnswer(opt)}
                disabled={picked !== null}
                className={`${cls} rounded-xl py-4 px-3 font-bold text-base hover:scale-[1.02] active:scale-95 transition-all disabled:cursor-default`}
              >
                {opt.fr}
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
