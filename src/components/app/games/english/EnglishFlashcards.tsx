"use client";

/**
 * Triple flashcards for English: each card flips through three faces —
 * EN → FR → AR → EN. Tap-to-flip; "🔊" plays the English form via TTS.
 *
 * 4 themed decks of 12 cards each (the lesson decks are reused via
 * englishData but trimmed to the same 12-card shape via `pickDeck`). When the
 * kid finishes a deck we show a small recap with how many cards they marked
 * "I know" (Leitner-light: unknown cards loop back through the queue once).
 */

import { useEffect, useState } from "react";
import { useGameBack } from "../useGameBack";
import { useSpeak } from "./useSpeak";
import {
  ANIMALS_LESSON, FAMILY_LESSON, SCHOOL_LESSON, FOOD_LESSON,
  type EnglishCard,
} from "./englishData";

type Phase = "pick-deck" | "study" | "done";
type Face = "en" | "fr" | "ar";

const DECKS: { id: string; name_fr: string; name_ar: string; emoji: string; cards: EnglishCard[] }[] = [
  { id: "animals", name_fr: "Animaux", name_ar: "حيوانات", emoji: "🦁", cards: ANIMALS_LESSON.cards },
  { id: "family", name_fr: "Famille", name_ar: "العائلة", emoji: "👨‍👩‍👧‍👦", cards: FAMILY_LESSON.cards },
  { id: "school", name_fr: "École", name_ar: "المدرسة", emoji: "🎒", cards: SCHOOL_LESSON.cards },
  { id: "food", name_fr: "Nourriture", name_ar: "الطعام", emoji: "🍞", cards: FOOD_LESSON.cards },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const STORAGE_KEY = "najah:english:flashcards:known";

export function EnglishFlashcards() {
  const goBack = useGameBack("/petits/anglais");
  const { speak, isSpeaking, supported } = useSpeak();

  const [phase, setPhase] = useState<Phase>("pick-deck");
  const [deckId, setDeckId] = useState<string>("animals");
  const [queue, setQueue] = useState<EnglishCard[]>([]);
  const [index, setIndex] = useState(0);
  const [face, setFace] = useState<Face>("en");
  const [knownCount, setKnownCount] = useState(0);
  const [knownTotals, setKnownTotals] = useState<Record<string, number>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}");
      setKnownTotals(saved);
    } catch { /* ignore */ }
  }, []);

  const startDeck = (id: string) => {
    const deck = DECKS.find((d) => d.id === id);
    if (!deck) return;
    setDeckId(id);
    setQueue(shuffle(deck.cards));
    setIndex(0);
    setFace("en");
    setKnownCount(0);
    setPhase("study");
  };

  const flip = () => {
    setFace((f) => (f === "en" ? "fr" : f === "fr" ? "ar" : "en"));
  };

  const onResponse = (known: boolean) => {
    const newKnown = known ? knownCount + 1 : knownCount;
    if (index + 1 >= queue.length) {
      // Done — persist totals
      const total = (knownTotals[deckId] ?? 0) + newKnown;
      const next = { ...knownTotals, [deckId]: total };
      setKnownTotals(next);
      try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      setKnownCount(newKnown);
      setPhase("done");
    } else {
      // Push unknown cards to the back so they come around again.
      if (!known) setQueue((q) => [...q, q[index]]);
      setIndex((i) => i + 1);
      setFace("en");
      setKnownCount(newKnown);
    }
  };

  if (phase === "pick-deck") {
    return (
      <div className="min-h-screen bg-cream dark:bg-surface-2 flex flex-col">
        <Header title="English Flashcards" subtitle="بطاقات الإنجليزية" emoji="🎴" onBack={goBack} />
        <main className="flex-1 px-5 py-6 max-w-md md:max-w-2xl lg:max-w-3xl mx-auto w-full">
          <p className="text-fg-soft text-sm text-center mb-1">
            Choisis un thème. Touche la carte pour voir EN → FR → AR.
          </p>
          <p className="text-fg-soft text-xs text-center mb-5 font-ar" dir="rtl">
            اختر موضوعًا. المسي البطاقة لرؤية الترجمات.
          </p>

          <div className="grid grid-cols-2 gap-3">
            {DECKS.map((d) => (
              <button
                key={d.id}
                onClick={() => startDeck(d.id)}
                className="bg-surface border-2 border-pale-blue rounded-2xl p-5 flex flex-col items-center gap-2 hover:border-gold hover:scale-[1.03] active:scale-95 transition-all"
              >
                <span className="text-4xl">{d.emoji}</span>
                <span className="font-bold text-navy text-sm text-center">{d.name_fr}</span>
                <span className="text-xs font-ar text-fg-soft" dir="rtl">{d.name_ar}</span>
                <span className="text-xs text-fg-soft">{d.cards.length} mots</span>
                {(knownTotals[d.id] ?? 0) > 0 && (
                  <span className="text-xs text-gold font-semibold">★ {knownTotals[d.id]} appris</span>
                )}
              </button>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (phase === "done") {
    const total = queue.length;
    const pct = Math.round((knownCount / total) * 100);
    return (
      <div className="min-h-screen bg-cream dark:bg-surface-2 flex items-center justify-center px-5">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">{pct >= 80 ? "🏆" : pct >= 60 ? "✨" : "📚"}</div>
          <h1 className="text-3xl font-bold text-navy mb-2">{DECKS.find((d) => d.id === deckId)?.name_fr}</h1>
          <div className="text-5xl font-bold text-gold mb-1">
            {knownCount}<span className="text-2xl text-fg-soft"> / {total}</span>
          </div>
          <div className="text-base text-fg-soft mb-6">{pct}% mots connus</div>
          <div className="flex gap-3">
            <button onClick={() => setPhase("pick-deck")} className="flex-1 py-3 rounded-2xl bg-surface border-2 border-pale-blue text-navy font-bold">
              Autre thème
            </button>
            <button onClick={() => startDeck(deckId)} className="flex-1 py-3 rounded-2xl bg-navy text-white font-bold">
              Recommencer
            </button>
          </div>
        </div>
      </div>
    );
  }

  const card = queue[index];
  const text = face === "en" ? card.en : face === "fr" ? card.fr : card.ar;
  const dir = face === "ar" ? "rtl" : "ltr";
  const langLabel = face === "en" ? "English" : face === "fr" ? "Français" : "العربية";

  return (
    <div className="min-h-screen bg-cream dark:bg-surface-2 flex flex-col">
      <Header
        title={`${index + 1}/${queue.length}`}
        subtitle={`⭐ ${knownCount}`}
        emoji={DECKS.find((d) => d.id === deckId)?.emoji ?? "🎴"}
        onBack={() => setPhase("pick-deck")}
      />

      <main className="flex-1 flex flex-col items-center justify-center px-5 gap-7">
        <button
          onClick={flip}
          className="bg-surface border-4 border-navy rounded-3xl p-8 md:p-12 min-w-[280px] min-h-[220px] flex flex-col items-center justify-center shadow-card-hover hover:scale-[1.02] active:scale-95 transition-all"
          dir={dir}
        >
          <div className="text-xs uppercase font-semibold text-fg-faint mb-2">{langLabel}</div>
          <div className="text-5xl mb-3">{card.emoji}</div>
          <div className={`text-3xl md:text-4xl font-bold text-navy ${face === "ar" ? "font-ar" : ""}`}>
            {text}
          </div>
          <div className="text-xs text-fg-soft mt-4">
            {face === "en" ? "Touche pour le français" : face === "fr" ? "Touche pour l'arabe" : "Touche pour l'anglais"}
          </div>
        </button>

        <div className="flex gap-2 items-center">
          <button
            onClick={() => speak(card.en)}
            className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl border-2 active:scale-90 transition-all ${
              isSpeaking ? "bg-gold border-gold animate-pulse" : "bg-surface border-navy"
            }`}
            aria-label="Écouter"
            disabled={!supported}
          >
            🔊
          </button>
        </div>

        <div className="flex gap-3 w-full max-w-xs">
          <button
            onClick={() => onResponse(false)}
            className="flex-1 py-3 rounded-xl bg-rose-100 text-rose-900 font-bold border-2 border-rose-300 active:scale-95"
          >
            ✗ Pas encore
          </button>
          <button
            onClick={() => onResponse(true)}
            className="flex-1 py-3 rounded-xl bg-green-100 text-green-900 font-bold border-2 border-green-300 active:scale-95"
          >
            ✓ Je le sais !
          </button>
        </div>
      </main>
    </div>
  );
}

function Header({ title, subtitle, emoji, onBack }: { title: string; subtitle: string; emoji: string; onBack: () => void }) {
  return (
    <header className="px-5 py-4 flex items-center justify-between bg-surface border-b border-line">
      <button onClick={onBack} className="w-10 h-10 rounded-full hover:bg-pale-blue/40 flex items-center justify-center text-navy" aria-label="Retour">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <div className="text-center">
        <h1 className="font-bold text-navy text-base flex items-center gap-2 justify-center">
          <span>{emoji}</span><span>{title}</span>
        </h1>
        <div className="text-xs text-fg-soft">{subtitle}</div>
      </div>
      <div className="w-10" />
    </header>
  );
}
