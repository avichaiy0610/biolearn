import type { CoursePlan, OrderSource } from "./types";
import { L, soon, REUSE_NOTE_HE } from "./helpers";

/* Bar-Ilan, phase-1 mapping (2026-11-25), no insider input: cell biology (80103, 80548), genetics, microbiology,
   molecular A and B, systems physiology, virology. Lecture lists = the lesson table of each course's syllabus PDF
   (synced record, visually checked in content/syllabi/manual.ts); the PDFs are from earlier years → "official-past". */

const biuOrder = (url: string, yearHe: string, extraHe = ""): OrderSource => ({
  confidence: "official-past",
  noteHe: `לפי טבלת השיעורים בסילבוס הקורס (${yearHe}) שבאתר הפקולטה. ייתכנו שינויים בשנה הנוכחית. ${extraHe}` + REUSE_NOTE_HE,
  links: [{ labelHe: `סילבוס הקורס (${yearHe})`, url }],
});
const topicsOf = (lectures: CoursePlan["lectures"]) => lectures.map(({ titleHe, items }) => ({ titleHe, items }));
const base = (courseSlug: string, lectures: CoursePlan["lectures"], order: OrderSource, yearHe: string, topics = topicsOf(lectures)): CoursePlan => ({
  courseSlug, lectureOrder: order, tutorialOrder: null, schedule: "official",
  scheduleNoteHe: `לפי טבלת השיעורים בסילבוס הקורס (${yearHe}).`, topics, lectures, tutorials: [],
});

/* ---------- 80103 ביולוגיה של התא (Alberts) ---------- */
const CELL: CoursePlan["lectures"] = [
  { n: 1, titleHe: "מבוא כללי", items: [L("b1-cells")(), L("b1-eukaryotic-cell")()] },
  { n: 2, titleHe: "ממברנת התא: מבנה ותפקוד", items: [L("cell-membranes")()] },
  { n: 3, titleHe: "ממברנת התא: נשאים ומובילים", items: [L("ph-transport")()] },
  { n: 4, titleHe: "אנדוציטוזה ואקסוציטוזה", items: [L("cell-golgi-endosomes")("endocytosis"), L("cell-golgi-endosomes")("endosomes"), L("cell-vesicle-transport")("secretion")] },
  { n: 5, titleHe: "שלד התא: מבנה ותפקוד; חלבונים מוטוריים", items: [L("cell-cytoskeleton")(), L("cell-motors-polarity")()] },
  { n: 6, titleHe: "צמתים בין תאים", items: [L("cell-junctions")()] },
  { n: 7, titleHe: "תקשורת תאית והעברת אותות", items: [L("cell-signaling-principles")(), L("cell-gpcr")(), L("cell-rtk")()] },
  { n: 8, titleHe: "הגרעין", items: [L("cell-nuclear-mito-import")("pore"), L("cell-nuclear-mito-import")("nls"), L("cell-nuclear-mito-import")("ran"), L("b1-eukaryotic-cell")("nucleus")] },
  { n: 9, titleHe: "שכפול DNA", items: [L("mol-replication-fork")()] },
  { n: 10, titleHe: "ארגון ה-DNA ומבנה הכרומטין", items: [L("mol-chromatin")()] },
  { n: 11, titleHe: "שעתוק ועיבוד RNA", items: [L("mol-transcription-euk")(), L("mol-rna-processing")()] },
  { n: 12, titleHe: "הגרעינון", items: [L("mol-rna-processing")("rrna-trna"), L("mol-transcription-euk")("pol-i-iii"), L("rn-snorna")("guide-principle")] },
  { n: 13, titleHe: "תרגום חלבונים", items: [L("mol-genetic-code")(), L("mol-ribosome-initiation")(), L("mol-translation-elongation")()] },
  { n: 14, titleHe: "מיון חלבונים בתוך התא", items: [L("cell-er")(), L("cell-nuclear-mito-import")("mitochondria")] },
];
export const biuCellPlan = base("biu-cell", CELL, biuOrder("https://life-sciences.biu.ac.il/sites/life-sciences/files/shared/Med%20Mechina/Sylabi25/80103-%D7%A1%D7%99%D7%9C%D7%91%D7%95%D7%A1-%D7%A2%D7%93%D7%9B%D7%A0%D7%99-%D7%AA%D7%A9%D7%A4%D7%94.pdf", "תשפ\"ה"), "תשפ\"ה");

/* ---------- 80548 התא: מבנה ותפקוד ---------- */
const CF: CoursePlan["lectures"] = [
  { n: 1, titleHe: "קיפול ופירוק חלבונים: צ'פרונים, יוביקוויטין, ליזוזום ופרוטאזום", items: [L("protein-folding")("chaperones"), L("cell-quality-control")("ups"), L("ub-proteasome")(), L("cell-golgi-endosomes")("autophagy")] },
  { n: 2, titleHe: "ה-ER: מבנה, כניסת חלבונים, טרנסלוקון וחלבונים טרנס-ממברנליים", items: [L("cell-er")()] },
  { n: 3, titleHe: "כשל בקיפול; מעבר מ-ER לגולג'י; ERAD, עקת ER ו-UPR", items: [L("cell-quality-control")("folding"), L("cell-quality-control")("calnexin"), L("cell-quality-control")("erad"), L("cell-quality-control")("upr"), L("cell-vesicle-transport")("coats")] },
  { n: 4, titleHe: "בין התמודדות לאפופטוזיס; הפרוקסיזום", items: [L("cell-quality-control")("upr"), L("cell-death")("intrinsic"), soon("סעיף: הפרוקסיזום — מבנה ויבוא חלבונים")] },
  { n: 5, titleHe: "סיסטיק פיברוזיס: מחלה של כשל בקיפול", items: [L("protein-folding")("misfolding"), L("ph-transport")("abc")] },
  { n: 6, titleHe: "איתות באמצעות יוני סידן", items: [L("cell-gpcr")("calcium"), L("md-calcium")("signal")] },
  { n: 7, titleHe: "מחלות נוירודגנרטיביות: אלצהיימר, פרקינסון ו-ALS", items: [L("nb-neurodegeneration")()] },
  { n: 8, titleHe: "מנגנוני הובלת וזיקולות", items: [L("cell-vesicle-transport")()] },
  { n: 9, titleHe: "שלד התא: אקטין, מיקרוטובולים וסיבי ביניים", items: [L("cell-cytoskeleton")()] },
  { n: 10, titleHe: "איתות תאי: RTKs ו-GPCRs", items: [L("cell-rtk")(), L("cell-gpcr")()] },
  { n: 11, titleHe: "גרעין התא: ארגון, שוערי הגרעין ושלד הגרעין", items: [L("cell-nuclear-mito-import")("pore"), L("cell-nuclear-mito-import")("nls"), L("gx-genome-wide")("nucleus"), soon("סעיף: הלמינה ושלד הגרעין")] },
];
export const biuCellFunctionPlan = base("biu-cell-function", CF, biuOrder("https://life-sciences.biu.ac.il/sites/life-sciences/files/shared/Med%20Mechina/Sylabi24/11.2023-80-548-30-%D7%A1%D7%99%D7%9C%D7%91%D7%95%D7%A1-%D7%A7%D7%95%D7%A8%D7%A1-%D7%94%D7%AA%D7%90-%D7%9E%D7%91%D7%A0%D7%94-%D7%95%D7%AA%D7%A4%D7%A7%D7%95%D7%93.pdf", "תשפ\"ד", "הציון — בחנים בחומר סגור לאורך הסמסטר. "), "תשפ\"ד");

/* ---------- 80208 גנטיקה (Griffiths 12e) — the syllabus gives three blocks of lessons, not single lessons ---------- */
const mp = L("mendel-probability"), lm = L("linkage-mapping"), gi = L("gene-interaction"), mu = L("mutations");
const GEN: CoursePlan["lectures"] = [
  { n: 1, titleHe: "שיעורים 1–7: מנדל, סגרגציה, הבסיס הכרומוזומלי, שושלות, מיפוי ואינטראקציות", items: [mp(), L("chromosomal-theory")(), L("dominance-alleles")(), L("pedigrees")(), L("sex-determination")("sex-linkage"), lm("intro"), lm("crossover"), lm("rf"), lm("three-point"), L("nature-of-gene")("complementation"), gi("epistasis"), gi("suppression"), mu("definition")] },
  { n: 2, titleHe: "שיעורים 7–14: טטרדות, מיפוי בחיידקים, גנטיקה מולקולרית ומוטציות", items: [lm("tetrads"), L("mv-gene-transfer")("conjugation"), soon("סעיף: מיפוי בחיידקים — זיווג מופרע ומיפוי עדין"), gi("one-gene-one-enzyme"), gi("ordering"), gi("analysis"), L("hg-cancer")("synthetic-lethality"), mu("point"), mu("reversion")] },
  { n: 3, titleHe: "שיעורים 14–20: יציבות הגנום, שינויים כרומוזומליים, תורשה חוץ-גרעינית, אוכלוסיות ואפיגנטיקה", items: [L("hg-repeats")(), L("gx-repeats-mobile")(), L("mv-gene-transfer")("transposons"), L("chromosome-structure")(), L("chromosome-number")(), L("gx-epigenetics")("x-inactivation"), L("non-mendelian")(), L("hg-mitochondrial")(), L("hg-imprinting")(), L("pedigrees")("hardy-weinberg"), L("ev-selection")("hardy-weinberg"), L("mol-recombination")(), L("gx-epigenetics")("definition"), L("gx-chromatin-modifications")("marks")] },
];
export const biuGeneticsPlan = base("biu-genetics", GEN, biuOrder("https://life-sciences.biu.ac.il/sites/life-sciences/files/shared/Med%20Mechina/Sylabi24/80-208-30-%D7%92%D7%A0%D7%98%D7%99%D7%A7%D7%94-%D7%AA%D7%A9%D7%A4%D7%93.pdf", "תשפ\"ד", "הסילבוס מחלק את הקורס לשלושה גושי שיעורים של שלושה מרצים, וגם מפרט מה לא נלמד באותה שנה (למשל קביעת מין, מוטגנים, טרנספורמציה וטרנסדוקציה). "), "תשפ\"ד");

/* ---------- 80203 מיקרוביולוגיה כללית ---------- */
const MIC: CoursePlan["lectures"] = [
  { n: 1, titleHe: "התא הפרוקריוטי מול האאוקריוטי; גדילת חיידקים ומדידתה; סביבות קיצון", items: [L("b1-cells")("prokaryotic"), L("mv-cell-envelope")("size-shape"), L("mv-growth")(), L("mv-environment")("temperature")] },
  { n: 2, titleHe: "דופן התא וביוסינתזה; גראם חיובי/שלילי; תכלילים; תנועה וכימוטקסיס", items: [L("mv-cell-envelope")("peptidoglycan"), L("mv-cell-envelope")("gram-positive"), L("mv-cell-envelope")("gram-negative"), L("mv-surface-motility")()] },
  { n: 3, titleHe: "תזונה, אנבוליזם וקטבוליזם; תסיסה ונשימה", items: [L("mv-growth")("media"), L("mv-metabolic-diversity")()] },
  { n: 4, titleHe: "מחזורי פחמן, חנקן וגופרית; מרבדים מיקרוביאליים", items: [L("mv-nutrient-cycles")(), L("mv-ecology")("biofilm")] },
  { n: 5, titleHe: "חומרים אנטי-מיקרוביאליים, אנטיביוטיקה ועמידות", items: [L("mv-antibiotics")()] },
  { n: 6, titleHe: "בקרת גנים בחיידקים: דיכוי, השראה, בקרה גלובלית ומערכות דו-רכיביות", items: [L("gx-operons")(), L("mol-transcription-prok")("alt-sigma"), L("pg-evasion-regulation")("two-component")] },
  { n: 7, titleHe: "תוכניות גנטיות: נבגים, התגובה הסטרינגנטית ותיקון SOS", items: [L("mv-endospores")("sporulation"), L("mol-repair")("tls"), soon("סעיף: התגובה הסטרינגנטית ותגובת SOS")] },
  { n: 8, titleHe: "גנטיקה של חיידקים: טרנספורמציה, טרנסדוקציה, קוניוגציה ופלסמידים", items: [L("mv-gene-transfer")()] },
  { n: 9, titleHe: "חסינות חיידקית: אנזימי רסטריקציה, הדבקה מופסקת, CBASS ו-CRISPR", items: [L("vr-bacterial-defenses")(), L("mv-phages")("defenses")] },
  { n: 10, titleHe: "אלימות חיידקית ויחסי מאכסן-מיקרוביום", items: [L("pg-microbiome")(), L("mv-ecology")("microbiome"), L("pg-adhesion")(), L("pg-toxins")(), L("mv-clinical")()] },
];
export const biuMicrobiologyPlan = base("biu-microbiology", MIC, biuOrder("https://life-sciences.biu.ac.il/sites/life-sciences/files/shared/Med%20Mechina/Sylabi23/80-203-%D7%9E%D7%99%D7%A7%D7%A8%D7%95%D7%91%D7%99%D7%95%D7%9C%D7%95%D7%92%D7%99%D7%94-%D7%9B%D7%9C%D7%9C%D7%99%D7%AA.pdf", "תשפ\"ג"), "תשפ\"ג");

/* ---------- 80242 ביולוגיה מולקולרית (שיטות) ---------- */
const MOLA: CoursePlan["lectures"] = [
  { n: 1, titleHe: "מבוא; DNA: אנזימי רסטריקציה והפרדה בג'ל", items: [L("b1-dna")("genetic-engineering"), L("catalytic-mechanisms")("restriction"), L("mol-nucleic-acids")("blotting")] },
  { n: 2, titleHe: "שיבוט, פלסמידים ווקטורי ביטוי", items: [L("mol-pcr-sequencing")("cloning")] },
  { n: 3, titleHe: "סימון DNA, היברידיזציה, Southern, ספרייה גנומית; SKY ו-FISH", items: [L("mol-nucleic-acids")("melting"), L("mol-nucleic-acids")("blotting"), L("mv-methods")("fish"), soon("סעיף: ספריות גנומיות ו-cDNA, סימון והכלאה")] },
  { n: 4, titleHe: "קביעת רצף DNA: משיטות בסיסיות ועד ריצוף גנום", items: [L("mol-pcr-sequencing")("sanger"), L("bi-sequencing")("technologies")] },
  { n: 5, titleHe: "שיטות אבחון גנטי (כולל RFLP)", items: [L("hg-diagnosis")(), L("hg-mapping-cloning")("linkage")] },
  { n: 6, titleHe: "RNA: ביטוי ייחודי לרקמה; Northern; ספריית cDNA; RNA-seq ומערכים", items: [L("mol-transcription-methods")("northern"), L("gx-expression-data")("rna-seq"), L("bi-rnaseq")()] },
  { n: 7, titleHe: "RT-PCR ו-Real-Time PCR; השוואת שיטות לבחינת ביטוי", items: [L("gx-expression-data")("rt"), L("gx-expression-data")("qpcr"), L("gx-expression-data")("ddct"), L("gx-expression-data")("primers")] },
  { n: 8, titleHe: "חלבונים: ג'ל חד- ודו-ממדי, ספקטרומטריית מסות, נוגדנים וצביעה", items: [L("protein-methods")("electrophoresis"), L("protein-methods")("mass"), L("im-antibodies")("hybridomas"), L("cell-methods")("antibodies"), L("cell-methods")("immunofluorescence")] },
  { n: 9, titleHe: "Western blot, תיוג אפיטופים וחלבונים פלואורסצנטיים", items: [L("mol-genetic-code")("western"), L("cell-methods")("gfp"), L("cell-methods")("fluorescence")] },
  { n: 10, titleHe: "קישור בין חלבונים: GST, שמרים דו-היברידיים, FRET, IP-WB", items: [soon("יחידה מלאה: שיטות לזיהוי קישור בין חלבונים — GST, שמרים דו-היברידיים, FRET ו-IP")] },
  { n: 11, titleHe: "עבודה עם תאים: תרבית, FACS, ביטוי זמני ויציב, גנים מדווחים", items: [L("cell-methods")("flow"), L("mol-transcription-methods")("reporter"), L("sc-culture")("conditions")] },
  { n: 12, titleHe: "קישור חלבון-DNA; מוטגנזה מכוונת", items: [L("mol-transcription-methods")("emsa"), L("mol-transcription-methods")("footprint"), L("mol-transcription-methods")("chip"), L("gx-genomic-tracks")("chip-seq"), soon("סעיף: מוטגנזה מכוונת")] },
  { n: 13, titleHe: "חיות טרנסגניות; השתקת גנים; עכברי knockout; CRISPR", items: [L("gx-crispr-tools")(), L("gx-ncrna")("sirna"), L("pp-research-tools")("silencing-editing"), soon("סעיף: עכברים טרנסגניים ועכברי knockout")] },
];
export const biuMolecularAPlan = base("biu-molecular-a", MOLA, biuOrder("https://life-sciences.biu.ac.il/sites/life-sciences/files/shared/Med%20Mechina/Sylabi25/%D7%A1%D7%99%D7%9C%D7%91%D7%95%D7%A1-%D7%92%D7%A8%D7%A1%D7%94-%D7%97%D7%93%D7%A9%D7%94-2025-%D7%9E%D7%95%D7%9C%D7%A7%D7%95%D7%9C%D7%A8%D7%99%D7%AA-242-30.pdf", "תשפ\"ה"), "תשפ\"ה");

/* ---------- 80377 ביולוגיה מולקולרית והנדסה גנטית ב ---------- */
const MOLB: CoursePlan["lectures"] = [
  { n: 1, titleHe: "DNA, כרומוזומים, גנום ואפיגנטיקה", items: [L("mol-chromatin")(), L("gx-genome-structure")(), L("gx-epigenetics")()] },
  { n: 2, titleHe: "כיצד תאים קוראים את הגנום; בקרת ביטוי גנים", items: [L("gx-cis-elements")(), L("gx-transcription-factors")(), L("gx-chromatin-modifications")()] },
  { n: 3, titleHe: "עריכה גנטית בעזרת CRISPR", items: [L("gx-crispr-tools")(), L("mol-repair")("crispr")] },
  { n: 4, titleHe: "שיטות למדידת דיוק העריכה הגנטית", items: [soon("יחידה מלאה: מדידת דיוק העריכה הגנטית — off-target ושיטות ריצוף")] },
  { n: 5, titleHe: "עריכה אפיגנטית ומה עוד אפשר לעשות עם הגנום", items: [L("gx-crispr-tools")("dcas9"), L("gx-crispr-tools")("reading")] },
  { n: 6, titleHe: "סריקות כלל-גנומיות", items: [L("gx-genome-wide")("methods"), soon("יחידה מלאה: סריקות גנטיות כלל-גנומיות (CRISPR screens)")] },
  { n: 7, titleHe: "Omics I: גנומיקה", items: [L("bi-sequencing")(), L("gx-genome-structure")("genes")] },
  { n: 8, titleHe: "Omics II: טרנסקריפטומיקה ו-RNA-seq של תאים בודדים", items: [L("bi-rnaseq")(), L("bi-singlecell")(), L("gx-expression-data")("volcano")] },
  { n: 9, titleHe: "Omics III: Ribosome display ופרוטאומיקה", items: [L("protein-methods")("mass"), L("dg-display")(), soon("סעיף: פרוטאומיקה כמותית")] },
  { n: 10, titleHe: "בקרה על רמות חלבונים: תרגום ופירוק", items: [L("gx-translation-control")(), L("ub-conjugation")(), L("ub-proteasome")()] },
];
export const biuMolecularBPlan = base("biu-molecular-b", MOLB, biuOrder("https://life-sciences.biu.ac.il/sites/life-sciences/files/shared/Med%20Mechina/Sylabi24/80-377-30%D7%91%D7%99%D7%95%D7%9C%D7%95%D7%92%D7%99%D7%94-%D7%9E%D7%95%D7%9C%D7%A7%D7%95%D7%9C%D7%A8%D7%99%D7%AA-%D7%95%D7%94%D7%A0%D7%93%D7%A1%D7%94-%D7%92%D7%A0%D7%98%D7%99%D7%AA-%D7%91_0.pdf", "תשפ\"ד"), "תשפ\"ד");

/* ---------- 80214 פיזיולוגיה של מערכות (Tortora) ---------- */
const HEART = L("sh-heart")();
const VESSELS = L("sh-vessels")();
const LUNG = L("sh-respiration")();
const SYS: CoursePlan["lectures"] = [
  { n: 1, titleHe: "מבוא: רמות הארגון, הומאוסטזיס, מערכת העצבים האוטונומית והמערכת האנדוקרינית", items: [L("ph-anatomy")("terms"), L("en-intro")(), L("en-control")("negative"), L("sh-homeostasis-autonomic")()] },
  { n: 2, titleHe: "מרכיבי הדם; אנטומיה של הלב; מחזורי הדם; מחזור הדם בעובר", items: [L("ph-blood")("composition"), L("ph-anatomy")("thorax"), L("z-respiration")("circulation"), HEART] },
  { n: 3, titleHe: "מעבר הדם בלב; המעגל הכלילי; התכווצות תא שריר הלב", items: [L("ph-smooth-cardiac-muscle")("cardiac-structure"), L("ph-smooth-cardiac-muscle")("cicr"), HEART] },
  { n: 4, titleHe: "מערכת ההולכה החשמלית בלב; חשמל מול התכווצות", items: [L("ph-smooth-cardiac-muscle")("cardiac-regulation"), HEART] },
  { n: 5, titleHe: "מחלות לב; הפרעות קצב באק\"ג", items: [HEART] },
  { n: 6, titleHe: "לחצים במדורי הלב; תפוקת הלב; אי-ספיקת לב", items: [HEART] },
  { n: 7, titleHe: "ויסות תפוקת הלב על ידי מערכת העצבים וההורמונים", items: [L("ph-smooth-cardiac-muscle")("cardiac-regulation"), HEART] },
  { n: 8, titleHe: "כלי הדם; סינון וספיגה; המודינמיקה", items: [L("ph-kidney-filtration")("starling"), VESSELS] },
  { n: 9, titleHe: "ויסות לחץ הדם וזרימת הדם; שוק היפוולמי", items: [L("ph-volume-pressure")("blood-pressure"), L("ph-volume-pressure")("raas"), L("ph-volume-pressure")("volume-sensors"), VESSELS] },
  { n: 10, titleHe: "אנטומיה של דרכי הנשימה; חילופי גזים", items: [L("z-respiration")("reptiles-mammals"), LUNG] },
  { n: 11, titleHe: "הסעת חמצן ופחמן דו-חמצני", items: [L("hemoglobin")("cooperativity"), L("hemoglobin")("effectors"), LUNG] },
  { n: 12, titleHe: "מכניקת הנשימה; נפחי ריאה; מחלות ריאה", items: [LUNG] },
  { n: 13, titleHe: "ויסות הנשימה", items: [LUNG] },
];
export const biuSystemsPhysiologyPlan = base("biu-systems-physiology", SYS, biuOrder("https://life-sciences.biu.ac.il/sites/life-sciences/files/shared/Med%20Mechina/Sylabi25/%D7%A1%D7%99%D7%9C%D7%91%D7%95%D7%A1-%D7%A4%D7%99%D7%96%D7%99%D7%95%D7%9C%D7%95%D7%92%D7%99%D7%94-%D7%A9%D7%9C-%D7%9E%D7%A2%D7%A8%D7%9B%D7%95%D7%AA-80214-%D7%AA%D7%A9%D7%A4%D7%94.pdf", "תשפ\"ה"), "תשפ\"ה", [
  { titleHe: "מבוא: הומאוסטזיס ומערכות הבקרה", items: SYS[0].items },
  { titleHe: "המערכת הקרדיווסקולרית (שיעורים 2–9)", items: [L("ph-blood")("composition"), L("ph-smooth-cardiac-muscle")("cardiac-structure"), L("ph-smooth-cardiac-muscle")("cicr"), L("ph-smooth-cardiac-muscle")("cardiac-regulation"), L("ph-volume-pressure")(), HEART, VESSELS] },
  { titleHe: "מערכת הנשימה (שיעורים 10–13)", items: [L("z-respiration")("reptiles-mammals"), L("hemoglobin")("cooperativity"), L("hemoglobin")("effectors"), LUNG] },
]);

/* ---------- 80204 מבוא לווירולוגיה ---------- */
const VIR: CoursePlan["lectures"] = [
  { n: 1, titleHe: "ההיסטוריה של חקר הנגיפים; הגדרה; מבנה וגנום; מיון", items: [L("mv-viruses")("nature"), L("vr-origins")(), L("vr-properties")(), L("mv-viruses")("baltimore")] },
  { n: 2, titleHe: "שלבי ההדבקה; דרכי העברה; קולטנים תאיים", items: [L("vr-attachment-entry")(), L("mv-viruses")("cycle")] },
  { n: 3, titleHe: "התרבות נגיפי DNA דו-גדילי וחד-גדילי", items: [L("vr-dna-expression")(), L("vr-genome-replication")()] },
  { n: 4, titleHe: "נגיפי RNA חיובי (פוליו) ושלילי (שפעת)", items: [L("vr-rna-expression")(), L("vr-genome-replication")("rna-replication")] },
  { n: 5, titleHe: "רטרו-וירוסים; HIV ותרופות נגדו", items: [L("im-immunodeficiency")("hiv"), L("mv-viruses")("antivirals"), soon("יחידה מלאה: רטרו-וירוסים — שעתוק לאחור, אינטגרציה ותרופות נגד HIV")] },
  { n: 6, titleHe: "הרכבה והבשלה; סוגי הדבקה; מערכות גידול; כימות נגיפים, PFU ו-MOI", items: [L("vr-assembly-packaging")(), L("vr-exit")(), L("mv-viruses")("infection-types"), L("vr-latency")(), L("vr-methods")()] },
  { n: 7, titleHe: "נגיפים וסרטן; נגיפים וריפוי גני; יחסי נגיף-תא", items: [L("ca-viruses")(), L("vr-animal-defenses")(), soon("סעיף: נגיפים כווקטורים לריפוי גני")] },
];
export const biuVirologyPlan = base("biu-virology", VIR, biuOrder("https://life-sciences.biu.ac.il/sites/life-sciences/files/shared/Med%20Mechina/Sylabi23/80204-%D7%9E%D7%91%D7%95%D7%90-%D7%9C%D7%95%D7%99%D7%A8%D7%95%D7%9C%D7%95%D7%92%D7%99%D7%94.pdf", "תשפ\"ג"), "תשפ\"ג");
