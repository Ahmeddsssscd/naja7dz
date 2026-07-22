import { AdminShell, requireAdmin } from "@/components/app/AdminShell";
import { createAdminClient } from "@/lib/supabase/server";
import { WaitlistExport } from "@/components/app/WaitlistExport";

export const metadata = { title: "Admin · Liste d'attente" };

export default async function WaitlistPage() {
  const { profile } = await requireAdmin();
  const admin = createAdminClient();
  const { data: rows } = await admin
    .from("early_access_signups")
    .select("id, email, locale, source, created_at")
    .order("created_at", { ascending: false })
    .limit(2000);

  const signups = rows ?? [];
  const last7 = signups.filter(
    (s) => new Date(s.created_at).getTime() > Date.now() - 7 * 24 * 3600 * 1000,
  ).length;

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("fr-DZ", { year: "numeric", month: "short", day: "numeric" });

  return (
    <AdminShell active="waitlist" adminName={profile.full_name}>
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-fg mb-1">Liste d&apos;attente</h1>
          <p className="text-fg-soft">
            Emails capturés avant lancement depuis la page d&apos;accueil et le blog.
          </p>
        </div>
        <WaitlistExport
          emails={signups.map((s) => s.email)}
          csv={"email,locale,source,date\n" + signups.map((s) =>
            `${s.email},${s.locale},${s.source ?? ""},${s.created_at}`).join("\n")}
        />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        <div className="bg-surface border border-line rounded-card p-5 text-center">
          <div className="text-3xl font-bold text-fg tabular-nums">{signups.length}</div>
          <div className="text-xs text-fg-soft mt-1">Inscrits au total</div>
        </div>
        <div className="bg-surface border border-line rounded-card p-5 text-center">
          <div className="text-3xl font-bold text-gold tabular-nums">{last7}</div>
          <div className="text-xs text-fg-soft mt-1">7 derniers jours</div>
        </div>
        <div className="bg-surface border border-line rounded-card p-5 text-center col-span-2 sm:col-span-1">
          <div className="text-3xl font-bold text-fg tabular-nums">
            {signups.filter((s) => s.locale === "ar").length}
          </div>
          <div className="text-xs text-fg-soft mt-1">En arabe</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface border border-line rounded-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-surface-2/50">
              <th className="text-start text-xs uppercase tracking-wider text-fg-soft p-4">Email</th>
              <th className="text-start text-xs uppercase tracking-wider text-fg-soft p-4 w-20">Langue</th>
              <th className="text-start text-xs uppercase tracking-wider text-fg-soft p-4 w-32">Source</th>
              <th className="text-start text-xs uppercase tracking-wider text-fg-soft p-4 w-32">Date</th>
            </tr>
          </thead>
          <tbody>
            {signups.map((s) => (
              <tr key={s.id} className="border-b last:border-b-0 border-line">
                <td className="p-4 text-fg">{s.email}</td>
                <td className="p-4 text-fg-soft uppercase text-xs">{s.locale}</td>
                <td className="p-4 text-fg-soft text-xs">{s.source ?? "—"}</td>
                <td className="p-4 text-fg-soft text-xs">{fmt(s.created_at)}</td>
              </tr>
            ))}
            {signups.length === 0 && (
              <tr>
                <td colSpan={4} className="p-12 text-center text-fg-soft">
                  Aucune inscription pour l&apos;instant.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
