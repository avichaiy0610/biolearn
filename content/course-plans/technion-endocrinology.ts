import type { CoursePlan, PlanItem, PlanSession } from "./types";
import type { Lesson } from "../lessons/types";
import { enIntro } from "../lessons/technion-endocrinology/en-intro";
import { enReceptors } from "../lessons/technion-endocrinology/en-receptors";
import { enControl } from "../lessons/technion-endocrinology/en-control";
import { enPituitary } from "../lessons/technion-endocrinology/en-pituitary";
import { enGrowth } from "../lessons/technion-endocrinology/en-growth";
import { enThyroid } from "../lessons/technion-endocrinology/en-thyroid";
import { enHpg } from "../lessons/technion-endocrinology/en-hpg";
import { enReproduction } from "../lessons/technion-endocrinology/en-reproduction";
import { enAdrenal } from "../lessons/technion-endocrinology/en-adrenal";
import { enPancreas } from "../lessons/technion-endocrinology/en-pancreas";

// Technion 01340155 "אנדוקרינולוגיה" (Faculty of Biology, elective, year 3) — built with the course-track-builder
// skill, no insider input. Evidence: the CURRENT portal paragraph (nine topics, no weeks) and the official book list
// (Holt & Hanley; Johnson, Essential Reproduction; Greenspan; Harrison's; Williams — none on disk; facts checked against
// Berne & Levy, which is). Moodle closed to guests; lecturer 2025–2027: Dr. Philippa Melamed; TA 2027: Gil Golan.
// No detailed syllabus, exams or summaries found. "No extra credit" pairs: 134055 (old code), 136044 (molecular
// mechanisms of hormone action), 274328 (Medicine, clinical) — different courses, evidence only.
// Scope (step 5a), reviewed by Codex before writing (2026-10-23): ten units, one per portal topic, with reproduction
// split into the axis (en-hpg) and the gonads and cycles (en-reproduction). NOT written: parathyroid, calcium and
// vitamin D ("בלוטת המגן" is the thyroid), detailed promoter regulation and signaling networks, and clinical depth —
// diseases appear only as short physiological illustrations. Order: the portal order. No tutorials listed.

const sec = (l: Lesson, ...ids: string[]): PlanItem[] => (ids.length ? ids.map((section) => ({ kind: "lesson" as const, slug: l.slug, section })) : [{ kind: "lesson", slug: l.slug }]);
const probs = (l: Lesson): PlanItem[] => (l.workedProblems ?? []).map((w) => ({ kind: "lesson" as const, slug: l.slug, problem: w.id }));

const PORTAL = { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134155" };

const LECTURES: { titleHe: string; items: PlanItem[]; practice: PlanItem[] }[] = [
  { titleHe: "מה עושים הורמונים: המערכת האנדוקרינית", items: sec(enIntro), practice: probs(enIntro) },
  { titleHe: "קולטנים ומנגנוני הפעולה של הורמונים", items: sec(enReceptors), practice: probs(enReceptors) },
  { titleHe: "בקרה על הפרשת הורמונים", items: sec(enControl), practice: probs(enControl) },
  { titleHe: "ההיפותלמוס וההיפופיזה", items: sec(enPituitary), practice: probs(enPituitary) },
  { titleHe: "הבקרה האנדוקרינית על גדילה", items: sec(enGrowth), practice: probs(enGrowth) },
  { titleHe: "בלוטת המגן (התריס)", items: sec(enThyroid), practice: probs(enThyroid) },
  { titleHe: "ציר הרבייה: GnRH, LH ו-FSH", items: sec(enHpg), practice: probs(enHpg) },
  { titleHe: "האשכים, השחלות והמחזור החודשי", items: sec(enReproduction), practice: probs(enReproduction) },
  { titleHe: "בלוטת האדרנל וסטרואידוגנזה", items: sec(enAdrenal), practice: probs(enAdrenal) },
  { titleHe: "הלבלב וסוכרת", items: sec(enPancreas), practice: probs(enPancreas) },
];

export const technionEndocrinologyPlan: CoursePlan = {
  courseSlug: "technion-endocrinology",
  lectureOrder: {
    confidence: "syllabus",
    noteHe: "אין לוח הרצאות ציבורי (אתר הקורס במודל סגור). הסדר כאן הוא סדר הנושאים בסילבוס הרשמי; נושא הרבייה מחולק לשתי יחידות — הציר, והגונדות והמחזור.",
    links: [PORTAL],
  },
  tutorialOrder: null,
  schedule: "suggested",
  scheduleNoteHe: "הנושאים לפי הסילבוס בפורטל הטכניון. ספרי הקורס (Holt & Hanley, Johnson ועוד) לא היו זמינים; הפירוט לפי ספרי פיזיולוגיה מקבילים. בקורס אין תרגולים רשומים — התרגילים הפתורים כאן לתרגול עצמי.",
  topics: [
    { titleHe: "מבוא: מה עושים הורמונים ומה היא המערכת האנדוקרינית", items: sec(enIntro) },
    { titleHe: "סוגים של הורמונים ורצפטורים, ומנגנוני ההשפעה שלהם", items: [...sec(enIntro, "classes", "transport"), ...sec(enReceptors)] },
    { titleHe: "בקרה על פעילות הורמונאלית והמערכת האנדוקרינית", items: sec(enControl) },
    { titleHe: "ההיפופיזה — בלוטה מרכזית במערכת האנדוקרינית", items: sec(enPituitary) },
    { titleHe: "הבקרה האנדוקרינית על גדילה", items: sec(enGrowth) },
    { titleHe: "בלוטת המגן", items: sec(enThyroid) },
    { titleHe: "תפקידי המערכת האנדוקרינית ברבייה", items: [...sec(enHpg), ...sec(enReproduction)] },
    { titleHe: "בלוטת האדרנל וסטראוידוגנזה", items: sec(enAdrenal) },
    { titleHe: "הלבלב וסוכרת", items: sec(enPancreas) },
  ],
  lectures: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.items })),
  tutorials: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.practice })).filter((t) => t.items.length > 0),
};
