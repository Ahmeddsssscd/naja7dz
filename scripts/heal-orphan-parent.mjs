// One-shot: heal users that have children rows but no parent_profiles row.
// This was caused by signup/api/auth/signup silently dropping the upsert
// (caught error, fall-through). The user then went through onboarding,
// the wizard's UPDATE on a missing row was a no-op, and /parent redirected
// back to /bienvenue forever — confirmed for parent_id b0d5c74d-... ("ahmed").
//
// Run: node scripts/heal-orphan-parent.mjs
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

const URL_ = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL_ || !KEY) throw new Error("Missing Supabase env vars");

const admin = createClient(URL_, KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// 1. Find every distinct parent_id that owns children rows.
const { data: childrenRows, error: chErr } = await admin
  .from("children")
  .select("parent_id");
if (chErr) throw chErr;
const parentIds = [...new Set(childrenRows.map((r) => r.parent_id))];
console.log("Distinct parent_ids in children:", parentIds);

// 2. Find which of those have no row in parent_profiles.
const { data: existingProfiles, error: pErr } = await admin
  .from("parent_profiles")
  .select("user_id")
  .in("user_id", parentIds);
if (pErr) throw pErr;
const have = new Set(existingProfiles.map((p) => p.user_id));
const orphans = parentIds.filter((id) => !have.has(id));
console.log("Orphan parent_ids (have children, no profile):", orphans);

// 3. For each orphan, fetch their auth.user metadata and INSERT a profile.
for (const userId of orphans) {
  const { data: userRes, error: uErr } = await admin.auth.admin.getUserById(userId);
  if (uErr) {
    console.error("getUserById failed for", userId, uErr);
    continue;
  }
  const u = userRes.user;
  const fullNameMeta =
    (typeof u.user_metadata?.full_name === "string" && u.user_metadata.full_name) ||
    u.email?.split("@")[0] ||
    "Parent";
  const { error: insErr } = await admin.from("parent_profiles").insert({
    user_id: userId,
    full_name: fullNameMeta,
    language_pref: u.user_metadata?.locale === "ar" ? "ar" : "fr",
    onboarded: true, // they already have children — they ARE onboarded
  });
  console.log("Inserted profile for", userId, u.email, "→", insErr ? insErr.message : "OK");
}

// 4. Clean up duplicate children inserts caused by the loop. Keep the oldest
// row per (parent_id, full_name, age, grade); delete the rest.
const { data: allChildren } = await admin
  .from("children")
  .select("id, parent_id, full_name, age, grade, created_at")
  .order("created_at", { ascending: true });
if (allChildren) {
  const seen = new Set();
  const toDelete = [];
  for (const c of allChildren) {
    const key = `${c.parent_id}|${c.full_name}|${c.age ?? ""}|${c.grade ?? ""}`;
    if (seen.has(key)) toDelete.push(c.id);
    else seen.add(key);
  }
  if (toDelete.length) {
    const { error: dErr } = await admin.from("children").delete().in("id", toDelete);
    console.log(`Deleted ${toDelete.length} duplicate children →`, dErr ? dErr.message : "OK");
  } else {
    console.log("No duplicate children to delete.");
  }
}

console.log("Done.");
