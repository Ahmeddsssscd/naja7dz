'use client';

import { useState, useMemo } from 'react';
import { BAC_PAPERS, ALL_YEARS, ALL_BRANCHES, BRANCH_LABELS } from '@/data/bac-papers';
import type { BacBranch } from '@/data/bac-papers';

const SUBJECT_ORDER = [
  'mathematiques', 'physique', 'sciences_nat', 'philosophie',
  'francais', 'arabe', 'anglais', 'histoire_geo',
] as const;

function SubjectIcon({ id }: { id: string }) {
  const map: Record<string, string> = {
    mathematiques: '📐', physique: '⚗️', sciences_nat: '🌿',
    philosophie: '🧠', francais: '✒️', arabe: '📖',
    anglais: '🌍', histoire_geo: '🗺️',
  };
  return <span>{map[id] ?? '📄'}</span>;
}

export function BacFilterGrid() {
  const [year, setYear]     = useState<number>(ALL_YEARS[0]);
  const [branch, setBranch] = useState<BacBranch>(ALL_BRANCHES[0]);

  const rows = useMemo(() => {
    const filtered = BAC_PAPERS.filter(p => p.year === year && p.branch === branch);
    // Group by subject
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
        <p className="text-center text-fg-soft py-12">Aucun document disponible pour cette sélection.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rows.map(({ subject, papers }) => {
            const sujet     = papers.find(p => p.type === 'sujet');
            const correction = papers.find(p => p.type === 'correction');
            return (
              <div
                key={subject}
                className="bg-surface border border-line rounded-card p-5 hover:shadow-card-hover hover:border-transparent transition-all duration-200 flex flex-col gap-3"
              >
                <div className="flex items-center gap-2.5">
                  <SubjectIcon id={subject} />
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
                      📄 Sujet
                    </a>
                  )}
                  {correction && (
                    <a
                      href={correction.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary text-xs py-1.5 px-3 flex-1 text-center"
                    >
                      ✅ Correction
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
