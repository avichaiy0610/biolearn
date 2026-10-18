import "server-only";
import { unitCatalog } from "@/lib/course-data";
import { lessonBySlug } from "@/content/lessons";
import { parseBody } from "@/content/lessons/parse";
import type { CoursePlan, PlanItem } from "@/content/course-plans/types";

export type PlanEntry = {
  key: string;
  titleHe: string;
  context?: string; // e.g. the lesson a section belongs to
  kind: "lesson" | "section" | "problem" | "reading" | "animation" | "soon";
  href?: string;
  draft?: boolean;
};

export async function resolvePlan(plan: CoursePlan, lang: string) {
  const catalog = await unitCatalog();
  const resolve = (it: PlanItem, i: number): PlanEntry | null => {
    switch (it.kind) {
      case "lesson": {
        const l = lessonBySlug(it.slug);
        if (!l) return null;
        const base = `/${lang}/learn/${l.slug}`;
        const draft = l.status === "draft";
        if (it.problem) {
          const w = l.workedProblems?.find((x) => x.id === it.problem);
          return w ? { key: `${l.slug}#wp-${w.id}`, titleHe: w.titleHe, context: l.titleHe, kind: "problem", href: `${base}#wp-${w.id}`, draft } : null;
        }
        if (it.section) {
          const s = parseBody(l.bodyHe).find((x) => x.id === it.section);
          return s ? { key: `${l.slug}#${s.id}`, titleHe: s.title, context: l.titleHe, kind: "section", href: `${base}#${s.id}`, draft } : null;
        }
        return { key: l.slug, titleHe: l.titleHe, kind: "lesson", href: base, draft };
      }
      case "subtopic": {
        const s = catalog.subs.find((x) => x.id === it.id);
        return s ? { key: `s:${s.id}`, titleHe: s.nameHe, kind: "reading", href: `/${lang}/topics/${it.topic}#sub-${s.id}` } : null;
      }
      case "process": {
        const p = catalog.procs.find((x) => x.slug === it.slug && x.topicSlug === it.topic);
        return p ? { key: `p:${p.slug}`, titleHe: p.nameHe, kind: "animation", href: `/${lang}/topics/${it.topic}/${p.slug}` } : null;
      }
      case "soon":
        return { key: `soon:${i}:${it.titleHe}`, titleHe: it.titleHe, kind: "soon" };
    }
  };
  const group = <T extends { items: PlanItem[] }>(g: T) => ({ ...g, entries: g.items.map(resolve).filter((e): e is PlanEntry => !!e) });
  return {
    topics: plan.topics.map(group),
    lectures: plan.lectures.map(group),
    tutorials: plan.tutorials.map(group),
  };
}
