import { getTranslations } from "next-intl/server";
import { AdminShell, requireAdmin } from "@/components/app/AdminShell";

export const metadata = { title: "Admin · Modération" };

export default async function ModerationPage() {
  const t = await getTranslations("Admin");
  const { profile } = await requireAdmin();
  return (
    <AdminShell active="moderation" adminName={profile.full_name}>
      <h1 className="text-2xl md:text-3xl font-bold text-fg mb-2">{t("moderation_title")}</h1>
      <div className="bg-surface border border-line rounded-card p-12 text-center text-fg-soft">
        {t("moderation_placeholder")}
      </div>
    </AdminShell>
  );
}
