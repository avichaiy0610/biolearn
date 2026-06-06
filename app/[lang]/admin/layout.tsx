import { redirect } from "next/navigation";
import { hasLocale, type Locale } from "@/lib/dictionaries";
import { notFound } from "next/navigation";
import { isAdmin } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
  params,
}: LayoutProps<"/[lang]/admin">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const admin = await isAdmin().catch(() => false);
  if (!admin) {
    redirect(`/${lang}/auth/login`);
  }

  return <>{children}</>;
}
