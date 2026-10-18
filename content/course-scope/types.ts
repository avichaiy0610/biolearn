/* Is a lesson section part of a given course? Decided only from the course's own
   documents (see the course-track-builder skill → scope), never from someone's word:

   core      — named in the course's official syllabus, in its assigned reading,
               in the staff's own course material, or asked in a past exam of the course.
   likely    — covered only by a broader heading of the official syllabus.
   extension — no document of this course covers it (e.g. it is only in the textbook).

   Calibration answers from a student are used to test the rule, never as evidence. */

export type ScopeLevel = "core" | "likely" | "extension";

export type ScopeEvidence =
  | "exam"             // asked in a past exam of this course
  | "reading"          // inside the assigned reading (pages/sections) of this course
  | "staff-material"   // the lecturer's own course site / slides
  | "syllabus-named"   // the official syllabus names this topic
  | "syllabus-heading" // only a broader syllabus heading covers it
  | "none";            // no course document covers it

export type ScopeEntry = {
  level: ScopeLevel;
  evidence: ScopeEvidence;
  noteHe: string; // what exactly the evidence says (quote the syllabus wording)
  source?: { labelHe: string; url: string };
};

export type CourseScope = {
  courseSlug: string;
  checkedAt: string; // YYYY-MM-DD
  defaultSource: { labelHe: string; url: string };
  // lesson slug → section id → entry
  sections: Record<string, Record<string, ScopeEntry>>;
};

// Which evidence may support which level — enforced by scripts/check (course_sources.py scope).
export const LEVEL_FOR_EVIDENCE: Record<ScopeEvidence, ScopeLevel> = {
  exam: "core",
  reading: "core",
  "staff-material": "core",
  "syllabus-named": "core",
  "syllabus-heading": "likely",
  none: "extension",
};
