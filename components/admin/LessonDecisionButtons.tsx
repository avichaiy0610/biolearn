"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Decision } from "@/lib/lesson-review";

// Decision buttons in admin/lessons: one unit (inline), or every unit of a course at once (label + confirmation).
export default function LessonDecisionButtons({ slugs, decision, bulkLabel }: { slugs: string[]; decision?: Decision; bulkLabel?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  async function set(next: Decision) {
    if (bulkLabel && !window.confirm(`${bulkLabel}? (${slugs.length} יחידות)`)) return;
    setBusy(true);
    setError(false);
    try {
      const res = await fetch("/api/admin/lesson-review", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slugs, decision: next }) });
      if (!res.ok) throw new Error(String(res.status));
      router.refresh();
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  if (bulkLabel) {
    return (
      <span className="inline-flex items-center gap-2">
        <button type="button" disabled={busy || !slugs.length} onClick={() => set("approved")} className="rounded-lg border border-emerald-500 px-3 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 disabled:opacity-50 dark:text-emerald-300 dark:hover:bg-emerald-950/40">
          {bulkLabel}
        </button>
        {error && <span className="text-xs text-red-600">נכשל</span>}
      </span>
    );
  }

  const opt = (d: Decision, label: string) => (
    <button
      key={d}
      type="button"
      disabled={busy}
      aria-pressed={decision === d}
      onClick={() => set(d)}
      className={`rounded-md border px-2 py-0.5 text-xs disabled:opacity-60 ${decision === d ? "border-emerald-500 bg-emerald-50 font-semibold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200" : "border-zinc-200 text-zinc-500 hover:border-zinc-400 dark:border-zinc-700"}`}
    >
      {label}
    </button>
  );
  return (
    <span className="inline-flex flex-wrap items-center gap-1">
      {opt("approved", "מאשר")}
      {opt("changes", "דרוש תיקון")}
      {opt("pending", "לא נבדק")}
      {error && <span className="text-xs text-red-600">נכשל</span>}
    </span>
  );
}
