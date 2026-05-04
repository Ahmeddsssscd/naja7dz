/**
 * Supabase browser client — for use in Client Components.
 * Uses the public anon key (safe to ship to the browser).
 */
import { createClient } from "@supabase/supabase-js";

export function createBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in environment.",
    );
  }
  // Untyped client for now. Once tables grow, run:
  //   npx supabase gen types typescript --project-id cyabavzunccvlfwvuyuj > src/lib/supabase/types.ts
  // and reintroduce the <Database> generic.
  return createClient(url, anonKey);
}
