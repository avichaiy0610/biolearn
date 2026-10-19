import type { CourseScope, ScopeEntry } from "./types";

// Technion 134019 "מבוא לביוכימיה ואנזימולוגיה". Evidence available (2026-10-19): the official topic list on
// the students portal only. No public exams, reading list or staff material were found (Moodle is closed to
// guests). So the strongest possible level here is "syllabus-named". Generated from `scope --suggest`,
// reviewed row by row.
//
// Rule: core = the syllabus names the topic, or a topic the section is part of BY DEFINITION
// (keratin and collagen are "fibrous proteins"); likely = only related to a named topic (a textbook example).

const named = (topic: string, what?: string): ScopeEntry => ({
  level: "core", evidence: "syllabus-named",
  noteHe: what ? `הסילבוס הרשמי: "${topic}" — ${what}` : `הסילבוס הרשמי: "${topic}"`,
});
const heading = (topic: string, what: string): ScopeEntry => ({
  level: "likely", evidence: "syllabus-heading",
  noteHe: `נכלל בכותרת הסילבוס "${topic}", אבל ${what} לא מוזכר בשמו`,
});

// Official topics (verbatim, from the portal).
const AA = "המבנה והתכונות של חומצות אמינו";
const PEP = "תכונות כימיות ופיסיקאליות של פפטידים וחלבונים: מבנה ראשוני, שניוני ושלישוני";
const FOLD = "תהליך הקיפול של חלבונים ותפקוד של השפרונים";
const FIB = "תכונות ייחודיות לחלבונים סיביים, מבניים וממברנאלים";
const ISO = "בידוד והפרדה של חלבונים";
const HB = "מבנה רביעוני: המוגלובין כמודל לאינטראקציות קואופרטיביות";
const ENZ = "אנזימים, עקרונות הקטליזה האנזימתית, קואנזימים וקופקטורים";
const KIN = "קינטיקה אנזימתית";
const SITE = "מבנה האתר הפעיל ומנגנוני קטליזה נפוצים";
const REG = "בקרת פעולתם של אנזימים ומנגנוני עיכוב שונים";
const PTM = "בקרה של אנזימים על ידי מודיפיקציות אחר-תרגומיות";
const CL = "מבוא למבנה ותפקוד של סוכרים וליפידים";

export const technionBiochemIntroScope: CourseScope = {
  courseSlug: "technion-biochem-intro",
  checkedAt: "2026-10-19",
  defaultSource: { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134019" },
  sections: {
    "amino-acids": {
      structure: named(AA), ionization: named(AA, "תכונות"), groups: named(AA), charge: named(AA, "תכונות"),
      peptide: named(PEP, "הקשר הפפטידי"),
    },
    "protein-structure": {
      levels: named(PEP), backbone: named(PEP, "תכונות פיסיקאליות של השלד"), secondary: named(PEP), tertiary: named(PEP),
      quaternary: named(HB),
    },
    "protein-folding": {
      anfinsen: named(FOLD), cooperative: named(FOLD), pathway: named(FOLD), chaperones: named(FOLD),
      misfolding: heading(FOLD, "קיפול שגוי, עמילואיד ופריונים"),
    },
    "fibrous-membrane": {
      fibrous: named(FIB), keratin: named(FIB, "קרטין הוא חלבון סיבי"), collagen: named(FIB, "קולגן הוא חלבון סיבי"),
      membrane: named(FIB),
      hydropathy: heading(FIB, "עקומת הידרופתיה"),
    },
    "protein-methods": {
      assay: named(ISO), solubility: named(ISO), chromatography: named(ISO), electrophoresis: named(ISO),
      evaluation: named(ISO), mass: named(ISO, "אולטרה-צנטריפוגה היא שיטת הפרדה"),
    },
    hemoglobin: {
      myoglobin: heading(HB, "מיוגלובין"),
      heme: named(HB), cooperativity: named(HB), models: named(HB), effectors: named(HB),
      sickle: heading(HB, "אנמיה חרמשית"),
    },
    "enzyme-principles": {
      catalysis: named(ENZ), cofactors: named(ENZ), thermo: named(ENZ, "עקרונות הקטליזה"), transition: named(ENZ, "עקרונות הקטליזה"),
      "active-site": named(SITE),
    },
    "enzyme-kinetics": {
      rates: named(KIN), michaelis: named(KIN), parameters: named(KIN), lineweaver: named(KIN),
      reversible: named(REG, "מנגנוני עיכוב"), irreversible: named(REG, "מנגנוני עיכוב"),
    },
    "catalytic-mechanisms": {
      strategies: named(SITE), chymotrypsin: named(SITE), specificity: named(SITE), "carbonic-anhydrase": named(SITE),
      restriction: heading(SITE, "אנזימי הגבלה"),
    },
    "allosteric-regulation": {
      feedback: named(REG), structure: named(REG), sigmoid: named(REG), effectors: named(REG),
      isozymes: heading(REG, "איזואנזימים"),
    },
    "covalent-regulation": {
      covalent: named(PTM), phosphorylation: named(PTM), pka: named(PTM), zymogens: named(PTM, "שפעול בחיתוך הוא שינוי אחר-תרגומי"),
      digestion: heading(PTM, "מפל העיכול ומעכבי פרוטאזות"),
      clotting: heading(PTM, "מפל הקרישה"),
    },
    "carbs-lipids": {
      monosaccharides: named(CL), rings: named(CL), reducing: named(CL), glycosidic: named(CL),
      "fatty-acids": named(CL), "membrane-lipids": named(CL), bilayer: named(CL),
    },
  },
};
