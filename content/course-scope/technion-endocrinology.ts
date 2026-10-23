import type { CourseScope, ScopeEntry } from "./types";

// Technion 134155 "אנדוקרינולוגיה". Evidence available (2026-10-23): the current portal paragraph (nine topics) and
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

export const technionEndocrinologyScope: CourseScope = {
  courseSlug: "technion-endocrinology",
  checkedAt: "2026-10-23",
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
  },
};
