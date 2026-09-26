import { C, bilayer, circle, label, line, path, rect, smooth, text, type El, type ProcessScene, type Pt } from "./kit";

// rod-shaped cell (bacillus) as nested rounded rectangles
const rod = (p: string, x: number, y: number, w: number, h: number): El[] => [
  rect(`${p}_cap`, x - 10, y - 10, w + 20, h + 20, "#f1f5f9", { rx: (h + 20) / 2, stroke: "#94a3b8", strokeWidth: 1.8, dash: "4 3" }),
  rect(`${p}_wall`, x, y, w, h, "#dcfce7", { rx: h / 2, stroke: "#15803d", strokeWidth: 5 }),
  rect(`${p}_mem`, x + 6, y + 6, w - 12, h - 12, "#f0fdf4", { rx: (h - 12) / 2, stroke: C.membrane, strokeWidth: 2 }),
];
const nucleoid = (id: string, cx: number, cy: number, s = 1) =>
  path(id, smooth([[cx - 40 * s, cy], [cx - 26 * s, cy - 20 * s], [cx - 8 * s, cy + 6 * s], [cx + 10 * s, cy - 22 * s], [cx + 34 * s, cy - 6 * s], [cx + 28 * s, cy + 18 * s], [cx + 4 * s, cy + 10 * s], [cx - 20 * s, cy + 22 * s]], true), { stroke: "#1d4ed8", strokeWidth: 2.5 });

// binary fission: an elongated cell with a septum forming at the middle
const fissionOutline = (pinch: number) => {
  const pts: Pt[] = [];
  for (let i = 0; i < 20; i++) {
    const a = (2 * Math.PI * i) / 20;
    const x = 200 + 170 * Math.cos(a);
    let y = 150 + 58 * Math.sin(a);
    y -= Math.sign(Math.sin(a)) * pinch * Math.exp(-(((x - 200) / 30) ** 2)) * 44;
    pts.push([x, y]);
  }
  return smooth(pts, true);
};
const RIB: Pt[] = [[120, 124], [138, 176], [262, 118], [280, 180], [300, 140], [106, 156], [240, 186]];
const b1: El[] = [
  path("fcell", fissionOutline(0), { color: "#dcfce7", opacity: 0 }), // paints below the nucleoid in step 3
  ...rod("c", 80, 95, 240, 110),
  nucleoid("nuc", 190, 150),
  circle("pl", 268, 150, 11, "none", { stroke: "#9333ea", strokeWidth: 2.5 }),
  ...RIB.map(([x, y], i) => circle(`r${i}`, x, y, 3.5, "#475569")),
  path("flag", "M 330 150 C 348 132 358 168 374 150 C 386 136 394 160 400 150", { stroke: "#0f172a", strokeWidth: 2.2 }),
  ...[[110, 85, 104, 70], [170, 85, 170, 68], [240, 85, 246, 68], [290, 90, 300, 76], [120, 215, 114, 232], [210, 215, 212, 234], [280, 212, 290, 228]].map(([x1, y1, x2, y2], i) => line(`pi${i}`, x1, y1, x2, y2, "#64748b", 1.8)),
  label("l_nuc", 8, 284, "Nucleoid (no nuclear membrane)", "נוקלאואיד — ללא קרום גרעין", [184, 170], { anchor: "start", shortHe: "נוקלאואיד", short: "Nucleoid" }),
  label("l_pl", 250, 40, "Plasmid", "פלסמיד", [268, 139], { anchor: "start" }),
  label("l_rib", 8, 40, "70S ribosomes", "ריבוזומים 70S", [120, 124], { anchor: "start" }),
  label("l_wall", 8, 248, "Cell wall", "דופן התא", [90, 196], { anchor: "start" }),
  label("l_cap", 310, 284, "Capsule", "קופסית", [300, 210], { anchor: "start" }),
  label("l_fl", 340, 100, "Flagellum", "שוטון", [372, 148], { anchor: "start", shortHe: "שוטון", short: "Flagellum" }),
  label("l_pi", 150, 40, "Pili", "שערונים", [170, 70], { anchor: "start" }),
];

// cell envelopes, cross-section (outside at top, cytoplasm at bottom)
const pgLayers = (p: string, x: number, w: number, y1: number, y2: number): El[] => {
  const segs: string[] = [];
  for (let y = y1; y <= y2; y += 8) segs.push(`M ${x} ${y} L ${x + w} ${y}`);
  for (let xx = x + 8; xx < x + w; xx += 16) segs.push(`M ${xx} ${y1} L ${xx} ${y2}`);
  return [rect(`${p}_bg`, x, y1 - 2, w, y2 - y1 + 4, "#bbf7d0", { rx: 2 }), path(`${p}_net`, segs.join(" "), { stroke: "#15803d", strokeWidth: 1.4 })];
};
const b2: El[] = [
  text("gp", 100, 40, "Gram-positive", "גרם חיובי", { weight: 800, textColor: "#7c3aed" }),
  text("gn", 300, 40, "Gram-negative", "גרם שלילי", { weight: 800, textColor: "#db2777" }),
  line("div", 200, 56, 200, 260, "#cbd5e1", 1.5, { dash: "4 4" }),
  ...pgLayers("pgP", 30, 140, 96, 184),
  ...[46, 86, 126, 158].map((x, i) => line(`ta${i}`, x, 184, x, 70, "#7c3aed", 2)),
  ...bilayer("imP", 26, 174, 206, { th: 16 }),
  ...bilayer("om", 226, 374, 104, { th: 16 }),
  ...[240, 262, 284, 306, 328, 350].map((x, i) => path(`lps${i}`, `M ${x} 96 L ${x} 76 M ${x - 5} 72 L ${x + 5} 72`, { stroke: "#db2777", strokeWidth: 2.2 })),
  ...pgLayers("pgN", 226, 148, 150, 160),
  ...bilayer("imN", 226, 374, 206, { th: 16 }),
  label("l_thick", 8, 262, "Thick peptidoglycan", "פפטידוגליקן עבה", [70, 150], { anchor: "start", shortHe: "פפטידוגליקן עבה", short: "Thick PG" }),
  label("l_ta", 30, 70, "Teichoic acids", "חומצות טייכואיות", [46, 90], { anchor: "start", shortHe: "טייכואיות", short: "Teichoic" }),
  label("l_om", 226, 64, "Outer membrane + LPS", "ממברנה חיצונית + LPS", [300, 96], { anchor: "start", shortHe: "ממברנה חיצונית", short: "Outer membrane" }),
  label("l_thin", 220, 262, "Thin peptidoglycan", "פפטידוגליקן דק", [300, 156], { anchor: "start", shortHe: "PG דק", short: "Thin PG" }),
  text("peri", 300, 136, "periplasm", "פריפלזמה", { textColor: C.muted, fontSize: 16.5 }),
  text("pm", 200, 238, "plasma membrane", "ממברנת התא", { textColor: C.membrane }),
  text("abx", 200, 290, "Penicillin blocks peptidoglycan cross-links", "פניצילין מעכב את קישורי הפפטידוגליקן", { weight: 700, textColor: "#b91c1c", short: "Penicillin → PG", shortHe: "פניצילין ← PG" }),
];

const b3: El[] = [
  path("fcell", fissionOutline(1), { color: "#dcfce7", stroke: "#15803d", strokeWidth: 4 }),
  nucleoid("nuc", 115, 150, 0.8), nucleoid("nuc2", 285, 150, 0.8),
  circle("ori1", 84, 148, 5, "#dc2626"), circle("ori2", 316, 148, 5, "#dc2626"),
  circle("fz1", 200, 114, 6, "#f59e0b", { stroke: "#b45309", strokeWidth: 1.5 }), circle("fz2", 200, 186, 6, "#f59e0b", { stroke: "#b45309", strokeWidth: 1.5 }),
  label("l_rep", 8, 40, "Chromosome copied from ori", "הכרומוזום משוכפל מ-ori", [84, 144], { anchor: "start", shortHe: "שכפול מ-ori", short: "Copied from ori" }),
  label("l_fz", 220, 40, "FtsZ ring → septum", "טבעת FtsZ ← מחיצה", [200, 110], { anchor: "start" }),
  text("l_two", 200, 262, "2 genetically identical cells", "2 תאים זהים גנטית", { weight: 700 }),
  text("l_gen", 200, 288, "E. coli: ~20 min per division (optimal)", "E. coli: כ-20 דקות לחלוקה (בתנאים מיטביים)", { textColor: C.muted, short: "~20 min / division", shortHe: "כ-20 דקות לחלוקה" }),
];

// growth curve: log(cell number) vs time
const b4: El[] = [
  line("ax_y", 50, 250, 50, 40, C.line, 2, { arrow: true }),
  line("ax_x", 50, 250, 370, 250, C.line, 2, { arrow: true }),
  path("gc", "M 52 220 C 80 220 90 218 106 212 L 190 96 C 200 84 210 80 226 80 L 280 80 C 296 80 304 86 316 100 L 356 150", { stroke: "#16a34a", strokeWidth: 4 }),
  line("d1", 106, 250, 106, 60, "#cbd5e1", 1.2, { dash: "3 4" }), line("d2", 206, 250, 206, 60, "#cbd5e1", 1.2, { dash: "3 4" }), line("d3", 300, 250, 300, 60, "#cbd5e1", 1.2, { dash: "3 4" }),
  text("p1", 78, 272, "Lag", "השהיה", { weight: 700, fontSize: 16.5 }),
  text("p2", 156, 272, "Log", "לוגריתמי", { weight: 700, fontSize: 16.5 }),
  text("p3", 253, 272, "Stationary", "נייח", { weight: 700, fontSize: 16.5 }),
  text("p4", 338, 272, "Death", "מוות", { weight: 700, fontSize: 16.5 }),
  text("ylab", 60, 34, "log (number of cells)", "log (מספר תאים)", { anchor: "start", textColor: C.muted }),
  text("xlab", 370, 296, "time", "זמן", { anchor: "end", textColor: C.muted }),
];

export const bacteria: ProcessScene = {
  slug: "bacteria-structure-animation-1780781194821",
  legend: [
    { color: "#15803d", he: "דופן התא (פפטידוגליקן)", en: "Cell wall (peptidoglycan)", swatch: "line" },
    { color: C.membrane, he: "ממברנה", en: "Membrane", swatch: "dot" },
    { color: "#1d4ed8", he: "DNA (נוקלאואיד)", en: "DNA (nucleoid)", swatch: "line" },
    { color: "#94a3b8", he: "קופסית", en: "Capsule", swatch: "dash" },
  ],
  steps: [
    {
      titleHe: "מבנה התא החיידקי", titleEn: "Bacterial Cell Structure",
      descHe: "חיידקים הם פרוקריוטים: אין להם גרעין ואברונים עטופי ממברנה. הכרומוזום המעגלי נמצא באזור הנוקלאואיד, ולצדו פלסמידים קטנים. הריבוזומים הם 70S (לעומת 80S בציטוזול האאוקריוטי). את קרום התא עוטפים דופן פפטידוגליקן ולעתים קופסית; שוטונים משמשים לתנועה, ושערונים (פילי) להיצמדות ולהעברת DNA.",
      descEn: "Bacteria are prokaryotes: they have no nucleus and no membrane-bound organelles. The circular chromosome sits in the nucleoid, alongside small plasmids. Ribosomes are 70S (versus 80S in the eukaryotic cytosol). The plasma membrane is wrapped by a peptidoglycan wall and sometimes a capsule; flagella provide movement, and pili attachment and DNA transfer.",
      elements: b1,
    },
    {
      titleHe: "דופן התא — גרם חיובי וגרם שלילי", titleEn: "Cell Wall — Gram-Positive and Gram-Negative",
      descHe: "בחיידקים גרם-חיוביים דופן פפטידוגליקן עבה עם חומצות טייכואיות, והיא שומרת את צבע הקריסטל-סגול. בגרם-שליליים שכבת פפטידוגליקן דקה במרווח הפריפלזמי, ומעליה ממברנה חיצונית עם ליפופוליסכריד (LPS, אנדוטוקסין). הפפטידוגליקן אינו קיים בתאי אדם — ולכן הוא מטרה לאנטיביוטיקה: פניצילין מעכב את קישורי הרוחב בין שרשראותיו.",
      descEn: "Gram-positive bacteria have a thick peptidoglycan wall with teichoic acids, which keeps the crystal-violet stain. Gram-negative bacteria have a thin peptidoglycan layer in the periplasm, covered by an outer membrane with lipopolysaccharide (LPS, endotoxin). Human cells lack peptidoglycan — which makes it an antibiotic target: penicillin blocks the cross-links between its chains.",
      elements: b2,
    },
    {
      titleHe: "חלוקה בינארית", titleEn: "Binary Fission",
      descHe: "החיידק משכפל את הכרומוזום המעגלי החל מנקודת ההתחלה (ori), ושני העותקים נעים לשני קצות התא המתארך. טבעת של החלבון FtsZ נוצרת באמצע ומכווינה בניית מחיצה, והתא מתפצל לשני תאים זהים גנטית. בתנאים מיטביים E. coli מתחלק בערך כל 20 דקות.",
      descEn: "The bacterium copies its circular chromosome starting at the origin (ori), and the two copies move to either end of the lengthening cell. A ring of FtsZ protein forms at the middle and directs septum formation, and the cell splits into two genetically identical cells. Under optimal conditions E. coli divides about every 20 minutes.",
      elements: b3,
    },
    {
      titleHe: "עקומת הגדילה", titleEn: "The Growth Curve",
      descHe: "בתרבית סגורה יש ארבעה שלבים: השהיה (lag) — התאים מסתגלים ומייצרים אנזימים, כמעט בלי חלוקה; לוגריתמי (log) — חלוקה בקצב קבוע והכפלה מעריכית; נייח — חומרי הזנה מתכלים ופסולת מצטברת, וקצב החלוקה שווה לקצב המוות; מוות — מספר התאים החיים יורד.",
      descEn: "A closed culture passes through four phases: lag — cells adapt and make enzymes, with little division; log (exponential) — constant, exponential doubling; stationary — nutrients run out and waste builds up, so division equals death; death — the number of living cells falls.",
      elements: b4,
    },
  ],
};
