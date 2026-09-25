"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { GlossaryTerm } from "@/content/glossary";
import { isolatePrimes } from "@/lib/text";

// Hebrew–English glossary with a filter that matches either language.
export default function Glossary({ terms, lang, topicSlug }: { terms: GlossaryTerm[]; lang: string; topicSlug?: string }) {
  const he = lang === "he";
  const [q, setQ] = useState("");
  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return terms;
    return terms.filter((t) => t.he.includes(s) || t.en.toLowerCase().includes(s) || t.defHe.includes(s));
  }, [q, terms]);

  return (
    <section className="mt-10" aria-labelledby="glossary-title">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
        <h2 id="glossary-title" className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">
          📖 {he ? "מילון מונחים עברית–אנגלית" : "Hebrew–English glossary"}
          <span className="ms-2 text-xs font-normal text-zinc-400">{terms.length}</span>
        </h2>
        {topicSlug && (
          <Link href={`/${lang}/review?topic=${topicSlug}`} className="text-sm text-emerald-700 dark:text-emerald-400 hover:underline">
            🔁 {he ? "חזרה מרווחת על המונחים" : "Review these terms"}
          </Link>
        )}
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={he ? "חיפוש מונח (עברית או English)" : "Search a term"}
          aria-label={he ? "חיפוש במילון" : "Search glossary"}
          className="w-full sm:w-64 h-9 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-700">
        {shown.length === 0 && <p className="p-4 text-sm text-zinc-500">{he ? "לא נמצאו מונחים." : "No matching terms."}</p>}
        {shown.map((t) => (
          <div key={t.en} className="grid gap-1 p-3 sm:grid-cols-[minmax(0,14rem)_minmax(0,14rem)_1fr] sm:gap-4">
            <span className="font-semibold text-zinc-900 dark:text-zinc-50">{t.he}</span>
            <bdi dir="ltr" className="text-emerald-700 dark:text-emerald-400 font-medium text-start">{t.en}</bdi>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">{isolatePrimes(t.defHe)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
