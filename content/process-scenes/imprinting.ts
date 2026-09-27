import { C, arrow, circle, ellipse, label, line, path, rect, single, smooth, text, type El, type ProcessScene } from "./kit";
import { expandComposites } from "./composites";

// Genomic imprinting (Campbell 12e ch. 15.4; Alberts 7e ch. 7): the Igf2/H19
// locus — imprinting control region (ICR) methylated on the paternal allele,
// CTCF insulator on the unmethylated maternal ICR; Prader-Willi / Angelman.
const M = C.maternal, P = C.paternal, ME = "#0f172a";
const meth = (id: string, x: number, y: number, up = true): El[] => [
  line(`${id}_s`, x, y, x, y + (up ? -10 : 10), ME, 2),
  circle(`${id}_h`, x, y + (up ? -13 : 13), 4.2, ME),
];
const nucleus = (o: Record<string, number>) => expandComposites([{ id: "nuc", type: "use", shape: "nucleus", ...o }]);

// ── step 1: one gene, two parental alleles
const s1: El[] = [
  // gametes of step 2 exist (hidden) from the start so the chromosomes paint above them
  circle("egg", 104, 160, 78, "#fef3c7", { opacity: 0 }),
  ellipse("sp_h", 300, 160, 26, 17, "#e0e7ff", { opacity: 0 }),
  ...nucleus({ cx: 200, cy: 158, r: 110 }),
  ...single("chM", 168, 78, 236, M, { w: 8, cen: 0.35 }),
  ...single("chP", 232, 78, 236, P, { w: 8, cen: 0.35 }),
  rect("bandM", 160, 170, 16, 10, ME, { rx: 1 }), rect("bandP", 224, 170, 16, 10, ME, { rx: 1 }),
  label("l_m", 14, 60, "Maternal allele", "אלל מהאם", [160, 175], { anchor: "start" }),
  label("l_p", 300, 60, "Paternal allele", "אלל מהאב", [240, 175], { anchor: "start" }),
  label("l_g", 250, 286, "Igf2 gene (same DNA)", "הגן Igf2 — אותו רצף", [232, 180], { anchor: "start", shortHe: "הגן Igf2", short: "Igf2 gene" }),
  text("q", 200, 28, "expression depends on the parent", "הביטוי תלוי בהורה שמסר את האלל", { weight: 700, textColor: C.muted, short: "parent decides", shortHe: "ההורה קובע" }),
];

// ── step 2: imprints erased and reset in the germ line, by the parent's sex
const s2: El[] = [
  circle("egg", 104, 160, 78, "#fef3c7", { stroke: "#d97706", strokeWidth: 2.5 }),
  ...single("chM", 104, 110, 210, M, { w: 8, cen: 0.35 }),
  rect("bandM", 96, 142, 16, 10, ME, { rx: 1 }),
  circle("icrM_o1", 124, 146, 4.2, "#ffffff", { stroke: ME, strokeWidth: 1.5 }), circle("icrM_o2", 124, 158, 4.2, "#ffffff", { stroke: ME, strokeWidth: 1.5 }),
  ellipse("sp_h", 300, 160, 26, 17, "#e0e7ff", { stroke: "#4338ca", strokeWidth: 2 }),
  path("sp_t", "M 326 160 C 342 146 352 174 368 160 C 380 150 388 168 398 160", { stroke: "#4338ca", strokeWidth: 2 }),
  ...single("chP", 296, 142, 178, P, { w: 6, cen: 0.4 }),
  ...meth("mP1", 310, 156), ...meth("mP2", 316, 170, false),
  label("l_egg", 8, 40, "Egg: ICR unmethylated", "ביצית: ה-ICR לא ממותל", [124, 146], { anchor: "start", shortHe: "ביצית: לא ממותל", short: "Egg: unmethylated" }),
  label("l_sp", 208, 60, "Sperm: ICR methylated", "זרעון: ה-ICR ממותל", [310, 143], { anchor: "start", shortHe: "זרעון: ממותל", short: "Sperm: methylated" }),
  text("reset", 200, 282, "old marks erased, new ones set", "החותמות הישנות נמחקות ונקבעות מחדש", { weight: 700, textColor: C.muted, short: "erased & reset", shortHe: "מחיקה וקביעה מחדש" }),
];

// ── step 3: the imprint survives fertilisation and is copied at every replication (DNMT1)
const duplex = (id: string, y: number, newStrandMethylated: boolean): El[] => {
  const els: El[] = [
    line(`${id}_t`, 40, y - 8, 360, y - 8, "#475569", 4),
    line(`${id}_b`, 40, y + 8, 360, y + 8, newStrandMethylated ? "#475569" : "#16a34a", 4),
  ];
  [100, 190, 280].forEach((x, i) => {
    els.push(...meth(`${id}_m${i}`, x, y - 8));
    if (newStrandMethylated) els.push(...meth(`${id}_n${i}`, x + 8, y + 8, false));
  });
  return els;
};
const s3: El[] = [
  ...duplex("d1", 96, false),
  ...duplex("d2", 214, true),
  ...expandComposites([{ id: "dnmt", type: "use", shape: "enzyme", cx: 232, cy: 136, r: 22, color: "#fed7aa" }]),
  arrow("dn_a", 232, 118, 204, 108, "#c2410c", 2.2),
  arrow("rep", 200, 150, 200, 180, C.line, 2.4),
  label("l_old", 14, 46, "Parental strand: methylated", "גדיל הורי — ממותל", [100, 76], { anchor: "start", shortHe: "גדיל הורי", short: "Parental strand" }),
  label("l_new", 250, 46, "New strand", "גדיל חדש", [320, 104], { anchor: "start" }),
  label("l_dn", 290, 150, "DNMT1 copies the mark", "DNMT1 משלים", [252, 132], { anchor: "start" }),
  text("keep", 200, 272, "the imprint is kept in every cell", "החותם נשמר בכל תאי הגוף", { weight: 700, textColor: C.muted, short: "kept in every cell", shortHe: "נשמר בכל התאים" }),
];

// ── step 4: allele-specific expression at Igf2/H19
const locus = (p: string, y: number, color: string, maternal: boolean): El[] => {
  const els: El[] = [
    line(`${p}_dna`, 20, y, 380, y, color, 4),
    rect(`${p}_igf2`, 38, y - 13, 72, 26, maternal ? "#e2e8f0" : "#bbf7d0", { rx: 4, stroke: "#334155", strokeWidth: 1.5 }),
    text(`${p}_igf2_t`, 74, y + 6, "Igf2", "Igf2", { ltr: true, weight: 800, halo: false }),
    rect(`${p}_icr`, 150, y - 9, 34, 18, "#fde68a", { rx: 3, stroke: "#a16207", strokeWidth: 1.5 }),
    rect(`${p}_h19`, 214, y - 13, 60, 26, maternal ? "#bbf7d0" : "#e2e8f0", { rx: 4, stroke: "#334155", strokeWidth: 1.5 }),
    text(`${p}_h19_t`, 244, y + 6, "H19", "H19", { ltr: true, weight: 800, halo: false }),
    ellipse(`${p}_enh`, 336, y, 20, 11, "#fbcfe8", { stroke: "#be185d", strokeWidth: 1.5 }),
  ];
  if (maternal) {
    els.push(path(`${p}_ctcf`, smooth([[152, y - 12], [150, y - 34], [167, y - 44], [184, y - 34], [182, y - 12]], false) + " Z", { color: "#c4b5fd", stroke: "#6d28d9", strokeWidth: 1.8 }));
    els.push(path(`${p}_act`, `M 330 ${y - 12} C 318 ${y - 46} 272 ${y - 46} 256 ${y - 16}`, { stroke: "#16a34a", strokeWidth: 2.4, arrow: true }));
    els.push(line(`${p}_x1`, 62, y - 30, 86, y - 18, "#dc2626", 2.5), line(`${p}_x2`, 86, y - 30, 62, y - 18, "#dc2626", 2.5));
  } else {
    els.push(...meth(`${p}_m1`, 158, y + 9, false), ...meth(`${p}_m2`, 176, y + 9, false));
    els.push(path(`${p}_act`, `M 330 ${y + 12} C 300 ${y + 58} 120 ${y + 58} 86 ${y + 16}`, { stroke: "#16a34a", strokeWidth: 2.4, arrow: true }));
    els.push(line(`${p}_x1`, 232, y + 20, 256, y + 32, "#dc2626", 2.5), line(`${p}_x2`, 256, y + 20, 232, y + 32, "#dc2626", 2.5));
  }
  return els;
};
const s4: El[] = [
  ...locus("lm", 100, M, true),
  ...locus("lp", 206, P, false),
  text("t_m", 20, 134, "Maternal", "מהאם", { anchor: "start", weight: 800, textColor: M }),
  text("t_p", 20, 240, "Paternal", "מהאב", { anchor: "start", weight: 800, textColor: P }),
  label("l_ctcf", 150, 34, "CTCF insulator", "CTCF — מבודד", [167, 58], { anchor: "start" }),
  label("l_icr", 14, 290, "Methylated ICR", "ICR ממותל", [167, 226], { anchor: "start" }),
  label("l_enh", 300, 290, "Enhancer", "מגביר", [336, 216], { anchor: "start" }),
];

// ── step 5: same deletion, different disease depending on the parent (15q11–q13)
const pair = (p: string, x: number, delMaternal: boolean): El[] => [
  ...single(`${p}M`, x - 16, 96, 236, M, { w: 8, cen: 0.25 }),
  ...single(`${p}P`, x + 16, 96, 236, P, { w: 8, cen: 0.25 }),
  rect(`${p}_del`, (delMaternal ? x - 16 : x + 16) - 9, 150, 18, 30, "#ffffff", { rx: 2, stroke: "#dc2626", strokeWidth: 1.8, dash: "3 2" }),
];
const s5: El[] = [
  ...pair("pw", 110, false),
  ...pair("as", 290, true),
  text("pw_t", 110, 262, "Prader-Willi", "פראדר-וילי", { weight: 800 }),
  text("as_t", 290, 262, "Angelman", "אנג'למן", { weight: 800 }),
  text("pw_s", 110, 288, "deletion from father", "חסר בכרומוזום מהאב", { textColor: C.muted, short: "father's copy", shortHe: "מהאב" }),
  text("as_s", 290, 288, "deletion from mother", "חסר בכרומוזום מהאם", { textColor: C.muted, short: "mother's copy", shortHe: "מהאם" }),
  label("l_del", 150, 70, "Same 15q11–q13 deletion", "אותה מחיקה ב-15q11–q13", [126, 150], { anchor: "start", shortHe: "אותה מחיקה", short: "Same deletion" }),
  text("l_chr", 200, 30, "chromosome 15 pairs", "זוגות כרומוזום 15", { weight: 700, textColor: C.muted }),
];

export const imprinting: ProcessScene = {
  slug: "genomic-imprinting",
  source: "Campbell 12e ch. 15; Alberts 7e ch. 7",
  legend: [
    { color: M, he: "כרומוזום מהאם", en: "Maternal chromosome", swatch: "line" },
    { color: P, he: "כרומוזום מהאב", en: "Paternal chromosome", swatch: "line" },
    { color: ME, he: "קבוצת מתיל (CH₃) על CpG", en: "Methyl group (CH₃) on CpG", swatch: "dot" },
    { color: "#6d28d9", he: "CTCF (מבודד)", en: "CTCF (insulator)", swatch: "ring" },
    { color: "#16a34a", he: "הפעלת הגן על ידי המגביר", en: "Enhancer activates gene", swatch: "arrow" },
  ],
  steps: [
    {
      titleHe: "אלל אחד מכל הורה", titleEn: "One Allele from Each Parent",
      descHe: "לכל גן בתא דיפלואידי יש שני אללים — אחד מהאם ואחד מהאב. ברוב הגנים שניהם מבוטאים, אבל בגנים מוחתמים (כמו Igf2) רק האלל של הורה אחד פעיל, גם כשרצף ה-DNA של שני האללים זהה. ההבדל אינו ברצף אלא בסימון אפיגנטי.",
      descEn: "In a diploid cell each gene has two alleles — one from the mother and one from the father. For most genes both are expressed, but for imprinted genes (such as Igf2) only one parent's allele is active, even when the two DNA sequences are identical. The difference is an epigenetic mark, not the sequence.",
      elements: s1,
    },
    {
      titleHe: "החותם נקבע בתאי המין", titleEn: "Imprints Are Set in the Germ Line",
      descHe: "בתאי המין הקדמוניים החותמות הישנות נמחקות, ונקבעות מחדש לפי מין ההורה. באזור בקרת ההחתמה (ICR) של Igf2/H19 מוספות קבוצות מתיל לציטוזינים ברצפי CpG בזרעון, ולא בביצית. כך כל גמטה נושאת חותם של \"אבא\" או של \"אמא\".",
      descEn: "In the primordial germ cells old imprints are erased and reset according to the parent's sex. At the Igf2/H19 imprinting control region (ICR), methyl groups are added to cytosines in CpG sequences in sperm but not in eggs. Each gamete therefore carries a 'paternal' or 'maternal' imprint.",
      elements: s2,
    },
    {
      titleHe: "החותם נשמר בכל חלוקה", titleEn: "The Imprint Is Maintained",
      descHe: "אחרי ההפריה רוב המתילציה בגנום נמחקת, אבל החותמות של הגנים המוחתמים מוגנות ונשמרות. בכל שכפול DNA הגדיל החדש לא ממותל; האנזים DNMT1 מזהה את ה-CpG הממותל בגדיל ההורי ומוסיף מתיל מולו בגדיל החדש. כך החותם עובר לכל תאי הגוף.",
      descEn: "After fertilisation most genome methylation is erased, but the imprints are protected and kept. At every DNA replication the new strand is unmethylated; DNMT1 recognises the methylated CpG on the parental strand and methylates the new strand opposite it. The imprint thus passes to every cell of the body.",
      elements: s3,
    },
    {
      titleHe: "ביטוי לפי מקור ההורה: Igf2 ו-H19", titleEn: "Parent-Specific Expression: Igf2 and H19",
      descHe: "באלל מהאם ה-ICR לא ממותל, והחלבון CTCF נקשר אליו ומשמש מבודד: המגביר המשותף מפעיל רק את H19, ו-Igf2 שותק. באלל מהאב ה-ICR ממותל, CTCF לא נקשר, H19 מושתק — והמגביר מפעיל את Igf2 (גורם גדילה). לכן בעובר מבוטא Igf2 רק מהאלל של האב.",
      descEn: "On the maternal allele the ICR is unmethylated, so CTCF binds it and acts as an insulator: the shared enhancer activates only H19, and Igf2 is silent. On the paternal allele the ICR is methylated, CTCF cannot bind, H19 is silenced — and the enhancer activates Igf2 (a growth factor). The embryo therefore expresses Igf2 only from the father's allele.",
      elements: s4,
    },
    {
      titleHe: "אותה מוטציה — מחלה שונה", titleEn: "Same Mutation, Different Disease",
      descHe: "באזור 15q11–q13 יש גנים המבוטאים רק מהאב וגנים (כמו UBE3A במוח) המבוטאים רק מהאם. מחיקה של האזור בכרומוזום מהאב גורמת לתסמונת פראדר-וילי, ואותה מחיקה בכרומוזום מהאם גורמת לתסמונת אנג'למן — כי העותק השני מושתק מלכתחילה.",
      descEn: "Region 15q11–q13 contains genes expressed only from the father and genes (such as UBE3A in the brain) expressed only from the mother. Deleting the region on the paternal chromosome causes Prader-Willi syndrome, and the same deletion on the maternal chromosome causes Angelman syndrome — because the other copy is silenced to begin with.",
      elements: s5,
    },
  ],
};
