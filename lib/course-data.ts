import "server-only";
import { unstable_cache } from "next/cache";
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
  relatedProcessSlug?: string | null;
};

// Names of every visible subtopic and every animation — what course units
// point to. Changes rarely, so it is cached (5 min, tag "content") instead of
// queried on every page; the database is a network hop away.
export const unitCatalog = unstable_cache(
  async () => {
    const [subs, procs] = await Promise.all([
      prisma.subtopic.findMany({ where: { hidden: false }, select: { id: true, nameHe: true, nameEn: true, relatedProcessSlug: true } }),
      prisma.process.findMany({ select: { slug: true, nameHe: true, nameEn: true, topic: { select: { slug: true } } } }),
    ]);
    return { subs, procs: procs.map((p) => ({ slug: p.slug, nameHe: p.nameHe, nameEn: p.nameEn, topicSlug: p.topic.slug })) };
  },
  ["unit-catalog-v1"],
  { revalidate: 300, tags: ["content"] },
);

type Catalog = Awaited<ReturnType<typeof unitCatalog>>;

// Resolves a course's units against the catalog (live names, skips hidden/missing).
export function resolveUnitsWith(catalog: Catalog, course: { units: CourseUnit[] }, lang: string): ResolvedUnit[] {
  const out: ResolvedUnit[] = [];
  for (const u of course.units) {
    if (u.kind === "subtopic") {
      const s = catalog.subs.find((x) => x.id === u.id);
      if (s) out.push({ key: s.id, kind: "subtopic", href: `/${lang}/topics/${u.topic}#sub-${s.id}`, nameHe: s.nameHe, nameEn: s.nameEn, topicSlug: u.topic, subtopicId: s.id, relatedProcessSlug: s.relatedProcessSlug });
    } else {
      const p = catalog.procs.find((x) => x.slug === u.slug && x.topicSlug === u.topic);
      if (p) out.push({ key: p.slug, kind: "process", href: `/${lang}/topics/${u.topic}/${p.slug}`, nameHe: p.nameHe, nameEn: p.nameEn, topicSlug: u.topic });
    }
  }
  return out;
}

export async function resolveCourseUnits(course: { units: CourseUnit[] }, lang: string): Promise<ResolvedUnit[]> {
  return resolveUnitsWith(await unitCatalog(), course, lang);
}
