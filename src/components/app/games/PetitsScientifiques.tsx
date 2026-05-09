"use client";

/**
 * Petits scientifiques — 12 illustrated home experiment cards.
 *
 * Each card: difficulty stars, time, materials list, step-by-step,
 * a "pourquoi ?" explanation, then a 2-3 question quiz. "J'ai essayé"
 * marks the experiment in localStorage. MascotCelebration on 6+ tried.
 */

import { useEffect, useState } from "react";
import { useGameBack } from "./useGameBack";
import { MascotCelebration } from "@/components/app/MascotCelebration";
import confetti from "canvas-confetti";

type Phase = "list" | "detail" | "quiz" | "result";

interface QuizQ { q: string; choices: string[]; answer: number }

interface Experiment {
  id: string;
  title: string;
  emoji: string;
  /** 1-3 stars */
  difficulty: 1 | 2 | 3;
  /** minutes */
  time: number;
  category: "chimie" | "physique" | "biologie" | "astronomie";
  accent: string;
  materials: string[];
  steps: string[];
  why: string;
  quiz: QuizQ[];
}

const CATEGORY_LABELS: Record<Experiment["category"], { label: string; emoji: string; color: string }> = {
  chimie: { label: "Chimie", emoji: "🧪", color: "bg-violet-100 text-violet-900" },
  physique: { label: "Physique", emoji: "⚡", color: "bg-amber-100 text-amber-900" },
  biologie: { label: "Biologie", emoji: "🌱", color: "bg-green-100 text-green-900" },
  astronomie: { label: "Astronomie", emoji: "🔭", color: "bg-sky-100 text-sky-900" },
};

const EXPERIMENTS: Experiment[] = [
  {
    id: "vinaigre-bicarbonate",
    title: "Vinaigre + bicarbonate",
    emoji: "🧪",
    difficulty: 1,
    time: 5,
    category: "chimie",
    accent: "from-violet-100 to-purple-50",
    materials: ["Un verre", "Du vinaigre blanc", "Une cuillère de bicarbonate de soude"],
    steps: [
      "Verse un peu de vinaigre dans le verre (jusqu'à la moitié).",
      "Ajoute une cuillère de bicarbonate de soude.",
      "Observe la mousse qui pétille et déborde !",
      "Sens-le : ça sent le vinaigre mais en plus doux.",
    ],
    why: "Le vinaigre est un acide et le bicarbonate est une base. Quand on les mélange, ils réagissent et fabriquent du gaz carbonique (CO₂) — les bulles que tu vois ! C'est ce qu'on appelle une réaction acide-base.",
    quiz: [
      { q: "Quel gaz est libéré ?", choices: ["Oxygène (O₂)", "Gaz carbonique (CO₂)", "Hydrogène (H₂)"], answer: 1 },
      { q: "Le vinaigre est…", choices: ["Une base", "Un acide", "Un sel"], answer: 1 },
      { q: "Le bicarbonate est…", choices: ["Une base", "Un acide", "Un métal"], answer: 0 },
    ],
  },
  {
    id: "raisins-secs",
    title: "Danse des raisins secs",
    emoji: "🍇",
    difficulty: 1,
    time: 3,
    category: "chimie",
    accent: "from-purple-100 to-fuchsia-50",
    materials: ["Un verre d'eau gazeuse transparente", "Quelques raisins secs"],
    steps: [
      "Remplis un verre d'eau gazeuse fraîche.",
      "Laisse tomber 4 ou 5 raisins secs dedans.",
      "Attends une minute… les raisins montent et descendent comme s'ils dansaient !",
    ],
    why: "Des bulles de CO₂ se collent aux raisins secs et les soulèvent comme des petits ballons. À la surface, les bulles éclatent et les raisins redescendent. Ça recommence sans cesse !",
    quiz: [
      { q: "Pourquoi les raisins montent ?", choices: ["Ils sont chauds", "Les bulles de gaz les soulèvent", "L'eau les pousse"], answer: 1 },
      { q: "Quel gaz est dans l'eau gazeuse ?", choices: ["Oxygène", "CO₂", "Hélium"], answer: 1 },
    ],
  },
  {
    id: "oeuf-flotte",
    title: "Œuf qui flotte",
    emoji: "🥚",
    difficulty: 2,
    time: 5,
    category: "physique",
    accent: "from-amber-100 to-yellow-50",
    materials: ["Un œuf cru", "Un grand verre d'eau", "Du sel (4-5 cuillères)", "Une cuillère"],
    steps: [
      "Mets l'œuf dans un verre d'eau pure : il coule au fond.",
      "Sors l'œuf, ajoute beaucoup de sel et mélange bien.",
      "Remets l'œuf dans l'eau salée : il flotte !",
      "Astuce magique : verse délicatement de l'eau pure par-dessus, l'œuf reste suspendu au milieu.",
    ],
    why: "L'eau salée est plus dense (plus lourde pour le même volume) que l'œuf, donc l'œuf flotte. C'est pour ça que c'est plus facile de flotter dans la mer Morte ou dans la Méditerranée que dans une piscine !",
    quiz: [
      { q: "Pourquoi l'œuf flotte dans l'eau salée ?", choices: ["L'eau salée est plus dense", "L'œuf devient léger", "Le sel pousse l'œuf"], answer: 0 },
      { q: "Dans quelle mer flotte-t-on facilement ?", choices: ["Une piscine", "La mer Morte", "Une rivière"], answer: 1 },
      { q: "Comment s'appelle cette propriété ?", choices: ["La densité", "La couleur", "La chaleur"], answer: 0 },
    ],
  },
  {
    id: "lait-magique",
    title: "Lait magique",
    emoji: "🥛",
    difficulty: 2,
    time: 5,
    category: "chimie",
    accent: "from-rose-100 to-pink-50",
    materials: ["Une assiette plate", "Du lait entier", "Quelques gouttes de colorant alimentaire", "Du liquide vaisselle", "Un coton-tige"],
    steps: [
      "Verse du lait dans l'assiette pour couvrir le fond.",
      "Dépose 4-5 gouttes de colorant de couleurs différentes.",
      "Trempe le coton-tige dans le liquide vaisselle puis touche le centre.",
      "Regarde les couleurs exploser et tourbillonner !",
    ],
    why: "Le lait contient des graisses tenues ensemble par la tension superficielle (la peau invisible à la surface). Le savon brise cette tension et fait fuir les graisses dans tous les sens — c'est ça qui pousse les couleurs !",
    quiz: [
      { q: "Que casse le savon ?", choices: ["Le lait", "La tension superficielle", "Le colorant"], answer: 1 },
      { q: "Que contient le lait ?", choices: ["Du gaz", "Des graisses", "Du métal"], answer: 1 },
    ],
  },
  {
    id: "aimant-chercheur",
    title: "Aimant chercheur",
    emoji: "🧲",
    difficulty: 1,
    time: 10,
    category: "physique",
    accent: "from-blue-100 to-cyan-50",
    materials: ["Un aimant (de frigo)", "Plusieurs petits objets : pièces, cuillère en métal, agrafe, plastique, papier, bois"],
    steps: [
      "Mets tous les objets sur la table.",
      "Approche l'aimant de chaque objet, un par un.",
      "Note ceux qui sont attirés (ils sautent vers l'aimant !) et ceux qui ne le sont pas.",
      "Tu viens de classer les objets en deux familles !",
    ],
    why: "Les aimants attirent surtout le fer, le nickel et le cobalt. La plupart des cuillères et des pièces sont en acier (qui contient du fer), donc l'aimant les attire. Le plastique, le bois et l'aluminium ne sont pas attirés.",
    quiz: [
      { q: "Quel métal est attiré par un aimant ?", choices: ["L'or", "Le fer", "L'aluminium"], answer: 1 },
      { q: "Le bois est-il attiré ?", choices: ["Oui", "Non"], answer: 1 },
    ],
  },
  {
    id: "plante-couleur",
    title: "Plante qui boit en couleur",
    emoji: "🌷",
    difficulty: 2,
    time: 1440,
    category: "biologie",
    accent: "from-green-100 to-emerald-50",
    materials: ["Une fleur blanche (œillet ou marguerite)", "Un verre d'eau", "Du colorant alimentaire (rouge ou bleu)"],
    steps: [
      "Remplis un verre d'eau et ajoute beaucoup de colorant (10-15 gouttes).",
      "Coupe la tige de la fleur en biais.",
      "Mets la fleur dans le verre.",
      "Attends quelques heures (ou une nuit) et regarde : les pétales prennent la couleur !",
    ],
    why: "Les plantes boivent l'eau par leur tige grâce à de tout petits tuyaux. L'eau monte jusqu'aux pétales pour les nourrir. Comme l'eau est colorée, les pétales se colorent aussi ! C'est le même mécanisme qui amène l'eau jusqu'aux feuilles d'un arbre.",
    quiz: [
      { q: "Comment les plantes boivent ?", choices: ["Par les feuilles", "Par la tige", "Par les pétales"], answer: 1 },
      { q: "Pourquoi les pétales se colorent ?", choices: ["L'eau colorée monte jusqu'à eux", "Le colorant flotte", "Le soleil les colore"], answer: 0 },
    ],
  },
  {
    id: "volcan-sucre",
    title: "Volcan en sucre",
    emoji: "🌋",
    difficulty: 2,
    time: 10,
    category: "chimie",
    accent: "from-orange-100 to-red-50",
    materials: ["Un petit pot ou bouteille", "Du bicarbonate de soude (3 cuillères)", "Du jus de citron", "Du colorant rouge (optionnel)", "Un peu de liquide vaisselle"],
    steps: [
      "Mets le pot au milieu d'une assiette (pour récupérer la lave !).",
      "Verse le bicarbonate, quelques gouttes de vaisselle et le colorant dans le pot.",
      "Ajoute d'un coup le jus de citron.",
      "Mousse rouge qui déborde — éruption volcanique !",
    ],
    why: "Le jus de citron est acide (comme le vinaigre). Avec le bicarbonate, il libère du CO₂ qui fait mousser le tout. Le savon retient la mousse et la rend bien dense — ça ressemble à de la lave !",
    quiz: [
      { q: "Le citron est…", choices: ["Une base", "Un acide", "Du sucre"], answer: 1 },
      { q: "Quel gaz fait la mousse ?", choices: ["Oxygène", "CO₂", "Hélium"], answer: 1 },
      { q: "À quoi sert le savon ?", choices: ["Rendre la mousse dense", "Faire couler", "Sentir bon"], answer: 0 },
    ],
  },
  {
    id: "ombre-bouge",
    title: "Ombre qui bouge",
    emoji: "☀️",
    difficulty: 1,
    time: 360,
    category: "astronomie",
    accent: "from-yellow-100 to-amber-50",
    materials: ["Un bâton ou un crayon", "De la pâte à modeler (ou du sable)", "Une feuille de papier", "Une journée ensoleillée"],
    steps: [
      "Plante le bâton à la verticale au milieu d'une feuille, dehors au soleil.",
      "À 9h, marque l'ombre avec un trait.",
      "Reviens à 12h, à 15h et à 17h, marque à chaque fois.",
      "Tu as fabriqué un cadran solaire — comme ceux d'il y a 3000 ans !",
    ],
    why: "L'ombre bouge parce que la Terre tourne sur elle-même. Le matin, le soleil est à l'est, donc l'ombre pointe vers l'ouest. Le soir, c'est l'inverse. À midi, l'ombre est la plus courte parce que le soleil est le plus haut.",
    quiz: [
      { q: "Pourquoi l'ombre bouge ?", choices: ["Le soleil bouge", "La Terre tourne", "Le bâton bouge"], answer: 1 },
      { q: "Quand l'ombre est-elle la plus courte ?", choices: ["Le matin", "À midi", "Le soir"], answer: 1 },
    ],
  },
  {
    id: "glace-flotte",
    title: "Glace qui flotte",
    emoji: "🧊",
    difficulty: 1,
    time: 5,
    category: "physique",
    accent: "from-cyan-100 to-blue-50",
    materials: ["Un verre d'eau", "Un glaçon"],
    steps: [
      "Remplis le verre d'eau.",
      "Mets un glaçon dedans.",
      "Observe : le glaçon flotte, alors qu'il est solide !",
      "Marque le niveau de l'eau, attends que ça fonde, regarde le niveau ne change presque pas.",
    ],
    why: "Quand l'eau gèle, ses molécules s'organisent en cristaux qui prennent plus de place. La glace est donc moins dense que l'eau liquide — c'est pour ça qu'elle flotte. C'est rare ! La plupart des choses, quand elles gèlent, deviennent plus denses et coulent.",
    quiz: [
      { q: "Pourquoi la glace flotte ?", choices: ["Elle est plus légère que l'eau pour le même volume", "Elle est chaude", "Elle est solide"], answer: 0 },
      { q: "L'eau qui gèle prend…", choices: ["Moins de place", "Plus de place", "La même place"], answer: 1 },
    ],
  },
  {
    id: "limaille-fer",
    title: "Champ magnétique visible",
    emoji: "✨",
    difficulty: 3,
    time: 10,
    category: "physique",
    accent: "from-slate-100 to-gray-50",
    materials: ["De la limaille de fer (ou poudre de paille de fer frottée)", "Un aimant fort", "Une feuille de papier blanche"],
    steps: [
      "Pose la feuille sur l'aimant.",
      "Saupoudre doucement la limaille de fer sur la feuille.",
      "Tape légèrement sur le papier.",
      "Les particules dessinent les lignes du champ magnétique — magique !",
    ],
    why: "Un aimant n'attire pas qu'au contact : il a un champ magnétique invisible tout autour de lui. La limaille de fer s'aligne sur ces lignes invisibles et les rend visibles. Tu viens de voir ce qu'on ne voit pas !",
    quiz: [
      { q: "Que dessine la limaille ?", choices: ["Le poids de l'aimant", "Les lignes du champ magnétique", "Une carte du trésor"], answer: 1 },
      { q: "Le champ magnétique est…", choices: ["Visible à l'œil nu", "Invisible normalement", "De la lumière"], answer: 1 },
    ],
  },
  {
    id: "ballon-gonfle",
    title: "Ballon qui se gonfle tout seul",
    emoji: "🎈",
    difficulty: 2,
    time: 10,
    category: "chimie",
    accent: "from-pink-100 to-rose-50",
    materials: ["Une bouteille en plastique vide", "Du vinaigre", "Du bicarbonate de soude", "Un ballon de baudruche", "Un entonnoir"],
    steps: [
      "Verse 5 cm de vinaigre dans la bouteille.",
      "Avec l'entonnoir, mets 2 cuillères de bicarbonate dans le ballon.",
      "Enfile le ballon sur le goulot de la bouteille (sans renverser le bicarbonate).",
      "Soulève le ballon pour faire tomber la poudre dans le vinaigre — le ballon se gonfle !",
    ],
    why: "Comme avant, vinaigre + bicarbonate = CO₂. Mais cette fois, le gaz n'a pas où s'échapper : il monte dans le ballon et le gonfle, comme si tu soufflais dedans !",
    quiz: [
      { q: "Qu'est-ce qui gonfle le ballon ?", choices: ["L'air de la pièce", "Le gaz CO₂", "L'eau"], answer: 1 },
      { q: "Si tu mets plus de bicarbonate, le ballon…", choices: ["Se gonfle plus", "Se gonfle moins", "Ne change pas"], answer: 0 },
    ],
  },
  {
    id: "arc-en-ciel",
    title: "Pluie d'arc-en-ciel",
    emoji: "🌈",
    difficulty: 1,
    time: 5,
    category: "physique",
    accent: "from-fuchsia-100 to-violet-50",
    materials: ["Un vieux CD", "Une lampe de poche (ou le soleil)", "Un mur blanc"],
    steps: [
      "Tiens le CD côté brillant face à la lampe.",
      "Oriente-le pour faire rebondir la lumière sur un mur blanc.",
      "Bouge doucement : un arc-en-ciel apparaît !",
      "Tu peux aussi essayer avec le soleil par la fenêtre.",
    ],
    why: "La lumière blanche est en fait un mélange de toutes les couleurs : rouge, orange, jaune, vert, bleu, violet. Le CD a des micro-rainures qui séparent ces couleurs comme un prisme — c'est exactement comme l'arc-en-ciel après la pluie, séparé par les gouttes d'eau !",
    quiz: [
      { q: "La lumière blanche contient…", choices: ["Une seule couleur", "Toutes les couleurs", "Aucune couleur"], answer: 1 },
      { q: "L'arc-en-ciel naturel se forme grâce à…", choices: ["La fumée", "Les gouttes d'eau", "Le vent"], answer: 1 },
      { q: "Combien de couleurs principales dans un arc-en-ciel ?", choices: ["3", "5", "7"], answer: 2 },
    ],
  },
];

const STORAGE_KEY = "najah:science:tried";

interface TriedRecord {
  [id: string]: { tried: boolean; quizScore: number; date: string };
}

function loadTried(): TriedRecord {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") as TriedRecord; }
  catch { return {}; }
}

function saveTried(t: TriedRecord) {
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(t)); } catch { /* ignore */ }
}

function formatTime(min: number): string {
  if (min < 60) return `${min} min`;
  if (min < 1440) return `${Math.round(min / 60)} h`;
  return `${Math.round(min / 1440)} j`;
}

export function PetitsScientifiques() {
  const goBack = useGameBack();
  const [phase, setPhase] = useState<Phase>("list");
  const [expIdx, setExpIdx] = useState(0);
  const [filter, setFilter] = useState<Experiment["category"] | "all">("all");
  const [tried, setTried] = useState<TriedRecord>({});
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [bigCelebrate, setBigCelebrate] = useState(false);

  useEffect(() => { setTried(loadTried()); }, []);

  const exp = EXPERIMENTS[expIdx];
  const triedCount = Object.values(tried).filter((t) => t.tried).length;
  const visible = filter === "all" ? EXPERIMENTS : EXPERIMENTS.filter((e) => e.category === filter);

  const openExp = (id: string) => {
    const idx = EXPERIMENTS.findIndex((e) => e.id === id);
    if (idx >= 0) {
      setExpIdx(idx);
      setPhase("detail");
    }
  };

  const markTried = () => {
    const wasTried = tried[exp.id]?.tried ?? false;
    const next: TriedRecord = {
      ...tried,
      [exp.id]: { tried: true, quizScore: tried[exp.id]?.quizScore ?? 0, date: new Date().toISOString() },
    };
    setTried(next);
    saveTried(next);
    if (!wasTried) {
      const newCount = Object.values(next).filter((t) => t.tried).length;
      confetti({ particleCount: 60, spread: 80, colors: ["#D4A72C", "#0F1B33"] });
      if (newCount === 6) {
        setBigCelebrate(true);
        setTimeout(() => setBigCelebrate(false), 4000);
      }
    }
  };

  const startQuiz = () => {
    setQIdx(0);
    setScore(0);
    setPicked(null);
    setPhase("quiz");
  };

  const onPick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    const correct = i === exp.quiz[qIdx].answer;
    if (correct) setScore((s) => s + 1);
    setTimeout(() => {
      if (qIdx + 1 >= exp.quiz.length) {
        const finalScore = score + (correct ? 1 : 0);
        const next: TriedRecord = {
          ...tried,
          [exp.id]: { tried: tried[exp.id]?.tried ?? false, quizScore: Math.max(tried[exp.id]?.quizScore ?? 0, finalScore), date: new Date().toISOString() },
        };
        setTried(next);
        saveTried(next);
        setPhase("result");
      } else {
        setQIdx((j) => j + 1);
        setPicked(null);
      }
    }, 900);
  };

  // ---------- Detail ----------
  if (phase === "detail") {
    const cat = CATEGORY_LABELS[exp.category];
    const isTried = tried[exp.id]?.tried;
    return (
      <div className="min-h-screen bg-cream flex flex-col">
        <header className="px-5 py-4 flex items-center justify-between bg-white border-b border-pale-blue sticky top-0 z-10">
          <button onClick={() => setPhase("list")} className="w-10 h-10 rounded-full bg-white border border-pale-blue flex items-center justify-center text-navy" aria-label="Retour">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <h1 className="text-base font-bold text-navy truncate px-2">{exp.title}</h1>
          <div className="w-10" />
        </header>

        <main className="flex-1 px-5 py-6 max-w-2xl mx-auto w-full">
          <div className={`bg-gradient-to-br ${exp.accent} border-4 border-navy rounded-3xl p-6 text-center shadow-card mb-5`}>
            <div className="text-7xl mb-3">{exp.emoji}</div>
            <h2 className="text-2xl md:text-3xl font-bold text-navy mb-3">{exp.title}</h2>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className={`px-3 py-1 rounded-full font-bold ${cat.color}`}>{cat.emoji} {cat.label}</span>
              <span className="px-3 py-1 rounded-full bg-white/70 text-navy font-bold">⏱ {formatTime(exp.time)}</span>
              <span className="px-3 py-1 rounded-full bg-white/70 text-navy font-bold">
                {"⭐".repeat(exp.difficulty)}{"☆".repeat(3 - exp.difficulty)}
              </span>
            </div>
          </div>

          <section className="bg-white border-2 border-pale-blue rounded-2xl p-5 mb-4 shadow-card">
            <h3 className="text-sm uppercase font-bold text-navy/70 tracking-wide mb-3">🧰 Matériel</h3>
            <ul className="space-y-2">
              {exp.materials.map((m, i) => (
                <li key={i} className="flex items-start gap-2 text-navy">
                  <span className="text-gold mt-0.5">●</span>
                  <span className="leading-relaxed">{m}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white border-2 border-pale-blue rounded-2xl p-5 mb-4 shadow-card">
            <h3 className="text-sm uppercase font-bold text-navy/70 tracking-wide mb-3">📋 Étapes</h3>
            <ol className="space-y-3">
              {exp.steps.map((s, i) => (
                <li key={i} className="flex items-start gap-3 text-navy">
                  <span className="shrink-0 w-7 h-7 rounded-full bg-gold text-navy font-bold flex items-center justify-center text-sm">{i + 1}</span>
                  <span className="leading-relaxed pt-0.5">{s}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-gold rounded-2xl p-5 mb-5 shadow-card">
            <h3 className="text-sm uppercase font-bold text-navy/70 tracking-wide mb-2">💡 Pourquoi ça marche ?</h3>
            <p className="text-navy leading-relaxed">{exp.why}</p>
          </section>

          <div className="flex gap-3">
            <button
              onClick={markTried}
              className={`flex-1 py-3 px-4 rounded-xl font-bold border-2 transition-all active:scale-95 ${
                isTried
                  ? "bg-green-100 border-green-400 text-green-900"
                  : "bg-white border-pale-blue text-navy hover:border-gold"
              }`}
            >
              {isTried ? "✓ J'ai essayé !" : "🧪 J'ai essayé"}
            </button>
            <button onClick={startQuiz} className="flex-1 btn btn-primary">
              ✨ Quiz
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ---------- Quiz ----------
  if (phase === "quiz") {
    const question = exp.quiz[qIdx];
    return (
      <div className="min-h-screen bg-cream flex flex-col">
        <header className="px-5 py-4 flex items-center justify-between bg-white border-b border-pale-blue sticky top-0 z-10">
          <button onClick={() => setPhase("detail")} className="w-10 h-10 rounded-full bg-white border border-pale-blue flex items-center justify-center text-navy" aria-label="Retour">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div className="text-sm font-bold text-navy">Question {qIdx + 1}/{exp.quiz.length}</div>
          <div className="text-xs font-bold text-gold">⭐ {score}</div>
        </header>

        <main className="flex-1 px-5 py-6 max-w-xl mx-auto w-full flex flex-col">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">{exp.emoji}</div>
            <div className="text-xs uppercase font-semibold text-fg-soft">{exp.title}</div>
          </div>

          <div className="bg-white border-4 border-navy rounded-3xl p-6 mb-5 shadow-card">
            <div className="text-xl md:text-2xl font-bold text-navy text-center leading-snug">
              {question.q}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {question.choices.map((c, i) => {
              const isCorrect = i === question.answer;
              const isPicked = picked === i;
              const showResult = picked !== null;
              const className = showResult
                ? isCorrect
                  ? "bg-green-100 border-green-500 text-green-900"
                  : isPicked
                    ? "bg-rose-100 border-rose-500 text-rose-900"
                    : "bg-white border-pale-blue text-navy/50"
                : "bg-white border-pale-blue text-navy hover:border-gold";
              return (
                <button
                  key={i}
                  onClick={() => onPick(i)}
                  disabled={picked !== null}
                  className={`w-full text-left py-4 px-5 rounded-2xl border-2 font-semibold transition-all active:scale-95 ${className}`}
                >
                  <span className="font-bold mr-3">{String.fromCharCode(65 + i)}.</span>
                  {c}
                  {showResult && isCorrect && <span className="float-right">✓</span>}
                  {showResult && isPicked && !isCorrect && <span className="float-right">✗</span>}
                </button>
              );
            })}
          </div>
        </main>
      </div>
    );
  }

  // ---------- Result ----------
  if (phase === "result") {
    const total = exp.quiz.length;
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-5">
        <MascotCelebration trigger={score === total} locale="fr" />
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">{score === total ? "🏆" : score >= total - 1 ? "✨" : "📚"}</div>
          <h1 className="text-2xl font-bold text-navy mb-1">{exp.title}</h1>
          <div className="text-5xl font-bold text-gold mb-2 mt-3">{score}<span className="text-2xl text-fg-soft"> / {total}</span></div>
          <p className="text-fg-soft text-sm mb-6">
            {score === total ? "Tu as tout compris !" : "Continue à chercher !"}
          </p>
          <div className="flex gap-3">
            <button onClick={() => setPhase("list")} className="btn btn-outline flex-1">Liste</button>
            <button onClick={() => setPhase("detail")} className="btn btn-primary flex-1">Relire</button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- List ----------
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <MascotCelebration trigger={bigCelebrate} locale="fr" message="Tu es un vrai petit scientifique !" />
      <header className="px-5 py-4 flex items-center justify-between bg-white border-b border-pale-blue sticky top-0 z-10">
        <button onClick={goBack} className="w-10 h-10 rounded-full bg-white border border-pale-blue flex items-center justify-center text-navy" aria-label="Retour">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h1 className="text-base font-bold text-navy">Petits scientifiques</h1>
        <div className="text-xs font-bold text-gold tabular-nums">🧪 {triedCount}</div>
      </header>

      <main className="flex-1 px-5 py-6 max-w-3xl mx-auto w-full">
        <p className="text-fg-soft text-sm text-center mb-5">
          12 expériences à faire à la maison. Lis, essaie, et fais le quiz !
        </p>

        {/* Progress bar */}
        <div className="bg-white border-2 border-pale-blue rounded-2xl p-4 mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-navy">Mes expériences</span>
            <span className="text-xs font-bold text-gold tabular-nums">{triedCount}/{EXPERIMENTS.length}</span>
          </div>
          <div className="h-3 bg-pale-blue rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold to-gold-soft transition-all duration-500"
              style={{ width: `${(triedCount / EXPERIMENTS.length) * 100}%` }}
            />
          </div>
          {triedCount >= 6 && (
            <div className="mt-2 text-xs text-gold font-bold">⭐ Tu es un vrai petit scientifique !</div>
          )}
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
          <button
            onClick={() => setFilter("all")}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border-2 ${filter === "all" ? "bg-navy text-white border-navy" : "bg-white border-pale-blue text-navy"}`}
          >
            Tout ({EXPERIMENTS.length})
          </button>
          {(Object.keys(CATEGORY_LABELS) as Experiment["category"][]).map((c) => {
            const lbl = CATEGORY_LABELS[c];
            const count = EXPERIMENTS.filter((e) => e.category === c).length;
            return (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border-2 ${filter === c ? "bg-navy text-white border-navy" : "bg-white border-pale-blue text-navy"}`}
              >
                {lbl.emoji} {lbl.label} ({count})
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {visible.map((e) => {
            const isTried = tried[e.id]?.tried;
            const cat = CATEGORY_LABELS[e.category];
            return (
              <button
                key={e.id}
                onClick={() => openExp(e.id)}
                className={`text-left bg-gradient-to-br ${e.accent} border-2 ${isTried ? "border-gold" : "border-pale-blue"} rounded-2xl p-4 hover:border-gold hover:scale-[1.02] active:scale-95 transition-all shadow-card relative`}
              >
                {isTried && (
                  <span className="absolute top-2 right-2 bg-gold text-navy text-[10px] font-bold px-2 py-0.5 rounded-full">✓ Essayé</span>
                )}
                <div className="text-4xl mb-2">{e.emoji}</div>
                <h3 className="font-bold text-navy text-sm md:text-base leading-tight mb-2">{e.title}</h3>
                <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
                  <span className={`px-2 py-0.5 rounded-full font-bold ${cat.color}`}>{cat.label}</span>
                  <span className="text-navy/60 font-bold">⏱ {formatTime(e.time)}</span>
                  <span className="text-gold font-bold">{"⭐".repeat(e.difficulty)}</span>
                </div>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
