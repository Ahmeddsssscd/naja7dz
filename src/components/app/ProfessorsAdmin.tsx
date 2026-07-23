"use client";

import { AdminCrudTable, type ColumnDef, type FieldDef } from "@/components/app/AdminCrudTable";

export interface ProfessorRow {
  id: string;
  full_name: string;
  subject: string;
  wilaya: string;
  teaches_at: string | null;
  mode: string;
  teaching_types: string[] | null;
  bio: string | null;
  hourly_rate_dzd: number | null;
  verified: boolean;
  active: boolean;
  sort_order: number;
}

const MODE_LABEL: Record<string, string> = {
  in_person: "Présentiel",
  online: "En ligne",
  both: "Les deux",
};

const columns: ColumnDef<ProfessorRow>[] = [
  { key: "full_name", label: "Nom" },
  { key: "subject", label: "Matière" },
  { key: "wilaya", label: "Wilaya" },
  { key: "mode", label: "Mode", render: (r) => MODE_LABEL[r.mode] ?? r.mode },
  {
    key: "hourly_rate_dzd",
    label: "Tarif",
    render: (r) => (r.hourly_rate_dzd ? `${r.hourly_rate_dzd.toLocaleString("fr-DZ")} DA` : "—"),
  },
  {
    key: "active",
    label: "Actif",
    render: (r) => <span className={r.active ? "text-green-600 font-bold" : "text-fg-faint"}>{r.active ? "✓" : "—"}</span>,
  },
];

const formFields: FieldDef[] = [
  { key: "full_name", label: "Nom complet", type: "text", required: true, placeholder: "Pr. …" },
  { key: "subject", label: "Matière", type: "text", required: true, placeholder: "Mathématiques" },
  { key: "wilaya", label: "Wilaya", type: "text", required: true, placeholder: "Alger" },
  { key: "teaches_at", label: "Enseigne à", type: "text", placeholder: "Lycée … / Cours particuliers" },
  {
    key: "mode",
    label: "Mode",
    type: "select",
    required: true,
    options: [
      { value: "in_person", label: "Présentiel" },
      { value: "online", label: "En ligne" },
      { value: "both", label: "Les deux" },
    ],
  },
  { key: "teaching_types", label: "Types de cours", type: "text", placeholder: "school, private, online", helpText: "Séparés par des virgules. Valeurs : school (au lycée), private (cours particuliers), online (en ligne)." },
  { key: "hourly_rate_dzd", label: "Tarif horaire (DZD)", type: "number", placeholder: "1500" },
  { key: "bio", label: "Présentation", type: "textarea" },
  { key: "verified", label: "Vérifié (badge doré)", type: "boolean" },
  { key: "active", label: "Actif (visible dans l'annuaire)", type: "boolean" },
  { key: "sort_order", label: "Ordre d'affichage", type: "number" },
];

export function ProfessorsAdmin({ initialRows }: { initialRows: ProfessorRow[] }) {
  return (
    <AdminCrudTable<ProfessorRow>
      endpoint="/api/admin/professors"
      initialRows={initialRows}
      columns={columns}
      formFields={formFields}
      newButtonText="+ Nouveau professeur"
      emptyText="Aucun professeur. Ajoute le premier ci-dessus."
      rowToInitialValues={(r) => ({
        full_name: r.full_name,
        subject: r.subject,
        wilaya: r.wilaya,
        teaches_at: r.teaches_at ?? "",
        mode: r.mode,
        teaching_types: (r.teaching_types ?? []).join(", "),
        hourly_rate_dzd: r.hourly_rate_dzd ?? "",
        bio: r.bio ?? "",
        verified: r.verified,
        active: r.active,
        sort_order: r.sort_order,
      })}
    />
  );
}
