import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { requireKidsAccess } from "@/lib/subscriptions";
import { EnglishListenPick } from "@/components/app/games/english/EnglishListenPick";

export const metadata = { title: "English – Listen & Pick" };

export default async function Page() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  await requireKidsAccess(user.id);
  return <EnglishListenPick />;
}
