/**
 * Supabase browser client — for use in Client Components.
 * Reads/writes session cookies so SSR and CSR stay in sync.
 */
"use client";

import { createBrowserClient as createSSRClient } from "@supabase/ssr";

export function createBrowserClient() {
  return createSSRClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
