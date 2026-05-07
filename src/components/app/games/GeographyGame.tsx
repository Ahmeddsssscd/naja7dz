"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import confetti from "canvas-confetti";

interface Wilaya {
  code: number;
  name_fr: string;
  name_ar: string;
  region_fr: string | null;
  fact_fr: string | null;
}

function pickN<T>(arr: T[], n: number): T[] {
  const a = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && a.length; i++) {
    out.push(a.splice(Math.floor(Math.random() * a.length), 1)[0]);
  }
  return out;
}

export function GeographyGame({ wilayas }: { wilayas: Wilaya[] }) {
  const router = useRouter();
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  // Initialize target + opts together so the target is GUARANTEED to be one
  // of the four options. The previous code picked target and opts from two
  // independent rolls, making round 1 unwinnable when they disagreed.
  const [{ target, opts }, setRound1] = useState<{ target: Wilaya | null; opts: Wilaya[] }>(() => {
    if (!wilayas.length) return { target: null, opts: [] };
    const t = wilayas[Math.floor(Math.random() * wilayas.length)];
    const others = pickN(wilayas.filter((w) => w.code !== t.code), 3);
    return { target: t, opts: [...others, t].sort(() => Math.random() - 0.5) };
  });

  const finished = round >= 5 && picked !== null;

  if (!target) {
    return <div className="min-h-screen bg-cream flex items-center justify-center text-fg-soft">Pas de données wilayas — applique migration 5.</div>;
  }

  const onPick = (code: number) => {
    if (picked !== null) return;
    setPicked(code);
    if (code === target.code) {
      setScore((s) => s + 1);
      toast.success("Bravo !");
    }
    setTimeout(() => {
      if (round >= 5) {
        if (score + (code === target.code ? 1 : 0) >= 4) {
          confetti({ particleCount: 80, spread: 90, colors: ["#D4A72C", "#0F1B33"] });
        }
      } else {
        const t = wilayas[Math.floor(Math.random() * wilayas.length)];
        const others = pickN(wilayas.filter((w) => w.code !== t.code), 3);
        // Update target + opts atomically so the next round always shows
        // the target as one of the answer options.
        setRound1({ target: t, opts: [...others, t].sort(() => Math.random() - 0.5) });
        setRound((r) => r + 1);
        setPicked(null);
      }
    }, 1100);
  };

  if (finished) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-5">
        <div className="text-center">
          <div className="text-6xl mb-4">🇩🇿</div>
          <h1 className="text-3xl font-bold text-navy mb-2">Tu connais l&apos;Algérie !</h1>
          <p className="text-fg-soft mb-6">Score : <strong className="text-navy">{score} / 5</strong></p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => router.push("/petits")} className="btn btn-outline flex-1">Retour</button>
            <button onClick={() => window.location.reload()} className="btn btn-primary flex-1">Rejouer</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="px-5 py-4 flex items-center justify-between">
        <button onClick={() => router.push("/petits")} className="w-10 h-10 rounded-full bg-white border border-pale-blue flex items-center justify-center text-navy" aria-label="Retour">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div className="text-sm font-bold text-navy">Q {round}/5  ·  ⭐ {score}</div>
        <div className="w-10" />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-5 gap-6">
        <div className="bg-white border-2 border-navy rounded-3xl p-6 max-w-sm text-center shadow-card">
          <div className="text-xs text-gold uppercase tracking-widest font-bold mb-2">Indice</div>
          <p className="text-navy font-medium">{target.fact_fr ?? `Région : ${target.region_fr ?? "—"}`}</p>
          {target.region_fr && (
            <div className="text-xs text-fg-soft mt-3">Région : <strong>{target.region_fr}</strong></div>
          )}
          <div className="text-xs text-fg-soft mt-1">Wilaya n° {target.code}</div>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full max-w-md">
          {opts.map((w) => {
            const isPickedHere = picked === w.code;
            const isCorrect = w.code === target.code;
            const showCorrect = picked !== null && isCorrect;
            const showWrong = picked !== null && isPickedHere && !isCorrect;
            return (
              <button
                key={w.code}
                onClick={() => onPick(w.code)}
                disabled={picked !== null}
                className={`py-4 px-3 text-base font-bold rounded-2xl border-2 transition-all ${
                  showCorrect ? "bg-green-100 border-green-500 text-green-900" :
                  showWrong ? "bg-red-100 border-red-500 text-red-900" :
                  "bg-white border-pale-blue text-navy hover:border-gold active:scale-95"
                }`}
              >
                {w.name_fr}
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
