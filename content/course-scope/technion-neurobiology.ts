import type { CourseScope, ScopeEntry } from "./types";

// Technion 134157 "מבוא לנוירוביולוגיה". Evidence available (2026-10-24): the current portal paragraph only (7 themes).
// No reading list, exams or staff material (Moodle closed to guests). Levels reviewed with Codex before writing:
// "core" where the paragraph names the theme or the section is its minimum framework; "likely" for named experiments,
// specific molecules, diseases beyond AD/PD and specific research platforms.

const named = (topic: string, what?: string): ScopeEntry => ({
  level: "core", evidence: "syllabus-named",
  noteHe: what ? `תיאור הקורס: "${topic}" — ${what}` : `תיאור הקורס: "${topic}"`,
});
const heading = (topic: string, what: string): ScopeEntry => ({
  level: "likely", evidence: "syllabus-heading",
  noteHe: `נכלל בנושא "${topic}" בתיאור הקורס, אבל ${what} לא מוזכר בשמו`,
});

const CELLS = "הכרת התאים השונים במח ותפקידם";
const MOL = "הבסיס המולקולרי של פעילות הנוירונים";
const FUNC = "הבנת משמעות ההולכה העצבית לתפקוד (בדגש על זיכרון ולמידה)";
const NDD = "היבטים מולקולריים של מחלות נוירודגנרטיביות";
const DEV = "תהליכים בהתפתחות המח";
const IMM = "האינטראקציה בין מערכת החיסון והמח";
const METH = "שיטות מחקר מתקדמות בחקר המח";

export const technionNeurobiologyScope: CourseScope = {
  courseSlug: "technion-neurobiology",
  checkedAt: "2026-10-24",
  defaultSource: { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134157" },
  sections: {
    "nb-cells": {
      "neuron-doctrine": heading(CELLS, "תורת הנוירון וההיסטוריה שלה"),
      "neuron-structure": named(CELLS, "מבנה הנוירון"),
      "axonal-transport": named(CELLS, "הובלה באקסון"),
      "neuron-types": named(CELLS, "סוגי נוירונים"),
      glia: named(CELLS, "תאי גלייה"),
      "cell-types": heading(CELLS, "סיווג בריצוף תאים בודדים"),
      "brain-organization": named(CELLS, "הקשר אנטומי בסיסי"),
    },
    "nb-channels": {
      recap: named(MOL, "פוטנציאל מנוחה ופעולה — סיכום"),
      selectivity: named(MOL, "סלקטיביות של תעלות"),
      "voltage-gating": named(MOL, "תעלות תלויות-מתח ואינאקטיבציה"),
      conduction: named(MOL, "מיאלין והולכה"),
      "toxins-disease": heading(MOL, "רעלנים ומחלות תעלות"),
    },
    "nb-synapse": {
      types: named(MOL, "סינפסות חשמליות וכימיות"),
      release: named(MOL, "שחרור נוירוטרנסמיטר"),
      receptors: named(MOL, "קולטנים"),
      transmitters: heading(MOL, "מערכות הנוירוטרנסמיטרים"),
      integration: named(FUNC, "סכימה וקידוד"),
    },
    "nb-learning-memory": {
      concepts: named(FUNC, "למידה וזיכרון"),
      hm: heading(FUNC, "המקרה של H.M."),
      aplysia: heading(FUNC, "אפליזיה"),
      ltp: named(FUNC, "LTP ו-LTD"),
      engram: heading(FUNC, "ניסויי האנגרם"),
    },
    "nb-development": {
      "neural-tube": named(DEV, "הצינור העצבי"),
      neurogenesis: named(DEV, "נוירוגנזה ונדידה"),
      "axon-guidance": named(DEV, "הכוונת אקסונים"),
      survival: named(DEV, "סינפסות, הישרדות ומוות"),
      refinement: named(DEV, "עידון לפי פעילות"),
    },
    "nb-neurodegeneration": {
      principles: named(NDD, "עקרונות משותפים"),
      alzheimers: named(NDD, "אלצהיימר"),
      parkinsons: named(NDD, "פרקינסון"),
      others: heading(NDD, "הנטינגטון, ALS ופריונים"),
      therapy: heading(NDD, "אתגרי הטיפול"),
    },
    "nb-neuroimmune": {
      bbb: named(IMM, "מחסום דם-מוח"),
      microglia: named(IMM, "מיקרוגלייה"),
      pruning: heading(IMM, "גזימת סינפסות בעזרת המשלים"),
      "immune-privilege": heading(IMM, "כלי לימפה ותאי T בקרומי המוח"),
      sickness: named(IMM, "ציטוקינים והתנהגות"),
      diseases: named(IMM, "מחלות"),
    },
    "nb-methods": {
      logic: named(METH, "היגיון הניסוי"),
      electrophysiology: named(METH, "רישום חשמלי"),
      imaging: named(METH, "הדמיה"),
      optogenetics: heading(METH, "אופטוגנטיקה וכימוגנטיקה"),
      mapping: heading(METH, "מיפוי קשרים וסוגי תאים"),
      models: heading(METH, "אורגניזמי מודל ואורגנואידים"),
    },
    "ph-membrane-potential": {
      gradients: named(MOL, "רענון מקורס הפיזיולוגיה"),
      nernst: named(MOL, "רענון מקורס הפיזיולוגיה"),
      ghk: named(MOL, "רענון מקורס הפיזיולוגיה"),
      "driving-force": named(MOL, "רענון מקורס הפיזיולוגיה"),
      potassium: named(MOL, "רענון מקורס הפיזיולוגיה"),
    },
    "ph-action-potential": {
      passive: named(MOL, "רענון מקורס הפיזיולוגיה"),
      phases: named(MOL, "רענון מקורס הפיזיולוגיה"),
      channels: named(MOL, "רענון מקורס הפיזיולוגיה"),
      refractory: named(MOL, "רענון מקורס הפיזיולוגיה"),
      conduction: named(MOL, "רענון מקורס הפיזיולוגיה"),
      myelin: named(MOL, "רענון מקורס הפיזיולוגיה"),
    },
    "ph-synapse": {
      types: named(MOL, "רענון מקורס הפיזיולוגיה"),
      release: named(MOL, "רענון מקורס הפיזיולוגיה"),
      receptors: named(MOL, "רענון מקורס הפיזיולוגיה"),
      "epsp-ipsp": named(MOL, "רענון מקורס הפיזיולוגיה"),
      integration: named(FUNC, "רענון מקורס הפיזיולוגיה"),
      plasticity: named(FUNC, "רענון מקורס הפיזיולוגיה"),
      transmitters: named(MOL, "רענון מקורס הפיזיולוגיה"),
    },
  },
};
