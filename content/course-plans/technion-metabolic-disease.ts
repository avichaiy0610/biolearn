import type { CoursePlan, PlanItem, PlanSession } from "./types";
import type { Lesson } from "../lessons/types";
import { mdCrosstalk } from "../lessons/technion-metabolic-disease/md-crosstalk";
import { mdFedFasted } from "../lessons/technion-metabolic-disease/md-fed-fasted";
import { mdInsulinResistance } from "../lessons/technion-metabolic-disease/md-insulin-resistance";
import { mdDiabetes } from "../lessons/technion-metabolic-disease/md-diabetes";
import { mdObesity } from "../lessons/technion-metabolic-disease/md-obesity";
import { mdHyperlipidemia } from "../lessons/technion-metabolic-disease/md-hyperlipidemia";
import { mdMuscleMetabolism } from "../lessons/technion-metabolic-disease/md-muscle-metabolism";
import { mdAtrophyUps } from "../lessons/technion-metabolic-disease/md-atrophy-ups";
import { mdAutophagy } from "../lessons/technion-metabolic-disease/md-autophagy";
import { mdWastingStates } from "../lessons/technion-metabolic-disease/md-wasting-states";
import { metIntegration } from "../lessons/technion-metabolic/met-integration";
import { metGluconeogenesis } from "../lessons/technion-metabolic/met-gluconeogenesis";
import { metFattyAcids } from "../lessons/technion-metabolic/met-fatty-acids";
import { metLipidsCholesterol } from "../lessons/technion-metabolic/met-lipids-cholesterol";
import { enPancreas } from "../lessons/technion-endocrinology/en-pancreas";
import { cellRtk } from "../lessons/technion-cell/cell-rtk";
import { cellGolgiEndosomes } from "../lessons/technion-cell/cell-golgi-endosomes";
import { phSkeletalMuscle } from "../lessons/technion-physiology/ph-skeletal-muscle";
import { ubConjugation } from "../lessons/technion-ubiquitin/ub-conjugation";
import { ubProteasome } from "../lessons/technion-ubiquitin/ub-proteasome";
import { ubLike } from "../lessons/technion-ubiquitin/ub-like";

// Technion 01340147 "מטבוליזם ומחלות באדם" (Biology faculty elective, 2 credits / 2 lecture hours). Built with the
// course-track-builder skill, no insider input. Lecturer: Prof. Shenhav Cohen (muscle atrophy, protein degradation;
// Moodle 2025–2027 closed to guests). Prereqs 134113, 134117, 134128. Evidence: the CURRENT portal paragraph (topic
// list, no weeks; English version names "muscle wasting by the ubiquitin-proteasome system and autophagy"). No books.
// No parallel course found (HUJI 94673 is a general metabolism course — not used).
// Scope, reviewed by Codex before writing (2026-10-26): 10 units — three-tissue crosstalk, fed/fasted/starvation,
// insulin resistance, diabetes, adipose+obesity (merged), hyperlipidemia with a bounded fatty-liver case, muscle fuel and
// protein balance, atrophy signaling + UPS, autophagy (its own unit — named in the English syllabus), comparative wasting
// states + therapy. Every disease unit traces sugar/fat/protein across muscle, liver and fat and ends with mechanism →
// target → effect → limitation. Lecturer's research (myofibril disassembly) used as a case study, not extra scope.
export const METABOLIC_DISEASE_LESSONS: Lesson[] = [mdCrosstalk, mdFedFasted, mdInsulinResistance, mdDiabetes, mdObesity,
  mdHyperlipidemia, mdMuscleMetabolism, mdAtrophyUps, mdAutophagy, mdWastingStates];

const sec = (l: Lesson, ...ids: string[]): PlanItem[] => (ids.length ? ids.map((section) => ({ kind: "lesson" as const, slug: l.slug, section })) : [{ kind: "lesson", slug: l.slug }]);
const probs = (l: Lesson): PlanItem[] => (l.workedProblems ?? []).map((w) => ({ kind: "lesson" as const, slug: l.slug, problem: w.id }));

const PORTAL = { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134147" };

// metabolism of the three tissues first (health → resistance → diabetes → obesity → lipids), then muscle and its wasting;
// refreshers from the prerequisite courses sit before the unit that needs them
const LECTURES: { titleHe: string; items: PlanItem[]; practice: PlanItem[] }[] = [
  { titleHe: "שריר, כבד ושומן: שיחה בין רקמות", items: [...sec(metIntegration, "organs", "hormones"), ...sec(metGluconeogenesis, "cori"), ...sec(mdCrosstalk)], practice: probs(mdCrosstalk) },
  { titleHe: "שובע, צום ורעב", items: [...sec(metIntegration, "fed-fasted", "starvation"), ...sec(metFattyAcids, "ketone-bodies"), ...sec(mdFedFasted)], practice: probs(mdFedFasted) },
  { titleHe: "תנגודת לאינסולין", items: [...sec(cellRtk, "pi3k"), ...sec(enPancreas, "insulin-actions"), ...sec(mdInsulinResistance)], practice: probs(mdInsulinResistance) },
  { titleHe: "סוכרת", items: [...sec(enPancreas, "secretion", "diabetes"), ...sec(mdDiabetes)], practice: probs(mdDiabetes) },
  { titleHe: "רקמת שומן והשמנת יתר", items: [...sec(metFattyAcids, "storage"), ...sec(mdObesity)], practice: probs(mdObesity) },
  { titleHe: "היפרליפידמיה והכבד", items: [...sec(metLipidsCholesterol, "regulation", "lipoproteins"), ...sec(mdHyperlipidemia)], practice: probs(mdHyperlipidemia) },
  { titleHe: "השריר כאיבר מטבולי", items: [...sec(phSkeletalMuscle, "structure"), ...sec(metIntegration, "exercise"), ...sec(mdMuscleMetabolism)], practice: probs(mdMuscleMetabolism) },
  { titleHe: "אטרופיה: אותות ופרוטאזום", items: [...sec(ubConjugation, "cascade"), ...sec(ubProteasome, "overview"), ...sec(mdAtrophyUps)], practice: probs(mdAtrophyUps) },
  { titleHe: "אוטופגיה בשריר", items: [...sec(cellGolgiEndosomes, "autophagy"), ...sec(ubLike, "autophagy"), ...sec(mdAutophagy)], practice: probs(mdAutophagy) },
  { titleHe: "דלדול שריר במחלות וטיפול", items: sec(mdWastingStates), practice: probs(mdWastingStates) },
];

export const technionMetabolicDiseasePlan: CoursePlan = {
  courseSlug: "technion-metabolic-disease",
  lectureOrder: {
    confidence: "suggested",
    noteHe: "אין לוח הרצאות ציבורי (אתר הקורס במודל סגור לאורחים) ואין ספר קורס רשמי. הנושאים לפי תיאור הקורס בפורטל; הסדר הוא סדר לימוד שבנינו: קודם שלוש הרקמות במצב בריא, אחר כך המחלות המטבוליות (תנגודת, סוכרת, השמנה, היפרליפידמיה), ובסוף השריר ומנגנוני האטרופיה. לפני חלק מהיחידות מקושרים סעיפי רענון מקורסי הקדם.",
    links: [PORTAL],
  },
  tutorialOrder: null,
  schedule: "suggested",
  scheduleNoteHe: "הנושאים לפי תיאור הקורס בפורטל הטכניון (אין ספר קורס רשמי). בכל יחידה עוקבים אחרי סוכרים, שומנים וחלבונים בשריר, בכבד וברקמת השומן, ומסיימים במטרות טיפוליות ובמגבלות שלהן. לא מצאנו תרגולים לקורס; תרגילי היחידות מוצגים כ\"תרגול על הרצאה n\".",
  topics: [
    { titleHe: "אינטראקציות מטבוליות בין שריר, כבד ורקמת שומן", items: [...sec(mdCrosstalk), ...sec(mdMuscleMetabolism)] },
    { titleHe: "מטבוליזם של סוכרים, שומנים וחלבונים בשובע וברעב", items: sec(mdFedFasted) },
    { titleHe: "סכרת", items: [...sec(mdInsulinResistance), ...sec(mdDiabetes)] },
    { titleHe: "השמנת יתר", items: sec(mdObesity) },
    { titleHe: "היפרליפידמיה", items: sec(mdHyperlipidemia) },
    { titleHe: "מנגנוני אטרופיה והיחלשות של שרירים", items: [...sec(mdAtrophyUps), ...sec(mdAutophagy), ...sec(mdWastingStates)] },
  ],
  lectures: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.items })),
  tutorials: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.practice })).filter((t) => t.items.length > 0),
};
