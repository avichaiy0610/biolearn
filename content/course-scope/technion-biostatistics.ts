import type { CourseScope, ScopeEntry } from "./types";

// Technion 134154 "ביוסטטיסטיקה לביולוגים". Evidence available (2026-10-25): the CURRENT portal paragraph only — ten
// named topics plus "hands-on statistical processing of data in SPSS". No reading pages, no past exams, no staff
// material (Moodle closed to guests). The parallel medicine course 274182 is evidence for nothing here.
// "core" where the paragraph names the subject or the section is the subject's own minimum; "likely" for supporting
// material under a named heading (the normal distribution and CLT under confidence intervals, t-tests under hypothesis
// tests, SPSS output under the SPSS line); "extension" for sections reviewed with Codex as optional — no course document
// supports them (Spearman, RR/OR).

const named = (topic: string, what?: string): ScopeEntry => ({
  level: "core", evidence: "syllabus-named",
  noteHe: what ? `תיאור הקורס: "${topic}" — ${what}` : `תיאור הקורס: "${topic}"`,
});
const heading = (topic: string, what: string): ScopeEntry => ({
  level: "likely", evidence: "syllabus-heading",
  noteHe: `נכלל בנושא "${topic}" בתיאור הקורס, אבל ${what} לא מוזכר בשמו`,
});
const extension = (what: string): ScopeEntry => ({
  level: "extension", evidence: "none",
  noteHe: `${what} — לא מוזכר בתיאור הקורס; מובא בקצרה להרחבה`,
});

const GRAPHS = "תיאור נתונים באופן גרפי";
const CENTER = "חישוב מדדי מרכז ופיזור";
const TESTS = "מבחני השערה סטטיסטיים";
const CI = "אמידת פרמטרים לא ידועים באוכלוסייה באמצעות רווחי סמך";
const RELATIONS = "בחינת קשרים בין משתנים קטגורים וכמותיים";
const REGRESSION = "התאמת מודלים של רגרסיה לינארית";
const ANOVA = "ניתוח שונות חד גורמי";
const RV = "משתנים מקריים";
const BINOMIAL = "התפלגות בינומית";
const CONDITIONAL = "הסתברות מותנית";
const SPSS = "התנסות בעיבוד סטטיסטי של נתונים באמצעות תוכנת SPSS";

export const technionBiostatisticsScope: CourseScope = {
  courseSlug: "technion-biostatistics",
  checkedAt: "2026-10-25",
  defaultSource: { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134154" },
  sections: {
    "bs-describing-data": {
      population: heading(GRAPHS, "אוכלוסייה, מדגם ויחידה נצפית"),
      "variable-types": named(RELATIONS, "סוגי המשתנים (קטגוריים וכמותיים)"),
      frequency: named(GRAPHS, "טבלאות שכיחות"),
      graphs: named(GRAPHS),
      shape: named(GRAPHS, "צורת ההתפלגות"),
      spss: named(SPSS, "הזנת נתונים והגדרת משתנים"),
    },
    "bs-center-spread": {
      center: named(CENTER),
      variance: named(CENTER),
      quartiles: named(CENTER, "אחוזונים, IQR וערכים חריגים"),
      "z-score": heading(CENTER, "ציון תקן"),
      transform: heading(CENTER, "שינוי יחידות"),
    },
    "bs-probability": {
      events: heading(CONDITIONAL, "כללי ההסתברות הבסיסיים"),
      conditional: named(CONDITIONAL),
      independence: named(CONDITIONAL, "אי-תלות"),
      multiplication: named(CONDITIONAL, "כלל הכפל והסתברות שלמה"),
      bayes: named(CONDITIONAL, "היפוך התניה (כלל בייס)"),
    },
    "bs-random-variables": {
      discrete: named(RV),
      expectation: named(RV, "תוחלת ושונות"),
      rules: heading(RV, "כללים לטרנספורמציה ולסכום"),
      binomial: named(BINOMIAL),
    },
    "bs-normal-clt": {
      continuous: heading(RV, "משתנה רציף ופונקציית צפיפות"),
      normal: heading(CI, "ההתפלגות הנורמלית"),
      sampling: heading(CI, "התפלגות הדגימה וטעות התקן"),
      clt: heading(CI, "משפט הגבול המרכזי"),
      normality: heading(TESTS, "בדיקת הנחת הנורמליות"),
    },
    "bs-confidence-intervals": {
      estimation: named(CI),
      "mean-ci": named(CI, "רווח סמך לתוחלת"),
      interpretation: named(CI, "פירוש רווח הסמך"),
      width: named(CI, "רוחב הרווח"),
      proportion: heading(CI, "רווח סמך לפרופורציה"),
    },
    "bs-hypothesis-testing": {
      logic: named(TESTS),
      "p-value": named(TESTS, "ערך p"),
      errors: named(TESTS, "סוגי טעויות ועוצמה"),
      "one-sample-t": heading(TESTS, "מבחן t למדגם אחד"),
      sidedness: named(TESTS, "מבחן חד-צדדי ודו-צדדי"),
      "proportion-test": heading(TESTS, "מבחן לפרופורציה"),
      "ci-duality": named(CI, "הקשר בין רווח סמך למבחן"),
      significance: named(TESTS, "מובהקות וחשיבות"),
    },
    "bs-two-means": {
      designs: heading(TESTS, "מדגמים בלתי תלויים ומזווגים"),
      independent: heading(TESTS, "מבחן t לשני מדגמים"),
      paired: heading(TESTS, "מבחן t מזווג"),
      "ci-difference": named(CI, "רווח סמך להפרש"),
      spss: heading(SPSS, "פלט מבחני t ב-SPSS"),
    },
    "bs-categorical": {
      map: named(RELATIONS, "איזה כלי לאיזה זוג משתנים"),
      contingency: named(RELATIONS, "טבלת שכיחויות למשתנים קטגוריים"),
      "independence-test": named(RELATIONS, "מבחן χ² לאי-תלות"),
      conditions: heading(RELATIONS, "תנאי המבחן ומבחן פישר"),
      "goodness-of-fit": heading(TESTS, "מבחן χ² לטיב התאמה"),
      effect: extension("סיכון יחסי ויחס סיכויים"),
    },
    "bs-correlation": {
      scatter: named(RELATIONS, "תרשים פיזור למשתנים כמותיים"),
      pearson: named(RELATIONS, "מקדם המתאם"),
      test: named(RELATIONS, "מבחן למתאם"),
      causation: named(RELATIONS, "מתאם וסיבתיות"),
      spearman: extension("מתאם ספירמן"),
    },
    "bs-regression": {
      model: named(REGRESSION),
      "least-squares": named(REGRESSION, "שיטת הריבועים הפחותים"),
      "r-squared": named(REGRESSION, "R² ופירוק השונות"),
      "slope-test": named(REGRESSION, "מבחן ורווח סמך לשיפוע"),
      assumptions: named(REGRESSION, "הנחות המודל ותרשים שאריות"),
      prediction: heading(REGRESSION, "חיזוי ואקסטרפולציה"),
      spss: heading(SPSS, "פלט הרגרסיה ב-SPSS"),
    },
    "bs-anova": {
      multiplicity: named(ANOVA, "למה לא כמה מבחני t"),
      idea: named(ANOVA),
      table: named(ANOVA, "טבלת ANOVA ומבחן F"),
      assumptions: named(ANOVA, "ההנחות"),
      "post-hoc": heading(ANOVA, "השוואות מרובות (Tukey, Bonferroni)"),
      spss: heading(SPSS, "פלט ניתוח השונות ב-SPSS"),
    },
    // Prerequisite unit (genetics 134020), linked as a refresher.
    "mendel-probability": {
      probability: named(CONDITIONAL, "רענון — הסתברות בהצלבות"),
      "chi-square": heading(RELATIONS, "רענון — מבחן χ² לטיב התאמה"),
      method: extension("שיטת העבודה של מנדל (חומר מקורס הגנטיקה)"),
      segregation: extension("חוק ההיפרדות (חומר מקורס הגנטיקה)"),
      testcross: extension("הצלבת מבחן (חומר מקורס הגנטיקה)"),
      assortment: extension("חוק המיון הבלתי תלוי (חומר מקורס הגנטיקה)"),
    },
  },
};
