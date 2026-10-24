import type { CoursePlan, PlanItem, PlanSession } from "./types";
import type { Lesson } from "../lessons/types";
import { nbCells } from "../lessons/technion-neurobiology/nb-cells";
import { nbChannels } from "../lessons/technion-neurobiology/nb-channels";
import { nbSynapse } from "../lessons/technion-neurobiology/nb-synapse";
import { nbLearningMemory } from "../lessons/technion-neurobiology/nb-learning-memory";
import { nbDevelopment } from "../lessons/technion-neurobiology/nb-development";
import { nbNeurodegeneration } from "../lessons/technion-neurobiology/nb-neurodegeneration";
import { nbNeuroimmune } from "../lessons/technion-neurobiology/nb-neuroimmune";
import { nbMethods } from "../lessons/technion-neurobiology/nb-methods";
import { phMembranePotential } from "../lessons/technion-physiology/ph-membrane-potential";
import { phActionPotential } from "../lessons/technion-physiology/ph-action-potential";
import { phSynapse } from "../lessons/technion-physiology/ph-synapse";

// Technion 01340157 "מבוא לנוירוביולוגיה" (Biology faculty) — built with the course-track-builder skill, no insider
// input. Evidence: the CURRENT portal paragraph (7 themes, no weeks). Books (portal): Bear, Connors & Paradiso,
// Neuroscience: Exploring the Brain (5e on disk); Kandel, Principles of Neural Science (not on disk). Moodle closed to
// guests; lecturers 2025–2027: Prof. Noga Ron-Harel, Dr. Inbal Shainer-Gali. "No extra credit" pair 66528
// (Biotechnology, Zeisel — research methods; evidence only).
// Scope (step 5a), reviewed by Codex before writing (2026-10-24): 8 units; memory and learning get the most weight;
// units 2–3 are molecular and link the physiology units of 134117 as refreshers; added neural integration, electrical
// synapses and causal inference in methods; no exhaustive gene/ligand/drug catalogues.
// Order: the paragraph's own theme order, labelled "syllabus".

const sec = (l: Lesson, ...ids: string[]): PlanItem[] => (ids.length ? ids.map((section) => ({ kind: "lesson" as const, slug: l.slug, section })) : [{ kind: "lesson", slug: l.slug }]);
const probs = (l: Lesson): PlanItem[] => (l.workedProblems ?? []).map((w) => ({ kind: "lesson" as const, slug: l.slug, problem: w.id }));

const PORTAL = { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134157" };

const LECTURES: { titleHe: string; items: PlanItem[]; practice: PlanItem[] }[] = [
  { titleHe: "התאים של מערכת העצבים", items: sec(nbCells), practice: probs(nbCells) },
  { titleHe: "הבסיס המולקולרי: תעלות יונים (רענון: פוטנציאל המנוחה ופוטנציאל הפעולה)", items: [...sec(phMembranePotential), ...sec(phActionPotential), ...sec(nbChannels)], practice: probs(nbChannels) },
  { titleHe: "הסינפסה ועיבוד המידע (רענון: הסינפסה בפיזיולוגיה)", items: [...sec(phSynapse), ...sec(nbSynapse)], practice: probs(nbSynapse) },
  { titleHe: "למידה וזיכרון", items: sec(nbLearningMemory), practice: probs(nbLearningMemory) },
  { titleHe: "מחלות נוירודגנרטיביות", items: sec(nbNeurodegeneration), practice: probs(nbNeurodegeneration) },
  { titleHe: "התפתחות המוח", items: sec(nbDevelopment), practice: probs(nbDevelopment) },
  { titleHe: "המוח ומערכת החיסון", items: sec(nbNeuroimmune), practice: probs(nbNeuroimmune) },
  { titleHe: "שיטות מחקר במדעי המוח", items: sec(nbMethods), practice: probs(nbMethods) },
];

export const technionNeurobiologyPlan: CoursePlan = {
  courseSlug: "technion-neurobiology",
  lectureOrder: {
    confidence: "syllabus",
    noteHe: "אין לוח הרצאות ציבורי לקורס (אתר הקורס במודל סגור). הסדר כאן לפי סדר הנושאים בתיאור הקורס בפורטל. יחידות הפיזיולוגיה (134117) על פוטנציאל המנוחה, פוטנציאל הפעולה והסינפסה מופיעות כרענון.",
    links: [PORTAL],
  },
  tutorialOrder: null,
  schedule: "suggested",
  scheduleNoteHe: "הנושאים לפי תיאור הקורס בפורטל הטכניון; הפירוט לפי ספרי הקורס (Bear, Kandel). הדגש בתיאור — זיכרון ולמידה. התרגילים הפתורים כאן לתרגול עצמי — סדר התרגולים בקורס לא פורסם.",
  topics: [
    { titleHe: "הכרת התאים השונים במח ותפקידם", items: sec(nbCells) },
    { titleHe: "הבסיס המולקולרי של פעילות הנוירונים", items: [...sec(nbChannels), ...sec(nbSynapse, "types", "release", "receptors", "transmitters")] },
    { titleHe: "משמעות ההולכה העצבית לתפקוד (בדגש על זיכרון ולמידה)", items: [...sec(nbSynapse, "integration"), ...sec(nbLearningMemory)] },
    { titleHe: "היבטים מולקולריים של מחלות נוירודגנרטיביות", items: sec(nbNeurodegeneration) },
    { titleHe: "תהליכים בהתפתחות המח", items: sec(nbDevelopment) },
    { titleHe: "האינטראקציה בין מערכת החיסון והמח", items: sec(nbNeuroimmune) },
    { titleHe: "שיטות מחקר מתקדמות בחקר המח", items: sec(nbMethods) },
    { titleHe: "רענון מקורס הפיזיולוגיה", items: [...sec(phMembranePotential), ...sec(phActionPotential), ...sec(phSynapse)] },
  ],
  lectures: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.items })),
  tutorials: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.practice })).filter((t) => t.items.length > 0),
};
