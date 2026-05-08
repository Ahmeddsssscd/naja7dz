import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { MockExamMode } from "@/components/app/MockExamMode";
import { requireAccessForGrade } from "@/lib/subscriptions";

export const metadata = { title: "Examen blanc" };

export default async function MockExamPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  // Hard paywall: subscriber required.
  const _activeSub = await requireAccessForGrade(user.id, null);
  void _activeSub;

  return <MockExamMode examTitle="Bac blanc — Mathématiques (Sciences expérimentales)" durationMinutes={240} questionCount={6} />;
}
