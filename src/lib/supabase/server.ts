/**
 * Supabase server client — for use in Server Components, route handlers, and server actions.
 * Uses the SERVICE ROLE KEY which bypasses RLS — NEVER expose to the browser.
 */
import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

export function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.",
    );
  }
  return createClient<Database>(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
