"use client";

/**
 * Quel cursus me convient ? — interactive diagnostic.
 *
 * Editorial style: typography-only chips (no emoji), surface/line tokens,
 * rounded-card corners. Logic stays the same — 5 questions then a scored
 * shortlist of universities with explainable reasons.
 */

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { UNIVERSITIES, type University, type BacStream, type Domain } from "./universities";
import { Link } from "@/i18n/routing";
import { ArrowRightIcon, ArrowRightIcon as ArrowIcon, MapPinIcon } from "@/components/Icon";

type Step = "bac" | "avg" | "interest" | "city" | "duration" | "result";

interface Answers {
  bac?: BacStream;
  avg?: number;       // 10..20
  interests: Domain[];
  city?: "alger" | "oran" | "constantine" | "est" | "ouest" | "sud" | "any";
  duration?: "5" | "5-7" | "7+";
}

const BAC_STREAMS: { key: BacStream; fr: string; ar: string }[] = [
  { key: "sciences-experimentales",  fr: "Sciences expérimentales",   ar: "علوم تجريبية" },
  { key: "mathematiques",            fr: "Mathématiques",             ar: "رياضيات" },
  { key: "techniques-mathematiques", fr: "Techniques mathématiques",  ar: "تقني رياضي" },
  { key: "lettres-philosophie",      fr: "Lettres et philosophie",    ar: "آداب وفلسفة" },
  { key: "lettres-langues",          fr: "Lettres et langues",        ar: "آداب ولغات" },
  { key: "gestion-economie",         fr: "Gestion et économie",       ar: "تسيير واقتصاد" },
];

const INTEREST_TAGS: { key: Domain; fr: string; ar: string }[] = [
  { key: "medecine",      fr: "Soigner les gens",       ar: "علاج الناس" },
  { key: "informatique",  fr: "Informatique, code",     ar: "البرمجة والحاسوب" },
  { key: "ingenieur",     fr: "Construire, inventer",   ar: "البناء والاختراع" },
  { key: "math-physique", fr: "Maths, sciences pures",  ar: "الرياضيات والفيزياء" },
  { key: "architecture",  fr: "Architecture, design",   ar: "الهندسة المعمارية" },
  { key: "agronomie",     fr: "Nature, agriculture",    ar: "الطبيعة والفلاحة" },
  { key: "lettres",       fr: "Lire, écrire",           ar: "القراءة والكتابة" },
  { key: "langues",       fr: "Langues étrangères",     ar: "اللغات الأجنبية" },
  { key: "droit",         fr: "Droit, justice",         ar: "القانون والعدالة" },
  { key: "economie",      fr: "Économie, business",     ar: "الاقتصاد والتجارة" },
  { key: "communication", fr: "Communication, médias",  ar: "الإعلام والاتصال" },
  { key: "art",           fr: "Art, créativité",        ar: "الفن والإبداع" },
];

const CITIES: { key: NonNullable<Answers["city"]>; fr: string; ar: string }[] = [
  { key: "alger",       fr: "Alger",                ar: "الجزائر" },
  { key: "oran",        fr: "Oran",                 ar: "وهران" },
  { key: "constantine", fr: "Constantine",          ar: "قسنطينة" },
  { key: "est",         fr: "Est (Annaba, Batna…)", ar: "الشرق" },
  { key: "ouest",       fr: "Ouest (Tlemcen…)",     ar: "الغرب" },
  { key: "sud",         fr: "Sud (Sahara)",         ar: "الجنوب" },
  { key: "any",         fr: "Peu importe",          ar: "لا يهم" },
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

    if (a.bac && uni.streams.includes(a.bac)) {
      score += 3;
      reasons.push(isAr ? "+٣ شعبتك متوافقة" : "+3 ta filière correspond");
    }

    if (a.avg !== undefined && uni.min_avg !== undefined) {
      if (a.avg >= uni.min_avg) {
        score += 2;
        reasons.push(isAr ? `+٢ معدلك (${a.avg}) ≥ المطلوب (${uni.min_avg})` : `+2 moyenne (${a.avg}) ≥ requis (${uni.min_avg})`);
      } else if (a.avg + 0.5 >= uni.min_avg) {
        score += 1;
        reasons.push(isAr ? "+١ معدلك قريب" : "+1 moyenne très proche");
      }
    } else if (a.avg !== undefined) {
      score += 1;
    }

    const overlap = uni.domains.filter((d) => a.interests.includes(d)).length;
    if (overlap > 0) {
      score += overlap * 2;
      reasons.push(isAr ? `+${overlap * 2} ${overlap} من اهتماماتك` : `+${overlap * 2} couvre ${overlap} de tes intérêts`);
    }

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

  const top = useMemo(
    () => (step === "result" ? scoreUniversities(answers, isAr).slice(0, 5) : []),
    [step, answers, isAr],
  );

  const stepIndex = (["bac", "avg", "interest", "city", "duration", "result"] as Step[]).indexOf(step);

  const goNext = (next: Step) => setStep(next);
  const restart = () => { setStep("bac"); setAnswers({ interests: [] }); };

  return (
    <div className="bg-surface border border-line rounded-card p-6 md:p-8">
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {(["bac", "avg", "interest", "city", "duration", "result"] as Step[]).map((s, i) => (
          <span key={s}
            className={`h-1.5 rounded-full transition-all ${
              s === step ? "w-8 bg-fg" : i < stepIndex ? "w-1.5 bg-gold" : "w-1.5 bg-line"
            }`}
          />
        ))}
      </div>

      {step === "bac" && (
        <Question
          n={1}
          title={isAr ? "ما هي شعبتك في البكالوريا ؟" : "Quelle est ta filière au Bac ?"}
          sub={isAr ? "اختر الشعبة الأقرب" : "Choisis ta filière (ou la plus proche)"}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {BAC_STREAMS.map((s) => (
              <ChoiceChip
                key={s.key}
                selected={answers.bac === s.key}
                onClick={() => { setAnswers((a) => ({ ...a, bac: s.key })); goNext("avg"); }}
              >
                {isAr ? s.ar : s.fr}
              </ChoiceChip>
            ))}
          </div>
        </Question>
      )}

      {step === "avg" && (
        <Question
          n={2}
          title={isAr ? "ما هو معدلك المتوقع ؟" : "Ta moyenne au Bac (estimée)"}
          sub={isAr ? "اختر الشريحة الأقرب" : "Sélectionne la plage qui te ressemble"}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {[10, 12, 14, 16, 18].map((v) => (
              <button
                key={v}
                onClick={() => { setAnswers((a) => ({ ...a, avg: v })); goNext("interest"); }}
                className={`rounded-card border p-4 text-center transition-all hover:shadow-card-hover ${
                  answers.avg === v
                    ? "border-fg bg-surface-3"
                    : "border-line bg-surface hover:border-fg/40"
                }`}
              >
                <div className="text-3xl font-bold text-fg leading-none">{v}+</div>
                <div className="text-xs text-fg-soft mt-2 uppercase tracking-wider">
                  {v >= 16 ? (isAr ? "ممتاز" : "Très bien")
                   : v >= 14 ? (isAr ? "جيد" : "Bien")
                   : v >= 12 ? (isAr ? "متوسط" : "Assez bien")
                   : (isAr ? "مقبول" : "Passable")}
                </div>
              </button>
            ))}
          </div>
        </Question>
      )}

      {step === "interest" && (
        <Question
          n={3}
          title={isAr ? "ما الذي يثير اهتمامك ؟" : "Qu'est-ce qui t'intéresse ?"}
          sub={isAr ? "اختر ٢ إلى ٤ مجالات" : "Choisis-en 2 à 4"}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
            {INTEREST_TAGS.map((t) => {
              const on = answers.interests.includes(t.key);
              return (
                <ChoiceChip
                  key={t.key}
                  selected={on}
                  onClick={() => setAnswers((a) => ({
                    ...a,
                    interests: on
                      ? a.interests.filter((x) => x !== t.key)
                      : [...a.interests, t.key].slice(0, 4),
                  }))}
                >
                  {isAr ? t.ar : t.fr}
                </ChoiceChip>
              );
            })}
          </div>
          <button
            onClick={() => goNext("city")}
            disabled={answers.interests.length === 0}
            className={`btn ${answers.interests.length === 0 ? "btn-outline opacity-50" : "btn-primary"} w-full inline-flex items-center justify-center gap-2`}
          >
            {isAr ? "التالي" : "Continuer"} <ArrowRightIcon size={14} />
          </button>
        </Question>
      )}

      {step === "city" && (
        <Question
          n={4}
          title={isAr ? "أين تريد الدراسة ؟" : "Où veux-tu étudier ?"}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {CITIES.map((c) => (
              <ChoiceChip
                key={c.key}
                selected={answers.city === c.key}
                onClick={() => { setAnswers((a) => ({ ...a, city: c.key })); goNext("duration"); }}
              >
                {isAr ? c.ar : c.fr}
              </ChoiceChip>
            ))}
          </div>
        </Question>
      )}

      {step === "duration" && (
        <Question
          n={5}
          title={isAr ? "كم سنة دراسة ؟" : "Combien d'années d'études ?"}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { k: "5",   fr: "Jusqu'à 5 ans",   ar: "حتى ٥ سنوات",   sub_fr: "Licence, master court", sub_ar: "ليسانس، ماستر قصير" },
              { k: "5-7", fr: "5 à 7 ans",       ar: "٥ إلى ٧ سنوات", sub_fr: "Master, ingénieur",     sub_ar: "ماستر، مهندس" },
              { k: "7+",  fr: "Plus de 7 ans",   ar: "أكثر من ٧",     sub_fr: "Médecine, doctorat",    sub_ar: "طب، دكتوراه" },
            ].map((d) => (
              <button
                key={d.k}
                onClick={() => { setAnswers((a) => ({ ...a, duration: d.k as Answers["duration"] })); goNext("result"); }}
                className={`rounded-card border p-5 text-center transition-all hover:shadow-card-hover ${
                  answers.duration === d.k
                    ? "border-fg bg-surface-3"
                    : "border-line bg-surface hover:border-fg/40"
                }`}
              >
                <div className="font-semibold text-fg mb-1">{isAr ? d.ar : d.fr}</div>
                <div className="text-xs text-fg-soft">{isAr ? d.sub_ar : d.sub_fr}</div>
              </button>
            ))}
          </div>
        </Question>
      )}

      {step === "result" && (
        <div>
          <div className="text-center mb-6">
            <span className="eyebrow mb-2 block">{isAr ? "النتائج" : "Résultats"}</span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-fg mb-2">
              {isAr ? "الجامعات المقترحة لك" : "Voici ce qui te correspond"}
            </h2>
            <p className="text-sm text-fg-soft">{isAr ? "بناءً على إجاباتك" : "D'après tes réponses"}</p>
          </div>

          {top.length === 0 ? (
            <div className="text-center py-8 text-fg-soft">
              {isAr
                ? "لم نجد تطابقاً قوياً. جرّب توسيع اختياراتك."
                : "Aucune correspondance forte. Essaie d'élargir tes choix."}
            </div>
          ) : (
            <div className="space-y-3">
              {top.map(({ uni, score, reasons }, i) => (
                <Link
                  key={uni.slug}
                  href={`/fac/universites/${uni.slug}` as never}
                  className="block bg-surface border border-line rounded-card p-5 hover:shadow-card-hover hover:border-fg/40 transition"
                >
                  <div className="flex items-start gap-4">
                    {/* Rank badge */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-surface-3 text-fg font-bold flex items-center justify-center">
                        {i + 1}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-fg-faint mt-1">{score} pts</div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-fg text-base md:text-lg leading-tight">
                        {isAr ? uni.name_ar : uni.name_fr}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-fg-soft mt-1">
                        <MapPinIcon size={12} />
                        <span>{uni.city}</span>
                        {uni.min_avg !== undefined && (
                          <>
                            <span className="text-fg-faint mx-1">·</span>
                            <span>{isAr ? "معدل ≥" : "Moy. ≥"} {uni.min_avg}</span>
                          </>
                        )}
                      </div>
                      <p className="text-sm text-fg-soft mt-2">{isAr ? uni.highlight_ar : uni.highlight_fr}</p>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {reasons.map((r, j) => (
                          <span
                            key={j}
                            className="text-[11px] font-medium bg-surface-3 border border-line px-2 py-0.5 rounded-full text-fg-soft"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>

                    <ArrowIcon size={16} className="text-fg-faint mt-1.5 flex-shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mt-7">
            <button onClick={restart} className="btn btn-outline flex-1">
              {isAr ? "إعادة" : "Recommencer"}
            </button>
            <Link href="/fac/universites" className="btn btn-primary flex-1 inline-flex items-center justify-center gap-2">
              {isAr ? "كل الجامعات" : "Toutes les universités"} <ArrowRightIcon size={14} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Step header — number + title + optional sub. Numbered to remind the user
 * where they are in the wizard without relying on icons.
 */
function Question({ n, title, sub, children }: { n: number; title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-mono font-semibold text-fg-faint">{String(n).padStart(2, "0")}</span>
        <span className="h-px flex-1 bg-line" />
      </div>
      <h2 className="text-xl md:text-2xl font-bold tracking-tight text-fg mb-1">{title}</h2>
      {sub && <p className="text-sm text-fg-soft mb-5">{sub}</p>}
      {children}
    </div>
  );
}

/** Typography-only choice chip — shared between bac/interest/city steps. */
function ChoiceChip({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-card border px-4 py-3 text-start text-sm md:text-base font-medium transition-all hover:shadow-card-hover ${
        selected
          ? "border-fg bg-surface-3 text-fg"
          : "border-line bg-surface text-fg hover:border-fg/40"
      }`}
    >
      {children}
    </button>
  );
}
