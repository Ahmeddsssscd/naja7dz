import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/app/AppShell";
import { ChangePasswordForm } from "@/components/app/ChangePasswordForm";

export const metadata = { title: "Changer mon mot de passe" };

export default async function ChangePasswordPage() {
  const t = await getTranslations("ChangePassword");
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  const { data: profile } = await supabase
    .from("parent_profiles").select("full_name").eq("user_id", user.id).maybeSingle();

  return (
    <AppShell active="settings" parentName={profile?.full_name ?? ""}>
      <div className="max-w-md">
        <h1 className="text-2xl md:text-3xl font-bold text-fg mb-2">{t("page_title")}</h1>
        <p className="text-fg-soft mb-8">{t("page_subtitle")}</p>
        <ChangePasswordForm />
      </div>
    </AppShell>
  );
}
