"use client";

import { useState, useRef } from "react";
import type { Locale } from "@/lib/dictionaries";

type Topic = { slug: string; nameHe: string; nameEn: string };

type Suggestion = {
  slug: string;
  nameHe: string;
  nameEn: string;
  contentHe: string;
  contentEn: string;
};

type Dict = {
  upload: {
    selectTopic: string;
    noTopic: string;
    uploadButton: string;
    uploading: string;
    results: string;
    noResults: string;
    addToDb: string;
    added: string;
  };
};

export default function SyllabusUploader({
  lang,
  topics,
  dict,
}: {
  lang: Locale;
  topics: Topic[];
  dict: Dict;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [materialId, setMaterialId] = useState("");
  const [addedSlugs, setAddedSlugs] = useState<Set<string>>(new Set());
  const [fileName, setFileName] = useState("");

  async function handleUpload() {
    const file = inputRef.current?.files?.[0];
    if (!file) return;

    setLoading(true);
    setSuggestions([]);
    setAddedSlugs(new Set());

    const formData = new FormData();
    formData.append("file", file);
    formData.append("lang", lang);
    if (selectedTopic) formData.append("topicSlug", selectedTopic);

    try {
      const res = await fetch("/api/syllabus-upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuggestions(data.suggestions ?? []);
      setMaterialId(data.id ?? "");
    } catch (e) {
      alert(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  async function addSubtopic(s: Suggestion) {
    if (!selectedTopic) {
      alert(lang === "he" ? "יש לבחור נושא" : "Please select a topic first");
      return;
    }
    try {
      const res = await fetch("/api/admin/add-subtopic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...s, topicSlug: selectedTopic }),
      });
      if (!res.ok) throw new Error("Failed");
      setAddedSlugs((prev) => new Set([...prev, s.slug]));
    } catch {
      alert(lang === "he" ? "שגיאה בהוספה" : "Failed to add subtopic");
    }
  }

  return (
    <div className="space-y-6">
      {/* Topic selector */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
          {dict.upload.selectTopic}
        </label>
        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">{dict.upload.noTopic}</option>
          {topics.map((t) => (
            <option key={t.slug} value={t.slug}>
              {lang === "he" ? t.nameHe : t.nameEn}
            </option>
          ))}
        </select>
      </div>

      {/* File input */}
      <div
        onClick={() => inputRef.current?.click()}
        className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800/50 p-8 text-center hover:border-emerald-400 dark:hover:border-emerald-600 transition-colors"
      >
        <div className="text-3xl mb-2">📄</div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {fileName || (lang === "he" ? "לחץ לבחירת קובץ PDF או טקסט" : "Click to select PDF or text file")}
        </p>
        <p className="text-xs text-zinc-400 mt-1">PDF, TXT, MD</p>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.txt,.md,text/plain,application/pdf"
          className="hidden"
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
        />
      </div>

      {/* Upload button */}
      <button
        onClick={handleUpload}
        disabled={loading || !fileName}
        className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? dict.upload.uploading : dict.upload.uploadButton}
      </button>

      {/* Results */}
      {suggestions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
            {dict.upload.results} ({suggestions.length})
          </h3>
          <div className="space-y-3">
            {suggestions.map((s) => {
              const added = addedSlugs.has(s.slug);
              return (
                <div
                  key={s.slug}
                  className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-zinc-900 dark:text-zinc-50">
                        {lang === "he" ? s.nameHe : s.nameEn}
                      </p>
                      <p className="text-sm text-zinc-500 mt-1 line-clamp-3">
                        {lang === "he" ? s.contentHe : s.contentEn}
                      </p>
                    </div>
                    <button
                      onClick={() => addSubtopic(s)}
                      disabled={added}
                      className="shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white disabled:bg-zinc-300 dark:disabled:bg-zinc-600 disabled:cursor-default transition-colors"
                    >
                      {added ? dict.upload.added : dict.upload.addToDb}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!loading && fileName && suggestions.length === 0 && materialId && (
        <p className="text-sm text-zinc-500 text-center py-4">{dict.upload.noResults}</p>
      )}
    </div>
  );
}
