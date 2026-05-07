import { getTranslations } from "next-intl/server";
import { AdminShell, requireAdmin } from "@/components/app/AdminShell";
import { createAdminClient } from "@/lib/supabase/server";

export const metadata = { title: "Admin · Contenu" };

export default async function ContentPage() {
  const t = await getTranslations("Admin");
  const { profile } = await requireAdmin();
  const admin = createAdminClient();

  const [{ count: gradesCount }, { count: subjectsCount }, { count: chaptersCount }, { count: examsCount }] = await Promise.all([
    admin.from("grades").select("*", { count: "exact", head: true }),
    admin.from("subjects").select("*", { count: "exact", head: true }),
    admin.from("chapters").select("*", { count: "exact", head: true }),
    admin.from("exam_papers").select("*", { count: "exact", head: true }),
  ]);

  return (
    <AdminShell active="content" adminName={profile.full_name}>
      <h1 className="text-2xl md:text-3xl font-bold text-fg mb-2">{t("content_title")}</h1>
      <p className="text-fg-soft mb-8">{t("content_subtitle")}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Stat label={t("content_levels")} value={gradesCount ?? 0} />
        <Stat label={t("content_subjects")} value={subjectsCount ?? 0} />
        <Stat label={t("content_chapters")} value={chaptersCount ?? 0} />
        <Stat label={t("content_papers")} value={examsCount ?? 0} />
      </div>

      <div className="bg-surface border border-line rounded-card p-8 text-center">
        <p className="text-xs text-fg-faint">{t("content_hint")}</p>
      </div>
    </AdminShell>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-surface border border-line rounded-card p-5">
      <div className="text-xs font-semibold text-fg-soft uppercase tracking-wider mb-2">{label}</div>
      <div className="text-2xl font-bold text-fg leading-none"><bdi>{value}</bdi></div>
    </div>
  );
}
