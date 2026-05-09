"use client";

/**
 * Quel cursus me convient ? — interactive diagnostic.
 *
 * 5 questions:
 *   1. Quelle est ta filière au Bac ?
 *   2. Quelle est ta moyenne (estimée) ?
 *   3. Tu préfères quel type de matière ?
 *   4. Tu veux étudier dans quelle wilaya / proximité ?
 *   5. Combien d'années d'études te conviennent ?
 *
 * Then we score every university in the catalogue against the answers and
 * present the top 5 matches with explanations. The match math is simple +
 * interpretable on purpose — no AI here. The kid sees "+3 points car ta
 * filière est sciences expérimentales" so they trust the output.
 */

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { UNIVERSITIES, type University, type BacStream, type Domain } from "./universities";
import { Link } from "@/i18n/routing";

type Step = "bac" | "avg" | "interest" | "city" | "duration" | "result";

interface Answers {
  bac?: BacStream;
  avg?: number;       // 10..20
  interests: Domain[];
  city?: "alger" | "oran" | "constantine" | "est" | "ouest" | "sud" | "any";
  duration?: "5" | "5-7" | "7+";
}

const BAC_STREAMS: { key: BacStream; fr: string; ar: string; emoji: string }[] = [
  { key: "sciences-experimentales",  fr: "Sciences expérimentales",   ar: "علوم تجريبية",        emoji: "🧪" },
  { key: "mathematiques",            fr: "Mathématiques",             ar: "رياضيات",            emoji: "➗" },
  { key: "techniques-mathematiques", fr: "Techniques mathématiques",  ar: "تقني رياضي",          emoji: "⚙️" },
  { key: "lettres-philosophie",      fr: "Lettres et philosophie",    ar: "آداب وفلسفة",        emoji: "📜" },
  { key: "lettres-langues",          fr: "Lettres et langues",        ar: "آداب ولغات",         emoji: "🗣️" },
  { key: "gestion-economie",         fr: "Gestion et économie",       ar: "تسيير واقتصاد",      emoji: "📈" },
];

const INTEREST_TAGS: { key: Domain; fr: string; ar: string; emoji: string }[] = [
  { key: "medecine",            fr: "Soigner les gens",        ar: "علاج الناس",          emoji: "🩺" },
  { key: "informatique",        fr: "Coder, ordinateurs",      ar: "البرمجة والحاسوب",    emoji: "💻" },
  { key: "ingenieur",           fr: "Construire, inventer",    ar: "البناء والاختراع",    emoji: "🔧" },
  { key: "math-physique",       fr: "Maths, sciences pures",   ar: "الرياضيات والفيزياء", emoji: "🔬" },
  { key: "architecture",        fr: "Architecture, design",    ar: "الهندسة المعمارية",  emoji: "🏛️" },
  { key: "agronomie",           fr: "Nature, agriculture",     ar: "الطبيعة والفلاحة",    emoji: "🌾" },
  { key: "lettres",             fr: "Lire, écrire",            ar: "القراءة والكتابة",   emoji: "📚" },
  { key: "langues",             fr: "Langues étrangères",      ar: "اللغات الأجنبية",     emoji: "🗺️" },
  { key: "droit",               fr: "Droit, justice",          ar: "القانون والعدالة",    emoji: "⚖️" },
  { key: "economie",            fr: "Argent, business",        ar: "الاقتصاد والتجارة",   emoji: "💼" },
  { key: "communication",       fr: "Communication, médias",   ar: "الإعلام والاتصال",   emoji: "📺" },
  { key: "art",                 fr: "Art, créativité",         ar: "الفن والإبداع",       emoji: "🎨" },
];

const CITIES: { key: NonNullable<Answers["city"]>; fr: string; ar: string; emoji: string }[] = [
  { key: "alger",       fr: "Alger",                ar: "الجزائر",     emoji: "🏙️" },
  { key: "oran",        fr: "Oran",                 ar: "وهران",       emoji: "🌊" },
  { key: "constantine", fr: "Constantine",          ar: "قسنطينة",     emoji: "🌉" },
  { key: "est",         fr: "Est (Annaba, Batna…)", ar: "الشرق",       emoji: "🌅" },
  { key: "ouest",       fr: "Ouest (Tlemcen…)",     ar: "الغرب",       emoji: "🌇" },
  { key: "sud",         fr: "Sud (Ouargla, Sahara)", ar: "الجنوب",     emoji: "🏜️" },
  { key: "any",         fr: "Peu importe",          ar: "لا يهم",      emoji: "🌐" },
];

interface ScoredUni {
  uni: University;
  score: number;
  reasons: string[];
}

function scoreUniversities(a: Answers, isAr: boolean): ScoredUni[] {
  const out: ScoredUni[] = [];
  for (const uni of UNIVERSITIES) {
    let score = 0;
    const reasons: string[] = [];

    // Bac stream match (+3)
    if (a.bac && uni.streams.includes(a.bac)) {
      score += 3;
      reasons.push(isAr ? "+٣ شعبتك متوافقة" : "+3 ta filière colle");
    }

    // Average vs threshold
    if (a.avg !== undefined && uni.min_avg !== undefined) {
      if (a.avg >= uni.min_avg) {
        score += 2;
        reasons.push(isAr ? `+٢ معدلك (${a.avg}) ≥ المطلوب (${uni.min_avg})` : `+2 ta moyenne (${a.avg}) ≥ requis (${uni.min_avg})`);
      } else if (a.avg + 0.5 >= uni.min_avg) {
        score += 1;
        reasons.push(isAr ? "+١ معدلك قريب" : "+1 moyenne très proche");
      }
    } else if (a.avg !== undefined) {
      score += 1;
    }

    // Interests overlap
    const overlap = uni.domains.filter((d) => a.interests.includes(d)).length;
    if (overlap > 0) {
      score += overlap * 2;
      reasons.push(isAr ? `+${overlap * 2} الجامعة تقدّم ${overlap} من اهتماماتك` : `+${overlap * 2} l'université couvre ${overlap} de tes intérêts`);
    }

    // City match
    if (a.city) {
      const matches = (
        (a.city === "alger" && uni.city.toLowerCase().includes("alger")) ||
        (a.city === "oran" && uni.city.toLowerCase().includes("oran")) ||
        (a.city === "constantine" && uni.city.toLowerCase().includes("constantine")) ||
        (a.city === "est" && /annaba|constantine|batna|setif|tebessa|skikda/i.test(uni.city)) ||
        (a.city === "ouest" && /oran|tlemcen|sidi|mostaganem/i.test(uni.city)) ||
        (a.city === "any")
      );
      if (matches) {
        score += 2;
        reasons.push(isAr ? "+٢ في منطقتك" : "+2 dans ta région");
      }
    }

    if (score > 0) out.push({ uni, score, reasons });
  }
  out.sort((x, y) => y.score - x.score);
  return out;
}

export function Diagnostic() {
  const locale = useLocale();
  const isAr = locale === "ar";

  const [step, setStep] = useState<Step>("bac");
  const [answers, setAnswers] = useState<Answers>({ interests: [] });

  const top = useMemo(() => (step === "result" ? scoreUniversities(answers, isAr).slice(0, 5) : []), [step, answers, isAr]);

  const goNext = (next: Step) => setStep(next);
  const restart = () => { setStep("bac"); setAnswers({ interests: [] }); };

  return (
    <div className="bg-white rounded-3xl border-4 border-gold p-5 md:p-8 shadow-card">
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {(["bac", "avg", "interest", "city", "duration", "result"] as Step[]).map((s, i) => (
          <span key={s}
            className={`h-2 rounded-full transition-all ${
              s === step ? "w-8 bg-navy" : i < (["bac", "avg", "interest", "city", "duration", "result"] as Step[]).indexOf(step) ? "w-2 bg-gold" : "w-2 bg-pale-blue"
            }`}
          />
        ))}
      </div>

      {step === "bac" && (
        <Question title={isAr ? "ما هي شعبتك في البكالوريا ؟" : "Quelle est ta filière au Bac ?"} sub={isAr ? "اختر الشعبة الأقرب" : "Choisis ta filière (ou la plus proche)"}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
            {BAC_STREAMS.map((s) => (
              <button key={s.key}
                onClick={() => { setAnswers((a) => ({ ...a, bac: s.key })); goNext("avg"); }}
                className={`bg-pale-blue/30 hover:bg-gold/20 border-2 rounded-2xl px-3 py-4 text-start transition active:scale-95 ${
                  answers.bac === s.key ? "border-gold bg-gold/20" : "border-pale-blue"
                }`}
              >
                <div className="text-2xl mb-1">{s.emoji}</div>
                <div className="font-bold text-navy text-sm md:text-base">{isAr ? s.ar : s.fr}</div>
              </button>
            ))}
          </div>
        </Question>
      )}

      {step === "avg" && (
        <Question title={isAr ? "ما هو معدلك المتوقع ؟" : "Ta moyenne au Bac (estimée) ?"} sub={isAr ? "اختر الشريحة الأقرب" : "Sélectionne la plage qui te ressemble"}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {[10, 12, 14, 16, 18].map((v) => (
              <button key={v}
                onClick={() => { setAnswers((a) => ({ ...a, avg: v })); goNext("interest"); }}
                className={`rounded-2xl border-2 p-4 transition active:scale-95 ${answers.avg === v ? "border-gold bg-gold/20" : "border-pale-blue bg-white hover:border-gold"}`}
              >
                <div className="text-2xl font-bold text-navy">{v}+</div>
                <div className="text-xs text-fg-soft mt-1">{v >= 16 ? (isAr ? "ممتاز" : "Très bien") : v >= 14 ? (isAr ? "جيد" : "Bien") : v >= 12 ? (isAr ? "متوسط" : "Assez bien") : (isAr ? "مقبول" : "Passable")}</div>
              </button>
            ))}
          </div>
        </Question>
      )}

      {step === "interest" && (
        <Question title={isAr ? "ما الذي تحبّ ؟" : "Qu'est-ce qui t'intéresse ?"} sub={isAr ? "اختر ٢ أو ٣" : "Choisis-en 2 ou 3"}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-4">
            {INTEREST_TAGS.map((t) => {
              const on = answers.interests.includes(t.key);
              return (
                <button key={t.key}
                  onClick={() => setAnswers((a) => ({ ...a, interests: on ? a.interests.filter((x) => x !== t.key) : [...a.interests, t.key].slice(0, 4) }))}
                  className={`rounded-2xl border-2 p-3 text-start transition active:scale-95 ${on ? "border-gold bg-gold/20" : "border-pale-blue bg-white hover:border-gold"}`}
                >
                  <div className="text-2xl mb-1">{t.emoji}</div>
                  <div className="text-xs md:text-sm font-bold text-navy leading-tight">{isAr ? t.ar : t.fr}</div>
                </button>
              );
            })}
          </div>
          <button
            onClick={() => goNext("city")}
            disabled={answers.interests.length === 0}
            className={`btn ${answers.interests.length === 0 ? "btn-outline opacity-50" : "btn-primary"} w-full`}
          >
            {isAr ? "التالي" : "Continuer"} →
          </button>
        </Question>
      )}

      {step === "city" && (
        <Question title={isAr ? "أين تريد الدراسة ؟" : "Où veux-tu étudier ?"}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {CITIES.map((c) => (
              <button key={c.key}
                onClick={() => { setAnswers((a) => ({ ...a, city: c.key })); goNext("duration"); }}
                className={`rounded-2xl border-2 p-3 transition active:scale-95 ${answers.city === c.key ? "border-gold bg-gold/20" : "border-pale-blue bg-white hover:border-gold"}`}
              >
                <div className="text-2xl mb-1">{c.emoji}</div>
                <div className="text-sm font-bold text-navy">{isAr ? c.ar : c.fr}</div>
              </button>
            ))}
          </div>
        </Question>
      )}

      {step === "duration" && (
        <Question title={isAr ? "كم سنة دراسة ؟" : "Combien d'années d'études ?"}>
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { k: "5",   fr: "Jusqu'à 5 ans",  ar: "حتى ٥ سنوات",   emoji: "🎓" },
              { k: "5-7", fr: "5 à 7 ans",      ar: "٥ إلى ٧ سنوات", emoji: "🏥" },
              { k: "7+",  fr: "Plus de 7 ans", ar: "أكثر من ٧",     emoji: "🩺" },
            ].map((d) => (
              <button key={d.k}
                onClick={() => { setAnswers((a) => ({ ...a, duration: d.k as Answers["duration"] })); goNext("result"); }}
                className={`rounded-2xl border-2 p-4 transition active:scale-95 ${answers.duration === d.k ? "border-gold bg-gold/20" : "border-pale-blue bg-white hover:border-gold"}`}
              >
                <div className="text-2xl mb-1">{d.emoji}</div>
                <div className="text-sm font-bold text-navy">{isAr ? d.ar : d.fr}</div>
              </button>
            ))}
          </div>
        </Question>
      )}

      {step === "result" && (
        <div>
          <div className="text-center mb-5">
            <div className="text-5xl mb-2">🎯</div>
            <h2 className="text-2xl font-bold text-navy">{isAr ? "الجامعات المقترحة لك" : "Voici ce qui te correspond"}</h2>
            <p className="text-sm text-fg-soft mt-1">{isAr ? "بناءً على إجاباتك" : "D'après tes réponses"}</p>
          </div>

          {top.length === 0 ? (
            <div className="text-center py-6 text-fg-soft">
              {isAr ? "لم نجد تطابقاً قوياً. جرّب توسيع اختياراتك." : "Aucune correspondance forte. Essaye d'élargir tes choix."}
            </div>
          ) : (
            <div className="space-y-3">
              {top.map(({ uni, score, reasons }, i) => (
                <Link key={uni.slug} href={`/fac/universites/${uni.slug}` as never}
                  className="block bg-pale-blue/30 hover:bg-gold/10 border-2 border-pale-blue rounded-2xl p-4 transition active:scale-[0.99]"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-4xl flex-shrink-0">{uni.emoji ?? "🎓"}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-gold bg-gold/15 px-2 py-0.5 rounded-full">#{i + 1} · {score} pts</span>
                        <span className="text-xs text-fg-soft">{uni.city}</span>
                      </div>
                      <h3 className="font-bold text-navy text-base md:text-lg leading-tight mt-1">
                        {isAr ? uni.name_ar : uni.name_fr}
                      </h3>
                      <p className="text-sm text-fg-soft mt-1">{isAr ? uni.highlight_ar : uni.highlight_fr}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {reasons.map((r, j) => (
                          <span key={j} className="text-[10px] font-mono bg-white border border-pale-blue px-2 py-0.5 rounded-full text-navy/70">{r}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button onClick={restart} className="btn btn-outline flex-1">
              {isAr ? "إعادة" : "Recommencer"}
            </button>
            <Link href="/fac/universites" className="btn btn-primary flex-1 text-center">
              {isAr ? "كل الجامعات" : "Voir toutes les universités"} →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function Question({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-navy mb-1">{title}</h2>
      {sub && <p className="text-sm text-fg-soft mb-4">{sub}</p>}
      {children}
    </div>
  );
}
