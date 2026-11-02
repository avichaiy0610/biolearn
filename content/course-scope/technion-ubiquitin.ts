import type { CourseScope, ScopeEntry } from "./types";

// Technion 134140 "יוביקוויטין ומחזור חלבונים". 2026-11-01: the course syllabus + schedule (Winter 2024-25) and the
// weekly quizzes were found in the Drive and are now the main evidence, alongside the portal paragraph.
// No reading list (the portal lists no books), no past exams, no staff material — Moodle is closed to guests and no
// detailed syllabus was found. Levels reviewed with Codex before writing: "core" where the paragraph names the subject
// ("components of the system, their structure and mode of action", "the proteasome mechanism", and each application
// area it lists) or where the section is the minimum framework for a named subject; "likely" for specific named
// proteins, examples and diseases that fall under a heading but are not named themselves. Nothing here is "extension":
// subtopics that Codex judged out of scope were not written at all.
// Honest limit: a 12-line paragraph cannot tell which named pathway the lecturer actually teaches inside each area.
// Every example chosen here is a representative one, not a reconstruction of the real lecture.

// The course's own syllabus and tentative schedule, Winter 2024-25 (Drive), and the weekly quizzes (Drive).
const sched24 = (what: string): ScopeEntry => ({
  level: "core", evidence: "syllabus-named",
  noteHe: `לוח ההרצאות והסילבוס של הקורס, חורף תשפ"ה: ${what}`,
});
const quiz = (what: string): ScopeEntry => ({
  level: "core", evidence: "staff-material",
  noteHe: `נשאל בבחנים השבועיים של הקורס: ${what}`,
});
const named = (topic: string, what?: string): ScopeEntry => ({
  level: "core", evidence: "syllabus-named",
  noteHe: what ? `תיאור הקורס: "${topic}" — ${what}` : `תיאור הקורס: "${topic}"`,
});
const heading = (topic: string, what: string): ScopeEntry => ({
  level: "likely", evidence: "syllabus-heading",
  noteHe: `נכלל בנושא "${topic}" בתיאור הקורס, אבל ${what} לא מוזכר בשמו`,
});

const SELECTIVE = "בקרה ביולוגית של מסלולים תאיים על ידי מערכת היוביקוויטין-פרוטאזום לפירוק חלבונים בררני";
const FATE = "כיצד סימון על-ידי יוביקוויטין או מולקולות דמויי יוביקוויטין משנה זיהוי חלבונים, אינטראקציות וגורל";
const PARTS = "מרכיבי המערכת, מבנם ואופן פעולתם";
const PROTEASOME = "מנגנון הפרוטאזום: מכונה ביולוגית תלוית אנרגיה";
const TRANSCRIPTION = "מעורבות בוויסות שעתוק";
const GENOME = "שלמות הגנום";
const CYCLE = "בקרת מחזור התא";
const CANCER = "סרטן, מוות תאי";
const NEURONS = "נוירונים, רגנרציה של נוירונים, מחלות ניווניות";
const IMMUNE = "התגובה החיסונית";

export const technionUbiquitinScope: CourseScope = {
  courseSlug: "technion-ubiquitin",
  checkedAt: "2026-11-01",
  defaultSource: { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134140" },
  sections: {
    "ub-conjugation": {
      ubiquitin: named(PARTS, "מבנה היוביקוויטין והקשר האיזופפטידי"),
      cascade: named(PARTS, "השפעול וההעברה E1–E2–E3"),
      "e3-types": named(PARTS, "משפחות ה-E3 ואופן פעולתן"),
      degrons: named(SELECTIVE, "איך נבחר המצע — דגרונים"),
      "quality-control": heading(SELECTIVE, "בקרת איכות ושפרונים"),
      measuring: heading(SELECTIVE, "מדידת קצב פירוק"),
    },
    "ub-code": {
      architectures: named(FATE, "צורות הסימון"),
      linkages: named(FATE, "סוגי השרשראות והמשמעות שלהן"),
      writers: named(PARTS, "מי קובע את סוג השרשרת"),
      readers: named(FATE, "זיהוי החלבון המסומן"),
      dubs: named(PARTS, "דה-יוביקוויטינאזות כרכיב במערכת"),
    },
    "ub-proteasome": {
      overview: named(PROTEASOME, "העיקרון של פרוטאזה בחלל סגור"),
      core: named(PROTEASOME, "הליבה 20S והאתרים הקטליטיים"),
      regulatory: named(PROTEASOME, "המכסה 19S"),
      cycle: named(PROTEASOME, "מחזור הפירוק ותלות האנרגיה"),
      alternatives: heading(PROTEASOME, "p97, מכסים חלופיים ופירוק בלי יוביקוויטין"),
      inhibitors: heading(PROTEASOME, "מעכבי פרוטאזום"),
    },
    "ub-like": {
      family: named(FATE, "משפחת המולקולות דמויות היוביקוויטין"),
      sumo: named(FATE, "SUMO כדוגמה לשינוי אינטראקציות"),
      nedd8: heading(PARTS, "נדילציה כמתג ההפעלה של ליגאזות הקולין"),
      lysosome: heading(SELECTIVE, "מיון לליזוזום ו-ESCRT"),
      autophagy: heading(SELECTIVE, "הגשר לאוטופגיה סלקטיבית"),
    },
    "ub-cell-cycle": {
      logic: named(CYCLE, "למה פירוק יוצר מעבר חד-כיווני"),
      "g1-s": heading(CYCLE, "p27, ציקלין E ו-Cdt1"),
      anaphase: named(CYCLE, "מעבר מטאפאזה-אנאפאזה"),
      late: heading(CYCLE, "APC/C עם Cdh1 ב-G1"),
      ordering: heading(CYCLE, "קביעת סדר הפירוק"),
    },
    "ub-transcription": {
      why: named(TRANSCRIPTION, "למה גורמי שעתוק קצרי-חיים"),
      wnt: heading(TRANSCRIPTION, "מסלול Wnt ו-β-קטנין"),
      activators: heading(TRANSCRIPTION, "פירוק Myc ופירוק תוך כדי פעולה"),
      histones: named(TRANSCRIPTION, "יוביקוויטינציה של היסטונים"),
      polii: heading(TRANSCRIPTION, "פירוק RNA פולימראז II שנתקע"),
    },
    "ub-genome": {
      pcna: named(GENOME, "PCNA וסובלנות לנזק"),
      dsb: named(GENOME, "סימון כרומטין סביב שבר דו-גדילי"),
      fanconi: heading(GENOME, "מסלול פנקוני"),
      p97: heading(GENOME, "הוצאת חלבונים מהכרומטין"),
    },
    "ub-cancer-death": {
      tumor: named(CANCER, "ליגאזות כאונקוגנים וכמדכאי גידול"),
      p53: named(CANCER, "p53 ו-MDM2"),
      death: named(CANCER, "IAPs ובקרת הקספאזות"),
      "tnf-switch": named(CANCER, "ההחלטה בין הישרדות למוות"),
      myeloma: heading(CANCER, "מעכבי פרוטאזום במיאלומה"),
      targeted: heading(CANCER, "דבק מולקולרי ו-PROTAC"),
    },
    "ub-neurons": {
      synapse: named(NEURONS, "פירוק בסינפסה ובפלסטיות"),
      axon: named(NEURONS, "רגנרציה של אקסונים"),
      parkin: named(NEURONS, "PINK1 ופרקין במחלות ניווניות"),
      inclusions: named(NEURONS, "צברים מסומנים ביוביקוויטין"),
    },
    "ub-immune": {
      antigen: named(IMMUNE, "יצירת פפטידים להצגה"),
      nfkb: named(IMMUNE, "הפעלת NF-κB"),
      off: heading(IMMUNE, "כיבוי האות ומחלות דלקתיות"),
      isg15: heading(FATE, "ISG15"),
      pathogen: heading(IMMUNE, "הכוונת ליגאז של המאכסן ע\"י פתוגן"),
      "apobec-discovery": heading(IMMUNE, "גילוי APOBEC3G והניסוי בתאים מתירים"),
    },
    // Prerequisite units (cell biology 134128), linked as refreshers.
    "cell-quality-control": {
      folding: heading(SELECTIVE, "קיפול ב-ER (רענון מקורס הקדם)"),
      calnexin: heading(SELECTIVE, "מחזור הקלנקסין (רענון מקורס הקדם)"),
      erad: heading(SELECTIVE, "ERAD (רענון מקורס הקדם)"),
      upr: heading(SELECTIVE, "UPR (רענון מקורס הקדם)"),
      ups: named(PARTS, "רענון מקורס הקדם"),
      regulated: named(SELECTIVE, "רענון מקורס הקדם"),
    },
    "cell-cycle-control": {
      phases: heading(CYCLE, "שלבי המחזור (רענון מקורס הקדם)"),
      cdk: heading(CYCLE, "Cdks וציקלינים (רענון מקורס הקדם)"),
      ubiquitin: named(CYCLE, "רענון מקורס הקדם"),
      licensing: heading(CYCLE, "רישוי השכפול (רענון מקורס הקדם)"),
      mitosis: heading(CYCLE, "המיטוזה (רענון מקורס הקדם)"),
      g1: heading(CYCLE, "Rb ו-E2F (רענון מקורס הקדם)"),
      p53: heading(CANCER, "p53 בנזק ל-DNA (רענון מקורס הקדם)"),
    },
    "ub-history": {
      turnover: sched24("L2: History and Discovery of the Ubiquitin Conjugation System"),
      "atp-paradox": quiz("מדוע התצפית שפרוטאוליזה תוך-תאית תלויה ב-ATP הייתה מפתיעה (בוחן 2)"),
      fractionation: quiz("ניסוי המפתח שהראה שבאאוקריוטים נדרש שלב סימון נוסף (בוחן 2)"),
      "two-atp": quiz("שני האנזימים במערכת שצורכים ATP (בוחן 2)"),
      cyclins: quiz("מדוע בקרת סינתזה לבדה אינה מסבירה את רמות הציקלינים (בוחן 2)"),
    },
    "ub-trafficking": {
      downregulation: sched24("L8_1: ubiquitin in endocytosis, receptor internalization"),
      escrt: sched24("Endocytosis, Internalization, MVB sorting"),
      mitophagy: sched24("L8_2: Autophagy — role of ubiquitin in autophagy and mitophagy; Parkin as a driver of mitophagy"),
      "which-pathway": heading(FATE, "ההבחנה הניסויית בין פירוק בפרוטאזום לפירוק בליזוזום"),
    },
    "ub-drugs": {
      "proteasome-inhibitors": sched24("L9: Drug Discovery Efforts in the UPS — inhibition of proteasome proteolytic activity, bortezomib"),
      "other-inhibitors": sched24("L9: inhibitors of E1, of ubiquitin-like activating enzymes, of DUBs, and interference with substrate recognition by E3s"),
      tpd: sched24("L10: PROTACS, molecular glues, and targeted protein degradation"),
      reading: sched24("עבודת הסיום: ביקורת על מאמר מ-2020–2024 והצעת מחקר להמשכו"),
    },
  },
};
