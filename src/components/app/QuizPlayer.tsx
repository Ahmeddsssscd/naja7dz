"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { CheckIcon } from "@/components/Icon";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { MascotCelebration } from "@/components/app/MascotCelebration";

export interface DemoQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export function QuizPlayer({
  childId,
  title,
  questions,
}: {
  quizId: string;
  childId?: string | null;
  title: string;
  questions: DemoQuestion[];
}) {
  const t = useTranslations("EleveQuiz");
  const localeStr = useLocale();
  const locale = localeStr === "ar" ? "ar" : "fr";
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [savedScorePct, setSavedScorePct] = useState<number | null>(null);
  const [startTime] = useState<number>(Date.now());
  // Track every (questionId, chosenIndex) so the server can recompute the
  // score authoritatively at /api/quiz/complete time. The client-only `score`
  // state above is just for UI/animation — we never trust it for stats.
  const [picks, setPicks] = useState<Array<{ questionId: string; chosenIndex: number }>>([]);

  const q = questions[index];
  const total = questions.length;

  const onPick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.correctIndex) setScore((s) => s + 1);
    setPicks((prev) => [...prev, { questionId: q.id, chosenIndex: i }]);
  };

  const onNext = async () => {
    if (index < total - 1) {
      setIndex((i) => i + 1);
      setPicked(null);
    } else {
      setDone(true);
      const pct = Math.round((score / total) * 100);
      setSavedScorePct(pct);

      // Celebrate above 70%
      if (pct >= 70) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#0F1B33", "#D4A72C", "#FAF9F6"],
        });
      }

      // Persist attempt to DB if we have a child to attribute it to
      if (childId) {
        try {
          const res = await fetch("/api/quiz/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              childId,
              picks,
              durationSeconds: Math.round((Date.now() - startTime) / 1000),
              language: typeof navigator !== "undefined" && navigator.language?.startsWith("ar") ? "ar" : "fr",
            }),
          });
          if (!res.ok) throw new Error("save failed");
          // Trust the server's score, not the client's. Display whichever
          // came back from the API.
          try {
            const json = await res.json();
            if (typeof json?.scorePct === "number") setSavedScorePct(json.scorePct);
          } catch { /* keep local pct */ }
          toast.success(t("saved_toast"));
        } catch {
          toast.error(t("save_failed"), {
            description: t("save_failed_hint"),
          });
        }
      }
    }
  };

  // Pulse confetti once again on mount of done state — small celebration boost
  useEffect(() => {
    if (done && savedScorePct !== null && savedScorePct === 100) {
      const tm = setTimeout(() => {
        confetti({ particleCount: 60, spread: 100, origin: { y: 0.6 }, colors: ["#D4A72C", "#FAF9F6"] });
      }, 350);
      return () => clearTimeout(tm);
    }
  }, [done, savedScorePct]);

  if (done) {
    const pct = Math.round((score / total) * 100);
    // Mascot celebrates perfect quizzes only — adds the "wow" moment kids love
    return (
      <>
        <MascotCelebration trigger={pct === 100} locale={locale} />
        <div className="min-h-screen flex items-center justify-center bg-surface-2 px-5">
          <div className="bg-surface border border-line rounded-modal p-8 max-w-md w-full text-center">
            <span className="inline-flex w-16 h-16 rounded-full bg-gold text-navy items-center justify-center mb-5">
              <CheckIcon size={32} />
            </span>
            <h2 className="text-2xl font-bold text-fg mb-2">{t("done_title")}</h2>
            <p className="text-fg-soft mb-6">{t("done_lead")}</p>
            <div className="text-5xl font-bold text-navy dark:text-cream mb-1"><bdi>{pct}%</bdi></div>
            <p className="text-sm text-fg-soft mb-8">{t("done_correct", { score, total })}</p>
            <div className="flex gap-3">
              <button onClick={() => router.push("/eleve")} className="btn btn-outline flex-1">{t("back_home")}</button>
              <button
                onClick={() => {
                  setIndex(0); setPicked(null); setScore(0); setDone(false); setSavedScorePct(null);
                }}
                className="btn btn-primary flex-1"
              >
                {t("restart")}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-surface-2 flex flex-col">
      <header className="bg-surface border-b border-line sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-5 h-16 flex items-center gap-4">
          <button onClick={() => router.push("/eleve")} className="text-fg-soft" aria-label={t("quit_aria")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-fg-soft truncate">{title}</div>
            <div className="text-xs font-semibold text-fg">{t("question_progress", { n: index + 1, total })}</div>
            <div className="h-1 bg-pale-blue dark:bg-surface-3 rounded mt-1 overflow-hidden">
              <div className="h-full bg-gold rounded transition-all" style={{ width: `${((index + 1) / total) * 100}%` }} />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-5 py-8 pb-32">
        <div className="text-xs font-semibold text-gold uppercase tracking-wider mb-3">{t("question_n", { n: index + 1 })}</div>
        <h2 className="text-xl md:text-2xl font-semibold text-fg leading-snug mb-8">{q.prompt}</h2>

        <div className="space-y-3">
          {q.options.map((opt, i) => {
            const isPickedHere = picked === i;
            const isCorrect = i === q.correctIndex;
            const showCorrect = picked !== null && isCorrect;
            const showWrong = picked !== null && isPickedHere && !isCorrect;
            const cls = showCorrect
              ? "border-green-600 bg-green-50 dark:bg-green-950/30"
              : showWrong
              ? "border-red-600 bg-red-50 dark:bg-red-950/30"
              : isPickedHere
              ? "border-fg"
              : "border-line-strong hover:border-fg";
            return (
              <button
                key={i}
                onClick={() => onPick(i)}
                disabled={picked !== null}
                className={`w-full bg-surface text-start px-5 py-4 rounded-card border-2 transition-all ${cls} ${
                  picked !== null && !isPickedHere && !isCorrect ? "opacity-60" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0 bg-cream dark:bg-surface-3 text-fg-soft">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-base text-fg">{opt}</span>
                </div>
              </button>
            );
          })}
        </div>

        {picked !== null && (
          <div className="mt-6 bg-surface border-l-4 border-gold rounded-card p-5">
            <div className="text-xs font-semibold text-gold uppercase tracking-wider mb-2">{t("explanation")}</div>
            <p className="text-fg text-sm leading-relaxed">{q.explanation}</p>
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 inset-x-0 bg-surface border-t border-line p-4">
        <div className="max-w-2xl mx-auto flex justify-between gap-3">
          <div className="flex gap-2">
            <button className="w-11 h-11 rounded-full bg-cream dark:bg-surface-3 text-fg" title={t("hint_aria")} aria-label={t("hint_aria")}>💡</button>
            <button className="w-11 h-11 rounded-full bg-cream dark:bg-surface-3 text-fg" title={t("audio_aria")} aria-label={t("audio_aria")}>🔊</button>
          </div>
          <button
            onClick={onNext}
            disabled={picked === null}
            className="btn btn-primary px-6 disabled:opacity-50"
          >
            {index === total - 1 ? t("finish") : t("next")}
          </button>
        </div>
      </footer>
    </div>
  );
}
