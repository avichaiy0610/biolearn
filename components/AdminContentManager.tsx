"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/dictionaries";

type ProcessStep = { id: string; order: number; titleHe: string; titleEn: string; descHe: string; descEn: string };
type Process = { id: string; slug: string; nameHe: string; nameEn: string; descHe: string; descEn: string; steps: ProcessStep[] };
type Subtopic = { id: string; slug: string; nameHe: string; nameEn: string; contentHe: string; contentEn: string; relatedProcessSlug?: string | null; hidden?: boolean };
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

function SubtopicRow({ subtopic, topic, allTopics, lang, onDeleted, onMoved, onAnimationGenerated, mergeMode, selected, onToggleSelect }: {
  subtopic: Subtopic; topic: Topic; allTopics: Topic[]; lang: Locale;
  onDeleted: () => void; onMoved: (newTopicSlug: string) => void; onAnimationGenerated: (s: Subtopic) => void;
  mergeMode?: boolean; selected?: boolean; onToggleSelect?: () => void;
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
  // Validate animation actually exists in this topic's processes
  const animationExists = subtopic.relatedProcessSlug
    ? topic.processes.some((p) => p.slug === subtopic.relatedProcessSlug)
    : false;

  return (
    <li className={`flex flex-col gap-2 py-2 px-3 rounded-lg transition-colors ${selected ? "bg-violet-100 dark:bg-violet-900/30 border border-violet-300 dark:border-violet-700" : "bg-zinc-50 dark:bg-zinc-700/50"} ${subtopic.hidden ? "opacity-60" : ""}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {mergeMode && (
            <input type="checkbox" checked={!!selected} onChange={onToggleSelect}
              className="w-4 h-4 rounded accent-violet-600 shrink-0 cursor-pointer" />
          )}
          <span className="text-sm min-w-0 truncate">
            {isHe ? subtopic.nameHe : subtopic.nameEn}
            {subtopic.hidden && <span className="ml-1 text-xs text-zinc-400">(מוסתר)</span>}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {animationExists ? (
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

// ─── AI Suggestions Panel ────────────────────────────────────────────────────

type AISuggestion = { nameEn: string; nameHe: string; slug: string; contentEn?: string; contentHe?: string; descEn?: string; descHe?: string; reason: string; action?: "create" | "update"; matchedSubtopicId?: string };

function AISuggestPanel({ topicSlug, lang, onAddSubtopic, onClose }: {
  topicSlug: string; lang: Locale;
  onAddSubtopic: (s: Subtopic) => void;
  onClose: () => void;
}) {
  const isHe = lang === "he";
  const [loading, setLoading] = useState(true);
  const [subtopics, setSubtopics] = useState<AISuggestion[]>([]);
  const [processes, setProcesses] = useState<AISuggestion[]>([]);
  const [adding, setAdding] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/suggest-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topicSlug }),
    })
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error ?? "API error");
        return data;
      })
      .then((data) => { setSubtopics(data.subtopics ?? []); setProcesses(data.processes ?? []); })
      .catch((err) => setError(err.message ?? (isHe ? "שגיאה בטעינת הצעות" : "Failed to load suggestions")))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicSlug]);

  function toggleAction(slug: string) {
    setSubtopics((prev) => prev.map((s) => {
      if (s.slug !== slug || !s.matchedSubtopicId) return s;
      return { ...s, action: s.action === "update" ? "create" : "update" };
    }));
  }

  async function addSubtopic(s: AISuggestion) {
    setAdding(s.slug);
    if (s.action === "update" && s.matchedSubtopicId) {
      const res = await fetch("/api/admin/update-subtopic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subtopicId: s.matchedSubtopicId, nameHe: s.nameHe, nameEn: s.nameEn, contentHe: s.contentHe ?? "", contentEn: s.contentEn ?? "" }),
      });
      if (res.ok) setSubtopics((prev) => prev.filter((x) => x.slug !== s.slug));
    } else {
      const res = await fetch("/api/admin/subtopics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicSlug, nameHe: s.nameHe, nameEn: s.nameEn, contentHe: s.contentHe ?? "", contentEn: s.contentEn ?? "" }),
      });
      const data = await res.json();
      if (res.ok) {
        onAddSubtopic(data);
        setSubtopics((prev) => prev.filter((x) => x.slug !== s.slug));
      }
    }
    setAdding(null);
  }

  return (
    <div className="mt-4 p-4 rounded-xl border border-violet-200 dark:border-violet-800 bg-violet-50/50 dark:bg-violet-950/20 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-violet-800 dark:text-violet-300">
          🤖 {isHe ? "המלצות AI לתוכן חסר" : "AI Content Suggestions"}
        </p>
        <button onClick={onClose} className="text-xs text-zinc-500 hover:text-zinc-700">✕</button>
      </div>

      {loading && (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin shrink-0" />
          <p className="text-xs text-zinc-400 animate-pulse">{isHe ? "AI מנתח את הנושא ומחפש פערים..." : "AI is analyzing the topic for gaps..."}</p>
        </div>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}

      {!loading && subtopics.length === 0 && processes.length === 0 && !error && (
        <p className="text-xs text-zinc-400">{isHe ? "לא נמצאו חוסרים — הנושא נראה שלם!" : "No gaps found — topic looks complete!"}</p>
      )}

      {subtopics.length > 0 && (
        <div>
          <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-2">{isHe ? "תתי-נושאים מוצעים:" : "Suggested subtopics:"}</p>
          <div className="space-y-2">
            {subtopics.map((s) => (
              <div key={s.slug} className="flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-zinc-800 border border-violet-100 dark:border-violet-900">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                    {s.action === "update" ? (
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 font-medium">✏️ {isHe ? "עדכון קיים" : "Update existing"}</span>
                    ) : s.matchedSubtopicId ? (
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 font-medium">✨ {isHe ? "חדש" : "New"}</span>
                    ) : null}
                    <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{isHe ? s.nameHe : s.nameEn}</p>
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">{s.reason}</p>
                  {s.matchedSubtopicId && (
                    <button onClick={() => toggleAction(s.slug)} className="text-xs text-violet-500 hover:text-violet-700 mt-1 underline">
                      {s.action === "update"
                        ? (isHe ? "➕ צור חדש במקום" : "➕ Create new instead")
                        : (isHe ? "✏️ עדכן קיים במקום" : "✏️ Update existing instead")}
                    </button>
                  )}
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    onClick={() => addSubtopic(s)}
                    disabled={adding === s.slug}
                    className="px-2 py-1 rounded text-xs bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50 transition-colors"
                  >
                    {adding === s.slug ? "..." : s.action === "update" ? (isHe ? "✏️ עדכן" : "✏️ Update") : (isHe ? "➕ הוסף" : "➕ Add")}
                  </button>
                  <button
                    onClick={() => setSubtopics((prev) => prev.filter((x) => x.slug !== s.slug))}
                    className="px-2 py-0.5 rounded text-xs text-zinc-400 hover:text-zinc-600 border border-zinc-200 dark:border-zinc-700"
                  >
                    {isHe ? "דלג" : "Skip"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {processes.length > 0 && (
        <div>
          <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-2">{isHe ? "תהליכים מוצעים:" : "Suggested processes:"}</p>
          <div className="space-y-2">
            {processes.map((p) => (
              <div key={p.slug} className="flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-zinc-800 border border-blue-100 dark:border-blue-900">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{isHe ? p.nameHe : p.nameEn}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{p.reason}</p>
                </div>
                <span className="shrink-0 text-xs text-zinc-400 italic">{isHe ? "הוסף ידנית" : "Add manually"}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Merge Modal ──────────────────────────────────────────────────────────────

type MergedPreview = { nameEn: string; nameHe: string; slug: string; contentEn: string; contentHe: string };
type MergeSubtopicInfo = { id: string; nameHe: string; nameEn: string };

function MergeModal({ subtopics, lang, onConfirm, onCancel }: {
  subtopics: MergeSubtopicInfo[]; lang: Locale;
  onConfirm: (merged: MergedPreview, idsToDelete: string[], idsToHide: string[]) => void;
  onCancel: () => void;
}) {
  const isHe = lang === "he";
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<MergedPreview | null>(null);
  const [error, setError] = useState("");
  const [actions, setActions] = useState<Record<string, "delete" | "hide" | "keep">>({});
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    fetch("/api/admin/subtopics/merge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subtopicIds: subtopics.map((s) => s.id) }),
    })
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error ?? "AI request failed");
        return data;
      })
      .then((data) => {
        if (!data.merged) throw new Error(isHe ? "תגובת AI לא תקינה" : "Invalid AI response");
        setPreview(data.merged);
        const initial: Record<string, "delete" | "hide" | "keep"> = {};
        for (const s of subtopics) initial[s.id] = "delete";
        setActions(initial);
      })
      .catch((err) => setError(err.message ?? (isHe ? "שגיאה ביצירת תצוגה מקדימה" : "Failed to generate preview")))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleConfirm() {
    if (!preview) return;
    setConfirming(true);
    const idsToDelete = Object.entries(actions).filter(([, v]) => v === "delete").map(([id]) => id);
    const idsToHide = Object.entries(actions).filter(([, v]) => v === "hide").map(([id]) => id);
    onConfirm(preview, idsToDelete, idsToHide);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-zinc-800 shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            {isHe ? "מיזוג תתי-נושאים" : "Merge Subtopics"}
          </h2>
          <button onClick={onCancel} className="text-zinc-400 hover:text-zinc-600">✕</button>
        </div>

        {loading && (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <div className="text-center">
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {isHe ? "AI מנתח ומייצר תוכן מאוחד..." : "AI is generating merged content..."}
              </p>
              <p className="text-xs text-zinc-400 mt-1">{isHe ? "תהליך זה לוקח 10-20 שניות" : "This takes 10-20 seconds"}</p>
            </div>
          </div>
        )}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {preview && !loading && (
          <>
            <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/20 space-y-2">
              <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                {isHe ? "תת-נושא מאוחד (תצוגה מקדימה):" : "Merged subtopic (preview):"}
              </p>
              <p className="font-semibold text-zinc-900 dark:text-zinc-50">{isHe ? preview.nameHe : preview.nameEn}</p>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">{isHe ? preview.contentHe : preview.contentEn}</p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                {isHe ? "מה לעשות עם כל אחד מהמקוריים?" : "What to do with each original?"}
              </p>
              {subtopics.map((s) => (
                <div key={s.id} className="flex items-center gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700">
                  <span className="flex-1 text-sm text-zinc-800 dark:text-zinc-200">{isHe ? s.nameHe : s.nameEn}</span>
                  <div className="flex gap-2 text-xs">
                    {(["delete", "hide", "keep"] as const).map((action) => (
                      <label key={action} className="flex items-center gap-1 cursor-pointer">
                        <input type="radio" name={s.id} value={action}
                          checked={actions[s.id] === action}
                          onChange={() => setActions((prev) => ({ ...prev, [s.id]: action }))}
                          className="accent-emerald-600" />
                        <span className={action === "delete" ? "text-red-600" : action === "hide" ? "text-amber-600" : "text-zinc-500"}>
                          {action === "delete" ? (isHe ? "מחק" : "Delete") : action === "hide" ? (isHe ? "הסתר" : "Hide") : (isHe ? "השאר" : "Keep")}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={handleConfirm} disabled={confirming}
                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold disabled:opacity-50 transition-colors">
                {confirming ? "..." : (isHe ? "✓ אשר מיזוג" : "✓ Confirm Merge")}
              </button>
              <button onClick={onCancel}
                className="px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">
                {isHe ? "ביטול" : "Cancel"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
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
  const [showAISuggest, setShowAISuggest] = useState(false);
  const [mergeMode, setMergeMode] = useState(false);
  const [selectedForMerge, setSelectedForMerge] = useState<Set<string>>(new Set());
  const [mergeSubtopics, setMergeSubtopics] = useState<Array<{ id: string; nameHe: string; nameEn: string }> | null>(null);
  const [mergingConfirm, setMergingConfirm] = useState(false);

  function toggleMergeSelect(id: string) {
    setSelectedForMerge((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function startMerge() {
    const selected = topic.subtopics.filter((s) => selectedForMerge.has(s.id));
    setMergeSubtopics(selected.map((s) => ({ id: s.id, nameHe: s.nameHe, nameEn: s.nameEn })));
  }

  async function confirmMerge(merged: MergedPreview, idsToDelete: string[], idsToHide: string[]) {
    setMergingConfirm(true);
    const res = await fetch("/api/admin/subtopics/merge/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subtopicIds: mergeSubtopics!.map((s) => s.id), idsToDelete, idsToHide, merged }),
    });
    const newSubtopic = await res.json();
    if (res.ok) {
      for (const id of idsToDelete) onSubtopicDeleted(topic.slug, id);
      onSubtopicAdded(topic.slug, newSubtopic);
    }
    setMergeSubtopics(null);
    setMergeMode(false);
    setSelectedForMerge(new Set());
    setMergingConfirm(false);
  }

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
          <button
            onClick={() => { setExpanded((v) => !v); if (!expanded) { setShowAISuggest(false); setMergeMode(false); } }}
            className="px-3 py-1.5 rounded-lg text-xs border border-zinc-200 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">
            {expanded ? (isHe ? "סגור" : "Close") : (isHe ? "ערוך" : "Manage")}
          </button>
          {expanded && (
            <button
              onClick={() => setShowAISuggest((v) => !v)}
              className="px-3 py-1.5 rounded-lg text-xs border border-violet-200 dark:border-violet-700 text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors">
              🤖 {isHe ? "הצע תוכן" : "Suggest"}
            </button>
          )}
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
              <div className="flex items-center gap-2">
                {topic.subtopics.length >= 2 && (
                  <button
                    onClick={() => { setMergeMode((v) => !v); setSelectedForMerge(new Set()); }}
                    className={`text-xs hover:underline ${mergeMode ? "text-red-500" : "text-violet-600 dark:text-violet-400"}`}>
                    {mergeMode ? (isHe ? "בטל מיזוג" : "Cancel merge") : (isHe ? "⛓ מזג" : "⛓ Merge")}
                  </button>
                )}
                <button onClick={() => setShowSubtopicForm((v) => !v)}
                  className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline">
                  {showSubtopicForm ? (isHe ? "ביטול" : "Cancel") : (isHe ? "+ הוסף" : "+ Add")}
                </button>
              </div>
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
                    mergeMode={mergeMode}
                    selected={selectedForMerge.has(s.id)}
                    onToggleSelect={() => toggleMergeSelect(s.id)}
                  />
                ))}
              </ul>
            )}
            {mergeMode && selectedForMerge.size >= 2 && (
              <button
                onClick={startMerge}
                className="mt-2 w-full py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors">
                {isHe ? `⛓ מזג ${selectedForMerge.size} נבחרים` : `⛓ Merge ${selectedForMerge.size} selected`}
              </button>
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

          {showAISuggest && (
            <AISuggestPanel
              topicSlug={topic.slug}
              lang={lang}
              onAddSubtopic={(s) => onSubtopicAdded(topic.slug, s)}
              onClose={() => setShowAISuggest(false)}
            />
          )}
        </div>
      )}

      {mergeSubtopics && (
        <MergeModal
          subtopics={mergeSubtopics}
          lang={lang}
          onConfirm={confirmMerge}
          onCancel={() => { setMergeSubtopics(null); }}
        />
      )}
    </div>
  );
}

// ─── University Research Panel ────────────────────────────────────────────────

type UniversitySubtopicSuggestion = { slug: string; nameEn: string; nameHe: string; contentEn: string; contentHe: string };
type UniversityTopicSuggestion = {
  slug: string; nameEn: string; nameHe: string; descEn: string; descHe: string;
  category: string; icon: string; reason: string;
  subtopics: UniversitySubtopicSuggestion[];
};

function UniversityResearchPanel({ lang, onTopicAdded, onClose }: {
  lang: Locale; onTopicAdded: (t: Topic) => void; onClose: () => void;
}) {
  const isHe = lang === "he";
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<UniversityTopicSuggestion[]>([]);
  const [adding, setAdding] = useState<string | null>(null);
  const [addedSlugs, setAddedSlugs] = useState<Set<string>>(new Set());
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/research-university-topics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lang }),
    })
      .then((r) => r.json())
      .then((data) => setSuggestions(data.suggestions ?? []))
      .catch(() => setError(isHe ? "שגיאה בטעינת ההמלצות" : "Failed to load suggestions"))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function addTopic(s: UniversityTopicSuggestion) {
    setAdding(s.slug);
    try {
      const res = await fetch("/api/admin/topics/with-subtopics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: s.slug, nameEn: s.nameEn, nameHe: s.nameHe,
          descEn: s.descEn, descHe: s.descHe,
          category: s.category || "biology", icon: s.icon || "🔬",
          subtopics: s.subtopics,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      // Build a minimal Topic object so the parent can add it to state
      const newTopic: Topic = {
        id: data.id, slug: data.slug,
        nameHe: s.nameHe, nameEn: s.nameEn,
        descHe: s.descHe, descEn: s.descEn,
        category: s.category, icon: s.icon || "🔬",
        subtopics: s.subtopics.map((sub, i) => ({
          id: `temp-${i}`, slug: sub.slug,
          nameHe: sub.nameHe, nameEn: sub.nameEn,
          contentHe: sub.contentHe, contentEn: sub.contentEn,
          relatedProcessSlug: null,
        })),
        processes: [],
      };
      onTopicAdded(newTopic);
      setAddedSlugs((prev) => new Set([...prev, s.slug]));
    } catch (e) {
      alert(e instanceof Error ? e.message : (isHe ? "שגיאה בהוספה" : "Failed to add topic"));
    } finally {
      setAdding(null);
    }
  }

  return (
    <div className="rounded-2xl border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">
            🎓 {isHe ? "מחקר נושאים אוניברסיטאיים" : "University Topic Research"}
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
            {isHe ? "AI מנתח ומציע נושאי ביולוגיה הנלמדים באוניברסיטאות" : "AI analyzes and suggests biology topics taught at universities"}
          </p>
        </div>
        <button onClick={onClose} className="text-xs text-zinc-500 hover:text-zinc-700">✕</button>
      </div>

      {loading && (
        <div className="flex items-center gap-3 py-4">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-blue-600 dark:text-blue-400 animate-pulse">
            {isHe ? "AI מחפש נושאים חסרים..." : "AI is searching for missing topics..."}
          </p>
        </div>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}

      {!loading && suggestions.length === 0 && !error && (
        <p className="text-xs text-zinc-400">
          {isHe ? "לא נמצאו נושאים חסרים — הספרייה נראית מקיפה!" : "No missing topics found — your library looks comprehensive!"}
        </p>
      )}

      <div className="space-y-3">
        {suggestions.map((s) => {
          const done = addedSlugs.has(s.slug);
          const isExpanded = expanded === s.slug;
          return (
            <div
              key={s.slug}
              className={`rounded-xl border p-4 transition-colors ${
                done
                  ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20"
                  : "border-blue-200 dark:border-blue-800 bg-white dark:bg-zinc-800"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{s.icon || "🔬"}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">
                    {isHe ? s.nameHe : s.nameEn}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">{s.reason}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
                    {isHe ? `${s.subtopics.length} תתי-נושאים` : `${s.subtopics.length} subtopics`} · {s.category}
                  </p>

                  {/* Subtopic list toggle */}
                  <button
                    onClick={() => setExpanded(isExpanded ? null : s.slug)}
                    className="text-xs text-blue-500 hover:text-blue-700 mt-1.5"
                  >
                    {isExpanded
                      ? (isHe ? "▲ הסתר תתי-נושאים" : "▲ Hide subtopics")
                      : (isHe ? "▼ הצג תתי-נושאים" : "▼ Show subtopics")}
                  </button>
                  {isExpanded && (
                    <ul className="mt-2 space-y-1 pl-2 border-l-2 border-blue-200 dark:border-blue-700">
                      {s.subtopics.map((sub) => (
                        <li key={sub.slug} className="text-xs text-zinc-600 dark:text-zinc-400">
                          <span className="font-medium">{isHe ? sub.nameHe : sub.nameEn}</span>
                          {" — "}{isHe ? sub.contentHe : sub.contentEn}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <button
                  onClick={() => addTopic(s)}
                  disabled={done || adding === s.slug}
                  className={`shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium text-white transition-colors disabled:cursor-default ${
                    done
                      ? "bg-zinc-300 dark:bg-zinc-600"
                      : adding === s.slug
                      ? "bg-blue-400"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {done
                    ? (isHe ? "✓ נוסף" : "✓ Added")
                    : adding === s.slug
                    ? "..."
                    : (isHe ? "➕ הוסף נושא" : "➕ Add Topic")}
                </button>
              </div>
            </div>
          );
        })}
      </div>
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
  const [showResearchPanel, setShowResearchPanel] = useState(false);

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
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setShowResearchPanel((v) => !v); setShowCreateTopic(false); }}
            className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
          >
            {showResearchPanel ? (isHe ? "ביטול" : "Cancel") : (isHe ? "🎓 חקור אוניברסיטאות" : "🎓 Research Universities")}
          </button>
          <button
            onClick={() => { setShowCreateTopic((v) => !v); setShowResearchPanel(false); }}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors"
          >
            {showCreateTopic ? (isHe ? "ביטול" : "Cancel") : (isHe ? "+ נושא חדש" : "+ New Topic")}
          </button>
        </div>
      </div>

      {showCreateTopic && (
        <CreateTopicForm lang={lang} existingCategories={existingCategories} onCreated={handleTopicCreated} />
      )}

      {showResearchPanel && (
        <UniversityResearchPanel
          lang={lang}
          onTopicAdded={(t) => { setTopics((prev) => [...prev, t]); }}
          onClose={() => setShowResearchPanel(false)}
        />
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
