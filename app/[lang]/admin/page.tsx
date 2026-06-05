export const dynamic = "force-dynamic";

import { getDictionary, hasLocale, type Locale } from "@/lib/dictionaries";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function AdminPage({ params }: PageProps<"/[lang]/admin">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);

  const cards = [
    {
      href: `/${lang}/admin/upload`,
      icon: "📄",
      titleHe: "העלאת סילבוס",
      titleEn: "Upload Syllabus",
      descHe: "נתח קבצי PDF/טקסט וצור תתי-נושאים חדשים",
      descEn: "Analyze PDF/text files and generate new subtopics",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-8">
        {dict.admin.title}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="flex flex-col gap-3 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all hover:shadow-md group"
          >
            <div className="text-3xl">{card.icon}</div>
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                {lang === "he" ? card.titleHe : card.titleEn}
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                {lang === "he" ? card.descHe : card.descEn}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
