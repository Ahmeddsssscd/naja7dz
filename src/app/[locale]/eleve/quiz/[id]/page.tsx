import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { QuizPlayer } from "@/components/app/QuizPlayer";

export const metadata = { title: "Quiz" };

export default async function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await getTranslations("EleveQuiz");
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  // Pick the active student (first child for now)
  const { data: child } = await supabase
    .from("children")
    .select("id")
    .eq("parent_id", user.id)
    .order("created_at")
    .limit(1)
    .maybeSingle();

  // Locale-aware demo questions. Math expressions are wrapped with U+2066/U+2069
  // (LRI/PDI) bidi isolates inside the AR JSON so they render LTR atomic.
  const DEMO_QUESTIONS = [
    {
      id: "q1",
      prompt: t("q1_prompt"),
      options: ["x = 2", "x = 4", "x = 6", "x = 10"],
      correctIndex: 1,
      explanation: t("q1_explanation"),
    },
    {
      id: "q2",
      prompt: t("q2_prompt"),
      options: ["−9", "−6", "6", "9"],
      correctIndex: 3,
      explanation: t("q2_explanation"),
    },
    {
      id: "q3",
      prompt: t("q3_prompt"),
      options: ["10", "13", "15", "17"],
      correctIndex: 1,
      explanation: t("q3_explanation"),
    },
    {
      id: "q4",
      prompt: t("q4_prompt"),
      options: ["11 cm", "22 cm", "28 cm", "44 cm"],
      correctIndex: 1,
      explanation: t("q4_explanation"),
    },
    {
      id: "q5",
      prompt: t("q5_prompt"),
      options: ["15", "20", "25", "30"],
      correctIndex: 1,
      explanation: t("q5_explanation"),
    },
  ];

  return (
    <QuizPlayer
      quizId={id}
      childId={child?.id ?? null}
      title={t("demo_title")}
      questions={DEMO_QUESTIONS}
    />
  );
}
