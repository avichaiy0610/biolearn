"use client";

import { useBankQuiz, BankQuizGame } from "./BankQuiz";

// Topic-level practice from the static, textbook-reviewed question bank.
export default function TopicPractice({ topicSlug, total, lang }: { topicSlug: string; total: number; lang: string }) {
  const he = lang !== "en";
  const { questions, loading, error, load, reset } = useBankQuiz(lang);
  const count = Math.min(10, total);

  return (
    <section className="mt-10" aria-labelledby="practice-title">
      <div className="flex items-center gap-3 mb-2 flex-wrap">
        <h2 id="practice-title" className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">
          📘 {he ? "תרגול ממאגר השאלות" : "Question bank practice"}
        </h2>
        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
          {he ? `${total} שאלות · נבדקו מול ספר לימוד` : `${total} questions · textbook-checked`}
        </span>
      </div>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
        {he
          ? "שאלות שנכתבו ונבדקו ידנית, עם הסבר לכל תשובה — גם לשגויות. לא תלויות ב-AI."
          : "Hand-written, reviewed questions with an explanation for every option. No AI involved."}
      </p>
      {questions ? (
        <div>
          <BankQuizGame key={questions.map((q) => q.id).join()} questions={questions} lang={lang} />
          <button onClick={() => { reset(); load(`topic=${topicSlug}&limit=${count}`); }} className="mt-3 text-xs text-emerald-700 dark:text-emerald-400 hover:underline">
            {he ? "סבב חדש" : "New round"}
          </button>
        </div>
      ) : (
        <button
          onClick={() => load(`topic=${topicSlug}&limit=${count}`)}
          disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium disabled:opacity-60 transition-colors"
        >
          {loading ? (he ? "טוען…" : "Loading…") : he ? `התחל תרגול (${count} שאלות)` : `Start practice (${count} questions)`}
        </button>
      )}
      {error && <p role="alert" className="mt-2 text-sm text-red-600">{error}</p>}
    </section>
  );
}
