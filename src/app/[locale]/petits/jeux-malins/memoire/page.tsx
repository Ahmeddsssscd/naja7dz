import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { MemoryGrid } from "@/components/app/games/MemoryGrid";
import { requireKidsAccess } from "@/lib/subscriptions";

export const metadata = { title: "Mémoire" };

export default async function MemoryPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  // Hard paywall: kids universe is full-tier only.
  await requireKidsAccess(user.id);
  return <MemoryGrid />;
}
