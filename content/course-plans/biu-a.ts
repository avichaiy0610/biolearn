import type { CoursePlan, OrderSource } from "./types";
import { L, soon, REUSE_NOTE_HE } from "./helpers";

/* Bar-Ilan, phase-1 mapping (2026-11-25), no insider input: animal physiology, biochemistry A and B, biostatistics.
   Every lecture list is the course's own lesson table from its syllabus PDF on the faculty site (synced record,
   visually checked in content/syllabi/manual.ts). The PDFs are from earlier years, so the order is "official-past". */

const biuOrder = (labelHe: string, url: string, yearHe: string): OrderSource => ({
  confidence: "official-past",
  noteHe: `לפי טבלת השיעורים בסילבוס הקורס (${yearHe}) שבאתר הפקולטה. ייתכנו שינויים בשנה הנוכחית. ` + REUSE_NOTE_HE,
  links: [{ labelHe, url }],
});
const topicsOf = (lectures: CoursePlan["lectures"]) => lectures.map(({ titleHe, items }) => ({ titleHe, items }));

/* ---------- 80206 מבוא לפיזיולוגיה של החי (Kandel) ---------- */
const mpot = L("ph-membrane-potential"), ap = L("ph-action-potential"), ch = L("nb-channels"), syn = L("ph-synapse"), nsyn = L("nb-synapse");
const zns = L("z-nervous-senses"), sen = L("nb-anatomy-senses");
const PHYS: CoursePlan["lectures"] = [
  { n: 1, titleHe: "מבוא לפיזיולוגיה של ממברנות", items: [L("cell-membranes")(), L("ph-transport")(), L("ph-diffusion")()] },
  { n: 2, titleHe: "פוטנציאל המנוחה של הממברנה", items: [mpot()] },
  { n: 3, titleHe: "תעלות יוניות", items: [ch("recap"), ch("selectivity"), L("ph-transport")("channel-structure")] },
  { n: 4, titleHe: "תעלות תלויות מתח ופוטנציאל הפעולה", items: [ap(), ch("voltage-gating"), ch("conduction")] },
  { n: 5, titleHe: "העברה סינפטית", items: [syn("types"), syn("release"), nsyn("release"), syn("epsp-ipsp"), syn("integration")] },
  { n: 6, titleHe: "תעלות יוניות המופעלות על ידי ליגנד", items: [syn("receptors"), nsyn("receptors"), syn("transmitters")] },
  { n: 7, titleHe: "מנגנון ההתכווצות של שריר השלד", items: [L("ph-skeletal-muscle")()] },
  { n: 8, titleHe: "חוש המישוש", items: [sen("senses"), L("sh-somatosensory")()] },
  { n: 9, titleHe: "חוש המישוש (המשך)", items: [L("sh-somatosensory")()] },
  { n: 10, titleHe: "בקרה על תנועה", items: [L("ph-nervous-system")("reflex"), sen("reflex-circuit"), L("ph-skeletal-muscle")("motor-units"), L("sh-motor-control")()] },
  { n: 11, titleHe: "החושים הכימיים", items: [zns("olfaction"), L("sh-special-senses")("taste"), L("sh-special-senses")("smell")] },
  { n: 12, titleHe: "חוש השמע", items: [zns("hair-cells"), zns("middle-ear"), L("sh-special-senses")("ear"), L("sh-special-senses")("hair-cells")] },
  { n: 13, titleHe: "חוש הראייה", items: [zns("eye"), L("cell-gpcr")("vision"), L("sh-special-senses")("photoreceptors"), L("sh-special-senses")("retinal-processing"), L("sh-special-senses")("color")] },
];
export const biuAnimalPhysiologyPlan: CoursePlan = {
  courseSlug: "biu-animal-physiology",
  lectureOrder: biuOrder("סילבוס הקורס (תשפ\"ה)", "https://life-sciences.biu.ac.il/sites/life-sciences/files/shared/Med%20Mechina/Sylabi25/%D7%A1%D7%99%D7%9C%D7%91%D7%95%D7%A1-%D7%9E%D7%91%D7%95%D7%90-%D7%9C%D7%A4%D7%99%D7%96%D7%99%D7%95%D7%9C%D7%95%D7%92%D7%99%D7%94-%D7%A9%D7%9C-%D7%94%D7%97%D7%99-80206-%D7%AA%D7%A9%D7%A4%D7%94.pdf", "תשפ\"ה"),
  tutorialOrder: null, schedule: "official", scheduleNoteHe: "לפי טבלת השיעורים בסילבוס הקורס (תשפ\"ה).",
  topics: topicsOf(PHYS), lectures: PHYS, tutorials: [],
};

/* ---------- 80201 ביוכימיה א' (Mathews & van Holde) ---------- */
const na = L("mol-nucleic-acids"), tx = L("mol-transcription-prok"), txe = L("mol-transcription-euk"), ps = L("protein-structure");
const hb = L("hemoglobin"), ek = L("enzyme-kinetics"), al = L("allosteric-regulation");
const BCA: CoursePlan["lectures"] = [
  { n: 1, titleHe: "ביולוגיה מולקולרית: מבנה DNA", items: [na("nucleotides"), na("polynucleotide"), na("double-helix")] },
  { n: 2, titleHe: "מבנה DNA", items: [na("forms"), na("melting"), na("supercoiling"), na("rna")] },
  { n: 3, titleHe: "הגנום, אנזימי רסטריקציה, אפיגנטיקה, החתמה", items: [L("gx-genome-structure")(), L("catalytic-mechanisms")("restriction"), L("mol-chromatin")("nucleosome")] },
  { n: 4, titleHe: "הגנום, אנזימי רסטריקציה, אפיגנטיקה, החתמה (המשך)", items: [L("gx-chromatin-modifications")("dna-methylation"), L("gx-epigenetics")(), L("non-mendelian")("imprinting")] },
  { n: 5, titleHe: "הכפלת DNA בפרוקריוטים ובאאוקריוטים; טלומרים וטלומראז", items: [L("mol-replication-fork")(), L("mol-replication-origins")()] },
  { n: 6, titleHe: "תיקון נזקים ב-DNA", items: [L("mol-repair")()] },
  { n: 7, titleHe: "שעתוק", items: [tx("basics"), tx("rnap"), tx("promoter")] },
  { n: 8, titleHe: "שעתוק", items: [tx("initiation"), tx("termination"), tx("alt-sigma")] },
  { n: 9, titleHe: "שעתוק", items: [txe()] },
  { n: 10, titleHe: "שעתוק", items: [L("mol-rna-processing")()] },
  { n: 11, titleHe: "תרגום", items: [L("mol-genetic-code")(), L("mol-ribosome-initiation")()] },
  { n: 12, titleHe: "תרגום", items: [L("mol-translation-elongation")()] },
  { n: 13, titleHe: "חלבונים: תרמודינמיקה של קיפול חלבונים", items: [L("protein-folding")("anfinsen"), L("protein-folding")("cooperative")] },
  { n: 14, titleHe: "תרמודינמיקה של קיפול חלבונים", items: [L("protein-folding")("pathway"), L("protein-folding")("chaperones"), L("protein-folding")("thermostability")] },
  { n: 15, titleHe: "מבנה ראשוני של חלבון", items: [L("amino-acids")(), ps("levels")] },
  { n: 16, titleHe: "מבנה שניוני של חלבון", items: [ps("backbone"), ps("secondary"), L("fibrous-membrane")("fibrous")] },
  { n: 17, titleHe: "מבנה שלישוני של חלבון", items: [ps("tertiary"), L("fibrous-membrane")("membrane")] },
  { n: 18, titleHe: "מבנה רבעוני של חלבון", items: [ps("quaternary")] },
  { n: 19, titleHe: "המוגלובין: מבנה ומחלות", items: [hb("myoglobin"), hb("heme"), hb("sickle")] },
  { n: 20, titleHe: "קואופרטיביות", items: [hb("cooperativity"), hb("models"), hb("effectors")] },
  { n: 21, titleHe: "אנזימולוגיה: מבוא", items: [L("enzyme-principles")()] },
  { n: 22, titleHe: "אנזימולוגיה: משוואות מיכאליס-מנטן", items: [ek("rates"), ek("michaelis"), ek("parameters"), ek("lineweaver")] },
  { n: 23, titleHe: "מעכבים אנזימטיים", items: [ek("reversible"), ek("irreversible")] },
  { n: 24, titleHe: "מבוא לבקרה אנזימטית", items: [al("feedback"), L("covalent-regulation")()] },
  { n: 25, titleHe: "אלוסטריות", items: [al("structure"), al("sigmoid"), al("effectors"), al("isozymes")] },
];
export const biuBiochemAPlan: CoursePlan = {
  courseSlug: "biu-biochem-a",
  lectureOrder: biuOrder("סילבוס הקורס", "https://life-sciences.biu.ac.il/sites/life-sciences/files/shared/Med%20BSc/%D7%91%D7%99%D7%95%D7%9B%D7%99%D7%9E%D7%99%D7%94-%D7%90'-80201.pdf", "השנה אינה מצוינת בקובץ"),
  tutorialOrder: null, schedule: "official", scheduleNoteHe: "לפי טבלת השיעורים בסילבוס הקורס.",
  topics: [
    { titleHe: "ביולוגיה מולקולרית: DNA, גנום, שכפול ותיקון", items: [na(), L("gx-genome-structure")(), L("gx-epigenetics")(), L("mol-replication-fork")(), L("mol-replication-origins")(), L("mol-repair")()] },
    { titleHe: "שעתוק ותרגום", items: [tx(), txe(), L("mol-rna-processing")(), L("mol-genetic-code")(), L("mol-ribosome-initiation")(), L("mol-translation-elongation")()] },
    { titleHe: "חלבונים: קיפול ומבנה", items: [L("protein-folding")(), L("amino-acids")(), ps(), L("fibrous-membrane")()] },
    { titleHe: "המוגלובין וקואופרטיביות", items: [hb()] },
    { titleHe: "אנזימולוגיה ובקרה אנזימטית", items: [L("enzyme-principles")(), ek(), al(), L("covalent-regulation")()] },
  ],
  lectures: BCA, tutorials: [],
};

/* ---------- 80202 ביוכימיה ב' (van Holde 4e) — four parts, numbered here continuously ---------- */
const mc = L("met-concepts"), gl = L("met-glycolysis"), ca = L("met-citric-acid"), ox = L("met-oxphos"), fa = L("met-fatty-acids");
const aa = L("met-amino-acids"), nu = L("met-nucleotides"), gng = L("met-gluconeogenesis"), gy = L("met-glycogen"), mi = L("met-integration");
const HEME = soon("יחידה מלאה: מטבוליזם של הם ופורפירינים — סינתזה ופירוק");
const BCB: CoursePlan["lectures"] = [
  { n: 1, titleHe: "חלק א': מבוא לקורס", items: [mc("overview")] },
  { n: 2, titleHe: "מבוא לביוכימיה; מבוא לביואנרגטיקה", items: [mc("atp"), mc("carriers"), L("b1-energy")("free-energy")] },
  { n: 3, titleHe: "מבנה פחמימות; גליקוקונייוגטים", items: [L("carbs-lipids")("monosaccharides"), L("carbs-lipids")("rings"), L("carbs-lipids")("glycosidic"), L("cell-golgi-endosomes")("glycosylation")] },
  { n: 4, titleHe: "סקירה: נשימה תאית ומסלולים מטבוליים מרכזיים", items: [L("b1-metabolism")("overview"), mc("regulation")] },
  { n: 5, titleHe: "גליקוליזה; תסיסה לקטית ואתנולית", items: [gl("overview"), gl("investment"), gl("payoff"), gl("pyruvate-fates")] },
  { n: 6, titleHe: "בקרה על תפקוד אנזימטי", items: [L("allosteric-regulation")(), L("covalent-regulation")("phosphorylation")] },
  { n: 7, titleHe: "בקרת הגליקוליזה", items: [gl("regulation"), gl("other-sugars")] },
  { n: 8, titleHe: "קומפלקס פירובט דהידרוגנאז", items: [ca("pdh")] },
  { n: 9, titleHe: "מעגל קרבס: עקרונות ותגובות", items: [ca("cycle"), ca("yield")] },
  { n: 10, titleHe: "בקרת מעגל קרבס ושילוב מסלולי הנשימה", items: [ca("regulation"), ca("anaplerotic")] },
  { n: 11, titleHe: "חלק ב': זרחון חמצוני, מבנה ממברנות והובלה", items: [ox("overview"), L("ph-transport")("classes")] },
  { n: 12, titleHe: "שרשרת העברת האלקטרונים", items: [ox("chain"), ox("atp-synthase"), ox("yield"), ox("control")] },
  { n: 13, titleHe: "איך כל מה שלמדנו מתבטא במציאות", items: [] },
  { n: 14, titleHe: "ממברנות ביולוגיות", items: [L("cell-membranes")(), L("carbs-lipids")("membrane-lipids"), L("carbs-lipids")("bilayer")] },
  { n: 15, titleHe: "מטבוליזם של חומצות שומן", items: [fa("storage"), fa("activation"), fa("synthesis")] },
  { n: 16, titleHe: "חמצון חומצות שומן", items: [fa("beta-oxidation"), fa("ketone-bodies"), fa("regulation")] },
  { n: 17, titleHe: "איך כל מה שלמדנו מתבטא במציאות", items: [] },
  { n: 18, titleHe: "חלק ג': תרכובות חנקן — עקרונות, מחזור החנקן וקיבוע אמוניה", items: [aa("nitrogen"), L("mv-nutrient-cycles")("nitrogen"), L("mv-nutrient-cycles")("nitrogenase")] },
  { n: 19, titleHe: "כלכלת החנקן: סינתזה ופירוק של חומצות אמינו ותחלופת חלבונים", items: [aa("turnover"), aa("urea-cycle"), L("ub-proteasome")("overview")] },
  { n: 20, titleHe: "מסלולי פירוק חומצות אמינו; חומצות אמינו כמקדימים", items: [aa("carbon-fates"), aa("biosynthesis")] },
  { n: 21, titleHe: "בקרת גלוטמין סינתטאז", items: [aa("nitrogen"), L("covalent-regulation")("covalent")] },
  { n: 22, titleHe: "פורפירינים והם; חומצות אמינו כמוליכים עצביים; ביוסינתזה", items: [aa("biosynthesis"), HEME] },
  { n: 23, titleHe: "מטבוליזם של נוקלאוטידים: פורינים", items: [nu("overview"), nu("purines"), nu("degradation")] },
  { n: 24, titleHe: "מטבוליזם של נוקלאוטידים: פירימידינים ודאוקסיריבונוקלאוטידים", items: [nu("pyrimidines"), nu("deoxy"), nu("regulation")] },
  { n: 25, titleHe: "מטבוליזם של הם: סינתזה ופירוק", items: [HEME] },
  { n: 26, titleHe: "חלק ד': גלוקונאוגנזה — מצעים, אנזימים ובקרה", items: [gng("why"), gng("bypasses"), gng("cost"), gng("reciprocal")] },
  { n: 27, titleHe: "סינתזה ופירוק של גליקוגן", items: [gy("structure"), gy("breakdown"), gy("synthesis"), gy("allosteric"), gy("hormones")] },
  { n: 28, titleHe: "מטבוליזם של לקטט", items: [gng("cori"), gl("pyruvate-fates")] },
  { n: 29, titleHe: "מצעים לגלוקונאוגנזה", items: [gng("bypasses"), aa("carbon-fates")] },
  { n: 30, titleHe: "פירוק חומצות אמינו ותוצרי הקצה החנקניים", items: [aa("urea-cycle")] },
  { n: 31, titleHe: "מחלות מטבוליות: פגמים במטבוליזם של גליקוגן", items: [gy("diseases")] },
  { n: 32, titleHe: "השפעת מוטציות באנזימים מטבוליים על מחלות", items: [L("md-inborn-errors")(), aa("pku")] },
  { n: 33, titleHe: "חלוקת העבודה המטבולית בין האיברים", items: [mi("organs"), L("md-crosstalk")()] },
  { n: 34, titleHe: "תיאום ההומאוסטזיס האנרגטי", items: [mi("hormones"), mi("fed-fasted"), mi("starvation"), L("md-fed-fasted")()] },
  { n: 35, titleHe: "סוכרת", items: [mi("diabetes"), L("md-diabetes")()] },
  { n: 36, titleHe: "אסטרטגיות טיפול בסוכרת מסוג 1 ו-2", items: [L("md-diabetes")("treatments")] },
  { n: 37, titleHe: "מנגנוני העברת אותות של הורמונים מטבוליים", items: [L("en-receptors")(), L("cell-signaling-principles")()] },
  { n: 38, titleHe: "GPCRs", items: [L("cell-gpcr")()] },
  { n: 39, titleHe: "שליחים שניוניים", items: [L("cell-signaling-principles")("second-messengers"), L("cell-gpcr")("camp"), L("cell-gpcr")("calcium")] },
  { n: 40, titleHe: "RTK", items: [L("cell-rtk")()] },
  { n: 41, titleHe: "הורמונים סטרואידים", items: [L("en-receptors")("nuclear"), L("en-steroids-disruptors")("nomenclature")] },
  { n: 42, titleHe: "הגבלה קלורית, הארכת חיים ואוטופגיה", items: [L("md-master-regulators")("mtor"), L("md-master-regulators")("sirt1"), L("md-autophagy")()] },
  { n: 43, titleHe: "אספקת הדלק המטבולי למוח", items: [soon("סעיף: המטבוליזם האנרגטי של המוח")] },
  { n: 44, titleHe: "קפאין ומטבוליזם אנרגטי", items: [soon("סעיף: קפאין ומטבוליזם אנרגטי")] },
];
export const biuBiochemBPlan: CoursePlan = {
  courseSlug: "biu-biochem-b",
  lectureOrder: {
    ...biuOrder("סילבוס הקורס", "https://life-sciences.biu.ac.il/sites/life-sciences/files/shared/Med%20BSc/%D7%91%D7%99%D7%95%D7%9B%D7%99%D7%9E%D7%99%D7%94-%D7%91'-80202.pdf", "השנה אינה מצוינת בקובץ"),
    noteHe: "לפי טבלת השיעורים בסילבוס הקורס: ארבעה חלקים של ארבעה מרצים; כאן הם ממוספרים ברצף. הציון: מטלות מקוונות 75% ומבחן 25%. " + REUSE_NOTE_HE,
  },
  tutorialOrder: null, schedule: "official", scheduleNoteHe: "לפי טבלת השיעורים בסילבוס הקורס.",
  topics: [
    { titleHe: "חלק א': ביואנרגטיקה, פחמימות, גליקוליזה ומעגל קרבס", items: [mc(), L("carbs-lipids")(), gl(), ca()] },
    { titleHe: "חלק ב': זרחון חמצוני, ממברנות וחומצות שומן", items: [ox(), L("cell-membranes")(), fa()] },
    { titleHe: "חלק ג': תרכובות חנקן, חומצות אמינו, נוקלאוטידים והם", items: [aa(), nu(), HEME] },
    { titleHe: "חלק ד': גלוקונאוגנזה, גליקוגן, אינטגרציה, סוכרת ואיתות הורמונלי", items: [gng(), gy(), mi(), L("md-diabetes")(), L("cell-gpcr")(), L("cell-rtk")(), L("md-autophagy")()] },
  ],
  lectures: BCB, tutorials: [],
};

/* ---------- 80150 ביוסטטיסטיקה ---------- */
const BS: CoursePlan["lectures"] = [
  { n: 1, titleHe: "תהליך המחקר המדעי; מהי סטטיסטיקה; משתנים ורמות מדידה", items: [L("bs-describing-data")("population"), L("bs-describing-data")("variable-types")] },
  { n: 2, titleHe: "סטטיסטיקה תיאורית: טבלת שכיחויות והצגה גרפית", items: [L("bs-describing-data")("frequency"), L("bs-describing-data")("graphs"), L("bs-describing-data")("shape")] },
  { n: 3, titleHe: "מדדי מרכז ומדדי פיזור", items: [L("bs-center-spread")()] },
  { n: 4, titleHe: "התפלגות נורמלית, ציון תקן ואחוזונים", items: [L("bs-normal-clt")("continuous"), L("bs-normal-clt")("normal"), L("bs-center-spread")("z-score")] },
  { n: 5, titleHe: "בדיקת השערות; מבחן Z", items: [L("bs-hypothesis-testing")("logic"), L("bs-hypothesis-testing")("p-value"), L("bs-hypothesis-testing")("errors")] },
  { n: 6, titleHe: "מבחן T; רווח סמך", items: [L("bs-hypothesis-testing")("one-sample-t"), L("bs-confidence-intervals")()] },
  { n: 7, titleHe: "מבחן T למדגמים בלתי תלויים ומזווגים; קריאת פלטים", items: [L("bs-two-means")()] },
  { n: 8, titleHe: "קורלציה ורגרסיה", items: [L("bs-correlation")(), L("bs-regression")()] },
  { n: 9, titleHe: "חי בריבוע", items: [L("bs-categorical")()] },
  { n: 10, titleHe: "ניתוח שונות חד-כיווני ודו-כיווני", items: [L("bs-anova")(), soon("סעיף: ניתוח שונות דו-כיווני")] },
];
export const biuBiostatisticsPlan: CoursePlan = {
  courseSlug: "biu-biostatistics",
  lectureOrder: biuOrder("סילבוס הקורס (תשפ\"ד)", "https://life-sciences.biu.ac.il/sites/life-sciences/files/shared/Med%20Mechina/Sylabi24/%D7%91%D7%99%D7%95%D7%A1%D7%98%D7%98%D7%99%D7%A1%D7%98%D7%99%D7%A7%D7%94-80-150-30-1).pdf", "תשפ\"ד"),
  tutorialOrder: null, schedule: "official", scheduleNoteHe: "לפי טבלת השיעורים בסילבוס הקורס (תשפ\"ד).",
  topics: topicsOf(BS), lectures: BS, tutorials: [],
};
