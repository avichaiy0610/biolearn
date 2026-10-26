import type { CourseScope, ScopeEntry } from "./types";

// Technion 136088 "גנטיקה מולקולרית של האדם". Evidence available (2026-10-26): the current portal paragraph (a topic
// list), the official books, and the header of the 2020/21 syllabus (search snippet only). No reading list, no exams,
// no staff material. Levels reviewed with Codex before writing: "core" where the paragraph names the topic (each
// disease class, behavioral genetics, embryonic development, sex determination, mapping/cloning, diagnosis) or the
// section is the minimum framework for it; "likely" for the foundation unit's general sections and for PROVISIONAL
// additions under a named heading (ICF/FSHD, polygenic scores, mitochondrial replacement, sequencing-led discovery,
// prenatal/PGT detail). Examples inside "core" sections are representative choices, not a reconstructed lecture.

const named = (topic: string, what?: string): ScopeEntry => ({
  level: "core", evidence: "syllabus-named",
  noteHe: what ? `תיאור הקורס: "${topic}" — ${what}` : `תיאור הקורס: "${topic}"`,
});
const heading = (topic: string, what: string): ScopeEntry => ({
  level: "likely", evidence: "syllabus-heading",
  noteHe: `נכלל בנושא "${topic}" בתיאור הקורס, אבל ${what} לא מוזכר בשמו`,
});

const refresher = (topic: string, what: string): ScopeEntry => heading(topic, `${what} (רענון מקורס הקדם)`);
const outside = (what: string): ScopeEntry => ({
  level: "extension", evidence: "none",
  noteHe: `${what} — סעיף ביחידה של קורס הקדם שלא מקושר מהקורס הזה`,
});

const MOLECULAR = "היבטים מולקולריים בגנטיקה של האדם, בעיקר במחלות תורשתיות שונות";
const X = "מחלות שבתאחיזה לכרומוזום X";
const IMPRINTING = "מחלות הקשורות לתופעת ה-IMPRINTING";
const REPEATS = "מחלות הקשורות להרחבה של TRINUCLEOTIDE REPEATS";
const MULTI = "מחלות מולטיפקטוריאליות";
const MITO = "מחלות מיטוכונדריאליות";
const METABOLIC = "מחלות מטבוליות";
const CANCER = "מחלות ממאירות";
const BEHAVIOR = "גנטיקה של התנהגות";
const DEVELOPMENT = "הפרעות בהתפתחות עוברית";
const SEX = "קביעת מין";
const MAPPING = "טכניקות מולקולריות למיפוי ולשיבוט גנים";
const DIAGNOSIS = "טכניקות מולקולריות לאבחון מחלות גנטיות";

export const technionHumanGeneticsScope: CourseScope = {
  courseSlug: "technion-human-genetics",
  checkedAt: "2026-10-26",
  defaultSource: { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/136088" },
  sections: {
    "hg-variants": {
      variation: heading(MOLECULAR, "סוגי השונות בגנום"),
      mechanisms: named(MOLECULAR, "איך וריאנט פוגע בגן"),
      function: named(MOLECULAR, "אובדן ורווח בתפקוד, מינון והשפעה שלילית-דומיננטית"),
      heterogeneity: heading(MOLECULAR, "הטרוגניות"),
      mosaicism: heading(MOLECULAR, "מוזאיקה"),
    },
    "hg-x-linked": {
      refresh: named(X, "רענון: תאחיזה והשבתת X"),
      "dmd-gene": named(X, "דושן ובקר"),
      "reading-frame": named(X, "כלל מסגרת הקריאה"),
      hemophilia: named(X, "המופיליה A"),
      carriers: named(X, "נשאיות עם תסמינים"),
      "x-dominant": named(X, "מחלה דומיננטית בתאחיזה ל-X"),
    },
    "hg-imprinting": {
      refresh: named(IMPRINTING, "רענון: החתמה"),
      chr15: named(IMPRINTING, "פראדר-וילי ואנג'למן"),
      mechanisms: named(IMPRINTING, "המנגנונים ואבחונם"),
      upd: named(IMPRINTING, "דיסומיה חד-הורית"),
      chr11: named(IMPRINTING, "בקוויית'-וידמן וסילבר-ראסל"),
      "other-epigenetic": heading(IMPRINTING, "ICF ו-FSHD"),
    },
    "hg-repeats": {
      dynamic: named(REPEATS, "מוטציה דינמית ואנטיציפציה"),
      huntington: named(REPEATS, "הנטינגטון"),
      "fragile-x": named(REPEATS, "X השביר"),
      dm1: named(REPEATS, "דיסטרופיה מיוטונית"),
      friedreich: named(REPEATS, "אטקסיה של פרידרייך"),
      diagnosis: named(REPEATS, "אבחון חזרות"),
    },
    "hg-multifactorial": {
      liability: named(MULTI, "מודל נטייה וסף"),
      heritability: named(MULTI, "תורשתיות ותאומים"),
      gwas: named(MULTI, "GWAS"),
      causal: named(MULTI, "מהאות לגורם"),
      prs: heading(MULTI, "ציון סיכון פוליגני"),
    },
    "hg-mitochondrial": {
      mtdna: named(MITO, "הגנום המיטוכונדריאלי"),
      heteroplasmy: named(MITO, "הטרופלסמיה וסף"),
      bottleneck: named(MITO, "צוואר בקבוק"),
      examples: named(MITO, "מחלות מייצגות"),
      nuclear: named(MITO, "מחלות מיטוכונדריאליות מהגרעין"),
      replacement: heading(MITO, "החלפת מיטוכונדריה"),
    },
    "hg-metabolic": {
      logic: named(METABOLIC, "ההיגיון הביוכימי"),
      pku: named(METABOLIC, "פנילקטונוריה"),
      lysosomal: named(METABOLIC, "מחלות אגירה ליזוזומליות"),
      population: heading(METABOLIC, "אפקט מייסד וסריקת נשאים"),
    },
    "hg-cancer": {
      evolution: named(CANCER, "סרטן כאבולוציה של תאים"),
      oncogenes: named(CANCER, "אונקוגנים"),
      "two-hit": named(CANCER, "גנים מדכאי גידול ושתי מכות"),
      syndromes: named(CANCER, "תסמונות סרטן תורשתיות"),
      "synthetic-lethality": heading(CANCER, "קטלניות סינתטית"),
    },
    "hg-behavior": {
      "twins-adoption": named(BEHAVIOR, "תאומים ואימוץ"),
      architecture: named(BEHAVIOR, "ארכיטקטורה גנטית ו-CNVs"),
      "genetic-correlation": heading(BEHAVIOR, "מתאם גנטי"),
      "gene-environment": named(BEHAVIOR, "גנים וסביבה"),
      interpretation: named(BEHAVIOR, "פרשנות"),
    },
    "hg-development": {
      trisomy21: named(DEVELOPMENT, "טריזומיה 21"),
      balanced: named(DEVELOPMENT, "טרנסלוקציות מאוזנות"),
      "recurrent-cnv": named(DEVELOPMENT, "חסרים חוזרים"),
      "developmental-genes": named(DEVELOPMENT, "גנים התפתחותיים"),
      "de-novo": named(DEVELOPMENT, "וריאנטים חדשים"),
    },
    "hg-sex-determination": {
      levels: named(SEX, "רמות של מין"),
      "sry-sox9": named(SEX, "SRY ו-SOX9"),
      hormones: named(SEX, "הורמונים"),
      "sex-reversal": named(SEX, "היפוך מין"),
      ais: named(SEX, "חוסר רגישות לאנדרוגנים"),
      cah: named(SEX, "היפרפלזיה מולדת של יותרת הכליה"),
    },
    "hg-mapping-cloning": {
      strategies: named(MAPPING, "גישות למציאת גן"),
      linkage: named(MAPPING, "מיפוי במשפחות"),
      "chromosome-clues": named(MAPPING, "רמזים מכרומוזומים"),
      evidence: named(MAPPING, "ראיות לגן מועמד"),
      "sequencing-led": heading(MAPPING, "גילוי גנים בריצוף"),
    },
    "hg-diagnosis": {
      matching: named(DIAGNOSIS, "התאמת בדיקה לשינוי"),
      ngs: named(DIAGNOSIS, "לוח, אקסום וגנום"),
      segregation: named(DIAGNOSIS, "בדיקת ההורים"),
      classification: heading(DIAGNOSIS, "סיווג ACMG"),
      screening: named(DIAGNOSIS, "סריקה מול אבחון"),
      prenatal: heading(DIAGNOSIS, "NIPT ו-PGT"),
    },
    "sex-determination": {
      systems: refresher(SEX, "מערכות קביעת מין"),
      "human-vs-fly": refresher(SEX, "קביעת מין באדם"),
      "sex-linkage": refresher(X, "תאחיזה למין"),
      dosage: refresher(X, "פיצוי מינון והשבתת X"),
    },
    "non-mendelian": {
      overview: outside("זיהוי תורשה לא-מנדלית"),
      "maternal-effect": outside("השפעה אימהית"),
      organelles: refresher(MITO, "תורשה מחוץ לגרעין"),
      imprinting: refresher(IMPRINTING, "החתמה גנומית"),
    },
    "gx-epigenetics": {
      definition: outside("הגדרת אפיגנטיקה"),
      heterochromatin: outside("הטרוכרומטין"),
      polycomb: outside("Polycomb ו-Trithorax"),
      inheritance: outside("העברת מצב בשכפול"),
      "x-inactivation": outside("השבתת X"),
      imprinting: refresher(IMPRINTING, "החתמה ברמה המולקולרית"),
    },
    "chromosome-number": {
      terms: outside("מונחים וסימונים"),
      nondisjunction: refresher(DEVELOPMENT, "אי-היפרדות"),
      human: refresher(DEVELOPMENT, "אנאופלואידיות באדם"),
      polyploidy: outside("פוליפלואידיה"),
    },
    "linkage-mapping": {
      intro: outside("תאחיזה"),
      gametes: outside("גמטות רקומביננטיות"),
      crossover: outside("שחלוף"),
      rf: outside("תדירות רקומבינציה"),
      "three-point": outside("הצלבה תלת-נקודתית"),
      interference: outside("אינטרפרנציה"),
      "map-vs-physical": outside("מפה גנטית ופיזית"),
      human: refresher(MAPPING, "מיפוי באדם וציון LOD"),
      tetrads: outside("ניתוח טטרדות"),
    },
  },
};
