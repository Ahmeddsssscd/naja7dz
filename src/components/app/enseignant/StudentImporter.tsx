"use client";

/**
 * StudentImporter — bulk import students into a class.
 *
 * Accepts a paste-area where each line is either:
 *   "Ahmed Benali"
 *   "Ahmed Benali, 12345"      ← name + numero
 *   "12345, Ahmed Benali"      ← swapped is also fine
 *
 * Empty lines and short lines (< 3 chars) are skipped. Submission posts
 * the parsed list to /api/teacher/classes/[id]/students which inserts
 * them in one round-trip.
 */

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

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
    // Try splitting on comma / tab / multiple spaces
    const parts = line.split(/[,\t]|\s{2,}/).map((s) => s.trim()).filter(Boolean);
    if (parts.length === 0) continue;
    if (parts.length === 1) {
      out.push({ full_name: parts[0], numero: null });
      continue;
    }
    // 2+ parts — figure out which is the numero (digits-mostly) and which is the name
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
    <section className="bg-white rounded-3xl border-2 border-gold p-5 md:p-6">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <h2 className="text-lg font-bold text-navy">📋 {isAr ? "إضافة تلاميذ" : "Importer la liste d'élèves"}</h2>
        <span className="text-xs font-mono bg-gold/15 text-navy px-2 py-1 rounded-full">{parsed.length} {isAr ? "صفّ" : "lignes"}</span>
      </div>
      <p className="text-xs text-fg-soft mb-3">
        {isAr
          ? "ألصق قائمة التلاميذ هنا — اسم في كلّ سطر. يمكنك إضافة رقم التسجيل بفاصلة."
          : "Colle ici la liste depuis ton tableur — un élève par ligne. Tu peux ajouter le numéro après une virgule."}
      </p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        placeholder={isAr ? "مثال:\nأحمد بن علي\nفاطمة ذيب، ١٢٣\nمراد قاسم" : "Ex :\nAhmed Benali\nFatima Diab, 12345\nMourad Kacem"}
        className="w-full rounded-xl border-2 border-pale-blue px-3 py-2 text-sm font-mono focus:outline-none focus:border-gold mb-3"
        dir="ltr"
      />

      {/* Preview of parsed rows */}
      {parsed.length > 0 && (
        <div className="bg-pale-blue/30 rounded-xl p-3 mb-3 max-h-40 overflow-y-auto">
          <div className="text-xs font-bold text-navy mb-1">{isAr ? "معاينة" : "Aperçu"}:</div>
          <ol className="text-xs text-navy space-y-0.5 list-decimal list-inside">
            {parsed.slice(0, 30).map((p, i) => (
              <li key={i}>
                <span className="font-semibold">{p.full_name}</span>
                {p.numero && <span className="text-fg-soft"> · N° {p.numero}</span>}
              </li>
            ))}
            {parsed.length > 30 && <li className="text-fg-soft">… +{parsed.length - 30}</li>}
          </ol>
        </div>
      )}

      {err && <div className="bg-red-50 text-red-700 rounded-lg p-2 text-sm mb-3">{err}</div>}
      {done && <div className="bg-emerald-50 text-emerald-800 rounded-lg p-2 text-sm mb-3">✅ {isAr ? `تمّت إضافة ${done.inserted} تلميذ` : `${done.inserted} élèves ajoutés`}</div>}

      <button onClick={submit} disabled={parsed.length === 0 || submitting}
        className={`btn w-full ${parsed.length === 0 ? "btn-outline opacity-50" : "btn-primary"}`}>
        {submitting ? (isAr ? "جاري الإضافة..." : "Import…") : (isAr ? `إضافة ${parsed.length} تلميذ` : `Ajouter ${parsed.length} élèves`)}
      </button>
    </section>
  );
}
