import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { ColoringGame } from "@/components/app/ColoringGame";
import { requireKidsAccess } from "@/lib/subscriptions";

export const metadata = { title: "Coloriage magique" };

export default async function ColoringPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  // Hard paywall: kids universe is full-tier only.
  await requireKidsAccess(user.id);
  return <ColoringGame />;
}
