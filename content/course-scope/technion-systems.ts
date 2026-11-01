import type { CourseScope, ScopeEntry } from "./types";

// Technion 136037 "ביולוגיה מערכתית". Evidence available (2026-10-31): the portal syllabus — by far the most detailed
// on this site. It carries seven NUMBERED learning outcomes that name the motifs, their functions, the worked systems
// and the tooling. Many sections here are therefore "core" on an explicit naming, not on a heading. Levels:
// "core" where an outcome or the paragraph names it; "likely" where the section is a teaching choice under something
// named; "extension" for what Codex marked optional, and for refresher sections of 134141 not linked here.

const named = (what: string, where = "תיאור הקורס"): ScopeEntry => ({
  level: "core", evidence: "syllabus-named",
  noteHe: `${where}: ${what}`,
});
const outcome = (n: number, what: string): ScopeEntry => ({
  level: "core", evidence: "syllabus-named",
  noteHe: `תוצאת למידה ${n} בסילבוס: ${what}`,
});
const heading = (topic: string, what: string): ScopeEntry => ({
  level: "likely", evidence: "syllabus-heading",
  noteHe: `נכלל בנושא "${topic}" בתיאור הקורס, אבל ${what} לא מוזכר בשמו`,
});
const refresher = (what: string): ScopeEntry => ({
  level: "likely", evidence: "syllabus-heading",
  noteHe: `${what} — רענון רשות מקורס ביולוגיה חישובית (134141), שאינו מקצוע קדם; היחידה כאן מעמיקה מעבר אליו`,
});
const outside = (what: string): ScopeEntry => ({
  level: "extension", evidence: "none",
  noteHe: `${what} — סעיף ביחידה של קורס אחר שלא מקושר מהקורס הזה`,
});

const INFO = "תיאור מערכות ביולוגיות כמערכות לעיבוד מידע וניתוחן מתמטית";
const DYN = "ניתוח דינמיקה של רשתות ביולוגיות";
const SENSE = "מערכות חישה ושינויים קוולנטיים";
const PROC = "תהליכים ביולוגיים: בקרת שעתוק, מעבר אותות, התמיינות, עיבוד מידע בנוירונים, הסתגלות סנסורית";

export const technionSystemsScope: CourseScope = {
  courseSlug: "technion-systems",
  checkedAt: "2026-10-31",
  defaultSource: { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/136037" },
  sections: {
    "sy-information": {
      io: named("תיאור מערכות ביולוגיות כמערכות לעיבוד מידע"),
      diagram: heading(INFO, "ההבחנה בין תרשים למודל"),
      timescales: heading(INFO, "הפרדת קני מידה בזמן"),
      units: heading(INFO, "בדיקת יחידות"),
      falsification: outcome(6, "לאתגר את הנחות היסוד של המודלים"),
    },
    "sy-matlab": {
      basics: outcome(1, "לתכנת ב-MATLAB באופן בסיסי"),
      ode45: outcome(1, "לפתור נומרית מד\"ר"),
      tolerance: heading(INFO, "בדיקת סבילות והתכנסות"),
      discontinuity: heading(INFO, "טיפול בקלט לא רציף"),
      validation: outcome(6, "השוואה לפתרון אנליטי כאימות"),
    },
    "sy-response-feedback": {
      "input-function": heading(DYN, "פונקציית קלט ומקדם היל"),
      linearisation: outcome(3, "לנתח מוטיבי רשת באופן אנליטי"),
      matched: outcome(4, "זירוז תגובות — השוואה במצב יציב תואם"),
      positive: outcome(2, "משוב חיובי ומשוב עצמי"),
      limits: outcome(6, "גבולות התוקף של הניתוח"),
    },
    "sy-ffl-coherent": {
      structure: outcome(2, "COHERENT FEEDFORWARD LOOP"),
      and: outcome(4, "יצירת השהיה תלוית סימן"),
      or: outcome(4, "השהיה בכיבוי בשער OR"),
      filtering: outcome(4, "נטרול רעשי קלט"),
      "not-enough": outcome(6, "הטופולוגיה אינה קובעת את ההתנהגות"),
    },
    "sy-ffl-incoherent": {
      structure: outcome(2, "INCOHERENT FEEDFORWARD LOOP"),
      spike: outcome(4, "יצירת SPIKE"),
      acceleration: outcome(4, "זירוז תגובות"),
      "adaptation-preview": named("הסתגלות סנסורית", "תיאור הקורס (מבוא)"),
      claims: outcome(6, "מה נדרש כדי לבסס טענה"),
    },
    "sy-bistability": {
      graphical: outcome(3, "ניתוח אנליטי ונומרי של מוטיבים"),
      hysteresis: outcome(4, "יצירת בי-סטביליות"),
      nullclines: outcome(3, "ניתוח מערכת דו-משתנית"),
      lambda: outcome(7, "המפסק בבקרת LAMBDA PHAGE"),
    },
    "sy-development": {
      gradient: outcome(7, "התמיינות במהלך התפתחות DROSOPHILA"),
      precision: heading(PROC, "דיוק הגבול"),
      "cross-repression": outcome(7, "התמיינות באמצעות אינטראקציות בקרה"),
      "sharp-vs-robust": heading(PROC, "ההבחנה בין חדות ליציבות מיקום"),
      limits: outcome(6, "מגבלות המודל"),
    },
    "sy-covalent": {
      cycle: named("שינויים קוולנטיים"),
      ultrasensitivity: named("ניתוח מערכות חישה ושינויים קוולנטיים"),
      why: heading(SENSE, "מקור הרגישות ברוויה"),
      "not-bistable": heading(SENSE, "ההבחנה מדו-יציבות"),
      cascades: heading(SENSE, "מפלי אנזימים"),
    },
    "sy-signaling": {
      "two-measurements": heading(DYN, "מנה-תגובה מול מהלך בזמן"),
      oscillation: named("מעבר אותות"),
      nfkb: outcome(7, "בקרת שעתוק בתאי יונקים"),
      encoding: outcome(5, "מודלים של מעבר אותות"),
      output: heading(PROC, "תפוקת שעתוק כפלט"),
      averaging: heading(DYN, "מגבלות מדידת אוכלוסייה"),
    },
    "sy-adaptation": {
      definition: named("הסתגלות סנסורית"),
      integral: outcome(7, "הסתגלות מדויקת"),
      proportional: heading(SENSE, "השוואה למשוב פרופורציונלי"),
      chemotaxis: outcome(7, "תהליכים כימו-סנסוריים ב-E. COLI"),
      limits: outcome(6, "מה עמידות הדיוק אינה מבטיחה"),
    },
    "sy-noise": {
      "two-sources": heading(PROC, "רעש פנימי וחיצוני"),
      "two-colour": heading(PROC, "ניסוי שני הצבעים"),
      poisson: heading(PROC, "רעש ספירה"),
      filtering: outcome(7, "נטרול רעשי קלט בשמרים"),
      claims: outcome(6, "מה נדרש כדי לבסס טענת סינון"),
    },
    "sy-neurons": {
      rc: outcome(5, "מודלים של עיבוד מידע בנוירונים"),
      frequency: outcome(5, "תגובת תדר של הקרום"),
      adaptation: named("הסתגלות סנסורית"),
      "on-off": outcome(7, "נוירונים סנסוריים של C. ELEGANS"),
      "what-measured": outcome(6, "לאתגר את הנחות המדידה"),
    },
    "sy-models": {
      fit: outcome(6, "כיצד להשוות בין ביצועים של מודלים"),
      identifiability: outcome(6, "לאתגר את הנחות היסוד"),
      competing: outcome(6, "השוואה בין מודלים מתחרים"),
      prediction: outcome(6, "ניבוי כמבחן"),
      distinctions: named("סיכום העקרונות", "תיאור הקורס"),
      checklist: heading(INFO, "רשימת בדיקה למודל"),
    },
    // optional refresher sections from 134141 (NOT a prerequisite)
    "cb-dynamics": {
      ode: refresher("משוואה דיפרנציאלית בסיסית"),
      steady: refresher("מצב יציב וזמן תגובה"),
      euler: refresher("שיטת אוילר"),
      convergence: refresher("בדיקת התכנסות"),
      limits: refresher("גבולות המודל"),
    },
    "cb-feedback": {
      nar: refresher("משוב שלילי עצמי"),
      compare: refresher("השוואת זמני תגובה"),
      stability: refresher("יציבות לפי שיפוע"),
      toggle: refresher("משוב חיובי ודו-יציבות"),
      validation: refresher("תיקוף מודלים"),
    },
    "cb-networks": {
      degree: outside("דרגה והתפלגות דרגות"),
      centrality: outside("מרכזיות קרבה"),
      "hubs-essential": outside("רכזות וחיוניות"),
      motifs: refresher("מוטיבים ומודל אפס"),
      causality: outside("מרכזיות מול סיבתיות"),
    },
  },
};
