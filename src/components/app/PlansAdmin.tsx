"use client";

import { AdminCrudTable, type ColumnDef, type FieldDef } from "@/components/app/AdminCrudTable";

export interface PlanRow {
  id: string;
  name_fr: string;
  name_ar: string | null;
  amount_dzd: number;
  period: "monthly" | "annual" | "one_time";
  description_fr: string | null;
  description_ar: string | null;
  active: boolean;
}

const PERIOD_LABEL: Record<string, string> = {
  monthly: "Mensuel",
  annual: "Annuel",
  one_time: "Paiement unique",
};

const columns: ColumnDef<PlanRow>[] = [
  { key: "id", label: "ID", className: "font-mono text-xs" },
  { key: "name_fr", label: "Nom" },
  {
    key: "amount_dzd",
    label: "Prix",
    render: (r) => (
      <span className="font-semibold text-fg tabular-nums">
        {r.amount_dzd.toLocaleString("fr-DZ")} DA
      </span>
    ),
  },
  { key: "period", label: "Période", render: (r) => PERIOD_LABEL[r.period] ?? r.period },
  {
    key: "active",
    label: "Actif",
    render: (r) => (
      <span className={r.active ? "text-green-600 font-bold" : "text-fg-faint"}>
        {r.active ? "✓" : "—"}
      </span>
    ),
  },
];

const formFields: FieldDef[] = [
  { key: "id", label: "Identifiant (slug)", type: "text", required: true, placeholder: "eleve_monthly", helpText: "Utilisé par le paiement. Minuscules, _ autorisé. Ne pas changer sur un plan en vente." },
  { key: "name_fr", label: "Nom (FR)", type: "text", required: true },
  { key: "name_ar", label: "Nom (AR)", type: "text" },
  { key: "amount_dzd", label: "Prix (DZD, sans décimales)", type: "number", required: true, placeholder: "990" },
  {
    key: "period",
    label: "Période",
    type: "select",
    required: true,
    options: [
      { value: "monthly", label: "Mensuel" },
      { value: "annual", label: "Annuel" },
      { value: "one_time", label: "Paiement unique" },
    ],
  },
  { key: "description_fr", label: "Description (FR)", type: "textarea" },
  { key: "description_ar", label: "Description (AR)", type: "textarea" },
  { key: "active", label: "Actif (visible sur /tarifs)", type: "boolean" },
];

export function PlansAdmin({ initialRows }: { initialRows: PlanRow[] }) {
  return (
    <AdminCrudTable<PlanRow>
      endpoint="/api/admin/plans"
      initialRows={initialRows}
      columns={columns}
      formFields={formFields}
      newButtonText="+ Nouveau plan"
      emptyText="Aucun plan. Crée le premier ci-dessus."
      rowToInitialValues={(r) => ({
        id: r.id,
        name_fr: r.name_fr,
        name_ar: r.name_ar ?? "",
        amount_dzd: r.amount_dzd,
        period: r.period,
        description_fr: r.description_fr ?? "",
        description_ar: r.description_ar ?? "",
        active: r.active,
      })}
    />
  );
}
