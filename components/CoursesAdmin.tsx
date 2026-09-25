"use client";

import { useEffect, useMemo, useState } from "react";

type Unit = { kind: "subtopic"; topic: string; id: string } | { kind: "process"; topic: string; slug: string };
type Course = { slug: string; nameHe: string; nameEn: string; year: number; semester: "A" | "B"; descHe: string; descEn: string; units: Unit[] };
type CatalogUnit = Unit & { nameHe: string };
type CatalogTopic = { slug: string; nameHe: string; units: CatalogUnit[] };

const YEARS = [1, 2, 3, 4];
const YEAR_HE: Record<number, string> = { 1: "שנה א'", 2: "שנה ב'", 3: "שנה ג'", 4: "שנה ד'" };
const SEM_HE = { A: "סמסטר א'", B: "סמסטר ב'" } as const;
const unitKey = (u: Unit) => (u.kind === "subtopic" ? `s:${u.topic}:${u.id}` : `p:${u.topic}:${u.slug}`);

export default function CoursesAdmin({ initialCourses, catalog }: { initialCourses: Course[]; catalog: CatalogTopic[] }) {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [newCourse, setNewCourse] = useState({ slug: "", nameHe: "" });

  const unitName = useMemo(() => {
    const m = new Map<string, string>();
    for (const t of catalog) for (const u of t.units) m.set(unitKey(u), `${u.nameHe}${u.kind === "process" ? " 🎬" : ""}`);
    return (u: Unit) => m.get(unitKey(u)) ?? "(יחידה שהוסתרה או נמחקה)";
  }, [catalog]);
  const topicName = useMemo(() => new Map(catalog.map((t) => [t.slug, t.nameHe])), [catalog]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function update(fn: (list: Course[]) => Course[]) {
    setCourses((prev) => fn(prev.map((c) => ({ ...c, units: [...c.units] }))));
    setDirty(true);
    setMsg(null);
  }
  const patch = (slug: string, p: Partial<Course>) => update((l) => l.map((c) => (c.slug === slug ? { ...c, ...p } : c)));

  // Reorder a course within its year/semester group.
  function moveCourse(slug: string, dir: -1 | 1) {
    update((l) => {
      const c = l.find((x) => x.slug === slug)!;
      const group = l.filter((x) => x.year === c.year && x.semester === c.semester);
      const i = group.indexOf(c), j = i + dir;
      if (j < 0 || j >= group.length) return l;
      const a = l.indexOf(group[i]), b = l.indexOf(group[j]);
      [l[a], l[b]] = [l[b], l[a]];
      return l;
    });
  }
  function moveUnit(slug: string, idx: number, dir: -1 | 1) {
    update((l) => l.map((c) => {
      if (c.slug !== slug) return c;
      const j = idx + dir;
      if (j < 0 || j >= c.units.length) return c;
      [c.units[idx], c.units[j]] = [c.units[j], c.units[idx]];
      return c;
    }));
  }
  function transferUnit(from: string, idx: number, to: string) {
    update((l) => {
      const src = l.find((c) => c.slug === from)!;
      const [u] = src.units.splice(idx, 1);
      const dst = l.find((c) => c.slug === to)!;
      if (!dst.units.some((x) => unitKey(x) === unitKey(u))) dst.units.push(u);
      return l;
    });
    setMsg({ ok: true, text: `היחידה הועברה ל"${courses.find((c) => c.slug === to)?.nameHe}". אל תשכחו לשמור.` });
  }
  const removeUnit = (slug: string, idx: number) => update((l) => l.map((c) => (c.slug === slug ? { ...c, units: c.units.filter((_, i) => i !== idx) } : c)));
  function addUnit(slug: string, key: string) {
    const u = catalog.flatMap((t) => t.units).find((x) => unitKey(x) === key);
    if (!u) return;
    const clean: Unit = u.kind === "subtopic" ? { kind: "subtopic", topic: u.topic, id: u.id } : { kind: "process", topic: u.topic, slug: u.slug };
    update((l) => l.map((c) => (c.slug === slug ? { ...c, units: [...c.units, clean] } : c)));
  }
  function addCourse() {
    const slug = newCourse.slug.trim().toLowerCase();
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) { setMsg({ ok: false, text: "מזהה: אותיות אנגליות קטנות, ספרות ומקפים (למשל genetics-b)." }); return; }
    if (courses.some((c) => c.slug === slug)) { setMsg({ ok: false, text: "כבר יש קורס עם המזהה הזה." }); return; }
    if (!newCourse.nameHe.trim()) { setMsg({ ok: false, text: "חסר שם לקורס." }); return; }
    update((l) => [...l, { slug, nameHe: newCourse.nameHe.trim(), nameEn: "", year: 1, semester: "A", descHe: "", descEn: "", units: [] }]);
    setNewCourse({ slug: "", nameHe: "" });
    setOpen(slug);
  }

  async function save() {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/courses", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ courses }) });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "השמירה נכשלה.");
      setCourses(body.courses);
      setDirty(false);
      setMsg({ ok: true, text: "נשמר. השינויים כבר מופיעים באתר." });
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : "השמירה נכשלה." });
    }
    setSaving(false);
  }

  const input = "w-full h-9 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 text-sm";
  const small = "text-xs px-2 py-1 rounded-md border border-zinc-200 dark:border-zinc-700 hover:border-emerald-400 disabled:opacity-30";

  return (
    <div className="pb-24">
      {YEARS.map((year) => (["A", "B"] as const).map((sem) => {
        const group = courses.filter((c) => c.year === year && c.semester === sem);
        if (group.length === 0) return null;
        return (
          <section key={`${year}${sem}`} className="mb-6">
            <h2 className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-2">{YEAR_HE[year]} · {SEM_HE[sem]}</h2>
            <ul className="space-y-2">
              {group.map((c, gi) => (
                <li key={c.slug} className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
                  <div className="flex items-center gap-2 p-3 flex-wrap">
                    <button onClick={() => setOpen(open === c.slug ? null : c.slug)} className="flex-1 min-w-40 text-start font-semibold" aria-expanded={open === c.slug}>
                      {open === c.slug ? "▾" : <span className="inline-block rtl:rotate-180">▸</span>} {c.nameHe}
                      <span className="ms-2 text-xs font-normal text-zinc-500">{c.units.length} יחידות</span>
                    </button>
                    <label className="text-xs flex items-center gap-1">שנה
                      <select value={c.year} onChange={(e) => patch(c.slug, { year: Number(e.target.value) })} className="h-8 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs">
                        {YEARS.map((y) => <option key={y} value={y}>{YEAR_HE[y]}</option>)}
                      </select>
                    </label>
                    <label className="text-xs flex items-center gap-1">סמסטר
                      <select value={c.semester} onChange={(e) => patch(c.slug, { semester: e.target.value as "A" | "B" })} className="h-8 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs">
                        <option value="A">{"א'"}</option><option value="B">{"ב'"}</option>
                      </select>
                    </label>
                    <button className={small} disabled={gi === 0} onClick={() => moveCourse(c.slug, -1)} aria-label="הזז למעלה">↑</button>
                    <button className={small} disabled={gi === group.length - 1} onClick={() => moveCourse(c.slug, 1)} aria-label="הזז למטה">↓</button>
                    {confirmDelete === c.slug ? (
                      <span className="flex items-center gap-1 text-xs">
                        <button className="px-2 py-1 rounded-md bg-red-600 text-white" onClick={() => { update((l) => l.filter((x) => x.slug !== c.slug)); setConfirmDelete(null); }}>מחק</button>
                        <button className={small} onClick={() => setConfirmDelete(null)}>ביטול</button>
                      </span>
                    ) : (
                      <button className="text-xs px-2 py-1 text-red-600 hover:underline" onClick={() => setConfirmDelete(c.slug)}>מחק קורס</button>
                    )}
                  </div>

                  {open === c.slug && (
                    <div className="border-t border-zinc-100 dark:border-zinc-700 p-3 space-y-4">
                      <div className="grid gap-2 sm:grid-cols-2">
                        <label className="text-xs">שם בעברית<input className={input} value={c.nameHe} onChange={(e) => patch(c.slug, { nameHe: e.target.value })} /></label>
                        <label className="text-xs">שם באנגלית<input className={input} dir="ltr" value={c.nameEn} onChange={(e) => patch(c.slug, { nameEn: e.target.value })} /></label>
                        <label className="text-xs">תיאור בעברית<input className={input} value={c.descHe} onChange={(e) => patch(c.slug, { descHe: e.target.value })} /></label>
                        <label className="text-xs">תיאור באנגלית<input className={input} dir="ltr" value={c.descEn} onChange={(e) => patch(c.slug, { descEn: e.target.value })} /></label>
                      </div>

                      <ol className="space-y-1.5">
                        {c.units.length === 0 && <li className="text-xs text-zinc-500">אין יחידות עדיין.</li>}
                        {c.units.map((u, i) => (
                          <li key={unitKey(u)} className="flex items-center gap-2 flex-wrap rounded-lg bg-zinc-50 dark:bg-zinc-900 px-2 py-1.5 text-sm">
                            <span className="w-5 text-center text-xs text-zinc-500">{i + 1}</span>
                            <span className="flex-1 min-w-40">{unitName(u)} <span className="text-xs text-zinc-400">· {topicName.get(u.topic)}</span></span>
                            <button className={small} disabled={i === 0} onClick={() => moveUnit(c.slug, i, -1)} aria-label="הזז למעלה">↑</button>
                            <button className={small} disabled={i === c.units.length - 1} onClick={() => moveUnit(c.slug, i, 1)} aria-label="הזז למטה">↓</button>
                            <select value="" onChange={(e) => e.target.value && transferUnit(c.slug, i, e.target.value)} aria-label="העבר לקורס אחר"
                              className="h-7 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs">
                              <option value="">העבר לקורס…</option>
                              {courses.filter((x) => x.slug !== c.slug).map((x) => <option key={x.slug} value={x.slug}>{x.nameHe}</option>)}
                            </select>
                            <button className="text-xs px-1.5 text-red-600" onClick={() => removeUnit(c.slug, i)} aria-label="הסר יחידה">✕</button>
                          </li>
                        ))}
                      </ol>

                      <select value="" onChange={(e) => e.target.value && addUnit(c.slug, e.target.value)} aria-label="הוסף יחידה"
                        className="w-full sm:w-96 h-9 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-zinc-900 text-sm">
                        <option value="">+ הוסף יחידה (תת-נושא או אנימציה)…</option>
                        {catalog.map((t) => {
                          const available = t.units.filter((u) => !c.units.some((x) => unitKey(x) === unitKey(u)));
                          if (available.length === 0) return null;
                          return (
                            <optgroup key={t.slug} label={t.nameHe}>
                              {available.map((u) => <option key={unitKey(u)} value={unitKey(u)}>{u.nameHe}{u.kind === "process" ? " 🎬" : ""}</option>)}
                            </optgroup>
                          );
                        })}
                      </select>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        );
      }))}

      <section className="mt-8 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-600 p-4">
        <h2 className="text-sm font-semibold mb-2">+ קורס חדש</h2>
        <div className="flex gap-2 flex-wrap">
          <input className={`${input} w-48`} dir="ltr" placeholder="מזהה (genetics-b)" value={newCourse.slug} onChange={(e) => setNewCourse({ ...newCourse, slug: e.target.value })} />
          <input className={`${input} w-56`} placeholder="שם הקורס" value={newCourse.nameHe} onChange={(e) => setNewCourse({ ...newCourse, nameHe: e.target.value })} />
          <button onClick={addCourse} className="px-4 h-9 rounded-lg border border-emerald-400 text-emerald-700 dark:text-emerald-300 text-sm">הוסף</button>
        </div>
        <p className="text-xs text-zinc-500 mt-2">{"הקורס יתווסף לשנה א' סמסטר א' — אפשר להעביר אותו אחר כך."}</p>
      </section>

      <div className="fixed bottom-0 inset-x-0 z-40 border-t border-zinc-200 dark:border-zinc-700 bg-white/95 dark:bg-zinc-900/95 backdrop-blur px-4 py-3" style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}>
        <div className="max-w-4xl mx-auto flex items-center gap-3 flex-wrap">
          <button onClick={save} disabled={!dirty || saving} className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold disabled:opacity-40">
            {saving ? "שומר…" : "שמור שינויים"}
          </button>
          {dirty && !msg && <span className="text-xs text-amber-600">יש שינויים שלא נשמרו</span>}
          {msg && <span role="status" className={`text-sm ${msg.ok ? "text-emerald-600" : "text-red-600"}`}>{msg.text}</span>}
        </div>
      </div>
    </div>
  );
}
