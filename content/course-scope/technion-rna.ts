import type { CourseScope, ScopeEntry } from "./types";

// Technion 134151 "העולם המודרני של הרנ"א". Evidence available (2026-10-24): the current portal paragraph only (three
// parts; ncRNA names garbled by RTL rendering). No reading list, exams or staff material (Moodle closed to guests).
// Levels reviewed with Codex before writing: "core" where the paragraph names the subject (ribozymes, origin of life,
// lncRNA, piRNA, snoRNA, transgenerational RNA) or the section is its minimum framework; "likely" for specific
// examples, the provisional tmRNA reading and topics moved here from 134119 by Avichai's decision (riboswitches).

const named = (topic: string, what?: string): ScopeEntry => ({
  level: "core", evidence: "syllabus-named",
  noteHe: what ? `תיאור הקורס: "${topic}" — ${what}` : `תיאור הקורס: "${topic}"`,
});
const heading = (topic: string, what: string): ScopeEntry => ({
  level: "likely", evidence: "syllabus-heading",
  noteHe: `נכלל בנושא "${topic}" בתיאור הקורס, אבל ${what} לא מוזכר בשמו`,
});

const RIBO = "אנזים (ריבוזים) בעל פעילויות קטליטיות מגוונות";
const LIFE = "שלב ביצירת החיים על פני כדור הארץ";
const REG = "מולקולה המבקרת ביטוי גנים (בדגש על רנ\"א שאיננו מקודד)";
const INH = "מרכיב תורשתי בתאים אאוקריוטים בעל השפעה בין-דורית";

// The lecturer's own 2025 schedule (`syllabuses/_text/RNA world 2025 Schedule.docx.txt`, added 2026-11-05): one paper per lecture.
const sched = (lecture: string, paper: string): ScopeEntry => ({ level: "core", evidence: "syllabus-named", noteHe: `לוח ההרצאות של המרצה (2025): "${lecture}" — ${paper}` });

export const technionRnaScope: CourseScope = {
  courseSlug: "technion-rna",
  checkedAt: "2026-10-24",
  defaultSource: { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134151" },
  sections: {
    "rn-rna-world": {
      properties: named(RIBO, "התכונות שמאפשרות קטליזה"),
      hypothesis: named(LIFE, "השערת עולם ה-RNA"),
      evidence: named(LIFE, "הראיות"),
      "in-vitro-evolution": heading(RIBO, "SELEX וריבוזימים פולימראזים"),
      prebiotic: heading(LIFE, "כימיה פרה-ביוטית"),
      "open-problems": named(LIFE, "בעיות פתוחות"),
    },
    "rn-ribozymes": {
      "group-i": named(RIBO, "אינטרון מקבוצה I"),
      "rnase-p": named(RIBO, "RNase P"),
      "group-ii": named(RIBO, "קבוצה II והספלייסוזום"),
      "small-ribozymes": heading(RIBO, "ריבוזים hammerhead"),
      mechanisms: named(RIBO, "אסטרטגיות קטליטיות"),
      glms: heading(RIBO, "glmS"),
    },
    "rn-bacterial-rna": {
      riboswitches: heading(REG, "ריבוסוויצ'ים (הועברו לכאן מ-134119)"),
      thermometers: heading(REG, "מדחומי RNA"),
      srna: heading(REG, "sRNA בחיידקים"),
      tmrna: heading(REG, "tmRNA (פרשנות זמנית של \"RNATM\" המשובש)"),
    },
    "rn-pirna": {
      recap: named(REG, "רענון — ארגז הכלים של Argonaute"),
      clusters: named(REG, "piRNA — אשכולות"),
      biogenesis: named(REG, "piRNA — ייצור ופינג-פונג"),
      transcriptional: named(REG, "piRNA — השתקה בגרעין"),
      mutants: named(REG, "piRNA — מוטנטים"),
      pombe: heading(REG, "RNAi והטרוכרומטין בשמרים"),
    },
    "rn-snorna": {
      "guide-principle": named(REG, "snoRNA — עיקרון המדריך"),
      "cd-box": named(REG, "snoRNA מסוג C/D"),
      "haca-box": named(REG, "snoRNA מסוג H/ACA"),
      processing: named(REG, "snoRNA שמנחים חיתוך (U3)"),
      relatives: heading(REG, "scaRNA, RNA הטלומראז ו-snoRNA יתומים"),
      genes: heading(REG, "גני מארח ותפקוד השינויים"),
    },
    "rn-lncrna": {
      definition: named(REG, "lncRNA — הגדרה"),
      mechanisms: named(REG, "lncRNA — דרכי פעולה"),
      xist: named(REG, "lncRNA — Xist"),
      imprinting: named(REG, "lncRNA — החתמה (Airn)"),
      neat1: heading(REG, "NEAT1 ופרספקלים"),
      attribution: named(REG, "lncRNA — איך מוכיחים תפקיד"),
    },
    "rn-m6a": {
      basics: sched("mRNA modifications and inheritance", "רקע לשתי ההרצאות על m6A"),
      mapping: sched("mRNA modifications and inheritance", "השיטה שבמאמרים"),
      "zebrafish-mzt": sched("mRNA modifications and inheritance", "Zhao et al., Nature 2017"),
      "drosophila-ythdf": sched("RNA modifications in development", "Worpenberg et al., EMBO J 2021"),
    },
    "rn-extracellular": {
      vesicles: sched("RNA delivery: exosomes transport RNA between cells", "רקע"),
      valadi: sched("RNA delivery: exosomes transport RNA between cells", "Valadi et al., Nat Cell Biol 2007"),
      cai: sched("RNA delivery: exosomes transport RNA between cells", "Cai et al., Science 2018"),
      critique: sched("RNA delivery", "בקרות — הפרויקט הסופי בקורס בודק בקרות ובקרה חסרה"),
    },
    "rn-inheritance": {
      definitions: named(INH, "בין-דורי מול טרנס-דורי"),
      celegans: named(INH, "המודל בתולעת"),
      rnae: heading(INH, "RNAe ועצמי/זר בתולעת"),
      drosophila: heading(INH, "piRNA מהאם בזבוב"),
      plants: heading(INH, "פרמוטציה ו-RdDM בצמחים"),
      mammals: heading(INH, "טענות ביונקים"),
    },
    "gx-ncrna": {
      classes: named(REG, "רענון מקורס הקדם"),
      mirna: named(REG, "רענון מקורס הקדם"),
      sirna: named(REG, "רענון מקורס הקדם"),
    },
  },
};
