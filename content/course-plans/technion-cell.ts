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

// Technion 01340128 "ביולוגיה של התא" — built with the course-track-builder skill, no insider input.
// Topics: the CURRENT syllabus on the Technion students portal (topics only, no weeks), in its own order.
// Lecture order: no public schedule (Moodle is closed to guests) — the syllabus order. The Faculty of
// Medicine's parallel course (274167, "no extra credit" pair) publishes a weekly table of Alberts chapters
// (1, 1, 2, 10, 11, 12–13, 15, 16, 17, 19, 18, 19, 20) — a different order and partly different content;
// evidence only, not this course's schedule.
// Tutorials: no source — "practice for lecture n", built from each unit's worked problems.

const C = "cell-biology";
const proc = (slug: string, topic = C): PlanItem => ({ kind: "process", topic, slug });
const sec = (l: Lesson, ...ids: string[]): PlanItem[] => (ids.length ? ids.map((section) => ({ kind: "lesson" as const, slug: l.slug, section })) : [{ kind: "lesson", slug: l.slug }]);
const probs = (l: Lesson, ...ids: string[]): PlanItem[] =>
  (l.workedProblems ?? []).filter((w) => !ids.length || ids.includes(w.id)).map((w) => ({ kind: "lesson" as const, slug: l.slug, problem: w.id }));

const UPS = "protein-degradation-and-ubiquitin-proteasome-system-animation-1780958699914";
const PORTAL = { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134128" };
const MED = { labelHe: "הקורס המקביל ברפואה (274167) — ראיה בלבד", url: "https://md.technion.ac.il/wp-content/uploads/2024/05/סיליבוס-קורס-ביולוגיה-של-התא-274167-תשפד-מעודכן-למלחמה.pdf" };

const LECTURES: { titleHe: string; items: PlanItem[]; practice: PlanItem[] }[] = [
  { titleHe: "ממברנות: הדו-שכבה, השומנים והחלבונים (ריענון)", items: [...sec(cellMembranes), proc("membrane-transport")], practice: probs(cellMembranes) },
  { titleHe: "מיון חלבונים ו-ER: אותות, SRP וטרנסלוקציה תוך תרגום", items: [...sec(cellEr), proc("secretory-pathway")], practice: probs(cellEr) },
  { titleHe: "בקרת איכות ב-ER, UPR ומערכת היוביקוויטין–פרוטאזום", items: [...sec(cellQualityControl), proc(UPS)], practice: probs(cellQualityControl) },
  { titleHe: "הגולג'י, הליזוזומים ומערך האנדוזומים", items: sec(cellGolgiEndosomes), practice: probs(cellGolgiEndosomes) },
  { titleHe: "טרנספורט וסיקולרי: מעטפות, Rab ו-SNAREs", items: [...sec(cellVesicleTransport), proc("synaptic-transmission", "physiology")], practice: probs(cellVesicleTransport) },
  { titleHe: "יבוא לגרעין ולמיטוכונדריה", items: sec(cellNuclearMitoImport), practice: probs(cellNuclearMitoImport) },
  { titleHe: "שלד התא: אקטין, מיקרוטובולים וסיבי ביניים", items: sec(cellCytoskeleton), practice: probs(cellCytoskeleton) },
  { titleHe: "חלבונים מוטוריים, ריסים, נדידה ותאים קוטביים", items: [...sec(cellMotorsPolarity), proc("muscle-contraction", "physiology")], practice: probs(cellMotorsPolarity) },
  { titleHe: "מתא לרקמה: צמתים בין תאים", items: sec(cellJunctions), practice: probs(cellJunctions) },
  { titleHe: "המטריקס החוץ-תאי והאינטגרינים", items: sec(cellEcm), practice: probs(cellEcm) },
  { titleHe: "עקרונות של העברת אותות", items: sec(cellSignalingPrinciples), practice: probs(cellSignalingPrinciples) },
  { titleHe: "קולטנים מצומדי חלבון G: cAMP ו-Ca²⁺", items: [...sec(cellGpcr), proc("gpcr-camp-signaling")], practice: probs(cellGpcr) },
  { titleHe: "קולטני טירוזין-קינאז: Ras–MAPK ו-PI3K–Akt", items: sec(cellRtk), practice: probs(cellRtk) },
  { titleHe: "בקרת מחזור התא: Cdks, נקודות ביקורת ו-p53", items: [...sec(cellCycleControl), proc("apoptosis")], practice: probs(cellCycleControl) },
];

export const technionCellPlan: CoursePlan = {
  courseSlug: "technion-cell",
  lectureOrder: {
    confidence: "syllabus",
    noteHe: "אין לוח הרצאות ציבורי לקורס (אתר הקורס במודל סגור). הסדר כאן הוא סדר הנושאים בסילבוס הרשמי: ממברנות, מיון חלבונים ומסלול ההפרשה, שלד התא, צמתים ומטריקס, איתות ומחזור התא. הקורס המקביל בפקולטה לרפואה (274167) מפרסם טבלה שבועית של פרקי Alberts בסדר אחר (למשל איתות לפני שלד התא) — זה קורס אחר, ראיה בלבד. החלוקה לשבועות בפועל עשויה להיות שונה.",
    links: [PORTAL, MED],
  },
  tutorialOrder: null,
  schedule: "suggested",
  scheduleNoteHe: "הנושאים לפי הסילבוס העדכני של הקורס בפורטל הטכניון (הוא מפרט נושאים, לא שבועות). הפירוט לתת-נושאים לפי ספר הקורס (Alberts, Molecular Biology of the Cell).",
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
    { titleHe: "בקרת מחזור התא-מנגנונים מולקולרים", items: sec(cellCycleControl) },
  ],
  lectures: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.items })),
  tutorials: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.practice })).filter((t) => t.items.length > 0),
};
