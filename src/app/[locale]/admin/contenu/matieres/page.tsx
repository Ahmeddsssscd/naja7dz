import { AdminShell, requireAdmin } from "@/components/app/AdminShell";
import { createAdminClient } from "@/lib/supabase/server";
import { AdminCrudTable, type ColumnDef, type FieldDef } from "@/components/app/AdminCrudTable";
import { Link } from "@/i18n/routing";

export const metadata = { title: "Admin · Matières" };

interface SubjectRow {
  id: string;
  grade_code: string;
  name_fr: string;
  name_ar: string | null;
  sort_order: number;
}

const GRADES = [
  "1AP","2AP","3AP","4AP","5AP",
  "1AM","2AM","3AM","4AM",
  "1AS","2AS","3AS",
];

const COLUMNS: ColumnDef<SubjectRow>[] = [
  { key: "grade_code", label: "Niveau", className: "w-24 font-mono" },
  { key: "name_fr", label: "Nom (FR)", render: (r) => <span className="text-fg font-medium">{r.name_fr}</span> },
  { key: "name_ar", label: "Nom (AR)", render: (r) => r.name_ar ? <span dir="rtl" className="text-fg-soft">{r.name_ar}</span> : <span className="text-fg-faint">—</span> },
  { key: "sort_order", label: "Ordre", className: "w-20" },
];

const FIELDS: FieldDef[] = [
  { key: "grade_code", label: "Niveau", type: "select", required: true, width: "half",
    options: GRADES.map((g) => ({ value: g, label: g })) },
  { key: "sort_order", label: "Ordre d'affichage", type: "number", placeholder: "0", width: "half" },
  { key: "name_fr", label: "Nom (français)", type: "text", required: true, placeholder: "Mathématiques", width: "half" },
  { key: "name_ar", label: "Nom (arabe)", type: "text", placeholder: "الرياضيات", width: "half" },
];

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

      <AdminCrudTable<SubjectRow>
        endpoint="/api/admin/subjects"
        initialRows={(rows ?? []) as SubjectRow[]}
        columns={COLUMNS}
        formFields={FIELDS}
        emptyText="Aucune matière. Crée la première ci-dessus."
        newButtonText="+ Nouvelle matière"
      />
    </AdminShell>
  );
}
