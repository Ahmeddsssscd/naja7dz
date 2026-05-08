"use client";

import { useState } from "react";
import { useGameBack } from "./useGameBack";
import { toast } from "sonner";
import confetti from "canvas-confetti";

const ITEMS = [
  { name: "Pain", emoji: "🍞", price: 30 },
  { name: "Pomme", emoji: "🍎", price: 50 },
  { name: "Lait", emoji: "🥛", price: 100 },
  { name: "Fromage", emoji: "🧀", price: 150 },
  { name: "Tomate", emoji: "🍅", price: 40 },
  { name: "Olive", emoji: "🫒", price: 80 },
  { name: "Datte", emoji: "🌴", price: 200 },
  { name: "Miel", emoji: "🍯", price: 250 },
];

interface Q {
  basket: { name: string; emoji: string; price: number; qty: number }[];
  total: number;
  options: number[];
}

function genQuestion(level: number): Q {
  const itemCount = Math.min(2 + level, 4);
  const basket: Q["basket"] = [];
  const used = new Set<string>();
  for (let i = 0; i < itemCount; i++) {
    let it = ITEMS[Math.floor(Math.random() * ITEMS.length)];
    let attempt = 0;
    while (used.has(it.name) && attempt < 10) { it = ITEMS[Math.floor(Math.random() * ITEMS.length)]; attempt++; }
    used.add(it.name);
    const qty = Math.floor(Math.random() * 3) + 1;
    basket.push({ ...it, qty });
  }
  const total = basket.reduce((s, b) => s + b.price * b.qty, 0);
  const distractors = new Set<number>([total]);
  while (distractors.size < 4) {
    distractors.add(Math.max(10, total + (Math.floor(Math.random() * 100) - 50)));
  }
  return { basket, total, options: Array.from(distractors).sort(() => Math.random() - 0.5) };
}

export function CountingSouk() {
  const goBack = useGameBack("/petits");
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [q, setQ] = useState<Q>(() => genQuestion(1));
  const [picked, setPicked] = useState<number | null>(null);

  const finished = round >= 5 && picked !== null;

  const onPick = (n: number) => {
    if (picked !== null) return;
    setPicked(n);
    if (n === q.total) {
      setScore((s) => s + 1);
      toast.success("Correct !");
    }
    setTimeout(() => {
      if (round >= 5) {
        if (score + (n === q.total ? 1 : 0) >= 4) confetti({ particleCount: 80, spread: 90 });
      } else {
        setRound((r) => r + 1);
        setQ(genQuestion(round + 1));
        setPicked(null);
      }
    }, 1100);
  };

  if (finished) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-5">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-3xl font-bold text-navy mb-2">Bien joué, marchand !</h1>
          <p className="text-fg-soft mb-6">Score : <strong className="text-navy">{score} / 5</strong></p>
          <div className="flex gap-3">
            <button onClick={goBack} className="btn btn-outline flex-1">Retour</button>
            <button onClick={() => { setScore(0); setRound(1); setPicked(null); setQ(genQuestion(1)); }} className="btn btn-primary flex-1">Rejouer</button>
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
        <div className="text-sm font-bold text-navy">Q {round}/5  ·  ⭐ {score}</div>
        <div className="w-10" />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-5 gap-5 max-w-md mx-auto w-full">
        <h2 className="text-xl font-bold text-navy text-center">Combien doit payer le client ?</h2>

        <div className="bg-white border-2 border-navy rounded-3xl p-5 shadow-card w-full">
          <div className="text-xs text-gold uppercase tracking-widest font-bold mb-3">Panier</div>
          <ul className="space-y-2">
            {q.basket.map((b, i) => (
              <li key={i} className="flex items-center justify-between text-navy">
                <span className="flex items-center gap-3">
                  <span className="text-2xl">{b.emoji}</span>
                  <span>{b.qty} × {b.name}</span>
                </span>
                <span className="font-bold">{b.price * b.qty} DA</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full">
          {q.options.map((n) => {
            const isPickedHere = picked === n;
            const isCorrect = n === q.total;
            const showCorrect = picked !== null && isCorrect;
            const showWrong = picked !== null && isPickedHere && !isCorrect;
            return (
              <button
                key={n}
                onClick={() => onPick(n)}
                disabled={picked !== null}
                className={`py-4 text-xl font-bold rounded-2xl border-2 transition-all ${
                  showCorrect ? "bg-green-100 border-green-500 text-green-900" :
                  showWrong ? "bg-red-100 border-red-500 text-red-900" :
                  "bg-white border-pale-blue text-navy hover:border-gold active:scale-95"
                }`}
              >
                {n} DA
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
