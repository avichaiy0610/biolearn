import type { CoursePlan, PlanItem, PlanSession } from "./types";
import type { Lesson } from "../lessons/types";
import { caNature } from "../lessons/technion-cancer/ca-nature";
import { caViruses } from "../lessons/technion-cancer/ca-viruses";
import { caOncogenes } from "../lessons/technion-cancer/ca-oncogenes";
import { caGrowthSignaling } from "../lessons/technion-cancer/ca-growth-signaling";
import { caTumorSuppressors } from "../lessons/technion-cancer/ca-tumor-suppressors";
import { caRbCellCycle } from "../lessons/technion-cancer/ca-rb-cell-cycle";
import { caP53Apoptosis } from "../lessons/technion-cancer/ca-p53-apoptosis";
import { caDegradation } from "../lessons/technion-cancer/ca-degradation";
import { caMultistep } from "../lessons/technion-cancer/ca-multistep";
import { caMicroenvironment } from "../lessons/technion-cancer/ca-microenvironment";
import { caMetastasis } from "../lessons/technion-cancer/ca-metastasis";
import { caImmunology } from "../lessons/technion-cancer/ca-immunology";
import { caEpigenetics } from "../lessons/technion-cancer/ca-epigenetics";
import { hgCancer } from "../lessons/technion-human-genetics/hg-cancer";
import { cellRtk } from "../lessons/technion-cell/cell-rtk";
import { cellCycleControl } from "../lessons/technion-cell/cell-cycle-control";
import { cellEcm } from "../lessons/technion-cell/cell-ecm";
import { ubCellCycle } from "../lessons/technion-ubiquitin/ub-cell-cycle";
import { ubCancerDeath } from "../lessons/technion-ubiquitin/ub-cancer-death";
import { imEffector } from "../lessons/technion-immunology/im-effector";
import { gxEpigenetics } from "../lessons/technion-gene-expression/gx-epigenetics";

// Technion 01340129 "הביולוגיה של מחלת הסרטן" (Biology faculty elective, 2 credits / 2 lecture hours per the 2023/24
// catalogue). Built with the course-track-builder skill, no insider input. Lecturer: Prof. Yehuda G. Assaraf (Moodle
// 2025, guest closed). Evidence: the CURRENT portal paragraph (topic list, no weeks) and the book (Weinberg, The
// Biology of Cancer — not on disk). Parallel (NOT this course): medicine 274246 "הבסיס המולקולרי של הסרטן" (spring
// 2025 weekly table with Weinberg 2e pages, same book, no tutorials) — used only to check that the subtopics are what
// a Weinberg-based course of this size teaches. Consensus: Weinberg-based courses elsewhere (e.g. York BIOL 4010).
// Scope, reviewed by Codex before writing (2026-10-26): 13 units; p53 merged with apoptosis; immortalization folded into
// initiation/progression; viral and cellular oncogenes kept separate (both named); the "selected topics" each get one
// unit (microenvironment, degradation of cell-cycle regulators, tumor immunology, epigenetics); metastasis is a compact
// elaboration of progression. Not written: sarcoma lecture, a therapy unit (drugs appear only to illustrate mechanisms),
// cancer genomics. Prerequisite basics (normal signaling, cell cycle, ubiquitin machinery, ECM, CTLs, Polycomb) are
// linked as refreshers before the unit that needs them.
export const CANCER_LESSONS: Lesson[] = [caNature, caViruses, caOncogenes, caGrowthSignaling, caTumorSuppressors,
  caRbCellCycle, caP53Apoptosis, caDegradation, caMultistep, caMicroenvironment, caMetastasis, caImmunology, caEpigenetics];

const sec = (l: Lesson, ...ids: string[]): PlanItem[] => (ids.length ? ids.map((section) => ({ kind: "lesson" as const, slug: l.slug, section })) : [{ kind: "lesson", slug: l.slug }]);
const probs = (l: Lesson): PlanItem[] => (l.workedProblems ?? []).map((w) => ({ kind: "lesson" as const, slug: l.slug, problem: w.id }));

const PORTAL = { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134129" };
const MEDICINE = { labelHe: "קורס מקביל ברפואה (274246) — לא הקורס הזה", url: "https://md.technion.ac.il/wp-content/uploads/2025/03/%D7%A1%D7%99%D7%9C%D7%91%D7%95%D7%A1-%D7%A7%D7%95%D7%A8%D7%A1-%D7%91%D7%99%D7%95%D7%9C%D7%95%D7%92%D7%99%D7%94-%D7%A9%D7%9C-%D7%94%D7%A1%D7%A8%D7%98%D7%9F-02740246-%D7%90%D7%91%D7%99%D7%91-%D7%AA%D7%A9%D7%A4%D7%94-2025.pdf" };

// gene families first (viral → cellular oncogenes → signaling → suppressors → the Rb and p53 checkpoints), then how
// they combine (degradation, multistep), then the selected topics; refreshers sit before the unit that needs them
const LECTURES: { titleHe: string; items: PlanItem[]; practice: PlanItem[] }[] = [
  { titleHe: "מהו סרטן: סיווג, שיבוטיות וסימני ההיכר", items: sec(caNature), practice: probs(caNature) },
  { titleHe: "נגיפים גורמי סרטן", items: sec(caViruses), practice: probs(caViruses) },
  { titleHe: "אונקוגנים תאיים", items: [...sec(hgCancer, "oncogenes"), ...sec(caOncogenes)], practice: probs(caOncogenes) },
  { titleHe: "גורמי גדילה ואיתות בסרטן", items: [...sec(cellRtk, "ras", "pi3k"), ...sec(caGrowthSignaling)], practice: probs(caGrowthSignaling) },
  { titleHe: "גנים מדכאי גידול", items: [...sec(hgCancer, "two-hit"), ...sec(caTumorSuppressors)], practice: probs(caTumorSuppressors) },
  { titleHe: "pRb ושעון מחזור התא", items: [...sec(cellCycleControl, "cdk", "g1"), ...sec(caRbCellCycle)], practice: probs(caRbCellCycle) },
  { titleHe: "p53, עקה ואפופטוזיס", items: [...sec(cellCycleControl, "p53"), ...sec(ubCancerDeath, "p53", "death"), ...sec(caP53Apoptosis)], practice: probs(caP53Apoptosis) },
  { titleHe: "פירוק חלבוני מחזור התא בסרטן", items: [...sec(ubCellCycle, "logic", "g1-s"), ...sec(caDegradation)], practice: probs(caDegradation) },
  { titleHe: "איתחול והתקדמות: סרטן בשלבים", items: [...sec(hgCancer, "evolution"), ...sec(caMultistep)], practice: probs(caMultistep) },
  { titleHe: "המיקרו-סביבה של הגידול וכלי הדם", items: [...sec(cellEcm, "integrins"), ...sec(caMicroenvironment)], practice: probs(caMicroenvironment) },
  { titleHe: "פלישה וגרורות", items: sec(caMetastasis), practice: probs(caMetastasis) },
  { titleHe: "מבוא לאימונולוגיה של הסרטן", items: [...sec(imEffector, "ctl"), ...sec(caImmunology)], practice: probs(caImmunology) },
  { titleHe: "אפיגנטיקה של הסרטן", items: [...sec(gxEpigenetics, "polycomb"), ...sec(caEpigenetics)], practice: probs(caEpigenetics) },
];

export const technionCancerPlan: CoursePlan = {
  courseSlug: "technion-cancer",
  lectureOrder: {
    confidence: "suggested",
    noteHe: "אין לוח הרצאות ציבורי לקורס (אתר הקורס במודל סגור לאורחים). הנושאים לפי תיאור הקורס בפורטל; הסדר הוא סדר לימוד שבנינו: קודם משפחות הגנים (נגיפים, אונקוגנים, איתות, מדכאי גידול, pRb ו-p53), אחר כך איך הם מצטרפים לתהליך, ובסוף \"הנושאים הנבחרים\". הקורס המקביל בפקולטה לרפואה (אותו ספר) שימש רק לבדיקה שהנושאים מתאימים — זה קורס אחר. לפני חלק מהיחידות מקושרים סעיפי רענון מקורסי הקדם.",
    links: [PORTAL, MEDICINE],
  },
  tutorialOrder: null,
  schedule: "suggested",
  scheduleNoteHe: "הנושאים לפי תיאור הקורס בפורטל הטכניון; ספר הקורס Weinberg, The Biology of Cancer. בכל יחידה — דוגמאות מייצגות, לא קטלוג. לא מצאנו תרגולים לקורס; תרגילי היחידות מוצגים כ\"תרגול על הרצאה n\".",
  topics: [
    { titleHe: "ביולוגיה של הסרטן — היבטים תאיים, מיקרו-סביבתיים ומולקולריים", items: sec(caNature) },
    { titleHe: "גנים גורמי סרטן ויראליים", items: sec(caViruses) },
    { titleHe: "גנים גורמי סרטן תאיים", items: [...sec(caOncogenes), ...sec(caGrowthSignaling)] },
    { titleHe: "גנים מדכאי סרטן", items: [...sec(caTumorSuppressors), ...sec(caRbCellCycle)] },
    { titleHe: "המנגנון המולקולרי של איתחול והתקדמות סרטן", items: [...sec(caMultistep), ...sec(caMetastasis)] },
    { titleHe: "אפופטוזיס וסרטן", items: sec(caP53Apoptosis) },
    { titleHe: "סרטן ומיקרו-סביבה", items: sec(caMicroenvironment) },
    { titleHe: "תרומת פירוק תוך-תאי של חלבוני בקרת מחזור התא להתקדמות המחלה", items: sec(caDegradation) },
    { titleHe: "מבוא לאימונולוגיה של הסרטן", items: sec(caImmunology) },
    { titleHe: "אפיגנטיקה של הסרטן", items: sec(caEpigenetics) },
  ],
  lectures: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.items })),
  tutorials: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.practice })).filter((t) => t.items.length > 0),
};
