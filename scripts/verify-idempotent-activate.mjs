// Verify activate_subscription_from_checkout is idempotent.
// Calls the RPC twice with the same checkout id, expects expires_at to NOT change.
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

const checkoutId = process.argv[2] ?? "ca96d4c1-f36f-493a-83c2-34a584548775";

async function getExpiry() {
  const { data: cs } = await admin
    .from("checkout_sessions")
    .select("user_id")
    .eq("id", checkoutId)
    .single();
  const { data: sub } = await admin
    .from("subscriptions")
    .select("expires_at, last_checkout_id")
    .eq("user_id", cs.user_id)
    .single();
  return sub;
}

const before = await getExpiry();
console.log("BEFORE:           ", before);

const { error: e1 } = await admin.rpc("activate_subscription_from_checkout", { p_checkout_id: checkoutId });
if (e1) throw e1;

const after1 = await getExpiry();
console.log("AFTER RPC call 1: ", after1);

const { error: e2 } = await admin.rpc("activate_subscription_from_checkout", { p_checkout_id: checkoutId });
if (e2) throw e2;

const after2 = await getExpiry();
console.log("AFTER RPC call 2: ", after2);

if (before.expires_at === after1.expires_at && after1.expires_at === after2.expires_at) {
  console.log("\n✓ IDEMPOTENT — expires_at unchanged across 2 RPC calls");
  process.exit(0);
} else {
  console.error("\n✗ NOT IDEMPOTENT — expires_at changed!");
  process.exit(1);
}
