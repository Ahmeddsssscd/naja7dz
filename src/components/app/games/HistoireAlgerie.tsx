"use client";

/**
 * Histoire d'Algérie — interactive timeline of 6 historical eras.
 *
 * Each era is a clickable card. Clicking opens a 3-paragraph illustrated
 * story (emoji + text only, no images), then a 3-question multiple-choice
 * mini-quiz. Completion (quiz score >= 2/3) is persisted per era in
 * localStorage. Completing all 6 unlocks a "Diplôme d'historien" certificate
 * the kid can screenshot.
 */

import { useEffect, useState } from "react";
import { useGameBack } from "./useGameBack";
import { MascotCelebration } from "@/components/app/MascotCelebration";
import confetti from "canvas-confetti";

type Phase = "timeline" | "story" | "quiz" | "result" | "diploma";

interface QuizQ {
  q: string;
  choices: string[];
  /** index of correct choice */
  answer: number;
}

interface Era {
  id: string;
  title: string;
  period: string;
  emoji: string;
  /** soft accent color for the card */
  accent: string;
  /** 3 short paragraphs of story */
  story: string[];
  quiz: QuizQ[];
}

const ERAS: Era[] = [
  {
    id: "numidie",
    title: "Numidie antique",
    period: "Avant -200",
    emoji: "🏛️",
    accent: "from-amber-100 to-yellow-50",
    story: [
      "Il y a très longtemps, bien avant la naissance du Prophète ﷺ, l'Algérie s'appelait la Numidie. C'était un royaume de cavaliers, de bergers et de guerriers berbères. Leurs villes étaient construites en pierre et leurs armées étaient célèbres dans toute la Méditerranée.",
      "Le grand roi Massinissa unit les tribus numides et bâtit un royaume puissant. Il aimait l'agriculture et fit pousser le blé sur des terres immenses. On disait qu'il pouvait monter à cheval jusqu'à 90 ans !",
      "Plus tard, son petit-fils Jugurtha défia l'empire romain. Il combattit pendant des années avec ruse et courage avant d'être capturé. Mais son nom est resté à jamais comme symbole de la fierté berbère.",
    ],
    quiz: [
      { q: "Comment s'appelait l'Algérie dans l'Antiquité ?", choices: ["Mauritanie", "Numidie", "Egypte"], answer: 1 },
      { q: "Qui était Massinissa ?", choices: ["Un poète", "Un roi numide", "Un général romain"], answer: 1 },
      { q: "Jugurtha a combattu contre quel empire ?", choices: ["L'empire grec", "L'empire perse", "L'empire romain"], answer: 2 },
    ],
  },
  {
    id: "conquete-arabe",
    title: "Conquête arabe",
    period: "640 - 1000",
    emoji: "🕌",
    accent: "from-emerald-100 to-green-50",
    story: [
      "Au VIIᵉ siècle, après la mort du Prophète ﷺ, des armées musulmanes venues d'Arabie traversèrent le désert pour apporter l'Islam au Maghreb. Le grand chef Sidi Okba ibn Nafi mena ses cavaliers jusqu'à l'océan Atlantique.",
      "Beaucoup de Berbères embrassèrent la nouvelle foi et apprirent la langue arabe. Ils construisirent des mosquées magnifiques, comme celle de Sidi Okba à Biskra, et fondèrent des écoles où l'on étudiait le Coran et les sciences.",
      "Une cité savante, Tahert, devint un centre de commerce et de savoir. On y apprenait l'astronomie, la médecine et le droit. C'était l'âge d'or de la civilisation arabo-berbère en Algérie.",
    ],
    quiz: [
      { q: "Qui a apporté l'Islam au Maghreb ?", choices: ["Les Romains", "Sidi Okba ibn Nafi", "Massinissa"], answer: 1 },
      { q: "Quelle ville était un grand centre de savoir ?", choices: ["Tahert", "Rome", "Athènes"], answer: 0 },
      { q: "Quelle langue est venue avec l'Islam ?", choices: ["Le latin", "L'arabe", "Le grec"], answer: 1 },
    ],
  },
  {
    id: "regence",
    title: "Régence d'Alger",
    period: "1516 - 1830",
    emoji: "⚓",
    accent: "from-sky-100 to-blue-50",
    story: [
      "Au XVIᵉ siècle, l'Algérie devint la Régence d'Alger, un État allié à l'Empire ottoman. La ville d'Alger fut surnommée \"El Bahdja\" (la joyeuse) et devint l'une des cités les plus puissantes de la Méditerranée.",
      "Les corsaires algériens, comme le célèbre Khayr al-Din Barberousse, sillonnaient les mers à bord de leurs galères rapides. Ils protégeaient les côtes et défiaient les flottes européennes les plus puissantes.",
      "La Casbah d'Alger, avec ses ruelles étroites et ses maisons blanches, fut bâtie à cette époque. On y trouvait des marchés, des écoles, des hammams et des mosquées. C'était une ville cosmopolite et fière.",
    ],
    quiz: [
      { q: "Comment surnommait-on la ville d'Alger ?", choices: ["El Bahdja", "El Kabira", "El Jamila"], answer: 0 },
      { q: "Qui était Khayr al-Din ?", choices: ["Un poète", "Un corsaire célèbre", "Un sultan ottoman"], answer: 1 },
      { q: "À quel empire la Régence était-elle alliée ?", choices: ["Empire romain", "Empire ottoman", "Empire perse"], answer: 1 },
    ],
  },
  {
    id: "colonisation",
    title: "Colonisation française",
    period: "1830 - 1954",
    emoji: "⚔️",
    accent: "from-rose-100 to-pink-50",
    story: [
      "En 1830, les armées françaises débarquèrent à Sidi Fredj et envahirent Alger. Ce fut le début d'une longue colonisation qui durerait 132 ans. Le peuple algérien perdit ses terres, ses écoles arabes furent fermées.",
      "Mais la résistance fut immédiate. L'Émir Abd el-Kader, jeune chef savant et pieux, organisa une armée et tint tête aux Français pendant 17 ans. Il créa un État algérien moderne avant d'être finalement vaincu.",
      "Pendant un siècle, les Algériens souffrirent de l'injustice et de la pauvreté. Les écoles, les hôpitaux et les meilleures terres étaient réservés aux colons. Mais dans les cœurs, la flamme de la liberté ne s'éteignit jamais.",
    ],
    quiz: [
      { q: "En quelle année la France a-t-elle envahi l'Algérie ?", choices: ["1789", "1830", "1900"], answer: 1 },
      { q: "Qui a résisté pendant 17 ans ?", choices: ["Massinissa", "Jugurtha", "Émir Abd el-Kader"], answer: 2 },
      { q: "Combien d'années a duré la colonisation ?", choices: ["50 ans", "132 ans", "200 ans"], answer: 1 },
    ],
  },
  {
    id: "guerre",
    title: "Guerre d'indépendance",
    period: "1954 - 1962",
    emoji: "🇩🇿",
    accent: "from-red-100 to-rose-50",
    story: [
      "Le 1er novembre 1954, à minuit, des explosions retentirent dans toute l'Algérie. C'était le début de la Révolution. Le Front de Libération Nationale (FLN) appelait le peuple à se soulever pour l'indépendance.",
      "L'Armée de Libération Nationale (ALN) combattit dans les montagnes des Aurès, en Kabylie et dans le Sahara. Des héros comme Larbi Ben M'hidi, Didouche Mourad et Hassiba Ben Bouali donnèrent leur vie pour la liberté.",
      "Après huit années d'une guerre cruelle qui fit plus d'un million de martyrs, l'Algérie devint enfin indépendante le 5 juillet 1962. Le drapeau vert, blanc et rouge fut hissé partout dans le pays. Le peuple était libre !",
    ],
    quiz: [
      { q: "Quel jour a commencé la Révolution ?", choices: ["1er juillet 1962", "1er novembre 1954", "5 juillet 1830"], answer: 1 },
      { q: "Comment s'appelait l'armée de la Révolution ?", choices: ["FLN", "ALN", "OAS"], answer: 1 },
      { q: "En quelle année l'Algérie est-elle devenue indépendante ?", choices: ["1954", "1958", "1962"], answer: 2 },
    ],
  },
  {
    id: "moderne",
    title: "Algérie moderne",
    period: "1962 - aujourd'hui",
    emoji: "🏙️",
    accent: "from-violet-100 to-purple-50",
    story: [
      "Après l'indépendance, l'Algérie devint une jeune République. Le pays construisit des écoles, des hôpitaux, des routes et des universités pour tous ses enfants. L'éducation devint gratuite et obligatoire.",
      "Les ressources du pays — pétrole et gaz naturel du Sahara — permirent de financer le développement. Des villes nouvelles sortirent de terre, et l'Algérie devint un pays respecté en Afrique et dans le monde arabe.",
      "Aujourd'hui, l'Algérie est un pays jeune, fier de son histoire millénaire et tourné vers l'avenir. De nombreux savants, sportifs et artistes algériens brillent dans le monde entier. Et toi aussi, tu fais partie de cette belle histoire !",
    ],
    quiz: [
      { q: "Qu'est devenue l'Algérie après 1962 ?", choices: ["Une monarchie", "Une République", "Un empire"], answer: 1 },
      { q: "Quelle ressource est très importante en Algérie ?", choices: ["Le pétrole", "Le café", "Le riz"], answer: 0 },
      { q: "Sur quel continent se trouve l'Algérie ?", choices: ["Europe", "Asie", "Afrique"], answer: 2 },
    ],
  },
];

const STORAGE_KEY = "najah:histoire:done";

interface DoneRecord {
  [eraId: string]: { score: number; date: string };
}

function loadDone(): DoneRecord {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") as DoneRecord; }
  catch { return {}; }
}

function saveDone(d: DoneRecord) {
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch { /* ignore */ }
}

export function HistoireAlgerie() {
  const goBack = useGameBack();
  const [phase, setPhase] = useState<Phase>("timeline");
  const [eraIdx, setEraIdx] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [done, setDone] = useState<DoneRecord>({});

  useEffect(() => { setDone(loadDone()); }, []);

  const era = ERAS[eraIdx];
  const completedCount = Object.keys(done).filter((k) => (done[k]?.score ?? 0) >= 2).length;
  const allDone = completedCount === ERAS.length;

  const openEra = (idx: number) => {
    setEraIdx(idx);
    setQIdx(0);
    setScore(0);
    setPicked(null);
    setPhase("story");
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
    const correct = i === era.quiz[qIdx].answer;
    if (correct) setScore((s) => s + 1);
    setTimeout(() => {
      if (qIdx + 1 >= era.quiz.length) {
        const finalScore = score + (correct ? 1 : 0);
        const next: DoneRecord = { ...done, [era.id]: { score: finalScore, date: new Date().toISOString() } };
        setDone(next);
        saveDone(next);
        if (finalScore === era.quiz.length) {
          confetti({ particleCount: 80, spread: 90, colors: ["#D4A72C", "#0F1B33"] });
        }
        setPhase("result");
      } else {
        setQIdx((i) => i + 1);
        setPicked(null);
      }
    }, 900);
  };

  // ---------- Timeline ----------
  if (phase === "timeline") {
    return (
      <div className="min-h-screen bg-cream flex flex-col">
        <header className="px-5 py-4 flex items-center justify-between bg-white border-b border-pale-blue sticky top-0 z-10">
          <button onClick={goBack} className="w-10 h-10 rounded-full bg-white border border-pale-blue flex items-center justify-center text-navy" aria-label="Retour">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <h1 className="text-base font-bold text-navy">Histoire d'Algérie</h1>
          <div className="text-xs text-fg-soft tabular-nums">{completedCount}/{ERAS.length}</div>
        </header>

        <main className="flex-1 px-5 py-6 max-w-2xl mx-auto w-full">
          <p className="text-fg-soft text-sm text-center mb-6">
            Voyage à travers <strong>2200 ans</strong> d'histoire algérienne. Lis chaque époque, puis réponds au quiz pour la valider.
          </p>

          {allDone && (
            <button
              onClick={() => setPhase("diploma")}
              className="w-full mb-6 bg-gradient-to-r from-gold to-gold-soft text-navy font-bold py-4 rounded-2xl border-4 border-navy shadow-card hover:scale-[1.02] active:scale-95 transition-all"
            >
              🎓 Voir mon Diplôme d'historien
            </button>
          )}

          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-6 top-2 bottom-2 w-1 bg-pale-blue rounded-full md:left-8" aria-hidden />

            <div className="space-y-4">
              {ERAS.map((e, i) => {
                const isDone = (done[e.id]?.score ?? 0) >= 2;
                const isPerfect = (done[e.id]?.score ?? 0) === e.quiz.length;
                return (
                  <div key={e.id} className="relative pl-14 md:pl-20">
                    {/* Marker */}
                    <div className={`absolute left-4 md:left-6 top-4 w-5 h-5 rounded-full border-4 ${isDone ? "bg-gold border-navy" : "bg-white border-pale-blue"}`} aria-hidden />
                    <button
                      onClick={() => openEra(i)}
                      className={`w-full text-left bg-gradient-to-br ${e.accent} border-2 ${isDone ? "border-gold" : "border-pale-blue"} rounded-2xl p-4 md:p-5 hover:border-gold hover:scale-[1.01] active:scale-95 transition-all shadow-card`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-4xl md:text-5xl shrink-0">{e.emoji}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs uppercase font-semibold text-navy/60 tracking-wide">{e.period}</div>
                          <h3 className="text-lg md:text-xl font-bold text-navy leading-tight">{e.title}</h3>
                          <div className="mt-2 text-xs text-navy/70">
                            {isDone ? (
                              <span className="inline-flex items-center gap-1 font-semibold">
                                {isPerfect ? "🏆" : "✓"} {done[e.id].score}/{e.quiz.length}
                              </span>
                            ) : (
                              <span>📖 Lire et faire le quiz</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ---------- Story ----------
  if (phase === "story") {
    return (
      <div className="min-h-screen bg-cream flex flex-col">
        <header className="px-5 py-4 flex items-center justify-between bg-white border-b border-pale-blue sticky top-0 z-10">
          <button onClick={() => setPhase("timeline")} className="w-10 h-10 rounded-full bg-white border border-pale-blue flex items-center justify-center text-navy" aria-label="Retour">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <h1 className="text-base font-bold text-navy truncate px-2">{era.title}</h1>
          <div className="w-10" />
        </header>

        <main className="flex-1 px-5 py-6 max-w-2xl mx-auto w-full">
          <div className={`bg-gradient-to-br ${era.accent} border-4 border-navy rounded-3xl p-6 md:p-8 text-center shadow-card mb-6`}>
            <div className="text-6xl md:text-7xl mb-3">{era.emoji}</div>
            <div className="text-xs uppercase font-bold text-navy/60 tracking-widest mb-1">{era.period}</div>
            <h2 className="text-2xl md:text-3xl font-bold text-navy">{era.title}</h2>
          </div>

          <article className="bg-white border-2 border-pale-blue rounded-2xl p-5 md:p-7 space-y-4 shadow-card mb-6">
            {era.story.map((p, i) => (
              <p key={i} className="text-navy text-base md:text-lg leading-relaxed">
                <span className="font-bold text-gold mr-2">{i + 1}.</span>{p}
              </p>
            ))}
          </article>

          <button
            onClick={startQuiz}
            className="w-full btn btn-primary btn-lg"
          >
            ✨ Faire le quiz ({era.quiz.length} questions)
          </button>
        </main>
      </div>
    );
  }

  // ---------- Quiz ----------
  if (phase === "quiz") {
    const question = era.quiz[qIdx];
    return (
      <div className="min-h-screen bg-cream flex flex-col">
        <header className="px-5 py-4 flex items-center justify-between bg-white border-b border-pale-blue sticky top-0 z-10">
          <button onClick={() => setPhase("story")} className="w-10 h-10 rounded-full bg-white border border-pale-blue flex items-center justify-center text-navy" aria-label="Retour à l'histoire">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div className="text-sm font-bold text-navy">Question {qIdx + 1}/{era.quiz.length}</div>
          <div className="text-xs font-bold text-gold">⭐ {score}</div>
        </header>

        <main className="flex-1 px-5 py-6 max-w-xl mx-auto w-full flex flex-col">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">{era.emoji}</div>
            <div className="text-xs uppercase font-semibold text-fg-soft tracking-wide mb-3">{era.title}</div>
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
    const total = era.quiz.length;
    const passed = score >= 2;
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-5">
        <MascotCelebration trigger={score === total} locale="fr" />
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">{score === total ? "🏆" : passed ? "✨" : "📖"}</div>
          <h1 className="text-2xl font-bold text-navy mb-1">{era.title}</h1>
          <div className="text-xs uppercase font-semibold text-fg-soft mb-4">{era.period}</div>
          <div className="text-5xl font-bold text-gold mb-2">{score}<span className="text-2xl text-fg-soft"> / {total}</span></div>
          <p className="text-fg-soft text-sm mb-6">
            {score === total
              ? "Parfait ! Tu connais cette époque par cœur."
              : passed
                ? "Bien joué, époque validée !"
                : "Relis l'histoire et essaie encore."}
          </p>
          <div className="flex gap-3">
            <button onClick={() => setPhase("timeline")} className="btn btn-outline flex-1">Timeline</button>
            <button onClick={startQuiz} className="btn btn-primary flex-1">Rejouer</button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- Diploma ----------
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="px-5 py-4 flex items-center justify-between bg-white border-b border-pale-blue">
        <button onClick={() => setPhase("timeline")} className="w-10 h-10 rounded-full bg-white border border-pale-blue flex items-center justify-center text-navy" aria-label="Retour">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h1 className="text-base font-bold text-navy">Diplôme</h1>
        <div className="w-10" />
      </header>

      <main className="flex-1 px-5 py-8 max-w-2xl mx-auto w-full flex items-center">
        <div className="w-full bg-gradient-to-br from-cream to-amber-50 border-8 border-double border-gold rounded-3xl p-6 md:p-10 shadow-card-hover relative overflow-hidden">
          {/* Corner ornaments */}
          <div className="absolute top-3 left-3 text-3xl opacity-30">✦</div>
          <div className="absolute top-3 right-3 text-3xl opacity-30">✦</div>
          <div className="absolute bottom-3 left-3 text-3xl opacity-30">✦</div>
          <div className="absolute bottom-3 right-3 text-3xl opacity-30">✦</div>

          <div className="text-center">
            <div className="text-5xl md:text-6xl mb-2">🎓</div>
            <div className="text-xs uppercase tracking-[0.3em] text-navy/60 font-bold mb-1">République Algérienne</div>
            <h1 className="text-3xl md:text-5xl font-bold text-navy mb-2 font-serif">Diplôme d'Historien</h1>
            <div className="w-24 h-1 bg-gold mx-auto mb-5" />

            <p className="text-navy text-base md:text-lg mb-2">Décerné à</p>
            <div className="text-2xl md:text-3xl font-bold text-gold mb-5 italic">notre jeune historien</div>

            <p className="text-navy text-sm md:text-base leading-relaxed mb-6 max-w-md mx-auto">
              Pour avoir parcouru avec succès toutes les grandes époques de l'histoire de l'Algérie, de la Numidie antique à l'Algérie moderne.
            </p>

            <div className="grid grid-cols-3 gap-2 mb-6">
              {ERAS.map((e) => (
                <div key={e.id} className="bg-white/60 border border-gold/40 rounded-xl p-2">
                  <div className="text-2xl">{e.emoji}</div>
                  <div className="text-[10px] font-bold text-navy mt-1 leading-tight">{e.title}</div>
                </div>
              ))}
            </div>

            <div className="text-xs text-navy/70 italic">
              Délivré le {new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
            </div>
            <div className="mt-4 text-2xl">🇩🇿 ✦ 🇩🇿</div>
          </div>
        </div>
      </main>

      <div className="px-5 pb-6 max-w-2xl mx-auto w-full">
        <p className="text-center text-xs text-fg-soft mb-3">📸 Tu peux faire une capture d'écran pour garder ton diplôme !</p>
        <button onClick={() => setPhase("timeline")} className="btn btn-outline w-full">Retour à la timeline</button>
      </div>
    </div>
  );
}
