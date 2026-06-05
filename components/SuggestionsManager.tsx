"use client";

import { useState } from "react";
import type { Locale } from "@/lib/dictionaries";

type Suggestion = {
  id: string;
  topicSlug: string | null;
  topicName: string;
  nameHe: string;
  nameEn: string;
  contentHe: string;
  contentEn: string;
  reason: string;
  priority: number;
};

type Topic = { slug: string; nameHe: string; nameEn: string };

const PRIORITY_LABEL: Record<number, { label: string; color: string }> = {
  3: { label: "קריטי", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  2: { label: "חשוב", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  1: { label: "מומלץ", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
};

export default function SuggestionsManager({
  initialSuggestions,
  topics,
  lang,
}: {
  initialSuggestions: Suggestion[];
  topics: Topic[];
  lang: Locale;
}) {
  const [suggestions, setSuggestions] = useState(initialSuggestions);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeResult, setAnalyzeResult] = useState<string | null>(null);
  const [pending, setPending] = useState<Record<string, boolean>>({});

  async function runAnalysis() {
    setAnalyzing(true);
    setAnalyzeResult(null);
    try {
      const res = await fetch("/api/admin/analyze-gaps", { method: "POST" });
      const data = await res.json();
      setAnalyzeResult(
        lang === "he"
          ? `ניתוח הסתיים — נוצרו ${data.created} הצעות חדשות`
          : `Analysis complete — ${data.created} new suggestions created`
      );
      // Refresh list
      const refreshed = await fetch("/api/admin/suggestions");
      setSuggestions(await refreshed.json());
    } catch {
      setAnalyzeResult(lang === "he" ? "שגיאה בניתוח" : "Analysis error");
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleAction(id: string, action: "approve" | "reject") {
    setPending((p) => ({ ...p, [id]: true }));
    try {
      await fetch("/api/admin/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      setSuggestions((prev) => prev.filter((s) => s.id !== id));
    } catch {
      // ignore
    } finally {
      setPending((p) => ({ ...p, [id]: false }));
    }
  }

  return (
    <div className="space-y-6">
      {/* Analyze button */}
      <div className="flex items-center gap-4 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
        <div className="flex-1">
          <p className="font-medium text-zinc-900 dark:text-zinc-50 text-sm">
            {lang === "he" ? "ניתוח פערי תוכן" : "Content Gap Analysis"}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            {lang === "he"
              ? "AI יבדוק את שאלות הצ'אט ויציע נושאים חסרים לפי תדירות"
              : "AI will scan chat questions and suggest missing topics by frequency"}
          </p>
        </div>
        <button
          onClick={runAnalysis}
          disabled={analyzing}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium disabled:opacity-60 transition-colors shrink-0"
        >
          {analyzing
            ? (lang === "he" ? "מנתח..." : "Analyzing...")
            : (lang === "he" ? "הפעל ניתוח" : "Run Analysis")}
        </button>
      </div>

      {analyzeResult && (
        <p className="text-sm text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-4 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800">
          ✓ {analyzeResult}
        </p>
      )}

      {/* Suggestions list */}
      {suggestions.length === 0 ? (
        <div className="text-center py-16 text-zinc-400 dark:text-zinc-500">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-sm">
            {lang === "he"
              ? "אין הצעות ממתינות — הפעל ניתוח כדי לייצר הצעות"
              : "No pending suggestions — run analysis to generate some"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {lang === "he" ? `${suggestions.length} הצעות ממתינות לאישור` : `${suggestions.length} suggestions awaiting approval`}
          </p>
          {suggestions.map((s) => {
            const priority = PRIORITY_LABEL[s.priority] ?? PRIORITY_LABEL[1];
            const topicLabel = topics.find((t) => t.slug === s.topicSlug);
            return (
              <div
                key={s.id}
                className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-5 space-y-3"
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${priority.color}`}>
                      {priority.label}
                    </span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-700/50 px-2 py-0.5 rounded-full">
                      {topicLabel ? (lang === "he" ? topicLabel.nameHe : topicLabel.nameEn) : s.topicName}
                    </span>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleAction(s.id, "reject")}
                      disabled={pending[s.id]}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-50 transition-colors"
                    >
                      {lang === "he" ? "דחה" : "Reject"}
                    </button>
                    <button
                      onClick={() => handleAction(s.id, "approve")}
                      disabled={pending[s.id]}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 transition-colors"
                    >
                      {lang === "he" ? "אשר והוסף" : "Approve & Add"}
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                    {lang === "he" ? s.nameHe : s.nameEn}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                    {lang === "he" ? s.contentHe : s.contentEn}
                  </p>
                </div>

                <p className="text-xs text-zinc-400 dark:text-zinc-500 italic border-t border-zinc-100 dark:border-zinc-700/50 pt-2">
                  💡 {s.reason}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
