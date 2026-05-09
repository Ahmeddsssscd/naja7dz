"use client";

/**
 * CreateClassButton — opens a modal to create a new teacher_class.
 * Editorial style — typography-only, no emoji.
 */

import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { PlusIcon } from "@/components/Icon";

const GRADES = ["1AP", "2AP", "3AP", "4AP", "5AP", "1AM", "2AM", "3AM", "4AM", "1AS", "2AS", "3AS"];

export function CreateClassButton() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("3AP");
  const [year, setYear] = useState("2025-2026");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async () => {
    if (name.trim().length < 2) return;
    setSubmitting(true); setErr(null);
    try {
      const r = await fetch("/api/teacher/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), grade, year }),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j.error ?? "Erreur");
      }
      const { id } = await r.json();
      setOpen(false);
      setName("");
      router.push(`/enseignant/classes/${id}`);
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn btn-primary inline-flex items-center gap-2">
        <PlusIcon size={16} />
        {isAr ? "قسم جديد" : "Nouvelle classe"}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-fg/60 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-surface border border-line rounded-card p-6 md:p-7 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-line">
              <div>
                <span className="eyebrow mb-1 block">{isAr ? "إنشاء" : "Création"}</span>
                <h3 className="text-lg font-semibold text-fg">{isAr ? "قسم جديد" : "Nouvelle classe"}</h3>
              </div>
              <button onClick={() => setOpen(false)} className="text-fg-faint hover:text-fg text-2xl leading-none">×</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-fg mb-1.5">
                  {isAr ? "اسم القسم" : "Nom de la classe"} <span className="text-red-600">*</span>
                </label>
                <input
                  value={name} onChange={(e) => setName(e.target.value)}
                  placeholder={isAr ? "٥ ابتدائي ب — ابتدائية حسيبة" : "Ex : 5AP-B — École Hassiba"}
                  className="input"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-fg mb-1.5">{isAr ? "السنة" : "Niveau"}</label>
                  <select value={grade} onChange={(e) => setGrade(e.target.value)} className="input">
                    {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-fg mb-1.5">{isAr ? "العام الدراسي" : "Année scolaire"}</label>
                  <input value={year} onChange={(e) => setYear(e.target.value)} className="input" />
                </div>
              </div>
              {err && <div className="bg-red-50 dark:bg-red-950/30 border border-red-300 text-red-700 dark:text-red-400 rounded-btn p-3 text-sm">{err}</div>}
              <button
                onClick={submit}
                disabled={name.trim().length < 2 || submitting}
                className={`btn w-full ${name.trim().length < 2 ? "btn-outline opacity-50" : "btn-primary"}`}
              >
                {submitting ? (isAr ? "جاري..." : "…") : (isAr ? "إنشاء" : "Créer la classe")}
              </button>
            </div>

            <style jsx>{`
              .input {
                width: 100%;
                border-radius: 10px;
                border: 1px solid var(--color-line);
                background: var(--color-surface);
                color: var(--color-fg);
                padding: 0.6rem 0.85rem;
                font-size: 0.9rem;
                outline: none;
                transition: border-color 0.15s;
              }
              .input:focus { border-color: var(--color-fg); }
            `}</style>
          </div>
        </div>
      )}
    </>
  );
}
