import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { isSetupIncompleteError } from "@/lib/db-errors";
import { requireAdminApi } from "@/lib/admin-auth";

const REQUIRED_TABLES = [
  "early_access_signups",
  "plans",
  "checkout_sessions",
  "parent_profiles",
  "children",
  "grades",
  "subjects",
  "parent_controls",
  "wilayas",
  "logic_riddles",
  "adab_lessons",
  "quran_surahs",
];

/**
 * DB health probe. Admin-only — the per-table existence list is a free
 * schema fingerprint for an attacker who finds it (knowing exactly which
 * tables exist tells them what's worth poking).
 *
 * Public-facing apps should never expose this. If a public liveness probe
 * is needed, expose a separate endpoint that returns just `{ok: true}`.
 */
export async function GET() {
  const gate = await requireAdminApi();
  if ("response" in gate) return gate.response;

  const admin = createAdminClient();
  const missing: string[] = [];

  for (const t of REQUIRED_TABLES) {
    const { error } = await admin.from(t).select("*", { count: "exact", head: true });
    if (error && isSetupIncompleteError(error)) missing.push(t);
  }

  return NextResponse.json({
    ok: missing.length === 0,
    missing,
    appliedMigrations: REQUIRED_TABLES.length - missing.length,
    totalRequired: REQUIRED_TABLES.length,
    setupSqlPath: "/database/SETUP.sql",
  });
}
