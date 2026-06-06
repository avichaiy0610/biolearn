import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { locales, defaultLocale } from "./lib/dictionaries";

function getLocale(request: NextRequest) {
  const acceptLanguage = request.headers.get("accept-language") ?? "";
  if (acceptLanguage.includes("he")) return "he";
  return defaultLocale;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip internal paths, API, and static files
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

  // Admin route protection
  const isAdminRoute = locales.some(
    (locale) => pathname.startsWith(`/${locale}/admin`)
  );

  if (isAdminRoute) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    const userEmail = token?.email as string | undefined;

    if (!userEmail) {
      const locale = locales.find((l) => pathname.startsWith(`/${l}/`)) ?? defaultLocale;
      return NextResponse.redirect(
        new URL(
          `/${locale}/auth/login?next=${encodeURIComponent(pathname)}`,
          request.url
        )
      );
    }

    const adminEmails = (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((e) => e.trim());

    if (!adminEmails.includes(userEmail)) {
      const locale = locales.find((l) => pathname.startsWith(`/${l}/`)) ?? defaultLocale;
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }
  }
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
