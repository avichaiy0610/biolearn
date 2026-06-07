"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import type { Locale } from "@/lib/dictionaries";
import LanguageSwitcher from "./LanguageSwitcher";
import SearchBar from "./SearchBar";

type Dict = {
  nav: { home: string; topics: string; search: string; research: string; admin: string; login: string; logout: string };
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

  const navLinks = [
    { href: `/${lang}`, label: dict.nav.home },
    { href: `/${lang}/topics`, label: dict.nav.topics },
    { href: `/${lang}/research`, label: dict.nav.research },
    ...(isAdmin ? [{ href: `/${lang}/admin`, label: dict.nav.admin }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-4">
        <Link
          href={`/${lang}`}
          className="text-xl font-bold text-emerald-600 dark:text-emerald-400 shrink-0"
        >
          BioLearn
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex-1 max-w-xs">
          <SearchBar lang={lang} placeholder={dict.home.searchPlaceholder} />
        </div>

        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <button
              onClick={() => signOut({ callbackUrl: `${window.location.origin}/${lang}` })}
              className="px-3 py-1.5 rounded-md text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors"
            >
              {dict.nav.logout}
            </button>
          ) : (
            <Link
              href={`/${lang}/auth/login`}
              className="px-3 py-1.5 rounded-md text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors"
            >
              {dict.nav.login}
            </Link>
          )}
          <LanguageSwitcher currentLang={lang} />
        </div>
      </div>
    </header>
  );
}
