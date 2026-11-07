import { LESSONS } from "@/content/lessons";
import { parseBody } from "@/content/lessons/parse";
import { EXPLAINER_VIDEOS } from "@/content/explainer-videos";
import { figureCaption } from "@/components/lesson/LessonFigure";
import { foldText, plainText, queryWords, snippet } from "@/lib/lesson-search";

/* Search the figures (by their Hebrew caption and the section they sit in) and the explainer videos (by
   title and summary). Each hit links straight to the place a student sees it. */

export type VisualHit = {
  kind: "figure" | "video";
  key: string;
  href: string;
  lessonHe: string;
  whereHe: string;
  parts: { t: string; hl: boolean }[];
};

type Item = { kind: VisualHit["kind"]; key: string; slug: string; anchor: string; lessonHe: string; whereHe: string; text: string; context: string };

const ITEMS: Item[] = [
  ...LESSONS.flatMap((l) =>
    parseBody(l.bodyHe).flatMap((s) =>
      s.segments.flatMap((g) => {
        if (g.kind !== "figure") return [];
        const caption = figureCaption(g.id);
        if (!caption) return [];
        return [{ kind: "figure" as const, key: `${l.slug}:${g.id}`, slug: l.slug, anchor: s.id, lessonHe: l.titleHe, whereHe: plainText(s.title), text: plainText(caption), context: foldText(plainText(`${s.title} ${l.titleHe}`)) }];
      }),
    ),
  ),
  ...Object.values(EXPLAINER_VIDEOS).map((v) => ({
    kind: "video" as const, key: `video:${v.slug}`, slug: v.slug, anchor: "", lessonHe: v.titleHe, whereHe: "סרטון הסבר",
    text: plainText(`${v.titleHe} — ${v.summaryHe}`), context: "",
  })),
];

export function searchVisuals(query: string, lang: string, limit = 12): VisualHit[] {
  const words = queryWords(query);
  if (!words.length) return [];
  const hits = ITEMS.flatMap((it) => {
    const t = foldText(it.text);
    const inText = words.filter((w) => t.includes(w));
    const inContext = words.filter((w) => it.context.includes(w));
    if (!inText.length) return [];
    const score = inText.length * 3 + inContext.length + (words.length > 1 && t.includes(words.join(" ")) ? 4 : 0);
    const at = t.indexOf(inText[0]);
    const href = it.kind === "video" ? `/${lang}/videos/${it.slug}` : `/${lang}/learn/${it.slug}${it.anchor ? `#${it.anchor}` : ""}`;
    return [{ score, hit: { kind: it.kind, key: it.key, href, lessonHe: it.lessonHe, whereHe: it.whereHe, parts: snippet(it.text, at, words) } }];
  });
  hits.sort((a, b) => b.score - a.score);
  return hits.slice(0, limit).map((h) => h.hit);
}
