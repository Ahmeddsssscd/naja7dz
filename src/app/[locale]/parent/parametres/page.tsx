import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/app/AppShell";
import { Link } from "@/i18n/routing";

export const metadata = { title: "Paramètres" };

export default async function SettingsPage() {
  const t = await getTranslations("ParentSettings");
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: profile } = await supabase
    .from("parent_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <AppShell active="settings" parentName={profile?.full_name ?? ""}>
      <div className="max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-bold text-fg mb-2">{t("page_title")}</h1>
        <p className="text-fg-soft mb-8">{t("subtitle")}</p>

        <section className="bg-surface border border-line rounded-card p-7 mb-6">
          <h2 className="text-lg font-semibold text-fg mb-4">{t("profile_section")}</h2>
          <dl className="space-y-3 text-sm">
            <Row label={t("field_name")} value={profile?.full_name ?? "—"} />
            <Row label={t("field_email")} value={user.email ?? "—"} />
            <Row label={t("field_phone")} value={profile?.phone ?? "—"} />
            <Row label={t("field_wilaya")} value={profile?.wilaya ?? "—"} />
            <Row label={t("field_lang")} value={profile?.language_pref === "ar" ? t("lang_ar") : t("lang_fr")} />
          </dl>
        </section>

        <section className="bg-surface border border-line rounded-card p-7 mb-6">
          <h2 className="text-lg font-semibold text-fg mb-3">{t("security_section")}</h2>
          <p className="text-fg-soft text-sm mb-4">{t("security_text")}</p>
          <Link href="/parent/parametres/mot-de-passe" className="btn btn-outline">
            {t("change_password")}
          </Link>
        </section>

        <section className="bg-surface border border-line rounded-card p-7">
          <h2 className="text-lg font-semibold text-fg mb-3">{t("delete_section")}</h2>
          <p className="text-fg-soft text-sm mb-4">{t("delete_text")}</p>
          <p className="text-xs text-fg-faint">
            {t("delete_action")}{" "}
            <a href={`mailto:${t("delete_email")}`} className="underline">{t("delete_email")}</a>.
          </p>
        </section>
      </div>
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-line pb-3 last:border-b-0 last:pb-0">
      <dt className="text-fg-soft">{label}</dt>
      <dd className="text-fg font-medium">{value}</dd>
    </div>
  );
}
