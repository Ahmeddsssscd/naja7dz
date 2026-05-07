import { AdminShell, requireAdmin } from "@/components/app/AdminShell";
import { createAdminClient } from "@/lib/supabase/server";
import { AdminCrudTable, type ColumnDef, type FieldDef } from "@/components/app/AdminCrudTable";
import { Link } from "@/i18n/routing";

export const metadata = { title: "Admin · Sujets de rédaction" };

interface WritingPromptRow {
  id: string;
  age_min: number;
  age_max: number;
  prompt_fr: string;
  prompt_ar: string | null;
  type: "free" | "structured";
  active: boolean;
}

const COLUMNS: ColumnDef<WritingPromptRow>[] = [
  {
    key: "age_min",
    label: "Âge",
    className: "w-28",
    render: (r) => <span className="text-fg-soft">{r.age_min}–{r.age_max} ans</span>,
  },
  { key: "prompt_fr", label: "Sujet (FR)", render: (r) => <span className="text-fg">{r.prompt_fr}</span> },
  {
    key: "prompt_ar",
    label: "Sujet (AR)",
    render: (r) => r.prompt_ar ? <span dir="rtl" className="text-fg-soft">{r.prompt_ar}</span> : <span className="text-fg-faint">—</span>,
  },
  {
    key: "type",
    label: "Type",
    className: "w-28",
    render: (r) => <span className="text-xs uppercase tracking-wider text-fg-soft">{r.type}</span>,
  },
  {
    key: "active",
    label: "Actif",
    className: "w-20",
    render: (r) => r.active ? <span className="text-green-600 font-bold">✓</span> : <span className="text-fg-faint">—</span>,
  },
];

const FIELDS: FieldDef[] = [
  { key: "age_min", label: "Âge min", type: "number", required: true, placeholder: "5", width: "half" },
  { key: "age_max", label: "Âge max", type: "number", required: true, placeholder: "10", width: "half" },
  { key: "prompt_fr", label: "Sujet (français)", type: "textarea", required: true,
    placeholder: "Décris ton plat préféré en 3 phrases." },
  { key: "prompt_ar", label: "Sujet (arabe)", type: "textarea",
    placeholder: "صف طبقك المفضل في 3 جمل." },
  { key: "type", label: "Type", type: "select", width: "half", options: [
    { value: "free", label: "Libre (free)" },
    { value: "structured", label: "Structuré" },
  ]},
  { key: "active", label: "Actif", type: "boolean", width: "half" },
];

export default async function AdminWritingPromptsPage() {
  const { profile } = await requireAdmin();
  const admin = createAdminClient();
  const { data: rows } = await admin
    .from("writing_prompts")
    .select("id, age_min, age_max, prompt_fr, prompt_ar, type, active")
    .order("created_at", { ascending: false });

  return (
    <AdminShell active="content" adminName={profile.full_name}>
      <div className="mb-6">
        <Link href="/admin/contenu" className="text-sm text-fg-soft hover:text-fg">← Retour au contenu</Link>
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-fg mb-2">Sujets de rédaction</h1>
      <p className="text-fg-soft mb-8">
        Sujets affichés sur la page « Rédaction du jour » de l&apos;élève. Filtrés par âge automatiquement.
      </p>

      <AdminCrudTable<WritingPromptRow>
        endpoint="/api/admin/writing-prompts"
        initialRows={(rows ?? []) as WritingPromptRow[]}
        columns={COLUMNS}
        formFields={FIELDS}
        emptyText="Aucun sujet."
        newButtonText="+ Nouveau sujet"
        rowToInitialValues={(r) => ({
          age_min: r.age_min,
          age_max: r.age_max,
          prompt_fr: r.prompt_fr,
          prompt_ar: r.prompt_ar ?? "",
          type: r.type,
          active: r.active,
        })}
      />
    </AdminShell>
  );
}
