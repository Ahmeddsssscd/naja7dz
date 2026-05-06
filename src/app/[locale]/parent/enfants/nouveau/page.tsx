import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/app/AppShell";
import { AddChildForm } from "@/components/app/AddChildForm";

export const metadata = { title: "Ajouter un enfant" };

export default async function NewChildPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: profile } = await supabase
    .from("parent_profiles")
    .select("full_name")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <AppShell active="children" parentName={profile?.full_name ?? ""}>
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-fg mb-2">Ajouter un enfant</h1>
        <p className="text-fg-soft mb-8">
          Tu pourras modifier ces informations plus tard depuis sa fiche.
        </p>
        <div className="bg-surface border border-line rounded-card p-7">
          <AddChildForm />
        </div>
      </div>
    </AppShell>
  );
}
