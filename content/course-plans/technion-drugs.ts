import type { CoursePlan, PlanItem, PlanSession } from "./types";
import type { Lesson } from "../lessons/types";
import { dgPrinciples } from "../lessons/technion-drugs/dg-principles";
import { dgDiversity } from "../lessons/technion-drugs/dg-diversity";
import { dgDisplay } from "../lessons/technion-drugs/dg-display";
import { dgEvolution } from "../lessons/technion-drugs/dg-evolution";
import { dgAntibodies } from "../lessons/technion-drugs/dg-antibodies";
import { dgCombinatorial } from "../lessons/technion-drugs/dg-combinatorial";
import { dgTranslation } from "../lessons/technion-drugs/dg-translation";

// Scope reviewed independently before writing (2026-10-25), using course-track-builder.
// Official 136014: molecular genetics, protein engineering, combinatorial biology/chemistry,
// molecular diversity in vitro, protein function, therapeutic and diagnostic agents.
// No public weekly schedule, official book list, or extra-credit course pair found.
// Moodle 2026: Yoram Reiter; closed to guests. Two credits, two lecture hours, no tutorials.
// Representative methods (phage/yeast/ribosome display, DEL, humanization, FcRn) are "likely".
// These are seven study units, not a claim of seven official lectures. Principles of molecular
// genetics and immunology are prerequisites; only brief refreshers are included.
// Excluded: general pharmacology, clinical-trial/regulatory pipeline, CAR-T/gene-therapy catalogues.
// Independent comparison: UCLouvain LBBMC2105 and VUB Protein Engineering, used to calibrate
// method breadth only, not as evidence of what Reiter teaches. Books support background only.
export const DRUGS_LESSONS: Lesson[] = [dgPrinciples, dgDiversity, dgDisplay, dgEvolution, dgAntibodies, dgCombinatorial, dgTranslation];
const sec = (l: Lesson): PlanItem[] => [{ kind: "lesson", slug: l.slug }];
const session = (l: Lesson, i: number): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: sec(l) });

export const technionDrugsPlan: CoursePlan = {
  courseSlug: "technion-drugs",
  lectureOrder: {
    confidence: "syllabus",
    noteHe: "חלוקה פדגוגית מוצעת לפי נושאי תיאור הקורס בפורטל. לא נמצא לוח שבועי ציבורי; שבע יחידות הלימוד כאן אינן שבע הרצאות רשמיות. השיטות המפורטות הן דוגמאות מייצגות ומסומנות לפי רמת הראיה.",
    links: [{ labelHe: "תיאור הקורס הרשמי, 136014", url: "https://students.technion.ac.il/local/technionsearch/course/136014" }],
  },
  tutorialOrder: null,
  schedule: "suggested",
  scheduleNoteHe: "2 נק״ז, 2 שעות הרצאה וללא תרגול רשמי. התרגילים הפתורים נכתבו לתרגול עצמי. אין רשימת ספרים רשמית בפורטל; ספרי הרקע והמאמרים בכל יחידה הם מקורות תומכים. אתר הקורס במודל סגור לאורחים.",
  topics: [
    { titleHe: "היבטים חדשניים בביולוגיה מולקולרית ויישומם לפיתוחים ביוטכנולוגיים", items: sec(dgPrinciples) },
    { titleHe: "התפתחויות בתחומי הגנטיקה המולקולרית", items: [...sec(dgDiversity), ...sec(dgEvolution)] },
    { titleHe: "הנדסת חלבונים", items: [...sec(dgEvolution), ...sec(dgAntibodies)] },
    { titleHe: "ביולוגיה וכימיה קומבינטורית", items: [...sec(dgDisplay), ...sec(dgCombinatorial)] },
    { titleHe: "שונות מולקולרית במערכות ביולוגיות והדרך לחיקוי השונות במבחנה", items: [...sec(dgDiversity), ...sec(dgEvolution)] },
    { titleHe: "ביולוגיה קומבינטורית וביוטכנולוגיה מולקולרית כאמצעי לפיענוח פעילות חלבונים", items: [...sec(dgPrinciples), ...sec(dgDisplay), ...sec(dgEvolution)] },
    { titleHe: "חומרים חדשים בעלי פוטנציאל רפואי ושיטות דיאגנוסטיקה חדשניות", items: [...sec(dgAntibodies), ...sec(dgCombinatorial), ...sec(dgTranslation)] },
  ],
  lectures: DRUGS_LESSONS.map(session),
  tutorials: DRUGS_LESSONS.map((l, i) => ({
    n: i + 1, titleHe: l.titleHe,
    items: (l.workedProblems ?? []).map(w => ({ kind: "lesson" as const, slug: l.slug, problem: w.id })),
  })),
};
