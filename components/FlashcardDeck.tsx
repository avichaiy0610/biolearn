"use client";

import { useState } from "react";

export type Flashcard = { term: string; definition: string };

export default function FlashcardDeck({ cards, lang }: { cards: Flashcard[]; lang: string }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<number>>(new Set());
  const [unknown, setUnknown] = useState<Set<number>>(new Set());
  const [done, setDone] = useState(false);

  const isHe = lang === "he";
  const card = cards[index];

  function mark(correct: boolean) {
    if (correct) setKnown((s) => new Set(s).add(index));
    else setUnknown((s) => new Set(s).add(index));

    setFlipped(false);
    if (index + 1 >= cards.length) setDone(true);
    else setIndex((i) => i + 1);
  }

  function restart() {
    setIndex(0);
    setFlipped(false);
    setKnown(new Set());
    setUnknown(new Set());
    setDone(false);
  }

  if (done) {
    const k = known.size;
    const u = unknown.size;
    const pct = Math.round((k / cards.length) * 100);
    return (
      <div className="text-center py-4" dir={isHe ? "rtl" : "ltr"}>
        <p className="text-3xl mb-2">{pct >= 80 ? "🎉" : pct >= 50 ? "👍" : "💪"}</p>
        <p className="font-bold text-zinc-900 dark:text-zinc-50">{k}/{cards.length} {isHe ? "ידעת" : "known"}</p>
        <div className="flex gap-4 justify-center text-sm mt-2 mb-4">
          <span className="text-emerald-600 dark:text-emerald-400">✓ {k}</span>
          <span className="text-red-500 dark:text-red-400">✗ {u}</span>
        </div>
        <button onClick={restart} className="px-4 py-2 rounded-xl bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-colors">
          {isHe ? "עוד פעם" : "Try again"}
        </button>
      </div>
    );
  }

  return (
    <div dir={isHe ? "rtl" : "ltr"}>
      {/* Progress */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-zinc-400">{index + 1}/{cards.length}</span>
        <div className="flex gap-2 text-xs">
          <span className="text-emerald-500">✓ {known.size}</span>
          <span className="text-red-400">✗ {unknown.size}</span>
        </div>
      </div>
      <div className="h-1 bg-zinc-100 dark:bg-zinc-700 rounded mb-4">
        <div className="h-1 bg-amber-400 rounded transition-all duration-300" style={{ width: `${(index / cards.length) * 100}%` }} />
      </div>

      {/* Card */}
      <div
        onClick={() => setFlipped((f) => !f)}
        className="cursor-pointer rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 min-h-[140px] flex flex-col items-center justify-center p-6 mb-4 select-none transition-all hover:border-amber-300 dark:hover:border-amber-600"
      >
        {!flipped ? (
          <>
            <p className="text-xs text-zinc-400 mb-3">{isHe ? "מושג" : "Term"}</p>
            <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50 text-center">{card.term}</p>
            <p className="text-xs text-zinc-400 mt-4">{isHe ? "לחץ להציג הגדרה" : "Tap to reveal"}</p>
          </>
        ) : (
          <>
            <p className="text-xs text-zinc-400 mb-3">{isHe ? "הגדרה" : "Definition"}</p>
            <p className="text-sm text-zinc-700 dark:text-zinc-300 text-center leading-relaxed">{card.definition}</p>
          </>
        )}
      </div>

      {/* Actions */}
      {flipped ? (
        <div className="flex gap-3">
          <button
            onClick={() => mark(false)}
            className="flex-1 py-2.5 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-100 transition-colors"
          >
            {isHe ? "✗ לא ידעתי" : "✗ Didn't know"}
          </button>
          <button
            onClick={() => mark(true)}
            className="flex-1 py-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium hover:bg-emerald-100 transition-colors"
          >
            {isHe ? "✓ ידעתי" : "✓ Got it"}
          </button>
        </div>
      ) : (
        <p className="text-center text-xs text-zinc-400">{isHe ? "לחץ על הקלף לגלות" : "Tap the card to reveal"}</p>
      )}
    </div>
  );
}
