import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/app/AppShell";
import { Link } from "@/i18n/routing";
import {
  UsersIcon,
  ArrowRightIcon,
  BookIcon,
  ChartIcon,
  ClipboardIcon,
} from "@/components/Icon";

export const metadata = { title: "Rapports" };

export default async function ReportsPage() {
  const t = await getTranslations("ParentReports");
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: profile } = await supabase
    .from("parent_profiles")
    .select("full_name")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <AppShell active="reports" parentName={profile?.full_name ?? ""}>
      <div className="max-w-4xl">
        <h1 className="text-2xl md:text-3xl font-bold text-fg mb-2">{t("page_title")}</h1>
        <p className="text-fg-soft mb-8">{t("subtitle")}</p>

        {/* Coming-soon placeholder for actual report content */}
        <div className="bg-surface border border-dashed border-line rounded-card p-10 text-center mb-8">
          <div className="w-12 h-12 mx-auto rounded-card bg-surface-3 text-fg inline-flex items-center justify-center mb-3">
            <ChartIcon />
          </div>
          <p className="font-semibold text-fg mb-1">{t("empty_title")}</p>
          <p className="text-sm text-fg-soft max-w-md mx-auto">{t("empty_text")}</p>
        </div>

        {/* Parent-to-teacher / parent-to-helper CTAs */}
        <h2 className="text-base font-semibold text-fg mb-4">{t("after_section_title")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/enseignant/reseau"
            className="bg-surface border border-line rounded-card p-5 hover:shadow-card-hover hover:border-fg/40 transition flex items-start gap-4"
          >
            <div className="w-11 h-11 rounded-[10px] bg-surface-3 text-fg inline-flex items-center justify-center flex-shrink-0">
              <UsersIcon />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-fg text-base">{t("cta_teacher_title")}</h3>
              <p className="text-sm text-fg-soft mt-1">{t("cta_teacher_sub")}</p>
              <span className="text-xs text-fg-faint mt-2 inline-flex items-center gap-1">
                {t("cta_teacher_link")} <ArrowRightIcon size={12} />
              </span>
            </div>
          </Link>

          <Link
            href="/fac/aide"
            className="bg-surface border border-line rounded-card p-5 hover:shadow-card-hover hover:border-fg/40 transition flex items-start gap-4"
          >
            <div className="w-11 h-11 rounded-[10px] bg-surface-3 text-fg inline-flex items-center justify-center flex-shrink-0">
              <BookIcon />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-fg text-base">{t("cta_helper_title")}</h3>
              <p className="text-sm text-fg-soft mt-1">{t("cta_helper_sub")}</p>
              <span className="text-xs text-fg-faint mt-2 inline-flex items-center gap-1">
                {t("cta_helper_link")} <ArrowRightIcon size={12} />
              </span>
            </div>
          </Link>

          <Link
            href="/parent/expliquer"
            className="bg-surface border border-line rounded-card p-5 hover:shadow-card-hover hover:border-fg/40 transition flex items-start gap-4 md:col-span-2"
          >
            <div className="w-11 h-11 rounded-[10px] bg-surface-3 text-fg inline-flex items-center justify-center flex-shrink-0">
              <ClipboardIcon />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-fg text-base">{t("cta_explain_title")}</h3>
              <p className="text-sm text-fg-soft mt-1">{t("cta_explain_sub")}</p>
              <span className="text-xs text-fg-faint mt-2 inline-flex items-center gap-1">
                {t("cta_explain_link")} <ArrowRightIcon size={12} />
              </span>
            </div>
          </Link>
        </div>

        {/* Subscriber perk note */}
        <div className="bg-gold/10 border border-gold rounded-card p-4 mt-6 text-sm">
          <strong className="text-fg block mb-0.5">{t("perk_title")}</strong>
          <span className="text-fg-soft">{t("perk_text")}</span>
        </div>
      </div>
    </AppShell>
  );
}
