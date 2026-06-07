"use client";

import { useState, useEffect } from "react";
import type { QuizQuestion } from "./QuizGame";
import dynamic from "next/dynamic";

const QuizGame = dynamic(() => import("./QuizGame"), { ssr: false });

export default function QuizPanel({ subtopicId, lang }: { subtopicId: string; lang: string }) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/questions?subtopicId=${subtopicId}`)
      .then((r) => r.json())
      .then((data: QuizQuestion[]) => {
        setQuestions(data);
        setLoading(false);
      });
  }, [subtopicId]);

  if (loading) return <p className="text-sm text-zinc-400 animate-pulse">{lang === "he" ? "טוען..." : "Loading..."}</p>;
  if (questions.length === 0) return null;

  return <QuizGame questions={questions} lang={lang} />;
}
