"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/hooks/useAdmin";

interface Props {
  topicSlug: string;
  processSlug: string;
  lang?: string;
}

type Mode = "closed" | "note" | "rebuild";

export default function AdminAnimationControls({ topicSlug, processSlug, lang = "he" }: Props) {
  const admin = useAdmin();
  const [mode, setMode]       = useState<Mode>("closed");
  const [text, setText]       = useState("");
  const [state, setState]     = useState<"idle" | "saving" | "done" | "error">("idle");
  const [stepCount, setStepCount] = useState<number | null>(null);
  const router = useRouter();
  const isHe = lang === "he";

  if (!admin) return null;

  function open(m: Mode) {
    setMode(mode === m ? "closed" : m);
    setState("idle");
    setText("");
  }

  async function saveNote() {
    if (!text.trim()) return;
    setState("saving");
    try {
      const res = await fetch("/api/admin/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicSlug, processSlug,
          targetType: "animation",
          comment: text,
        }),
      });
      if (!res.ok) throw new Error();
      setState("done");
      setText("");
      setTimeout(() => { setMode("closed"); setState("idle"); }, 1400);
    } catch {
      setState("error");
    }
  }

  async function rebuild() {
    setState("saving");
    try {
      const res = await fetch(`/api/admin/processes/${processSlug}/regenerate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback: text.trim() || undefined }),
      });
      if (!res.ok) throw new Error();
      const { stepsCreated } = await res.json();
      setStepCount(stepsCreated);
      setState("done");
      setTimeout(() => {
        setMode("closed");
        setState("idle");
        router.refresh();
      }, 1800);
    } catch {
      setState("error");
    }
  }

  return (
    <div className="mt-4 border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-100 dark:border-zinc-700/60">
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 me-1">
          {isHe ? "כלי אדמין" : "Admin"}
        </span>

        <button
          onClick={() => open("note")}
          className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors ${
            mode === "note"
              ? "border-amber-400 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
              : "border-zinc-200 dark:border-zinc-600 text-zinc-500 dark:text-zinc-400 hover:border-amber-300 hover:text-amber-600"
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M7 8h10M7 12h6m-6 4h8M5 4h14a2 2 0 012 2v10a2 2 0 01-2 2H7l-4 4V6a2 2 0 012-2z" />
          </svg>
          {isHe ? "הוסף הערה" : "Add note"}
        </button>

        <button
          onClick={() => open("rebuild")}
          className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors ${
            mode === "rebuild"
              ? "border-violet-400 bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
              : "border-zinc-200 dark:border-zinc-600 text-zinc-500 dark:text-zinc-400 hover:border-violet-300 hover:text-violet-600"
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {isHe ? "צור מחדש" : "Rebuild"}
        </button>
      </div>

      {/* Expanded panel */}
      {mode !== "closed" && (
        <div className="px-4 py-3 space-y-3">
          {state === "done" ? (
            <p className="text-sm text-emerald-600 dark:text-emerald-400 text-center py-2">
              {mode === "rebuild"
                ? (isHe ? `✓ נוצרו ${stepCount} שלבים חדשים — טוען...` : `✓ ${stepCount} new steps created — loading…`)
                : (isHe ? "✓ ההערה נשמרה!" : "✓ Note saved!")}
            </p>
          ) : (
            <>
              <textarea
                autoFocus
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={
                  mode === "rebuild"
                    ? (isHe
                        ? "הוראות לבנייה מחדש (אופציונלי): למשל — \"הוסף 12 שלבים מפורטים, הצג crossing-over\""
                        : "Rebuild instructions (optional): e.g. — \"Add 12 detailed steps, show crossing-over\"")
                    : (isHe ? "מה צריך לשפר באנימציה זו?" : "What needs improvement in this animation?")
                }
                rows={3}
                className="w-full text-sm p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 resize-none focus:outline-none focus:ring-1 focus:ring-violet-400"
              />

              {state === "error" && (
                <p className="text-xs text-red-500">{isHe ? "שגיאה — נסה שוב" : "Error — try again"}</p>
              )}

              <div className="flex items-center gap-2">
                {mode === "rebuild" && (
                  <p className="text-xs text-zinc-400 flex-1">
                    {isHe
                      ? "האנימציה הנוכחית תוחלף. הדף יתרענן אוטומטית."
                      : "Current animation will be replaced. Page will auto-refresh."}
                  </p>
                )}
                <button
                  onClick={mode === "rebuild" ? rebuild : saveNote}
                  disabled={state === "saving" || (mode === "note" && !text.trim())}
                  className={`px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50 transition-colors ${
                    mode === "rebuild"
                      ? "bg-violet-600 hover:bg-violet-700"
                      : "bg-amber-500 hover:bg-amber-600"
                  }`}
                >
                  {state === "saving"
                    ? (isHe ? "מעבד…" : "Processing…")
                    : mode === "rebuild"
                      ? (isHe ? "צור אנימציה חדשה" : "Generate new animation")
                      : (isHe ? "שמור הערה" : "Save note")}
                </button>
                <button
                  onClick={() => { setMode("closed"); setText(""); setState("idle"); }}
                  className="px-3 py-2 rounded-lg text-sm border border-zinc-200 dark:border-zinc-600 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                >
                  {isHe ? "ביטול" : "Cancel"}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
