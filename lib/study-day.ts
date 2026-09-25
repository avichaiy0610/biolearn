import "server-only";
import { prisma } from "@/lib/prisma";

// Calendar day in Israel time, so a streak day matches the student's day.
export function israelDay(d = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jerusalem", year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
}

// Records study activity for today (idempotent per day; counts actions).
export async function recordStudyDay(userId: string) {
  const day = israelDay();
  await prisma.studyDay
    .upsert({
      where: { userId_day: { userId, day } },
      create: { userId, day, actions: 1 },
      update: { actions: { increment: 1 } },
    })
    .catch(() => {}); // never block the actual action on streak bookkeeping
}

// Current streak: consecutive days ending today (or yesterday, so an unfinished
// today doesn't break it). Longest: best run in the history.
export function computeStreaks(days: string[]) {
  const set = new Set(days);
  const dayMs = 86400000;
  const toDate = (s: string) => new Date(`${s}T12:00:00Z`).getTime();
  const fmt = (t: number) => new Date(t).toISOString().slice(0, 10);

  let current = 0;
  let cursor = toDate(israelDay());
  if (!set.has(fmt(cursor))) cursor -= dayMs;
  while (set.has(fmt(cursor))) { current++; cursor -= dayMs; }

  let longest = 0, run = 0, prev = 0;
  for (const t of [...set].map(toDate).sort((a, b) => a - b)) {
    run = prev && t - prev === dayMs ? run + 1 : 1;
    longest = Math.max(longest, run);
    prev = t;
  }
  return { current, longest };
}
