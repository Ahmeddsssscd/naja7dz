import { AdminShell, requireAdmin } from "@/components/app/AdminShell";
import { createAdminClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/routing";
import { ChapitresCrud, type ChapterRow, type SubjectOption } from "@/components/app/crud/ChapitresCrud";

export const metadata = { title: "Admin · Chapitres" };

export default async function AdminChaptersPage() {
  const { profile } = await requireAdmin();
  const admin = createAdminClient();
  const [{ data: rows }, { data: subjects }] = await Promise.all([
    admin
      .from("chapters")
      .select("id, subject_id, slug, title_fr, title_ar, description_fr, sort_order, subjects(name_fr, grade_code)")
      .order("sort_order"),
    admin
      .from("subjects")
      .select("id, name_fr, grade_code")
      .order("grade_code")
      .order("sort_order"),
  ]);

  return (
    <AdminShell active="content" adminName={profile.full_name}>
      <div className="mb-6">
        <Link href="/admin/contenu" className="text-sm text-fg-soft hover:text-fg">← Retour au contenu</Link>
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-fg mb-2">Chapitres</h1>
      <p className="text-fg-soft mb-8">
        Chaque chapitre est rattaché à une matière. Les élèves voient les chapitres dans leur matière.
      </p>

      {!subjects?.length && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-300 rounded-card p-4 mb-6 text-sm">
          Aucune matière définie. <Link href="/admin/contenu/matieres" className="underline font-semibold">Crée d&apos;abord les matières</Link>.
        </div>
      )}

      <ChapitresCrud
        initialRows={(rows ?? []) as ChapterRow[]}
        subjectOptions={(subjects ?? []) as SubjectOption[]}
      />
    </AdminShell>
  );
}
