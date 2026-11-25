import type { PlanGroup, PlanItem, PlanSession } from "./types";

/* Shared shorthands for course plans that reuse existing units (the other universities' tracks).
   L("slug")() = the whole unit; L("slug")("section") = one section; W("slug")("problem") = a worked problem. */
export const L = (slug: string) => (section?: string): PlanItem => ({ kind: "lesson", slug, section });
export const W = (slug: string) => (problem: string): PlanItem => ({ kind: "lesson", slug, problem });
export const sub = (topic: string, id: string): PlanItem => ({ kind: "subtopic", topic, id });
export const proc = (topic: string, slug: string): PlanItem => ({ kind: "process", topic, slug });
export const soon = (titleHe: string): PlanItem => ({ kind: "soon", titleHe });

/* Phase-1 note shown in every mapped plan: the units were written for a Technion course and are reused because
   the topic matches; the course's own scope and depth may differ. */
export const REUSE_NOTE_HE =
  "היחידות נכתבו במקור לקורסים בטכניון ומשובצות כאן כי הנושא תואם לסילבוס של הקורס. העומק והפירוט עשויים להיות שונים מהנלמד בקורס; נושאים שעדיין אין להם יחידה מסומנים \"בקרוב\".";

/* No public schedule but the syllabus lists its topics in order: one session per topic (confidence "syllabus"). */
export const sessionsFromTopics = (topics: PlanGroup[]): PlanSession[] => topics.map((t, i) => ({ n: i + 1, ...t }));
