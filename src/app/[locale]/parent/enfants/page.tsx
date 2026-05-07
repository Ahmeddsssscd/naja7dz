import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/app/AppShell";
import { Link } from "@/i18n/routing";

export const metadata = { title: "Mes enfants" };

export default async function ChildrenListPage() {
  const t = await getTranslations("ParentChildren");
  const tHome = await getTranslations("ParentHome");
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const [{ data: profile }, { data: children }] = await Promise.all([
    supabase.from("parent_profiles").select("full_name").eq("user_id", user.id).maybeSingle(),
    supabase.from("children").select("*").eq("parent_id", user.id).order("created_at"),
  ]);

  return (
    <AppShell active="children" parentName={profile?.full_name ?? ""}>
      <div className="max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-fg mb-1">{t("page_title")}</h1>
            <p className="text-fg-soft">{t("subtitle")}</p>
          </div>
          <Link href="/parent/enfants/nouveau" className="btn btn-primary">
            {t("add_child")}
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {(children ?? []).map((c) => (
            <Link
              key={c.id}
              href={`/parent/enfants/${c.id}` as never}
              className="bg-surface border border-line rounded-card p-6 hover:shadow-card-hover transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="w-14 h-14 rounded-full bg-pale-blue text-navy text-xl font-bold flex items-center justify-center">
                  {c.full_name.split(" ").map((s: string) => s[0]).slice(0, 2).join("")}
                </span>
                <div>
                  <h3 className="font-semibold text-fg">{c.full_name}</h3>
                  <p className="text-xs text-fg-soft">
                    {c.age ? tHome("years_old", { age: c.age }) : ""} · {c.grade ?? "—"}
                  </p>
                </div>
              </div>
              <div className="text-sm text-fg-soft">{t("view_profile")}</div>
            </Link>
          ))}
        </div>

        {(!children || children.length === 0) && (
          <div className="bg-surface border border-line rounded-card p-12 text-center">
            <p className="text-fg-soft mb-4">{t("empty_title")}</p>
            <Link href="/parent/enfants/nouveau" className="btn btn-primary">
              {t("empty_cta")}
            </Link>
          </div>
        )}
      </div>
    </AppShell>
  );
}
