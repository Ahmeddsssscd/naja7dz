"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";

interface Surah {
  number: number;
  name_ar: string;
  name_translit: string;
  name_fr: string | null;
  ayah_count: number;
  revelation_place: string | null;
}

interface Progress {
  surah_number: number;
  verses_memorized: number;
}

export function QuranTracker({
  surahs,
  progress: initialProgress,
  childId,
}: {
  surahs: Surah[];
  progress: Progress[];
  childId: string | null;
}) {
  const router = useRouter();
  const [progressMap, setProgressMap] = useState<Map<number, number>>(
    () => new Map(initialProgress.map((p) => [p.surah_number, p.verses_memorized])),
  );

  const totalMemorized = Array.from(progressMap.values()).reduce((s, v) => s + v, 0);
  const totalSurahsStarted = progressMap.size;

  const togglePartial = async (surah: Surah) => {
    if (!childId) {
      toast.error("Profil enfant manquant");
      return;
    }
    const current = progressMap.get(surah.number) ?? 0;
    let next: number;
    if (current === 0) next = Math.ceil(surah.ayah_count / 2);
    else if (current < surah.ayah_count) next = surah.ayah_count;
    else next = 0;

    const newMap = new Map(progressMap);
    if (next === 0) newMap.delete(surah.number);
    else newMap.set(surah.number, next);
    setProgressMap(newMap);

    try {
      await fetch("/api/quran/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childId, surahNumber: surah.number, versesMemorized: next }),
      });
      if (next === surah.ayah_count) toast.success(`Sourate ${surah.name_translit} mémorisée 🎉`);
    } catch {
      toast.error("Erreur de sauvegarde");
    }
  };

  return (
    <div className="min-h-screen bg-cream pb-12">
      <header className="px-5 py-4 flex items-center justify-between bg-white border-b border-pale-blue">
        <button onClick={() => router.push("/petits")} className="w-10 h-10 rounded-full hover:bg-pale-blue/40 flex items-center justify-center text-navy" aria-label="Retour">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h1 className="font-bold text-navy">Mes progrès Coran</h1>
        <div className="w-10" />
      </header>

      <section className="bg-navy text-white px-5 py-6 text-center">
        <div className="text-6xl mb-2">📿</div>
        <p className="text-sm text-gold uppercase tracking-wider font-bold mb-1">Tu as appris</p>
        <div className="text-4xl font-bold mb-1">{totalMemorized} versets</div>
        <p className="text-white/70 text-sm">sur {totalSurahsStarted} sourates commencées</p>
      </section>

      <section className="px-5 py-6">
        <h2 className="text-lg font-bold text-navy mb-3">Sourates</h2>
        <p className="text-fg-soft text-sm mb-4">
          Touche une sourate pour marquer ta progression. Trois étapes : pas commencée → la moitié → mémorisée.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {surahs.map((s) => {
            const done = progressMap.get(s.number) ?? 0;
            const pct = (done / s.ayah_count) * 100;
            return (
              <button
                key={s.number}
                onClick={() => togglePartial(s)}
                className="bg-white border-2 border-pale-blue rounded-2xl p-4 text-start hover:border-gold transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-fg-soft font-mono">#{s.number}</span>
                  <span className="font-arabic text-xl text-navy" dir="rtl">{s.name_ar}</span>
                </div>
                <div className="text-fg font-semibold mb-1">{s.name_translit}</div>
                <div className="text-xs text-fg-soft mb-3">
                  {s.ayah_count} versets · {s.revelation_place === "mecca" ? "Mecque" : "Médine"}
                </div>
                <div className="h-2 bg-pale-blue rounded-full overflow-hidden">
                  <div className="h-full bg-gold transition-all" style={{ width: `${pct}%` }} />
                </div>
                <div className="text-xs text-fg-faint mt-1">{done} / {s.ayah_count}</div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
