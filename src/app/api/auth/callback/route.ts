/**
 * OAuth / OTP callback. Providers (Google, etc.) redirect here with a `code`
 * which we exchange for a Supabase session, then send the user on to `next`
 * (defaults to /espace, the smart dispatcher).
 *
 * This lives under /api so the i18n middleware doesn't rewrite it. Requires
 * the provider to be configured in the Supabase dashboard and this URL added
 * to the allowed redirect URLs.
 */
import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/espace";

  if (code) {
    const supabase = await createServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      const dest = new URL("/connexion", url.origin);
      dest.searchParams.set("error", "oauth");
      return NextResponse.redirect(dest);
    }
  }

  // Relative next only (avoid open-redirect).
  const safeNext = next.startsWith("/") ? next : "/espace";
  return NextResponse.redirect(new URL(safeNext, url.origin));
}
