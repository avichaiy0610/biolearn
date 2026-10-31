import type { CoursePlan, PlanItem, PlanSession } from "./types";
import type { Lesson } from "../lessons/types";
import { scConcepts } from "../lessons/technion-stem-cells/sc-concepts";
import { scEmbryonic } from "../lessons/technion-stem-cells/sc-embryonic";
import { scAdult } from "../lessons/technion-stem-cells/sc-adult";
import { scCulture } from "../lessons/technion-stem-cells/sc-culture";
import { scReprogramming } from "../lessons/technion-stem-cells/sc-reprogramming";
import { scDifferentiation } from "../lessons/technion-stem-cells/sc-differentiation";
import { scDerivatives } from "../lessons/technion-stem-cells/sc-derivatives";
import { scEngineering } from "../lessons/technion-stem-cells/sc-engineering";
import { scTherapy } from "../lessons/technion-stem-cells/sc-therapy";
import { scDrugDiscovery } from "../lessons/technion-stem-cells/sc-drug-discovery";
import { scCancerStemCells } from "../lessons/technion-stem-cells/sc-cancer-stem-cells";
import { scReview } from "../lessons/technion-stem-cells/sc-review";
import { dvPrinciples } from "../lessons/technion-developmental/dv-principles";
import { dvGenes } from "../lessons/technion-developmental/dv-genes";
import { dvVertebrateAxes } from "../lessons/technion-developmental/dv-vertebrate-axes";
import { dvRegeneration } from "../lessons/technion-developmental/dv-regeneration";
import { cellCycleControl } from "../lessons/technion-cell/cell-cycle-control";
import { cellEcm } from "../lessons/technion-cell/cell-ecm";
import { cellJunctions } from "../lessons/technion-cell/cell-junctions";
import { gxEpigenetics } from "../lessons/technion-gene-expression/gx-epigenetics";
import { gxChromatinModifications } from "../lessons/technion-gene-expression/gx-chromatin-modifications";
import { caNature } from "../lessons/technion-cancer/ca-nature";
import { caMultistep } from "../lessons/technion-cancer/ca-multistep";
import { caMetastasis } from "../lessons/technion-cancer/ca-metastasis";
import { caMicroenvironment } from "../lessons/technion-cancer/ca-microenvironment";

// Technion 134137 "תאי גזע" (Faculty of Biology elective, 2 credits = 2 lecture hours, no tutorials, semester B).
// Built with the course-track-builder skill, no insider input. Prerequisites: 134082 Molecular Biology and
// 134128 Cell Biology. Evidence: the CURRENT portal paragraph only — but unusually for this site it is explicit and
// names seven topics (embryonic vs adult, culture and characterisation, differentiation into the three germ layers
// and their derivatives, tissue engineering and cell therapy, drug development, reprogramming from somatic cells,
// cancer stem cells). No lecturer on the public page, no books, Moodle not resolvable. Scope reviewed by Codex before
// writing (2026-10-27): 12 units over 13 weeks; the potency-assay unit merged into sc-culture; lineage tracing
// distributed into sc-adult and sc-cancer-stem-cells; differentiation split into logic (sc-differentiation) and named
// derivatives (sc-derivatives), one per germ layer. Extensions: tetraploid detail, multicolour tracing systems,
// neutral-drift mathematics, exhaustive pluripotency substates, stochastic-vs-deterministic reprogramming kinetics.
// NOTE: developmental biology (134069) and cancer (134129) are NOT prerequisites, so refresher links are optional
// support and every unit is written to stand without them.
export const STEM_CELLS_LESSONS: Lesson[] = [scConcepts, scEmbryonic, scAdult, scCulture, scReprogramming,
  scDifferentiation, scDerivatives, scEngineering, scTherapy, scDrugDiscovery, scCancerStemCells, scReview];

const sec = (l: Lesson, ...ids: string[]): PlanItem[] => (ids.length ? ids.map((section) => ({ kind: "lesson" as const, slug: l.slug, section })) : [{ kind: "lesson", slug: l.slug }]);
const probs = (l: Lesson): PlanItem[] => (l.workedProblems ?? []).map((w) => ({ kind: "lesson" as const, slug: l.slug, problem: w.id }));

const PORTAL = { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134137" };

// Codex's recommended order; optional refresher sections sit after the local unit that uses them
const LECTURES: { titleHe: string; items: PlanItem[]; practice: PlanItem[] }[] = [
  { titleHe: "מהו תא גזע: הגדרה, פוטנטיות ומבחן", items: [...sec(scConcepts), ...sec(dvPrinciples, "fate", "specification")], practice: probs(scConcepts) },
  { titleHe: "תאי גזע עובריים ורשת הפלוריפוטנטיות", items: [...sec(scEmbryonic), ...sec(dvVertebrateAxes, "mouse-early"), ...sec(dvGenes, "determination")], practice: probs(scEmbryonic) },
  { titleHe: "תאי גזע בוגרים, הנישה ומעקב שושלות", items: [...sec(scAdult), ...sec(dvRegeneration, "types", "mammals")], practice: probs(scAdult) },
  { titleHe: "תנאי גידול, אפיון וראיות לפוטנטיות", items: [...sec(scCulture), ...sec(cellCycleControl, "g1", "p53")], practice: probs(scCulture) },
  { titleHe: "ריפרוגרמינג: מתא בוגר למצב פלוריפוטנטי", items: [...sec(scReprogramming), ...sec(gxEpigenetics), ...sec(gxChromatinModifications)], practice: probs(scReprogramming) },
  { titleHe: "התמיינות מכוונת: לשחזר התפתחות בצלחת", items: [...sec(scDifferentiation), ...sec(dvPrinciples, "morphogens", "induction"), ...sec(dvGenes, "necessary-sufficient", "master-genes")], practice: probs(scDifferentiation) },
  { titleHe: "נגזרות שלוש השכבות: שלוש דוגמאות", items: sec(scDerivatives), practice: probs(scDerivatives) },
  { titleHe: "הנדסת רקמות ואברונים בתרבית", items: [...sec(scEngineering), ...sec(cellEcm), ...sec(cellJunctions)], practice: probs(scEngineering) },
  { titleHe: "טיפול תאי: מנגנון, בטיחות וראיות", items: sec(scTherapy), practice: probs(scTherapy) },
  { titleHe: "מידול מחלות ופיתוח תרופות", items: sec(scDrugDiscovery), practice: probs(scDrugDiscovery) },
  { titleHe: "תאי גזע סרטניים: היררכיה, מבחן ופלסטיות", items: [...sec(scCancerStemCells), ...sec(caNature, "monoclonal"), ...sec(caMultistep, "heterogeneity"), ...sec(caMetastasis, "emt", "dormancy"), ...sec(caMicroenvironment, "stroma")], practice: probs(scCancerStemCells) },
  { titleHe: "סיכום: לבחור מסלול ולקרוא ראיות", items: sec(scReview), practice: probs(scReview) },
];

export const technionStemCellsPlan: CoursePlan = {
  courseSlug: "technion-stem-cells",
  lectureOrder: {
    confidence: "syllabus",
    noteHe: "אין לוח הרצאות ציבורי לקורס, ולא רשום מרצה בעמוד הציבורי. לעומת זאת, תיאור הקורס בפורטל מפורט יחסית ומונה שבעה נושאים מפורשים — ולכן הסדר כאן עוקב אחרי סדר הנושאים בתיאור, עם שני שינויים: הריפרוגרמינג הוקדם אל לפני ההתמיינות (כדי שמקורות התאים יוצגו לפני שמתמיינים אותם), ונושא ההתמיינות פוצל לשתי יחידות — עקרונות ונגזרות. בחירת הדוגמאות הספציפיות היא שלנו. 12 יחידות על פני 13 שבועות, כאשר יחידת הסיכום נפרסת על השבועיים האחרונים.",
    links: [PORTAL],
  },
  tutorialOrder: null,
  schedule: "suggested",
  scheduleNoteHe: "הנושאים לפי תיאור הקורס בפורטל הטכניון (2 נקודות זכות, 2 שעות הרצאה, בלי תרגולים). בפורטל לא רשומים ספרים; הפירוט נשען על ספרות התחום ועל הספרים שבידינו (Alberts, Lodish, Gilbert, Wolpert) כמקורות תומכים בלבד ולא כספרי קורס רשמיים. מקצועות הקדם הם ביולוגיה מולקולרית וביולוגיה של התא; ביולוגיה התפתחותית וסרטן אינם מקצועות קדם, ולכן סעיפי הרענון מהם הם תוספת רשות וכל יחידה עומדת בפני עצמה. התרגילים הפתורים מוצגים כ\"תרגול על הרצאה n\".",
  topics: [
    { titleHe: "ידע רחב בנושא תאי גזע ומערכות התפתחותיות", items: [...sec(scConcepts), ...sec(scReview)] },
    { titleHe: "ההבדלים בין תאי גזע עובריים לתאי גזע בוגרים", items: [...sec(scEmbryonic), ...sec(scAdult)] },
    { titleHe: "תנאי גידולם ואפיונם", items: sec(scCulture) },
    { titleHe: "קבלת תאי גזע פלוריפוטנטיים מתאים סומטיים", items: sec(scReprogramming) },
    { titleHe: "התמיינות לתאים משלוש שכבות הנבט ולנגזרותיהן", items: [...sec(scDifferentiation), ...sec(scDerivatives)] },
    { titleHe: "שימוש למטרות ריפוי: הנדסת רקמות וטיפול תאי", items: [...sec(scEngineering), ...sec(scTherapy)] },
    { titleHe: "שימוש בפיתוח תרופות", items: sec(scDrugDiscovery) },
    { titleHe: "תאי גזע סרטניים", items: sec(scCancerStemCells) },
  ],
  lectures: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.items })),
  tutorials: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.practice })).filter((t) => t.items.length > 0),
};
