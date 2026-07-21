import { getTranslations } from "next-intl/server";
import { AdminShell, requireAdmin } from "@/components/app/AdminShell";
import { createAdminClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/routing";

export const metadata = { title: "Admin · Contenu" };

export default async function ContentPage() {
  const t = await getTranslations("Admin");
  const { profile } = await requireAdmin();
  const admin = createAdminClient();

  // Some tables may not exist if migration 6 isn't applied yet —
  // wrap each in a try so the page doesn't 500.
  const safeCount = async (table: string): Promise<number> => {
    try {
      const r = await admin.from(table).select("*", { count: "exact", head: true });
      return r.count ?? 0;
    } catch {
      return 0;
    }
  };
  const [subjectsCount, chaptersCount, examsCount, writingCount, adabCount, quizCount] = await Promise.all([
    safeCount("subjects"),
    safeCount("chapters"),
    safeCount("exam_papers"),
    safeCount("writing_prompts"),
    safeCount("adab_lessons"),
    safeCount("quiz_questions"),
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
          count={subjectsCount}
        />
        <ContentCard
          href="/admin/contenu/chapitres"
          title="Chapitres"
          subtitle="Découpe chaque matière en chapitres"
          count={chaptersCount}
        />
        <ContentCard
          href="/admin/contenu/quiz-questions"
          title="Questions de quiz"
          subtitle="Banque de questions par chapitre"
          count={quizCount}
        />
        <ContentCard
          href="/admin/contenu/examens"
          title="Sujets d'examens"
          subtitle="Archive Bac & BEM avec PDF"
          count={examsCount}
        />
        <ContentCard
          href="/admin/contenu/writing-prompts"
          title="Sujets de rédaction"
          subtitle="Pour la page « Rédaction du jour »"
          count={writingCount}
        />
        <ContentCard
          href="/admin/contenu/adab"
          title="Bonnes manières"
          subtitle="Leçons d'adab pour les petits"
          count={adabCount}
        />
      </div>

      {/* ── Guide : comment le contenu circule vers les utilisateurs ── */}
      <section className="mt-10 bg-surface border border-line rounded-card p-6 md:p-8">
        <h2 className="text-lg font-bold text-fg mb-1">Comment le contenu arrive aux élèves</h2>
        <p className="text-sm text-fg-soft mb-6">
          Chaque bloc ci-dessus alimente une partie précise de l&apos;espace élève. Voici la chaîne complète.
        </p>

        <div className="space-y-4">
          <FlowRow
            step="1"
            source="Matières"
            arrow="par niveau (1AP → 3AS)"
            dest="Élève · « Mes matières »"
            detail="L'élève ne voit QUE les matières de son niveau (le niveau vient du profil enfant créé par le parent)."
          />
          <FlowRow
            step="2"
            source="Chapitres"
            arrow="rattachés à une matière + leçon FR/AR"
            dest="Élève · liste des chapitres"
            detail="Un chapitre avec une leçon affiche d'abord la leçon, puis le bouton « Commencer le quiz »."
          />
          <FlowRow
            step="3"
            source="Questions de quiz"
            arrow="minimum 3 questions actives par chapitre"
            dest="Élève · quiz du chapitre"
            detail="En dessous de 3 questions, le chapitre est marqué « À venir » et le quiz est bloqué. Le quiz tire 5 questions au hasard — plus la banque est grande, moins l'élève revoit les mêmes."
          />
          <FlowRow
            step="4"
            source="Sujets d'examens (PDF)"
            arrow="type BAC ou BEM + année + filière"
            dest="Élève · « Bac & sujets » + examens blancs"
            detail="Le PDF doit être uploadé dans Supabase Storage (bucket public) et l'URL collée ici."
          />
          <FlowRow
            step="5"
            source="Sujets de rédaction"
            arrow="un sujet par jour"
            dest="Élève · « Rédaction du jour »"
            detail="Affiché en rotation sur la page rédaction."
          />
          <FlowRow
            step="6"
            source="Bonnes manières (adab)"
            arrow="leçons illustrées"
            dest="Petits · « Monde réel » → Adab"
            detail="Visible uniquement dans l'univers des petits (primaire)."
          />
        </div>

        <div className="mt-6 bg-gold/10 border border-gold/30 rounded-xl p-4 text-sm text-fg">
          <strong>Règle d&apos;or :</strong> pour rendre un niveau « complet », il faut — matières ✓
          → chapitres ✓ → leçon par chapitre ✓ → 5+ questions par chapitre ✓. Les migrations SQL
          ont déjà rempli les maths de 5AP, 4AM et 3AS ; le reste s&apos;ajoute ici, page par page.
        </div>
      </section>
    </AdminShell>
  );
}

function FlowRow({
  step, source, arrow, dest, detail,
}: { step: string; source: string; arrow: string; dest: string; detail: string }) {
  return (
    <div className="flex gap-4 items-start">
      <span className="w-7 h-7 rounded-full bg-navy text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
        {step}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="font-semibold text-fg">{source}</span>
          <span className="text-fg-faint text-xs">— {arrow} →</span>
          <span className="font-semibold text-gold">{dest}</span>
        </div>
        <p className="text-xs text-fg-soft mt-1">{detail}</p>
      </div>
    </div>
  );
}

function ContentCard({
  href, title, subtitle, count,
}: { href: string; title: string; subtitle: string; count: number }) {
  return (
    <Link
      href={href as never}
      className="bg-surface border border-line rounded-card p-6 hover:border-gold hover:shadow-card-hover transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="bg-surface-2 text-fg-soft text-xs font-bold px-2 py-1 rounded-full">
          {count}
        </span>
      </div>
      <h3 className="font-semibold text-fg mb-1 group-hover:text-gold transition-colors">{title}</h3>
      <p className="text-xs text-fg-soft">{subtitle}</p>
    </Link>
  );
}
