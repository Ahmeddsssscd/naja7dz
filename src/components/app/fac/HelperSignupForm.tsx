"use client";

/**
 * HelperSignupForm — applicant fills this; admin reviews; profile goes
 * live once approved.
 *
 * Tabs at the top toggle student vs. pro fields. Universities come from the
 * static catalogue (UNIVERSITIES) so the slug lines up with /fac/aide
 * filtering.
 */

import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { UNIVERSITIES } from "./universities";
import { CheckIcon } from "@/components/Icon";

interface Props { userEmail: string }

const SERVICES = [
  { v: "orientation", fr: "Orientation", ar: "توجيه" },
  { v: "memoire",     fr: "Mémoire / PFE", ar: "مذكرة" },
  { v: "exercises",   fr: "Exercices",     ar: "تمارين" },
  { v: "dossier",     fr: "Dossier / CV",  ar: "ملف / السيرة" },
  { v: "tutoring",    fr: "Cours particuliers", ar: "دروس خصوصية" },
  { v: "language",    fr: "Langues",       ar: "لغات" },
];

export function HelperSignupForm({ userEmail }: Props) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const router = useRouter();

  const [helperType, setHelperType] = useState<"student" | "pro">("student");
  const [displayName, setDisplayName] = useState("");
  const [lastInitial, setLastInitial] = useState("");
  const [uniSlug, setUniSlug] = useState(UNIVERSITIES[0]?.slug ?? "");
  const [studyYear, setStudyYear] = useState(2);
  const [field, setField] = useState("");
  const [profession, setProfession] = useState("");
  const [experienceYears, setExperienceYears] = useState(2);
  const [services, setServices] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [respondsWithin, setRespondsWithin] = useState("24h");
  const [hourlyRate, setHourlyRate] = useState<string>("");

  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const toggleService = (v: string) =>
    setServices((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v]));

  const submit = async () => {
    if (displayName.trim().length < 2) {
      setErr(isAr ? "الاسم مطلوب" : "Nom requis"); return;
    }
    if (services.length === 0) {
      setErr(isAr ? "اختر خدمة واحدة على الأقل" : "Choisis au moins un service"); return;
    }
    if (bio.trim().length < 30) {
      setErr(isAr ? "اشرح ما تقدّمه — ٣٠ حرفاً على الأقل" : "Décris ce que tu offres (30 caractères min)"); return;
    }

    setSubmitting(true); setErr(null);
    try {
      const r = await fetch("/api/marketplace/helper-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          display_name: displayName.trim(),
          last_initial: lastInitial.trim().slice(0, 1) || null,
          helper_type: helperType,
          university_slug: helperType === "student" ? uniSlug : null,
          study_year: helperType === "student" ? studyYear : null,
          field: helperType === "student" ? field.trim() : null,
          profession: helperType === "pro" ? profession.trim() : null,
          experience_years: helperType === "pro" ? experienceYears : null,
          services,
          bio: bio.trim(),
          responds_within: respondsWithin,
          hourly_rate_da: hourlyRate ? Number(hourlyRate) : null,
        }),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j.error ?? "Erreur");
      }
      router.push("/fac/mon-profil?submitted=1");
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-surface border border-line rounded-card p-6 md:p-8">
      {/* Type toggle */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        <TypeChip
          label={isAr ? "طالب·ة" : "Étudiant·e"}
          sub={isAr ? "أُدرس في جامعة جزائرية" : "J'étudie dans une université algérienne"}
          active={helperType === "student"}
          onClick={() => setHelperType("student")}
        />
        <TypeChip
          label={isAr ? "محترف·ة" : "Professionnel·le"}
          sub={isAr ? "متخصص·ة في مجالي" : "Je travaille dans mon domaine"}
          active={helperType === "pro"}
          onClick={() => setHelperType("pro")}
        />
      </div>

      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-3">
          <Field label={isAr ? "الاسم الكامل" : "Nom complet"} required>
            <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="input" placeholder={isAr ? "أحمد بن علي" : "Ahmed Benali"} />
            <p className="text-[11px] text-fg-faint mt-1">{isAr ? "نعرض : أحمد ب." : "Affiché publiquement : Ahmed B."}</p>
          </Field>
          <Field label={isAr ? "الحرف الأوّل من اللقب" : "Initiale du nom"}>
            <input value={lastInitial} onChange={(e) => setLastInitial(e.target.value)} maxLength={1} className="input" placeholder="B" />
          </Field>
        </div>

        {helperType === "student" ? (
          <div className="grid md:grid-cols-2 gap-3">
            <Field label={isAr ? "الجامعة" : "Université"} required>
              <select value={uniSlug} onChange={(e) => setUniSlug(e.target.value)} className="input">
                {UNIVERSITIES.map((u) => (
                  <option key={u.slug} value={u.slug}>{isAr ? u.name_ar : u.short}</option>
                ))}
              </select>
            </Field>
            <Field label={isAr ? "السنة الجامعية" : "Année d'études"}>
              <select value={studyYear} onChange={(e) => setStudyYear(Number(e.target.value))} className="input">
                {[1, 2, 3, 4, 5, 6, 7].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </Field>
            <Field label={isAr ? "التخصّص" : "Spécialité"}>
              <input value={field} onChange={(e) => setField(e.target.value)} className="input" placeholder={isAr ? "إعلام آلي، طب..." : "Informatique, médecine…"} />
            </Field>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-3">
            <Field label={isAr ? "المهنة" : "Profession"} required>
              <input value={profession} onChange={(e) => setProfession(e.target.value)} className="input" placeholder={isAr ? "مهندس إعلام آلي" : "Ingénieur informatique"} />
            </Field>
            <Field label={isAr ? "سنوات الخبرة" : "Années d'expérience"}>
              <input value={experienceYears} onChange={(e) => setExperienceYears(Math.max(0, Number(e.target.value) || 0))} type="number" min={0} max={50} className="input" />
            </Field>
          </div>
        )}

        <Field label={isAr ? "الخدمات المُقدَّمة" : "Services que tu offres"} required>
          <div className="flex flex-wrap gap-2">
            {SERVICES.map((s) => {
              const on = services.includes(s.v);
              return (
                <button
                  key={s.v}
                  type="button"
                  onClick={() => toggleService(s.v)}
                  className={`text-xs font-semibold rounded-full px-3 py-1.5 border transition ${
                    on ? "border-fg bg-surface-3 text-fg" : "border-line bg-surface text-fg-soft hover:border-fg/40"
                  }`}
                >
                  {isAr ? s.ar : s.fr}
                </button>
              );
            })}
          </div>
        </Field>

        <Field label={isAr ? "نبذة عنك" : "Présente-toi"} required>
          <textarea
            value={bio} onChange={(e) => setBio(e.target.value)} rows={4}
            placeholder={isAr ? "اشرح ما تقدّمه، أسلوبك، تجربتك..." : "Explique ce que tu offres, ton approche, ton expérience…"}
            className="input"
          />
          <p className="text-[11px] text-fg-faint mt-1">{isAr ? "ظاهر علناً. ٣٠ حرفاً على الأقل." : "Visible publiquement. 30 caractères min."}</p>
        </Field>

        <div className="grid md:grid-cols-2 gap-3">
          <Field label={isAr ? "وقت الرّد المعتاد" : "Délai de réponse habituel"}>
            <select value={respondsWithin} onChange={(e) => setRespondsWithin(e.target.value)} className="input">
              <option value="1h">{isAr ? "ساعة" : "1h"}</option>
              <option value="24h">{isAr ? "٢٤ ساعة" : "24h"}</option>
              <option value="48h">{isAr ? "٤٨ ساعة" : "48h"}</option>
              <option value="1w">{isAr ? "أسبوع" : "1 semaine"}</option>
            </select>
          </Field>
          <Field label={isAr ? "السعر بالساعة (اختياري، دج)" : "Tarif horaire indicatif (DA, facultatif)"}>
            <input value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value.replace(/[^\d]/g, ""))} className="input" placeholder="500" />
          </Field>
        </div>

        {err && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-300 text-red-700 dark:text-red-400 rounded-btn p-3 text-sm">
            {err}
          </div>
        )}

        <div className="bg-surface-3 border border-line rounded-btn p-3 text-xs text-fg-soft inline-flex items-start gap-2">
          <CheckIcon size={14} className="mt-0.5 text-gold flex-shrink-0" />
          <span>
            {isAr
              ? `بعد إرسال طلبك، يراجعه فريق Najah خلال ٤٨ ساعة. سنُعلمك على ${userEmail}.`
              : `Après envoi, l'équipe Najah valide ton profil sous 48h. Tu seras notifié·e sur ${userEmail}.`}
          </span>
        </div>

        <button onClick={submit} disabled={submitting} className="btn btn-primary w-full">
          {submitting ? (isAr ? "..." : "…") : (isAr ? "إرسال للمراجعة" : "Soumettre à validation")}
        </button>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 10px;
          border: 1px solid var(--color-line);
          background: var(--color-surface);
          color: var(--color-fg);
          padding: 0.55rem 0.85rem;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.15s;
        }
        .input:focus { border-color: var(--color-fg); }
      `}</style>
    </div>
  );
}

function TypeChip({ label, sub, active, onClick }: { label: string; sub: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`rounded-card border-2 p-4 text-start transition ${
        active ? "border-gold bg-gold/10" : "border-line bg-surface hover:border-fg/40"
      }`}
    >
      <div className={`font-semibold text-sm md:text-base mb-1 ${active ? "text-fg" : "text-fg-soft"}`}>{label}</div>
      <div className="text-xs text-fg-soft">{sub}</div>
    </button>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-fg mb-1.5">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      {children}
    </div>
  );
}
