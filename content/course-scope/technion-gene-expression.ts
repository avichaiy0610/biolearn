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

const staff = (what: string): ScopeEntry => ({
  level: "core", evidence: "staff-material",
  noteHe: `לוח ההרצאות של הקורס (2024, פרופ' יעל מנדל-גוטפרוינד), הרצאה 10 "עריכת גנום: siRNA, CRISPR/Cas9" — ${what}`,
});
const exam119 = (what: string): ScopeEntry => ({
  level: "core", evidence: "exam",
  noteHe: `נשאל במבחני הקורס (2016-2022, תרחישי מחקר הנקראים מאיור) — ${what}`,
});

// 2026-11-07: the course's own 2024 schedule (syllabuses/_text/סילבוס בקרת הביטוי הגנטי 2024.docx.txt — lecture and
// tutorial topic per week), the 2023 homework with staff answers, and the exams (2016–2022) are now the main evidence.
const S24 = "לוח הקורס 2024 (פרופ' יעל מנדל-גוטפרוינד)";
const sched = (week: string, what: string): ScopeEntry => ({
  level: "core", evidence: "staff-material",
  noteHe: `${S24}, ${week} — ${what}`,
});
const asked = (where: string, what: string): ScopeEntry => ({
  level: "core", evidence: "exam",
  noteHe: `נשאל ב${where} — ${what}`,
});
const OPERON_OUT: ScopeEntry = {
  level: "extension", evidence: "none",
  noteHe: "בקרה בחיידקים לא מופיעה בלוח הקורס 2024, ולא נשאלה במבחני הקורס מאז 2016. כותרת הפורטל מזכירה ״תאים פרוקריוטים״, ובדף הסיכום של סטודנטית מ-2024 lac ו-trp מופיעים רק כ״נקודות נוספות מתרגולים״ — רקע למושגים אופרטור ורגולטור, לא נושא בפני עצמו.",
};

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
  checkedAt: "2026-11-07",
  defaultSource: { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134119" },
  sections: {
    "gx-operons": {
      "operon": OPERON_OUT,
      "lac": OPERON_OUT,
      "mutants": OPERON_OUT,
      "cap": OPERON_OUT,
      "trp": OPERON_OUT,
    },
    "gx-expression-data": {
      "rt": sched("תרגול 1 \"RT + Real time PCR\"", "שעתוק הפוך ובקרת no-RT"),
      "qpcr": sched("תרגול 1 \"RT + Real time PCR\"", "עקומת הגברה, סף ו-Ct"),
      "ddct": sched("תרגול 1 \"RT + Real time PCR\"", "נרמול לגן ייחוס וחישוב ΔΔCt"),
      "primers": asked("תרגיל בית 5 (2023) ובמועד א' 2022", "RT-qPCR עם פריימרים לכל אקסון, ו-PCR מאקסון 1 לאקסון 3 לזיהוי שחבור חלופי"),
      "rna-seq": asked("מועד ב' 2021 ובתרגילי הבית 1 ו-3 (2023)", "קריאת תוצאות RNA-seq ושינוי בביטוי"),
      "volcano": asked("מועד ב' 2021 ובמועד א' 2022", "volcano plot של RNA-seq ושל אתרי CpG אחרי ביסולפיט"),
      "turnover": { level: "core", evidence: "staff-material", noteHe: "דף הסיכום של 2024 (מתוך ההרצאות): יציבות mRNA, עצירת שעתוק ו-t½, NASC-seq וגרף פיזור של קריאות חדשות מול כלל הקריאות" },
    },
    "gx-genomic-tracks": {
      "chip-seq": sched("תרגול 3 \"ChIP-Seq\"", "ChIP, בקרות ושיאים; נשאל גם במועד א' 2022 (ChIP ל-H3K9ac, H3K9me3 ו-Pol II)"),
      "browser": sched("תרגול 3 \"Genome Browser\"", "קריאת מסלולים לצד מודל הגן; ChIP-seq ל-H3K27ac ול-H2A בתרגיל בית 3 (2023)"),
      "motifs": sched("תרגול 3 \"MEME\"", "STREME ו-Tomtom, חצאי אתר של קולטנים גרעיניים והמרווח ביניהם — תרגיל בית 2 (2023)"),
      "binding-vs-function": asked("תרגיל בית 2 (2023) ובמועד ב' 2021", "ChIP-seq מול RNA-seq אחרי KO, וקישור עקיף דרך קו-פקטור (MEME/Tomtom ו-Co-IP)"),
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
      "recognition": sched("הרצאה ותרגול 2 \"עקרונות ההכרה המולקולרית בין חלבונים לדנ\"א\"", "חומצות אמינו מול בסיסים בחריץ הגדול והקטן, זמן שהייה, ΔΔG ו-EMSA — תרגיל בית 1 (2023)"),
      "combinatorial": named(TF),
      "fly-eve": sched("הרצאה 4 \"בקרת שיעתוק קומבינטורית\", תרגול \"הזבוב כמודל לבקרת שיעתוק\"", "מגביר פס 2 של eve, Bicoid/Hunchback מול Giant/Krüppel"),
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
      "kinetic-coupling": asked("מועד א' 2022 ובמועד ב' 2021", "מודל פס ההאטה: ChIP ל-Pol II ולסימני היסטון לאורך הגן, מעכב HDAC, והאטת הפולימראז שמשנה את בחירת האקסון; מופיע גם בדף הסיכום של 2024"),
      "drosophila": named(AS),
      "examples": named(AS),
      "nmd-disease": heading(AS, "הקשר ל-NMD ולמחלות"),
    },
    "gx-crispr-tools": {
      "immunity": staff("מערכת CRISPR בחיידק: חזרות, spacers, tracrRNA ו-RNase III, כפי שהיא מופיעה גם בדף הסיכום של 2024"),
      "pam": staff("רצף PAM והבחנה בין עצמי לזר"),
      "tool": exam119("תכנון gRNA כנגד רצף רגולטורי, ותוצאת החיתוך"),
      "dcas9": exam119("dCas9 מחובר לחלבון בקרה: dCas9-X, dCas9-HDAC ו-CRISPRa"),
      "reading": exam119("קריאת איור של ניסוי dCas9 ובחירת הבקרות"),
      "limits": { level: "likely", evidence: "syllabus-heading", noteHe: "מגבלות השיטה אינן נשאלות ישירות, אבל נדרשות כדי לנמק בחירת בקרות ושימוש בכמה gRNA" },
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
      "mirna": named(NC, "miRNA ו-Drosha/Dicer"),
      "sirna": named(NC),
    },
    "gx-genome-structure": {
      "size": named(GEN),
      "composition": named(GEN),
      "cot": named(GEN),
      "genes": named(GEN),
    },
    "gx-gene-families": {
      "origin": named(FAM),
      "globin": named(FAM),
      "tandem": named(FAM),
      "hox": named(FAM),
      "unlinked": named(FAM),
    },
    "gx-repeats-mobile": {
      "overview": named(REP),
      "retro": named(REP),
      "regulation": named(REP),
      "silencing": named(REP),
    },
    "gx-genome-wide": {
      "nucleus": named(GW),
      "tads": named(GW),
      "dosage": named(GW),
      "methods": heading(GW, "שיטות גנומיות"),
    },
    "gx-integration": {
      "lambda": named(INT),
      "yeast": named(INT),
      "drosophila": named(INT),
      "circuits": named(INT),
      "phenotype": named(INT, "המשמעות הפנוטיפית"),
    },
  },
};
