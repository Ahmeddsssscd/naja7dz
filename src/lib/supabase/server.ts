/**
 * Supabase server clients.
 *
 *   createServerClient()   ← user-scoped, reads session from cookies. Use in
 *                            Server Components, route handlers, server actions.
 *
 *   createAdminClient()    ← service-role, bypasses RLS. Use ONLY in trusted
 *                            server contexts (webhooks, admin tasks, internal
 *                            data seeding).
 */
import "server-only";
import { cookies } from "next/headers";
import { createServerClient as createSSRServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

export async function createServerClient() {
  const cookieStore = await cookies();
  return createSSRServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Components cannot set cookies; middleware does it instead.
          }
        },
      },
    },
  );
}

/**
 * Service-role client. NEVER pass user input to it without server-side checks.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Missing Supabase env vars for admin client");
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
