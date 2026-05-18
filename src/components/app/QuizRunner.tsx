"use client";

/**
 * Wraps QuizPlayer with a loading + empty-state phase.
 *
 * On mount, calls POST /api/quiz/start with chapter_id. If the chapter has
 * no question bank yet, shows a friendly "à venir" message instead of
 * dropping the user into an empty player.
 */

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { QuizPlayer, type DemoQuestion } from "@/components/app/QuizPlayer";

interface Props {
  title: string;
  chapterId: string;
  childId: string | null;
  locale: "fr" | "ar";
}

export function QuizRunner({ title, chapterId, childId, locale }: Props) {
  const t = useTranslations("EleveQuiz");
  const router = useRouter();
  const [questions, setQuestions] = useState<DemoQuestion[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/quiz/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chapter_id: chapterId, count: 5, locale }),
        });
        const json = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setError(json.error ?? t("save_failed"));
          return;
        }
        setQuestions(json.questions);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : t("save_failed"));
      }
    })();
    return () => { cancelled = true; };
  }, [chapterId, locale, t]);

  if (error) {
    return (
      <div className="min-h-screen bg-surface-2 flex items-center justify-center px-5">
        <div className="bg-surface border border-line rounded-modal p-8 max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-fg mb-2">Quiz à venir</h2>
          <p className="text-fg-soft text-sm mb-6">{error}</p>
          <button onClick={() => router.back()} className="btn btn-outline">
            {t("back_home")}
          </button>
        </div>
      </div>
    );
  }

  if (!questions) {
    // Inline shimmer matching the player layout.
    return (
      <div className="min-h-screen bg-surface-2 flex flex-col">
        <header className="bg-surface border-b border-line h-16 flex items-center px-5">
          <div className="h-3 w-40 bg-line/60 rounded animate-pulse" />
        </header>
        <main className="flex-1 max-w-2xl mx-auto w-full px-5 py-8 space-y-3">
          <div className="h-7 w-3/4 bg-line/60 rounded animate-pulse mb-6" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-line/40 rounded-card animate-pulse" />
          ))}
        </main>
      </div>
    );
  }

  // Defensive: if API returned 0 questions for some reason, show empty state
  // (the API itself returns 404 in that case, but belt-and-suspenders).
  if (!questions.length) {
    return (
      <div className="min-h-screen bg-surface-2 flex items-center justify-center px-5">
        <div className="bg-surface border border-line rounded-modal p-8 max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-fg mb-2">Quiz à venir</h2>
          <Link href="/eleve" className="btn btn-outline mt-4 inline-block">{t("back_home")}</Link>
        </div>
      </div>
    );
  }

  return (
    <QuizPlayer
      quizId={chapterId}
      childId={childId}
      title={title}
      questions={questions}
    />
  );
}
