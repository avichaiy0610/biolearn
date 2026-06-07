export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getDictionary, hasLocale, type Locale } from "@/lib/dictionaries";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import SubtopicResearch from "@/components/SubtopicResearch";
import ChatPanel from "@/components/ChatPanel";

export default async function TopicPage({
  params,
}: PageProps<"/[lang]/topics/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);
  const topic = await prisma.topic.findUnique({
    where: { slug },
    include: { subtopics: true, processes: true },
  });

  if (!topic) notFound();

  const name = lang === "he" ? topic.nameHe : topic.nameEn;
  const desc = lang === "he" ? topic.descHe : topic.descEn;

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

      {/* Subtopics */}
      {topic.subtopics.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
            {dict.topics.subtopics}
          </h2>
          <div className="space-y-3">
            {topic.subtopics.map((sub) => {
              const subName = lang === "he" ? sub.nameHe : sub.nameEn;
              const subContent = lang === "he" ? sub.contentHe : sub.contentEn;
              return (
                <details
                  key={sub.id}
                  className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 overflow-hidden group"
                >
                  <summary className="px-5 py-4 font-medium cursor-pointer text-zinc-900 dark:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 flex items-center justify-between">
                    <span>{subName}</span>
                    <span className="text-zinc-400 text-sm group-open:rotate-90 transition-transform inline-block">▶</span>
                  </summary>
                  <div className="px-5 pb-5 pt-2 border-t border-zinc-100 dark:border-zinc-700/50">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap mb-3">
                      {subContent}
                    </p>

                    <div className="flex flex-wrap gap-2 items-center">
                      {/* Animation link — only shown when the process actually exists */}
                      {sub.relatedProcessSlug && topic.processes.some((p) => p.slug === sub.relatedProcessSlug) && (
                        <Link
                          href={`/${lang}/topics/${slug}/${sub.relatedProcessSlug}`}
                          className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-800/40 transition-colors"
                        >
                          <span>🎬</span>
                          {dict.subtopic.viewAnimation}
                        </Link>
                      )}

                      {/* Perplexity research button */}
                      <SubtopicResearch
                        lang={lang as Locale}
                        subtopicName={subName}
                        topicName={name}
                        dict={dict}
                      />
                    </div>
                  </div>
                </details>
              );
            })}
          </div>
        </section>
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
