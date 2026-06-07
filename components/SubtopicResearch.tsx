"use client";

import { useState, useRef } from "react";
import type { Locale } from "@/lib/dictionaries";

type Dict = {
  subtopic: {
    research: string;
    researching: string;
    researchResult: string;
    citations: string;
    researchError: string;
    askFollowUp: string;
    askPlaceholder: string;
    asking: string;
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

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [asking, setAsking] = useState(false);
  const answerRef = useRef("");

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
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setContent(`${dict.subtopic.researchError} (${msg})`);
    } finally {
      setLoading(false);
    }
  }

  async function askQuestion(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim() || asking) return;
    setAsking(true);
    setAnswer("");
    answerRef.current = "";

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lang,
          topicName,
          messages: [
            { role: "user", content: question.trim() },
          ],
          subtopics: [{ name: subtopicName, content }],
        }),
      });

      if (!res.ok || !res.body) throw new Error("Request failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        for (const line of chunk.split("\n")) {
          if (line.startsWith("data: ")) {
            const text = line.slice(6);
            if (text === "[DONE]") break;
            answerRef.current += text;
            setAnswer(answerRef.current);
          }
        }
      }
    } catch {
      setAnswer(lang === "he" ? "שגיאה. נסה שנית." : "Error. Please try again.");
    } finally {
      setAsking(false);
      setQuestion("");
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
        <div className="mt-3 rounded-lg border border-violet-200 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/30 p-4 space-y-3">
          <p className="text-xs font-semibold text-violet-700 dark:text-violet-400">
            ✨ {dict.subtopic.researchResult}
          </p>
          <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
            {content}
          </p>

          {citations.length > 0 && (
            <div className="pt-3 border-t border-violet-200 dark:border-violet-700">
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

          {/* Follow-up Q&A */}
          <div className="pt-3 border-t border-violet-200 dark:border-violet-700">
            <p className="text-xs font-semibold text-violet-700 dark:text-violet-400 mb-2">
              💬 {dict.subtopic.askFollowUp}
            </p>
            <form onSubmit={askQuestion} className="flex gap-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={dict.subtopic.askPlaceholder}
                dir={lang === "he" ? "rtl" : "ltr"}
                disabled={asking}
                className="flex-1 h-8 rounded-lg border border-violet-200 dark:border-violet-700 bg-white dark:bg-zinc-800 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!question.trim() || asking}
                className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium disabled:opacity-50 transition-colors"
              >
                {asking ? dict.subtopic.asking : "→"}
              </button>
            </form>

            {answer && (
              <div className="mt-2 p-3 rounded-lg bg-white dark:bg-zinc-800 border border-violet-100 dark:border-violet-900">
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {answer}
                  {asking && <span className="inline-block w-0.5 h-4 bg-violet-500 ms-0.5 animate-pulse align-middle" />}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
