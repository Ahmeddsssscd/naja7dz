"use client";

/**
 * Public professors directory with client-side filters (subject, wilaya,
 * mode) and an inline booking-request modal that posts to /api/bookings.
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
  bio: string | null;
  hourly_rate_dzd: number | null;
  verified: boolean;
}

const MODE_LABEL: Record<string, { fr: string; ar: string }> = {
  in_person: { fr: "Présentiel", ar: "حضوري" },
  online: { fr: "En ligne", ar: "عن بُعد" },
  both: { fr: "Présentiel + en ligne", ar: "حضوري وعن بُعد" },
};

export function ProfessorsDirectory({ professors }: { professors: Professor[] }) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const [subject, setSubject] = useState("");
  const [wilaya, setWilaya] = useState("");
  const [mode, setMode] = useState("");
  const [booking, setBooking] = useState<Professor | null>(null);

  const subjects = useMemo(() => [...new Set(professors.map((p) => p.subject))].sort(), [professors]);
  const wilayas = useMemo(() => [...new Set(professors.map((p) => p.wilaya))].sort(), [professors]);

  const filtered = professors.filter(
    (p) =>
      (!subject || p.subject === subject) &&
      (!wilaya || p.wilaya === wilaya) &&
      (!mode || p.mode === mode || (mode !== "both" && p.mode === "both")),
  );

  const selectClass =
    "h-11 px-3 bg-surface border border-line-strong rounded-btn text-sm text-fg focus:outline-none focus:border-fg";

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select value={subject} onChange={(e) => setSubject(e.target.value)} className={selectClass}>
          <option value="">{isAr ? "كل المواد" : "Toutes les matières"}</option>
          {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={wilaya} onChange={(e) => setWilaya(e.target.value)} className={selectClass}>
          <option value="">{isAr ? "كل الولايات" : "Toutes les wilayas"}</option>
          {wilayas.map((w) => <option key={w} value={w}>{w}</option>)}
        </select>
        <select value={mode} onChange={(e) => setMode(e.target.value)} className={selectClass}>
          <option value="">{isAr ? "كل الأنماط" : "Tous les modes"}</option>
          <option value="in_person">{isAr ? "حضوري" : "Présentiel"}</option>
          <option value="online">{isAr ? "عن بُعد" : "En ligne"}</option>
        </select>
        <span className="ms-auto text-sm text-fg-soft self-center">
          {filtered.length} {isAr ? "أستاذ" : filtered.length > 1 ? "professeurs" : "professeur"}
        </span>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="bg-surface-2 border border-line rounded-card p-12 text-center text-fg-soft">
          {isAr ? "لا يوجد أستاذ يطابق بحثك." : "Aucun professeur ne correspond à ta recherche."}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p) => (
            <article key={p.id} className="bg-surface border border-line rounded-card p-5 flex flex-col">
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
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {p.wilaya}{p.teaches_at ? ` · ${p.teaches_at}` : ""}
                </div>
                <div className="flex items-center gap-1.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                  {isAr ? MODE_LABEL[p.mode].ar : MODE_LABEL[p.mode].fr}
                </div>
              </div>

              {p.bio && <p className="text-xs text-fg-soft leading-relaxed flex-1 mb-4">{p.bio}</p>}

              <div className="flex items-center justify-between gap-2 mt-auto">
                {p.hourly_rate_dzd ? (
                  <span className="text-sm font-bold text-fg">
                    {p.hourly_rate_dzd.toLocaleString("fr-DZ")} DA<span className="text-xs font-normal text-fg-soft">/h</span>
                  </span>
                ) : <span />}
                <button onClick={() => setBooking(p)} className="btn btn-primary btn-sm">
                  {isAr ? "احجز" : "Réserver"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {booking && (
        <BookingModal professor={booking} isAr={isAr} onClose={() => setBooking(null)} />
      )}
    </div>
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

  const inputClass =
    "w-full bg-surface border border-line-strong rounded-btn px-3 py-2 text-sm text-fg focus:outline-none focus:border-fg";

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
                    <option value="1AS">1AS</option>
                    <option value="2AS">2AS</option>
                    <option value="3AS">3AS (BAC)</option>
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
