"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/dictionaries";

type ProcessStep = { id: string; order: number; titleHe: string; titleEn: string; descHe: string; descEn: string };
type Process = { id: string; slug: string; nameHe: string; nameEn: string; descHe: string; descEn: string; steps: ProcessStep[] };
type Subtopic = { id: string; slug: string; nameHe: string; nameEn: string; contentHe: string; contentEn: string; relatedProcessSlug?: string | null };
type Topic = { id: string; slug: string; nameHe: string; nameEn: string; descHe: string; descEn: string; category: string; icon: string; subtopics: Subtopic[]; processes: Process[] };

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "").slice(0, 50);
}

function Input({ label, value, onChange, dir = "ltr", placeholder, list }: {
  label: string; value: string; onChange: (v: string) => void; dir?: "ltr" | "rtl"; placeholder?: string; list?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        dir={dir}
        placeholder={placeholder}
        list={list}
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

function CreateTopicForm({ lang, existingCategories, onCreated }: {
  lang: Locale; existingCategories: string[]; onCreated: (t: Topic) => void;
}) {
  const isHe = lang === "he";
  const [nameHe, setNameHe] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [descHe, setDescHe] = useState("");
  const [descEn, setDescEn] = useState("");
  const [category, setCategory] = useState("");
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
      body: JSON.stringify({ slug, nameHe, nameEn, descHe, descEn, category: category || "general", icon }),
    });
    const data = await res.json();
    if (!res.ok) { setErr(data.error ?? "Error"); setLoading(false); return; }
    onCreated({ ...data, subtopics: [], processes: [] });
    setNameHe(""); setNameEn(""); setDescHe(""); setDescEn(""); setCategory("");
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
            {isHe ? "קטגוריה (תגית חופשית)" : "Category (free label)"}
          </label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            list="category-suggestions"
            placeholder={isHe ? "לדוגמה: גנטיקה, אקולוגיה..." : "e.g. genetics, ecology..."}
            className="w-full h-9 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <datalist id="category-suggestions">
            {existingCategories.map((c) => <option key={c} value={c} />)}
            <option value="molecular" />
            <option value="cell" />
            <option value="genetics" />
            <option value="biochemistry" />
            <option value="physiology" />
            <option value="ecology" />
          </datalist>
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
  topic: Topic; lang: Locale; onCreated: (s: Subtopic) => void;
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
    setLoading(true); setErr("");
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
  topic: Topic; lang: Locale; onCreated: (p: Process) => void;
}) {
  const isHe = lang === "he";
  const [nameHe, setNameHe] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [descHe, setDescHe] = useState("");
  const [descEn, setDescEn] = useState("");
  const [steps, setSteps] = useState([{ titleHe: "", titleEn: "", descHe: "", descEn: "" }]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  function addStep() { setSteps((prev) => [...prev, { titleHe: "", titleEn: "", descHe: "", descEn: "" }]); }
  function removeStep(i: number) { setSteps((prev) => prev.filter((_, idx) => idx !== i)); }
  function updateStep(i: number, key: string, value: string) {
    setSteps((prev) => prev.map((s, idx) => (idx === i ? { ...s, [key]: value } : s)));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setErr("");
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
              <span className="text-xs font-medium text-zinc-500">{isHe ? `שלב ${i + 1}` : `Step ${i + 1}`}</span>
              {steps.length > 1 && (
                <button type="button" onClick={() => removeStep(i)} className="text-xs text-red-500 hover:text-red-700">✕</button>
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
        <button type="button" onClick={addStep} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
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

// ─── Subtopic Row ─────────────────────────────────────────────────────────────

function SubtopicRow({ subtopic, topic, allTopics, lang, onDeleted, onMoved, onAnimationGenerated }: {
  subtopic: Subtopic; topic: Topic; allTopics: Topic[]; lang: Locale;
  onDeleted: () => void; onMoved: (newTopicSlug: string) => void; onAnimationGenerated: (s: Subtopic) => void;
}) {
  const isHe = lang === "he";
  const [moveTo, setMoveTo] = useState("");
  const [moving, setMoving] = useState(false);
  const [generatingAnim, setGeneratingAnim] = useState(false);

  async function handleMove() {
    if (!moveTo) return;
    setMoving(true);
    await fetch(`/api/admin/subtopics/${subtopic.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newTopicSlug: moveTo }),
    });
    onMoved(moveTo);
    setMoving(false);
    setMoveTo("");
  }

  async function generateAnimation() {
    setGeneratingAnim(true);
    const res = await fetch("/api/admin/generate-animation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subtopicId: subtopic.id }),
    });
    const data = await res.json();
    if (res.ok) {
      onAnimationGenerated({ ...subtopic, relatedProcessSlug: data.processSlug });
      alert(isHe
        ? `✅ האנימציה נוצרה! (${data.stepsCreated} שלבים)`
        : `✅ Animation created! (${data.stepsCreated} steps)`);
    } else {
      alert(data.error ?? (isHe ? "שגיאה ביצירת אנימציה" : "Animation generation failed"));
    }
    setGeneratingAnim(false);
  }

  async function handleDelete() {
    if (!confirm(isHe ? `מחק "${isHe ? subtopic.nameHe : subtopic.nameEn}"?` : `Delete "${subtopic.nameEn}"?`)) return;
    await fetch(`/api/admin/subtopics/${subtopic.id}`, { method: "DELETE" });
    onDeleted();
  }

  const otherTopics = allTopics.filter((t) => t.slug !== topic.slug);

  return (
    <li className="flex flex-col gap-2 py-2 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-700/50">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm flex-1 min-w-0 truncate">{isHe ? subtopic.nameHe : subtopic.nameEn}</span>
        <div className="flex items-center gap-1.5 shrink-0">
          {subtopic.relatedProcessSlug ? (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
              {isHe ? "🎬 יש אנימציה" : "🎬 animated"}
            </span>
          ) : (
            <button
              onClick={generateAnimation}
              disabled={generatingAnim}
              title={isHe ? "צור אנימציה AI" : "Generate AI animation"}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50"
            >
              {generatingAnim ? "⏳" : (isHe ? "✨ אנימציה" : "✨ Animate")}
            </button>
          )}
          <button onClick={handleDelete} className="text-xs text-red-500 hover:text-red-700">✕</button>
        </div>
      </div>
      {otherTopics.length > 0 && (
        <div className="flex items-center gap-2">
          <select
            value={moveTo}
            onChange={(e) => setMoveTo(e.target.value)}
            className="flex-1 h-7 rounded border border-zinc-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-2 text-xs focus:outline-none"
          >
            <option value="">{isHe ? "העבר לנושא..." : "Move to topic..."}</option>
            {otherTopics.map((t) => (
              <option key={t.slug} value={t.slug}>{isHe ? t.nameHe : t.nameEn}</option>
            ))}
          </select>
          {moveTo && (
            <button
              onClick={handleMove}
              disabled={moving}
              className="px-2 py-0.5 rounded text-xs bg-zinc-700 dark:bg-zinc-300 text-white dark:text-zinc-900 hover:bg-zinc-600 dark:hover:bg-zinc-400 disabled:opacity-50 transition-colors"
            >
              {moving ? "..." : (isHe ? "העבר" : "Move")}
            </button>
          )}
        </div>
      )}
    </li>
  );
}

// ─── Process Row ──────────────────────────────────────────────────────────────

function ProcessRow({ process, topic, allTopics, lang, onDeleted, onMoved }: {
  process: Process; topic: Topic; allTopics: Topic[]; lang: Locale;
  onDeleted: () => void; onMoved: (newTopicSlug: string) => void;
}) {
  const isHe = lang === "he";
  const [moveTo, setMoveTo] = useState("");
  const [moving, setMoving] = useState(false);
  const otherTopics = allTopics.filter((t) => t.slug !== topic.slug);

  async function handleMove() {
    if (!moveTo) return;
    setMoving(true);
    await fetch(`/api/admin/processes/${process.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newTopicSlug: moveTo }),
    });
    onMoved(moveTo);
    setMoving(false); setMoveTo("");
  }

  async function handleDelete() {
    if (!confirm(isHe ? `מחק "${isHe ? process.nameHe : process.nameEn}"?` : `Delete "${process.nameEn}"?`)) return;
    await fetch(`/api/admin/processes/${process.slug}`, { method: "DELETE" });
    onDeleted();
  }

  return (
    <li className="flex flex-col gap-2 py-2 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-700/50">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm flex-1 min-w-0 truncate">
          {isHe ? process.nameHe : process.nameEn}
          <span className="text-xs text-zinc-400 ms-1">({process.steps.length} {isHe ? "שלבים" : "steps"})</span>
        </span>
        <button onClick={handleDelete} className="text-xs text-red-500 hover:text-red-700 shrink-0">✕</button>
      </div>
      {otherTopics.length > 0 && (
        <div className="flex items-center gap-2">
          <select
            value={moveTo}
            onChange={(e) => setMoveTo(e.target.value)}
            className="flex-1 h-7 rounded border border-zinc-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-2 text-xs focus:outline-none"
          >
            <option value="">{isHe ? "העבר לנושא..." : "Move to topic..."}</option>
            {otherTopics.map((t) => (
              <option key={t.slug} value={t.slug}>{isHe ? t.nameHe : t.nameEn}</option>
            ))}
          </select>
          {moveTo && (
            <button
              onClick={handleMove}
              disabled={moving}
              className="px-2 py-0.5 rounded text-xs bg-zinc-700 dark:bg-zinc-300 text-white dark:text-zinc-900 hover:bg-zinc-600 disabled:opacity-50 transition-colors"
            >
              {moving ? "..." : (isHe ? "העבר" : "Move")}
            </button>
          )}
        </div>
      )}
    </li>
  );
}

// ─── Topic Card ───────────────────────────────────────────────────────────────

function TopicCard({ topic, allTopics, lang, onTopicDeleted, onSubtopicAdded, onProcessAdded,
  onSubtopicDeleted, onProcessDeleted, onSubtopicMoved, onProcessMoved, onSubtopicAnimated }: {
  topic: Topic; allTopics: Topic[]; lang: Locale;
  onTopicDeleted: (slug: string) => void;
  onSubtopicAdded: (topicSlug: string, s: Subtopic) => void;
  onProcessAdded: (topicSlug: string, p: Process) => void;
  onSubtopicDeleted: (topicSlug: string, id: string) => void;
  onProcessDeleted: (topicSlug: string, slug: string) => void;
  onSubtopicMoved: (fromSlug: string, subtopicId: string, toTopicSlug: string) => void;
  onProcessMoved: (fromSlug: string, processSlug: string, toTopicSlug: string) => void;
  onSubtopicAnimated: (topicSlug: string, s: Subtopic) => void;
}) {
  const isHe = lang === "he";
  const [expanded, setExpanded] = useState(false);
  const [showSubtopicForm, setShowSubtopicForm] = useState(false);
  const [showProcessForm, setShowProcessForm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function deleteTopic() {
    if (!confirm(isHe ? `למחוק את "${topic.nameHe}"?` : `Delete "${topic.nameEn}"?`)) return;
    setDeleting(true);
    await fetch(`/api/admin/topics/${topic.slug}`, { method: "DELETE" });
    onTopicDeleted(topic.slug);
  }

  return (
    <div className={`rounded-2xl border ${deleting ? "opacity-40" : ""} border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800`}>
      <div className="flex items-center gap-3 p-5">
        <span className="text-2xl">{topic.icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">{isHe ? topic.nameHe : topic.nameEn}</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {topic.subtopics.length} {isHe ? "תתי-נושאים" : "subtopics"} · {topic.processes.length} {isHe ? "תהליכים" : "processes"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setExpanded((v) => !v)}
            className="px-3 py-1.5 rounded-lg text-xs border border-zinc-200 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">
            {expanded ? (isHe ? "סגור" : "Close") : (isHe ? "ערוך" : "Manage")}
          </button>
          <button onClick={deleteTopic} disabled={deleting}
            className="px-3 py-1.5 rounded-lg text-xs border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
            {isHe ? "מחק" : "Delete"}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-5 pb-5 space-y-5 border-t border-zinc-100 dark:border-zinc-700 pt-4">
          {/* Subtopics */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{isHe ? "תתי-נושאים" : "Subtopics"}</p>
              <button onClick={() => setShowSubtopicForm((v) => !v)}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline">
                {showSubtopicForm ? (isHe ? "ביטול" : "Cancel") : (isHe ? "+ הוסף" : "+ Add")}
              </button>
            </div>
            {topic.subtopics.length === 0 ? (
              <p className="text-xs text-zinc-400">{isHe ? "אין תתי-נושאים" : "No subtopics yet"}</p>
            ) : (
              <ul className="space-y-1">
                {topic.subtopics.map((s) => (
                  <SubtopicRow
                    key={s.id}
                    subtopic={s}
                    topic={topic}
                    allTopics={allTopics}
                    lang={lang}
                    onDeleted={() => onSubtopicDeleted(topic.slug, s.id)}
                    onMoved={(toSlug) => onSubtopicMoved(topic.slug, s.id, toSlug)}
                    onAnimationGenerated={(updated) => onSubtopicAnimated(topic.slug, updated)}
                  />
                ))}
              </ul>
            )}
            {showSubtopicForm && (
              <CreateSubtopicForm topic={topic} lang={lang}
                onCreated={(s) => { onSubtopicAdded(topic.slug, s); setShowSubtopicForm(false); }} />
            )}
          </div>

          {/* Processes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{isHe ? "תהליכים / אנימציות" : "Processes / Animations"}</p>
              <button onClick={() => setShowProcessForm((v) => !v)}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                {showProcessForm ? (isHe ? "ביטול" : "Cancel") : (isHe ? "+ הוסף" : "+ Add")}
              </button>
            </div>
            {topic.processes.length === 0 ? (
              <p className="text-xs text-zinc-400">{isHe ? "אין תהליכים" : "No processes yet"}</p>
            ) : (
              <ul className="space-y-1">
                {topic.processes.map((p) => (
                  <ProcessRow
                    key={p.id}
                    process={p}
                    topic={topic}
                    allTopics={allTopics}
                    lang={lang}
                    onDeleted={() => onProcessDeleted(topic.slug, p.slug)}
                    onMoved={(toSlug) => onProcessMoved(topic.slug, p.slug, toSlug)}
                  />
                ))}
              </ul>
            )}
            {showProcessForm && (
              <CreateProcessForm topic={topic} lang={lang}
                onCreated={(p) => { onProcessAdded(topic.slug, p); setShowProcessForm(false); }} />
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
  const router = useRouter();
  const [topics, setTopics] = useState<Topic[]>(initialTopics);
  const [showCreateTopic, setShowCreateTopic] = useState(false);

  const existingCategories = [...new Set(topics.map((t) => t.category).filter(Boolean))];

  function handleTopicCreated(t: Topic) {
    setTopics((prev) => [...prev, t]);
    setShowCreateTopic(false);
  }
  function handleTopicDeleted(slug: string) {
    setTopics((prev) => prev.filter((t) => t.slug !== slug));
  }
  function handleSubtopicAdded(topicSlug: string, s: Subtopic) {
    setTopics((prev) => prev.map((t) => t.slug === topicSlug ? { ...t, subtopics: [...t.subtopics, s] } : t));
  }
  function handleProcessAdded(topicSlug: string, p: Process) {
    setTopics((prev) => prev.map((t) => t.slug === topicSlug ? { ...t, processes: [...t.processes, p] } : t));
  }
  function handleSubtopicDeleted(topicSlug: string, id: string) {
    setTopics((prev) => prev.map((t) => t.slug === topicSlug ? { ...t, subtopics: t.subtopics.filter((s) => s.id !== id) } : t));
  }
  function handleProcessDeleted(topicSlug: string, slug: string) {
    setTopics((prev) => prev.map((t) => t.slug === topicSlug ? { ...t, processes: t.processes.filter((p) => p.slug !== slug) } : t));
  }
  function handleSubtopicMoved(fromSlug: string, subtopicId: string, toTopicSlug: string) {
    setTopics((prev) => {
      const subtopic = prev.find((t) => t.slug === fromSlug)?.subtopics.find((s) => s.id === subtopicId);
      if (!subtopic) return prev;
      return prev.map((t) => {
        if (t.slug === fromSlug) return { ...t, subtopics: t.subtopics.filter((s) => s.id !== subtopicId) };
        if (t.slug === toTopicSlug) return { ...t, subtopics: [...t.subtopics, subtopic] };
        return t;
      });
    });
  }
  function handleProcessMoved(fromSlug: string, processSlug: string, toTopicSlug: string) {
    setTopics((prev) => {
      const proc = prev.find((t) => t.slug === fromSlug)?.processes.find((p) => p.slug === processSlug);
      if (!proc) return prev;
      return prev.map((t) => {
        if (t.slug === fromSlug) return { ...t, processes: t.processes.filter((p) => p.slug !== processSlug) };
        if (t.slug === toTopicSlug) return { ...t, processes: [...t.processes, proc] };
        return t;
      });
    });
  }
  function handleSubtopicAnimated(topicSlug: string, updated: Subtopic) {
    setTopics((prev) => prev.map((t) =>
      t.slug === topicSlug
        ? { ...t, subtopics: t.subtopics.map((s) => s.id === updated.id ? updated : s) }
        : t
    ));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.refresh()}
          className="px-3 py-1.5 rounded-lg text-sm border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
        >
          {isHe ? "↻ רענן" : "↻ Refresh"}
        </button>
        <button
          onClick={() => setShowCreateTopic((v) => !v)}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors"
        >
          {showCreateTopic ? (isHe ? "ביטול" : "Cancel") : (isHe ? "+ נושא חדש" : "+ New Topic")}
        </button>
      </div>

      {showCreateTopic && (
        <CreateTopicForm lang={lang} existingCategories={existingCategories} onCreated={handleTopicCreated} />
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
              allTopics={topics}
              lang={lang}
              onTopicDeleted={handleTopicDeleted}
              onSubtopicAdded={handleSubtopicAdded}
              onProcessAdded={handleProcessAdded}
              onSubtopicDeleted={handleSubtopicDeleted}
              onProcessDeleted={handleProcessDeleted}
              onSubtopicMoved={handleSubtopicMoved}
              onProcessMoved={handleProcessMoved}
              onSubtopicAnimated={handleSubtopicAnimated}
            />
          ))}
        </div>
      )}
    </div>
  );
}
