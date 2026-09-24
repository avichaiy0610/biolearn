/**
 * Content QA fixes — September 2026.
 *
 *   npx tsx scripts/content-fix-2026-09.ts            # apply (writes a backup first)
 *   npx tsx scripts/content-fix-2026-09.ts --dry-run  # print the plan only
 *   npx tsx scripts/content-fix-2026-09.ts --rollback .backups/content-fix-<ts>.json
 *
 * Every rewritten text was reviewed against Campbell Biology (12e) and
 * Alberts, Molecular Biology of the Cell (7e); those rows get reviewedAt.
 * Duplicate / low-quality subtopics are hidden (not deleted). Placeholder and
 * duplicate animations are deleted; the backup file restores them.
 */
import "dotenv/config";
import { createClient, type InStatement, type Row } from "@libsql/client";
import { randomBytes } from "crypto";
import fs from "fs";
import path from "path";

const db = createClient({ url: process.env.DATABASE_URL ?? "", authToken: process.env.DATABASE_AUTH_TOKEN });
const NOW = new Date().toISOString();
const cuid = () => "c" + randomBytes(12).toString("hex").slice(0, 24);

/* ───────────────────────────── content ───────────────────────────── */

const TOPIC_DESC: Record<string, [he: string, en: string]> = {
  genetics: ["תורשה מנדלית ולא-מנדלית, אללים, מוטציות, גנים הקשורים למין והחתמה גנומית", "Mendelian and non-Mendelian inheritance, alleles, mutations, sex linkage and genomic imprinting"],
  "molecular-biology": ["שכפול DNA, שעתוק, תרגום, בקרת ביטוי גנים ושיטות מולקולריות כמו PCR", "DNA replication, transcription, translation, gene regulation and molecular methods such as PCR"],
  "cell-biology": ["מבנה התא האאוקריוטי, אברונים, קרום התא, מחזור התא ומיטוזה ופירוק חלבונים", "Eukaryotic cell structure, organelles, membranes, the cell cycle and mitosis, and protein degradation"],
  biochemistry: ["מבנה ותפקוד של חלבונים, אנזימים, ליפידים וחומצות גרעין, ומסלולים מטבוליים", "Structure and function of proteins, enzymes, lipids and nucleic acids, and metabolic pathways"],
  microbiology: ["מבנה חיידקים ווירוסים, מחזורי חיים ויראליים ומערכת החיסון מול פתוגנים", "Bacterial and viral structure, viral life cycles and the immune response to pathogens"],
  physiology: ["תפקוד מערכות הגוף: העברת אותות עצביים ומערכת הלב וכלי הדם", "How body systems work: nerve signalling and the cardiovascular system"],
  "plant-physiology": ["פוטוסינתזה, טרנספירציה, קליטת חומרים מזינים ובקרה הורמונלית בצמחים", "Photosynthesis, transpiration, nutrient uptake and hormonal regulation in plants"],
  immunology: ["חסינות מולדת ונרכשת, תאי מערכת החיסון, נוגדנים וציטוקינים", "Innate and adaptive immunity, immune cells, antibodies and cytokines"],
  neurobiology: ["מבנה ותפקוד של תאי עצב, העברת אותות עצביים ומעגלים עצביים", "Neuron structure and function, neural signalling and neural circuits"],
  "evolutionary-biology": ["ברירה טבעית, סחף גנטי, זרימת גנים והיווצרות מינים", "Natural selection, genetic drift, gene flow and speciation"],
  ecology: ["אוכלוסיות, חברות ומערכות אקולוגיות, והגורמים המשפיעים על תפוצת אורגניזמים", "Populations, communities and ecosystems, and what shapes the distribution of organisms"],
  "developmental-biology": ["התפתחות עוברית, התמיינות תאים, מורפוגנזה ויצירת דפוסים", "Embryonic development, cell differentiation, morphogenesis and pattern formation"],
  endocrinology: ["בלוטות ההפרשה הפנימית, סוגי הורמונים, מנגנוני פעולה ובקרה במשוב", "Endocrine glands, hormone classes, mechanisms of action and feedback control"],
  bioinformatics: ["ניתוח חישובי של רצפים: יישור רצפים, חיפוש במאגרים, פילוגנטיקה וביולוגיה מבנית", "Computational sequence analysis: alignment, database search, phylogenetics and structural biology"],
};

// Curated human pathways per topic; [] = show none (no good species/topic match).
const REACTOME_PINS: Record<string, string[]> = {
  "molecular-biology": ["R-HSA-69306", "R-HSA-74160", "R-HSA-72766"],
  "cell-biology": ["R-HSA-1640170", "R-HSA-69620", "R-HSA-68886", "R-HSA-199991", "R-HSA-392499"],
  biochemistry: ["R-HSA-70171", "R-HSA-71403", "R-HSA-611105"],
  genetics: ["R-HSA-1500620", "R-HSA-73894", "R-HSA-74160"],
  immunology: ["R-HSA-168249", "R-HSA-1280218"],
  microbiology: ["R-HSA-168898", "R-HSA-5663205"],
  physiology: ["R-HSA-397014", "R-HSA-112316", "R-HSA-5576891"],
  "plant-physiology": [],
  neurobiology: ["R-HSA-112316"],
  endocrinology: [],
  "evolutionary-biology": [],
  ecology: [],
  "developmental-biology": [],
  bioinformatics: [],
};

type SubtopicFix = { id: string; nameHe?: string; nameEn?: string; contentHe?: string; contentEn?: string; relatedProcessSlug?: string | null; hidden?: boolean };

const ORGANELLES_HE = `תאים אאוקריוטיים מחולקים למדורים. חלק מהאברונים עטופים בממברנה וחלק לא:

אברונים עם ממברנה כפולה:
• גרעין — מכיל את ה-DNA; מעטפת הגרעין מנוקבת בנקבוביות גרעין
• מיטוכונדריה — נשימה תאית וייצור ATP; מכילה DNA וריבוזומים משלה (תאוריית האנדוסימביוזה)
• כלורופלסטים (צמחים ואצות) — פוטוסינתזה

אברונים עם ממברנה יחידה:
• רשתית תוך-תאית גבשושית (RER) — ריבוזומים צמודים; סינתזה וקיפול של חלבוני הפרשה וממברנה
• רשתית תוך-תאית חלקה (SER) — סינתזת ליפידים, פירוק רעלים ואגירת יוני סידן
• מערכת גולג'י — עיבוד (למשל גליקוזילציה), מיון ושילוח חלבונים בשלפוחיות
• ליזוזומים (בעיקר בתאי בעלי חיים) — עיכול תוך-תאי באנזימים הידרוליטיים בסביבה חומצית
• פרוקסיזומים — פירוק חומצות שומן ארוכות ונטרול מי חמצן (H₂O₂) בעזרת האנזים קטלאז
• וקואולה מרכזית (צמחים) — אגירת מים, יונים ופסולת, ושמירה על לחץ הטורגור

מבנים ללא ממברנה:
• ריבוזומים — סינתזת חלבונים; חופשיים בציטוזול או צמודים ל-RER
• שלד התא (ציטוסקלטון) — מיקרוטובולים, סיבי אקטין וסיבי ביניים: צורה, תנועה וחלוקה
• צנטרוזום — מרכז ארגון המיקרוטובולים (בתאי בעלי חיים כולל זוג צנטריולים)`;

const ORGANELLES_EN = `Eukaryotic cells are compartmentalized. Some organelles are enclosed by membranes and some are not:

Double-membrane organelles:
• Nucleus — holds the DNA; the nuclear envelope is perforated by nuclear pores
• Mitochondria — cellular respiration and ATP production; have their own DNA and ribosomes (endosymbiotic theory)
• Chloroplasts (plants and algae) — photosynthesis

Single-membrane organelles:
• Rough ER — bound ribosomes; synthesis and folding of secreted and membrane proteins
• Smooth ER — lipid synthesis, detoxification and calcium storage
• Golgi apparatus — processing (e.g. glycosylation), sorting and shipping of proteins in vesicles
• Lysosomes (mainly animal cells) — intracellular digestion by hydrolytic enzymes at acidic pH
• Peroxisomes — breakdown of very-long-chain fatty acids and removal of H₂O₂ by catalase
• Central vacuole (plants) — stores water, ions and waste and maintains turgor pressure

Non-membrane structures:
• Ribosomes — protein synthesis; free in the cytosol or bound to the rough ER
• Cytoskeleton — microtubules, actin filaments and intermediate filaments: shape, movement and division
• Centrosome — the microtubule-organizing center (with a pair of centrioles in animal cells)`;

const CELL_CYCLE_HE = `מחזור התא הוא רצף האירועים שבין היווצרות התא לבין חלוקתו לשני תאי בת:

אינטרפאזה (רוב זמן המחזור):
• G1 — גדילה וסינתזת חלבונים; בסוף G1 נמצאת נקודת ההגבלה (restriction point), שבה התא "מחליט" אם להתחלק
• S — שכפול ה-DNA: כל כרומוזום הופך לשתי כרומטידות אחיות המחוברות בצנטרומר
• G2 — המשך גדילה והכנה לחלוקה; בדיקה שהשכפול הושלם ושה-DNA תקין

תאים שאינם מתחלקים יוצאים מ-G1 לשלב מנוחה בשם G0 (למשל רוב תאי העצב והשריר). חלקם חוזרים למחזור בתגובה לאותות גדילה.

שלב M:
• מיטוזה — פרופאזה ← פרומטאפאזה ← מטאפאזה ← אנאפאזה ← טלופאזה
• ציטוקינזה — חלוקת הציטופלזמה לשני תאי בת זהים גנטית`;

const CELL_CYCLE_EN = `The cell cycle is the sequence of events from a cell's formation to its division into two daughter cells:

Interphase (most of the cycle):
• G1 — growth and protein synthesis; late in G1 is the restriction point, where the cell "decides" whether to divide
• S — DNA replication: each chromosome becomes two sister chromatids joined at the centromere
• G2 — further growth and preparation for division; checks that replication is complete and the DNA is intact

Non-dividing cells exit from G1 into a resting state called G0 (e.g. most neurons and muscle cells). Some re-enter the cycle in response to growth signals.

M phase:
• Mitosis — prophase → prometaphase → metaphase → anaphase → telophase
• Cytokinesis — division of the cytoplasm into two genetically identical daughter cells`;

const REGULATION_HE = `המעבר בין שלבי מחזור התא נשלט בידי מערכת בקרה ביוכימית:

• ציקלינים ו-CDK — קינאזות תלויות-ציקלין (CDK) פעילות רק כשהן קשורות לציקלין. ריכוז הציקלינים עולה ויורד במחזוריות, ולכן בכל שלב פעיל קומפלקס אחר: ציקלין D–CDK4/6 ב-G1, ציקלין E–CDK2 במעבר G1/S, ציקלין A–CDK2 בשלב S, וציקלין B–CDK1 (MPF) במעבר G2/M.
• פירוק מתוזמן — הקומפלקס APC/C מסמן באוביקוויטין את הסקורין ואת ציקלין B לפירוק בפרוטאזום, וכך מאפשר את האנאפאזה ואת היציאה מהמיטוזה.
• נקודות בקרה:
  – G1/S: האם התא גדול מספיק, יש אותות גדילה וה-DNA תקין? ציקלין D–CDK4/6 מזרחנים את החלבון Rb, והוא משחרר את גורם השעתוק E2F שמפעיל גנים של שלב S.
  – G2/M: האם השכפול הושלם וה-DNA ללא נזק?
  – נקודת בקרת הציר (בשלב M): האם כל הקינטוכורים מחוברים לציר?
• נזק ל-DNA מפעיל את p53, שמשרה ביטוי של p21 — מעכב CDK שעוצר את המחזור לצורך תיקון, או מוביל לאפופטוזיס כשהנזק חמור.

מוטציות שמשבשות את הבקרה (למשל ב-p53 או ב-Rb, או עודף ציקלין D) הן מהגורמים המרכזיים להתפתחות סרטן.`;

const REGULATION_EN = `Progression through the cell cycle is governed by a biochemical control system:

• Cyclins and CDKs — cyclin-dependent kinases (CDKs) are active only when bound to a cyclin. Cyclin levels rise and fall cyclically, so each phase is driven by a different complex: cyclin D–CDK4/6 in G1, cyclin E–CDK2 at G1/S, cyclin A–CDK2 in S, and cyclin B–CDK1 (MPF) at G2/M.
• Timed destruction — the APC/C ubiquitinates securin and cyclin B, targeting them to the proteasome; this triggers anaphase and exit from mitosis.
• Checkpoints:
  – G1/S: is the cell big enough, are growth signals present, is the DNA intact? Cyclin D–CDK4/6 phosphorylate Rb, releasing the transcription factor E2F to switch on S-phase genes.
  – G2/M: is replication complete and the DNA undamaged?
  – Spindle assembly checkpoint (in M): are all kinetochores attached to the spindle?
• DNA damage activates p53, which induces p21 — a CDK inhibitor that halts the cycle for repair, or triggers apoptosis if the damage is severe.

Mutations that disrupt this control (e.g. in p53 or Rb, or cyclin D overexpression) are central drivers of cancer.`;

const UPS_HE = `מערכת האוביקוויטין-פרוטאזום (UPS) היא המסלול העיקרי לפירוק מבוקר של חלבונים בציטוזול ובגרעין:

• סימון — החלבון הקטן אוביקוויטין (76 חומצות אמינו) מוצמד לחלבון המטרה במפל של שלושה אנזימים:
  – E1 (אנזים מפעיל) — מפעיל את האוביקוויטין בעזרת ATP
  – E2 (אנזים מצמד) — מקבל את האוביקוויטין מ-E1
  – E3 (ליגאז) — מזהה חלבון מטרה ספציפי ומעביר אליו את האוביקוויטין. מאות סוגי E3 הם שמעניקים למערכת את הספציפיות שלה
• אות הפירוק — שרשרת של ארבעה אוביקוויטינים לפחות, המקושרים דרך ליזין 48 (K48)
• פירוק — הפרוטאזום 26S בנוי מגליל ליבה 20S שבתוכו האתרים הפרוטאוליטיים, ומכסה 19S בכל קצה. המכסה מזהה את השרשרת, פורש את החלבון בעזרת ATP ומשחיל אותו לתוך הגליל, שם הוא מפורק לפפטידים קצרים
• מִחזור — אנזימי דה-אוביקוויטינציה (DUBs) מסירים את האוביקוויטין לפני הפירוק, והוא משמש שוב

תפקידים: סילוק חלבונים פגומים, ויסות מחזור התא (פירוק ציקלינים) ובקרת גורמי שעתוק. התרופה בורטזומיב, מעכבת פרוטאזום, משמשת לטיפול במיאלומה נפוצה.`;

const UPS_EN = `The ubiquitin–proteasome system (UPS) is the main route for regulated protein degradation in the cytosol and nucleus:

• Tagging — the small protein ubiquitin (76 amino acids) is attached to the target by a three-enzyme cascade:
  – E1 (activating enzyme) — activates ubiquitin using ATP
  – E2 (conjugating enzyme) — receives ubiquitin from E1
  – E3 (ligase) — recognizes a specific substrate and transfers ubiquitin to it; hundreds of E3s give the system its specificity
• Degradation signal — a chain of at least four ubiquitins linked through lysine 48 (K48)
• Degradation — the 26S proteasome is a 20S core barrel containing the proteolytic sites, capped at each end by a 19S regulatory particle that recognizes the chain, unfolds the protein using ATP and threads it into the barrel, where it is cut into short peptides
• Recycling — deubiquitinating enzymes (DUBs) remove ubiquitin before degradation so it can be reused

Roles: removing damaged proteins, cell-cycle control (cyclin destruction) and regulating transcription factors. The proteasome inhibitor bortezomib is used to treat multiple myeloma.`;

const QC_HE = `בקרת איכות של חלבונים ומסלולי הפירוק:

• שפרונים (כמו Hsp70 ו-Hsp90) עוזרים לחלבונים חדשים להתקפל ומנסים לקפל מחדש חלבונים שנפגעו.
• חלבון שלא ניתן לתקן מסומן באוביקוויטין ומפורק בפרוטאזום. חלבונים פגומים ברשתית התוך-תאית מוחזרים לציטוזול ומפורקים באותה דרך (ERAD).

פרוטאזום מול ליזוזום:
• פרוטאזום — קומפלקס חלבוני ללא ממברנה, בציטוזול ובגרעין; מפרק חלבונים בודדים שסומנו באוביקוויטין; תלוי ATP, מהיר וסלקטיבי.
• ליזוזום — אברון עטוף ממברנה עם אנזימים הידרוליטיים הפעילים ב-pH חומצי (כ-4.5–5); מפרק חלבוני ממברנה וחומרים שנקלטו מחוץ לתא (אנדוציטוזה), וגם אגרגטים ואברונים שלמים בתהליך האוטופגיה.

כשהמערכות האלה נכשלות מצטברים אגרגטים של חלבונים — מאפיין של מחלות ניווניות כמו אלצהיימר ופרקינסון.`;

const QC_EN = `Protein quality control and degradation pathways:

• Chaperones (such as Hsp70 and Hsp90) help new proteins fold and try to refold damaged ones.
• A protein that cannot be repaired is ubiquitinated and degraded by the proteasome. Misfolded proteins in the ER are retro-translocated to the cytosol and degraded the same way (ERAD).

Proteasome vs. lysosome:
• Proteasome — a membrane-less protein complex in the cytosol and nucleus; degrades individual ubiquitin-tagged proteins; ATP-dependent, fast and selective.
• Lysosome — a membrane-bound organelle with hydrolytic enzymes active at acidic pH (~4.5–5); degrades membrane proteins and material taken up by endocytosis, as well as aggregates and whole organelles through autophagy.

When these systems fail, protein aggregates accumulate — a hallmark of neurodegenerative diseases such as Alzheimer's and Parkinson's.`;

const ALIGN_HE = `יישור רצפים (Sequence alignment) הוא שיטה להשוואת רצפי DNA, RNA או חלבון כדי לזהות אזורים דומים. דמיון ברצף מרמז לרוב על מוצא אבולוציוני משותף (הומולוגיה) ועל תפקוד דומה.

• יישור גלובלי (Needleman–Wunsch) — משווה רצפים לכל אורכם
• יישור מקומי (Smith–Waterman) — מאתר את המקטע הדומה ביותר; BLAST הוא גרסה מהירה ומקורבת שלו לחיפוש במאגרי רצפים
• מטריצות ניקוד (כמו BLOSUM62 ו-PAM) וקנסות על פערים (gaps) קובעים את ציון היישור
• יישור מרובה רצפים (MSA) הוא הבסיס לבניית עצים פילוגנטיים`;

const ALIGN_EN = `Sequence alignment compares DNA, RNA or protein sequences to find regions of similarity. Sequence similarity usually implies shared evolutionary origin (homology) and often similar function.

• Global alignment (Needleman–Wunsch) — compares sequences over their full length
• Local alignment (Smith–Waterman) — finds the most similar segment; BLAST is a fast heuristic version used to search sequence databases
• Scoring matrices (such as BLOSUM62 and PAM) and gap penalties determine the alignment score
• Multiple sequence alignment (MSA) is the basis for building phylogenetic trees`;

const REVIEWED_SUBTOPICS: SubtopicFix[] = [
  { id: "cmq0ts5q9000s8s4mbxqp22fl", contentHe: ORGANELLES_HE, contentEn: ORGANELLES_EN },
  { id: "cmq0ts5q9000t8s4mm3v45c8j", nameHe: "מחזור התא ומיטוזה", nameEn: "The Cell Cycle and Mitosis", contentHe: CELL_CYCLE_HE, contentEn: CELL_CYCLE_EN, relatedProcessSlug: "mitosis", hidden: false },
  { id: "cmq3ig4as000004l2d2aszt82", contentHe: REGULATION_HE, contentEn: REGULATION_EN, relatedProcessSlug: null },
  { id: "cmq6nl6eu000004jr4qri9jh2", nameHe: "מערכת האוביקוויטין-פרוטאזום", nameEn: "The Ubiquitin–Proteasome System", contentHe: UPS_HE, contentEn: UPS_EN, relatedProcessSlug: "protein-degradation-and-ubiquitin-proteasome-system-animation-1780958699914" },
  { id: "cmq508lsi000304l5a0q3757b", nameHe: "בקרת איכות חלבונים: פרוטאזום מול ליזוזום", nameEn: "Protein Quality Control: Proteasome vs. Lysosome", contentHe: QC_HE, contentEn: QC_EN },
  { id: "cmq4zog6i000104jsyp9z447s", nameHe: "יישור רצפים", nameEn: "Sequence Alignment", contentHe: ALIGN_HE, contentEn: ALIGN_EN },
  // DNA structure: text already correct; reviewed as-is
  { id: "cmq0ts51u00098s4mtwy4vd4k" },
];

const HIDE_SUBTOPICS = [
  // cell biology: duplicate cell-cycle-regulation + 7 overlapping protein-degradation subtopics
  "cmq2vfwyo000604l5rv5dd839",
  "cmq3up6fn000105kvwrbvye1f", "cmq3upcxw000405kvou6omyet", "cmq3upfqf000505kv55ku727z",
  "cmq6njqdw000904l8cpz2x3me", "cmq6noxqz000004l2tf968wo4", "cmq6nozhs000604l2v0dkyexr",
  "cmq6np136000b04l2x3c15joy", "cmq6np37o000h04l2ndxyomhd",
  // genetics: duplicate non-mendelian-inheritance slug, duplicate genomic imprinting
  "cmq6nn216000104jr9wrm1i2l", "cmq6ndf3e000504jr1quso0tw",
];

// Placeholder / duplicate / factually wrong animations
const DELETE_PROCESS_SLUGS = [
  "hormones-endocrine-animation-1780822461773",        // all 6 steps placeholder text
  "cell-cycle-regulation-animation-1780820341899",     // placeholder text, G0 before G1, no cyclins/CDK
  "ubiquitination-process-animation",                   // duplicate (x2) of the 7-step UPS animation
  "ubiquitination-process-1781010547596-animation",
  "cellular-protein-quality-control-1781010539880-animation", // generic placeholder steps
  "protein-degradation-mechanisms-animation",           // "the enzyme protease" as a separate pathway
  "riboswitches-animation",                             // duplicate of riboswitches-animation-1780833787341
  "gene-expression-animation",                          // calls transcription "RNA replication"
];

type Step = { titleHe: string; titleEn: string; descHe: string; descEn: string };

const MITOSIS_STEPS: Step[] = [
  { titleHe: "פרופאזה", titleEn: "Prophase",
    descHe: "הכרומטין מתעבה לכרומוזומים נראים, וכל כרומוזום בנוי משתי כרומטידות אחיות המחוברות בצנטרומר. הגרעינון נעלם. שני הצנטרוזומים (שהוכפלו באינטרפאזה) מתרחקים זה מזה ומתחילים לבנות את הציר המיטוטי ממיקרוטובולים.",
    descEn: "Chromatin condenses into visible chromosomes, each made of two sister chromatids joined at the centromere. The nucleolus disappears. The two centrosomes (duplicated in interphase) move apart and start building the mitotic spindle from microtubules." },
  { titleHe: "פרומטאפאזה", titleEn: "Prometaphase",
    descHe: "מעטפת הגרעין מתפרקת. על הצנטרומר של כל כרומטידה נבנה קינטוכור, ומיקרוטובולים של הציר נקשרים אליו. הכרומוזומים מתחילים לנוע לעבר מרכז התא.",
    descEn: "The nuclear envelope breaks down. A kinetochore assembles at the centromere of each chromatid and spindle microtubules attach to it. Chromosomes begin moving toward the middle of the cell." },
  { titleHe: "מטאפאזה", titleEn: "Metaphase",
    descHe: "הכרומוזומים מסתדרים בשורה על לוח המטאפאזה (מישור המשווה של התא). הקינטוכורים של כל זוג כרומטידות אחיות מחוברים למיקרוטובולים משני הקטבים. נקודת בקרת הציר מעכבת את המעבר לאנאפאזה עד שכל הקינטוכורים מחוברים כראוי.",
    descEn: "Chromosomes line up on the metaphase plate (the cell's equator). The kinetochores of each sister-chromatid pair are attached to microtubules from opposite poles. The spindle assembly checkpoint holds off anaphase until every kinetochore is properly attached." },
  { titleHe: "אנאפאזה", titleEn: "Anaphase",
    descHe: "האנזים ספראז מפרק את הקוהזין שמחזיק את הכרומטידות האחיות יחד. הכרומטידות נפרדות — ומעכשיו כל אחת נחשבת לכרומוזום עצמאי. מיקרוטובולי הקינטוכור מתקצרים ומושכים אותן לקטבים מנוגדים, והתא מתארך.",
    descEn: "The enzyme separase cleaves cohesin, which holds sister chromatids together. The chromatids separate — each is now an independent chromosome. Kinetochore microtubules shorten and pull them to opposite poles while the cell elongates." },
  { titleHe: "טלופאזה", titleEn: "Telophase",
    descHe: "בכל קוטב מתקבצת מערכת כרומוזומים מלאה וזהה. מעטפת גרעין חדשה נבנית סביב כל מערכת, הכרומוזומים מתרופפים חזרה לכרומטין והגרעינונים מופיעים מחדש. הציר המיטוטי מתפרק.",
    descEn: "A complete, identical set of chromosomes gathers at each pole. A new nuclear envelope forms around each set, the chromosomes decondense back into chromatin and nucleoli reappear. The spindle disassembles." },
  { titleHe: "ציטוקינזה", titleEn: "Cytokinesis",
    descHe: "חלוקת הציטופלזמה. בתא של בעל חיים טבעת של אקטין ומיוזין מתכווצת ויוצרת חריץ חלוקה, שמפצל את התא לשני תאי בת דיפלואידיים וזהים גנטית לתא האם. (בתא צמחי נבנית במקום זאת לוחית תאית.)",
    descEn: "The cytoplasm divides. In animal cells a contractile ring of actin and myosin pinches the cell along a cleavage furrow into two diploid daughter cells, genetically identical to the parent. (Plant cells build a cell plate instead.)" },
];

const DNA_REPLICATION_STEPS: Step[] = [
  { titleHe: "פתיחת הסליל ומזלג השכפול", titleEn: "Unwinding and the replication fork",
    descHe: "בנקודות ראשית השכפול (origins) האנזים הליקאז פותח את הסליל הכפול על ידי שבירת קשרי המימן בין זוגות הבסיסים, ונוצר מזלג שכפול. חלבוני SSB מייצבים את הגדילים הבודדים, וטופואיזומראז שלפני המזלג משחרר את מתח הפיתול.",
    descEn: "At origins of replication, helicase unwinds the double helix by breaking the hydrogen bonds between base pairs, forming a replication fork. Single-strand binding proteins (SSB) stabilize the separated strands, and topoisomerase ahead of the fork relieves the twisting strain." },
  { titleHe: "פריימאז מניח פריימר", titleEn: "Primase lays down a primer",
    descHe: "DNA פולימראז אינו יכול להתחיל שרשרת חדשה — הוא יודע רק להאריך קצה 3' קיים. האנזים פריימאז (RNA פולימראז ייעודי) מסנתז פריימר RNA קצר, באורך של כ-10 נוקלאוטידים, שמספק את קצה ה-3' הראשון.",
    descEn: "DNA polymerase cannot start a new chain — it can only extend an existing 3' end. Primase (a specialized RNA polymerase) makes a short RNA primer, about 10 nucleotides long, that provides the first 3' end." },
  { titleHe: "הגדיל המוביל", titleEn: "The leading strand",
    descHe: "DNA פולימראז III מאריך את הפריימר ברציפות בכיוון 5'→3', באותו כיוון שבו מתקדם מזלג השכפול. בגדיל המוביל מספיק פריימר אחד.",
    descEn: "DNA polymerase III extends the primer continuously in the 5'→3' direction, the same direction the fork is moving. The leading strand needs only a single primer." },
  { titleHe: "הגדיל המפגר ומקטעי אוקזאקי", titleEn: "The lagging strand and Okazaki fragments",
    descHe: "גדיל התבנית השני מכוון בכיוון ההפוך, ולכן הסינתזה עליו מתבצעת הרחק מהמזלג, במקטעים קצרים — מקטעי אוקזאקי (100–200 נוקלאוטידים באאוקריוטים, 1,000–2,000 בחיידקים). כל מקטע מתחיל בפריימר RNA חדש.",
    descEn: "The other template strand runs the opposite way, so synthesis on it proceeds away from the fork in short pieces — Okazaki fragments (100–200 nucleotides in eukaryotes, 1,000–2,000 in bacteria). Each fragment starts from a new RNA primer." },
  { titleHe: "החלפת הפריימרים ב-DNA", titleEn: "Replacing the primers with DNA",
    descHe: "בחיידקים, DNA פולימראז I מסיר את פריימרי ה-RNA (בפעילות אקסונוקלאזית 5'→3') וממלא את הרווח ב-DNA. באאוקריוטים האנזימים RNase H ו-FEN1 מסירים את הפריימרים, ו-DNA פולימראז δ ממלא את הרווח.",
    descEn: "In bacteria, DNA polymerase I removes the RNA primers (5'→3' exonuclease activity) and fills the gap with DNA. In eukaryotes RNase H and FEN1 remove the primers and DNA polymerase δ fills in." },
  { titleHe: "ליגאז ושכפול חצי-שמרני", titleEn: "Ligase and semi-conservative replication",
    descHe: "DNA ליגאז סוגר את החריץ האחרון בשלד הסוכר-פוספט (קשר פוספודיאסטרי) בין מקטעי אוקזאקי. התוצאה: שתי מולקולות DNA זהות, ובכל אחת גדיל ישן אחד וגדיל חדש אחד — שכפול חצי-שמרני.",
    descEn: "DNA ligase seals the remaining nick in the sugar-phosphate backbone (a phosphodiester bond) between Okazaki fragments. The result: two identical DNA molecules, each with one old and one new strand — semi-conservative replication." },
];

const PROCESS_FIXES: { slug: string; descHe: string; descEn: string; steps: Step[]; lottie: string }[] = [
  { slug: "mitosis", lottie: "mitosis", steps: MITOSIS_STEPS,
    descHe: "חלוקת הגרעין בתא סומטי, שבסופה (יחד עם הציטוקינזה) נוצרים שני תאי בת דיפלואידיים זהים גנטית",
    descEn: "Nuclear division in a somatic cell that, together with cytokinesis, yields two genetically identical diploid daughter cells" },
  { slug: "dna-replication", lottie: "dna-replication", steps: DNA_REPLICATION_STEPS,
    descHe: "התהליך שבו מולקולת DNA משוכפלת באופן חצי-שמרני לפני חלוקת התא",
    descEn: "How a DNA molecule is copied semi-conservatively before cell division" },
];

const RA_ABSTRACT_HE = "דלקת מפרקים שגרונתית (RA) היא מחלה דלקתית מערכתית כרונית, הפוגעת בעיקר במפרקים הקטנים של כפות הידיים והרגליים ומקצרת את תוחלת החיים ב-3–10 שנים בממוצע. RA היא הפרעה רב-גנית עם מרכיב גנטי משמעותי ותורשתיות מוערכת של כ-60%. מחקרי אסוציאציה כלל-גנומיים (GWAS) רחבי היקף ומטא-אנליזות חשפו וריאנטים נפוצים באוכלוסייה הקשורים למחלה, שעשויים לתרום במצטבר לפתוגנזה של RA. הסקירה מציגה את הווריאנטים הגנטיים המשמעותיים ביותר שנקשרו עד כה לרגישות ל-RA, תוך התמקדות בתרומת גני HLA מסוג II בקבוצות אתניות שונות. נדונים גם היישומים האפשריים של פרמקוגנומיקה בטיפול ב-RA, באמצעות זיהוי פולימורפיזמים הקשורים לשונות בתגובה לטיפול או ברעילותו. שימוש בווריאנטים גנטיים להכוונת הטיפול עשוי לא רק להפחית עלויות למערכת הבריאות הבריטית (NHS), אלא גם לשפר משמעותית את חוויית המטופלים ואת איכות חייהם.";
const RA_FINDINGS = [
  "דלקת מפרקים שגרונתית (RA) היא מחלה דלקתית מערכתית כרונית עם תורשתיות מוערכת של כ-60%",
  "גני HLA מסוג II הם הגורם הגנטי המשמעותי ביותר לרגישות ל-RA, עם הבדלים בין קבוצות אתניות",
  "פרמקוגנומיקה עשויה לאפשר התאמה אישית של הטיפול לפי פולימורפיזמים הקשורים לתגובה לטיפול ולרעילות",
];

/* ───────────────────────────── helpers ───────────────────────────── */

const TABLES = ["Topic", "Subtopic", "Process", "ProcessStep", "Article"] as const;

async function snapshot() {
  const out: Record<string, Row[]> = {};
  for (const t of TABLES) out[t] = (await db.execute(`SELECT * FROM "${t}"`)).rows;
  return out;
}

async function addColumns() {
  for (const [table, col] of [["Subtopic", "updatedAt"], ["Subtopic", "reviewedAt"], ["Process", "updatedAt"], ["Process", "reviewedAt"]]) {
    try {
      await db.execute(`ALTER TABLE "${table}" ADD COLUMN "${col}" DATETIME`);
      console.log(`+ column ${table}.${col}`);
    } catch (e) {
      if (!(e instanceof Error && /duplicate column/i.test(e.message))) throw e;
    }
  }
}

// In RTL text a prime after a digit renders on the wrong side ("3'" shows as "'3")
// and "5'→3'" scrambles. Wrap such runs in Unicode isolates (LRI … PDI).
export function fixBidi(he: string) {
  return he.replace(/\u2066?(\d'(?:\s*[→←]\s*\d')?)\u2069?/gu, "\u2066$1\u2069");
}

function decodeEntities(s: string) {
  return s.replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"');
}

/* ───────────────────────────── apply ───────────────────────────── */

async function apply(dryRun: boolean) {
  await addColumns();
  const before = await snapshot();
  const created: { ProcessStep: string[] } = { ProcessStep: [] };
  const stmts: InStatement[] = [];

  for (const [slug, [he, en]] of Object.entries(TOPIC_DESC)) {
    stmts.push({ sql: `UPDATE "Topic" SET "descHe"=?, "descEn"=? WHERE "slug"=?`, args: [he, en, slug] });
  }
  for (const [slug, ids] of Object.entries(REACTOME_PINS)) {
    stmts.push({ sql: `UPDATE "Topic" SET "reactomePathwayIds"=? WHERE "slug"=?`, args: [JSON.stringify(ids), slug] });
  }

  for (const s of REVIEWED_SUBTOPICS) {
    const sets: string[] = [`"updatedAt"=?`, `"reviewedAt"=?`];
    const args: (string | number | null)[] = [NOW, NOW];
    for (const k of ["nameHe", "nameEn", "contentHe", "contentEn", "relatedProcessSlug"] as const) {
      if (s[k] !== undefined) { sets.push(`"${k}"=?`); args.push(k === "contentHe" ? fixBidi(s[k] as string) : s[k] ?? null); }
    }
    if (s.contentHe === undefined) {
      const cur = before.Subtopic.find((r) => r.id === s.id);
      if (cur) { sets.push(`"contentHe"=?`); args.push(fixBidi(String(cur.contentHe))); }
    }
    if (s.hidden !== undefined) { sets.push(`"hidden"=?`); args.push(s.hidden ? 1 : 0); }
    stmts.push({ sql: `UPDATE "Subtopic" SET ${sets.join(", ")} WHERE "id"=?`, args: [...args, s.id] });
  }
  for (const id of HIDE_SUBTOPICS) {
    stmts.push({ sql: `UPDATE "Subtopic" SET "hidden"=1, "updatedAt"=? WHERE "id"=?`, args: [NOW, id] });
  }

  // Delete placeholder/duplicate animations and unlink subtopics pointing at them
  for (const slug of DELETE_PROCESS_SLUGS) {
    stmts.push({ sql: `DELETE FROM "ProcessStep" WHERE "processId" IN (SELECT "id" FROM "Process" WHERE "slug"=?)`, args: [slug] });
    stmts.push({ sql: `DELETE FROM "Process" WHERE "slug"=?`, args: [slug] });
    stmts.push({ sql: `UPDATE "Subtopic" SET "relatedProcessSlug"=NULL WHERE "relatedProcessSlug"=?`, args: [slug] });
  }
  // molecular-recognition animation was filed under genetics, so its molecular-biology subtopic link never rendered
  stmts.push({
    sql: `UPDATE "Process" SET "topicId"=(SELECT "id" FROM "Topic" WHERE "slug"='molecular-biology') WHERE "slug"='molecular-recognition-animation'`,
    args: [],
  });

  // Rewrite mitosis + DNA replication (text reviewed; visuals are Lottie scenes)
  for (const p of PROCESS_FIXES) {
    const proc = before.Process.find((r) => r.slug === p.slug);
    if (!proc) throw new Error(`process ${p.slug} not found`);
    stmts.push({ sql: `UPDATE "Process" SET "descHe"=?, "descEn"=?, "updatedAt"=?, "reviewedAt"=? WHERE "id"=?`, args: [p.descHe, p.descEn, NOW, NOW, proc.id as string] });
    stmts.push({ sql: `DELETE FROM "ProcessStep" WHERE "processId"=?`, args: [proc.id as string] });
    p.steps.forEach((s, i) => {
      const id = cuid();
      created.ProcessStep.push(id);
      stmts.push({
        sql: `INSERT INTO "ProcessStep" ("id","processId","order","titleHe","titleEn","descHe","descEn","svgData") VALUES (?,?,?,?,?,?,?,?)`,
        args: [id, proc.id as string, i + 1, s.titleHe, s.titleEn, fixBidi(s.descHe), s.descEn, JSON.stringify({ elements: [], lottie: p.lottie })],
      });
    });
  }

  // Articles: RA translation + publication year (PubMed 32638005: Rheumatology 2020 Oct 1;59(10):2661-2670)
  stmts.push({
    sql: `UPDATE "Article" SET "year"=2020, "abstractHe"=?, "keyFindings"=?, "abstract"=? WHERE "pubmedId"='32638005'`,
    args: [RA_ABSTRACT_HE, JSON.stringify(RA_FINDINGS), decodeEntities(String(before.Article.find((a) => a.pubmedId === "32638005")?.abstract ?? ""))],
  });
  for (const a of before.Article) {
    if (a.pubmedId === "32638005") continue;
    stmts.push({ sql: `UPDATE "Article" SET "abstract"=?, "title"=? WHERE "id"=?`, args: [decodeEntities(String(a.abstract)), decodeEntities(String(a.title)), a.id as string] });
  }

  console.log(`${stmts.length} statements prepared`);
  if (dryRun) { stmts.forEach((s) => console.log(typeof s === "string" ? s : `${s.sql} ${JSON.stringify(s.args ?? []).slice(0, 120)}`)); return; }

  fs.mkdirSync(".backups", { recursive: true });
  const file = path.join(".backups", `content-fix-${NOW.replace(/[:.]/g, "-")}.json`);
  fs.writeFileSync(file, JSON.stringify({ before, created }, null, 1));
  console.log(`backup → ${file}`);

  await db.batch(stmts, "write");
  console.log("✅ applied");
}

/* ───────────────────────────── rollback ───────────────────────────── */

async function rollback(file: string) {
  const { before, created } = JSON.parse(fs.readFileSync(file, "utf8")) as { before: Record<string, Row[]>; created: { ProcessStep: string[] } };
  const stmts: InStatement[] = [];
  for (const id of created.ProcessStep) stmts.push({ sql: `DELETE FROM "ProcessStep" WHERE "id"=?`, args: [id] });
  for (const t of TABLES) {
    for (const row of before[t]) {
      const cols = Object.keys(row);
      stmts.push({
        sql: `INSERT OR REPLACE INTO "${t}" (${cols.map((c) => `"${c}"`).join(",")}) VALUES (${cols.map(() => "?").join(",")})`,
        args: cols.map((c) => row[c] as string | number | null),
      });
    }
  }
  // Parents before children
  stmts.sort((a, b) => order(a) - order(b));
  await db.batch(stmts, "write");
  console.log(`✅ rolled back from ${file}`);
}
function order(s: InStatement) {
  const sql = typeof s === "string" ? s : s.sql;
  if (sql.startsWith("DELETE")) return 0;
  return ["Topic", "Process", "Subtopic", "ProcessStep", "Article"].findIndex((t) => sql.includes(`INTO "${t}"`)) + 1;
}

const args = process.argv.slice(2);
(args[0] === "--rollback" ? rollback(args[1]) : apply(args.includes("--dry-run"))).catch((e) => {
  console.error(e);
  process.exit(1);
});
