"use client";

/**
 * Horloge vivante — drag the hour and minute hands to set a target time.
 *
 * On each round we generate a target like "3:30" or "9:15" or "6:45" and
 * the kid has to rotate the two hands until the displayed time matches.
 * Pointer/touch events on the SVG hands snap to whole hours / 5-min
 * minute increments. We accept ±5° tolerance so kids don't have to be
 * pixel perfect.
 *
 * Difficulty:
 *   - Facile: o'clock only (3:00, 7:00…) — minute hand on 12.
 *   - Moyen:  +half hours (3:30, 4:30…)
 *   - Difficile: +quarters and 5-min increments
 *
 * 8 rounds. Stars on score.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { useGameBack } from "./useGameBack";
import { MascotCelebration } from "@/components/app/MascotCelebration";
import confetti from "canvas-confetti";

type Level = "facile" | "moyen" | "difficile";

interface Target {
  hour: number;   // 1-12
  minute: number; // 0-55, multiples of 5
}

function pick(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildTarget(lv: Level): Target {
  const hour = pick(1, 12);
  if (lv === "facile") return { hour, minute: 0 };
  if (lv === "moyen") return { hour, minute: Math.random() < 0.5 ? 0 : 30 };
  // difficile — any 5-min mark
  const minute = pick(0, 11) * 5;
  return { hour, minute };
}

function timeLabel(t: Target, locale: string) {
  const hh = String(t.hour).padStart(2, "0");
  const mm = String(t.minute).padStart(2, "0");
  if (locale === "ar") {
    if (t.minute === 0) return `${hh}:00`;
    return `${hh}:${mm}`;
  }
  return `${hh}h${mm === "00" ? "00" : mm}`;
}

const STORAGE_PREFIX = "najah:horloge:best";
const TOTAL = 8;

export function HorlogeVivante() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const goBack = useGameBack();

  const [level, setLevel] = useState<Level>("facile");
  const [target, setTarget] = useState<Target>(() => buildTarget("facile"));
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [best, setBest] = useState<Record<Level, number>>({ facile: 0, moyen: 0, difficile: 0 });

  // Hand positions in DEGREES (0 = up / 12-o'clock, clockwise positive).
  // Hour hand: 0..360, increments of 30 per snap (12 positions).
  // Minute hand: 0..360, increments of 6 per snap (60 positions / 5-min snap = 30°).
  const [hourDeg, setHourDeg] = useState(0);
  const [minuteDeg, setMinuteDeg] = useState(0);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const dragging = useRef<"hour" | "minute" | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setBest({
      facile: Number(window.localStorage.getItem(`${STORAGE_PREFIX}:facile`)) || 0,
      moyen: Number(window.localStorage.getItem(`${STORAGE_PREFIX}:moyen`)) || 0,
      difficile: Number(window.localStorage.getItem(`${STORAGE_PREFIX}:difficile`)) || 0,
    });
  }, []);

  const restart = (lv?: Level) => {
    const ll = lv ?? level;
    setLevel(ll);
    setTarget(buildTarget(ll));
    setRound(0); setScore(0); setDone(false); setSubmitted(false);
    setHourDeg(0); setMinuteDeg(0);
  };

  const validate = () => {
    setSubmitted(true);
    // Snap to nearest 30° for hours, nearest 30° for minutes
    const targetHourDeg = (target.hour % 12) * 30 + (target.minute / 60) * 30;
    const targetMinuteDeg = (target.minute / 5) * 30;
    const dh = Math.abs(((hourDeg - targetHourDeg) % 360 + 540) % 360 - 180);
    const dm = Math.abs(((minuteDeg - targetMinuteDeg) % 360 + 540) % 360 - 180);
    const correct = dh < 18 && dm < 10; // ±18° hour, ±10° minute
    if (correct) {
      setScore((s) => s + 1);
      try { confetti({ particleCount: 25, spread: 50, origin: { y: 0.6 } }); } catch { /* ignore */ }
    }
    window.setTimeout(() => {
      setSubmitted(false);
      if (round + 1 >= TOTAL) {
        setDone(true);
      } else {
        setRound((r) => r + 1);
        setTarget(buildTarget(level));
        setHourDeg(0); setMinuteDeg(0);
      }
    }, 1100);
  };

  useEffect(() => {
    if (!done) return;
    if (score > best[level]) {
      setBest((b) => ({ ...b, [level]: score }));
      try { window.localStorage.setItem(`${STORAGE_PREFIX}:${level}`, String(score)); } catch { /* ignore */ }
    }
    if (score === TOTAL) {
      try { confetti({ particleCount: 140, spread: 110, colors: ["#D4A72C", "#0F1B33", "#1AD18C"] }); } catch { /* ignore */ }
    }
  }, [done]); // eslint-disable-line react-hooks/exhaustive-deps

  // Pointer-event hand dragging: convert client coords to angle around SVG center.
  const handlePointerMove = (e: React.PointerEvent | PointerEvent) => {
    if (!dragging.current) return;
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e as PointerEvent).clientX - cx;
    const dy = (e as PointerEvent).clientY - cy;
    let angle = Math.atan2(dx, -dy) * (180 / Math.PI);
    if (angle < 0) angle += 360;
    if (dragging.current === "hour") {
      // snap to 30° (hours)
      const snapped = Math.round(angle / 30) * 30;
      setHourDeg(snapped % 360);
    } else {
      // snap to 30° (5-min increments)
      const snapped = Math.round(angle / 30) * 30;
      setMinuteDeg(snapped % 360);
    }
  };

  const handlePointerUp = () => { dragging.current = null; };

  useEffect(() => {
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (done) {
    const stars = score >= 7 ? 3 : score >= 5 ? 2 : 1;
    return (
      <div className="min-h-screen bg-cream dark:bg-surface-2 flex items-center justify-center px-5">
        <MascotCelebration trigger={score === TOTAL} locale={isAr ? "ar" : "fr"} />
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">{score === TOTAL ? "🏆" : score >= 5 ? "🌟" : "✨"}</div>
          <h1 className="text-3xl font-bold text-navy mb-2">{isAr ? "أحسنت !" : "Bravo !"}</h1>
          <div className="text-2xl mb-2">{"★".repeat(stars)}<span className="text-line">{"☆".repeat(3 - stars)}</span></div>
          <div className="text-5xl font-bold text-gold my-2">{score}<span className="text-2xl text-fg-soft"> / {TOTAL}</span></div>
          <div className="text-xs text-fg-soft mt-1">{LEVEL_LABEL[level][isAr ? "ar" : "fr"]} · {isAr ? "أفضل" : "Record"}: {best[level]}/{TOTAL}</div>
          <div className="flex gap-3 mt-6">
            <button onClick={goBack} className="btn btn-outline flex-1">{isAr ? "خروج" : "Quitter"}</button>
            <button onClick={() => restart()} className="btn btn-primary flex-1">{isAr ? "إعادة" : "Rejouer"}</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-surface-2 flex flex-col">
      <header className="px-5 py-4 flex items-center justify-between bg-surface border-b border-line">
        <button onClick={goBack} className="w-10 h-10 rounded-full bg-surface border border-pale-blue flex items-center justify-center text-navy" aria-label={isAr ? "رجوع" : "Retour"}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h1 className="text-base md:text-lg font-bold text-navy">
          {isAr ? "الساعة الحيّة" : "L'horloge vivante"} <span className="text-xl">⏰</span>
        </h1>
        <div className="text-xs font-bold text-fg-soft">{round + 1}/{TOTAL} · ⭐{score}</div>
      </header>

      <main className="flex-1 px-5 py-6 max-w-md md:max-w-2xl mx-auto w-full">
        {/* Level chips */}
        <div className="flex items-center gap-2 mb-4 flex-wrap justify-center">
          {(["facile", "moyen", "difficile"] as Level[]).map((lv) => (
            <button key={lv} onClick={() => restart(lv)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 ${
                level === lv ? "bg-navy text-cream border-navy" : "bg-white text-navy border-pale-blue hover:border-gold"
              }`}
            >
              {LEVEL_LABEL[lv][isAr ? "ar" : "fr"]}
            </button>
          ))}
        </div>

        {/* Target time card */}
        <div className="bg-surface border-4 border-navy rounded-3xl p-4 mb-4 text-center shadow-card mx-auto" style={{ maxWidth: 320 }}>
          <div className="text-xs uppercase tracking-wider text-gold font-bold">{isAr ? "ضع الإبر على" : "Place les aiguilles sur"}</div>
          <div className="text-5xl font-bold text-navy mt-1 tabular-nums">{timeLabel(target, locale)}</div>
        </div>

        {/* Interactive clock SVG */}
        <div className="mx-auto" style={{ maxWidth: 320 }}>
          <svg ref={svgRef} viewBox="0 0 200 200" className="w-full h-auto select-none touch-none">
            <circle cx="100" cy="100" r="90" fill="#fff" stroke="#0F1B33" strokeWidth="5" />
            {/* Hour numbers */}
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i + 1) * 30 - 90;
              const x = 100 + Math.cos(a * Math.PI / 180) * 72;
              const y = 100 + Math.sin(a * Math.PI / 180) * 72 + 6;
              return <text key={i} x={x} y={y} textAnchor="middle" fontSize="16" fontWeight="700" fill="#0F1B33">{i + 1}</text>;
            })}
            {/* Tick marks every 5 min */}
            {Array.from({ length: 60 }).map((_, i) => {
              const a = i * 6 - 90;
              const r1 = i % 5 === 0 ? 82 : 86;
              const x1 = 100 + Math.cos(a * Math.PI / 180) * r1;
              const y1 = 100 + Math.sin(a * Math.PI / 180) * r1;
              const x2 = 100 + Math.cos(a * Math.PI / 180) * 89;
              const y2 = 100 + Math.sin(a * Math.PI / 180) * 89;
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0F1B33" strokeWidth={i % 5 === 0 ? 2 : 1} />;
            })}

            {/* Hour hand — short, thick */}
            <g transform={`rotate(${hourDeg} 100 100)`}>
              <line x1="100" y1="100" x2="100" y2="50" stroke="#E11D48" strokeWidth="7" strokeLinecap="round"
                onPointerDown={(e) => { dragging.current = "hour"; (e.currentTarget as SVGElement).setPointerCapture?.(e.pointerId); }}
                style={{ cursor: "grab" }} />
              <circle cx="100" cy="50" r="9" fill="#E11D48" onPointerDown={(e) => { dragging.current = "hour"; (e.currentTarget as SVGElement).setPointerCapture?.(e.pointerId); }} style={{ cursor: "grab" }} />
            </g>

            {/* Minute hand — long, thinner */}
            <g transform={`rotate(${minuteDeg} 100 100)`}>
              <line x1="100" y1="100" x2="100" y2="25" stroke="#1F4F8F" strokeWidth="5" strokeLinecap="round"
                onPointerDown={(e) => { dragging.current = "minute"; (e.currentTarget as SVGElement).setPointerCapture?.(e.pointerId); }}
                style={{ cursor: "grab" }} />
              <circle cx="100" cy="25" r="7" fill="#1F4F8F" onPointerDown={(e) => { dragging.current = "minute"; (e.currentTarget as SVGElement).setPointerCapture?.(e.pointerId); }} style={{ cursor: "grab" }} />
            </g>

            <circle cx="100" cy="100" r="5" fill="#0F1B33" />
          </svg>

          <div className="flex items-center justify-center gap-3 mt-3 text-xs">
            <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-full bg-rose-600"></span> {isAr ? "ساعات" : "Heures"}</span>
            <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-full bg-blue-700"></span> {isAr ? "دقائق" : "Minutes"}</span>
          </div>
        </div>

        <button onClick={validate} disabled={submitted}
          className={`w-full mt-5 btn ${submitted ? "btn-outline opacity-60" : "btn-primary"}`}>
          {submitted ? (isAr ? "..." : "...") : (isAr ? "تحقق" : "Valider")}
        </button>
      </main>
    </div>
  );
}

const LEVEL_LABEL: Record<Level, { fr: string; ar: string }> = {
  facile:    { fr: "À l'heure pile", ar: "ساعات كاملة" },
  moyen:     { fr: "Demi-heures",    ar: "نصف ساعة" },
  difficile: { fr: "Toutes les 5 min", ar: "كلّ ٥ دقائق" },
};
