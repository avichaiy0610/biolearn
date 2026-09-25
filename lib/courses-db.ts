import "server-only";
import { prisma } from "@/lib/prisma";
import { COURSES, type Course, type CourseUnit } from "@/content/courses";

export type CourseRecord = Omit<Course, "topics"> & { position: number };

function parseUnits(raw: string): CourseUnit[] {
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((u) => u && (u.kind === "subtopic" ? typeof u.id === "string" : typeof u.slug === "string") && typeof u.topic === "string") : [];
  } catch {
    return [];
  }
}

// Courses as edited in /admin/courses. Falls back to the seed in
// content/courses.ts if the table is empty or unreachable, so the page never breaks.
export async function getCourses(): Promise<CourseRecord[]> {
  const rows = await prisma.course.findMany({ orderBy: [{ year: "asc" }, { semester: "asc" }, { position: "asc" }] }).catch(() => []);
  if (rows.length === 0) return COURSES.map((c, i) => ({ ...c, position: i }));
  return rows.map((r) => ({
    slug: r.slug, nameHe: r.nameHe, nameEn: r.nameEn,
    year: r.year as Course["year"], semester: r.semester as Course["semester"],
    descHe: r.descHe, descEn: r.descEn, units: parseUnits(r.units), position: r.position,
  }));
}

export async function getCourse(slug: string) {
  return (await getCourses()).find((c) => c.slug === slug) ?? null;
}

// Topics a course touches, in unit order (used for the topic chips).
export const courseTopics = (c: { units: CourseUnit[] }) => [...new Set(c.units.map((u) => u.topic))];

// Catalog of everything that can be a course unit (visible subtopics + animations).
export async function courseCatalog() {
  const topics = await prisma.topic.findMany({
    select: {
      slug: true, nameHe: true,
      subtopics: { where: { hidden: false }, select: { id: true, nameHe: true } },
      processes: { select: { slug: true, nameHe: true } },
    },
    orderBy: { nameHe: "asc" },
  });
  return topics.map((t) => ({
    slug: t.slug,
    nameHe: t.nameHe,
    units: [
      ...t.subtopics.map((s) => ({ kind: "subtopic" as const, topic: t.slug, id: s.id, nameHe: s.nameHe })),
      ...t.processes.map((p) => ({ kind: "process" as const, topic: t.slug, slug: p.slug, nameHe: p.nameHe })),
    ],
  }));
}

