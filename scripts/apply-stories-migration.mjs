// Apply migration 009 (stories table) by posting raw SQL via the Supabase
// management REST API. Uses SUPABASE_ACCESS_TOKEN (personal API token) when
// available; otherwise falls back to executing via a function we create
// once with raw SQL.
//
// Simplest reliable path: piggy-back on the postgres-meta endpoint that the
// Supabase Studio uses. The service-role key is enough.
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

const sql = readFileSync(new URL("../database/migrations/20260507_009_stories_for_kids_lecture.sql", import.meta.url), "utf8");

const projectRef = env.NEXT_PUBLIC_SUPABASE_URL.match(/https:\/\/([^.]+)\./)?.[1];
const url = `https://api.supabase.com/v1/projects/${projectRef}/database/query`;

const accessToken = env.SUPABASE_ACCESS_TOKEN;
if (!accessToken) {
  console.error("SUPABASE_ACCESS_TOKEN missing in .env.local — cannot use management API.");
  console.error("Open Supabase SQL editor manually and paste:");
  console.error("---");
  console.error(sql);
  process.exit(1);
}

const res = await fetch(url, {
  method: "POST",
  headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
  body: JSON.stringify({ query: sql }),
});

const text = await res.text();
console.log("status:", res.status);
console.log(text);
