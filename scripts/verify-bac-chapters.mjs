// Show the new Bac (3AS) chapter titles + question counts so we can verify
// the expansion is actually queryable via the same path the app uses.
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
);
const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Pull the 3AS catalog the way /eleve/pratique would.
const { data: subjects } = await admin
  .from("subjects")
  .select("id, name_fr")
  .eq("grade_code", "3AS")
  .order("sort_order");

console.log("=== 3AS Bac catalog ===\n");
for (const s of subjects ?? []) {
  const { data: chapters } = await admin
    .from("chapters")
    .select("id, title_fr")
    .eq("subject_id", s.id)
    .order("sort_order");
  console.log(`📚 ${s.name_fr} — ${(chapters ?? []).length} chapters:`);
  for (const c of chapters ?? []) {
    const { count } = await admin
      .from("quiz_questions")
      .select("*", { count: "exact", head: true })
      .eq("chapter_id", c.id)
      .eq("active", true);
    const ready = (count ?? 0) >= 3 ? "✓" : "·";
    console.log(`  ${ready} ${c.title_fr.padEnd(45)} ${count ?? 0} questions`);
  }
  console.log("");
}

// Same for 4AM Maths and Physiques (the two we expanded).
console.log("=== 4AM BEM (Maths + Physiques) ===\n");
const { data: foursubjects } = await admin
  .from("subjects")
  .select("id, name_fr")
  .eq("grade_code", "4AM")
  .in("name_fr", ["Mathématiques", "Sciences physiques"]);

for (const s of foursubjects ?? []) {
  const { data: chapters } = await admin
    .from("chapters")
    .select("id, title_fr")
    .eq("subject_id", s.id)
    .order("sort_order");
  console.log(`📚 ${s.name_fr} — ${(chapters ?? []).length} chapters:`);
  for (const c of chapters ?? []) {
    const { count } = await admin
      .from("quiz_questions")
      .select("*", { count: "exact", head: true })
      .eq("chapter_id", c.id)
      .eq("active", true);
    const ready = (count ?? 0) >= 3 ? "✓" : "·";
    console.log(`  ${ready} ${c.title_fr.padEnd(45)} ${count ?? 0} questions`);
  }
  console.log("");
}
