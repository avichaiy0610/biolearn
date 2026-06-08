"use client";

import { useState, useEffect } from "react";

type Suggestion = { stId: string; name: string; summary: string | null };

export default function ReactomePathwaysPanel({
  topicSlug,
  lang,
  onClose,
}: {
  topicSlug: string;
  lang: string;
  onClose: () => void;
}) {
  const isHe = lang === "he";
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [pinned, setPinned] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setFetchError(false);
    fetch(`/api/admin/topics/${topicSlug}/pathways`)
      .then((r) => r.json())
      .then((d) => {
        setSuggestions(d.suggestions ?? []);
        setPinned(d.pinned ?? []);
        if (d.reactomeError) setFetchError(true);
      })
      .catch(() => setFetchError(true))
      .finally(() => setLoading(false));
  }, [topicSlug]);

  function toggle(stId: string) {
    setPinned((prev) =>
      prev.includes(stId) ? prev.filter((id) => id !== stId) : [...prev, stId]
    );
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    await fetch(`/api/admin/topics/${topicSlug}/pathways`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pathwayIds: pinned }),
    });
    setSaving(false);
    setSaved(true);
  }

  async function resetToAuto() {
    setSaving(true);
    await fetch(`/api/admin/topics/${topicSlug}/pathways`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pathwayIds: null }),
    });
    setSaving(false);
    setSaved(true);
  }

  return (
    <div className="mt-3 p-4 rounded-xl border border-violet-200 dark:border-violet-800 bg-violet-50/50 dark:bg-violet-950/20 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-violet-700 dark:text-violet-300">
          ⬡ {isHe ? "בחר מסלולי Reactome להצגה" : "Select Reactome Pathways to Display"}
        </p>
        <button onClick={onClose} className="text-xs text-zinc-400 hover:text-zinc-600">✕</button>
      </div>

      {loading ? (
        <p className="text-xs text-zinc-400">{isHe ? "טוען מ-Reactome..." : "Loading from Reactome…"}</p>
      ) : fetchError ? (
        <p className="text-xs text-amber-500">
          {isHe ? "⚠ Reactome לא זמין כרגע — ניתן עדיין לנהל מסלולים שמורים" : "⚠ Reactome unavailable — you can still manage saved pathways"}
        </p>
      ) : suggestions.length === 0 ? (
        <p className="text-xs text-zinc-400">{isHe ? "לא נמצאו מסלולים עבור נושא זה" : "No pathways found for this topic"}</p>
      ) : (
        <div className="space-y-2">
          {suggestions.map((s) => {
            const checked = pinned.includes(s.stId);
            return (
              <label
                key={s.stId}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  checked
                    ? "border-violet-400 dark:border-violet-600 bg-violet-100 dark:bg-violet-900/40"
                    : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-violet-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(s.stId)}
                  className="mt-0.5 accent-violet-600 shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-zinc-900 dark:text-zinc-50 leading-snug">{s.name}</p>
                  <p className="text-xs text-zinc-400 font-mono">{s.stId}</p>
                  {s.summary && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">{s.summary}</p>
                  )}
                </div>
              </label>
            );
          })}
        </div>
      )}

      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={save}
          disabled={saving}
          className="px-3 py-1.5 rounded-lg text-xs bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50 font-medium transition-colors"
        >
          {saving ? "..." : (isHe ? `שמור (${pinned.length} נבחרו)` : `Save (${pinned.length} selected)`)}
        </button>
        <button
          onClick={resetToAuto}
          disabled={saving}
          className="px-3 py-1.5 rounded-lg text-xs border border-zinc-300 dark:border-zinc-600 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
        >
          {isHe ? "חזור לאוטומטי" : "Reset to auto"}
        </button>
        {saved && <span className="text-xs text-emerald-600 dark:text-emerald-400">✓ {isHe ? "נשמר" : "Saved"}</span>}
      </div>

      <p className="text-xs text-zinc-400">
        {isHe
          ? "\"חזור לאוטומטי\" — האתר יציג מסלולים לפי חיפוש אוטומטי"
          : '"Reset to auto" — site will show pathways from automatic search'}
      </p>
    </div>
  );
}
