import type { CourseScope, ScopeEntry } from "./types";

// Technion 134155 "אנדוקרינולוגיה". Evidence available (2026-10-23; עודכן 2026-11-08 — בדרייב נמצאו לוח הקורס 2024-25 וסיכומי התרגולים של רות ראובן, ולכן יש כעת גם ראיית "staff-material"): the current portal paragraph (nine topics) and
// the official book list (not on disk). No reading list, exams or staff material (Moodle closed to guests). Levels
// reviewed with Codex before writing: "core" where the paragraph names the subject or the section is the minimum
// needed to explain a named heading; "likely" for elaboration under a heading.

const named = (topic: string, what?: string): ScopeEntry => ({
  level: "core", evidence: "syllabus-named",
  noteHe: what ? `הסילבוס הרשמי: "${topic}" — ${what}` : `הסילבוס הרשמי: "${topic}"`,
});
const heading = (topic: string, what: string): ScopeEntry => ({
  level: "likely", evidence: "syllabus-heading",
  noteHe: `נכלל בנושא "${topic}" בסילבוס, אבל ${what} לא מוזכר בשמו`,
});

const INTRO = "מבוא: מה עושים הורמונים ומה היא המערכת האנדוקרינית";
const TYPES = "סוגים של הורמונים ורצפטורים, ומנגנוני ההשפעה שלהם";
const CTRL = "בקרה על פעילות הורמונאלית והמערכת האנדוקרינית";
const PIT = "ההיפופיזה - בלוטה מרכזית במערכת האנדוקרינית";
const GROW = "הבקרה האנדוקרינית על גדילה";
const THY = "בלוטת המגן";
const REPRO = "תפקידי המערכת האנדוקרינית ברבייה";
const ADR = "בלוטת האדרנל וסטראוידוגנזה";
const PANC = "הלבלב וסוכרת";

// Staff material found in the Drive (2026-11-08): the 2024-25 course schedule lists the tutorials by name, and
// Ruth Reuven's 2024 tutorial summaries are the source for the two units below.
const sched = (what: string): ScopeEntry => ({
  level: "core", evidence: "staff-material",
  noteHe: `לוח הקורס 2024-25 מקדיש לנושא מפגש דיון שלם — ${what}`,
});
const tut = (n: string, what: string): ScopeEntry => ({
  level: "core", evidence: "staff-material",
  noteHe: `לוח הקורס 2024-25 וסיכומי התרגולים של רות ראובן — תרגול ${n}: ${what}`,
});

export const technionEndocrinologyScope: CourseScope = {
  courseSlug: "technion-endocrinology",
  checkedAt: "2026-11-08",
  defaultSource: { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134155" },
  sections: {
    "en-intro": {
      what: named(INTRO, "מה עושים הורמונים"),
      signaling: named(INTRO, "המערכת האנדוקרינית"),
      classes: named(TYPES, "סוגים של הורמונים"),
      transport: heading(TYPES, "הובלה בדם וחלבונים נושאים"),
      clearance: heading(TYPES, "פינוי וזמן מחצית חיים"),
    },
    "en-receptors": {
      families: named(TYPES, "סוגי רצפטורים"),
      gpcr: named(TYPES, "מנגנוני ההשפעה"),
      rtk: named(TYPES, "מנגנוני ההשפעה"),
      nuclear: named(TYPES, "מנגנוני ההשפעה"),
      regulation: heading(TYPES, "ויסות מספר הקולטנים ורגישותם"),
    },
    "en-control": {
      negative: named(CTRL),
      axis: named(CTRL),
      positive: heading(CTRL, "משוב חיובי"),
      rhythms: heading(CTRL, "הפרשה בפעימות וקצב יומי"),
      diagnosis: heading(CTRL, "אבחון תקלה ראשונית מול משנית"),
    },
    "en-pituitary": {
      "two-glands": named(PIT),
      portal: heading(PIT, "מערכת השער"),
      anterior: named(PIT, "הורמוני ההיפופיזה הקדמית"),
      prolactin: named(PIT, "פרולקטין ועיכוב דופמינרגי"),
      posterior: named(PIT, "ההיפופיזה האחורית"),
    },
    "en-growth": {
      axis: named(GROW),
      igf: named(GROW),
      actions: named(GROW),
      "growth-plate": heading(GROW, "לוחית הגדילה"),
      other: heading(GROW, "הורמונים נוספים בגדילה"),
      disorders: heading(GROW, "עודף וחוסר בהורמון גדילה"),
    },
    "en-thyroid": {
      structure: named(THY),
      synthesis: named(THY, "ייצור ההורמונים"),
      "t4-t3": heading(THY, "דה-יודינאזות והפעלה היקפית"),
      regulation: named(THY, "הבקרה"),
      actions: named(THY, "הפעולות"),
      disorders: heading(THY, "מחלות התריס"),
    },
    "en-hpg": {
      axis: named(REPRO, "ציר GnRH–LH/FSH"),
      "gnrh-neurons": heading(REPRO, "תאי ה-GnRH ותסמונת קלמן"),
      pulses: named(REPRO, "הפרשת GnRH בפעימות"),
      feedback: named(REPRO, "המשוב מהגונדות"),
      kisspeptin: heading(REPRO, "קיספפטין"),
      puberty: heading(REPRO, "גיל ההתבגרות"),
    },
    "en-reproduction": {
      testis: named(REPRO, "האשך"),
      follicle: named(REPRO, "הזקיק"),
      "ovarian-cycle": named(REPRO, "המחזור החודשי"),
      "uterine-cycle": named(REPRO, "המחזור ברחם"),
      pregnancy: heading(REPRO, "הורמוני ההריון"),
      differentiation: heading(REPRO, "התמיינות מינית"),
    },
    "en-adrenal": {
      structure: named(ADR),
      steroidogenesis: named(ADR, "סטראוידוגנזה"),
      cortisol: named(ADR, "קורטיזול"),
      aldosterone: named(ADR, "אלדוסטרון"),
      medulla: named(ADR, "ליבת האדרנל"),
      disorders: heading(ADR, "קושינג, אדיסון והיפרפלזיה מולדת"),
    },
    "en-pancreas": {
      islets: named(PANC),
      secretion: named(PANC, "הפרשת אינסולין"),
      "insulin-actions": named(PANC, "פעולות האינסולין"),
      glucagon: named(PANC, "גלוקגון"),
      diabetes: named(PANC, "סוכרת"),
    },
    "en-puberty": {
      continuum: sched("התבגרות: הציר מהעובר ועד הבגרות, וההפסקה היובנילית"),
      brake: sched("העיכוב על מחולל הפעימות של GnRH ושחרורו"),
      "two-processes": sched("גונדרכה ואדרנרכה כשני תהליכים נפרדים"),
      tanner: sched("שלבי טאנר וסדר הופעת הסימנים"),
      secular: { level: "likely", evidence: "syllabus-heading", noteHe: "המגמה ההיסטורית בגיל ההתבגרות — מופיעה בספר הקורס (Williams פרק 25) אך לא בשם בלוח הקורס" },
      disorders: sched("חריגות בעיתוי ההתבגרות — מוקדמת ומאוחרת"),
    },
    "en-pregnancy": {
      hcg: sched("היריון: hCG והשמירה על הגופיף הצהוב"),
      placenta: sched("השליה כאיבר אנדוקריני"),
      thyroid: sched("שינויי בלוטת התריס בהיריון"),
      metabolic: sched("עמידות לאינסולין וסוכרת הריונית"),
      volume: { level: "likely", evidence: "syllabus-heading", noteHe: "ההסתגלויות בנפח הדם ובכליה — מופיעות בספר הקורס (Williams פרק 21) כחלק מהמפגש, אך לא בשמן בלוח" },
      parturition: sched("פרולקטין, לידה והנקה"),
    },
    "en-methods": {
      challenge: tut("2 (שיטות)", "למה קשה למדוד הורמון — ריכוזים נמוכים ומולקולות דומות"),
      competitive: tut("2 (שיטות)", "RIA ו-ELISA תחרותית"),
      sandwich: tut("2 (שיטות)", "ELISA סנדוויץ' ובדיקות ביתיות"),
      "mass-spec": tut("2 (שיטות)", "ספקטרומטריית מסה וכרומטוגרפיה (TLC מופיע בלוח הקורס)"),
      histology: tut("2 (שיטות)", "היסטולוגיה — מופיעה גם כמטלה וגם כתרגול כיתה"),
    },
    "en-steroids-disruptors": {
      nomenclature: tut("4 (סטרואידוגנזה)", "סיסטמטיקה של שמות סטרואידים — הבסיס למטלה 2"),
      steroidogenesis: tut("4 (סטרואידוגנזה)", "STAR, P450scc, והתלות ברקמה ובאנזימים"),
      disruptors: tut("4 (סטרואידוגנזה)", "משבשים אנדוקריניים — חלק שני של התרגול"),
      anabolic: tut("5 (סטרואידים אנבוליים)", "סטרואידים אנבוליים, מנגנונים ותופעות לוואי"),
      mechanisms: tut("5 (סטרואידים אנבוליים)", "מנגנוני ההשפעה על השריר"),
      "side-effects": tut("5 (סטרואידים אנבוליים)", "תופעות לוואי והפיכותן"),
    },
  },
};
