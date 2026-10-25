import "server-only";
import { prisma } from "@/lib/prisma";
import { LESSONS } from "@/content/lessons";
import type { Lesson } from "@/content/lessons/types";

// Admin review of study units. The units live in git; the admin's decision and comments live in the DB, and
// Claude/Codex apply them to the files (scripts/lesson-reviews.ts). "Published" is still the status in the file.

export const DECISIONS = ["pending", "approved", "changes"] as const;
export type Decision = (typeof DECISIONS)[number];

export type ReviewComment = { id: string; sectionId: string | null; body: string; status: string; reply: string | null; createdAt: string };

// Where a unit stands: the file's status plus the admin's decision.
export type ReviewState = "review" | "approved" | "changes" | "published";
export const reviewState = (l: Lesson, decision: Decision | undefined): ReviewState =>
  l.status === "published" ? "published" : decision === "approved" ? "approved" : decision === "changes" ? "changes" : "review";

export async function lessonReview(slug: string) {
  const [row, comments] = await Promise.all([
    prisma.lessonReview.findUnique({ where: { lessonSlug: slug } }).catch(() => null),
    prisma.lessonComment.findMany({ where: { lessonSlug: slug }, orderBy: { createdAt: "desc" } }).catch(() => []),
  ]);
  return {
    decision: (row?.decision ?? "pending") as Decision,
    note: row?.note ?? null,
    comments: comments.map((c): ReviewComment => ({ id: c.id, sectionId: c.sectionId, body: c.body, status: c.status, reply: c.reply, createdAt: c.createdAt.toISOString() })),
  };
}

export type CourseReview = {
  slug: string;
  nameHe: string;
  lessons: { slug: string; titleHe: string; state: ReviewState; decision: Decision; openComments: number; writtenAt: string; writtenBy: string }[];
};

// Every unit, grouped by the course it was written for, with its decision and open-comment count.
export async function courseReviews(): Promise<CourseReview[]> {
  const [rows, open] = await Promise.all([
    prisma.lessonReview.findMany().catch(() => []),
    prisma.lessonComment.groupBy({ by: ["lessonSlug"], where: { status: "open" }, _count: { _all: true } }).catch(() => []),
  ]);
  const decision = new Map(rows.map((r) => [r.lessonSlug, r.decision as Decision]));
  const openCount = new Map(open.map((o) => [o.lessonSlug, o._count._all]));
  const courses = new Map<string, CourseReview>();
  for (const l of LESSONS) {
    const c = courses.get(l.course.slug) ?? { slug: l.course.slug, nameHe: l.course.nameHe, lessons: [] };
    const d = decision.get(l.slug) ?? "pending";
    c.lessons.push({ slug: l.slug, titleHe: l.titleHe, state: reviewState(l, d), decision: d, openComments: openCount.get(l.slug) ?? 0, writtenAt: l.review.writtenAt, writtenBy: l.review.writtenBy });
    courses.set(l.course.slug, c);
  }
  return [...courses.values()];
}
