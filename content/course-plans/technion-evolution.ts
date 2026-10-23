import type { CoursePlan, PlanItem, PlanSession } from "./types";
import type { Lesson } from "../lessons/types";
import { evEvidence } from "../lessons/technion-evolution/ev-evidence";
import { evTreeOfLife } from "../lessons/technion-evolution/ev-tree-of-life";
import { evEukaryotes } from "../lessons/technion-evolution/ev-eukaryotes";
import { evAnimals } from "../lessons/technion-evolution/ev-animals";
import { evHuman } from "../lessons/technion-evolution/ev-human";
import { evSelection } from "../lessons/technion-evolution/ev-selection";
import { evDrift } from "../lessons/technion-evolution/ev-drift";
import { evPopulationStructure } from "../lessons/technion-evolution/ev-population-structure";
import { evSelectionForces } from "../lessons/technion-evolution/ev-selection-forces";
import { evMeasuringSelection } from "../lessons/technion-evolution/ev-measuring-selection";
import { evEvoDevo } from "../lessons/technion-evolution/ev-evo-devo";
import { evGeneticSystems } from "../lessons/technion-evolution/ev-genetic-systems";

// Technion 01340133 "אבולוציה" (Faculty of Biology, 2 credits, lecture only) — built with the course-track-builder
// skill, no insider input. Evidence: the CURRENT portal paragraph (topics only) and the official book list ("Evolution"
// = Barton, Briggs, Eisen, Goldstein & Patel, CSHL 2007; not on disk). Moodle closed to guests; lecturer 2025–2026:
// Dr. Shay Stern. No detailed syllabus, exams or summaries found (searched portal, Scribd, Studocu — blocked).
// Scope (step 5a), reviewed independently by Codex before writing (2026-10-22): the portal paragraph maps chapter by
// chapter onto Barton — evidence (ch. 3); diversification of Bacteria, Archaea, Eukarya (5–8); animals and humans
// (10, 25); natural selection, drift, population structure (15–17); interaction with other forces and measuring
// selection (18–19); multicellularity and development (9, 11); "new genetic systems" (23, evolution of genetic systems).
// NOT written (in the book, not in the syllabus): origin of life (4), phenotypic evolution (20), conflict and
// cooperation (21), speciation (22), novelty (24), phylogenetic reconstruction (27). Parallel 274251 (medicine,
// "no extra credit" pair) is a different course — evidence only. Lecture order: the portal order; no tutorials listed.

const sec = (l: Lesson, ...ids: string[]): PlanItem[] => (ids.length ? ids.map((section) => ({ kind: "lesson" as const, slug: l.slug, section })) : [{ kind: "lesson", slug: l.slug }]);
const probs = (l: Lesson): PlanItem[] => (l.workedProblems ?? []).map((w) => ({ kind: "lesson" as const, slug: l.slug, problem: w.id }));

const PORTAL = { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134133" };
const BOOK = { labelHe: "תוכן העניינים של ספר הקורס (Barton et al., Evolution)", url: "https://evolution-textbook.org/content/free/contents/contents.html" };

const LECTURES: { titleHe: string; items: PlanItem[]; practice: PlanItem[] }[] = [
  { titleHe: "העדויות לאבולוציה ולמוצא משותף", items: sec(evEvidence), practice: probs(evEvidence) },
  { titleHe: "עץ החיים: LUCA, חיידקים וארכאה", items: sec(evTreeOfLife), practice: probs(evTreeOfLife) },
  { titleHe: "מוצא האאוקריוטים ואנדוסימביוזה", items: sec(evEukaryotes), practice: probs(evEukaryotes) },
  { titleHe: "האבולוציה של בעלי החיים", items: sec(evAnimals), practice: probs(evAnimals) },
  { titleHe: "האבולוציה של האדם", items: sec(evHuman), practice: probs(evHuman) },
  { titleHe: "ברירה טבעית", items: sec(evSelection), practice: probs(evSelection) },
  { titleHe: "סחף גנטי", items: sec(evDrift), practice: probs(evDrift) },
  { titleHe: "מבנה אוכלוסייה", items: sec(evPopulationStructure), practice: probs(evPopulationStructure) },
  { titleHe: "ברירה וכוחות נוספים", items: sec(evSelectionForces), practice: probs(evSelectionForces) },
  { titleHe: "מדידת ברירה", items: sec(evMeasuringSelection), practice: probs(evMeasuringSelection) },
  { titleHe: "רב-תאיות והאבולוציה של ההתפתחות", items: sec(evEvoDevo), practice: probs(evEvoDevo) },
  { titleHe: "האבולוציה של מערכות גנטיות", items: sec(evGeneticSystems), practice: probs(evGeneticSystems) },
];

export const technionEvolutionPlan: CoursePlan = {
  courseSlug: "technion-evolution",
  lectureOrder: {
    confidence: "syllabus",
    noteHe: "אין לוח הרצאות ציבורי (אתר הקורס במודל סגור). הסדר כאן הוא סדר הנושאים בסילבוס הרשמי, והפירוט לתת-נושאים — לפי הפרקים המקבילים בספר הקורס.",
    links: [PORTAL, BOOK],
  },
  tutorialOrder: null,
  schedule: "suggested",
  scheduleNoteHe: "הנושאים לפי הסילבוס בפורטל הטכניון; כל נושא מפורט לפי הפרק המקביל בספר הקורס (Barton et al., Evolution). בקורס אין תרגולים רשומים — התרגילים הפתורים כאן לתרגול עצמי.",
  topics: [
    { titleHe: "ההוכחות לקיום אבולוציה של החיים", items: sec(evEvidence) },
    { titleHe: "היווצרות השונות של חיידקים, ארכיאה ואיאוקריוטים", items: [...sec(evTreeOfLife), ...sec(evEukaryotes)] },
    { titleHe: "אבולוציה של חיות ובני האדם", items: [...sec(evAnimals), ...sec(evHuman)] },
    { titleHe: "ברירה טבעית", items: sec(evSelection) },
    { titleHe: "סחף גנטי ומבנה אוכלוסיה", items: [...sec(evDrift), ...sec(evPopulationStructure)] },
    { titleHe: "מדידת הסלקציה הפועלת על השונות והאינטראקציה שלה עם כוחות נוספים", items: [...sec(evSelectionForces), ...sec(evMeasuringSelection)] },
    { titleHe: "אבולוציה של אורגניזמים רב תאיים, התפתחות", items: sec(evEvoDevo) },
    { titleHe: "מערכות גנטיות חדשות", items: sec(evGeneticSystems) },
  ],
  lectures: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.items })),
  tutorials: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.practice })).filter((t) => t.items.length > 0),
};
