import "server-only";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getCourses, type CourseRecord } from "@/lib/courses-db";
import { resolveUnitsWith, unitCatalog, type ResolvedUnit } from "@/lib/course-data";
import { selectedTerm, selectedUniversity } from "@/lib/university";
import { GLOSSARY } from "@/content/glossary";
import { bankForSubtopic } from "@/content/question-bank";
import { parseSvgData } from "@/lib/svg-scene";
import { planForCourse, planUnitCount } from "@/content/course-plans";
import { lessonBySlug } from "@/content/lessons";
import type { Lesson } from "@/content/lessons/types";

export type HomeCourse = {
  course: CourseRecord;
  icon: string; // topic slug for FieldIcon
  units: ResolvedUnit[];
  readings: number; // subtopic (reading) units
  read: number;
  next: ResolvedUnit | null;
};

// What the "open now" card points to: an old course unit (subtopic / animation) or a study unit from the course plan.
export type OpenRef = { key: string; kind: "subtopic" | "process" | "lesson"; href: string; nameHe: string; nameEn: string; topicSlug: string };

export type OpenUnit = {
  course: HomeCourse;
  unit: OpenRef;
  index: number; // 1-based position in the course
  total: number;
  minutes: number | null; // a study unit's own reading time; null = estimate from the excerpt
  excerpt: string;
  terms: { he: string; en: string }[];
  questions: number;
  figure: { own: boolean; processSlug: string; topicSlug: string; nameHe: string; nameEn: string; steps: { id: string; order: number; titleHe: string; titleEn: string; descHe: string; descEn: string; svgData: string }[]; step: number } | null;
  after: OpenRef | null;
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

// A course plan's own study units in lecture order. Refresher units from other courses are left out.
function planLessons(courseSlug: string): Lesson[] {
  const plan = planForCourse(courseSlug);
  if (!plan) return [];
  const out: Lesson[] = [];
  for (const it of [...plan.lectures, ...plan.topics].flatMap((s) => s.items)) {
    if (it.kind !== "lesson" || out.some((l) => l.slug === it.slug)) continue;
    const l = lessonBySlug(it.slug);
    if (l && l.course.slug === courseSlug) out.push(l);
  }
  return out;
}

const animationsIn = (l: Lesson) => [...l.bodyHe.matchAll(/\[\[animation:([\w-]+)\]\]/g)].map((m) => m[1]);

export async function homeData(lang: string, courseParam?: string) {
  const [uni, term, session] = await Promise.all([selectedUniversity(), selectedTerm(), auth().catch(() => null)]);
  // One round trip for everything that doesn't depend on the term: the cached
  // course table and unit catalog, plus the student's own progress.
  const email = session?.user?.email;
  const [all, catalog, visits, dueReviews] = await Promise.all([
    getCourses(uni.slug),
    unitCatalog(),
    email
      ? prisma.userProgress.findMany({ where: { user: { email }, visited: true }, select: { subtopicId: true, updatedAt: true }, orderBy: { updatedAt: "desc" } })
      : Promise.resolve([] as { subtopicId: string; updatedAt: Date }[]),
    email ? prisma.flashcardReview.count({ where: { user: { email }, due: { lte: new Date() } } }) : Promise.resolve(0),
  ]);

  // Courses of the chosen term (plus year-long ones); fall back to the year, then the first year with courses.
  let year = term.year;
  // Until the student picks a term, show the whole year (a single semester can be one course).
  let list = all.filter((c) => c.year === year && (!term.chosen || c.semester === term.semester || c.semester === "Y"));
  if (!list.length) list = all.filter((c) => c.year === year);
  if (!list.length && all.length) { year = all[0].year; list = all.filter((c) => c.year === year); }

  const visited = new Set(visits.map((v) => v.subtopicId));

  const courses: HomeCourse[] = list.map((course) => {
      const units = resolveUnitsWith(catalog, course, lang);
      const readings = units.filter((u) => u.kind === "subtopic");
      return {
        course,
        icon: course.units[0]?.topic ?? "cell-biology",
        units,
        readings: readings.length,
        read: readings.filter((u) => visited.has(u.subtopicId!)).length,
        next: readings.find((u) => !visited.has(u.subtopicId!)) ?? readings[0] ?? units[0] ?? null,
      };
    });

  // Resume: the most recently read subtopic that belongs to one of this term's courses.
  const lastId = visits.find((v) => courses.some((c) => c.units.some((u) => u.subtopicId === v.subtopicId)))?.subtopicId;
  const resumeCourse = lastId ? courses.find((c) => c.units.some((u) => u.subtopicId === lastId)) : undefined;

  const selected =
    courses.find((c) => c.course.slug === courseParam) ??
    resumeCourse ??
    [...courses].sort((a, b) => (planUnitCount(b.course.slug) ?? b.units.length) - (planUnitCount(a.course.slug) ?? a.units.length))[0];

  let open: OpenUnit | null = null;
  let exams = 0;
  // Only v2 scenes can be drawn as a still (legacy/Lottie animations need their player).
  const loadFigure = async (candidates: string[], own: string | null) => {
    if (!candidates.length) return null;
    const found = await prisma.process.findMany({
      where: { slug: { in: candidates } },
      select: { slug: true, nameHe: true, nameEn: true, topic: { select: { slug: true } }, steps: { orderBy: { order: "asc" }, select: { id: true, order: true, titleHe: true, titleEn: true, descHe: true, descEn: true, svgData: true } } },
    });
    const drawable = (p: (typeof found)[number]) => p.steps.length > 0 && p.steps.every((st) => (parseSvgData(st.svgData).v ?? 1) >= 2);
    const p = candidates.map((slug) => found.find((x) => x.slug === slug)).find((x) => x && drawable(x)) ?? null;
    return p ? { own: p.slug === own, processSlug: p.slug, topicSlug: p.topic.slug, nameHe: p.nameHe, nameEn: p.nameEn, steps: p.steps, step: Math.floor((p.steps.length - 1) / 2) } : null;
  };
  const lessons = selected ? planLessons(selected.course.slug) : [];
  const ref = (l: Lesson): OpenRef => ({ key: `lesson:${l.slug}`, kind: "lesson", href: `/${lang}/learn/${l.slug}`, nameHe: l.titleHe, nameEn: l.titleHe, topicSlug: l.topic });

  if (selected && lessons.length) {
    // A course with a plan opens its study units (the old DB units predate the plans).
    const l = lessons[0];
    const own = animationsIn(l)[0] ?? null;
    const candidates = [...new Set([own, ...lessons.flatMap(animationsIn), ...selected.units.filter((u) => u.kind === "process").map((u) => u.key)].filter(Boolean) as string[])].slice(0, 4);
    const [figure, examCount] = await Promise.all([
      loadFigure(candidates, own),
      prisma.pastExam.count({ where: { courseSlug: selected.course.slug, status: "approved" } }).catch(() => 0),
    ]);
    exams = examCount;
    open = {
      course: selected,
      unit: ref(l),
      index: 1,
      total: lessons.length,
      minutes: l.minutes,
      excerpt: excerptOf(l.leadHe),
      terms: l.terms.slice(0, 4),
      questions: l.questions.length,
      figure,
      after: lessons[1] ? ref(lessons[1]) : null,
    };
  } else if (selected?.next) {
    const unit = selected.next;
    const index = selected.units.findIndex((u) => u.key === unit.key);
    // The unit's own animation; otherwise the course's next animation (labelled as such on the page).
    const ownProcess = unit.kind === "process" ? unit.key : unit.relatedProcessSlug ?? null;
    const candidates = [...new Set([ownProcess, ...[...selected.units.slice(index), ...selected.units.slice(0, index)].filter((u) => u.kind === "process").map((u) => u.key)].filter(Boolean) as string[])].slice(0, 4);
    const [sub, figure, examCount] = await Promise.all([
      unit.subtopicId ? prisma.subtopic.findUnique({ where: { id: unit.subtopicId }, select: { contentHe: true, contentEn: true } }) : Promise.resolve(null),
      loadFigure(candidates, ownProcess),
      prisma.pastExam.count({ where: { courseSlug: selected.course.slug, status: "approved" } }).catch(() => 0),
    ]);
    exams = examCount;
    const text = sub ? (lang === "he" ? sub.contentHe : sub.contentEn) : "";
    const terms = (GLOSSARY[unit.topicSlug] ?? []).filter((t) => text.includes(t.he) || text.toLowerCase().includes(t.en.toLowerCase().split(" (")[0])).slice(0, 4);
    open = {
      course: selected,
      unit,
      index: index + 1,
      total: selected.units.length,
      minutes: null,
      excerpt: excerptOf(text),
      terms: terms.map((t) => ({ he: t.he, en: t.en })),
      questions: unit.subtopicId ? bankForSubtopic(unit.subtopicId).length : 0,
      figure,
      after: selected.units[index + 1] ?? null,
    };
  }

  const resume = lastId && resumeCourse
    ? { course: resumeCourse, unit: resumeCourse.units.find((u) => u.subtopicId === lastId)! }
    : null;

  return { uni, term, year, courses, selected, open, resume, loggedIn: !!email, dueReviews, exams };
}
