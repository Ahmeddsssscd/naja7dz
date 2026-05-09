"use client";

/**
 * Dictée FR — listen-and-type dictation using Web Speech API (browser-native TTS).
 *
 * 3 difficulty levels (Facile / Moyen / Difficile). Each round: tap "Écouter"
 * (replayable up to 3 times), type the sentence, validate. Diff comparison
 * shows correct vs typed character-by-character. Best per difficulty in
 * localStorage. Locale FR only (Arabic TTS browser support is uneven).
 *
 * Fallback: if Web Speech is unavailable, show the text for 5s then hide it
 * (memory dictation).
 */

import { useEffect, useRef, useState } from "react";
import { useGameBack } from "./useGameBack";
import { MascotCelebration } from "@/components/app/MascotCelebration";

type Difficulty = "facile" | "moyen" | "difficile";
type Phase = "pick" | "round" | "result" | "done";

const SENTENCES: Record<Difficulty, string[]> = {
  facile: [
    "Le chat dort sur le lit.",
    "Maman prépare le couscous.",
    "Je vais à l'école à pied.",
    "Le soleil brille dans le ciel.",
    "Mon frère lit un beau livre.",
  ],
  moyen: [
    "Les oiseaux chantent dans le grand jardin.",
    "Hier, nous avons mangé des dattes sucrées.",
    "Le fennec court vite dans le désert chaud.",
    "Ma sœur écrit une lettre à grand-mère.",
    "L'élève apprend la table de multiplication.",
    "Le boulanger prépare du pain frais chaque matin.",
    "Nous jouons souvent au foot avec mes cousins.",
    "La mer Méditerranée est bleue et calme aujourd'hui.",
  ],
  difficile: [
    "Le concours de mathématiques aura lieu vendredi prochain à neuf heures.",
    "L'examen de philosophie demande beaucoup de réflexion et de patience.",
    "Les chercheurs étudient les anciennes ruines romaines de Tipaza avec attention.",
    "L'archéologue a découvert une mosquée magnifique cachée sous le sable du Sahara.",
    "La géographie de l'Algérie comprend des montagnes, des plaines et un vaste désert.",
  ],
};

const LEVEL_META: Record<Difficulty, { label: string; emoji: string; color: string; words: string }> = {
  facile: { label: "Facile", emoji: "🐣", color: "from-emerald-100 to-green-50", words: "3 à 5 mots" },
  moyen: { label: "Moyen", emoji: "🦊", color: "from-sky-100 to-blue-50", words: "6 à 10 mots" },
  difficile: { label: "Difficile", emoji: "🦅", color: "from-rose-100 to-pink-50", words: "12 à 15 mots" },
};

const STORAGE_KEY = "najah:dictee:best";

interface BestRecord {
  facile?: number;
  moyen?: number;
  difficile?: number;
}

function loadBest(): BestRecord {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") as BestRecord; }
  catch { return {}; }
}

function saveBest(b: BestRecord) {
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(b)); } catch { /* ignore */ }
}

/** Strip diacritics, lowercase, collapse spaces — for accuracy comparison. */
function normalize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[.,;:!?'"()«»]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Levenshtein distance — used for accuracy %. Compact O(n*m) implementation. */
function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(cur[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    prev = cur;
  }
  return prev[b.length];
}

function accuracyPct(expected: string, typed: string): number {
  const e = normalize(expected);
  const t = normalize(typed);
  if (!e.length) return 100;
  const dist = levenshtein(e, t);
  return Math.max(0, Math.round((1 - dist / Math.max(e.length, t.length)) * 100));
}

/** Word-level diff: marks each expected word as match | mismatch | missing. */
interface WordDiff { word: string; status: "match" | "wrong" | "missing"; typed?: string }

function diffWords(expected: string, typed: string): WordDiff[] {
  const ews = expected.replace(/[.,;:!?]/g, "").split(/\s+/).filter(Boolean);
  const tws = typed.replace(/[.,;:!?]/g, "").split(/\s+/).filter(Boolean);
  const out: WordDiff[] = [];
  for (let i = 0; i < ews.length; i++) {
    const e = ews[i];
    const t = tws[i];
    if (t === undefined) out.push({ word: e, status: "missing" });
    else if (normalize(e) === normalize(t)) out.push({ word: e, status: "match" });
    else out.push({ word: e, status: "wrong", typed: t });
  }
  return out;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Speak text with Web Speech API; returns true if it actually played. */
function speak(text: string): boolean {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "fr-FR";
    u.rate = 0.85;
    u.pitch = 1;
    window.speechSynthesis.speak(u);
    return true;
  } catch {
    return false;
  }
}

const MAX_PLAYS = 3;
const FALLBACK_SHOW_MS = 5000;

export function DicteeFR() {
  const goBack = useGameBack();
  const [phase, setPhase] = useState<Phase>("pick");
  const [difficulty, setDifficulty] = useState<Difficulty>("facile");
  const [queue, setQueue] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [playsLeft, setPlaysLeft] = useState(MAX_PLAYS);
  const [input, setInput] = useState("");
  const [results, setResults] = useState<{ expected: string; typed: string; pct: number }[]>([]);
  const [bests, setBests] = useState<BestRecord>({});
  const [ttsAvailable, setTtsAvailable] = useState<boolean>(true);
  const [fallbackVisible, setFallbackVisible] = useState(false);
  const fallbackTimer = useRef<number | null>(null);

  useEffect(() => {
    setBests(loadBest());
    if (typeof window !== "undefined") {
      setTtsAvailable("speechSynthesis" in window);
    }
  }, []);

  // Cleanup speech on unmount / phase change.
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (fallbackTimer.current) window.clearTimeout(fallbackTimer.current);
    };
  }, []);

  const sentence = queue[index];

  const startRound = (d: Difficulty) => {
    const pool = SENTENCES[d];
    // Take all sentences, shuffled.
    setQueue(shuffle(pool));
    setDifficulty(d);
    setIndex(0);
    setInput("");
    setResults([]);
    setPlaysLeft(MAX_PLAYS);
    setFallbackVisible(false);
    setPhase("round");
    // Auto-play first sentence after a tiny delay so the UI mounts.
    setTimeout(() => playCurrent(pool[0]), 400);
  };

  const playCurrent = (text?: string) => {
    const t = text ?? sentence;
    if (!t) return;
    if (playsLeft <= 0) return;
    const ok = speak(t);
    if (!ok) {
      // Fallback: flash the sentence for 5s.
      setTtsAvailable(false);
      setFallbackVisible(true);
      if (fallbackTimer.current) window.clearTimeout(fallbackTimer.current);
      fallbackTimer.current = window.setTimeout(() => setFallbackVisible(false), FALLBACK_SHOW_MS);
    }
    setPlaysLeft((p) => p - 1);
  };

  const onValidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sentence) return;
    const pct = accuracyPct(sentence, input);
    const newResults = [...results, { expected: sentence, typed: input, pct }];
    setResults(newResults);
    setPhase("result");
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  const nextRound = () => {
    if (index + 1 >= queue.length) {
      // All done — compute mean accuracy + persist best.
      const mean = Math.round(results.reduce((a, r) => a + r.pct, 0) / results.length);
      const prev = bests[difficulty] ?? 0;
      if (mean > prev) {
        const next = { ...bests, [difficulty]: mean };
        setBests(next);
        saveBest(next);
      }
      setPhase("done");
    } else {
      setIndex((i) => i + 1);
      setInput("");
      setPlaysLeft(MAX_PLAYS);
      setFallbackVisible(false);
      setPhase("round");
      setTimeout(() => playCurrent(queue[index + 1]), 400);
    }
  };

  // ---------- Pick difficulty ----------
  if (phase === "pick") {
    return (
      <div className="min-h-screen bg-cream flex flex-col">
        <header className="px-5 py-4 flex items-center justify-between bg-white border-b border-pale-blue">
          <button onClick={goBack} className="w-10 h-10 rounded-full bg-white border border-pale-blue flex items-center justify-center text-navy" aria-label="Retour">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <h1 className="text-base font-bold text-navy">Dictée Française</h1>
          <div className="w-10" />
        </header>

        <main className="flex-1 px-5 py-6 max-w-md mx-auto w-full">
          <div className="text-center mb-6">
            <div className="text-6xl mb-3">🎧</div>
            <p className="text-fg-soft text-sm">
              Écoute la phrase, puis écris ce que tu as entendu. Tu peux la réécouter <strong>3 fois</strong>.
            </p>
          </div>

          {!ttsAvailable && (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-3 mb-5 text-xs text-amber-900">
              ⚠️ Ton navigateur ne lit pas le son — la phrase apparaîtra à l'écran pendant 5 secondes (dictée de mémoire).
            </div>
          )}

          <div className="space-y-3">
            {(Object.keys(LEVEL_META) as Difficulty[]).map((d) => {
              const m = LEVEL_META[d];
              const best = bests[d];
              const total = SENTENCES[d].length;
              return (
                <button
                  key={d}
                  onClick={() => startRound(d)}
                  className={`w-full text-left bg-gradient-to-br ${m.color} border-2 border-pale-blue rounded-2xl p-4 hover:border-gold hover:scale-[1.02] active:scale-95 transition-all shadow-card`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-5xl shrink-0">{m.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-navy text-lg">{m.label}</div>
                      <div className="text-xs text-navy/70">{m.words} · {total} phrases</div>
                      {best !== undefined && (
                        <div className="text-xs text-gold font-bold mt-1">⭐ Meilleur : {best}%</div>
                      )}
                    </div>
                    <div className="text-2xl text-navy/40">→</div>
                  </div>
                </button>
              );
            })}
          </div>
        </main>
      </div>
    );
  }

  // ---------- Round (typing) ----------
  if (phase === "round") {
    return (
      <div className="min-h-screen bg-cream flex flex-col">
        <header className="px-5 py-4 flex items-center justify-between bg-white border-b border-pale-blue">
          <button onClick={() => { setPhase("pick"); window.speechSynthesis?.cancel(); }} className="w-10 h-10 rounded-full bg-white border border-pale-blue flex items-center justify-center text-navy" aria-label="Quitter">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div className="text-sm font-bold text-navy">{LEVEL_META[difficulty].label} · {index + 1}/{queue.length}</div>
          <div className="text-xs text-fg-soft">{LEVEL_META[difficulty].emoji}</div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-5 py-6 gap-6 max-w-xl w-full mx-auto">
          <div className="bg-white border-4 border-navy rounded-3xl p-8 w-full text-center shadow-card">
            <div className="text-7xl mb-4 inline-block animate-pulse">🎧</div>

            {fallbackVisible ? (
              <div className="text-xs uppercase font-bold text-rose-600 tracking-widest mb-3">
                Lecture impossible — Mémorise vite !
              </div>
            ) : (
              <div className="text-xs uppercase font-bold text-navy/60 tracking-widest mb-3">
                Écoute attentivement
              </div>
            )}

            {fallbackVisible && (
              <div className="text-2xl md:text-3xl font-bold text-navy bg-amber-100 border-2 border-amber-300 rounded-xl p-4 my-3">
                {sentence}
              </div>
            )}

            <button
              onClick={() => playCurrent()}
              disabled={playsLeft <= 0}
              className="bg-gold hover:bg-gold-soft text-navy font-bold px-6 py-3 rounded-xl border-2 border-navy active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              {playsLeft === MAX_PLAYS ? "Écouter" : "Réécouter"}
            </button>
            <div className="text-xs text-fg-soft mt-3 tabular-nums">
              {playsLeft > 0
                ? `${playsLeft} écoute${playsLeft > 1 ? "s" : ""} restante${playsLeft > 1 ? "s" : ""}`
                : "Plus d'écoute disponible"}
            </div>
          </div>

          <form onSubmit={onValidate} className="w-full">
            <textarea
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Écris la phrase ici…"
              rows={3}
              className="w-full text-lg md:text-xl px-4 py-3 rounded-xl border-2 border-pale-blue focus:border-gold focus:outline-none bg-white text-navy resize-none shadow-card"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-full mt-3 btn btn-primary btn-lg disabled:opacity-50"
            >
              Valider la dictée
            </button>
          </form>
        </main>
      </div>
    );
  }

  // ---------- Result of one round ----------
  if (phase === "result") {
    const last = results[results.length - 1];
    const diff = diffWords(last.expected, last.typed);
    const pct = last.pct;
    return (
      <div className="min-h-screen bg-cream flex flex-col">
        <header className="px-5 py-4 flex items-center justify-between bg-white border-b border-pale-blue">
          <button onClick={() => { setPhase("pick"); }} className="w-10 h-10 rounded-full bg-white border border-pale-blue flex items-center justify-center text-navy" aria-label="Quitter">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div className="text-sm font-bold text-navy">Phrase {index + 1}/{queue.length}</div>
          <div className="w-10" />
        </header>

        <main className="flex-1 px-5 py-6 max-w-xl mx-auto w-full">
          <div className="text-center mb-5">
            <div className="text-6xl mb-2">{pct === 100 ? "🏆" : pct >= 80 ? "✨" : pct >= 50 ? "📚" : "📖"}</div>
            <div className="text-5xl font-bold text-gold">{pct}<span className="text-2xl text-fg-soft">%</span></div>
            <div className="text-xs text-fg-soft mt-1">de précision</div>
          </div>

          <div className="bg-white border-2 border-pale-blue rounded-2xl p-5 mb-3 shadow-card">
            <div className="text-xs uppercase font-bold text-navy/70 tracking-wide mb-2">Phrase correcte</div>
            <div className="text-lg text-navy leading-relaxed flex flex-wrap gap-1.5">
              {diff.map((d, i) => (
                <span
                  key={i}
                  className={
                    d.status === "match"
                      ? "text-green-700 font-semibold"
                      : d.status === "wrong"
                        ? "text-red-700 font-semibold underline decoration-2 decoration-red-400"
                        : "text-amber-700 font-semibold underline decoration-2 decoration-amber-400 decoration-dotted"
                  }
                  title={d.status === "wrong" ? `tu as écrit : ${d.typed}` : d.status === "missing" ? "manquant" : "correct"}
                >
                  {d.word}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-cream border-2 border-pale-blue rounded-2xl p-5 mb-5">
            <div className="text-xs uppercase font-bold text-navy/70 tracking-wide mb-2">Ce que tu as écrit</div>
            <div className="text-lg text-navy/80 leading-relaxed italic">
              {last.typed || "(rien)"}
            </div>
          </div>

          <div className="text-xs text-fg-soft mb-4 flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500" /> correct</span>
            <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500" /> faux</span>
            <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-500" /> manquant</span>
          </div>

          <button onClick={nextRound} className="btn btn-primary btn-lg w-full">
            {index + 1 >= queue.length ? "Voir mon score" : "Phrase suivante →"}
          </button>
        </main>
      </div>
    );
  }

  // ---------- Final score ----------
  const mean = Math.round(results.reduce((a, r) => a + r.pct, 0) / Math.max(results.length, 1));
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-5">
      <MascotCelebration trigger={mean === 100} locale="fr" />
      <div className="text-center max-w-sm">
        <div className="text-6xl mb-4">{mean === 100 ? "🏆" : mean >= 80 ? "🌟" : mean >= 60 ? "✨" : "📝"}</div>
        <h1 className="text-2xl font-bold text-navy mb-1">Dictée {LEVEL_META[difficulty].label}</h1>
        <div className="text-5xl font-bold text-gold mb-2 mt-3">{mean}<span className="text-2xl text-fg-soft">%</span></div>
        <p className="text-fg-soft text-sm mb-1">précision moyenne</p>
        <p className="text-fg-soft text-xs mb-6">{queue.length} phrases · {results.filter((r) => r.pct === 100).length} parfaites</p>
        <div className="flex gap-3">
          <button onClick={() => setPhase("pick")} className="btn btn-outline flex-1">Autre niveau</button>
          <button onClick={() => startRound(difficulty)} className="btn btn-primary flex-1">Rejouer</button>
        </div>
      </div>
    </div>
  );
}
