import { AdminShell, requireAdmin } from "@/components/app/AdminShell";
import { createAdminClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/routing";
import { AdabCrud, type AdabRow } from "@/components/app/crud/AdabCrud";

export const metadata = { title: "Admin · Adab" };

export default async function AdminAdabPage() {
  const { profile } = await requireAdmin();
  const admin = createAdminClient();
  const { data: rows } = await admin.from("adab_lessons").select("*").order("sort_order");

  return (
    <AdminShell active="content" adminName={profile.full_name}>
      <div className="mb-6">
        <Link href="/admin/contenu" className="text-sm text-fg-soft hover:text-fg">← Retour au contenu</Link>
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-fg mb-2">Bonnes manières (Adab)</h1>
      <p className="text-fg-soft mb-8">
        Leçons de bonnes manières affichées sur /petits/monde-reel/adab.
      </p>

      <AdabCrud initialRows={(rows ?? []) as AdabRow[]} />
    </AdminShell>
  );
}
