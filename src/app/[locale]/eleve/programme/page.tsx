import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import { StudentShell } from "@/components/app/StudentShell";
import { WeeklyPlanner, type PlannerChapter } from "@/components/app/WeeklyPlanner";
import { requireAccessForGrade } from "@/lib/subscriptions";

export const metadata = { title: "Mon programme" };

export default async function PlannerPage() {
  const locale = await getLocale();
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  await requireAccessForGrade(user.id, null);

  const { data: child } = await supabase
    .from("children").select("id, full_name, grade").eq("parent_id", user.id).order("created_at").limit(1).maybeSingle();
  if (!child) redirect("/parent");

  // Catalog of the child's grade modules (subject + chapter) to schedule.
  const admin = createAdminClient();
  const chapters: PlannerChapter[] = [];
  if (child.grade) {
    const { data: subjects } = await admin
      .from("subjects")
      .select("id, name_fr, name_ar")
      .eq("grade_code", child.grade)
      .order("sort_order");
    const subjById = new Map((subjects ?? []).map((s) => [s.id, s]));
    const { data: chaps } = await admin
      .from("chapters")
      .select("id, title_fr, title_ar, subject_id, sort_order")
      .in("subject_id", (subjects ?? []).map((s) => s.id))
      .order("sort_order");
    for (const c of chaps ?? []) {
      const s = subjById.get(c.subject_id);
      chapters.push({
        id: c.id,
        subjectId: c.subject_id,
        subjectNameFr: s?.name_fr ?? "",
        subjectNameAr: s?.name_ar ?? null,
        titleFr: c.title_fr,
        titleAr: c.title_ar,
      });
    }
  }

  return (
    <StudentShell active="planner" childName={child.full_name} childGrade={child.grade}>
      <WeeklyPlanner chapters={chapters} locale={locale === "ar" ? "ar" : "fr"} />
    </StudentShell>
  );
}
