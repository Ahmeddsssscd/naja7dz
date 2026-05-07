"use client";

/**
 * Custom CRUD UI for exam_papers — different from generic AdminCrudTable
 * because it needs an inline PDF upload step that must run before the
 * row is saved (file_url is required to be a public URL).
 */

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { AdminFileUpload } from "@/components/app/AdminFileUpload";

export interface ExamPaperRow {
  id: string;
  exam_type: "bac" | "bem";
  year: number;
  filiere: string | null;
  subject_slug: string;
  file_url: string | null;
  official: boolean;
  solution_verified_by_admin: boolean;
  created_at: string;
}

const COMMON_FILIERES = [
  "Sciences expérimentales",
  "Mathématiques",
  "Lettres et philosophie",
  "Lettres et langues étrangères",
  "Gestion et économie",
  "Techniques mathématiques",
  "Tronc commun",
];

const COMMON_SUBJECTS = [
  { slug: "math", label: "Mathématiques" },
  { slug: "physique", label: "Sciences physiques" },
  { slug: "svt", label: "Sciences naturelles (SVT)" },
  { slug: "arabe", label: "Arabe" },
  { slug: "francais", label: "Français" },
  { slug: "anglais", label: "Anglais" },
  { slug: "philosophie", label: "Philosophie" },
  { slug: "histoire-geo", label: "Histoire-géographie" },
  { slug: "sciences", label: "Sciences (BEM)" },
];

export function ExamPapersAdmin({ initialRows }: { initialRows: ExamPaperRow[] }) {
  const [rows, setRows] = useState<ExamPaperRow[]>(initialRows);
  const [adding, setAdding] = useState(false);
  const [pending, startTransition] = useTransition();

  const refresh = async () => {
    const res = await fetch("/api/admin/exam-papers", { cache: "no-store" });
    if (!res.ok) return;
    const json = await res.json();
    if (Array.isArray(json.rows)) setRows(json.rows);
  };

  const create = async (values: Omit<ExamPaperRow, "id" | "created_at" | "solution_verified_by_admin">) => {
    const res = await fetch("/api/admin/exam-papers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = await res.json();
    if (!res.ok) {
      toast.error(json.error ?? "Erreur");
      return false;
    }
    toast.success("Sujet ajouté ✓");
    setAdding(false);
    startTransition(refresh);
    return true;
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer ce sujet ?")) return;
    const res = await fetch(`/api/admin/exam-papers?id=${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Erreur");
      return;
    }
    toast.success("Supprimé ✓");
    setRows((cur) => cur.filter((r) => r.id !== id));
  };

  const toggleOfficial = async (row: ExamPaperRow) => {
    const res = await fetch(`/api/admin/exam-papers?id=${row.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        exam_type: row.exam_type,
        year: row.year,
        filiere: row.filiere,
        subject_slug: row.subject_slug,
        file_url: row.file_url,
        official: !row.official,
      }),
    });
    if (!res.ok) {
      toast.error("Erreur");
      return;
    }
    setRows((cur) => cur.map((r) => (r.id === row.id ? { ...r, official: !r.official } : r)));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        {!adding ? (
          <button className="btn btn-primary btn-sm" onClick={() => setAdding(true)} disabled={pending}>
            + Nouveau sujet
          </button>
        ) : (
          <button className="btn btn-ghost btn-sm" onClick={() => setAdding(false)}>Annuler</button>
        )}
      </div>

      {adding && <NewExamForm onCreate={create} onCancel={() => setAdding(false)} />}

      <div className="bg-surface border border-line rounded-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-surface-2/50">
              <th className="text-start text-xs uppercase tracking-wider text-fg-soft p-4">Type</th>
              <th className="text-start text-xs uppercase tracking-wider text-fg-soft p-4">Année</th>
              <th className="text-start text-xs uppercase tracking-wider text-fg-soft p-4">Matière</th>
              <th className="text-start text-xs uppercase tracking-wider text-fg-soft p-4">Filière</th>
              <th className="text-start text-xs uppercase tracking-wider text-fg-soft p-4">Fichier</th>
              <th className="text-start text-xs uppercase tracking-wider text-fg-soft p-4 w-24">Officiel</th>
              <th className="text-end text-xs uppercase tracking-wider text-fg-soft p-4 w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b last:border-b-0 border-line">
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${r.exam_type === "bac" ? "bg-gold/20 text-gold" : "bg-pale-blue text-navy"}`}>
                    {r.exam_type}
                  </span>
                </td>
                <td className="p-4 font-mono text-fg">{r.year}</td>
                <td className="p-4 text-fg">{r.subject_slug}</td>
                <td className="p-4 text-fg-soft text-xs">{r.filiere ?? "—"}</td>
                <td className="p-4">
                  {r.file_url ? (
                    <a href={r.file_url} target="_blank" rel="noopener noreferrer" className="text-xs text-fg underline">PDF</a>
                  ) : (
                    <span className="text-xs text-fg-faint">—</span>
                  )}
                </td>
                <td className="p-4">
                  <button onClick={() => toggleOfficial(r)} className={`text-xs ${r.official ? "text-green-600 font-bold" : "text-fg-faint"}`}>
                    {r.official ? "✓" : "—"}
                  </button>
                </td>
                <td className="p-4 text-end">
                  <button onClick={() => remove(r.id)} className="text-red-500 hover:text-red-600 text-xs">🗑</button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && !adding && (
              <tr>
                <td colSpan={7} className="p-12 text-center text-fg-soft">Aucun sujet. Téléverse le premier ci-dessus.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NewExamForm({
  onCreate, onCancel,
}: {
  onCreate: (v: { exam_type: "bac" | "bem"; year: number; filiere: string | null; subject_slug: string; file_url: string | null; official: boolean }) => Promise<boolean>;
  onCancel: () => void;
}) {
  const [examType, setExamType] = useState<"bac" | "bem">("bac");
  const [year, setYear] = useState<number>(new Date().getFullYear() - 1);
  const [filiere, setFiliere] = useState("");
  const [subjectSlug, setSubjectSlug] = useState("");
  const [fileUrl, setFileUrl] = useState<string>("");
  const [official, setOfficial] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const ok = await onCreate({
      exam_type: examType,
      year,
      filiere: filiere || null,
      subject_slug: subjectSlug,
      file_url: fileUrl || null,
      official,
    });
    setSubmitting(false);
    if (ok) {
      setExamType("bac"); setYear(new Date().getFullYear() - 1);
      setFiliere(""); setSubjectSlug(""); setFileUrl(""); setOfficial(true);
    }
  };

  const inputClass = "w-full bg-surface border-2 border-line rounded-btn px-3 py-2 text-sm focus:outline-none focus:border-fg";

  return (
    <form onSubmit={submit} className="bg-surface border-2 border-gold rounded-card p-5 grid grid-cols-1 md:grid-cols-2 gap-3">
      <h3 className="md:col-span-2 font-semibold text-fg mb-1">Nouveau sujet</h3>

      <label className="block">
        <span className="block text-xs font-semibold text-fg-soft uppercase tracking-wider mb-1">Type *</span>
        <select value={examType} onChange={(e) => setExamType(e.target.value as "bac" | "bem")} className={inputClass}>
          <option value="bac">BAC</option>
          <option value="bem">BEM</option>
        </select>
      </label>

      <label className="block">
        <span className="block text-xs font-semibold text-fg-soft uppercase tracking-wider mb-1">Année *</span>
        <input type="number" min={1990} max={2100} value={year} onChange={(e) => setYear(Number(e.target.value))} className={inputClass} required />
      </label>

      <label className="block">
        <span className="block text-xs font-semibold text-fg-soft uppercase tracking-wider mb-1">Matière *</span>
        <select value={subjectSlug} onChange={(e) => setSubjectSlug(e.target.value)} className={inputClass} required>
          <option value="">— Choisir —</option>
          {COMMON_SUBJECTS.map((s) => <option key={s.slug} value={s.slug}>{s.label}</option>)}
        </select>
      </label>

      <label className="block">
        <span className="block text-xs font-semibold text-fg-soft uppercase tracking-wider mb-1">Filière</span>
        <select value={filiere} onChange={(e) => setFiliere(e.target.value)} className={inputClass}>
          <option value="">— Optionnel —</option>
          {COMMON_FILIERES.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
      </label>

      <div className="md:col-span-2">
        <span className="block text-xs font-semibold text-fg-soft uppercase tracking-wider mb-1">Fichier PDF</span>
        <div className="flex items-center gap-3">
          <AdminFileUpload bucket="exam-papers" onUploaded={setFileUrl} label="Téléverser le PDF" />
          {fileUrl && (
            <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-fg underline truncate">
              ✓ {fileUrl.split("/").pop()}
            </a>
          )}
        </div>
        <p className="text-xs text-fg-faint mt-1">PDF jusqu&apos;à 25 MB. Stocké dans Supabase Storage.</p>
      </div>

      <label className="md:col-span-2 flex items-center gap-2 mt-1">
        <input type="checkbox" checked={official} onChange={(e) => setOfficial(e.target.checked)} className="w-4 h-4 accent-navy" />
        <span className="text-sm text-fg-soft">Marquer comme « officiel » (sujet vérifié)</span>
      </label>

      <div className="md:col-span-2 flex gap-2 justify-end pt-2">
        <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel} disabled={submitting}>Annuler</button>
        <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
          {submitting ? "Enregistrement…" : "Ajouter"}
        </button>
      </div>
    </form>
  );
}
