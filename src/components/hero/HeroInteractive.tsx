'use client';

import { useState, useEffect, useRef } from 'react';

const SUBJECTS = [
  {
    id: 'maths', abbr: 'MA', label: 'Maths', label_ar: 'الرياضيات',
    color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700',
    accent: 'text-blue-700 dark:text-blue-300',
    chip: 'bg-blue-100 dark:bg-blue-800/40 text-blue-700 dark:text-blue-300',
    badge: 'bg-blue-600 text-white',
    question: 'Résoudre : 3x² − 12 = 0', answer: 'x = ±2',
  },
  {
    id: 'arabe', abbr: 'ع', label: 'Arabe', label_ar: 'العربية',
    color: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700',
    accent: 'text-emerald-700 dark:text-emerald-300',
    chip: 'bg-emerald-100 dark:bg-emerald-800/40 text-emerald-700 dark:text-emerald-300',
    badge: 'bg-emerald-600 text-white',
    question: 'استخرج المبتدأ والخبر', answer: 'الطالبُ مجتهدٌ',
  },
  {
    id: 'francais', abbr: 'FR', label: 'Français', label_ar: 'الفرنسية',
    color: 'bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-700',
    accent: 'text-violet-700 dark:text-violet-300',
    chip: 'bg-violet-100 dark:bg-violet-800/40 text-violet-700 dark:text-violet-300',
    badge: 'bg-violet-600 text-white',
    question: 'Conjugue au passé composé', answer: 'Il a réussi son examen.',
  },
  {
    id: 'sciences', abbr: 'SC', label: 'Sciences', label_ar: 'العلوم',
    color: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700',
    accent: 'text-amber-700 dark:text-amber-300',
    chip: 'bg-amber-100 dark:bg-amber-800/40 text-amber-700 dark:text-amber-300',
    badge: 'bg-amber-600 text-white',
    question: 'Formule de la photosynthèse ?', answer: '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂',
  },
] as const;

export function HeroInteractive() {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<'in' | 'out'>('in');
  const [revealed, setRevealed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const go = (next: number) => {
    setPhase('out');
    setTimeout(() => {
      setIdx(next);
      setRevealed(false);
      setPhase('in');
    }, 260);
  };

  useEffect(() => {
    timer.current = setTimeout(() => go((idx + 1) % SUBJECTS.length), 3400);
    return () => { if (timer.current) clearTimeout(timer.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  const s = SUBJECTS[idx];

  return (
    <>
      <style>{`
        @keyframes _si { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes _so { from{opacity:1;transform:translateY(0)} to{opacity:0;transform:translateY(-10px)} }
        @keyframes _xp { from{width:0} to{width:75%} }
        @keyframes _pd { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.7)} }
        ._in  { animation: _si .3s cubic-bezier(.34,1.56,.64,1) both }
        ._out { animation: _so .26s ease-in both }
        ._xp  { animation: _xp 1.5s .4s cubic-bezier(.22,1,.36,1) both }
        ._pd  { animation: _pd 2s ease-in-out infinite }
      `}</style>

      <div aria-hidden className="bg-surface rounded-2xl p-6 shadow-card-hover border border-line max-w-md w-full mx-auto md:ms-auto select-none">

        {/* Dot nav */}
        <div className="flex items-center gap-1.5 mb-5">
          {SUBJECTS.map((subj, i) => (
            <button key={subj.id} onClick={() => { if (timer.current) clearTimeout(timer.current); go(i); }}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === idx ? 'w-6 bg-navy dark:bg-gold' : 'w-2 bg-line hover:bg-fg-soft'}`}
            />
          ))}
          <span className="ms-auto text-[11px] text-fg-faint">{idx + 1}/{SUBJECTS.length}</span>
        </div>

        {/* Subject card */}
        <div className={`rounded-xl border p-4 mb-5 ${s.color} ${phase === 'out' ? '_out' : '_in'}`}>
          <div className="flex items-center gap-2 mb-3">
            <span className={`w-8 h-8 rounded-lg text-[11px] font-bold flex items-center justify-center flex-shrink-0 ${s.badge}`}>{s.abbr}</span>
            <span className={`text-sm font-bold ${s.accent}`}>{s.label}</span>
            <span className={`ms-auto text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.chip}`}>Exercice</span>
          </div>
          <p className="text-fg text-sm font-medium mb-3 leading-snug">{s.question}</p>
          {revealed
            ? <div className={`text-sm font-semibold px-3 py-2 rounded-lg _in ${s.chip}`}>✓ {s.answer}</div>
            : <button onClick={() => setRevealed(true)} className={`text-xs font-semibold underline underline-offset-2 ${s.accent}`}>Voir la réponse →</button>
          }
        </div>

        {/* XP bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-fg-soft mb-1.5">
            <span>XP aujourd&apos;hui</span>
            <span className="font-semibold text-fg">75 / 100 XP</span>
          </div>
          <div className="h-2 bg-surface-3 rounded-full overflow-hidden">
            <div className="_xp h-full rounded-full bg-gradient-to-r from-gold to-amber-400" />
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-surface-2 border border-line rounded-btn px-3 py-1.5 text-sm">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="text-orange-500 flex-shrink-0">
              <path d="M12 2C8 8 4 10 4 15a8 8 0 0 0 16 0c0-5-4-7-8-13zm0 18a5 5 0 0 1-5-5c0-3.5 2.5-5.5 5-9 2.5 3.5 5 5.5 5 9a5 5 0 0 1-5 5z"/>
            </svg>
            <span className="font-bold text-fg">12</span>
            <span className="text-fg-soft text-xs">jours</span>
          </div>
          <div className="flex items-center gap-1.5 bg-surface-2 border border-line rounded-btn px-3 py-1.5 text-sm">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="text-gold flex-shrink-0">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span className="font-bold text-fg">3</span>
            <span className="text-fg-soft text-xs">étoiles</span>
          </div>
          <div className="ms-auto flex items-center gap-1.5">
            <span className="_pd w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
            <span className="text-[10px] text-fg-faint">En direct</span>
          </div>
        </div>
      </div>
    </>
  );
}
