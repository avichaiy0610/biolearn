"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { schedule, previewLabel, NEW_CARDS_PER_SESSION, type Grade, type SrsState } from "@/lib/srs";
import { isolatePrimes } from "@/lib/text";

export type ReviewCard = { id: string; topic: string; he: string; en: string; defHe: string };
type States = Record<string, SrsState>;

const LS_KEY = "biolearn-srs-v1";
const nowMs = () => Date.now(); // only called from effects and event handlers
const readLocal = (): States => { try { return JSON.parse(localStorage.getItem(LS_KEY) ?? "{}"); } catch { return {}; } };
const writeLocal = (s: States) => { try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch { /* private mode */ } };

export default function ReviewSession({
  cards, topics, initialTopic, isLoggedIn, lang,
}: {
  cards: ReviewCard[];
  topics: { slug: string; name: string }[];
  initialTopic: string | null;
  isLoggedIn: boolean;
  lang: string;
}) {
  const he = lang !== "en";
  const [states, setStates] = useState<States | null>(null);
  const [topic, setTopic] = useState<string>(initialTopic ?? "all");
  const [queue, setQueue] = useState<ReviewCard[] | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(0);
  const [saveError, setSaveError] = useState(false);
  const [now, setNow] = useState(0); // refreshed on load and after each answer

  useEffect(() => {
    let cancelled = false;
    (async () => {
      let s: States = {};
      if (isLoggedIn) {
        try {
          const res = await fetch("/api/review");
          if (res.ok) s = (await res.json()).states;
        } catch { /* fall through with empty */ }
      } else {
        s = readLocal();
      }
      if (!cancelled) { setStates(s); setNow(nowMs()); }
    })();
    return () => { cancelled = true; };
  }, [isLoggedIn]);

  const pool = useMemo(() => (topic === "all" ? cards : cards.filter((c) => c.topic === topic)), [cards, topic]);
  const counts = useMemo(() => {
    const st = states ?? {};
    let due = 0, fresh = 0, learned = 0;
    for (const c of pool) {
      const s = st[c.id];
      if (!s) fresh++;
      else if (s.due <= now) due++;
      else learned++;
    }
    return { due, fresh, learned };
  }, [pool, states, now]);

  function start() {
    const now = nowMs();
    const st = states ?? {};
    const due = pool.filter((c) => st[c.id] && st[c.id].due <= now).sort((a, b) => st[a.id].due - st[b.id].due);
    const fresh = pool.filter((c) => !st[c.id]).slice(0, NEW_CARDS_PER_SESSION);
    setQueue([...due, ...fresh]);
    setRevealed(false);
    setDone(0);
  }

  async function grade(g: Grade) {
    if (!queue || !states) return;
    const card = queue[0];
    const next = schedule(states[card.id], g);
    const updated = { ...states, [card.id]: next };
    setStates(updated);
    // "Again" puts the card back at the end of this session.
    setQueue([...queue.slice(1), ...(g === 0 ? [card] : [])]);
    setRevealed(false);
    setDone((n) => n + 1);
    setNow(nowMs());
    if (isLoggedIn) {
      try {
        const res = await fetch("/api/review", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ cardId: card.id, grade: g }) });
        if (!res.ok) throw new Error();
      } catch { setSaveError(true); }
    } else {
      writeLocal(updated);
    }
  }

  const topicName = (slug: string) => topics.find((t) => t.slug === slug)?.name ?? slug;
  const grades: { g: Grade; label: string; cls: string }[] = [
    { g: 0, label: he ? "שוב" : "Again", cls: "border-red-300 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20" },
    { g: 1, label: he ? "קשה" : "Hard", cls: "border-amber-300 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20" },
    { g: 2, label: he ? "טוב" : "Good", cls: "border-emerald-300 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20" },
    { g: 3, label: he ? "קל" : "Easy", cls: "border-sky-300 text-sky-700 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-sky-900/20" },
  ];

  if (!states) return <p className="text-sm text-zinc-400">{he ? "טוען…" : "Loading…"}</p>;

  // ── session in progress ──
  if (queue && queue.length > 0) {
    const card = queue[0];
    return (
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between text-xs text-zinc-500 mb-3">
          <span>{he ? `נותרו ${queue.length} כרטיסים` : `${queue.length} cards left`}</span>
          <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-700">{topicName(card.topic)}</span>
        </div>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-8 text-center min-h-56 flex flex-col items-center justify-center gap-4 shadow-sm">
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{card.he}</p>
          {!revealed ? (
            <p className="text-sm text-zinc-400">{he ? "נסו להיזכר במונח באנגלית ובהגדרה" : "Recall the English term and the definition"}</p>
          ) : (
            <>
              <bdi dir="ltr" className="text-xl font-semibold text-emerald-700 dark:text-emerald-400">{card.en}</bdi>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">{isolatePrimes(card.defHe)}</p>
            </>
          )}
        </div>
        {!revealed ? (
          <button onClick={() => setRevealed(true)} className="mt-4 w-full h-12 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold">
            {he ? "הצג תשובה" : "Show answer"}
          </button>
        ) : (
          <div className="mt-4 grid grid-cols-4 gap-2">
            {grades.map(({ g, label, cls }) => (
              <button key={g} onClick={() => grade(g)} className={`rounded-xl border py-2 text-sm font-semibold transition-colors ${cls}`}>
                {label}
                <span className="block text-[11px] font-normal opacity-75">{previewLabel(states[card.id], g, lang)}</span>
              </button>
            ))}
          </div>
        )}
        {saveError && <p role="alert" className="mt-3 text-xs text-red-600">{he ? "לא הצלחנו לשמור חלק מהתשובות. בדקו את החיבור." : "Some answers could not be saved."}</p>}
      </div>
    );
  }

  // ── overview / finished ──
  return (
    <div className="max-w-xl mx-auto">
      {queue && done > 0 && (
        <div className="mb-6 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-5 text-center">
          <p className="text-2xl mb-1">🎉</p>
          <p className="font-semibold">{he ? `סיימתם את הסבב — ${done} חזרות` : `Session done — ${done} reviews`}</p>
          <p className="text-sm text-zinc-500 mt-1">{he ? "הכרטיסים יחזרו בדיוק כשתתחילו לשכוח אותם." : "Cards come back right before you'd forget them."}</p>
        </div>
      )}
      <label className="block text-sm font-medium mb-1" htmlFor="review-topic">{he ? "נושא" : "Topic"}</label>
      <select id="review-topic" value={topic} onChange={(e) => { setTopic(e.target.value); setQueue(null); }}
        className="w-full h-10 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 text-sm mb-4">
        <option value="all">{he ? "כל הנושאים" : "All topics"}</option>
        {topics.map((t) => <option key={t.slug} value={t.slug}>{t.name}</option>)}
      </select>
      <div className="grid grid-cols-3 gap-3 mb-5 text-center">
        <Stat n={counts.due} label={he ? "לחזרה עכשיו" : "Due now"} cls="text-amber-600" />
        <Stat n={counts.fresh} label={he ? "חדשים" : "New"} cls="text-sky-600" />
        <Stat n={counts.learned} label={he ? "בתהליך למידה" : "Learning"} cls="text-emerald-600" />
      </div>
      {counts.due + counts.fresh > 0 ? (
        <button onClick={start} className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
          {he
            ? `התחל חזרה (${counts.due + Math.min(counts.fresh, NEW_CARDS_PER_SESSION)} כרטיסים)`
            : `Start (${counts.due + Math.min(counts.fresh, NEW_CARDS_PER_SESSION)} cards)`}
        </button>
      ) : (
        <p className="text-center text-sm text-zinc-500">{he ? "אין כרטיסים לחזרה כרגע. חזרו מחר 🙂" : "Nothing due right now. Come back tomorrow 🙂"}</p>
      )}
      {!isLoggedIn && (
        <p className="mt-4 text-xs text-zinc-500 text-center">
          {he ? "ההתקדמות נשמרת רק בדפדפן הזה. " : "Progress is saved in this browser only. "}
          <Link href={`/${lang}/auth/login`} className="text-emerald-700 underline">{he ? "התחברו כדי לשמור אותה בחשבון" : "Sign in to keep it in your account"}</Link>
        </p>
      )}
    </div>
  );
}

function Stat({ n, label, cls }: { n: number; label: string; cls: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 py-3">
      <p className={`text-2xl font-bold ${cls}`}>{n}</p>
      <p className="text-xs text-zinc-500">{label}</p>
    </div>
  );
}
