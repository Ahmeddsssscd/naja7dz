"use client";

import { useEffect, useState } from "react";
import { useGameBack } from "./useGameBack";
import confetti from "canvas-confetti";

const ICONS = ["🦊", "🌙", "⭐", "🌴", "📚", "🕌", "🌶", "🦁"];

interface Card {
  id: number;
  icon: string;
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
  const deck: Card[] = [];
  ICONS.forEach((icon, i) => {
    deck.push({ id: i * 2, icon, matched: false });
    deck.push({ id: i * 2 + 1, icon, matched: false });
  });
  return shuffle(deck);
}

export function MemoryGrid() {
  const goBack = useGameBack("/petits");
  const [cards, setCards] = useState<Card[]>(() => newDeck());
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [done, setDone] = useState(false);

  const allMatched = cards.every((c) => c.matched);

  useEffect(() => {
    if (allMatched && !done) {
      setDone(true);
      confetti({ particleCount: 100, spread: 90, colors: ["#D4A72C", "#0F1B33", "#FAF9F6"] });
    }
  }, [allMatched, done]);

  const onTap = (idx: number) => {
    if (cards[idx].matched || flipped.includes(idx) || flipped.length >= 2) return;

    if (flipped.length === 0) {
      setFlipped([idx]);
      return;
    }
    // Second flip
    const a = flipped[0];
    const b = idx;
    setFlipped([a, b]);
    setMoves((m) => m + 1);

    if (cards[a].icon === cards[b].icon) {
      // Match!
      setTimeout(() => {
        setCards((cs) => cs.map((c, i) => (i === a || i === b ? { ...c, matched: true } : c)));
        setFlipped([]);
      }, 350);
    } else {
      setTimeout(() => setFlipped([]), 800);
    }
  };

  const onRestart = () => {
    setCards(newDeck());
    setFlipped([]);
    setMoves(0);
    setDone(false);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-5">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-navy mb-2">Bravo !</h1>
          <p className="text-fg-soft mb-6">
            Tu as trouvé toutes les paires en <strong className="text-navy">{moves}</strong> coups.
          </p>
          <div className="flex gap-3">
            <button onClick={goBack} className="btn btn-outline flex-1">Retour</button>
            <button onClick={onRestart} className="btn btn-primary flex-1">Rejouer</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="px-5 py-4 flex items-center justify-between">
        <button onClick={goBack} className="w-10 h-10 rounded-full bg-white border border-pale-blue flex items-center justify-center text-navy" aria-label="Retour">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div className="font-bold text-navy">Coups : {moves}</div>
        <div className="w-10" />
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="grid grid-cols-4 gap-3 max-w-sm w-full">
          {cards.map((c, i) => {
            const isShowing = c.matched || flipped.includes(i);
            return (
              <button
                key={c.id}
                onClick={() => onTap(i)}
                className={`aspect-square rounded-2xl text-4xl flex items-center justify-center transition-all ${
                  isShowing ? "bg-white border-2 border-gold shadow-card" : "bg-navy text-navy border-2 border-navy active:scale-95"
                } ${c.matched ? "opacity-60" : ""}`}
              >
                {isShowing ? c.icon : "?"}
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
