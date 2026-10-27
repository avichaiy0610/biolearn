import type { CourseScope, ScopeEntry } from "./types";

// Technion 134141 "ביולוגיה חישובית". Evidence available (2026-10-26): the current portal paragraph only — five named
// topic families, "ועוד", and basic Python. No books, exams or staff material (Moodle closed). Levels: "core" where the
// paragraph names the topic family and the section is its basic content; "likely" where the section is a teaching
// choice under a named family (a specific algorithm or caveat); "extension" for the items Codex marked optional
// (toggle switch, random-walk simulation, BLAST detail).

const named = (topic: string, what?: string): ScopeEntry => ({
  level: "core", evidence: "syllabus-named",
  noteHe: what ? `תיאור הקורס: "${topic}" — ${what}` : `תיאור הקורס: "${topic}"`,
});
const heading = (topic: string, what: string): ScopeEntry => ({
  level: "likely", evidence: "syllabus-heading",
  noteHe: `נכלל בנושא "${topic}" בתיאור הקורס, אבל ${what} לא מוזכר בשמו`,
});
const beyond = (what: string): ScopeEntry => ({
  level: "extension", evidence: "none",
  noteHe: `${what} — מעבר לתיאור הקורס; הסעיף הוא העשרה`,
});
const refresher = (topic: string, what: string): ScopeEntry => heading(topic, `${what} (העמקה מקורס הביואינפורמטיקה)`);
const outside = (what: string): ScopeEntry => ({
  level: "extension", evidence: "none",
  noteHe: `${what} — סעיף ביחידה של קורס אחר שלא מקושר מהקורס הזה`,
});

const CS = "רעיונות ומושגים מרכזיים ממדעי המחשב";
const PY = "שיעורי בסיס בשפת התכנות פייתון";
const DATA = "ניתוח רשימות נתונים";
const SEQ = "אנליזת רצפים ביולוגיים";
const NET = "אלגוריתמים ברשתות ביולוגיות";
const IMG = "עיבוד תמונות ביולוגיות";
const SIM = "סימולציה של מערכות דינמיות";

export const technionComputationalScope: CourseScope = {
  courseSlug: "technion-computational",
  checkedAt: "2026-10-27",
  defaultSource: { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134141" },
  sections: {
    "cb-thinking": {
      "problem-algorithm": named(CS, "מבעיה ביולוגית לאלגוריתם"),
      representations: named(CS, "ייצוג נתונים ביולוגיים"),
      pseudocode: heading(CS, "פסאודו-קוד"),
      efficiency: heading(CS, "יעילות וסיבוכיות"),
      example: named(CS, "דוגמה ביולוגית"),
    },
    "cb-python": {
      values: named(PY, "משתנים וטיפוסים"),
      collections: named(PY, "רשימות ומילונים"),
      loops: named(PY, "לולאות ותנאים"),
      functions: named(PY, "פונקציות"),
      files: named(PY, "קריאת קבצים"),
    },
    "cb-data-tables": {
      dataframe: named(DATA, "טבלת נתונים"),
      missing: heading(DATA, "ערכים חסרים"),
      "filter-group": named(DATA, "סינון וקיבוץ"),
      join: heading(DATA, "צירוף טבלאות"),
      plot: heading(DATA, "גרפים"),
      "sort-search": heading(DATA, "מיון וחיפוש בינארי"),
    },
    "cb-sequences": {
      strings: named(SEQ, "רצף כמחרוזת"),
      "pattern-matching": named(SEQ, "חיפוש תבניות"),
      kmers: heading(SEQ, "ספירת k-mers"),
      "gc-skew": heading(SEQ, "הטיית GC"),
    },
    "cb-alignment": {
      why: named(SEQ, "השוואת רצפים"),
      "dp-idea": heading(SEQ, "תכנון דינמי"),
      worked: heading(SEQ, "יישור לדוגמה"),
      code: heading(SEQ, "מימוש היישור"),
      blast: heading(SEQ, "חיפוש מהיר ו-BLAST"),
    },
    "cb-graphs": {
      graphs: named(NET, "רשת ביולוגית כגרף"),
      representation: named(NET, "ייצוג גרף"),
      bfs: heading(NET, "חיפוש לרוחב (BFS)"),
      components: heading(NET, "רכיבי קשירות"),
      questions: named(NET, "שאלות ביולוגיות על רשתות"),
    },
    "cb-networks": {
      degree: named(NET, "דרגה והתפלגות דרגות"),
      centrality: heading(NET, "מרכזיות קרבה"),
      "hubs-essential": heading(NET, "רכזות וחיוניות"),
      motifs: heading(NET, "מוטיבים ומודל אפס"),
      causality: heading(NET, "מרכזיות מול סיבתיות"),
    },
    "cb-clustering": {
      distance: named(DATA, "מרחק בין דגימות"),
      scaling: heading(DATA, "נרמול"),
      kmeans: heading(DATA, "אשכולות k-means"),
      pitfalls: heading(DATA, "מלכודות של k-means"),
      interpret: heading(DATA, "פרשנות אשכולות"),
    },
    "cb-images": {
      matrix: named(IMG, "תמונה כמטריצה"),
      histogram: named(IMG, "היסטוגרמה"),
      otsu: heading(IMG, "סף אוטסו"),
      uneven: heading(IMG, "תאורה לא אחידה"),
      filters: named(IMG, "מסננים"),
    },
    "cb-segmentation-tracking": {
      labeling: named(IMG, "סגמנטציה ותיוג"),
      calibration: heading(IMG, "כיול פיקסלים ופריימים"),
      touching: heading(IMG, "הפרדת אובייקטים נוגעים"),
      tracking: heading(IMG, "מעקב בין פריימים"),
      validation: heading(IMG, "אימות ידני"),
      worms: heading(IMG, "מעקב אחרי תולעים וסיכום לבעל חיים"),
    },
    "cb-dynamics": {
      ode: named(SIM, "משוואה דיפרנציאלית"),
      steady: named(SIM, "מצב יציב"),
      euler: named(SIM, "סימולציה בשיטת אוילר"),
      convergence: heading(SIM, "בדיקת התכנסות"),
      limits: heading(SIM, "גבולות המודל"),
    },
    "cb-feedback": {
      nar: heading(SIM, "משוב שלילי עצמי"),
      compare: heading(SIM, "השוואת זמני תגובה"),
      stability: heading(SIM, "יציבות של מצב יציב"),
      toggle: beyond("משוב חיובי ומתג גנטי"),
      validation: heading(SIM, "תיקוף מודלים"),
    },
    "cb-review": {
      pipeline: named(CS, "משאלה ביולוגית לפתרון חישובי"),
      case: heading(DATA, "מבחן פרמוטציה על נתוני מעקב"),
      "random-walk": beyond("סימולציית הליכה אקראית"),
      toolbox: named(CS, "סיכום הכלים"),
      checklist: heading(CS, "רשימת בדיקה"),
    },
    // deeper sections from the bioinformatics course (linked after the local unit that needs them)
    "bi-pairwise": {
      homology: outside("זהות, דמיון והומולוגיה"),
      "global-local": refresher(SEQ, "יישור גלובלי ומקומי"),
      matrices: refresher(SEQ, "מטריצות ניקוד"),
      gaps: refresher(SEQ, "עונשי פערים"),
      dp: outside("תכנות דינמי"),
      "dot-plot": outside("dot plot"),
    },
    "bi-blast": {
      heuristic: outside("למה צריך קיצור דרך"),
      how: refresher(SEQ, "איך BLAST עובד"),
      programs: outside("תוכניות BLAST"),
      databases: outside("מאגרים"),
      scores: refresher(SEQ, "קריאת תוצאות BLAST"),
      "low-complexity": outside("סינון מורכבות נמוכה"),
      "psi-blast": outside("PSI-BLAST"),
    },
    "bi-networks": {
      graphs: outside("מה זה רשת"),
      centrality: outside("דרגה, צבירה ומרכזיות"),
      evidence: refresher(NET, "מקורות האינטראקציות"),
      "hubs-modules": refresher(NET, "רכזות ומודולים"),
      motifs: outside("מוטיבים ברשתות בקרה"),
    },
    "bi-stats-exploration": {
      "multiple-testing": outside("ריבוי מבחנים"),
      bonferroni: outside("Bonferroni"),
      fdr: outside("FDR"),
      "effect-size": outside("גודל השפעה"),
      pca: refresher(DATA, "PCA"),
      clustering: refresher(DATA, "קיבוץ היררכי ומפות חום"),
    },
  },
};
