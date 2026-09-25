export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { hasLocale } from "@/lib/dictionaries";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { GLOSSARY, termId } from "@/content/glossary";
import ReviewSession, { type ReviewCard } from "@/components/ReviewSession";

export const metadata: Metadata = {
  title: "חזרה מרווחת",
  description: "חזרה על מונחי הביולוגיה בשיטת החזרה המרווחת",
};

export default async function ReviewPage({ params, searchParams }: PageProps<"/[lang]/review">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const he = lang === "he";
  const sp = await searchParams;
  const requested = typeof sp.topic === "string" ? sp.topic : null;

  const [session, dbTopics] = await Promise.all([
    auth().catch(() => null),
    prisma.topic.findMany({ where: { slug: { in: Object.keys(GLOSSARY) } }, select: { slug: true, nameHe: true, nameEn: true } }),
  ]);

  const topics = Object.keys(GLOSSARY)
    .map((slug) => dbTopics.find((t) => t.slug === slug))
    .filter((t): t is NonNullable<typeof t> => !!t)
    .map((t) => ({ slug: t.slug, name: he ? t.nameHe : t.nameEn }));
  const cards: ReviewCard[] = Object.entries(GLOSSARY).flatMap(([topic, terms]) =>
    terms.map((t) => ({ id: termId(topic, t), topic, he: t.he, en: t.en, defHe: t.defHe })),
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2 text-center">🔁 {he ? "חזרה מרווחת" : "Spaced repetition"}</h1>
      <p className="text-zinc-500 dark:text-zinc-400 mb-8 text-center max-w-xl mx-auto text-sm">
        {he
          ? "כרטיסיות של מונחי המפתח מכל נושא. כל כרטיס חוזר בדיוק לפני שהייתם שוכחים אותו — כך זוכרים לאורך זמן עם מינימום זמן חזרה."
          : "Key-term cards from every topic. Each card returns just before you'd forget it."}
      </p>
      <ReviewSession
        cards={cards}
        topics={topics}
        initialTopic={requested && GLOSSARY[requested] ? requested : null}
        isLoggedIn={!!session?.user?.email}
        lang={lang}
      />
    </div>
  );
}
