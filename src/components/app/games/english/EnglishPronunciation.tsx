"use client";

/**
 * Pronunciation drill: TTS speaks an English word three times (slow → normal
 * → fast), then the kid taps "Got it" or "One more". Vocab cycles through
 * EVERY card across all 8 lessons (~110 words) so this is the "all-vocab
 * review" tile.
 *
 * Self-paced — there is no scoring beyond a streak counter (kept in
 * localStorage so the kid feels their daily streak grow).
 */

import { useEffect, useState } from "react";
import { useGameBack } from "../useGameBack";
import { useSpeak } from "./useSpeak";
import { allCards, type EnglishCard } from "./englishData";

const POOL: EnglishCard[] = allCards();
const STORAGE_KEY = "najah:english:pron:streak";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function EnglishPronunciation() {
  const goBack = useGameBack("/petits/anglais");
  const { speak, isSpeaking, supported } = useSpeak();

  const [queue, setQueue] = useState<EnglishCard[]>(() => shuffle(POOL));
  const [index, setIndex] = useState(0);
  const [played, setPlayed] = useState(0); // how many times has it been spoken this card?
  const [streak, setStreak] = useState(0);
  const [knownToday, setKnownToday] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as { count: number };
        setStreak(data.count ?? 0);
      }
    } catch { /* ignore */ }
  }, []);

  const card = queue[index];

  // Kick off TTS each time the card changes (slow first, normal next, fast last).
  useEffect(() => {
    if (!card) return;
    setPlayed(0);
    const id = setTimeout(() => {
      speak(card.en, { rate: 0.75 });
      setPlayed(1);
    }, 250);
    return () => clearTimeout(id);
  }, [card, speak]);

  const onPlayMore = () => {
    const rate = played === 1 ? 0.95 : 1.1;
    speak(card.en, { rate });
    setPlayed((p) => p + 1);
  };

  const onGotIt = () => {
    setKnownToday((k) => k + 1);
    setStreak((s) => {
      const next = s + 1;
      try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ count: next })); } catch { /* ignore */ }
      return next;
    });
    advance();
  };

  const onSkip = () => {
    advance();
  };

  const advance = () => {
    if (index + 1 >= queue.length) {
      // Re-shuffle for an endless loop.
      setQueue(shuffle(POOL));
      setIndex(0);
    } else {
      setIndex((i) => i + 1);
    }
  };

  if (!card) return null;

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="px-5 py-4 flex items-center justify-between bg-white border-b border-pale-blue">
        <button onClick={goBack} className="w-10 h-10 rounded-full hover:bg-pale-blue/40 flex items-center justify-center text-navy" aria-label="Retour">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div className="text-center">
          <h1 className="font-bold text-navy text-base">Pronunciation</h1>
          <div className="text-xs text-fg-soft font-ar" dir="rtl">النّطق</div>
        </div>
        <div className="w-10 text-end">
          <div className="text-[10px] text-fg-soft uppercase font-bold">Streak</div>
          <div className="text-base font-bold text-gold">⭐ {streak}</div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-5 gap-6">
        <div className="text-xs text-fg-soft">Mot {index + 1} / {queue.length} · Aujourd'hui : {knownToday}</div>

        <div className="bg-white border-4 border-navy rounded-3xl p-8 min-w-[260px] text-center shadow-card-hover">
          <div className="text-7xl mb-3">{card.emoji}</div>
          <div className="text-4xl font-bold text-navy mb-2">{card.en}</div>
          <div className="text-base text-fg-soft mb-1">{card.fr}</div>
          <div className="text-base font-ar text-fg-soft" dir="rtl">{card.ar}</div>
        </div>

        <button
          onClick={onPlayMore}
          disabled={!supported}
          className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl active:scale-90 transition-transform shadow-card ${
            isSpeaking ? "bg-gold animate-pulse" : "bg-navy text-white"
          }`}
          aria-label="Réécouter"
        >
          {isSpeaking ? "🔉" : "🔊"}
        </button>

        {!supported && (
          <div className="bg-amber-100 text-amber-900 rounded-xl p-3 text-xs max-w-sm">
            Audio indisponible · le mot est <strong>{card.en}</strong>
          </div>
        )}

        <div className="flex gap-3 w-full max-w-xs">
          <button
            onClick={onSkip}
            className="flex-1 py-3 rounded-2xl bg-white border-2 border-pale-blue text-navy font-bold active:scale-95"
          >
            Passer
          </button>
          <button
            onClick={onGotIt}
            className="flex-1 py-3 rounded-2xl bg-green-500 text-white font-bold active:scale-95"
          >
            ✓ Got it!
          </button>
        </div>

        <div className="text-xs text-fg-soft text-center">
          {played === 1 ? "Écoute encore une fois si tu veux" : "Encore une fois ?"}
        </div>
      </main>
    </div>
  );
}
