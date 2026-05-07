import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/app/AppShell";
import { ControlsForm } from "@/components/app/ControlsForm";
import { Link } from "@/i18n/routing";

export const metadata = { title: "Contrôle parental" };

export default async function ControlsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations("ParentControls");
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const [{ data: profile }, { data: child }, { data: controls }] = await Promise.all([
    supabase.from("parent_profiles").select("full_name").eq("user_id", user.id).maybeSingle(),
    supabase.from("children").select("id, full_name, age, grade").eq("id", id).eq("parent_id", user.id).maybeSingle(),
    supabase.from("parent_controls").select("*").eq("child_id", id).maybeSingle(),
  ]);

  if (!child) notFound();

  return (
    <AppShell active="children" parentName={profile?.full_name ?? ""}>
      <div className="max-w-2xl">
        <Link href={{ pathname: "/parent/enfants/[id]", params: { id: child.id } } as never} className="text-sm text-fg-soft hover:text-fg mb-3 inline-block">
          {t("back_to_profile")} {child.full_name}
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-fg mb-2">{t("page_title")}</h1>
        <p className="text-fg-soft mb-8">
          {t("page_subtitle")} <strong className="text-fg">{child.full_name}</strong>.
        </p>

        <ControlsForm
          childId={child.id}
          initial={
            controls ?? {
              daily_time_limit_minutes: 60,
              lock_games_until_quizzes: false,
              allowed_kids_universe: true,
              allowed_social: false,
              bedtime_start: null,
              bedtime_end: null,
            }
          }
        />
      </div>
    </AppShell>
  );
}
