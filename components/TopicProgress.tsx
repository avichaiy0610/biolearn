"use client";

import { useEffect, useState, useCallback } from "react";

type ProgressData = {
  visited: string[];
  scores: Record<string, number>;
};

export function useTopicProgress(topicSlug: string) {
  const [data, setData] = useState<ProgressData>({ visited: [], scores: {} });
  const [loaded, setLoaded] = useState(false);

  const reload = useCallback(async () => {
    try {
      const res = await fetch(`/api/progress?topicSlug=${encodeURIComponent(topicSlug)}`);
      if (res.ok) setData(await res.json());
    } catch { /* guest — no progress */ }
    setLoaded(true);
  }, [topicSlug]);

  useEffect(() => { reload(); }, [reload]);

  async function markVisited(subtopicId: string) {
    if (data.visited.includes(subtopicId)) return;
    setData((prev) => ({ ...prev, visited: [...prev.visited, subtopicId] }));
    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "visit", subtopicId }),
    });
  }

  async function saveQuizScore(subtopicId: string, score: number, total: number, correct: number, type = "official") {
    setData((prev) => ({
      ...prev,
      scores: { ...prev.scores, [subtopicId]: Math.max(prev.scores[subtopicId] ?? 0, score) },
    }));
    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "quiz", subtopicId, score, total, correct, type }),
    });
  }

  return { data, loaded, markVisited, saveQuizScore };
}

export function ProgressBar({ visited, total, scores, lang }: {
  visited: number;
  total: number;
  scores: Record<string, number>;
  lang: string;
}) {
  const isHe = lang === "he";
  const pct = total > 0 ? Math.round((visited / total) * 100) : 0;
  const avgScore = Object.values(scores).length > 0
    ? Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length)
    : null;

  if (total === 0) return null;

  return (
    <div className="mb-8 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {isHe ? "ההתקדמות שלך" : "Your Progress"}
        </span>
        <div className="flex items-center gap-3">
          {avgScore !== null && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              avgScore >= 80 ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
              : avgScore >= 60 ? "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300"
              : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
            }`}>
              {isHe ? `ממוצע בחנים: ${avgScore}%` : `Quiz avg: ${avgScore}%`}
            </span>
          )}
          <span className="text-sm text-zinc-500">{visited}/{total} {isHe ? "נושאים" : "subtopics"}</span>
        </div>
      </div>
      <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-700">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${
            pct === 100 ? "bg-emerald-500" : pct >= 50 ? "bg-blue-500" : "bg-violet-400"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {pct === 100 && (
        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1.5">
          {isHe ? "✓ כל תת-הנושאים נלמדו!" : "✓ All subtopics covered!"}
        </p>
      )}
    </div>
  );
}

export function SubtopicBadge({ subtopicId, visited, score }: {
  subtopicId: string;
  visited: boolean;
  score?: number;
}) {
  if (!visited && score === undefined) return null;
  return (
    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium shrink-0 ${
      score !== undefined
        ? score >= 80 ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
          : score >= 60 ? "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 dark:text-yellow-300"
          : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
        : "bg-zinc-100 dark:bg-zinc-700 text-zinc-400"
    }`}>
      {score !== undefined ? `${score}%` : "✓"}
    </span>
  );
}
