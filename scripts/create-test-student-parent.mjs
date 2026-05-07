// Create a test parent + 4AM child so I can verify the quiz flow end to end.
// Run: node scripts/create-test-student-parent.mjs
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

const stamp = Date.now();
const email = `test+student${stamp}@naja7dz.com`;
const password = "StudPass-" + stamp;

const { data: created, error } = await admin.auth.admin.createUser({
  email, password, email_confirm: true,
  user_metadata: { full_name: "Test Parent", locale: "fr" },
});
if (error) throw error;

await admin.from("parent_profiles").upsert({
  user_id: created.user.id,
  full_name: "Test Parent",
  language_pref: "fr",
  onboarded: true,
});
await admin.from("children").insert({
  parent_id: created.user.id,
  full_name: "Yacine",
  age: 14,
  grade: "4AM",
});

console.log("\n=== Test Parent + Child ready ===\n");
console.log("Email:    " + email);
console.log("Password: " + password);
console.log("Child:    Yacine, 14, 4AM");
console.log("\nLog in then visit /eleve/matieres");
