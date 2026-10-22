import type { CoursePlan, PlanItem, PlanSession } from "./types";
import type { Lesson } from "../lessons/types";
import { mvHistory } from "../lessons/technion-micro-viro/mv-history";
import { mvMethods } from "../lessons/technion-micro-viro/mv-methods";
import { mvCellEnvelope } from "../lessons/technion-micro-viro/mv-cell-envelope";
import { mvSurfaceMotility } from "../lessons/technion-micro-viro/mv-surface-motility";
import { mvGrowth } from "../lessons/technion-micro-viro/mv-growth";
import { mvEnvironment } from "../lessons/technion-micro-viro/mv-environment";
import { mvAntibiotics } from "../lessons/technion-micro-viro/mv-antibiotics";
import { mvMetabolicDiversity } from "../lessons/technion-micro-viro/mv-metabolic-diversity";
import { mvNutrientCycles } from "../lessons/technion-micro-viro/mv-nutrient-cycles";
import { mvEcology } from "../lessons/technion-micro-viro/mv-ecology";
import { mvViruses } from "../lessons/technion-micro-viro/mv-viruses";
import { mvPhages } from "../lessons/technion-micro-viro/mv-phages";
import { mvGeneTransfer } from "../lessons/technion-micro-viro/mv-gene-transfer";
import { mvEndospores } from "../lessons/technion-micro-viro/mv-endospores";
import { mvEvolution } from "../lessons/technion-micro-viro/mv-evolution";
import { mvImmunology } from "../lessons/technion-micro-viro/mv-immunology";
import { mvClinical } from "../lessons/technion-micro-viro/mv-clinical";

// Technion 01340121 "מיקרוביולוגיה ווירולוגיה" — built with the course-track-builder skill (step 5a), no insider
// input. Topics: the CURRENT syllabus on the Technion students portal — 13 headings, no subtopics. Book: Brock
// Biology of Microorganisms (official book list). Subtopics by consensus of equivalent general-microbiology courses
// (BGU, TAU, BIU, HUJI) and Brock's own section lists; one unit per heading (cell structure split in two, viruses
// and phages split in two). The endospore unit covers structure, resistance, sporulation and germination; killing
// them (autoclave, D-value, sterilants) stays in mv-environment. Lecture order: Moodle closed to guests —
// the syllabus order. Tutorials: no source — "practice for lecture n".

const M = "microbiology";
const proc = (slug: string, topic = M): PlanItem => ({ kind: "process", topic, slug });
const sec = (l: Lesson, ...ids: string[]): PlanItem[] => (ids.length ? ids.map((section) => ({ kind: "lesson" as const, slug: l.slug, section })) : [{ kind: "lesson", slug: l.slug }]);
const probs = (l: Lesson, ...ids: string[]): PlanItem[] =>
  (l.workedProblems ?? []).filter((w) => !ids.length || ids.includes(w.id)).map((w) => ({ kind: "lesson" as const, slug: l.slug, problem: w.id }));

const PORTAL = { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134121" };

const LECTURES: { titleHe: string; items: PlanItem[]; practice: PlanItem[] }[] = [
  { titleHe: "מיקרוביולוגיה באספקט היסטורי", items: sec(mvHistory), practice: probs(mvHistory) },
  { titleHe: "שיטות חדשות: מהצלחת לגנום", items: sec(mvMethods), practice: probs(mvMethods) },
  { titleHe: "התא הפרוקריוטי: ממברנה, דופן ומעטפת", items: [...sec(mvCellEnvelope), proc("bacteria-structure-animation-1780781194821")], practice: probs(mvCellEnvelope) },
  { titleHe: "מבנים על פני התא, תנועה וכימוטקסיס", items: sec(mvSurfaceMotility), practice: probs(mvSurfaceMotility) },
  { titleHe: "גדילה וחלוקה", items: sec(mvGrowth), practice: probs(mvGrowth) },
  { titleHe: "גורמים סביבתיים ושליטה בגדילה", items: sec(mvEnvironment), practice: probs(mvEnvironment) },
  { titleHe: "אנטיביוטיקה ומנגנוני עמידות", items: sec(mvAntibiotics), practice: probs(mvAntibiotics) },
  { titleHe: "שונות מטבולית", items: sec(mvMetabolicDiversity), practice: probs(mvMetabolicDiversity) },
  { titleHe: "מחזורי החומרים בטבע", items: sec(mvNutrientCycles), practice: probs(mvNutrientCycles) },
  { titleHe: "אקולוגיה מיקרוביאלית", items: sec(mvEcology), practice: probs(mvEcology) },
  { titleHe: "וירוסים: מבנה, סיווג ומחזור הדבקה", items: [...sec(mvViruses), proc("viral-life-cycle")], practice: probs(mvViruses) },
  { titleHe: "בקטריופאג'ים", items: sec(mvPhages), practice: probs(mvPhages) },
  { titleHe: "העברת חומר גנטי בחיידקים", items: sec(mvGeneTransfer), practice: probs(mvGeneTransfer) },
  { titleHe: "ספורות בקטריאליות", items: sec(mvEndospores), practice: probs(mvEndospores) },
  { titleHe: "אבולוציה וסיסטמטיקה של מיקרואורגניזמים", items: sec(mvEvolution), practice: probs(mvEvolution) },
  { titleHe: "מושגי יסוד בתורת החיסון", items: [...sec(mvImmunology), proc("innate-immunity", "immunology"), proc("adaptive-immunity", "immunology")], practice: probs(mvImmunology) },
  { titleHe: "מבוא למיקרוביולוגיה קלינית", items: sec(mvClinical), practice: probs(mvClinical) },
];

export const technionMicroViroPlan: CoursePlan = {
  courseSlug: "technion-micro-viro",
  lectureOrder: {
    confidence: "syllabus",
    noteHe: "אין לוח הרצאות ציבורי לקורס (אתר הקורס במודל סגור). הסדר כאן הוא סדר הנושאים בסילבוס הרשמי. החלוקה לשבועות בפועל עשויה להיות שונה.",
    links: [PORTAL],
  },
  tutorialOrder: null,
  schedule: "suggested",
  scheduleNoteHe: "הנושאים לפי הסילבוס העדכני של הקורס בפורטל הטכניון. הפירוט לתת-נושאים לפי ספר הקורס (Brock Biology of Microorganisms) ולפי קורסים מקבילים במיקרוביולוגיה כללית באוניברסיטאות אחרות.",
  topics: [
    { titleHe: "מיקרוביולוגיה באספקט היסטורי", items: sec(mvHistory) },
    { titleHe: "חידושים ושיטות במאה העשרים ואחת", items: sec(mvMethods) },
    { titleHe: "תאים פרוקריוטים - מבנה ותפקוד", items: [...sec(mvCellEnvelope), ...sec(mvSurfaceMotility), ...sec(mvGrowth, "division"), proc("bacteria-structure-animation-1780781194821")] },
    { titleHe: "השפעת גורמים כימופיסיקליים על גידול וקיום", items: [...sec(mvGrowth, "media", "counting", "exponential", "growth-curve", "chemostat"), ...sec(mvEnvironment)] },
    { titleHe: "מיקרואורגניזמים ופיתוח מנגנוני עמידות", items: sec(mvAntibiotics) },
    { titleHe: "שונות מטבולית והשתלבות במחזור החומרים בטבע", items: [...sec(mvMetabolicDiversity), ...sec(mvNutrientCycles)] },
    { titleHe: "אקולוגיה מיקרוביאלית", items: sec(mvEcology) },
    { titleHe: "מבנה, תפקוד ומסלולי הדבקה של וירוסים ובקטריופאג'ים", items: [...sec(mvViruses), ...sec(mvPhages), proc("viral-life-cycle")] },
    { titleHe: "העברת חומר גנטי בחיידקים", items: sec(mvGeneTransfer) },
    { titleHe: "ספורות בקטריאליות", items: [...sec(mvEndospores), ...sec(mvEnvironment, "control-terms", "physical-control")] },
    { titleHe: "אבולוציה וסיסטמטיקה של מיקרואורגניזמים", items: sec(mvEvolution) },
    { titleHe: "מושגי יסוד בתורת החיסון", items: [...sec(mvImmunology), proc("innate-immunity", "immunology"), proc("adaptive-immunity", "immunology")] },
    { titleHe: "מבוא למיקרוביולוגיה קלינית", items: sec(mvClinical) },
  ],
  lectures: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.items })),
  tutorials: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.practice })).filter((t) => t.items.length > 0),
};
