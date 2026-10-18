import type { CoursePlan, PlanItem } from "./types";

// Technion 01340020 "גנטיקה כללית" (3h lecture + 1h tutorial a week, 13 weeks).
// Topics: the CURRENT syllabus on the Technion students portal (topics only, no weeks).
// Lecture order: reconstructed from the course's chapter structure in earlier years
// (public summary, spring 2010) and checked with a student in the course (Oct 2026):
// topics missing from the current syllabus were removed (Hardy–Weinberg, bacterial
// mapping, gene regulation — now course 134119).

const G = "genetics";
const sub = (id: string): PlanItem => ({ kind: "subtopic", topic: G, id });
const proc = (slug: string, topic = G): PlanItem => ({ kind: "process", topic, slug });
const soon = (titleHe: string): PlanItem => ({ kind: "soon", titleHe });
const lm = (section?: string): PlanItem => ({ kind: "lesson", slug: "linkage-mapping", section });
const lmWp = (problem: string): PlanItem => ({ kind: "lesson", slug: "linkage-mapping", problem });
const mp = (section?: string): PlanItem => ({ kind: "lesson", slug: "mendel-probability", section });
const mpWp = (problem: string): PlanItem => ({ kind: "lesson", slug: "mendel-probability", problem });
const pd = (section?: string): PlanItem => ({ kind: "lesson", slug: "pedigrees", section });
const pdWp = (problem: string): PlanItem => ({ kind: "lesson", slug: "pedigrees", problem });

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
  scheduleNoteHe: "הנושאים לפי הסילבוס העדכני של הקורס בפורטל הטכניון (הוא מפרט נושאים, לא שבועות). סדר ההרצאות משוחזר ממבנה הקורס בשנים קודמות ונבדק מול סטודנט בקורס; נושאים שלא מופיעים בסילבוס העדכני הוצאו.",
  topics: [
    { titleHe: "חוקי התורשה המנדליים והלא-מנדליים", items: [mp(), proc(MENDEL_ANIM), sub(S.nonMendel), proc(NON_MENDEL_ANIM), sub(S.mito), proc(MITO_ANIM), sub(S.imprinting), proc("genomic-imprinting")] },
    { titleHe: "מהות הגן", items: [soon("יחידה מלאה: גן אחד–אנזים אחד וקומפלמנטציה")] },
    { titleHe: "ניתוח שושלות", items: [pd(), sub(S.patterns)] },
    { titleHe: "התיאוריה הכרומוזומלית של התורשה", items: [proc("meiosis"), soon("יחידה מלאה: מיוזה וחוקי מנדל; ניסויי מורגן")] },
    { titleHe: "קביעת מין", items: [sub(S.sexLinked), soon("יחידה מלאה: תאחיזה למין, קביעת מין ואינאקטיבציה של X")] },
    { titleHe: "תאחיזה, שחלוף ומיפוי גנים", items: [lm()] },
    { titleHe: "מוטציות ושינויים במבנה הכרומוזומים ובמספרם", items: [sub(S.mutations), proc("dna-mismatch-repair", "molecular-biology"), soon("יחידה מלאה: שינויים במבנה הכרומוזומים"), soon("יחידה מלאה: שינויים במספר הכרומוזומים")] },
    { titleHe: "אינטראקציה בין גנים", items: [sub(S.codominance), sub(S.polygenic), soon("יחידה מלאה: אפיסטזיס, יחסים מותאמים וסופרסיה")] },
  ],
  lectures: [
    { n: 1, titleHe: "חוקי מנדל: היפרדות, מיון בלתי תלוי והצלבת מבחן", items: [mp("method"), mp("segregation"), mp("testcross"), mp("assortment"), proc(MENDEL_ANIM)] },
    { n: 2, titleHe: "הסתברות ומבחן χ²", items: [mp("probability"), mp("chi-square")] },
    { n: 3, titleHe: "ניתוח שושלות", items: [pd("symbols"), pd("patterns"), pd("deduction"), pd("risk"), pd("penetrance")] },
    { n: 4, titleHe: "כרומוזומים, מיוזה והתיאוריה הכרומוזומלית", items: [proc("meiosis"), soon("יחידה מלאה: מיוזה וחוקי מנדל; ניסויי מורגן")] },
    { n: 5, titleHe: "תאחיזה למין וקביעת מין", items: [sub(S.sexLinked), soon("יחידה מלאה: תאחיזה למין, קביעת מין ואינאקטיבציה של X")] },
    { n: 6, titleHe: "תאחיזה ושחלוף; הצלבה דו-נקודתית", items: [lm("intro"), lm("gametes"), lm("crossover"), lm("rf")] },
    { n: 7, titleHe: "הצלבה תלת-נקודתית, אינטרפרנציה ושיטות מיפוי", items: [lm("three-point"), lm("interference"), lm("map-vs-physical"), lm("human"), lm("tetrads")] },
    { n: 8, titleHe: "מוטציות", items: [sub(S.mutations), proc("dna-mismatch-repair", "molecular-biology")] },
    { n: 9, titleHe: "שינויים במבנה הכרומוזומים", items: [soon("יחידה מלאה: חסרים, הכפלות, אינברסיות וטרנסלוקציות")] },
    { n: 10, titleHe: "שינויים במספר הכרומוזומים", items: [soon("יחידה מלאה: פוליפלואידיה ואנאופלואידיה")] },
    { n: 11, titleHe: "מהות הגן: גן אחד–אנזים אחד וקומפלמנטציה", items: [soon("יחידה מלאה: מהות הגן")] },
    { n: 12, titleHe: "אינטראקציה בין גנים: אפיסטזיס וסופרסיה", items: [sub(S.codominance), sub(S.polygenic), soon("יחידה מלאה: אפיסטזיס וסופרסיה")] },
    { n: 13, titleHe: "תורשה לא-מנדלית", items: [sub(S.nonMendel), sub(S.mito), sub(S.imprinting)] },
  ],
  tutorials: [
    { n: 1, titleHe: "מונוהיבריד, דיהיבריד והצלבת מבחן", items: [mpWp("testcross"), mpWp("trihybrid")] },
    { n: 2, titleHe: "הסתברות ומבחן χ²", items: [mpWp("binomial"), mpWp("chi-dihybrid")] },
    { n: 3, titleHe: "ניתוח שושלות", items: [pdWp("mode"), pdWp("cf-risk"), pdWp("hemophilia"), pdWp("penetrance")] },
    { n: 4, titleHe: "מיוזה ומעקב אחר כרומוזומים", items: [soon("תרגילים פתורים: מיוזה")] },
    { n: 5, titleHe: "תורשה תאוחזת-מין", items: [soon("תרגילים פתורים: תאחיזה למין")] },
    { n: 6, titleHe: "מיפוי דו-נקודתי וזיהוי פאזה", items: [lmWp("phase")] },
    { n: 7, titleHe: "מיפוי תלת-נקודתי ואינטרפרנציה", items: [lmWp("three-point"), lmWp("lod"), lmWp("tetrads")] },
    { n: 8, titleHe: "מוטציות", items: [soon("תרגילים פתורים: מוטציות")] },
    { n: 9, titleHe: "שינויים במבנה הכרומוזומים", items: [soon("תרגילים פתורים: אברציות כרומוזומליות")] },
    { n: 10, titleHe: "שינויים במספר הכרומוזומים", items: [soon("תרגילים פתורים: אנאופלואידיה")] },
    { n: 11, titleHe: "קומפלמנטציה", items: [soon("תרגילים פתורים: מבחן קומפלמנטציה")] },
    { n: 12, titleHe: "אפיסטזיס ויחסים מותאמים", items: [soon("תרגילים פתורים: אינטראקציה בין גנים")] },
    { n: 13, titleHe: "תורשה לא-מנדלית", items: [soon("תרגילים פתורים: תורשה לא-מנדלית")] },
  ],
};
