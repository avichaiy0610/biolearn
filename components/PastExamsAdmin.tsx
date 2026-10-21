"use client";

import { useState } from "react";

export type Exam = {
  id: string; courseSlug: string; year: number; moed: string; university: string | null;
  notes: string | null; fileName: string | null; fileSize: number | null; url: string | null; solutionUrl: string | null;
  status: string; uploaderEmail: string | null;
};

const STATUS_LABEL: Record<string, string> = { pending: "ממתין לאישור", approved: "מפורסם", rejected: "נדחה" };

const MOEDS = ["א", "ב", "ג", "מיוחד"];

export default function PastExamsAdmin({ initialExams, courses }: { initialExams: Exam[]; courses: { slug: string; nameHe: string }[] }) {
  const [exams, setExams] = useState<Exam[]>(initialExams);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function refresh() {
    const res = await fetch("/api/admin/past-exams");
    if (res.ok) setExams((await res.json()).exams);
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setSaving(true);
    setMsg(null);
    const res = await fetch("/api/admin/past-exams", { method: "POST", body: new FormData(form) });
    const body = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) { setMsg({ ok: false, text: body.error ?? "השמירה נכשלה." }); return; }
    form.reset();
    setMsg({ ok: true, text: "המבחן נוסף." });
    refresh();
  }

  async function remove(id: string) {
    if (!confirm("למחוק את המבחן לצמיתות?")) return;
    await fetch(`/api/admin/past-exams/${id}`, { method: "DELETE" });
    refresh();
  }

  async function setStatus(id: string, status: "approved" | "rejected" | "pending") {
    await fetch(`/api/admin/past-exams/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    refresh();
  }

  const pending = exams.filter((x) => x.status === "pending");
  const others = exams.filter((x) => x.status !== "pending");
  const row = (x: Exam, review: boolean) => (
    <li key={x.id} className="flex items-center gap-3 p-3 text-sm flex-wrap">
      <span className="font-medium">{courseName(x.courseSlug)}</span>
      <span>{x.year} · {x.moed === "מיוחד" ? "מועד מיוחד" : `מועד ${x.moed}'`}</span>
      {x.university && <span className="text-zinc-500">{x.university}</span>}
      {x.notes && <span className="text-xs text-zinc-500">{x.notes}</span>}
      {x.uploaderEmail && <span className="text-xs text-zinc-500">הועלה ע"י {x.uploaderEmail}</span>}
      {!review && <span className={`text-xs rounded-full px-2 py-0.5 ${x.status === "approved" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{STATUS_LABEL[x.status] ?? x.status}</span>}
      {x.fileName && <a className="text-emerald-700 underline" href={`/api/past-exams/${x.id}`} target="_blank" rel="noreferrer">PDF</a>}
      {x.url && <a className="text-emerald-700 underline" href={x.url} target="_blank" rel="noreferrer">קישור</a>}
      {x.solutionUrl && <a className="text-emerald-700 underline" href={x.solutionUrl} target="_blank" rel="noreferrer">פתרון</a>}
      <span className="ms-auto flex gap-3">
        {x.status !== "approved" && <button onClick={() => setStatus(x.id, "approved")} className="text-emerald-700 font-medium hover:underline">אשר ופרסם</button>}
        {x.status === "pending" && <button onClick={() => setStatus(x.id, "rejected")} className="text-amber-700 hover:underline">דחה</button>}
        {x.status === "approved" && <button onClick={() => setStatus(x.id, "rejected")} className="text-amber-700 hover:underline">הסתר</button>}
        <button onClick={() => remove(x.id)} className="text-red-600 hover:underline">מחק</button>
      </span>
    </li>
  );

  const field = "w-full h-10 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm";
  const courseName = (slug: string) => courses.find((c) => c.slug === slug)?.nameHe ?? slug;

  return (
    <div className="space-y-8">
      <form onSubmit={submit} className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-5 grid gap-4 sm:grid-cols-2">
        <label className="text-sm">קורס
          <select name="courseSlug" required className={field}>
            {courses.map((c) => <option key={c.slug} value={c.slug}>{c.nameHe}</option>)}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm">שנה
            <input name="year" type="number" min={1990} max={2100} required defaultValue={new Date().getFullYear() - 1} className={field} />
          </label>
          <label className="text-sm">מועד
            <select name="moed" required className={field}>
              {MOEDS.map((m) => <option key={m} value={m}>{m === "מיוחד" ? "מיוחד" : `מועד ${m}'`}</option>)}
            </select>
          </label>
        </div>
        <label className="text-sm">מוסד (לא חובה)
          <input name="university" maxLength={80} className={field} placeholder="למשל: אוניברסיטת תל אביב" />
        </label>
        <label className="text-sm">הערות (לא חובה)
          <input name="notes" maxLength={300} className={field} placeholder="למשל: כולל שאלות פתוחות" />
        </label>
        <label className="text-sm">קובץ PDF (עד 4MB)
          <input name="file" type="file" accept="application/pdf" className="block mt-1 text-sm" />
        </label>
        <label className="text-sm">או קישור למבחן (https)
          <input name="url" type="url" className={field} placeholder="https://…" />
        </label>
        <label className="text-sm sm:col-span-2">קישור לפתרון (לא חובה)
          <input name="solutionUrl" type="url" className={field} placeholder="https://…" />
        </label>
        <label className="sm:col-span-2 flex items-start gap-2 text-sm">
          <input name="rights" type="checkbox" required className="mt-1 accent-emerald-600" />
          <span>אני מאשר/ת שיש לנו זכות לפרסם את המבחן הזה (למשל: פורסם בפומבי על ידי הקורס, או באישור המרצה).</span>
        </label>
        <div className="sm:col-span-2 flex items-center gap-3">
          <button disabled={saving} className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium disabled:opacity-50">
            {saving ? "שומר…" : "הוסף מבחן"}
          </button>
          {msg && <span role="status" className={`text-sm ${msg.ok ? "text-emerald-600" : "text-red-600"}`}>{msg.text}</span>}
        </div>
      </form>

      {pending.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-1">ממתינים לאישור ({pending.length})</h2>
          <p className="text-sm text-zinc-500 mb-3">מבחנים שסטודנטים העלו. הם לא מוצגים באתר עד שמאשרים אותם — כדאי לפתוח את הקובץ ולבדוק שזה מבחן של הקורס ושמותר לפרסם אותו.</p>
          <ul className="divide-y divide-zinc-100 dark:divide-zinc-700 rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-zinc-800">
            {pending.map((x) => row(x, true))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="text-lg font-semibold mb-3">מבחנים קיימים ({others.length})</h2>
        {others.length === 0 ? (
          <p className="text-sm text-zinc-500">עדיין לא הועלו מבחנים.</p>
        ) : (
          <ul className="divide-y divide-zinc-100 dark:divide-zinc-700 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
            {others.map((x) => row(x, false))}
          </ul>
        )}
      </section>
    </div>
  );
}
