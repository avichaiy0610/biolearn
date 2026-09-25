import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { hasLocale } from "@/lib/dictionaries";
import { COURSES, SEMESTER_LABEL, YEAR_LABEL } from "@/content/courses";

export const metadata: Metadata = {
  title: "קורסים",
  description: "התוכן של BioLearn מאורגן לפי קורסים וסמסטרים של תואר ראשון בביולוגיה",
};

export default async function CoursesPage({ params }: PageProps<"/[lang]/courses">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const he = lang === "he";
  const L = he ? "he" : "en";

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">{he ? "מסלול קורסים" : "Course track"}</h1>
      <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-2xl">
        {he
          ? "אותו תוכן, מסודר לפי הקורסים של תואר ראשון בביולוגיה. המבנה כללי — שמות הקורסים והסמסטרים משתנים מעט בין האוניברסיטאות."
          : "The same content, organized by typical B.Sc. biology courses. Names and semesters vary slightly between universities."}
      </p>

      {([1, 2, 3] as const).map((year) => {
        const inYear = COURSES.filter((c) => c.year === year);
        if (inYear.length === 0) return null;
        return (
          <section key={year} className="mb-10">
            <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-4">{YEAR_LABEL[L][year]}</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {(["A", "B"] as const).map((sem) => {
                const list = inYear.filter((c) => c.semester === sem);
                if (list.length === 0) return <div key={sem} className="hidden md:block" />;
                return (
                  <div key={sem}>
                    <h3 className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-2">{SEMESTER_LABEL[L][sem]}</h3>
                    <ul className="space-y-3">
                      {list.map((c) => (
                        <li key={c.slug}>
                          <Link
                            href={`/${lang}/courses/${c.slug}`}
                            className="block rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-4 hover:border-emerald-400 dark:hover:border-emerald-600 transition-colors"
                          >
                            <span className="font-semibold text-zinc-900 dark:text-zinc-50">{he ? c.nameHe : c.nameEn}</span>
                            <span className="block mt-1 text-sm text-zinc-500 dark:text-zinc-400">{he ? c.descHe : c.descEn}</span>
                            <span className="block mt-2 text-xs text-zinc-400">
                              {c.units.length} {he ? "יחידות לימוד" : "units"}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
