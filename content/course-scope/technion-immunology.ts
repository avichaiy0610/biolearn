import type { CourseScope, ScopeEntry } from "./types";

// Technion 276413 "אימונולוגיה בסיסית". Evidence available (2026-10-23): the current portal paragraph (24 topics) and
// the parallel 274261 schedule (same lecturers — supporting evidence only). No reading list, exams or staff material
// (Moodle closed to guests). Levels reviewed with Codex before writing: "core" where the paragraph names the subject
// or the section is the minimum needed to explain it; "likely" for elaboration under a heading (incl. topics that
// only the parallel course names, such as vaccines and drug allergy).

const named = (topic: string, what?: string): ScopeEntry => ({
  level: "core", evidence: "syllabus-named",
  noteHe: what ? `הסילבוס הרשמי: "${topic}" — ${what}` : `הסילבוס הרשמי: "${topic}"`,
});
const heading = (topic: string, what: string): ScopeEntry => ({
  level: "likely", evidence: "syllabus-heading",
  noteHe: `נכלל בנושא "${topic}" בסילבוס, אבל ${what} לא מוזכר בשמו`,
});

// 2026-11-08: the course's own winter 2024-25 syllabus (12 weeks; syllabuses/_text/סיליבוס מעודכן 12 שבועות ... 2760413 ...)
// does not teach hypersensitivity, transplantation, immunodeficiency or the pathogen-by-pathogen part of infection; the
// Feb 2025 exam uses them only as context. Those sections are "extension". Vaccines stay core (syllabus week 9).
const NOT2425 = (what: string): ScopeEntry => ({
  level: "extension", evidence: "none",
  noteHe: `${what} — מופיע ברשימת הנושאים בפורטל, אבל לא בלוח הקורס לחורף תשפ"ה (12 שבועות), ובמבחן פברואר 2025 רק כהקשר לשאלה על נושא אחר`,
});
const WEEK = (n: number, what: string): ScopeEntry => ({
  level: "core", evidence: "staff-material",
  noteHe: `לוח הקורס חורף תשפ"ה, שבוע ${n} — ${what}`,
});

const INTRO = "מבוא לחסינות טבעית ונרכשת";
const LYMPH = "מערכת הלימפטית: איברים, רקמות, תאים";
const COMPL = "משלים בחסינות הומורלית ובדלקת";
const AB = "נוגדנים: קבוצות ותת קבוצות - מבנה ותפקיד";
const AG = "מהות האנטיגנים";
const TYPES = "אידיוטיפ, אלוטיפ, אזוטיפ של הנוגדן";
const HYB = "היברידומות";
const ASSAY = "תבחינים אימוניים";
const GEN = "גנטיקה וביוסינטזה של נוגדנים";
const CELLS = "תאים ותפקידים ביולוגיים בתגובות חיסון";
const MHC = "גנטיקה ותפקוד האתר העיקרי לסווג רקמות";
const TCR = "הקולטן של תאי T";
const CYTO = "ציטוקינים, לימפוקינים";
const ADH = "דלקת, מולקולות הדבקה";
const MIG = "נדידת תאים ויחסי גומלין בין תאים";
const HELP = "תאי עזר";
const TOL = "סבילות טבעית ונרכשת";
const AUTO = "אוטואימוניות";

export const technionImmunologyScope: CourseScope = {
  courseSlug: "technion-immunology",
  checkedAt: "2026-11-08",
  defaultSource: { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/276413" },
  sections: {
    "im-intro": {
      arms: named(INTRO),
      cells: named(LYMPH, "תאים"),
      organs: named(LYMPH, "איברים ורקמות"),
      "lymph-node": heading(LYMPH, "מבנה בלוטת הלימפה וסחרור לימפוציטים"),
    },
    "im-innate": {
      barriers: named(INTRO, "חסינות טבעית"),
      prr: heading(INTRO, "הקולטנים לזיהוי דפוסים"),
      phagocytes: named(CELLS, "תאים בולעים ותאי NK"),
      complement: named(COMPL),
      inflammation: named(ADH, "דלקת"),
    },
    "im-antibodies": {
      antigens: named(AG),
      structure: named(AB, "מבנה"),
      classes: named(AB, "קבוצות ותת-קבוצות"),
      "isotype-allotype-idiotype": named(TYPES),
      hybridomas: named(HYB),
      assays: named(ASSAY),
    },
    "im-ig-genetics": {
      problem: named(GEN),
      vdj: named(GEN, "צירוף V(D)J"),
      diversity: named(GEN, "מקורות הגיוון"),
      "allelic-exclusion": heading(GEN, "הדרה אללית"),
      "csr-shm": named(GEN, "החלפת איזוטיפ והיפר-מוטציה"),
      biosynthesis: named(GEN, "ביוסינטזה"),
    },
    "im-b-cells": {
      development: heading(CELLS, "שלבי ההתפתחות של תאי B"),
      bcr: named(CELLS, "תאי B"),
      "t-dependent": named(CELLS, "תגובה תלוית T"),
      "germinal-center": heading(CELLS, "מרכז הנבט"),
      subsets: heading(CELLS, "תת-סוגים של תאי B"),
    },
    "im-mhc": {
      genetics: named(MHC, "גנטיקה"),
      structure: named(MHC, "מבנה ותפקוד"),
      pathways: named(MHC, "הצגת אנטיגנים"),
      "cross-presentation": heading(MHC, "הצגה צולבת"),
      restriction: named(MHC, "הגבלה ל-MHC"),
    },
    "im-t-cells": {
      tcr: named(TCR),
      thymus: heading(CELLS, "הבחירה בתימוס"),
      activation: named(CELLS, "הפעלת תאי T"),
      checkpoints: heading(CELLS, "נקודות בקרה"),
    },
    "im-cytokines": {
      what: named(CYTO),
      key: named(CYTO, "ציטוקינים מרכזיים"),
      receptors: heading(CYTO, "קולטני הציטוקינים ו-JAK–STAT"),
      chemokines: named(MIG, "כמוקינים ונדידה"),
      extravasation: named(ADH, "מולקולות הדבקה"),
    },
    "im-effector": {
      polarization: named(HELP),
      helpers: named(HELP),
      ctl: named(CELLS, "תאים ציטוטוקסיים"),
      interactions: named(MIG, "יחסי גומלין בין תאים"),
      memory: heading(CELLS, "תאי זיכרון"),
    },
    "im-tolerance": {
      definition: named(TOL),
      central: named(TOL, "סבילות מרכזית"),
      peripheral: named(TOL, "סבילות היקפית"),
      autoimmunity: named(AUTO),
    },
    "im-infection": {
      "by-pathogen": NOT2425("התגובה לפי סוג הפתוגן"),
      evasion: NOT2425("התחמקות של פתוגנים"),
      mucosa: NOT2425("חסינות הריריות"),
      neonate: NOT2425("חסינות ביילוד"),
      vaccines: WEEK(9, "\"Into to vaccination\""),
    },
    "im-hypersensitivity": {
      types: NOT2425("סוגי רגישות היתר"),
      "type-1": NOT2425("אלרגיה (סוג I)"),
      "type-2": NOT2425("סוג II"),
      "type-3": NOT2425("סוג III"),
      "type-4": NOT2425("סוג IV"),
      drugs: NOT2425("אלרגיה לתרופות"),
    },
    "im-transplant": {
      terms: NOT2425("מונחי יסוד בהשתלות"),
      alloreactivity: NOT2425("אלוריאקטיביות"),
      recognition: NOT2425("זיהוי השתל"),
      rejection: NOT2425("דחייה"),
      matching: NOT2425("התאמה ובדיקות לפני השתלה"),
      immunosuppression: NOT2425("דיכוי חיסוני"),
      hsct: NOT2425("השתלת מח עצם ו-GVHD"),
    },
    "im-immunodeficiency": {
      "by-infection": NOT2425("חסרים חיסוניים לפי סוג הזיהום"),
      "b-defects": NOT2425("חסרים בתאי B"),
      scid: NOT2425("SCID"),
      "phagocyte-complement": NOT2425("חסרים בתאים בולעים ובמשלים"),
      hiv: NOT2425("HIV"),
      aids: NOT2425("איידס"),
    },
  },
};
