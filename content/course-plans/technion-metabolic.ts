import type { CoursePlan, PlanItem, PlanSession } from "./types";
import type { Lesson } from "../lessons/types";
import { metConcepts } from "../lessons/technion-metabolic/met-concepts";
import { metGlycolysis } from "../lessons/technion-metabolic/met-glycolysis";
import { metGluconeogenesis } from "../lessons/technion-metabolic/met-gluconeogenesis";
import { metCitricAcid } from "../lessons/technion-metabolic/met-citric-acid";
import { metOxphos } from "../lessons/technion-metabolic/met-oxphos";
import { metPhotosynthesis } from "../lessons/technion-metabolic/met-photosynthesis";
import { metPentose } from "../lessons/technion-metabolic/met-pentose";
import { metGlycogen } from "../lessons/technion-metabolic/met-glycogen";
import { metFattyAcids } from "../lessons/technion-metabolic/met-fatty-acids";
import { metIntegration } from "../lessons/technion-metabolic/met-integration";
import { metLipidsCholesterol } from "../lessons/technion-metabolic/met-lipids-cholesterol";
import { metAminoAcids } from "../lessons/technion-metabolic/met-amino-acids";
import { metNucleotides } from "../lessons/technion-metabolic/met-nucleotides";

// Technion 01340113 "מסלולים מטבוליים" — built with the course-track-builder skill, no insider input.
// Topics: the CURRENT syllabus on the Technion students portal (topics only, no weeks), in its own order.
// Lecture order: no public schedule (Moodle is closed to guests) — one lecture per syllabus topic, in the
// syllabus order, which is close to the chapter order of the course textbook (Berg, ch. 15–27).
// Tutorials: no source — "practice for lecture n", built from each unit's worked problems.

const B = "biochemistry";
const proc = (slug: string): PlanItem => ({ kind: "process", topic: B, slug });
const sec = (l: Lesson, ...ids: string[]): PlanItem[] => (ids.length ? ids.map((section) => ({ kind: "lesson" as const, slug: l.slug, section })) : [{ kind: "lesson", slug: l.slug }]);
const probs = (...ls: Lesson[]): PlanItem[] => ls.flatMap((l) => (l.workedProblems ?? []).map((w) => ({ kind: "lesson" as const, slug: l.slug, problem: w.id })));

const PORTAL = { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134113" };

// extra = worked problems of the integration unit, split between its two lectures
const LECTURES: { titleHe: string; items: PlanItem[]; practice: Lesson[]; extra?: string[] }[] = [
  { titleHe: "קטבוליזם ואנבוליזם; ATP ונשאים מופעלים; מנגנוני בקרה", items: sec(metConcepts), practice: [metConcepts] },
  { titleHe: "גליקוליזה", items: [...sec(metGlycolysis), proc("glycolysis")], practice: [metGlycolysis] },
  { titleHe: "פירובט דהידרוגנאז ומעגל החומצה הציטרית", items: [...sec(metCitricAcid), proc("cellular-respiration")], practice: [metCitricAcid] },
  { titleHe: "זרחון חמצוני", items: [...sec(metOxphos), proc("cellular-respiration")], practice: [metOxphos] },
  { titleHe: "פוטוסינתזה: תגובות האור ומעגל קלווין", items: [...sec(metPhotosynthesis), proc("photosynthesis")], practice: [metPhotosynthesis] },
  { titleHe: "מסלול הפנטוז פוספט", items: sec(metPentose), practice: [metPentose] },
  { titleHe: "גלוקונאוגנזה ובקרה הדדית", items: [...sec(metGluconeogenesis), proc("gluconeogenesis")], practice: [metGluconeogenesis] },
  { titleHe: "גליקוגן ובקרה הורמונלית", items: sec(metGlycogen), practice: [metGlycogen] },
  { titleHe: "חומצות שומן: פירוק, בנייה ובקרה", items: [...sec(metFattyAcids), proc("fatty-acid-beta-oxidation")], practice: [metFattyAcids] },
  { titleHe: "מטבוליזם במצבי עקה: רעב וסוכרת", items: sec(metIntegration, "fed-fasted", "starvation", "diabetes"), practice: [], extra: ["protein-sparing", "type1-liver"] },
  { titleHe: "פוספוליפידים, כולסטרול וליפופרוטאינים", items: sec(metLipidsCholesterol), practice: [metLipidsCholesterol] },
  { titleHe: "מטבוליזם של חומצות אמינו ומעגל האוריאה", items: [...sec(metAminoAcids), proc("urea-cycle")], practice: [metAminoAcids] },
  { titleHe: "מטבוליזם של נוקלאוטידים", items: sec(metNucleotides), practice: [metNucleotides] },
  { titleHe: "אינטגרציה: האיברים, ההורמונים, מאמץ ואלכוהול", items: sec(metIntegration, "organs", "hormones", "exercise", "ethanol"), practice: [], extra: ["sprint-marathon"] },
];

export const technionMetabolicPlan: CoursePlan = {
  courseSlug: "technion-metabolic",
  lectureOrder: {
    confidence: "textbook",
    noteHe: "אין לוח הרצאות ציבורי לקורס (אתר הקורס במודל סגור). הסדר כאן הוא סדר הנושאים בסילבוס הרשמי — הרצאה לכל נושא — והוא קרוב לסדר הפרקים בספר הקורס (Berg, פרקים 15–27). הסילבוס לא מפרט שבועות, ולכן ייתכן שהחלוקה בפועל שונה.",
    links: [PORTAL],
  },
  tutorialOrder: null,
  schedule: "suggested",
  scheduleNoteHe: "הנושאים לפי הסילבוס העדכני של הקורס בפורטל הטכניון (הוא מפרט נושאים, לא שבועות). הפירוט לתת-נושאים לפי ספר הקורס (Berg).",
  topics: [
    { titleHe: "קטבוליזם ואנבוליזם, המסלול המטבולי ומנגנוני בקרה", items: sec(metConcepts) },
    { titleHe: "גליקוליזה", items: [...sec(metGlycolysis), proc("glycolysis")] },
    { titleHe: "מעגל החומצה הציטרית", items: [...sec(metCitricAcid), proc("cellular-respiration")] },
    { titleHe: "זרחון חמצוני", items: sec(metOxphos) },
    { titleHe: "פוטוסינתזה", items: [...sec(metPhotosynthesis), proc("photosynthesis")] },
    { titleHe: "מסלול הפנטוז פוספט", items: sec(metPentose) },
    { titleHe: "גלוקונאוגנזה", items: [...sec(metGluconeogenesis), proc("gluconeogenesis")] },
    { titleHe: "מאגרי אנרגיה: גליקוגן וחומצות שומן, והבקרה ההורמונלית", items: [...sec(metGlycogen), ...sec(metFattyAcids), proc("fatty-acid-beta-oxidation")] },
    { titleHe: "מטבוליזם במצבי עקה: רעב וסוכרת", items: sec(metIntegration, "fed-fasted", "starvation", "diabetes") },
    { titleHe: "המטבוליזם של פוספוליפידים וכולסטרול", items: sec(metLipidsCholesterol) },
    { titleHe: "המטבוליזם של חומצות אמינו", items: [...sec(metAminoAcids), proc("urea-cycle")] },
    { titleHe: "המטבוליזם של נוקלאוטידים", items: sec(metNucleotides) },
    { titleHe: "אינטגרציה של המטבוליזם התאי", items: sec(metIntegration, "organs", "hormones", "exercise", "ethanol") },
  ],
  lectures: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.items })),
  tutorials: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: [...probs(...l.practice), ...(l.extra ?? []).map((problem): PlanItem => ({ kind: "lesson", slug: metIntegration.slug, problem }))] }))
    .filter((t) => t.items.length > 0),
};
