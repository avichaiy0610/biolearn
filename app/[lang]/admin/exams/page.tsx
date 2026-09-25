import Link from "next/link";
import PastExamsAdmin from "@/components/PastExamsAdmin";
import { prisma } from "@/lib/prisma";
import { getCourses } from "@/lib/courses-db";

export const dynamic = "force-dynamic";

export default async function AdminExamsPage({ params }: PageProps<"/[lang]/admin/exams">) {
  const { lang } = await params;
  const exams = await prisma.pastExam.findMany({
    select: { id: true, courseSlug: true, year: true, moed: true, university: true, notes: true, fileName: true, fileSize: true, url: true, solutionUrl: true },
    orderBy: [{ courseSlug: "asc" }, { year: "desc" }],
  });
  return (
    <div className="max-w-3xl mx-auto px-4 py-10" dir="rtl">
      <Link href={`/${lang}/admin`} className="text-sm text-zinc-500 hover:text-emerald-600">→ חזרה לניהול</Link>
      <h1 className="text-2xl font-bold mt-3 mb-2">📄 מבחני עבר</h1>
      <p className="text-sm text-zinc-500 mb-6">
        מבחנים שמועלים כאן מוצגים בדף הקורס. יש להעלות רק מבחנים שיש זכות לפרסם.
      </p>
      <PastExamsAdmin initialExams={exams} courses={(await getCourses()).map((c) => ({ slug: c.slug, nameHe: c.nameHe }))} />
    </div>
  );
}
