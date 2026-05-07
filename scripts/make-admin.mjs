// Promote a user to admin by email.
// Run: node scripts/make-admin.mjs user@example.com
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

const targetEmail = (process.argv[2] ?? "").trim().toLowerCase();
if (!targetEmail) {
  console.error("Usage: node scripts/make-admin.mjs <email>");
  process.exit(2);
}

const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Look up the auth user.
let userId = null;
let page = 1;
while (true) {
  const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
  if (error) throw error;
  const u = (data.users ?? []).find((u) => (u.email ?? "").toLowerCase() === targetEmail);
  if (u) { userId = u.id; break; }
  if (!data.users?.length || data.users.length < 200) break;
  page++;
}
if (!userId) {
  console.error("User not found:", targetEmail);
  process.exit(1);
}

const { error: upErr } = await admin
  .from("parent_profiles")
  .update({ is_admin: true })
  .eq("user_id", userId);
if (upErr) {
  console.error("Update failed:", upErr.message);
  process.exit(1);
}

console.log(`✓ ${targetEmail} (${userId}) is now an admin.`);
console.log(`Visit https://naja7dz.com/admin to manage content.`);
