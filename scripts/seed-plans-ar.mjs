// One-shot script: backfill description_ar on the plans table.
// Run: node scripts/seed-plans-ar.mjs
//
// Reads SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY from .env.local.
import { readFileSync } from "node:fs";

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

const updates = [
  { id: "eleve_monthly", description_ar: "طفل واحد، جميع المواد، وصول كامل" },
  { id: "eleve_annual", description_ar: "طفل واحد، دفع سنوي (-38%)" },
  { id: "famille_monthly", description_ar: "حتى 4 أطفال + فضاء الآباء كامل" },
  { id: "famille_annual", description_ar: "حتى 4 أطفال، دفع سنوي (-38%)" },
  { id: "pack_bac", description_ar: "برنامج مكثف للتحضير للبكالوريا" },
];

for (const u of updates) {
  const res = await fetch(`${URL_}/rest/v1/plans?id=eq.${u.id}`, {
    method: "PATCH",
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ description_ar: u.description_ar }),
  });
  console.log(u.id, res.status);
}
