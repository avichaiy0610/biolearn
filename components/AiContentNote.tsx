"use client";

import { useState } from "react";

// Per-page transparency note: content is AI-assisted, when it was last updated,
// whether a human checked it against a textbook, plus a public error report form.
export default function AiContentNote({
  lang,
  topicSlug,
  processSlug,
  updatedAt,
  reviewed,
}: {
  lang: string;
  topicSlug: string;
  processSlug?: string;
  updatedAt: Date | string | null;
  reviewed: boolean;
}) {
  const he = lang !== "en";
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [website, setWebsite] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const date = updatedAt
    ? new Date(updatedAt).toLocaleDateString(he ? "he-IL" : "en-GB", { day: "numeric", month: "numeric", year: "numeric" })
    : null;

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch("/api/report-error", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicSlug, processSlug, comment, website, page: location.pathname }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error);
      setState("done");
      setComment("");
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : he ? "השליחה נכשלה. נסו שוב." : "Sending failed. Please try again.");
      setState("error");
    }
  }

  return (
    <aside className="mt-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 px-4 py-3 text-xs text-zinc-500 dark:text-zinc-400">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span>🤖 {he ? "נכתב בסיוע AI" : "Written with AI assistance"}</span>
        {date && <span>· {he ? "עודכן לאחרונה:" : "Last updated:"} <bdi>{date}</bdi></span>}
        <span>
          ·{" "}
          {reviewed
            ? he ? "✓ נבדק מול ספר לימוד (Campbell, Alberts)" : "✓ Checked against a textbook (Campbell, Alberts)"
            : he ? "חלק מהתוכן טרם נבדק מול ספר לימוד" : "Parts of this content have not yet been textbook-checked"}
        </span>
        <button
          onClick={() => { setOpen((v) => !v); setState("idle"); }}
          className="ms-auto inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-300 hover:border-amber-400 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
        >
          ⚠️ {he ? "דווח על טעות" : "Report an error"}
        </button>
      </div>

      {open && (
        state === "done" ? (
          <p className="mt-3 text-emerald-600 dark:text-emerald-400">✓ {he ? "תודה! הדיווח נשלח לצוות." : "Thanks! Your report was sent."}</p>
        ) : (
          <form onSubmit={send} className="mt-3 flex flex-col gap-2">
            <label htmlFor="report-comment" className="text-zinc-600 dark:text-zinc-300">
              {he ? "מה לא מדויק? (אפשר לציין את המשפט ואת התיקון המוצע)" : "What is inaccurate? (quote the sentence and the suggested fix)"}
            </label>
            <textarea
              id="report-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              maxLength={1500}
              required
              className="w-full p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            {/* honeypot */}
            <input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} className="hidden" aria-hidden />
            <div className="flex items-center gap-2">
              <button type="submit" disabled={state === "sending" || comment.trim().length < 5}
                className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium disabled:opacity-50">
                {state === "sending" ? (he ? "שולח..." : "Sending…") : he ? "שלח דיווח" : "Send report"}
              </button>
              {state === "error" && <span role="alert" className="text-red-600 dark:text-red-400">{error}</span>}
            </div>
          </form>
        )
      )}
    </aside>
  );
}
