// Comprehensive audit of Supabase content + relations.
// Generates a tabular report so we can spot every gap at once.
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

function rule(label) {
  console.log("\n" + "=".repeat(80));
  console.log(label);
  console.log("=".repeat(80));
}

// ============================================================================
// Catalog (subjects + chapters + questions per grade)
// ============================================================================
rule("CATALOG — quizzes per grade × subject");

const { data: subjects } = await admin
  .from("subjects").select("id, grade_code, name_fr, slug").order("grade_code, name_fr");
const { data: chapters } = await admin
  .from("chapters").select("id, subject_id, title_fr").order("subject_id");
const { data: questions } = await admin
  .from("quiz_questions").select("chapter_id").eq("active", true);

const qPerChapter = {};
for (const q of questions ?? []) qPerChapter[q.chapter_id] = (qPerChapter[q.chapter_id] ?? 0) + 1;

const grades = {};
const subjMap = {};
for (const s of subjects ?? []) {
  subjMap[s.id] = s;
  grades[s.grade_code] = grades[s.grade_code] ?? {};
  grades[s.grade_code][s.name_fr] = { subjectId: s.id, chapters: 0, ready: 0, total_q: 0 };
}
for (const c of chapters ?? []) {
  const subj = subjMap[c.subject_id];
  if (!subj) continue;
  const qcount = qPerChapter[c.id] ?? 0;
  const g = grades[subj.grade_code][subj.name_fr];
  g.chapters++;
  if (qcount >= 3) g.ready++;
  g.total_q += qcount;
}

const ALL_GRADES = ["1AP","2AP","3AP","4AP","5AP","1AM","2AM","3AM","4AM","1AS","2AS","3AS"];
console.log("Grade | Subject              | Chap | Ready | Q");
console.log("------|----------------------|------|-------|----");
for (const g of ALL_GRADES) {
  const subs = grades[g];
  if (!subs || Object.keys(subs).length === 0) {
    console.log(`${g.padEnd(5)} | (no subjects)        |  -   |   -   | -`);
    continue;
  }
  for (const [name, info] of Object.entries(subs)) {
    console.log(`${g.padEnd(5)} | ${name.slice(0,20).padEnd(20)} | ${String(info.chapters).padStart(4)} | ${String(info.ready).padStart(5)} | ${String(info.total_q).padStart(2)}`);
  }
}

// ============================================================================
// Kids universe tables
// ============================================================================
rule("KIDS UNIVERSE — content tables");

const KID_TABLES = [
  "stories",
  "characters",
  "speeches",
  "writing_prompts",
  "adab_lessons",
  "exam_papers",
  "wilayas",
  "quran_surahs",
  "quran_progress",
  "feature_flags",
];
for (const t of KID_TABLES) {
  try {
    const { count, error } = await admin.from(t).select("*", { count: "exact", head: true });
    if (error) console.log(`  ${t.padEnd(20)} : ERROR — ${error.message}`);
    else console.log(`  ${t.padEnd(20)} : ${count ?? 0} rows`);
  } catch (e) {
    console.log(`  ${t.padEnd(20)} : EXCEPTION — ${e.message}`);
  }
}

// ============================================================================
// Plans + subscriptions
// ============================================================================
rule("PLANS + SUBSCRIPTIONS");
const { data: plans } = await admin.from("plans").select("id, name_fr, tier, amount_dzd, period, duration_days, active");
console.log("Plans:");
for (const p of plans ?? []) {
  console.log(`  ${p.id.padEnd(20)} ${(p.name_fr ?? "").slice(0,20).padEnd(20)} tier=${p.tier ?? "—"} ${p.active ? "active" : "INACTIVE"} ${p.amount_dzd}dz / ${p.duration_days}d`);
}
const { count: subCount } = await admin.from("subscriptions").select("*", { count: "exact", head: true });
console.log(`Active subscriptions: ${subCount ?? 0}`);

// ============================================================================
// Auth users + parent profiles + children
// ============================================================================
rule("USERS + FAMILIES");
const { data: { users } } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
console.log(`Auth users: ${users?.length ?? 0}`);
const realUsers = (users ?? []).filter(u => !(u.email ?? "").startsWith("test+"));
console.log(`  real (non-test): ${realUsers.length}`);
const { count: parentCount } = await admin.from("parent_profiles").select("*", { count: "exact", head: true });
const { count: childrenCount } = await admin.from("children").select("*", { count: "exact", head: true });
console.log(`Parent profiles: ${parentCount ?? 0}`);
console.log(`Children:        ${childrenCount ?? 0}`);
const { data: orphans } = await admin
  .from("parent_profiles")
  .select("user_id, full_name")
  .not("user_id", "in", `(${(users ?? []).map(u => `"${u.id}"`).join(",")})`);
console.log(`Orphan parent_profiles (no auth user): ${(orphans ?? []).length}`);

// ============================================================================
// Feature flags
// ============================================================================
rule("FEATURE FLAGS");
const { data: flags } = await admin.from("feature_flags").select("key, label_fr, group_name, enabled").order("group_name").order("key");
const byGroup = {};
for (const f of flags ?? []) {
  byGroup[f.group_name] = byGroup[f.group_name] ?? [];
  byGroup[f.group_name].push(f);
}
for (const [group, items] of Object.entries(byGroup)) {
  console.log(`\n[${group}]`);
  for (const f of items) {
    console.log(`  ${f.enabled ? "✓" : "✗"} ${f.key.padEnd(28)} ${f.label_fr}`);
  }
}

console.log("\n" + "=".repeat(80));
console.log("AUDIT COMPLETE");
console.log("=".repeat(80));
