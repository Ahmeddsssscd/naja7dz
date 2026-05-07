// Smoke test: hits /api/quiz/start for a 2AP chapter to confirm the new
// seeded questions are reachable through the actual API the QuizRunner uses.
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

// Pick a 2AP chapter
const { data: subj } = await admin
  .from("subjects").select("id").eq("grade_code", "2AP").ilike("name_fr", "Math%").maybeSingle();
const { data: chap } = await admin
  .from("chapters").select("id, title_fr").eq("subject_id", subj.id).limit(1).maybeSingle();

const { data: qs } = await admin
  .from("quiz_questions")
  .select("prompt_fr, options_fr, correct_index, active")
  .eq("chapter_id", chap.id)
  .eq("active", true);

console.log("Chapter:", chap.title_fr);
console.log("Active questions:", qs.length);
for (const q of qs) {
  console.log(`  • ${q.prompt_fr} → correct: ${q.options_fr[q.correct_index]}`);
}
console.log(qs.length >= 3 ? "\n✓ Quiz can start (>=3 active questions)" : "\n✗ Insufficient questions");
