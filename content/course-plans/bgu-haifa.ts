import type { CoursePlan } from "./types";
import { L, soon, REUSE_NOTE_HE, sessionsFromTopics } from "./helpers";
import { GAP } from "./huji-common";

/* Ben-Gurion and Haifa, phase-1 mapping (2026-11-25), no insider input. Both publish topic lists only (BGU: the annual
   course catalog bgu4u, 2027; Haifa: the department's syllabus PDFs, year not stated, uploaded 2021), so the lectures
   view is one session per official topic, in the syllabus order (confidence "syllabus"). */
const plan = (courseSlug: string, topics: CoursePlan["topics"], link: { labelHe: string; url: string }, extraHe = ""): CoursePlan => ({
  courseSlug,
  lectureOrder: { confidence: "syllabus", noteHe: `אין לוח הרצאות פומבי. הסדר הוא סדר הנושאים בסילבוס הרשמי. ${extraHe}` + REUSE_NOTE_HE, links: [link] },
  tutorialOrder: null,
  schedule: "suggested",
  scheduleNoteHe: "לפי סדר הנושאים בסילבוס הרשמי; אין לוח הרצאות פומבי.",
  topics,
  lectures: sessionsFromTopics(topics),
  tutorials: [],
});
const BGU = { labelHe: "קטלוג הקורסים השנתי של בן-גוריון (תשפ\"ז)", url: "https://bgu4u.bgu.ac.il/html/annual/" };
const haifa = (file: string) => ({ labelHe: "סילבוס הקורס באתר החוג", url: `https://biology.haifa.ac.il/wp-content/uploads/2021/03/${file}` });

/* ================= Ben-Gurion ================= */

export const bguCellPlan = plan("bgu-cell", [
  { titleHe: "אבולוציה ומבנה התא", items: [L("b1-cells")(), L("b1-eukaryotic-cell")(), L("ev-eukaryotes")("endosymbiosis")] },
  { titleHe: "המולקולות העיקריות במערכת התאית", items: [L("b1-proteins-enzymes")("amino-acids"), L("b1-proteins-enzymes")("structure-levels"), L("carbs-lipids")(), L("b1-dna")("nucleic-acids")] },
  { titleHe: "הגרעין והקוד הגנטי: מבנה ה-DNA, הכפלה, שעתוק ותרגום", items: [L("b1-dna")(), L("b1-gene-expression")()] },
  { titleHe: "גנים וגנומים", items: [L("gx-genome-structure")(), L("mol-chromatin")("packaging")] },
  { titleHe: "ממברנות התא ומעבר חומרים", items: [L("b1-membranes")(), L("cell-membranes")()] },
  { titleHe: "דופן התא", items: [L("pp-plant-cell")("cell-wall"), L("pp-cell-growth")("wall-structure"), L("mv-cell-envelope")("peptidoglycan")] },
  { titleHe: "הכוונה והעברה של חלבונים (מערכת ההפרשה)", items: [L("cell-er")(), L("cell-golgi-endosomes")(), L("cell-vesicle-transport")()] },
  { titleHe: "חלוקת התא: מיטוזה ומחזור התא", items: [L("b1-cell-division")("cell-cycle"), L("b1-cell-division")("mitosis"), L("cell-cycle-control")()] },
  { titleHe: "רבייה תאית: מיוזה ותאי גזע", items: [L("b1-cell-division")("meiosis"), L("b1-development")("stem-cells"), L("sc-concepts")()] },
  { titleHe: "שלד התא ותנועתיות", items: [L("cell-cytoskeleton")(), L("cell-motors-polarity")()] },
  { titleHe: "תקשורת בין תאים והעברת סיגנלים", items: [L("cell-signaling-principles")(), L("cell-gpcr")(), L("cell-rtk")()] },
], BGU);

export const bguBiochemAPlan = plan("bgu-biochem-a", [
  { titleHe: "אפיון ביוכימי של מולקולות התא: מים, סוכרים, שומנים, חומצות אמינו וחלבונים", items: [L("b1-membranes")("water"), L("carbs-lipids")(), L("amino-acids")(), L("protein-structure")()] },
  { titleHe: "מבנה קוולנטי ומרחבי", items: [L("protein-structure")(), L("protein-folding")(), L("fibrous-membrane")()] },
  { titleHe: "אנזימים: קינטיקה, אתר פעיל, מעכבים ובקרה", items: [L("enzyme-principles")(), L("enzyme-kinetics")(), L("catalytic-mechanisms")(), L("allosteric-regulation")(), L("covalent-regulation")()] },
  { titleHe: "עקרונות המטבוליזם: מעגל ה-ATP, תרמודינמיקה ובקרה מטבולית", items: [L("met-concepts")(), L("b1-energy")()] },
  { titleHe: "מסלולים מטבוליים: גליקוליזה ומעגל קרבס", items: [L("met-glycolysis")(), L("met-citric-acid")()] },
], BGU);

export const bguGeneticsPlan = plan("bgu-genetics", [
  { titleHe: "גן יחיד: העיקרון המנדלי הראשון", items: [L("mendel-probability")("method"), L("mendel-probability")("segregation"), L("mendel-probability")("testcross")] },
  { titleHe: "דומיננטיות, רצסיביות ורב-אלליות", items: [L("dominance-alleles")()] },
  { titleHe: "קביעת המין ותאחיזה לכרומוזומי המין", items: [L("sex-determination")()] },
  { titleHe: "אפקט אימהי והורשה ציטופלסמטית", items: [L("non-mendelian")()] },
  { titleHe: "גן באוכלוסייה", items: [L("ev-selection")("hardy-weinberg"), L("pedigrees")("hardy-weinberg")] },
  { titleHe: "גן וסביבה וקביעת הפנוטיפ", items: [L("dominance-alleles")("sex-environment"), L("pedigrees")("penetrance")] },
  { titleHe: "שני גנים ויותר: העיקרון המנדלי השני", items: [L("mendel-probability")("assortment"), L("mendel-probability")("probability"), L("mendel-probability")("chi-square")] },
  { titleHe: "אינטראקציה תפקודית בין גנים", items: [L("gene-interaction")()] },
  { titleHe: "תאחיזה, כיאזמה, שחלוף ורקומבינציה", items: [L("linkage-mapping")(), L("chromosomal-theory")()] },
  { titleHe: "הורשת תכונות כמותיות", items: [L("hg-multifactorial")("heritability"), L("ev-selection")("quantitative"), GAP.quantitative] },
], BGU);

export const bguEcologyPlan = plan("bgu-ecology", [
  { titleHe: "אורגניזמים, סביבות גידול ואסטרטגיות חיים", items: [L("ec-environment")(), L("ec-adaptations")()] },
  { titleHe: "אוכלוסיות: גידול, דמוגרפיה, תנודות ומהלכי חיים", items: [L("ec-population-growth")(), L("ec-population-regulation")()] },
  { titleHe: "יחסי גומלין: תחרות, טורף-נטרף, הרביבוריה והדדיות", items: [L("ec-competition")(), L("ec-predation")(), L("mv-ecology")("symbiosis"), L("sh-mutualism-parasitism")()] },
  { titleHe: "חברות: הנישה, קיום יחדיו, מגוון מינים ומבנה חברה", items: [L("ec-environment")("niche"), L("ec-diversity")(), L("sh-coexistence")()] },
  { titleHe: "מקרואקולוגיה: תבניות רחבות בזמן ובמרחב", items: [L("ec-diversity")("latitude"), L("ec-diversity")("species-area"), L("ec-biomes")()] },
  { titleHe: "אקו-סיסטמות: זרימת אנרגיה, שרשראות מזון, סוקססיה ומחזורי חומרים", items: [L("ec-energy-flow")(), L("ec-succession")(), L("ec-biogeochemical")()] },
  { titleHe: "שמירת טבע: כריתת יערות, מדבור ושינויים עולמיים", items: [L("ec-human-impact")()] },
], BGU, "הקורס כולל מעבדות מחשב ותרגילים. ");

export const bguEvolutionPlan = plan("bgu-evolution", [
  { titleHe: "הקדמה: החשיבות וההתפתחות ההיסטורית של רעיון האבולוציה", items: [L("ev-evidence")("claims"), L("ev-evidence")("history")] },
  { titleHe: "הסינתזה המודרנית וגנטיקה של אוכלוסיות", items: [L("ev-selection")("hardy-weinberg"), L("ev-selection")("selection-model")] },
  { titleHe: "השונות הגנטית", items: [L("ev-selection")("variation"), L("ev-genetic-systems")("mutation-rate")] },
  { titleHe: "הברירה הטבעית", items: [L("ev-selection")(), L("ev-measuring-selection")()] },
  { titleHe: "הגירה", items: [L("ev-population-structure")()] },
  { titleHe: "סחיפה גנטית וכוחות אבולוציוניים אחרים", items: [L("ev-drift")(), L("ev-selection-forces")()] },
  { titleHe: "חידושים אבולוציוניים והיווצרות מינים", items: [L("ev-speciation")(), L("ev-evo-devo")()] },
  { titleHe: "ניתוח תסריטים אבולוציוניים (פילוגנזה)", items: [L("ev-evidence")("trees"), L("ev-evidence")("reconstruction")] },
  { titleHe: "מוצא החיים והיסטוריה של קבוצות עיקריות", items: [L("ev-origins")(), L("ev-tree-of-life")(), L("ev-eukaryotes")(), L("ev-animals")()] },
  { titleHe: "אקולוגיה מולקולרית", items: [L("ev-measuring-selection")("dnds"), soon("סעיף: אקולוגיה מולקולרית — סמנים גנטיים באוכלוסיות טבעיות")] },
  { titleHe: "אבולוציה של סקס ויחסי זוויגים", items: [L("ev-genetic-systems")("cost-of-sex"), L("ev-genetic-systems")("why-sex"), L("ev-selection")("other-forms"), GAP.sexualSelection] },
  { titleHe: "אבולוציה של האדם", items: [L("ev-human")()] },
], BGU, "הקורס כולל תרגילים שבועיים. ");

export const bguMicrobiologyPlan = plan("bgu-microbiology", [
  { titleHe: "הקדמה: מיקרואורגניזמים, תפקידם בטבע ובמחקר; ההיווצרות הספונטנית ומפלסי הדרך", items: [L("mv-history")(), L("b1-cells")("prokaryotic")] },
  { titleHe: "מעטפות החיידקים: ממברנה, פפטידוגליקן ו-LPS", items: [L("mv-cell-envelope")()] },
  { titleHe: "דרישות תזונתיות; נשימה אאירובית ואנאירובית; מצעי גידול", items: [L("mv-metabolic-diversity")(), L("mv-growth")("media")] },
  { titleHe: "גידול חיידקים: שלבים, תקופה סטציונרית, כימוסטט וסינכרוניזציה", items: [L("mv-growth")("counting"), L("mv-growth")("exponential"), L("mv-growth")("growth-curve"), L("mv-growth")("chemostat")] },
  { titleHe: "מחזור התא הפרוקריוטי", items: [L("mv-growth")("division"), L("b1-cell-division")("binary-fission"), L("mol-replication-origins")("once-bacteria")] },
  { titleHe: "נגיפים ובקטריופאגים: גידול, כימות, מבנה, מחזורי חיים וטיפול", items: [L("mv-viruses")(), L("mv-phages")(), L("vr-methods")()] },
  { titleHe: "העברה אופקית של גנים: קוניוגציה, טרנסדוקציה וטרנספורמציה", items: [L("mv-gene-transfer")()] },
  { titleHe: "אנטיביוטיקה: מנגנוני פעולה ועמידות", items: [L("mv-antibiotics")()] },
  { titleHe: "חיידקים מחוללי מחלות: מנגנוני אלימות ויחסי טפיל-מאכסן", items: [L("mv-clinical")(), L("pg-adhesion")(), L("pg-invasion")(), L("pg-toxins")()] },
  { titleHe: "בקרת ביטוי גנים בחיידקים", items: [L("gx-operons")(), L("mol-transcription-prok")()] },
  { titleHe: "אוכלוסיות חיידקים: ביופילם וחישת מניין", items: [L("mv-ecology")("biofilm"), L("mv-ecology")("quorum-sensing")] },
  { titleHe: "יחסי גומלין בין חיידקי המיקרוביום והמאכסן", items: [L("pg-microbiome")(), L("mv-ecology")("microbiome")] },
], BGU);

// The catalog gives only the course goal ("the molecular mechanisms that encode genetic information and express it in
// bacteria and eukaryotes"); the broad heading is filled with the field's canonical topics, at "likely" weight.
export const bguMolecularPlan = plan("bgu-molecular", [
  { titleHe: "הצפנת המידע הגנטי: DNA, כרומטין ושכפול", items: [L("mol-nucleic-acids")(), L("mol-chromatin")(), L("mol-replication-fork")(), L("mol-replication-origins")()] },
  { titleHe: "שמירה על המידע: תיקון ורקומבינציה", items: [L("mol-repair")(), L("mol-recombination")()] },
  { titleHe: "שעתוק בחיידקים ובאאוקריוטים", items: [L("mol-transcription-prok")(), L("mol-transcription-euk")(), L("gx-operons")()] },
  { titleHe: "עיבוד RNA", items: [L("mol-rna-processing")()] },
  { titleHe: "תרגום והקוד הגנטי", items: [L("mol-genetic-code")(), L("mol-ribosome-initiation")(), L("mol-translation-elongation")()] },
], BGU, "הקטלוג מתאר רק את מטרת הקורס (המנגנונים המולקולריים של הצפנת המידע הגנטי ומימושו בחיידקים ובאאוקריוטים), ולכן הנושאים כאן הם הנושאים המקובלים בתחום, לפי ספרי הקורס (Watson, Lodish, Lewin). ");

export const bguBioinformaticsPlan = plan("bgu-bioinformatics", [
  { titleHe: "מאגרי מידע של DNA, RNA, גנים, חלבונים ומסלולים; מפות גנומים", items: [L("bi-databases")(), L("bi-enrichment")("pathways"), L("bi-sequencing")("browser")] },
  { titleHe: "ניתוח רצפים; השוואת רצפים וחיפוש במאגרים", items: [L("bi-pairwise")(), L("bi-blast")(), L("cb-alignment")()] },
  { titleHe: "עימוד מרובה; בלוקים ופרופילים של גנים", items: [L("bi-msa")("progressive"), L("bi-msa")("conservation"), L("bi-msa")("motifs"), L("bi-msa")("domains")] },
  { titleHe: "אנליזה פילוגנטית", items: [L("bi-msa")("trees"), L("ev-evidence")("reconstruction")] },
  { titleHe: "ניתוח ניסויי שבבי DNA (ביטוי גנים)", items: [L("gx-expression-data")(), L("bi-stats-exploration")(), soon("סעיף: ניתוח מערכי DNA (microarrays)")] },
], BGU);

export const bguOrganismsPlan = plan("bgu-organisms", [
  { titleHe: "סיסטמטיקה ומיון", items: [L("z-intro")(), L("ev-evidence")("trees")] },
  { titleHe: "מבוא לאבולוציה ולאבולוציה של אוכלוסיות", items: [L("ev-selection")("conditions"), L("ev-selection")("hardy-weinberg"), L("ev-drift")("sampling")] },
  { titleHe: "חסרי חוליות: פרוטוזואה, ספוגים, צורבים ותולעים", items: [L("z-protists")(), L("z-sponges-cnidarians")(), L("z-worms")()] },
  { titleHe: "רכיכות", items: [L("sh-molluscs")()] },
  { titleHe: "פרוקי רגליים", items: [L("z-arthropods")()] },
  { titleHe: "מאפיינים פיזיולוגיים ואנטומיים", items: [L("z-digestive")(), L("z-respiration")(), L("z-urogenital")(), L("z-nervous-senses")()] },
  { titleHe: "מחזורי חיים, צורות רבייה ומסלולי התפתחות", items: [L("z-sponges-cnidarians")("polyp-medusa"), L("ev-genetic-systems")("cost-of-sex")] },
  { titleHe: "מוצא החולייתנים", items: [L("z-chordates")(), L("ev-animals")("vertebrates")] },
  { titleHe: "התפתחות עוברית והשוואה בין הקבוצות", items: [L("z-embryology")()] },
], BGU, "ספר הקורס: Hickman, Integrated Principles of Zoology. ");

/* ================= Haifa ================= */

export const haifaCellBPlan = plan("haifa-cell-b", [
  { titleHe: "מאפייני התא החי; שוני ודמיון בין תאים", items: [L("b1-cells")()] },
  { titleHe: "ציוני דרך בביולוגיה של התא", items: [L("b1-science")("microscopy"), L("b1-science")("fractionation"), L("cell-methods")("microscopy")] },
  { titleHe: "מבנה התא: מוצא, אברונים, גנומים ואבולוציה", items: [L("b1-eukaryotic-cell")(), L("ev-eukaryotes")()] },
  { titleHe: "שכפול DNA ומנגנוני תיקון", items: [L("mol-replication-fork")(), L("mol-repair")()] },
  { titleHe: "מ-DNA לחלבונים", items: [L("b1-gene-expression")(), L("mol-transcription-euk")(), L("mol-rna-processing")()] },
  { titleHe: "ממברנת התא: מבנה ותפקוד", items: [L("cell-membranes")()] },
  { titleHe: "הובלת חומרים דרך הממברנה", items: [L("ph-transport")(), L("b1-membranes")()] },
  { titleHe: "מידור תוך-תאי והובלה בין אברונים", items: [L("cell-er")(), L("cell-nuclear-mito-import")(), L("cell-golgi-endosomes")(), L("cell-vesicle-transport")()] },
  { titleHe: "יצירת אנרגיה במיטוכונדריה ובכלורופלסט", items: [L("b1-metabolism")(), L("met-oxphos")(), L("met-photosynthesis")()] },
  { titleHe: "שלד התא", items: [L("cell-cytoskeleton")(), L("cell-motors-polarity")()] },
  { titleHe: "מחזור התא, חלוקת התא, הזדקנות ומוות תאי", items: [L("cell-cycle-control")(), L("cell-division")(), L("cell-death")()] },
  { titleHe: "תקשורת תוך-תאית ובין-תאית", items: [L("cell-signaling-principles")(), L("cell-gpcr")(), L("cell-rtk")()] },
], haifa("%D7%91%D7%99%D7%95%D7%9C%D7%95%D7%92%D7%99%D7%94-%D7%A9%D7%9C-%D7%94%D7%AA%D7%90.pdf"));

export const haifaBiochemAPlan = plan("haifa-biochem-a", [
  { titleHe: "הרכב ומבנה החלבונים", items: [L("amino-acids")(), L("protein-structure")(), L("protein-folding")()] },
  { titleHe: "המוגלובין: חלבון בפעולה", items: [L("hemoglobin")()] },
  { titleHe: "אנזימים: מושגי יסוד וקינטיקה", items: [L("enzyme-principles")(), L("enzyme-kinetics")()] },
  { titleHe: "אסטרטגיות קטליטיות ורגולטוריות", items: [L("catalytic-mechanisms")(), L("allosteric-regulation")(), L("covalent-regulation")()] },
  { titleHe: "פחמימות", items: [L("carbs-lipids")("monosaccharides"), L("carbs-lipids")("rings"), L("carbs-lipids")("reducing"), L("carbs-lipids")("glycosidic")] },
  { titleHe: "מטבוליזם: מושגי יסוד", items: [L("met-concepts")()] },
  { titleHe: "גליקוליזה, גלוקונאוגנזה ומעגל החומצה הציטרית", items: [L("met-glycolysis")(), L("met-gluconeogenesis")(), L("met-citric-acid")()] },
  { titleHe: "זרחון חמצוני", items: [L("met-oxphos")()] },
  { titleHe: "מעבדות: תגובות אנזימטיות והפרדת חלבונים", items: [L("enzyme-kinetics")("parameters"), L("protein-methods")()] },
], haifa("%D7%A1%D7%99%D7%9C%D7%91%D7%95%D7%A1-%D7%91%D7%99%D7%95%D7%9B%D7%99%D7%9E%D7%99%D7%94-%D7%90.pdf"), "הציון: בחינה 80%, מעבדה 20%. ");

export const haifaBiochemBPlan = plan("haifa-biochem-b", [
  { titleHe: "מסלולי העברת אותות", items: [L("cell-signaling-principles")(), L("cell-gpcr")(), L("cell-rtk")()] },
  { titleHe: "פוטוסינתזה, מעגל קלווין ומסלול הפנטוז פוספט", items: [L("met-photosynthesis")(), L("met-pentose")()] },
  { titleHe: "סינתזת חלבונים", items: [L("mol-genetic-code")(), L("mol-ribosome-initiation")(), L("mol-translation-elongation")()] },
  { titleHe: "תחלופת חלבונים ופירוק חומצות אמינו", items: [L("met-amino-acids")("turnover"), L("met-amino-acids")("nitrogen"), L("met-amino-acids")("urea-cycle"), L("met-amino-acids")("carbon-fates")] },
  { titleHe: "ביוסינתזה של חומצות אמינו", items: [L("met-amino-acids")("biosynthesis")] },
  { titleHe: "מטבוליזם של גליקוגן", items: [L("met-glycogen")()] },
  { titleHe: "ליפידים וממברנות התא", items: [L("carbs-lipids")("fatty-acids"), L("carbs-lipids")("membrane-lipids"), L("cell-membranes")()] },
  { titleHe: "מטבוליזם של חומצות שומן", items: [L("met-fatty-acids")()] },
  { titleHe: "ביוסינתזה של ליפידים ממברנליים וסטרואידים", items: [L("met-lipids-cholesterol")()] },
  { titleHe: "מבוא לביוכימיה ניסויית (מאמר מחקר)", items: [L("protein-methods")()] },
  { titleHe: "אינטגרציה של המטבוליזם", items: [L("met-integration")()] },
], haifa("%D7%A1%D7%99%D7%9C%D7%91%D7%95%D7%A1-%D7%91%D7%99%D7%95%D7%9B%D7%99%D7%9E%D7%99%D7%94-%D7%91.pdf"));

export const haifaGeneticsPlan = plan("haifa-genetics", [
  { titleHe: "DNA כחומר התורשתי", items: [L("nature-of-gene")("dna"), L("b1-dna")("evidence")] },
  { titleHe: "מבנה ה-DNA", items: [L("mol-nucleic-acids")()] },
  { titleHe: "הכפלת ה-DNA וחלוקת התא", items: [L("mol-replication-fork")("semiconservative"), L("b1-cell-division")()] },
  { titleHe: "התיאוריה הכרומוזומלית של ההורשה", items: [L("chromosomal-theory")(), L("sex-determination")()] },
  { titleHe: "מהות הגן", items: [L("nature-of-gene")(), L("gene-interaction")("one-gene-one-enzyme")] },
  { titleHe: "הבקרה על התבטאות הגן", items: [L("gx-operons")(), L("gx-transcription-factors")()] },
  { titleHe: "תרגום ה-mRNA לחלבון", items: [L("mol-genetic-code")(), L("mol-translation-elongation")()] },
  { titleHe: "חוקי מנדל", items: [L("mendel-probability")(), L("dominance-alleles")(), L("gene-interaction")()] },
  { titleHe: "רקומבינציה ומיפוי גנטי", items: [L("linkage-mapping")()] },
  { titleHe: "מוטציות בגנים והקוד הגנטי", items: [L("mutations")(), L("mol-genetic-code")("cracking")] },
  { titleHe: "מחלות גנטיות באדם", items: [L("pedigrees")(), L("hg-variants")(), L("chromosome-number")("human")] },
  { titleHe: "גנטיקה ומחלת הסרטן", items: [L("hg-cancer")()] },
  { titleHe: "חישובי הסתברות בייעוץ גנטי", items: [L("pedigrees")("risk"), L("mendel-probability")("probability")] },
  { titleHe: "מבוא לגנטיקה של אוכלוסיות", items: [L("pedigrees")("hardy-weinberg"), L("ev-selection")("hardy-weinberg")] },
  { titleHe: "המעבדה: הפקת DNA, PCR, אנזימי רסטריקציה, תאחיזה למין ורקומבינציה בזבובים", items: [L("mol-pcr-sequencing")(), L("b1-dna")("genetic-engineering"), L("sex-determination")("sex-linkage")] },
], haifa("%D7%92%D7%A0%D7%98%D7%99%D7%A7%D7%94-%D7%9B%D7%9C%D7%9C%D7%99%D7%AA.pdf"), "הציון: בחינה 60%, מעבדה 30%, פרויקט 10%. ");

export const haifaMolecularPlan = plan("haifa-molecular", [
  { titleHe: "כרומטין ומבנה הכרומוזום", items: [L("mol-chromatin")()] },
  { titleHe: "DNA", items: [L("mol-nucleic-acids")()] },
  { titleHe: "שכפול והבקרה על השכפול", items: [L("mol-replication-fork")(), L("mol-replication-origins")()] },
  { titleHe: "מוטציה, רקומבינציה, טרנספוזיציה ושינויים נוספים ב-DNA", items: [L("mutations")(), L("mol-recombination")(), L("gx-repeats-mobile")()] },
  { titleHe: "מנגנוני תיקון DNA", items: [L("mol-repair")()] },
  { titleHe: "מבנה הגן", items: [L("mol-rna-processing")("split-genes"), L("gx-genome-structure")("genes")] },
  { titleHe: "שעתוק והבקרה על השעתוק; סוגי RNA", items: [L("mol-transcription-prok")(), L("mol-transcription-euk")(), L("gx-operons")(), L("gx-transcription-factors")(), L("gx-ncrna")()] },
  { titleHe: "עיבוד ה-mRNA", items: [L("mol-rna-processing")()] },
  { titleHe: "תרגום לחלבון והבקרה עליו", items: [L("mol-genetic-code")(), L("mol-ribosome-initiation")(), L("mol-translation-elongation")(), L("gx-translation-control")()] },
  { titleHe: "ארגון ואינפורמציה בגנום", items: [L("gx-genome-structure")(), L("gx-gene-families")()] },
  { titleHe: "שיטות מחקר בביולוגיה מולקולרית", items: [L("mol-pcr-sequencing")(), L("mol-transcription-methods")()] },
], haifa("%D7%A1%D7%99%D7%9C%D7%91%D7%95%D7%A1-%D7%91%D7%99%D7%95%D7%9C%D7%95%D7%92%D7%99%D7%94-%D7%9E%D7%95%D7%9C%D7%A7%D7%95%D7%9C%D7%A8%D7%99%D7%AA.pdf"), "ספר הקורס: Lewin, Genes XII. ");

export const haifaMicrobiologyPlan = plan("haifa-microbiology", [
  { titleHe: "החיידק ברמת התא: היבטים פיזיולוגיים ומטבוליזם", items: [L("mv-cell-envelope")(), L("mv-growth")(), L("mv-metabolic-diversity")()] },
  { titleHe: "היבטים מולקולריים: בקרת גנים", items: [L("gx-operons")(), L("mv-gene-transfer")()] },
  { titleHe: "היבטים ביוטכנולוגיים: אנטיביוטיקה", items: [L("mv-antibiotics")()] },
  { titleHe: "היבטים אקולוגיים: יחסי גומלין בטבע", items: [L("mv-ecology")(), L("mv-nutrient-cycles")()] },
  { titleHe: "מעבדות; מעבדה מקוונת בביואינפורמטיקה (רצפי 16S)", items: [L("mv-methods")("16s"), L("bi-microbiome")("approaches")] },
], haifa("%D7%9E%D7%99%D7%A7%D7%A8%D7%95%D7%91%D7%99%D7%95%D7%9C%D7%95%D7%92%D7%99%D7%94.pdf"), "הסילבוס מונה ארבעה היבטים בלבד; הציון: בחינה אמריקאית 50%, מעבדות 50%. ");

export const haifaEcologyEvolutionPlan = plan("haifa-ecology-evolution", [
  { titleHe: "מושגי יסוד באקולוגיה: מדרג אקולוגי, כושר נשיאה ומגוון", items: [L("ec-environment")("levels"), L("ec-population-growth")("logistic"), L("ec-diversity")("measuring")] },
  { titleHe: "מארג מזון", items: [L("ec-energy-flow")(), L("ec-predation")("cascades")] },
  { titleHe: "מחזורי המים, הפחמן והחנקן", items: [L("ec-biogeochemical")()] },
  { titleHe: "רבייה וכשירות; היסטוריית חיים", items: [L("ec-population-regulation")("life-history"), L("ec-population-growth")("life-tables")] },
  { titleHe: "דינמיקה של אוכלוסיות", items: [L("ec-population-growth")(), L("ec-population-regulation")()] },
  { titleHe: "יסודות האבולוציה: שונות וגנטיקה של אוכלוסיות", items: [L("ev-selection")("variation"), L("ev-selection")("hardy-weinberg")] },
  { titleHe: "מהו מין ביולוגי? עץ החיים", items: [L("ev-speciation")("species"), L("ev-tree-of-life")()] },
  { titleHe: "יחסי גנוטיפ-פנוטיפ", items: [L("ev-selection")("quantitative"), L("dominance-alleles")("sex-environment")] },
  { titleHe: "ברירה טבעית וסחיפה גנטית", items: [L("ev-selection")(), L("ev-drift")()] },
  { titleHe: "שחזור עצים פילוגנטיים מרצפי DNA", items: [L("ev-evidence")("trees"), L("ev-evidence")("reconstruction"), L("bi-msa")("trees")] },
], haifa("%D7%9E%D7%91%D7%95%D7%90-%D7%9C%D7%90%D7%A7%D7%95%D7%9C%D7%95%D7%92%D7%99%D7%94-%D7%95%D7%90%D7%91%D7%95%D7%9C%D7%95%D7%A6%D7%99%D7%94.pdf"));
