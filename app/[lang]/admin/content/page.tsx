export const dynamic = "force-dynamic";

import { getDictionary, hasLocale, type Locale } from "@/lib/dictionaries";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AdminContentManager from "@/components/AdminContentManager";

export default async function AdminContentPage({ params }: PageProps<"/[lang]/admin/content">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);

  const topics = await prisma.topic.findMany({
    orderBy: { nameEn: "asc" },
    include: {
      subtopics: { orderBy: { nameEn: "asc" } },
      processes: { orderBy: { nameEn: "asc" }, include: { steps: { orderBy: { order: "asc" } } } },
    },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
        {lang === "he" ? "ניהול תוכן" : "Content Management"}
      </h1>
      <p className="text-zinc-500 dark:text-zinc-400 mb-8">
        {lang === "he"
          ? "צור ועדכן נושאים, תתי-נושאים ותהליכים"
          : "Create and update topics, subtopics and processes"}
      </p>
      <AdminContentManager topics={topics} lang={lang as Locale} dict={dict} />
    </div>
  );
}
