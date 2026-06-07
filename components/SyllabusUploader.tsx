"use client";

import { useState, useRef } from "react";
import type { Locale } from "@/lib/dictionaries";

type ExistingSubtopic = { id: string; slug: string; nameHe: string; nameEn: string; contentHe: string; contentEn: string };
type Topic = { slug: string; nameHe: string; nameEn: string; subtopics: ExistingSubtopic[] };

type Suggestion = {
  action: "create" | "update";
  matchedSubtopicId?: string;
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
  // per-suggestion user override: "create" | "update" | undefined (use AI default)
  const [userActions, setUserActions] = useState<Record<number, "create" | "update">>({});
  const [materialId, setMaterialId] = useState("");
  const [processedIndices, setProcessedIndices] = useState<Set<number>>(new Set());
  const [fileName, setFileName] = useState("");

  const currentTopic = topics.find((t) => t.slug === selectedTopic);

  async function handleUpload() {
    const file = inputRef.current?.files?.[0];
    if (!file) return;

    setLoading(true);
    setSuggestions([]);
    setUserActions({});
    setProcessedIndices(new Set());

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

  function getEffectiveAction(index: number, s: Suggestion): "create" | "update" {
    return userActions[index] ?? s.action ?? "create";
  }

  async function handleAction(index: number, s: Suggestion) {
    const action = getEffectiveAction(index, s);

    if (action === "update") {
      const targetId = s.matchedSubtopicId;
      if (!targetId) {
        alert(lang === "he" ? "לא נמצא תת-נושא קיים לעדכון" : "No existing subtopic found to update");
        return;
      }
      try {
        const res = await fetch("/api/admin/update-subtopic", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subtopicId: targetId, nameHe: s.nameHe, nameEn: s.nameEn, contentHe: s.contentHe, contentEn: s.contentEn }),
        });
        if (!res.ok) throw new Error("Failed");
        setProcessedIndices((prev) => new Set([...prev, index]));
      } catch {
        alert(lang === "he" ? "שגיאה בעדכון" : "Failed to update subtopic");
      }
    } else {
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
        const data = await res.json();
        setProcessedIndices((prev) => new Set([...prev, index]));
        if (!data.animationCreated) {
          alert(
            lang === "he"
              ? "תת-הנושא נוסף, אך לא נוצרה אנימציה. ניתן להוסיף אנימציה ידנית."
              : "Subtopic added, but no animation was created. You can add an animation manually."
          );
        }
      } catch {
        alert(lang === "he" ? "שגיאה בהוספה" : "Failed to add subtopic");
      }
    }
  }

  function toggleAction(index: number, s: Suggestion) {
    const current = getEffectiveAction(index, s);
    const next = current === "create" ? "update" : "create";
    // Only allow update if there's a matched subtopic
    if (next === "update" && !s.matchedSubtopicId) return;
    setUserActions((prev) => ({ ...prev, [index]: next }));
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
        <p className="text-xs text-zinc-400 mt-1">PDF, PPTX, TXT, MD</p>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.txt,.md,.pptx,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.presentationml.presentation"
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
            {suggestions.map((s, index) => {
              const done = processedIndices.has(index);
              const action = getEffectiveAction(index, s);
              const matchedExisting = s.matchedSubtopicId
                ? currentTopic?.subtopics.find((sub) => sub.id === s.matchedSubtopicId)
                : null;
              const isUpdate = action === "update";

              return (
                <div
                  key={index}
                  className={`rounded-xl border p-4 transition-colors ${
                    done
                      ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20"
                      : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                  }`}
                >
                  {/* Header row: badge + name */}
                  <div className="flex items-start gap-2 mb-2">
                    <span
                      className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold ${
                        isUpdate
                          ? "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400"
                          : "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400"
                      }`}
                    >
                      {isUpdate
                        ? lang === "he" ? "✏️ עדכון קיים" : "✏️ Update existing"
                        : lang === "he" ? "✨ חדש" : "✨ New"}
                    </span>
                    <p className="font-medium text-zinc-900 dark:text-zinc-50 flex-1">
                      {lang === "he" ? s.nameHe : s.nameEn}
                    </p>
                  </div>

                  {/* Show what existing subtopic will be updated */}
                  {isUpdate && matchedExisting && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 mb-2">
                      {lang === "he" ? "מעדכן: " : "Updating: "}
                      <span className="font-medium">
                        {lang === "he" ? matchedExisting.nameHe : matchedExisting.nameEn}
                      </span>
                    </p>
                  )}

                  <p className="text-sm text-zinc-500 mb-3 line-clamp-3">
                    {lang === "he" ? s.contentHe : s.contentEn}
                  </p>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Toggle button — only show if matchedSubtopicId exists */}
                    {s.matchedSubtopicId && !done && (
                      <button
                        onClick={() => toggleAction(index, s)}
                        className="px-3 py-1 rounded-lg text-xs border border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400 hover:border-zinc-500 dark:hover:border-zinc-400 transition-colors"
                      >
                        {isUpdate
                          ? lang === "he" ? "➕ צור חדש במקום" : "➕ Create new instead"
                          : lang === "he" ? "✏️ עדכן קיים במקום" : "✏️ Update existing instead"}
                      </button>
                    )}

                    <button
                      onClick={() => handleAction(index, s)}
                      disabled={done}
                      className={`ml-auto shrink-0 px-4 py-1.5 rounded-lg text-sm font-medium text-white transition-colors disabled:cursor-default ${
                        done
                          ? "bg-zinc-300 dark:bg-zinc-600"
                          : isUpdate
                          ? "bg-amber-600 hover:bg-amber-700"
                          : "bg-emerald-600 hover:bg-emerald-700"
                      }`}
                    >
                      {done
                        ? lang === "he" ? "✓ בוצע" : "✓ Done"
                        : isUpdate
                        ? lang === "he" ? "עדכן" : "Update"
                        : dict.upload.addToDb}
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
