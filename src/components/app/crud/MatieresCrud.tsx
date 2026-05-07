"use client";

import { AdminCrudTable, type ColumnDef, type FieldDef } from "@/components/app/AdminCrudTable";

export interface SubjectRow {
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
  {
    key: "name_ar",
    label: "Nom (AR)",
    render: (r) => r.name_ar
      ? <span dir="rtl" className="text-fg-soft">{r.name_ar}</span>
      : <span className="text-fg-faint">—</span>,
  },
  { key: "sort_order", label: "Ordre", className: "w-20" },
];

const FIELDS: FieldDef[] = [
  { key: "grade_code", label: "Niveau", type: "select", required: true, width: "half",
    options: GRADES.map((g) => ({ value: g, label: g })) },
  { key: "sort_order", label: "Ordre d'affichage", type: "number", placeholder: "0", width: "half" },
  { key: "name_fr", label: "Nom (français)", type: "text", required: true, placeholder: "Mathématiques", width: "half" },
  { key: "name_ar", label: "Nom (arabe)", type: "text", placeholder: "الرياضيات", width: "half" },
];

export function MatieresCrud({ initialRows }: { initialRows: SubjectRow[] }) {
  return (
    <AdminCrudTable<SubjectRow>
      endpoint="/api/admin/subjects"
      initialRows={initialRows}
      columns={COLUMNS}
      formFields={FIELDS}
      emptyText="Aucune matière. Crée la première ci-dessus."
      newButtonText="+ Nouvelle matière"
    />
  );
}
