"use client";

import { AdminCrudTable, type ColumnDef, type FieldDef } from "@/components/app/AdminCrudTable";

export interface AdabRow {
  id: string;
  slug: string;
  title_fr: string;
  title_ar: string | null;
  body_fr: string;
  body_ar: string | null;
  age_min: number;
  age_max: number;
  sort_order: number;
}

const COLUMNS: ColumnDef<AdabRow>[] = [
  { key: "sort_order", label: "#", className: "w-12 font-mono" },
  { key: "title_fr", label: "Titre (FR)", render: (r) => <span className="text-fg font-medium">{r.title_fr}</span> },
  {
    key: "title_ar",
    label: "Titre (AR)",
    render: (r) => r.title_ar
      ? <span dir="rtl" className="text-fg-soft">{r.title_ar}</span>
      : <span className="text-fg-faint">—</span>,
  },
  {
    key: "age_min",
    label: "Âge",
    className: "w-24",
    render: (r) => <span className="text-fg-soft">{r.age_min}–{r.age_max}</span>,
  },
];

const FIELDS: FieldDef[] = [
  { key: "slug", label: "Slug", type: "text", required: true, placeholder: "saluer", width: "half" },
  { key: "sort_order", label: "Ordre", type: "number", placeholder: "0", width: "half" },
  { key: "title_fr", label: "Titre (français)", type: "text", required: true, placeholder: "Saluer", width: "half" },
  { key: "title_ar", label: "Titre (arabe)", type: "text", placeholder: "السلام", width: "half" },
  { key: "body_fr", label: "Texte (français)", type: "textarea", required: true,
    placeholder: "Quand tu rencontres quelqu'un, dis « Assalamu alaykum »…" },
  { key: "body_ar", label: "Texte (arabe)", type: "textarea",
    placeholder: "عندما تلتقي بشخص، قل «السلام عليكم»…" },
  { key: "age_min", label: "Âge min", type: "number", placeholder: "5", width: "half" },
  { key: "age_max", label: "Âge max", type: "number", placeholder: "12", width: "half" },
];

export function AdabCrud({ initialRows }: { initialRows: AdabRow[] }) {
  return (
    <AdminCrudTable<AdabRow>
      endpoint="/api/admin/adab-lessons"
      initialRows={initialRows}
      columns={COLUMNS}
      formFields={FIELDS}
      emptyText="Aucune leçon."
      newButtonText="+ Nouvelle leçon"
      rowToInitialValues={(r) => ({
        slug: r.slug,
        title_fr: r.title_fr,
        title_ar: r.title_ar ?? "",
        body_fr: r.body_fr,
        body_ar: r.body_ar ?? "",
        age_min: r.age_min,
        age_max: r.age_max,
        sort_order: r.sort_order,
      })}
    />
  );
}
