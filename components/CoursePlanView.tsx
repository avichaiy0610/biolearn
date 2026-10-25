import Link from "next/link";
import type { PlanEntry } from "@/lib/course-plan";
import type { OrderConfidence, OrderSource } from "@/content/course-plans/types";
import { ScopeChip } from "@/components/lesson/ScopeBadge";

type Group = { titleHe: string; n?: number; entries: PlanEntry[] };
export type PlanView = "topics" | "lectures" | "tutorials";

const KIND_HE: Record<PlanEntry["kind"], string> = {
  lesson: "יחידה מלאה",
  section: "סעיף ביחידה",
  problem: "תרגיל פתור",
  reading: "קריאה קצרה",
  animation: "אנימציה",
  soon: "בכתיבה",
};

export const CONFIDENCE_HE: Record<OrderConfidence, string> = {
  official: "רשמי",
  "official-past": "רשמי, משנה קודמת",
  students: "נבדק מול סטודנטים",
  parallel: "לפי קורס מקביל",
  consensus: "לפי הסכמה בין אוניברסיטאות",
  syllabus: "לפי סדר הנושאים בסילבוס",
  textbook: "לפי סדר ספר הקורס",
  suggested: "סדר לימוד מוצע",
};

const NO_TUTORIAL_SOURCE = "סדר התרגולים בקורס לא פורסם, ולא מצאנו לו מקור. התרגילים כאן מסודרים לפי ההרצאות: כל תרגול מתרגל את החומר של ההרצאה באותו מספר.";

const TABS: { id: PlanView; he: string }[] = [
  { id: "topics", he: "לפי נושאים" },
  { id: "lectures", he: "לפי הרצאות" },
  { id: "tutorials", he: "לפי תרגולים" },
];

// The same course material by syllabus topic, by lecture or by tutorial.
export default function CoursePlanView({ lang, courseSlug, view, groups, scheduleNoteHe, suggested, lectureOrder, tutorialOrder }: {
  lang: string; courseSlug: string; view: PlanView; groups: Group[]; scheduleNoteHe: string; suggested: boolean;
  lectureOrder?: OrderSource; tutorialOrder?: OrderSource | null;
}) {
  // Provenance shown above the list; tutorials without a source are labelled per lecture.
  const tutorialsByLecture = view === "tutorials" && tutorialOrder === null;
  const source = view === "lectures" ? lectureOrder : view === "tutorials" ? tutorialOrder ?? undefined : undefined;
  return (
    <section aria-labelledby="plan-title" className="mb-10">
      <h2 id="plan-title" className="sr-only">חומר הקורס</h2>
      <div role="tablist" aria-label="סידור החומר" className="flex gap-1 rounded-xl border border-line bg-surface p-1">
        {TABS.map((t) => (
          <Link key={t.id} role="tab" aria-selected={t.id === view} href={`/${lang}/courses/${courseSlug}?view=${t.id}`} scroll={false}
            className={`flex-1 rounded-lg px-3 py-2 text-center text-sm font-bold transition-colors ${t.id === view ? "bg-brand text-surface" : "text-muted hover:text-ink"}`}>
            {t.he}
          </Link>
        ))}
      </div>
      {source ? (
        <div className="mt-3 rounded-lg border border-amber/40 bg-amber-tint px-3 py-2 text-xs leading-6 text-ink">
          <strong className="text-amber">מקור הסדר: {CONFIDENCE_HE[source.confidence]}.</strong> {source.noteHe}
          {source.links && source.links.length > 0 && (
            <span className="block">
              {source.links.map((l, i) => (
                <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand underline underline-offset-2">{i > 0 ? " · " : ""}{l.labelHe}</a>
              ))}
            </span>
          )}
        </div>
      ) : tutorialsByLecture ? (
        <p className="mt-3 rounded-lg border border-amber/40 bg-amber-tint px-3 py-2 text-xs leading-6 text-ink">
          <strong className="text-amber">מקור הסדר:</strong> {NO_TUTORIAL_SOURCE}
        </p>
      ) : view !== "topics" && suggested && (
        <p className="mt-3 rounded-lg border border-amber/40 bg-amber-tint px-3 py-2 text-xs leading-6 text-ink">
          <strong className="text-amber">מקור הסדר:</strong> {scheduleNoteHe}
        </p>
      )}

      <ol className="mt-5 space-y-4">
        {groups.map((g, gi) => (
          <li key={`${g.titleHe}-${gi}`} className="overflow-hidden rounded-[18px] border border-line bg-surface">
            <div className="flex items-baseline gap-3 border-b border-line bg-surface-2 px-4 py-3">
              <span className="text-xs font-bold text-brand">
                {view === "lectures" ? `הרצאה ${g.n}` : view === "tutorials" ? (tutorialsByLecture ? `תרגול על הרצאה ${g.n}` : `תרגול ${g.n}`) : `נושא ${gi + 1}`}
              </span>
              <h3 className="font-bold">{g.titleHe}</h3>
            </div>
            <ul>
              {g.entries.map((e) => (
                <li key={e.key} className="border-b border-line last:border-b-0">
                  {e.href ? (
                    <Link href={e.href} className="flex items-center gap-3 px-4 py-3 hover:bg-surface-2">
                      <span className="min-w-0 flex-1">
                        <span className="block text-[15px] font-semibold">{e.titleHe}</span>
                        {e.context && <span className="block text-xs text-muted">מתוך: {e.context}</span>}
                      </span>
                      {e.scope && e.scope !== "core" && <ScopeChip level={e.scope} />}
                      {e.draft && <span className="shrink-0 rounded-full bg-amber-tint px-2 py-0.5 text-[11px] font-bold text-amber">טיוטה</span>}
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${e.kind === "lesson" || e.kind === "section" || e.kind === "problem" ? "bg-tint text-brand" : "bg-surface-2 text-muted"}`}>
                        {KIND_HE[e.kind]}
                      </span>
                    </Link>
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-3 text-muted">
                      <span className="flex-1 text-[15px]">{e.titleHe}</span>
                      <span className="shrink-0 rounded-full border border-dashed border-line px-2 py-0.5 text-[11px] font-bold">{KIND_HE.soon}</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
}
