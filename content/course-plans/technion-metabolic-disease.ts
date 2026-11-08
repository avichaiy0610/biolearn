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
import { mdInbornErrors } from "../lessons/technion-metabolic-disease/md-inborn-errors";
import { mdEnergyMetabolism } from "../lessons/technion-metabolic-disease/md-energy-metabolism";
import { mdCalcium } from "../lessons/technion-metabolic-disease/md-calcium";
import { mdMasterRegulators } from "../lessons/technion-metabolic-disease/md-master-regulators";
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
// 2026-11-08: the lecturer's own syllabus (syllabuses/_text/Syllabus Metabolism and Human Disease.pdf.txt — 13 weeks,
// assessment = research-proposal final project 100%) and the 2024 slides in the Drive are now the main evidence. Added
// the four weeks the site lacked — inborn errors (9), energy metabolism (10), calcium (12), master regulators FGF-21 /
// mTOR / SIRT1 (13) — and satellite cells (week 2) in md-muscle-metabolism. Lectures follow the 13 weeks.
export const METABOLIC_DISEASE_LESSONS: Lesson[] = [mdCrosstalk, mdFedFasted, mdInsulinResistance, mdDiabetes, mdObesity,
  mdHyperlipidemia, mdMuscleMetabolism, mdAtrophyUps, mdAutophagy, mdWastingStates, mdInbornErrors, mdEnergyMetabolism,
  mdCalcium, mdMasterRegulators];

const sec = (l: Lesson, ...ids: string[]): PlanItem[] => (ids.length ? ids.map((section) => ({ kind: "lesson" as const, slug: l.slug, section })) : [{ kind: "lesson", slug: l.slug }]);
const probs = (l: Lesson): PlanItem[] => (l.workedProblems ?? []).map((w) => ({ kind: "lesson" as const, slug: l.slug, problem: w.id }));

const PORTAL = { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134147" };

// The lecturer's 13 weeks (2024 syllabus), in order; refreshers from the prerequisite courses sit before the unit that needs them.
const LECTURES: { titleHe: string; items: PlanItem[]; practice: PlanItem[] }[] = [
  { titleHe: "מבוא למטבוליזם: בקרה, שריר-כבד-שומן ומאגרי דלק", items: [...sec(metIntegration, "organs", "hormones"), ...sec(metGluconeogenesis, "cori"), ...sec(mdCrosstalk)], practice: probs(mdCrosstalk) },
  { titleHe: "שריר, כבד ושומן: איתות אינסולין, פעילות גופנית ותאי לוויין", items: [...sec(cellRtk, "pi3k"), ...sec(enPancreas, "insulin-actions"), ...sec(phSkeletalMuscle, "structure"), ...sec(metIntegration, "exercise"), ...sec(mdMuscleMetabolism, "fuels", "glucose-uptake", "synthesis", "satellite")], practice: probs(mdMuscleMetabolism) },
  { titleHe: "אטרופיה של שריר: פרוטאזום ואוטופגיה", items: [...sec(ubConjugation, "cascade"), ...sec(ubProteasome, "overview"), ...sec(mdMuscleMetabolism, "degradation", "why-mass"), ...sec(mdAtrophyUps), ...sec(cellGolgiEndosomes, "autophagy"), ...sec(ubLike, "autophagy"), ...sec(mdAutophagy)], practice: [...probs(mdAtrophyUps), ...probs(mdAutophagy)] },
  { titleHe: "אסטרטגיות טיפול חדשות בדלדול שריר", items: sec(mdWastingStates), practice: probs(mdWastingStates) },
  { titleHe: "צום ורעב: חמצון שומן וקטוזיס", items: [...sec(metIntegration, "fed-fasted", "starvation"), ...sec(metFattyAcids, "ketone-bodies"), ...sec(mdFedFasted)], practice: probs(mdFedFasted) },
  { titleHe: "סוכרת: תנגודת לאינסולין", items: [...sec(enPancreas, "secretion", "diabetes"), ...sec(mdInsulinResistance), ...sec(mdDiabetes, "types", "insulin-deficiency", "type-2", "beta-failure", "complications")], practice: probs(mdInsulinResistance) },
  { titleHe: "טיפול בסוכרת", items: sec(mdDiabetes, "treatments"), practice: probs(mdDiabetes) },
  { titleHe: "השמנת יתר", items: [...sec(metFattyAcids, "storage"), ...sec(mdObesity)], practice: probs(mdObesity) },
  { titleHe: "מחלות מטבוליות מולדות", items: sec(mdInbornErrors), practice: probs(mdInbornErrors) },
  { titleHe: "מטבוליזם אנרגטי ומאזן אנרגיה", items: sec(mdEnergyMetabolism), practice: probs(mdEnergyMetabolism) },
  { titleHe: "מטבוליזם של שומנים במחלה: כולסטרול וטרשת עורקים", items: [...sec(metLipidsCholesterol, "regulation", "lipoproteins"), ...sec(mdHyperlipidemia)], practice: probs(mdHyperlipidemia) },
  { titleHe: "מטבוליזם של סידן", items: sec(mdCalcium), practice: probs(mdCalcium) },
  { titleHe: "רגולטורים ראשיים: FGF-21, mTOR ו-SIRT1", items: sec(mdMasterRegulators), practice: probs(mdMasterRegulators) },
];

export const technionMetabolicDiseasePlan: CoursePlan = {
  courseSlug: "technion-metabolic-disease",
  lectureOrder: {
    confidence: "official-past",
    noteHe: "לפי לוח 13 השבועות בסילבוס של מרצת הקורס (פרופ' שנהב כהן): מבוא; שריר, כבד ושומן; אטרופיה; טיפולים חדשים בדלדול שריר; צום ורעב; סוכרת; טיפול בסוכרת; השמנה; מחלות מטבוליות מולדות; מטבוליזם אנרגטי; שומנים במחלה; סידן; ורגולטורים ראשיים. לפני חלק מהיחידות מקושרים סעיפי רענון מקורסי הקדם. הסילבוס אינו נושא שנה, ולכן ייתכנו שינויים בסמסטר הנוכחי.",
    links: [PORTAL],
  },
  tutorialOrder: null,
  schedule: "official",
  scheduleNoteHe: "ההרצאות לפי סילבוס המרצה. ספר הקורס: Biochemistry של Berg, Tymoczko ו-Stryer (מהדורה 7), ומאמרים. אין מבחן: הציון כולו על עבודה מסכמת — הצעת מחקר (שאלה, מבוא, ושלוש תת-שאלות עצמאיות עם ניסויים, תוצאות צפויות וחלופות). לכן ביחידות החדשות יש גם תרגיל בסגנון הצעת מחקר. אין תרגולים בקורס; תרגילי היחידות מוצגים כ\"תרגול על הרצאה n\".",
  topics: [
    { titleHe: "אינטראקציות מטבוליות בין שריר, כבד ורקמת שומן", items: [...sec(mdCrosstalk), ...sec(mdMuscleMetabolism)] },
    { titleHe: "מטבוליזם של סוכרים, שומנים וחלבונים בשובע וברעב", items: sec(mdFedFasted) },
    { titleHe: "סכרת", items: [...sec(mdInsulinResistance), ...sec(mdDiabetes)] },
    { titleHe: "השמנת יתר", items: sec(mdObesity) },
    { titleHe: "היפרליפידמיה", items: sec(mdHyperlipidemia) },
    { titleHe: "מנגנוני אטרופיה והיחלשות של שרירים", items: [...sec(mdAtrophyUps), ...sec(mdAutophagy), ...sec(mdWastingStates)] },
    { titleHe: "מחלות מטבוליות מולדות (סילבוס המרצה, שבוע 9)", items: sec(mdInbornErrors) },
    { titleHe: "מטבוליזם אנרגטי ומאזן אנרגיה (סילבוס המרצה, שבוע 10)", items: sec(mdEnergyMetabolism) },
    { titleHe: "מטבוליזם של סידן", items: sec(mdCalcium) },
    { titleHe: "רגולטורים ראשיים של המטבוליזם", items: sec(mdMasterRegulators) },
  ],
  lectures: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.items })),
  tutorials: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.practice })).filter((t) => t.items.length > 0),
};
