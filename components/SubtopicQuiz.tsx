"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const QuizPanel = dynamic(() => import("./QuizPanel"), { ssr: false });

export default function SubtopicQuiz({
  subtopicId,
  lang,
  questionCount,
}: {
  subtopicId: string;
  lang: string;
  questionCount: number;
}) {
  const [open, setOpen] = useState(false);
  const isHe = lang === "he";

  if (questionCount === 0) return null;

  return (
    <div>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-800/40 transition-colors"
        >
          <span>🎓</span>
          {isHe ? `מבחן רשמי (${questionCount} שאלות)` : `Official quiz (${questionCount} questions)`}
        </button>
      ) : (
        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/20 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-emerald-100 dark:border-emerald-800/50">
            <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
              {isHe ? "🎓 מבחן רשמי" : "🎓 Official Quiz"}
            </p>
            <button
              onClick={() => setOpen(false)}
              className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            >
              {isHe ? "סגור" : "Close"}
            </button>
          </div>
          <div className="p-4">
            <QuizPanel subtopicId={subtopicId} lang={lang} />
          </div>
        </div>
      )}
    </div>
  );
}
