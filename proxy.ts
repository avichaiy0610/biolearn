import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale } from "./lib/dictionaries";
import { createServerClient } from "@supabase/ssr";

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

  // Locale detection: redirect / -> /he or /en
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    const locale = getLocale(request);
    request.nextUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  // Admin protection — requires Supabase auth
  const isAdminRoute = locales.some(
    (locale) =>
      pathname.startsWith(`/${locale}/admin`) &&
      !pathname.startsWith(`/${locale}/auth`)
  );

  if (isAdminRoute && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const response = NextResponse.next();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (cookiesToSet) =>
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            ),
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      const locale = locales.find((l) => pathname.startsWith(`/${l}/`)) ?? defaultLocale;
      return NextResponse.redirect(
        new URL(`/${locale}/auth/login?next=${encodeURIComponent(pathname)}`, request.url)
      );
    }

    const adminEmails = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim());
    if (!adminEmails.includes(user.email ?? "")) {
      const locale = locales.find((l) => pathname.startsWith(`/${l}/`)) ?? defaultLocale;
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }

    return response;
  }
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
