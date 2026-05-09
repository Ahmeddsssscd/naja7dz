"use client";

/**
 * Vocabulaire — bilingual FR↔AR flashcards. Show a word in one language,
 * tap to flip and see the other language. "Je le savais" / "Pas encore"
 * buttons drive a leitner-style queue (unknown words come back sooner).
 *
 * 4 themed decks: Famille, Animaux, Nourriture, École. 12+ pairs each.
 */

import { useEffect, useMemo, useState } from "react";
import { useGameBack } from "./useGameBack";

type Direction = "fr-to-ar" | "ar-to-fr";
type Phase = "pick-deck" | "study" | "done";

interface Card { fr: string; ar: string }

const DECKS: Record<string, { name_fr: string; emoji: string; cards: Card[] }> = {
  famille: {
    name_fr: "La famille",
    emoji: "👨‍👩‍👧‍👦",
    cards: [
      { fr: "père", ar: "أب" },
      { fr: "mère", ar: "أمّ" },
      { fr: "frère", ar: "أخ" },
      { fr: "sœur", ar: "أخت" },
      { fr: "grand-père", ar: "جدّ" },
      { fr: "grand-mère", ar: "جدّة" },
      { fr: "oncle", ar: "عمّ" },
      { fr: "tante", ar: "عمّة" },
      { fr: "cousin", ar: "ابن العمّ" },
      { fr: "fils", ar: "ابن" },
      { fr: "fille", ar: "بنت" },
      { fr: "famille", ar: "عائلة" },
    ],
  },
  animaux: {
    name_fr: "Les animaux",
    emoji: "🦊",
    cards: [
      { fr: "chat", ar: "قطّ" },
      { fr: "chien", ar: "كلب" },
      { fr: "poisson", ar: "سمك" },
      { fr: "oiseau", ar: "طائر" },
      { fr: "lion", ar: "أسد" },
      { fr: "renard", ar: "ثعلب" },
      { fr: "fennec", ar: "فنك" },
      { fr: "chameau", ar: "جمل" },
      { fr: "cheval", ar: "حصان" },
      { fr: "mouton", ar: "خروف" },
      { fr: "vache", ar: "بقرة" },
      { fr: "tortue", ar: "سلحفاة" },
    ],
  },
  nourriture: {
    name_fr: "La nourriture",
    emoji: "🍞",
    cards: [
      { fr: "pain", ar: "خبز" },
      { fr: "eau", ar: "ماء" },
      { fr: "lait", ar: "حليب" },
      { fr: "olive", ar: "زيتون" },
      { fr: "datte", ar: "تمر" },
      { fr: "figue", ar: "تين" },
      { fr: "miel", ar: "عسل" },
      { fr: "couscous", ar: "كسكس" },
      { fr: "thé", ar: "شاي" },
      { fr: "fromage", ar: "جبن" },
      { fr: "viande", ar: "لحم" },
      { fr: "fruit", ar: "فاكهة" },
    ],
  },
  ecole: {
    name_fr: "À l'école",
    emoji: "🎒",
    cards: [
      { fr: "école", ar: "مدرسة" },
      { fr: "élève", ar: "تلميذ" },
      { fr: "professeur", ar: "أستاذ" },
      { fr: "livre", ar: "كتاب" },
      { fr: "cahier", ar: "كرّاس" },
      { fr: "stylo", ar: "قلم" },
      { fr: "tableau", ar: "سبّورة" },
      { fr: "leçon", ar: "درس" },
      { fr: "devoir", ar: "واجب" },
      { fr: "ami", ar: "صديق" },
      { fr: "table", ar: "طاولة" },
      { fr: "classe", ar: "قسم" },
    ],
  },
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const STORAGE_KEY = "najah:vocab:known";

export function Vocabulaire() {
  const goBack = useGameBack();
  const [phase, setPhase] = useState<Phase>("pick-deck");
  const [deckId, setDeckId] = useState<string>("famille");
  const [direction, setDirection] = useState<Direction>("fr-to-ar");
  const [queue, setQueue] = useState<Card[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
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
    setDeckId(id);
    setQueue(shuffle(DECKS[id].cards));
    setIndex(0);
    setFlipped(false);
    setKnownCount(0);
    setPhase("study");
  };

  const onResponse = (known: boolean) => {
    if (known) setKnownCount((k) => k + 1);
    if (index + 1 >= queue.length) {
      // Done
      const totalKnown = (knownTotals[deckId] ?? 0) + knownCount + (known ? 1 : 0);
      const next = { ...knownTotals, [deckId]: totalKnown };
      setKnownTotals(next);
      try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      setPhase("done");
    } else {
      // If not known, push the card to the end of the queue (study again).
      if (!known) setQueue((q) => [...q, q[index]]);
      setIndex((i) => i + 1);
      setFlipped(false);
    }
  };

  if (phase === "pick-deck") {
    return (
      <div className="min-h-screen bg-cream flex flex-col">
        <header className="px-5 py-4 flex items-center justify-between bg-white border-b border-pale-blue">
          <button onClick={goBack} className="w-10 h-10 rounded-full bg-white border border-pale-blue flex items-center justify-center text-navy" aria-label="Retour">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <h1 className="text-base font-bold text-navy">Vocabulaire FR ↔ AR</h1>
          <div className="w-10" />
        </header>
        <main className="flex-1 px-5 py-6 max-w-md md:max-w-2xl lg:max-w-3xl mx-auto w-full">
          <p className="text-fg-soft text-sm text-center mb-5">
            Choisis un thème. 12 cartes à apprendre.
          </p>

          <div className="bg-white border border-pale-blue rounded-2xl p-3 mb-5">
            <div className="text-xs font-semibold text-navy/70 uppercase mb-2">Direction</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setDirection("fr-to-ar")}
                className={`py-2 rounded-lg text-sm font-bold ${direction === "fr-to-ar" ? "bg-navy text-white" : "bg-pale-blue text-navy"}`}
              >
                FR → AR
              </button>
              <button
                onClick={() => setDirection("ar-to-fr")}
                className={`py-2 rounded-lg text-sm font-bold ${direction === "ar-to-fr" ? "bg-navy text-white" : "bg-pale-blue text-navy"}`}
              >
                AR → FR
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {Object.entries(DECKS).map(([id, d]) => (
              <button
                key={id}
                onClick={() => startDeck(id)}
                className="bg-white border-2 border-pale-blue rounded-2xl p-5 flex flex-col items-center gap-2 hover:border-gold hover:scale-[1.03] active:scale-95 transition-all"
              >
                <span className="text-4xl">{d.emoji}</span>
                <span className="font-bold text-navy text-sm text-center">{d.name_fr}</span>
                <span className="text-xs text-fg-soft">{d.cards.length} cartes</span>
                {(knownTotals[id] ?? 0) > 0 && (
                  <span className="text-xs text-gold font-semibold">★ {knownTotals[id]} appris</span>
                )}
              </button>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (phase === "done") {
    const total = DECKS[deckId].cards.length;
    const pct = Math.round((knownCount / total) * 100);
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-5">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">{pct >= 80 ? "🏆" : pct >= 60 ? "✨" : "📚"}</div>
          <h1 className="text-3xl font-bold text-navy mb-2">{DECKS[deckId].name_fr}</h1>
          <div className="text-5xl font-bold text-gold mb-1">{knownCount}<span className="text-2xl text-fg-soft"> / {total}</span></div>
          <div className="text-base text-fg-soft mb-6">{pct}% de mots connus</div>
          <div className="flex gap-3">
            <button onClick={() => setPhase("pick-deck")} className="btn btn-outline flex-1">Autre thème</button>
            <button onClick={() => startDeck(deckId)} className="btn btn-primary flex-1">Recommencer</button>
          </div>
        </div>
      </div>
    );
  }

  const card = queue[index];
  const front = direction === "fr-to-ar" ? card.fr : card.ar;
  const back = direction === "fr-to-ar" ? card.ar : card.fr;
  const isAr = direction === "fr-to-ar"; // back is AR
  const cardLang = flipped ? (isAr ? "ar" : "fr") : (isAr ? "fr" : "ar");

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="px-5 py-4 flex items-center justify-between bg-white border-b border-pale-blue">
        <button onClick={() => setPhase("pick-deck")} className="w-10 h-10 rounded-full bg-white border border-pale-blue flex items-center justify-center text-navy" aria-label="Quitter">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div className="text-sm font-bold text-navy">{index + 1}/{queue.length}  ·  ⭐ {knownCount}</div>
        <div className="text-xs text-fg-soft">{DECKS[deckId].emoji}</div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-5 gap-7">
        {/* Flashcard */}
        <button
          onClick={() => setFlipped((f) => !f)}
          className="bg-white border-4 border-navy rounded-3xl p-8 md:p-12 min-w-[280px] min-h-[200px] flex items-center justify-center shadow-card-hover hover:scale-[1.02] active:scale-95 transition-all"
          dir={cardLang === "ar" ? "rtl" : "ltr"}
        >
          <div className="text-center">
            <div className="text-xs uppercase font-semibold text-fg-faint mb-2">
              {flipped ? (cardLang === "ar" ? "العربية" : "Français") : (cardLang === "ar" ? "العربية" : "Français")}
            </div>
            <div className={`text-4xl md:text-5xl font-bold text-navy ${cardLang === "ar" ? "font-ar" : ""}`}>
              {flipped ? back : front}
            </div>
            {!flipped && (
              <div className="text-xs text-fg-soft mt-4">Touche pour retourner</div>
            )}
          </div>
        </button>

        {/* Action buttons — only after flip */}
        {flipped ? (
          <div className="flex gap-3 w-full max-w-xs">
            <button
              onClick={() => onResponse(false)}
              className="flex-1 py-3 px-4 rounded-xl bg-rose-100 text-rose-900 font-bold border-2 border-rose-300 hover:bg-rose-200 active:scale-95"
            >
              ✗ Pas encore
            </button>
            <button
              onClick={() => onResponse(true)}
              className="flex-1 py-3 px-4 rounded-xl bg-green-100 text-green-900 font-bold border-2 border-green-300 hover:bg-green-200 active:scale-95"
            >
              ✓ Je le sais !
            </button>
          </div>
        ) : (
          <div className="text-fg-soft text-sm">Touche la carte pour voir la traduction</div>
        )}
      </main>
    </div>
  );
}
