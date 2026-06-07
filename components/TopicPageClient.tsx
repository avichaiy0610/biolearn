"use client";

import { useState, useEffect } from "react";
import { useTopicProgress, ProgressBar, SubtopicBadge } from "./TopicProgress";
import SubtopicResearch from "./SubtopicResearch";
import SubtopicQuiz from "./SubtopicQuiz";
import StudentQuizCreator from "./StudentQuizCreator";
import StudentFlashcards from "./StudentFlashcards";
import type { Locale } from "@/lib/dictionaries";
import Link from "next/link";

type Subtopic = {
  id: string;
  nameHe: string;
  nameEn: string;
  contentHe: string;
  contentEn: string;
  relatedProcessSlug: string | null;
  _count: { questions: number };
};

type Process = { slug: string; nameHe: string; nameEn: string; descHe: string; descEn: string };

type Dict = {
  subtopic: { viewAnimation: string; research: string; researching: string; researchResult: string; citations: string; researchError: string; askFollowUp: string; askPlaceholder: string; asking: string };
};

export default function TopicPageClient({
  subtopics,
  processes,
  topicSlug,
  topicName,
  lang,
  dict,
}: {
  subtopics: Subtopic[];
  processes: Process[];
  topicSlug: string;
  topicName: string;
  lang: string;
  dict: Dict;
}) {
  const isHe = lang === "he";
  const { data, loaded, markVisited } = useTopicProgress(topicSlug);
  const [openId, setOpenId] = useState<string | null>(null);

  function toggleSubtopic(id: string) {
    if (openId === id) {
      setOpenId(null);
    } else {
      setOpenId(id);
      markVisited(id);
    }
  }

  return (
    <div>
      {/* Progress bar — only shown when loaded and user has visited at least one */}
      {loaded && data.visited.length > 0 && (
        <ProgressBar
          visited={data.visited.length}
          total={subtopics.length}
          scores={data.scores}
          lang={lang}
        />
      )}

      <div className="space-y-3">
        {subtopics.map((sub) => {
          const subName = isHe ? sub.nameHe : sub.nameEn;
          const subContent = isHe ? sub.contentHe : sub.contentEn;
          const isVisited = data.visited.includes(sub.id);
          const bestScore = data.scores[sub.id];
          const isOpen = openId === sub.id;

          return (
            <div
              key={sub.id}
              className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 overflow-hidden"
            >
              <button
                onClick={() => toggleSubtopic(sub.id)}
                className="w-full px-5 py-4 font-medium text-zinc-900 dark:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 flex items-center justify-between text-start"
              >
                <span className="flex items-center gap-2">
                  {subName}
                  <SubtopicBadge subtopicId={sub.id} visited={isVisited} score={bestScore} />
                </span>
                <span className={`text-zinc-400 text-sm transition-transform inline-block ${isOpen ? "rotate-90" : ""}`}>▶</span>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-2 border-t border-zinc-100 dark:border-zinc-700/50">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap mb-3">
                    {subContent}
                  </p>

                  <div className="flex flex-wrap gap-2 items-center">
                    {sub.relatedProcessSlug && processes.some((p) => p.slug === sub.relatedProcessSlug) && (
                      <Link
                        href={`/${lang}/topics/${topicSlug}/${sub.relatedProcessSlug}`}
                        className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-800/40 transition-colors"
                      >
                        <span>🎬</span>
                        {dict.subtopic.viewAnimation}
                      </Link>
                    )}

                    <SubtopicResearch
                      lang={lang as Locale}
                      subtopicName={subName}
                      topicName={topicName}
                      dict={dict}
                    />
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2">
                    <SubtopicQuiz
                      subtopicId={sub.id}
                      lang={lang}
                      questionCount={sub._count.questions}
                    />
                    <StudentQuizCreator
                      subtopicId={sub.id}
                      subtopicName={subName}
                      lang={lang}
                    />
                    <StudentFlashcards
                      subtopicId={sub.id}
                      lang={lang}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
