// Apply a single migration SQL file to the live Supabase project.
// Run: node scripts/apply-migration.mjs database/migrations/<file>.sql
//
// Uses the Supabase Management API via REST, since the Postgres direct
// connection isn't exposed without a separate tunnel. Submits the SQL
// to the project's pg-meta query endpoint.
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

const file = process.argv[2];
if (!file) {
  console.error("Usage: node scripts/apply-migration.mjs <path-to.sql>");
  process.exit(2);
}

const sql = readFileSync(new URL("../" + file, import.meta.url), "utf8");

// Use Supabase's pg_meta REST `/rest/v1/rpc/exec_sql`-style endpoint via the
// project's PostgREST. The project must have a `public.exec_sql` function or
// we go through the PG-CONNECTION endpoint. Simplest reliable option: use
// the Postgres-Meta endpoint exposed at /pg/query when service-role-keyed.
const projectRef = env.NEXT_PUBLIC_SUPABASE_URL.replace("https://", "").split(".")[0];
const url = `https://api.supabase.com/v1/projects/${projectRef}/database/query`;
console.log("POST", url);

const accessToken = env.SUPABASE_ACCESS_TOKEN;
if (!accessToken) {
  console.error(
    "\nSUPABASE_ACCESS_TOKEN missing in .env.local — needed to apply migrations via management API.\n" +
    "Get one at https://supabase.com/dashboard/account/tokens\n" +
    "Or apply this migration manually in SQL Editor:\n" +
    "  https://supabase.com/dashboard/project/" + projectRef + "/sql/new\n",
  );
  process.exit(1);
}

const res = await fetch(url, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ query: sql }),
});
const text = await res.text();
console.log("Status:", res.status);
console.log(text);
if (!res.ok) process.exit(1);
console.log("\n✓ Migration applied.");
