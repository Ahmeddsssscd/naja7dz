"use client";

/**
 * Conjugaison française — drill the 30 most common verbs across 3 tenses
 * (présent, passé composé, futur simple). Pick a verb + tense, fill in the
 * 6 conjugations (je, tu, il/elle, nous, vous, ils/elles). Auto-validation
 * per pronoun. End screen shows full conjugation comparison.
 *
 * MascotCelebration on a perfect 6/6.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { useGameBack } from "./useGameBack";
import { MascotCelebration } from "@/components/app/MascotCelebration";

type Phase = "pick-verb" | "pick-tense" | "drill" | "done";
type Tense = "present" | "passe-compose" | "futur-simple";

const PRONOUNS = ["je", "tu", "il/elle", "nous", "vous", "ils/elles"] as const;
type Pronoun = typeof PRONOUNS[number];

interface Conjugation {
  je: string; tu: string; ille: string; nous: string; vous: string; ilselles: string;
}
interface VerbData {
  infinitive: string;
  conjugations: Record<Tense, Conjugation>;
}

// Helper to keep entries terse: [je, tu, il, nous, vous, ils]
const tu = (
  inf: string,
  pres: [string, string, string, string, string, string],
  passe: [string, string, string, string, string, string],
  fut: [string, string, string, string, string, string],
): VerbData => ({
  infinitive: inf,
  conjugations: {
    "present":       { je: pres[0],  tu: pres[1],  ille: pres[2],  nous: pres[3],  vous: pres[4],  ilselles: pres[5]  },
    "passe-compose": { je: passe[0], tu: passe[1], ille: passe[2], nous: passe[3], vous: passe[4], ilselles: passe[5] },
    "futur-simple":  { je: fut[0],   tu: fut[1],   ille: fut[2],   nous: fut[3],   vous: fut[4],   ilselles: fut[5]   },
  },
});

const VERBS: VerbData[] = [
  tu("être",
    ["suis","es","est","sommes","êtes","sont"],
    ["ai été","as été","a été","avons été","avez été","ont été"],
    ["serai","seras","sera","serons","serez","seront"]),
  tu("avoir",
    ["ai","as","a","avons","avez","ont"],
    ["ai eu","as eu","a eu","avons eu","avez eu","ont eu"],
    ["aurai","auras","aura","aurons","aurez","auront"]),
  tu("aller",
    ["vais","vas","va","allons","allez","vont"],
    ["suis allé","es allé","est allé","sommes allés","êtes allés","sont allés"],
    ["irai","iras","ira","irons","irez","iront"]),
  tu("faire",
    ["fais","fais","fait","faisons","faites","font"],
    ["ai fait","as fait","a fait","avons fait","avez fait","ont fait"],
    ["ferai","feras","fera","ferons","ferez","feront"]),
  tu("dire",
    ["dis","dis","dit","disons","dites","disent"],
    ["ai dit","as dit","a dit","avons dit","avez dit","ont dit"],
    ["dirai","diras","dira","dirons","direz","diront"]),
  tu("voir",
    ["vois","vois","voit","voyons","voyez","voient"],
    ["ai vu","as vu","a vu","avons vu","avez vu","ont vu"],
    ["verrai","verras","verra","verrons","verrez","verront"]),
  tu("savoir",
    ["sais","sais","sait","savons","savez","savent"],
    ["ai su","as su","a su","avons su","avez su","ont su"],
    ["saurai","sauras","saura","saurons","saurez","sauront"]),
  tu("pouvoir",
    ["peux","peux","peut","pouvons","pouvez","peuvent"],
    ["ai pu","as pu","a pu","avons pu","avez pu","ont pu"],
    ["pourrai","pourras","pourra","pourrons","pourrez","pourront"]),
  tu("vouloir",
    ["veux","veux","veut","voulons","voulez","veulent"],
    ["ai voulu","as voulu","a voulu","avons voulu","avez voulu","ont voulu"],
    ["voudrai","voudras","voudra","voudrons","voudrez","voudront"]),
  tu("devoir",
    ["dois","dois","doit","devons","devez","doivent"],
    ["ai dû","as dû","a dû","avons dû","avez dû","ont dû"],
    ["devrai","devras","devra","devrons","devrez","devront"]),
  tu("prendre",
    ["prends","prends","prend","prenons","prenez","prennent"],
    ["ai pris","as pris","a pris","avons pris","avez pris","ont pris"],
    ["prendrai","prendras","prendra","prendrons","prendrez","prendront"]),
  tu("venir",
    ["viens","viens","vient","venons","venez","viennent"],
    ["suis venu","es venu","est venu","sommes venus","êtes venus","sont venus"],
    ["viendrai","viendras","viendra","viendrons","viendrez","viendront"]),
  tu("donner",
    ["donne","donnes","donne","donnons","donnez","donnent"],
    ["ai donné","as donné","a donné","avons donné","avez donné","ont donné"],
    ["donnerai","donneras","donnera","donnerons","donnerez","donneront"]),
  tu("parler",
    ["parle","parles","parle","parlons","parlez","parlent"],
    ["ai parlé","as parlé","a parlé","avons parlé","avez parlé","ont parlé"],
    ["parlerai","parleras","parlera","parlerons","parlerez","parleront"]),
  tu("aimer",
    ["aime","aimes","aime","aimons","aimez","aiment"],
    ["ai aimé","as aimé","a aimé","avons aimé","avez aimé","ont aimé"],
    ["aimerai","aimeras","aimera","aimerons","aimerez","aimeront"]),
  tu("finir",
    ["finis","finis","finit","finissons","finissez","finissent"],
    ["ai fini","as fini","a fini","avons fini","avez fini","ont fini"],
    ["finirai","finiras","finira","finirons","finirez","finiront"]),
  tu("partir",
    ["pars","pars","part","partons","partez","partent"],
    ["suis parti","es parti","est parti","sommes partis","êtes partis","sont partis"],
    ["partirai","partiras","partira","partirons","partirez","partiront"]),
  tu("sortir",
    ["sors","sors","sort","sortons","sortez","sortent"],
    ["suis sorti","es sorti","est sorti","sommes sortis","êtes sortis","sont sortis"],
    ["sortirai","sortiras","sortira","sortirons","sortirez","sortiront"]),
  tu("mettre",
    ["mets","mets","met","mettons","mettez","mettent"],
    ["ai mis","as mis","a mis","avons mis","avez mis","ont mis"],
    ["mettrai","mettras","mettra","mettrons","mettrez","mettront"]),
  tu("comprendre",
    ["comprends","comprends","comprend","comprenons","comprenez","comprennent"],
    ["ai compris","as compris","a compris","avons compris","avez compris","ont compris"],
    ["comprendrai","comprendras","comprendra","comprendrons","comprendrez","comprendront"]),
  tu("attendre",
    ["attends","attends","attend","attendons","attendez","attendent"],
    ["ai attendu","as attendu","a attendu","avons attendu","avez attendu","ont attendu"],
    ["attendrai","attendras","attendra","attendrons","attendrez","attendront"]),
  tu("écrire",
    ["écris","écris","écrit","écrivons","écrivez","écrivent"],
    ["ai écrit","as écrit","a écrit","avons écrit","avez écrit","ont écrit"],
    ["écrirai","écriras","écrira","écrirons","écrirez","écriront"]),
  tu("lire",
    ["lis","lis","lit","lisons","lisez","lisent"],
    ["ai lu","as lu","a lu","avons lu","avez lu","ont lu"],
    ["lirai","liras","lira","lirons","lirez","liront"]),
  tu("manger",
    ["mange","manges","mange","mangeons","mangez","mangent"],
    ["ai mangé","as mangé","a mangé","avons mangé","avez mangé","ont mangé"],
    ["mangerai","mangeras","mangera","mangerons","mangerez","mangeront"]),
  tu("boire",
    ["bois","bois","boit","buvons","buvez","boivent"],
    ["ai bu","as bu","a bu","avons bu","avez bu","ont bu"],
    ["boirai","boiras","boira","boirons","boirez","boiront"]),
  tu("jouer",
    ["joue","joues","joue","jouons","jouez","jouent"],
    ["ai joué","as joué","a joué","avons joué","avez joué","ont joué"],
    ["jouerai","joueras","jouera","jouerons","jouerez","joueront"]),
  tu("regarder",
    ["regarde","regardes","regarde","regardons","regardez","regardent"],
    ["ai regardé","as regardé","a regardé","avons regardé","avez regardé","ont regardé"],
    ["regarderai","regarderas","regardera","regarderons","regarderez","regarderont"]),
  tu("penser",
    ["pense","penses","pense","pensons","pensez","pensent"],
    ["ai pensé","as pensé","a pensé","avons pensé","avez pensé","ont pensé"],
    ["penserai","penseras","pensera","penserons","penserez","penseront"]),
  tu("trouver",
    ["trouve","trouves","trouve","trouvons","trouvez","trouvent"],
    ["ai trouvé","as trouvé","a trouvé","avons trouvé","avez trouvé","ont trouvé"],
    ["trouverai","trouveras","trouvera","trouverons","trouverez","trouveront"]),
  tu("arriver",
    ["arrive","arrives","arrive","arrivons","arrivez","arrivent"],
    ["suis arrivé","es arrivé","est arrivé","sommes arrivés","êtes arrivés","sont arrivés"],
    ["arriverai","arriveras","arrivera","arriverons","arriverez","arriveront"]),
];

const TENSE_META: Record<Tense, { label: string; emoji: string }> = {
  "present":       { label: "Présent",       emoji: "⏱" },
  "passe-compose": { label: "Passé composé", emoji: "🕰" },
  "futur-simple":  { label: "Futur simple",  emoji: "🚀" },
};

const STORAGE_KEY = "najah:conjugaison:best";

interface BestRecord { [verbAndTense: string]: number }

/** Normalize for comparison: lowercase, strip leading articles, collapse spaces.
 * We DO accept missing accents (é vs e, è vs e) because typing accents on
 * mobile is hard. */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip combining diacritics
    .replace(/\s+/g, " ")
    .trim();
}

function getConjValue(c: Conjugation, p: Pronoun): string {
  switch (p) {
    case "je":         return c.je;
    case "tu":         return c.tu;
    case "il/elle":    return c.ille;
    case "nous":       return c.nous;
    case "vous":       return c.vous;
    case "ils/elles":  return c.ilselles;
  }
}

/** je → j' before vowel/h. */
function pronounDisplay(p: Pronoun, value: string): string {
  if (p === "je") {
    const first = value.trim().charAt(0).toLowerCase();
    if ("aeiouhâéèêëîïôûœ".includes(first)) return "j'";
  }
  return p;
}

export function ConjugaisonFR() {
  const goBack = useGameBack();
  const [phase, setPhase] = useState<Phase>("pick-verb");
  const [verbInf, setVerbInf] = useState<string>("être");
  const [tense, setTense] = useState<Tense>("present");
  const [inputs, setInputs] = useState<Record<Pronoun, string>>({
    "je": "", "tu": "", "il/elle": "", "nous": "", "vous": "", "ils/elles": "",
  });
  const [validated, setValidated] = useState<Record<Pronoun, "ok" | "ko" | null>>({
    "je": null, "tu": null, "il/elle": null, "nous": null, "vous": null, "ils/elles": null,
  });
  const [bests, setBests] = useState<BestRecord>({});
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const verb = useMemo(() => VERBS.find((v) => v.infinitive === verbInf)!, [verbInf]);
  const conj = verb.conjugations[tense];

  const score = Object.values(validated).filter((v) => v === "ok").length;
  const allValidated = Object.values(validated).every((v) => v !== null);
  const allCorrect = Object.values(validated).every((v) => v === "ok");

  useEffect(() => {
    if (typeof window === "undefined") return;
    try { setBests(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}")); }
    catch { /* ignore */ }
  }, []);

  // Move to "done" when all 6 are filled in correctly
  useEffect(() => {
    if (phase === "drill" && allValidated && allCorrect) {
      const key = `${verbInf}:${tense}`;
      const prev = bests[key] ?? 0;
      if (score > prev) {
        const next = { ...bests, [key]: score };
        setBests(next);
        try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      }
      setTimeout(() => setPhase("done"), 600);
    }
  }, [phase, allValidated, allCorrect, score, verbInf, tense, bests]);

  const onValidate = (p: Pronoun) => {
    const expected = getConjValue(conj, p);
    const ok = normalize(inputs[p]) === normalize(expected);
    setValidated((v) => ({ ...v, [p]: ok ? "ok" : "ko" }));
    if (ok) {
      // Auto-focus next input
      const idx = PRONOUNS.indexOf(p);
      const nextP = PRONOUNS[idx + 1];
      if (nextP) {
        setTimeout(() => inputRefs.current[nextP]?.focus(), 80);
      }
    }
  };

  const onSubmitAll = () => {
    const next: Record<Pronoun, "ok" | "ko" | null> = { "je": null, "tu": null, "il/elle": null, "nous": null, "vous": null, "ils/elles": null };
    for (const p of PRONOUNS) {
      const expected = getConjValue(conj, p);
      next[p] = normalize(inputs[p]) === normalize(expected) ? "ok" : "ko";
    }
    setValidated(next);
    const newScore = Object.values(next).filter((v) => v === "ok").length;
    const key = `${verbInf}:${tense}`;
    const prev = bests[key] ?? 0;
    if (newScore > prev) {
      const updatedBests = { ...bests, [key]: newScore };
      setBests(updatedBests);
      try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBests)); } catch { /* ignore */ }
    }
    setPhase("done");
  };

  const onRetry = (p: Pronoun) => {
    setValidated((v) => ({ ...v, [p]: null }));
    setInputs((i) => ({ ...i, [p]: "" }));
    setTimeout(() => inputRefs.current[p]?.focus(), 50);
  };

  const startDrill = () => {
    setInputs({ "je": "", "tu": "", "il/elle": "", "nous": "", "vous": "", "ils/elles": "" });
    setValidated({ "je": null, "tu": null, "il/elle": null, "nous": null, "vous": null, "ils/elles": null });
    setPhase("drill");
  };

  if (phase === "pick-verb") {
    return (
      <div className="min-h-screen bg-cream dark:bg-surface-2 flex flex-col">
        <header className="px-5 py-4 flex items-center justify-between bg-surface border-b border-line">
          <button onClick={goBack} className="w-10 h-10 rounded-full bg-surface border border-pale-blue flex items-center justify-center text-navy" aria-label="Retour">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <h1 className="text-base font-bold text-navy">Conjugaison</h1>
          <div className="w-10" />
        </header>
        <main className="flex-1 px-5 py-6 max-w-md md:max-w-2xl lg:max-w-3xl mx-auto w-full">
          <p className="text-fg-soft text-sm text-center mb-5">
            Choisis un verbe à conjuguer.
          </p>
          <div className="grid grid-cols-3 gap-2">
            {VERBS.map((v) => (
              <button
                key={v.infinitive}
                onClick={() => { setVerbInf(v.infinitive); setPhase("pick-tense"); }}
                className="bg-surface border-2 border-pale-blue rounded-xl py-3 px-2 text-sm font-bold text-navy hover:border-gold hover:scale-[1.04] active:scale-95 transition-all"
              >
                {v.infinitive}
              </button>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (phase === "pick-tense") {
    return (
      <div className="min-h-screen bg-cream dark:bg-surface-2 flex flex-col">
        <header className="px-5 py-4 flex items-center justify-between bg-surface border-b border-line">
          <button onClick={() => setPhase("pick-verb")} className="w-10 h-10 rounded-full bg-surface border border-pale-blue flex items-center justify-center text-navy" aria-label="Retour">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <h1 className="text-base font-bold text-navy">Choisis un temps</h1>
          <div className="w-10" />
        </header>
        <main className="flex-1 px-5 py-6 max-w-md md:max-w-2xl lg:max-w-3xl mx-auto w-full">
          <div className="text-center mb-6">
            <div className="text-xs uppercase font-semibold text-fg-soft">Verbe</div>
            <div className="text-3xl font-bold text-navy">{verbInf}</div>
          </div>
          <div className="flex flex-col gap-3">
            {(Object.keys(TENSE_META) as Tense[]).map((t) => {
              const meta = TENSE_META[t];
              const best = bests[`${verbInf}:${t}`] ?? 0;
              return (
                <button
                  key={t}
                  onClick={() => { setTense(t); startDrill(); }}
                  className="bg-surface border-2 border-pale-blue rounded-2xl p-5 flex items-center gap-4 hover:border-gold hover:scale-[1.02] active:scale-95 transition-all text-left"
                >
                  <span className="text-3xl">{meta.emoji}</span>
                  <div className="flex-1">
                    <div className="text-lg font-bold text-navy">{meta.label}</div>
                  </div>
                  {best > 0 && (
                    <div className="text-right">
                      <div className="text-xs text-fg-soft">Record</div>
                      <div className="text-lg font-bold text-gold">{best}/6</div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </main>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div className="min-h-screen bg-cream dark:bg-surface-2 flex flex-col">
        <MascotCelebration trigger={score === 6} locale="fr" />
        <header className="px-5 py-4 flex items-center justify-between bg-surface border-b border-line">
          <button onClick={() => setPhase("pick-verb")} className="w-10 h-10 rounded-full bg-surface border border-pale-blue flex items-center justify-center text-navy" aria-label="Retour">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <h1 className="text-base font-bold text-navy">Résultat</h1>
          <div className="w-10" />
        </header>
        <main className="flex-1 px-5 py-6 max-w-md md:max-w-2xl lg:max-w-3xl mx-auto w-full">
          <div className="text-center mb-5">
            <div className="text-5xl mb-3">{score === 6 ? "🏆" : score >= 4 ? "🌟" : "📝"}</div>
            <h2 className="text-2xl font-bold text-navy">{verbInf} <span className="text-fg-soft text-base">· {TENSE_META[tense].label}</span></h2>
            <div className="text-4xl font-bold text-gold mt-2">{score}<span className="text-xl text-fg-soft"> / 6</span></div>
          </div>

          <div className="bg-surface border-2 border-pale-blue rounded-2xl divide-y divide-pale-blue">
            {PRONOUNS.map((p) => {
              const expected = getConjValue(conj, p);
              const yours = inputs[p];
              const ok = validated[p] === "ok";
              return (
                <div key={p} className="px-4 py-3 flex items-start gap-3">
                  <div className="text-2xl">{ok ? "✅" : "❌"}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-fg-soft uppercase font-semibold">{pronounDisplay(p, expected)}</div>
                    <div className={`text-base font-bold ${ok ? "text-green-700" : "text-navy"}`}>{expected}</div>
                    {!ok && yours && (
                      <div className="text-xs text-red-600 mt-0.5">Ta réponse : <span className="line-through">{yours}</span></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={() => setPhase("pick-verb")} className="btn btn-outline flex-1">Autre verbe</button>
            <button onClick={startDrill} className="btn btn-primary flex-1">Recommencer</button>
          </div>
        </main>
      </div>
    );
  }

  // Drill phase
  return (
    <div className="min-h-screen bg-cream dark:bg-surface-2 flex flex-col">
      <header className="px-5 py-4 flex items-center justify-between bg-surface border-b border-line">
        <button onClick={() => setPhase("pick-tense")} className="w-10 h-10 rounded-full bg-surface border border-pale-blue flex items-center justify-center text-navy" aria-label="Retour">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div className="text-sm font-bold text-navy">{verbInf} · {TENSE_META[tense].label}</div>
        <div className="text-xs text-gold font-bold">{score}/6</div>
      </header>

      <main className="flex-1 px-5 py-6 max-w-md md:max-w-2xl lg:max-w-3xl mx-auto w-full">
        <p className="text-xs text-fg-soft text-center mb-4">
          Conjugue le verbe pour chaque pronom. Touche « Valider » pour vérifier.
        </p>
        <div className="flex flex-col gap-3">
          {PRONOUNS.map((p) => {
            const status = validated[p];
            const expected = getConjValue(conj, p);
            const display = pronounDisplay(p, expected);
            return (
              <div
                key={p}
                className={`bg-surface border-2 rounded-xl px-3 py-2 flex items-center gap-2 transition-all ${
                  status === "ok" ? "border-green-500 bg-green-50" :
                  status === "ko" ? "border-red-500 bg-red-50 animate-shake" :
                  "border-pale-blue"
                }`}
              >
                <div className="w-20 text-sm font-bold text-navy text-right pr-2 border-r border-pale-blue">
                  {display}
                </div>
                <input
                  ref={(el) => { inputRefs.current[p] = el; }}
                  type="text"
                  value={inputs[p]}
                  onChange={(e) => setInputs((i) => ({ ...i, [p]: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onValidate(p);
                  }}
                  disabled={status === "ok"}
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  className="flex-1 bg-transparent text-base font-semibold text-navy outline-none disabled:text-green-700"
                  placeholder="..."
                />
                {status === "ok" ? (
                  <span className="text-green-600 text-xl">✓</span>
                ) : status === "ko" ? (
                  <button
                    onClick={() => onRetry(p)}
                    className="text-xs text-red-700 underline px-1"
                  >
                    Réessayer
                  </button>
                ) : (
                  <button
                    onClick={() => onValidate(p)}
                    disabled={!inputs[p].trim()}
                    className="text-xs font-bold text-navy bg-gold rounded-lg px-2 py-1 disabled:opacity-40"
                  >
                    Valider
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={onSubmitAll}
          className="mt-6 w-full btn btn-outline"
        >
          Tout vérifier maintenant
        </button>
      </main>
    </div>
  );
}
