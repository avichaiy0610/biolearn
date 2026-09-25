import "server-only";
import { prisma } from "@/lib/prisma";
import type { CourseUnit } from "@/content/courses";

export type ResolvedUnit = {
  key: string;
  kind: "subtopic" | "process";
  href: string;
  nameHe: string;
  nameEn: string;
  topicSlug: string;
  subtopicId?: string;
};

// Resolves a course's units against the DB (live names, skips hidden/missing).
export async function resolveCourseUnits(course: { units: CourseUnit[] }, lang: string): Promise<ResolvedUnit[]> {
  const subIds = course.units.flatMap((u) => (u.kind === "subtopic" ? [u.id] : []));
  const procSlugs = course.units.flatMap((u) => (u.kind === "process" ? [u.slug] : []));
  const [subs, procs] = await Promise.all([
    prisma.subtopic.findMany({ where: { id: { in: subIds }, hidden: false }, select: { id: true, nameHe: true, nameEn: true } }),
    prisma.process.findMany({ where: { slug: { in: procSlugs } }, select: { slug: true, nameHe: true, nameEn: true, topic: { select: { slug: true } } } }),
  ]);
  const out: ResolvedUnit[] = [];
  for (const u of course.units) {
    if (u.kind === "subtopic") {
      const s = subs.find((x) => x.id === u.id);
      if (s) out.push({ key: s.id, kind: "subtopic", href: `/${lang}/topics/${u.topic}#sub-${s.id}`, nameHe: s.nameHe, nameEn: s.nameEn, topicSlug: u.topic, subtopicId: s.id });
    } else {
      const p = procs.find((x) => x.slug === u.slug && x.topic.slug === u.topic);
      if (p) out.push({ key: p.slug, kind: "process", href: `/${lang}/topics/${u.topic}/${p.slug}`, nameHe: p.nameHe, nameEn: p.nameEn, topicSlug: u.topic });
    }
  }
  return out;
}
