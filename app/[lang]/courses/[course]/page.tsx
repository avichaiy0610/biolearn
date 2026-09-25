export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { hasLocale } from "@/lib/dictionaries";
import { courseBySlug, SEMESTER_LABEL, YEAR_LABEL } from "@/content/courses";
import { resolveCourseUnits } from "@/lib/course-data";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({ params }: PageProps<"/[lang]/courses/[course]">): Promise<Metadata> {
  const { lang, course: slug } = await params;
  const c = courseBySlug(slug);
  if (!c) return {};
  return { title: lang === "he" ? c.nameHe : c.nameEn, description: lang === "he" ? c.descHe : c.descEn };
}

export default async function CoursePage({ params }: PageProps<"/[lang]/courses/[course]">) {
  const { lang, course: slug } = await params;
  if (!hasLocale(lang)) notFound();
  const course = courseBySlug(slug);
  if (!course) notFound();
  const he = lang === "he";
  const L = he ? "he" : "en";

  const [units, topics] = await Promise.all([
    resolveCourseUnits(course, lang),
    prisma.topic.findMany({ where: { slug: { in: course.topics } }, select: { slug: true, nameHe: true, nameEn: true, icon: true } }),
  ]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <nav className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 mb-6">
        <Link href={`/${lang}/courses`} className="hover:text-emerald-600">{he ? "קורסים" : "Courses"}</Link>
        <span>/</span>
        <span className="text-zinc-900 dark:text-zinc-50 font-medium">{he ? course.nameHe : course.nameEn}</span>
      </nav>

      <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-1">
        {YEAR_LABEL[L][course.year]} · {SEMESTER_LABEL[L][course.semester]}
      </p>
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">{he ? course.nameHe : course.nameEn}</h1>
      <p className="text-zinc-500 dark:text-zinc-400 mb-8">{he ? course.descHe : course.descEn}</p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-4">{he ? "יחידות הלימוד לפי הסדר" : "Units in order"}</h2>
        <ol className="space-y-2">
          {units.map((u, i) => (
            <li key={u.key}>
              <Link
                href={u.href}
                className="flex items-center gap-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-3 hover:border-emerald-400 dark:hover:border-emerald-600 transition-colors"
              >
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold shrink-0">
                  {i + 1}
                </span>
                <span className="flex-1 text-zinc-900 dark:text-zinc-50">{he ? u.nameHe : u.nameEn}</span>
                <span className="text-xs text-zinc-400 shrink-0">
                  {u.kind === "process" ? (he ? "🎬 אנימציה" : "🎬 Animation") : (he ? "📖 קריאה" : "📖 Reading")}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-3">{he ? "נושאים בקורס" : "Topics in this course"}</h2>
        <div className="flex flex-wrap gap-2">
          {topics.map((t) => (
            <Link key={t.slug} href={`/${lang}/topics/${t.slug}`}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 text-sm hover:border-emerald-400">
              <span aria-hidden>{t.icon}</span>{he ? t.nameHe : t.nameEn}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
