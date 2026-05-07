import { getTranslations } from "next-intl/server";
import { AdminShell, requireAdmin } from "@/components/app/AdminShell";

export const metadata = { title: "Admin · Récompenses" };

export default async function AdminRewards() {
  const t = await getTranslations("Admin");
  const { profile } = await requireAdmin();
  return (
    <AdminShell adminName={profile.full_name}>
      <h1 className="text-2xl md:text-3xl font-bold text-fg mb-2">{t("rewards_title")}</h1>
      <p className="text-fg-soft mb-8">{t("rewards_subtitle")}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Stat label={t("rewards_eligible")} value="—" />
        <Stat label={t("rewards_active")} value="0" />
        <Stat label={t("rewards_completed")} value="0" />
      </div>

      <div className="bg-surface border border-line rounded-card p-8 text-center">
        <p className="text-xs text-fg-faint">{t("rewards_criteria")}</p>
      </div>
    </AdminShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface border border-line rounded-card p-5">
      <div className="text-xs font-semibold text-fg-soft uppercase tracking-wider mb-2">{label}</div>
      <div className="text-2xl font-bold text-fg">{value}</div>
    </div>
  );
}
