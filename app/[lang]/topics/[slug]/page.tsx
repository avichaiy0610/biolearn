export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getDictionary, hasLocale, type Locale } from "@/lib/dictionaries";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ChatPanel from "@/components/ChatPanel";
import ExamCreator from "@/components/ExamCreator";
import TopicPageClient from "@/components/TopicPageClient";
import ReactomePathwayCard from "@/components/ReactomePathwayCard";
import AiContentNote from "@/components/AiContentNote";
import TopicGuide from "@/components/TopicGuide";
import Glossary from "@/components/Glossary";
import { TOPIC_GUIDES } from "@/content/topic-guides";
import { GLOSSARY } from "@/content/glossary";
import { bankForSubtopic, bankForTopic } from "@/content/question-bank";
import TopicPractice from "@/components/TopicPractice";
import { isComingSoon } from "@/lib/topics";
import type { Metadata } from "next";

type ReactomePathway = { id: string; name: string; summary: string | null; url: string };

const stripHtml = (s: string) => s.replace(/<[^>]+>/g, "");

// Auto-search fallback for topics without curated pins (Topic.reactomePathwayIds).
// Reactome only has good coverage for human pathways, so plant topics get nothing,
// disease/infection pathways are dropped unless the topic is about them, and a
// result must share a meaningful word with the topic name.
const STOPWORDS = new Set(["biology", "and", "of", "the", "cell", "cellular"]);
const DISEASE_RE = /disease|infection|sars|covid|virus|viral|defective|disorder|cancer|deficiency/i;

async function fetchPathways(query: string, slug: string): Promise<ReactomePathway[]> {
  if (/plant/i.test(slug) || /plant/i.test(query)) return [];
  const words = query.toLowerCase().split(/\W+/).filter((w) => w.length > 3 && !STOPWORDS.has(w));
  if (words.length === 0) return [];
  const allowDisease = /immun|microb|disease/i.test(slug);
  try {
    const url =
      `https://reactome.org/ContentService/search/query?query=${encodeURIComponent(query)}` +
      `&types=Pathway&species=Homo%20sapiens&cluster=true&rows=20&start=0`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    const entries: { stId: string; name: string; summation?: string; species?: string[] }[] = data.results?.[0]?.entries ?? [];
    return entries
      .filter((r) => !r.species || r.species.includes("Homo sapiens"))
      .filter((r) => allowDisease || !DISEASE_RE.test(r.name))
      .filter((r) => words.some((w) => stripHtml(r.name).toLowerCase().includes(w)))
      .slice(0, 5)
      .map((r) => ({
      id: r.stId,
      name: stripHtml(r.name),
      summary: r.summation ? stripHtml(r.summation).slice(0, 400) : null,
      url: `https://reactome.org/PathwayBrowser/#/${r.stId}`,
    }));
  } catch { return []; }
}

async function fetchPathwaysByIds(stIds: string[]): Promise<ReactomePathway[]> {
  if (stIds.length === 0) return [];
  const results = await Promise.all(
    stIds.map(async (stId) => {
      try {
        const res = await fetch(
          `https://reactome.org/ContentService/data/query/${stId}`,
          { next: { revalidate: 3600 } }
        );
        if (!res.ok) return null;
        const d = await res.json();
        const summary = Array.isArray(d.summation) && d.summation[0]?.text
          ? stripHtml(d.summation[0].text).slice(0, 400)
          : null;
        return {
          id: stId,
          name: stripHtml(d.displayName ?? stId),
          summary,
          url: `https://reactome.org/PathwayBrowser/#/${stId}`,
        } satisfies ReactomePathway;
      } catch { return null; }
    })
  );
  return results.filter((r): r is ReactomePathway => r !== null);
}

export async function generateMetadata({ params }: PageProps<"/[lang]/topics/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const topic = await prisma.topic.findUnique({
    where: { slug },
    select: { slug: true, nameHe: true, nameEn: true, descHe: true, descEn: true, _count: { select: { processes: true, subtopics: { where: { hidden: false } } } } },
  });
  if (!topic) return {};
  const title = lang === "he" ? topic.nameHe : topic.nameEn;
  const description = lang === "he" ? topic.descHe : topic.descEn;
  return {
    title,
    description,
    openGraph: { title: `${title} | BioLearn`, description },
    alternates: { languages: { he: `/he/topics/${slug}`, en: `/en/topics/${slug}` } },
    ...(isComingSoon(topic) ? { robots: { index: false } } : {}),
  };
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

  const pinnedIds: string[] | null = topic.reactomePathwayIds
    ? JSON.parse(topic.reactomePathwayIds)
    : null;
  const pathways = pinnedIds === null
    ? await fetchPathways(topic.nameEn, topic.slug)
    : await fetchPathwaysByIds(pinnedIds);

  const comingSoon = isComingSoon({ slug: topic.slug, _count: { processes: topic.processes.length, subtopics: topic.subtopics.length } });
  const updatedAt = topic.subtopics.reduce<Date | null>(
    (max, s) => (s.updatedAt && (!max || s.updatedAt > max) ? s.updatedAt : max), null);
  const reviewed = topic.subtopics.length > 0 && topic.subtopics.every((s) => s.reviewedAt);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-10">
        <div className="text-4xl mb-3">{topic.icon}</div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">{name}</h1>
        <p className="text-zinc-500 dark:text-zinc-400">{desc}</p>
        {comingSoon && (
          <p className="mt-4 inline-block rounded-lg border border-dashed border-zinc-300 dark:border-zinc-600 px-3 py-2 text-sm text-zinc-500 dark:text-zinc-400">
            🚧 {lang === "he" ? "הנושא בפיתוח — התוכן כאן עדיין חלקי." : "This topic is in development — content is still partial."}
          </p>
        )}
      </div>

      {TOPIC_GUIDES[topic.slug] && <TopicGuide guide={TOPIC_GUIDES[topic.slug]} lang={lang} />}

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
          <div className="grid grid-cols-1 gap-3">
            {pathways.map((p) => (
              <ReactomePathwayCard
                key={p.id}
                stId={p.id}
                name={p.name}
                summary={p.summary}
                url={p.url}
                lang={lang}
              />
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
            subtopics={topic.subtopics.map((s) => ({
              ...s,
              _count: { questions: s._count.questions + bankForSubtopic(s.id).length },
            }))}
            processes={topic.processes}
            topicSlug={slug}
            topicName={name}
            lang={lang}
            dict={dict}
          />
        </section>
      )}

      {GLOSSARY[topic.slug] && <Glossary terms={GLOSSARY[topic.slug]} lang={lang} topicSlug={topic.slug} />}

      {bankForTopic(topic.slug).length > 0 && (
        <TopicPractice topicSlug={topic.slug} total={bankForTopic(topic.slug).length} lang={lang} />
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

      <AiContentNote lang={lang} topicSlug={topic.slug} updatedAt={updatedAt} reviewed={reviewed} />
    </div>
  );
}
