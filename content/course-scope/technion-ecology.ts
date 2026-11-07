import type { CourseScope, ScopeEntry } from "./types";

// Technion 134153 "אקולוגיה". Evidence available (2026-10-24): the current portal paragraph only (9 topics). No reading
// list, exams or staff material (Moodle closed to guests). Levels reviewed with Codex before writing: "core" where the
// paragraph names the subject or the section is the minimum framework to explain it; "likely" for named models, laws,
// classic experiments and case studies under a named heading.

const named = (topic: string, what?: string): ScopeEntry => ({
  level: "core", evidence: "syllabus-named",
  noteHe: what ? `הסילבוס הרשמי: "${topic}" — ${what}` : `הסילבוס הרשמי: "${topic}"`,
});
const heading = (topic: string, what: string): ScopeEntry => ({
  level: "likely", evidence: "syllabus-heading",
  noteHe: `נכלל בנושא "${topic}" בסילבוס, אבל ${what} לא מוזכר בשמו`,
});

const ECO = "מערכות אקולוגיות (זרימת אנרגיה)";
const BGC = "המסלולים הביוגיאוכימיים";
const DIST = "גורמים המשפיעים על תפוצת האורגניזמים";
const ADAPT = "אדפטציות לבתי הגידול השונים";
const DIV = "מגוון מינים";
const SUCC = "סוקססיה (תהליכים הקשורים בהתבגרות המערכת האקולוגית)";
const POP = "ויסות גודל האוכלוסיה";
const INT = "אינטראקציות ביולוגיות במערכת אקולוגית: תחרות וטריפה";
const HUMAN = "השפעת האדם ומעורבותו במערכת האקולוגית";

// The lecturer's 2025 syllabus and the 2025 moed A reconstruction in the Drive (added 2026-11-07).
const exam25 = (what: string): ScopeEntry => ({ level: "core", evidence: "exam", noteHe: `נבחן בשחזור מועד א' 2025: ${what}` });
const syl25 = (what: string): ScopeEntry => ({ level: "core", evidence: "syllabus-named", noteHe: `הסילבוס של המרצה (אביב 2025): ${what}` });

export const technionEcologyScope: CourseScope = {
  courseSlug: "technion-ecology",
  checkedAt: "2026-11-07",
  defaultSource: { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134153" },
  sections: {
    "ec-biomes": {
      "what-sets": syl25("אקולוגיה גלובלית: תנאים פיזיים; אקלים וביומסה"),
      walter: exam25("קריאת דיאגרמת אקלים של וולטר"),
      terrestrial: exam25("דירוג ביומות לפי עושר מינים"),
      mediterranean: syl25("סיור בחורש הים-תיכוני בטכניון"),
      aquatic: exam25("אזור פוטי ואפוטי"),
      intertidal: exam25("שאלה פתוחה על ביומת אזור הגאות והשפל"),
      richness: exam25("דירוג טונדרה, יער טרופי, ביצה, מדבר ושונית אלמוגים לפי עושר מינים"),
    },
    "ec-environment": {
      levels: { level: "core", evidence: "exam", noteHe: "שאלה פתוחה לדוגמה לקראת מבחן 2025: שש רמות ארגון עם דוגמה ישראלית" },
      what: named(DIST, "הגדרות ורמות הארגון"),
      "conditions-resources": named(DIST, "תנאים, משאבים וסבולת"),
      climate: named(DIST, "אקלים"),
      niche: heading(DIST, "הנישה וניסוי קונל"),
      dispersal: named(DIST, "פיזור ומחסומים"),
    },
    "ec-adaptations": {
      adaptation: named(ADAPT, "אדפטציה ואקלום"),
      temperature: named(ADAPT, "טמפרטורה"),
      water: named(ADAPT, "מים"),
      salinity: named(ADAPT, "מליחות"),
      light: named(ADAPT, "אור"),
    },
    "ec-population-growth": {
      dispersion: exam25("יתרונות וחסרונות של דגימה אחידה; שאלה לדוגמה: פיזור מול צפיפות"),
      bookkeeping: named(POP, "מאזן לידות, מוות והגירה"),
      exponential: named(POP, "גידול מעריכי"),
      logistic: named(POP, "גידול לוגיסטי וכושר נשיאה"),
      "life-tables": heading(POP, "טבלאות חיים ו-R₀"),
      survivorship: heading(POP, "עקומות הישרדות"),
      "age-structure": heading(POP, "מבנה גילים"),
    },
    "ec-population-regulation": {
      "density-dependence": named(POP, "ויסות תלוי צפיפות"),
      intraspecific: named(POP, "תחרות תוך-מינית"),
      fluctuations: named(POP, "תנודות ומחזורים"),
      "life-history": heading(POP, "אסטרטגיות מהלך חיים ומודל r/K"),
      metapopulations: heading(POP, "מטא-אוכלוסיות"),
    },
    "ec-competition": {
      what: named(INT, "תחרות"),
      exclusion: named(INT, "הדרה תחרותית"),
      "lotka-volterra": heading(INT, "מודל לוטקה-וולטרה לתחרות"),
      partitioning: named(INT, "חלוקת משאבים ודו-קיום"),
      displacement: heading(INT, "תזוזת תכונות"),
      "field-tests": heading(INT, "ניסויי הסרה בשדה"),
    },
    "ec-predation": {
      interactions: heading(INT, "טבלת האינטראקציות (הדדיות, טפילות)"),
      "lotka-volterra": heading(INT, "מודל לוטקה-וולטרה לטורף-טרף"),
      stability: heading(INT, "ניסויי גאוזה והאפקר"),
      "functional-response": heading(INT, "התגובה הפונקציונלית"),
      "prey-defenses": named(INT, "טריפה — הגנות של טרף"),
      herbivory: named(INT, "רעייה והגנות של צמחים"),
      cascades: heading(INT, "מפלים טרופיים ומיני מפתח"),
    },
    "ec-energy-flow": {
      ecosystem: named(ECO),
      "primary-production": named(ECO, "ייצור ראשוני"),
      "trophic-levels": named(ECO, "רמות טרופיות ורשתות מזון"),
      efficiency: named(ECO, "יעילות אקולוגית"),
      pyramids: named(ECO, "פירמידות"),
    },
    "ec-biogeochemical": {
      principles: named(BGC),
      water: named(BGC, "מחזור המים"),
      carbon: named(BGC, "מחזור הפחמן"),
      nitrogen: named(BGC, "מחזור החנקן"),
      phosphorus: named(BGC, "מחזור הזרחן"),
      decomposition: named(BGC, "פירוק ומחזור נוטריינטים"),
    },
    "ec-diversity": {
      measuring: named(DIV, "עושר ואחידות"),
      "species-area": heading(DIV, "עקומת מינים-שטח"),
      latitude: heading(DIV, "מפל המגוון לפי קו רוחב"),
      islands: heading(DIV, "תיאוריית האיים"),
      local: named(DIV, "מה שומר על מגוון"),
      function: heading(DIV, "מגוון, יציבות ותפקוד"),
    },
    "ec-succession": {
      what: named(SUCC),
      mechanisms: heading(SUCC, "המנגנונים של קונל וסלטייר"),
      "glacier-bay": heading(SUCC, "מפרץ גליישר"),
      carmel: heading(SUCC, "הכרמל אחרי שריפה"),
      climax: named(SUCC, "קלימקס"),
      maturation: named(SUCC, "התבגרות המערכת"),
    },
    "ec-human-impact": {
      footprint: exam25("טביעת רגל אקולוגית, והחלק בכדור הארץ שהאדם שינה"),
      endangered: syl25("אקולוגיית שימור: מינים בסכנה ומאמצי הצלה עולמיים"),
      crisis: named(HUMAN),
      habitat: named(HUMAN, "אובדן בתי גידול וקיטוע"),
      invasive: named(HUMAN, "מינים פולשים"),
      overharvest: named(HUMAN, "ניצול יתר"),
      pollution: named(HUMAN, "זיהום"),
      climate: named(HUMAN, "שינוי אקלים"),
      conservation: named(HUMAN, "מעורבות — שמירה ושיקום"),
    },
  },
};
