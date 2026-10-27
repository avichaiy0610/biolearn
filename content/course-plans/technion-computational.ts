import type { CoursePlan, PlanItem, PlanSession } from "./types";
import type { Lesson } from "../lessons/types";
import { cbThinking } from "../lessons/technion-computational/cb-thinking";
import { cbPython } from "../lessons/technion-computational/cb-python";
import { cbDataTables } from "../lessons/technion-computational/cb-data-tables";
import { cbSequences } from "../lessons/technion-computational/cb-sequences";
import { cbAlignment } from "../lessons/technion-computational/cb-alignment";
import { cbGraphs } from "../lessons/technion-computational/cb-graphs";
import { cbNetworks } from "../lessons/technion-computational/cb-networks";
import { cbClustering } from "../lessons/technion-computational/cb-clustering";
import { cbImages } from "../lessons/technion-computational/cb-images";
import { cbSegmentationTracking } from "../lessons/technion-computational/cb-segmentation-tracking";
import { cbDynamics } from "../lessons/technion-computational/cb-dynamics";
import { cbFeedback } from "../lessons/technion-computational/cb-feedback";
import { cbReview } from "../lessons/technion-computational/cb-review";
import { biPairwise } from "../lessons/technion-bioinformatics/bi-pairwise";
import { biBlast } from "../lessons/technion-bioinformatics/bi-blast";
import { biNetworks } from "../lessons/technion-bioinformatics/bi-networks";
import { biStatsExploration } from "../lessons/technion-bioinformatics/bi-stats-exploration";

// Technion 134141 "ביולוגיה חישובית" (Biology faculty elective, 2.5 credits = 2 lecture hours + 1 tutorial hour).
// Built with the course-track-builder skill, no insider input. Lecturer: Dr. Shay Stern (C. elegans behavioural
// individuality — long-term tracking and image analysis). Prerequisite: 134082 Molecular Biology; Python course 234128
// in parallel, so Python is taught from scratch. Evidence: the CURRENT portal paragraph only (five named topic families
// + "ועוד" + basic Python); no books, Moodle closed. Scope reviewed by Codex before writing (2026-10-26): 13 short units,
// one main algorithm each; data tables early (later units reuse them); two image units (worm tracking examples are a
// teaching choice, not extra syllabus); one feedback model; a review unit instead of a stochastic-methods unit.
// Refreshers from 136158 (bioinformatics) are linked for depth; bi-r-basics is NOT used (R, not Python).
export const COMPUTATIONAL_LESSONS: Lesson[] = [cbThinking, cbPython, cbDataTables, cbSequences, cbAlignment, cbGraphs,
  cbNetworks, cbClustering, cbImages, cbSegmentationTracking, cbDynamics, cbFeedback, cbReview];

const sec = (l: Lesson, ...ids: string[]): PlanItem[] => (ids.length ? ids.map((section) => ({ kind: "lesson" as const, slug: l.slug, section })) : [{ kind: "lesson", slug: l.slug }]);
const probs = (l: Lesson): PlanItem[] => (l.workedProblems ?? []).map((w) => ({ kind: "lesson" as const, slug: l.slug, problem: w.id }));

const PORTAL = { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134141" };

// Codex's recommended order; deeper refresher sections from the bioinformatics course sit after the local unit
const LECTURES: { titleHe: string; items: PlanItem[]; practice: PlanItem[] }[] = [
  { titleHe: "חשיבה חישובית: מבעיה לאלגוריתם", items: sec(cbThinking), practice: probs(cbThinking) },
  { titleHe: "פייתון לביולוגים", items: sec(cbPython), practice: probs(cbPython) },
  { titleHe: "טבלאות נתונים, גרפים, מיון וחיפוש", items: sec(cbDataTables), practice: probs(cbDataTables) },
  { titleHe: "ניתוח רצפים: מחרוזות, תבניות ו-k-mers", items: sec(cbSequences), practice: probs(cbSequences) },
  { titleHe: "יישור רצפים וחיפוש מהיר", items: [...sec(cbAlignment), ...sec(biPairwise, "matrices", "gaps", "global-local"), ...sec(biBlast, "how", "scores")], practice: probs(cbAlignment) },
  { titleHe: "גרפים: ייצוג ומעבר על רשתות", items: sec(cbGraphs), practice: probs(cbGraphs) },
  { titleHe: "ניתוח רשתות ביולוגיות", items: [...sec(cbNetworks), ...sec(biNetworks, "evidence", "hubs-modules")], practice: probs(cbNetworks) },
  { titleHe: "מרחקים ואשכולות", items: [...sec(cbClustering), ...sec(biStatsExploration, "pca", "clustering")], practice: probs(cbClustering) },
  { titleHe: "עיבוד תמונה: מטריצות, סף וסינון", items: sec(cbImages), practice: probs(cbImages) },
  { titleHe: "סגמנטציה, מדידה ומעקב", items: sec(cbSegmentationTracking), practice: probs(cbSegmentationTracking) },
  { titleHe: "מודלים דינמיים וסימולציה", items: sec(cbDynamics), practice: probs(cbDynamics) },
  { titleHe: "משוב, יציבות ותיקוף מודלים", items: sec(cbFeedback), practice: probs(cbFeedback) },
  { titleHe: "יישום משולב וסיכום", items: sec(cbReview), practice: probs(cbReview) },
];

export const technionComputationalPlan: CoursePlan = {
  courseSlug: "technion-computational",
  lectureOrder: {
    confidence: "suggested",
    noteHe: "אין לוח הרצאות ציבורי לקורס (אתר הקורס במודל סגור לאורחים), ובתיאור בפורטל יש רק חמש משפחות נושאים ופייתון בסיסי. הסדר כאן הוא סדר לימוד שבנינו: קודם פייתון וטבלאות נתונים (כי כל השאר משתמש בהם), אחר כך רצפים, רשתות, אשכולות, תמונות וסימולציה, ובסוף יחידת סיכום. האלגוריתמים שנבחרו לכל נושא הם בחירה שלנו, לא נושאים שאושרו. אחרי חלק מהיחידות מקושרים סעיפי העמקה מקורס הביואינפורמטיקה.",
    links: [PORTAL],
  },
  tutorialOrder: null,
  schedule: "suggested",
  scheduleNoteHe: "הנושאים לפי תיאור הקורס בפורטל הטכניון (2.5 נקודות זכות: 2 שעות הרצאה ושעת תרגול). בפורטל לא רשומים ספרים, ואין לוח תרגולים ציבורי — התרגילים הפתורים ביחידות מוצגים כ\"תרגול על הרצאה n\". דוגמאות הקוד בפייתון, וכולן הורצו.",
  topics: [
    { titleHe: "רעיונות ומושגים מרכזיים ממדעי המחשב", items: [...sec(cbThinking), ...sec(cbReview)] },
    { titleHe: "שיעורי בסיס בשפת התכנות פייתון", items: sec(cbPython) },
    { titleHe: "ניתוח רשימות נתונים", items: [...sec(cbDataTables), ...sec(cbClustering)] },
    { titleHe: "אנליזת רצפים ביולוגיים", items: [...sec(cbSequences), ...sec(cbAlignment)] },
    { titleHe: "אלגוריתמים ברשתות ביולוגיות", items: [...sec(cbGraphs), ...sec(cbNetworks)] },
    { titleHe: "עיבוד תמונות ביולוגיות", items: [...sec(cbImages), ...sec(cbSegmentationTracking)] },
    { titleHe: "סימולציה של מערכות דינמיות", items: [...sec(cbDynamics), ...sec(cbFeedback)] },
  ],
  lectures: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.items })),
  tutorials: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.practice })).filter((t) => t.items.length > 0),
};
