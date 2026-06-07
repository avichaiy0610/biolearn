export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getDictionary, hasLocale, type Locale } from "@/lib/dictionaries";
import { prisma } from "@/lib/prisma";
import TopicGrid from "@/components/TopicGrid";

export default async function TopicsPage({ params }: PageProps<"/[lang]/topics">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);

  const topics = await prisma.topic.findMany({
    include: { _count: { select: { processes: true, subtopics: { where: { hidden: false } } } } },
    orderBy: { nameEn: "asc" },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-8">
        {dict.topics.title}
      </h1>
      <TopicGrid topics={topics} lang={lang as Locale} dict={dict} />
    </div>
  );
}
