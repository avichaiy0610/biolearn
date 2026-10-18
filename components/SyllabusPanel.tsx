import type { SyllabusRecord } from "@/content/syllabi/types";

const SOURCE_HE: Record<SyllabusRecord["source"], string> = {
  "huji-api": "שנתון האוניברסיטה העברית",
  "tau-ims": "מערכת הסילבוסים של אוניברסיטת תל אביב",
  "technion-portal": "פורטל הסטודנטים של הטכניון",
  "biu-pdf": "סילבוס הפקולטה למדעי החיים, בר-אילן",
  "bgu-catalog": "שנתון הקורסים של אוניברסיטת בן-גוריון",
  "haifa-pdf": "סילבוס החוג לביולוגיה, אוניברסיטת חיפה",
};

const fmtDate = (s?: string) => {
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? s : d.toLocaleDateString("he-IL", { day: "numeric", month: "numeric", year: "numeric" });
};

// The course's official syllabus, as pulled from the university's public source.
export default function SyllabusPanel({ s, children }: { s: SyllabusRecord; children?: React.ReactNode }) {
  const updated = fmtDate(s.updatedHe);
  return (
    <section aria-labelledby="syllabus-title" className="mb-8 rounded-[18px] border border-line bg-surface">
      <details>
        <summary className="flex cursor-pointer flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3">
          <h2 id="syllabus-title" className="text-base font-bold">הסילבוס הרשמי</h2>
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${s.level === "lectures" ? "bg-tint text-brand" : "bg-surface-2 text-muted"}`}>
            {s.level === "lectures" ? "מפורט לפי הרצאות" : "רשימת נושאים, בלי חלוקה לשבועות"}
          </span>
          <span className="text-xs text-muted">
            {SOURCE_HE[s.source]}
            {s.year ? ` · שנה ${s.year}` : ""}
            {updated ? ` · עודכן ${updated}` : ""}
            {` · נבדק ${fmtDate(s.fetchedAt)}`}
          </span>
        </summary>
        <div className="border-t border-line px-4 py-4 text-sm leading-7">
          {s.sessions?.length ? (
            <ol className="space-y-3">
              {s.sessions.map((x) => (
                <li key={x.lectures}>
                  <p className="font-bold text-brand">הרצאות {x.lectures}</p>
                  <ul className="mt-1 list-disc ps-5">{x.topicsHe.map((t, i) => <li key={i}><bdi>{t}</bdi></li>)}</ul>
                </li>
              ))}
            </ol>
          ) : (
            <ul className="list-disc space-y-1 ps-5">{s.topicsHe.map((t, i) => <li key={i}><bdi>{t}</bdi></li>)}</ul>
          )}
          {s.notTaughtHe?.length ? (
            <div className="mt-4 rounded-lg bg-amber-tint px-3 py-2">
              <p className="font-bold text-amber">לא נלמד השנה, לפי הסילבוס</p>
              <ul className="mt-1 list-disc ps-5">{s.notTaughtHe.map((t, i) => <li key={i}><bdi>{t}</bdi></li>)}</ul>
            </div>
          ) : null}
          {s.books?.length ? (
            <p className="mt-3 text-xs text-muted">ספרי הקורס: <bdi dir="ltr">{s.books.slice(0, 3).join(" · ")}</bdi></p>
          ) : null}
          <p className="mt-3 text-xs text-muted">
            <a href={s.sourceUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand hover:underline">למקור הרשמי ↗</a>
            {" · "}החומר באתר מותאם לרשימה הזו; סדר השיעורים בפועל נקבע ע&quot;י המרצה.
          </p>
          {children && <div className="mt-3">{children}</div>}
        </div>
      </details>
    </section>
  );
}
