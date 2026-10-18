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

export type CoursePlan = {
  courseSlug: string;
  // Where the lecture/tutorial order comes from. "suggested" = built from the
  // public syllabus topics; replace with the official schedule when available.
  schedule: "official" | "suggested";
  scheduleNoteHe: string;
  topics: PlanGroup[];
  lectures: PlanSession[];
  tutorials: PlanSession[];
};
