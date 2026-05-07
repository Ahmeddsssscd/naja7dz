import { getTranslations } from "next-intl/server";
import { AdminShell, requireAdmin } from "@/components/app/AdminShell";
import { createAdminClient } from "@/lib/supabase/server";

export const metadata = { title: "Admin · Vue d'ensemble" };

export default async function AdminOverview() {
  const t = await getTranslations("Admin");
  const { profile } = await requireAdmin();
  const admin = createAdminClient();

  // KPI aggregations
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [
    { count: totalParents },
    { count: totalChildren },
    { count: signupsThisWeek },
    { count: activeQuizzes },
    { count: pendingSpeeches },
    { count: paidSubs },
  ] = await Promise.all([
    admin.from("parent_profiles").select("*", { count: "exact", head: true }),
    admin.from("children").select("*", { count: "exact", head: true }),
    admin.from("parent_profiles").select("*", { count: "exact", head: true }).gte("created_at", sevenDaysAgo),
    admin.from("quizzes").select("*", { count: "exact", head: true }).gte("started_at", sevenDaysAgo),
    admin.from("motivational_speeches").select("*", { count: "exact", head: true }).eq("status", "pending"),
    admin.from("checkout_sessions").select("*", { count: "exact", head: true }).eq("status", "paid"),
  ]);

  return (
    <AdminShell active="overview" adminName={profile.full_name}>
      <h1 className="text-2xl md:text-3xl font-bold text-fg mb-2">{t("overview_title")}</h1>
      <p className="text-fg-soft mb-8">{t("overview_subtitle")}</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <Kpi label={t("kpi_parents")} value={totalParents ?? 0} hint={t("kpi_parents_hint", { n: signupsThisWeek ?? 0 })} />
        <Kpi label={t("kpi_children")} value={totalChildren ?? 0} hint={t("kpi_children_hint")} />
        <Kpi label={t("kpi_quizzes")} value={activeQuizzes ?? 0} hint={t("kpi_quizzes_hint")} />
        <Kpi label={t("kpi_subs")} value={paidSubs ?? 0} hint={t("kpi_subs_hint")} />
        <Kpi label={t("kpi_speeches")} value={pendingSpeeches ?? 0} hint={t("kpi_speeches_hint")} highlight={!!pendingSpeeches && pendingSpeeches > 0} />
        <Kpi label={t("kpi_mrr")} value="—" hint={t("kpi_mrr_hint")} />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-surface border border-line rounded-card p-6">
          <h2 className="font-semibold text-fg mb-4">{t("queues_title")}</h2>
          <ul className="text-sm space-y-2">
            <Row label={t("row_speeches")} value={pendingSpeeches ?? 0} href="/admin/discours" />
            <Row label={t("row_moderation")} value={0} href="/admin/moderation" />
            <Row label={t("row_support")} value={0} href="/admin/support" />
            <Row label={t("row_ai")} value={0} href="/admin/contenu" />
          </ul>
        </div>

        <div className="bg-surface border border-line rounded-card p-6">
          <h2 className="font-semibold text-fg mb-4">{t("todo_title")}</h2>
          <ul className="text-sm text-fg-soft space-y-2">
            <li>• {t("todo_revenue")}</li>
            <li>• {t("todo_ai")}</li>
            <li>• {t("todo_speeches")}</li>
            <li>• {t("todo_support")}</li>
          </ul>
        </div>
      </div>
    </AdminShell>
  );
}

function Kpi({ label, value, hint, highlight }: { label: string; value: number | string; hint: string; highlight?: boolean }) {
  return (
    <div className={`bg-surface border rounded-card p-5 ${highlight ? "border-gold" : "border-line"}`}>
      <div className="text-xs font-semibold text-fg-soft uppercase tracking-wider mb-2">{label}</div>
      <div className="text-2xl font-bold text-fg leading-none mb-2"><bdi>{value}</bdi></div>
      <div className="text-xs text-fg-faint">{hint}</div>
    </div>
  );
}

function Row({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <li className="flex items-center justify-between py-2 border-b last:border-b-0 border-line">
      <a href={href} className="text-fg hover:text-gold transition-colors">{label}</a>
      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${value > 0 ? "bg-gold text-navy" : "bg-surface-3 text-fg-soft"}`}>
        {value}
      </span>
    </li>
  );
}
