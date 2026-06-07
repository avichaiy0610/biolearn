"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { QuizQuestion } from "./QuizGame";

const QuizGame = dynamic(() => import("./QuizGame"), { ssr: false });

type Difficulty = "easy" | "medium" | "hard";

export default function ExamCreator({
  topicSlug,
  topicName,
  subtopicCount,
  lang,
}: {
  topicSlug: string;
  topicName: string;
  subtopicCount: number;
  lang: string;
}) {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
  const [open, setOpen] = useState(false);

  const isHe = lang === "he";

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate-exam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicSlug, difficulty, count }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `שגיאה ${res.status}`);
      setQuestions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
    setLoading(false);
  }

  return (
    <section className="mt-10" dir={isHe ? "rtl" : "ltr"}>
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">
          {isHe ? "📝 מצב מבחן" : "📝 Exam Mode"}
        </h2>
        <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300">
          {isHe ? `${subtopicCount} תתי-נושאים` : `${subtopicCount} subtopics`}
        </span>
      </div>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-5">
        {isHe
          ? `מבחן מקיף על כל הנושא "${topicName}" — שאלות מכסות את כל תתי-הנושאים`
          : `Comprehensive exam on "${topicName}" — questions cover all subtopics`}
      </p>

      {questions ? (
        <div>
          <QuizGame questions={questions} lang={lang} />
          <button
            onClick={() => { setQuestions(null); setOpen(false); }}
            className="mt-4 text-xs text-orange-600 dark:text-orange-400 hover:underline"
          >
            {isHe ? "מבחן חדש" : "New exam"}
          </button>
        </div>
      ) : !open ? (
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors"
        >
          📝 {isHe ? "התחל מבחן" : "Start Exam"}
        </button>
      ) : (
        <div className="rounded-2xl border border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-950/20 p-5">
          {/* Difficulty */}
          <div className="mb-4">
            <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-2">{isHe ? "רמת קושי" : "Difficulty"}</p>
            <div className="flex gap-2">
              {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 py-2 rounded-lg border text-xs font-medium transition-all ${
                    difficulty === d
                      ? d === "easy" ? "border-green-400 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300"
                        : d === "hard" ? "border-red-400 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300"
                        : "border-yellow-400 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300"
                      : "border-zinc-200 dark:border-zinc-600 text-zinc-500 hover:border-zinc-300"
                  }`}
                >
                  {isHe
                    ? d === "easy" ? "קל" : d === "hard" ? "קשה" : "בינוני"
                    : d === "easy" ? "Easy" : d === "hard" ? "Hard" : "Medium"}
                </button>
              ))}
            </div>
          </div>

          {/* Count */}
          <div className="mb-5">
            <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-2">{isHe ? "מספר שאלות" : "# Questions"}</p>
            <div className="flex gap-2">
              {[5, 10, 15, 20].map((n) => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={`flex-1 py-2 rounded-lg border text-xs font-medium transition-all ${
                    count === n
                      ? "border-orange-400 bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300"
                      : "border-zinc-200 dark:border-zinc-600 text-zinc-500 hover:border-zinc-300"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="mb-3 text-xs text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">{error}</p>
          )}

          <div className="flex gap-2">
            <button
              onClick={generate}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 disabled:opacity-50 transition-colors"
            >
              {loading ? (isHe ? "מייצר מבחן... ⏳" : "Generating... ⏳") : (isHe ? `📝 צור מבחן (${count} שאלות)` : `📝 Generate exam (${count} questions)`)}
            </button>
            <button onClick={() => setOpen(false)} className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800">
              {isHe ? "ביטול" : "Cancel"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
