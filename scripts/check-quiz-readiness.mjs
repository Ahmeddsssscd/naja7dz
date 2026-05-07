// Inventory of quiz_questions per chapter, and how many subjects/chapters
// each grade has — to spot if the student "Practice" experience is empty.
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

const { data: qs } = await admin.from("quiz_questions").select("chapter_id, active");
const total = (qs ?? []).length;
const active = (qs ?? []).filter((q) => q.active).length;
console.log(`quiz_questions: ${total} total, ${active} active`);

const counts = {};
for (const q of qs ?? []) if (q.active) counts[q.chapter_id] = (counts[q.chapter_id] ?? 0) + 1;
const readyChapterIds = Object.keys(counts).filter((id) => counts[id] >= 3);
console.log(`chapters with >=3 active questions: ${readyChapterIds.length}`);

if (readyChapterIds.length) {
  const { data: chs } = await admin
    .from("chapters")
    .select("id, title_fr, subject_id, subjects(name_fr, grade_code)")
    .in("id", readyChapterIds);
  console.log("\nReady chapters:");
  for (const c of chs ?? []) {
    const s = Array.isArray(c.subjects) ? c.subjects[0] : c.subjects;
    console.log(`  [${s?.grade_code}] ${s?.name_fr} → ${c.title_fr} (${counts[c.id]}q)`);
  }
}

// Per-grade summary
const { data: subjects } = await admin.from("subjects").select("id, grade_code");
const { data: chapters } = await admin.from("chapters").select("id, subject_id");
const grades = {};
for (const s of subjects ?? []) {
  grades[s.grade_code] = grades[s.grade_code] ?? { subjects: 0, chapters: 0, ready: 0 };
  grades[s.grade_code].subjects++;
}
const subjGrade = Object.fromEntries((subjects ?? []).map((s) => [s.id, s.grade_code]));
for (const c of chapters ?? []) {
  const g = subjGrade[c.subject_id];
  if (!g) continue;
  grades[g].chapters++;
  if (counts[c.id] >= 3) grades[g].ready++;
}
console.log("\nPer-grade quiz readiness:");
for (const g of Object.keys(grades).sort()) {
  const x = grades[g];
  console.log(`  ${g.padEnd(4)} subjects=${x.subjects}  chapters=${x.chapters}  quiz-ready=${x.ready}`);
}
