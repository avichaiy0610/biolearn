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
    <div className="mt-4">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-700 hover:bg-violet-100 dark:hover:bg-violet-800/40 transition-colors"
        >
          <span>🧩</span>
          {isHe ? `תרגול (${questionCount} שאלות)` : `Practice (${questionCount} questions)`}
        </button>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
              {isHe ? "שאלות תרגול" : "Practice Questions"}
            </span>
            <button
              onClick={() => setOpen(false)}
              className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            >
              {isHe ? "סגור" : "Close"}
            </button>
          </div>
          <QuizPanel subtopicId={subtopicId} lang={lang} />
        </div>
      )}
    </div>
  );
}
