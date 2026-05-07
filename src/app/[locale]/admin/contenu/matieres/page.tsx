import { AdminShell, requireAdmin } from "@/components/app/AdminShell";
import { createAdminClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/routing";
import { MatieresCrud, type SubjectRow } from "@/components/app/crud/MatieresCrud";

export const metadata = { title: "Admin · Matières" };

export default async function AdminSubjectsPage() {
  const { profile } = await requireAdmin();
  const admin = createAdminClient();
  const { data: rows } = await admin
    .from("subjects")
    .select("id, grade_code, name_fr, name_ar, sort_order")
    .order("grade_code")
    .order("sort_order");

  return (
    <AdminShell active="content" adminName={profile.full_name}>
      <div className="mb-6">
        <Link href="/admin/contenu" className="text-sm text-fg-soft hover:text-fg">← Retour au contenu</Link>
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-fg mb-2">Matières</h1>
      <p className="text-fg-soft mb-8">
        Définis les matières par niveau. Chaque matière contient ensuite des chapitres.
      </p>

      <MatieresCrud initialRows={(rows ?? []) as SubjectRow[]} />
    </AdminShell>
  );
}
