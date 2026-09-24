import TopicCard from "./TopicCard";
import type { Locale } from "@/lib/dictionaries";
import { isComingSoon } from "@/lib/topics";

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

export default function TopicGrid({
  topics,
  lang,
  dict,
}: {
  topics: Topic[];
  lang: Locale;
  dict: { topics: { processes: string; subtopics: string } };
}) {
  const active = topics.filter((t) => !isComingSoon(t));
  const soon = topics.filter((t) => isComingSoon(t));

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {active.map((topic) => (
          <TopicCard key={topic.id} topic={topic} lang={lang} dict={dict} />
        ))}
      </div>

      {soon.length > 0 && (
        <section className="mt-10">
          <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-3">
            {lang === "he" ? "בקרוב — נושאים בפיתוח" : "Coming soon — topics in development"}
          </h3>
          <ul className="flex flex-wrap gap-2">
            {soon.map((topic) => (
              <li
                key={topic.id}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-dashed border-zinc-300 dark:border-zinc-600 text-sm text-zinc-500 dark:text-zinc-400"
              >
                <span aria-hidden>{topic.icon}</span>
                {lang === "he" ? topic.nameHe : topic.nameEn}
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                  {lang === "he" ? "בקרוב" : "Soon"}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
