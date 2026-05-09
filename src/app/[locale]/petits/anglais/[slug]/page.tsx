/**
 * /petits/anglais/[slug] — single lesson page (one of 8).
 *
 * The slug must match a lesson in `englishData.ts` (alphabet, numbers, …).
 * Anything else → 404. The lesson player is a client component, so we pull
 * the i18n labels here on the server and pass them in.
 */

import { redirect, notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { requireKidsAccess } from "@/lib/subscriptions";
import { EnglishLessonPlayer } from "@/components/app/games/english/EnglishLessonPlayer";
import { getLesson } from "@/components/app/games/english/englishData";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  return { title: lesson ? `English – ${lesson.slug}` : "English" };
}

export default async function EnglishLessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  await requireKidsAccess(user.id);

  const t = await getTranslations("PetitsAnglais");

  // We render strings as FR primary + AR secondary inline, because the kid
  // page-locale is FR and the section is bilingual by design.
  const labels = {
    title_fr: t(`lesson_${lesson.i18nKey}`),
    title_ar: t(`lesson_${lesson.i18nKey}_ar`),
    study_intro: t("lesson_study_intro"),
    study_intro_ar: t("lesson_study_intro_ar"),
    listen: t("listen"),
    next: t("next"),
    previous: t("previous"),
    start_quiz: t("start_quiz"),
    quiz_title: t("quiz_section_title"),
    quiz_intro: t("quiz_intro"),
    fr_to_en_prompt: t("quiz_fr_to_en"),
    en_to_fr_prompt: t("quiz_en_to_fr"),
    listen_to_text_prompt: t("quiz_listen_to_text"),
    play_again: t("play_again"),
    review_lesson: t("review_lesson"),
    back_to_hub: t("back_to_hub"),
    you_scored: t("you_scored"),
    perfect: t("perfect"),
    great: t("great"),
    keep_going: t("keep_going"),
    cards_count: t("cards_count"),
    progress: t("progress"),
  };

  return <EnglishLessonPlayer lesson={lesson} labels={labels} />;
}
