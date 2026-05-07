import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/app/AppShell";

export const metadata = { title: "Rapports" };

export default async function ReportsPage() {
  const t = await getTranslations("ParentReports");
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: profile } = await supabase
    .from("parent_profiles")
    .select("full_name")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <AppShell active="reports" parentName={profile?.full_name ?? ""}>
      <div className="max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-bold text-fg mb-2">{t("page_title")}</h1>
        <p className="text-fg-soft mb-8">{t("subtitle")}</p>
        <div className="bg-surface border border-line rounded-card p-12 text-center">
          <p className="text-fg-soft mb-2 text-base">{t("empty_title")}</p>
          <p className="text-xs text-fg-faint">{t("empty_text")}</p>
        </div>
      </div>
    </AppShell>
  );
}
