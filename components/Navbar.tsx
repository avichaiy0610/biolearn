"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";
import type { Locale } from "@/lib/dictionaries";
import LanguageSwitcher from "./LanguageSwitcher";
import SearchBar from "./SearchBar";
import ThemeToggle from "./ThemeToggle";

type Dict = {
  nav: { home: string; topics: string; courses: string; review: string; search: string; research: string; proteins: string; admin: string; login: string; logout: string };
  home: { searchPlaceholder: string };
};

export default function Navbar({
  dict,
  lang,
  isAdmin = false,
  isLoggedIn = false,
}: {
  dict: Dict;
  lang: Locale;
  isAdmin?: boolean;
  isLoggedIn?: boolean;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: `/${lang}/courses`, label: dict.nav.courses },
    { href: `/${lang}/topics`, label: dict.nav.topics },
    { href: `/${lang}/review`, label: dict.nav.review },
    { href: `/${lang}/research`, label: dict.nav.research },
    { href: `/${lang}/proteins`, label: dict.nav.proteins },
    ...(isAdmin ? [{ href: `/${lang}/admin`, label: dict.nav.admin }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/95 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-2 sm:gap-4">
        <Link href={`/${lang}`} dir="ltr" aria-label={lang === "he" ? "BioLearn — דף הבית" : "BioLearn — home"}
          className="inline-flex items-center gap-2 text-[22px] font-black tracking-tight text-ink shrink-0">
          <svg width="26" height="26" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand" aria-hidden>
            <ellipse cx="16" cy="16" rx="13" ry="11" />
            <circle cx="18" cy="15" r="4.5" fill="currentColor" fillOpacity=".2" strokeWidth="1.6" />
            <path d="M8 19c2-2 4 0 6-1" strokeLinecap="round" strokeWidth="1.6" />
          </svg>
          <span>Bio<span className="text-brand">Learn</span></span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                pathname === link.href || pathname.startsWith(`${link.href}/`)
                  ? "text-brand"
                  : "text-muted hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block flex-1 max-w-xs">
          <SearchBar lang={lang} placeholder={dict.home.searchPlaceholder} />
        </div>
        <div className="flex-1 lg:hidden" />

        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <Link
                href={`/${lang}/profile`}
                className="px-3 py-1.5 rounded-md text-sm font-medium text-muted hover:text-ink transition-colors"
                title={lang === "he" ? "הפרופיל שלי" : "My Profile"}
              >
                👤
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: `${window.location.origin}/${lang}` })}
                className="px-3 py-1.5 rounded-md text-sm font-medium text-muted hover:text-ink transition-colors"
              >
                {dict.nav.logout}
              </button>
            </>
          ) : (
            <Link
              href={`/${lang}/auth/login`}
              className="px-3 py-1.5 rounded-md text-sm font-medium text-muted hover:text-ink transition-colors"
            >
              {dict.nav.login}
            </Link>
          )}
          <LanguageSwitcher currentLang={lang} />
          <span className="hidden sm:block"><ThemeToggle lang={lang} /></span>

          {/* Mobile hamburger button */}
          <button
            className="md:hidden p-2 rounded-md text-muted hover:text-ink transition-colors"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile: full-width search row (too narrow to share the top row) */}
      <div className="lg:hidden px-4 pb-3">
        <SearchBar lang={lang} placeholder={dict.home.searchPlaceholder} />
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <nav className="md:hidden border-t border-line bg-surface px-4 py-3 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                pathname === link.href || pathname.startsWith(`${link.href}/`)
                  ? "text-brand"
                  : "text-muted hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="sm:hidden flex items-center gap-3 px-3 pt-2 text-sm text-muted">
            <ThemeToggle lang={lang} /> {lang === "he" ? "מצב תצוגה" : "Theme"}
          </div>
        </nav>
      )}
    </header>
  );
}
