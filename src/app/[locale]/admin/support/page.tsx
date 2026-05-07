import { getTranslations } from "next-intl/server";
import { AdminShell, requireAdmin } from "@/components/app/AdminShell";

export const metadata = { title: "Admin · Support" };

export default async function AdminSupport() {
  const t = await getTranslations("Admin");
  const { profile } = await requireAdmin();
  return (
    <AdminShell active="support" adminName={profile.full_name}>
      <h1 className="text-2xl md:text-3xl font-bold text-fg mb-2">{t("support_title")}</h1>
      <div className="bg-surface border border-line rounded-card p-12 text-center text-fg-soft">
        {t("support_placeholder")}
      </div>
    </AdminShell>
  );
}
