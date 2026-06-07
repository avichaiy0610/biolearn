export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getDictionary, hasLocale, type Locale } from "@/lib/dictionaries";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ChatPanel from "@/components/ChatPanel";
import ExamCreator from "@/components/ExamCreator";
import TopicPageClient from "@/components/TopicPageClient";

type ReactomePathway = { id: string; name: string; summary: string | null; url: string };

async function fetchPathways(query: string): Promise<ReactomePathway[]> {
  try {
    const url =
      `https://reactome.org/ContentService/search/query?query=${encodeURIComponent(query)}` +
      `&types=Pathway&species=Homo%20sapiens&cluster=true&rows=5&start=0`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    const entries = data.results?.[0]?.entries ?? [];
    return entries.slice(0, 5).map((r: { stId: string; name: string; summation?: string }) => ({
      id: r.stId,
      name: r.name,
      summary: r.summation?.replace(/<[^>]+>/g, "").slice(0, 140) ?? null,
      url: `https://reactome.org/PathwayBrowser/#/${r.stId}`,
    }));
  } catch { return []; }
}

export default async function TopicPage({
  params,
}: PageProps<"/[lang]/topics/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);
  const topic = await prisma.topic.findUnique({
    where: { slug },
    include: {
      subtopics: {
        where: { hidden: false },
        include: { _count: { select: { questions: { where: { approved: true } } } } },
      },
      processes: true,
    },
  });

  if (!topic) notFound();

  const name = lang === "he" ? topic.nameHe : topic.nameEn;
  const desc = lang === "he" ? topic.descHe : topic.descEn;

  const pathways = await fetchPathways(topic.nameEn);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-10">
        <div className="text-4xl mb-3">{topic.icon}</div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">{name}</h1>
        <p className="text-zinc-500 dark:text-zinc-400">{desc}</p>
      </div>

      {/* Processes */}
      {topic.processes.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
            {dict.topics.processes}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {topic.processes.map((p) => {
              const pName = lang === "he" ? p.nameHe : p.nameEn;
              const pDesc = lang === "he" ? p.descHe : p.descEn;
              return (
                <Link
                  key={p.id}
                  href={`/${lang}/topics/${slug}/${p.slug}`}
                  className="flex flex-col gap-1 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-emerald-400 dark:hover:border-emerald-600 transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-500">▶</span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-50 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                      {pName}
                    </span>
                  </div>
                  <span className="text-sm text-zinc-500 line-clamp-2 ps-6">{pDesc}</span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Reactome Pathways */}
      {pathways.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">
              {lang === "he" ? "מסלולים ביולוגיים (Reactome)" : "Biological Pathways (Reactome)"}
            </h2>
            <a
              href={`https://reactome.org/content/query?q=${encodeURIComponent(topic.nameEn)}&species=Homo+sapiens&types=Pathway`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-400 hover:text-emerald-600 transition-colors"
            >
              ↗ Reactome
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pathways.map((p) => (
              <a
                key={p.id}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col gap-1 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-violet-400 dark:hover:border-violet-600 transition-colors group"
              >
                <div className="flex items-start gap-2">
                  <span className="text-violet-500 text-lg shrink-0">⬡</span>
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50 group-hover:text-violet-700 dark:group-hover:text-violet-400 leading-snug mb-1">
                      {p.name}
                    </p>
                    {p.summary && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">{p.summary}</p>
                    )}
                    <p className="text-xs text-zinc-400 font-mono mt-1">{p.id}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Subtopics */}
      {topic.subtopics.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
            {dict.topics.subtopics}
          </h2>
          <TopicPageClient
            subtopics={topic.subtopics}
            processes={topic.processes}
            topicSlug={slug}
            topicName={name}
            lang={lang}
            dict={dict}
          />
        </section>
      )}

      {/* Exam mode */}
      {topic.subtopics.length > 0 && (
        <ExamCreator
          topicSlug={topic.slug}
          topicName={name}
          subtopicCount={topic.subtopics.length}
          lang={lang}
        />
      )}

      {/* Free-form AI chat */}
      <ChatPanel
        lang={lang as Locale}
        topicName={name}
        topicSlug={topic.slug}
        subtopics={topic.subtopics.map((s) => ({
          name: lang === "he" ? s.nameHe : s.nameEn,
          content: lang === "he" ? s.contentHe : s.contentEn,
        }))}
        dict={dict.chat}
      />
    </div>
  );
}
