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
const da = (section?: string): PlanItem => ({ kind: "lesson", slug: "dominance-alleles", section });
const daWp = (problem: string): PlanItem => ({ kind: "lesson", slug: "dominance-alleles", problem });
const L = (slug: string) => (section?: string): PlanItem => ({ kind: "lesson", slug, section });
const W = (slug: string) => (problem: string): PlanItem => ({ kind: "lesson", slug, problem });
const ct = L("chromosomal-theory"), ctWp = W("chromosomal-theory");
const sd = L("sex-determination"), sdWp = W("sex-determination");
const mu = L("mutations"), muWp = W("mutations");
const cs = L("chromosome-structure"), csWp = W("chromosome-structure");
const cn = L("chromosome-number"), cnWp = W("chromosome-number");
const ng = L("nature-of-gene"), ngWp = W("nature-of-gene");
const gi = L("gene-interaction"), giWp = W("gene-interaction");
const nm = L("non-mendelian"), nmWp = W("non-mendelian");

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
  lectureOrder: {
    confidence: "students",
    noteHe: "אין לוח הרצאות ציבורי לקורס (אתר הקורס במודל סגור). הסדר שוחזר ממבנה הקורס בשנים קודמות ונבדק מול סטודנט שלמד בקורס; היחידות מכסות את כל נושאי הסילבוס העדכני.",
    links: [{ labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134020" }],
  },
  tutorialOrder: null,
  schedule: "suggested",
  scheduleNoteHe: "הנושאים לפי הסילבוס העדכני של הקורס בפורטל הטכניון (הוא מפרט נושאים, לא שבועות). הפירוט לתת-נושאים לפי ספרי הקורס (Klug, Griffiths); סדר ההרצאות משוחזר ממבנה הקורס בשנים קודמות ונבדק מול סטודנט בקורס.",
  topics: [
    { titleHe: "חוקי התורשה המנדליים והלא-מנדליים", items: [mp(), proc(MENDEL_ANIM), da(), nm(), sub(S.nonMendel), proc(NON_MENDEL_ANIM), sub(S.mito), proc(MITO_ANIM), sub(S.imprinting), proc("genomic-imprinting")] },
    { titleHe: "מהות הגן", items: [ng(), gi("one-gene-one-enzyme"), gi("ordering")] },
    { titleHe: "ניתוח שושלות", items: [pd(), sub(S.patterns)] },
    { titleHe: "התיאוריה הכרומוזומלית של התורשה", items: [ct(), proc("meiosis")] },
    { titleHe: "קביעת מין", items: [sd(), sub(S.sexLinked)] },
    { titleHe: "תאחיזה, שחלוף ומיפוי גנים", items: [lm()] },
    { titleHe: "מוטציות ושינויים במבנה הכרומוזומים ובמספרם", items: [mu(), cs(), cn(), sub(S.mutations), proc("dna-mismatch-repair", "molecular-biology")] },
    { titleHe: "אינטראקציה בין גנים", items: [gi(), sub(S.polygenic)] },
  ],
  lectures: [
    { n: 1, titleHe: "חוקי מנדל: היפרדות, מיון בלתי תלוי והצלבת מבחן", items: [mp("method"), mp("segregation"), mp("testcross"), mp("assortment"), proc(MENDEL_ANIM)] },
    { n: 2, titleHe: "הסתברות ומבחן χ²", items: [mp("probability"), mp("chi-square")] },
    { n: 3, titleHe: "הרחבות לחוקי מנדל: יחסי דומיננטיות, אללים מרובים וקטלניים", items: [da("dominance"), da("incomplete"), da("codominance"), da("multiple"), da("lethal"), da("pleiotropy"), da("sex-environment")] },
    { n: 4, titleHe: "ניתוח שושלות", items: [pd("symbols"), pd("patterns"), pd("deduction"), pd("risk"), pd("penetrance")] },
    { n: 5, titleHe: "מיוזה והתיאוריה הכרומוזומלית", items: [ct("terms"), ct("meiosis"), ct("mendel"), ct("proof"), proc("meiosis")] },
    { n: 6, titleHe: "קביעת מין, תאחיזה למין ופיצוי מינון", items: [sd("systems"), sd("human-vs-fly"), sd("sex-linkage"), sd("dosage")] },
    { n: 7, titleHe: "תאחיזה ושחלוף; הצלבה דו-נקודתית", items: [lm("intro"), lm("gametes"), lm("crossover"), lm("rf")] },
    { n: 8, titleHe: "הצלבה תלת-נקודתית, אינטרפרנציה ושיטות מיפוי", items: [lm("three-point"), lm("interference"), lm("map-vs-physical"), lm("human"), lm("tetrads")] },
    { n: 9, titleHe: "מוטציות: סוגים, מקורות, מוטגנים ותיקון", items: [mu("definition"), mu("point"), mu("spontaneous"), mu("mutagens"), mu("reversion"), mu("ames"), mu("repair")] },
    { n: 10, titleHe: "שינויים במבנה הכרומוזומים", items: [cs("overview"), cs("deletion"), cs("duplication"), cs("inversion"), cs("translocation")] },
    { n: 11, titleHe: "שינויים במספר הכרומוזומים", items: [cn("terms"), cn("nondisjunction"), cn("human"), cn("polyploidy")] },
    { n: 12, titleHe: "מהות הגן: DNA, קומפלמנטציה ומבנה עדין", items: [ng("dna"), ng("function"), ng("complementation"), ng("benzer"), ng("definition")] },
    { n: 13, titleHe: "מסלולים מטבוליים ואינטראקציה בין גנים", items: [gi("one-gene-one-enzyme"), gi("ordering"), gi("epistasis"), gi("complementary"), gi("recessive"), gi("dominant"), gi("duplicate"), gi("suppression"), gi("analysis")] },
    { n: 14, titleHe: "תורשה לא-מנדלית: השפעה אימהית, אברונים והחתמה", items: [nm("overview"), nm("maternal-effect"), nm("organelles"), nm("imprinting")] },
  ],
  tutorials: [
    { n: 1, titleHe: "מונוהיבריד, דיהיבריד והצלבת מבחן", items: [mpWp("testcross"), mpWp("trihybrid")] },
    { n: 2, titleHe: "הסתברות ומבחן χ²", items: [mpWp("binomial"), mpWp("chi-dihybrid")] },
    { n: 3, titleHe: "סוגי דם, אללים קטלניים ודומיננטיות חלקית", items: [daWp("abo-paternity"), daWp("abo-cross"), daWp("lethal-ratio"), daWp("incomplete-binomial")] },
    { n: 4, titleHe: "ניתוח שושלות", items: [pdWp("mode"), pdWp("cf-risk"), pdWp("hemophilia"), pdWp("penetrance"), pdWp("onset"), pdWp("bayes")] },
    { n: 5, titleHe: "מיוזה ומעקב אחר כרומוזומים", items: [ctWp("counting"), ctWp("one-meiosis"), ctWp("bridges")] },
    { n: 6, titleHe: "תאחיזה למין וקביעת מין", items: [sdWp("reciprocal"), sdWp("barr"), sdWp("chicks"), sdWp("fly-xa")] },
    { n: 7, titleHe: "מיפוי דו-נקודתי וזיהוי פאזה", items: [lmWp("phase")] },
    { n: 8, titleHe: "מיפוי תלת-נקודתי ואינטרפרנציה", items: [lmWp("three-point"), lmWp("lod"), lmWp("tetrads")] },
    { n: 9, titleHe: "מוטציות", items: [muWp("classify"), muWp("fluctuation"), muWp("ames"), muWp("suppressor")] },
    { n: 10, titleHe: "שינויים במבנה הכרומוזומים", items: [csWp("deletion-mapping"), csWp("paracentric"), csWp("robertsonian"), csWp("semisterility")] },
    { n: 11, titleHe: "שינויים במספר הכרומוזומים", items: [cnWp("xxy-origin"), cnWp("trisomic"), cnWp("autotetraploid"), cnWp("allopolyploid")] },
    { n: 12, titleHe: "קומפלמנטציה ומבנה עדין של הגן", items: [ngWp("complementation-matrix"), ngWp("cis-trans"), ngWp("benzer-rf"), ngWp("griffith")] },
    { n: 13, titleHe: "מסלולים מטבוליים, אפיסטזיס ויחסים מותאמים", items: [giWp("pathway-order"), giWp("ratio-id"), giWp("labrador"), giWp("complementation")] },
    { n: 14, titleHe: "תורשה לא-מנדלית", items: [nmWp("snail"), nmWp("igf2"), nmWp("mito-pedigree"), nmWp("which-mode")] },
  ],
};
