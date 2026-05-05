import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { TutorChat } from "@/components/app/TutorChat";

export const metadata = { title: "Tuteur — Najaح" };

export default async function TutorPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  return <TutorChat />;
}
