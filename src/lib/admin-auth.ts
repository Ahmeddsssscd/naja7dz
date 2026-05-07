/**
 * Shared admin gate for /api/admin/* routes. Returns the authenticated admin
 * user, or a 401/403 NextResponse if the caller isn't logged in or isn't an
 * admin.
 *
 * Usage:
 *   const gate = await requireAdminApi();
 *   if ("response" in gate) return gate.response;
 *   const { user, profile } = gate;
 */
import { NextResponse } from "next/server";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";

export type AdminGate =
  | { response: NextResponse }
  | {
      user: { id: string; email?: string };
      profile: { user_id: string; full_name: string; is_admin: boolean };
    };

export async function requireAdminApi(): Promise<AdminGate> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      response: NextResponse.json({ error: "Non authentifié" }, { status: 401 }),
    };
  }

  // Check admin flag via service role (bypasses RLS, avoids any policy
  // edge cases with admin-only reads).
  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("parent_profiles")
    .select("user_id, full_name, is_admin")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile?.is_admin) {
    return {
      response: NextResponse.json({ error: "Accès refusé" }, { status: 403 }),
    };
  }

  return {
    user: { id: user.id, email: user.email },
    profile: profile as { user_id: string; full_name: string; is_admin: boolean },
  };
}
