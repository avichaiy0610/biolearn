import Link from "next/link";
import CoursesAdmin from "@/components/CoursesAdmin";
import { getCourses, courseCatalog } from "@/lib/courses-db";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage({ params }: PageProps<"/[lang]/admin/courses">) {
  const { lang } = await params;
  const [courses, catalog] = await Promise.all([getCourses(), courseCatalog()]);
  return (
    <div className="max-w-4xl mx-auto px-4 py-10" dir="rtl">
      <Link href={`/${lang}/admin`} className="text-sm text-zinc-500 hover:text-emerald-600">→ חזרה לניהול</Link>
      <h1 className="text-2xl font-bold mt-3 mb-2">🎓 מסלול הקורסים</h1>
      <p className="text-sm text-zinc-500 mb-6">
        העבירו קורסים בין שנים וסמסטרים, שנו את סדר היחידות, העבירו יחידה מקורס לקורס, או הוסיפו קורס חדש. השינויים נשמרים רק בלחיצה על &quot;שמור שינויים&quot;.
      </p>
      <CoursesAdmin
        initialCourses={courses.map((c) => ({ slug: c.slug, nameHe: c.nameHe, nameEn: c.nameEn, year: c.year, semester: c.semester, descHe: c.descHe, descEn: c.descEn, units: c.units }))}
        catalog={catalog}
      />
    </div>
  );
}
