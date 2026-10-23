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
const INF = "תנגודת לזיהומים";
const MUC = "חסינות של מערכת הריריות";
const NEO = "חסינות בילוד";
const HYPER = "אלרגיות ורגישויות יתר";
const TX = "ביולוגיה של השתלות";
const AIDS = "תסמונת הכשל החיסוני (AIDS)";
const PID = "הבסיס המולקולרי של חסרים חיסוניים ראשוניים";

export const technionImmunologyScope: CourseScope = {
  courseSlug: "technion-immunology",
  checkedAt: "2026-10-23",
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
      "by-pathogen": named(INF),
      evasion: heading(INF, "התחמקות של פתוגנים"),
      mucosa: named(MUC),
      neonate: named(NEO),
      vaccines: heading(INF, "חיסונים"),
    },
    "im-hypersensitivity": {
      types: named(HYPER),
      "type-1": named(HYPER, "אלרגיה (סוג I)"),
      "type-2": named(HYPER, "סוג II"),
      "type-3": named(HYPER, "סוג III"),
      "type-4": named(HYPER, "סוג IV"),
      drugs: heading(HYPER, "אלרגיה לתרופות"),
    },
    "im-transplant": {
      terms: named(TX),
      alloreactivity: named(TX),
      recognition: named(TX, "זיהוי השתל"),
      rejection: named(TX, "דחייה"),
      matching: heading(TX, "התאמה ובדיקות לפני השתלה"),
      immunosuppression: heading(TX, "דיכוי חיסוני"),
      hsct: heading(TX, "השתלת מח עצם ו-GVHD"),
    },
    "im-immunodeficiency": {
      "by-infection": named(PID),
      "b-defects": named(PID, "חסרים בתאי B"),
      scid: named(PID, "SCID"),
      "phagocyte-complement": named(PID, "חסרים בתאים בולעים ובמשלים"),
      hiv: named(AIDS, "HIV"),
      aids: named(AIDS),
    },
  },
};
