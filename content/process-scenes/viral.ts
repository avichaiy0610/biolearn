import { C, arrow, bilayer, circle, label, line, path, rect, smooth, text, wave, type El, type ProcessScene, type Pt } from "./kit";

/* ══ LIFE CYCLE OF AN ENVELOPED RNA VIRUS (Campbell 12e ch. 19; Alberts 7e ch. 23) ══════
   The top of the scene is outside the cell; the plasma membrane runs across at y = MEM; below it the host
   cytoplasm with the nucleus (bottom-left), rough ER (bottom-right) and the Golgi stack. The virion keeps the
   same element ids through the steps so it is seen docking, entering and coming apart. */

const MEM = 98;
const ENV = "#d97706", SPIKE = "#b45309", CAP = "#1d4ed8", CAPF = "#bfdbfe", RNA = "#dc2626", RNA2 = "#f472b6";
const f = (n: number) => Math.round(n * 10) / 10;

// icosahedral capsid seen face-on: hexagon with facet lines
function capsid(id: string, cx: number, cy: number, r: number, o: Partial<El> = {}): El[] {
  const v: Pt[] = Array.from({ length: 6 }, (_, i) => { const a = (Math.PI / 3) * i - Math.PI / 6; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; });
  const hex = v.map(([x, y], i) => `${i ? "L" : "M"} ${f(x)} ${f(y)}`).join(" ") + " Z";
  const facets = [0, 2, 4].map((i) => `M ${f(cx)} ${f(cy)} L ${f(v[i][0])} ${f(v[i][1])}`).join(" ");
  return [
    path(`${id}_hex`, hex, { color: CAPF, stroke: CAP, strokeWidth: 1.6, ...o }),
    path(`${id}_fac`, facets, { stroke: "#60a5fa", strokeWidth: 1, ...o }),
  ];
}
const genome = (id: string, x1: number, x2: number, y: number, color = RNA, o: Partial<El> = {}): El =>
  path(id, smooth(wave(x1, x2, y, 2.6, 7)), { stroke: color, strokeWidth: 2.2, ...o });
// glycoprotein spike: stalk + head, pointing along angle a (radians) from (x, y)
const spike = (id: string, x: number, y: number, a: number, len = 8, o: Partial<El> = {}): El[] => [
  line(`${id}_s`, x, y, x + len * Math.cos(a), y + len * Math.sin(a), SPIKE, 2, o),
  circle(`${id}_h`, x + (len + 2) * Math.cos(a), y + (len + 2) * Math.sin(a), 2.6, "#fbbf24", { stroke: SPIKE, strokeWidth: 1, ...o }),
];
// whole enveloped virion
function virion(p: string, cx: number, cy: number, sc = 1, o: Partial<El> = {}): El[] {
  const R = 22 * sc;
  return [
    circle(`${p}_env`, cx, cy, R, "#fef3c7", { stroke: ENV, strokeWidth: 2.2, ...o }),
    ...Array.from({ length: 10 }, (_, i) => { const a = (2 * Math.PI * i) / 10 + 0.3; return spike(`${p}_sp${i}`, cx + R * Math.cos(a), cy + R * Math.sin(a), a, 7 * sc, o); }).flat(),
    ...capsid(`${p}_cap`, cx, cy, 13 * sc, o),
    genome(`${p}_rna`, cx - 7 * sc, cx + 7 * sc, cy, RNA, o),
  ];
}

// host cell: membrane, cytoplasm, nucleus, rough ER with ribosomes, Golgi stack
const ER_LINES = [0, 1, 2].map((k) => smooth([[244, 252 + k * 14], [280, 238 + k * 14], [322, 244 + k * 14], [360, 236 + k * 14], [392, 246 + k * 14]]));
const host = (): El[] => [
  rect("cyto", 0, MEM, 400, 300 - MEM, "#f0fdf4"),
  ...bilayer("pm", 0, 400, MEM, { th: 14 }),
  text("t_out", 392, 82, "Outside", "מחוץ לתא", { anchor: "end", fontSize: 13, weight: 700, textColor: C.muted }),
  circle("nuc_o", 26, 318, 66, "#ede9fe", { stroke: "#7c3aed", strokeWidth: 2 }),
  circle("nuc_i", 26, 318, 58, "#f5f3ff", { stroke: "#a78bfa", strokeWidth: 1 }),
  text("t_nuc", 36, 290, "nucleus", "גרעין", { fontSize: 13, weight: 700, textColor: "#6d28d9" }),
  ...ER_LINES.map((d, k) => path(`er${k}`, d, { stroke: "#a16207", strokeWidth: 3 })),
  ...ER_LINES.flatMap((_, k) => [256, 290, 326, 362].map((x, i) => circle(`erb${k}_${i}`, x, 236 + k * 14 + (i % 2 ? 4 : 0), 2.4, "#1e3a8a"))),
  ...[0, 1, 2, 3].map((k) => path(`gol${k}`, `M ${300 + k * 3} ${150 + k * 11} q ${36 - k * 3} -12 ${72 - k * 6} 0`, { stroke: "#059669", strokeWidth: 3.2 })),
  text("t_er", 372, 296, "rough ER", "ER גבשושי", { anchor: "end", fontSize: 12, weight: 700, textColor: "#a16207" }),
  text("t_gol", 392, 140, "Golgi", "גולג'י", { anchor: "end", fontSize: 12, weight: 700, textColor: "#059669" }),
];
// receptors on the cell surface
const receptors = (): El[] => [128, 172, 254].map((x, i) => path(`rec${i}`, `M ${x} ${MEM - 7} L ${x} ${MEM - 17} M ${x - 5} ${MEM - 22} L ${x} ${MEM - 17} L ${x + 5} ${MEM - 22}`, { stroke: "#0f766e", strokeWidth: 2.6 }));

const s1: El[] = [
  ...host(), ...receptors(),
  ...virion("v", 150, 56),
  label("l_sp", 196, 30, "Glycoprotein spikes", "זיזי גליקופרוטאין", [170, 40], { anchor: "start" }),
  label("l_rec", 392, 50, "Host receptor", "קולטן בתא המאכסן", [254, 80], { anchor: "end" }),
  label("l_cap", 14, 150, "Capsid + RNA genome", "קפסיד וגנום RNA", [146, 58], { anchor: "start" }),
];
const s2: El[] = [
  ...host(), ...receptors(),
  // envelope merged into the membrane: an orange patch with spikes
  path("v_env", `M 122 ${MEM - 6} C 132 ${MEM - 20} 168 ${MEM - 20} 178 ${MEM - 6}`, { stroke: ENV, strokeWidth: 3 }),
  ...[132, 150, 168].flatMap((x, i) => spike(`v_sp${i}`, x, MEM - 14, -Math.PI / 2, 7)),
  // capsid inside, coming apart: facets drift, RNA released
  ...capsid("v_cap", 140, 148, 13, { opacity: 0.55 }),
  genome("v_rna", 156, 200, 168),
  label("l_fus", 196, 30, "Envelope fuses with the membrane", "המעטפת מתמזגת עם הממברנה", [150, MEM - 14], { anchor: "start", shortHe: "היתוך", short: "Fusion" }),
  label("l_unc", 14, 214, "Uncoating releases the RNA", "הקפסיד מתפרק וה-RNA משתחרר", [182, 168], { anchor: "start", shortHe: "שחרור ה-RNA", short: "Uncoating" }),
];
const s3: El[] = [
  ...host(),
  genome("v_rna", 88, 136, 134),
  genome("rna_c", 88, 136, 150, RNA2),
  rect("rdrp", 100, 128, 24, 28, "#fde68a", { stroke: "#b45309", strokeWidth: 1.6, rx: 8 }),
  // free ribosomes translating capsid proteins
  ...[[178, 132], [200, 146], [222, 132]].map(([x, y], i) => circle(`rib${i}`, x, y, 6, "#93c5fd", { stroke: CAP, strokeWidth: 1.2 })),
  ...[[184, 166], [212, 176], [236, 164]].flatMap(([x, y], i) => capsid(`cp${i}`, x, y, 5)),
  // glycoproteins made on the ER, through the Golgi, vesicle to the membrane
  ...[[272, 228], [306, 232], [342, 226]].flatMap(([x, y], i) => spike(`gp${i}`, x, y, -Math.PI / 2, 7)),
  circle("ves", 346, 118, 9, "#ecfdf5", { stroke: "#059669", strokeWidth: 1.8 }),
  ...spike("ves_sp", 346, 109, -Math.PI / 2, 5),
  arrow("ves_ar", 334, 160, 342, 132, "#059669", 2),
  label("l_rdrp", 14, 200, "Viral RNA polymerase copies the genome", "פולימראז RNA נגיפי משכפל את הגנום", [112, 156], { anchor: "start", shortHe: "שכפול הגנום", short: "Genome copied" }),
  label("l_rib", 14, 232, "Free ribosomes: capsid proteins", "ריבוזומים חופשיים: חלבוני קפסיד", [200, 150], { anchor: "start", shortHe: "חלבוני קפסיד", short: "Capsid proteins" }),
  label("l_gp", 14, 40, "ER → Golgi → membrane: glycoproteins", "גליקופרוטאינים: ER ← גולג'י ← ממברנה", [346, 112], { anchor: "start", shortHe: "גליקופרוטאינים", short: "Glycoproteins" }),
];
const s4: El[] = [
  ...host(),
  // glycoproteins now in the membrane
  ...[210, 228, 246, 290, 308, 326].flatMap((x, i) => spike(`pm_sp${i}`, x, MEM - 7, -Math.PI / 2, 7)),
  // nucleocapsids assemble and move under those patches
  ...capsid("nc0", 228, 128, 13), genome("nc0_r", 221, 235, 128),
  ...capsid("nc1", 308, 132, 13), genome("nc1_r", 301, 315, 132),
  ...capsid("nc2", 130, 168, 13, { opacity: 0.7 }), genome("nc2_r", 123, 137, 168, RNA, { opacity: 0.7 }),
  arrow("nc_ar", 146, 160, 206, 136, CAP, 2),
  label("l_asm", 14, 214, "Capsids assemble around new genomes", "קפסידים מתאספים סביב גנומים חדשים", [130, 176], { anchor: "start", shortHe: "הרכבה", short: "Assembly" }),
  label("l_gpm", 14, 30, "Viral glycoproteins in the membrane", "גליקופרוטאינים נגיפיים בממברנה", [228, MEM - 18], { anchor: "start", shortHe: "גליקופרוטאינים", short: "Glycoproteins" }),
];
const s5: El[] = [
  ...host(),
  // budding particle: membrane pushed out around a nucleocapsid
  path("bud", `M 284 ${MEM - 7} C 284 ${MEM - 52} 340 ${MEM - 52} 340 ${MEM - 7}`, { color: "#fef3c7", stroke: ENV, strokeWidth: 2.4 }),
  ...[[-2.4], [-1.9], [-1.25], [-0.75]].flatMap(([a], i) => spike(`bd_sp${i}`, 312 + 24 * Math.cos(a), MEM - 22 + 24 * Math.sin(a), a, 6)),
  ...capsid("nc1", 312, MEM - 26, 12), genome("nc1_r", 306, 318, MEM - 26),
  // released virions
  ...virion("b1", 80, 46), ...virion("b2", 190, 44, 0.85),
  label("l_bud", 14, 160, "Budding: the membrane becomes the envelope", "הנצה: ממברנת התא הופכת למעטפת", [312, MEM - 44], { anchor: "start", shortHe: "הנצה", short: "Budding" }),
  label("l_new", 14, 210, "New virions infect other cells", "נגיפים חדשים מדביקים תאים נוספים", [190, 62], { anchor: "start", shortHe: "נגיפים חדשים", short: "New virions" }),
];

export const viralScene: ProcessScene = {
  slug: "viral-life-cycle",
  meta: {
    topic: "microbiology", subtopic: "viruses",
    nameHe: "מחזור החיים של נגיף עטוף", nameEn: "Life Cycle of an Enveloped Virus",
    descHe: "היצמדות, חדירה והתפרקות הקפסיד, שכפול וסינתזה במנגנוני התא, הרכבה והנצה של נגיף RNA עטוף",
    descEn: "Attachment, entry and uncoating, replication and synthesis using host machinery, assembly and budding of an enveloped RNA virus",
    source: "Campbell 12e ch. 19; Alberts 7e ch. 23",
  },
  legend: [
    { color: ENV, he: "מעטפת הנגיף / ממברנת התא", en: "Viral envelope / host membrane", swatch: "ring" },
    { color: SPIKE, he: "גליקופרוטאינים נגיפיים (זיזים)", en: "Viral glycoproteins (spikes)", swatch: "line" },
    { color: CAP, he: "קפסיד / ריבוזומים", en: "Capsid / ribosomes", swatch: "ring" },
    { color: RNA, he: "גנום RNA נגיפי", en: "Viral RNA genome", swatch: "line" },
    { color: RNA2, he: "עותק משלים", en: "Complementary copy", swatch: "line" },
    { color: "#0f766e", he: "קולטן בתא המאכסן", en: "Host receptor", swatch: "line" },
  ],
  steps: [
    {
      titleHe: "היצמדות", titleEn: "Attachment",
      descHe: "נגיף עטוף בנוי מגנום (כאן RNA), קפסיד חלבוני ומעטפת ממברנית עם זיזי גליקופרוטאין. הזיזים נקשרים בספציפיות לקולטנים על פני התא המאכסן — ולכן כל נגיף מדביק רק מינים וסוגי תאים מסוימים (טווח מאכסנים).",
      descEn: "An enveloped virus has a genome (here RNA), a protein capsid and a membrane envelope with glycoprotein spikes. The spikes bind specifically to receptors on the host cell — which is why each virus infects only certain species and cell types (host range).",
      elements: s1,
    },
    {
      titleHe: "חדירה והתפרקות הקפסיד", titleEn: "Entry and Uncoating",
      descHe: "מעטפת הנגיף מתמזגת עם ממברנת התא (או שהנגיף נבלע באנדוציטוזה ומתמזג עם ממברנת האנדוזום), הקפסיד נכנס לציטופלזמה ומתפרק, והגנום הנגיפי משתחרר.",
      descEn: "The viral envelope fuses with the host membrane (or the virus is taken in by endocytosis and fuses with the endosome membrane), the capsid enters the cytoplasm and comes apart, releasing the viral genome.",
      elements: s2,
    },
    {
      titleHe: "שכפול וסינתזת חלבונים", titleEn: "Replication and Protein Synthesis",
      descHe: "פולימראז RNA תלוי-RNA — אנזים שהנגיף מקודד ושאין בתא — מכין עותקים משלימים, ומהם גנומים חדשים ו-mRNA. ריבוזומים חופשיים של התא מייצרים חלבוני קפסיד, וריבוזומים על ה-ER הגבשושי מייצרים את הגליקופרוטאינים, שעוברים דרך הגולג'י ומגיעים בשלפוחיות לממברנת התא.",
      descEn: "An RNA-dependent RNA polymerase — an enzyme the virus encodes and the cell lacks — makes complementary copies, and from them new genomes and mRNA. The host's free ribosomes make capsid proteins, while ribosomes on the rough ER make the glycoproteins, which pass through the Golgi and reach the plasma membrane in vesicles.",
      elements: s3,
    },
    {
      titleHe: "הרכבה", titleEn: "Assembly",
      descHe: "חלבוני הקפסיד מתאספים סביב הגנומים החדשים ליצירת נוקלאוקפסידים, שנעים אל אזורי הממברנה שבהם הוחדרו הגליקופרוטאינים הנגיפיים.",
      descEn: "Capsid proteins assemble around the new genomes to form nucleocapsids, which move to membrane patches where the viral glycoproteins have been inserted.",
      elements: s4,
    },
    {
      titleHe: "הנצה ושחרור", titleEn: "Budding and Release",
      descHe: "הנוקלאוקפסיד דוחף את הממברנה החוצה ומתעטף בה — כך ממברנת התא, עם הגליקופרוטאינים הנגיפיים, הופכת למעטפת הנגיף. הנגיפים החדשים משתחררים ומדביקים תאים נוספים; בהנצה התא לא חייב להתפרק מיד.",
      descEn: "The nucleocapsid pushes the membrane outward and is wrapped by it — so the host membrane, studded with viral glycoproteins, becomes the viral envelope. New virions are released to infect other cells; budding need not destroy the cell at once.",
      elements: s5,
    },
  ],
};
