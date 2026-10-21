import type { CoursePlan, PlanItem, PlanSession } from "./types";
import type { Lesson } from "../lessons/types";
import { gxOperons } from "../lessons/technion-gene-expression/gx-operons";
import { gxCisElements } from "../lessons/technion-gene-expression/gx-cis-elements";
import { gxTranscriptionFactors } from "../lessons/technion-gene-expression/gx-transcription-factors";
import { gxChromatinModifications } from "../lessons/technion-gene-expression/gx-chromatin-modifications";
import { gxEpigenetics } from "../lessons/technion-gene-expression/gx-epigenetics";
import { gxAlternativeSplicing } from "../lessons/technion-gene-expression/gx-alternative-splicing";
import { gxTranslationControl } from "../lessons/technion-gene-expression/gx-translation-control";
import { gxNcrna } from "../lessons/technion-gene-expression/gx-ncrna";
import { gxGenomeStructure } from "../lessons/technion-gene-expression/gx-genome-structure";
import { gxGeneFamilies } from "../lessons/technion-gene-expression/gx-gene-families";
import { gxRepeatsMobile } from "../lessons/technion-gene-expression/gx-repeats-mobile";
import { gxGenomeWide } from "../lessons/technion-gene-expression/gx-genome-wide";
import { gxIntegration } from "../lessons/technion-gene-expression/gx-integration";

// Technion 01340119 "בקרת הביטוי הגנטי" — built with the course-track-builder skill, no insider input.
// Topics: the CURRENT syllabus on the Technion students portal (topics only, no weeks), in its own order.
// Lecture order: no public schedule (Moodle is closed to guests; lecturer: Prof. Yael Mandel-Gutfreund) — the
// syllabus order. The Faculty of Medicine's course 274243 (a "no extra credit" pair of BOTH 134082 and 134119)
// publishes a weekly table whose regulation part runs prokaryotic → eukaryotic transcription → RNA processing →
// translation control → post-translational control — a different course; evidence only.
// Tutorials: no source — "practice for lecture n", built from each unit's worked problems.

const M = "molecular-biology";
const proc = (slug: string, topic = M): PlanItem => ({ kind: "process", topic, slug });
const sec = (l: Lesson, ...ids: string[]): PlanItem[] => (ids.length ? ids.map((section) => ({ kind: "lesson" as const, slug: l.slug, section })) : [{ kind: "lesson", slug: l.slug }]);
const probs = (l: Lesson, ...ids: string[]): PlanItem[] =>
  (l.workedProblems ?? []).filter((w) => !ids.length || ids.includes(w.id)).map((w) => ({ kind: "lesson" as const, slug: l.slug, problem: w.id }));

// Riboswitches are left out of this course: they belong to "העולם המודרני של הרנ\"א" (134151), whose syllabus
// names RNA as a gene-expression regulator and ribozymes. The section stays in the unit, marked as extension.
const NCRNA = sec(gxNcrna, "classes", "bacteria", "mirna", "sirna", "rnai-heterochromatin", "lncrna");
const PORTAL = { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134119" };
const MED = { labelHe: "הקורס המקביל ברפואה (274243) — ראיה בלבד", url: "https://md.technion.ac.il/wp-content/uploads/2024/05/סיליבוס-מנגנוני-בקרה-מולקולרית-274243-חורף-תשפד-12-שבועות.pdf" };

const LECTURES: { titleHe: string; items: PlanItem[]; practice: PlanItem[] }[] = [
  { titleHe: "בקרה בחיידקים: אופרונים, lac ו-trp", items: [...sec(gxOperons), proc("lac-operon")], practice: probs(gxOperons) },
  { titleHe: "אלמנטים רגולטוריים בציס: מגבירים ומבודדים", items: sec(gxCisElements), practice: probs(gxCisElements) },
  { titleHe: "גורמי שעתוק", items: sec(gxTranscriptionFactors), practice: probs(gxTranscriptionFactors) },
  { titleHe: "שינויים בכרומטין ומתילציה של DNA", items: sec(gxChromatinModifications), practice: probs(gxChromatinModifications) },
  { titleHe: "אפיגנטיקה: הטרוכרומטין, Polycomb, השבתת X והחתמה", items: [...sec(gxEpigenetics), proc("genomic-imprinting", "genetics")], practice: probs(gxEpigenetics) },
  { titleHe: "שחבור חלופי ועריכת RNA", items: sec(gxAlternativeSplicing), practice: probs(gxAlternativeSplicing) },
  { titleHe: "בקרת תרגום ויציבות mRNA", items: sec(gxTranslationControl), practice: probs(gxTranslationControl) },
  { titleHe: "בקרה על ידי RNA לא מקודד", items: NCRNA, practice: probs(gxNcrna, "mirna-reporter") },
  { titleHe: "מבנה הגנום", items: sec(gxGenomeStructure), practice: probs(gxGenomeStructure) },
  { titleHe: "ביטוי מתואם: משפחות גנים וצבירים", items: sec(gxGeneFamilies), practice: probs(gxGeneFamilies) },
  { titleHe: "רצפים חוזרים ורצפים ניידים", items: sec(gxRepeatsMobile), practice: probs(gxRepeatsMobile) },
  { titleHe: "בקרה כלל-גנומית", items: sec(gxGenomeWide), practice: probs(gxGenomeWide) },
  { titleHe: "אינטגרציה בין מערכות בקרה ופנוטיפ", items: sec(gxIntegration), practice: probs(gxIntegration) },
];

export const technionGeneExpressionPlan: CoursePlan = {
  courseSlug: "technion-gene-expression",
  lectureOrder: {
    confidence: "syllabus",
    noteHe: "אין לוח הרצאות ציבורי לקורס (אתר הקורס במודל סגור). הסדר כאן הוא סדר הנושאים בסילבוס הרשמי: בקרת שעתוק (בחיידקים ובאאוקריוטים), כרומטין, שחבור חלופי, תרגום, RNA לא מקודד, ואחר כך מבנה הגנום ובקרה כלל-גנומית. הקורס בפקולטה לרפואה (274243), שמחליף גם את 134082 וגם את הקורס הזה, מפרסם טבלה שבועית שבה הבקרה מסודרת באותו כיוון (שעתוק → עיבוד RNA → תרגום) — אבל זה קורס אחר, ראיה בלבד. החלוקה לשבועות בפועל עשויה להיות שונה.",
    links: [PORTAL, MED],
  },
  tutorialOrder: null,
  schedule: "suggested",
  scheduleNoteHe: "הנושאים לפי הסילבוס העדכני של הקורס בפורטל הטכניון (הוא מפרט נושאים, לא שבועות). הפירוט לתת-נושאים לפי ספרי הקורס — Lewin's Genes XII ו-Genomes 4 (Brown).",
  topics: [
    { titleHe: "בקרת הביטוי הגנטי בתאים פרוקריטים ואאוקריוטים: בקרת תעתוק-אלמנטים רגולטורים בציס", items: [...sec(gxOperons), ...sec(gxCisElements), proc("lac-operon")] },
    { titleHe: "פקטורי תעתוק", items: sec(gxTranscriptionFactors) },
    { titleHe: "מודיפיקציות בכרומטין", items: [...sec(gxChromatinModifications), ...sec(gxEpigenetics, "definition", "heterochromatin", "polycomb", "inheritance")] },
    { titleHe: "שחבור חלופי", items: sec(gxAlternativeSplicing) },
    { titleHe: "בקרת תרגום", items: sec(gxTranslationControl) },
    { titleHe: "בקרה על ידי רנ\"א לא מקודד", items: NCRNA },
    { titleHe: "מבנה הגנום", items: sec(gxGenomeStructure) },
    { titleHe: "ביטוי מתואם של משפחות וסוגי גנים", items: sec(gxGeneFamilies) },
    { titleHe: "רצפים חוזרים ורצפים ניידים ותפקידם בבקרת הביטוי הגנטי", items: sec(gxRepeatsMobile) },
    { titleHe: "בקרה כלל-גנומית", items: [...sec(gxGenomeWide), ...sec(gxEpigenetics, "x-inactivation", "imprinting"), proc("genomic-imprinting", "genetics")] },
    { titleHe: "אינטגרציה בין מערכות בקרה והמשמעות הפנוטיפית שלה", items: sec(gxIntegration) },
  ],
  lectures: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.items })),
  tutorials: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.practice })).filter((t) => t.items.length > 0),
};
