import type { CoursePlan, PlanItem, PlanSession } from "./types";
import type { Lesson } from "../lessons/types";
import { ubHistory } from "../lessons/technion-ubiquitin/ub-history";
import { ubConjugation } from "../lessons/technion-ubiquitin/ub-conjugation";
import { ubTrafficking } from "../lessons/technion-ubiquitin/ub-trafficking";
import { ubDrugs } from "../lessons/technion-ubiquitin/ub-drugs";
import { ubCode } from "../lessons/technion-ubiquitin/ub-code";
import { ubProteasome } from "../lessons/technion-ubiquitin/ub-proteasome";
import { ubLike } from "../lessons/technion-ubiquitin/ub-like";
import { ubCellCycle } from "../lessons/technion-ubiquitin/ub-cell-cycle";
import { ubTranscription } from "../lessons/technion-ubiquitin/ub-transcription";
import { ubGenome } from "../lessons/technion-ubiquitin/ub-genome";
import { ubCancerDeath } from "../lessons/technion-ubiquitin/ub-cancer-death";
import { ubNeurons } from "../lessons/technion-ubiquitin/ub-neurons";
import { ubImmune } from "../lessons/technion-ubiquitin/ub-immune";
import { cellQualityControl } from "../lessons/technion-cell/cell-quality-control";
import { cellCycleControl } from "../lessons/technion-cell/cell-cycle-control";

// 2026-11-01: the course's own syllabus + tentative schedule for Winter 2024-25 (Prof. Michael Glickman) and the
// weekly quizzes 2016-2022 were found in the Drive. They name three lectures the track had no unit for: history and
// discovery (L2), endocytosis/MVB + autophagy and mitophagy (L8), and drug discovery + PROTACs/molecular glues
// (L9-L10). No exam: ~76% a critique of a 2020-2024 paper + a research proposal, ~24% weekly quizzes.
// Technion 01340140 "יוביקוויטין ומחזור חלבונים" (Biology faculty, 2 points, 2 lecture hours, no tutorials) — built
// with the course-track-builder skill, no insider input. Lecturer: Prof. Michael H. Glickman (proteasome lab); TA in
// 2025: Sonu Joseph. Prerequisites: biochemistry + cell biology. Evidence: the CURRENT portal paragraph only — the
// portal lists no books, Moodle is closed to guests, and no detailed syllabus is public (searched 2026-10-25).
// Scope (step 5a), reviewed by Codex before writing (2026-10-25): 10 units. The portal paragraph has two halves —
// the machinery ("components of the system, their structure and mode of action; the proteasome mechanism") and the
// application areas it lists one by one. The order below follows that: machinery first, then one unit per area, in
// the paragraph's own order (transcription → genome integrity → cell cycle → cancer/cell death → neurons → immunity).
// Codex's main scope cut: no catalogues (every linkage, every DUB family, every oncogenic E3) and no separate
// autophagy unit; each shared example is assigned to exactly one unit. Basic UPS and the cell-cycle events themselves
// are prerequisites (cell-quality-control, cell-cycle-control) and are linked as refreshers, not rewritten.
// Units written against Alberts MBoC 7e and Lodish MCB 9e (on disk) plus the lecturer's own Physiol. Rev. review.

const sec = (l: Lesson, ...ids: string[]): PlanItem[] => (ids.length ? ids.map((section) => ({ kind: "lesson" as const, slug: l.slug, section })) : [{ kind: "lesson", slug: l.slug }]);
const probs = (l: Lesson): PlanItem[] => (l.workedProblems ?? []).map((w) => ({ kind: "lesson" as const, slug: l.slug, problem: w.id }));

const PORTAL = { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134140" };

const LECTURES: { titleHe: string; items: PlanItem[]; practice: PlanItem[] }[] = [
  { titleHe: "ההיסטוריה והגילוי של מערכת היוביקוויטין", items: sec(ubHistory), practice: probs(ubHistory) },
  { titleHe: "הצמדת יוביקוויטין ובחירת המצע", items: [...sec(cellQualityControl, "ups"), ...sec(ubConjugation)], practice: probs(ubConjugation) },
  { titleHe: "קוד היוביקוויטין: שרשראות, קוראים ו-DUBs", items: sec(ubCode), practice: probs(ubCode) },
  { titleHe: "הפרוטאזום כמכונה תלוית אנרגיה", items: sec(ubProteasome), practice: probs(ubProteasome) },
  { titleHe: "מולקולות דמויות יוביקוויטין ודרכי פירוק חלופיות", items: sec(ubLike), practice: probs(ubLike) },
  { titleHe: "בקרת שעתוק וכרומטין", items: sec(ubTranscription), practice: probs(ubTranscription) },
  { titleHe: "שלמות הגנום", items: sec(ubGenome), practice: probs(ubGenome) },
  { titleHe: "בקרת מחזור התא", items: [...sec(cellCycleControl, "ubiquitin"), ...sec(ubCellCycle)], practice: probs(ubCellCycle) },
  { titleHe: "אנדוציטוזה, ליזוזום ומיטופגיה", items: sec(ubTrafficking), practice: probs(ubTrafficking) },
  { titleHe: "סרטן ומוות תאי", items: sec(ubCancerDeath), practice: probs(ubCancerDeath) },
  { titleHe: "תרופות במערכת היוביקוויטין", items: sec(ubDrugs), practice: probs(ubDrugs) },
  { titleHe: "נוירונים: סינפסה, התחדשות וניוון", items: sec(ubNeurons), practice: probs(ubNeurons) },
  { titleHe: "התגובה החיסונית", items: sec(ubImmune), practice: probs(ubImmune) },
];

export const technionUbiquitinPlan: CoursePlan = {
  courseSlug: "technion-ubiquitin",
  lectureOrder: {
    confidence: "syllabus",
    noteHe: "אין לוח הרצאות ציבורי לקורס (אתר הקורס במודל סגור, ולא נמצא סילבוס מפורט). הסדר כאן לפי תיאור הקורס בפורטל: קודם המערכת עצמה (רכיביה, מבנם ואופן פעולתם, ומנגנון הפרוטאזום), ואחר כך תחום יישום אחד לכל הרצאה — לפי סדר התחומים ברשימה שבתיאור.",
    links: [PORTAL],
  },
  tutorialOrder: null,
  schedule: "suggested",
  scheduleNoteHe: "הנושאים לפי תיאור הקורס בפורטל הטכניון (2 נקודות זכות, 2 שעות הרצאה, בלי תרגיל). בפורטל לא רשומים ספרים; הפירוט לפי Alberts 7e ו-Lodish 9e, וסקירת הסקירה של גליקמן וצ'חנובר. מערכת היוביקוויטין הבסיסית ומחזור התא נלמדים בקורסי הקדם ומקושרים כאן כרענון. התרגילים הפתורים כאן לתרגול עצמי — לקורס אין תרגול רשמי.",
  topics: [
    { titleHe: "בקרה ביולוגית של מסלולים תאיים על ידי מערכת היוביקוויטין-פרוטאזום לפירוק חלבונים בררני", items: [...sec(ubConjugation, "cascade", "degrons", "measuring"), ...sec(cellQualityControl, "ups")] },
    { titleHe: "כיצד סימון על-ידי יוביקוויטין או מולקולות דמויי יוביקוויטין משנה זיהוי חלבונים, אינטראקציות וגורל", items: [...sec(ubCode), ...sec(ubLike)] },
    { titleHe: "מרכיבי המערכת, מבנם ואופן פעולתם", items: sec(ubConjugation, "ubiquitin", "e3-types", "quality-control") },
    { titleHe: "מנגנון הפרוטאזום: מכונה ביולוגית תלוית אנרגיה", items: sec(ubProteasome) },
    { titleHe: "מעורבות בוויסות שעתוק", items: sec(ubTranscription) },
    { titleHe: "שלמות הגנום", items: sec(ubGenome) },
    { titleHe: "בקרת מחזור התא", items: [...sec(ubCellCycle), ...sec(cellCycleControl, "ubiquitin")] },
    { titleHe: "סרטן, מוות תאי", items: sec(ubCancerDeath) },
    { titleHe: "היסטוריה וגילוי המערכת (מלוח ההרצאות 2024)", items: sec(ubHistory) },
    { titleHe: "אנדוציטוזה, מיון ואוטופגיה (מלוח ההרצאות 2024)", items: sec(ubTrafficking) },
    { titleHe: "גילוי תרופות ופירוק ממוקד (מלוח ההרצאות 2024)", items: sec(ubDrugs) },
    { titleHe: "נוירונים, רגנרציה של נוירונים, מחלות ניווניות", items: sec(ubNeurons) },
    { titleHe: "התגובה החיסונית", items: [...sec(ubImmune), ...sec(ubProteasome, "alternatives")] },
  ],
  lectures: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.items })),
  tutorials: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.practice })).filter((t) => t.items.length > 0),
};
