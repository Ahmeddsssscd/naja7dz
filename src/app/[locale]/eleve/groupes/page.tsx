import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { StudentShell } from "@/components/app/StudentShell";
import { GroupsManager } from "@/components/app/GroupsManager";

export const metadata = { title: "Groupes d'étude" };

export default async function GroupsPage() {
  const t = await getTranslations("EleveGroupes");
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: child } = await supabase
    .from("children").select("*").eq("parent_id", user.id).limit(1).maybeSingle();

  return (
    <StudentShell active="profile" childName={child?.full_name} childGrade={child?.grade}>
      <h1 className="text-2xl font-bold text-fg mb-2">{t("page_title")}</h1>
      <p className="text-fg-soft text-sm mb-6">{t("subtitle")}</p>

      <GroupsManager />
    </StudentShell>
  );
}
