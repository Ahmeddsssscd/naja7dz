import { AdminShell, requireAdmin } from "@/components/app/AdminShell";
import { createAdminClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/routing";
import { ExamPapersAdmin, type ExamPaperRow } from "@/components/app/ExamPapersAdmin";

export const metadata = { title: "Admin · Examens" };

export default async function AdminExamPapersPage() {
  const { profile } = await requireAdmin();
  const admin = createAdminClient();
  const { data: rows } = await admin
    .from("exam_papers")
    .select("id, exam_type, year, filiere, subject_slug, file_url, official, solution_verified_by_admin, created_at")
    .order("year", { ascending: false })
    .order("exam_type");

  return (
    <AdminShell active="content" adminName={profile.full_name}>
      <div className="mb-6">
        <Link href="/admin/contenu" className="text-sm text-fg-soft hover:text-fg">← Retour au contenu</Link>
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-fg mb-2">Sujets d&apos;examens</h1>
      <p className="text-fg-soft mb-8">
        Archive officielle Bac et BEM. Téléverse le PDF, puis remplis les métadonnées.
      </p>

      <ExamPapersAdmin initialRows={(rows ?? []) as ExamPaperRow[]} />
    </AdminShell>
  );
}
