import type { CoursePlan, PlanItem, PlanSession } from "./types";
import type { Lesson } from "../lessons/types";
import { dgFoundations } from "../lessons/technion-drugs/dg-foundations";
import { dgPrinciples } from "../lessons/technion-drugs/dg-principles";
import { dgGleevec } from "../lessons/technion-drugs/dg-gleevec";
import { dgTargetedAntibodies } from "../lessons/technion-drugs/dg-targeted-antibodies";
import { dgDiversity } from "../lessons/technion-drugs/dg-diversity";
import { dgDisplay } from "../lessons/technion-drugs/dg-display";
import { dgAntibodies } from "../lessons/technion-drugs/dg-antibodies";
import { dgEvolution } from "../lessons/technion-drugs/dg-evolution";
import { dgCombinatorial } from "../lessons/technion-drugs/dg-combinatorial";
import { dgEngineeredTCells } from "../lessons/technion-drugs/dg-engineered-t-cells";
import { dgImmunotherapy } from "../lessons/technion-drugs/dg-immunotherapy";
import { dgPersonalized } from "../lessons/technion-drugs/dg-personalized";
import { dgTranslation } from "../lessons/technion-drugs/dg-translation";

// Scope first reviewed before writing (2026-10-25) from the portal topic paragraph, then rebuilt on
// 2026-11-01 against the course's own 2025 syllabus (syllabuses/_text/Syllabus Novel Biologicals 2025
// ENG/HEB.docx.txt), which lists eleven named topics. The 2025 list adds four subjects the first pass
// had wrongly excluded: Gleevec as a small-molecule case study, named targeted antibodies (Herceptin,
// Rituximab), engineered T cells and cancer immunotherapy, and the human genome / personalized medicine.
// The unit order below follows the order of that topic list; it is not a published weekly schedule.
// Moodle 2026: Yoram Reiter; closed to guests. Two credits, two lecture hours, no tutorials.
// Final assignment is a take-home paper, and attendance of 80% of lectures is mandatory — there is no exam.
// Methods named here (phage/yeast/ribosome display, DEL, humanization, FcRn, CAR generations) are
// representative examples and are marked "likely" in the scope file.
// Molecular genetics and immunology are prerequisites; only brief refreshers are included.
// Excluded: general pharmacology, the clinical-trial and regulatory pipeline, catalogues of gene therapies.
export const DRUGS_LESSONS: Lesson[] = [
  dgFoundations,
  dgPrinciples,
  dgGleevec,
  dgTargetedAntibodies,
  dgDiversity,
  dgDisplay,
  dgAntibodies,
  dgEvolution,
  dgCombinatorial,
  dgEngineeredTCells,
  dgImmunotherapy,
  dgPersonalized,
  dgTranslation,
];
const sec = (l: Lesson): PlanItem[] => [{ kind: "lesson", slug: l.slug }];
const session = (l: Lesson, i: number): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: sec(l) });

export const technionDrugsPlan: CoursePlan = {
  courseSlug: "technion-drugs",
  lectureOrder: {
    confidence: "syllabus",
    noteHe: "לפי סדר הנושאים בסילבוס הקורס לשנת 2025 (11 נושאים). לא פורסם לוח שבועי; 13 יחידות הלימוד כאן אינן 13 הרצאות רשמיות. יחידת הכימיה הקומבינטורית אינה אחד מ-11 הנושאים הנקובים אלא נשענת על פסקת התיאור (\"ביולוגיה וכימיה קומבינטורית\"), ולכן סעיפיה מסומנים \"כנראה\". השיטות המפורטות הן דוגמאות מייצגות ומסומנות לפי רמת הראיה.",
    links: [{ labelHe: "תיאור הקורס הרשמי, 136014", url: "https://students.technion.ac.il/local/technionsearch/course/136014" }],
  },
  tutorialOrder: null,
  schedule: "suggested",
  scheduleNoteHe: "2 נק״ז, 2 שעות הרצאה וללא תרגול רשמי. חובת נוכחות ב-80% מההרצאות, והמטלה הסופית היא עבודת בית — אין מבחן. התרגילים הפתורים כאן נכתבו לתרגול עצמי. אין רשימת ספרים רשמית בפורטל; ספרי הרקע והמאמרים בכל יחידה הם מקורות תומכים. אתר הקורס במודל סגור לאורחים.",
  topics: [
    { titleHe: "הרקע המדעי לפיתוח תרופות ביולוגיות ותגליות שהובילו להתפתחות התחום", items: sec(dgFoundations) },
    { titleHe: "מולקולה כימית קטנה לעומת מולקולות ביולוגיות", items: [...sec(dgFoundations), ...sec(dgPrinciples)] },
    { titleHe: "גליבק כדוגמה לפיתוח מולקולה כימית קטנה מכוונת מטרה", items: sec(dgGleevec) },
    { titleHe: "נוגדנים כדוגמה למולקולות ביולוגיות מכוונות מטרה (הרצפטין, ריטוקסימאב)", items: sec(dgTargetedAntibodies) },
    { titleHe: "בניית רפרטוארים גדולים במבחנה לבידוד מולקולות ביולוגיות", items: [...sec(dgDiversity), ...sec(dgDisplay)] },
    { titleHe: "הנדסת חלבונים", items: [...sec(dgAntibodies), ...sec(dgPrinciples)] },
    { titleHe: "אבולוציה מולקולרית במבחנה לשיפור והנדסת חלבונים", items: [...sec(dgEvolution), ...sec(dgCombinatorial)] },
    { titleHe: "הנדסה תאית ומניפולציות תאיות: ההיסטוריה והמהפכה בתאי T מהונדסים", items: sec(dgEngineeredTCells) },
    { titleHe: "אימונותרפיה של סרטן כמקרה מייצג של פעילות מולקולות ביולוגיות: אימונומודולציה", items: sec(dgImmunotherapy) },
    { titleHe: "הגנום האנושי ומהפכת הרפואה המותאמת אישית", items: sec(dgPersonalized) },
    { titleHe: "מעבר טכנולוגיה מהמעבדה למיטת החולה", items: sec(dgTranslation) },
  ],
  lectures: DRUGS_LESSONS.map(session),
  tutorials: DRUGS_LESSONS.map((l, i) => ({
    n: i + 1, titleHe: l.titleHe,
    items: (l.workedProblems ?? []).map(w => ({ kind: "lesson" as const, slug: l.slug, problem: w.id })),
  })),
};
