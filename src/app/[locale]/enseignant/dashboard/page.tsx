/**
 * /enseignant/dashboard — teacher's class list + quick actions.
 *
 * Editorial style with surface/line tokens — no emoji. Stroke icons in
 * 11×11 rounded-square containers for KPIs and quick links.
 */
import { redirect } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/routing";
import { CreateClassButton } from "@/components/app/enseignant/CreateClassButton";
import { TeacherShell } from "@/components/app/TeacherShell";
import {
  BookIcon,
  UsersIcon,
  ClipboardIcon,
  ArrowRightIcon,
  FileTextIcon,
  MapPinIcon,
} from "@/components/Icon";

export const metadata = { title: "Tableau de bord enseignant" };

export default async function TeacherDashboard() {
  const t = await getTranslations("Enseignant");
  const locale = await getLocale();
  const isAr = locale === "ar";
  const supabase = await createServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: profile } = await supabase
    .from("teacher_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!profile) redirect("/enseignant");

  const { data: classes } = await supabase
    .from("teacher_classes")
    .select("id, name, grade, school_year, created_at")
    .eq("teacher_id", user.id)
    .order("created_at", { ascending: false });

  const classIds = (classes ?? []).map((c) => c.id);
  const { data: studentCounts } = await supabase
    .from("class_students")
    .select("class_id")
    .in("class_id", classIds.length ? classIds : ["00000000-0000-0000-0000-000000000000"]);
  const countByClass: Record<string, number> = {};
  for (const s of studentCounts ?? []) {
    countByClass[s.class_id] = (countByClass[s.class_id] ?? 0) + 1;
  }

  const initials = profile.full_name.split(" ").map((n: string) => n[0]).slice(0, 2).join("");

  return (
    <TeacherShell active="dashboard" teacherName={profile.full_name}>
      {/* Hero */}
      <section className="py-12 md:py-16 bg-surface-2">
        <div className="container-x max-w-5xl">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-card bg-surface-3 text-fg font-bold inline-flex items-center justify-center flex-shrink-0">
                {initials}
              </div>
              <div>
                <span className="eyebrow mb-1 block">{isAr ? "لوحة التحكّم" : "Tableau de bord"}</span>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-fg leading-tight">
                  {isAr ? `أهلاً ${profile.full_name}` : `Bonjour ${profile.full_name}`}
                </h1>
                {(profile.school_name || profile.wilaya) && (
                  <div className="flex items-center gap-2 text-sm text-fg-soft mt-1.5 flex-wrap">
                    {profile.school_name && <span>{profile.school_name}</span>}
                    {profile.school_name && profile.wilaya && <span className="text-fg-faint">·</span>}
                    {profile.wilaya && (
                      <span className="inline-flex items-center gap-1">
                        <MapPinIcon size={12} /> {profile.wilaya}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            <CreateClassButton />
          </div>
        </div>
      </section>

      {/* Approval status banner — explains why community/messages are locked */}
      {profile.status !== "approved" && (
        <section className="pt-6 bg-surface">
          <div className="container-x max-w-5xl">
            <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-card p-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-amber-700 dark:text-amber-400 flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <div>
                <div className="font-semibold text-amber-900 dark:text-amber-200 text-sm">
                  {isAr ? "حسابك قيد المراجعة" : "Ton compte est en cours de validation"}
                </div>
                <p className="text-xs text-amber-800 dark:text-amber-300/80 mt-0.5">
                  {isAr
                    ? "ستُفتح لك المجتمع والرسائل بمجرد تأكيد فريقنا لملفك."
                    : "La communauté et la messagerie s'ouvriront dès que notre équipe aura confirmé ton profil."}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* KPIs */}
      <section className="py-10 bg-surface">
        <div className="container-x max-w-5xl">
          <div className="grid grid-cols-3 gap-4">
            <Kpi label={t("kpi_classes")} value={String(classes?.length ?? 0)} icon={<BookIcon />} />
            <Kpi label={t("kpi_students")} value={String(studentCounts?.length ?? 0)} icon={<UsersIcon />} />
            <Kpi label={t("kpi_devoirs")} value="0" icon={<ClipboardIcon />} />
          </div>
        </div>
      </section>

      {/* Teacher tools */}
      <section className="pb-2 bg-surface">
        <div className="container-x max-w-5xl">
          <div className="grid sm:grid-cols-3 gap-4">
            <ToolCard href="/enseignant/exercices"
              title={isAr ? "مولّد التمارين" : "Générateur d'exercices"}
              sub={isAr ? "أنشئ تمارين جاهزة لتلاميذك" : "Crée des exercices prêts pour tes élèves"}
              icon={<path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" />} />
            <ToolCard href="/enseignant/communaute"
              title={isAr ? "مجتمع الأساتذة" : "Communauté enseignants"}
              sub={isAr ? "شارك وتبادل مع زملائك" : "Partage et échange avec tes collègues"}
              icon={<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>} />
            <ToolCard href="/enseignant/messages"
              title={isAr ? "الرسائل والطلبات" : "Messages & demandes"}
              sub={isAr ? "طلبات التلاميذ ومراسلة الأساتذة" : "Demandes d'élèves + messages professeurs"}
              icon={<><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 6L2 7" /></>} />
            <ToolCard href="/enseignant/reseau"
              title={isAr ? "شبكة الأساتذة" : "Réseau enseignants"}
              sub={isAr ? "تصفّح ملفات الأساتذة" : "Parcours les profils d'enseignants"}
              icon={<><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></>} />
          </div>
        </div>
      </section>

      {/* Classes list */}
      <section className="py-12 bg-surface">
        <div className="container-x max-w-5xl">
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="text-xl font-semibold text-fg">{t("section_classes")}</h2>
          </div>

          {classes && classes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {classes.map((c) => (
                <Link
                  key={c.id}
                  href={`/enseignant/classes/${c.id}` as never}
                  className="bg-surface border border-line rounded-card p-5 hover:shadow-card-hover hover:border-fg/40 transition flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-card bg-surface-3 text-fg font-bold inline-flex items-center justify-center flex-shrink-0">
                    {c.grade}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-fg leading-tight">{c.name}</div>
                    <div className="text-xs text-fg-soft mt-1">{c.school_year}</div>
                    <div className="text-sm text-fg-soft mt-2 inline-flex items-center gap-1.5">
                      <UsersIcon size={14} />
                      {countByClass[c.id] ?? 0} {isAr ? "تلميذ" : "élèves"}
                    </div>
                  </div>
                  <ArrowRightIcon size={16} className="text-fg-faint flex-shrink-0 mt-1" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-surface border border-dashed border-line rounded-card p-10 text-center">
              <div className="w-12 h-12 rounded-card bg-surface-3 text-fg inline-flex items-center justify-center mb-4">
                <BookIcon />
              </div>
              <h3 className="font-semibold text-fg mb-1">{t("empty_classes_title")}</h3>
              <p className="text-sm text-fg-soft mb-5 max-w-sm mx-auto">{t("empty_classes_sub")}</p>
              <CreateClassButton />
            </div>
          )}
        </div>
      </section>

      {/* Quick links */}
      <section className="py-12 bg-surface-2">
        <div className="container-x max-w-5xl">
          <h3 className="text-xs font-semibold text-fg-faint uppercase tracking-wider mb-4">
            {t("quick_links")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <QuickLink href="/eleve/pratique" icon={<FileTextIcon />} title={t("ql_quizzes_title")} sub={t("ql_quizzes_sub")} />
            <QuickLink href="/parent/catalogue" icon={<BookIcon />} title={t("ql_catalog_title")} sub={t("ql_catalog_sub")} />
            <QuickLink href="/contact" icon={<ClipboardIcon />} title={t("ql_contact_title")} sub={t("ql_contact_sub")} />
          </div>
        </div>
      </section>
    </TeacherShell>
  );
}

function Kpi({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-surface border border-line rounded-card p-5">
      <div className="w-10 h-10 rounded-[10px] bg-surface-3 text-fg inline-flex items-center justify-center mb-4">
        {icon}
      </div>
      <div className="text-3xl font-bold text-fg leading-none">{value}</div>
      <div className="text-xs text-fg-faint uppercase tracking-wider mt-1.5">{label}</div>
    </div>
  );
}

function ToolCard({ href, title, sub, icon }: { href: string; title: string; sub: string; icon: React.ReactNode }) {
  return (
    <Link href={href as never} className="bg-surface border border-line rounded-card p-5 hover:border-gold hover:shadow-card-hover transition group">
      <span className="w-10 h-10 rounded-[10px] bg-surface-3 text-fg inline-flex items-center justify-center mb-3 group-hover:bg-gold group-hover:text-navy transition-colors">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
      </span>
      <div className="font-semibold text-fg group-hover:text-gold transition-colors">{title}</div>
      <div className="text-xs text-fg-soft mt-1">{sub}</div>
    </Link>
  );
}

function QuickLink({ href, icon, title, sub }: { href: string; icon: React.ReactNode; title: string; sub: string }) {
  return (
    <Link
      href={href as never}
      className="bg-surface border border-line rounded-card p-4 flex items-center gap-3 hover:shadow-card-hover hover:border-fg/40 transition"
    >
      <div className="w-10 h-10 rounded-[10px] bg-surface-3 text-fg inline-flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-fg text-sm leading-tight">{title}</div>
        <div className="text-xs text-fg-soft truncate">{sub}</div>
      </div>
      <ArrowRightIcon size={14} className="text-fg-faint" />
    </Link>
  );
}
