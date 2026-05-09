import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { DicteeFR } from "@/components/app/games/DicteeFR";
import { requireKidsAccess } from "@/lib/subscriptions";

export const metadata = { title: "Dictée" };

export default async function DicteeFRPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  await requireKidsAccess(user.id);
  return <DicteeFR />;
}
