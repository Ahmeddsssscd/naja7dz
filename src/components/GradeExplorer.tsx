"use client";

/**
 * GradeExplorer — interactive "pick your child's level" block on the landing
 * page. Three cycle tabs (Primaire / CEM / Lycée), grade chips, and a live
 * summary of what that grade gets on the platform. Exam years (5AP, 4AM,
 * 3AS) carry a badge — that's our paying audience's #1 concern.
 */

import { useState } from "react";
import { Link } from "@/i18n/routing";

type Cycle = "primaire" | "cem" | "lycee";

interface GradeInfo {
  code: string;
  label: string;
  exam?: string; // exam badge (5AP / BEM / BAC)
}

const CYCLES: Record<Cycle, { title: string; emoji: string; grades: GradeInfo[]; gets: string[] }> = {
  primaire: {
    title: "Primaire",
    emoji: "🎒",
    grades: [
      { code: "1AP", label: "1ère année" },
      { code: "2AP", label: "2ème année" },
      { code: "3AP", label: "3ème année" },
      { code: "4AP", label: "4ème année" },
      { code: "5AP", label: "5ème année", exam: "Examen 5AP" },
    ],
    gets: [
      "Univers des petits : 45+ jeux éducatifs",
      "Lecture guidée, Coran et calligraphie",
      "Maths et langues en s'amusant",
      "Suivi parental jour par jour",
    ],
  },
  cem: {
    title: "Collège (CEM)",
    emoji: "📗",
    grades: [
      { code: "1AM", label: "1ère année" },
      { code: "2AM", label: "2ème année" },
      { code: "3AM", label: "3ème année" },
      { code: "4AM", label: "4ème année", exam: "BEM" },
    ],
    gets: [
      "Leçons + quiz par chapitre du programme officiel",
      "Toutes les matières : maths, physique, langues…",
      "Préparation BEM avec sujets officiels",
      "Tuteur IA disponible 24h/24",
    ],
  },
  lycee: {
    title: "Lycée",
    emoji: "🎓",
    grades: [
      { code: "1AS", label: "1ère année" },
      { code: "2AS", label: "2ème année" },
      { code: "3AS", label: "Terminale", exam: "BAC" },
    ],
    gets: [
      "Cours complets alignés sur le programme 3AS",
      "Annales BAC : sujets et corrections officiels",
      "Examens blancs chronométrés",
      "Orientation universitaire après le BAC",
    ],
  },
};

export function GradeExplorer() {
  const [cycle, setCycle] = useState<Cycle>("cem");
  const c = CYCLES[cycle];

  return (
    <section id="niveaux" className="py-20 md:py-24 bg-surface">
      <div className="container-x">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="eyebrow mb-3">Programme officiel algérien</span>
          <h2 className="text-[clamp(28px,4vw,40px)] font-bold text-fg leading-tight tracking-tight mb-3 mt-2">
            Un parcours pour chaque niveau
          </h2>
          <p className="text-fg-soft text-lg">
            De la 1ère année primaire au BAC — choisissez le niveau de votre enfant.
          </p>
        </div>

        {/* Cycle tabs */}
        <div className="flex justify-center gap-2 mb-8">
          {(Object.keys(CYCLES) as Cycle[]).map((k) => (
            <button
              key={k}
              onClick={() => setCycle(k)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                cycle === k
                  ? "bg-navy text-white shadow-card"
                  : "bg-surface-2 text-fg-soft border border-line hover:border-fg/40"
              }`}
            >
              <span className="me-1.5">{CYCLES[k].emoji}</span>
              {CYCLES[k].title}
            </button>
          ))}
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6 items-start">
          {/* Grade chips */}
          <div className="bg-surface-2 border border-line rounded-card p-6">
            <div className="text-xs font-bold text-fg-soft uppercase tracking-wider mb-4">
              Niveaux couverts
            </div>
            <div className="space-y-2">
              {c.grades.map((g) => (
                <div
                  key={g.code}
                  className="flex items-center gap-3 bg-surface border border-line rounded-xl px-4 py-3"
                >
                  <span className="w-11 h-8 rounded-lg bg-navy text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {g.code}
                  </span>
                  <span className="text-sm font-medium text-fg flex-1">{g.label}</span>
                  {g.exam && (
                    <span className="text-[11px] font-bold bg-gold/15 text-amber-800 dark:text-gold border border-gold/40 rounded-full px-2.5 py-1">
                      {g.exam}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* What this cycle gets */}
          <div className="bg-navy rounded-card p-6 md:p-7">
            <div className="text-xs font-bold text-gold uppercase tracking-wider mb-4">
              Ce que votre enfant obtient
            </div>
            <ul className="space-y-3 mb-6">
              {c.gets.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-white text-[15px] leading-snug">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-gold mt-0.5 flex-shrink-0">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/inscription" className="btn bg-gold text-navy hover:bg-gold-soft w-full">
              Commencer gratuitement →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
