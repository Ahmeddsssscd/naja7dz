// Delete every auth user whose email starts with "test+freshflow"
// or "test+admin". Cascades to parent_profiles + children via FK on delete.
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

let removed = 0;
let page = 1;
while (true) {
  const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
  if (error) throw error;
  const targets = (data.users ?? []).filter((u) => {
    const e = (u.email ?? "").toLowerCase();
    return e.startsWith("test+freshflow") || e.startsWith("test+admin") || e.startsWith("test+student");
  });
  for (const u of targets) {
    const { error: dErr } = await admin.auth.admin.deleteUser(u.id);
    console.log("Deleted", u.email, dErr ? "(err: " + dErr.message + ")" : "");
    if (!dErr) removed++;
  }
  if (!data.users?.length || data.users.length < 200) break;
  page++;
}
console.log("\nRemoved", removed, "test user(s).");

