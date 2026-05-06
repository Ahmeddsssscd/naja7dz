import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { MockExamMode } from "@/components/app/MockExamMode";

export const metadata = { title: "Examen blanc" };

export default async function MockExamPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  return <MockExamMode examTitle="Bac blanc — Mathématiques (Sciences expérimentales)" durationMinutes={240} questionCount={6} />;
}
