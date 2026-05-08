import { redirect } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import { StudentShell } from "@/components/app/StudentShell";
import { Link } from "@/i18n/routing";
import { requireAccessForGrade } from "@/lib/subscriptions";

export const metadata = { title: "Bac & BEM" };

// Map raw subject_slug values from the DB into nicely localized names. The
// table stores slugs like "math", "physiques", "sciences" so we don't have to
// migrate it every time we add a new translation.
function localizeSubject(slug: string, locale: string): string {
  const ar = locale === "ar";
  const map: Record<string, [string, string]> = {
    math: ["Mathématiques", "الرياضيات"],
    mathematiques: ["Mathématiques", "الرياضيات"],
    physiques: ["Sciences physiques", "العلوم الفيزيائية"],
    physique: ["Sciences physiques", "العلوم الفيزيائية"],
    sciences: ["Sciences naturelles", "العلوم الطبيعية"],
    svt: ["Sciences naturelles", "العلوم الطبيعية"],
    philosophie: ["Philosophie", "الفلسفة"],
    francais: ["Français", "اللغة الفرنسية"],
    arabe: ["Arabe", "اللغة العربية"],
    anglais: ["Anglais", "اللغة الإنجليزية"],
    histoire: ["Histoire-géographie", "التاريخ والجغرافيا"],
  };
  const entry = map[slug.toLowerCase()];
  if (!entry) return slug;
  return ar ? entry[1] : entry[0];
}

function localizeFiliere(filiere: string | null | undefined, locale: string): string {
  if (!filiere) return "—";
  const ar = locale === "ar";
  const map: Record<string, [string, string]> = {
    sciences: ["Sciences expérimentales", "علوم تجريبية"],
    math: ["Mathématiques", "رياضيات"],
    techniques: ["Techniques mathématiques", "تقني رياضي"],
    lettres: ["Lettres et philosophie", "آداب وفلسفة"],
    langues: ["Langues étrangères", "لغات أجنبية"],
    gestion: ["Gestion et économie", "تسيير واقتصاد"],
    tc: ["Tronc commun", "جذع مشترك"],
  };
  const entry = map[filiere.toLowerCase()];
  return entry ? (ar ? entry[1] : entry[0]) : filiere;
}

export default async function BacListPage() {
  const t = await getTranslations("EleveBac");
  const locale = await getLocale();
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  // Hard paywall: subscriber required.
  const _activeSub = await requireAccessForGrade(user.id, null);
  void _activeSub;

  const { data: child } = await supabase
    .from("children").select("*").eq("parent_id", user.id).limit(1).maybeSingle();

  // Real archive — descending year so the most recent is on top.
  const admin = createAdminClient();
  const { data: papers } = await admin
    .from("exam_papers")
    .select("id, exam_type, year, filiere, subject_slug, file_url, official")
    .order("year", { ascending: false })
    .order("exam_type")
    .limit(40);

  return (
    <StudentShell active="subjects" childName={child?.full_name} childGrade={child?.grade}>
      <div className="max-w-5xl">
        <h1 className="text-2xl md:text-3xl font-bold text-fg mb-2">{t("page_title")}</h1>
        <p className="text-fg-soft text-sm md:text-base mb-6">{t("subtitle")}</p>

        {/* Two big tiles: countdown + mock exam */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
          <Link href="/eleve/bac/countdown" className="accent-block rounded-card p-5">
            <div className="text-xs text-gold uppercase tracking-wider mb-1">{t("countdown_eyebrow")}</div>
            <div className="text-2xl md:text-3xl font-bold">{t("countdown_value")}</div>
            <div className="text-xs text-white/60 mt-1">{t("countdown_hint")}</div>
          </Link>
          <Link href="/eleve/bac/examen" className="bg-surface border border-line rounded-card p-5 hover:border-fg/40 transition-colors">
            <div className="text-xs text-gold uppercase tracking-wider mb-1">{t("mock_eyebrow")}</div>
            <div className="text-fg font-semibold mb-1 md:text-lg">{t("mock_title")}</div>
            <div className="text-xs text-fg-soft">{t("mock_subtitle")}</div>
          </Link>
        </div>

        {/* Real archive */}
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-base md:text-lg font-semibold text-fg">{t("papers_title")}</h2>
          <span className="text-xs text-fg-soft">{papers?.length ?? 0} {t("papers_count_label")}</span>
        </div>

        {(!papers || papers.length === 0) ? (
          <div className="bg-surface border border-line rounded-card p-8 text-center">
            <div className="text-4xl mb-2">📄</div>
            <p className="font-semibold text-fg mb-1">{t("archive_empty_title")}</p>
            <p className="text-fg-soft text-sm">{t("archive_empty_text")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {papers.map((p) => {
              const examLabel = p.exam_type === "bac"
                ? `${t("exam_bac")} ${p.year}`
                : `${t("exam_bem")} ${p.year}`;
              return (
                <div
                  key={p.id}
                  className="bg-surface border border-line rounded-card p-4 flex flex-col gap-2 hover:border-fg/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gold uppercase tracking-wider">{examLabel}</span>
                    {p.official && (
                      <span className="text-[10px] uppercase font-semibold tracking-wider text-fg-faint">
                        ✓ {t("official")}
                      </span>
                    )}
                  </div>
                  <div className="text-fg font-medium">{localizeSubject(p.subject_slug, locale)}</div>
                  <div className="text-xs text-fg-soft">{localizeFiliere(p.filiere, locale)}</div>
                  {p.file_url ? (
                    <a
                      href={p.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gold font-semibold hover:underline mt-auto pt-2"
                    >
                      {t("paper_download")} →
                    </a>
                  ) : (
                    <span className="text-xs text-fg-faint mt-auto pt-2">{t("paper_format")}</span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <p className="text-center text-xs text-fg-faint mt-6">{t("archive_note")}</p>
      </div>
    </StudentShell>
  );
}
