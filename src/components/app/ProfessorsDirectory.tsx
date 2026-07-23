"use client";

/**
 * Guided BAC professor finder. Three steps:
 *   1. How do you want to study?  (à l'école · cours particuliers · en ligne)
 *   2. Which subject?             (fixed BAC module list)
 *   3. Matching professors        (optional wilaya refine + booking modal)
 *
 * The step-by-step flow keeps the choice simple and the results relevant,
 * rather than dropping the student in front of raw filters.
 */

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { toast } from "sonner";

export interface Professor {
  id: string;
  full_name: string;
  subject: string;
  wilaya: string;
  teaches_at: string | null;
  mode: "in_person" | "online" | "both";
  teaching_types: string[] | null;
  bio: string | null;
  hourly_rate_dzd: number | null;
  verified: boolean;
}

type TeachType = "school" | "private" | "online";

const TEACH_OPTIONS: { key: TeachType; fr: string; ar: string; desc_fr: string; desc_ar: string; icon: React.ReactNode }[] = [
  {
    key: "school", fr: "À l'école / au lycée", ar: "في المدرسة / الثانوية",
    desc_fr: "Cours dans l'établissement du professeur", desc_ar: "دروس في مؤسسة الأستاذ",
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10L12 5 2 10l10 5 10-5z" /><path d="M6 12v5c0 1 2.5 3 6 3s6-2 6-3v-5" /></svg>,
  },
  {
    key: "private", fr: "Cours particuliers", ar: "دروس خصوصية",
    desc_fr: "En présentiel, en petit groupe ou à domicile", desc_ar: "حضوري، مجموعة صغيرة أو في المنزل",
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /></svg>,
  },
  {
    key: "online", fr: "En ligne", ar: "عن بُعد",
    desc_fr: "Visioconférence, où que tu sois", desc_ar: "عبر الفيديو، أينما كنت",
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>,
  },
];

// Full BAC module list (Algerian program, all filières).
const MODULES = [
  "Mathématiques", "Sciences physiques", "Sciences naturelles",
  "Français", "Anglais", "Arabe", "Philosophie",
  "Histoire-Géographie", "Informatique", "Économie & Gestion",
  "Espagnol", "Allemand", "Tamazight",
];

const TEACH_LABEL: Record<TeachType, { fr: string; ar: string }> = {
  school: { fr: "À l'école", ar: "في المدرسة" },
  private: { fr: "Cours particuliers", ar: "دروس خصوصية" },
  online: { fr: "En ligne", ar: "عن بُعد" },
};

export function ProfessorsDirectory({ professors }: { professors: Professor[] }) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const [teach, setTeach] = useState<TeachType | null>(null);
  const [module, setModule] = useState<string | null>(null);
  const [wilaya, setWilaya] = useState("");
  const [booking, setBooking] = useState<Professor | null>(null);

  const step = teach === null ? 1 : module === null ? 2 : 3;

  const matchesTeach = (p: Professor, t: TeachType) => {
    const types = p.teaching_types ?? [];
    if (types.includes(t)) return true;
    // Fallback for rows without teaching_types set: derive from mode.
    if (t === "online") return p.mode === "online" || p.mode === "both";
    return p.mode === "in_person" || p.mode === "both";
  };

  const results = useMemo(() => {
    if (!teach || !module) return [];
    const mod = module.toLowerCase();
    const modWords = mod.split(/[ &-]+/).filter((w) => w.length > 3);
    return professors.filter((p) => {
      if (!matchesTeach(p, teach)) return false;
      const subj = p.subject.toLowerCase();
      const subjMatch =
        subj.includes(mod) || mod.includes(subj) || modWords.some((w) => subj.includes(w));
      if (!subjMatch) return false;
      if (wilaya && p.wilaya !== wilaya) return false;
      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teach, module, wilaya, professors]);

  const wilayas = useMemo(
    () => [...new Set(results.map((p) => p.wilaya))].sort(),
    [results],
  );

  return (
    <div>
      {/* Progress steps */}
      <ol className="flex items-center justify-center gap-2 mb-8 text-xs font-semibold">
        {[
          { n: 1, label: isAr ? "الطريقة" : "Méthode" },
          { n: 2, label: isAr ? "المادة" : "Matière" },
          { n: 3, label: isAr ? "الأساتذة" : "Professeurs" },
        ].map((s, i) => (
          <li key={s.n} className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= s.n ? "bg-navy text-white dark:bg-gold dark:text-navy" : "bg-surface-3 text-fg-soft"}`}>{s.n}</span>
            <span className={step >= s.n ? "text-fg" : "text-fg-faint"}>{s.label}</span>
            {i < 2 && <span className="w-6 h-px bg-line" />}
          </li>
        ))}
      </ol>

      {/* Step 1 — teaching type */}
      {step === 1 && (
        <div>
          <h2 className="text-center text-xl font-bold text-fg mb-6">
            {isAr ? "كيف تريد أن تدرس؟" : "Comment veux-tu étudier ?"}
          </h2>
          <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {TEACH_OPTIONS.map((o) => (
              <button
                key={o.key}
                onClick={() => setTeach(o.key)}
                className="bg-surface border border-line rounded-card p-6 text-center hover:border-gold hover:shadow-card-hover hover:-translate-y-0.5 transition-all"
              >
                <span className="w-14 h-14 rounded-full bg-surface-3 text-fg inline-flex items-center justify-center mb-4">
                  {o.icon}
                </span>
                <div className="font-bold text-fg mb-1">{isAr ? o.ar : o.fr}</div>
                <div className="text-xs text-fg-soft leading-snug">{isAr ? o.desc_ar : o.desc_fr}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2 — module */}
      {step === 2 && (
        <div>
          <div className="flex items-center justify-center gap-2 mb-6">
            <button onClick={() => setTeach(null)} className="text-sm text-fg-soft hover:text-fg">← {isAr ? "رجوع" : "Retour"}</button>
          </div>
          <h2 className="text-center text-xl font-bold text-fg mb-6">
            {isAr ? "أي مادة تريد تحسينها؟" : "Quelle matière veux-tu renforcer ?"}
          </h2>
          <div className="flex flex-wrap justify-center gap-2.5 max-w-3xl mx-auto">
            {MODULES.map((m) => (
              <button
                key={m}
                onClick={() => setModule(m)}
                className="bg-surface border border-line rounded-full px-4 py-2.5 text-sm font-medium text-fg hover:border-gold hover:bg-gold/5 transition-all"
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3 — results */}
      {step === 3 && teach && module && (
        <div>
          {/* Chosen criteria + reset */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <button onClick={() => setModule(null)} className="text-sm text-fg-soft hover:text-fg me-1">← {isAr ? "رجوع" : "Retour"}</button>
            <Chip onClear={() => setTeach(null)}>{isAr ? TEACH_LABEL[teach].ar : TEACH_LABEL[teach].fr}</Chip>
            <Chip onClear={() => setModule(null)}>{module}</Chip>
            <select value={wilaya} onChange={(e) => setWilaya(e.target.value)} className="h-9 px-3 bg-surface border border-line-strong rounded-btn text-sm text-fg focus:outline-none focus:border-fg ms-auto">
              <option value="">{isAr ? "كل الولايات" : "Toutes les wilayas"}</option>
              {wilayas.map((w) => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>

          <p className="text-sm text-fg-soft mb-5">
            {results.length} {isAr ? "أستاذ متاح" : results.length > 1 ? "professeurs disponibles" : "professeur disponible"}
          </p>

          {results.length === 0 ? (
            <div className="bg-surface-2 border border-line rounded-card p-12 text-center">
              <p className="text-fg-soft mb-4">
                {isAr ? "لا يوجد أستاذ يطابق اختيارك بعد." : "Aucun professeur ne correspond encore à ton choix."}
              </p>
              <button onClick={() => { setTeach(null); setModule(null); setWilaya(""); }} className="btn btn-outline btn-sm">
                {isAr ? "إعادة البحث" : "Recommencer la recherche"}
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {results.map((p) => (
                <ProfCard key={p.id} p={p} isAr={isAr} onBook={() => setBooking(p)} />
              ))}
            </div>
          )}
        </div>
      )}

      {booking && <BookingModal professor={booking} isAr={isAr} onClose={() => setBooking(null)} />}
    </div>
  );
}

function Chip({ children, onClear }: { children: React.ReactNode; onClear: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-navy text-white dark:bg-gold dark:text-navy text-xs font-semibold rounded-full ps-3 pe-2 py-1.5">
      {children}
      <button onClick={onClear} className="opacity-70 hover:opacity-100" aria-label="Retirer">✕</button>
    </span>
  );
}

function ProfCard({ p, isAr, onBook }: { p: Professor; isAr: boolean; onBook: () => void }) {
  const types = (p.teaching_types ?? []) as TeachType[];
  return (
    <article className="bg-surface border border-line rounded-card p-5 flex flex-col">
      <div className="flex items-center gap-3 mb-3">
        <span className="w-12 h-12 rounded-full bg-navy text-white font-bold flex items-center justify-center flex-shrink-0">
          {p.full_name.replace(/^Pr\.\s*/, "").split(" ").map((s) => s[0]).slice(0, 2).join("")}
        </span>
        <div className="min-w-0">
          <h3 className="font-bold text-fg text-sm leading-tight flex items-center gap-1">
            {p.full_name}
            {p.verified && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#D4A72C" className="flex-shrink-0" aria-label="vérifié">
                <path d="M12 2l2.4 2.4 3.4-.6.6 3.4L21 12l-2.6 4.8-.6 3.4-3.4-.6L12 22l-2.4-2.4-3.4.6-.6-3.4L3 12l2.6-4.8.6-3.4 3.4.6z" />
                <path d="M10 13l-2-2-1.4 1.4L10 15.8l6-6L14.6 8z" fill="#fff" />
              </svg>
            )}
          </h3>
          <p className="text-xs text-gold font-semibold">{p.subject}</p>
        </div>
      </div>

      <div className="space-y-1.5 text-xs text-fg-soft mb-3">
        <div className="flex items-center gap-1.5">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
          {p.wilaya}{p.teaches_at ? ` · ${p.teaches_at}` : ""}
        </div>
      </div>

      {/* Teaching-type badges */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {(types.length ? types : ([p.mode === "online" ? "online" : "private"] as TeachType[])).map((t) => (
          <span key={t} className="text-[10px] font-semibold bg-surface-3 text-fg rounded-full px-2 py-0.5">
            {isAr ? TEACH_LABEL[t].ar : TEACH_LABEL[t].fr}
          </span>
        ))}
      </div>

      {p.bio && <p className="text-xs text-fg-soft leading-relaxed flex-1 mb-4">{p.bio}</p>}

      <div className="flex items-center justify-between gap-2 mt-auto">
        {p.hourly_rate_dzd ? (
          <span className="text-sm font-bold text-fg">
            {p.hourly_rate_dzd.toLocaleString("fr-DZ")} DA<span className="text-xs font-normal text-fg-soft">/h</span>
          </span>
        ) : <span />}
        <button onClick={onBook} className="btn btn-primary btn-sm">{isAr ? "احجز" : "Réserver"}</button>
      </div>
    </article>
  );
}

function BookingModal({ professor, isAr, onClose }: { professor: Professor; isAr: boolean; onClose: () => void }) {
  const [form, setForm] = useState({ studentName: "", grade: "3AS", phone: "", message: "", preferredMode: professor.mode });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ professorId: professor.id, ...form }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Erreur");
      setDone(true);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally {
      setBusy(false);
    }
  };

  const inputClass = "w-full bg-surface border border-line-strong rounded-btn px-3 py-2 text-sm text-fg focus:outline-none focus:border-fg";

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="bg-surface rounded-modal max-w-md w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {done ? (
          <div className="text-center py-4">
            <div className="text-5xl mb-3">✓</div>
            <h2 className="text-xl font-bold text-fg mb-2">{isAr ? "تم إرسال طلبك" : "Demande envoyée"}</h2>
            <p className="text-fg-soft text-sm mb-6">
              {isAr
                ? `سنتواصل معك قريبًا لتأكيد الحجز مع ${professor.full_name}.`
                : `Nous te recontacterons bientôt pour confirmer la réservation avec ${professor.full_name}.`}
            </p>
            <button onClick={onClose} className="btn btn-primary w-full">{isAr ? "حسنًا" : "Fermer"}</button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between mb-1">
              <h2 className="text-lg font-bold text-fg">{isAr ? "حجز مع" : "Réserver avec"} {professor.full_name}</h2>
              <button onClick={onClose} className="text-fg-faint hover:text-fg text-xl leading-none" aria-label="Fermer">✕</button>
            </div>
            <p className="text-xs text-gold font-semibold mb-5">{professor.subject} · {professor.wilaya}</p>
            <div className="space-y-3">
              <label className="block">
                <span className="block text-xs font-semibold text-fg-soft mb-1">{isAr ? "اسم التلميذ" : "Nom de l'élève"}</span>
                <input value={form.studentName} onChange={(e) => setForm((f) => ({ ...f, studentName: e.target.value }))} className={inputClass} />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="block text-xs font-semibold text-fg-soft mb-1">{isAr ? "المستوى" : "Niveau"}</span>
                  <select value={form.grade} onChange={(e) => setForm((f) => ({ ...f, grade: e.target.value }))} className={inputClass}>
                    <option value="1AS">1AS</option><option value="2AS">2AS</option><option value="3AS">3AS (BAC)</option>
                  </select>
                </label>
                <label className="block">
                  <span className="block text-xs font-semibold text-fg-soft mb-1">{isAr ? "النمط" : "Mode"}</span>
                  <select value={form.preferredMode} onChange={(e) => setForm((f) => ({ ...f, preferredMode: e.target.value as Professor["mode"] }))} className={inputClass}>
                    <option value="in_person">{isAr ? "حضوري" : "Présentiel"}</option>
                    <option value="online">{isAr ? "عن بُعد" : "En ligne"}</option>
                    <option value="both">{isAr ? "كلاهما" : "Les deux"}</option>
                  </select>
                </label>
              </div>
              <label className="block">
                <span className="block text-xs font-semibold text-fg-soft mb-1">{isAr ? "رقم الهاتف" : "Téléphone"}</span>
                <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className={inputClass} placeholder="+213 …" />
              </label>
              <label className="block">
                <span className="block text-xs font-semibold text-fg-soft mb-1">{isAr ? "رسالة (اختياري)" : "Message (optionnel)"}</span>
                <textarea value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} rows={3} className={inputClass} />
              </label>
            </div>
            <button onClick={submit} disabled={busy} className="btn btn-primary w-full mt-5 disabled:opacity-60">
              {busy ? (isAr ? "جارٍ الإرسال…" : "Envoi…") : (isAr ? "إرسال طلب الحجز" : "Envoyer la demande")}
            </button>
            <p className="text-xs text-fg-faint text-center mt-2">
              {isAr ? "سيتواصل فريقنا معك لتأكيد الموعد." : "Notre équipe te recontacte pour confirmer le rendez-vous."}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
