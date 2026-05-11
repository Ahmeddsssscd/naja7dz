/**
 * /parent/expliquer — "Mode questions du parent".
 *
 * Parent asks "comment expliquer X à un Y" and gets a structured starter
 * framework + the question is stored so a Najah tutor can follow up with
 * a deeper personalised answer (and later, real AI will plug in here).
 */
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/routing";
import { ExplainerForm } from "@/components/app/parent/ExplainerForm";

export const metadata = { title: "Mode questions du parent" };

export default async function ExplainerPage() {
  const t = await getTranslations("ParentExplain");
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  return (
    <div className="min-h-screen bg-cream dark:bg-surface-2 pb-12">
      <header className="px-5 lg:px-8 pt-5 pb-4 max-w-3xl mx-auto">
        <Link href="/parent" className="text-xs text-fg-soft hover:text-navy">← {t("back")}</Link>
        <h1 className="text-2xl md:text-3xl font-bold text-navy mt-2">💡 {t("page_title")}</h1>
        <p className="text-sm text-fg-soft mt-1 max-w-prose">{t("page_sub")}</p>
      </header>

      <main className="max-w-3xl mx-auto px-5 lg:px-8">
        <ExplainerForm />
      </main>
    </div>
  );
}
