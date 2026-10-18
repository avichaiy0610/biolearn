/**
 * Per-university course tracks (October 2026). Built from each university's
 * official catalog (sources in content/universities.ts); only biology courses
 * are mapped. Units are taken from the general track's current courses and the
 * topics' visible subtopics, so admin edits to the general track carry over.
 *
 *   npx tsx scripts/university-tracks-2026-10.ts --schema         # step 1: add Course.university / Course.kind (safe for the old site)
 *   npx tsx scripts/university-tracks-2026-10.ts --dry-run        # print what step 2 would do
 *   npx tsx scripts/university-tracks-2026-10.ts                  # step 2 (after the new code is live): general-track updates + university tracks
 *   npx tsx scripts/university-tracks-2026-10.ts --rollback .backups/university-tracks-<ts>.json
 */
import "dotenv/config";
import { createClient, type InStatement } from "@libsql/client";
import fs from "fs";
import path from "path";

const db = createClient({ url: process.env.DATABASE_URL ?? "", authToken: process.env.DATABASE_AUTH_TOKEN });
const NOW = new Date().toISOString();

type Unit = { kind: "process"; topic: string; slug: string } | { kind: "subtopic"; topic: string; id: string };
type Kind = "required" | "choice" | "elective";
type Sem = "A" | "B" | "Y";
type NewCourse = { slug: string; nameHe: string; nameEn: string; year: number; semester: Sem; kind: Kind; descHe: string; descEn: string; units: Unit[] };

const key = (u: Unit) => (u.kind === "process" ? `p:${u.slug}` : `s:${u.id}`);
const dedupe = (units: Unit[]) => units.filter((u, i) => units.findIndex((x) => key(x) === key(u)) === i);

async function schema() {
  const cols = (await db.execute(`PRAGMA table_info(Course)`)).rows.map((r) => String(r.name));
  const stmts: string[] = [];
  if (!cols.includes("university")) stmts.push(`ALTER TABLE Course ADD COLUMN university TEXT NOT NULL DEFAULT 'general'`);
  if (!cols.includes("kind")) stmts.push(`ALTER TABLE Course ADD COLUMN kind TEXT NOT NULL DEFAULT 'required'`);
  for (const s of stmts) { console.log(s); await db.execute(s); }
  console.log(stmts.length ? "schema updated" : "schema already up to date");
}

async function build() {
  const courses = (await db.execute(`SELECT slug, units, year, semester, "updatedAt", university FROM Course`)).rows;
  const subs = (await db.execute(`SELECT s.id, s."nameEn", t.slug AS topic FROM Subtopic s JOIN Topic t ON t.id = s."topicId" WHERE s.hidden = 0`)).rows;
  const procs = (await db.execute(`SELECT p.slug, t.slug AS topic FROM Process p JOIN Topic t ON t.id = p."topicId"`)).rows;

  const G = (slug: string): Unit[] => {
    const r = courses.find((c) => c.slug === slug);
    if (!r) throw new Error(`general course missing: ${slug}`);
    return JSON.parse(String(r.units));
  };
  const T = (topic: string): Unit[] => {
    const list: Unit[] = [
      ...subs.filter((s) => s.topic === topic).map((s) => ({ kind: "subtopic" as const, topic, id: String(s.id) })),
      ...procs.filter((p) => p.topic === topic && !String(p.slug).startsWith("lncrna") && p.slug !== "gencode-lncrna-discovery").map((p) => ({ kind: "process" as const, topic, slug: String(p.slug) })),
    ];
    if (!list.length) throw new Error(`topic has no visible units: ${topic}`);
    return list;
  };
  const S = (topic: string, nameEn: string): Unit => {
    const s = subs.find((x) => x.topic === topic && x.nameEn === nameEn);
    if (!s) throw new Error(`subtopic not found: ${topic} / ${nameEn}`);
    return { kind: "subtopic", topic, id: String(s.id) };
  };
  const P = (topic: string, slug: string): Unit => {
    if (!procs.some((p) => p.topic === topic && p.slug === slug)) throw new Error(`process not found: ${topic} / ${slug}`);
    return { kind: "process", topic, slug };
  };
  const procLike = (topic: string, prefix: string): Unit => {
    const p = procs.find((x) => x.topic === topic && String(x.slug).startsWith(prefix));
    if (!p) throw new Error(`process not found: ${topic} / ${prefix}*`);
    return { kind: "process", topic, slug: String(p.slug) };
  };

  // Building blocks.
  const CELL_A = G("cell-biology-a"), CELL_B = G("cell-biology-b"), CELL = [...CELL_A, ...CELL_B];
  const GEN = G("genetics"), MOL = G("molecular-biology");
  const BIO_A = G("biochemistry-a"), BIO_B = G("biochemistry-b"), BIO = [...BIO_A, ...BIO_B];
  const MICRO = G("microbiology"), PHYS = G("physiology"), IMM = G("immunology"), NEURO = G("neurobiology"), ENDO = G("endocrinology");
  const ECO = T("ecology"), EVO = T("evolutionary-biology"), DEV = T("developmental-biology"), BIOINF = T("bioinformatics");
  const PLANT = [...T("plant-physiology"), P("biochemistry", "photosynthesis")];
  const VIRO = [S("microbiology", "Viruses and Viral Life Cycle"), P("microbiology", "viral-life-cycle")];
  const GENENG = [S("molecular-biology", "PCR — Polymerase Chain Reaction"), P("molecular-biology", "pcr")];
  const GENEXP = [S("molecular-biology", "Gene Expression"), P("molecular-biology", "transcription"), P("molecular-biology", "lac-operon"), S("molecular-biology", "Riboswitches"), procLike("molecular-biology", "riboswitches")];
  const MOL_ADV = [...GENEXP, P("molecular-biology", "dna-mismatch-repair")];
  const PHYS_INTRO = [S("physiology", "Cardiovascular System"), procLike("physiology", "cardiovascular"), S("physiology", "Action Potential"), P("physiology", "action-potential")];
  const ORGANISM = [...EVO, ...PHYS_INTRO, S("plant-physiology", "Transpiration")];
  const CELL_ADV = [S("cell-biology", "Protein Quality Control: Proteasome vs. Lysosome"), S("cell-biology", "The Ubiquitin–Proteasome System"), procLike("cell-biology", "protein-degradation"), S("cell-biology", "Cytoskeleton and Cell Movement"), P("cell-biology", "secretory-pathway")];
  const INTRO_GENMOL = [S("genetics", "Mendelian Genetics"), P("genetics", "meiosis"), S("molecular-biology", "DNA Structure"), S("molecular-biology", "Central Dogma")];
  const METAB = [S("biochemistry", "ATP and Energy Metabolism"), P("biochemistry", "glycolysis"), P("biochemistry", "cellular-respiration"), ...BIO_B];
  const NONE: Unit[] = [];

  const c = (slug: string, nameHe: string, nameEn: string, year: number, semester: Sem, units: Unit[], descHe: string, descEn: string, kind: Kind = "required"): NewCourse =>
    ({ slug, nameHe, nameEn, year, semester, kind, descHe, descEn, units: dedupe(units) });

  // General track: new courses (the four fields every catalog teaches that it lacked).
  const generalNew: NewCourse[] = [
    c("ecology-evolution", "מבוא לאקולוגיה ואבולוציה", "Introduction to Ecology and Evolution", 1, "B", [...EVO, ...ECO],
      "ברירה טבעית ואבולוציה, ואקולוגיה של אוכלוסיות.", "Natural selection and evolution, and population ecology."),
    c("plant-physiology", "פיזיולוגיה של הצמח", "Plant Physiology", 2, "B", PLANT,
      "פוטוסינתזה, טרנספירציה, ספיגת חומרים מזינים והורמוני צמחים.", "Photosynthesis, transpiration, nutrient uptake and plant hormones."),
    c("bioinformatics", "מבוא לביואינפורמטיקה", "Introduction to Bioinformatics", 3, "A", BIOINF,
      "יישור רצפים ושיטות חישוביות לניתוח DNA וחלבונים.", "Sequence alignment and computational analysis of DNA and proteins."),
    c("developmental-biology", "ביולוגיה התפתחותית", "Developmental Biology", 3, "B", DEV,
      "התפתחות העובר: מביצית מופרית לאורגניזם.", "Embryonic development: from fertilized egg to organism."),
  ];
  // General track: genetics moves to year 2 (TAU, BIU, BGU and Haifa teach it there).
  const generalMoves = [{ slug: "genetics", year: 2, semester: "A" }];

  const D = {
    cellA: ["מבנה התא האאוקריוטי, אברונים, קרומים ותעבורה.", "The eukaryotic cell: organelles, membranes and transport."],
    cell: ["מבנה התא ותפקודו: אברונים, קרומים, מחזור התא ואיתות.", "Cell structure and function: organelles, membranes, the cell cycle and signaling."],
    cellB: ["מחזור התא ובקרתו, איתות בין תאים, אפופטוזיס ופירוק חלבונים.", "The cell cycle and its control, signaling, apoptosis and protein degradation."],
    cellAdv: ["בקרת איכות של חלבונים, מערכת יוביקוויטין-פרוטאזום, שלד התא והמסלול ההפרשתי.", "Protein quality control, the ubiquitin–proteasome system, the cytoskeleton and the secretory pathway."],
    gen: ["תורשה מנדלית ולא-מנדלית, מיוזה, מוטציות והחתמה גנומית.", "Mendelian and non-Mendelian inheritance, meiosis, mutations and imprinting."],
    mol: ["מבנה ה-DNA, שכפול, שעתוק, תרגום ובקרת ביטוי גנים.", "DNA structure, replication, transcription, translation and gene regulation."],
    molAdv: ["בקרת ביטוי גנים, אופרון lac, ריבוסוויצ'ים ותיקון DNA.", "Gene regulation, the lac operon, riboswitches and DNA repair."],
    genEng: ["כלים מולקולריים: PCR ושיטות הנדסה גנטית.", "Molecular tools: PCR and genetic-engineering methods."],
    bioA: ["חלבונים ואנזימים, קינטיקה אנזימטית, ATP ומטבוליזם תאי.", "Proteins and enzymes, enzyme kinetics, ATP and cellular metabolism."],
    bioB: ["ליפידים, חומצות גרעין, ובקרה ואינטגרציה של המטבוליזם.", "Lipids, nucleic acids, and regulation and integration of metabolism."],
    bio: ["חלבונים, אנזימים ומסלולי המטבוליזם המרכזיים.", "Proteins, enzymes and the central metabolic pathways."],
    metab: ["גליקוליזה, נשימה תאית, גלוקונאוגנזה, פירוק חומצות שומן ומחזור השתנן.", "Glycolysis, respiration, gluconeogenesis, fatty-acid oxidation and the urea cycle."],
    micro: ["מבנה וגדילה של חיידקים, וירוסים ומחזורי חיים ויראליים.", "Bacterial structure and growth, viruses and viral life cycles."],
    viro: ["מבנה הנגיף ומחזור החיים הוויראלי.", "Virus structure and the viral life cycle."],
    phys: ["פוטנציאל פעולה, סינפסה, כיווץ שריר, לב וכלי דם, נפרון ובקרת סוכר.", "Action potential, synapse, muscle, cardiovascular system, nephron and glucose control."],
    physIntro: ["מערכת הלב וכלי הדם ופוטנציאל הפעולה — מבוא לפיזיולוגיה של החי.", "The cardiovascular system and the action potential — an introduction to animal physiology."],
    imm: ["חסינות מולדת ונרכשת.", "Innate and adaptive immunity."],
    neuro: ["פוטנציאל פעולה, העברה סינפטית והפעלת שריר.", "The action potential, synaptic transmission and muscle activation."],
    endo: ["הורמונים, קולטנים מצומדי חלבון G ובקרת רמת הסוכר בדם.", "Hormones, G-protein-coupled receptors and blood-glucose control."],
    eco: ["אקולוגיה של אוכלוסיות.", "Population ecology."],
    evo: ["ברירה טבעית ומנגנוני האבולוציה.", "Natural selection and the mechanisms of evolution."],
    ecoEvo: ["אבולוציה, ברירה טבעית ואקולוגיה של אוכלוסיות.", "Evolution, natural selection and population ecology."],
    organism: ["מגוון האורגניזמים, אבולוציה ופיזיולוגיה בסיסית של בעלי חיים וצמחים.", "Diversity of organisms, evolution and basic animal and plant physiology."],
    plant: ["פוטוסינתזה, טרנספירציה, ספיגת חומרים מזינים והורמוני צמחים.", "Photosynthesis, transpiration, nutrient uptake and plant hormones."],
    dev: ["התפתחות העובר: מביצית מופרית לאורגניזם.", "Embryonic development: from fertilized egg to organism."],
    bioinf: ["יישור רצפים ושיטות חישוביות לניתוח DNA וחלבונים.", "Sequence alignment and computational analysis of DNA and proteins."],
    soon: ["החומר לקורס הזה עוד בכתיבה.", "Material for this course is still being written."],
  } as const;
  type DK = keyof typeof D;
  const u = (uni: string) => (id: string, nameHe: string, nameEn: string, year: number, sem: Sem, units: Unit[], d: DK, kind: Kind = "required") =>
    c(`${uni}-${id}`, nameHe, nameEn, year, sem, units, D[d][0], D[d][1], kind);

  const huji = u("huji"), tau = u("tau"), technion = u("technion"), bgu = u("bgu"), biu = u("biu"), haifa = u("haifa");
  const tracks: NewCourse[] = [
    // Hebrew University — Life Sciences single major (4010), 2025 catalog.
    huji("organism", "מבוא לביולוגיה של האורגניזם", "Introduction to Organismal Biology", 1, "A", ORGANISM, "organism"),
    huji("cell-intro", "מבוא לביולוגיה של התא", "Introduction to Cell Biology", 1, "A", CELL, "cell"),
    huji("genetics-intro", "מבוא לגנטיקה", "Introduction to Genetics", 1, "B", GEN, "gen"),
    huji("ecology-intro", "מבוא לאקולוגיה", "Introduction to Ecology", 2, "A", ECO, "eco"),
    huji("biochem-cell", "ביוכימיה של התא", "Biochemistry of the Cell", 2, "A", BIO, "bio"),
    huji("plant-intro", "מבוא למדעי הצמח", "Introduction to Plant Sciences", 2, "A", PLANT, "plant"),
    huji("physiology-intro", "מבוא לפיסיולוגיה", "Introduction to Physiology", 2, "A", PHYS, "phys"),
    huji("micro-intro", "מבוא למיקרוביולוגיה", "Introduction to Microbiology", 2, "A", MICRO, "micro"),
    huji("molecular", "ביולוגיה מולקולרית", "Molecular Biology", 2, "B", MOL, "mol"),
    huji("evolution-intro", "מבוא לאבולוציה", "Introduction to Evolution", 2, "B", EVO, "evo"),
    huji("cell-adv", "ביולוגיה של התא מורחב", "Cell Biology (advanced)", 3, "A", [...CELL_B, ...CELL_ADV], "cellAdv", "choice"),
    huji("developmental", "ביולוגיה התפתחותית: מתא בודד לעובר ולאורגניזם", "Developmental Biology", 3, "B", DEV, "dev", "choice"),
    huji("biochem-adv", "ביוכימיה מורחב", "Biochemistry (advanced)", 3, "B", METAB, "metab", "choice"),
    huji("micro-adv", "מיקרוביולוגיה מורחב", "Microbiology (advanced)", 3, "B", MICRO, "micro", "choice"),
    huji("neuro-phys", "פיזיולוגיה של מערכת העצבים", "Physiology of the Nervous System", 3, "B", NEURO, "neuro", "choice"),
    huji("genetics-adv", "גנטיקה מורחב", "Genetics (advanced)", 3, "B", [...GEN, ...MOL_ADV], "gen", "choice"),
    huji("plant-adv", "מדעי הצמח מורחב", "Plant Sciences (advanced)", 3, "B", PLANT, "plant", "choice"),
    huji("neuro", "נוירוביולוגיה ומדעי המח", "Neurobiology and Brain Sciences", 3, "B", NEURO, "neuro", "choice"),
    huji("ecology-adv", "אקולוגיה מורחב", "Ecology (advanced)", 3, "B", ECO, "eco", "choice"),
    huji("immunology", "אימונולוגיה", "Immunology", 3, "A", IMM, "imm", "elective"),
    huji("bioinformatics", "מבוא לביואינפורמטיקה", "Introduction to Bioinformatics", 3, "A", BIOINF, "bioinf", "elective"),

    // Tel Aviv University — Biology, single major (2020/21 handbook; year 1 per the 2025 orientation).
    tau("bio-intro-a", "מבוא לביולוגיה א'", "Introduction to Biology A", 1, "A", CELL_A, "cellA"),
    tau("bio-intro-b", "מבוא לביולוגיה ב'", "Introduction to Biology B", 1, "B", INTRO_GENMOL, "gen"),
    tau("bio-intro-c", "מבוא לביולוגיה ג'", "Introduction to Biology C", 1, "B", [...EVO, ...ECO, ...PHYS_INTRO], "organism"),
    tau("genetics", "גנטיקה כללית", "General Genetics", 2, "A", GEN, "gen"),
    tau("biochemistry", "ביוכימיה", "Biochemistry", 2, "A", BIO, "bio"),
    tau("zoology", "זואולוגיה", "Zoology", 2, "A", NONE, "soon"),
    tau("physiology", "פיזיולוגיה", "Physiology", 2, "A", PHYS, "phys"),
    tau("bioinformatics", "ביואינפורמטיקה", "Bioinformatics", 2, "A", BIOINF, "bioinf"),
    tau("cell", "ביולוגיה של התא", "Cell Biology", 2, "B", [...CELL_B, ...CELL_ADV], "cellB"),
    tau("molecular-biotech", "ביולוגיה מולקולרית וביוטכנולוגיה", "Molecular Biology and Biotechnology", 2, "B", [...MOL, ...GENENG], "mol"),
    tau("plant-molecular", "ביולוגיה מולקולרית של צמחים", "Plant Molecular Biology", 2, "B", PLANT, "plant"),
    tau("microbiology", "מיקרוביולוגיה", "Microbiology", 2, "B", MICRO, "micro"),
    tau("evolution", "אבולוציה", "Evolution", 2, "B", EVO, "evo", "choice"),
    tau("ecology", "אקולוגיה", "Ecology", 2, "B", ECO, "eco", "choice"),
    tau("neurobiology", "נוירוביולוגיה", "Neurobiology", 3, "A", NEURO, "neuro"),

    // Technion — B.Sc. Biology, general track (2025/26 catalog). Winter = A, spring = B.
    technion("biology-1", "ביולוגיה 1", "Biology 1", 1, "A", CELL_A, "cellA"),
    technion("evolution", "אבולוציה", "Evolution", 1, "B", EVO, "evo"),
    technion("genetics", "גנטיקה כללית", "General Genetics", 1, "B", GEN, "gen"),
    technion("biochem-intro", "מבוא לביוכימיה ואנזימולוגיה", "Introduction to Biochemistry and Enzymology", 1, "B", BIO_A, "bioA"),
    technion("zoology", "זואולוגיה", "Zoology", 2, "A", NONE, "soon"),
    technion("metabolic", "מסלולים מטבוליים", "Metabolic Pathways", 2, "A", METAB, "metab"),
    technion("molecular", "ביולוגיה מולקולרית", "Molecular Biology", 2, "A", MOL, "mol"),
    technion("biostatistics", "ביוסטטיסטיקה", "Biostatistics", 2, "A", NONE, "soon"),
    technion("plant-physiology", "פיזיולוגיה מולקולרית של הצמח", "Molecular Plant Physiology", 2, "B", PLANT, "plant"),
    technion("cell", "ביולוגיה של התא", "Cell Biology", 2, "B", [...CELL_B, ...CELL_ADV], "cellB"),
    technion("physiology", "פיזיולוגיה", "Physiology", 2, "B", PHYS, "phys"),
    technion("gene-expression", "בקרת הביטוי הגנטי", "Regulation of Gene Expression", 2, "B", MOL_ADV, "molAdv"),
    technion("micro-viro", "מיקרוביולוגיה ווירולוגיה", "Microbiology and Virology", 2, "B", MICRO, "micro"),
    technion("bioinformatics", "שיטות בביואינפורמטיקה למדעי החיים", "Bioinformatics Methods for Life Sciences", 3, "A", BIOINF, "bioinf"),
    technion("developmental", "ביולוגיה של ההתפתחות", "Developmental Biology", 3, "A", DEV, "dev", "choice"),
    technion("endocrinology", "אנדוקרינולוגיה", "Endocrinology", 3, "A", ENDO, "endo", "choice"),
    technion("immunology", "אימונולוגיה בסיסית", "Basic Immunology", 3, "A", IMM, "imm", "choice"),
    technion("neurobiology", "מבוא לנוירוביולוגיה", "Introduction to Neurobiology", 3, "B", NEURO, "neuro", "choice"),
    technion("ecology", "אקולוגיה", "Ecology", 3, "B", ECO, "eco", "choice"),
    technion("virology", "וירולוגיה מולקולרית", "Molecular Virology", 3, "B", VIRO, "viro", "choice"),

    // Ben-Gurion University — Life Sciences main program (2025/26 catalog).
    bgu("organisms", "ביולוגיה של יצורים חיים", "Biology of Living Organisms", 1, "A", ORGANISM, "organism"),
    bgu("cell", "התא", "The Cell", 1, "A", CELL, "cell"),
    bgu("plant-sciences", "מדעי הצמח", "Plant Sciences", 1, "B", PLANT, "plant"),
    bgu("microbiology", "מיקרוביולוגיה", "Microbiology", 2, "A", MICRO, "micro"),
    bgu("genetics", "יסודות הגנטיקה", "Foundations of Genetics", 2, "A", GEN, "gen"),
    bgu("ecology", "מבוא לאקולוגיה", "Introduction to Ecology", 2, "A", ECO, "eco"),
    bgu("molecular", "ביולוגיה מולקולרית", "Molecular Biology", 2, "A", MOL, "mol"),
    bgu("biochem-a", "ביוכימיה א'", "Biochemistry A", 2, "A", BIO_A, "bioA"),
    bgu("plant-physiology", "פיזיולוגיה של הצמח", "Plant Physiology", 2, "B", PLANT, "plant"),
    bgu("animal-physiology", "פיזיולוגיה של בעלי חיים", "Animal Physiology", 2, "B", PHYS, "phys"),
    bgu("biochem-b", "ביוכימיה ב'", "Biochemistry B", 2, "B", BIO_B, "bioB"),
    bgu("genetic-engineering", "הנדסה גנטית", "Genetic Engineering", 2, "B", GENENG, "genEng"),
    bgu("evolution", "אבולוציה", "Evolution", 3, "A", EVO, "evo"),
    bgu("bioinformatics", "מבוא לביואינפורמטיקה", "Introduction to Bioinformatics", 3, "A", BIOINF, "bioinf"),

    // Bar-Ilan University — Life Sciences single major (2026/27 timetable).
    biu("general-a", "ביולוגיה כללית א'", "General Biology A", 1, "A", CELL_A, "cellA"),
    biu("general-b", "ביולוגיה כללית ב'", "General Biology B", 1, "B", ORGANISM, "organism"),
    biu("cell", "ביולוגיה של התא", "Cell Biology", 1, "B", CELL_B, "cellB"),
    biu("biostatistics", "ביוסטטיסטיקה", "Biostatistics", 2, "A", NONE, "soon"),
    biu("biochem-a", "ביוכימיה א'", "Biochemistry A", 2, "A", BIO_A, "bioA"),
    biu("animal-physiology", "מבוא לפיזיולוגיה של החי", "Introduction to Animal Physiology", 2, "A", PHYS_INTRO, "physIntro"),
    biu("ecology", "מבוא לאקולוגיה", "Introduction to Ecology", 2, "A", ECO, "eco"),
    biu("genetics", "גנטיקה כללית", "General Genetics", 2, "A", GEN, "gen"),
    biu("biochem-b", "ביוכימיה ב'", "Biochemistry B", 2, "B", BIO_B, "bioB"),
    biu("microbiology", "מיקרוביולוגיה כללית", "General Microbiology", 2, "B", MICRO, "micro"),
    biu("virology", "מבוא לוירולוגיה", "Introduction to Virology", 2, "B", VIRO, "viro"),
    biu("immunology", "מבוא לאימונולוגיה", "Introduction to Immunology", 2, "B", IMM, "imm"),
    biu("systems-physiology", "פיזיולוגיה של מערכות", "Systems Physiology", 2, "B", PHYS, "phys"),
    biu("plant-physiology", "פיזיולוגיה של הצמח", "Plant Physiology", 2, "B", PLANT, "plant"),
    biu("molecular-a", "ביולוגיה מולקולרית והנדסה גנטית א'", "Molecular Biology and Genetic Engineering A", 2, "B", MOL, "mol"),
    biu("molecular-b", "ביולוגיה מולקולרית והנדסה גנטית ב'", "Molecular Biology and Genetic Engineering B", 3, "A", [...MOL_ADV, ...GENENG], "molAdv"),
    biu("cell-function", "התא: מבנה ותפקוד", "The Cell: Structure and Function", 3, "A", CELL_ADV, "cellAdv"),
    biu("bioinformatics", "ביואינפורמטיקה", "Bioinformatics", 3, "B", BIOINF, "bioinf"),

    // University of Haifa — Biology, single major (2024/25 catalog; it gives year, not semester).
    haifa("cell-a", "ביולוגיה של התא א'", "Cell Biology A", 1, "A", CELL_A, "cellA"),
    haifa("cell-b", "ביולוגיה של התא ב'", "Cell Biology B", 1, "B", CELL_B, "cellB"),
    haifa("ecology-evolution", "מבוא לאקולוגיה ואבולוציה", "Introduction to Ecology and Evolution", 1, "Y", [...EVO, ...ECO], "ecoEvo"),
    haifa("human-physiology", "מבוא לפיזיולוגיה ומבנה גוף האדם", "Introduction to Human Physiology and Anatomy", 1, "Y", PHYS_INTRO, "physIntro"),
    haifa("biochem-a", "ביוכימיה א'", "Biochemistry A", 2, "A", BIO_A, "bioA"),
    haifa("biochem-b", "ביוכימיה ב'", "Biochemistry B", 2, "B", BIO_B, "bioB"),
    haifa("molecular", "ביולוגיה מולקולרית", "Molecular Biology", 2, "Y", MOL, "mol"),
    haifa("genetics", "גנטיקה כללית", "General Genetics", 2, "Y", GEN, "gen"),
    haifa("microbiology", "מיקרוביולוגיה כללית", "General Microbiology", 2, "Y", MICRO, "micro"),
    haifa("immunology", "אימונולוגיה", "Immunology", 2, "Y", IMM, "imm"),
    haifa("bioinformatics", "מבוא לביואינפורמטיקה", "Introduction to Bioinformatics", 2, "Y", BIOINF, "bioinf"),
    haifa("neurobiology", "מבוא לנוירוביולוגיה", "Introduction to Neurobiology", 2, "Y", NEURO, "neuro"),
    haifa("systems-physiology", "פיזיולוגיה של מערכות א'", "Systems Physiology A", 2, "Y", PHYS, "phys", "choice"),
    haifa("plant-sciences", "מבוא למדעי הצמח", "Introduction to Plant Sciences", 2, "Y", PLANT, "plant", "choice"),
    haifa("ecology", "אקולוגיה", "Ecology", 2, "Y", ECO, "eco", "choice"),
    haifa("embryology", "התפתחות עוברית", "Embryonic Development", 3, "Y", DEV, "dev"),
    haifa("genetic-engineering", "הנדסה גנטית", "Genetic Engineering", 3, "Y", GENENG, "genEng"),
    haifa("molecular-b", "ביולוגיה מולקולרית ב'", "Molecular Biology B", 3, "Y", MOL_ADV, "molAdv"),
  ];

  return { courses, generalNew, generalMoves, tracks };
}

async function apply(dryRun: boolean) {
  const { courses, generalNew, generalMoves, tracks } = await build();
  const exists = new Set(courses.map((r) => String(r.slug)));
  const backup = { moved: [] as { slug: string; year: unknown; semester: unknown; updatedAt: unknown }[], created: [] as string[] };
  const stmts: InStatement[] = [];
  const pos = new Map<string, number>();
  for (const r of courses) {
    const k = `${r.university}:${r.year}${r.semester}`;
    pos.set(k, (pos.get(k) ?? 0) + 1);
  }

  for (const m of generalMoves) {
    const r = courses.find((x) => x.slug === m.slug);
    if (!r || (r.year === m.year && r.semester === m.semester)) continue;
    console.log(`move general/${m.slug}: ${r.year}${r.semester} → ${m.year}${m.semester}`);
    backup.moved.push({ slug: m.slug, year: r.year, semester: r.semester, updatedAt: r.updatedAt });
    stmts.push({ sql: `UPDATE Course SET year=?, semester=?, "updatedAt"=? WHERE slug=?`, args: [m.year, m.semester, NOW, m.slug] });
  }
  const insert = (uni: string, list: NewCourse[]) => {
    for (const c of list) {
      if (exists.has(c.slug)) { console.log(`${c.slug}: exists, left as is`); continue; }
      const k = `${uni}:${c.year}${c.semester}`;
      const position = pos.get(k) ?? 0;
      pos.set(k, position + 1);
      console.log(`+ ${uni.padEnd(8)} ${c.year}${c.semester} ${c.kind.padEnd(8)} ${String(c.units.length).padStart(2)} units  ${c.slug}`);
      backup.created.push(c.slug);
      stmts.push({
        sql: `INSERT INTO Course (slug, "nameHe", "nameEn", year, semester, "descHe", "descEn", units, position, university, kind, "updatedAt") VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
        args: [c.slug, c.nameHe, c.nameEn, c.year, c.semester, c.descHe, c.descEn, JSON.stringify(c.units), position, uni, c.kind, NOW],
      });
    }
  };
  insert("general", generalNew);
  for (const uni of ["huji", "tau", "technion", "bgu", "biu", "haifa"]) insert(uni, tracks.filter((c) => c.slug.startsWith(`${uni}-`)));

  if (dryRun) { console.log(`dry run — ${stmts.length} statements`); return; }
  fs.mkdirSync(".backups", { recursive: true });
  const file = path.join(".backups", `university-tracks-${NOW.replace(/[:.]/g, "-")}.json`);
  fs.writeFileSync(file, JSON.stringify(backup, null, 1));
  console.log(`backup → ${file}`);
  await db.batch(stmts, "write");
  console.log(`applied ${stmts.length} statements`);
}

async function rollback(file: string) {
  const b = JSON.parse(fs.readFileSync(file, "utf8"));
  const stmts: InStatement[] = [
    ...b.moved.map((m: { slug: string; year: number; semester: string; updatedAt: string | null }) => ({ sql: `UPDATE Course SET year=?, semester=?, "updatedAt"=? WHERE slug=?`, args: [m.year, m.semester, m.updatedAt, m.slug] })),
    ...b.created.map((slug: string) => ({ sql: `DELETE FROM Course WHERE slug=?`, args: [slug] })),
  ];
  await db.batch(stmts, "write");
  console.log(`restored ${b.moved.length} moves, removed ${b.created.length} courses`);
}

const args = process.argv.slice(2);
(args[0] === "--rollback" ? rollback(args[1]) : args[0] === "--schema" ? schema() : apply(args.includes("--dry-run"))).catch((e) => {
  console.error(e);
  process.exit(1);
});
