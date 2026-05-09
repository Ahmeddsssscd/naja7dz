import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { TablesMultiplication } from "@/components/app/games/TablesMultiplication";
import { requireKidsAccess } from "@/lib/subscriptions";

export const metadata = { title: "Tables de multiplication" };

export default async function TablesPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  await requireKidsAccess(user.id);
  return <TablesMultiplication />;
}
