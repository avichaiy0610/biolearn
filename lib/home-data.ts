import "server-only";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getCourses, type CourseRecord } from "@/lib/courses-db";
import { resolveCourseUnits, type ResolvedUnit } from "@/lib/course-data";
import { selectedTerm, selectedUniversity } from "@/lib/university";
import { GLOSSARY } from "@/content/glossary";
import { bankForSubtopic } from "@/content/question-bank";

export type HomeCourse = {
  course: CourseRecord;
  icon: string; // topic slug for FieldIcon
  units: ResolvedUnit[];
  readings: number; // subtopic (reading) units
  read: number;
  next: ResolvedUnit | null;
};

export type OpenUnit = {
  course: HomeCourse;
  unit: ResolvedUnit;
  index: number; // 1-based position in the course
  excerpt: string;
  terms: { he: string; en: string }[];
  questions: number;
  figure: { own: boolean; processSlug: string; topicSlug: string; nameHe: string; nameEn: string; steps: { id: string; order: number; titleHe: string; titleEn: string; descHe: string; descEn: string; svgData: string }[]; step: number } | null;
  after: ResolvedUnit | null;
};

// First sentences of a reading, cut at a sentence end near `max` characters.
function excerptOf(text: string, max = 260) {
  // Lists and headings start after the first paragraph — stop there.
  const lead = text.split(/\n|•/).map((x) => x.trim()).find((x) => x.length > 40) ?? text;
  const clean = lead.replace(/[#*_`>]/g, "").replace(/\s+/g, " ").trim().replace(/:$/, ".");
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const end = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("? "));
  return end > max * 0.5 ? cut.slice(0, end + 1) : `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

export async function homeData(lang: string, courseParam?: string) {
  const [uni, term, session] = await Promise.all([selectedUniversity(), selectedTerm(), auth().catch(() => null)]);
  const all = await getCourses(uni.slug);

  // Courses of the chosen term (plus year-long ones); fall back to the year, then the first year with courses.
  let year = term.year;
  // Until the student picks a term, show the whole year (a single semester can be one course).
  let list = all.filter((c) => c.year === year && (!term.chosen || c.semester === term.semester || c.semester === "Y"));
  if (!list.length) list = all.filter((c) => c.year === year);
  if (!list.length && all.length) { year = all[0].year; list = all.filter((c) => c.year === year); }

  const email = session?.user?.email;
  const user = email ? await prisma.user.findUnique({ where: { email }, select: { id: true } }) : null;
  const [visits, dueReviews] = user
    ? await Promise.all([
        prisma.userProgress.findMany({ where: { userId: user.id, visited: true }, select: { subtopicId: true, updatedAt: true }, orderBy: { updatedAt: "desc" } }),
        prisma.flashcardReview.count({ where: { userId: user.id, due: { lte: new Date() } } }),
      ])
    : [[], 0];
  const visited = new Set(visits.map((v) => v.subtopicId));

  const courses: HomeCourse[] = await Promise.all(
    list.map(async (course) => {
      const units = await resolveCourseUnits(course, lang);
      const readings = units.filter((u) => u.kind === "subtopic");
      return {
        course,
        icon: course.units[0]?.topic ?? "cell-biology",
        units,
        readings: readings.length,
        read: readings.filter((u) => visited.has(u.subtopicId!)).length,
        next: readings.find((u) => !visited.has(u.subtopicId!)) ?? readings[0] ?? units[0] ?? null,
      };
    }),
  );

  // Resume: the most recently read subtopic that belongs to one of this term's courses.
  const lastId = visits.find((v) => courses.some((c) => c.units.some((u) => u.subtopicId === v.subtopicId)))?.subtopicId;
  const resumeCourse = lastId ? courses.find((c) => c.units.some((u) => u.subtopicId === lastId)) : undefined;

  const selected =
    courses.find((c) => c.course.slug === courseParam) ??
    resumeCourse ??
    [...courses].sort((a, b) => b.units.length - a.units.length)[0];

  let open: OpenUnit | null = null;
  if (selected?.next) {
    const unit = selected.next;
    const sub = unit.subtopicId
      ? await prisma.subtopic.findUnique({ where: { id: unit.subtopicId }, select: { contentHe: true, contentEn: true, relatedProcessSlug: true } })
      : null;
    const text = sub ? (lang === "he" ? sub.contentHe : sub.contentEn) : "";
    const index = selected.units.findIndex((u) => u.key === unit.key);
    // The unit's own animation; otherwise the course's next animation (labelled as such on the page).
    const ownProcess = unit.kind === "process" ? unit.key : sub?.relatedProcessSlug ?? null;
    const courseProcess = [...selected.units.slice(index), ...selected.units.slice(0, index)].find((u) => u.kind === "process")?.key ?? null;
    const processSlug = ownProcess ?? courseProcess;
    const process = processSlug
      ? await prisma.process.findFirst({
          where: { slug: processSlug },
          select: { slug: true, nameHe: true, nameEn: true, topic: { select: { slug: true } }, steps: { orderBy: { order: "asc" }, select: { id: true, order: true, titleHe: true, titleEn: true, descHe: true, descEn: true, svgData: true } } },
        })
      : null;
    const terms = (GLOSSARY[unit.topicSlug] ?? []).filter((t) => text.includes(t.he) || text.toLowerCase().includes(t.en.toLowerCase().split(" (")[0])).slice(0, 4);
    open = {
      course: selected,
      unit,
      index: index + 1,
      excerpt: excerptOf(text),
      terms: terms.map((t) => ({ he: t.he, en: t.en })),
      questions: unit.subtopicId ? bankForSubtopic(unit.subtopicId).length : 0,
      figure: process && process.steps.length
        ? { own: process.slug === ownProcess, processSlug: process.slug, topicSlug: process.topic.slug, nameHe: process.nameHe, nameEn: process.nameEn, steps: process.steps, step: Math.floor((process.steps.length - 1) / 2) }
        : null,
      after: selected.units[index + 1] ?? null,
    };
  }

  const resume = lastId && resumeCourse
    ? { course: resumeCourse, unit: resumeCourse.units.find((u) => u.subtopicId === lastId)! }
    : null;

  const exams = selected ? await prisma.pastExam.count({ where: { courseSlug: selected.course.slug } }).catch(() => 0) : 0;

  return { uni, term, year, courses, selected, open, resume, loggedIn: !!user, dueReviews, exams };
}
