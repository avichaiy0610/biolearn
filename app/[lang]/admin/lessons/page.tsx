export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale } from "@/lib/dictionaries";
import { courseReviews, type ReviewState } from "@/lib/lesson-review";
import LessonDecisionButtons from "@/components/admin/LessonDecisionButtons";

const TABS: Record<"review" | "changes" | "approved" | "published" | "all", { label: string; hint: string; pick: (s: ReviewState) => boolean }> = {
  review: { label: "לבדיקה", hint: "טיוטות שעוד לא סימנת. פתח יחידה, קרא, והשאר הערות לפי סעיף בחלונית שבראש הדף.", pick: (s) => s === "review" },
  changes: { label: "דרוש תיקון", hint: "יחידות שסימנת לתיקון. Claude או Codex עוברים על ההערות הפתוחות ומתקנים בקובץ.", pick: (s) => s === "changes" },
  approved: { label: "אושר — ממתין לפרסום", hint: "אישרת, והיחידה עדיין טיוטה בקוד. Claude או Codex משנים את הסטטוס בקובץ ומפרסמים.", pick: (s) => s === "approved" },
  published: { label: "פורסם", hint: "יחידות שהסטטוס שלהן בקוד הוא published.", pick: (s) => s === "published" },
  all: { label: "הכול", hint: "", pick: () => true },
};
type Tab = keyof typeof TABS;

const STATE_HE: Record<ReviewState, { label: string; cls: string }> = {
  review: { label: "לבדיקה", cls: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200" },
  changes: { label: "דרוש תיקון", cls: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-200" },
  approved: { label: "אושר", cls: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200" },
  published: { label: "פורסם", cls: "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-200" },
};

export default async function LessonsReviewPage({ params, searchParams }: PageProps<"/[lang]/admin/lessons">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const sp = await searchParams;
  const tab: Tab = typeof sp.tab === "string" && sp.tab in TABS ? (sp.tab as Tab) : "review";

  const courses = await courseReviews();
  const all = courses.flatMap((c) => c.lessons);
  const shown = courses
    .map((c) => ({ ...c, lessons: c.lessons.filter((l) => TABS[tab].pick(l.state)) }))
    .filter((c) => c.lessons.length > 0);
  const openTotal = all.reduce((n, l) => n + l.openComments, 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10" dir="rtl">
      <h1 className="mb-1 text-3xl font-bold text-zinc-900 dark:text-zinc-50">יחידות לימוד</h1>
      <p className="mb-6 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
        {all.length} יחידות · {openTotal} הערות פתוחות. היחידות נשמרות בקוד (git); כאן נרשמים האישור וההערות, ו-Claude או Codex מיישמים אותם בקובץ ומפרסמים.
        רשימה לעבודה: <code dir="ltr" className="text-xs">npx tsx scripts/lesson-reviews.ts</code>
      </p>

      <nav className="mb-2 flex flex-wrap gap-2">
        {(Object.keys(TABS) as Tab[]).map((t) => (
          <Link
            key={t}
            href={`/${lang}/admin/lessons?tab=${t}`}
            className={`rounded-xl border px-3 py-1.5 text-sm ${
              t === tab ? "border-emerald-500 bg-emerald-50 font-semibold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200" : "border-zinc-200 text-zinc-600 dark:border-zinc-700 dark:text-zinc-300"
            }`}
          >
            {TABS[t].label} ({all.filter((l) => TABS[t].pick(l.state)).length})
          </Link>
        ))}
      </nav>
      {TABS[tab].hint && <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">{TABS[tab].hint}</p>}

      {shown.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-zinc-500 dark:border-zinc-700">אין כרגע יחידות כאן.</p>
      ) : (
        <div className="space-y-5">
          {shown.map((c) => {
            const pendingDrafts = c.lessons.filter((l) => l.state === "review" || l.state === "changes").map((l) => l.slug);
            return (
              <section key={c.slug} className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    <Link href={`/${lang}/courses/${c.slug}`} className="hover:underline">{c.nameHe}</Link>
                    <span className="ms-2 text-sm font-normal text-zinc-500">{c.lessons.length} יחידות</span>
                  </h2>
                  {pendingDrafts.length > 1 && <LessonDecisionButtons slugs={pendingDrafts} bulkLabel="אשר את כל היחידות האלה" />}
                </div>
                <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {c.lessons.map((l) => (
                    <li key={l.slug} className="flex flex-wrap items-center justify-between gap-2 py-2">
                      <span className="min-w-0">
                        <Link href={`/${lang}/learn/${l.slug}`} className="font-medium text-emerald-700 hover:underline dark:text-emerald-400">{l.titleHe}</Link>
                        <span className={`ms-2 rounded-full px-2 py-0.5 text-xs ${STATE_HE[l.state].cls}`}>{STATE_HE[l.state].label}</span>
                        {l.openComments > 0 && <span className="ms-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">{l.openComments === 1 ? "הערה פתוחה אחת" : `${l.openComments} הערות פתוחות`}</span>}
                        <span className="ms-2 text-xs text-zinc-400">{l.writtenBy} · {l.writtenAt}</span>
                      </span>
                      {l.state !== "published" && <LessonDecisionButtons slugs={[l.slug]} decision={l.decision} />}
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
