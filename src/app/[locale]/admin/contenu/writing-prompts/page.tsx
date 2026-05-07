import { AdminShell, requireAdmin } from "@/components/app/AdminShell";
import { createAdminClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/routing";
import { WritingPromptsCrud, type WritingPromptRow } from "@/components/app/crud/WritingPromptsCrud";

export const metadata = { title: "Admin · Sujets de rédaction" };

export default async function AdminWritingPromptsPage() {
  const { profile } = await requireAdmin();
  const admin = createAdminClient();
  const { data: rows } = await admin
    .from("writing_prompts")
    .select("id, age_min, age_max, prompt_fr, prompt_ar, type, active")
    .order("created_at", { ascending: false });

  return (
    <AdminShell active="content" adminName={profile.full_name}>
      <div className="mb-6">
        <Link href="/admin/contenu" className="text-sm text-fg-soft hover:text-fg">← Retour au contenu</Link>
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-fg mb-2">Sujets de rédaction</h1>
      <p className="text-fg-soft mb-8">
        Sujets affichés sur la page « Rédaction du jour » de l&apos;élève. Filtrés par âge automatiquement.
      </p>

      <WritingPromptsCrud initialRows={(rows ?? []) as WritingPromptRow[]} />
    </AdminShell>
  );
}
