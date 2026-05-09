import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { MonAssiette } from "@/components/app/games/MonAssiette";
import { requireKidsAccess } from "@/lib/subscriptions";

export const metadata = { title: "Mon assiette" };

export default async function MonAssiettePage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  await requireKidsAccess(user.id);
  return <MonAssiette />;
}
