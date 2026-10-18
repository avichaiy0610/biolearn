/* A course plan arranges the same material three ways — by syllabus topic,
   by lecture and by tutorial. Items point into existing content: a lesson
   (optionally one section or worked problem), a site subtopic or animation,
   or a placeholder for material not written yet. */

export type PlanItem =
  | { kind: "lesson"; slug: string; section?: string; problem?: string }
  | { kind: "subtopic"; topic: string; id: string }
  | { kind: "process"; topic: string; slug: string }
  | { kind: "soon"; titleHe: string };

export type PlanGroup = { titleHe: string; items: PlanItem[] };
export type PlanSession = PlanGroup & { n: number };

// How sure we are about an order, strongest first (see the course-track-builder skill).
export type OrderConfidence =
  | "official"       // the course's own published schedule, current year
  | "official-past"  // the course's own schedule from an earlier year
  | "students"       // checked by students of the course
  | "parallel"       // a parallel course (e.g. "no extra credit" pair) — evidence only
  | "consensus"      // the same course across universities
  | "textbook";      // the order of the course textbook

export type OrderSource = {
  confidence: OrderConfidence;
  noteHe: string;
  links?: { labelHe: string; url: string }[];
};

export type CoursePlan = {
  courseSlug: string;
  // Per-view provenance. tutorialOrder null = no tutorial schedule found:
  // tutorials are shown as "practice for lecture n", never as the official order.
  lectureOrder?: OrderSource;
  tutorialOrder?: OrderSource | null;
  // Where the lecture/tutorial order comes from. "suggested" = built from the
  // public syllabus topics; replace with the official schedule when available.
  schedule: "official" | "suggested";
  scheduleNoteHe: string;
  topics: PlanGroup[];
  lectures: PlanSession[];
  tutorials: PlanSession[];
};
