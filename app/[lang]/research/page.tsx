export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getDictionary, hasLocale, type Locale } from "@/lib/dictionaries";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

type Article = {
  id: string;
  pubmedId: string | null;
  title: string;
  authors: string;
  journal: string | null;
  year: number | null;
  abstract: string;
  abstractHe: string | null;
  keyFindings: string | null;
  topicSlugs: string | null;
  url: string | null;
  source: string;
  createdAt: Date;
};

function parseJson<T>(str: string | null, fallback: T): T {
  if (!str) return fallback;
  try {
    return JSON.parse(str) as T;
  } catch {
    return fallback;
  }
}

export default async function ResearchPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);
  const isHe = lang === "he";

  const [articles, topics] = await Promise.all([
    prisma.article.findMany({
      where: { hidden: false },
      orderBy: { createdAt: "desc" },
    }),
    prisma.topic.findMany({ select: { slug: true, nameHe: true, nameEn: true } }),
  ]);

  const topicMap = Object.fromEntries(
    topics.map((t) => [t.slug, isHe ? t.nameHe : t.nameEn])
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10" dir={isHe ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
          🔬 {dict.research.title}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">{dict.research.subtitle}</p>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-20 text-zinc-400 dark:text-zinc-500">
          {dict.research.noArticles}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {articles.map((article: Article) => {
            const authors = parseJson<string[]>(article.authors, []);
            const keyFindings = parseJson<string[]>(article.keyFindings, []);
            const relatedTopicSlugs = parseJson<string[]>(article.topicSlugs, []);
            const displayAbstract = isHe && article.abstractHe ? article.abstractHe : article.abstract;

            return (
              <article
                key={article.id}
                className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Title + meta */}
                <div className="mb-4">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-medium">
                      {article.source === "pubmed" ? dict.research.source_pubmed : dict.research.source_upload}
                    </span>
                    {article.year && (
                      <span className="text-xs text-zinc-400">{article.year}</span>
                    )}
                    {article.journal && (
                      <span className="text-xs text-zinc-400 italic">{article.journal}</span>
                    )}
                  </div>

                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 leading-snug">
                    {article.title}
                  </h2>

                  {authors.length > 0 && (
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      {dict.research.authors}: {authors.slice(0, 5).join(", ")}
                      {authors.length > 5 && " ..."}
                    </p>
                  )}
                </div>

                {/* Related topics */}
                {relatedTopicSlugs.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {relatedTopicSlugs.map((slug) => (
                      <Link
                        key={slug}
                        href={`/${lang}/topics/${slug}`}
                        className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                      >
                        {topicMap[slug] ?? slug}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Key findings */}
                {keyFindings.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-2">
                      {dict.research.keyFindings}
                    </p>
                    <ul className="space-y-1">
                      {keyFindings.map((finding, i) => (
                        <li key={i} className="flex gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                          <span className="text-emerald-500 mt-0.5 shrink-0">•</span>
                          <span>{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Abstract (collapsible via details) */}
                <details className="group">
                  <summary className="cursor-pointer text-sm text-emerald-600 dark:text-emerald-400 hover:underline select-none">
                    {dict.research.abstract}
                  </summary>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {displayAbstract}
                  </p>
                </details>

                {/* Link */}
                {article.url && (
                  <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-700">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      {dict.research.readOriginal} →
                    </a>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
