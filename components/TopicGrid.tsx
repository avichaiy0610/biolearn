import TopicCard from "./TopicCard";
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

export default function TopicGrid({
  topics,
  lang,
  dict,
}: {
  topics: Topic[];
  lang: Locale;
  dict: { topics: { processes: string; subtopics: string } };
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {topics.map((topic) => (
        <TopicCard key={topic.id} topic={topic} lang={lang} dict={dict} />
      ))}
    </div>
  );
}
