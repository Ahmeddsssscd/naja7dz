import { AdminShell, requireAdmin } from "@/components/app/AdminShell";
import { createAdminClient } from "@/lib/supabase/server";
import { AdminCrudTable, type ColumnDef, type FieldDef } from "@/components/app/AdminCrudTable";
import { Link } from "@/i18n/routing";

export const metadata = { title: "Admin · Chapitres" };

interface ChapterRow {
  id: string;
  subject_id: string;
  slug: string;
  title_fr: string;
  title_ar: string | null;
  description_fr: string | null;
  sort_order: number;
  // Supabase returns embedded relations as either object or array depending
  // on the FK shape. Both shapes get handled by the render() below.
  subjects?: { name_fr: string; grade_code: string } | { name_fr: string; grade_code: string }[] | null;
}

const COLUMNS: ColumnDef<ChapterRow>[] = [
  {
    key: "subjects",
    label: "Matière",
    render: (r) => {
      const s = Array.isArray(r.subjects) ? r.subjects[0] : r.subjects;
      return s ? (
        <span className="text-fg-soft">
          <span className="font-mono text-xs">{s.grade_code}</span> · {s.name_fr}
        </span>
      ) : <span className="text-fg-faint">—</span>;
    },
  },
  { key: "slug", label: "Slug", className: "font-mono text-xs" },
  { key: "title_fr", label: "Titre (FR)", render: (r) => <span className="text-fg font-medium">{r.title_fr}</span> },
  {
    key: "title_ar",
    label: "Titre (AR)",
    render: (r) => r.title_ar ? <span dir="rtl" className="text-fg-soft">{r.title_ar}</span> : <span className="text-fg-faint">—</span>,
  },
  { key: "sort_order", label: "Ordre", className: "w-16" },
];

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

  const fields: FieldDef[] = [
    {
      key: "subject_id",
      label: "Matière",
      type: "select",
      required: true,
      width: "full",
      options: (subjects ?? []).map((s) => ({
        value: s.id,
        label: `${s.grade_code} · ${s.name_fr}`,
      })),
    },
    { key: "slug", label: "Slug", type: "text", required: true, placeholder: "equations-1er-degre", width: "half",
      helpText: "Identifiant URL en lettres/chiffres/tirets uniquement." },
    { key: "sort_order", label: "Ordre", type: "number", placeholder: "0", width: "half" },
    { key: "title_fr", label: "Titre (français)", type: "text", required: true, placeholder: "Équations du 1er degré", width: "half" },
    { key: "title_ar", label: "Titre (arabe)", type: "text", placeholder: "معادلات الدرجة الأولى", width: "half" },
    { key: "description_fr", label: "Description (français)", type: "textarea",
      placeholder: "Résoudre des équations linéaires à une inconnue.", width: "full" },
  ];

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
          ⚠️ Aucune matière définie. <Link href="/admin/contenu/matieres" className="underline font-semibold">Crée d&apos;abord les matières</Link>.
        </div>
      )}

      <AdminCrudTable<ChapterRow>
        endpoint="/api/admin/chapters"
        initialRows={(rows ?? []) as ChapterRow[]}
        columns={COLUMNS}
        formFields={fields}
        emptyText="Aucun chapitre."
        newButtonText="+ Nouveau chapitre"
        rowToInitialValues={(r) => ({
          subject_id: r.subject_id,
          slug: r.slug,
          title_fr: r.title_fr,
          title_ar: r.title_ar ?? "",
          description_fr: r.description_fr ?? "",
          sort_order: r.sort_order,
        })}
      />
    </AdminShell>
  );
}
