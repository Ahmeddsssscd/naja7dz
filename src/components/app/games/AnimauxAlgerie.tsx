"use client";

/**
 * Animaux d'Algérie — memory pair-match game with Algerian wildlife.
 *
 * 8 unique animals = 16 cards in a 4×4 grid. Each animal has an emoji, FR
 * name, AR name and a fun fact. Tracks moves + elapsed time, awards 1-3
 * stars based on move count. MascotCelebration on a "perfect" run
 * (no mismatched pairs, exactly 8 moves).
 */

import { useEffect, useRef, useState } from "react";
import { useGameBack } from "./useGameBack";
import { MascotCelebration } from "@/components/app/MascotCelebration";
import confetti from "canvas-confetti";

interface Animal {
  emoji: string;
  fr: string;
  ar: string;
  fact: string;
}

const ANIMALS: Animal[] = [
  { emoji: "🦊", fr: "Fennec",       ar: "فنك",          fact: "Le renard du Sahara, animal national de l'Algérie." },
  { emoji: "🐂", fr: "Addax",        ar: "مهاة",         fact: "Antilope du Sahara aux longues cornes en spirale." },
  { emoji: "🐏", fr: "Mouflon",      ar: "موفلون",       fact: "Mouton sauvage de l'Atlas aux cornes courbées." },
  { emoji: "🦌", fr: "Gazelle",      ar: "غزال",         fact: "Très rapide, peut courir à 80 km/h dans le désert." },
  { emoji: "🦅", fr: "Aigle royal",  ar: "نسر ذهبي",     fact: "Roi des airs, vue 8 fois plus puissante que la nôtre." },
  { emoji: "🕊️", fr: "Cigogne",      ar: "لقلق",         fact: "Migre chaque année entre l'Algérie et l'Europe." },
  { emoji: "🐺", fr: "Chacal",       ar: "ابن آوى",      fact: "Cousin du loup, très intelligent et nocturne." },
  { emoji: "🦔", fr: "Hérisson",     ar: "قنفذ",         fact: "Se met en boule pour se protéger avec ses piquants." },
];

interface Card {
  id: number;
  pairKey: string;
  emoji: string;
  fr: string;
  ar: string;
  fact: string;
  matched: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function newDeck(): Card[] {
  const cards: Card[] = [];
  ANIMALS.forEach((a, i) => {
    cards.push({ id: i * 2, pairKey: a.fr, emoji: a.emoji, fr: a.fr, ar: a.ar, fact: a.fact, matched: false });
    cards.push({ id: i * 2 + 1, pairKey: a.fr, emoji: a.emoji, fr: a.fr, ar: a.ar, fact: a.fact, matched: false });
  });
  return shuffle(cards);
}

const STORAGE_KEY = "najah:animaux:best";
const PERFECT_MOVES = 8; // 8 pairs in 8 moves = perfect

export function AnimauxAlgerie() {
  const goBack = useGameBack();
  const [cards, setCards] = useState<Card[]>(() => newDeck());
  const [flipped, setFlipped] = useState<number[]>([]); // indices currently face-up
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [done, setDone] = useState(false);
  const [tooltip, setTooltip] = useState<{ idx: number; fact: string } | null>(null);
  const [bestMoves, setBestMoves] = useState<number | null>(null);
  const startRef = useRef<number>(Date.now());

  const allMatched = cards.every((c) => c.matched);

  // Load best moves
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = Number(window.localStorage.getItem(STORAGE_KEY));
    if (Number.isFinite(saved) && saved > 0) setBestMoves(saved);
  }, []);

  // Timer
  useEffect(() => {
    if (done) return;
    const id = setInterval(() => {
      setSeconds(Math.floor((Date.now() - startRef.current) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [done]);

  // Win detection
  useEffect(() => {
    if (allMatched && !done) {
      setDone(true);
      confetti({ particleCount: 100, spread: 90, colors: ["#D4A72C", "#0F1B33", "#FAF9F6", "#1AD18C"] });
      if (bestMoves === null || moves < bestMoves) {
        setBestMoves(moves);
        try { window.localStorage.setItem(STORAGE_KEY, String(moves)); } catch { /* ignore */ }
      }
    }
  }, [allMatched, done, moves, bestMoves]);

  const onTap = (idx: number) => {
    if (done) return;
    if (cards[idx].matched) return;
    if (flipped.includes(idx)) return;
    if (flipped.length >= 2) return;

    if (flipped.length === 0) {
      setFlipped([idx]);
      return;
    }
    const a = flipped[0];
    const b = idx;
    setFlipped([a, b]);
    setMoves((m) => m + 1);

    if (cards[a].pairKey === cards[b].pairKey) {
      // Match — show tooltip briefly, then mark matched.
      setTooltip({ idx: b, fact: cards[b].fact });
      setTimeout(() => {
        setCards((cs) => cs.map((c, i) => (i === a || i === b ? { ...c, matched: true } : c)));
        setFlipped([]);
        setTooltip(null);
      }, 1400);
    } else {
      setTimeout(() => setFlipped([]), 850);
    }
  };

  const onRestart = () => {
    setCards(newDeck());
    setFlipped([]);
    setMoves(0);
    setSeconds(0);
    setDone(false);
    setTooltip(null);
    startRef.current = Date.now();
  };

  if (done) {
    const stars = moves <= PERFECT_MOVES + 2 ? 3 : moves <= PERFECT_MOVES + 6 ? 2 : 1;
    const isPerfect = moves === PERFECT_MOVES;
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-5">
        <MascotCelebration trigger={isPerfect} locale="fr" />
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">{stars === 3 ? "🏆" : stars === 2 ? "🌟" : "✨"}</div>
          <h1 className="text-3xl font-bold text-navy mb-2">Bravo !</h1>
          <div className="text-2xl mb-2">{"★".repeat(stars)}<span className="text-line">{"☆".repeat(3 - stars)}</span></div>
          <div className="text-base text-fg-soft mb-1">
            {moves} coup{moves > 1 ? "s" : ""} · {seconds}s
          </div>
          {isPerfect && <div className="text-sm text-gold font-semibold mb-1">Aucune erreur !</div>}
          {bestMoves !== null && bestMoves !== moves && (
            <div className="text-xs text-fg-soft mb-4">Record : {bestMoves} coups</div>
          )}
          <div className="flex gap-3 mt-6">
            <button onClick={goBack} className="btn btn-outline flex-1">Quitter</button>
            <button onClick={onRestart} className="btn btn-primary flex-1">Rejouer</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="px-5 py-4 flex items-center justify-between bg-white border-b border-pale-blue">
        <button onClick={goBack} className="w-10 h-10 rounded-full bg-white border border-pale-blue flex items-center justify-center text-navy" aria-label="Retour">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h1 className="text-base font-bold text-navy">Animaux d'Algérie</h1>
        <button onClick={onRestart} className="text-xs text-navy hover:text-gold font-semibold">↻ Reset</button>
      </header>

      <div className="px-5 py-3 flex items-center justify-between text-sm text-navy bg-white border-b border-pale-blue">
        <div>Coups : <span className="font-bold">{moves}</span></div>
        <div className="font-mono tabular-nums">⏱ {seconds}s</div>
        {bestMoves !== null && <div className="text-fg-soft">Record : {bestMoves}</div>}
      </div>

      <main className="flex-1 px-3 py-5 max-w-lg mx-auto w-full">
        <p className="text-xs text-center text-fg-soft mb-4">
          Trouve les paires d'animaux. Touche deux cartes pour les retourner.
        </p>
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {cards.map((c, i) => {
            const faceUp = c.matched || flipped.includes(i);
            return (
              <button
                key={c.id}
                onClick={() => onTap(i)}
                disabled={c.matched || flipped.length >= 2}
                aria-label={faceUp ? c.fr : `Carte ${i + 1}`}
                className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-300 ${
                  c.matched
                    ? "bg-green-50 border-green-300 opacity-80"
                    : faceUp
                      ? "bg-white border-navy shadow-card scale-[1.02]"
                      : "bg-navy border-navy hover:scale-[1.04] active:scale-95"
                }`}
              >
                {faceUp ? (
                  <>
                    <span className="text-3xl sm:text-4xl">{c.emoji}</span>
                    <span className="text-[9px] sm:text-xs font-semibold text-navy mt-1 leading-tight text-center px-1">{c.fr}</span>
                  </>
                ) : (
                  <span className="text-2xl text-gold">?</span>
                )}
              </button>
            );
          })}
        </div>

        {tooltip && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white border-2 border-gold rounded-2xl px-5 py-3 shadow-card-hover max-w-xs text-center z-40">
            <div className="text-xs uppercase font-bold text-gold mb-1">Le savais-tu ?</div>
            <div className="text-sm text-navy">{tooltip.fact}</div>
          </div>
        )}
      </main>
    </div>
  );
}
