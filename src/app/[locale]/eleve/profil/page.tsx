import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { StudentShell } from "@/components/app/StudentShell";

export const metadata = { title: "Profil" };

export default async function ProfilePage() {
  const t = await getTranslations("EleveProfil");
  const tStudent = await getTranslations("Student");
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: child } = await supabase
    .from("children").select("*").eq("parent_id", user.id).limit(1).maybeSingle();

  const initials = (child?.full_name ?? "?").split(" ").map((s: string) => s[0]).slice(0, 2).join("");

  return (
    <StudentShell active="profile" childName={child?.full_name} childGrade={child?.grade}>
      <div className="text-center mb-6">
        <span className="inline-flex w-20 h-20 rounded-full bg-navy text-white text-2xl font-bold items-center justify-center mb-3">
          {initials}
        </span>
        <h1 className="text-xl font-bold text-fg">{child?.full_name ?? tStudent("default_name")}</h1>
        <p className="text-fg-soft text-sm">{child?.grade ?? "—"} · {t("level", { n: 1 })}</p>
      </div>

      <h2 className="font-semibold text-fg mb-3">{t("trophies")}</h2>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-surface border border-line rounded-card aspect-square flex items-center justify-center text-fg-faint">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-fg-faint">{t("trophy_unlock_hint")}</p>
    </StudentShell>
  );
}
