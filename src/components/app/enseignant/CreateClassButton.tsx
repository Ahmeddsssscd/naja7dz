"use client";

/**
 * CreateClassButton — opens a small modal to create a new teacher_class.
 * Posts to /api/teacher/classes, then refreshes to reveal the new class.
 */

import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

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
      <button onClick={() => setOpen(true)} className="btn btn-primary">
        + {isAr ? "إنشاء قسم" : "Nouvelle classe"}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-navy/50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="bg-cream rounded-3xl border-4 border-gold p-5 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-navy">{isAr ? "قسم جديد" : "Nouvelle classe"}</h3>
              <button onClick={() => setOpen(false)} className="text-fg-soft hover:text-navy text-2xl">×</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-navy mb-1">
                  {isAr ? "اسم القسم" : "Nom de la classe"} <span className="text-red-600">*</span>
                </label>
                <input value={name} onChange={(e) => setName(e.target.value)}
                  placeholder={isAr ? "مثال: ٥ ابتدائي ب — ابتدائية حسيبة" : "Ex : 5AP-B — École Hassiba"}
                  className="w-full rounded-xl border-2 border-pale-blue px-3 py-2 text-sm focus:outline-none focus:border-gold" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-navy mb-1">{isAr ? "السنة الدراسية" : "Niveau"}</label>
                  <select value={grade} onChange={(e) => setGrade(e.target.value)}
                    className="w-full rounded-xl border-2 border-pale-blue px-3 py-2 text-sm focus:outline-none focus:border-gold">
                    {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy mb-1">{isAr ? "العام" : "Année scolaire"}</label>
                  <input value={year} onChange={(e) => setYear(e.target.value)}
                    className="w-full rounded-xl border-2 border-pale-blue px-3 py-2 text-sm focus:outline-none focus:border-gold" />
                </div>
              </div>
              {err && <div className="bg-red-50 text-red-700 rounded-lg p-2 text-sm">{err}</div>}
              <button onClick={submit} disabled={name.trim().length < 2 || submitting}
                className={`btn w-full ${name.trim().length < 2 ? "btn-outline opacity-50" : "btn-primary"}`}>
                {submitting ? (isAr ? "جاري..." : "…") : (isAr ? "إنشاء القسم" : "Créer la classe")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
