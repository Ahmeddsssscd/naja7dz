import { redirect } from "next/navigation";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import { LogicRiddle } from "@/components/app/games/LogicRiddle";

export const metadata = { title: "Énigme du jour — Najaح" };

export default async function RiddlePage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const admin = createAdminClient();
  const { data: riddles } = await admin.from("logic_riddles").select("*").eq("active", true);
  // Pick today's riddle deterministically based on date
  const today = new Date().toISOString().slice(0, 10);
  const idx = (today.split("-").map(Number).reduce((a, b) => a + b, 0)) % Math.max((riddles ?? []).length, 1);
  const riddle = riddles?.[idx] ?? null;

  return <LogicRiddle riddle={riddle} />;
}
