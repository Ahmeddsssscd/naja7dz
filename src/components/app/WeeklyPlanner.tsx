"use client";

/**
 * Weekly study planner. The student builds their own week from the modules
 * (chapters) of their grade, ticks them off, and jumps straight into a
 * module's lesson + quiz. Talks to /api/plan.
 *
 * Days: 0 = Samedi … 6 = Vendredi (Algerian week starts Saturday).
 */

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";

export interface PlannerChapter {
  id: string;
  subjectId: string;
  subjectNameFr: string;
  subjectNameAr: string | null;
  titleFr: string;
  titleAr: string | null;
}

interface PlanItem {
  id: string;
  chapterId: string;
  subjectId: string | null;
  chapterTitleFr: string;
  chapterTitleAr: string | null;
  subjectNameFr: string;
  subjectNameAr: string | null;
  dayOfWeek: number;
  done: boolean;
}

const DAYS_FR = ["Samedi", "Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
const DAYS_AR = ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];

export function WeeklyPlanner({ chapters, locale }: { chapters: PlannerChapter[]; locale: "fr" | "ar" }) {
  const isAr = locale === "ar";
  const router = useRouter();
  const [items, setItems] = useState<PlanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDay, setAddDay] = useState<number | null>(null);
  const [subjectFilter, setSubjectFilter] = useState<string>("");

  const days = isAr ? DAYS_AR : DAYS_FR;

  const load = async () => {
    try {
      const res = await fetch("/api/plan", { cache: "no-store" });
      const json = await res.json();
      if (res.ok && Array.isArray(json.items)) setItems(json.items);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { void load(); }, []);

  const subjects = useMemo(() => {
    const seen = new Map<string, string>();
    for (const c of chapters) seen.set(c.subjectId, isAr ? (c.subjectNameAr || c.subjectNameFr) : c.subjectNameFr);
    return [...seen.entries()];
  }, [chapters, isAr]);

  const filteredChapters = subjectFilter
    ? chapters.filter((c) => c.subjectId === subjectFilter)
    : chapters;

  const byDay = (d: number) => items.filter((i) => i.dayOfWeek === d);
  const total = items.length;
  const done = items.filter((i) => i.done).length;

  const add = async (chapterId: string, day: number) => {
    const res = await fetch("/api/plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chapterId, dayOfWeek: day }),
    });
    const json = await res.json();
    if (!res.ok) { toast.error(json.error ?? "Erreur"); return; }
    if (Array.isArray(json.items)) setItems(json.items);
    setAddDay(null);
    toast.success(isAr ? "أُضيف إلى برنامجك" : "Ajouté à ton programme");
  };

  const toggle = async (item: PlanItem) => {
    const next = !item.done;
    setItems((cur) => cur.map((i) => (i.id === item.id ? { ...i, done: next } : i)));
    await fetch("/api/plan", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, done: next }),
    }).catch(() => {});
  };

  const remove = async (id: string) => {
    const res = await fetch(`/api/plan?id=${id}`, { method: "DELETE" });
    const json = await res.json();
    if (res.ok && Array.isArray(json.items)) setItems(json.items);
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-fg mb-1">
            {isAr ? "برنامجي الأسبوعي" : "Mon programme de la semaine"}
          </h1>
          <p className="text-fg-soft text-sm">
            {isAr
              ? "خطّط أسبوعك: أضف الدروس لكل يوم واشطبها عند الإنجاز."
              : "Organise ta semaine : ajoute des modules à chaque jour et coche-les quand c'est fait."}
          </p>
        </div>
        {total > 0 && (
          <div className="bg-surface border border-line rounded-card px-5 py-3 text-center">
            <div className="text-2xl font-bold text-gold tabular-nums">{done}/{total}</div>
            <div className="text-xs text-fg-soft">{isAr ? "منجزة" : "faits"}</div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="bg-surface border border-line rounded-card p-8 text-center text-fg-soft text-sm">
          {isAr ? "جارٍ التحميل…" : "Chargement…"}
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {days.map((label, d) => {
            const dayItems = byDay(d);
            return (
              <div key={d} className="bg-surface border border-line rounded-card p-4 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-bold text-fg">{label}</h2>
                  <button
                    onClick={() => setAddDay(addDay === d ? null : d)}
                    className="w-7 h-7 rounded-full bg-navy text-white flex items-center justify-center text-lg leading-none hover:bg-navy-soft"
                    aria-label={isAr ? "إضافة" : "Ajouter"}
                  >
                    +
                  </button>
                </div>

                {/* Add picker */}
                {addDay === d && (
                  <div className="mb-3 bg-surface-2 border border-line rounded-xl p-3">
                    <select
                      value={subjectFilter}
                      onChange={(e) => setSubjectFilter(e.target.value)}
                      className="w-full mb-2 bg-surface border border-line-strong rounded-btn px-2 py-1.5 text-xs focus:outline-none focus:border-fg"
                    >
                      <option value="">{isAr ? "كل المواد" : "Toutes les matières"}</option>
                      {subjects.map(([id, name]) => (
                        <option key={id} value={id}>{name}</option>
                      ))}
                    </select>
                    <div className="max-h-44 overflow-y-auto space-y-1">
                      {filteredChapters.length === 0 && (
                        <p className="text-xs text-fg-faint p-2">{isAr ? "لا توجد وحدات." : "Aucun module."}</p>
                      )}
                      {filteredChapters.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => add(c.id, d)}
                          className="w-full text-start text-xs px-2 py-1.5 rounded-lg hover:bg-gold/10 text-fg"
                        >
                          <span className="text-fg-faint">{isAr ? (c.subjectNameAr || c.subjectNameFr) : c.subjectNameFr} · </span>
                          {isAr ? (c.titleAr || c.titleFr) : c.titleFr}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Items */}
                <div className="space-y-2 flex-1">
                  {dayItems.length === 0 && addDay !== d && (
                    <p className="text-xs text-fg-faint py-4 text-center">
                      {isAr ? "يوم فارغ" : "Journée libre"}
                    </p>
                  )}
                  {dayItems.map((item) => (
                    <div
                      key={item.id}
                      className={`group flex items-start gap-2 rounded-xl border p-2.5 ${
                        item.done ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900" : "bg-surface-2 border-line"
                      }`}
                    >
                      <button
                        onClick={() => toggle(item)}
                        className={`w-5 h-5 rounded-md border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
                          item.done ? "bg-emerald-500 border-emerald-500 text-white" : "border-line-strong"
                        }`}
                        aria-label={isAr ? "تبديل" : "Cocher"}
                      >
                        {item.done && (
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                        )}
                      </button>
                      <button
                        onClick={() => router.push(`/eleve/matieres/${item.subjectId}/${item.chapterId}` as never)}
                        className="flex-1 text-start min-w-0"
                        disabled={!item.subjectId}
                      >
                        <div className={`text-[11px] font-semibold ${item.done ? "text-emerald-700 dark:text-emerald-400" : "text-fg-faint"}`}>
                          {isAr ? (item.subjectNameAr || item.subjectNameFr) : item.subjectNameFr}
                        </div>
                        <div className={`text-xs font-medium leading-snug ${item.done ? "line-through text-fg-soft" : "text-fg"}`}>
                          {isAr ? (item.chapterTitleAr || item.chapterTitleFr) : item.chapterTitleFr}
                        </div>
                      </button>
                      <button
                        onClick={() => remove(item.id)}
                        className="opacity-0 group-hover:opacity-100 text-fg-faint hover:text-red-500 text-xs flex-shrink-0"
                        aria-label={isAr ? "حذف" : "Retirer"}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {chapters.length === 0 && !loading && (
        <p className="text-xs text-fg-faint text-center mt-4">
          {isAr ? "لا توجد وحدات متاحة لمستواك بعد." : "Aucun module disponible pour ton niveau pour l'instant."}
        </p>
      )}
    </div>
  );
}
