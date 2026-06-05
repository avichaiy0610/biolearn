import Link from "next/link";
import type { Locale } from "@/lib/dictionaries";

type Topic = {
  id: string;
  slug: string;
  nameHe: string;
  nameEn: string;
  descHe: string;
  descEn: string;
  icon: string;
  category: string;
  _count?: { processes: number; subtopics: number };
};

export default function TopicCard({
  topic,
  lang,
  dict,
}: {
  topic: Topic;
  lang: Locale;
  dict: { topics: { processes: string; subtopics: string } };
}) {
  const name = lang === "he" ? topic.nameHe : topic.nameEn;
  const desc = lang === "he" ? topic.descHe : topic.descEn;

  return (
    <Link
      href={`/${lang}/topics/${topic.slug}`}
      className="group flex flex-col gap-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-5 shadow-sm hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-600 transition-all"
    >
      <div className="text-3xl">{topic.icon}</div>
      <div>
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
          {name}
        </h3>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
          {desc}
        </p>
      </div>
      {topic._count && (
        <div className="flex gap-3 text-xs text-zinc-400 dark:text-zinc-500 mt-auto">
          <span>
            {topic._count.processes} {dict.topics.processes}
          </span>
          <span>
            {topic._count.subtopics} {dict.topics.subtopics}
          </span>
        </div>
      )}
    </Link>
  );
}
