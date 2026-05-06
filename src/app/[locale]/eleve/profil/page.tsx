import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { StudentShell } from "@/components/app/StudentShell";

export const metadata = { title: "Profil" };

export default async function ProfilePage() {
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
        <h1 className="text-xl font-bold text-fg">{child?.full_name ?? "Étudiant"}</h1>
        <p className="text-fg-soft text-sm">{child?.grade ?? "—"} · Niveau 1</p>
      </div>

      <h2 className="font-semibold text-fg mb-3">Mes trophées</h2>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-surface border border-line rounded-card aspect-square flex items-center justify-center text-fg-faint text-2xl">
            🔒
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-fg-faint">
        Termine ton premier quiz pour débloquer ton premier trophée.
      </p>
    </StudentShell>
  );
}
