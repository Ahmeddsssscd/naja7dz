"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import confetti from "canvas-confetti";

/**
 * Compte tes pièces — count Algerian dinar coins.
 *
 * Each round shows a small pile of coins (5, 10, 20, 50, 100, 200 DZD —
 * 500 DZD is also issued in coins). Player types the total in DZD.
 * 5 rounds, score is the number of correct totals. Hint button shows
 * a breakdown by denomination on demand.
 */

const DENOMINATIONS = [5, 10, 20, 50, 100, 200, 500] as const;
type Coin = (typeof DENOMINATIONS)[number];

const TOTAL_ROUNDS = 5;

function genPile(round: number): Coin[] {
  // Round difficulty: more coins and bigger denominations as we progress.
  const minCount = 3 + Math.floor(round / 2);
  const maxCount = 5 + round;
  const count = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
  // Limit denominations early on, expand later.
  const palette: Coin[] =
    round <= 1 ? [5, 10, 20] :
    round <= 2 ? [5, 10, 20, 50] :
    round <= 3 ? [10, 20, 50, 100] :
    [20, 50, 100, 200, 500];
  const pile: Coin[] = [];
  for (let i = 0; i < count; i++) {
    pile.push(palette[Math.floor(Math.random() * palette.length)]);
  }
  // Sort descending so the visual pile looks tidy.
  pile.sort((a, b) => b - a);
  return pile;
}

function sum(pile: Coin[]) {
  return pile.reduce((a, c) => a + c, 0);
}

function coinTone(value: Coin): string {
  switch (value) {
    case 5:   return "bg-amber-200 border-amber-400 text-amber-900";
    case 10:  return "bg-amber-300 border-amber-500 text-amber-950";
    case 20:  return "bg-yellow-300 border-yellow-500 text-yellow-950";
    case 50:  return "bg-orange-300 border-orange-500 text-orange-950";
    case 100: return "bg-zinc-200 border-zinc-400 text-zinc-900";
    case 200: return "bg-zinc-300 border-zinc-500 text-zinc-900";
    case 500: return "bg-yellow-200 border-yellow-600 text-yellow-900";
  }
}

export function CoinCounting() {
  const router = useRouter();
  const t = useTranslations("PetitsGameCoinCounting");
  const locale = useLocale();
  const isAR = locale === "ar";

  const [round, setRound] = useState(1);
  const [pile, setPile] = useState<Coin[]>(() => genPile(1));
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"none" | "good" | "bad">("none");
  const [showHint, setShowHint] = useState(false);
  const [phase, setPhase] = useState<"play" | "done">("play");

  const total = useMemo(() => sum(pile), [pile]);

  const breakdown = useMemo(() => {
    const map = new Map<Coin, number>();
    for (const c of pile) map.set(c, (map.get(c) ?? 0) + 1);
    return DENOMINATIONS.filter((d) => map.has(d)).map((d) => ({ value: d, count: map.get(d)! }));
  }, [pile]);

  const submit = () => {
    if (phase !== "play") return;
    if (input.trim() === "") return;
    const guess = parseInt(input.trim(), 10);
    if (Number.isNaN(guess)) return;
    const isCorrect = guess === total;
    if (isCorrect) {
      setScore((s) => s + 1);
      setFeedback("good");
    } else {
      setFeedback("bad");
    }
    setTimeout(() => {
      if (round >= TOTAL_ROUNDS) {
        setPhase("done");
        if (score + (isCorrect ? 1 : 0) >= 4) {
          confetti({ particleCount: 100, spread: 90, colors: ["#D4A72C", "#0F1B33"] });
        }
      } else {
        const next = round + 1;
        setRound(next);
        setPile(genPile(next));
        setInput("");
        setShowHint(false);
        setFeedback("none");
      }
    }, 900);
  };

  useEffect(() => {
    if (feedback !== "none") {
      const id = setTimeout(() => setFeedback("none"), 800);
      return () => clearTimeout(id);
    }
  }, [feedback]);

  const onRestart = () => {
    setRound(1);
    setPile(genPile(1));
    setInput("");
    setScore(0);
    setShowHint(false);
    setFeedback("none");
    setPhase("play");
  };

  if (phase === "done") {
    const passed = score >= 4;
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-5" dir={isAR ? "rtl" : "ltr"}>
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-3">{passed ? "🏆" : "🪙"}</div>
          <h1 className="text-3xl font-bold text-navy mb-1">
            {passed ? t("you_win") : t("game_over")}
          </h1>
          <p className="text-fg-soft mb-1">{t("final_score")}</p>
          <div className="text-6xl font-bold text-gold mb-1">
            {score}/{TOTAL_ROUNDS}
          </div>
          <p className="text-fg-soft mb-6">{passed ? t("well_done") : t("try_again_msg")}</p>
          <div className="flex gap-3">
            <button
              onClick={() => router.push("/petits/jeux-malins")}
              className="flex-1 bg-white border-2 border-navy text-navy rounded-2xl px-4 py-3 font-bold active:scale-95"
            >
              {t("back")}
            </button>
            <button
              onClick={onRestart}
              className="flex-1 bg-navy text-white rounded-2xl px-4 py-3 font-bold active:scale-95"
            >
              {t("restart")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const fbCls =
    feedback === "good"
      ? "ring-4 ring-green-400"
      : feedback === "bad"
      ? "ring-4 ring-red-400"
      : "";

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
        <div className="flex items-center gap-3 text-sm">
          <span className="font-bold text-navy">{t("round")} {round}/{TOTAL_ROUNDS}</span>
          <span className="font-bold text-gold">⭐ {score}</span>
        </div>
        <div className="w-10" />
      </header>

      <main className="flex-1 flex flex-col items-center px-4 py-4 gap-4">
        <div className="text-center">
          <div className="text-xs uppercase tracking-widest text-gold font-bold">{t("question")}</div>
          <div className="text-lg font-bold text-navy">{t("how_much")}</div>
        </div>

        <div className={`bg-white rounded-3xl border-4 border-navy p-4 shadow-card max-w-md w-full ${fbCls}`}>
          <div className="flex flex-wrap gap-2 justify-center">
            {pile.map((coin, i) => (
              <span
                key={i}
                className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 flex items-center justify-center font-bold ${coinTone(coin)} shadow-md`}
                aria-label={`${coin} dinar`}
              >
                <span className="text-base sm:text-lg leading-tight">{coin}</span>
                <span className="absolute -bottom-1 text-[8px] font-bold opacity-80">DZD</span>
              </span>
            ))}
          </div>
        </div>

        {showHint && (
          <div className="bg-white rounded-2xl border border-pale-blue p-3 max-w-md w-full">
            <div className="text-xs text-fg-soft mb-1">{t("hint_label")}</div>
            <div className="flex flex-wrap gap-2 text-sm font-bold text-navy">
              {breakdown.map(({ value, count }) => (
                <span key={value} className="bg-pale-blue/40 rounded-full px-3 py-1">
                  {count} × {value} DZD
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col items-center gap-3 w-full max-w-sm">
          <input
            type="number"
            inputMode="numeric"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            placeholder="?"
            className="w-44 text-center text-3xl font-bold rounded-2xl bg-white border-4 border-pale-blue focus:border-gold focus:outline-none px-3 py-3 text-navy"
          />
          <div className="text-xs text-fg-soft">DZD (دج)</div>
          <div className="flex gap-3 w-full">
            <button
              onClick={() => setShowHint((s) => !s)}
              className="flex-1 bg-white border-2 border-pale-blue text-navy rounded-2xl px-4 py-3 font-bold active:scale-95"
            >
              {showHint ? t("hide_hint") : t("show_hint")}
            </button>
            <button
              onClick={submit}
              className="flex-1 bg-navy text-white rounded-2xl px-4 py-3 font-bold active:scale-95"
            >
              {t("submit")}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
