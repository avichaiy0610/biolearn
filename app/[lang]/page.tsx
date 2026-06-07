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
  const isHe = lang === "he";

  const [topics, subtopicCount, articleCount, questionCount] = await Promise.all([
    prisma.topic.findMany({
      include: { _count: { select: { processes: true, subtopics: { where: { hidden: false } } } } },
      orderBy: { nameEn: "asc" },
    }),
    prisma.subtopic.count({ where: { hidden: false } }),
    prisma.article.count({ where: { hidden: false } }),
    prisma.question.count({ where: { approved: true } }),
  ]);

  const features = [
    {
      icon: "🎬",
      titleHe: "אנימציות אינטראקטיביות",
      titleEn: "Interactive Animations",
      descHe: "צפה בתהליכים ביולוגיים שלב אחר שלב עם הסבר AI",
      descEn: "Watch biological processes step by step with AI explanation",
      href: `/${lang}/topics`,
    },
    {
      icon: "🧠",
      titleHe: "בחנים וכרטיסיות",
      titleEn: "Quizzes & Flashcards",
      descHe: "בחן את עצמך עם שאלות AI, כרטיסיות ומבחני סיכום",
      descEn: "Test yourself with AI-generated quizzes, flashcards, and exams",
      href: `/${lang}/topics`,
    },
    {
      icon: "🧬",
      titleHe: "מאגר חלבונים",
      titleEn: "Protein Database",
      descHe: "חפש חלבונים, מבנה AlphaFold, אינטראקציות ומאמרים",
      descEn: "Search proteins, AlphaFold structure, interactions and articles",
      href: `/${lang}/proteins`,
    },
    {
      icon: "🔬",
      titleHe: "מאמרים מדעיים",
      titleEn: "Scientific Articles",
      descHe: "מחקרים עדכניים מנותחים ומתורגמים לעברית",
      descEn: "Recent research analyzed and translated into Hebrew",
      href: `/${lang}/research`,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12" dir={isHe ? "rtl" : "ltr"}>
      {/* Hero */}
      <section className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-sm font-medium mb-5">
          <span>🎓</span>
          {isHe ? "פלטפורמת ביולוגיה לתואר ראשון" : "Undergraduate Biology Platform"}
        </div>
        <h1 className="text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
          {dict.home.title}
        </h1>
        <p className="text-xl text-emerald-700 dark:text-emerald-400 font-medium mb-2">
          {dict.home.subtitle}
        </p>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto mb-7">
          {dict.home.description}
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            href={`/${lang}/topics`}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            {dict.home.exploreTopics}
          </Link>
          <Link
            href={`/${lang}/proteins`}
            className="border border-zinc-300 dark:border-zinc-600 hover:border-emerald-400 text-zinc-700 dark:text-zinc-300 font-medium px-6 py-3 rounded-xl transition-colors text-sm"
          >
            🧬 {isHe ? "מאגר חלבונים" : "Protein Database"}
          </Link>
        </div>
      </section>

      {/* Platform stats */}
      <section className="flex justify-center gap-8 mb-12 flex-wrap">
        {[
          { value: topics.length, label: isHe ? "נושאים" : "Topics" },
          { value: subtopicCount, label: isHe ? "תת-נושאים" : "Subtopics" },
          { value: articleCount, label: isHe ? "מאמרים" : "Articles" },
          { value: questionCount, label: isHe ? "שאלות תרגול" : "Practice Q's" },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{s.value}+</div>
            <div className="text-sm text-zinc-400">{s.label}</div>
          </div>
        ))}
      </section>

      {/* Feature cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
        {features.map((f) => (
          <Link
            key={f.href + f.titleEn}
            href={f.href}
            className="flex flex-col gap-2 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all hover:shadow-sm group"
          >
            <span className="text-3xl">{f.icon}</span>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 text-sm leading-snug">
              {isHe ? f.titleHe : f.titleEn}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {isHe ? f.descHe : f.descEn}
            </p>
          </Link>
        ))}
      </section>

      {/* Topic grid */}
      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-5">
        {isHe ? "גלה לפי נושא" : "Browse by Topic"}
      </h2>
      <TopicGrid topics={topics} lang={lang as Locale} dict={dict} />
    </div>
  );
}
