import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { MathRace } from "@/components/app/games/MathRace";

export const metadata = { title: "Course aux maths" };

export default async function MathRacePage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  return <MathRace />;
}
