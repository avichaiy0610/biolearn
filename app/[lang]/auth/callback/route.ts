import { NextResponse } from "next/server";

// OAuth callback no longer used (auth is credentials-based via NextAuth).
// Redirect to home to avoid 404 on any lingering links.
export async function GET(request: Request, ctx: RouteContext<"/[lang]/auth/callback">) {
  const { lang } = await ctx.params;
  return NextResponse.redirect(new URL(`/${lang}`, request.url));
}
