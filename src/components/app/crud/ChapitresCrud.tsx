"use client";

import { AdminCrudTable, type ColumnDef, type FieldDef } from "@/components/app/AdminCrudTable";

export interface ChapterRow {
  id: string;
  subject_id: string;
  slug: string;
  title_fr: string;
  title_ar: string | null;
  description_fr: string | null;
  sort_order: number;
  subjects?:
    | { name_fr: string; grade_code: string }
    | { name_fr: string; grade_code: string }[]
    | null;
}

export interface SubjectOption {
  id: string;
  name_fr: string;
  grade_code: string;
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
      ) : (
        <span className="text-fg-faint">—</span>
      );
    },
  },
  { key: "slug", label: "Slug", className: "font-mono text-xs" },
  {
    key: "title_fr",
    label: "Titre (FR)",
    render: (r) => <span className="text-fg font-medium">{r.title_fr}</span>,
  },
  {
    key: "title_ar",
    label: "Titre (AR)",
    render: (r) =>
      r.title_ar ? (
        <span dir="rtl" className="text-fg-soft">{r.title_ar}</span>
      ) : (
        <span className="text-fg-faint">—</span>
      ),
  },
  { key: "sort_order", label: "Ordre", className: "w-16" },
];

export function ChapitresCrud({
  initialRows,
  subjectOptions,
}: {
  initialRows: ChapterRow[];
  subjectOptions: SubjectOption[];
}) {
  const fields: FieldDef[] = [
    {
      key: "subject_id",
      label: "Matière",
      type: "select",
      required: true,
      width: "full",
      options: subjectOptions.map((s) => ({
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
    <AdminCrudTable<ChapterRow>
      endpoint="/api/admin/chapters"
      initialRows={initialRows}
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
  );
}
