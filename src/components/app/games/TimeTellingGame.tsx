"use client";

import { useState } from "react";
import { useGameBack } from "./useGameBack";
import { toast } from "sonner";
import confetti from "canvas-confetti";

function newQuestion() {
  const h = Math.floor(Math.random() * 12);
  const minOpts = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  const m = minOpts[Math.floor(Math.random() * minOpts.length)];
  return { h, m };
}

function fmt(h: number, m: number) {
  return `${h === 0 ? 12 : h}:${m.toString().padStart(2, "0")}`;
}

function distractors(h: number, m: number) {
  const correct = fmt(h, m);
  const set = new Set<string>([correct]);
  while (set.size < 4) {
    const dh = (h + Math.floor(Math.random() * 4) - 2 + 12) % 12;
    const dm = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55][Math.floor(Math.random() * 12)];
    set.add(fmt(dh, dm));
  }
  return Array.from(set).sort(() => Math.random() - 0.5);
}

export function TimeTellingGame() {
  const goBack = useGameBack("/petits");
  const [q, setQ] = useState(newQuestion());
  const [opts, setOpts] = useState(distractors(q.h, q.m));
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [picked, setPicked] = useState<string | null>(null);

  const correct = fmt(q.h, q.m);
  // Clock hand angles (degrees from 12 o'clock)
  const hourAngle = (q.h % 12) * 30 + q.m * 0.5;
  const minuteAngle = q.m * 6;

  const onPick = (opt: string) => {
    if (picked) return;
    setPicked(opt);
    if (opt === correct) {
      setScore((s) => s + 1);
      toast.success("Correct ! ⏰");
    }
    setTimeout(() => {
      if (round >= 5) {
        if (score + (opt === correct ? 1 : 0) >= 4) {
          confetti({ particleCount: 80, spread: 90, colors: ["#D4A72C", "#0F1B33"] });
        }
      } else {
        const nq = newQuestion();
        setQ(nq);
        setOpts(distractors(nq.h, nq.m));
        setRound((r) => r + 1);
        setPicked(null);
      }
    }, 1000);
  };

  const finished = round >= 5 && picked !== null;

  if (finished) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-5">
        <div className="text-center">
          <div className="text-6xl mb-4">⏰</div>
          <h1 className="text-3xl font-bold text-navy mb-2">Bien joué !</h1>
          <p className="text-fg-soft mb-6">Tu as eu <strong className="text-navy">{score} / 5</strong> bonnes réponses.</p>
          <div className="flex gap-3">
            <button onClick={goBack} className="btn btn-outline flex-1">Retour</button>
            <button onClick={() => { setScore(0); setRound(1); setPicked(null); const nq = newQuestion(); setQ(nq); setOpts(distractors(nq.h, nq.m)); }} className="btn btn-primary flex-1">Rejouer</button>
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
        <div className="text-sm text-navy font-bold">Question {round} / 5  ·  ⭐ {score}</div>
        <div className="w-10" />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-5 gap-8">
        <h2 className="text-xl font-bold text-navy text-center">Quelle heure indique l&apos;horloge ?</h2>

        {/* Analog clock */}
        <div className="bg-white rounded-full w-64 h-64 border-8 border-navy shadow-card relative">
          {/* 12 hour marks */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = i * 30;
            return (
              <div
                key={i}
                className="absolute left-1/2 top-1/2 origin-bottom w-1 h-3 bg-navy"
                style={{ transform: `translate(-50%, -100%) rotate(${angle}deg) translateY(-110px)` }}
              />
            );
          })}
          {/* Hour numbers */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => {
            const angle = (n * 30 - 90) * (Math.PI / 180);
            const x = 50 + 40 * Math.cos(angle);
            const y = 50 + 40 * Math.sin(angle);
            return (
              <div
                key={n}
                className="absolute font-bold text-navy text-lg"
                style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
              >
                {n}
              </div>
            );
          })}
          {/* Hour hand */}
          <div
            className="absolute left-1/2 top-1/2 w-1.5 h-16 bg-navy origin-bottom"
            style={{ transform: `translate(-50%, -100%) rotate(${hourAngle}deg)` }}
          />
          {/* Minute hand */}
          <div
            className="absolute left-1/2 top-1/2 w-1 h-24 bg-gold origin-bottom"
            style={{ transform: `translate(-50%, -100%) rotate(${minuteAngle}deg)` }}
          />
          <div className="absolute left-1/2 top-1/2 w-3 h-3 bg-navy rounded-full -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
          {opts.map((o) => {
            const isPickedHere = picked === o;
            const isCorrect = o === correct;
            const showCorrect = picked && isCorrect;
            const showWrong = picked && isPickedHere && !isCorrect;
            return (
              <button
                key={o}
                onClick={() => onPick(o)}
                disabled={!!picked}
                className={`py-4 text-2xl font-bold rounded-2xl border-2 transition-all ${
                  showCorrect ? "bg-green-100 border-green-500 text-green-900" :
                  showWrong ? "bg-red-100 border-red-500 text-red-900" :
                  "bg-white border-pale-blue text-navy hover:border-gold active:scale-95"
                }`}
              >
                {o}
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
