export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale } from "@/lib/dictionaries";
import { questionGroups, needsMaterial, type QuestionGroup } from "@/lib/question-gaps";
import QuestionGapStatus from "@/components/admin/QuestionGapStatus";

const TABS = {
  gaps: { label: "חסר ביחידה", hint: "נושאים שהיחידה לא עונה עליהם (או רק חלקית) ועוד לא טופלו — מועמדים להוספה מספר הקורס.", pick: needsMaterial },
  outside: { label: "מחוץ ליחידה", hint: "שאלות שהסווג כלא שייכות ליחידה. כדאי לעבור — לפעמים זה סימן שהנושא שייך ליחידה אחרת בקורס.", pick: (g: QuestionGroup) => g.coverage === "outside" },
  covered: { label: "מכוסה", hint: "היחידה כבר עונה. נושא שחוזר הרבה כאן אולי כתוב לא מספיק ברור.", pick: (g: QuestionGroup) => g.coverage === "covered" },
  handled: { label: "טופל", hint: "נושאים שסומנו כנוסף / לא צריך / מחוץ לקורס.", pick: (g: QuestionGroup) => g.status !== "open" },
  all: { label: "הכול", hint: "", pick: () => true },
} as const;
type Tab = keyof typeof TABS;

const COVERAGE_HE: Record<string, string> = { covered: "מכוסה", partial: "חלקי", gap: "חסר", outside: "מחוץ ליחידה", unknown: "לא סווג" };

export default async function StudentQuestionsPage({ params, searchParams }: PageProps<"/[lang]/admin/student-questions">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const sp = await searchParams;
  const tab: Tab = typeof sp.tab === "string" && sp.tab in TABS ? (sp.tab as Tab) : "gaps";

  const all = await questionGroups();
  const shown = all.filter(TABS[tab].pick);
  const total = all.reduce((n, g) => n + g.count, 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10" dir="rtl">
      <h1 className="mb-1 text-3xl font-bold text-zinc-900 dark:text-zinc-50">שאלות סטודנטים</h1>
      <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
        {total} שאלות מהצ&apos;אט שביחידות, מקובצות לפי נושא. חומר חסר נוסף ליחידה מספר הקורס (Claude כותב, Codex בודק, אתה מאשר) — לא אוטומטית.
        רשימה לעבודה: <code dir="ltr" className="text-xs">npx tsx scripts/question-gaps.ts</code>
      </p>

      <nav className="mb-2 flex flex-wrap gap-2">
        {(Object.keys(TABS) as Tab[]).map((t) => (
          <Link
            key={t}
            href={`/${lang}/admin/student-questions?tab=${t}`}
            className={`rounded-xl border px-3 py-1.5 text-sm ${
              t === tab ? "border-emerald-500 bg-emerald-50 font-semibold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200" : "border-zinc-200 text-zinc-600 dark:border-zinc-700 dark:text-zinc-300"
            }`}
          >
            {TABS[t].label} ({all.filter(TABS[t].pick).length})
          </Link>
        ))}
      </nav>
      {TABS[tab].hint && <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">{TABS[tab].hint}</p>}

      {shown.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-zinc-500 dark:border-zinc-700">אין כרגע נושאים כאן.</p>
      ) : (
        <ul className="space-y-3">
          {shown.map((g) => (
            <li key={`${g.lessonSlug}/${g.topicLabel}`} className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <span className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{g.topicLabel}</span>
                  <span className="ms-2 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">{g.count} שאלות</span>
                </div>
                <span className="text-xs text-zinc-500">{g.lastAsked.toLocaleDateString("he-IL")}</span>
              </div>
              <p className="mb-2 text-sm text-zinc-600 dark:text-zinc-300">
                <Link href={`/${lang}/learn/${g.lessonSlug}${g.sections[0] ? `#${g.sections[0]}` : ""}`} className="font-medium text-emerald-700 hover:underline dark:text-emerald-400">
                  {g.lessonTitle}
                </Link>
                {g.courseName && <span className="text-zinc-500"> · {g.courseName}</span>}
                <span className="text-zinc-500">
                  {" · "}
                  {Object.entries(g.coverageCounts).map(([c, n]) => `${COVERAGE_HE[c] ?? c} ${n}`).join(", ")}
                </span>
              </p>
              <ul className="mb-3 list-disc space-y-1 ps-5 text-sm text-zinc-700 dark:text-zinc-300">
                {g.samples.map((q, i) => <li key={i}>{q.length > 220 ? `${q.slice(0, 220)}…` : q}</li>)}
              </ul>
              {g.topicLabel !== "לא סווג" && <QuestionGapStatus lessonSlug={g.lessonSlug} topicLabel={g.topicLabel} status={g.status} />}
              {g.note && <p className="mt-2 text-xs text-zinc-500">הערה: {g.note}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
