"use client";

import { useState, useEffect } from "react";

export type QuizQuestion = {
  id?: string;
  type: string;
  question: string;
  options: string | string[] | null;
  answer: string;
  explanation: string;
  difficulty: string;
};

function parseOptions(val: string | string[] | null): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try { return JSON.parse(val); } catch { return []; }
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function QuizGame({
  questions: rawQuestions,
  lang,
}: {
  questions: QuizQuestion[];
  lang: string;
}) {
  const [questions] = useState(() => shuffle(rawQuestions));
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [openAnswer, setOpenAnswer] = useState("");
  const [selfScore, setSelfScore] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

  const isHe = lang === "he";

  useEffect(() => {
    const q = questions[current];
    if (!q) return;
    const opts = parseOptions(q.options);
    setShuffledOptions(opts.length ? shuffle(opts) : []);
    setSelected(null);
    setOpenAnswer("");
    setSelfScore(null);
    setSubmitted(false);
  }, [current, questions]);

  if (questions.length === 0) return null;

  const q = questions[current];
  const isTF = q.type === "tf";
  const isOpen = q.type === "open";
  const isMCQ = q.type === "mcq";
  const isCorrect = !isOpen && selected === q.answer;
  const tfOptions = isHe ? ["נכון", "לא נכון"] : ["True", "False"];
  const tfValues = ["true", "false"];

  function handleSelect(val: string) {
    if (submitted) return;
    setSelected(val);
  }

  function handleSubmit() {
    if (isMCQ || isTF) {
      if (!selected) return;
      setSubmitted(true);
      if (selected === q.answer) setScore((s) => s + 1);
    } else {
      if (!openAnswer.trim()) return;
      setSubmitted(true);
    }
  }

  function handleSelfScore(correct: boolean) {
    setSelfScore(correct);
    if (correct) setScore((s) => s + 1);
  }

  function handleNext() {
    if (current + 1 >= questions.length) setDone(true);
    else setCurrent((c) => c + 1);
  }

  // Done screen
  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    const emoji = pct >= 80 ? "🎉" : pct >= 50 ? "👍" : "💪";
    return (
      <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-6 text-center" dir={isHe ? "rtl" : "ltr"}>
        <p className="text-4xl mb-3">{emoji}</p>
        <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">{score}/{questions.length}</p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {isHe ? `ענית נכון על ${pct}% מהשאלות` : `${pct}% correct`}
        </p>
      </div>
    );
  }

  const canSubmit = isOpen ? openAnswer.trim().length > 0 : selected !== null;
  const needsSelfScore = isOpen && submitted && selfScore === null;

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 overflow-hidden" dir={isHe ? "rtl" : "ltr"}>
      {/* Progress */}
      <div className="h-1 bg-zinc-100 dark:bg-zinc-700">
        <div className="h-1 bg-violet-500 transition-all duration-300" style={{ width: `${(current / questions.length) * 100}%` }} />
      </div>

      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-zinc-400">
            {isHe ? `שאלה ${current + 1} מתוך ${questions.length}` : `Question ${current + 1} of ${questions.length}`}
          </span>
          <div className="flex gap-1.5">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              q.difficulty === "easy" ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
              : q.difficulty === "hard" ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
              : "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
            }`}>
              {q.difficulty === "easy" ? (isHe ? "קל" : "Easy") : q.difficulty === "hard" ? (isHe ? "קשה" : "Hard") : (isHe ? "בינוני" : "Med")}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-700 text-zinc-500">
              {isMCQ ? (isHe ? "אמריקאית" : "MCQ") : isTF ? (isHe ? "נכון/לא" : "T/F") : (isHe ? "פתוח" : "Open")}
            </span>
          </div>
        </div>

        {/* Question */}
        <p className="text-base font-medium text-zinc-900 dark:text-zinc-50 mb-5 leading-relaxed">{q.question}</p>

        {/* MCQ Options */}
        {isMCQ && (
          <div className="space-y-2 mb-5">
            {shuffledOptions.map((opt) => {
              const isSelected = selected === opt;
              const isRight = submitted && opt === q.answer;
              const isWrong = submitted && isSelected && opt !== q.answer;
              return (
                <button
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  disabled={submitted}
                  className={`w-full text-right px-4 py-3 rounded-xl border text-sm transition-all ${
                    isRight ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-medium"
                    : isWrong ? "border-red-400 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                    : isSelected ? "border-violet-400 bg-violet-50/50 dark:bg-violet-900/20 text-zinc-900 dark:text-zinc-50"
                    : "border-zinc-200 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 hover:border-violet-300 hover:bg-zinc-50 dark:hover:bg-zinc-700"
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
        )}

        {/* T/F Options */}
        {isTF && (
          <div className="flex gap-3 mb-5">
            {tfOptions.map((label, i) => {
              const val = tfValues[i];
              const isSelected = selected === val;
              const isRight = submitted && val === q.answer;
              const isWrong = submitted && isSelected && val !== q.answer;
              return (
                <button
                  key={val}
                  onClick={() => handleSelect(val)}
                  disabled={submitted}
                  className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${
                    isRight ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
                    : isWrong ? "border-red-400 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                    : isSelected ? "border-violet-400 bg-violet-50/50 dark:bg-violet-900/20 text-zinc-900 dark:text-zinc-50"
                    : "border-zinc-200 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 hover:border-violet-300"
                  }`}
                >
                  {label} {isRight ? "✓" : isWrong ? "✗" : ""}
                </button>
              );
            })}
          </div>
        )}

        {/* Open textarea */}
        {isOpen && !submitted && (
          <textarea
            value={openAnswer}
            onChange={(e) => setOpenAnswer(e.target.value)}
            rows={3}
            placeholder={isHe ? "כתוב את תשובתך כאן..." : "Write your answer here..."}
            className="w-full mb-5 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700 text-sm text-zinc-900 dark:text-zinc-50 resize-none focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
        )}

        {/* Open — show student's answer after submit */}
        {isOpen && submitted && (
          <div className="mb-4 rounded-xl border border-zinc-200 dark:border-zinc-700 p-3 text-sm">
            <p className="text-xs text-zinc-400 mb-1">{isHe ? "תשובתך:" : "Your answer:"}</p>
            <p className="text-zinc-700 dark:text-zinc-300">{openAnswer}</p>
          </div>
        )}

        {/* Feedback for MCQ/TF */}
        {submitted && !isOpen && (
          <div className={`rounded-xl p-4 mb-5 text-sm ${
            isCorrect ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
            : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
          }`}>
            <p className="font-semibold mb-1">
              {isCorrect ? (isHe ? "✓ נכון!" : "✓ Correct!") : (isHe ? "✗ לא נכון" : "✗ Incorrect")}
            </p>
            <p>{q.explanation}</p>
          </div>
        )}

        {/* Open — model answer + self-score */}
        {isOpen && submitted && (
          <div className="mb-5 rounded-xl bg-zinc-50 dark:bg-zinc-700/50 p-4 text-sm">
            <p className="font-semibold text-zinc-700 dark:text-zinc-300 mb-1">{isHe ? "תשובה מומלצת:" : "Model answer:"}</p>
            <p className="text-zinc-600 dark:text-zinc-400 mb-3">{q.answer}</p>
            <p className="text-xs text-zinc-500 mb-2">{q.explanation}</p>
            {selfScore === null && (
              <div className="flex gap-2 mt-3">
                <p className="text-xs text-zinc-500 self-center">{isHe ? "האם ענית נכון?" : "Did you get it right?"}</p>
                <button onClick={() => handleSelfScore(true)} className="px-3 py-1 text-xs rounded-lg bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 transition-colors">
                  {isHe ? "כן ✓" : "Yes ✓"}
                </button>
                <button onClick={() => handleSelfScore(false)} className="px-3 py-1 text-xs rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 transition-colors">
                  {isHe ? "לא ✗" : "No ✗"}
                </button>
              </div>
            )}
            {selfScore !== null && (
              <p className={`text-xs font-medium mt-2 ${selfScore ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}>
                {selfScore ? (isHe ? "✓ מצוין!" : "✓ Great!") : (isHe ? "✗ בפעם הבאה!" : "✗ Better luck next time!")}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-zinc-400">{isHe ? `ניקוד: ${score}/${current}` : `Score: ${score}/${current}`}</span>
          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="px-5 py-2 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 disabled:opacity-40 transition-colors"
            >
              {isHe ? "בדוק" : "Check"}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={needsSelfScore}
              className="px-5 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 text-sm font-medium hover:opacity-80 disabled:opacity-40 transition-opacity"
            >
              {current + 1 >= questions.length ? (isHe ? "סיים" : "Finish") : (isHe ? "הבא ←" : "Next →")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
