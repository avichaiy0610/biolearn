import type { CourseScope, ScopeEntry } from "./types";

// Technion 136158 "שיטות בביואינפורמטיקה למדעי החיים". Evidence available (2026-10-26): the current portal paragraph
// and its six learning outcomes only. No reading list, no past exams, no staff material (Moodle closed to guests).
// Levels reviewed with Codex before writing: "core" where the paragraph or an outcome names the subject (databases
// and retrieval, sequence representation/retrieval, sequencing data, structural prediction, networks, R, project
// and presentation); "likely" where only a broad heading covers it ("statistical tools", "advanced approaches",
// "existing tools") — including the provisional units (RNA-seq, statistics/exploration, enrichment, RNA structure).
// Honest limit: without the lecture list, the depth of each tool is a recommendation, not a reconstruction.

const named = (topic: string, what?: string): ScopeEntry => ({
  level: "core", evidence: "syllabus-named",
  noteHe: what ? `תיאור הקורס: "${topic}" — ${what}` : `תיאור הקורס: "${topic}"`,
});
const heading = (topic: string, what: string): ScopeEntry => ({
  level: "likely", evidence: "syllabus-heading",
  noteHe: `נכלל בנושא "${topic}" בתיאור הקורס, אבל ${what} לא מוזכר בשמו`,
});

const DATABASES = "דרכי גישה למאגרים של נתוני ענק בביולוגיה ורפואה";
const RETRIEVAL = "דרכי ייצוג ואחזור רצפי חומצות גרעין וחלבונים מנתוני ריצוף";
const TOOLS = "הכרה ושימוש של כלים קיימים בביואינפורמטיקה לפתרון בעיות בביולוגיה מולקולרית מודרנית";
const R = "להשתמש בשפת התכנות R בכדי לענות על שאלות ביואינפורמטיות בסיסיות";
const STATS = "לנתח תוצאות ביואינפורמטיות בעזרת כלים סטטיסטיים מתאימים";
const ADVANCED = "גישות מתקדמות לניתוחם [של נתוני הענק]";
const STRUCTURE = "ניבוי מבני של מולקולות ביולוגיות";
const NETWORKS = "ניתוח רשתות ביולוגיות";
const PROJECT = "לתכנן ולבצע פרויקט בסיסי בביואינפורמטיקה… לסכם תוצאות מחקר ביואינפורמטי ולהציגו";

export const technionBioinformaticsScope: CourseScope = {
  courseSlug: "technion-bioinformatics",
  checkedAt: "2026-10-26",
  defaultSource: { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/136158" },
  sections: {
    "bi-databases": {
      "primary-curated": named(DATABASES, "מאגרים ראשוניים ומבוקרים"),
      accessions: named(DATABASES, "מזהי רשומות וגרסאות"),
      formats: named(RETRIEVAL, "פורמטי FASTA ו-GenBank"),
      assemblies: named(DATABASES, "גרסאות גנום וקואורדינטות"),
      tasks: named(DATABASES, "בחירת מאגר למשימה"),
      programmatic: named("לאחזר דאטה ממאגרי נתונים ביואינפורמטיים לצורך ניתוחם", "שליפה תכנותית"),
    },
    "bi-r-basics": {
      vectors: named(R, "וקטורים"),
      "data-frames": named(R, "טבלאות"),
      merge: named(R, "חיבור טבלאות"),
      plots: named(R, "גרפים"),
      bioconductor: named(R, "Bioconductor ו-Biostrings"),
      "why-code": named(R, "ניתוח בקוד ושחזוריות"),
    },
    "bi-pairwise": {
      homology: named(RETRIEVAL, "דמיון והומולוגיה כבסיס לאחזור רצפים"),
      "global-local": named(RETRIEVAL, "עימוד גלובלי ומקומי"),
      matrices: named(RETRIEVAL, "מטריצות ניקוד"),
      gaps: named(RETRIEVAL, "עונשי פערים"),
      dp: heading(TOOLS, "האלגוריתם של תכנות דינמי"),
      "dot-plot": heading(TOOLS, "dot plot"),
    },
    "bi-blast": {
      heuristic: named(RETRIEVAL, "חיפוש במאגר"),
      how: named(RETRIEVAL, "איך BLAST עובד"),
      programs: named(RETRIEVAL, "תוכניות BLAST"),
      databases: named(DATABASES, "מאגרי חיפוש"),
      scores: named(RETRIEVAL, "ציון ביטים ו-E-value"),
      "low-complexity": named(RETRIEVAL, "סינון מורכבות נמוכה"),
      "psi-blast": heading(TOOLS, "PSI-BLAST"),
    },
    "bi-msa": {
      progressive: heading(TOOLS, "עימוד מרובה"),
      conservation: heading(TOOLS, "שימור"),
      motifs: heading(TOOLS, "מוטיבים ו-PWM"),
      domains: heading(TOOLS, "תחומים ו-Pfam/InterPro"),
      trees: heading(TOOLS, "עצים פילוגנטיים"),
    },
    "bi-sequencing": {
      technologies: named(RETRIEVAL, "טכנולוגיות ריצוף"),
      fastq: named(RETRIEVAL, "FASTQ ואיכות"),
      mapping: named(RETRIEVAL, "מיפוי קריאות"),
      coverage: named(RETRIEVAL, "עומק כיסוי"),
      vcf: named(RETRIEVAL, "וריאנטים ו-VCF"),
      browser: named(DATABASES, "דפדפני גנום"),
      clinical: named(DATABASES, "מאגרי וריאנטים ברפואה"),
    },
    "bi-rnaseq": {
      counts: heading(ADVANCED, "RNA-seq"),
      normalization: heading(ADVANCED, "נרמול"),
      design: heading(STATS, "תכנון ניסוי וחזרות"),
      deseq2: heading(STATS, "ביטוי דיפרנציאלי"),
      results: heading(STATS, "פירוש תוצאות DESeq2"),
    },
    "bi-stats-exploration": {
      "multiple-testing": heading(STATS, "השוואות מרובות"),
      bonferroni: heading(STATS, "תיקון בונפרוני"),
      fdr: heading(STATS, "FDR"),
      "effect-size": heading(STATS, "גודל השפעה"),
      pca: heading(ADVANCED, "PCA"),
      clustering: heading(ADVANCED, "קיבוץ ומפות חום"),
    },
    "bi-enrichment": {
      go: heading(STATS, "Gene Ontology"),
      ora: heading(STATS, "מבחן העשרה היפרגאומטרי"),
      background: heading(STATS, "בחירת רקע"),
      "fdr-terms": heading(STATS, "תיקון בין מונחים"),
      gsea: heading(ADVANCED, "GSEA"),
      pathways: heading(DATABASES, "מאגרי מסלולים"),
    },
    "bi-protein-structure": {
      pdb: named(STRUCTURE, "מבנים ניסויים ב-PDB"),
      secondary: named(STRUCTURE, "חיזוי מבנה שניוני"),
      "homology-modeling": named(STRUCTURE, "מידול לפי הומולוגיה"),
      alphafold: named(STRUCTURE, "AlphaFold, pLDDT ו-PAE"),
      comparison: named(STRUCTURE, "השוואת מבנים"),
    },
    "bi-rna-structure": {
      elements: heading(STRUCTURE, "רכיבי מבנה RNA"),
      "dot-bracket": heading(STRUCTURE, "כתיב סוגריים ונקודות"),
      mfe: heading(STRUCTURE, "מבנה אנרגיה מינימלית"),
      ensemble: heading(STRUCTURE, "הסתברויות זיווג"),
      comparative: heading(STRUCTURE, "השוואה בין מינים"),
      "rna-protein": heading(STRUCTURE, "הכרת RNA על ידי חלבונים"),
    },
    "bi-networks": {
      graphs: named(NETWORKS, "סוגי רשתות"),
      centrality: named(NETWORKS, "דרגה ומרכזיות"),
      evidence: named(NETWORKS, "מקורות אינטראקציות ו-STRING"),
      "hubs-modules": named(NETWORKS, "רכזות ומודולים"),
      motifs: named(NETWORKS, "מוטיבים ברשתות בקרה"),
    },
    "bi-project": {
      question: named(PROJECT, "ניסוח שאלה"),
      data: named(PROJECT, "בחירת נתונים ומטא-דאטה"),
      plan: named(PROJECT, "תכנון הניתוח"),
      reproducibility: named(PROJECT, "שחזוריות"),
      validation: named(PROJECT, "אימות"),
      presenting: named(PROJECT, "הצגה"),
    },
  },
};
