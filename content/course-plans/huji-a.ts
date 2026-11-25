import { L, soon } from "./helpers";
import { hujiPlan, GAP } from "./huji-common";

/* HUJI year-1/2 core courses (see huji-common.ts for how the order is set). */

// 72128 מבוא לביולוגיה של האורגניזם — the syllabus numbers 14 lectures; labs listed separately.
export const hujiOrganismPlan = hujiPlan("huji-organism", "72128", [
  { titleHe: "1. הייררכיה בביולוגיה; טקסונומיה; מושג המין; עקרונות האבולוציה", items: [L("b1-intro")("hierarchy"), L("z-intro")(), L("ev-speciation")("species"), L("ev-selection")("conditions"), L("ev-selection")("variation")] },
  { titleHe: "2. אנאגנזה וקלדוגנזה; ספציאציה; עצים פילוגנטיים; הומולוגיה וקונברגנציה", items: [L("ev-speciation")(), L("ev-evidence")("trees"), L("ev-evidence")("homology")] },
  { titleHe: "3. צרכי האורגניזם; חד-תאיים; רב-תאיות; ספוגים; רבייה מינית ואל-מינית", items: [L("z-protists")(), L("ev-evo-devo")("origins"), L("ev-evo-devo")("volvocine"), L("ev-evo-devo")("requirements"), L("z-sponges-cnidarians")("sponges"), L("ev-genetic-systems")("cost-of-sex"), L("ev-genetic-systems")("why-sex")] },
  { titleHe: "4. שכבות נבט; דו-שכבתיים; כיסוי הגוף; מערכת העיכול", items: [L("z-intro")("germ-layers"), L("z-integument")("skin"), L("z-digestive")()] },
  { titleHe: "5. חיות יחידות ומושבתיות; תחרות; אברי חוש ומערכות עצבים; צורבים", items: [L("z-sponges-cnidarians")(), L("z-nervous-senses")("brain"), L("ec-competition")("what")] },
  { titleHe: "6. צפליזציה; סימטריה דו-צדית ושלוש שכבות נבט; הפיצוץ הקמבריוני; סקאלת הזמן", items: [L("z-intro")("symmetry"), L("z-intro")("coelom"), L("z-intro")("lineages"), L("ev-animals")("origin"), L("ev-animals")("cambrian"), L("ev-origins")("fossils")] },
  { titleHe: "7. מגוון הבילטריים; אבולוציה של טפילות; תולעים שטוחות", items: [L("z-worms")("comparison"), L("z-worms")("flatworms")] },
  { titleHe: "8. מערכות נשימה והובלה; הצלום; רכיכות", items: [L("z-respiration")(), L("z-intro")("coelom"), L("sh-molluscs")()] },
  { titleHe: "9. סגמנטציה; תולעים טבעתיות; שרירים ותנועה; פגיות ומחזורי חיים", items: [L("z-worms")("annelids"), L("z-histology")("muscle")] },
  { titleHe: "10. המעבר ליבשה; שלד חיצוני ופנימי; מתנשלים; פרוקי רגליים", items: [L("z-arthropods")(), L("z-worms")("nematodes")] },
  { titleHe: "11. חרקים; מערכות הפרשה", items: [L("z-arthropods")("groups"), L("z-arthropods")("systems"), L("z-urogenital")("kidney-series"), L("z-urogenital")("nitrogen")] },
  { titleHe: "12. עקרונות התפתחות עוברית; התלמות; גסטרולציה; דאוטרוסטומים", items: [L("z-embryology")("fertilization"), L("z-embryology")("cleavage"), L("z-embryology")("gastrulation"), soon("סעיף: קווצי עור (Echinodermata)")] },
  { titleHe: "13. מבוא לאקולוגיה (הרצאת אורח)", items: [L("ec-environment")()] },
  { titleHe: "14. ארגון הגוף בחולייתנים; אמבריולוגיה של חולייתנים", items: [L("z-chordates")(), L("z-embryology")("axes"), L("z-embryology")("neurulation"), L("z-embryology")("amniote")] },
  { titleHe: "מעבדות: חד-תאיים, היסטולוגיה, צורבים, תולעים, פרוקי רגליים, קווצי עור וחולייתנים", items: [L("z-protists")("paramecium"), L("z-histology")(), L("z-sponges-cnidarians")("cnidocyte"), L("z-worms")(), L("z-arthropods")(), L("z-chordates")("vertebrates")] },
], "הקורס כולל גם מעבדות; ההרצאות ממוספרות בסילבוס 1–14. ");

// 72153 מבוא לביולוגיה של התא
export const hujiCellIntroPlan = hujiPlan("huji-cell-intro", "72153", [
  { titleHe: "הגדרת החיים ויסודותיהם; מקרומולקולות", items: [L("b1-intro")(), L("b1-proteins-enzymes")("amino-acids"), L("b1-proteins-enzymes")("structure-levels"), L("carbs-lipids")(), L("b1-dna")("nucleic-acids")] },
  { titleHe: "סוגי תאים וארגון התא; שיטות מחקר בביולוגיה תאית", items: [L("b1-cells")(), L("b1-eukaryotic-cell")(), L("b1-science")("microscopy"), L("b1-science")("fractionation"), L("cell-methods")()] },
  { titleHe: "הדוגמה המרכזית: שעתוק ותרגום", items: [L("b1-gene-expression")()] },
  { titleHe: "ממברנת התא וטרנספורט", items: [L("b1-membranes")(), L("cell-membranes")()] },
  { titleHe: "שלד התא", items: [L("cell-cytoskeleton")(), L("b1-eukaryotic-cell")("cytoskeleton")] },
  { titleHe: "ממברנות פנימיות ותפקידיהן", items: [L("b1-eukaryotic-cell")("endomembrane"), L("cell-er")(), L("cell-golgi-endosomes")(), L("cell-vesicle-transport")()] },
  { titleHe: "צמתים בין תאים", items: [L("cell-junctions")()] },
  { titleHe: "אנזימים", items: [L("b1-proteins-enzymes")("enzymes"), L("b1-proteins-enzymes")("how-enzymes-work"), L("b1-proteins-enzymes")("rate"), L("b1-proteins-enzymes")("regulation")] },
  { titleHe: "נשימה תאית: גליקוליזה, מעגל קרבס ושרשרת העברת האלקטרונים", items: [L("b1-energy")(), L("b1-metabolism")()] },
  { titleHe: "מוות תאי מתוכנת", items: [L("cell-death")()] },
]);

// 72121 ביוכימיה של התא
export const hujiBiochemCellPlan = hujiPlan("huji-biochem-cell", "72121", [
  { titleHe: "חומצות אמינו", items: [L("amino-acids")()] },
  { titleHe: "מבנה ותכונות של חלבונים (ראשוני עד רבעוני)", items: [L("protein-structure")(), L("protein-folding")()] },
  { titleHe: "קינטיקה אנזימטית", items: [L("enzyme-principles")(), L("enzyme-kinetics")(), L("allosteric-regulation")()] },
  { titleHe: "חלבונים: מבנה ותפקוד", items: [L("hemoglobin")(), L("fibrous-membrane")(), L("catalytic-mechanisms")()] },
  { titleHe: "ליפידים, ממברנות וטרנספורט", items: [L("carbs-lipids")("fatty-acids"), L("carbs-lipids")("membrane-lipids"), L("carbs-lipids")("bilayer"), L("cell-membranes")(), L("ph-transport")()] },
  { titleHe: "מבוא לסוכרים", items: [L("carbs-lipids")("monosaccharides"), L("carbs-lipids")("rings"), L("carbs-lipids")("reducing"), L("carbs-lipids")("glycosidic")] },
  { titleHe: "נוקלאוטידים", items: [L("mol-nucleic-acids")("nucleotides"), L("met-concepts")("atp")] },
  { titleHe: "גליקוליזה", items: [L("met-glycolysis")()] },
  { titleHe: "גלוקונאוגנזה", items: [L("met-gluconeogenesis")()] },
  { titleHe: "מעגל קרבס", items: [L("met-citric-acid")()] },
  { titleHe: "חמצון חומצות שומן", items: [L("met-fatty-acids")("activation"), L("met-fatty-acids")("beta-oxidation"), L("met-fatty-acids")("ketone-bodies")] },
  { titleHe: "זרחון חמצוני", items: [L("met-oxphos")()] },
  { titleHe: "פוטוסינתזה", items: [L("met-photosynthesis")()] },
  { titleHe: "אינטגרציה ובקרה של המטבוליזם", items: [L("met-concepts")("regulation"), L("met-integration")()] },
], "הציון: עבודת סיכום 75%, בחנים 15%, תרגילים 10%. ");

// 72155 יסודות הגנטיקה (Griffiths)
export const hujiGeneticsIntroPlan = hujiPlan("huji-genetics-intro", "72155", [
  { titleHe: "חוקי מנדל", items: [L("mendel-probability")(), L("dominance-alleles")()] },
  { titleHe: "התיאוריה הכרומוזומלית של ההורשה", items: [L("chromosomal-theory")(), L("sex-determination")()] },
  { titleHe: "הורשה אימהית", items: [L("non-mendelian")()] },
  { titleHe: "אינטראקציה בין גנים", items: [L("gene-interaction")(), L("nature-of-gene")("complementation")] },
  { titleHe: "תאחיזה, שחלוף ושיטות למיפוי גנים", items: [L("linkage-mapping")()] },
  { titleHe: "שינויים במבנה הכרומוזומים ובמספרם", items: [L("chromosome-structure")(), L("chromosome-number")()] },
  { titleHe: "מבנה ה-DNA ותפקודו", items: [L("nature-of-gene")("dna"), L("mol-nucleic-acids")("double-helix"), L("mol-replication-fork")("semiconservative"), L("mutations")()] },
  { titleHe: "שעתוק ובקרה על ביטוי גנים", items: [L("mol-transcription-prok")(), L("gx-operons")(), L("gx-transcription-factors")()] },
  { titleHe: "תרגום והקוד הגנטי", items: [L("mol-genetic-code")(), L("mol-translation-elongation")()] },
  { titleHe: "גישות גנומיות לחקר מבנה ותפקוד של גנים", items: [L("gx-genome-structure")(), L("bi-sequencing")(), L("gx-crispr-tools")()] },
  { titleHe: "גנטיקה של אוכלוסיות", items: [L("ev-selection")("hardy-weinberg"), L("pedigrees")("hardy-weinberg"), L("ev-drift")()] },
  { titleHe: "גנטיקה של תכונות כמותיות", items: [L("hg-multifactorial")("liability"), L("hg-multifactorial")("heritability"), L("ev-selection")("quantitative"), GAP.quantitative] },
], "הקורס כולל גם מעבדה (20% מהציון). ");

// 72107 מבוא לאקולוגיה
export const hujiEcologyIntroPlan = hujiPlan("huji-ecology-intro", "72107", [
  { titleHe: "התשתית הסביבתית ביבשה ובים", items: [L("ec-environment")(), L("ec-biomes")()] },
  { titleHe: "מעברי חומר ואנרגיה במערכות אקולוגיות", items: [L("ec-energy-flow")()] },
  { titleHe: "מחזורים ביוגיאוכימיים", items: [L("ec-biogeochemical")()] },
  { titleHe: "אקולוגיה מיקרוביאלית", items: [L("mv-ecology")(), L("mv-nutrient-cycles")()] },
  { titleHe: "אקולוגיה של תזונה", items: [L("ec-predation")("functional-response"), L("ec-predation")("herbivory"), soon("סעיף: אקולוגיה של תזונה וחיפוש מזון אופטימלי")] },
  { titleHe: "דמוגרפיה", items: [L("ec-population-growth")()] },
  { titleHe: "תחרות", items: [L("ec-competition")(), L("ec-population-regulation")("intraspecific")] },
  { titleHe: "מהלכי חיים", items: [L("ec-population-regulation")("life-history")] },
  { titleHe: "אסטרטגיות יציבות אבולוציונית (ESS)", items: [soon("סעיף: אסטרטגיות יציבות אבולוציונית (ESS) ותורת המשחקים")] },
  { titleHe: "טריפה ורעייה", items: [L("ec-predation")()] },
  { titleHe: "דגמי פיזור", items: [L("ec-population-growth")("dispersion"), L("ec-population-regulation")("metapopulations")] },
  { titleHe: "המגוון הביולוגי", items: [L("ec-diversity")()] },
  { titleHe: "סוקססיה", items: [L("ec-succession")()] },
  { titleHe: "השפעות האדם על מערכות אקולוגיות; שימור טבע", items: [L("ec-human-impact")()] },
]);

// 72368 מבוא לאבולוציה (Herron & Freeman)
export const hujiEvolutionIntroPlan = hujiPlan("huji-evolution-intro", "72368", [
  { titleHe: "עקרונות האבולוציה", items: [L("ev-evidence")("claims"), L("ev-evidence")("history"), L("ev-selection")("conditions"), L("ev-selection")("variation")] },
  { titleHe: "העדויות לקיום האבולוציה", items: [L("ev-evidence")()] },
  { titleHe: "גנטיקה אבולוציונית", items: [L("ev-selection")("hardy-weinberg"), L("ev-selection")("selection-model"), L("ev-drift")(), L("ev-selection-forces")(), L("ev-population-structure")()] },
  { titleHe: "עצים פילוגנטיים ושחזור אבולוציוני", items: [L("ev-evidence")("trees"), L("ev-evidence")("reconstruction"), L("ev-tree-of-life")()] },
  { titleHe: "אבולוציה של התנהגות", items: [L("ev-social")()] },
  { titleHe: "ברירה מינית", items: [L("ev-selection")("other-forms"), GAP.sexualSelection] },
  { titleHe: "אבולוציה והתפתחות", items: [L("ev-evo-devo")(), L("dv-evo-devo")()] },
  { titleHe: "קצב וזמן באבולוציה", items: [L("ev-drift")("neutral-theory"), L("ev-origins")("fossils"), L("ev-animals")("extinctions"), soon("סעיף: קצב האבולוציה — השעון המולקולרי ושיווי משקל מקוטע")] },
  { titleHe: "אבולוציה ניסויית", items: [L("ev-measuring-selection")("competition"), L("ev-measuring-selection")("belyaev"), L("ev-measuring-selection")("response")] },
  { titleHe: "מינים והתמיינותם", items: [L("ev-speciation")()] },
  { titleHe: "אבולוציה אנושית", items: [L("ev-human")()] },
]);

// 72334 מבוא למדעי הצמח (Taiz)
export const hujiPlantIntroPlan = hujiPlan("huji-plant-intro", "72334", [
  { titleHe: "תכונות צמחי היבשה וסקירה של עולם הצמחים", items: [L("pp-plant-cell")("body-plan"), GAP.plantDiversity] },
  { titleHe: "התפתחות אברי הצמח ורקמותיו", items: [L("pp-development")(), L("pp-cell-growth")()] },
  { titleHe: "מבנה אנטומי של הצמח", items: [L("pp-plant-cell")(), soon("סעיף: אנטומיה של השורש, הגבעול והעלה")] },
  { titleHe: "שלבים עיקריים בפוטוסינתזה ובנשימה", items: [L("pp-light-reactions")(), L("pp-calvin")(), L("b1-metabolism")("overview")] },
  { titleHe: "צמחי C3, C4 ו-CAM", items: [L("pp-calvin")("photorespiration"), L("pp-calvin")("c4-cam")] },
  { titleHe: "קליטת מינרלים; מחזורי פחמן וחנקן; מטבוליטים", items: [GAP.mineral, L("ec-biogeochemical")("carbon"), L("ec-biogeochemical")("nitrogen"), soon("סעיף: מטבוליטים משניים בצמחים")] },
  { titleHe: "התמודדות עם אתגרי חיי היבשה", items: [L("pp-water-cells")(), L("pp-water-balance")(), L("pp-aba-ethylene")("aba")] },
  { titleHe: "תגובות לאותות סביבה (בדגש על אור) והבסיס המולקולרי", items: [L("pp-photoreceptors")(), L("pp-tropisms")("phototropism"), L("pp-circadian-photoperiod")()] },
  { titleHe: "מחקרים יישומיים ושיטות בביוטכנולוגיה של צמחים", items: [L("pp-research-tools")()] },
], "הקורס כולל מעבדות וסיור. ");

// 72336 מבוא לפיסיולוגיה (Vander) — three parts; topics follow the Vander chapters the syllabus lists, in its order.
export const hujiPhysiologyIntroPlan = hujiPlan("huji-physiology-intro", "72336", [
  { titleHe: "חלק א: הומאוסטזיס — מסגרת לפיזיולוגיה", items: [L("en-control")("negative"), GAP.homeostasis] },
  { titleHe: "חלק א: מעבר מולקולות דרך ממברנות", items: [L("ph-transport")(), L("ph-diffusion")()] },
  { titleHe: "חלק א: עיכול וספיגה של מזון", items: [L("z-digestive")(), GAP.digestion] },
  { titleHe: "חלק א: פיזיולוגיה של הנשימה", items: [L("hemoglobin")("cooperativity"), GAP.lung] },
  { titleHe: "חלק א: ויסות המטבוליזם ומאזן האנרגיה", items: [L("met-integration")(), L("en-pancreas")()] },
  { titleHe: "חלק ב/ג: שריר ופיזיולוגיה קרדיווסקולרית", items: [L("ph-skeletal-muscle")(), L("ph-smooth-cardiac-muscle")(), L("ph-volume-pressure")("blood-pressure"), GAP.heart, GAP.vessels] },
  { titleHe: "חלק ב: אותות עצביים ומבנה מערכת העצבים", items: [L("ph-membrane-potential")(), L("ph-action-potential")(), L("ph-synapse")(), L("ph-nervous-system")()] },
  { titleHe: "חלק ב: תודעה, המוח והתנהגות", items: [L("nb-anatomy-senses")("cortex"), L("nb-learning-memory")()] },
], "הסילבוס מחלק את הקורס לשלושה חלקים (תהליכים בסיסיים, מערכות אקסיטביליות, מערכות הגוף) ומפרט את פרקי ספר הקורס; הסילבוס המורחב נמצא רק באתר הקורס. ");
