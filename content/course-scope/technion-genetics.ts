import type { CourseScope, ScopeEntry } from "./types";

// Technion 134020 "גנטיקה כללית". Evidence available (2026-10-18): the official topic list on
// the students portal only. No public exams, reading list or staff material were found
// (Moodle is closed to guests). So the strongest possible level here is "syllabus-named".
//
// Rule: core = the syllabus names the topic, or a topic the section is part of BY DEFINITION
// (deletions are "changes in chromosome structure"); likely = only related to a named topic.
// Official topics (verbatim): חוקי התורשה המנדליים והלא מנדליים; מהות הגן; ניתוח שושלות;
// התיאוריה הכרומוזומלית של ההורשה; קביעת מין; תאחיזה, שחלוף ושיטות למיפוי גנים באדם
// ובאורגניזמים שונים; מוטציות ושינויים במבנה הכרומוזומים ובמספרם; אינטראקציה בין גנים.

const named = (topic: string, what?: string): ScopeEntry => ({
  level: "core", evidence: "syllabus-named",
  noteHe: what ? `הסילבוס הרשמי: "${topic}" — ${what}` : `הסילבוס הרשמי: "${topic}"`,
});
const heading = (topic: string, what: string): ScopeEntry => ({
  level: "likely", evidence: "syllabus-heading",
  noteHe: `נכלל בכותרת הסילבוס "${topic}", אבל ${what} לא מוזכר בשמו`,
});

const MENDEL = "חוקי התורשה המנדליים והלא מנדליים";
const GENE = "מהות הגן";
const PED = "ניתוח שושלות";
const CHROM = "התיאוריה הכרומוזומלית של ההורשה";
const SEX = "קביעת מין";
const MAP = "תאחיזה, שחלוף ושיטות למיפוי גנים באדם ובאורגניזמים שונים";
const MUT = "מוטציות ושינויים במבנה הכרומוזומים ובמספרם";
const INT = "אינטראקציה בין גנים";

export const technionGeneticsScope: CourseScope = {
  courseSlug: "technion-genetics",
  checkedAt: "2026-10-18",
  defaultSource: { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134020" },
  sections: {
    "mendel-probability": {
      method: named(MENDEL), segregation: named(MENDEL), testcross: named(MENDEL), assortment: named(MENDEL),
      probability: heading(MENDEL, "חישובי הסתברות"),
      "chi-square": heading(MENDEL, "מבחן χ²"),
    },
    "dominance-alleles": {
      dominance: heading(MENDEL, "הבסיס המולקולרי של דומיננטיות"),
      incomplete: heading(MENDEL, "דומיננטיות חלקית"),
      codominance: heading(MENDEL, "קו-דומיננטיות"),
      multiple: heading(MENDEL, "אללים מרובים"),
      lethal: heading(MENDEL, "אללים קטלניים"),
      pleiotropy: heading(MENDEL, "פליאוטרופיה"),
      "sex-environment": heading(MENDEL, "השפעות מין וסביבה"),
    },
    pedigrees: {
      symbols: named(PED), patterns: named(PED), deduction: named(PED),
      risk: heading(PED, "חישוב סיכון (כולל בייס)"),
      penetrance: heading(PED, "חדירות וביטוי"),
    },
    "chromosomal-theory": {
      terms: named(CHROM), meiosis: named(CHROM, "בסיס התיאוריה"), mendel: named(CHROM), proof: named(CHROM),
    },
    "sex-determination": {
      systems: named(SEX), "human-vs-fly": named(SEX),
      "sex-linkage": heading(SEX, "תאחיזה ל-X"),
      dosage: heading(SEX, "פיצוי מינון"),
    },
    "linkage-mapping": {
      intro: named(MAP), gametes: named(MAP), crossover: named(MAP), rf: named(MAP), "three-point": named(MAP),
      interference: heading(MAP, "אינטרפרנציה"),
      "map-vs-physical": heading(MAP, "ההבדל בין מפה גנטית לפיזית"),
      human: named(MAP, "מיפוי באדם"),
      tetrads: heading(MAP, "ניתוח טטרדות בפטריות"),
    },
    mutations: {
      definition: named(MUT), point: named(MUT), spontaneous: named(MUT), mutagens: named(MUT),
      reversion: heading(MUT, "רוורסיה וסופרסיה"),
      ames: heading(MUT, "מבחן איימס"),
      repair: heading(MUT, "תיקון DNA"),
    },
    "chromosome-structure": {
      overview: named(MUT), deletion: named(MUT), duplication: named(MUT), inversion: named(MUT), translocation: named(MUT),
      fragile: heading(MUT, "אתרים שבירים"),
    },
    "chromosome-number": {
      terms: named(MUT), nondisjunction: named(MUT), human: named(MUT), polyploidy: named(MUT),
    },
    "nature-of-gene": {
      dna: heading(GENE, "הניסויים שזיהו את ה-DNA"),
      function: named(GENE), complementation: heading(GENE, "מבחן קומפלמנטציה"), definition: named(GENE),
      benzer: heading(GENE, "ניסויי בנזר"),
    },
    "gene-interaction": {
      "one-gene-one-enzyme": heading(GENE, "גן אחד–אנזים אחד"),
      ordering: heading(INT, "סידור מסלול מטבולי"),
      epistasis: named(INT), complementary: named(INT), recessive: named(INT), dominant: named(INT),
      duplicate: named(INT), suppression: named(INT), analysis: named(INT),
    },
    "non-mendelian": {
      overview: named(MENDEL, "תורשה לא-מנדלית"),
      "maternal-effect": heading(MENDEL, "השפעה אימהית"),
      organelles: heading(MENDEL, "תורשה מחוץ לגרעין"),
      imprinting: heading(MENDEL, "החתמה גנומית"),
    },
  },
};
