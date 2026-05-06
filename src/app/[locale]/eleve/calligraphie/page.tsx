import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { StudentShell } from "@/components/app/StudentShell";

export const metadata = { title: "Calligraphie" };

const ARABIC_LETTERS = ["ا", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر", "ز", "س"];

export default async function CalligraphyPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: child } = await supabase
    .from("children").select("*").eq("parent_id", user.id).limit(1).maybeSingle();

  return (
    <StudentShell active="subjects" childName={child?.full_name} childGrade={child?.grade}>
      <h1 className="text-2xl font-bold text-fg mb-2">Calligraphie arabe</h1>
      <p className="text-fg-soft text-sm mb-6">
        Choisis une lettre, trace-la sur papier, prends une photo. Tu recevras une note sur ta forme.
      </p>

      <h2 className="text-base font-semibold text-fg mb-3">Lettres à pratiquer</h2>
      <div className="grid grid-cols-4 gap-3 mb-8">
        {ARABIC_LETTERS.map((letter) => (
          <button
            key={letter}
            className="aspect-square bg-surface border border-line rounded-card flex items-center justify-center text-5xl text-navy dark:text-cream font-arabic hover:border-gold hover:bg-gold/10 active:scale-95 transition-all"
            aria-label={`Pratiquer la lettre ${letter}`}
          >
            {letter}
          </button>
        ))}
      </div>

      <div className="bg-surface border-l-4 border-gold rounded-card p-5">
        <h3 className="font-semibold text-fg mb-2">Comment ça marche</h3>
        <ol className="text-sm text-fg-soft space-y-1.5 list-decimal ms-5">
          <li>Touche une lettre ci-dessus pour voir le tracé étape par étape</li>
          <li>Reproduis-la sur une feuille en papier</li>
          <li>Prends une photo claire avec ton téléphone</li>
          <li>Reçois une note sur 10 et des conseils pour t&apos;améliorer</li>
        </ol>
        <p className="text-xs text-fg-faint mt-3">
          Cette fonction sera entièrement active dès la prochaine mise à jour.
        </p>
      </div>
    </StudentShell>
  );
}
