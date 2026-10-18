import type { CoursePlan, PlanItem } from "./types";

// Technion 01340020 "גנטיקה כללית" (3h lecture + 1h tutorial a week, 13 weeks).
// Topics follow the official syllabus. Lecture/tutorial order follows the chapter
// structure of a public student summary of this course (spring 2010, Anat Etzion-Fuchs:
// anatetzionfuchs.com) — the official semester schedule is on Moodle.

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
  scheduleNoteHe: "הסדר בנוי לפי מבנה הפרקים בסיכום הקורס מאביב תש\"ע (ענת עציון) ולפי הסילבוס הנוכחי. הלוח הרשמי של הסמסטר נמצא במודל, ועשוי להיות שונה מעט — במיוחד בקצב, לא בסדר הנושאים.",
  topics: [
    { titleHe: "חוקי התורשה המנדליים", items: [sub(S.mendel), proc(MENDEL_ANIM), soon("יחידה מלאה: חוקי מנדל, הסתברות ומבחן χ²")] },
    { titleHe: "תורשה מנדלית באדם וגנטיקה של אוכלוסיות", items: [sub(S.patterns), soon("יחידה מלאה: ניתוח שושלות"), soon("יחידה מלאה: חוק הרדי-ויינברג")] },
    { titleHe: "התיאוריה הכרומוזומלית וקביעת מין", items: [proc("meiosis"), sub(S.sexLinked), soon("יחידה מלאה: מיוזה וחוקי מנדל, תאחיזה למין, קביעת מין ואינאקטיבציה של X")] },
    { titleHe: "תאחיזה, שחלוף ומיפוי גנים", items: [lm(), soon("יחידה מלאה: מיפוי גנטי בחיידקים — קוניוגציה")] },
    { titleHe: "מוטציות ושינויים כרומוזומליים", items: [sub(S.mutations), proc("dna-mismatch-repair", "molecular-biology"), soon("יחידה מלאה: שינויים במבנה הכרומוזומים"), soon("יחידה מלאה: שינויים במספר הכרומוזומים"), soon("יחידה מלאה: מוטציות ואקראיותן")] },
    { titleHe: "מהות הגן", items: [soon("יחידה מלאה: גן אחד–אנזים אחד, קומפלמנטציה ורקומבינציה בפאג'ים")] },
    { titleHe: "אינטראקציה בין גנים", items: [sub(S.codominance), sub(S.polygenic), soon("יחידה מלאה: אפיסטזיס, יחסים מותאמים וסופרסיה")] },
    { titleHe: "תורשה לא-מנדלית", items: [sub(S.nonMendel), proc(NON_MENDEL_ANIM), sub(S.mito), proc(MITO_ANIM), sub(S.imprinting), proc("genomic-imprinting")] },
  ],
  lectures: [
    { n: 1, titleHe: "אנליזה גנטית: חוקי מנדל", items: [sub(S.mendel), proc(MENDEL_ANIM)] },
    { n: 2, titleHe: "תורשה מנדלית באדם: הסתברות וניתוח שושלות", items: [sub(S.patterns), soon("יחידה מלאה: ניתוח שושלות")] },
    { n: 3, titleHe: "גנטיקה של אוכלוסיות: חוק הרדי-ויינברג", items: [soon("יחידה מלאה: חוק הרדי-ויינברג")] },
    { n: 4, titleHe: "כרומוזומים, חלוקות תא והקשר לחוקי מנדל", items: [proc("meiosis"), soon("יחידה מלאה: מיוזה וחוקי מנדל")] },
    { n: 5, titleHe: "התיאוריה הכרומוזומלית: מורגן, תאחיזה למין וקביעת מין", items: [sub(S.sexLinked), soon("יחידה מלאה: תאחיזה למין, קביעת מין ואינאקטיבציה של X")] },
    { n: 6, titleHe: "תאחיזה ושחלוף; הצלבה דו-נקודתית", items: [lm("intro"), lm("gametes"), lm("crossover"), lm("rf")] },
    { n: 7, titleHe: "הצלבה תלת-נקודתית, אינטרפרנציה, מפה גנטית ופיזית", items: [lm("three-point"), lm("interference"), lm("map-vs-physical")] },
    { n: 8, titleHe: "מיפוי גנים באדם ובפטריות", items: [lm("human"), lm("tetrads")] },
    { n: 9, titleHe: "מיפוי גנטי בחיידקים: קוניוגציה", items: [soon("יחידה מלאה: קוניוגציה ומיפוי בחיידקים")] },
    { n: 10, titleHe: "שינויים במבנה הכרומוזומים", items: [soon("יחידה מלאה: חסרים, הכפלות, אינברסיות וטרנסלוקציות")] },
    { n: 11, titleHe: "שינויים במספר הכרומוזומים; מוטציות ואקראיותן", items: [sub(S.mutations), proc("dna-mismatch-repair", "molecular-biology"), soon("יחידה מלאה: פוליפלואידיה ואנאופלואידיה; ניסוי לוריא-דלבריק")] },
    { n: 12, titleHe: "מהות הגן: גן אחד–אנזים אחד וקומפלמנטציה", items: [soon("יחידה מלאה: מהות הגן")] },
    { n: 13, titleHe: "אינטראקציות גנטיות ותורשה לא-מנדלית", items: [sub(S.codominance), sub(S.polygenic), sub(S.nonMendel), sub(S.mito), sub(S.imprinting), soon("יחידה מלאה: אפיסטזיס וסופרסיה")] },
  ],
  tutorials: [
    { n: 1, titleHe: "מונוהיבריד, דיהיבריד והצלבת מבחן", items: [soon("תרגילים פתורים: חוקי מנדל")] },
    { n: 2, titleHe: "הסתברות וניתוח שושלות", items: [soon("תרגילים פתורים: שושלות")] },
    { n: 3, titleHe: "הרדי-ויינברג", items: [soon("תרגילים פתורים: הרדי-ויינברג")] },
    { n: 4, titleHe: "מיוזה ומעקב אחר כרומוזומים", items: [soon("תרגילים פתורים: מיוזה")] },
    { n: 5, titleHe: "תורשה תאוחזת-מין וקביעת מין", items: [soon("תרגילים פתורים: תאחיזה למין")] },
    { n: 6, titleHe: "מיפוי דו-נקודתי וזיהוי פאזה", items: [lmWp("phase")] },
    { n: 7, titleHe: "מיפוי תלת-נקודתי ואינטרפרנציה", items: [lmWp("three-point")] },
    { n: 8, titleHe: "LOD וניתוח טטרדות", items: [lmWp("lod"), lmWp("tetrads")] },
    { n: 9, titleHe: "מיפוי בחיידקים", items: [soon("תרגילים פתורים: קוניוגציה")] },
    { n: 10, titleHe: "שינויים במבנה הכרומוזומים", items: [soon("תרגילים פתורים: אברציות כרומוזומליות")] },
    { n: 11, titleHe: "שינויים במספר הכרומוזומים ומוטציות", items: [soon("תרגילים פתורים: אנאופלואידיה ומוטציות")] },
    { n: 12, titleHe: "קומפלמנטציה", items: [soon("תרגילים פתורים: מבחן קומפלמנטציה")] },
    { n: 13, titleHe: "אפיסטזיס ויחסים מותאמים", items: [soon("תרגילים פתורים: אינטראקציה בין גנים")] },
  ],
};
