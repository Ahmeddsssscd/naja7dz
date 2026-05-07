// Simulate a paid checkout for testing the subscription flow without
// actually running through Chargily.
//
// Run: node scripts/simulate-paid-checkout.mjs <user_email> <plan_id>
//   plan_id ∈ eleve_monthly, famille_monthly, pack_bac, ...
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

const email = (process.argv[2] ?? "").toLowerCase();
const planId = process.argv[3] ?? "eleve_monthly";
if (!email || !planId) {
  console.error("Usage: node scripts/simulate-paid-checkout.mjs <email> <plan_id>");
  process.exit(2);
}

// Find user
let userId = null;
let page = 1;
while (true) {
  const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
  if (error) throw error;
  const u = (data.users ?? []).find((u) => (u.email ?? "").toLowerCase() === email);
  if (u) { userId = u.id; break; }
  if (!data.users?.length || data.users.length < 200) break;
  page++;
}
if (!userId) { console.error("user not found:", email); process.exit(1); }

const { data: plan } = await admin.from("plans").select("amount_dzd").eq("id", planId).maybeSingle();
if (!plan) { console.error("plan not found:", planId); process.exit(1); }

// Create a paid checkout row
const { data: cs, error } = await admin
  .from("checkout_sessions")
  .insert({
    plan_id: planId,
    email,
    customer_name: "Test Payment",
    amount_dzd: plan.amount_dzd,
    locale: "fr",
    status: "paid",
    paid_at: new Date().toISOString(),
    user_id: userId,
    source: "simulate",
    chargily_checkout_id: `simulate-${Date.now()}`,
  })
  .select("id")
  .single();
if (error) throw error;

// Activate via the same RPC the webhook uses
const { error: rpcErr } = await admin.rpc("activate_subscription_from_checkout", {
  p_checkout_id: cs.id,
});
if (rpcErr) { console.error("RPC failed:", rpcErr.message); process.exit(1); }

const { data: sub } = await admin
  .from("subscriptions")
  .select("plan_id, status, expires_at")
  .eq("user_id", userId)
  .single();
console.log("\n✓ Subscription activated for", email);
console.log("  plan:", sub.plan_id);
console.log("  status:", sub.status);
console.log("  expires_at:", sub.expires_at);
console.log("\n  checkout_id:", cs.id);
