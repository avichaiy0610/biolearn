import type { CourseScope, ScopeEntry } from "./types";

// Technion 134119 "בקרת הביטוי הגנטי". Evidence available (2026-10-21): the official topic list on the students
// portal only (Moodle closed to guests), so the strongest level is "syllabus-named". Reviewed row by row: subtopics
// the syllabus does not name (stringent response, RNA editing, mRNA decay and localization, epigenetic inheritance,
// X inactivation, genomic methods, gene-expression noise…) are "likely".

const named = (topic: string, what?: string): ScopeEntry => ({
  level: "core", evidence: "syllabus-named",
  noteHe: what ? `הסילבוס הרשמי: "${topic}" — ${what}` : `הסילבוס הרשמי: "${topic}"`,
});
const heading = (topic: string, what: string): ScopeEntry => ({
  level: "likely", evidence: "syllabus-heading",
  noteHe: `נכלל בכותרת הסילבוס "${topic}", אבל ${what} לא מוזכר בשמו`,
});

// Official topics (verbatim, from the portal).
const CIS = "בקרת הביטוי הגנטי בתאים פרוקריטים ואאוקריוטים: בקרת תעתוק-אלמנטים רגולטורים בציס";
const TF = "פקטורי תעתוק";
const CHR = "מודיפיקציות בכרומטין";
const AS = "שחבור חלופי";
const TL = "בקרת תרגום";
const NC = "בקרה על ידי רנ\"א לא מקודד";
const GEN = "מבנה הגנום";
const FAM = "ביטוי מתואם של משפחות וסוגי גנים";
const REP = "רצפים חוזרים ורצפים ניידים ותפקידם בבקרת הביטוי הגנטי";
const GW = "בקרה כלל-גנומית";
const INT = "אינטגרציה בין מערכות בקרה והמשמעות הפנוטיפית שלה";

export const technionGeneExpressionScope: CourseScope = {
  courseSlug: "technion-gene-expression",
  checkedAt: "2026-10-21",
  defaultSource: { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134119" },
  sections: {
    "gx-operons": {
      "operon": named(CIS, "בקרת תעתוק בפרוקריוטים"),
      "lac": named(CIS, "בקרת תעתוק בפרוקריוטים"),
      "mutants": named(CIS, "אלמנטים בציס"),
      "cap": named(CIS, "בקרת תעתוק בפרוקריוטים"),
      "trp": named(CIS, "בקרת תעתוק בפרוקריוטים"),
      "more": heading(CIS, "התגובה המחמירה ובקרה עצמית של חלבוני ריבוזום"),
    },
    "gx-cis-elements": {
      "layout": named(CIS),
      "enhancers": named(CIS),
      "insulators": named(CIS),
      "response-elements": named(CIS),
      "methods": heading(CIS, "שיטות לזיהוי אלמנטים"),
    },
    "gx-transcription-factors": {
      "modular": named(TF),
      "motifs": named(TF),
      "combinatorial": named(TF),
      "activators": named(TF),
      "repressors": named(TF),
      "regulation": named(TF),
      "gal": named(TF, "מודל של הפעלה ודיכוי"),
    },
    "gx-chromatin-modifications": {
      "barrier": named(CHR),
      "remodeling": named(CHR),
      "marks": named(CHR),
      "readers": named(CHR),
      "dna-methylation": named(CHR),
      "crosstalk": named(CHR),
    },
    "gx-epigenetics": {
      "definition": heading(CHR, "המושג אפיגנטיקה"),
      "heterochromatin": named(CHR, "הטרוכרומטין"),
      "polycomb": named(CHR, "השתקה דרך H3K27me3"),
      "inheritance": heading(CHR, "העברת מצבי כרומטין בשכפול"),
      "x-inactivation": heading(GW, "השבתת X"),
      "imprinting": heading(GW, "החתמה גנומית"),
    },
    "gx-alternative-splicing": {
      "types": named(AS),
      "regulation": named(AS),
      "drosophila": named(AS),
      "examples": named(AS),
      "nmd-disease": heading(AS, "הקשר ל-NMD ולמחלות"),
      "editing": heading(AS, "עריכת RNA"),
    },
    "gx-translation-control": {
      "why": named(TL),
      "global": named(TL),
      "uorf": named(TL),
      "iron": named(TL),
      "ires": named(TL),
      "decay": heading(TL, "יציבות ופירוק mRNA"),
      "localization": heading(TL, "מיקום mRNA"),
    },
    "gx-ncrna": {
      "classes": named(NC),
      "riboswitches": named(NC),
      "bacteria": named(NC),
      "mirna": named(NC),
      "sirna": named(NC),
      "rnai-heterochromatin": named(NC),
      "lncrna": named(NC),
    },
    "gx-genome-structure": {
      "size": named(GEN),
      "composition": named(GEN),
      "cot": named(GEN),
      "genes": named(GEN),
      "prokaryotes": named(GEN),
      "organelles": named(GEN),
    },
    "gx-gene-families": {
      "origin": named(FAM),
      "globin": named(FAM),
      "tandem": named(FAM),
      "hox": named(FAM),
      "unlinked": named(FAM),
      "eukaryotic-operons": heading(FAM, "אופרונים באאוקריוטים ושחבור טרנס"),
    },
    "gx-repeats-mobile": {
      "tandem": named(REP),
      "overview": named(REP),
      "dna-transposons": named(REP),
      "retro": named(REP),
      "regulation": named(REP),
      "silencing": named(REP),
      "domestication": named(REP),
    },
    "gx-genome-wide": {
      "nucleus": named(GW),
      "tads": named(GW),
      "dosage": named(GW),
      "mitosis": heading(GW, "השתקה במיטוזה"),
      "methods": heading(GW, "שיטות גנומיות"),
      "transcriptome": heading(GW, "הטרנסקריפטום"),
    },
    "gx-integration": {
      "lambda": named(INT),
      "yeast": named(INT),
      "drosophila": named(INT),
      "circuits": named(INT),
      "noise": heading(INT, "רעש בביטוי"),
      "phenotype": named(INT, "המשמעות הפנוטיפית"),
    },
  },
};
