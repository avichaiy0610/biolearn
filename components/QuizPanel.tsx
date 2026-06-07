"use client";

import { useState, useEffect } from "react";

type Question = {
  id: string;
  type: string;
  question: string;
  options: string | null;
  answer: string;
  explanation: string;
  difficulty: string;
};

function parseOptions(str: string | null): string[] {
  if (!str) return [];
  try { return JSON.parse(str); } catch { return []; }
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function QuizPanel({ subtopicId, lang }: { subtopicId: string; lang: string }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

  const isHe = lang === "he";

  useEffect(() => {
    fetch(`/api/questions?subtopicId=${subtopicId}`)
      .then((r) => r.json())
      .then((data: Question[]) => {
        setQuestions(shuffle(data));
        setLoading(false);
      });
  }, [subtopicId]);

  useEffect(() => {
    if (questions[current]) {
      const opts = parseOptions(questions[current].options);
      setShuffledOptions(opts.length ? shuffle(opts) : []);
    }
  }, [current, questions]);

  if (loading) return <p className="text-sm text-zinc-400 animate-pulse">{isHe ? "טוען שאלות..." : "Loading questions..."}</p>;
  if (questions.length === 0) return null;

  const q = questions[current];
  const isCorrect = selected === q.answer;
  const isTF = q.type === "tf";
  const tfOptions = isHe ? ["נכון", "לא נכון"] : ["True", "False"];
  const tfValues = ["true", "false"];

  function handleSelect(val: string) {
    if (submitted) return;
    setSelected(val);
  }

  function handleSubmit() {
    if (!selected) return;
    setSubmitted(true);
    if (selected === q.answer) setScore((s) => s + 1);
  }

  function handleNext() {
    if (current + 1 >= questions.length) {
      setDone(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setSubmitted(false);
    }
  }

  function handleRestart() {
    setQuestions(shuffle(questions));
    setCurrent(0);
    setSelected(null);
    setSubmitted(false);
    setScore(0);
    setDone(false);
  }

  // Done screen
  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    const emoji = pct >= 80 ? "🎉" : pct >= 50 ? "👍" : "💪";
    return (
      <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-6 text-center" dir={isHe ? "rtl" : "ltr"}>
        <p className="text-4xl mb-3">{emoji}</p>
        <p className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">
          {score}/{questions.length}
        </p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-5">
          {isHe ? `ענית נכון על ${pct}% מהשאלות` : `${pct}% correct`}
        </p>
        <button
          onClick={handleRestart}
          className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
        >
          {isHe ? "נסה שוב" : "Try again"}
        </button>
      </div>
    );
  }

  // Quiz screen
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 overflow-hidden" dir={isHe ? "rtl" : "ltr"}>
      {/* Progress bar */}
      <div className="h-1 bg-zinc-100 dark:bg-zinc-700">
        <div
          className="h-1 bg-emerald-500 transition-all duration-300"
          style={{ width: `${((current) / questions.length) * 100}%` }}
        />
      </div>

      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-zinc-400">
            {isHe ? `שאלה ${current + 1} מתוך ${questions.length}` : `Question ${current + 1} of ${questions.length}`}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            q.difficulty === "easy" ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
            : q.difficulty === "hard" ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
            : "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
          }`}>
            {q.difficulty === "easy" ? (isHe ? "קל" : "Easy")
              : q.difficulty === "hard" ? (isHe ? "קשה" : "Hard")
              : (isHe ? "בינוני" : "Medium")}
          </span>
        </div>

        {/* Question */}
        <p className="text-base font-medium text-zinc-900 dark:text-zinc-50 mb-5 leading-relaxed">
          {q.question}
        </p>

        {/* Options */}
        <div className="space-y-2 mb-5">
          {(isTF ? tfOptions : shuffledOptions).map((opt, i) => {
            const val = isTF ? tfValues[i] : opt;
            const isSelected = selected === val;
            const isRight = submitted && val === q.answer;
            const isWrong = submitted && isSelected && val !== q.answer;

            return (
              <button
                key={val}
                onClick={() => handleSelect(val)}
                disabled={submitted}
                className={`w-full text-right px-4 py-3 rounded-xl border text-sm transition-all ${
                  isRight
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-medium"
                    : isWrong
                    ? "border-red-400 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                    : isSelected
                    ? "border-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/20 text-zinc-900 dark:text-zinc-50"
                    : "border-zinc-200 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 hover:border-emerald-300 hover:bg-zinc-50 dark:hover:bg-zinc-700"
                }`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span>{opt}</span>
                  {isRight && <span>✓</span>}
                  {isWrong && <span>✗</span>}
                </span>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {submitted && (
          <div className={`rounded-xl p-4 mb-5 text-sm ${
            isCorrect
              ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
              : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
          }`}>
            <p className="font-semibold mb-1">
              {isCorrect ? (isHe ? "✓ נכון!" : "✓ Correct!") : (isHe ? "✗ לא נכון" : "✗ Incorrect")}
            </p>
            <p>{q.explanation}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-zinc-400">
            {isHe ? `ניקוד: ${score}/${current}` : `Score: ${score}/${current}`}
          </span>
          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={!selected}
              className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-40 transition-colors"
            >
              {isHe ? "בדוק" : "Check"}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-5 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 text-sm font-medium hover:opacity-80 transition-opacity"
            >
              {current + 1 >= questions.length
                ? (isHe ? "סיים" : "Finish")
                : (isHe ? "הבא ←" : "Next →")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
