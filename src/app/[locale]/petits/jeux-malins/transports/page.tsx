import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { Transports } from "@/components/app/games/Transports";
import { requireKidsAccess } from "@/lib/subscriptions";

export const metadata = { title: "Les transports" };

export default async function TransportsPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  await requireKidsAccess(user.id);
  return <Transports />;
}
