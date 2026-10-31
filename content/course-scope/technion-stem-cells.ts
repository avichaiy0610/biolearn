import type { CourseScope, ScopeEntry } from "./types";

// Technion 134137 "תאי גזע". Evidence available (2026-10-27): the current portal paragraph only — but it is unusually
// explicit and names seven topics, so a larger share of this course is "core" than in our other topics-only tracks.
// No exams, reading list, lecturer page or staff material. Levels: "core" where the paragraph names the topic or the
// section is part of it by definition; "likely" where the section is a teaching choice under a named heading;
// "extension" for what Codex marked optional, and for refresher sections of other courses not linked here.

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
const refresher = (topic: string, what: string, from: string): ScopeEntry => ({
  level: "likely", evidence: "syllabus-heading",
  noteHe: `נכלל בנושא "${topic}" בתיאור הקורס; ${what} — רענון רשות מקורס ${from}`,
});
const outside = (what: string): ScopeEntry => ({
  level: "extension", evidence: "none",
  noteHe: `${what} — סעיף ביחידה של קורס אחר שלא מקושר מהקורס הזה`,
});

const BROAD = "ידע רחב בנושא תאי גזע ומערכות התפתחותיות";
const EMB_ADULT = "הבדלים בין תאי גזע עובריים לתאי גזע בוגרים";
const CULTURE = "תנאי גידולם ואיפיונם";
const DIFF = "תהליכי התמיינות של תאי גזע לתאים משלושת שורות הנבט ולנגזרותיהם";
const HEAL = "שימושם למטרות ריפוי בהנדסת רקמות ובטיפול תאי";
const DRUGS = "שימושם בפיתוח תרופות והתחדשות רקמות";
const REPROG = "תהליך קבלת תאי גזע עובריים מתאים סומטים";
const CSC = "מה הם תאי גזע סרטניים";

export const technionStemCellsScope: CourseScope = {
  courseSlug: "technion-stem-cells",
  checkedAt: "2026-10-27",
  defaultSource: { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134137" },
  sections: {
    "sc-concepts": {
      definition: named(BROAD, "הגדרת תא גזע"),
      potency: named(BROAD, "מדרג הפוטנטיות"),
      division: heading(BROAD, "אופני חלוקה ואיזון המאגר"),
      assay: heading(BROAD, "ההגדרה כמבחן תפקודי"),
      clonality: heading(BROAD, "קלונליות"),
    },
    "sc-embryonic": {
      origin: named(EMB_ADULT, "מקור תאי הגזע העובריים"),
      network: named(EMB_ADULT, "רשת הפלוריפוטנטיות"),
      tension: heading(EMB_ADULT, "המתח בין יציבות להפיכות"),
      states: heading(EMB_ADULT, "מצבי פלוריפוטנטיות"),
      why: named(EMB_ADULT, "משמעות להמשך"),
    },
    "sc-adult": {
      niche: named(EMB_ADULT, "הנישה"),
      hsc: named(EMB_ADULT, "מערכת הדם כמקרה בוחן"),
      tissues: heading(EMB_ADULT, "השוואה בין רקמות"),
      tracing: heading(EMB_ADULT, "מעקב שושלות"),
      repair: named(DRUGS, "התחדשות רקמות: שיקום אנדוגני לעומת החלפה"),
    },
    "sc-culture": {
      conditions: named(CULTURE, "תנאי התרבית"),
      defined: named(CULTURE, "מערכות מוגדרות"),
      selection: heading(CULTURE, "ברירה בתרבית ויציבות גנומית"),
      characterisation: named(CULTURE, "אפיון"),
      assays: named(CULTURE, "מבחני יכולת"),
    },
    "sc-reprogramming": {
      "nuclear-transfer": named(REPROG, "העברת גרעין כקודמת"),
      screen: named(REPROG, "סריקת הגורמים"),
      framing: named(REPROG, "ניסוח מדויק של התוצאה"),
      efficiency: heading(REPROG, "יעילות התהליך"),
      memory: heading(REPROG, "איפוס חלקי וזיכרון אפיגנטי"),
      direct: heading(DIFF, "המרה ישירה כמסלול חלופי (\"בדרכים שונות\")"),
    },
    "sc-differentiation": {
      "spontaneous-directed": named(DIFF, "ספונטנית מול מכוונת"),
      recapitulation: named(DIFF, "שחזור אותות התפתחותיים"),
      timing: heading(DIFF, "סדר ותזמון"),
      "germ-layers": named(DIFF, "הבחירה בין שלוש שכבות הנבט"),
      "efficiency-purity": heading(DIFF, "יעילות וטוהר"),
      maturation: heading(DIFF, "בשלות תפקודית"),
    },
    "sc-derivatives": {
      neural: named(DIFF, "נגזרת אקטודרמלית"),
      cardiac: named(DIFF, "נגזרת מזודרמלית"),
      pancreatic: named(DIFF, "נגזרת אנדודרמלית"),
      pattern: heading(DIFF, "התבנית המשותפת"),
    },
    "sc-engineering": {
      "why-3d": named(HEAL, "ארגון מרחבי"),
      scaffold: named(HEAL, "פיגום"),
      mechanics: heading(HEAL, "סביבה מכנית"),
      vascularisation: named(HEAL, "אספקת חומרים"),
      organoids: heading(HEAL, "אברונים"),
    },
    "sc-therapy": {
      mechanism: named(HEAL, "מנגנוני טיפול תאי"),
      delivery: named(HEAL, "הגעה, הישרדות והשתלבות"),
      source: named(HEAL, "מקור עצמי מול תורם"),
      safety: named(HEAL, "בטיחות והיווצרות גידול"),
      clinical: heading(HEAL, "מצב קליני עדכני"),
      evidence: heading(HEAL, "ראיות לתועלת"),
    },
    "sc-drug-discovery": {
      logic: named(DRUGS, "מודל מחלה מתא מטופל"),
      controls: named(DRUGS, "בקרה איזוגנית"),
      phenotype: heading(DRUGS, "פנוטיפ מדיד"),
      screening: named(DRUGS, "סריקה לזיהוי מועמדים"),
      toxicity: named(DRUGS, "בדיקת רעילות"),
      limits: heading(DRUGS, "גבולות הניבוי"),
    },
    "sc-cancer-stem-cells": {
      "two-models": named(CSC, "מודל היררכי מול אבולוציה שיבוטית"),
      "origin-vs-propagating": named(CSC, "תא המוצא מול תא שמניע"),
      assay: named(CSC, "מבחן ההשתלה"),
      frequency: heading(CSC, "תדירות תלוית-מבחן"),
      plasticity: heading(CSC, "פלסטיות"),
      therapy: heading(CSC, "השלכות טיפוליות"),
    },
    "sc-review": {
      routes: named(BROAD, "השוואת מסלולים"),
      "evidence-ladder": heading(BROAD, "סולם הראיות"),
      distinctions: heading(BROAD, "ההבחנות החוזרות"),
      reading: heading(BROAD, "קריאת דיווח"),
      open: beyond("שאלות פתוחות בתחום"),
    },
    // optional refresher sections from other courses (NOT prerequisites)
    "dv-principles": {
      fate: refresher(BROAD, "גורל תאי", "ביולוגיה של ההתפתחות"),
      specification: refresher(BROAD, "ספציפיקציה", "ביולוגיה של ההתפתחות"),
      morphogens: refresher(DIFF, "מורפוגנים", "ביולוגיה של ההתפתחות"),
      induction: refresher(DIFF, "אינדוקציה", "ביולוגיה של ההתפתחות"),
      morphogenesis: outside("מורפוגנזה"),
    },
    "dv-genes": {
      forward: outside("גנטיקה קדמית"),
      tools: outside("כלים ניסויים"),
      "necessary-sufficient": refresher(DIFF, "נחיצות והספקה", "ביולוגיה של ההתפתחות"),
      enhancers: outside("מגברים"),
      "master-genes": refresher(DIFF, "גנים מרכזיים", "ביולוגיה של ההתפתחות"),
      determination: refresher(EMB_ADULT, "התחייבות", "ביולוגיה של ההתפתחות"),
      "cell-size": outside("גודל תא"),
    },
    "dv-vertebrate-axes": {
      "chick-early": outside("עובר העוף המוקדם"),
      "chick-axis": outside("ציר העוף"),
      "mouse-early": refresher(EMB_ADULT, "העובר המוקדם בעכבר", "ביולוגיה של ההתפתחות"),
      "mouse-axis": outside("ציר העכבר"),
      "left-right": outside("ציר שמאל-ימין"),
      organizers: outside("מארגנים"),
    },
    "dv-regeneration": {
      types: refresher(DRUGS, "סוגי התחדשות", "ביולוגיה של ההתפתחות"),
      planaria: outside("פלנריה"),
      salamander: outside("סלמנדרה"),
      "positional-memory": outside("זיכרון מיקומי"),
      mammals: refresher(DRUGS, "התחדשות ביונקים", "ביולוגיה של ההתפתחות"),
    },
    "cell-cycle-control": {
      phases: outside("שלבי מחזור התא"),
      cdk: outside("CDK"),
      ubiquitin: outside("יוביקוויטין"),
      licensing: outside("רישוי שכפול"),
      mitosis: outside("מיטוזה"),
      g1: refresher(CULTURE, "נקודת הבקרה ב-G1", "ביולוגיה של התא"),
      p53: refresher(CULTURE, "p53 ותגובה לנזק", "ביולוגיה של התא"),
    },
    "cell-ecm": {
      components: refresher(HEAL, "מרכיבי החומר החוץ-תאי", "ביולוגיה של התא"),
      proteoglycans: refresher(HEAL, "פרוטאוגליקנים", "ביולוגיה של התא"),
      collagen: refresher(HEAL, "קולגן", "ביולוגיה של התא"),
      elastin: outside("אלסטין"),
      fibronectin: refresher(HEAL, "פיברונקטין", "ביולוגיה של התא"),
      integrins: refresher(HEAL, "אינטגרינים", "ביולוגיה של התא"),
      "focal-adhesions": refresher(HEAL, "אתרי היצמדות מוקדיים", "ביולוגיה של התא"),
    },
    "cell-junctions": {
      roles: refresher(HEAL, "תפקידי החיבורים", "ביולוגיה של התא"),
      tight: refresher(HEAL, "חיבורים הדוקים", "ביולוגיה של התא"),
      adherens: refresher(HEAL, "חיבורי הידבקות", "ביולוגיה של התא"),
      desmosomes: refresher(HEAL, "דסמוזומים", "ביולוגיה של התא"),
      hemidesmosomes: outside("המי-דסמוזומים"),
      gap: outside("צמתי פער"),
    },
    "gx-epigenetics": {
      definition: refresher(REPROG, "מהי אפיגנטיקה", "בקרת הביטוי הגנטי"),
      heterochromatin: refresher(REPROG, "הטרוכרומטין", "בקרת הביטוי הגנטי"),
      polycomb: refresher(REPROG, "מערכת פוליקומב", "בקרת הביטוי הגנטי"),
      inheritance: refresher(REPROG, "הורשה אפיגנטית", "בקרת הביטוי הגנטי"),
      "x-inactivation": outside("השתקת X"),
      imprinting: outside("החתמה גנומית"),
    },
    "gx-chromatin-modifications": {
      barrier: refresher(REPROG, "הכרומטין כמחסום", "בקרת הביטוי הגנטי"),
      remodeling: refresher(REPROG, "שיפוץ כרומטין", "בקרת הביטוי הגנטי"),
      marks: refresher(REPROG, "סימוני היסטונים", "בקרת הביטוי הגנטי"),
      readers: refresher(REPROG, "קוראים", "בקרת הביטוי הגנטי"),
      "dna-methylation": refresher(REPROG, "מתילציה של DNA", "בקרת הביטוי הגנטי"),
      crosstalk: outside("שיח בין סימונים"),
    },
    "ca-nature": {
      "benign-malignant": outside("שפיר מול ממאיר"),
      classification: outside("סיווג גידולים"),
      monoclonal: refresher(CSC, "מקור מונוקלונלי", "ביולוגיה של הסרטן"),
      hallmarks: outside("מאפייני הסרטן"),
      age: outside("גיל וסרטן"),
    },
    "ca-multistep": {
      "initiation-promotion": outside("התחלה וקידום"),
      colon: outside("מודל המעי הגס"),
      instability: outside("אי-יציבות גנומית"),
      immortalization: outside("אלמוות"),
      recipe: outside("מתכון הטרנספורמציה"),
      heterogeneity: refresher(CSC, "אי-אחידות בגידול", "ביולוגיה של הסרטן"),
    },
    "ca-metastasis": {
      cascade: outside("מפל הגרורות"),
      emt: refresher(CSC, "מעבר אפיתל-מזנכימה", "ביולוגיה של הסרטן"),
      invasion: outside("פלישה"),
      colonization: outside("התיישבות"),
      dormancy: refresher(CSC, "רדימות", "ביולוגיה של הסרטן"),
    },
    "ca-microenvironment": {
      stroma: refresher(CSC, "סטרומה", "ביולוגיה של הסרטן"),
      cafs: outside("פיברובלסטים נלווים"),
      inflammation: outside("דלקת"),
      ecm: outside("חומר חוץ-תאי בגידול"),
      angiogenesis: outside("יצירת כלי דם"),
    },
  },
};
