import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { ColoringGame } from "@/components/app/ColoringGame";

export const metadata = { title: "Coloriage magique" };

export default async function ColoringPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  return <ColoringGame />;
}
