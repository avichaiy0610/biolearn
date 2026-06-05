"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/dictionaries";

export default function LanguageSwitcher({
  currentLang,
}: {
  currentLang: Locale;
}) {
  const pathname = usePathname();

  function switchLocale(targetLang: Locale) {
    // Replace current locale prefix with target locale
    const segments = pathname.split("/");
    segments[1] = targetLang;
    return segments.join("/");
  }

  return (
    <div className="flex items-center gap-1 rounded-md border border-zinc-200 dark:border-zinc-700 p-0.5">
      {(["he", "en"] as Locale[]).map((locale) => (
        <Link
          key={locale}
          href={switchLocale(locale)}
          className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
            currentLang === locale
              ? "bg-emerald-600 text-white"
              : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          }`}
        >
          {locale === "he" ? "עב" : "EN"}
        </Link>
      ))}
    </div>
  );
}
