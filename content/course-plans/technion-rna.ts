import type { CoursePlan, PlanItem, PlanSession } from "./types";
import type { Lesson } from "../lessons/types";
import { rnRnaWorld } from "../lessons/technion-rna/rn-rna-world";
import { rnRibozymes } from "../lessons/technion-rna/rn-ribozymes";
import { rnBacterialRna } from "../lessons/technion-rna/rn-bacterial-rna";
import { rnPirna } from "../lessons/technion-rna/rn-pirna";
import { rnSnorna } from "../lessons/technion-rna/rn-snorna";
import { rnLncrna } from "../lessons/technion-rna/rn-lncrna";
import { rnInheritance } from "../lessons/technion-rna/rn-inheritance";
import { gxNcrna } from "../lessons/technion-gene-expression/gx-ncrna";

// Technion 01340151 "העולם המודרני של הרנ"א" (Biology faculty, 2 points) — built with the course-track-builder skill,
// no insider input. Evidence: the CURRENT portal paragraph (three aspects of RNA: ribozymes and the origin of life;
// regulation by non-coding RNA — names garbled on the portal: INCRNA = lncRNA, PIRNA = piRNA, RNAONS = snoRNA,
// RNATM read provisionally as tmRNA; RNA as a hereditary component). Lecturer: Prof. Yoav Arava; prerequisite 134119.
// No books listed; units written against Lewin's Genes XII and Watson 7e (on disk). Moodle closed to guests.
// Scope (step 5a), reviewed by Codex before writing (2026-10-24): 7 units. Material cut from 134119 on 2026-10-21
// (riboswitches, bacterial sRNA, RNAi–heterochromatin, lncRNA) belongs here. miRNA/siRNA stay in 134119 and are linked
// as a refresher. CRISPR is not repeated (134082).
// Order: the paragraph's own order (part 1 → 2 → 3), labelled "syllabus".

const sec = (l: Lesson, ...ids: string[]): PlanItem[] => (ids.length ? ids.map((section) => ({ kind: "lesson" as const, slug: l.slug, section })) : [{ kind: "lesson", slug: l.slug }]);
const probs = (l: Lesson): PlanItem[] => (l.workedProblems ?? []).map((w) => ({ kind: "lesson" as const, slug: l.slug, problem: w.id }));

// the four lncRNA animations (made earlier under molecular biology) belong to this course
const proc = (slug: string): PlanItem => ({ kind: "process", topic: "molecular-biology", slug });
const LNC_ANIMATIONS = ["gencode-lncrna-discovery", "lncrna-conservation-genomic-context", "lncrna-enhancer-function", "lncrna-development-differentiation"].map(proc);

const PORTAL = { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134151" };

const LECTURES: { titleHe: string; items: PlanItem[]; practice: PlanItem[] }[] = [
  { titleHe: "עולם ה-RNA ומקור החיים", items: sec(rnRnaWorld), practice: probs(rnRnaWorld) },
  { titleHe: "ריבוזימים", items: sec(rnRibozymes), practice: probs(rnRibozymes) },
  { titleHe: "RNA מבקר בחיידקים: ריבוסוויצ'ים, sRNA ו-tmRNA", items: sec(rnBacterialRna), practice: probs(rnBacterialRna) },
  { titleHe: "piRNA (רענון: miRNA ו-siRNA)", items: [...sec(gxNcrna), ...sec(rnPirna)], practice: probs(rnPirna) },
  { titleHe: "snoRNA", items: sec(rnSnorna), practice: probs(rnSnorna) },
  { titleHe: "lncRNA", items: [...sec(rnLncrna), ...LNC_ANIMATIONS], practice: probs(rnLncrna) },
  { titleHe: "RNA כמרכיב תורשתי", items: sec(rnInheritance), practice: probs(rnInheritance) },
];

export const technionRnaPlan: CoursePlan = {
  courseSlug: "technion-rna",
  lectureOrder: {
    confidence: "syllabus",
    noteHe: "אין לוח הרצאות ציבורי לקורס (אתר הקורס במודל סגור). הסדר כאן לפי שלושת החלקים בתיאור הקורס בפורטל: ריבוזימים ומקור החיים ← RNA מבקר (lncRNA, piRNA, snoRNA ועוד) ← RNA כמרכיב תורשתי. שמות סוגי ה-RNA בפורטל משובשים; \"RNATM\" פורש כאן באופן זמני כ-tmRNA.",
    links: [PORTAL],
  },
  tutorialOrder: null,
  schedule: "suggested",
  scheduleNoteHe: "הנושאים לפי תיאור הקורס בפורטל הטכניון (2 נקודות זכות). בפורטל לא רשומים ספרים; הפירוט לפי Lewin's Genes XII ו-Watson. miRNA ו-siRNA נלמדים בקורס הקדם (בקרת הביטוי הגנטי) ומופיעים כאן כרענון. התרגילים הפתורים כאן לתרגול עצמי.",
  topics: [
    { titleHe: "RNA כאנזים (ריבוזים) בעל פעילויות קטליטיות מגוונות", items: [...sec(rnRibozymes), ...sec(rnRnaWorld, "properties", "evidence", "in-vitro-evolution")] },
    { titleHe: "שלב ביצירת החיים על פני כדור הארץ", items: sec(rnRnaWorld, "hypothesis", "prebiotic", "open-problems") },
    { titleHe: "RNA המבקר ביטוי גנים — lncRNA", items: [...sec(rnLncrna), ...LNC_ANIMATIONS] },
    { titleHe: "RNA המבקר ביטוי גנים — piRNA", items: sec(rnPirna) },
    { titleHe: "RNA המבקר ביטוי גנים — snoRNA", items: sec(rnSnorna) },
    { titleHe: "RNA המבקר ביטוי גנים — tmRNA (פרשנות זמנית של \"RNATM\") ו-RNA בחיידקים", items: sec(rnBacterialRna) },
    { titleHe: "RNA כמרכיב תורשתי בעל השפעה בין-דורית", items: sec(rnInheritance) },
    { titleHe: "רענון מקורס הקדם: miRNA ו-siRNA", items: sec(gxNcrna) },
  ],
  lectures: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.items })),
  tutorials: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.practice })).filter((t) => t.items.length > 0),
};
