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
import { bsNonparametric } from "../lessons/technion-biostatistics/bs-nonparametric";
import { bsMultipleRegression } from "../lessons/technion-biostatistics/bs-multiple-regression";
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
// 2026-11-08: rebuilt on the lecturer's winter 2024 syllabus (Dr. Naama Wolf; syllabuses/_text/סילבוס ביוסטטיסטיקה.pdf.txt)
// — 12 weeks, R (not SPSS), final exam with R output and code (2023 exams). Added bs-nonparametric (week 7) and
// bs-multiple-regression (week 10); power/effect size/sample size, Cramér's V and diagnostic tests as sections.
// ANOVA is not in the shortened 2024 semester but is taught in regular semesters and asked in 2023 — kept after week 7.

const sec = (l: Lesson, ...ids: string[]): PlanItem[] => (ids.length ? ids.map((section) => ({ kind: "lesson" as const, slug: l.slug, section })) : [{ kind: "lesson", slug: l.slug }]);
const probs = (l: Lesson): PlanItem[] => (l.workedProblems ?? []).map((w) => ({ kind: "lesson" as const, slug: l.slug, problem: w.id }));

const PORTAL = { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134154" };

export const BIOSTATISTICS_LESSONS: Lesson[] = [bsDescribingData, bsCenterSpread, bsProbability, bsRandomVariables, bsNormalClt, bsConfidenceIntervals, bsHypothesisTesting, bsTwoMeans, bsNonparametric, bsCategorical, bsCorrelation, bsRegression, bsMultipleRegression, bsAnova];

const LECTURES: { titleHe: string; items: PlanItem[]; practice: PlanItem[] }[] = [
  { titleHe: "סטטיסטיקה תיאורית: סולמות מדידה, מדדי מרכז, פיזור ומיקום, תרשימים", items: [...sec(bsDescribingData), ...sec(bsCenterSpread)], practice: [...probs(bsDescribingData), ...probs(bsCenterSpread)] },
  { titleHe: "התפלגות נורמלית ומשפט הגבול המרכזי", items: sec(bsNormalClt), practice: probs(bsNormalClt) },
  { titleHe: "מבחן Z, ערך p, טעויות, עוצמה, גודל אפקט וגודל מדגם", items: sec(bsHypothesisTesting, "logic", "p-value", "errors", "power", "sidedness", "significance"), practice: probs(bsHypothesisTesting) },
  { titleHe: "מבחן t לתוחלת ורווח סמך", items: [...sec(bsConfidenceIntervals, "estimation", "mean-ci", "interpretation", "width"), ...sec(bsHypothesisTesting, "one-sample-t", "ci-duality")], practice: probs(bsConfidenceIntervals) },
  { titleHe: "השוואת שתי תוחלות: מזווגים ובלתי תלויים", items: sec(bsTwoMeans), practice: probs(bsTwoMeans) },
  { titleHe: "מבחנים ורווחי סמך לפרופורציה ולהשוואת פרופורציות", items: [...sec(bsConfidenceIntervals, "proportion"), ...sec(bsHypothesisTesting, "proportion-test"), ...sec(bsCategorical, "map", "contingency")], practice: [] },
  { titleHe: "מבחנים אפרמטריים להשוואת שתי קבוצות", items: sec(bsNonparametric), practice: probs(bsNonparametric) },
  { titleHe: "ניתוח שונות חד-גורמי (בסמסטר רגיל)", items: sec(bsAnova), practice: probs(bsAnova) },
  { titleHe: "קשר בין משתנים קטגוריאליים: מבחן χ² ומקדם קרמר", items: [...sec(bsCategorical, "independence-test", "conditions", "goodness-of-fit", "effect"), ...sec(mendelProbability, "chi-square")], practice: probs(bsCategorical) },
  { titleHe: "מקדם המתאם של פירסון ורגרסיה לינארית פשוטה", items: [...sec(bsCorrelation), ...sec(bsRegression)], practice: [...probs(bsCorrelation), ...probs(bsRegression)] },
  { titleHe: "רגרסיה לינארית מרובה, משתנים קטגוריים, VIF ובחירת מודל", items: sec(bsMultipleRegression), practice: probs(bsMultipleRegression) },
  { titleHe: "הסתברות: מאורעות, אי-תלות, הסתברות מותנית ונוסחת בייס", items: [...sec(mendelProbability, "probability"), ...sec(bsProbability, "events", "conditional", "independence", "multiplication", "bayes"), ...sec(bsRandomVariables)], practice: [...probs(bsProbability), ...probs(bsRandomVariables)] },
  { titleHe: "בדיקות אבחון: רגישות, סגוליות וערך מנבא", items: sec(bsProbability, "diagnostic"), practice: [] },
];

export const technionBiostatisticsPlan: CoursePlan = {
  courseSlug: "technion-biostatistics",
  lectureOrder: {
    confidence: "official-past",
    noteHe: "לפי לוח 12 השבועות בסילבוס של הקורס מחורף 2024 (ד\"ר נעמה וולף): סטטיסטיקה תיאורית, התפלגות נורמלית, מבחן Z ועוצמה, מבחן t ורווח סמך, שתי תוחלות, פרופורציות, מבחנים אפרמטריים, χ² וקרמר, פירסון ורגרסיה פשוטה, רגרסיה מרובה, הסתברות, ובדיקות אבחון. ניתוח שונות לא נלמד בסמסטר המקוצר של 2024, אבל נלמד בסמסטר רגיל ונשאל במבחני 2023 — לכן הוא מופיע אחרי שבוע 7.",
    links: [PORTAL],
  },
  tutorialOrder: null,
  schedule: "official",
  scheduleNoteHe: "לפי הסילבוס של המרצה. הקורס עובד בתוכנה R (ולא SPSS כפי שכתוב בפורטל): בתרגולים במעבדת מחשבים, ובמבחן יש פלטים של R וגם שאלות שבהן משלימים קוד. הציון: מבחן 80% (כולל דף נוסחאות, ושאלה בשווי 15 נקודות מתרגילי הקורס בשינוי נתונים), מעבדת R 10% ותרגילי בית 10%.",
  topics: [
    { titleHe: "תיאור נתונים באופן גרפי", items: sec(bsDescribingData) },
    { titleHe: "חישוב מדדי מרכז ופיזור", items: sec(bsCenterSpread) },
    { titleHe: "מבחני השערה סטטיסטיים", items: [...sec(bsHypothesisTesting), ...sec(bsTwoMeans), ...sec(bsNonparametric)] },
    { titleHe: "אמידת פרמטרים לא ידועים באוכלוסייה באמצעות רווחי סמך", items: [...sec(bsNormalClt, "sampling", "clt"), ...sec(bsConfidenceIntervals)] },
    { titleHe: "בחינת קשרים בין משתנים קטגוריים וכמותיים", items: [...sec(bsCategorical), ...sec(bsCorrelation)] },
    { titleHe: "התאמת מודלים של רגרסיה לינארית", items: [...sec(bsRegression), ...sec(bsMultipleRegression)] },
    { titleHe: "ניתוח שונות חד גורמי", items: sec(bsAnova) },
    { titleHe: "משתנים מקריים", items: [...sec(bsRandomVariables, "discrete", "expectation", "rules"), ...sec(bsNormalClt, "continuous", "normal")] },
    { titleHe: "התפלגות בינומית", items: sec(bsRandomVariables, "binomial") },
    { titleHe: "הסתברות מותנית", items: [...sec(bsProbability), ...sec(mendelProbability, "probability")] },
    { titleHe: "עיבוד סטטיסטי של נתונים באמצעות תוכנה (בקורס: R)", items: [...sec(bsDescribingData, "r"), ...sec(bsTwoMeans, "r"), ...sec(bsRegression, "r"), ...sec(bsAnova, "r")] },
  ],
  lectures: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.items })),
  tutorials: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.practice })).filter((t) => t.items.length > 0),
};
