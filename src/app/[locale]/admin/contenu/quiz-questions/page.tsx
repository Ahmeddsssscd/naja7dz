import { AdminShell, requireAdmin } from "@/components/app/AdminShell";
import { createAdminClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/routing";
import { QuizQuestionsCrud, type QuizQuestionRow, type ChapterOption } from "@/components/app/crud/QuizQuestionsCrud";

export const metadata = { title: "Admin · Questions de quiz" };

export default async function AdminQuizQuestionsPage() {
  const { profile } = await requireAdmin();
  const admin = createAdminClient();
  const [{ data: rows }, { data: chapters }] = await Promise.all([
    admin
      .from("quiz_questions")
      .select(
        "id, chapter_id, prompt_fr, prompt_ar, options_fr, options_ar, correct_index, " +
        "explanation_fr, explanation_ar, difficulty, active, sort_order, " +
        "chapters(title_fr, subjects(name_fr, grade_code))",
      )
      .order("sort_order"),
    admin
      .from("chapters")
      .select("id, title_fr, sort_order, subjects(name_fr, grade_code)")
      .order("sort_order"),
  ]);

  const chapterOptions: ChapterOption[] = (chapters ?? []).map((c) => {
    const s = Array.isArray(c.subjects) ? c.subjects[0] : c.subjects;
    return {
      id: c.id,
      title_fr: c.title_fr,
      subject_name: s?.name_fr ?? "—",
      grade_code: s?.grade_code ?? "—",
    };
  });

  return (
    <AdminShell active="content" adminName={profile.full_name}>
      <div className="mb-6">
        <Link href="/admin/contenu" className="text-sm text-fg-soft hover:text-fg">← Retour au contenu</Link>
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-fg mb-2">Questions de quiz</h1>
      <p className="text-fg-soft mb-8">
        Banque de questions par chapitre. Les élèves reçoivent 5 questions tirées au hasard à chaque quiz.
      </p>

      {!chapterOptions.length && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-300 rounded-card p-4 mb-6 text-sm">
          ⚠️ Aucun chapitre.{" "}
          <Link href="/admin/contenu/chapitres" className="underline font-semibold">
            Crée d&apos;abord les chapitres
          </Link>
          {" "}avant d&apos;ajouter des questions.
        </div>
      )}

      <QuizQuestionsCrud
        initialRows={(rows ?? []) as unknown as QuizQuestionRow[]}
        chapterOptions={chapterOptions}
      />
    </AdminShell>
  );
}
