import type { CoursePlan, PlanItem, PlanSession } from "./types";
import type { Lesson } from "../lessons/types";
import { hgVariants } from "../lessons/technion-human-genetics/hg-variants";
import { hgXLinked } from "../lessons/technion-human-genetics/hg-x-linked";
import { hgImprinting } from "../lessons/technion-human-genetics/hg-imprinting";
import { hgRepeats } from "../lessons/technion-human-genetics/hg-repeats";
import { hgMultifactorial } from "../lessons/technion-human-genetics/hg-multifactorial";
import { hgMitochondrial } from "../lessons/technion-human-genetics/hg-mitochondrial";
import { hgMetabolic } from "../lessons/technion-human-genetics/hg-metabolic";
import { hgCancer } from "../lessons/technion-human-genetics/hg-cancer";
import { hgBehavior } from "../lessons/technion-human-genetics/hg-behavior";
import { hgDevelopment } from "../lessons/technion-human-genetics/hg-development";
import { hgSexDetermination } from "../lessons/technion-human-genetics/hg-sex-determination";
import { hgMappingCloning } from "../lessons/technion-human-genetics/hg-mapping-cloning";
import { hgDiagnosis } from "../lessons/technion-human-genetics/hg-diagnosis";
import { sexDetermination } from "../lessons/technion-genetics/sex-determination";
import { nonMendelian } from "../lessons/technion-genetics/non-mendelian";
import { linkageMapping } from "../lessons/technion-genetics/linkage-mapping";
import { chromosomeNumber } from "../lessons/technion-genetics/chromosome-number";
import { gxEpigenetics } from "../lessons/technion-gene-expression/gx-epigenetics";

// Technion 01360088 "גנטיקה מולקולרית של האדם" (Biology faculty, 3 lecture hours/week per the 2020/21 syllabus, which
// says the course "will be updated on a yearly basis"; that file is no longer reachable — the old Moodle host is down
// and it is not archived). Built with the course-track-builder skill, no insider input. Lecturer: Prof. Sara Selig
// (2025–2026; telomere epigenetics, ICF syndrome). Prereqs 134020, 134082, 134119. Evidence: the CURRENT portal
// paragraph, which lists the topics in order (X-linked, imprinting, trinucleotide repeats, multifactorial,
// mitochondrial, metabolic, malignant; behavioral genetics, embryonic development, sex determination, techniques for
// mapping/cloning and diagnosis) and the books (Strachan & Read HMG — 4e on disk; Thompson & Thompson — not on disk).
// Parallel (NOT this course): medicine 274242 Human Genetics (Thompson 9e).
// Scope, reviewed by Codex before writing (2026-10-26): 13 units, one per portal item plus a molecular-pathology
// foundation; two or three contrasting examples per unit, not catalogues; prerequisite basics linked as refreshers.
// PROVISIONAL inside units: ICF/FSHD (lecturer's research area), polygenic scores, mitochondrial replacement,
// sequencing-led discovery, detailed ACMG/NIPT/PGT. Israeli population context covers founder effects, consanguinity
// and carrier screening across communities, not only Ashkenazi.
export const HUMAN_GENETICS_LESSONS: Lesson[] = [hgVariants, hgXLinked, hgImprinting, hgRepeats, hgMultifactorial,
  hgMitochondrial, hgMetabolic, hgCancer, hgBehavior, hgDevelopment, hgSexDetermination, hgMappingCloning, hgDiagnosis];

const sec = (l: Lesson, ...ids: string[]): PlanItem[] => (ids.length ? ids.map((section) => ({ kind: "lesson" as const, slug: l.slug, section })) : [{ kind: "lesson", slug: l.slug }]);
const probs = (l: Lesson): PlanItem[] => (l.workedProblems ?? []).map((w) => ({ kind: "lesson" as const, slug: l.slug, problem: w.id }));
const MITO_ANIMATION: PlanItem = { kind: "process", topic: "genetics", slug: "mitochondrial-inheritance-animation-1780786394329" };

const PORTAL = { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/136088" };

// lectures follow the portal paragraph's own order; refreshers from the prerequisite courses sit before the new unit
const LECTURES: { titleHe: string; items: PlanItem[]; practice: PlanItem[] }[] = [
  { titleHe: "מוריאנט למחלה: פתולוגיה מולקולרית", items: sec(hgVariants), practice: probs(hgVariants) },
  { titleHe: "מחלות בתאחיזה לכרומוזום X", items: [...sec(sexDetermination, "sex-linkage", "dosage"), ...sec(hgXLinked)], practice: probs(hgXLinked) },
  { titleHe: "החתמה גנומית ומחלות אפיגנטיות", items: [...sec(nonMendelian, "imprinting"), ...sec(gxEpigenetics, "imprinting"), ...sec(hgImprinting)], practice: probs(hgImprinting) },
  { titleHe: "מוטציות דינמיות: הרחבת חזרות", items: sec(hgRepeats), practice: probs(hgRepeats) },
  { titleHe: "מחלות מולטיפקטוריאליות", items: sec(hgMultifactorial), practice: probs(hgMultifactorial) },
  { titleHe: "מחלות מיטוכונדריאליות", items: [...sec(nonMendelian, "organelles"), ...sec(hgMitochondrial), MITO_ANIMATION], practice: probs(hgMitochondrial) },
  { titleHe: "מחלות מטבוליות תורשתיות", items: sec(hgMetabolic), practice: probs(hgMetabolic) },
  { titleHe: "גנטיקה של סרטן", items: sec(hgCancer), practice: probs(hgCancer) },
  { titleHe: "גנטיקה של התנהגות ומחלות נפש", items: sec(hgBehavior), practice: probs(hgBehavior) },
  { titleHe: "הפרעות בהתפתחות העוברית", items: [...sec(chromosomeNumber, "nondisjunction", "human"), ...sec(hgDevelopment)], practice: probs(hgDevelopment) },
  { titleHe: "קביעת מין והפרעות בהתפתחות המין", items: [...sec(sexDetermination, "systems", "human-vs-fly"), ...sec(hgSexDetermination)], practice: probs(hgSexDetermination) },
  { titleHe: "מיפוי ושיבוט של גני מחלות", items: [...sec(linkageMapping, "human"), ...sec(hgMappingCloning)], practice: probs(hgMappingCloning) },
  { titleHe: "אבחון של מחלות גנטיות", items: sec(hgDiagnosis), practice: probs(hgDiagnosis) },
];

export const technionHumanGeneticsPlan: CoursePlan = {
  courseSlug: "technion-human-genetics",
  lectureOrder: {
    confidence: "syllabus",
    noteHe: "אין לוח הרצאות ציבורי לקורס (אתר הקורס במודל סגור, והסילבוס המפורט של 2020/21 כבר לא זמין). הסדר כאן לפי סדר הנושאים בתיאור הקורס בפורטל, עם יחידת פתיחה על פתולוגיה מולקולרית. בכל יחידה — שתיים-שלוש דוגמאות מייצגות, לא רשימה של כל המחלות; לפני חלק מהיחידות מקושרים סעיפי רענון מקורסי הקדם.",
    links: [PORTAL],
  },
  tutorialOrder: null,
  schedule: "suggested",
  scheduleNoteHe: "הנושאים לפי תיאור הקורס בפורטל הטכניון; ספר הקורס Strachan & Read, Human Molecular Genetics. הקורס מתעדכן כל שנה (לפי הסילבוס), ולכן הדוגמאות כאן הן בחירה מייצגת. התרגולים מוצגים כ\"תרגול על הרצאה n\".",
  topics: [
    { titleHe: "היבטים מולקולריים בגנטיקה של האדם, בעיקר במחלות תורשתיות", items: sec(hgVariants) },
    { titleHe: "מחלות בתאחיזה לכרומוזום X", items: sec(hgXLinked) },
    { titleHe: "מחלות הקשורות לתופעת ה-IMPRINTING", items: sec(hgImprinting) },
    { titleHe: "הרחבה של TRINUCLEOTIDE REPEATS", items: sec(hgRepeats) },
    { titleHe: "מחלות מולטיפקטוריאליות", items: sec(hgMultifactorial) },
    { titleHe: "מחלות מיטוכונדריאליות", items: [...sec(hgMitochondrial), MITO_ANIMATION] },
    { titleHe: "מחלות מטבוליות", items: sec(hgMetabolic) },
    { titleHe: "מחלות ממאירות", items: sec(hgCancer) },
    { titleHe: "גנטיקה של התנהגות", items: sec(hgBehavior) },
    { titleHe: "הפרעות בהתפתחות עוברית", items: sec(hgDevelopment) },
    { titleHe: "קביעת מין", items: sec(hgSexDetermination) },
    { titleHe: "טכניקות מולקולריות למיפוי ולשיבוט גנים", items: sec(hgMappingCloning) },
    { titleHe: "אבחון מחלות גנטיות", items: sec(hgDiagnosis) },
  ],
  lectures: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.items })),
  tutorials: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.practice })).filter((t) => t.items.length > 0),
};
