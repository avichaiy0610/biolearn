import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { hasLocale } from "@/lib/dictionaries";
import { SEMESTER_LABEL, YEAR_LABEL } from "@/content/courses";
import { COURSE_KIND_LABEL, GENERAL_UNIVERSITY } from "@/content/universities";
import { getCourses } from "@/lib/courses-db";
import { planUnitCount } from "@/content/course-plans";
import { selectedUniversity } from "@/lib/university";
import UniversityPicker from "@/components/UniversityPicker";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "קורסים",
  description: "התוכן של BioLearn מאורגן לפי הקורסים והסמסטרים של תואר ראשון בביולוגיה — לפי האוניברסיטה שלך",
};

const SEMESTERS = ["A", "B", "Y"] as const;

export default async function CoursesPage({ params, searchParams }: PageProps<"/[lang]/courses">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const he = lang === "he";
  const L = he ? "he" : "en";
  const uni = await selectedUniversity((await searchParams).uni);
  const courses = await getCourses(uni.slug);
  const isGeneral = uni.slug === GENERAL_UNIVERSITY;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">{he ? "מסלול קורסים" : "Course track"}</h1>
      <p className="text-zinc-500 dark:text-zinc-400 mb-5 max-w-2xl">
        {he
          ? "בחרו את האוניברסיטה שלכם, והאתר יסדר את החומר לפי הקורסים והסמסטרים של התוכנית שלה."
          : "Pick your university and the site arranges its material by that program's courses and semesters."}
      </p>

      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-4 mb-8 flex flex-wrap items-center gap-x-6 gap-y-2">
        <Suspense fallback={null}><UniversityPicker current={uni.slug} lang={lang} /></Suspense>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {he ? uni.programHe : uni.programEn}
          {uni.sourceUrl && (
            <> · <a href={uni.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-700 dark:text-emerald-400 hover:underline">{he ? "המקור הרשמי" : "Official source"} ↗</a></>
          )}
        </p>
        {!isGeneral && (
          <p className="w-full text-xs text-zinc-400">
            {he
              ? "מופיעים רק קורסי הביולוגיה (מתמטיקה, כימיה ופיזיקה לא מכוסים באתר). החומר בכל קורס מותאם לפי שם הקורס ותיאורו; כדאי לבדוק מול הסילבוס של המרצה."
              : "Only biology courses are shown (math, chemistry and physics aren't covered). Each course's material is matched by its title and description; check it against your lecturer's syllabus."}
          </p>
        )}
      </div>

      {courses.length === 0 && (
        <p className="text-zinc-500 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-600 p-6">
          {he ? "עדיין אין מסלול לאוניברסיטה הזו." : "No track for this university yet."}
        </p>
      )}

      {([1, 2, 3, 4] as const).map((year) => {
        const inYear = courses.filter((c) => c.year === year);
        if (inYear.length === 0) return null;
        const sems = SEMESTERS.filter((s) => inYear.some((c) => c.semester === s));
        return (
          <section key={year} className="mb-10">
            <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-4">{YEAR_LABEL[L][year]}</h2>
            <div className={`grid gap-6 ${sems.length > 1 ? "md:grid-cols-2" : ""}`}>
              {sems.map((sem) => (
                <div key={sem} className={sem === "Y" && sems.length === 3 ? "md:col-span-2" : ""}>
                  <h3 className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-2">{SEMESTER_LABEL[L][sem]}</h3>
                  <ul className="space-y-3">
                    {inYear.filter((c) => c.semester === sem).map((c) => {
                      const count = planUnitCount(c.slug) ?? c.units.length;
                      const empty = count === 0;
                      return (
                        <li key={c.slug}>
                          <Link
                            href={`/${lang}/courses/${c.slug}`}
                            className={`block rounded-xl border p-4 transition-colors ${empty
                              ? "border-dashed border-zinc-300 dark:border-zinc-600 bg-transparent hover:border-zinc-400"
                              : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-emerald-400 dark:hover:border-emerald-600"}`}
                          >
                            <span className="flex items-start gap-2">
                              <span className={`font-semibold flex-1 ${empty ? "text-zinc-500 dark:text-zinc-400" : "text-zinc-900 dark:text-zinc-50"}`}>{he ? c.nameHe : c.nameEn}</span>
                              {c.kind !== "required" && (
                                <span className="shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300">
                                  {COURSE_KIND_LABEL[L][c.kind]}
                                </span>
                              )}
                            </span>
                            <span className="block mt-1 text-sm text-zinc-500 dark:text-zinc-400">{he ? c.descHe : c.descEn}</span>
                            <span className="block mt-2 text-xs text-zinc-400">
                              {empty
                                ? (he ? "החומר לקורס הזה עוד בכתיבה" : "Material for this course is still being written")
                                : `${count} ${he ? "יחידות לימוד" : "units"}`}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
