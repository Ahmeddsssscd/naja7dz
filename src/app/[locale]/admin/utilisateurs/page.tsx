import { AdminShell, requireAdmin } from "@/components/app/AdminShell";
import { createAdminClient } from "@/lib/supabase/server";

export const metadata = { title: "Admin · Utilisateurs" };

export default async function AdminUsers() {
  const { profile } = await requireAdmin();
  const admin = createAdminClient();

  const { data: users } = await admin
    .from("parent_profiles")
    .select("user_id, full_name, phone, wilaya, language_pref, onboarded, is_admin, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <AdminShell active="users" adminName={profile.full_name}>
      <h1 className="text-2xl md:text-3xl font-bold text-fg mb-2">Utilisateurs</h1>
      <p className="text-fg-soft mb-8">50 derniers parents inscrits.</p>

      <div className="bg-surface border border-line rounded-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-start border-b border-line">
              <th className="text-start font-semibold text-fg-soft p-4 text-xs uppercase tracking-wider">Nom</th>
              <th className="text-start font-semibold text-fg-soft p-4 text-xs uppercase tracking-wider">Wilaya</th>
              <th className="text-start font-semibold text-fg-soft p-4 text-xs uppercase tracking-wider">Langue</th>
              <th className="text-start font-semibold text-fg-soft p-4 text-xs uppercase tracking-wider">Onboarded</th>
              <th className="text-start font-semibold text-fg-soft p-4 text-xs uppercase tracking-wider">Inscrit le</th>
            </tr>
          </thead>
          <tbody>
            {(users ?? []).map((u) => (
              <tr key={u.user_id} className="border-b last:border-b-0 border-line">
                <td className="p-4 text-fg font-medium">
                  {u.full_name}
                  {u.is_admin && <span className="ms-2 text-[10px] uppercase tracking-wider text-red-500 font-bold">Admin</span>}
                </td>
                <td className="p-4 text-fg-soft">{u.wilaya ?? "—"}</td>
                <td className="p-4 text-fg-soft">{u.language_pref?.toUpperCase()}</td>
                <td className="p-4">
                  {u.onboarded ? (
                    <span className="text-xs text-green-600 font-semibold">✓</span>
                  ) : (
                    <span className="text-xs text-fg-faint">—</span>
                  )}
                </td>
                <td className="p-4 text-fg-soft text-xs whitespace-nowrap">
                  {new Date(u.created_at).toLocaleDateString("fr-FR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!users || users.length === 0) && (
          <div className="p-12 text-center text-fg-soft">Aucun utilisateur pour le moment.</div>
        )}
      </div>
    </AdminShell>
  );
}
