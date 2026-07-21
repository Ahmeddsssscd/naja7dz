"use client";

/**
 * Shows the chapter lesson (if one exists) before dropping the student
 * into the quiz. Chapters without lesson content skip straight to the quiz.
 *
 * Lesson text is stored as plain text with line breaks in
 * chapters.lesson_fr / lesson_ar (migration 017) and rendered with
 * whitespace-pre-line — no markdown parser needed.
 */

import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { QuizRunner } from "@/components/app/QuizRunner";

interface Props {
  title: string;
  lesson: string | null;
  chapterId: string;
  childId: string | null;
  locale: "fr" | "ar";
}

export function LessonThenQuiz({ title, lesson, chapterId, childId, locale }: Props) {
  const router = useRouter();
  const [phase, setPhase] = useState<"lesson" | "quiz">(lesson ? "lesson" : "quiz");
  const isAr = locale === "ar";

  if (phase === "quiz") {
    return <QuizRunner title={title} chapterId={chapterId} childId={childId} locale={locale} />;
  }

  return (
    <div className="min-h-screen bg-surface-2 py-8 px-5">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => router.back()}
          className="text-sm text-fg-soft hover:text-fg mb-4 inline-flex items-center gap-1"
        >
          ← {isAr ? "رجوع" : "Retour"}
        </button>

        <div className="bg-surface border border-line rounded-card overflow-hidden">
          <div className="bg-navy px-6 py-5">
            <div className="text-gold text-xs font-bold uppercase tracking-wider mb-1">
              {isAr ? "الدرس" : "Leçon"}
            </div>
            <h1 className="text-white text-xl font-bold leading-tight">{title}</h1>
          </div>
          <div className="p-6 md:p-8">
            <p className="text-fg text-[15px] leading-relaxed whitespace-pre-line">
              {lesson}
            </p>
          </div>
          <div className="border-t border-line px-6 py-5 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <span className="text-sm text-fg-soft">
              {isAr ? "جاهز؟ اختبر فهمك الآن." : "Prêt ? Teste ta compréhension maintenant."}
            </span>
            <button onClick={() => setPhase("quiz")} className="btn btn-primary">
              {isAr ? "ابدأ الاختبار ←" : "Commencer le quiz →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
