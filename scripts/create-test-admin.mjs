// One-off: creates a confirmed admin user for testing the admin dashboard.
// Prints the credentials. Cleanup with: node scripts/cleanup-test-users.mjs
// (extend that script to match `test+admin*`).
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
const email = `test+admin${stamp}@naja7dz.com`;
const password = "AdminPass-" + stamp;

const { data: created, error: cErr } = await admin.auth.admin.createUser({
  email, password, email_confirm: true,
  user_metadata: { full_name: "Test Admin", locale: "fr" },
});
if (cErr) throw cErr;

await admin.from("parent_profiles").upsert({
  user_id: created.user.id,
  full_name: "Test Admin",
  language_pref: "fr",
  onboarded: true,
  is_admin: true,
});

console.log("\n=== Test Admin ready ===\n");
console.log("Email:    " + email);
console.log("Password: " + password);
console.log("User ID:  " + created.user.id);
console.log("\nLog in at https://naja7dz.com/connexion then visit /admin");
