/**
 * Detect "the database isn't set up" errors from Supabase / PostgREST and
 * return user-friendly messages, plus a flag the client can read to show
 * a helpful setup-required screen.
 *
 * PostgREST returns these codes for a missing table:
 *   PGRST205  — "Could not find the table '...' in the schema cache"
 *   42P01     — "relation '...' does not exist" (raw Postgres)
 */

import type { PostgrestError } from "@supabase/supabase-js";

const SETUP_CODES = new Set(["PGRST205", "42P01", "PGRST204"]);
const SETUP_MESSAGE_HINTS = [
  "schema cache",
  "does not exist",
  "relation",
];

export function isSetupIncompleteError(err: unknown): boolean {
  if (!err) return false;

  // PostgrestError (from supabase-js)
  if (typeof err === "object" && err !== null) {
    const e = err as Partial<PostgrestError> & { message?: string };
    if (e.code && SETUP_CODES.has(e.code)) return true;
    if (e.message) {
      const m = e.message.toLowerCase();
      if (SETUP_MESSAGE_HINTS.some((h) => m.includes(h))) return true;
    }
  }
  return false;
}

/**
 * Friendly message returned to the client when DB isn't set up.
 * The frontend's <SetupRequiredBanner> watches for this to show the
 * setup-required screen instead of an ugly raw error.
 */
export const SETUP_INCOMPLETE_RESPONSE = {
  error: "La configuration de la base de données est incomplète.",
  setupRequired: true,
  hint:
    "Va sur https://supabase.com/dashboard/project/cyabavzunccvlfwvuyuj/sql/new, " +
    "ouvre database/SETUP.sql et colle son contenu, puis clique Run.",
} as const;

/**
 * Wrap a Supabase response and short-circuit if the DB isn't set up.
 * Use in API route handlers:
 *
 *   const { data, error } = await supabase.from("children").select(...);
 *   const setup = checkSetupErr(error);
 *   if (setup) return setup;  // returns NextResponse with 503
 */
export function checkSetupErr(err: unknown):
  | { status: 503; body: typeof SETUP_INCOMPLETE_RESPONSE }
  | null {
  if (isSetupIncompleteError(err)) {
    return { status: 503, body: SETUP_INCOMPLETE_RESPONSE };
  }
  return null;
}
