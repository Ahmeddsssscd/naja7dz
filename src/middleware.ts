import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

const PROTECTED_PREFIXES = ["/parent", "/eleve", "/petits", "/admin"];
const AUTH_PAGES = ["/connexion", "/inscription", "/connexion/oublie"];

export async function middleware(request: NextRequest) {
  // Run i18n FIRST so the rest sees the canonical URL with locale prefix
  const intlResponse = intlMiddleware(request);

  // Refresh / read Supabase session on every request and persist via cookies
  const response = intlResponse ?? NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Strip locale prefix to compute "logical" path for auth checks
  const url = new URL(request.url);
  const pathname = url.pathname;
  const localeRx = /^\/(fr|ar)(?=\/|$)/;
  const logicalPath = pathname.replace(localeRx, "") || "/";

  const isProtected = PROTECTED_PREFIXES.some((p) => logicalPath.startsWith(p));
  const isAuthPage = AUTH_PAGES.some((p) => logicalPath === p);

  // Redirect unauthenticated users away from protected zones
  if (isProtected && !user) {
    const loginUrl = new URL(request.url);
    loginUrl.pathname = pathname.startsWith("/ar") ? "/ar/connexion" : "/connexion";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages → /parent
  if (isAuthPage && user) {
    const homeUrl = new URL(request.url);
    homeUrl.pathname = pathname.startsWith("/ar") ? "/ar/parent" : "/parent";
    homeUrl.search = "";
    return NextResponse.redirect(homeUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
