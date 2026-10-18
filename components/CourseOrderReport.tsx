"use client";

import { useState } from "react";

// "The order is different at our university?" — students correct course plans.
// Reports go to /admin/feedback (ContentFeedback, targetType "course-plan").
export default function CourseOrderReport({ courseSlug, topicSlug }: { courseSlug: string; topicSlug: string }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function send() {
    setState("sending");
    setError("");
    const res = await fetch("/api/report-error", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseSlug, topicSlug, comment: text }),
    }).catch(() => null);
    if (res?.ok) { setState("done"); return; }
    const body = await res?.json().catch(() => ({}));
    setError(body?.error ?? "השליחה נכשלה. נסו שוב.");
    setState("error");
  }

  if (state === "done") return <p className="text-sm font-semibold text-brand">תודה! נבדוק ונעדכן את הסדר.</p>;
  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="text-sm font-semibold text-brand hover:underline">
        הסדר אצלכם שונה? ספרו לנו
      </button>
    );
  }
  return (
    <div className="rounded-xl border border-line bg-surface p-3">
      <label htmlFor="order-report" className="text-sm font-semibold">מה שונה אצלכם? (למשל: &quot;מיפוי נלמד בהרצאה 5&quot;, &quot;הנושא X לא נלמד השנה&quot;)</label>
      <textarea id="order-report" value={text} onChange={(e) => setText(e.target.value)} rows={3} maxLength={1500}
        className="mt-2 w-full rounded-lg border border-line bg-bg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
      <div className="mt-2 flex items-center gap-3">
        <button type="button" onClick={send} disabled={state === "sending" || text.trim().length < 5}
          className="rounded-lg bg-brand px-4 py-2 text-sm font-bold text-surface disabled:opacity-50">
          {state === "sending" ? "שולח…" : "שליחה"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="text-sm text-muted">ביטול</button>
        {error && <span role="alert" className="text-sm text-red-600">{error}</span>}
      </div>
    </div>
  );
}
