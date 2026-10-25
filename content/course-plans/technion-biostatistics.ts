import type { CoursePlan, PlanItem, PlanSession } from "./types";
import type { Lesson } from "../lessons/types";
import { bsDescribingData } from "../lessons/technion-biostatistics/bs-describing-data";
import { bsCenterSpread } from "../lessons/technion-biostatistics/bs-center-spread";
import { bsProbability } from "../lessons/technion-biostatistics/bs-probability";
import { bsRandomVariables } from "../lessons/technion-biostatistics/bs-random-variables";
import { bsNormalClt } from "../lessons/technion-biostatistics/bs-normal-clt";
import { bsConfidenceIntervals } from "../lessons/technion-biostatistics/bs-confidence-intervals";
import { bsHypothesisTesting } from "../lessons/technion-biostatistics/bs-hypothesis-testing";
import { bsTwoMeans } from "../lessons/technion-biostatistics/bs-two-means";
import { bsCategorical } from "../lessons/technion-biostatistics/bs-categorical";
import { bsCorrelation } from "../lessons/technion-biostatistics/bs-correlation";
import { bsRegression } from "../lessons/technion-biostatistics/bs-regression";
import { bsAnova } from "../lessons/technion-biostatistics/bs-anova";
import { mendelProbability } from "../lessons/technion-genetics/mendel-probability";

// Technion 01340154 "ביוסטטיסטיקה לביולוגים" (Biology faculty, 2.5 points: 2h lecture + 1h tutorial, winter, final
// exam, SPSS) — built with the course-track-builder skill, no insider input. Staff (Moodle guest view): Dr. Naama Wolf
// (2025–2027), Ilan Livne (2026–2027), TAs Mohammad Makhzumi (2026) and Yonatan Yerushalmi (2027). Moodle is closed to
// guests; no detailed syllabus, schedule or past exam was found (searched 2026-10-25).
// Evidence: the CURRENT portal paragraph (ten named topics + SPSS). Parallel evidence only: medicine 274182 spring 2023
// (Kaplan/Yizhak, 13-week table) — a different course; its extra topics (logistic regression, survival analysis,
// non-parametric tests, integrative analysis) are NOT written, and its order is not used as this course's order.
// Scope reviewed by Codex before writing (2026-10-25): 12 units. Normal distribution / CLT is a supporting unit (the
// portal's confidence intervals and tests rest on it). Optional items kept short and marked in the units: CV,
// sensitivity/specificity vocabulary, normal approximation to the binomial, sample size, Fisher's exact test, RR/OR,
// Spearman, Welch df, one Tukey/Bonferroni example.
// Order: the portal lists topics, not lectures, and puts probability last. The lectures below are OUR learning order
// (description → probability → distributions → estimation → tests → relationships → ANOVA), labelled "suggested".
// The topics view keeps the portal's own order.

const sec = (l: Lesson, ...ids: string[]): PlanItem[] => (ids.length ? ids.map((section) => ({ kind: "lesson" as const, slug: l.slug, section })) : [{ kind: "lesson", slug: l.slug }]);
const probs = (l: Lesson): PlanItem[] => (l.workedProblems ?? []).map((w) => ({ kind: "lesson" as const, slug: l.slug, problem: w.id }));

const PORTAL = { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134154" };

export const BIOSTATISTICS_LESSONS: Lesson[] = [bsDescribingData, bsCenterSpread, bsProbability, bsRandomVariables, bsNormalClt, bsConfidenceIntervals, bsHypothesisTesting, bsTwoMeans, bsCategorical, bsCorrelation, bsRegression, bsAnova];

const LECTURES: { titleHe: string; items: PlanItem[]; practice: PlanItem[] }[] = [
  { titleHe: "תיאור נתונים: משתנים, טבלאות ותרשימים", items: sec(bsDescribingData), practice: probs(bsDescribingData) },
  { titleHe: "מדדי מרכז ופיזור", items: sec(bsCenterSpread), practice: probs(bsCenterSpread) },
  { titleHe: "הסתברות והסתברות מותנית", items: [...sec(mendelProbability, "probability"), ...sec(bsProbability)], practice: probs(bsProbability) },
  { titleHe: "משתנים מקריים והתפלגות בינומית", items: sec(bsRandomVariables), practice: probs(bsRandomVariables) },
  { titleHe: "ההתפלגות הנורמלית ומשפט הגבול המרכזי", items: sec(bsNormalClt), practice: probs(bsNormalClt) },
  { titleHe: "אמידה ורווחי סמך", items: sec(bsConfidenceIntervals), practice: probs(bsConfidenceIntervals) },
  { titleHe: "מבחני השערות", items: sec(bsHypothesisTesting), practice: probs(bsHypothesisTesting) },
  { titleHe: "השוואת שתי תוחלות", items: sec(bsTwoMeans), practice: probs(bsTwoMeans) },
  { titleHe: "משתנים קטגוריים ומבחן χ²", items: [...sec(bsCategorical), ...sec(mendelProbability, "chi-square")], practice: probs(bsCategorical) },
  { titleHe: "מתאם", items: sec(bsCorrelation), practice: probs(bsCorrelation) },
  { titleHe: "רגרסיה ליניארית", items: sec(bsRegression), practice: probs(bsRegression) },
  { titleHe: "ניתוח שונות חד-גורמי", items: sec(bsAnova), practice: probs(bsAnova) },
];

export const technionBiostatisticsPlan: CoursePlan = {
  courseSlug: "technion-biostatistics",
  lectureOrder: {
    confidence: "suggested",
    noteHe: "סדר ההרצאות בקורס לא פורסם (אתר הקורס במודל סגור ולא נמצא סילבוס מפורט). בפורטל רשימת נושאים בלבד, שבה ההסתברות מופיעה בסוף. הסדר כאן הוא סדר לימוד שבחרנו: תיאור נתונים ← הסתברות והתפלגויות ← אמידה ומבחנים ← קשרים בין משתנים ← ניתוח שונות. בלשונית \"לפי נושאים\" נשמר הסדר של הפורטל.",
    links: [PORTAL],
  },
  tutorialOrder: null,
  schedule: "suggested",
  scheduleNoteHe: "הנושאים לפי תיאור הקורס בפורטל הטכניון (2.5 נקודות: 2 שעות הרצאה ושעת תרגול, מבחן מסכם, עבודה ב-SPSS). הפירוט לפי הספרים ברשימת הקורס (Bland, Zar). רגרסיה לוגיסטית, ניתוח הישרדות ומבחנים א-פרמטריים — שנלמדים בקורס המקביל ברפואה — לא נכתבו, כי הם לא מופיעים בתיאור הקורס. התרגילים הפתורים כאן לתרגול עצמי; סדר התרגולים בקורס לא פורסם.",
  topics: [
    { titleHe: "תיאור נתונים באופן גרפי", items: sec(bsDescribingData) },
    { titleHe: "חישוב מדדי מרכז ופיזור", items: sec(bsCenterSpread) },
    { titleHe: "מבחני השערה סטטיסטיים", items: [...sec(bsHypothesisTesting), ...sec(bsTwoMeans)] },
    { titleHe: "אמידת פרמטרים לא ידועים באוכלוסייה באמצעות רווחי סמך", items: [...sec(bsNormalClt, "sampling", "clt"), ...sec(bsConfidenceIntervals)] },
    { titleHe: "בחינת קשרים בין משתנים קטגוריים וכמותיים", items: [...sec(bsCategorical), ...sec(bsCorrelation)] },
    { titleHe: "התאמת מודלים של רגרסיה לינארית", items: sec(bsRegression) },
    { titleHe: "ניתוח שונות חד גורמי", items: sec(bsAnova) },
    { titleHe: "משתנים מקריים", items: [...sec(bsRandomVariables, "discrete", "expectation", "rules"), ...sec(bsNormalClt, "continuous", "normal")] },
    { titleHe: "התפלגות בינומית", items: sec(bsRandomVariables, "binomial") },
    { titleHe: "הסתברות מותנית", items: [...sec(bsProbability), ...sec(mendelProbability, "probability")] },
    { titleHe: "עיבוד סטטיסטי של נתונים באמצעות SPSS", items: [...sec(bsDescribingData, "spss"), ...sec(bsTwoMeans, "spss"), ...sec(bsRegression, "spss"), ...sec(bsAnova, "spss")] },
  ],
  lectures: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.items })),
  tutorials: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.practice })).filter((t) => t.items.length > 0),
};
