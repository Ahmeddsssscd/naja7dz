"use client";

/**
 * CRUD UI for the quiz_questions table. Slightly different from the generic
 * AdminCrudTable because:
 *   - Options are an array (one per line in the textarea, parsed on submit)
 *   - Inline preview of which option is the "correct" one
 *
 * The chapter dropdown is grade-grouped for fast scanning.
 */

import { useState, useTransition } from "react";
import { toast } from "sonner";

export interface QuizQuestionRow {
  id: string;
  chapter_id: string;
  prompt_fr: string;
  prompt_ar: string | null;
  options_fr: string[];
  options_ar: string[] | null;
  correct_index: number;
  explanation_fr: string | null;
  explanation_ar: string | null;
  difficulty: "easy" | "medium" | "hard";
  active: boolean;
  sort_order: number;
  chapters?:
    | { title_fr: string; subjects: { name_fr: string; grade_code: string } | { name_fr: string; grade_code: string }[] }
    | null;
}

export interface ChapterOption {
  id: string;
  title_fr: string;
  subject_name: string;
  grade_code: string;
}

interface FormValues {
  chapter_id: string;
  prompt_fr: string;
  prompt_ar: string;
  options_fr: string;
  options_ar: string;
  correct_index: number;
  explanation_fr: string;
  explanation_ar: string;
  difficulty: "easy" | "medium" | "hard";
  active: boolean;
  sort_order: number;
}

const EMPTY: FormValues = {
  chapter_id: "",
  prompt_fr: "",
  prompt_ar: "",
  options_fr: "",
  options_ar: "",
  correct_index: 0,
  explanation_fr: "",
  explanation_ar: "",
  difficulty: "medium",
  active: true,
  sort_order: 0,
};

export function QuizQuestionsCrud({
  initialRows,
  chapterOptions,
}: {
  initialRows: QuizQuestionRow[];
  chapterOptions: ChapterOption[];
}) {
  const [rows, setRows] = useState<QuizQuestionRow[]>(initialRows);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("");
  const [pending, startTransition] = useTransition();

  const refresh = async () => {
    const res = await fetch("/api/admin/quiz-questions", { cache: "no-store" });
    if (!res.ok) return;
    const json = await res.json();
    if (Array.isArray(json.rows)) setRows(json.rows);
  };

  const onSave = async (values: FormValues, id?: string) => {
    const url = id
      ? `/api/admin/quiz-questions?id=${id}`
      : "/api/admin/quiz-questions";
    const res = await fetch(url, {
      method: id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = await res.json();
    if (!res.ok) {
      toast.error(json.error ?? "Erreur");
      return false;
    }
    toast.success(id ? "Mis à jour ✓" : "Créé ✓");
    setAdding(false);
    setEditingId(null);
    startTransition(refresh);
    return true;
  };

  const onDelete = async (id: string) => {
    if (!confirm("Supprimer cette question ?")) return;
    const res = await fetch(`/api/admin/quiz-questions?id=${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Erreur");
      return;
    }
    toast.success("Supprimée ✓");
    setRows((cur) => cur.filter((r) => r.id !== id));
  };

  const filtered = filter
    ? rows.filter((r) => r.chapter_id === filter)
    : rows;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-surface border-2 border-line rounded-btn px-3 py-2 text-sm"
        >
          <option value="">Toutes les chapitres ({rows.length})</option>
          {chapterOptions.map((c) => (
            <option key={c.id} value={c.id}>
              {c.grade_code} · {c.subject_name} · {c.title_fr}
            </option>
          ))}
        </select>
        {!adding ? (
          <button
            className="btn btn-primary btn-sm"
            onClick={() => { setAdding(true); setEditingId(null); }}
            disabled={pending || !chapterOptions.length}
          >
            + Nouvelle question
          </button>
        ) : (
          <button className="btn btn-ghost btn-sm" onClick={() => setAdding(false)}>
            Annuler
          </button>
        )}
      </div>

      {adding && (
        <QuestionForm
          initial={EMPTY}
          chapterOptions={chapterOptions}
          onCancel={() => setAdding(false)}
          onSubmit={(v) => onSave(v)}
        />
      )}

      <div className="space-y-2">
        {filtered.map((r) => (
          <div key={r.id} className="bg-surface border border-line rounded-card">
            {editingId === r.id ? (
              <QuestionForm
                initial={rowToValues(r)}
                chapterOptions={chapterOptions}
                onCancel={() => setEditingId(null)}
                onSubmit={(v) => onSave(v, r.id)}
              />
            ) : (
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-fg-soft mb-1">{chapterLabel(r)}</div>
                    <div className="text-sm font-medium text-fg">{r.prompt_fr}</div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      r.difficulty === "easy" ? "bg-green-100 text-green-900"
                      : r.difficulty === "hard" ? "bg-red-100 text-red-900"
                      : "bg-amber-100 text-amber-900"
                    }`}>{r.difficulty}</span>
                    {!r.active && <span className="text-xs px-2 py-0.5 rounded-full bg-fg-faint/20 text-fg-soft">inactive</span>}
                  </div>
                </div>
                <ul className="text-xs text-fg-soft space-y-1 ms-2">
                  {(r.options_fr ?? []).map((o, i) => (
                    <li key={i} className={i === r.correct_index ? "text-green-700 font-semibold" : ""}>
                      {String.fromCharCode(65 + i)}. {o} {i === r.correct_index ? "✓" : ""}
                    </li>
                  ))}
                </ul>
                <div className="flex justify-end gap-3 mt-3">
                  <button onClick={() => { setEditingId(r.id); setAdding(false); }} className="text-fg-soft hover:text-fg text-xs">
                    ✏️ Modifier
                  </button>
                  <button onClick={() => onDelete(r.id)} className="text-red-500 hover:text-red-600 text-xs">
                    🗑 Supprimer
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && !adding && (
          <div className="bg-surface border border-line rounded-card p-12 text-center text-fg-soft">
            {filter ? "Aucune question pour ce chapitre." : "Aucune question. Crée la première ci-dessus."}
          </div>
        )}
      </div>
    </div>
  );
}

function rowToValues(r: QuizQuestionRow): FormValues {
  return {
    chapter_id: r.chapter_id,
    prompt_fr: r.prompt_fr,
    prompt_ar: r.prompt_ar ?? "",
    options_fr: (r.options_fr ?? []).join("\n"),
    options_ar: (r.options_ar ?? []).join("\n"),
    correct_index: r.correct_index,
    explanation_fr: r.explanation_fr ?? "",
    explanation_ar: r.explanation_ar ?? "",
    difficulty: r.difficulty,
    active: r.active,
    sort_order: r.sort_order,
  };
}

function chapterLabel(r: QuizQuestionRow): string {
  const ch = r.chapters;
  if (!ch) return "—";
  const subj = Array.isArray(ch.subjects) ? ch.subjects[0] : ch.subjects;
  return `${subj?.grade_code ?? ""} · ${subj?.name_fr ?? ""} · ${ch.title_fr}`;
}

function QuestionForm({
  initial, chapterOptions, onCancel, onSubmit,
}: {
  initial: FormValues;
  chapterOptions: ChapterOption[];
  onCancel: () => void;
  onSubmit: (v: FormValues) => Promise<boolean>;
}) {
  const [v, setV] = useState<FormValues>(initial);
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof FormValues>(k: K, val: FormValues[K]) =>
    setV((cur) => ({ ...cur, [k]: val }));

  const optsList = v.options_fr.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!v.chapter_id) { toast.error("Chapitre requis"); return; }
    if (!v.prompt_fr.trim()) { toast.error("Énoncé FR requis"); return; }
    if (optsList.length < 2) { toast.error("Au moins 2 options"); return; }
    if (v.correct_index < 0 || v.correct_index >= optsList.length) {
      toast.error("Index de la bonne réponse hors limites"); return;
    }
    setBusy(true);
    const ok = await onSubmit(v);
    setBusy(false);
    if (ok) setV(EMPTY);
  };

  const inputClass = "w-full bg-surface border-2 border-line rounded-btn px-3 py-2 text-sm focus:outline-none focus:border-fg";

  return (
    <form onSubmit={submit} className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3 bg-amber-50/40 dark:bg-amber-950/15 border-2 border-gold rounded-card">
      <label className="md:col-span-2 block">
        <span className="block text-xs font-semibold text-fg-soft uppercase tracking-wider mb-1">Chapitre *</span>
        <select value={v.chapter_id} onChange={(e) => set("chapter_id", e.target.value)} className={inputClass} required>
          <option value="">— Choisir —</option>
          {chapterOptions.map((c) => (
            <option key={c.id} value={c.id}>
              {c.grade_code} · {c.subject_name} · {c.title_fr}
            </option>
          ))}
        </select>
      </label>

      <label className="md:col-span-2 block">
        <span className="block text-xs font-semibold text-fg-soft uppercase tracking-wider mb-1">Énoncé (français) *</span>
        <textarea value={v.prompt_fr} onChange={(e) => set("prompt_fr", e.target.value)} className={inputClass} rows={2} required placeholder="Quelle est la solution de 2x + 6 = 14 ?" />
      </label>
      <label className="md:col-span-2 block">
        <span className="block text-xs font-semibold text-fg-soft uppercase tracking-wider mb-1">Énoncé (arabe)</span>
        <textarea value={v.prompt_ar} onChange={(e) => set("prompt_ar", e.target.value)} className={inputClass} rows={2} placeholder="ما هو حل المعادلة …" />
      </label>

      <label className="block">
        <span className="block text-xs font-semibold text-fg-soft uppercase tracking-wider mb-1">Options FR *</span>
        <textarea value={v.options_fr} onChange={(e) => set("options_fr", e.target.value)} className={`${inputClass} font-mono`} rows={4} required placeholder={"x = 2\nx = 4\nx = 6\nx = 10"} />
        <span className="block text-xs text-fg-faint mt-1">Une option par ligne. 2 à 6 options.</span>
      </label>
      <label className="block">
        <span className="block text-xs font-semibold text-fg-soft uppercase tracking-wider mb-1">Options AR</span>
        <textarea value={v.options_ar} onChange={(e) => set("options_ar", e.target.value)} className={`${inputClass} font-mono`} rows={4} placeholder="x = 2\nx = 4\nx = 6\nx = 10" />
        <span className="block text-xs text-fg-faint mt-1">Optionnel — même nombre que FR si présent.</span>
      </label>

      <label className="block">
        <span className="block text-xs font-semibold text-fg-soft uppercase tracking-wider mb-1">Bonne réponse (lettre) *</span>
        <select value={v.correct_index} onChange={(e) => set("correct_index", Number(e.target.value))} className={inputClass}>
          {optsList.map((opt, i) => (
            <option key={i} value={i}>
              {String.fromCharCode(65 + i)} — {opt.slice(0, 40)}{opt.length > 40 ? "…" : ""}
            </option>
          ))}
          {optsList.length === 0 && <option value={0}>(remplis les options d&apos;abord)</option>}
        </select>
      </label>
      <label className="block">
        <span className="block text-xs font-semibold text-fg-soft uppercase tracking-wider mb-1">Difficulté</span>
        <select value={v.difficulty} onChange={(e) => set("difficulty", e.target.value as FormValues["difficulty"])} className={inputClass}>
          <option value="easy">Facile</option>
          <option value="medium">Moyen</option>
          <option value="hard">Difficile</option>
        </select>
      </label>

      <label className="md:col-span-2 block">
        <span className="block text-xs font-semibold text-fg-soft uppercase tracking-wider mb-1">Explication FR</span>
        <textarea value={v.explanation_fr} onChange={(e) => set("explanation_fr", e.target.value)} className={inputClass} rows={2} placeholder="On isole x : 2x = 14 − 6 = 8, donc x = 4." />
      </label>
      <label className="md:col-span-2 block">
        <span className="block text-xs font-semibold text-fg-soft uppercase tracking-wider mb-1">Explication AR</span>
        <textarea value={v.explanation_ar} onChange={(e) => set("explanation_ar", e.target.value)} className={inputClass} rows={2} placeholder="نعزل x: 2x = 14 − 6 = 8، إذن x = 4." />
      </label>

      <label className="block">
        <span className="block text-xs font-semibold text-fg-soft uppercase tracking-wider mb-1">Ordre</span>
        <input type="number" value={v.sort_order} onChange={(e) => set("sort_order", Number(e.target.value))} className={inputClass} />
      </label>
      <label className="flex items-center gap-2 mt-6">
        <input type="checkbox" checked={v.active} onChange={(e) => set("active", e.target.checked)} className="w-4 h-4 accent-navy" />
        <span className="text-sm text-fg-soft">Active (visible aux élèves)</span>
      </label>

      <div className="md:col-span-2 flex gap-2 justify-end pt-2">
        <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel} disabled={busy}>Annuler</button>
        <button type="submit" className="btn btn-primary btn-sm" disabled={busy}>
          {busy ? "Enregistrement…" : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}
