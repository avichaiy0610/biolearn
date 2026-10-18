import type { Metadata } from "next";
import { Geist, Noto_Sans_Hebrew } from "next/font/google";
import Link from "next/link";
import "../globals.css";
import { hasLocale, getDictionary, type Locale } from "@/lib/dictionaries";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getUser, isAdmin as checkIsAdmin } from "@/lib/supabase/server";
import { SITE_URL } from "@/lib/site";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const hebrew = Noto_Sans_Hebrew({ subsets: ["hebrew", "latin"], variable: "--font-hebrew", weight: ["400", "500", "600", "700", "800", "900"] });

// Applies the theme picked with the toggle before first paint (no flash).
const THEME_INIT = `try{var t=localStorage.getItem("bl-theme");if(t==="dark"||t==="light")document.documentElement.dataset.theme=t}catch(e){}`;

const TITLE = "BioLearn — פלטפורמת לימוד ביולוגיה";
const DESCRIPTION = "ביולוגיה לתואר ראשון — אנימציות אינטראקטיביות והסברי AI";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s | BioLearn" },
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: "BioLearn",
    locale: "he_IL",
    alternateLocale: ["en_US"],
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "BioLearn — הפלטפורמה לביולוגיה לתואר ראשון" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/og.png"] },
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
      className={`${geist.variable} ${hebrew.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body className="min-h-full flex flex-col bg-bg text-ink">
        <Navbar
          dict={dict}
          lang={lang as Locale}
          isAdmin={adminFlag}
          isLoggedIn={!!user}
        />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-line bg-surface text-sm text-muted">
          <div className="max-w-6xl mx-auto px-4 py-6 flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="font-semibold text-ink"><bdi>BioLearn</bdi> &copy; {new Date().getFullYear()}</span>
            <span>
              {isRtl
                ? "מבנה הקורסים לפי השנתונים הרשמיים של האוניברסיטאות · התוכן נבדק מול Campbell, Alberts ו-Lehninger"
                : "Course structure from the universities' official catalogs · content checked against Campbell, Alberts and Lehninger"}
            </span>
            <span className="ms-auto flex gap-4">
              <Link href={`/${lang}/courses`} className="hover:text-brand">{isRtl ? "קורסים" : "Courses"}</Link>
              <Link href={`/${lang}/topics`} className="hover:text-brand">{isRtl ? "נושאים" : "Topics"}</Link>
              <Link href={`/${lang}/review`} className="hover:text-brand">{isRtl ? "תרגול וחזרה" : "Practice"}</Link>
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
