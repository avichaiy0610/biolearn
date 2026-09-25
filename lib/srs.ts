// Spaced repetition (SM-2 variant). Pure functions shared by the client (guest
// progress in localStorage) and the server (/api/review for signed-in users).

export type SrsState = { ease: number; interval: number; reps: number; lapses: number; due: number }; // due = epoch ms
export type Grade = 0 | 1 | 2 | 3; // again | hard | good | easy

const DAY = 24 * 60 * 60 * 1000;
const RELEARN_MS = 10 * 60 * 1000;

export const NEW_STATE: Omit<SrsState, "due"> = { ease: 2.5, interval: 0, reps: 0, lapses: 0 };

export function schedule(prev: Omit<SrsState, "due"> | undefined, grade: Grade, now = Date.now()): SrsState {
  const s = prev ?? NEW_STATE;
  let { ease, interval } = s;
  const { reps, lapses } = s;

  if (grade === 0) {
    // forgot: relearn in 10 minutes, back to the start
    return { ease: Math.max(1.3, ease - 0.2), interval: 0, reps: 0, lapses: lapses + 1, due: now + RELEARN_MS };
  }
  if (grade === 1) {
    interval = reps === 0 ? 1 : Math.max(interval + 1, Math.round(interval * 1.2));
    ease = Math.max(1.3, ease - 0.15);
  } else if (grade === 2) {
    interval = reps === 0 ? 1 : reps === 1 ? 3 : Math.round(interval * ease);
  } else {
    interval = reps === 0 ? 3 : reps === 1 ? 5 : Math.round(interval * ease * 1.3);
    ease = ease + 0.15;
  }
  return { ease, interval, reps: reps + 1, lapses, due: now + interval * DAY };
}

// Human-readable preview of the next interval for a grade button.
export function previewLabel(prev: Omit<SrsState, "due"> | undefined, grade: Grade, lang: string) {
  const next = schedule(prev, grade, 0);
  const he = lang !== "en";
  if (next.interval === 0) return he ? "10 דק'" : "10 min";
  const d = next.interval;
  if (d === 1) return he ? "יום" : "1 day";
  if (d < 30) return he ? `${d} ימים` : `${d} days`;
  const m = Math.round(d / 30);
  return he ? (m === 1 ? "חודש" : `${m} חודשים`) : `${m} mo`;
}

export const NEW_CARDS_PER_SESSION = 10;
