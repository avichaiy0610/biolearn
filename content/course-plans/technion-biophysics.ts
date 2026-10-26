import type { CoursePlan, PlanItem, PlanSession } from "./types";
import type { Lesson } from "../lessons/types";
import { bpScales } from "../lessons/technion-biophysics/bp-scales";
import { bpMechanicalEquilibrium } from "../lessons/technion-biophysics/bp-mechanical-equilibrium";
import { bpChemicalEquilibrium } from "../lessons/technion-biophysics/bp-chemical-equilibrium";
import { bpEntropy } from "../lessons/technion-biophysics/bp-entropy";
import { bpRandomWalk } from "../lessons/technion-biophysics/bp-random-walk";
import { bpPolymers } from "../lessons/technion-biophysics/bp-polymers";
import { bpDiffusionFriction } from "../lessons/technion-biophysics/bp-diffusion-friction";
import { bpFirstPassage } from "../lessons/technion-biophysics/bp-first-passage";
import { bpLowReynolds } from "../lessons/technion-biophysics/bp-low-reynolds";
import { bpSingleMolecule } from "../lessons/technion-biophysics/bp-single-molecule";
import { bpMotorPrinciples } from "../lessons/technion-biophysics/bp-motor-principles";
import { bpPolymerasesHelicases } from "../lessons/technion-biophysics/bp-polymerases-helicases";
import { bpCaseStudies } from "../lessons/technion-biophysics/bp-case-studies";
import { mvSurfaceMotility } from "../lessons/technion-micro-viro/mv-surface-motility";
import { cellMotorsPolarity } from "../lessons/technion-cell/cell-motors-polarity";
import { molTranscriptionProk } from "../lessons/technion-molecular/mol-transcription-prok";

// Technion 01340156 "ביופיסיקה מולקולרית" (Biology faculty elective, 3 credits / 3 lecture hours, no tutorials). Built
// with the course-track-builder skill, no insider input. Lecturer: Prof. Ariel Kaplan (single-molecule biophysics;
// Moodle 2025–2026 closed to guests). Earlier version of the same course: 134136 (same name and faculty, "no extra
// credit" pair) — its shorter description supports the same topics. Evidence: the CURRENT portal paragraph (8 topics,
// no weeks) and the official book list (Nelson; Phillips–Kondev–Theriot; Howard; Berg; Redner; Strogatz; van Kampen —
// none on disk). Scope, reviewed by Codex before writing (2026-10-26): 13 units — one per week; mechanical equilibrium
// made explicit; random walk and polymers split; diffusion and first passage split; single-molecule methods after
// friction (calibration needs D = kBT/ζ); motors split into principles (kinesin benchmark) and polymerases/helicases;
// a consolidation unit because there are no tutorials. Extensions: MWC, quantitative crowding, dynamic force
// spectroscopy, Berg–Purcell detail, detailed randomness analysis; nonlinear dynamics (Strogatz) not taught.
export const BIOPHYSICS_LESSONS: Lesson[] = [bpScales, bpMechanicalEquilibrium, bpChemicalEquilibrium, bpEntropy,
  bpRandomWalk, bpPolymers, bpDiffusionFriction, bpFirstPassage, bpLowReynolds, bpSingleMolecule, bpMotorPrinciples,
  bpPolymerasesHelicases, bpCaseStudies];

const sec = (l: Lesson, ...ids: string[]): PlanItem[] => (ids.length ? ids.map((section) => ({ kind: "lesson" as const, slug: l.slug, section })) : [{ kind: "lesson", slug: l.slug }]);
const probs = (l: Lesson): PlanItem[] => (l.workedProblems ?? []).map((w) => ({ kind: "lesson" as const, slug: l.slug, problem: w.id }));

const PORTAL = { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134156" };

// the portal's own topic order, with polymers and first passage split out and single-molecule methods moved after
// friction; biology refreshers sit before the unit that needs them
const LECTURES: { titleHe: string; items: PlanItem[]; practice: PlanItem[] }[] = [
  { titleHe: "הסקאלות של התא: גדלים, זמנים ואנרגיה תרמית", items: sec(bpScales), practice: probs(bpScales) },
  { titleHe: "שיווי משקל מכני, בולצמן ושני מצבים", items: sec(bpMechanicalEquilibrium), practice: probs(bpMechanicalEquilibrium) },
  { titleHe: "שיווי משקל כימי, קשירה ועבודה כימית", items: sec(bpChemicalEquilibrium), practice: probs(bpChemicalEquilibrium) },
  { titleHe: "אנטרופיה, אוסמוזה וכוחות אנטרופיים", items: sec(bpEntropy), practice: probs(bpEntropy) },
  { titleHe: "הליכת אקראי והופעת הדיפוזיה", items: sec(bpRandomWalk), practice: probs(bpRandomWalk) },
  { titleHe: "פולימרים: מבנה וכוח", items: sec(bpPolymers), practice: probs(bpPolymers) },
  { titleHe: "דיפוזיה וחיכוך", items: sec(bpDiffusionFriction), practice: probs(bpDiffusionFriction) },
  { titleHe: "זמני מעבר ראשון ומפגשים", items: sec(bpFirstPassage), practice: probs(bpFirstPassage) },
  { titleHe: "החיים במספר ריינולדס נמוך", items: [...sec(mvSurfaceMotility, "flagellum", "chemotaxis"), ...sec(bpLowReynolds)], practice: probs(bpLowReynolds) },
  { titleHe: "מניפולציה של מולקולה בודדת", items: sec(bpSingleMolecule), practice: probs(bpSingleMolecule) },
  { titleHe: "הפיזיקה של מנועים מולקולריים", items: [...sec(cellMotorsPolarity, "motors", "kinesin"), ...sec(bpMotorPrinciples)], practice: probs(bpMotorPrinciples) },
  { titleHe: "פולימראזות והליקאזות כמנועים", items: [...sec(molTranscriptionProk, "rnap"), ...sec(bpPolymerasesHelicases)], practice: probs(bpPolymerasesHelicases) },
  { titleHe: "מקרי בוחן וסיכום", items: sec(bpCaseStudies), practice: probs(bpCaseStudies) },
];

export const technionBiophysicsPlan: CoursePlan = {
  courseSlug: "technion-biophysics",
  lectureOrder: {
    confidence: "syllabus",
    noteHe: "אין לוח הרצאות ציבורי (אתר הקורס במודל סגור לאורחים). הסדר עוקב אחרי סדר הנושאים בתיאור הקורס בפורטל, עם שלושה שינויים: פולימרים וזמני מעבר ראשון קיבלו יחידות נפרדות, ושיטות המולקולה הבודדת הוזזו לאחרי דיפוזיה וחיכוך (הכיול צריך את יחס איינשטיין). בסוף — יחידת סיכום עם מקרי בוחן, כי אין לקורס תרגולים.",
    links: [PORTAL],
  },
  tutorialOrder: null,
  schedule: "suggested",
  scheduleNoteHe: "הנושאים לפי תיאור הקורס בפורטל הטכניון; ספרי הקורס הרשמיים: Nelson, Biological Physics; Phillips–Kondev–Theriot, Physical Biology of the Cell; Howard, Mechanics of Motor Proteins; Berg, Random Walks in Biology. לקורס אין תרגולים — התרגילים הפתורים ביחידות מוצגים כ\"תרגול על הרצאה n\".",
  topics: [
    { titleHe: "מבוא לעקרונות הפיסיקליים בדינמיקה התוך-תאית", items: [...sec(bpScales), ...sec(bpCaseStudies)] },
    { titleHe: "שיווי משקל מכאני וכימי בהקשר הביולוגי", items: [...sec(bpMechanicalEquilibrium), ...sec(bpChemicalEquilibrium)] },
    { titleHe: "תהליכים אנטרופיים מרכזיים בתא", items: sec(bpEntropy) },
    { titleHe: "הליכת אקראי ומודלים למבנה של ביומולקולות", items: [...sec(bpRandomWalk), ...sec(bpPolymers)] },
    { titleHe: "שיטות למניפולציות חד-מולקולריות ושימושיהן", items: sec(bpSingleMolecule) },
    { titleHe: "דיפוזיה וחיכוך", items: [...sec(bpDiffusionFriction), ...sec(bpFirstPassage)] },
    { titleHe: "החיים במספר ריינולדס נמוך", items: sec(bpLowReynolds) },
    { titleHe: "אנזימים פרוססיביים כמנועים מולקולריים", items: [...sec(bpMotorPrinciples), ...sec(bpPolymerasesHelicases)] },
  ],
  lectures: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.items })),
  tutorials: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.practice })).filter((t) => t.items.length > 0),
};
