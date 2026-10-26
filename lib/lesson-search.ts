import { LESSONS } from "@/content/lessons";
import { parseBody } from "@/content/lessons/parse";
import type { Lesson } from "@/content/lessons/types";

/* Full-text search inside the study units (they live in the repo, not the DB).
   Hebrew prefixes (ה/ו/ב/ל/מ/ש/כ) work because matching is by substring. Each hit
   links to the section where it was found and shows the text around it. */

export type LessonHit = {
  slug: string;
  titleHe: string;
  courseHe: string;
  snippets: { anchor: string; where: string; parts: { t: string; hl: boolean }[] }[];
};

type Block = { anchor: string; where: string; text: string; weight: number };

// strip niqqud/cantillation, bidi marks and markdown so a query matches the text a student reads
const plain = (s: string) =>
  s
    .replace(/[֑-ׇ]/g, "")
    .replace(/[‎‏⁦-⁩]/g, "")
    .replace(/\[\[[^\]]+\]\]/g, " ")
    .replace(/[*_`#>]|\{#[\w-]+\}/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
const fold = (s: string) => s.toLowerCase();

const INDEX: { lesson: Lesson; blocks: Block[]; all: string }[] = LESSONS.map((l) => {
  const blocks: Block[] = [
    { anchor: "", where: "כותרת", text: l.titleHe, weight: 8 },
    { anchor: "", where: "פתיח", text: l.leadHe, weight: 3 },
    { anchor: "objectives", where: "מטרות היחידה", text: l.objectivesHe.join(" · "), weight: 2 },
    ...parseBody(l.bodyHe).flatMap((s) => [
      { anchor: s.id, where: s.title, text: s.title, weight: 5 },
      ...s.segments.flatMap((g) => (g.kind === "md" ? [{ anchor: s.id, where: s.title, text: g.text, weight: 1 }] : [])),
    ]),
    { anchor: "experiment", where: "איך אנחנו יודעים", text: `${l.experiment.titleHe} ${l.experiment.bodyHe}`, weight: 1 },
    { anchor: "traps", where: "מלכודות במבחן", text: l.trapsHe.join(" · "), weight: 1 },
    { anchor: "objectives", where: "מונחים", text: l.terms.map((t) => `${t.he} ${t.en}`).join(" · "), weight: 2 },
    ...(l.workedProblems ?? []).map((w) => ({ anchor: `wp-${w.id}`, where: `תרגיל: ${w.titleHe}`, text: `${w.titleHe} ${w.problemHe} ${w.solutionHe}`, weight: 1 })),
  ].map((b) => ({ ...b, where: plain(b.where), text: plain(b.text) }));
  return { lesson: l, blocks, all: fold(blocks.map((b) => b.text).join(" ")) };
});

// up to ~170 characters around `at`, cut at word boundaries, with every query word marked
function snippet(text: string, at: number, words: string[]): { t: string; hl: boolean }[] {
  const start = Math.max(0, text.lastIndexOf(" ", Math.max(0, at - 70)) + 1);
  const endSpace = text.indexOf(" ", Math.min(text.length, at + 100));
  const end = endSpace < 0 ? text.length : endSpace;
  const win = text.slice(start, end), f = fold(win);
  const marks: [number, number][] = [];
  // mark whole words, so a match inside "הפולימראז" highlights the word a student reads
  const edge = (c: string | undefined) => !c || /[\s.,;:!?()"'·…/]/.test(c);
  for (const w of words) for (let k = f.indexOf(w); k >= 0; k = f.indexOf(w, k + w.length)) {
    let a = k, b = k + w.length;
    while (!edge(win[a - 1])) a--;
    while (!edge(win[b])) b++;
    marks.push([a, b]);
  }
  marks.sort((a, b) => a[0] - b[0]);
  const parts: { t: string; hl: boolean }[] = [];
  let pos = 0;
  for (const [a, b] of marks) {
    if (a < pos) continue;
    if (a > pos) parts.push({ t: win.slice(pos, a), hl: false });
    parts.push({ t: win.slice(a, b), hl: true });
    pos = b;
  }
  if (pos < win.length) parts.push({ t: win.slice(pos), hl: false });
  if (start > 0) parts.unshift({ t: "…", hl: false });
  if (end < text.length) parts.push({ t: "…", hl: false });
  return parts;
}

const count = (hay: string, w: string) => hay.split(w).length - 1;

/* Ranking: rarer words count more (idf), units that contain more (and rarer) query words rank higher,
   and the exact phrase counts most. A unit needs at least one of the words to appear. */
export function searchLessons(query: string, limit = 12): LessonHit[] {
  // a leading one-letter prefix is dropped from longer words, so "מקטעי" also finds "קטעי" (substring keeps "מקטעי")
  const words = [...new Set(fold(plain(query)).split(" ").filter((w) => w.length >= 2).map((w) => (w.length >= 5 && "המובלשכ".includes(w[0]) ? w.slice(1) : w)))];
  if (!words.length) return [];
  const phrase = words.length > 1 ? words.join(" ") : "";
  const idf = Object.fromEntries(words.map((w) => [w, Math.log((INDEX.length + 1) / (1 + INDEX.filter((x) => x.all.includes(w)).length)) + 0.1]));
  const phraseIdf = words.reduce((a, w) => a + idf[w], 0);
  const hits: (LessonHit & { score: number })[] = [];
  for (const { lesson, blocks, all } of INDEX) {
    const present = words.filter((w) => all.includes(w));
    if (!present.length) continue;
    const scored = blocks.map((b) => {
      const t = fold(b.text);
      const ph = phrase ? count(t, phrase) : 0;
      const s = present.reduce((a, w) => a + count(t, w) * idf[w], 0) + ph * phraseIdf * 4;
      return { b, t, ph, s: s * b.weight };
    }).filter((x) => x.s > 0);
    const coverage = present.reduce((a, w) => a + idf[w], 0) / phraseIdf;
    const score = scored.reduce((a, x) => a + x.s, 0) * coverage * coverage;
    const best = [...present].sort((a, b) => idf[b] - idf[a])[0];
    const snippets: LessonHit["snippets"] = [];
    const seen = new Set<string>();
    // excerpts: phrase first, then by matches in the passage itself (the term list is a last resort)
    for (const x of [...scored].sort((a, b) => b.ph - a.ph || Number(a.b.where === "מונחים") - Number(b.b.where === "מונחים") || b.s / b.b.weight - a.s / a.b.weight)) {
      if (snippets.length >= 3 || x.b.weight > 3 || seen.has(x.b.anchor + x.b.where)) continue;
      seen.add(x.b.anchor + x.b.where);
      const at = x.ph ? x.t.indexOf(phrase) : x.t.includes(best) ? x.t.indexOf(best) : x.t.indexOf(present.find((w) => x.t.includes(w))!);
      snippets.push({ anchor: x.b.anchor, where: x.b.where, parts: snippet(x.b.text, at, words) });
    }
    hits.push({ slug: lesson.slug, titleHe: lesson.titleHe, courseHe: lesson.course.nameHe, snippets, score });
  }
  hits.sort((a, b) => b.score - a.score);
  return hits.slice(0, limit);
}
