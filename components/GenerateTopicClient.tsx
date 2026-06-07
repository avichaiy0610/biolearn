"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

const CATEGORIES = [
  { value: "molecular", he: "ביולוגיה מולקולרית", en: "Molecular Biology" },
  { value: "cell", he: "ביולוגיה של התא", en: "Cell Biology" },
  { value: "genetics", he: "גנטיקה", en: "Genetics" },
  { value: "biochemistry", he: "ביוכימיה", en: "Biochemistry" },
  { value: "microbiology", he: "מיקרוביולוגיה", en: "Microbiology" },
  { value: "physiology", he: "פיזיולוגיה", en: "Physiology" },
];

const ICONS = ["🔬", "🧬", "🧫", "🦠", "🧪", "🫀", "🫁", "🧠", "🦷", "💊", "🔭", "⚗️"];

type Subtopic = { slug: string; nameEn: string; nameHe: string; contentEn: string; contentHe: string };
type GeneratedTopic = {
  slug: string; nameEn: string; nameHe: string; descEn: string; descHe: string;
  category: string; icon: string; subtopics: Subtopic[];
};

export default function GenerateTopicClient() {
  const params = useParams();
  const router = useRouter();
  const lang = params.lang as string;
  const isHe = lang === "he";

  const [nameEn, setNameEn] = useState("");
  const [nameHe, setNameHe] = useState("");
  const [category, setCategory] = useState("molecular");
  const [icon, setIcon] = useState("🔬");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<GeneratedTopic | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function generate() {
    if (!nameEn.trim() || !nameHe.trim()) return;
    setGenerating(true);
    setError(null);
    setPreview(null);
    try {
      const res = await fetch("/api/admin/generate-topic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nameEn, nameHe, category, icon }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `שגיאה ${res.status}`);
      setPreview(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
    setGenerating(false);
  }

  async function save() {
    if (!preview) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/topics/with-subtopics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preview),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `שגיאה ${res.status}`);
      setSaved(true);
      setTimeout(() => router.push(`/${lang}/topics/${preview.slug}`), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
    setSaving(false);
  }

  function editSubtopic(i: number, field: keyof Subtopic, value: string) {
    if (!preview) return;
    const updated = [...preview.subtopics];
    updated[i] = { ...updated[i], [field]: value };
    setPreview({ ...preview, subtopics: updated });
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8" dir={isHe ? "rtl" : "ltr"}>
      <div className="flex items-center gap-3 mb-6">
        <a href={`/${lang}/admin`} className="text-sm text-zinc-400 hover:text-emerald-600 transition-colors">
          {isHe ? "← ניהול" : "← Admin"}
        </a>
        <span className="text-zinc-300 dark:text-zinc-600">/</span>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          {isHe ? "✨ יצירת נושא חדש עם AI" : "✨ Generate New Topic with AI"}
        </h1>
      </div>

      {/* Input form */}
      {!preview && (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-zinc-500 mb-1">{isHe ? "שם בעברית *" : "Hebrew name *"}</label>
              <input value={nameHe} onChange={(e) => setNameHe(e.target.value)} dir="rtl"
                placeholder="לדוגמה: מחזור התא"
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1">{isHe ? "שם באנגלית *" : "English name *"}</label>
              <input value={nameEn} onChange={(e) => setNameEn(e.target.value)}
                placeholder="e.g. Cell Cycle"
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-zinc-500 mb-1">{isHe ? "קטגוריה" : "Category"}</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{isHe ? c.he : c.en}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1">{isHe ? "אייקון" : "Icon"}</label>
              <div className="flex gap-2 flex-wrap">
                {ICONS.map((ic) => (
                  <button key={ic} onClick={() => setIcon(ic)}
                    className={`text-xl p-1.5 rounded-lg transition-colors ${icon === ic ? "bg-emerald-100 dark:bg-emerald-900/40 ring-2 ring-emerald-500" : "hover:bg-zinc-100 dark:hover:bg-zinc-700"}`}>
                    {ic}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button onClick={generate} disabled={generating || !nameEn.trim() || !nameHe.trim()}
            className="w-full py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-colors">
            {generating
              ? (isHe ? "⏳ מייצר נושא עם AI..." : "⏳ Generating with AI...")
              : (isHe ? "✨ צור נושא" : "✨ Generate Topic")}
          </button>
          {generating && (
            <p className="text-xs text-zinc-400 text-center">
              {isHe ? "AI מייצר כותרות, תיאורים ו-6-8 תת-נושאים מפורטים..." : "AI is generating descriptions and 6-8 detailed subtopics..."}
            </p>
          )}
        </div>
      )}

      {/* Preview */}
      {preview && !saved && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/20 p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">{preview.icon}</span>
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{preview.nameHe}</h2>
                <p className="text-sm text-zinc-400">{preview.nameEn} · <span className="font-mono text-xs">{preview.slug}</span></p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-zinc-400 mb-1">{isHe ? "תיאור עברית" : "Hebrew desc"}</p>
                <textarea value={preview.descHe} onChange={(e) => setPreview({ ...preview, descHe: e.target.value })}
                  rows={3} dir="rtl"
                  className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-y" />
              </div>
              <div>
                <p className="text-xs text-zinc-400 mb-1">{isHe ? "תיאור אנגלית" : "English desc"}</p>
                <textarea value={preview.descEn} onChange={(e) => setPreview({ ...preview, descEn: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-y" />
              </div>
            </div>
          </div>

          <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
            {isHe ? `${preview.subtopics.length} תת-נושאים — ערוך לפני שמירה:` : `${preview.subtopics.length} subtopics — edit before saving:`}
          </p>

          <div className="space-y-3">
            {preview.subtopics.map((sub, i) => (
              <div key={i} className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-4">
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input value={sub.nameHe} onChange={(e) => editSubtopic(i, "nameHe", e.target.value)}
                    dir="rtl" placeholder="שם עברית"
                    className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                  <input value={sub.nameEn} onChange={(e) => editSubtopic(i, "nameEn", e.target.value)}
                    placeholder="English name"
                    className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <textarea value={sub.contentHe} onChange={(e) => editSubtopic(i, "contentHe", e.target.value)}
                    rows={3} dir="rtl"
                    className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-y" />
                  <textarea value={sub.contentEn} onChange={(e) => editSubtopic(i, "contentEn", e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-y" />
                </div>
              </div>
            ))}
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3">
            <button onClick={save} disabled={saving}
              className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-colors">
              {saving ? (isHe ? "שומר..." : "Saving...") : (isHe ? "💾 שמור נושא לאתר" : "💾 Save Topic to Site")}
            </button>
            <button onClick={() => setPreview(null)}
              className="px-5 py-3 rounded-xl border border-zinc-300 dark:border-zinc-600 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
              {isHe ? "← חזור" : "← Back"}
            </button>
          </div>
        </div>
      )}

      {saved && (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">✅</p>
          <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400 mb-2">
            {isHe ? "הנושא נשמר בהצלחה!" : "Topic saved successfully!"}
          </p>
          <p className="text-sm text-zinc-400">{isHe ? "מעביר לדף הנושא..." : "Redirecting to topic page..."}</p>
        </div>
      )}
    </div>
  );
}
