"use client";

import { useState, useRef, useEffect } from "react";
import { useAdmin } from "@/hooks/useAdmin";

type TargetType = "animation" | "description" | "diagram";

interface Props {
  topicSlug: string;
  processSlug?: string;
  subtopicId?: string;
  targetType: TargetType;
  lang?: string;
}

const LABEL: Record<TargetType, { he: string; en: string }> = {
  animation:   { he: "אנימציה", en: "animation" },
  description: { he: "תיאור",   en: "description" },
  diagram:     { he: "דיאגרמה", en: "diagram" },
};

export default function FeedbackButton({
  topicSlug, processSlug, subtopicId, targetType, lang = "he",
}: Props) {
  const admin = useAdmin();
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "done" | "error">("idle");
  const ref = useRef<HTMLDivElement>(null);
  const isHe = lang === "he";

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  if (!admin) return null;

  async function submit() {
    if (!comment.trim()) return;
    setState("saving");
    try {
      const res = await fetch("/api/admin/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicSlug, processSlug, subtopicId, targetType, comment }),
      });
      if (!res.ok) throw new Error();
      setState("done");
      setComment("");
      setTimeout(() => { setOpen(false); setState("idle"); }, 1400);
    } catch {
      setState("error");
    }
  }

  const label = LABEL[targetType];

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => { setOpen(!open); setState("idle"); }}
        title={isHe ? `הוסף הערה על ה${label.he}` : `Add note on ${label.en}`}
        className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md text-zinc-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M7 8h10M7 12h6m-6 4h8M5 4h14a2 2 0 012 2v10a2 2 0 01-2 2H7l-4 4V6a2 2 0 012-2z" />
        </svg>
        {isHe ? "הערה" : "Note"}
      </button>

      {open && (
        <div
          className="absolute z-50 w-72 rounded-xl border border-amber-200 dark:border-amber-800 bg-white dark:bg-zinc-900 shadow-2xl p-3 space-y-2"
          style={{ top: "calc(100% + 6px)", left: 0 }}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
              {isHe ? `הערה על ${label.he}` : `Note on ${label.en}`}
            </p>
            <button onClick={() => setOpen(false)} className="text-zinc-400 hover:text-zinc-600 text-xs">✕</button>
          </div>

          {state === "done" ? (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 py-2 text-center">
              ✓ {isHe ? "נשמר!" : "Saved!"}
            </p>
          ) : (
            <>
              <textarea
                autoFocus
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit(); }}
                placeholder={isHe ? "מה צריך לשפר? (Ctrl+Enter לשליחה)" : "What needs improvement? (Ctrl+Enter to send)"}
                rows={3}
                className="w-full text-xs p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 resize-none focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
              <div className="flex gap-2">
                <button
                  onClick={submit}
                  disabled={!comment.trim() || state === "saving"}
                  className="flex-1 px-3 py-1.5 rounded-lg text-xs bg-amber-500 hover:bg-amber-600 text-white disabled:opacity-50 font-medium transition-colors"
                >
                  {state === "saving" ? (isHe ? "שולח..." : "Saving…") : (isHe ? "שלח" : "Send")}
                </button>
                <button
                  onClick={() => { setOpen(false); setComment(""); setState("idle"); }}
                  className="px-3 py-1.5 rounded-lg text-xs border border-zinc-200 dark:border-zinc-600 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                >
                  {isHe ? "ביטול" : "Cancel"}
                </button>
              </div>
              {state === "error" && (
                <p className="text-xs text-red-500">{isHe ? "שגיאה — נסה שוב" : "Error — try again"}</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
