import type { CoursePlan, PlanItem, PlanSession } from "./types";
import type { Lesson } from "../lessons/types";
import { dvPrinciples } from "../lessons/technion-developmental/dv-principles";
import { dvSignaling } from "../lessons/technion-developmental/dv-signaling";
import { dvFlyAxes } from "../lessons/technion-developmental/dv-fly-axes";
import { dvHox } from "../lessons/technion-developmental/dv-hox";
import { dvFlyOrgans } from "../lessons/technion-developmental/dv-fly-organs";
import { dvWorm } from "../lessons/technion-developmental/dv-worm";
import { dvVertebrateAxes } from "../lessons/technion-developmental/dv-vertebrate-axes";
import { dvLimb } from "../lessons/technion-developmental/dv-limb";
import { dvGenes } from "../lessons/technion-developmental/dv-genes";
import { dvRegeneration } from "../lessons/technion-developmental/dv-regeneration";
import { dvEvoDevo } from "../lessons/technion-developmental/dv-evo-devo";

// Technion 01340069 "ביולוגיה של ההתפתחות" (Biology faculty, year-3 elective) — built with the course-track-builder
// skill, no insider input. Evidence: the CURRENT portal paragraph (three parts — morphogenesis and body pattern;
// differentiation and organ formation; evolution and development — no weeks). Books (portal): Gilbert & Barresi 13e,
// Wolpert 6e (both on disk). Moodle closed to guests; lecturers 2025–2027: Prof. Benjamin Podbilewicz, Dr. Nicolás
// Brukman, Dr. Ella Preger-Ben Noon. "No extra credit" pair 136105 is a different course (not used for order or scope).
// Scope (step 5a), reviewed by Codex before writing (2026-10-23): 11 units; named topics core, textbook mechanisms
// under them "likely"; added morphogenesis mechanics, gonad morphogenesis and cell-size control; trimmed morpholinos,
// Turing models, organ-size and the regeneration survey to brief mentions.
// Order: the paragraph's own topic order (A → B → C), labelled "syllabus".

const sec = (l: Lesson, ...ids: string[]): PlanItem[] => (ids.length ? ids.map((section) => ({ kind: "lesson" as const, slug: l.slug, section })) : [{ kind: "lesson", slug: l.slug }]);
const probs = (l: Lesson): PlanItem[] => (l.workedProblems ?? []).map((w) => ({ kind: "lesson" as const, slug: l.slug, problem: w.id }));

const PORTAL = { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134069" };

const LECTURES: { titleHe: string; items: PlanItem[]; practice: PlanItem[] }[] = [
  { titleHe: "עקרונות: קביעת גורל, מורפוגנים, השראה ומורפוגנזה", items: sec(dvPrinciples), practice: probs(dvPrinciples) },
  { titleHe: "אינטראקציות תא-תא ואפופטוזיס", items: sec(dvSignaling), practice: probs(dvSignaling) },
  { titleHe: "יצירת תבנית הגוף בזבוב התסיסה", items: sec(dvFlyAxes), practice: probs(dvFlyAxes) },
  { titleHe: "גנים הומיאוטיים וגני-על", items: sec(dvHox), practice: probs(dvHox) },
  { titleHe: "הזבוב מהעובר לבוגר: הדיסקות, הכנף והעין", items: sec(dvFlyOrgans), practice: probs(dvFlyOrgans) },
  { titleHe: "הנמטודה: צירים, אברי המין והפות", items: sec(dvWorm), practice: probs(dvWorm) },
  { titleHe: "צירי הגוף בעוף ובעכבר", items: sec(dvVertebrateAxes), practice: probs(dvVertebrateAxes) },
  { titleHe: "הגפה: הכנף בעוף והאצבעות בעכבר", items: sec(dvLimb), practice: probs(dvLimb) },
  { titleHe: "גנים התפתחותיים: זיהוי, בקרה, קביעה וגודל התא", items: sec(dvGenes), practice: probs(dvGenes) },
  { titleHe: "התחדשות (רגנרציה)", items: sec(dvRegeneration), practice: probs(dvRegeneration) },
  { titleHe: "התפתחות ואבולוציה", items: sec(dvEvoDevo), practice: probs(dvEvoDevo) },
];

export const technionDevelopmentalPlan: CoursePlan = {
  courseSlug: "technion-developmental",
  lectureOrder: {
    confidence: "syllabus",
    noteHe: "אין לוח הרצאות ציבורי לקורס (אתר הקורס במודל סגור). הסדר כאן לפי סדר הנושאים בסילבוס שבפורטל (חלק א — מורפוגנזה ותבנית הגוף, ב — דיפרנציאציה ויצירת איברים, ג — אבולוציה והתפתחות). הסדר בהרצאות עצמן עשוי להיות שונה.",
    links: [PORTAL],
  },
  tutorialOrder: null,
  schedule: "suggested",
  scheduleNoteHe: "הנושאים לפי הסילבוס בפורטל הטכניון; הפירוט לפי ספרי הקורס (Gilbert & Barresi, Wolpert). התרגילים הפתורים כאן לתרגול עצמי — סדר התרגולים בקורס לא פורסם.",
  topics: [
    { titleHe: "מורפוגנזה", items: sec(dvPrinciples, "morphogenesis") },
    { titleHe: "יצירת תבניות הגוף", items: [...sec(dvPrinciples, "fate", "specification"), ...sec(dvFlyAxes)] },
    { titleHe: "גרדיינטים ושדות מורפוגנטיים", items: [...sec(dvPrinciples, "morphogens", "induction"), ...sec(dvFlyAxes, "maternal")] },
    { titleHe: "התפתחות איברים בזבוב התסיסה מהעובר ועד הבוגר", items: sec(dvFlyOrgans, "imaginal-discs", "wing") },
    { titleHe: "מורפוגנים, גני-על וגנים הומיאוטיים", items: sec(dvHox) },
    { titleHe: "הבסיס המולקולרי לקביעת הצירים בעוברי הנמטודה, העוף והעכבר", items: [...sec(dvWorm, "model", "par", "early-fates"), ...sec(dvVertebrateAxes)] },
    { titleHe: "תפקיד אינטראקציות תא-תא ואפופטוזיס בהתפתחות", items: sec(dvSignaling) },
    { titleHe: "זיהוי ובידוד גנים הקשורים להתפתחות", items: sec(dvGenes, "forward", "tools", "necessary-sufficient") },
    { titleHe: "הבקרה על ביטוי גנים בהתפתחות", items: sec(dvGenes, "enhancers", "master-genes") },
    { titleHe: "רגנרציה", items: sec(dvRegeneration) },
    { titleHe: "קביעת גודל התא, דטרמינציה ודיפרנציאציה", items: sec(dvGenes, "determination", "cell-size") },
    { titleHe: "יצירת אברי המין בנמטודה", items: sec(dvWorm, "gonad", "vulva", "fusion") },
    { titleHe: "העין בזבוב התסיסה", items: sec(dvFlyOrgans, "eye-master", "ommatidium") },
    { titleHe: "הכנף בעוף והאצבעות בעכבר", items: sec(dvLimb) },
    { titleHe: "ממאגרי גנים דומים ליצירת אורגניזמים שונים", items: sec(dvEvoDevo, "toolkit", "deep-homology") },
    { titleHe: "שינויים אבולוציוניים בגנים התפתחותיים ובבקרה על ביטוי גנים", items: sec(dvEvoDevo, "cis-regulatory", "hox-body-plans", "dorsal-ventral-inversion") },
  ],
  lectures: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.items })),
  tutorials: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.practice })).filter((t) => t.items.length > 0),
};
