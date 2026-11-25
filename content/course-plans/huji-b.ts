import { L, soon } from "./helpers";
import { hujiPlan, GAP } from "./huji-common";

/* HUJI year-2/3 courses (see huji-common.ts for how the order is set). */

// 72332 ביולוגיה מולקולרית
export const hujiMolecularPlan = hujiPlan("huji-molecular", "72332", [
  { titleHe: "מבוא", items: [L("b1-gene-expression")("central-dogma")] },
  { titleHe: "מבנה של מאקרו-מולקולות", items: [L("mol-nucleic-acids")(), L("protein-structure")()] },
  { titleHe: "שעתוק I", items: [L("mol-transcription-prok")()] },
  { titleHe: "שעתוק II", items: [L("mol-transcription-euk")(), L("gx-cis-elements")()] },
  { titleHe: "תרגום I", items: [L("mol-genetic-code")(), L("mol-ribosome-initiation")()] },
  { titleHe: "תרגום II", items: [L("mol-translation-elongation")(), L("gx-translation-control")("global")] },
  { titleHe: "מסדי נתונים ותוכנות", items: [L("bi-databases")(), L("bi-blast")()] },
  { titleHe: "עיבוד RNA", items: [L("mol-rna-processing")()] },
  { titleHe: "שחבור חלופי ועריכת RNA", items: [L("gx-alternative-splicing")(), L("mol-rna-processing")("editing")] },
  { titleHe: "יציבות RNA", items: [L("gx-translation-control")("decay"), L("gx-alternative-splicing")("nmd-disease")] },
  { titleHe: "RNA רגולטורי", items: [L("gx-ncrna")(), L("rn-lncrna")()] },
  { titleHe: "התמודדות עם מורכבות בביולוגיה", items: [L("gx-integration")(), L("sy-information")()] },
  { titleHe: "הנדסה טרנסגנית", items: [L("mol-pcr-sequencing")("cloning"), L("gx-crispr-tools")(), GAP.transgenic] },
  { titleHe: "סרטן: היבטים מולקולריים", items: [L("ca-oncogenes")(), L("ca-tumor-suppressors")()] },
]);

// 72373 ביולוגיה של התא מורחב (Engelberg)
export const hujiCellAdvPlan = hujiPlan("huji-cell-adv", "72373", [
  { titleHe: "ארגון הממברנות, אסימטריה, lipid rafts ודינמיקה בדו-שכבה; צמתים בין תאים", items: [L("cell-membranes")(), L("cell-junctions")()] },
  { titleHe: "השלד התוך-תאי", items: [L("cell-cytoskeleton")(), L("cell-motors-polarity")()] },
  { titleHe: "בקרת מחזור התא", items: [L("cell-cycle-control")(), L("ub-cell-cycle")()] },
  { titleHe: "אנדוציטוזה ואקסוציטוזה", items: [L("cell-golgi-endosomes")("endocytosis"), L("cell-golgi-endosomes")("endosomes"), L("cell-vesicle-transport")()] },
  { titleHe: "מוות תאי", items: [L("cell-death")()] },
], "הסילבוס מציין שחלק מהחומר אינו בספרי הלימוד ונלמד רק בהרצאות. ");

// 72339 ביוכימיה מורחב (Lerner) — protein structure, proteostasis and aggregation
export const hujiBiochemAdvPlan = hujiPlan("huji-biochem-adv", "72339", [
  { titleHe: "מבנה חלבונים מקופלים; הקשר בין מבנה לתפקוד", items: [L("protein-structure")(), L("protein-folding")("anfinsen"), L("protein-folding")("cooperative")] },
  { titleHe: "המערכת הפרוטאוסטטית בבריאות ובמחלה", items: [L("protein-folding")("chaperones"), L("cell-quality-control")(), L("ub-proteasome")()] },
  { titleHe: "חלבונים חסרי מבנה", items: [soon("יחידה מלאה: חלבונים חסרי מבנה (IDPs)")] },
  { titleHe: "מדידת דינמיקה מבנית ואגרגציה של חלבונים במבחנה ובתאים", items: [L("protein-methods")("structure"), L("bp-single-molecule")(), soon("סעיף: מדידת אגרגציה ודינמיקה של חלבונים — FRET, ThT ו-NMR")] },
  { titleHe: "התקבצות חלבונים: מומס ושוקע; הפרדת פאזות", items: [L("protein-folding")("misfolding"), soon("יחידה מלאה: הפרדת פאזות והתקבצות חלבונים")] },
  { titleHe: "אלפא-סינוקלאין כדוגמה למחלת חלבונים", items: [L("nb-neurodegeneration")("parkinsons"), L("ub-neurons")("inclusions")] },
  { titleHe: "עקה חמצונית ובקרת קיפול חלבונים", items: [soon("יחידה מלאה: עקה חמצונית וקיפול חלבונים")] },
], "חומר הקריאה הוא מאמרים שניתנים במהלך הקורס. ");

// 72345 גנטיקה מורחב (Tzfati, Goldberg) — lectures + lab
export const hujiGeneticsAdvPlan = hujiPlan("huji-genetics-adv", "72345", [
  { titleHe: "מחזור התא", items: [L("cell-cycle-control")()] },
  { titleHe: "התגובה התאית לנזקי DNA", items: [L("cell-cycle-control")("p53"), L("mol-repair")(), L("ub-genome")()] },
  { titleHe: "החלפת הזוויג בשמר", items: [soon("סעיף: החלפת הזוויג בשמר (mating-type switching)")] },
  { titleHe: "תחילת הכפלת ה-DNA", items: [L("mol-replication-origins")()] },
  { titleHe: "טלומרים, טלומראז וצנטרומרים", items: [L("mol-replication-origins")("telomerase"), L("mol-chromatin")("centromere-telomere")] },
  { titleHe: "גנטיקה של הסרטן", items: [L("hg-cancer")(), L("ca-tumor-suppressors")()] },
  { titleHe: "מחלות גנטיות", items: [L("hg-variants")(), L("hg-diagnosis")()] },
  { titleHe: "הנדסה גנומית", items: [L("gx-crispr-tools")(), L("mol-repair")("crispr")] },
  { titleHe: "שינויים שלאחר התרגום", items: [L("covalent-regulation")(), L("ub-code")()] },
  { titleHe: "אפיגנטיקה", items: [L("gx-epigenetics")(), L("gx-chromatin-modifications")()] },
  { titleHe: "RNA לא מקודד", items: [L("gx-ncrna")(), L("rn-lncrna")(), L("rn-pirna")()] },
  { titleHe: "עולם ה-RNA", items: [L("rn-rna-world")()] },
], "הקורס כולל מעבדה; אין קריאת חובה מלבד מאמרים. ");

// 72320 ביולוגיה התפתחותית (Wolpert / Gilbert) — 25 topics listed in order
export const hujiDevelopmentalPlan = hujiPlan("huji-developmental", "72320", [
  { titleHe: "מבוא לביולוגיה התפתחותית", items: [L("dv-principles")()] },
  { titleHe: "התפתחות תאי זרע", items: [L("en-reproduction")("testis"), GAP.gametogenesis] },
  { titleHe: "ההפריה", items: [L("z-embryology")("fertilization"), GAP.gametogenesis] },
  { titleHe: "מבוא לגנטיקה התפתחותית: הדרוזופילה", items: [L("dv-genes")(), L("dv-fly-axes")("syncytium")] },
  { titleHe: "בקרה גנטית על צירי העובר בזבוב — א'", items: [L("dv-fly-axes")("maternal"), L("dv-fly-axes")("dorsal")] },
  { titleHe: "בקרה גנטית על צירי העובר בזבוב — ב'", items: [L("dv-fly-axes")("zygotic"), L("dv-hox")()] },
  { titleHe: "התפתחות חולייתנים א': מחזורי חיים ושיטות", items: [L("dv-vertebrate-axes")("chick-early"), L("dv-vertebrate-axes")("mouse-early"), L("z-embryology")("cleavage"), L("z-embryology")("gastrulation")] },
  { titleHe: "התפתחות חולייתנים ב': צירי הגוף והמארגן של שפמן", items: [L("z-embryology")("axes"), L("dv-vertebrate-axes")("organizers")] },
  { titleHe: "התפתחות חולייתנים ג': השלמת צירי הגוף", items: [L("dv-vertebrate-axes")("chick-axis"), L("dv-vertebrate-axes")("mouse-axis"), L("dv-vertebrate-axes")("left-right")] },
  { titleHe: "גדילה, התפתחות שלאחר הלידה ורגנרציה", items: [L("dv-regeneration")(), L("en-growth")()] },
  { titleHe: "הזדקנות ומודלים גנטיים", items: [GAP.aging] },
  { titleHe: "אמבריולוגיה וגנטיקה של תאומים", items: [L("hg-behavior")("twins-adoption"), soon("סעיף: אמבריולוגיה של תאומים")] },
  { titleHe: "מבנה והתפתחות מערכת העצבים המרכזית", items: [L("nb-development")("neural-tube"), L("nb-development")("neurogenesis"), L("z-embryology")("neurulation")] },
  { titleHe: "בקרה על התפתחות חוט השדרה", items: [L("nb-development")("neural-tube"), soon("סעיף: התמיינות לאורך הציר הגבי-גחוני של חוט השדרה (Shh ו-BMP)")] },
  { titleHe: "מבנה והתפתחות מערכת העצבים ההיקפית", items: [L("nb-development")("axon-guidance"), L("nb-development")("survival"), soon("סעיף: תכס העצבי ומערכת העצבים ההיקפית")] },
  { titleHe: "בקרה גנטית על נוירוגנזה בזבוב: Notch", items: [L("dv-signaling")("notch")] },
  { titleHe: "בקרה גנטית על נוירוגנזה בזבוב: Numb", items: [soon("סעיף: Numb וחלוקה אסימטרית בנוירוגנזה")] },
  { titleHe: "התפתחות השלד: בעובר, בילד, בבוגר ובפצוע", items: [L("dv-limb")(), L("en-growth")("growth-plate"), soon("יחידה מלאה: התפתחות השלד — התגרמות, לוחית הגדילה ושיקום")] },
]);

// 72604 אקולוגיה מורחב (year-long: lectures + field lab)
export const hujiEcologyAdvPlan = hujiPlan("huji-ecology-adv", "72604", [
  { titleHe: "נישה אקולוגית ותפוצה גיאוגרפית", items: [L("ec-environment")("niche"), L("ec-environment")("dispersal")] },
  { titleHe: "דמוגרפיה, בקרה תלוית צפיפות ותנודות אקראיות", items: [L("ec-population-growth")(), L("ec-population-regulation")()] },
  { titleHe: "ארבעת הכוחות הבסיסיים בחברות אקולוגיות", items: [soon("סעיף: ארבעת התהליכים בחברות — ברירה, סחף, פיזור והתפצלות")] },
  { titleHe: "השפעת שטח, פרודוקטיביות, הטרוגניות והפרעה על מגוון", items: [L("ec-diversity")("species-area"), L("ec-diversity")("local"), L("ec-succession")("mechanisms")] },
  { titleHe: "תאוריית הקיום יחדיו", items: [L("ec-competition")(), L("sh-coexistence")()] },
  { titleHe: "השפעת ההיסטוריה על חברות; מצבי שיווי משקל חלופיים", items: [L("ec-succession")(), soon("סעיף: מצבי שיווי משקל חלופיים וקטסטרופות")] },
  { titleHe: "השפעת המגוון על תפקוד אקוסיסטמות", items: [L("ec-diversity")("function")] },
  { titleHe: "מודלי אפס", items: [soon("סעיף: מודלי אפס באקולוגיה")] },
  { titleHe: "מעבדת השדה: תכנון מחקר, דיגום וניתוח נתונים", items: [L("b1-science")("experiment-design"), L("bs-describing-data")(), soon("יחידה מלאה: תכנון מחקר שדה ודיגום אקולוגי")] },
], "הציון: מבחן 40%, עבודה מסכמת 40%, תרגילים 20%. ");

// 72369 נוירוביולוגיה ומדעי המח
export const hujiNeuroPlan = hujiPlan("huji-neuro", "72369", [
  { titleHe: "מבוא לחקר המוח", items: [L("nb-methods")()] },
  { titleHe: "מבוא למבנה המוח", items: [L("nb-anatomy-senses")("cortex"), L("nb-anatomy-senses")("deep-structures"), L("nb-anatomy-senses")("ventricles")] },
  { titleHe: "רפלקסים", items: [L("nb-anatomy-senses")("reflex-circuit"), L("ph-nervous-system")("reflex")] },
  { titleHe: "תפקוד מערכת העצבים; מערכת העצבים המרכזית וההיקפית", items: [L("ph-nervous-system")(), L("nb-anatomy-senses")("spinal")] },
  { titleHe: "נוירונים ותאי גליה", items: [L("nb-cells")()] },
  { titleHe: "הולכה חשמלית ותקשורת סינפטית", items: [L("ph-action-potential")(), L("nb-channels")(), L("nb-synapse")()] },
  { titleHe: "פלסטיות עצבית ומנגנוני זיכרון", items: [L("nb-learning-memory")()] },
  { titleHe: "התפתחות המוח", items: [L("nb-development")()] },
  { titleHe: "מחסום הדם-מוח", items: [L("nb-neuroimmune")("bbb"), L("ph-nervous-system")("csf-bbb")] },
  { titleHe: "מערכת העצבים, מערכת החיסון והמיקרוביום", items: [L("nb-neuroimmune")()] },
  { titleHe: "מודלים של תא בודד", items: [L("ph-action-potential")("passive"), L("sy-neurons")("rc"), soon("סעיף: מודלים של תא עצב בודד — מעגל RC ומודל הודג'קין-האקסלי")] },
]);

// 72343 פיזיולוגיה של מערכת העצבים
export const hujiNeuroPhysPlan = hujiPlan("huji-neuro-phys", "72343", [
  { titleHe: "מבוא: מנוירון ועד המוח", items: [L("nb-cells")(), L("nb-anatomy-senses")("cortex")] },
  { titleHe: "מבוא למערכות סנסוריות", items: [L("nb-anatomy-senses")("senses")] },
  { titleHe: "ראייה, מישוש, שיווי משקל, כאב וריח", items: [L("z-nervous-senses")("eye"), L("cell-gpcr")("vision"), L("z-nervous-senses")("hair-cells"), L("z-nervous-senses")("olfaction"), GAP.somatosensory] },
  { titleHe: "המערכת האוטונומית", items: [GAP.homeostasis] },
  { titleHe: "מבוא למערכות מוטוריות", items: [L("ph-skeletal-muscle")("motor-units"), GAP.motor] },
  { titleHe: "חוט השדרה", items: [L("nb-anatomy-senses")("spinal"), L("nb-anatomy-senses")("reflex-circuit"), L("ph-nervous-system")("reflex")] },
  { titleHe: "הקורטקס המוטורי", items: [GAP.motor] },
  { titleHe: "הגרעינים הבזאליים", items: [L("nb-anatomy-senses")("deep-structures"), L("nb-neurodegeneration")("parkinsons"), GAP.motor] },
  { titleHe: "המוח הקטן", items: [GAP.motor] },
], "לפי הסילבוס, המבחן כולל גם חומר שנלמד בתרגולים בלבד. ");

// 72665 אימונולוגיה — one official paragraph, split here into its named parts
export const hujiImmunologyPlan = hujiPlan("huji-immunology", "72665", [
  { titleHe: "מערכת החיסון המולדת: מרכיבים ותפקוד", items: [L("im-intro")(), L("im-innate")()] },
  { titleHe: "מערכת החיסון הנרכשת: התפתחות, מרכיבים ותפקוד", items: [L("im-antibodies")(), L("im-ig-genetics")(), L("im-b-cells")(), L("im-mhc")(), L("im-t-cells")(), L("im-cytokines")(), L("im-effector")()] },
  { titleHe: "סרטן", items: [L("ca-immunology")()] },
  { titleHe: "חסר חיסוני מולד ונרכש", items: [L("im-immunodeficiency")()] },
  { titleHe: "מחלות אוטואימוניות", items: [L("im-tolerance")()] },
  { titleHe: "מחלות זיהומיות ודלקתיות", items: [L("im-infection")(), L("im-innate")("inflammation")] },
  { titleHe: "אלרגיה", items: [L("im-hypersensitivity")()] },
], "הסילבוס הרשמי הוא פסקה אחת; החלוקה לנושאים כאן לפי הנושאים שהיא מונה. ");

// 72362 מבוא למיקרוביולוגיה (Brock)
export const hujiMicroIntroPlan = hujiPlan("huji-micro-intro", "72362", [
  { titleHe: "עולם המיקרואורגניזמים; ההיסטוריה של המיקרוביולוגיה", items: [L("mv-history")()] },
  { titleHe: "מבנה ותפקוד התא הפרוקריוטי", items: [L("mv-cell-envelope")(), L("mv-surface-motility")()] },
  { titleHe: "גדילת חיידקים וכימות", items: [L("mv-growth")(), L("mv-environment")()] },
  { titleHe: "מטבוליזם של חיידקים", items: [L("mv-metabolic-diversity")("classes"), L("mv-metabolic-diversity")("redox-tower"), L("mv-metabolic-diversity")("fermentation"), L("mv-metabolic-diversity")("respiration")] },
  { titleHe: "גיוון מטבולי של מיקרואורגניזמים", items: [L("mv-metabolic-diversity")("chemolithotrophy"), L("mv-metabolic-diversity")("phototrophy"), L("mv-nutrient-cycles")(), L("mv-diversity")()] },
  { titleHe: "מיקרואורגניזמים אאוקריוטים", items: [L("ev-eukaryotes")("diversity"), L("z-protists")(), L("mv-diversity")("eukaryotes"), GAP.fungi] },
  { titleHe: "גנטיקה של חיידקים", items: [L("mv-gene-transfer")()] },
  { titleHe: "וירוסים ובקטריופאגים", items: [L("mv-viruses")(), L("mv-phages")()] },
  { titleHe: "גנומיקה ומטא-גנומיקה של חיידקים", items: [L("mv-methods")("16s"), L("mv-methods")("metagenomics"), L("bi-microbiome")()] },
  { titleHe: "סימביוזה והמיקרוביוטה", items: [L("mv-ecology")("symbiosis"), L("mv-ecology")("microbiome"), L("pg-microbiome")()] },
  { titleHe: "מחוללי מחלות זיהומיות", items: [L("mv-clinical")(), L("pg-toxins")()] },
  { titleHe: "אינטראקציות בין חיידק לחיידק", items: [L("mv-ecology")("quorum-sensing"), L("mv-ecology")("biofilm")] },
]);

// 72342 מיקרוביולוגיה מורחב — papers-based
export const hujiMicroAdvPlan = hujiPlan("huji-micro-adv", "72342", [
  { titleHe: "וירולוגיה", items: [L("mv-viruses")(), L("vr-attachment-entry")(), L("vr-genome-replication")(), L("vr-latency")()] },
  { titleHe: "פרזיטולוגיה", items: [GAP.parasitology] },
  { titleHe: "תגובת מערכת החיסון לפתוגנים", items: [L("im-infection")(), L("vr-animal-defenses")()] },
  { titleHe: "נושאים בפיזיולוגיה של חיידקים", items: [L("mv-growth")(), L("mv-endospores")(), L("mv-surface-motility")(), L("pg-physiology")()] },
  { titleHe: "מיקרוביום", items: [L("pg-microbiome")(), L("mv-ecology")("microbiome"), L("bi-microbiome")()] },
  { titleHe: "מיקרוסקופיה של מיקרואורגניזמים", items: [L("mv-methods")("microscopy"), L("cell-methods")("microscopy")] },
], "חומר הקריאה הוא מאמרים מדעיים שניתנים בקורס. ");

// 72346 מדעי הצמח מורחב — papers + lab
export const hujiPlantAdvPlan = hujiPlan("huji-plant-adv", "72346", [
  { titleHe: "אמבריוגנזה: מקורה של אדריכלות הצמח", items: [L("pp-development")("seed-formation"), soon("סעיף: אמבריוגנזה בצמחים — צירים ומריסטמות")] },
  { titleHe: "נביטה והתבססות", items: [L("pp-development")("dormancy"), L("pp-development")("germination"), L("pp-development")("seedling"), L("pp-photoreceptors")()] },
  { titleHe: "בקרה על פריחה והתפתחות פרחונית", items: [L("pp-flowering")(), L("pp-circadian-photoperiod")()] },
  { titleHe: "התפתחות גמטופיטים, האבקה והתפתחות פירות", items: [GAP.plantReproduction] },
  { titleHe: "פוטוסינתזה: שיקולים פיזיולוגיים ואקולוגיים", items: [L("pp-calvin")("photorespiration"), L("pp-calvin")("c4-cam"), L("pp-light-reactions")("photoprotection")] },
  { titleHe: "אותות והעברת אותות", items: [L("pp-auxin")(), L("pp-cytokinin-gibberellin")(), L("pp-aba-ethylene")()] },
  { titleHe: "הובלת מומסים", items: [L("pp-water-balance")(), GAP.mineral] },
  { titleHe: "טרנסלוקציה בשיפה", items: [GAP.mineral] },
  { titleHe: "נשימה ומטבוליזם של שומנים", items: [L("met-oxphos")(), L("met-citric-acid")("glyoxylate"), soon("סעיף: נשימה ומטבוליזם של שומנים בצמח")] },
  { titleHe: "אינטראקציות ביוטיות: פתוגנים ואינטראקציות בין צמחים", items: [L("pp-biotic-stress")()] },
], "הציון: מבחן בית, פרויקט, הצעת מחקר והרצאה; המאמרים מתחלפים מדי שנה. ");

// 94510 מבוא לביואינפורמטיקה מורחב
export const hujiBioinformaticsPlan = hujiPlan("huji-bioinformatics", "94510", [
  { titleHe: "מהפכת הריצוף, ביולוגיה עתירת נתונים ומאגרי מידע", items: [L("bi-sequencing")("technologies"), L("bi-databases")()] },
  { titleHe: "השוואת שני רצפים והשוואה מול בנק רצפים", items: [L("bi-pairwise")(), L("bi-blast")()] },
  { titleHe: "ניתוח נתוני ביטוי גנים ושחבור חלופי", items: [L("bi-rnaseq")(), L("gx-expression-data")(), L("gx-alternative-splicing")()] },
  { titleHe: "אפיון אפיגנטי: מתילציה של DNA ושינויים בזנבות היסטונים", items: [L("gx-chromatin-modifications")(), L("bi-msa")("chip-seq"), soon("סעיף: ניתוח נתוני מתילציה וסימני היסטונים")] },
  { titleHe: "ניתוח מוטיבים ואתרי קישור של חלבונים ל-DNA", items: [L("gx-genomic-tracks")(), L("bi-msa")("motifs")] },
  { titleHe: "ביואינפורמטיקה במחקר הסרטן וברפואה מותאמת אישית", items: [L("dg-personalized")(), L("hg-diagnosis")("ngs")] },
  { titleHe: "רצפי חלבונים, קשר תפקודי בין חלבונים וניבוי מבנה", items: [L("bi-protein-structure")(), L("bi-networks")(), L("bi-msa")("domains")] },
  { titleHe: "שמירות אבולוציונית ואבולוציה מולקולרית", items: [L("bi-msa")("conservation"), L("bi-msa")("trees"), L("ev-measuring-selection")("dnds")] },
], "הציון: מבחן ממוחשב 60%, תרגילי בית 40%. ");
