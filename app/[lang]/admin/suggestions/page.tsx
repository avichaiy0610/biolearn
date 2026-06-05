export const dynamic = "force-dynamic";

import { getDictionary, hasLocale, type Locale } from "@/lib/dictionaries";
import { notFound } from "next/navigation";
import SuggestionsManager from "@/components/SuggestionsManager";
import { prisma } from "@/lib/prisma";

export default async function SuggestionsPage({ params }: PageProps<"/[lang]/admin/suggestions">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);

  const [suggestions, topics, logCount] = await Promise.all([
    prisma.contentSuggestion.findMany({
      where: { approved: false, rejected: false },
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    }),
    prisma.topic.findMany({ select: { slug: true, nameHe: true, nameEn: true }, orderBy: { nameEn: "asc" } }),
    prisma.chatLog.count(),
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">
          {lang === "he" ? "הצעות תוכן" : "Content Suggestions"}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          {lang === "he"
            ? `${logCount} שאלות נרשמו מהצ'אט — AI מנתח פערים ומציע תוכן חדש`
            : `${logCount} questions logged from chat — AI analyzes gaps and suggests new content`}
        </p>
      </div>
      <SuggestionsManager
        initialSuggestions={suggestions}
        topics={topics}
        lang={lang as Locale}
      />
    </div>
  );
}
