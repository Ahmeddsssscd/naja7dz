"use client";

/**
 * Generic admin CRUD table. Provides:
 *   - List view of rows
 *   - Inline "+ Nouveau" form (top of table)
 *   - Edit (in-place form swap) and delete buttons per row
 *   - Optimistic state updates after API calls
 *
 * Plug in any of the /api/admin/<resource> endpoints by passing `endpoint`.
 * The shape of `columns` and `formFields` controls what's shown / edited.
 */

import { useState, useTransition } from "react";
import { toast } from "sonner";

export type FieldType = "text" | "textarea" | "number" | "boolean" | "select" | "url";

export interface ColumnDef<R> {
  key: keyof R | string;
  label: string;
  render?: (row: R) => React.ReactNode;
  className?: string;
}

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  width?: "full" | "half";
  helpText?: string;
}

export interface Props<R extends { id: string }> {
  endpoint: string;
  initialRows: R[];
  columns: ColumnDef<R>[];
  formFields: FieldDef[];
  emptyText?: string;
  newButtonText?: string;
  rowToInitialValues?: (row: R) => Record<string, unknown>;
}

export function AdminCrudTable<R extends { id: string }>({
  endpoint,
  initialRows,
  columns,
  formFields,
  emptyText = "Aucune entrée. Crée la première ci-dessus.",
  newButtonText = "+ Nouvelle entrée",
  rowToInitialValues,
}: Props<R>) {
  const [rows, setRows] = useState<R[]>(initialRows);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const refresh = async () => {
    const res = await fetch(endpoint, { cache: "no-store" });
    if (!res.ok) return;
    const json = await res.json();
    if (Array.isArray(json.rows)) setRows(json.rows);
  };

  const onCreate = async (values: Record<string, unknown>) => {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = await res.json();
    if (!res.ok) {
      toast.error(json.error ?? "Erreur");
      return false;
    }
    toast.success("Créé ✓");
    setAdding(false);
    startTransition(refresh);
    return true;
  };

  const onUpdate = async (id: string, values: Record<string, unknown>) => {
    const res = await fetch(`${endpoint}?id=${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = await res.json();
    if (!res.ok) {
      toast.error(json.error ?? "Erreur");
      return false;
    }
    toast.success("Mis à jour ✓");
    setEditingId(null);
    startTransition(refresh);
    return true;
  };

  const onDelete = async (id: string) => {
    if (!confirm("Supprimer cette entrée ?")) return;
    const res = await fetch(`${endpoint}?id=${id}`, { method: "DELETE" });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      toast.error(json.error ?? "Erreur");
      return;
    }
    toast.success("Supprimé ✓");
    setRows((cur) => cur.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        {!adding ? (
          <button
            className="btn btn-primary btn-sm"
            onClick={() => { setAdding(true); setEditingId(null); }}
            disabled={pending}
          >
            {newButtonText}
          </button>
        ) : (
          <button className="btn btn-ghost btn-sm" onClick={() => setAdding(false)}>
            Annuler
          </button>
        )}
      </div>

      {adding && (
        <div className="bg-surface border-2 border-gold rounded-card p-5">
          <h3 className="font-semibold text-fg mb-3">Nouvelle entrée</h3>
          <CrudForm
            fields={formFields}
            initial={{}}
            onCancel={() => setAdding(false)}
            onSubmit={onCreate}
          />
        </div>
      )}

      <div className="bg-surface border border-line rounded-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-surface-2/50">
              {columns.map((c) => (
                <th
                  key={String(c.key)}
                  className={`text-start font-semibold text-fg-soft uppercase tracking-wider text-xs p-4 ${c.className ?? ""}`}
                >
                  {c.label}
                </th>
              ))}
              <th className="text-end font-semibold text-fg-soft uppercase tracking-wider text-xs p-4 w-32">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <RowOrEdit
                key={r.id}
                row={r}
                columns={columns}
                editing={editingId === r.id}
                fields={formFields}
                rowToInitialValues={rowToInitialValues}
                onEdit={() => { setEditingId(r.id); setAdding(false); }}
                onCancelEdit={() => setEditingId(null)}
                onUpdate={(vals) => onUpdate(r.id, vals)}
                onDelete={() => onDelete(r.id)}
                disabled={pending}
              />
            ))}
            {rows.length === 0 && !adding && (
              <tr>
                <td colSpan={columns.length + 1} className="p-12 text-center text-fg-soft">
                  {emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface RowProps<R extends { id: string }> {
  row: R;
  columns: ColumnDef<R>[];
  editing: boolean;
  fields: FieldDef[];
  rowToInitialValues?: (row: R) => Record<string, unknown>;
  onEdit: () => void;
  onCancelEdit: () => void;
  onUpdate: (values: Record<string, unknown>) => Promise<boolean>;
  onDelete: () => void;
  disabled?: boolean;
}

function RowOrEdit<R extends { id: string }>({
  row, columns, editing, fields, rowToInitialValues, onEdit, onCancelEdit, onUpdate, onDelete, disabled,
}: RowProps<R>) {
  if (editing) {
    return (
      <tr className="border-b last:border-b-0 border-line bg-amber-50/50 dark:bg-amber-950/15">
        <td colSpan={columns.length + 1} className="p-4">
          <CrudForm
            fields={fields}
            initial={(rowToInitialValues ? rowToInitialValues(row) : (row as unknown as Record<string, unknown>))}
            onCancel={onCancelEdit}
            onSubmit={onUpdate}
          />
        </td>
      </tr>
    );
  }
  return (
    <tr className="border-b last:border-b-0 border-line">
      {columns.map((c) => (
        <td key={String(c.key)} className={`p-4 ${c.className ?? ""}`}>
          {c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key as string] ?? "—")}
        </td>
      ))}
      <td className="p-4 text-end whitespace-nowrap">
        <button onClick={onEdit} disabled={disabled} className="text-fg-soft hover:text-fg text-xs me-3">
          ✏️ Modifier
        </button>
        <button onClick={onDelete} disabled={disabled} className="text-red-500 hover:text-red-600 text-xs">
          🗑 Supprimer
        </button>
      </td>
    </tr>
  );
}

function CrudForm({
  fields, initial, onCancel, onSubmit,
}: {
  fields: FieldDef[];
  initial: Record<string, unknown>;
  onCancel: () => void;
  onSubmit: (values: Record<string, unknown>) => Promise<boolean>;
}) {
  const [values, setValues] = useState<Record<string, unknown>>(() =>
    Object.fromEntries(fields.map((f) => [f.key, initial[f.key] ?? (f.type === "boolean" ? false : "")]))
  );
  const [submitting, setSubmitting] = useState(false);

  const set = (key: string, v: unknown) => setValues((cur) => ({ ...cur, [key]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const ok = await onSubmit(values);
    setSubmitting(false);
    if (!ok) return;
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {fields.map((f) => {
        const inputClass = "w-full bg-surface border-2 border-line rounded-btn px-3 py-2 text-sm focus:outline-none focus:border-fg";
        const fullSpan = f.width === "full" || f.type === "textarea" ? "md:col-span-2" : "";
        return (
          <label key={f.key} className={`block ${fullSpan}`}>
            <span className="block text-xs font-semibold text-fg-soft uppercase tracking-wider mb-1">
              {f.label}{f.required ? " *" : ""}
            </span>
            {f.type === "textarea" && (
              <textarea
                value={String(values[f.key] ?? "")}
                onChange={(e) => set(f.key, e.target.value)}
                rows={3}
                className={inputClass}
                placeholder={f.placeholder}
                required={f.required}
              />
            )}
            {f.type === "boolean" && (
              <label className="flex items-center gap-2 mt-1.5">
                <input
                  type="checkbox"
                  checked={!!values[f.key]}
                  onChange={(e) => set(f.key, e.target.checked)}
                  className="w-4 h-4 accent-navy"
                />
                <span className="text-sm text-fg-soft">Activé</span>
              </label>
            )}
            {f.type === "select" && (
              <select
                value={String(values[f.key] ?? "")}
                onChange={(e) => set(f.key, e.target.value)}
                className={inputClass}
                required={f.required}
              >
                <option value="">— Choisir —</option>
                {(f.options ?? []).map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            )}
            {(f.type === "text" || f.type === "url") && (
              <input
                type={f.type === "url" ? "url" : "text"}
                value={String(values[f.key] ?? "")}
                onChange={(e) => set(f.key, e.target.value)}
                className={inputClass}
                placeholder={f.placeholder}
                required={f.required}
              />
            )}
            {f.type === "number" && (
              <input
                type="number"
                value={values[f.key] === "" || values[f.key] == null ? "" : String(values[f.key])}
                onChange={(e) => set(f.key, e.target.value === "" ? "" : Number(e.target.value))}
                className={inputClass}
                placeholder={f.placeholder}
                required={f.required}
              />
            )}
            {f.helpText && <span className="block text-xs text-fg-faint mt-1">{f.helpText}</span>}
          </label>
        );
      })}
      <div className="md:col-span-2 flex gap-2 justify-end pt-2">
        <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel} disabled={submitting}>
          Annuler
        </button>
        <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
          {submitting ? "Enregistrement…" : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}
