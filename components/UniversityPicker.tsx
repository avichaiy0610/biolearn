"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { UNIVERSITIES, UNIVERSITY_COOKIE } from "@/content/universities";

// Lets the visitor pick the university whose course track the site follows.
// Stored in a cookie for a year so server pages can read it on the next request.
export default function UniversityPicker({ current, lang }: { current: string; lang: string }) {
  const he = lang === "he";
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, start] = useTransition();

  function choose(slug: string) {
    document.cookie = `${UNIVERSITY_COOKIE}=${slug}; path=/; max-age=31536000; samesite=lax`;
    const next = new URLSearchParams(params.toString());
    next.delete("uni");
    const qs = next.toString();
    start(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      router.refresh();
    });
  }

  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <span className="text-zinc-600 dark:text-zinc-300 font-medium">{he ? "האוניברסיטה שלי:" : "My university:"}</span>
      <select
        value={current}
        onChange={(e) => choose(e.target.value)}
        disabled={pending}
        className="h-10 rounded-xl border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60"
      >
        {UNIVERSITIES.map((u) => (
          <option key={u.slug} value={u.slug}>{he ? u.nameHe : u.nameEn}</option>
        ))}
      </select>
    </label>
  );
}
