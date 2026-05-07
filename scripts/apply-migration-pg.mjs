// Apply a SQL migration via direct Postgres connection.
// Requires SUPABASE_DB_PASSWORD in .env.local (separate from service role).
// Run: node scripts/apply-migration-pg.mjs database/migrations/<file>.sql
import { readFileSync } from "node:fs";
import pg from "pg";

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
  console.error("Usage: node scripts/apply-migration-pg.mjs <path-to.sql>");
  process.exit(2);
}

const projectRef = env.NEXT_PUBLIC_SUPABASE_URL.replace("https://", "").split(".")[0];
const password = env.SUPABASE_DB_PASSWORD;
if (!password) {
  console.error(
    "\n× SUPABASE_DB_PASSWORD missing in .env.local.\n\n" +
    "Get the database password from:\n" +
    `  https://supabase.com/dashboard/project/${projectRef}/settings/database\n\n` +
    "(scroll to 'Database password' — click 'Reset database password' if you don't remember it)\n\n" +
    "Then add to .env.local:\n" +
    "  SUPABASE_DB_PASSWORD=your-password-here\n\n" +
    "Or apply this migration manually in SQL Editor:\n" +
    `  https://supabase.com/dashboard/project/${projectRef}/sql/new\n`,
  );
  process.exit(1);
}

const sql = readFileSync(new URL("../" + file, import.meta.url), "utf8");

const client = new pg.Client({
  host: `aws-0-eu-west-3.pooler.supabase.com`,
  port: 6543,
  user: `postgres.${projectRef}`,
  password,
  database: "postgres",
  ssl: { rejectUnauthorized: false },
});

try {
  console.log("Connecting to pooler…");
  await client.connect();
  console.log("✓ Connected. Running migration…");
  // Run as a single transaction.
  await client.query("BEGIN");
  try {
    await client.query(sql);
    await client.query("COMMIT");
    console.log("\n✓ Migration applied.");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  }
} catch (e) {
  console.error("× Failed:", e.message);
  process.exit(1);
} finally {
  await client.end();
}
