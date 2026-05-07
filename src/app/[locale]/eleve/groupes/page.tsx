import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { StudentShell } from "@/components/app/StudentShell";

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

      <div className="bg-surface border border-line rounded-card p-6 mb-6">
        <h2 className="font-semibold text-fg mb-3">{t("create_section")}</h2>
        <p className="text-fg-soft text-sm mb-4">{t("create_text")}</p>
        <button className="btn btn-primary" disabled>
          {t("create_btn")}
        </button>
      </div>

      <div className="bg-surface border border-line rounded-card p-6 mb-6">
        <h2 className="font-semibold text-fg mb-3">{t("join_section")}</h2>
        <p className="text-fg-soft text-sm mb-4">{t("join_text")}</p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder={t("code_placeholder")}
            maxLength={8}
            className="flex-1 h-11 px-4 bg-surface border border-line-strong rounded-btn text-fg uppercase tracking-widest font-mono focus:outline-none focus:border-fg"
            disabled
          />
          <button className="btn btn-primary" disabled>{t("join_btn")}</button>
        </div>
      </div>

      <div className="bg-surface border border-line rounded-card p-8 text-center">
        <p className="text-fg-soft mb-2">{t("no_groups_title")}</p>
        <p className="text-xs text-fg-faint">{t("no_groups_hint")}</p>
      </div>
    </StudentShell>
  );
}
