import { getTranslations, getLocale } from "next-intl/server";
import { AdminShell, requireAdmin } from "@/components/app/AdminShell";
import { createAdminClient } from "@/lib/supabase/server";

export const metadata = { title: "Admin · Revenus" };

export default async function AdminRevenue() {
  const t = await getTranslations("Admin");
  const tc = await getTranslations("Checkout");
  const locale = await getLocale();
  const { profile } = await requireAdmin();
  const admin = createAdminClient();

  const { data: payments } = await admin
    .from("checkout_sessions")
    .select("plan_id, amount_dzd, status, paid_at, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  const totalRevenue = (payments ?? [])
    .filter((p) => p.status === "paid")
    .reduce((s, p) => s + (p.amount_dzd ?? 0), 0);

  const counts: Record<string, number> = (payments ?? []).reduce(
    (acc: Record<string, number>, p) => ({ ...acc, [p.status]: (acc[p.status] ?? 0) + 1 }),
    {} as Record<string, number>,
  );

  const isAr = locale === "ar";
  const fmt = (n: number) => n.toLocaleString(isAr ? "ar-DZ" : "fr-DZ");

  return (
    <AdminShell active="revenue" adminName={profile.full_name}>
      <h1 className="text-2xl md:text-3xl font-bold text-fg mb-2">{t("revenue_title")}</h1>
      <p className="text-fg-soft mb-8">{t("revenue_subtitle")}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Stat label={t("revenue_total")} value={<><bdi>{fmt(totalRevenue)}</bdi> {tc("currency")}</>} />
        <Stat label={t("revenue_paid_count")} value={counts.paid ?? 0} />
        <Stat label={t("kpi_speeches_hint")} value={counts.pending ?? 0} />
        <Stat label={t("revenue_active_subs")} value={(counts.failed ?? 0) + (counts.cancelled ?? 0)} />
      </div>

      <div className="bg-surface border border-line rounded-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line">
              <th className="text-start font-semibold text-fg-soft p-4 text-xs uppercase tracking-wider">{t("th_plan")}</th>
              <th className="text-start font-semibold text-fg-soft p-4 text-xs uppercase tracking-wider">{t("th_amount")}</th>
              <th className="text-start font-semibold text-fg-soft p-4 text-xs uppercase tracking-wider">{t("th_status")}</th>
              <th className="text-start font-semibold text-fg-soft p-4 text-xs uppercase tracking-wider">{t("th_date")}</th>
            </tr>
          </thead>
          <tbody>
            {(payments ?? []).map((p, i) => (
              <tr key={i} className="border-b last:border-b-0 border-line">
                <td className="p-4 text-fg">{p.plan_id}</td>
                <td className="p-4 text-fg font-semibold"><bdi>{p.amount_dzd ? fmt(p.amount_dzd) : "—"}</bdi> {tc("currency")}</td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    p.status === "paid" ? "bg-green-100 dark:bg-green-950/40 text-green-900 dark:text-green-300"
                    : p.status === "pending" ? "bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300"
                    : "bg-red-100 dark:bg-red-950/40 text-red-900 dark:text-red-300"
                  }`}>
                    {p.status}
                  </span>
                </td>
                <td className="p-4 text-fg-soft text-xs">
                  {new Date(p.paid_at ?? p.created_at).toLocaleDateString(isAr ? "ar-DZ" : "fr-FR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!payments || payments.length === 0) && (
          <div className="p-12 text-center text-fg-soft">{t("revenue_empty")}</div>
        )}
      </div>
    </AdminShell>
  );
}

function Stat({ label, value }: { label: string; value: number | string | React.ReactNode }) {
  return (
    <div className="bg-surface border border-line rounded-card p-5">
      <div className="text-xs font-semibold text-fg-soft uppercase tracking-wider mb-2">{label}</div>
      <div className="text-xl font-bold text-fg leading-none">{value}</div>
    </div>
  );
}
