import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "../globals.css";
import { hasLocale, getDictionary, type Locale } from "@/lib/dictionaries";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getUser, isAdmin as checkIsAdmin } from "@/lib/supabase/server";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "BioLearn — פלטפורמת לימוד ביולוגיה",
  description: "ביולוגיה לתואר ראשון — אנימציות אינטראקטיביות והסברי AI",
};

export async function generateStaticParams() {
  return [{ lang: "he" }, { lang: "en" }];
}

export default async function LangLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);
  const isRtl = lang === "he";

  const [user, adminFlag] = await Promise.all([
    getUser().catch(() => null),
    checkIsAdmin().catch(() => false),
  ]);

  return (
    <html
      lang={lang}
      dir={isRtl ? "rtl" : "ltr"}
      className={`${geist.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50">
        <Navbar
          dict={dict}
          lang={lang as Locale}
          isAdmin={adminFlag}
          isLoggedIn={!!user}
        />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-zinc-200 dark:border-zinc-800 py-6 text-center text-sm text-zinc-500">
          BioLearn &copy; {new Date().getFullYear()}
        </footer>
      </body>
    </html>
  );
}
