"use client";

/**
 * StudentImporter — bulk import students into a class.
 *
 * Editorial style. Paste-area accepts:
 *   "Ahmed Benali"
 *   "Ahmed Benali, 12345"      ← name + numero
 *   "12345, Ahmed Benali"      ← swapped is also fine
 */

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { CheckIcon } from "@/components/Icon";

interface Props { classId: string }

interface Parsed {
  full_name: string;
  numero: string | null;
}

function parse(text: string): Parsed[] {
  const lines = text.split(/[\r\n]+/);
  const out: Parsed[] = [];
  for (const raw of lines) {
    const line = raw.trim();
    if (line.length < 3) continue;
    const parts = line.split(/[,\t]|\s{2,}/).map((s) => s.trim()).filter(Boolean);
    if (parts.length === 0) continue;
    if (parts.length === 1) {
      out.push({ full_name: parts[0], numero: null });
      continue;
    }
    const [a, b] = parts;
    const aIsNum = /^\d{2,}$/.test(a);
    const bIsNum = /^\d{2,}$/.test(b);
    if (aIsNum && !bIsNum) out.push({ full_name: parts.slice(1).join(" "), numero: a });
    else if (bIsNum) out.push({ full_name: a, numero: b });
    else out.push({ full_name: parts.join(" "), numero: null });
  }
  return out;
}

export function StudentImporter({ classId }: Props) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const router = useRouter();

  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState<{ inserted: number } | null>(null);

  const parsed = useMemo(() => parse(text), [text]);

  const submit = async () => {
    if (parsed.length === 0) return;
    setSubmitting(true); setErr(null); setDone(null);
    try {
      const r = await fetch(`/api/teacher/classes/${classId}/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ students: parsed }),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j.error ?? "Erreur");
      }
      const json = await r.json();
      setDone({ inserted: json.inserted ?? parsed.length });
      setText("");
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-surface border border-line rounded-card p-6 md:p-7">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <h2 className="text-lg font-semibold text-fg">
          {isAr ? "إضافة تلاميذ" : "Importer la liste d'élèves"}
        </h2>
        <span className="text-xs font-mono text-fg-soft bg-surface-3 px-2 py-1 rounded-full border border-line">
          {parsed.length} {isAr ? "صفّ" : "lignes"}
        </span>
      </div>
      <p className="text-sm text-fg-soft mb-4">
        {isAr
          ? "ألصق قائمة التلاميذ هنا — اسم في كلّ سطر. يمكنك إضافة رقم التسجيل بفاصلة."
          : "Colle ici la liste depuis ton tableur — un élève par ligne. Tu peux ajouter le numéro après une virgule."}
      </p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        placeholder={isAr ? "مثال:\nأحمد بن علي\nفاطمة ذيب، ١٢٣\nمراد قاسم" : "Ex :\nAhmed Benali\nFatima Diab, 12345\nMourad Kacem"}
        className="input mb-4"
        dir="ltr"
      />

      {parsed.length > 0 && (
        <div className="bg-surface-3 border border-line rounded-btn p-3 mb-4 max-h-44 overflow-y-auto">
          <div className="text-xs font-semibold text-fg-soft uppercase tracking-wider mb-2">
            {isAr ? "معاينة" : "Aperçu"}
          </div>
          <ol className="text-xs text-fg space-y-0.5 list-decimal list-inside">
            {parsed.slice(0, 30).map((p, i) => (
              <li key={i}>
                <span className="font-semibold">{p.full_name}</span>
                {p.numero && <span className="text-fg-soft"> · N° {p.numero}</span>}
              </li>
            ))}
            {parsed.length > 30 && <li className="text-fg-faint">… +{parsed.length - 30}</li>}
          </ol>
        </div>
      )}

      {err && <div className="bg-red-50 dark:bg-red-950/30 border border-red-300 text-red-700 dark:text-red-400 rounded-btn p-3 text-sm mb-4">{err}</div>}
      {done && (
        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 text-emerald-800 dark:text-emerald-300 rounded-btn p-3 text-sm mb-4 inline-flex items-center gap-2">
          <CheckIcon size={16} />
          {isAr ? `تمّت إضافة ${done.inserted} تلميذ` : `${done.inserted} élèves ajoutés`}
        </div>
      )}

      <button
        onClick={submit}
        disabled={parsed.length === 0 || submitting}
        className={`btn w-full ${parsed.length === 0 ? "btn-outline opacity-50" : "btn-primary"}`}
      >
        {submitting
          ? (isAr ? "جاري الإضافة..." : "Import…")
          : (isAr ? `إضافة ${parsed.length} تلميذ` : `Ajouter ${parsed.length} élèves`)}
      </button>

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 10px;
          border: 1px solid var(--color-line);
          background: var(--color-surface);
          color: var(--color-fg);
          padding: 0.6rem 0.85rem;
          font-size: 0.85rem;
          font-family: ui-monospace, SFMono-Regular, monospace;
          outline: none;
          transition: border-color 0.15s;
        }
        .input:focus { border-color: var(--color-fg); }
      `}</style>
    </section>
  );
}
