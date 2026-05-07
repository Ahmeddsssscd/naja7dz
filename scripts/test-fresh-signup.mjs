// End-to-end test: simulate a brand-new user that hits the dashboard with
// NO parent_profiles row (the exact state that bit contactguenane@gmail.com).
//
// We create a confirmed auth.user via admin API, then DELETE any
// auto-inserted parent_profiles row, then DON'T add children. The next time
// this user logs in via the app, /parent should:
//   1. redirect to /bienvenue
//   2. /bienvenue should detect the missing profile and INSERT one
//   3. wizard step 2 should INSERT a child + flip onboarded=true
//   4. step 3 "Découvrir mon espace" → /parent → render the dashboard
//
// Run: node scripts/test-fresh-signup.mjs
//
// On success: prints the test user's email + password so you can sign in
// manually in the browser to confirm the flow.
//
// On failure: throws and prints what's broken.
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

const stamp = Date.now();
const email = `test+freshflow${stamp}@naja7dz.com`;
const password = "TestPass-" + stamp;

console.log("\n=== Fresh-signup E2E test ===\n");
console.log("Test user email:", email);
console.log("Test user password:", password);
console.log();

// 1. Create auth user, pre-confirmed (skip the email-verify step since we
// have no inbox).
const { data: created, error: cErr } = await admin.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
  user_metadata: { full_name: "Fresh Flow Test", locale: "fr" },
});
if (cErr) throw cErr;
const userId = created.user.id;
console.log("[1] Created auth user:", userId);

// 2. Sanity check: was a parent_profiles row auto-created? (It can happen if
// an existing trigger handles new users.) Delete it if so — we want to test
// the missing-profile recovery path.
const { data: pp } = await admin
  .from("parent_profiles")
  .select("user_id")
  .eq("user_id", userId)
  .maybeSingle();
if (pp) {
  await admin.from("parent_profiles").delete().eq("user_id", userId);
  console.log("[2] Deleted auto-created profile to simulate orphan state");
} else {
  console.log("[2] No profile row — orphan state already correct");
}

// 3. Verify orphan: profile=null, children=0
const { data: profileCheck } = await admin
  .from("parent_profiles")
  .select("user_id")
  .eq("user_id", userId)
  .maybeSingle();
const { count: childCount } = await admin
  .from("children")
  .select("*", { count: "exact", head: true })
  .eq("parent_id", userId);
console.log("[3] Orphan state confirmed:", {
  hasProfile: profileCheck !== null,
  childCount,
});
if (profileCheck !== null || childCount !== 0) {
  throw new Error("Orphan state setup failed");
}

console.log("\n=== Orphan user ready. Now log in manually in Chrome at:");
console.log("    https://naja7dz.com/connexion");
console.log("    email:    " + email);
console.log("    password: " + password);
console.log();
console.log("Expected flow:");
console.log("  /connexion → /parent → /parent/bienvenue (profile auto-created)");
console.log("  Click Commencer → fill child form → Continuer");
console.log("  → step 3 → Découvrir mon espace → /parent (dashboard renders)");
console.log("\nUser ID for cleanup:", userId);
