import { getTranslations } from "next-intl/server";
import { AdminShell, requireAdmin } from "@/components/app/AdminShell";
import { createAdminClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/routing";

export const metadata = { title: "Admin · Contenu" };

export default async function ContentPage() {
  const t = await getTranslations("Admin");
  const { profile } = await requireAdmin();
  const admin = createAdminClient();

  const [
    { count: subjectsCount },
    { count: chaptersCount },
    { count: examsCount },
    { count: writingCount },
    { count: adabCount },
  ] = await Promise.all([
    admin.from("subjects").select("*", { count: "exact", head: true }),
    admin.from("chapters").select("*", { count: "exact", head: true }),
    admin.from("exam_papers").select("*", { count: "exact", head: true }),
    admin.from("writing_prompts").select("*", { count: "exact", head: true }),
    admin.from("adab_lessons").select("*", { count: "exact", head: true }),
  ]);

  return (
    <AdminShell active="content" adminName={profile.full_name}>
      <h1 className="text-2xl md:text-3xl font-bold text-fg mb-2">{t("content_title")}</h1>
      <p className="text-fg-soft mb-8">{t("content_subtitle")}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <ContentCard
          href="/admin/contenu/matieres"
          title="Matières"
          subtitle="Gère les matières par niveau (1AP → 3AS)"
          count={subjectsCount ?? 0}
          emoji="📚"
        />
        <ContentCard
          href="/admin/contenu/chapitres"
          title="Chapitres"
          subtitle="Découpe chaque matière en chapitres"
          count={chaptersCount ?? 0}
          emoji="📖"
        />
        <ContentCard
          href="/admin/contenu/examens"
          title="Sujets d'examens"
          subtitle="Archive Bac & BEM avec PDF"
          count={examsCount ?? 0}
          emoji="📝"
        />
        <ContentCard
          href="/admin/contenu/writing-prompts"
          title="Sujets de rédaction"
          subtitle="Pour la page « Rédaction du jour »"
          count={writingCount ?? 0}
          emoji="✍️"
        />
        <ContentCard
          href="/admin/contenu/adab"
          title="Bonnes manières"
          subtitle="Leçons d'adab pour les petits"
          count={adabCount ?? 0}
          emoji="🤲"
        />
      </div>
    </AdminShell>
  );
}

function ContentCard({
  href, title, subtitle, count, emoji,
}: { href: string; title: string; subtitle: string; count: number; emoji: string }) {
  return (
    <Link
      href={href as never}
      className="bg-surface border border-line rounded-card p-6 hover:border-gold hover:shadow-card-hover transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-3xl">{emoji}</span>
        <span className="bg-surface-2 text-fg-soft text-xs font-bold px-2 py-1 rounded-full">
          {count}
        </span>
      </div>
      <h3 className="font-semibold text-fg mb-1 group-hover:text-gold transition-colors">{title}</h3>
      <p className="text-xs text-fg-soft">{subtitle}</p>
    </Link>
  );
}
