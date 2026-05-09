// Bulk-create page.tsx route files for the 8 new games whose components
// exist but pages don't yet. Idempotent — skips files that already exist.
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROUTES = [
  { slug: "calcul-mental", component: "CalculMental", title: "Calcul mental" },
  { slug: "drapeaux", component: "DrapeauxMaghreb", title: "Drapeaux du Maghreb" },
  { slug: "histoire-algerie", component: "HistoireAlgerie", title: "Histoire de l'Algérie" },
  { slug: "animaux", component: "AnimauxAlgerie", title: "Animaux d'Algérie" },
  { slug: "chiffres-arabes", component: "ChiffresArabes", title: "Chiffres en arabe" },
  { slug: "petits-scientifiques", component: "PetitsScientifiques", title: "Petits scientifiques" },
  { slug: "coloriage-numeros", component: "ColorageNumeros", title: "Coloriage par numéros" },
  { slug: "dictee", component: "DicteeFR", title: "Dictée" },
];

const baseDir = "src/app/[locale]/petits/jeux-malins";

let created = 0;
for (const r of ROUTES) {
  const dir = join(baseDir, r.slug);
  const file = join(dir, "page.tsx");
  if (existsSync(file)) { console.log(`  exists: ${r.slug}`); continue; }
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const content = `import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { ${r.component} } from "@/components/app/games/${r.component}";
import { requireKidsAccess } from "@/lib/subscriptions";

export const metadata = { title: "${r.title}" };

export default async function ${r.component}Page() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  await requireKidsAccess(user.id);
  return <${r.component} />;
}
`;
  writeFileSync(file, content, "utf8");
  console.log(`  ✓ created ${r.slug}/page.tsx`);
  created++;
}
console.log(`\n${created} routes created.`);
