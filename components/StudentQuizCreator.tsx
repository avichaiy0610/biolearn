"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { QuizQuestion } from "./QuizGame";

const QuizGame = dynamic(() => import("./QuizGame"), { ssr: false });

type QuizType = "mixed" | "mcq" | "tf" | "open";
type Difficulty = "easy" | "medium" | "hard";

const TYPE_OPTIONS: { value: QuizType; he: string; en: string; icon: string }[] = [
  { value: "mixed", he: "מעורב", en: "Mixed", icon: "🔀" },
  { value: "mcq", he: "אמריקאיות", en: "MCQ", icon: "📝" },
  { value: "tf", he: "נכון/לא נכון", en: "True/False", icon: "✅" },
  { value: "open", he: "שאלות פתוחות", en: "Open", icon: "✍️" },
];

const DIFFICULTY_OPTIONS: { value: Difficulty; he: string; en: string }[] = [
  { value: "easy", he: "קל", en: "Easy" },
  { value: "medium", he: "בינוני", en: "Medium" },
  { value: "hard", he: "קשה", en: "Hard" },
];

const COUNT_OPTIONS = [5, 10, 15];

export default function StudentQuizCreator({
  subtopicId,
  subtopicName,
  lang,
  onFinish,
}: {
  subtopicId: string;
  subtopicName: string;
  lang: string;
  onFinish?: (score: number, total: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [quizType, setQuizType] = useState<QuizType>("mixed");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);

  const isHe = lang === "he";

  async function generateQuiz() {
    setLoading(true);
    setError(null);
    setQuestions(null);
    try {
      const res = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subtopicId, type: quizType, difficulty, count }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `שגיאה ${res.status}`);
      setQuestions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
    setLoading(false);
  }

  function reset() {
    setQuestions(null);
    setError(null);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-700 hover:bg-violet-100 dark:hover:bg-violet-800/40 transition-colors"
      >
        <span>✨</span>
        {isHe ? "צור שאלון אישי עם AI" : "Generate personal quiz with AI"}
      </button>
    );
  }

  return (
    <div className="mt-4 rounded-2xl border border-violet-200 dark:border-violet-800 bg-violet-50/50 dark:bg-violet-950/20 overflow-hidden" dir={isHe ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-violet-100 dark:border-violet-800/50">
        <div>
          <p className="text-sm font-semibold text-violet-800 dark:text-violet-200">
            {isHe ? "✨ שאלון אישי" : "✨ Personal Quiz"}
          </p>
          <p className="text-xs text-violet-500 dark:text-violet-400">{subtopicName}</p>
        </div>
        <button
          onClick={() => { setOpen(false); reset(); }}
          className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 px-2 py-1"
        >
          {isHe ? "סגור" : "Close"}
        </button>
      </div>

      {/* Active quiz */}
      {questions ? (
        <div className="p-4">
          <QuizGame questions={questions} lang={lang} onFinish={onFinish} />
          <button
            onClick={reset}
            className="mt-4 text-xs text-violet-600 dark:text-violet-400 hover:underline"
          >
            {isHe ? "צור שאלון חדש" : "Generate new quiz"}
          </button>
        </div>
      ) : (
        <div className="p-5">
          {/* Type selector */}
          <div className="mb-4">
            <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-2">
              {isHe ? "סוג שאלות" : "Question type"}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setQuizType(opt.value)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all ${
                    quizType === opt.value
                      ? "border-violet-500 bg-violet-100 dark:bg-violet-900/50 text-violet-800 dark:text-violet-200 font-medium"
                      : "border-zinc-200 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400 hover:border-violet-300"
                  }`}
                >
                  <span>{opt.icon}</span>
                  <span>{isHe ? opt.he : opt.en}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty + Count row */}
          <div className="flex gap-4 mb-5">
            <div className="flex-1">
              <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                {isHe ? "רמת קושי" : "Difficulty"}
              </p>
              <div className="flex gap-1.5">
                {DIFFICULTY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setDifficulty(opt.value)}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                      difficulty === opt.value
                        ? opt.value === "easy" ? "border-green-400 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300"
                          : opt.value === "hard" ? "border-red-400 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300"
                          : "border-yellow-400 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300"
                        : "border-zinc-200 dark:border-zinc-600 text-zinc-500 hover:border-zinc-300"
                    }`}
                  >
                    {isHe ? opt.he : opt.en}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                {isHe ? "כמות שאלות" : "# Questions"}
              </p>
              <div className="flex gap-1.5">
                {COUNT_OPTIONS.map((n) => (
                  <button
                    key={n}
                    onClick={() => setCount(n)}
                    className={`w-10 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                      count === n
                        ? "border-violet-500 bg-violet-100 dark:bg-violet-900/50 text-violet-800 dark:text-violet-200"
                        : "border-zinc-200 dark:border-zinc-600 text-zinc-500 hover:border-zinc-300"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <p className="mb-3 text-xs text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            onClick={generateQuiz}
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 disabled:opacity-50 transition-colors"
          >
            {loading
              ? (isHe ? "מייצר שאלות... ⏳" : "Generating... ⏳")
              : (isHe ? `✨ צור ${count} שאלות עכשיו` : `✨ Generate ${count} questions`)}
          </button>
        </div>
      )}
    </div>
  );
}
