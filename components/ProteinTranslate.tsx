"use client";

import { useState } from "react";

type TranslatedData = {
  name?: string;
  organism?: string;
  fn?: string;
  locations?: string[];
  diseases?: string[];
  keywords?: string[];
};

type Props = {
  originalData: {
    name: string;
    organism: string | null;
    fn: string | null;
    locations: string[];
    diseases: string[];
    keywords: string[];
  };
  onTranslated: (data: TranslatedData) => void;
  onReset: () => void;
  isTranslated: boolean;
};

export default function ProteinTranslate({ originalData, onTranslated, onReset, isTranslated }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function translate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/translate-protein", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(originalData),
      });
      if (!res.ok) throw new Error("failed");
      const data: TranslatedData = await res.json();
      onTranslated(data);
    } catch {
      setError("שגיאה בתרגום. נסה שנית.");
    }
    setLoading(false);
  }

  if (isTranslated) {
    return (
      <button
        onClick={onReset}
        className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
      >
        🌐 Show in English / הצג באנגלית
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={translate}
        disabled={loading}
        className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 disabled:opacity-50 transition-colors font-medium"
      >
        {loading ? (
          <><span className="animate-spin">⏳</span> מתרגם...</>
        ) : (
          <><span>🌐</span> תרגם לעברית</>
        )}
      </button>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
