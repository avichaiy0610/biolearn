"use client";

import { useState } from "react";
import type { GapStatus } from "@/lib/question-gaps";

const LABELS: Record<GapStatus, string> = {
  open: "פתוח",
  added: "נוסף ליחידה",
  rejected: "לא צריך",
  outside: "מחוץ לקורס",
};

// Status buttons for one recurring question topic (admin/student-questions).
export default function QuestionGapStatus({ lessonSlug, topicLabel, status: initial }: { lessonSlug: string; topicLabel: string; status: GapStatus }) {
  const [status, setStatus] = useState<GapStatus>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  async function set(next: GapStatus) {
    if (next === status || saving) return;
    setSaving(true);
    setError(false);
    try {
      const res = await fetch("/api/admin/question-gaps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonSlug, topicLabel, status: next }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus(next);
    } catch {
      setError(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {(Object.keys(LABELS) as GapStatus[]).map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => set(s)}
          disabled={saving}
          aria-pressed={status === s}
          className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors disabled:opacity-60 ${
            status === s
              ? "border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200"
              : "border-zinc-200 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300"
          }`}
        >
          {LABELS[s]}
        </button>
      ))}
      {error && <span className="text-xs text-red-600">השמירה נכשלה</span>}
    </div>
  );
}
