/* A full study unit ("lesson"): the academic reading behind a course unit.
   Lessons live in the repo (reviewable in git); a draft is reachable by direct
   link with a "draft" banner and is not linked from courses until published.

   Body is Markdown in Hebrew. Conventions:
   - `## heading` sections build the table of contents.
   - Inline code (`AB/ab`, `RF`) renders as an isolated LTR span — use it for
     genotypes, symbols and formulas inside Hebrew text.
   - A line `[[figure:<id>]]` inserts a drawn figure (components/lesson/LessonFigure.tsx).
   - A line `[[animation:<process-slug>]]` inserts a link card to a site animation. */

import type { BankOption } from "@/content/question-bank";

export type LessonRef = { kind: "book" | "paper"; text: string }; // citation, in English

export type LessonQuestion = {
  id: string;
  difficulty: "easy" | "medium" | "hard";
  question: string;
  options: BankOption[];
  correct: number;
};

export type Lesson = {
  slug: string;
  status: "draft" | "published";
  topic: string; // topic slug (field icon, glossary)
  course: { slug: string; nameHe: string }; // the course this unit was written for
  subtopicId?: string; // set when published and linked to a site subtopic
  titleHe: string;
  leadHe: string; // one-paragraph summary shown under the title
  minutes: number;
  objectivesHe: string[];
  bodyHe: string;
  experiment: { titleHe: string; bodyHe: string }; // "how we know"
  trapsHe: string[]; // common exam mistakes
  terms: { he: string; en: string }[];
  questions: LessonQuestion[];
  refs: LessonRef[];
  review: { writtenBy: string; writtenAt: string; aiCheckedBy?: string; reviewedBy?: string; reviewedAt?: string };
};
