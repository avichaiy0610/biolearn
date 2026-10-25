"use client";

import { useState } from "react";
import type { Decision, ReviewComment } from "@/lib/lesson-review";

const DECISION_HE: Record<Decision, string> = { pending: "ממתין לבדיקה", approved: "מאושר", changes: "דרוש תיקון" };

// Shown only to the admin, at the top of a unit page: approve / ask for changes, and comments per section.
// The unit itself is a file in git — approval and comments are applied to it by Claude/Codex.
export default function LessonReviewPanel({ lessonSlug, published, sections, initial }: {
  lessonSlug: string;
  published: boolean;
  sections: { id: string; title: string }[];
  initial: { decision: Decision; comments: ReviewComment[] };
}) {
  const [decision, setDecision] = useState<Decision>(initial.decision);
  const [comments, setComments] = useState<ReviewComment[]>(initial.comments);
  const [section, setSection] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const title = (id: string | null) => (id ? sections.find((s) => s.id === id)?.title ?? id : "כל היחידה");
  const open = comments.filter((c) => c.status === "open").length;

  async function call(url: string, method: string, payload: object) {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error(String(res.status));
      return await res.json();
    } catch {
      setError("השמירה נכשלה — נסה שוב");
      return null;
    } finally {
      setBusy(false);
    }
  }

  async function decide(next: Decision) {
    if (next === decision) return;
    if (await call("/api/admin/lesson-review", "POST", { slugs: [lessonSlug], decision: next })) setDecision(next);
  }
  async function add() {
    if (!body.trim()) return;
    const c = await call("/api/admin/lesson-comments", "POST", { lessonSlug, sectionId: section || null, body });
    if (c) {
      setComments([c as ReviewComment, ...comments]);
      setBody("");
    }
  }
  async function setStatus(id: string, status: "open" | "done") {
    if (await call("/api/admin/lesson-comments", "PATCH", { id, status })) setComments(comments.map((c) => (c.id === id ? { ...c, status } : c)));
  }
  async function remove(id: string) {
    if (!window.confirm("למחוק את ההערה?")) return;
    if (await call("/api/admin/lesson-comments", "PATCH", { id, remove: true })) setComments(comments.filter((c) => c.id !== id));
  }

  const btn = (active: boolean) =>
    `rounded-lg border px-3 py-1.5 text-sm font-semibold transition-colors disabled:opacity-60 ${active ? "border-brand bg-brand text-surface" : "border-line text-muted hover:border-brand hover:text-ink"}`;

  return (
    <details open={!published} className="mt-5 rounded-xl border border-brand/40 bg-surface p-4 text-sm text-ink">
      <summary className="cursor-pointer font-bold">
        בדיקת היחידה (רק למנהל) · {published ? "פורסמה" : DECISION_HE[decision]}
        {open > 0 && <span className="ms-2 rounded-full bg-amber-tint px-2 py-0.5 text-xs text-amber">{open === 1 ? "הערה פתוחה אחת" : `${open} הערות פתוחות`}</span>}
      </summary>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" disabled={busy} onClick={() => decide("approved")} className={btn(decision === "approved")}>מאשר</button>
        <button type="button" disabled={busy} onClick={() => decide("changes")} className={btn(decision === "changes")}>דרוש תיקון</button>
        <button type="button" disabled={busy} onClick={() => decide("pending")} className={btn(decision === "pending")}>עוד לא בדקתי</button>
      </div>
      <p className="mt-2 text-xs leading-5 text-muted">
        {published
          ? "היחידה כבר מפורסמת. הערות חדשות יטופלו בעדכון הבא."
          : decision === "approved"
            ? "מאושר — Claude או Codex יפרסמו את היחידה (שינוי הסטטוס בקובץ ופריסה). עד אז היא נשארת טיוטה באתר."
            : decision === "changes"
              ? "סומן לתיקון — ההערות למטה הן מה שצריך לשנות."
              : "היחידות נשמרות בקוד; האישור וההערות נרשמים כאן ומיושמים בקובץ."}
      </p>

      <div className="mt-4 border-t border-line pt-3">
        <label className="block text-xs font-bold text-muted" htmlFor="review-section">הערה על</label>
        <select id="review-section" value={section} onChange={(e) => setSection(e.target.value)} className="mt-1 w-full rounded-lg border border-line bg-surface px-2 py-1.5 text-sm">
          <option value="">כל היחידה</option>
          {sections.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
        </select>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} maxLength={4000} placeholder="מה לא נכון, מה חסר, מה לא ברור…" className="mt-2 w-full rounded-lg border border-line bg-surface px-2 py-1.5 text-sm leading-6" />
        <button type="button" disabled={busy || !body.trim()} onClick={add} className="mt-2 rounded-lg bg-brand px-3 py-1.5 text-sm font-semibold text-surface disabled:opacity-50">שמור הערה</button>
        {error && <span className="ms-3 text-xs text-red-600">{error}</span>}
      </div>

      {comments.length > 0 && (
        <ul className="mt-4 space-y-2">
          {[...comments].sort((a, b) => (a.status === b.status ? 0 : a.status === "open" ? -1 : 1)).map((c) => (
            <li key={c.id} className={`rounded-lg border border-line p-3 ${c.status === "done" ? "opacity-60" : ""}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs text-muted">
                <span>
                  {c.sectionId ? <a href={`#${c.sectionId}`} className="font-semibold text-brand hover:underline">{title(c.sectionId)}</a> : <span className="font-semibold">כל היחידה</span>}
                  {" · "}{new Date(c.createdAt).toLocaleDateString("he-IL")}
                  {c.status === "done" && " · טופל"}
                </span>
                <span className="flex gap-2">
                  <button type="button" disabled={busy} onClick={() => setStatus(c.id, c.status === "open" ? "done" : "open")} className="hover:text-ink">{c.status === "open" ? "סמן כטופל" : "פתח מחדש"}</button>
                  <button type="button" disabled={busy} onClick={() => remove(c.id)} className="hover:text-red-600">מחק</button>
                </span>
              </div>
              <p className="mt-1 whitespace-pre-wrap leading-6">{c.body}</p>
              {c.reply && <p className="mt-1 whitespace-pre-wrap text-xs leading-5 text-muted">תגובה: {c.reply}</p>}
            </li>
          ))}
        </ul>
      )}
    </details>
  );
}
