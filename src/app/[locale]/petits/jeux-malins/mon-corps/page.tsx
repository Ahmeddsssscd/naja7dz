import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { MonCorps } from "@/components/app/games/MonCorps";
import { requireKidsAccess } from "@/lib/subscriptions";

export const metadata = { title: "Mon corps" };

export default async function MonCorpsPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  await requireKidsAccess(user.id);
  return <MonCorps />;
}
