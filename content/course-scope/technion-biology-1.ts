import type { CourseScope, ScopeEntry } from "./types";

// Technion 134058 "ביולוגיה 1". Evidence available (2026-10-22): the course's own detailed syllabus, winter 2024 —
// 11 numbered topics, each with named subtopics and textbook chapters (a student upload on Scribd, read from page
// images) — and the current topic paragraph on the students portal. A section is "core" when a subtopic of the 2024
// syllabus (or the portal paragraph) names it, "likely" when it only falls under a topic heading. No past exams or
// staff material found (Moodle closed to guests).

const SYL = { labelHe: "סילבוס הקורס, חורף תשפ\"ד", url: "https://www.scribd.com/document/744244211" };
const named = (topic: string, what: string): ScopeEntry => ({
  level: "core", evidence: "syllabus-named", source: SYL,
  noteHe: `הסילבוס המפורט (תשפ"ד), נושא "${topic}": "${what}"`,
});
const portal = (what: string): ScopeEntry => ({
  level: "core", evidence: "syllabus-named",
  noteHe: `תיאור הקורס העדכני בפורטל: "${what}"`,
});
const heading = (topic: string, what: string): ScopeEntry => ({
  level: "likely", evidence: "syllabus-heading", source: SYL,
  noteHe: `נכלל בנושא "${topic}" בסילבוס, אבל ${what} לא מוזכר בשמו`,
});

const T1 = "הקדמה", T2 = "תצפית ניסוי וטעיה, הכלים בעזרתם חוקרים חיים", T3 = "חלבונים ואנזימים", T4 = "התא — כיחידת חיים";
const T5 = "התא האאוקריוטי — מבנה ותפקיד", T6 = "קרומים וטרנספורט של מומסים", T7 = "אנרגיה והתא", T8 = "חילוף חומרים בתא";
const T9 = "מבנה ותפקיד הגנים", T10 = "מעגל התא וחלוקתו", T11 = "דיפרנציאציה והתפתחות";

export const technionBiology1Scope: CourseScope = {
  courseSlug: "technion-biology-1",
  checkedAt: "2026-10-22",
  defaultSource: { labelHe: "תיאור הקורס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134058" },
  sections: {
    "b1-intro": {
      "what-is-life": named(T1, "הגדרות ומושגים בסיסיים"),
      origin: portal("האבולוציה הכימית"),
      history: named(T1, "ההיסטוריה של החיים על פני כדור הארץ"),
      domains: heading(T1, "החלוקה לשלוש מערכות"),
      hierarchy: named(T1, "היררכיה ביולוגית"),
      themes: heading(T1, "הרעיונות המארגנים (אבולוציה, זרימת מידע ואנרגיה)"),
    },
    "b1-science": {
      method: named(T2, "תצפית ניסוי וטעיה"),
      "experiment-design": named(T2, "תצפית ניסוי וטעיה"),
      theory: heading(T2, "ההבחנה בין השערה לתאוריה"),
      microscopy: named(T2, "הכלים בעזרתם חוקרים חיים"),
      fractionation: named(T2, "הכלים בעזרתם חוקרים חיים"),
      "model-organisms": heading(T2, "אורגניזמי מודל"),
    },
    "b1-proteins-enzymes": {
      "amino-acids": named(T3, "מבנה החומצה האמינית"),
      "structure-levels": named(T3, "מבנה החלבונים"),
      enzymes: named(T3, "אנזימים ופעילותם בתא"),
      "how-enzymes-work": named(T3, "אנזימים ופעילותם בתא"),
      rate: named(T3, "אנזימים ופעילותם בתא"),
      regulation: named(T3, "בקרת פעילות האנזימים"),
    },
    "b1-cells": {
      "cell-size": heading(T4, "היחס בין שטח הפנים לנפח"),
      common: named(T4, "התא — כיחידת חיים"),
      prokaryotic: named(T4, "תא פרוקריוטי"),
      eukaryotic: named(T4, "תא אאוקריוטי"),
      viruses: named(T4, "וירוסים מהם?"),
    },
    "b1-eukaryotic-cell": {
      map: named(T5, "אברונים ותפקודם"),
      nucleus: named(T5, "אברונים ותפקודם"),
      endomembrane: named(T5, "הרשתית האנדופלסמטית, מכשיר הגולג'י"),
      digestion: named(T5, "אברונים ותפקודם"),
      "energy-organelles": named(T5, "המיטוכונדריון; הכלורופלסט"),
      cytoskeleton: named(T5, "שלד התא"),
      "plant-vs-animal": named(T5, "התא הצמחי מול התא האנימלי"),
    },
    "b1-membranes": {
      water: named(T6, "המים הממס הביולוגי"),
      structure: named(T6, "מבנה ותכונות הקרומים"),
      "diffusion-osmosis": named(T6, "דיפוזיה, אוסמוזה"),
      passive: named(T6, "טרנספורט פסיבי ואקטיבי; נשאים ותעלות"),
      active: named(T6, "טרנספורט פסיבי ואקטיבי"),
      bulk: named(T6, "מעבר מולקולות גדולות דרך קרומים"),
    },
    "b1-energy": {
      "energy-forms": named(T7, "מאזן האנרגיה"),
      laws: named(T7, "חוקי התרמודינמיקה"),
      "free-energy": named(T7, "הבסיס הפיסיקלי למעברי אנרגיה בתא"),
      atp: named(T7, "ATP כמטבע האנרגיה בתאים"),
      coupling: named(T7, "ATP כמטבע האנרגיה בתאים"),
      "atp-cycle": named(T7, "ATP כמטבע האנרגיה בתאים"),
    },
    "b1-metabolism": {
      redox: named(T8, "ריאקציות חמצון-חיזור"),
      overview: named(T8, "מסלולים הקשורים בהפקת אנרגיה"),
      glycolysis: named(T8, "גליקוליזה"),
      fermentation: named(T8, "היווצרות אנרגיה מגלוקוז בהעדר חמצן; תסיסה כהלית ותסיסה לקטית"),
      krebs: named(T8, "מעגל החומצה הציטרית"),
      etc: named(T8, "שרשרת מעבר האלקטרונים"),
      chemiosmosis: named(T8, "התאוריה הכמואוסמוטית"),
    },
    "b1-dna": {
      "nucleic-acids": named(T9, "חומצות גרעין DNA, RNA"),
      evidence: named(T9, "מהם ההוכחות ש-DNA הוא החומר התורשתי"),
      "double-helix": named(T9, "חומצות גרעין DNA, RNA"),
      semiconservative: named(T9, "שכפול ה-DNA"),
      replication: named(T9, "שכפול ה-DNA"),
      fidelity: heading(T9, "דיוק השכפול, תיקון וטלומרים"),
    },
    "b1-gene-expression": {
      "central-dogma": named(T9, "מגן לחלבון — שעתוק ותרגום — מהגנוטיפ לפנוטיפ"),
      "rna-types": named(T9, "מגן לחלבון — שעתוק ותרגום"),
      transcription: named(T9, "מגן לחלבון — שעתוק ותרגום"),
      processing: portal("שעתוק ועבוד ר.נ.א."),
      "genetic-code": named(T9, "הצופן הגנטי"),
      translation: named(T9, "מגן לחלבון — שעתוק ותרגום"),
      regulation: named(T9, "בקרת התבטאות גנים"),
    },
    "b1-cell-division": {
      why: heading(T10, "תפקידי חלוקת התאים"),
      "binary-fission": named(T10, "חלוקת תאים פרוקריוטיים"),
      chromosomes: heading(T10, "מבנה הכרומוזום והפלואידיות"),
      "cell-cycle": named(T10, "מעגל התא האאוקריוטי"),
      mitosis: named(T10, "מיטוזה"),
      meiosis: named(T10, "מיוזה"),
      compare: named(T10, "מיטוזה; מיוזה"),
    },
    "b1-development": {
      processes: named(T11, "מהם תהליכי התפתחות"),
      "genomic-equivalence": named(T11, "תפקידי התבטאות גנים בהתפתחות"),
      "gene-expression": named(T11, "תפקידי התבטאות גנים בהתפתחות"),
      "cell-fate": named(T11, "איך נקבע \"גורלו\" של התא"),
      pattern: heading(T11, "מורפוגנים וגני Hox"),
      "stem-cells": named(T11, "תאי גזע עובריים ויישומים אפשריים ברפואה"),
    },
  },
};
