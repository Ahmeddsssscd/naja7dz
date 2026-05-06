import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { isSetupIncompleteError } from "@/lib/db-errors";

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

export async function GET() {
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
