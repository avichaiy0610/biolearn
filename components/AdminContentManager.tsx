"use client";

import { useState } from "react";
import type { Locale } from "@/lib/dictionaries";

type ProcessStep = { id: string; order: number; titleHe: string; titleEn: string; descHe: string; descEn: string };
type Process = { id: string; slug: string; nameHe: string; nameEn: string; descHe: string; descEn: string; steps: ProcessStep[] };
type Subtopic = { id: string; slug: string; nameHe: string; nameEn: string; contentHe: string; contentEn: string };
type Topic = { id: string; slug: string; nameHe: string; nameEn: string; descHe: string; descEn: string; category: string; icon: string; subtopics: Subtopic[]; processes: Process[] };

const CATEGORIES = [
  { value: "molecular", labelHe: "ביולוגיה מולקולרית", labelEn: "Molecular Biology" },
  { value: "cell", labelHe: "ביולוגיה של התא", labelEn: "Cell Biology" },
  { value: "genetics", labelHe: "גנטיקה", labelEn: "Genetics" },
  { value: "biochemistry", labelHe: "ביוכימיה", labelEn: "Biochemistry" },
  { value: "microbiology", labelHe: "מיקרוביולוגיה", labelEn: "Microbiology" },
  { value: "physiology", labelHe: "פיזיולוגיה", labelEn: "Physiology" },
];

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "").slice(0, 50);
}

function Input({ label, value, onChange, dir = "ltr", placeholder }: {
  label: string; value: string; onChange: (v: string) => void; dir?: "ltr" | "rtl"; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        dir={dir}
        placeholder={placeholder}
        className="w-full h-9 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
    </div>
  );
}

function Textarea({ label, value, onChange, dir = "ltr", rows = 3 }: {
  label: string; value: string; onChange: (v: string) => void; dir?: "ltr" | "rtl"; rows?: number;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        dir={dir}
        rows={rows}
        className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-y"
      />
    </div>
  );
}

// ─── Create Topic Form ────────────────────────────────────────────────────────

function CreateTopicForm({ lang, onCreated }: { lang: Locale; onCreated: (t: Topic) => void }) {
  const isHe = lang === "he";
  const [nameHe, setNameHe] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [descHe, setDescHe] = useState("");
  const [descEn, setDescEn] = useState("");
  const [category, setCategory] = useState("cell");
  const [icon, setIcon] = useState("🔬");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    const slug = slugify(nameEn);
    const res = await fetch("/api/admin/topics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, nameHe, nameEn, descHe, descEn, category, icon }),
    });
    const data = await res.json();
    if (!res.ok) { setErr(data.error ?? "Error"); setLoading(false); return; }
    onCreated({ ...data, subtopics: [], processes: [] });
    setNameHe(""); setNameEn(""); setDescHe(""); setDescEn("");
    setLoading(false);
  }

  return (
    <form onSubmit={submit} className="space-y-3 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20">
      <h3 className="font-semibold text-emerald-800 dark:text-emerald-300 text-sm">
        {isHe ? "✚ נושא חדש" : "✚ New Topic"}
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <Input label={isHe ? "שם בעברית" : "Hebrew Name"} value={nameHe} onChange={setNameHe} dir="rtl" />
        <Input label={isHe ? "שם באנגלית" : "English Name"} value={nameEn} onChange={setNameEn} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Textarea label={isHe ? "תיאור בעברית" : "Hebrew Desc"} value={descHe} onChange={setDescHe} dir="rtl" rows={2} />
        <Textarea label={isHe ? "תיאור באנגלית" : "English Desc"} value={descEn} onChange={setDescEn} rows={2} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
            {isHe ? "קטגוריה" : "Category"}
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full h-9 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {isHe ? c.labelHe : c.labelEn}
              </option>
            ))}
          </select>
        </div>
        <Input label={isHe ? "אייקון (emoji)" : "Icon (emoji)"} value={icon} onChange={setIcon} placeholder="🔬" />
      </div>
      {err && <p className="text-xs text-red-500">{err}</p>}
      <button
        type="submit"
        disabled={loading || !nameHe || !nameEn || !descHe || !descEn}
        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium disabled:opacity-50 transition-colors"
      >
        {loading ? "..." : isHe ? "צור נושא" : "Create Topic"}
      </button>
    </form>
  );
}

// ─── Create Subtopic Form ─────────────────────────────────────────────────────

function CreateSubtopicForm({ topic, lang, onCreated }: {
  topic: Topic; lang: Locale; onCreated: (s: Subtopic) => void
}) {
  const isHe = lang === "he";
  const [nameHe, setNameHe] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [contentHe, setContentHe] = useState("");
  const [contentEn, setContentEn] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    const res = await fetch("/api/admin/subtopics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topicSlug: topic.slug, nameHe, nameEn, contentHe, contentEn }),
    });
    const data = await res.json();
    if (!res.ok) { setErr(data.error ?? "Error"); setLoading(false); return; }
    onCreated(data);
    setNameHe(""); setNameEn(""); setContentHe(""); setContentEn("");
    setLoading(false);
  }

  return (
    <form onSubmit={submit} className="space-y-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 mt-3">
      <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        {isHe ? "✚ תת-נושא חדש" : "✚ New Subtopic"}
      </p>
      <div className="grid grid-cols-2 gap-3">
        <Input label={isHe ? "שם בעברית" : "Hebrew Name"} value={nameHe} onChange={setNameHe} dir="rtl" />
        <Input label={isHe ? "שם באנגלית" : "English Name"} value={nameEn} onChange={setNameEn} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Textarea label={isHe ? "תוכן בעברית" : "Hebrew Content"} value={contentHe} onChange={setContentHe} dir="rtl" />
        <Textarea label={isHe ? "תוכן באנגלית" : "English Content"} value={contentEn} onChange={setContentEn} />
      </div>
      {err && <p className="text-xs text-red-500">{err}</p>}
      <button
        type="submit"
        disabled={loading || !nameHe || !nameEn || !contentHe || !contentEn}
        className="px-3 py-1.5 rounded-lg bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-medium disabled:opacity-50 transition-colors hover:bg-zinc-700 dark:hover:bg-zinc-300"
      >
        {loading ? "..." : isHe ? "הוסף תת-נושא" : "Add Subtopic"}
      </button>
    </form>
  );
}

// ─── Create Process Form ──────────────────────────────────────────────────────

function CreateProcessForm({ topic, lang, onCreated }: {
  topic: Topic; lang: Locale; onCreated: (p: Process) => void
}) {
  const isHe = lang === "he";
  const [nameHe, setNameHe] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [descHe, setDescHe] = useState("");
  const [descEn, setDescEn] = useState("");
  const [steps, setSteps] = useState([
    { titleHe: "", titleEn: "", descHe: "", descEn: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  function addStep() {
    setSteps((prev) => [...prev, { titleHe: "", titleEn: "", descHe: "", descEn: "" }]);
  }

  function removeStep(i: number) {
    setSteps((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateStep(i: number, key: string, value: string) {
    setSteps((prev) => prev.map((s, idx) => (idx === i ? { ...s, [key]: value } : s)));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    const res = await fetch("/api/admin/processes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topicSlug: topic.slug, nameHe, nameEn, descHe, descEn, steps }),
    });
    const data = await res.json();
    if (!res.ok) { setErr(data.error ?? "Error"); setLoading(false); return; }
    onCreated(data);
    setNameHe(""); setNameEn(""); setDescHe(""); setDescEn("");
    setSteps([{ titleHe: "", titleEn: "", descHe: "", descEn: "" }]);
    setLoading(false);
  }

  return (
    <form onSubmit={submit} className="space-y-3 p-4 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20 mt-3">
      <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">
        {isHe ? "✚ תהליך / אנימציה חדש" : "✚ New Process / Animation"}
      </p>
      <div className="grid grid-cols-2 gap-3">
        <Input label={isHe ? "שם בעברית" : "Hebrew Name"} value={nameHe} onChange={setNameHe} dir="rtl" />
        <Input label={isHe ? "שם באנגלית" : "English Name"} value={nameEn} onChange={setNameEn} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Textarea label={isHe ? "תיאור בעברית" : "Hebrew Desc"} value={descHe} onChange={setDescHe} dir="rtl" rows={2} />
        <Textarea label={isHe ? "תיאור באנגלית" : "English Desc"} value={descEn} onChange={setDescEn} rows={2} />
      </div>

      <div className="space-y-3">
        <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
          {isHe ? "שלבי האנימציה" : "Animation Steps"}
        </p>
        {steps.map((s, i) => (
          <div key={i} className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 space-y-2 bg-white dark:bg-zinc-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500">
                {isHe ? `שלב ${i + 1}` : `Step ${i + 1}`}
              </span>
              {steps.length > 1 && (
                <button type="button" onClick={() => removeStep(i)}
                  className="text-xs text-red-500 hover:text-red-700">✕</button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input label={isHe ? "כותרת עברית" : "Hebrew Title"} value={s.titleHe} onChange={(v) => updateStep(i, "titleHe", v)} dir="rtl" />
              <Input label={isHe ? "כותרת אנגלית" : "English Title"} value={s.titleEn} onChange={(v) => updateStep(i, "titleEn", v)} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Textarea label={isHe ? "תיאור עברי" : "Hebrew Desc"} value={s.descHe} onChange={(v) => updateStep(i, "descHe", v)} dir="rtl" rows={2} />
              <Textarea label={isHe ? "תיאור אנגלי" : "English Desc"} value={s.descEn} onChange={(v) => updateStep(i, "descEn", v)} rows={2} />
            </div>
          </div>
        ))}
        <button type="button" onClick={addStep}
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
          + {isHe ? "הוסף שלב" : "Add step"}
        </button>
      </div>

      {err && <p className="text-xs text-red-500">{err}</p>}
      <button
        type="submit"
        disabled={loading || !nameHe || !nameEn || !descHe || !descEn}
        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium disabled:opacity-50 transition-colors"
      >
        {loading ? "..." : isHe ? "צור תהליך" : "Create Process"}
      </button>
    </form>
  );
}

// ─── Topic Card ───────────────────────────────────────────────────────────────

function TopicCard({ topic, lang, onTopicDeleted, onSubtopicAdded, onProcessAdded, onSubtopicDeleted, onProcessDeleted }: {
  topic: Topic;
  lang: Locale;
  onTopicDeleted: (slug: string) => void;
  onSubtopicAdded: (topicSlug: string, s: Subtopic) => void;
  onProcessAdded: (topicSlug: string, p: Process) => void;
  onSubtopicDeleted: (topicSlug: string, id: string) => void;
  onProcessDeleted: (topicSlug: string, slug: string) => void;
}) {
  const isHe = lang === "he";
  const [expanded, setExpanded] = useState(false);
  const [showSubtopicForm, setShowSubtopicForm] = useState(false);
  const [showProcessForm, setShowProcessForm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function deleteTopic() {
    if (!confirm(isHe ? `האם למחוק את "${topic.nameHe}"?` : `Delete "${topic.nameEn}"?`)) return;
    setDeleting(true);
    await fetch(`/api/admin/topics/${topic.slug}`, { method: "DELETE" });
    onTopicDeleted(topic.slug);
  }

  async function deleteSubtopic(id: string, name: string) {
    if (!confirm(isHe ? `מחק "${name}"?` : `Delete "${name}"?`)) return;
    await fetch(`/api/admin/subtopics/${id}`, { method: "DELETE" });
    onSubtopicDeleted(topic.slug, id);
  }

  async function deleteProcess(slug: string, name: string) {
    if (!confirm(isHe ? `מחק "${name}"?` : `Delete "${name}"?`)) return;
    await fetch(`/api/admin/processes/${slug}`, { method: "DELETE" });
    onProcessDeleted(topic.slug, slug);
  }

  return (
    <div className={`rounded-2xl border ${deleting ? "opacity-40" : ""} border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800`}>
      {/* Header */}
      <div className="flex items-center gap-3 p-5">
        <span className="text-2xl">{topic.icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
            {isHe ? topic.nameHe : topic.nameEn}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {topic.subtopics.length} {isHe ? "תתי-נושאים" : "subtopics"} ·{" "}
            {topic.processes.length} {isHe ? "תהליכים" : "processes"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="px-3 py-1.5 rounded-lg text-xs border border-zinc-200 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
          >
            {expanded ? (isHe ? "סגור" : "Close") : (isHe ? "ערוך" : "Edit")}
          </button>
          <button
            onClick={deleteTopic}
            disabled={deleting}
            className="px-3 py-1.5 rounded-lg text-xs border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            {isHe ? "מחק" : "Delete"}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-zinc-100 dark:border-zinc-700 pt-4">
          {/* Subtopics */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {isHe ? "תתי-נושאים" : "Subtopics"}
              </p>
              <button
                onClick={() => setShowSubtopicForm((v) => !v)}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                {showSubtopicForm ? (isHe ? "ביטול" : "Cancel") : (isHe ? "+ הוסף" : "+ Add")}
              </button>
            </div>
            {topic.subtopics.length === 0 ? (
              <p className="text-xs text-zinc-400">{isHe ? "אין תתי-נושאים" : "No subtopics yet"}</p>
            ) : (
              <ul className="space-y-1">
                {topic.subtopics.map((s) => (
                  <li key={s.id} className="flex items-center justify-between py-1 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-700/50 text-sm">
                    <span>{isHe ? s.nameHe : s.nameEn}</span>
                    <button
                      onClick={() => deleteSubtopic(s.id, isHe ? s.nameHe : s.nameEn)}
                      className="text-xs text-red-500 hover:text-red-700"
                    >✕</button>
                  </li>
                ))}
              </ul>
            )}
            {showSubtopicForm && (
              <CreateSubtopicForm
                topic={topic}
                lang={lang}
                onCreated={(s) => {
                  onSubtopicAdded(topic.slug, s);
                  setShowSubtopicForm(false);
                }}
              />
            )}
          </div>

          {/* Processes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {isHe ? "תהליכים / אנימציות" : "Processes / Animations"}
              </p>
              <button
                onClick={() => setShowProcessForm((v) => !v)}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                {showProcessForm ? (isHe ? "ביטול" : "Cancel") : (isHe ? "+ הוסף" : "+ Add")}
              </button>
            </div>
            {topic.processes.length === 0 ? (
              <p className="text-xs text-zinc-400">{isHe ? "אין תהליכים" : "No processes yet"}</p>
            ) : (
              <ul className="space-y-1">
                {topic.processes.map((p) => (
                  <li key={p.id} className="flex items-center justify-between py-1 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-700/50 text-sm">
                    <span>
                      {isHe ? p.nameHe : p.nameEn}
                      <span className="text-xs text-zinc-400 ms-2">({p.steps.length} {isHe ? "שלבים" : "steps"})</span>
                    </span>
                    <button
                      onClick={() => deleteProcess(p.slug, isHe ? p.nameHe : p.nameEn)}
                      className="text-xs text-red-500 hover:text-red-700"
                    >✕</button>
                  </li>
                ))}
              </ul>
            )}
            {showProcessForm && (
              <CreateProcessForm
                topic={topic}
                lang={lang}
                onCreated={(p) => {
                  onProcessAdded(topic.slug, p);
                  setShowProcessForm(false);
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminContentManager({
  topics: initialTopics,
  lang,
}: {
  topics: Topic[];
  lang: Locale;
  dict: object;
}) {
  const isHe = lang === "he";
  const [topics, setTopics] = useState<Topic[]>(initialTopics);
  const [showCreateTopic, setShowCreateTopic] = useState(false);

  function handleTopicCreated(t: Topic) {
    setTopics((prev) => [...prev, t]);
    setShowCreateTopic(false);
  }

  function handleTopicDeleted(slug: string) {
    setTopics((prev) => prev.filter((t) => t.slug !== slug));
  }

  function handleSubtopicAdded(topicSlug: string, s: Subtopic) {
    setTopics((prev) =>
      prev.map((t) => t.slug === topicSlug ? { ...t, subtopics: [...t.subtopics, s] } : t)
    );
  }

  function handleProcessAdded(topicSlug: string, p: Process) {
    setTopics((prev) =>
      prev.map((t) => t.slug === topicSlug ? { ...t, processes: [...t.processes, p] } : t)
    );
  }

  function handleSubtopicDeleted(topicSlug: string, id: string) {
    setTopics((prev) =>
      prev.map((t) => t.slug === topicSlug ? { ...t, subtopics: t.subtopics.filter((s) => s.id !== id) } : t)
    );
  }

  function handleProcessDeleted(topicSlug: string, slug: string) {
    setTopics((prev) =>
      prev.map((t) => t.slug === topicSlug ? { ...t, processes: t.processes.filter((p) => p.slug !== slug) } : t)
    );
  }

  return (
    <div className="space-y-6">
      {/* Create topic toggle */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowCreateTopic((v) => !v)}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors"
        >
          {showCreateTopic
            ? (isHe ? "ביטול" : "Cancel")
            : (isHe ? "+ נושא חדש" : "+ New Topic")}
        </button>
      </div>

      {showCreateTopic && (
        <CreateTopicForm lang={lang} onCreated={handleTopicCreated} />
      )}

      {topics.length === 0 ? (
        <div className="text-center py-16 text-zinc-400">
          <div className="text-4xl mb-3">📚</div>
          <p className="text-sm">{isHe ? "אין נושאים עדיין" : "No topics yet"}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {topics.map((topic) => (
            <TopicCard
              key={topic.slug}
              topic={topic}
              lang={lang}
              onTopicDeleted={handleTopicDeleted}
              onSubtopicAdded={handleSubtopicAdded}
              onProcessAdded={handleProcessAdded}
              onSubtopicDeleted={handleSubtopicDeleted}
              onProcessDeleted={handleProcessDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
}
