'use client';

import { useState, useMemo } from 'react';
import { BAC_PAPERS, ALL_YEARS, ALL_BRANCHES, BRANCH_LABELS } from '@/data/bac-papers';
import type { BacBranch } from '@/data/bac-papers';

const SUBJECT_ORDER = [
  'mathematiques', 'physique', 'sciences_nat', 'philosophie',
  'francais', 'arabe', 'anglais', 'histoire_geo',
] as const;

const SUBJECT_BADGE: Record<string, { abbr: string; color: string }> = {
  mathematiques: { abbr: 'MA', color: 'bg-blue-600 text-white' },
  physique:      { abbr: 'PH', color: 'bg-violet-600 text-white' },
  sciences_nat:  { abbr: 'SN', color: 'bg-emerald-600 text-white' },
  philosophie:   { abbr: 'PH', color: 'bg-slate-600 text-white' },
  francais:      { abbr: 'FR', color: 'bg-rose-600 text-white' },
  arabe:         { abbr: 'ع',  color: 'bg-teal-600 text-white' },
  anglais:       { abbr: 'EN', color: 'bg-indigo-600 text-white' },
  histoire_geo:  { abbr: 'HG', color: 'bg-amber-600 text-white' },
};

export function BacFilterGrid() {
  const [year, setYear]     = useState<number>(ALL_YEARS[0]);
  const [branch, setBranch] = useState<BacBranch>(ALL_BRANCHES[0]);

  const rows = useMemo(() => {
    const filtered = BAC_PAPERS.filter(p => p.year === year && p.branch === branch);
    const bySubject: Record<string, typeof filtered> = {};
    for (const p of filtered) {
      (bySubject[p.subject] ??= []).push(p);
    }
    return SUBJECT_ORDER
      .filter(s => bySubject[s])
      .map(s => ({ subject: s, papers: bySubject[s] }));
  }, [year, branch]);

  return (
    <div>
      {/* Year tabs */}
      <div className="flex gap-2 flex-wrap mb-5">
        {ALL_YEARS.map(y => (
          <button
            key={y}
            onClick={() => setYear(y)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
              year === y
                ? 'bg-navy text-white border-navy dark:bg-gold dark:border-gold dark:text-navy'
                : 'border-line text-fg-soft hover:border-fg hover:text-fg'
            }`}
          >
            {y}
          </button>
        ))}
      </div>

      {/* Branch pills */}
      <div className="flex gap-2 flex-wrap mb-8">
        {ALL_BRANCHES.map(b => (
          <button
            key={b}
            onClick={() => setBranch(b)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
              branch === b
                ? 'bg-gold/20 border-gold/60 text-fg dark:bg-gold/15'
                : 'border-line text-fg-soft hover:border-fg-soft hover:text-fg'
            }`}
          >
            {BRANCH_LABELS[b].fr}
          </button>
        ))}
      </div>

      {/* Paper grid */}
      {rows.length === 0 ? (
        <div className="text-center py-16 border border-line rounded-card">
          <p className="text-fg font-semibold mb-1">Aucun document disponible</p>
          <p className="text-fg-soft text-sm">Sélectionne une autre filière ou année.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rows.map(({ subject, papers }) => {
            const sujet      = papers.find(p => p.type === 'sujet');
            const correction = papers.find(p => p.type === 'correction');
            const badge      = SUBJECT_BADGE[subject] ?? { abbr: '—', color: 'bg-fg-soft text-white' };
            return (
              <div
                key={subject}
                className="bg-surface border border-line rounded-card p-5 hover:shadow-card-hover hover:border-transparent transition-all duration-200 flex flex-col gap-3"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-8 h-8 rounded-md text-[11px] font-bold flex items-center justify-center flex-shrink-0 ${badge.color}`}>{badge.abbr}</span>
                  <span className="font-semibold text-fg text-sm leading-tight">
                    {sujet?.subject_fr ?? correction?.subject_fr}
                  </span>
                </div>
                <p className="text-xs text-fg-faint">{BRANCH_LABELS[branch].fr} · {year}</p>
                <div className="flex gap-2 mt-auto pt-1">
                  {sujet && (
                    <a
                      href={sujet.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline text-xs py-1.5 px-3 flex-1 text-center"
                    >
                      Sujet
                    </a>
                  )}
                  {correction && (
                    <a
                      href={correction.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary text-xs py-1.5 px-3 flex-1 text-center"
                    >
                      Correction
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-center text-xs text-fg-faint mt-8">
        Documents hébergés sur{' '}
        <a href="https://bac-algerie.net" target="_blank" rel="noopener noreferrer" className="underline hover:text-fg-soft">
          bac-algerie.net
        </a>
      </p>
    </div>
  );
}
