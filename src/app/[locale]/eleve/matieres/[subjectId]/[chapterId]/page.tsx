/**
 * Chapter quiz page. Server component fetches the chapter info, then renders
 * the client-side QuizRunner which calls /api/quiz/start to pull questions
 * and reuses the existing QuizPlayer.
 */
import { notFound, redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import { LessonThenQuiz } from "@/components/app/LessonThenQuiz";
import { requireAccessForGrade } from "@/lib/subscriptions";

export const metadata = { title: "Quiz" };

export default async function ChapterQuizPage({
  params,
}: {
  params: Promise<{ subjectId: string; chapterId: string }>;
}) {
  const { subjectId, chapterId } = await params;
  const locale = await getLocale();
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const admin = createAdminClient();
  const [{ data: chapter }, { data: child }] = await Promise.all([
    admin
      .from("chapters")
      .select("id, title_fr, title_ar, lesson_fr, lesson_ar, subject_id, subjects(name_fr, name_ar, grade_code)")
      .eq("id", chapterId)
      .maybeSingle(),
    supabase.from("children").select("id, full_name, grade").eq("parent_id", user.id).limit(1).maybeSingle(),
  ]);
  if (!chapter || chapter.subject_id !== subjectId) notFound();

  // Hard paywall — quizzes require an active subscription that covers the
  // child's grade. This is the most-trafficked gated route.
  await requireAccessForGrade(user.id, child?.grade);

  const isAr = locale === "ar";
  const subj = Array.isArray(chapter.subjects) ? chapter.subjects[0] : chapter.subjects;
  const title =
    `${(isAr && subj?.name_ar) || subj?.name_fr || ""} · ${(isAr && chapter.title_ar) || chapter.title_fr}`;

  const lesson = (isAr && chapter.lesson_ar) || chapter.lesson_fr || null;

  return (
    <LessonThenQuiz
      title={title}
      lesson={lesson}
      chapterId={chapterId}
      childId={child?.id ?? null}
      locale={locale === "ar" ? "ar" : "fr"}
    />
  );
}
