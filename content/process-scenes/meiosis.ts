import { C, chromatid, circle, ellipse, label, line, path, smooth, text, type El, type ProcessScene, type Pt } from "./kit";

// 2n = 4: a long and a short pair. Maternal homologs red, paternal blue.
const M = C.maternal, P = C.paternal;
const W = 5.5; // chromatid half-width
const chrom = (id: string, cx: number, y1: number, y2: number, color: string, cen: number): El =>
  path(id, chromatid(cx, y1, y2, W, cen), { color, stroke: "#0f172a", strokeWidth: 1 });
const tipOf = (id: string, cx: number, y1: number, y2: number, frac: number, color: string): El =>
  path(id, chromatid(cx, y1, y1 + (y2 - y1) * frac, W * 0.9, 0.5), { color, stroke: "#0f172a", strokeWidth: 1 });

// a replicated chromosome = sisters a + b; `tip` = crossover segment on sister b
function replicated(p: string, cx: number, y1: number, y2: number, color: string, cen: number, tip?: string): El[] {
  const els = [chrom(`${p}_a`, cx - W, y1, y2, color, cen), chrom(`${p}_b`, cx + W, y1, y2, color, cen)];
  if (tip) els.push(tipOf(`${p}_x`, cx + W, y1, y2, 0.36, tip));
  return els;
}
// maternal long chromosome carries its crossover tip on the inner (right) sister; paternal on its inner (left) sister
function replicatedL(p: string, cx: number, y1: number, y2: number, color: string, cen: number, tip: string): El[] {
  return [chrom(`${p}_b`, cx + W, y1, y2, color, cen), chrom(`${p}_a`, cx - W, y1, y2, color, cen), tipOf(`${p}_x`, cx - W, y1, y2, 0.36, tip)];
}

const cellPts = (pinch: number): Pt[] => {
  const pts: Pt[] = [];
  for (let i = 0; i < 16; i++) {
    const a = (2 * Math.PI * i) / 16;
    const x = 200 + 170 * Math.cos(a);
    let y = 150 + 112 * Math.sin(a);
    const nearMid = Math.exp(-(((x - 200) / 40) ** 2));
    y -= Math.sign(Math.sin(a)) * pinch * nearMid * 70;
    pts.push([x, y]);
  }
  return pts;
};
const cell = (pinch: number, o: Partial<El> = {}) => path("cell", smooth(cellPts(pinch), true), { color: "#f0fdf4", stroke: "#16a34a", strokeWidth: 2.5, ...o });
const mt = (id: string, x1: number, y1: number, x2: number, y2: number, o: Partial<El> = {}) => line(id, x1, y1, x2, y2, "#0d9488", 1.8, o);

// Step 3 — after meiosis II: 4 haploid cells, sisters separated, each genetically different
const CXS = [56, 152, 248, 344];
const cellN = (i: number) => ellipse(`g${i}`, CXS[i], 150, 42, 62, "#f0fdf4", { stroke: "#16a34a", strokeWidth: 2.2 });
const longAt = (id: string, i: number, color: string) => chrom(id, CXS[i] - 11, 112, 176, color, 0.4);
const shortAt = (id: string, i: number, color: string) => chrom(id, CXS[i] + 12, 136, 170, color, 0.5);
const tipAt = (id: string, i: number, color: string) => tipOf(id, CXS[i] - 11, 112, 176, 0.36, color);
// Step 1 — metaphase I: bivalents on the plate, crossover visible on the long pair
const L1 = [66, 140], S1 = [170, 210];
const step1: El[] = [
  cell(0),
  // daughter cells of step 3 exist (hidden) from the start so chromatids paint above them
  ...[0, 1, 2, 3].map((i) => ({ ...cellN(i), opacity: 0 })),
  line("plate", 200, 48, 200, 252, "#94a3b8", 1.5, { dash: "4 4" }),
  circle("pole1", 64, 150, 8, "#0f766e"), circle("pole2", 336, 150, 8, "#0f766e"),
  mt("mt1", 64, 150, 176, 66 + 74 * 0.4), mt("mt2", 64, 150, 176, 190),
  mt("mt3", 336, 150, 224, 66 + 74 * 0.4), mt("mt4", 336, 150, 224, 190),
  ...replicated("lm", 182, L1[0], L1[1], M, 0.4, P),
  ...replicatedL("lp", 218, L1[0], L1[1], P, 0.4, M),
  ...replicated("sp", 182, S1[0], S1[1], P, 0.5),
  ...replicated("sm", 218, S1[0], S1[1], M, 0.5),
  label("l_biv", 250, 40, "Bivalent (tetrad)", "ביוולנט (טטרדה)", [226, 80], { anchor: "start" }),
  label("l_chi", 20, 40, "Chiasma: crossing over", "כיאזמה — שחלוף", [200, 84], { anchor: "start", shortHe: "שחלוף", short: "Crossing over" }),
  label("l_sp", 250, 282, "Spindle", "סיבי כישור", [290, 162], { anchor: "start" }),
  text("l_2n", 30, 280, "2n = 4", "2n = 4", { anchor: "start", ltr: true, weight: 700 }),
];

// Step 2 — anaphase I: homologs to opposite poles; sisters stay together
const step2: El[] = [
  cell(0.55),
  circle("pole1", 44, 150, 8, "#0f766e"), circle("pole2", 356, 150, 8, "#0f766e"),
  mt("mt1", 44, 150, 94, 84 + 74 * 0.4), mt("mt2", 44, 150, 94, 196),
  mt("mt3", 356, 150, 306, 84 + 74 * 0.4), mt("mt4", 356, 150, 306, 196),
  ...replicated("lm", 100, 84, 158, M, 0.4, P),
  ...replicatedL("lp", 300, 84, 158, P, 0.4, M),
  ...replicated("sp", 100, 176, 216, P, 0.5),
  ...replicated("sm", 300, 176, 216, M, 0.5),
  arrow2("ar1", 150, 128, 122, 128), arrow2("ar2", 250, 128, 278, 128),
  label("l_hom", 130, 36, "Homologs separate", "ההומולוגים נפרדים", [140, 128], { anchor: "start" }),
  label("l_sis", 20, 280, "Sister chromatids stay joined", "האחיות נשארות מחוברות", [100, 190], { anchor: "start", shortHe: "האחיות מחוברות", short: "Sisters joined" }),
  text("l_n1", 300, 70, "n", "n", { ltr: true, weight: 800 }),
  text("l_n0", 100, 70, "n", "n", { ltr: true, weight: 800 }),
];

function arrow2(id: string, x1: number, y1: number, x2: number, y2: number): El {
  return line(id, x1, y1, x2, y2, "#334155", 2.4, { arrow: true });
}

const step3: El[] = [
  cell(1, { opacity: 0 }),
  cellN(0), cellN(1), cellN(2), cellN(3),
  // left cell of MI (maternal long + paternal short) → cells 0 and 1
  longAt("lm_a", 0, M), shortAt("sp_a", 0, P),
  longAt("lm_b", 1, M), tipAt("lm_x", 1, P), shortAt("sp_b", 1, P),
  // right cell of MI (paternal long + maternal short) → cells 2 and 3
  longAt("lp_a", 2, P), tipAt("lp_x", 2, M), shortAt("sm_a", 2, M),
  longAt("lp_b", 3, P), shortAt("sm_b", 3, M),
  label("l_rec", 110, 40, "Recombinant chromatid", "כרומטידה רקומביננטית", [141, 118], { anchor: "start", shortHe: "רקומביננטית", short: "Recombinant" }),
  text("l_4n", 200, 262, "4 haploid cells (n)", "4 תאים הפלואידיים (n)", { weight: 700 }),
  text("l_diff", 200, 288, "each genetically different", "כל אחד שונה גנטית", { textColor: C.muted }),
];

export const meiosis: ProcessScene = {
  slug: "meiosis",
  legend: [
    { color: M, he: "כרומוזום מהאם", en: "Maternal chromosome", swatch: "line" },
    { color: P, he: "כרומוזום מהאב", en: "Paternal chromosome", swatch: "line" },
    { color: "#0d9488", he: "סיבי כישור", en: "Spindle microtubules", swatch: "line" },
    { color: "#16a34a", he: "קרום התא", en: "Plasma membrane", swatch: "ring" },
  ],
  steps: [
    {
      titleHe: "מיוזה I — זיווג הומולוגים ושחלוף", titleEn: "Meiosis I — Homolog Pairing and Crossing Over",
      descHe: "בפרופאזה I כל כרומוזום (שכבר שוכפל ובנוי משתי כרומטידות אחיות) מזדווג להומולוג שלו בתהליך הסינפסיס ויוצר ביוולנט (טטרדה). בין כרומטידות שאינן אחיות מתרחש שחלוף (crossing over), הנראה ככיאזמה — מקטעים מתחלפים ונוצרים צירופים חדשים של אללים. במטאפאזה I הביוולנטים מסתדרים בזוגות על צלחת המטאפאזה, וכיוון כל זוג אקראי.",
      descEn: "In prophase I each chromosome (already replicated into two sister chromatids) pairs with its homolog — synapsis — forming a bivalent (tetrad). Crossing over between non-sister chromatids, seen as a chiasma, swaps segments and creates new allele combinations. In metaphase I the bivalents line up in pairs on the metaphase plate, each pair oriented at random.",
      elements: step1,
    },
    {
      titleHe: "מיוזה I אנאפאזה — הפרדת הומולוגים", titleEn: "Meiosis I Anaphase — Homologs Separate",
      descHe: "בניגוד למיטוזה, באנאפאזה I נפרדים הכרומוזומים ההומולוגיים — והכרומטידות האחיות נשארות מחוברות בצנטרומר. כל קוטב מקבל כרומוזום אחד מכל זוג, ולכן כל תא בת יהיה הפלואידי (n), אם כי כל כרומוזום עדיין בנוי משתי כרומטידות. זוהי חלוקת ההפחתה.",
      descEn: "Unlike mitosis, in anaphase I the homologous chromosomes separate while sister chromatids stay joined at the centromere. Each pole receives one chromosome of each pair, so each daughter cell will be haploid (n), even though each chromosome still has two chromatids. This is the reduction division.",
      elements: step2,
    },
    {
      titleHe: "מיוזה II — הפרדת כרומטידות אחיות", titleEn: "Meiosis II — Sister Chromatid Separation",
      descHe: "מיוזה II דומה למיטוזה: הכרומטידות האחיות נפרדות, ללא שכפול DNA נוסף. מתא דיפלואידי אחד (2n) נוצרים 4 תאים הפלואידיים (n) השונים זה מזה גנטית — בזכות השחלוף והמיון הבלתי תלוי. באדם (n = 23): בזכרים 4 זרעונים; בנקבות ביצית אחת וגופיפי קוטב.",
      descEn: "Meiosis II resembles mitosis: sister chromatids separate, with no further DNA replication. One diploid cell (2n) gives 4 haploid cells (n) that differ genetically — thanks to crossing over and independent assortment. In humans (n = 23): 4 sperm in males; in females one egg plus polar bodies.",
      elements: step3,
    },
  ],
};
