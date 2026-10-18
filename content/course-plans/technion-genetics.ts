import type { CoursePlan, PlanItem } from "./types";

// Technion 01340020 "גנטיקה כללית" (3h lecture + 1h tutorial a week, 13 weeks).
// Topics follow the official syllabus. The weekly order is SUGGESTED — the real
// lecture/tutorial list is on the course Moodle; replace when available.

const G = "genetics";
const sub = (id: string): PlanItem => ({ kind: "subtopic", topic: G, id });
const proc = (slug: string, topic = G): PlanItem => ({ kind: "process", topic, slug });
const soon = (titleHe: string): PlanItem => ({ kind: "soon", titleHe });
const lm = (section?: string): PlanItem => ({ kind: "lesson", slug: "linkage-mapping", section });
const lmWp = (problem: string): PlanItem => ({ kind: "lesson", slug: "linkage-mapping", problem });

const S = {
  mendel: "cmq0ts4lp00018s4midich93z",
  patterns: "cmq0ts4lp00028s4ma2ctk1k2",
  mutations: "cmq0ts4lp00038s4mthsjzur8",
  imprinting: "cmq2y4ufe000h04i9ruo77nn6",
  nonMendel: "cmq2y4wry000i04i9azzkiopo",
  mito: "cmq2y4zcn000j04i9dzzev2af",
  polygenic: "cmq508eeo000004l5m6pxii87",
  codominance: "cmq508fue000104l5g6ct27dj",
  sexLinked: "cmq508gzr000204l5716fu5z4",
};
const MENDEL_ANIM = "mendelian-genetics-animation-1780786392025";
const NON_MENDEL_ANIM = "non-mendelian-inheritance-animation-1780786393174";
const MITO_ANIM = "mitochondrial-inheritance-animation-1780786394329";

export const technionGeneticsPlan: CoursePlan = {
  courseSlug: "technion-genetics",
  schedule: "suggested",
  scheduleNoteHe: "הנושאים לפי הסילבוס הרשמי של הקורס. סדר ההרצאות והתרגולים מוצע (13 שבועות, 3 שעות הרצאה ושעת תרגול) — הלוח הרשמי נמצא במודל של הקורס.",
  topics: [
    { titleHe: "חוקי התורשה המנדליים", items: [sub(S.mendel), proc(MENDEL_ANIM), sub(S.patterns), soon("יחידה מלאה: חוקי מנדל, הסתברות ומבחן χ²")] },
    { titleHe: "הרחבות לחוקי מנדל ותורשה לא-מנדלית", items: [sub(S.codominance), sub(S.polygenic), sub(S.nonMendel), proc(NON_MENDEL_ANIM), sub(S.mito), proc(MITO_ANIM), sub(S.imprinting), proc("genomic-imprinting")] },
    { titleHe: "אינטראקציה בין גנים", items: [soon("יחידה מלאה: אפיסטזיס, יחסים מותאמים ומבחן קומפלמנטציה")] },
    { titleHe: "מהות הגן", items: [soon("יחידה מלאה: גן אחד–אנזים אחד, קומפלמנטציה ומבנה עדין של הגן")] },
    { titleHe: "ניתוח שושלות", items: [sub(S.patterns), soon("יחידה מלאה: דפוסי תורשה בשושלות, חדירות והבעה")] },
    { titleHe: "התיאוריה הכרומוזומלית וקביעת מין", items: [proc("meiosis"), sub(S.sexLinked), soon("יחידה מלאה: מיוזה וחוקי מנדל, קביעת מין ותורשה תאוחזת-מין")] },
    { titleHe: "תאחיזה, שחלוף ומיפוי גנים", items: [lm()] },
    { titleHe: "מוטציות ושינויים כרומוזומליים", items: [sub(S.mutations), proc("dna-mismatch-repair", "molecular-biology"), soon("יחידה מלאה: שינויים במבנה הכרומוזומים"), soon("יחידה מלאה: שינויים במספר הכרומוזומים")] },
  ],
  lectures: [
    { n: 1, titleHe: "מבוא; חוק ההיפרדות", items: [sub(S.mendel), proc(MENDEL_ANIM)] },
    { n: 2, titleHe: "מיון בלתי תלוי, הסתברות ומבחן χ²", items: [sub(S.mendel), soon("יחידה מלאה: חוקי מנדל, הסתברות ומבחן χ²")] },
    { n: 3, titleHe: "התיאוריה הכרומוזומלית: מיוזה וחוקי מנדל", items: [proc("meiosis"), soon("יחידה מלאה: מיוזה וחוקי מנדל")] },
    { n: 4, titleHe: "קביעת מין ותורשה תאוחזת-מין", items: [sub(S.sexLinked)] },
    { n: 5, titleHe: "ניתוח שושלות באדם", items: [sub(S.patterns), soon("יחידה מלאה: ניתוח שושלות")] },
    { n: 6, titleHe: "הרחבות לחוקי מנדל ותורשה לא-מנדלית", items: [sub(S.codominance), sub(S.polygenic), sub(S.nonMendel), sub(S.mito), sub(S.imprinting)] },
    { n: 7, titleHe: "אינטראקציה בין גנים", items: [soon("יחידה מלאה: אפיסטזיס ויחסים מותאמים")] },
    { n: 8, titleHe: "מהות הגן", items: [soon("יחידה מלאה: מהות הגן")] },
    { n: 9, titleHe: "תאחיזה ושחלוף; הצלבה דו-נקודתית", items: [lm("intro"), lm("gametes"), lm("crossover"), lm("rf")] },
    { n: 10, titleHe: "הצלבה תלת-נקודתית, אינטרפרנציה, מפה גנטית ופיזית", items: [lm("three-point"), lm("interference"), lm("map-vs-physical")] },
    { n: 11, titleHe: "מיפוי באדם ובפטריות", items: [lm("human"), lm("tetrads")] },
    { n: 12, titleHe: "מוטציות: סוגים, גורמים ותיקון", items: [sub(S.mutations), proc("dna-mismatch-repair", "molecular-biology")] },
    { n: 13, titleHe: "שינויים במבנה הכרומוזומים ובמספרם", items: [soon("יחידה מלאה: שינויים במבנה ובמספר הכרומוזומים")] },
  ],
  tutorials: [
    { n: 1, titleHe: "בעיות מונוהיבריד והסתברות", items: [soon("תרגילים פתורים: מונוהיבריד והצלבת מבחן")] },
    { n: 2, titleHe: "דיהיבריד ומבחן χ²", items: [soon("תרגילים פתורים: דיהיבריד ו-χ²")] },
    { n: 3, titleHe: "מיוזה ומעקב אחר כרומוזומים", items: [soon("תרגילים פתורים: מיוזה")] },
    { n: 4, titleHe: "תורשה תאוחזת-מין", items: [soon("תרגילים פתורים: תאחיזה למין")] },
    { n: 5, titleHe: "ניתוח שושלות", items: [soon("תרגילים פתורים: שושלות")] },
    { n: 6, titleHe: "דומיננטיות חלקית, אללים מרובים וקטלניים", items: [soon("תרגילים פתורים: הרחבות למנדל")] },
    { n: 7, titleHe: "אפיסטזיס ויחסים מותאמים", items: [soon("תרגילים פתורים: אינטראקציה בין גנים")] },
    { n: 8, titleHe: "קומפלמנטציה", items: [soon("תרגילים פתורים: מבחן קומפלמנטציה")] },
    { n: 9, titleHe: "מיפוי דו-נקודתי וזיהוי פאזה", items: [lmWp("phase")] },
    { n: 10, titleHe: "מיפוי תלת-נקודתי ואינטרפרנציה", items: [lmWp("three-point")] },
    { n: 11, titleHe: "LOD וניתוח טטרדות", items: [lmWp("lod"), lmWp("tetrads")] },
    { n: 12, titleHe: "מוטציות", items: [soon("תרגילים פתורים: מוטציות")] },
    { n: 13, titleHe: "שינויים כרומוזומליים", items: [soon("תרגילים פתורים: שינויים כרומוזומליים")] },
  ],
};
