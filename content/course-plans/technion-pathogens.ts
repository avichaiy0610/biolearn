import type { CoursePlan, PlanItem, PlanSession } from "./types";
import type { Lesson } from "../lessons/types";
import { pgIntro } from "../lessons/technion-pathogens/pg-intro";
import { pgPhysiology } from "../lessons/technion-pathogens/pg-physiology";
import { pgAdhesion } from "../lessons/technion-pathogens/pg-adhesion";
import { pgInvasion } from "../lessons/technion-pathogens/pg-invasion";
import { pgToxins } from "../lessons/technion-pathogens/pg-toxins";
import { pgEvasionRegulation } from "../lessons/technion-pathogens/pg-evasion-regulation";
import { pgVirusesMolds } from "../lessons/technion-pathogens/pg-viruses-molds";
import { pgEmergence } from "../lessons/technion-pathogens/pg-emergence";
import { pgDetectionConventional } from "../lessons/technion-pathogens/pg-detection-conventional";
import { pgDetectionMolecular } from "../lessons/technion-pathogens/pg-detection-molecular";
import { pgAntimicrobials } from "../lessons/technion-pathogens/pg-antimicrobials";
import { pgPredictive } from "../lessons/technion-pathogens/pg-predictive";
import { pgRisk } from "../lessons/technion-pathogens/pg-risk";
import { mvClinical } from "../lessons/technion-micro-viro/mv-clinical";
import { mvEnvironment } from "../lessons/technion-micro-viro/mv-environment";
import { mvGrowth } from "../lessons/technion-micro-viro/mv-growth";
import { mvSurfaceMotility } from "../lessons/technion-micro-viro/mv-surface-motility";
import { mvImmunology } from "../lessons/technion-micro-viro/mv-immunology";
import { mvGeneTransfer } from "../lessons/technion-micro-viro/mv-gene-transfer";
import { mvPhages } from "../lessons/technion-micro-viro/mv-phages";
import { mvAntibiotics } from "../lessons/technion-micro-viro/mv-antibiotics";

// Technion 066418 "מקרוביולוגיה של פתוגנים" (Faculty of Biotechnology & Food Engineering, 2 credits = 2 lecture hours,
// no tutorials in the portal). Built with the course-track-builder skill, no insider input. Lecturer: Prof. Sima Yaron
// (also teaches 134121, a prerequisite — hence the mv-* refreshers). Evidence: the CURRENT portal paragraph (the only
// official scope) plus a 2020/21 staff syllabus known ONLY from search-engine snippets (the moodle2222 server is
// unreachable), which named Brock and Wilson "Bacterial Pathogenesis" as reading and added detection of toxins,
// microbiome-vs-pathogen and the emergence of new pathogens. No-extra-credit pair 274339 (Medicine) is a DIFFERENT
// course and was not used for scope. Scope reviewed by Codex before writing (2026-10-27): 13 units; narrow invasion,
// damage and evasion to two principal case studies each; strengthen mould physiology, detection limits and the
// quantitative part (hence predictive and QMRA split into two units); biosensors, phage biocontrol, genome reduction
// and extensive antigenic variation marked extension.
export const PATHOGENS_LESSONS: Lesson[] = [pgIntro, pgPhysiology, pgAdhesion, pgInvasion, pgToxins,
  pgEvasionRegulation, pgVirusesMolds, pgEmergence, pgDetectionConventional, pgDetectionMolecular, pgAntimicrobials,
  pgPredictive, pgRisk];

const sec = (l: Lesson, ...ids: string[]): PlanItem[] => (ids.length ? ids.map((section) => ({ kind: "lesson" as const, slug: l.slug, section })) : [{ kind: "lesson", slug: l.slug }]);
const probs = (l: Lesson): PlanItem[] => (l.workedProblems ?? []).map((w) => ({ kind: "lesson" as const, slug: l.slug, problem: w.id }));

const PORTAL = { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/066418" };

// Codex's recommended order; refresher sections from 134121 sit after the local unit that needs them
const LECTURES: { titleHe: string; items: PlanItem[]; practice: PlanItem[] }[] = [
  { titleHe: "פתוגנים ממזון וממים: מסגרת מושגית", items: [...sec(pgIntro), ...sec(mvClinical, "concepts", "stages", "koch", "epidemiology")], practice: probs(pgIntro) },
  { titleHe: "פיזיולוגיה של שרידות מחוץ למארח", items: [...sec(pgPhysiology), ...sec(mvEnvironment, "temperature", "ph", "water"), ...sec(mvGrowth, "growth-curve")], practice: probs(pgPhysiology) },
  { titleHe: "היצמדות והתיישבות ברקמה", items: [...sec(pgAdhesion), ...sec(mvSurfaceMotility, "capsule", "pili")], practice: probs(pgAdhesion) },
  { titleHe: "חדירה לרקמה וחיים בתוך התא", items: sec(pgInvasion), practice: probs(pgInvasion) },
  { titleHe: "נזק לתאים: שלושה צירים של סיווג", items: [...sec(pgToxins), ...sec(mvClinical, "toxins")], practice: probs(pgToxins) },
  { titleHe: "התחמקות מהגנות המארח ובקרת האלימות", items: [...sec(pgEvasionRegulation), ...sec(mvImmunology, "barriers", "innate")], practice: probs(pgEvasionRegulation) },
  { titleHe: "נגיפים ועובשים במזון ובמים", items: sec(pgVirusesMolds), practice: probs(pgVirusesMolds) },
  { titleHe: "הופעת פתוגנים חדשים", items: [...sec(pgEmergence), ...sec(mvGeneTransfer, "transformation", "transduction", "conjugation", "plasmids", "transposons", "hgt-significance"), ...sec(mvPhages, "lysogenic-conversion")], practice: probs(pgEmergence) },
  { titleHe: "זיהוי בשיטות מבוססות גידול", items: [...sec(pgDetectionConventional), ...sec(mvClinical, "lab"), ...sec(mvGrowth, "counting")], practice: probs(pgDetectionConventional) },
  { titleHe: "זיהוי מולקולרי ואימונולוגי", items: [...sec(pgDetectionMolecular), ...sec(mvClinical, "immuno-molecular")], practice: probs(pgDetectionMolecular) },
  { titleHe: "חומרים אנטיבקטריאליים ורכישת עמידות", items: [...sec(pgAntimicrobials), ...sec(mvAntibiotics, "selective-toxicity", "targets", "mechanisms", "spread", "tolerance", "countermeasures"), ...sec(mvClinical, "ast"), ...sec(mvEnvironment, "chemical-control")], practice: probs(pgAntimicrobials) },
  { titleHe: "מודלים לחיזוי גדילה וקטילה", items: [...sec(pgPredictive), ...sec(mvGrowth, "exponential"), ...sec(mvEnvironment, "physical-control")], practice: probs(pgPredictive) },
  { titleHe: "הערכת סיכון מיקרוביאלית כמותית", items: sec(pgRisk), practice: probs(pgRisk) },
];

export const technionPathogensPlan: CoursePlan = {
  courseSlug: "technion-pathogens",
  lectureOrder: {
    confidence: "suggested",
    noteHe: "אין לוח הרצאות ציבורי לקורס (אתר הקורס במודל סגור לאורחים), ובתיאור בפורטל יש רשימת נושאים בלבד. הסדר כאן הוא סדר לימוד שבנינו: קודם מסגרת מושגית ופיזיולוגיה של שרידות, אחר כך שלבי האלימות לפי סדר ההדבקה (היצמדות, חדירה, נזק, התחמקות), ואז נגיפים ועובשים, הופעת פתוגנים חדשים, שיטות הזיהוי, חומרים אנטיבקטריאליים, ולבסוף שתי היחידות הכמותיות. הדוגמאות הספציפיות הן בחירה שלנו, לא נושאים שאושרו. אחרי חלק מהיחידות מקושרים סעיפי רענון מקורס מיקרוביולוגיה ווירולוגיה (134121), שהוא מקצוע קדם ומועבר בידי אותה מרצה.",
    links: [PORTAL],
  },
  tutorialOrder: null,
  schedule: "suggested",
  scheduleNoteHe: "הנושאים לפי תיאור הקורס בפורטל הטכניון (2 נקודות זכות, 2 שעות הרצאה). בפורטל לא רשומים ספרים; סילבוס של הסגל מ-2020/21 (שאינו נגיש כיום, ומוכר לנו מקטעי חיפוש בלבד) ציין את Brock Biology of Microorganisms ואת Wilson, Winkler & Ho, Bacterial Pathogenesis. לא מצאנו תרגולים לקורס — התרגילים הפתורים ביחידות מוצגים כ\"תרגול על הרצאה n\".",
  topics: [
    { titleHe: "פיזיולוגיה של מיקרואורגניזמים פתוגנים שמקורם במזון ובמים", items: [...sec(pgIntro), ...sec(pgPhysiology), ...sec(pgVirusesMolds)] },
    { titleHe: "מנגנונים מולקולריים של פתוגניות: היצמדות, חדירה והרס תאים", items: [...sec(pgAdhesion), ...sec(pgInvasion), ...sec(pgToxins)] },
    { titleHe: "דרכי התגוננות מפני מערכת החיסון", items: sec(pgEvasionRegulation) },
    { titleHe: "הופעת פתוגנים חדשים ורכישת תכונות פתוגניות", items: sec(pgEmergence) },
    { titleHe: "שיטות זיהוי קונבנציונליות ומולקולריות", items: [...sec(pgDetectionConventional), ...sec(pgDetectionMolecular)] },
    { titleHe: "מנגנוני פעולה של חומרים אנטיבקטריאליים ורכישת עמידות", items: sec(pgAntimicrobials) },
    { titleHe: "מודלים מתמטיים להערכת סיכון", items: [...sec(pgPredictive), ...sec(pgRisk)] },
  ],
  lectures: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.items })),
  tutorials: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.practice })).filter((t) => t.items.length > 0),
};
