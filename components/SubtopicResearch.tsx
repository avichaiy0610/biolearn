"use client";

import { useState } from "react";
import type { Locale } from "@/lib/dictionaries";

type Dict = {
  subtopic: {
    research: string;
    researching: string;
    researchResult: string;
    citations: string;
    researchError: string;
  };
};

export default function SubtopicResearch({
  lang,
  subtopicName,
  topicName,
  dict,
}: {
  lang: Locale;
  subtopicName: string;
  topicName: string;
  dict: Dict;
}) {
  const [content, setContent] = useState("");
  const [citations, setCitations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function doResearch() {
    if (content) { setOpen((v) => !v); return; }
    setLoading(true);
    setOpen(true);
    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lang, subtopicName, topicName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setContent(data.content);
      setCitations(data.citations ?? []);
    } catch {
      setContent(dict.subtopic.researchError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-2">
      <button
        onClick={doResearch}
        disabled={loading}
        className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-700 hover:bg-violet-100 dark:hover:bg-violet-800/40 disabled:opacity-60 transition-colors"
      >
        <span>🔍</span>
        {loading ? dict.subtopic.researching : dict.subtopic.research}
      </button>

      {open && content && (
        <div className="mt-3 rounded-lg border border-violet-200 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/30 p-4">
          <p className="text-xs font-semibold text-violet-700 dark:text-violet-400 mb-2">
            ✨ {dict.subtopic.researchResult}
          </p>
          <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
            {content}
          </p>
          {citations.length > 0 && (
            <div className="mt-3 pt-3 border-t border-violet-200 dark:border-violet-700">
              <p className="text-xs font-semibold text-zinc-500 mb-1">
                {dict.subtopic.citations}
              </p>
              <ul className="space-y-1">
                {citations.slice(0, 4).map((c, i) => (
                  <li key={i} className="text-xs text-violet-600 dark:text-violet-400 truncate">
                    <a href={c} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {c}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
