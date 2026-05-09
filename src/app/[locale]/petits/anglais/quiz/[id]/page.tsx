import { redirect, notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { requireKidsAccess } from "@/lib/subscriptions";
import { EnglishQuiz, QUIZ_IDS } from "@/components/app/games/english/EnglishQuiz";

export const metadata = { title: "English Quiz" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!QUIZ_IDS.includes(id)) notFound();

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  await requireKidsAccess(user.id);
  return <EnglishQuiz quizId={id} />;
}
