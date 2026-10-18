import Link from "next/link";
import CoursesAdmin from "@/components/CoursesAdmin";
import { getCourses, courseCatalog } from "@/lib/courses-db";
import { GENERAL_UNIVERSITY, UNIVERSITIES, universityBySlug } from "@/content/universities";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage({ params, searchParams }: PageProps<"/[lang]/admin/courses">) {
  const { lang } = await params;
  const raw = (await searchParams).uni;
  const uni = universityBySlug(Array.isArray(raw) ? raw[0] : raw) ?? universityBySlug(GENERAL_UNIVERSITY)!;
  const [courses, catalog] = await Promise.all([getCourses(uni.slug), courseCatalog()]);
  return (
    <div className="max-w-4xl mx-auto px-4 py-10" dir="rtl">
      <Link href={`/${lang}/admin`} className="text-sm text-zinc-500 hover:text-emerald-600">→ חזרה לניהול</Link>
      <h1 className="text-2xl font-bold mt-3 mb-2">🎓 מסלול הקורסים</h1>
      <p className="text-sm text-zinc-500 mb-4">
        לכל אוניברסיטה מסלול משלה. העבירו קורסים בין שנים וסמסטרים, שנו את סדר היחידות, העבירו יחידה מקורס לקורס, או הוסיפו קורס חדש. השינויים נשמרים רק בלחיצה על &quot;שמור שינויים&quot;, ורק למסלול שפתוח כרגע.
      </p>
      <nav className="flex flex-wrap gap-2 mb-6" aria-label="בחירת אוניברסיטה">
        {UNIVERSITIES.map((u) => (
          <Link key={u.slug} href={`/${lang}/admin/courses?uni=${u.slug}`}
            aria-current={u.slug === uni.slug ? "page" : undefined}
            className={`px-3 py-1.5 rounded-full text-sm border ${u.slug === uni.slug ? "bg-emerald-600 border-emerald-600 text-white" : "border-zinc-200 dark:border-zinc-700 hover:border-emerald-400"}`}>
            {u.shortHe}
          </Link>
        ))}
      </nav>
      <CoursesAdmin
        key={uni.slug}
        university={uni.slug}
        initialCourses={courses.map((c) => ({ slug: c.slug, nameHe: c.nameHe, nameEn: c.nameEn, year: c.year, semester: c.semester, kind: c.kind, descHe: c.descHe, descEn: c.descEn, units: c.units }))}
        catalog={catalog}
      />
    </div>
  );
}
