"use client";

import { useRef, useState } from "react";
import QuizGame, { type QuizQuestion } from "./QuizGame";

// Loads static (reviewed, non-AI) questions and runs them in QuizGame. Answers
// are aggregated per subtopic and saved as quiz results, so they feed progress
// and weak-spot detection even when the quiz mixes several subtopics.
export function useBankQuiz(lang: string) {
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load(query: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/question-bank?${query}`);
      if (!res.ok) throw new Error();
      const data: QuizQuestion[] = await res.json();
      if (data.length === 0) throw new Error("empty");
      setQuestions(data);
    } catch {
      setError(lang === "en" ? "Couldn't load the question bank." : "לא הצלחנו לטעון את מאגר השאלות.");
    }
    setLoading(false);
  }
  return { questions, loading, error, load, reset: () => setQuestions(null) };
}

export function BankQuizGame({ questions, lang }: { questions: QuizQuestion[]; lang: string }) {
  const perSub = useRef<Record<string, { correct: number; total: number }>>({});

  function onAnswer(q: QuizQuestion, correct: boolean) {
    if (!q.subtopicId) return;
    const s = (perSub.current[q.subtopicId] ??= { correct: 0, total: 0 });
    s.total++;
    if (correct) s.correct++;
  }

  function onFinish() {
    // Guests get 401 here — that's fine, the quiz still works without an account.
    for (const [subtopicId, s] of Object.entries(perSub.current)) {
      fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "quiz", subtopicId, score: Math.round((s.correct / s.total) * 100), total: s.total, correct: s.correct, type: "bank" }),
      }).catch(() => {});
    }
    perSub.current = {};
  }

  return <QuizGame questions={questions} lang={lang} onAnswer={onAnswer} onFinish={onFinish} />;
}

// Shown next to an AI error: practice from the static bank instead.
export function BankFallback({ query, lang }: { query: string; lang: string }) {
  const he = lang !== "en";
  const { questions, loading, error, load } = useBankQuiz(lang);
  if (questions) return <div className="mt-3"><BankQuizGame questions={questions} lang={lang} /></div>;
  return (
    <div className="mt-2 text-xs">
      <button
        onClick={() => load(query)}
        disabled={loading}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 disabled:opacity-50"
      >
        📘 {loading ? (he ? "טוען…" : "Loading…") : he ? "תרגלו בינתיים ממאגר השאלות הקבוע (ללא AI)" : "Practice from the reviewed question bank meanwhile (no AI)"}
      </button>
      {error && <p className="mt-1 text-red-600">{error}</p>}
    </div>
  );
}
