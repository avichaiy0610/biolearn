export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getDictionary, hasLocale, type Locale } from "@/lib/dictionaries";
import { prisma } from "@/lib/prisma";
import TopicGrid from "@/components/TopicGrid";
import Link from "next/link";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);

  const topics = await prisma.topic.findMany({
    include: { _count: { select: { processes: true, subtopics: { where: { hidden: false } } } } },
    orderBy: { nameEn: "asc" },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero */}
      <section className="text-center mb-14">
        <h1 className="text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
          {dict.home.title}
        </h1>
        <p className="text-xl text-emerald-700 dark:text-emerald-400 font-medium mb-2">
          {dict.home.subtitle}
        </p>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
          {dict.home.description}
        </p>
        <Link
          href={`/${lang}/topics`}
          className="mt-6 inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          {dict.home.exploreTopics}
        </Link>
      </section>

      {/* Topic grid */}
      <TopicGrid topics={topics} lang={lang as Locale} dict={dict} />
    </div>
  );
}
