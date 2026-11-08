import type { CoursePlan, PlanItem, PlanSession } from "./types";
import type { Lesson } from "../lessons/types";
import { gxOperons } from "../lessons/technion-gene-expression/gx-operons";
import { gxExpressionData } from "../lessons/technion-gene-expression/gx-expression-data";
import { gxCisElements } from "../lessons/technion-gene-expression/gx-cis-elements";
import { gxTranscriptionFactors } from "../lessons/technion-gene-expression/gx-transcription-factors";
import { gxGenomicTracks } from "../lessons/technion-gene-expression/gx-genomic-tracks";
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

import { gxCrisprTools } from "../lessons/technion-gene-expression/gx-crispr-tools";
// Technion 01340119 "בקרת הביטוי הגנטי" — built with the course-track-builder skill, no insider input.
// Lecture AND tutorial order (rebuilt 2026-11-07): the course's own 2024 schedule (Prof. Yael Mandel-Gutfreund),
// syllabuses/_text/סילבוס בקרת הביטוי הגנטי 2024.docx.txt — 12 weeks, each with a lecture topic and a tutorial topic.
// Topics view: the official topic list on the Technion students portal, in its own order (it is broader than the 2024
// schedule: genome structure, gene families, genome-wide control and integration are portal topics only).
// Bacterial operons: not in the 2024 schedule and in no exam since 2016 → "extension" (scope file); kept in the topics
// view only, off the lecture/tutorial sequence.
// Week 10 "Gene editing: siRNA, CRISPR/Cas9": the CRISPR unit is written in a separate session (parked in
// ../parked/134119-crispr) and added here when done; until then the week holds the siRNA section only.
// Exams are research scenarios read from figures (moed A 2022, moed B 2021) — hence the two data-reading units.

const M = "molecular-biology";
const proc = (slug: string, topic = M): PlanItem => ({ kind: "process", topic, slug });
const sec = (l: Lesson, ...ids: string[]): PlanItem[] => (ids.length ? ids.map((section) => ({ kind: "lesson" as const, slug: l.slug, section })) : [{ kind: "lesson", slug: l.slug }]);
const probs = (l: Lesson, ...ids: string[]): PlanItem[] =>
  (l.workedProblems ?? []).filter((w) => !ids.length || ids.includes(w.id)).map((w) => ({ kind: "lesson" as const, slug: l.slug, problem: w.id }));

const PORTAL = { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134119" };

const LECTURES: PlanSession[] = [
  { n: 1, titleHe: "הקדמה לבקרת ביטוי גנים", items: [...sec(gxCisElements, "layout"), ...sec(gxExpressionData)] },
  { n: 2, titleHe: "עקרונות ההכרה המולקולרית בין חלבונים לדנ\"א", items: sec(gxTranscriptionFactors, "modular", "motifs", "recognition") },
  { n: 3, titleHe: "בקרת שעתוק", items: [...sec(gxCisElements, "enhancers", "insulators", "response-elements", "methods"), ...sec(gxTranscriptionFactors, "activators", "repressors", "regulation", "gal")] },
  { n: 4, titleHe: "בקרת שעתוק קומבינטורית", items: [...sec(gxTranscriptionFactors, "combinatorial", "fly-eve"), ...sec(gxIntegration, "drosophila")] },
  { n: 5, titleHe: "אפיגנטיקה: ארגון הכרומטין", items: [...sec(gxChromatinModifications, "barrier", "remodeling", "marks", "readers"), ...sec(gxEpigenetics, "definition", "heterochromatin", "polycomb"), ...sec(gxGenomeWide, "nucleus", "tads")] },
  { n: 6, titleHe: "אפיגנטיקה: מודיפיקציות של דנ\"א", items: [...sec(gxChromatinModifications, "dna-methylation", "crosstalk"), ...sec(gxEpigenetics, "inheritance", "x-inactivation", "imprinting"), proc("genomic-imprinting", "genetics")] },
  { n: 7, titleHe: "בקרת שחבור חלופי", items: sec(gxAlternativeSplicing, "types", "regulation", "kinetic-coupling", "drosophila", "examples") },
  { n: 8, titleHe: "בקרת שחבור חלופי ו-NMD", items: [...sec(gxAlternativeSplicing, "nmd-disease"), ...sec(gxTranslationControl, "decay")] },
  { n: 9, titleHe: "miRNA ובקרת תרגום", items: [...sec(gxNcrna, "classes", "mirna"), ...sec(gxTranslationControl, "why", "global", "uorf", "iron", "ires", "localization")] },
  { n: 10, titleHe: "עריכת גנים: siRNA ו-CRISPR/Cas9", items: [...sec(gxNcrna, "sirna"), ...sec(gxCrisprTools)] },
  { n: 11, titleHe: "אבולוציה של בקרת הביטוי: טרנספוזונים", items: sec(gxRepeatsMobile) },
  {
    n: 12, titleHe: "סימולציה לבחינה",
    items: [
      ...probs(gxAlternativeSplicing, "pol2-chip"), ...probs(gxGenomicTracks, "motif-spacing", "browser-read"),
      ...probs(gxExpressionData, "volcano-read", "exon-primers-nmd"), ...probs(gxTranscriptionFactors, "stripe2-reporter"),
    ],
  },
];

const TUTORIALS: PlanSession[] = [
  { n: 1, titleHe: "RT ו-Real time PCR", items: [...sec(gxExpressionData, "rt", "qpcr", "ddct", "primers"), ...probs(gxExpressionData, "ddct-calc")] },
  { n: 2, titleHe: "הכרה בין חלבון ל-DNA", items: [...sec(gxTranscriptionFactors, "recognition"), ...probs(gxTranscriptionFactors, "egr1-affinity", "two-hybrid")] },
  { n: 3, titleHe: "ChIP-seq, Genome Browser ו-MEME", items: [...sec(gxGenomicTracks), ...probs(gxGenomicTracks), ...probs(gxCisElements)] },
  { n: 4, titleHe: "הזבוב כמודל לבקרת שעתוק", items: [...sec(gxTranscriptionFactors, "fly-eve"), ...probs(gxTranscriptionFactors, "stripe2-reporter", "gal-mutants")] },
  { n: 5, titleHe: "מודיפיקציות על הכרומטין", items: [...probs(gxChromatinModifications, "marks-predict"), ...probs(gxEpigenetics, "pev-genetics")] },
  { n: 6, titleHe: "מתילציה של דנ\"א", items: [...probs(gxChromatinModifications, "methylation-inheritance"), ...sec(gxExpressionData, "volcano"), ...probs(gxExpressionData, "volcano-read"), ...probs(gxEpigenetics, "x-inactivation-cases")] },
  { n: 7, titleHe: "שחבור חלופי", items: [...sec(gxExpressionData, "rna-seq"), ...probs(gxAlternativeSplicing, "minigene", "sex-cascade", "pol2-chip")] },
  { n: 8, titleHe: "NMD", items: [...sec(gxExpressionData, "turnover"), ...probs(gxExpressionData, "exon-primers-nmd", "new-total-scatter")] },
  { n: 9, titleHe: "מאמר RNAi", items: [...probs(gxNcrna, "mirna-reporter", "processing-mutants"), ...probs(gxTranslationControl)] },
  { n: 10, titleHe: "שיטות מתקדמות להשתקת גנים: siRNA ו-CRISPR/Cas9", items: [...sec(gxNcrna, "sirna"), ...sec(gxCrisprTools)] },
  { n: 11, titleHe: "טרנספוזונים", items: probs(gxRepeatsMobile) },
];

export const technionGeneExpressionPlan: CoursePlan = {
  courseSlug: "technion-gene-expression",
  lectureOrder: {
    confidence: "official-past",
    noteHe: "לפי לוח ההרצאות של הקורס מסמסטר אביב 2024 (פרופ' יעל מנדל-גוטפרוינד): 12 שבועות — הקדמה, הכרה בין חלבון ל-DNA, בקרת שעתוק, בקרה קומבינטורית, שני שבועות אפיגנטיקה (כרומטין ומתילציה של DNA), שני שבועות שחבור חלופי (כולל NMD), miRNA ובקרת תרגום, עריכת גנים, טרנספוזונים, וסימולציה לבחינה. היחידה על CRISPR (שבוע 10) תתווסף בהמשך. בסמסטר הנוכחי ייתכנו שינויים.",
    links: [PORTAL],
  },
  tutorialOrder: {
    confidence: "official-past",
    noteHe: "לוח 2024 מפרט גם את נושא התרגול בכל שבוע: RT ו-Real time PCR, הכרה בין חלבון ל-DNA, ChIP-seq + Genome Browser + MEME, הזבוב כמודל, מודיפיקציות על הכרומטין, מתילציה של DNA, שחבור חלופי, NMD, מאמר על RNAi, siRNA ו-CRISPR, וטרנספוזונים. התרגילים כאן בנויים בסגנון המבחנים — תרחישי מחקר שנקראים מתוך נתונים.",
    links: [PORTAL],
  },
  schedule: "official",
  scheduleNoteHe: "ההרצאות והתרגולים לפי לוח הקורס מ-2024. רשימת הנושאים לפי הסילבוס בפורטל, שהוא רחב יותר (מבנה הגנום, משפחות גנים, בקרה כלל-גנומית ואינטגרציה מופיעים בפורטל אך לא בלוח 2024). בקרה בחיידקים (אופרונים) לא מופיעה בלוח 2024 ולא נשאלה במבחנים מאז 2016 — היא מסומנת כהרחבה. המבחן: 3 שעות, שלוש שאלות גדולות, מותר דף עזר בכתב יד.",
  topics: [
    { titleHe: "בקרת הביטוי הגנטי בתאים פרוקריטים ואאוקריוטים: בקרת תעתוק-אלמנטים רגולטורים בציס", items: [...sec(gxCisElements), ...sec(gxGenomicTracks), ...sec(gxOperons), proc("lac-operon")] },
    { titleHe: "פקטורי תעתוק", items: sec(gxTranscriptionFactors) },
    { titleHe: "מודיפיקציות בכרומטין", items: [...sec(gxChromatinModifications), ...sec(gxEpigenetics, "definition", "heterochromatin", "polycomb", "inheritance")] },
    { titleHe: "שחבור חלופי", items: sec(gxAlternativeSplicing) },
    { titleHe: "בקרת תרגום", items: sec(gxTranslationControl) },
    { titleHe: "בקרה על ידי רנ\"א לא מקודד", items: sec(gxNcrna) },
    { titleHe: "מבנה הגנום", items: sec(gxGenomeStructure) },
    { titleHe: "ביטוי מתואם של משפחות וסוגי גנים", items: sec(gxGeneFamilies) },
    { titleHe: "רצפים חוזרים ורצפים ניידים ותפקידם בבקרת הביטוי הגנטי", items: sec(gxRepeatsMobile) },
    { titleHe: "בקרה כלל-גנומית", items: [...sec(gxGenomeWide), ...sec(gxExpressionData), ...sec(gxEpigenetics, "x-inactivation", "imprinting"), proc("genomic-imprinting", "genetics")] },
    { titleHe: "אינטגרציה בין מערכות בקרה והמשמעות הפנוטיפית שלה", items: sec(gxIntegration) },
  ],
  lectures: LECTURES,
  tutorials: TUTORIALS,
};
