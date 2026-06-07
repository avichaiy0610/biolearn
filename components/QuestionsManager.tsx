"use client";

import { useState, useEffect } from "react";

type Question = {
  id: string;
  subtopicId: string;
  subtopic: { nameHe: string; nameEn: string; slug: string };
  type: string;
  question: string;
  options: string | null;
  answer: string;
  explanation: string;
  difficulty: string;
  approved: boolean;
};

type Topic = {
  id: string;
  slug: string;
  nameHe: string;
  subtopics: { id: string; nameHe: string; nameEn: string }[];
};

function parseOptions(str: string | null): string[] {
  if (!str) return [];
  try { return JSON.parse(str); } catch { return []; }
}

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: "קל", medium: "בינוני", hard: "קשה",
};
const DIFFICULTY_COLOR: Record<string, string> = {
  easy: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
  medium: "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300",
  hard: "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300",
};

export default function QuestionsManager() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedSubtopicId, setSelectedSubtopicId] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/topics/with-subtopics")
      .then((r) => r.json())
      .then(setTopics);
  }, []);

  async function loadQuestions(subtopicId: string) {
    setLoading(true);
    const res = await fetch(`/api/admin/questions?subtopicId=${subtopicId}`);
    setQuestions(await res.json());
    setLoading(false);
  }

  async function generateQuestions() {
    if (!selectedSubtopicId) return;
    setGenerating(true);
    setGenError(null);
    try {
      const res = await fetch("/api/admin/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subtopicId: selectedSubtopicId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `שגיאה ${res.status}`);
      await loadQuestions(selectedSubtopicId);
    } catch (err) {
      setGenError(err instanceof Error ? err.message : String(err));
    }
    setGenerating(false);
  }

  async function toggleApprove(q: Question) {
    await fetch(`/api/admin/questions/${q.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved: !q.approved }),
    });
    setQuestions((prev) =>
      prev.map((item) => item.id === q.id ? { ...item, approved: !item.approved } : item)
    );
  }

  async function deleteQuestion(id: string) {
    if (!confirm("למחוק שאלה זו?")) return;
    await fetch(`/api/admin/questions/${id}`, { method: "DELETE" });
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  }

  const approved = questions.filter((q) => q.approved);
  const pending = questions.filter((q) => !q.approved);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">ניהול שאלות תרגול</h1>

      {/* Selector */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <select
          value={selectedTopic?.slug ?? ""}
          onChange={(e) => {
            const t = topics.find((t) => t.slug === e.target.value) ?? null;
            setSelectedTopic(t);
            setSelectedSubtopicId("");
            setQuestions([]);
          }}
          className="rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">בחר נושא</option>
          {topics.map((t) => (
            <option key={t.slug} value={t.slug}>{t.nameHe}</option>
          ))}
        </select>

        {selectedTopic && (
          <select
            value={selectedSubtopicId}
            onChange={(e) => {
              setSelectedSubtopicId(e.target.value);
              if (e.target.value) loadQuestions(e.target.value);
              else setQuestions([]);
            }}
            className="rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">בחר תת-נושא</option>
            {selectedTopic.subtopics.map((s) => (
              <option key={s.id} value={s.id}>{s.nameHe}</option>
            ))}
          </select>
        )}

        {selectedSubtopicId && (
          <button
            onClick={generateQuestions}
            disabled={generating}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            {generating ? "מייצר שאלות..." : "✨ צור שאלות עם AI"}
          </button>
        )}
      </div>

      {genError && (
        <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-3 text-sm text-red-600 dark:text-red-400">
          {genError}
        </div>
      )}

      {loading && <p className="text-zinc-400 text-sm">טוען שאלות...</p>}

      {questions.length > 0 && (
        <div className="mb-3 flex gap-4 text-sm text-zinc-500">
          <span>סה"כ: {questions.length}</span>
          <span className="text-emerald-600 dark:text-emerald-400">מאושרות: {approved.length}</span>
          <span className="text-amber-600 dark:text-amber-400">ממתינות: {pending.length}</span>
        </div>
      )}

      {/* Pending */}
      {pending.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-3">
            ממתינות לאישור ({pending.length})
          </h2>
          <div className="space-y-4">
            {pending.map((q) => (
              <QuestionCard key={q.id} q={q} onApprove={toggleApprove} onDelete={deleteQuestion} />
            ))}
          </div>
        </div>
      )}

      {/* Approved */}
      {approved.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-3">
            מאושרות ({approved.length})
          </h2>
          <div className="space-y-4">
            {approved.map((q) => (
              <QuestionCard key={q.id} q={q} onApprove={toggleApprove} onDelete={deleteQuestion} />
            ))}
          </div>
        </div>
      )}

      {!loading && selectedSubtopicId && questions.length === 0 && (
        <p className="text-zinc-400 text-sm text-center py-10">
          אין שאלות לתת-נושא זה — לחץ "צור שאלות עם AI" כדי להתחיל
        </p>
      )}
    </div>
  );
}

function QuestionCard({
  q, onApprove, onDelete,
}: {
  q: Question;
  onApprove: (q: Question) => void;
  onDelete: (id: string) => void;
}) {
  const options = parseOptions(q.options);

  return (
    <div className={`rounded-xl border p-4 bg-white dark:bg-zinc-800 ${
      q.approved
        ? "border-emerald-200 dark:border-emerald-800"
        : "border-zinc-200 dark:border-zinc-700"
    }`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <p className="font-medium text-zinc-900 dark:text-zinc-50 text-sm leading-snug flex-1">
          {q.question}
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DIFFICULTY_COLOR[q.difficulty] ?? ""}`}>
            {DIFFICULTY_LABEL[q.difficulty] ?? q.difficulty}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-700 text-zinc-500">
            {q.type === "mcq" ? "אמריקאית" : "נכון/לא נכון"}
          </span>
        </div>
      </div>

      {options.length > 0 && (
        <ul className="mb-3 space-y-1">
          {options.map((opt, i) => (
            <li key={i} className={`text-xs px-3 py-1.5 rounded-lg ${
              opt === q.answer
                ? "bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-medium"
                : "text-zinc-500 dark:text-zinc-400"
            }`}>
              {opt === q.answer ? "✓ " : ""}{opt}
            </li>
          ))}
        </ul>
      )}

      {q.type === "tf" && (
        <p className="mb-3 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
          תשובה נכונה: {q.answer === "true" ? "נכון ✓" : "לא נכון ✗"}
        </p>
      )}

      <p className="text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-700/50 rounded-lg px-3 py-2 mb-3">
        💡 {q.explanation}
      </p>

      <div className="flex gap-2">
        <button
          onClick={() => onApprove(q)}
          className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
            q.approved
              ? "bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200"
              : "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200"
          }`}
        >
          {q.approved ? "בטל אישור" : "אשר"}
        </button>
        <button
          onClick={() => onDelete(q.id)}
          className="px-3 py-1 text-xs rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 transition-colors"
        >
          מחק
        </button>
      </div>
    </div>
  );
}
