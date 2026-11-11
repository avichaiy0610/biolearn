/* Official syllabi, pulled from each university's public sources by
   scripts/syllabus-fetch.ts and kept in the repo (content/syllabi/data.generated.ts),
   so course plans can follow the CURRENT syllabus and every change is reviewable.

   level — how much order the source gives, and so how much the site may claim:
     "lectures" — topics tied to lecture numbers or ranges (e.g. Bar-Ilan)
     "topics"   — an official topic list without weeks (HUJI, TAU, Technion) */

export type SyllabusSource = "huji-api" | "tau-ims" | "technion-portal" | "biu-pdf" | "bgu-catalog" | "haifa-pdf";

export type SyllabusRecord = {
  courseSlug: string; // our course
  university: string;
  code: string; // official course code
  nameHe: string; // course name as the source gives it (checked against ours)
  year?: number; // academic year of the syllabus, when the source states it
  updatedHe?: string; // "last updated" as the source states it
  fetchedAt: string; // ISO date of our fetch
  source: SyllabusSource;
  sourceUrl: string;
  level: "lectures" | "topics";
  contentHe: string; // the official topic text, verbatim
  topicsHe: string[]; // best-effort split of contentHe
  sessions?: { lectures: string; topicsHe: string[] }[]; // e.g. { lectures: "1–7", ... }
  notTaughtHe?: string[]; // "לא ילמדו השנה"
  books?: string[];

  // What the source also states (kept so nothing the university published is thrown away).
  semesterHe?: string; // the semester the source describes, e.g. "חורף 2026/27"
  teachers?: { role: string; name: string }[];
  assessmentHe?: string[]; // grading / requirements lines, verbatim
  examDates?: string[];
  outcomesHe?: string; // learning outcomes
  descriptionHe?: string; // course description, when separate from the topic list
  /** TAU: is there a detailed syllabus file, and can the public read it? */
  detail?: { state: "file" | "students-only" | "none"; url?: string };
  /** A weekly/lesson table exists in the document but could not be parsed reliably — read textFile by eye. */
  hasUnparsedSchedule?: boolean;
  /** Second official source used for the current semester (Technion SAP catalog). */
  extraSource?: { nameHe: string; url: string };
  /** Proof: the full extracted text (in git) and its hash; raw files stay local (syllabuses/_fetched). */
  evidence?: { textFile: string; sha256: string; rawFiles?: string[] };
  /** Things a person must look at (stale source, unparsed table, nothing about grading…). Not shown on the site. */
  warnings?: string[];
};
