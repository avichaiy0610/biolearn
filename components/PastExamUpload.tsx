"use client";

import { useState } from "react";
import Link from "next/link";

const MOEDS = ["א", "ב", "ג", "מיוחד"];

// Student upload on the course page. The exam waits for an admin to approve it before it is shown.
export default function PastExamUpload({ courseSlug, lang, loggedIn }: { courseSlug: string; lang: string; loggedIn: boolean }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const he = lang === "he";

  if (!loggedIn) {
    return (
      <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
        {he ? "יש לך מבחן עבר של הקורס? " : "Have a past exam of this course? "}
        <Link href={`/${lang}/auth/login`} className="text-emerald-700 dark:text-emerald-400 hover:underline">{he ? "התחבר/י כדי לשתף אותו" : "Sign in to share it"}</Link>
      </p>
    );
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setSaving(true);
    setMsg(null);
    const res = await fetch("/api/past-exams", { method: "POST", body: new FormData(form) });
    const body = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) { setMsg({ ok: false, text: body.error ?? (he ? "ההעלאה נכשלה." : "Upload failed.") }); return; }
    form.reset();
    setMsg({ ok: true, text: he ? "תודה! המבחן התקבל ויופיע כאן אחרי אישור של מנהל האתר." : "Thanks! The exam will appear here after an admin approves it." });
  }

  const field = "w-full h-10 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm";

  return (
    <div className="mt-3">
      {!open ? (
        <button onClick={() => setOpen(true)} className="text-sm text-emerald-700 dark:text-emerald-400 hover:underline">
          {he ? "+ שיתוף מבחן עבר" : "+ Share a past exam"}
        </button>
      ) : (
        <form onSubmit={submit} className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-4 grid gap-3 sm:grid-cols-2">
          <input type="hidden" name="courseSlug" value={courseSlug} />
          <label className="text-sm">{he ? "שנה" : "Year"}
            <input name="year" type="number" min={1990} max={2100} required defaultValue={new Date().getFullYear() - 1} className={field} />
          </label>
          <label className="text-sm">{he ? "מועד" : "Moed"}
            <select name="moed" required className={field}>
              {MOEDS.map((m) => <option key={m} value={m}>{m === "מיוחד" ? (he ? "מיוחד" : "Special") : he ? `מועד ${m}'` : `Moed ${m}`}</option>)}
            </select>
          </label>
          <label className="text-sm">{he ? "קובץ PDF (עד 4MB)" : "PDF file (up to 4MB)"}
            <input name="file" type="file" accept="application/pdf" className="block mt-1 text-sm max-w-full" />
          </label>
          <label className="text-sm">{he ? "או קישור למבחן (https)" : "Or a link to the exam (https)"}
            <input name="url" type="url" className={field} placeholder="https://…" />
          </label>
          <label className="text-sm">{he ? "קישור לפתרון (לא חובה)" : "Solution link (optional)"}
            <input name="solutionUrl" type="url" className={field} placeholder="https://…" />
          </label>
          <label className="text-sm">{he ? "הערות (לא חובה)" : "Notes (optional)"}
            <input name="notes" maxLength={300} className={field} placeholder={he ? "למשל: שם המרצה, כולל פתרון" : "e.g. lecturer, includes solution"} />
          </label>
          <label className="sm:col-span-2 flex items-start gap-2 text-sm">
            <input name="rights" type="checkbox" required className="mt-1 accent-emerald-600" />
            <span>{he
              ? "אני מאשר/ת שמותר לשתף את המבחן (למשל: הקורס פרסם אותו לסטודנטים), ושהוא יוצג באתר רק אחרי בדיקה ואישור של מנהל האתר."
              : "I confirm the exam may be shared (e.g. the course released it to students), and that it will be shown only after an admin reviews and approves it."}</span>
          </label>
          <div className="sm:col-span-2 flex items-center gap-3 flex-wrap">
            <button disabled={saving} className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium disabled:opacity-50">
              {saving ? (he ? "מעלה…" : "Uploading…") : he ? "שליחה לאישור" : "Submit for review"}
            </button>
            <button type="button" onClick={() => { setOpen(false); setMsg(null); }} className="text-sm text-zinc-500 hover:underline">{he ? "ביטול" : "Cancel"}</button>
            {msg && <span role="status" className={`text-sm ${msg.ok ? "text-emerald-600" : "text-red-600"}`}>{msg.text}</span>}
          </div>
        </form>
      )}
    </div>
  );
}
