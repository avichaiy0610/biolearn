import type { CoursePlan, PlanItem, PlanSession } from "./types";
import type { Lesson } from "../lessons/types";
import { ecEnvironment } from "../lessons/technion-ecology/ec-environment";
import { ecAdaptations } from "../lessons/technion-ecology/ec-adaptations";
import { ecPopulationGrowth } from "../lessons/technion-ecology/ec-population-growth";
import { ecPopulationRegulation } from "../lessons/technion-ecology/ec-population-regulation";
import { ecCompetition } from "../lessons/technion-ecology/ec-competition";
import { ecPredation } from "../lessons/technion-ecology/ec-predation";
import { ecEnergyFlow } from "../lessons/technion-ecology/ec-energy-flow";
import { ecBiogeochemical } from "../lessons/technion-ecology/ec-biogeochemical";
import { ecDiversity } from "../lessons/technion-ecology/ec-diversity";
import { ecSuccession } from "../lessons/technion-ecology/ec-succession";
import { ecHumanImpact } from "../lessons/technion-ecology/ec-human-impact";

// Technion 01340153 "אקולוגיה" (Biology faculty) — built with the course-track-builder skill, no insider input.
// Evidence: the CURRENT portal paragraph (9 topics, no weeks). Books (portal): Ricklefs, Ecology; Begon, Ecology and
// Essentials of Ecology; Perevolotsky, אקולוגיה: התיאוריה והמציאות הישראלית (Relyea & Ricklefs 9e and Begon 5e on disk).
// Moodle closed to guests; lecturer 2025–2026: Yoram Yerushalmi. Equivalent courses (evidence only): TAU 0455-1809
// (detailed syllabus, 13 lectures), HUJI 72107, BGU 205.1.3111.
// Scope (step 5a), reviewed by Codex before writing (2026-10-23): 11 units; named topics core; named models, laws and
// classic experiments "likely"; mutualism and parasitism only in a short interaction table; adaptation vs acclimation,
// population bookkeeping and restoration added.
// Order: the paragraph's own topic order, labelled "syllabus".

const sec = (l: Lesson, ...ids: string[]): PlanItem[] => (ids.length ? ids.map((section) => ({ kind: "lesson" as const, slug: l.slug, section })) : [{ kind: "lesson", slug: l.slug }]);
const probs = (l: Lesson): PlanItem[] => (l.workedProblems ?? []).map((w) => ({ kind: "lesson" as const, slug: l.slug, problem: w.id }));

const PORTAL = { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134153" };

const LECTURES: { titleHe: string; items: PlanItem[]; practice: PlanItem[] }[] = [
  { titleHe: "מערכות אקולוגיות: זרימת אנרגיה", items: sec(ecEnergyFlow), practice: probs(ecEnergyFlow) },
  { titleHe: "המחזורים הביוגיאוכימיים", items: sec(ecBiogeochemical), practice: probs(ecBiogeochemical) },
  { titleHe: "הסביבה ותפוצת האורגניזמים", items: sec(ecEnvironment), practice: probs(ecEnvironment) },
  { titleHe: "אדפטציות לבתי הגידול", items: sec(ecAdaptations), practice: probs(ecAdaptations) },
  { titleHe: "מגוון מינים", items: sec(ecDiversity), practice: probs(ecDiversity) },
  { titleHe: "סוקססיה", items: sec(ecSuccession), practice: probs(ecSuccession) },
  { titleHe: "גידול אוכלוסיות", items: sec(ecPopulationGrowth), practice: probs(ecPopulationGrowth) },
  { titleHe: "ויסות גודל האוכלוסייה", items: sec(ecPopulationRegulation), practice: probs(ecPopulationRegulation) },
  { titleHe: "תחרות", items: sec(ecCompetition), practice: probs(ecCompetition) },
  { titleHe: "טריפה ורעייה", items: sec(ecPredation), practice: probs(ecPredation) },
  { titleHe: "השפעת האדם ומעורבותו", items: sec(ecHumanImpact), practice: probs(ecHumanImpact) },
];

export const technionEcologyPlan: CoursePlan = {
  courseSlug: "technion-ecology",
  lectureOrder: {
    confidence: "syllabus",
    noteHe: "אין לוח הרצאות ציבורי לקורס (אתר הקורס במודל סגור). הסדר כאן לפי סדר הנושאים בסילבוס שבפורטל. בקורסים מקבילים (למשל בת\"א) הסדר הפוך — מהפרט לאוכלוסייה, לחברה ולמערכת — ולכן הסדר בהרצאות עצמן עשוי להיות שונה.",
    links: [PORTAL],
  },
  tutorialOrder: null,
  schedule: "suggested",
  scheduleNoteHe: "הנושאים לפי הסילבוס בפורטל הטכניון; הפירוט לפי ספרי הקורס (Begon, Ricklefs) והדוגמאות הישראליות לפי פרבולוצקי. התרגילים הפתורים כאן לתרגול עצמי — סדר התרגולים בקורס לא פורסם.",
  topics: [
    { titleHe: "מערכות אקולוגיות (זרימת אנרגיה)", items: sec(ecEnergyFlow) },
    { titleHe: "המסלולים הביוגיאוכימיים", items: sec(ecBiogeochemical) },
    { titleHe: "גורמים המשפיעים על תפוצת האורגניזמים", items: sec(ecEnvironment) },
    { titleHe: "אדפטציות לבתי הגידול השונים", items: sec(ecAdaptations) },
    { titleHe: "מגוון מינים", items: sec(ecDiversity) },
    { titleHe: "סוקססיה (התבגרות המערכת האקולוגית)", items: sec(ecSuccession) },
    { titleHe: "ויסות גודל האוכלוסייה", items: [...sec(ecPopulationGrowth), ...sec(ecPopulationRegulation)] },
    { titleHe: "אינטראקציות ביולוגיות: תחרות וטריפה", items: [...sec(ecCompetition), ...sec(ecPredation)] },
    { titleHe: "השפעת האדם ומעורבותו במערכת האקולוגית", items: sec(ecHumanImpact) },
  ],
  lectures: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.items })),
  tutorials: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.practice })).filter((t) => t.items.length > 0),
};
