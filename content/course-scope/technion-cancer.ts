import type { CourseScope, ScopeEntry } from "./types";

// Technion 134129 "הביולוגיה של מחלת הסרטן". Evidence available (2026-10-26): the current portal paragraph (a topic
// list) and the book (Weinberg). No reading list, exams or staff material (Moodle closed to guests). The medicine
// course 274246 is a DIFFERENT course and is not evidence here. Levels: "core" where the paragraph names the topic
// (viral and cellular oncogenes, tumor suppressors, initiation/progression, apoptosis, microenvironment, degradation of
// cell-cycle regulators, tumor immunology, epigenetics) or the section is part of it by definition; "likely" where only
// the broad "biology of cancer"/"progression" wording covers it (opening unit, metastasis, immortalization,
// heterogeneity); "extension" for therapy-only sections (resistance to targeted drugs, CDK4/6 inhibitors).

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
  noteHe: `${what} — טיפול; תיאור הקורס לא מזכיר טיפולים, והסעיף הוא העשרה`,
});

const refresher = (topic: string, what: string): ScopeEntry => heading(topic, `${what} (רענון מקורס קדם)`);
const outside = (what: string): ScopeEntry => ({
  level: "extension", evidence: "none",
  noteHe: `${what} — סעיף ביחידה של קורס אחר שלא מקושר מהקורס הזה`,
});

const BIOLOGY = "היבטים תאיים, מיקרו-סביבתיים ומולקולריים של מחלת הסרטן: ביולוגיה של הסרטן";
const VIRAL = "גנים גורמי סרטן וירליים";
const CELLULAR = "גנים גורמי סרטן תאיים";
const FAMILIES = "משפחות גנים המתווכות התפתחות והתקדמות המחלה";
const SUPPRESSORS = "גנים מדכאי סרטן";
const MECHANISM = "המנגנון המולקולרי של איתחול והתקדמות סרטן";
const APOPTOSIS = "אפופטוזיס וסרטן";
const MICRO = "סרטן ומיקרו-סביבה";
const DEGRADATION = "תרומת פירוק תוך תאי של חלבוני-בקרת מחזור התא להתקדמות המחלה";
const IMMUNO = "מבוא לאימונולוגיה של הסרטן";
const EPI = "אפיגנטיקה של הסרטן";

export const technionCancerScope: CourseScope = {
  courseSlug: "technion-cancer",
  checkedAt: "2026-10-26",
  defaultSource: { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134129" },
  sections: {
    "ca-nature": {
      "benign-malignant": heading(BIOLOGY, "ההבחנה בין שפיר לממאיר"),
      classification: heading(BIOLOGY, "סיווג הגידולים"),
      monoclonal: heading(BIOLOGY, "שיבוטיות"),
      hallmarks: heading(BIOLOGY, "סימני ההיכר"),
      age: heading(BIOLOGY, "גיל וגורמי סביבה"),
    },
    "ca-viruses": {
      transformation: named(VIRAL, "טרנספורמציה ע\"י נגיף ראוס"),
      "proto-oncogene": named(VIRAL, "v-src ו-c-src"),
      "retrovirus-types": named(VIRAL, "נגיפי רטרו חריפים ואיטיים"),
      "dna-viruses": named(VIRAL, "נגיפי DNA, pRb ו-p53"),
      "human-viruses": heading(VIRAL, "רשימת הנגיפים באדם"),
    },
    "ca-oncogenes": {
      transfection: named(CELLULAR, "גילוי בטרנספקציה"),
      ras: named(CELLULAR, "RAS"),
      activation: named(CELLULAR, "דרכי ההפעלה"),
      myc: named(CELLULAR, "MYC"),
      cooperation: named(MECHANISM, "שיתוף פעולה בין אונקוגנים"),
    },
    "ca-growth-signaling": {
      autonomy: named(FAMILIES, "גורמי גדילה כאונקוגנים"),
      receptors: named(FAMILIES, "קולטנים"),
      "ras-raf": named(FAMILIES, "Ras, NF1 ו-BRAF"),
      pi3k: named(FAMILIES, "PI3K ו-PTEN"),
      wnt: named(SUPPRESSORS, "APC ומסלול Wnt"),
      resistance: beyond("עמידות לתרופות ממוקדות"),
    },
    "ca-tumor-suppressors": {
      fusion: named(SUPPRESSORS, "ניסויי איחוי"),
      "second-hit": named(SUPPRESSORS, "המכה השנייה"),
      exceptions: named(SUPPRESSORS, "חריגים למודל שתי המכות"),
      gatekeepers: named(SUPPRESSORS, "שומרי סף ומטפלים"),
      examples: named(SUPPRESSORS, "דוגמאות"),
    },
    "ca-rb-cell-cycle": {
      "restriction-point": named(SUPPRESSORS, "pRb ונקודת ההגבלה"),
      ckis: named(SUPPRESSORS, "p16 ומעכבי CDK"),
      "rb-pathway": named(SUPPRESSORS, "מסלול pRb בגידולים"),
      "tgf-beta": heading(SUPPRESSORS, "בלם ה-TGF-β"),
      "cdk46-inhibitors": beyond("מעכבי CDK4/6"),
    },
    "ca-p53-apoptosis": {
      definition: named(APOPTOSIS, "מהי אפופטוזיס"),
      p53: named(SUPPRESSORS, "p53"),
      "p53-mutant": named(SUPPRESSORS, "p53 בגידולים"),
      caspases: named(APOPTOSIS, "קספאזות"),
      intrinsic: named(APOPTOSIS, "המסלול הפנימי"),
      extrinsic: named(APOPTOSIS, "המסלול החיצוני"),
      evasion: named(APOPTOSIS, "התחמקות מאפופטוזיס"),
      drugs: heading(APOPTOSIS, "מחקי BH3"),
    },
    "ca-degradation": {
      logic: named(DEGRADATION, "סוגי התקלות בפירוק"),
      "skp2-p27": named(DEGRADATION, "Skp2 ו-p27"),
      fbxw7: named(DEGRADATION, "FBXW7 ומצעיו"),
      "apc-c": named(DEGRADATION, "APC/C ונקודת הבקרה של הציר"),
      "other-axes": heading(DEGRADATION, "MDM2, VHL ו-β-TrCP"),
      drugs: heading(DEGRADATION, "תרופות על מערכת הפירוק"),
    },
    "ca-multistep": {
      "initiation-promotion": named(MECHANISM, "איתחול וקידום"),
      colon: named(MECHANISM, "התקדמות בשלבים"),
      instability: named(MECHANISM, "אי-יציבות גנומית"),
      immortalization: heading(MECHANISM, "טלומרים והנצחה"),
      recipe: heading(MECHANISM, "הפיכת תא אנושי לסרטני"),
      heterogeneity: heading(MECHANISM, "הטרוגניות ותאי גזע סרטניים"),
    },
    "ca-microenvironment": {
      stroma: named(MICRO, "הסטרומה ואיתות הדדי"),
      cafs: named(MICRO, "פיברובלסטים"),
      inflammation: named(MICRO, "מקרופאגים ודלקת"),
      ecm: named(MICRO, "המטריצה"),
      angiogenesis: named(MICRO, "כלי דם"),
    },
    "ca-metastasis": {
      cascade: heading(MECHANISM, "מפל הגרורות"),
      emt: heading(MECHANISM, "EMT"),
      invasion: heading(MECHANISM, "פלישה"),
      colonization: heading(MECHANISM, "התבססות והעדפת איברים"),
      dormancy: heading(MECHANISM, "תרדמה"),
    },
    "ca-immunology": {
      surveillance: named(IMMUNO, "שמירה חיסונית"),
      antigens: named(IMMUNO, "אנטיגנים של גידול"),
      immunoediting: named(IMMUNO, "עריכה חיסונית"),
      escape: named(IMMUNO, "התחמקות"),
      checkpoints: named(IMMUNO, "נקודות בקרה חיסוניות"),
    },
    "ca-epigenetics": {
      methylation: named(EPI, "מתילציה בגידולים"),
      silencing: named(EPI, "השתקה של מדכאי גידול"),
      regulators: named(EPI, "מוטציות במנגנון האפיגנטי"),
      consequences: named(EPI, "ההשפעה על התא"),
      drugs: heading(EPI, "מעכבי DNMT"),
    },
    // refreshers from prerequisite or neighbouring courses (linked before the unit that needs them)
    "hg-cancer": {
      evolution: refresher(MECHANISM, "סרטן כאבולוציה של תאים"),
      oncogenes: refresher(CELLULAR, "אונקוגנים"),
      "two-hit": refresher(SUPPRESSORS, "מודל שתי המכות"),
      syndromes: outside("תיקון DNA ותסמונות תורשתיות"),
      "synthetic-lethality": outside("קטלניות סינתטית"),
    },
    "cell-rtk": {
      activation: outside("הפעלת RTK"),
      sh2: outside("אתרי עגינה"),
      ras: refresher(FAMILIES, "מסלול Ras–MAPK"),
      pi3k: refresher(FAMILIES, "מסלול PI3K–Akt"),
      "jak-stat": outside("JAK–STAT"),
      drugs: outside("תרופות ממוקדות"),
    },
    "cell-cycle-control": {
      phases: outside("שלבי מחזור התא"),
      cdk: refresher(SUPPRESSORS, "Cdks וציקלינים"),
      ubiquitin: outside("שתי מערכות פירוק"),
      licensing: outside("רישוי שכפול"),
      mitosis: outside("מיטוזה"),
      g1: refresher(SUPPRESSORS, "Rb ו-E2F"),
      p53: refresher(APOPTOSIS, "p53 ונזק ל-DNA"),
    },
    "ub-cancer-death": {
      tumor: outside("ליגאזות כאונקוגנים"),
      p53: refresher(APOPTOSIS, "p53 ו-MDM2"),
      death: refresher(APOPTOSIS, "IAPs ו-SMAC"),
      "tnf-switch": outside("RIPK1"),
      myeloma: outside("מיאלומה"),
      targeted: outside("תרופות שמכוונות ליגאז"),
    },
    "ub-cell-cycle": {
      logic: refresher(DEGRADATION, "ההיגיון של פירוק במחזור התא"),
      "g1-s": refresher(DEGRADATION, "SCF ב-G1/S"),
      anaphase: outside("APC/C-Cdc20"),
      late: outside("APC/C-Cdh1"),
      ordering: outside("סדר הפירוק"),
    },
    "cell-ecm": {
      components: outside("מרכיבי המטריצה"),
      proteoglycans: outside("פרוטאוגליקנים"),
      collagen: outside("קולגן"),
      elastin: outside("אלסטין"),
      fibronectin: outside("פיברונקטין"),
      integrins: refresher(MICRO, "אינטגרינים"),
      "focal-adhesions": outside("מגעי היצמדות"),
    },
    "im-effector": {
      polarization: outside("בחירת הכיוון"),
      helpers: outside("תאי עזר"),
      ctl: refresher(IMMUNO, "תאים ציטוטוקסיים"),
      interactions: outside("יחסי גומלין"),
      memory: outside("זיכרון"),
    },
    "gx-epigenetics": {
      definition: outside("הגדרת אפיגנטיקה"),
      heterochromatin: outside("הטרוכרומטין"),
      polycomb: refresher(EPI, "Polycomb"),
      inheritance: outside("העברה בשכפול"),
      "x-inactivation": outside("השבתת X"),
      imprinting: outside("החתמה"),
    },
  },
};
