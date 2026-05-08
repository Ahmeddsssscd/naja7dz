// Reports the current state for a given email: subscription, children, etc.
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

const email = process.argv[2] ?? "contact.guenane@gmail.com";

const { data: { users } } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
const user = users.find((u) => (u.email ?? "").toLowerCase() === email.toLowerCase());
if (!user) { console.log(`User ${email} not found`); process.exit(0); }

console.log(`User: ${email} (${user.id})`);

const { data: profile } = await admin.from("parent_profiles").select("*").eq("user_id", user.id).maybeSingle();
console.log("\nProfile:");
console.log("  full_name:", profile?.full_name);
console.log("  is_admin: ", profile?.is_admin);
console.log("  wilaya:   ", profile?.wilaya);

const { data: children } = await admin.from("children").select("id, full_name, grade, age").eq("parent_id", user.id);
console.log(`\nChildren (${children?.length ?? 0}):`);
for (const c of children ?? []) {
  console.log(`  ${c.full_name} (${c.id})  grade=${c.grade}  age=${c.age}`);
}

const { data: sub } = await admin
  .from("subscriptions")
  .select("plan_id, status, expires_at, plans(tier, name_fr)")
  .eq("user_id", user.id)
  .maybeSingle();
console.log("\nSubscription:");
if (!sub) {
  console.log("  none");
} else {
  const plan = Array.isArray(sub.plans) ? sub.plans[0] : sub.plans;
  console.log(`  plan: ${sub.plan_id}  (${plan?.name_fr})`);
  console.log(`  tier: ${plan?.tier}`);
  console.log(`  status: ${sub.status}`);
  console.log(`  expires: ${sub.expires_at}`);
}
