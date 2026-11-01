import type { CoursePlan, PlanItem, PlanSession } from "./types";
import type { Lesson } from "../lessons/types";
import { cellMembranes } from "../lessons/technion-cell/cell-membranes";
import { cellEr } from "../lessons/technion-cell/cell-er";
import { cellQualityControl } from "../lessons/technion-cell/cell-quality-control";
import { cellGolgiEndosomes } from "../lessons/technion-cell/cell-golgi-endosomes";
import { cellVesicleTransport } from "../lessons/technion-cell/cell-vesicle-transport";
import { cellNuclearMitoImport } from "../lessons/technion-cell/cell-nuclear-mito-import";
import { cellCytoskeleton } from "../lessons/technion-cell/cell-cytoskeleton";
import { cellMotorsPolarity } from "../lessons/technion-cell/cell-motors-polarity";
import { cellJunctions } from "../lessons/technion-cell/cell-junctions";
import { cellEcm } from "../lessons/technion-cell/cell-ecm";
import { cellSignalingPrinciples } from "../lessons/technion-cell/cell-signaling-principles";
import { cellGpcr } from "../lessons/technion-cell/cell-gpcr";
import { cellRtk } from "../lessons/technion-cell/cell-rtk";
import { cellCycleControl } from "../lessons/technion-cell/cell-cycle-control";
import { cellDivision } from "../lessons/technion-cell/cell-division";
import { cellDeath } from "../lessons/technion-cell/cell-death";
import { cellMethods } from "../lessons/technion-cell/cell-methods";

// Technion 01340128 "ביולוגיה של התא" — built with the course-track-builder skill, no insider input.
// Topics: the CURRENT syllabus on the Technion students portal (topics only, no weeks), in its own order.
// Lecture order: no public schedule (Moodle is closed to guests) — the syllabus order. The Faculty of
// Medicine's parallel course (274167, "no extra credit" pair) publishes a weekly table of Alberts chapters
// (1, 1, 2, 10, 11, 12–13, 15, 16, 17, 19, 18, 19, 20) — a different order and partly different content;
// evidence only, not this course's schedule.
// Tutorials: no source — "practice for lecture n", built from each unit's worked problems.
// 2026-11-01: REPLACED by the course's own 2024 syllabus (Drive): 11 dated lectures + presentations and 11 tutorials,
// in English, graded by HW, paper presentation and a final home assignment (no exam). Order below = 2024 schedule.
// Added cell-death, cell-division, cell-methods; universal features + TRP sensing in cell-signaling-principles.

const C = "cell-biology";
const proc = (slug: string, topic = C): PlanItem => ({ kind: "process", topic, slug });
const sec = (l: Lesson, ...ids: string[]): PlanItem[] => (ids.length ? ids.map((section) => ({ kind: "lesson" as const, slug: l.slug, section })) : [{ kind: "lesson", slug: l.slug }]);
const probs = (l: Lesson, ...ids: string[]): PlanItem[] =>
  (l.workedProblems ?? []).filter((w) => !ids.length || ids.includes(w.id)).map((w) => ({ kind: "lesson" as const, slug: l.slug, problem: w.id }));

const UPS = "protein-degradation-and-ubiquitin-proteasome-system-animation-1780958699914";
const PORTAL = { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134128" };

const SYL24 = { labelHe: "עמוד הקורס בפורטל (הסילבוס של 2024 נבדק מקומית, מתוך הדרייב של הסטודנטים)", url: "https://students.technion.ac.il/local/technionsearch/course/134128" };

// The 2024 lecture schedule (dates 02/06/24–18/08/24); lecture 12 = student paper presentations.
const LECTURES: { titleHe: string; items: PlanItem[] }[] = [
  { titleHe: "מבוא: המאפיינים האוניברסליים של תאים, ומבוא לאיתות", items: sec(cellSignalingPrinciples) },
  { titleHe: "איתות: קולטנים שונים על פני התא", items: sec(cellRtk) },
  { titleHe: "איתות דרך קולטנים מצומדי חלבון G", items: [...sec(cellGpcr), proc("gpcr-camp-signaling")] },
  { titleHe: "שלד התא: אקטין, מיקרוטובולים, סיבי ביניים, מנועים, קוטביות ונדידה", items: [...sec(cellCytoskeleton), ...sec(cellMotorsPolarity), proc("muscle-contraction", "physiology")] },
  { titleHe: "מחזור התא: מערכת הבקרה, שלב S ומיטוזה", items: [...sec(cellCycleControl), ...sec(cellDivision, "spindle", "attachment")] },
  { titleHe: "מחזור התא: ציטוקינזיס, מיוזה ובקרה על חלוקה וגדילה", items: sec(cellDivision, "cytokinesis", "meiosis", "growth-control", "methods") },
  { titleHe: "מוות תאי מתוכנת", items: [...sec(cellDeath), proc("apoptosis")] },
  { titleHe: "צמתים בין תאים, המטריקס החוץ-תאי וצמתים בין תא למטריקס", items: [...sec(cellJunctions), ...sec(cellEcm)] },
  { titleHe: "מידור של התא ומיון חלבונים", items: [...sec(cellMembranes), proc("membrane-transport"), ...sec(cellNuclearMitoImport)] },
  { titleHe: "ה-ER: מבנה, תפקיד, הכנסה תוך תרגום והפרשה", items: [...sec(cellEr), proc("secretory-pathway"), ...sec(cellQualityControl), proc(UPS)] },
  { titleHe: "טרנספורט ממברנלי בתוך התא: אנדוציטוזה ואקסוציטוזה", items: [...sec(cellGolgiEndosomes), ...sec(cellVesicleTransport), proc("synaptic-transmission", "physiology")] },
];

// The 2024 tutorial schedule.
const TUTORIALS: { titleHe: string; items: PlanItem[] }[] = [
  { titleHe: "פלואורופורים ונוגדנים", items: [...sec(cellMethods), ...probs(cellMethods)] },
  { titleHe: "קולטנים (איתות)", items: [...probs(cellSignalingPrinciples), ...probs(cellRtk)] },
  { titleHe: "איתות דרך חלבון G", items: probs(cellGpcr) },
  { titleHe: "שלד התא", items: [...probs(cellCytoskeleton), ...probs(cellMotorsPolarity)] },
  { titleHe: "מחזור התא", items: [...probs(cellCycleControl), ...probs(cellDivision, "facs-profiles")] },
  { titleHe: "מחזור התא", items: probs(cellDivision, "meiosis-nondisjunction", "g1-uv-design") },
  { titleHe: "מוות תאי מתוכנת", items: probs(cellDeath) },
  { titleHe: "המטריקס החוץ-תאי", items: [...probs(cellEcm), ...probs(cellJunctions)] },
  { titleHe: "מיון חלבונים", items: [...probs(cellNuclearMitoImport), ...probs(cellEr), ...probs(cellMembranes)] },
  { titleHe: "בקרת איכות ו-ERAD", items: probs(cellQualityControl) },
  { titleHe: "אנדוציטוזה ואקסוציטוזה", items: [...probs(cellGolgiEndosomes), ...probs(cellVesicleTransport)] },
];

export const technionCellPlan: CoursePlan = {
  courseSlug: "technion-cell",
  lectureOrder: {
    confidence: "official-past",
    noteHe: "סדר ההרצאות לפי הסילבוס של הקורס מסמסטר אביב 2024 (ד\"ר איילה שיבר ופרופ' בני פודבילביץ), עם תאריך לכל הרצאה: מבוא ואיתות, קולטנים, GPCR, שלד התא, מחזור התא (פעמיים), מוות תאי, צמתים ומטריקס, מיון חלבונים, ER וטרנספורט ממברנלי; מפגש 12 (הרצאה ב-18.08.2024 ותרגולים ב-20–21.08) מוקדש להצגות מאמרים של הסטודנטים, ולכן אין לו יחידה כאן. הקורס נלמד באנגלית ואין בו מבחן: 30% תרגילי בית, 30% הצגת מאמר בזוגות, 30% עבודת סיום ו-10% נוכחות. יחידת הממברנות היא ריענון לפני מיון חלבונים.",
    links: [SYL24, PORTAL],
  },
  tutorialOrder: {
    confidence: "official-past",
    noteHe: "סדר התרגולים לפי הסילבוס של 2024: פלואורופורים ונוגדנים, קולטנים, חלבון G, שלד התא, מחזור התא (פעמיים), מוות תאי, מטריקס, מיון חלבונים, בקרת איכות ו-ERAD, אנדוציטוזה ואקסוציטוזה.",
    links: [SYL24],
  },
  schedule: "official",
  scheduleNoteHe: "ההרצאות והתרגולים לפי הסילבוס של הקורס מ-2024; הנושאים כאן לפי הפסקה בפורטל הטכניון. הפירוט לתת-נושאים לפי ספרי הקורס (Alberts, Lodish). בקורס אין מבחן, ולכן רוב התרגילים כאן הם תכנון ניסויים ופענוח תוצאות, כמו בתרגילי הבית ובעבודת הסיום.",
  topics: [
    { titleHe: "ממברנת-מבנה ותפקוד (ריענון)", items: [...sec(cellMembranes), proc("membrane-transport")] },
    { titleHe: "איברוני התא האאוקריוטי: הרטיקולום האנדופלסמטי-טרנסלוקציה תוך תרגום", items: [...sec(cellEr), proc("secretory-pathway")] },
    { titleHe: "בקרת איכות ופירוק חלבונים פגומים במערכת היוביקואיטין", items: [...sec(cellQualityControl), proc(UPS)] },
    { titleHe: "הגולג'י ומערך האנדוזומים", items: sec(cellGolgiEndosomes) },
    { titleHe: "מנגנוני הטרנספורט הווסיקולרי", items: sec(cellVesicleTransport) },
    { titleHe: "טרנספורט אחר-תרגומי לגרעין התא ולמיטוכונדריה", items: sec(cellNuclearMitoImport) },
    { titleHe: "שלד התא-חלבוני השלד ותפקודם בתא", items: [...sec(cellCytoskeleton), ...sec(cellMotorsPolarity, "motors", "kinesin", "cilia", "migration")] },
    { titleHe: "תאים קוטביים", items: sec(cellMotorsPolarity, "polarity") },
    { titleHe: "מתא לרקמה: תאחיזה בין תאים לבין עצמם - צמתים בין תאים", items: sec(cellJunctions) },
    { titleHe: "המטריקס החוץ-תאי ותפקידו בעיגון תאים והעברת איתותים", items: sec(cellEcm) },
    { titleHe: "תקשורת בין תאים - מנגנוני העברת אותות באמצעות קולטנים ממברנלים", items: sec(cellSignalingPrinciples) },
    { titleHe: "מסלולי העברת האותות העיקריים באמצעות RTKS/GPCR", items: [...sec(cellGpcr), ...sec(cellRtk), proc("gpcr-camp-signaling")] },
    { titleHe: "בקרת מחזור התא-מנגנונים מולקולרים", items: [...sec(cellCycleControl), ...sec(cellDivision)] },
    { titleHe: "מוות תאי מתוכנת (מהסילבוס של 2024)", items: sec(cellDeath) },
    { titleHe: "שיטות: פלואורופורים ונוגדנים (תרגול 1 בסילבוס של 2024)", items: sec(cellMethods) },
  ],
  lectures: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.items })),
  tutorials: TUTORIALS.map((t, i): PlanSession => ({ n: i + 1, titleHe: t.titleHe, items: t.items })).filter((t) => t.items.length > 0),
};
