export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getDictionary, hasLocale, type Locale } from "@/lib/dictionaries";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function SearchPage({
  params,
  searchParams,
}: PageProps<"/[lang]/search">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.trim() : "";

  const [topics, processes, subtopics, articles] = query
    ? await Promise.all([
        prisma.topic.findMany({
          where: { OR: [{ nameHe: { contains: query } }, { nameEn: { contains: query } }, { descHe: { contains: query } }, { descEn: { contains: query } }] },
          take: 6,
        }),
        prisma.process.findMany({
          where: { OR: [{ nameHe: { contains: query } }, { nameEn: { contains: query } }, { descHe: { contains: query } }, { descEn: { contains: query } }] },
          include: { topic: true },
          take: 6,
        }),
        prisma.subtopic.findMany({
          where: {
            hidden: false,
            OR: [{ nameHe: { contains: query } }, { nameEn: { contains: query } }, { contentHe: { contains: query } }, { contentEn: { contains: query } }],
          },
          select: { id: true, nameHe: true, nameEn: true, contentHe: true, contentEn: true, topic: { select: { slug: true, nameHe: true, nameEn: true } } },
          take: 8,
        }),
        prisma.article.findMany({
          where: { hidden: false, OR: [{ title: { contains: query } }, { abstract: { contains: query } }, { abstractHe: { contains: query } }] },
          select: { id: true, title: true, abstractHe: true, abstract: true, year: true, journal: true },
          take: 5,
        }),
      ])
    : [[], [], [], []];

  const totalResults = topics.length + processes.length + subtopics.length + articles.length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
        {dict.search.title}
      </h1>
      {query && (
        <p className="text-zinc-500 dark:text-zinc-400 mb-8">
          {totalResults > 0 ? dict.search.resultsFor : dict.search.noResults}{" "}
          <span className="font-medium text-zinc-900 dark:text-zinc-50">
            &quot;{query}&quot;
          </span>
        </p>
      )}

      {topics.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide mb-3">
            {dict.topics.title}
          </h2>
          <div className="space-y-2">
            {topics.map((t) => (
              <Link
                key={t.id}
                href={`/${lang}/topics/${t.slug}`}
                className="flex items-center gap-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-emerald-400 transition-colors"
              >
                <span className="text-xl">{t.icon}</span>
                <div>
                  <div className="font-medium text-zinc-900 dark:text-zinc-50">
                    {lang === "he" ? t.nameHe : t.nameEn}
                  </div>
                  <div className="text-sm text-zinc-500">
                    {lang === "he" ? t.descHe : t.descEn}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {processes.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide mb-3">
            {dict.topics.processes}
          </h2>
          <div className="space-y-2">
            {processes.map((p) => (
              <Link
                key={p.id}
                href={`/${lang}/topics/${p.topic.slug}/${p.slug}`}
                className="flex items-center gap-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-emerald-400 transition-colors"
              >
                <span className="text-xl">⚙️</span>
                <div>
                  <div className="font-medium text-zinc-900 dark:text-zinc-50">
                    {lang === "he" ? p.nameHe : p.nameEn}
                  </div>
                  <div className="text-sm text-zinc-500">
                    {lang === "he" ? p.topic.nameHe : p.topic.nameEn}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {subtopics.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide mb-3">
            {dict.topics.subtopics}
          </h2>
          <div className="space-y-2">
            {subtopics.map((s) => (
              <Link
                key={s.id}
                href={`/${lang}/topics/${s.topic.slug}`}
                className="flex flex-col gap-1 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-emerald-400 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-700 text-zinc-500">
                    {lang === "he" ? s.topic.nameHe : s.topic.nameEn}
                  </span>
                  <span className="font-medium text-sm text-zinc-900 dark:text-zinc-50 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                    {lang === "he" ? s.nameHe : s.nameEn}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                  {((lang === "he" ? s.contentHe : s.contentEn) ?? "").slice(0, 160)}...
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {articles.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide mb-3">
            {lang === "he" ? "מאמרים מדעיים" : "Scientific Articles"}
          </h2>
          <div className="space-y-2">
            {articles.map((a) => (
              <Link
                key={a.id}
                href={`/${lang}/research`}
                className="flex flex-col gap-1 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-emerald-400 transition-colors group"
              >
                <p className="font-medium text-sm text-zinc-900 dark:text-zinc-50 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 line-clamp-2">
                  {a.title}
                </p>
                {(a.journal || a.year) && (
                  <p className="text-xs text-zinc-400">{[a.journal, a.year].filter(Boolean).join(" · ")}</p>
                )}
                <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                  {(a.abstractHe || a.abstract).slice(0, 160)}...
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {query && totalResults === 0 && (
        <div className="text-center py-16 text-zinc-400">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-sm">{dict.search.noResults} &ldquo;{query}&rdquo;</p>
        </div>
      )}
    </div>
  );
}
