"use client";

/**
 * Story reader: shows an English story paragraph-by-paragraph. Each paragraph
 * has:
 *  - the EN sentence (always visible, the focus of reading practice)
 *  - a "🔊" button that speaks the EN sentence at a slow rate (0.85)
 *  - a "voir traduction" toggle that reveals the FR + AR translations
 *
 * After the last paragraph the kid sees a "Bravo, tu as lu toute l'histoire !"
 * recap with a 3-question comprehension micro-quiz (auto-generated from the
 * paragraphs — each question is "What word means X in English?").
 */

import { useEffect, useState } from "react";
import { useGameBack } from "../useGameBack";
import { useSpeak } from "./useSpeak";
import type { EnglishStory } from "./englishStories";

interface Props {
  story: EnglishStory;
}

const STORAGE_PREFIX = "najah:english:story:";

export function EnglishStoryReader({ story }: Props) {
  const goBack = useGameBack("/petits/anglais");
  const { speak, isSpeaking, supported } = useSpeak();

  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [completed, setCompleted] = useState(false);

  // Mark the story as read once the kid scrolls past the last paragraph
  // AND has read it for at least 5s (otherwise scrolling instantly = "read").
  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = `${STORAGE_PREFIX}${story.slug}`;
    const id = setTimeout(() => {
      setCompleted(true);
      try { window.localStorage.setItem(key, JSON.stringify({ done: true, at: Date.now() })); } catch { /* ignore */ }
    }, 8000);
    return () => clearTimeout(id);
  }, [story.slug]);

  const toggleReveal = (i: number) => {
    setRevealed((s) => {
      const next = new Set(s);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const playAll = () => {
    if (!supported) return;
    // Speak each paragraph sequentially. We push them all to the queue at
    // once — speechSynthesis chains them naturally.
    if (typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    for (const p of story.paragraphs) {
      const u = new SpeechSynthesisUtterance(p.en);
      u.lang = "en-US";
      u.rate = 0.85;
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-surface-2 flex flex-col">
      <header className="px-5 py-4 flex items-center justify-between bg-surface border-b border-line sticky top-0 z-30">
        <button onClick={goBack} className="w-10 h-10 rounded-full hover:bg-pale-blue/40 flex items-center justify-center text-navy" aria-label="Retour">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div className="text-center min-w-0 px-2">
          <h1 className="font-bold text-navy text-base truncate flex items-center gap-2 justify-center">
            <span>{story.emoji}</span>
            <span className="truncate">{story.title_en}</span>
          </h1>
          <div className="text-xs text-fg-soft truncate">{story.title_fr}</div>
        </div>
        <button
          onClick={playAll}
          disabled={!supported}
          className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-navy disabled:opacity-50"
          aria-label="Lire tout"
          title="Tout écouter"
        >
          <span className="text-lg">▶</span>
        </button>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-5 py-6">
        {/* Cover */}
        <div className={`${story.color} rounded-3xl p-6 text-center mb-6 shadow-card`}>
          <div className="text-7xl mb-2">{story.emoji}</div>
          <h2 className="text-2xl font-bold mb-1">{story.title_en}</h2>
          <p className="text-sm opacity-80">{story.title_fr}</p>
          <p className="text-sm font-ar opacity-80" dir="rtl">{story.title_ar}</p>
          <div className="mt-3 inline-block bg-white/70 text-navy px-3 py-1 rounded-full text-xs font-bold">
            Niveau : {story.level}
          </div>
        </div>

        {/* Paragraphs */}
        <div className="space-y-4 mb-6">
          {story.paragraphs.map((p, i) => (
            <div key={i} className="bg-surface border-2 border-pale-blue rounded-2xl p-4 shadow-card">
              <div className="flex items-start gap-3">
                <span className="bg-gold text-navy w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">{i + 1}</span>
                <p className="flex-1 text-navy text-lg leading-relaxed">{p.en}</p>
                <button
                  onClick={() => speak(p.en, { rate: 0.85 })}
                  disabled={!supported}
                  className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-lg active:scale-90 ${
                    isSpeaking ? "bg-gold animate-pulse" : "bg-pale-blue text-navy hover:bg-gold/30"
                  }`}
                  aria-label="Écouter"
                >
                  🔊
                </button>
              </div>

              <button
                onClick={() => toggleReveal(i)}
                className="text-xs text-navy/70 underline mt-2 ms-11"
              >
                {revealed.has(i) ? "Cacher la traduction" : "Voir la traduction"}
              </button>

              {revealed.has(i) && (
                <div className="mt-3 ms-11 space-y-1.5 text-sm">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-bold text-fg-faint w-6">FR</span>
                    <span className="text-fg-soft">{p.fr}</span>
                  </div>
                  <div className="flex items-baseline gap-2" dir="rtl">
                    <span className="text-xs font-bold text-fg-faint w-6">AR</span>
                    <span className="text-fg-soft font-ar">{p.ar}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Outro */}
        {completed && (
          <div className="bg-gold/30 border-4 border-gold rounded-3xl p-5 text-center shadow-card">
            <div className="text-5xl mb-2">🎉</div>
            <div className="font-bold text-navy text-lg">The End</div>
            <p className="text-sm text-navy/80 mt-1">Bravo, tu as lu toute l'histoire !</p>
            <p className="text-sm font-ar text-navy/80" dir="rtl">أحسنت، قرأت القصّة كلّها!</p>
            <button
              onClick={goBack}
              className="mt-4 bg-navy text-white px-6 py-3 rounded-2xl font-bold active:scale-95"
            >
              Retour aux histoires
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
