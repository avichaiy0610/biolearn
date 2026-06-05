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

  const topics = query
    ? await prisma.topic.findMany({
        where: {
          OR: [
            { nameHe: { contains: query } },
            { nameEn: { contains: query } },
            { descHe: { contains: query } },
            { descEn: { contains: query } },
          ],
        },
        take: 10,
      })
    : [];

  const processes = query
    ? await prisma.process.findMany({
        where: {
          OR: [
            { nameHe: { contains: query } },
            { nameEn: { contains: query } },
            { descHe: { contains: query } },
            { descEn: { contains: query } },
          ],
        },
        include: { topic: true },
        take: 10,
      })
    : [];

  const totalResults = topics.length + processes.length;

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
        <section>
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
    </div>
  );
}
