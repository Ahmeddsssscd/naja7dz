import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { QuizPlayer } from "@/components/app/QuizPlayer";

const DEMO_QUESTIONS = [
  { id: "q1", prompt: "Quelle est la solution de l'équation 2x + 6 = 14 ?", options: ["x = 2", "x = 4", "x = 6", "x = 10"], correctIndex: 1, explanation: "On isole x : 2x = 14 − 6 = 8, donc x = 8/2 = 4. Vérification : 2(4) + 6 = 14 ✓" },
  { id: "q2", prompt: "Quel est le résultat de (−3)² ?", options: ["−9", "−6", "6", "9"], correctIndex: 3, explanation: "(−3)² = (−3) × (−3) = 9. Le carré d'un nombre négatif est positif." },
  { id: "q3", prompt: "Si f(x) = 3x − 2, que vaut f(5) ?", options: ["10", "13", "15", "17"], correctIndex: 1, explanation: "f(5) = 3(5) − 2 = 15 − 2 = 13." },
  { id: "q4", prompt: "Quel est le périmètre d'un rectangle de longueur 7 cm et largeur 4 cm ?", options: ["11 cm", "22 cm", "28 cm", "44 cm"], correctIndex: 1, explanation: "Périmètre = 2 × (L + l) = 2 × (7 + 4) = 22 cm." },
  { id: "q5", prompt: "Combien font 25 % de 80 ?", options: ["15", "20", "25", "30"], correctIndex: 1, explanation: "25 % de 80 = 80 × 0,25 = 20." },
];

export const metadata = { title: "Quiz" };

export default async function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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

  return (
    <QuizPlayer
      quizId={id}
      childId={child?.id ?? null}
      title="Mathématiques · Équations du 1er degré"
      questions={DEMO_QUESTIONS}
    />
  );
}
