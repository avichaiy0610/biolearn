import type { ScopeEntry, ScopeLevel } from "@/content/course-scope/types";

const LABEL: Record<ScopeLevel, string> = {
  core: "בסילבוס הקורס",
  likely: "כנראה בקורס",
  extension: "הרחבה — לא מאומת לקורס",
};
const STYLE: Record<ScopeLevel, string> = {
  core: "bg-tint text-brand",
  likely: "bg-surface-2 text-ink border border-line",
  extension: "bg-amber-tint text-amber",
};

export function ScopeChip({ level }: { level: ScopeLevel }) {
  return <span className={`inline-block shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${STYLE[level]}`}>{LABEL[level]}</span>;
}

// Under a section heading: how sure we are that this section belongs to the course, and why.
export default function ScopeBadge({ entry, courseHe, fallbackSource }: {
  entry: ScopeEntry; courseHe: string; fallbackSource: { labelHe: string; url: string };
}) {
  const src = entry.source ?? fallbackSource;
  return (
    <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs leading-6 text-muted">
      <ScopeChip level={entry.level} />
      <span>
        {courseHe}: {entry.noteHe}
        {entry.evidence !== "none" && (
          <> · <a href={src.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-brand">{src.labelHe}</a></>
        )}
      </span>
    </p>
  );
}
