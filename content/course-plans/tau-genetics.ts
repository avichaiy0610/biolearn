import type { CoursePlan, PlanItem } from "./types";

// TAU 0455-2526 "גנטיקה כללית" — built with the course-track-builder skill, no insider input.
// Topics: the official IMS syllabus (2026), in its own order.
// Lectures + tutorials: the course's detailed syllabus of 2022-23 (Kupiec & Hagai) — 12 lessons,
// "every tirgul is on the previous lesson" (tirgul n practises lesson n). Lecturers changed since
// (2026: Eldar & Hagai), so the order is "official-past", not "official".

const G = "genetics", M = "molecular-biology";
const sub = (id: string, topic = G): PlanItem => ({ kind: "subtopic", topic, id });
const proc = (slug: string, topic = G): PlanItem => ({ kind: "process", topic, slug });
const soon = (titleHe: string): PlanItem => ({ kind: "soon", titleHe });
const L = (slug: string) => (section?: string): PlanItem => ({ kind: "lesson", slug, section });
const W = (slug: string) => (problem: string): PlanItem => ({ kind: "lesson", slug, problem });
const mp = L("mendel-probability"), mpWp = W("mendel-probability");
const da = L("dominance-alleles"), daWp = W("dominance-alleles");
const pd = L("pedigrees"), pdWp = W("pedigrees");
const ct = L("chromosomal-theory");
const sd = L("sex-determination"), sdWp = W("sex-determination");
const lm = L("linkage-mapping"), lmWp = W("linkage-mapping");
const mu = L("mutations"), muWp = W("mutations");
const cs = L("chromosome-structure");
const cn = L("chromosome-number");
const ng = L("nature-of-gene"), ngWp = W("nature-of-gene");
const gi = L("gene-interaction"), giWp = W("gene-interaction");
const nm = L("non-mendelian");

const S = {
  polygenic: "cmq508eeo000004l5m6pxii87",
  dnaStructure: "cmq0ts51u00098s4mtwy4vd4k",
  dogma: "cmq0ts51u000a8s4ml2iihx29",
  pcr: "cmq0ts51u000b8s4md085rv0s",
  expression: "cmq3elr4m000c04joltltpj6z",
};
const DETAILED = { labelHe: 'הסילבוס המפורט של הקורס (תשפ"ג)', url: "https://www.ims.tau.ac.il/Tal/Scans/Syllabus_Download.aspx?kurs=04552526&syllabus=kr_syllabus_s20221_k00_v00.pdf" };
const IMS = { labelHe: "הסילבוס ב-IMS", url: "https://www.ims.tau.ac.il/Tal/Syllabus/Syllabus_L.aspx?course=0455252601&year=2026" };

export const tauGeneticsPlan: CoursePlan = {
  courseSlug: "tau-genetics",
  lectureOrder: {
    confidence: "official-past",
    noteHe: 'לפי הסילבוס המפורט של הקורס משנת תשפ"ג (פרופ\' קופייק ופרופ\' חגי). המרצים השתנו מאז, ולכן ייתכנו שינויים בסדר. הנושאים — לפי הסילבוס הרשמי העדכני.',
    links: [DETAILED, IMS],
  },
  tutorialOrder: {
    confidence: "official-past",
    noteHe: 'לפי הסילבוס המפורט (תשפ"ג): כל תרגול עוסק בהרצאה של השבוע הקודם, ואין תרגול בשבוע הראשון. התרגילים הפתורים כאן שלנו — לא התרגילים מהספר שהקורס מפנה אליהם.',
    links: [DETAILED],
  },
  schedule: "official",
  scheduleNoteHe: 'לפי הסילבוס המפורט של הקורס (תשפ"ג).',
  topics: [
    { titleHe: "חוקי מנדל והרחבתם", items: [mp(), da(), pd(), proc("mendelian-genetics-animation-1780786392025")] },
    { titleHe: "התיאוריה הכרומוזומלית של ההורשה", items: [ct(), proc("meiosis")] },
    { titleHe: "קביעת מין", items: [sd()] },
    { titleHe: "דומיננטיות ורצסיביות", items: [da("dominance"), da("incomplete"), da("codominance")] },
    { titleHe: "שינויים במבנה הכרומוזומים ובמספרם", items: [cs(), cn()] },
    { titleHe: "השפעות סביבה על ביטוי הגנים", items: [da("sex-environment"), pd("penetrance")] },
    { titleHe: "אינטראקציה בין גנים", items: [gi()] },
    { titleHe: "גנטיקה של תכונות כמותיות", items: [sub(S.polygenic), soon("יחידה מלאה: תכונות כמותיות ותורשתיות")] },
    { titleHe: "תאחיזה ושחלוף; שיטות למיפוי גנים", items: [lm()] },
    { titleHe: "מבנה, שכפול, שיעתוק ותיקון של דנ\"א", items: [sub(S.dnaStructure, M), proc("dna-replication", M), proc("transcription", M), mu("repair"), proc("dna-mismatch-repair", M)] },
    { titleHe: "טבע הגן, תרגום ופיענוח הקוד הגנטי", items: [ng(), sub(S.dogma, M), proc("translation", M), soon("יחידה מלאה: פיענוח הקוד הגנטי")] },
    { titleHe: "סוגי המוטציות ופעולת חומרים מוטגניים", items: [mu()] },
    { titleHe: "בקרה על פעולת הגנים", items: [proc("lac-operon", M), sub(S.expression, M), soon("יחידה מלאה: בקרת ביטוי גנים בפרוקריוטים ובאאוקריוטים")] },
    { titleHe: "עקרונות של מניפולציית גנים", items: [sub(S.pcr, M), proc("pcr", M), soon("יחידה מלאה: גנטיקה הפוכה וסריקת ספריות")] },
    { titleHe: "גנים באוכלוסיות", items: [soon("יחידה מלאה: גנטיקה של אוכלוסיות ו-SNPs")] },
    { titleHe: "גנטיקה של מערכת החיסון ושל סרטן", items: [soon("יחידה מלאה: גנטיקה של מערכת החיסון ושל סרטן")] },
    { titleHe: "המהפכה הגנומית; אבולוציה של גנים וגנומים", items: [soon("יחידה מלאה: גנומיקה ואבולוציה של גנומים")] },
  ],
  lectures: [
    { n: 1, titleHe: "מהפכת הגנטיקה; תורשה של גן יחיד; מיון בלתי תלוי; דומיננטיות ורצסיביות", items: [mp("method"), mp("segregation"), mp("testcross"), mp("assortment"), mp("probability"), mp("chi-square"), da("dominance")] },
    { n: 2, titleHe: "עצי משפחה; קביעת מין; אינטראקציות: האפלו-אי-מספיקות, קו-דומיננטיות, ABO", items: [pd("symbols"), pd("patterns"), pd("deduction"), pd("risk"), sd("systems"), sd("sex-linkage"), da("incomplete"), da("codominance"), da("multiple")] },
    { n: 3, titleHe: "מיפוי כרומוזומים אאוקריוטיים ברקומבינציה", items: [lm("intro"), lm("gametes"), lm("crossover"), lm("rf"), lm("three-point"), lm("interference")] },
    { n: 4, titleHe: "מהו גן? מגנוטיפ לפנוטיפ; מסלולים ביוכימיים; קולינאריות", items: [ng("function"), gi("one-gene-one-enzyme"), gi("ordering"), gi("epistasis"), gi("analysis")] },
    { n: 5, titleHe: "בנזר ופאג' T4: מבנה עדין, קומפלמנטציה ומיפוי; פיענוח הקוד הגנטי", items: [ng("complementation"), ng("benzer"), proc("translation", M), soon("פיענוח הקוד הגנטי")] },
    { n: 6, titleHe: "בקרת ביטוי גנים בפרוקריוטים: האופרון", items: [proc("lac-operon", M), soon("יחידה מלאה: האופרון ובקרה חיובית ושלילית")] },
    { n: 7, titleHe: "ביטוי גנים באאוקריוטים; בקרת שעתוק; גנטיקה הפוכה", items: [proc("transcription", M), sub(S.expression, M), soon("יחידה מלאה: בקרת שעתוק באאוקריוטים")] },
    { n: 8, titleHe: "אבולוציה, מוטציות ותיקון DNA", items: [mu("definition"), mu("point"), mu("spontaneous"), mu("mutagens"), mu("repair"), proc("dna-mismatch-repair", M)] },
    { n: 9, titleHe: "SNPs, גנטיקה חישובית וגנטיקה של אוכלוסיות", items: [soon("יחידה מלאה: גנטיקה של אוכלוסיות ו-SNPs")] },
    { n: 10, titleHe: "תכונות מורכבות; גנטיקה וסביבה; אפיגנטיקה", items: [sub(S.polygenic), da("sex-environment"), nm("imprinting"), soon("יחידה מלאה: תכונות מורכבות ואפיגנטיקה")] },
    { n: 11, titleHe: "אבולוציה של גנים וגנומים; טרנספוזונים", items: [soon("יחידה מלאה: אבולוציה של גנומים וטרנספוזונים")] },
    { n: 12, titleHe: "המהפכה הגנומית", items: [soon("יחידה מלאה: פרויקט הגנום וגנומיקה")] },
  ],
  tutorials: [
    { n: 1, titleHe: "תרגול על הרצאה 1: מונוהיבריד, דיהיבריד, הסתברות", items: [mpWp("testcross"), mpWp("trihybrid"), mpWp("binomial"), mpWp("chi-dihybrid")] },
    { n: 2, titleHe: "תרגול על הרצאה 2: שושלות, סוגי דם ותאחיזה למין", items: [pdWp("mode"), pdWp("cf-risk"), pdWp("hemophilia"), daWp("abo-paternity"), daWp("abo-cross"), sdWp("reciprocal")] },
    { n: 3, titleHe: "תרגול על הרצאה 3: מיפוי", items: [lmWp("phase"), lmWp("three-point")] },
    { n: 4, titleHe: "תרגול על הרצאה 4: מסלולים ואינטראקציות", items: [giWp("pathway-order"), giWp("ratio-id"), giWp("labrador"), giWp("complementation")] },
    { n: 5, titleHe: "תרגול על הרצאה 5: קומפלמנטציה ומבנה עדין", items: [ngWp("complementation-matrix"), ngWp("cis-trans"), ngWp("benzer-rf")] },
    { n: 6, titleHe: "תרגול על הרצאה 6: האופרון", items: [soon("תרגילים פתורים: אופרון lac")] },
    { n: 7, titleHe: "תרגול על הרצאה 7: בקרה באאוקריוטים", items: [soon("תרגילים פתורים: בקרת שעתוק")] },
    { n: 8, titleHe: "תרגול על הרצאה 8: מוטציות ותיקון", items: [muWp("classify"), muWp("fluctuation"), muWp("ames"), muWp("suppressor")] },
    { n: 9, titleHe: "תרגול על הרצאה 9: גנטיקה של אוכלוסיות", items: [soon("תרגילים פתורים: הרדי-ויינברג")] },
    { n: 10, titleHe: "תרגול על הרצאה 10: תכונות מורכבות", items: [soon("תרגילים פתורים: תורשתיות")] },
    { n: 11, titleHe: "תרגול על הרצאה 11: אבולוציה של גנומים", items: [soon("תרגילים פתורים: אבולוציה של גנים")] },
  ],
};
