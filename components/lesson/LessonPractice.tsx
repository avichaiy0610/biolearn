"use client";

import { useState, type ComponentProps } from "react";
import { BankQuizGame } from "@/components/BankQuiz";

type Questions = ComponentProps<typeof BankQuizGame>["questions"];

// The quiz shuffles its questions, so it mounts on demand (client only) —
// rendering it on the server would never match the browser.
export default function LessonPractice({ questions, lang }: { questions: Questions; lang: string }) {
  const [started, setStarted] = useState(false);
  if (started) return <BankQuizGame questions={questions} lang={lang} />;
  return (
    <button
      type="button"
      onClick={() => setStarted(true)}
      className="inline-flex min-h-12 items-center gap-3 rounded-xl bg-brand px-6 font-bold text-surface hover:bg-brand-hover"
    >
      התחלת תרגול · {questions.length} שאלות
    </button>
  );
}
