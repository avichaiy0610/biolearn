import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale } from "./lib/dictionaries";

function getLocale(request: NextRequest) {
  const acceptLanguage = request.headers.get("accept-language") ?? "";
  if (acceptLanguage.includes("he")) return "he";
  return defaultLocale;
}

// Admin protection is handled server-side in app/[lang]/admin/layout.tsx
// using auth() from NextAuth — getToken() (v4 API) can't decrypt v5 JWE tokens.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return;
  }

  // Locale redirect: / → /he or /en
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    const locale = getLocale(request);
    request.nextUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
