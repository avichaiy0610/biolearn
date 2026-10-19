"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { TERM_COOKIE, UNIVERSITIES, UNIVERSITY_COOKIE } from "@/content/universities";

const YEARS = [1, 2, 3] as const;
const SEMS = ["A", "B"] as const;
const YEAR_HE: Record<number, string> = { 1: "שנה א'", 2: "שנה ב'", 3: "שנה ג'" };
const SEM_HE = { A: "סמסטר א'", B: "סמסטר ב'" };

const setCookie = (name: string, value: string) => {
  document.cookie = `${name}=${value}; path=/; max-age=31536000; samesite=lax`;
};

// "My track": university + year/semester, saved in cookies so the server
// renders the student's own courses. Opens by itself on a first visit.
export default function TrackPicker({ lang, uni, year, semester, openInitially = false }: {
  lang: string; uni: string; year: number; semester: "A" | "B"; openInitially?: boolean;
}) {
  const he = lang === "he";
  const router = useRouter();
  const [open, setOpen] = useState(openInitially);
  const [u, setU] = useState(uni);
  const [term, setTerm] = useState(`${year}${semester}`);
  const [pending, start] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("mousedown", onClick); };
  }, [open]);

  function save() {
    setCookie(UNIVERSITY_COOKIE, u);
    setCookie(TERM_COOKIE, term);
    start(() => { router.refresh(); setOpen(false); });
  }

  const field = "h-11 w-full rounded-lg border border-line bg-surface px-3 text-sm font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-brand";
  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open}
        className="inline-flex items-center gap-2 min-h-11 px-4 rounded-lg border border-line bg-surface text-sm font-semibold text-ink hover:border-brand">
        {he ? "המסלול שלי" : "My track"}
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden className={`transition-transform ${open ? "rotate-180" : ""}`}><path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>
      </button>
      {open && (
        <div role="dialog" aria-label={he ? "בחירת מסלול" : "Choose your track"}
          className="absolute z-30 mt-2 start-0 w-[min(20rem,calc(100vw-2rem))] rounded-xl border border-line bg-surface p-4 shadow-xl space-y-3">
          <label className="block text-xs font-semibold text-muted">
            {he ? "אוניברסיטה" : "University"}
            <select value={u} onChange={(e) => setU(e.target.value)} className={`${field} mt-1`}>
              {UNIVERSITIES.map((x) => <option key={x.slug} value={x.slug}>{he ? x.nameHe : x.nameEn}</option>)}
            </select>
          </label>
          <label className="block text-xs font-semibold text-muted">
            {he ? "איפה אני בתואר" : "Where I am"}
            <select value={term} onChange={(e) => setTerm(e.target.value)} className={`${field} mt-1`}>
              {YEARS.flatMap((y) => SEMS.map((s) => (
                <option key={`${y}${s}`} value={`${y}${s}`}>{he ? `${YEAR_HE[y]}, ${SEM_HE[s]}` : `Year ${y}, semester ${s}`}</option>
              )))}
            </select>
          </label>
          <button type="button" onClick={save} disabled={pending}
            className="w-full h-11 rounded-lg bg-brand text-surface font-bold hover:bg-brand-hover disabled:opacity-60">
            {pending ? (he ? "שומר…" : "Saving…") : (he ? "הצג את הקורסים שלי" : "Show my courses")}
          </button>
        </div>
      )}
    </div>
  );
}
