"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { Flashcard } from "./FlashcardDeck";

const FlashcardDeck = dynamic(() => import("./FlashcardDeck"), { ssr: false });

export default function StudentFlashcards({
  subtopicId,
  lang,
}: {
  subtopicId: string;
  lang: string;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState<Flashcard[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isHe = lang === "he";

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate-flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subtopicId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `שגיאה ${res.status}`);
      setCards(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
    setLoading(false);
  }

  if (!open) {
    return (
      <button
        onClick={() => { setOpen(true); generate(); }}
        className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-800/40 transition-colors"
      >
        <span>🃏</span>
        {isHe ? "פלאשכארדים" : "Flashcards"}
      </button>
    );
  }

  return (
    <div className="mt-4 rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20 overflow-hidden" dir={isHe ? "rtl" : "ltr"}>
      <div className="flex items-center justify-between px-5 py-3 border-b border-amber-100 dark:border-amber-800/50">
        <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
          🃏 {isHe ? "פלאשכארדים" : "Flashcards"}
        </p>
        <button
          onClick={() => { setOpen(false); setCards(null); }}
          className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
        >
          {isHe ? "סגור" : "Close"}
        </button>
      </div>
      <div className="p-5">
        {loading && (
          <p className="text-sm text-amber-600 dark:text-amber-400 animate-pulse text-center py-6">
            {isHe ? "מייצר קלפים... ⏳" : "Generating cards... ⏳"}
          </p>
        )}
        {error && (
          <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">{error}</p>
        )}
        {cards && <FlashcardDeck cards={cards} lang={lang} />}
      </div>
    </div>
  );
}
