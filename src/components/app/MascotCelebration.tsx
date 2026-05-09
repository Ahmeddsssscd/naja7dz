"use client";

/**
 * Fennec mascot popup that celebrates perfect quizzes / 3-star game wins.
 *
 * Drop into any client component, wire `<MascotCelebration trigger={done && score===total} />`
 * and it will pop in once with confetti and an Algerian-style compliment, then
 * auto-dismiss after 3.5s. Works in FR + AR.
 */

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

const PHRASES_FR = [
  "Bravo ya batal !",
  "Tu es un champion !",
  "Excellent ! Continue comme ça !",
  "Wallah tu es le meilleur !",
  "Khaye, tu as tout déchiré !",
  "Mashallah, super travail !",
  "Mabrouk, tu es un crack !",
  "Tu m'épates aujourd'hui !",
];

const PHRASES_AR = [
  "أحسنت يا بطل!",
  "أنت بطل!",
  "ممتاز! واصل!",
  "والله أنت الأفضل!",
  "ما شاء الله، عمل رائع!",
  "مبروك يا بطل!",
  "أبهرتني اليوم!",
];

interface Props {
  /** When this becomes true, the mascot pops in once. */
  trigger: boolean;
  /** "fr" | "ar" — picks phrase pool. */
  locale?: "fr" | "ar";
  /** Override the phrase. If omitted, picks a random one from the pool. */
  message?: string;
}

export function MascotCelebration({ trigger, locale = "fr", message }: Props) {
  const [show, setShow] = useState(false);
  const [phrase, setPhrase] = useState("");

  useEffect(() => {
    if (!trigger) return;
    const pool = locale === "ar" ? PHRASES_AR : PHRASES_FR;
    setPhrase(message ?? pool[Math.floor(Math.random() * pool.length)]);
    setShow(true);
    // Big celebration confetti
    confetti({ particleCount: 120, spread: 100, origin: { y: 0.5 }, colors: ["#D4A72C", "#0F1B33", "#FAF9F6", "#1AD18C"] });
    confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0, y: 0.7 }, colors: ["#D4A72C"] });
    confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1, y: 0.7 }, colors: ["#D4A72C"] });
    const id = setTimeout(() => setShow(false), 3500);
    return () => clearTimeout(id);
  }, [trigger, locale, message]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
      role="alert"
      aria-live="polite"
    >
      <div
        className="bg-gradient-to-br from-gold to-gold-soft rounded-3xl px-8 py-7 shadow-card-hover border-4 border-navy max-w-sm mx-5 animate-bounce"
        dir={locale === "ar" ? "rtl" : "ltr"}
      >
        <div className="text-center">
          <div className="text-7xl mb-3 inline-block animate-bounce" aria-hidden>🦊</div>
          <p className="text-2xl md:text-3xl font-bold text-navy leading-tight">{phrase}</p>
        </div>
      </div>
    </div>
  );
}
