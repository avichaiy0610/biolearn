"use client";

import { useState } from "react";
import type { Locale } from "@/lib/dictionaries";
import { streamAi, genericAiError } from "@/lib/ai-client";

export default function AIExplainPanel({
  lang,
  processName,
  stepTitle,
  stepDesc,
  dict,
}: {
  lang: Locale;
  processName: string;
  stepTitle: string;
  stepDesc: string;
  dict: { explain: string; explaining: string };
}) {
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchExplanation() {
    setLoading(true);
    setExplanation("");

    try {
      await streamAi("/api/ai-explain", { lang, processName, stepTitle, stepDesc }, lang, setExplanation);
    } catch (err) {
      setExplanation(err instanceof Error ? err.message : genericAiError(lang));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-sm font-medium">
          <span>✨</span>
          <span>AI</span>
        </div>
        <button
          onClick={fetchExplanation}
          disabled={loading}
          className="px-3 py-1.5 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-60 disabled:cursor-wait transition-colors"
        >
          {loading ? dict.explaining : dict.explain}
        </button>
      </div>

      {explanation && (
        <p className="mt-3 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
          {explanation}
        </p>
      )}

      {loading && !explanation && (
        <div className="mt-3 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
