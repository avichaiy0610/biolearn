import { C, arrow, circle, dsDNA, ellipse, label, line, path, poly, rect, smooth, text, wave, type El, type ProcessScene, type Pt } from "./kit";

// Long noncoding RNAs with enhancer-like function — Ørom et al., Cell 2010
// (ncRNA-activators, GENCODE, 3,019 lncRNAs); Lai et al., Nature 2013
// (activating ncRNAs associate with Mediator and promote chromatin looping).
const f = (n: number) => Math.round(n * 10) / 10;
const LNC = "#059669", GENE = "#2563eb", DNA = "#475569";

/* ── shared: a DNA fibre drawn from 13 points so it can morph straight ↔ looped ── */
const STRAIGHT: Pt[] = Array.from({ length: 13 }, (_, i) => [20 + 30 * i, 180]);
const LOOP: Pt[] = [[20, 250], [60, 250], [96, 246], [124, 224], [132, 180], [152, 128], [200, 104], [248, 128], [268, 180], [276, 224], [304, 246], [340, 250], [380, 250]];
const fibre = (pts: Pt[]): El[] => [
  path("dna", smooth(pts, false, 0.5), { stroke: DNA, strokeWidth: 8 }),
  path("dna_in", smooth(pts, false, 0.5), { stroke: "#cbd5e1", strokeWidth: 3 }),
];
const seg = (id: string, pts: Pt[], a: number, b: number, color: string) => path(id, poly(pts.slice(a, b + 1), false), { stroke: color, strokeWidth: 10 });
const locus = (pts: Pt[]): El[] => [
  ...fibre(pts),
  seg("g_lnc", pts, 2, 3, LNC),
  seg("g_scl", pts, 9, 11, GENE),
];
const polII = (id: string, x: number, y: number, o: Partial<El> = {}) =>
  path(id, `M ${x - 20} ${y} C ${x - 22} ${y - 26} ${x + 22} ${y - 26} ${x + 20} ${y} C ${x + 22} ${y + 22} ${x - 22} ${y + 22} ${x - 20} ${y} Z`, { color: "#bfdbfe", fillOpacity: 0.85, stroke: "#1d4ed8", strokeWidth: 2, ...o });
const rnaStrand = (id: string, x1: number, x2: number, y: number, color = LNC, o: Partial<El> = {}) =>
  path(id, smooth(wave(x1, x2, y, 3, 9)), { stroke: color, strokeWidth: 3.5, ...o });

/* ── A. lncRNA with enhancer-like function ───────────────────────── */
const e1: El[] = [
  ...locus(STRAIGHT),
  arrow("tss_scl", 290, 160, 318, 160, GENE, 2.2),
  line("dist", 110, 206, 290, 206, C.muted, 1.5, { dash: "4 3" }),
  text("dist_t", 200, 228, "a few kb", "כמה קילו-בסיסים", { textColor: C.muted }),
  label("l_lnc", 14, 80, "lncRNA gene (ncRNA-a)", "גן ה-lncRNA (ncRNA-a)", [95, 180], { anchor: "start", shortHe: "גן lncRNA", short: "lncRNA gene" }),
  label("l_scl", 230, 80, "Neighbour gene (SCL/TAL1)", "גן שכן (SCL/TAL1)", [320, 180], { anchor: "start", shortHe: "גן SCL", short: "SCL gene" }),
  text("q", 200, 282, "both on the same chromosome", "שניהם על אותו כרומוזום", { textColor: C.muted, short: "same chromosome", shortHe: "אותו כרומוזום" }),
];
const e2: El[] = [
  ...locus(STRAIGHT),
  polII("pol_l", 96, 180),
  rnaStrand("lnc", 30, 90, 136),
  circle("lnc_cap", 30, 136, 5, "#065f46"),
  arrow("tss_scl", 290, 160, 318, 160, GENE, 2.2),
  label("l_pol", 150, 70, "RNA polymerase II", "RNA פולימראז II", [110, 170], { anchor: "start" }),
  label("l_rna", 14, 260, "lncRNA: >200 nt, no protein", "lncRNA: מעל 200 נ', לא מתורגם", [60, 136], { anchor: "start", shortHe: "lncRNA — לא מתורגם", short: "lncRNA, no protein" }),
  text("q", 290, 240, "SCL: low", "SCL: ביטוי נמוך", { textColor: GENE, weight: 700 }),
];
const MED: Pt[] = [[166, 214], [182, 196], [218, 196], [234, 214], [224, 236], [176, 236]];
const e3: El[] = [
  ...locus(LOOP),
  path("med", smooth(MED, true), { color: "#fde68a", stroke: "#b45309", strokeWidth: 2 }),
  polII("pol_l", 136, 214),
  rnaStrand("lnc", 150, 196, 210),
  circle("lnc_cap", 150, 210, 5, "#065f46"),
  polII("pol_s", 268, 214),
  rnaStrand("mrna", 284, 340, 196, "#7c3aed"),
  label("l_med", 14, 60, "Mediator complex", "קומפלקס Mediator", [190, 222], { anchor: "start" }),
  label("l_loop", 250, 60, "Chromatin loop", "לולאת כרומטין", [200, 104], { anchor: "start" }),
  label("l_m", 262, 290, "SCL mRNA ↑", "mRNA של SCL ↑", [330, 196], { anchor: "start", shortHe: "SCL ↑", short: "SCL ↑" }),
  label("l_cis", 14, 290, "Acts in cis on its neighbour", "פועל ב-cis על הגן השכן", [150, 216], { anchor: "start", shortHe: "פעולה ב-cis", short: "Acts in cis" }),
];
const bars = (p: string, x: number, y: number, hs: number[], labels: [string, string][], colors: string[]): El[] => [
  line(`${p}_ax`, x - 10, y, x + hs.length * 64 - 20, y, C.line, 1.5),
  ...hs.flatMap((h, i) => [
    rect(`${p}_b${i}`, x + i * 64, y - h, 34, h, colors[i], { rx: 2 }),
    text(`${p}_t${i}`, x + i * 64 + 17, y + 20, labels[i][0], labels[i][1], { fontSize: 16.5 }),
  ]),
];
const e4: El[] = [
  ...locus(STRAIGHT),
  rnaStrand("lnc", 40, 86, 128, LNC, { dash: "5 5" }),
  path("sirna", "M 44 118 L 74 118 M 44 112 L 74 112", { stroke: "#dc2626", strokeWidth: 3 }),
  ...bars("kd", 250, 110, [70, 22], [["ctrl", "בקרה"], ["siRNA", "siRNA"]], ["#93c5fd", "#93c5fd"]),
  text("kd_title", 290, 28, "SCL expression", "ביטוי SCL", { weight: 700, textColor: GENE }),
  label("l_si", 14, 250, "siRNA destroys the lncRNA", "siRNA מפרק את ה-lncRNA", [60, 118], { anchor: "start", shortHe: "פירוק ה-lncRNA", short: "lncRNA destroyed" }),
  text("l_res", 200, 284, "loop lost → neighbour gene drops", "הלולאה מתפרקת ← הגן השכן יורד", { weight: 700, short: "neighbour drops", shortHe: "הגן השכן יורד" }),
];
// reporter plasmid: lncRNA sequence + minimal promoter + luciferase
const arc = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const p = (a: number) => [f(cx + r * Math.cos((a * Math.PI) / 180)), f(cy + r * Math.sin((a * Math.PI) / 180))];
  const [x0, y0] = p(a0), [x1, y1] = p(a1);
  return `M ${x0} ${y0} A ${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1}`;
};
const e5: El[] = [
  circle("plas", 120, 160, 70, "none", { stroke: "#94a3b8", strokeWidth: 6 }),
  path("pl_lnc", arc(120, 160, 70, 190, 260), { stroke: LNC, strokeWidth: 10 }),
  path("pl_pro", arc(120, 160, 70, 272, 292), { stroke: "#1d4ed8", strokeWidth: 10 }),
  path("pl_luc", arc(120, 160, 70, 300, 400), { stroke: "#f59e0b", strokeWidth: 10 }),
  ...[[196, 120], [206, 150], [198, 182]].map(([x, y], i) => line(`ray${i}`, x, y, x + 16, y + (i - 1) * 8, "#f59e0b", 2.5)),
  ...bars("rep", 250, 230, [96, 26], [["control", "בקרה"], ["siRNA", "siRNA"]], ["#fcd34d", "#fcd34d"]),
  text("rep_title", 300, 110, "reporter light", "אור מדווח", { weight: 700, textColor: "#b45309" }),
  label("l_pl_lnc", 14, 44, "lncRNA sequence", "רצף ה-lncRNA", [64, 118], { anchor: "start" }),
  label("l_pl_luc", 150, 44, "Luciferase reporter", "לוציפראז (מדווח)", [180, 200], { anchor: "start", shortHe: "לוציפראז", short: "Luciferase" }),
  text("l_con", 200, 290, "the RNA itself is needed, not a peptide", "נדרש ה-RNA עצמו, לא חלבון מקודד", { weight: 700, short: "RNA itself needed", shortHe: "נדרש ה-RNA עצמו" }),
];

export const lncEnhancer: ProcessScene = {
  slug: "lncrna-enhancer-function",
  legend: [
    { color: LNC, he: "גן ה-lncRNA ותעתיקו", en: "lncRNA gene and transcript", swatch: "line" },
    { color: GENE, he: "גן שכן המקודד חלבון", en: "Neighbouring protein-coding gene", swatch: "line" },
    { color: "#1d4ed8", he: "RNA פולימראז II", en: "RNA polymerase II", swatch: "ring" },
    { color: "#b45309", he: "קומפלקס Mediator", en: "Mediator complex", swatch: "ring" },
    { color: "#dc2626", he: "siRNA", en: "siRNA", swatch: "line" },
  ],
  steps: [
    {
      titleHe: "גן lncRNA ליד גן מקודד", titleEn: "An lncRNA Gene Beside a Coding Gene",
      descHe: "בגנום האדם נמצאו lncRNAs — תעתיקים ארוכים מ-200 נוקלאוטידים שאינם מתורגמים לחלבון — שנמצאים כמה קילו-בסיסים מגנים מקודדים חשובים, כמו SCL (TAL1), המווסת הראשי של יצירת הדם. אורום ועמיתיו (Cell, 2010) שאלו אם lncRNAs כאלה משפיעים על הגן השכן.",
      descEn: "The human genome contains lncRNAs — transcripts longer than 200 nucleotides that are not translated — located a few kilobases from important coding genes, such as SCL (TAL1), the master regulator of blood formation. Ørom and colleagues (Cell, 2010) asked whether such lncRNAs affect the neighbouring gene.",
      elements: e1,
    },
    {
      titleHe: "שעתוק ה-lncRNA", titleEn: "The lncRNA Is Transcribed",
      descHe: "RNA פולימראז II משעתק את גן ה-lncRNA, והתעתיק מקבל כובע 5' כמו mRNA — אבל אין בו מסגרת קריאה משמעותית ולכן הוא לא מתורגם. lncRNAs כאלה, שהחוקרים כינו ncRNA-activators, מבוטאים ברמות נמוכות ולעתים באופן ספציפי לסוג תא.",
      descEn: "RNA polymerase II transcribes the lncRNA gene and the transcript is capped at its 5' end like an mRNA — but it has no meaningful reading frame, so it is not translated. Such lncRNAs, named ncRNA-activators, are expressed at low levels and often in a cell-type-specific way.",
      elements: e2,
    },
    {
      titleHe: "לולאת כרומטין דרך Mediator", titleEn: "A Chromatin Loop via Mediator",
      descHe: "ה-lncRNA פועל ב-cis — על הגן השכן באותו כרומוזום. מחקר המשך (Lai ועמיתיו, Nature 2013) הראה שהוא נקשר לקומפלקס Mediator ומסייע ליצור לולאת כרומטין שמקרבת את אתר ה-lncRNA לפרומוטור של הגן השכן. כך עולה שעתוק ה-mRNA — בדומה לפעולת מגביר DNA קלאסי.",
      descEn: "The lncRNA acts in cis — on the neighbouring gene on the same chromosome. Follow-up work (Lai et al., Nature 2013) showed it binds the Mediator complex and helps form a chromatin loop that brings the lncRNA locus close to the neighbour's promoter. mRNA transcription rises — like a classic DNA enhancer.",
      elements: e3,
    },
    {
      titleHe: "ניסוי השתקה (knock-down)", titleEn: "Knock-Down Experiment",
      descHe: "כשמפרקים את ה-lncRNA בעזרת siRNA — בלי לפגוע ב-DNA — ביטוי הגן השכן יורד (למשל SCL, וגם Snai1 ו-Snai2 במקרים אחרים). מכאן שמולקולת ה-RNA עצמה נדרשת להפעלה, ולא רק רצף ה-DNA של האתר.",
      descEn: "Destroying the lncRNA with siRNA — without touching the DNA — lowers the neighbouring gene's expression (for example SCL, and Snai1 and Snai2 in other cases). So the RNA molecule itself is needed for activation, not just the DNA sequence of the locus.",
      elements: e4,
    },
    {
      titleHe: "ניסוי מדווח (reporter)", titleEn: "Reporter Assay",
      descHe: "רצף ה-lncRNA הוכנס לפלסמיד לפני פרומוטור מינימלי וגן מדווח (לוציפראז), והגביר את ביטויו. השתקת ה-lncRNA ב-siRNA ביטלה את ההגברה, ושינוי מסגרות קריאה לא השפיע — כלומר התפקוד המגביר שייך ל-RNA עצמו ולא לפפטיד מקודד.",
      descEn: "The lncRNA sequence was placed in a plasmid ahead of a minimal promoter and a reporter gene (luciferase), and it boosted its expression. Knocking the lncRNA down with siRNA abolished the boost, and altering reading frames had no effect — the enhancer-like function belongs to the RNA itself, not to an encoded peptide.",
      elements: e5,
    },
  ],
};

/* ── B. lncRNAs in development and differentiation ───────────────── */
const rbc = (id: string, cx: number, cy: number) => ellipse(id, cx, cy, 13, 9, "#fca5a5", { stroke: "#b91c1c", strokeWidth: 1.5 });
const miniLocus = (p: string, x: number, y: number, geneName: string): El[] => [
  line(`${p}_d`, x - 50, y, x + 60, y, DNA, 5),
  line(`${p}_l`, x - 40, y, x - 14, y, LNC, 8),
  line(`${p}_g`, x + 14, y, x + 52, y, GENE, 8),
  path(`${p}_a`, `M ${x - 28} ${y - 8} C ${x - 20} ${y - 30} ${x + 22} ${y - 30} ${x + 30} ${y - 10}`, { stroke: LNC, strokeWidth: 2.2, arrow: true }),
  text(`${p}_t`, x + 33, y + 22, geneName, geneName, { ltr: true, weight: 800, textColor: GENE }),
];
const d1: El[] = [
  circle("hsc", 70, 170, 30, "#e0e7ff", { stroke: "#4338ca", strokeWidth: 2 }),
  circle("hsc_n", 70, 170, 18, "#4338ca", { fillOpacity: 0.35 }),
  arrow("a_rbc", 104, 160, 214, 120, C.line, 2.2), arrow("a_mk", 104, 176, 214, 220, C.line, 2.2),
  rbc("rbc1", 244, 112), rbc("rbc2", 272, 128), rbc("rbc3", 250, 140),
  path("mk", smooth([[230, 214], [252, 198], [280, 208], [284, 234], [258, 246], [234, 236]], true), { color: "#ddd6fe", stroke: "#6d28d9", strokeWidth: 1.8 }),
  ...[[296, 222], [304, 236], [292, 244]].map(([x, y], i) => circle(`plt${i}`, x, y, 3.5, "#a78bfa")),
  ...miniLocus("ml", 110, 60, "SCL"),
  label("l_hsc", 14, 250, "Blood stem cell", "תא גזע של הדם", [70, 196], { anchor: "start" }),
  label("l_ery", 262, 80, "Red cells", "תאי דם אדומים", [272, 124], { anchor: "start", shortHe: "תאי דם אדומים", short: "Red cells" }),
  label("l_mk", 310, 280, "Platelets", "טסיות", [300, 234], { anchor: "start" }),
  text("l_scl", 200, 28, "lncRNA → SCL (TAL1): blood master regulator", "lncRNA מפעיל את SCL — המווסת הראשי של יצירת הדם", { weight: 700, textColor: GENE, short: "lncRNA → SCL", shortHe: "lncRNA מפעיל את SCL" }),
];
const epi = (i: number, x: number, y: number): El[] => [
  rect(`ep${i}`, x, y, 34, 40, "#fed7aa", { rx: 3, stroke: "#c2410c", strokeWidth: 1.5 }),
  circle(`ep${i}_n`, x + 17, y + 20, 6, "#c2410c", { fillOpacity: 0.55 }),
];
const mes = (i: number, x: number, y: number, rot: number): El =>
  path(`ms${i}`, smooth([[x - 26, y + rot], [x - 6, y - 8], [x + 24, y - rot], [x + 6, y + 8]], true), { color: "#bae6fd", stroke: "#0369a1", strokeWidth: 1.5 });
const d2: El[] = [
  ...[0, 1, 2, 3].flatMap((i) => epi(i, 20 + i * 36, 150)),
  ...[1, 2, 3].map((i) => line(`jn${i}`, 20 + i * 36 - 1, 158, 20 + i * 36 - 1, 182, "#7c2d12", 3)),
  arrow("emt", 170, 170, 226, 170, C.line, 2.6),
  mes(0, 262, 130, 6), mes(1, 318, 170, -6), mes(2, 270, 214, 4), mes(3, 356, 226, -4),
  arrow("mig", 330, 130, 376, 104, "#0369a1", 2),
  ...miniLocus("ml", 110, 60, "Snai1"),
  label("l_epi", 14, 250, "Epithelial: E-cadherin junctions", "אפיתל: חיבורי E-cadherin", [56, 170], { anchor: "start", shortHe: "אפיתל", short: "Epithelial" }),
  label("l_mes", 240, 290, "Mesenchymal, migratory", "מזנכימלי ונודד", [290, 214], { anchor: "start" }),
  text("l_snai", 300, 60, "Snail represses E-cadherin", "Snail מדכא E-cadherin", { weight: 700, textColor: GENE, short: "Snail ⊣ E-cad", shortHe: "Snail ⊣ E-cad" }),
];
const NUC_CLOSED = [110, 150, 190, 230, 270], NUC_OPEN = [60, 130, 200, 290, 350];
const nucleosomes = (xs: number[], open: boolean): El[] => [
  line("chr", 20, 170, 380, 170, DNA, 3),
  ...xs.map((x, i) => ellipse(`nu${i}`, x, 170, 16, 13, "#e9d5ff", { stroke: "#7e22ce", strokeWidth: 1.8 })),
  ...xs.map((x, i) => text(`ac${i}`, x, 150, "Ac", "Ac", { ltr: true, weight: 800, textColor: "#16a34a", opacity: open ? 1 : 0 })),
];
const d3: El[] = [
  ...nucleosomes(NUC_OPEN, true),
  rnaStrand("lnc", 90, 150, 110),
  path("med", smooth([[160, 118], [176, 100], [206, 100], [222, 118], [210, 134], [172, 134]], true), { color: "#fde68a", stroke: "#b45309", strokeWidth: 2 }),
  polII("pol", 250, 170),
  label("l_nu", 14, 250, "Nucleosomes spread apart", "נוקלאוזומים מתרווחים", [130, 180], { anchor: "start", shortHe: "כרומטין פתוח", short: "Open chromatin" }),
  label("l_ac", 250, 50, "Acetylated histones", "היסטונים מאוצטלים", [290, 146], { anchor: "start", shortHe: "אצטילציה", short: "Acetylation" }),
  label("l_p", 14, 50, "lncRNA recruits partners", "ה-lncRNA מגייס חלבונים", [190, 104], { anchor: "start", shortHe: "גיוס חלבונים", short: "Recruits partners" }),
  label("l_pol", 280, 250, "Pol II can bind", "Pol II נקשר", [258, 186], { anchor: "start" }),
];
const d4: El[] = [
  rect("bm", 0, 150, 400, 8, "#a8a29e", { rx: 0 }),
  ...[0, 1, 2, 3, 4].flatMap((i) => epi(i, 14 + i * 38, 108)),
  mes(0, 230, 178, 6), mes(1, 268, 206, -6),
  arrow("inv", 220, 128, 236, 170, "#0369a1", 2.2),
  rect("ves", 290, 230, 110, 40, "#fee2e2", { rx: 20, stroke: "#dc2626", strokeWidth: 2 }),
  arrow("intra", 286, 214, 316, 238, "#0369a1", 2.2),
  label("l_bm", 14, 200, "Basement membrane", "קרום בסיסי", [60, 156], { anchor: "start" }),
  label("l_inv", 14, 260, "EMT: cells invade", "EMT: התאים חודרים", [236, 190], { anchor: "start" }),
  label("l_ves", 300, 60, "Into blood vessels", "אל כלי הדם", [330, 234], { anchor: "start" }),
  text("l_meta", 200, 290, "metastasis", "גרורות", { weight: 800, textColor: "#dc2626" }),
];

export const lncDevelopment: ProcessScene = {
  slug: "lncrna-development-differentiation",
  meta: {
    topic: "molecular-biology",
    nameHe: "תפקיד lncRNA בהתפתחות והבדלה תאים", nameEn: "lncRNA Role in Development and Cell Differentiation",
    descHe: "אנימציה: תפקיד lncRNA בהתפתחות והבדלה תאים", descEn: "Animation: lncRNA Role in Development and Cell Differentiation",
    source: "Ørom et al., Cell 2010",
  },
  legend: [
    { color: LNC, he: "lncRNA", en: "lncRNA", swatch: "line" },
    { color: GENE, he: "גן מטרה (SCL / Snai1)", en: "Target gene (SCL / Snai1)", swatch: "line" },
    { color: "#c2410c", he: "תאי אפיתל", en: "Epithelial cells", swatch: "ring" },
    { color: "#0369a1", he: "תאים מזנכימליים", en: "Mesenchymal cells", swatch: "ring" },
    { color: "#7e22ce", he: "נוקלאוזום", en: "Nucleosome", swatch: "ring" },
  ],
  steps: [
    {
      titleHe: "יצירת דם: lncRNA מפעיל את SCL", titleEn: "Blood Formation: an lncRNA Activates SCL",
      descHe: "SCL (TAL1) הוא גורם שעתוק המכוון תאי גזע של הדם להתמיין, בין היתר לתאי דם אדומים ולמגה-קריוציטים שמהם נוצרות טסיות. lncRNA הנמצא ליד גן SCL נדרש להפעלתו: השתקת ה-lncRNA מורידה את ביטוי SCL.",
      descEn: "SCL (TAL1) is a transcription factor that drives blood stem cells to differentiate, among others into red cells and the megakaryocytes that make platelets. An lncRNA next to the SCL gene is needed to activate it: silencing the lncRNA lowers SCL expression.",
      elements: d1,
    },
    {
      titleHe: "EMT: lncRNA מפעיל את Snai1", titleEn: "EMT: an lncRNA Activates Snai1",
      descHe: "Snai1 מקודד את גורם השעתוק Snail, המדכא את E-cadherin — חלבון החיבורים בין תאי אפיתל. כשהוא מופעל התאים מאבדים את החיבורים ואת הקוטביות והופכים לתאים מזנכימליים נודדים (EMT) — תהליך חיוני בהתפתחות העובר. lncRNA הסמוך ל-Snai1 מגביר את ביטויו.",
      descEn: "Snai1 encodes the transcription factor Snail, which represses E-cadherin — the junction protein between epithelial cells. When it is switched on, cells lose junctions and polarity and become migratory mesenchymal cells (EMT) — essential in embryonic development. An lncRNA next to Snai1 boosts its expression.",
      elements: d2,
    },
    {
      titleHe: "המנגנון: כרומטין פתוח", titleEn: "Mechanism: Permissive Chromatin",
      descHe: "ה-lncRNA מגייס שותפים חלבוניים — כמו Mediator ומשני כרומטין — לאתר הגן השכן. ההיסטונים עוברים אצטילציה, הנוקלאוזומים מתרווחים והכרומטין נפתח, כך ש-RNA פולימראז II וגורמי שעתוק יכולים להיקשר לפרומוטור.",
      descEn: "The lncRNA recruits protein partners — such as Mediator and chromatin modifiers — to the neighbouring gene. Histones become acetylated, nucleosomes spread apart and the chromatin opens, so RNA polymerase II and transcription factors can bind the promoter.",
      elements: d3,
    },
    {
      titleHe: "הקשר למחלה: סרטן", titleEn: "Link to Disease: Cancer",
      descHe: "אותה תוכנית EMT שמאפשרת לתאים לנדוד בעובר יכולה להיות מופעלת שלא כהלכה בגידולים: תאי סרטן מאבדים E-cadherin, חודרים דרך הקרום הבסיסי, נכנסים לכלי הדם ויוצרים גרורות. ויסות שגוי של lncRNAs שמפעילים גנים כמו Snai1 הוא אחד הגורמים שנחקרים.",
      descEn: "The same EMT programme that lets embryonic cells migrate can be switched on wrongly in tumours: cancer cells lose E-cadherin, cross the basement membrane, enter blood vessels and form metastases. Misregulation of lncRNAs that activate genes like Snai1 is one factor under study.",
      elements: d4,
    },
  ],
};

/* ── C. GENCODE annotation and lncRNA discovery ──────────────────── */
// transcript models: exons as boxes joined by thin introns
const tx = (id: string, x: number, y: number, exons: [number, number][], color: string, o: Partial<El> = {}): El[] => [
  line(`${id}_i`, x + exons[0][0], y, x + exons[exons.length - 1][1], y, color, 1.5, o),
  ...exons.map(([a, b], i) => rect(`${id}_e${i}`, x + a, y - 7, b - a, 14, color, { rx: 2, ...o })),
];
const ROWS: { id: string; x: number; y: number; ex: [number, number][]; kind: "coding" | "overlap" | "near" | "small" | "keep" }[] = [
  { id: "pc1", x: 30, y: 70, ex: [[0, 30], [60, 90], [130, 170]], kind: "coding" },
  { id: "ov1", x: 70, y: 100, ex: [[0, 24], [50, 80]], kind: "overlap" },
  { id: "nr1", x: 210, y: 70, ex: [[0, 26], [40, 60]], kind: "near" },
  { id: "k1", x: 290, y: 100, ex: [[0, 30], [50, 80]], kind: "keep" },
  { id: "sm1", x: 60, y: 140, ex: [[0, 12]], kind: "small" },
  { id: "pc2", x: 150, y: 140, ex: [[0, 40], [70, 110], [140, 180]], kind: "coding" },
  { id: "k2", x: 30, y: 180, ex: [[0, 40], [70, 100]], kind: "keep" },
  { id: "ov2", x: 190, y: 170, ex: [[0, 30], [60, 90]], kind: "overlap" },
  { id: "sm2", x: 300, y: 200, ex: [[0, 12]], kind: "small" },
  { id: "k3", x: 180, y: 220, ex: [[0, 30], [60, 110]], kind: "keep" },
];
const COL = { coding: GENE, overlap: LNC, near: LNC, small: "#94a3b8", keep: LNC };
// removed = struck out by a filter; faded = just dimmed (context, e.g. the coding genes at the end)
const models = (removed: Set<string>, faded: Set<string> = new Set()): El[] => ROWS.flatMap((r) => {
  const out = removed.has(r.kind), dim = out || faded.has(r.kind);
  return [
    ...tx(r.id, r.x, r.y, r.ex, COL[r.kind], { opacity: dim ? 0.18 : 1 }),
    line(`${r.id}_x`, r.x - 4, r.y - 10, r.x + r.ex[r.ex.length - 1][1] + 4, r.y + 10, "#dc2626", 2.2, { opacity: out ? 1 : 0 }),
  ];
});
const g1: El[] = [
  ...models(new Set()),
  label("l_pc", 14, 280, "Protein-coding genes", "גנים מקודדי חלבון", [60, 70], { anchor: "start", shortHe: "גנים מקודדים", short: "Coding genes" }),
  label("l_cand", 230, 280, "Candidate ncRNAs", "מועמדים לא-מקודדים", [320, 100], { anchor: "start", shortHe: "מועמדים", short: "Candidates" }),
  text("l_gc", 200, 28, "GENCODE: all annotated transcripts", "GENCODE: כל התעתיקים המתוארים", { weight: 700, short: "GENCODE", shortHe: "GENCODE" }),
];
const g2: El[] = [
  ...models(new Set(["overlap"])),
  label("l_ov", 14, 280, "Overlaps a coding gene → out", "חופף לגן מקודד ← מוצא", [100, 100], { anchor: "start", shortHe: "חופף ← מוצא", short: "Overlap → out" }),
  text("l_f1", 200, 28, "filter 1: overlap with coding genes", "סינון 1: חפיפה לגנים מקודדים", { weight: 700, short: "filter 1", shortHe: "סינון 1" }),
];
const g3: El[] = [
  rect("zone1", 200, 56, 20, 28, "#fde68a", { rx: 2, fillOpacity: 0.7 }),
  ...models(new Set(["overlap", "near", "small"])),
  label("l_1kb", 220, 252, "≤1 kb from TSS/TES → out", "עד 1 ק\"ב מקצה גן ← מוצא", [210, 70], { anchor: "start", shortHe: "עד 1 ק\"ב ← מוצא", short: "≤1 kb → out" }),
  label("l_sm", 14, 280, "Known small ncRNAs → out", "RNA קטנים ידועים ← מוצאים", [66, 140], { anchor: "start", shortHe: "RNA קטנים ← מוצאים", short: "small RNAs → out" }),
  text("l_f2", 200, 28, "filter 2: distance and known classes", "סינון 2: מרחק וסוגים ידועים", { weight: 700, short: "filter 2", shortHe: "סינון 2" }),
];
const cellIcon = (id: string, x: number, y: number, kind: number): El =>
  kind === 0
    ? path(id, smooth([[x - 26, y], [x - 6, y - 7], [x + 26, y - 2], [x + 6, y + 7]], true), { color: "#bae6fd", stroke: "#0369a1", strokeWidth: 1.5 })
    : kind === 1
      ? circle(id, x, y, 13, "#fecaca", { stroke: "#b91c1c", strokeWidth: 1.5 })
      : rect(id, x - 20, y - 9, 40, 18, "#fed7aa", { rx: 3, stroke: "#c2410c", strokeWidth: 1.5 });
const g4: El[] = [
  ...models(new Set(), new Set(["overlap", "near", "small", "coding"])),
  label("l_n", 290, 170, "3,019 lncRNAs", "3,019 lncRNAs", [235, 220], { anchor: "start", ltr: true, weight: 800, textColor: LNC }),
  cellIcon("c_fib", 70, 258, 0), cellIcon("c_hela", 190, 258, 1), cellIcon("c_ker", 300, 258, 2),
  text("t_fib", 70, 290, "fibroblasts", "פיברובלסטים", { fontSize: 16.5 }),
  text("t_hela", 190, 290, "HeLa", "HeLa", { ltr: true, fontSize: 16.5 }),
  text("t_ker", 300, 290, "keratinocytes", "קרטינוציטים", { fontSize: 16.5 }),
  text("l_res", 200, 28, "expression profiled in 3 cell types", "הביטוי נבדק ב-3 סוגי תאים", { weight: 700, short: "3 cell types", shortHe: "3 סוגי תאים" }),
];

export const gencode: ProcessScene = {
  slug: "gencode-lncrna-discovery",
  legend: [
    { color: GENE, he: "גן מקודד חלבון", en: "Protein-coding gene", swatch: "line" },
    { color: LNC, he: "תעתיק לא-מקודד מועמד", en: "Candidate noncoding transcript", swatch: "line" },
    { color: "#94a3b8", he: "RNA קטן ידוע (snoRNA, miRNA…)", en: "Known small RNA (snoRNA, miRNA…)", swatch: "line" },
    { color: "#dc2626", he: "הוצא בסינון", en: "Removed by a filter", swatch: "line" },
    { color: "#fde68a", he: "אזור 1 ק\"ב סביב קצות גן", en: "1 kb zone around gene ends", swatch: "dot" },
  ],
  steps: [
    {
      titleHe: "נקודת המוצא: אנוטציית GENCODE", titleEn: "Starting Point: the GENCODE Annotation",
      descHe: "GENCODE הוא מיפוי מפורט ומאומת של כל התעתיקים בגנום האדם — גנים מקודדי חלבון, RNA קטנים ותעתיקים לא-מקודדים. כל תעתיק מתואר כמודל של אקסונים (תיבות) ואינטרונים (קווים). מתוכו חיפשו החוקרים תעתיקים ארוכים שאינם מקודדים.",
      descEn: "GENCODE is a detailed, verified map of every transcript in the human genome — protein-coding genes, small RNAs and noncoding transcripts. Each transcript is drawn as a model of exons (boxes) and introns (lines). The researchers searched it for long noncoding transcripts.",
      elements: g1,
    },
    {
      titleHe: "סינון 1: חפיפה לגנים מקודדים", titleEn: "Filter 1: Overlap with Coding Genes",
      descHe: "כל תעתיק מועמד שחופף לגן מקודד חלבון הוצא — כדי שלא להתבלבל עם תעתיקים חלופיים של גנים מקודדים, ושההשפעה שתימדד תהיה של ה-lncRNA ולא של גן מקודד באותו אתר.",
      descEn: "Every candidate transcript overlapping a protein-coding gene was removed — to avoid confusing it with alternative transcripts of coding genes, and so that any effect measured belongs to the lncRNA rather than to a coding gene at the same site.",
      elements: g2,
    },
    {
      titleHe: "סינון 2: מרחק מגנים וסוגים ידועים", titleEn: "Filter 2: Distance and Known Classes",
      descHe: "הוצאו גם תעתיקים שנמצאים עד 1 קילו-בסיס מאתר תחילת השעתוק (TSS) או סיומו (TES) של גן מקודד — שעשויים להיות חלק מהפרומוטור או המשך של הגן — וכן סוגים ידועים של RNA קטן לא-מקודד, כמו snoRNA ו-miRNA.",
      descEn: "Transcripts within 1 kb of a coding gene's transcription start (TSS) or end (TES) were removed as well — they might be part of its promoter or run-on — along with known classes of small noncoding RNA such as snoRNAs and miRNAs.",
      elements: g3,
    },
    {
      titleHe: "התוצאה: 3,019 lncRNAs", titleEn: "Result: 3,019 lncRNAs",
      descHe: "אחרי הסינון נותרו 3,019 lncRNAs מועמדים. הביטוי שלהם נבדק בפיברובלסטים, בתאי HeLa ובקרטינוציטים ראשוניים — ורבים מהם בוטאו באופן ספציפי לסוג תא. מתוכם נבחרו lncRNAs הסמוכים לגנים חשובים לבדיקת תפקוד מגביר.",
      descEn: "After filtering, 3,019 candidate lncRNAs remained. Their expression was profiled in fibroblasts, HeLa cells and primary keratinocytes — many were cell-type specific. From these, lncRNAs next to important genes were chosen to test for enhancer-like function.",
      elements: g4,
    },
  ],
};

/* ── D. lncRNA conservation and genomic context ──────────────────── */
const SPECIES: [string, string][] = [["human", "אדם"], ["mouse", "עכבר"], ["dog", "כלב"], ["chicken", "תרנגולת"]];
const cons = [1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0];
const align = (show: boolean): El[] => SPECIES.flatMap(([en, he], r) => [
  text(`sp${r}`, 70, 62 + r * 30, en, he, { anchor: "end", fontSize: 16.5, opacity: show ? 1 : 0 }),
  ...cons.map((c, i) => rect(`al${r}_${i}`, 84 + i * 20, 48 + r * 30, 16, 20, r === 0 ? "#e2e8f0" : c ? "#86efac" : "#fecaca", { rx: 2, opacity: show ? 1 : 0 })),
]);
const c1: El[] = [
  ...align(true),
  ...cons.map((c, i) => rect(`pc${i}`, 84 + i * 20, 250 - (c ? 70 : 18), 16, c ? 70 : 18, "#16a34a", { rx: 1 })),
  line("pc_ax", 80, 250, 366, 250, C.line, 1.5),
  label("l_col", 250, 290, "Conserved column", "עמודה שמורה", [104, 110], { anchor: "start" }),
  text("l_pc", 30, 200, "phastCons", "phastCons", { anchor: "start", ltr: true, weight: 800, textColor: "#16a34a" }),
];
const CMP: [string, string, number, string][] = [["coding", "מקודד", 150, GENE], ["promoter", "פרומוטור", 104, "#0d9488"], ["lncRNA", "lncRNA", 76, LNC], ["random", "אקראי", 28, "#94a3b8"]];
const c2: El[] = [
  line("ax", 40, 250, 380, 250, C.line, 2),
  ...CMP.flatMap(([en, he, h, col], i) => [
    rect(`cb${i}`, 60 + i * 82, 250 - h, 50, h, col, { rx: 3 }),
    text(`ct${i}`, 85 + i * 82, 274, en, he, { fontSize: 16.5 }),
  ]),
  text("ylab", 44, 40, "conservation (phastCons, schematic)", "מידת שימור (phastCons, סכמטי)", { anchor: "start", textColor: C.muted, short: "conservation", shortHe: "מידת שימור" }),
  label("l_mid", 260, 70, "Below coding, above random", "פחות ממקודד, יותר מאקראי", [228, 180], { anchor: "start", shortHe: "בין מקודד לאקראי", short: "In between" }),
];
// double-stranded DNA with polarity: top strand 5'→3' (sense for the coding gene), bottom 3'→5'
const ctxDNA: El[] = dsDNA("cd", 30, 370, 157, { tags: true, gap: 14, top: DNA, bottom: DNA });
const c3: El[] = [
  ...ctxDNA,
  rect("cg", 230, 138, 110, 16, GENE, { rx: 3 }),
  arrow("cg_a", 240, 126, 330, 126, GENE, 2.4),
  rect("cl", 70, 138, 70, 16, LNC, { rx: 3 }),
  arrow("cl_a", 78, 126, 136, 126, LNC, 2.4),
  line("dist", 140, 194, 230, 194, C.muted, 1.5, { dash: "4 3" }),
  text("dist_t", 185, 216, "a few kb", "כמה ק\"ב", { textColor: C.muted }),
  label("l_same", 14, 60, "Same orientation, upstream", "באותו כיוון, לפני הגן", [100, 132], { anchor: "start", shortHe: "באותו כיוון", short: "Same direction" }),
  label("l_gene", 240, 60, "Regulated coding gene", "הגן המקודד המווסת", [290, 138], { anchor: "start", shortHe: "גן מקודד", short: "Coding gene" }),
];
const c4: El[] = [
  ...ctxDNA,
  rect("cg", 230, 138, 110, 16, GENE, { rx: 3 }),
  arrow("cg_a", 240, 126, 330, 126, GENE, 2.4),
  rect("cl", 190, 160, 90, 16, LNC, { rx: 3 }),
  arrow("cl_a", 272, 190, 196, 190, LNC, 2.4),
  label("l_anti", 14, 250, "Antisense: opposite strand", "אנטיסנס: על הגדיל הנגדי", [236, 176], { anchor: "start", shortHe: "אנטיסנס", short: "Antisense" }),
  label("l_gene", 240, 60, "Regulated coding gene", "הגן המקודד המווסת", [290, 138], { anchor: "start", shortHe: "גן מקודד", short: "Coding gene" }),
  text("l_ctx", 200, 290, "position matters for acting in cis", "המיקום חשוב לפעולה ב-cis", { weight: 700, short: "position matters", shortHe: "המיקום חשוב" }),
];

export const lncConservation: ProcessScene = {
  slug: "lncrna-conservation-genomic-context",
  legend: [
    { color: "#16a34a", he: "שימור ברצף (phastCons)", en: "Sequence conservation (phastCons)", swatch: "dot" },
    { color: GENE, he: "גן מקודד חלבון", en: "Protein-coding gene", swatch: "line" },
    { color: LNC, he: "lncRNA", en: "lncRNA", swatch: "line" },
    { color: "#0d9488", he: "פרומוטור של lncRNA", en: "lncRNA promoter", swatch: "line" },
    { color: C.line, he: "כיוון השעתוק", en: "Direction of transcription", swatch: "arrow" },
  ],
  steps: [
    {
      titleHe: "מדידת שימור: phastCons", titleEn: "Measuring Conservation: phastCons",
      descHe: "כדי לבדוק אם רצף חשוב לתפקוד משווים אותו בין מינים. phastCons מחשב לכל בסיס את ההסתברות שהוא נמצא באזור שמור ביישור של גנומים של מינים רבים: אזורים ששמורים לאורך מיליוני שנות אבולוציה כנראה נתונים לאילוץ תפקודי.",
      descEn: "To test whether a sequence matters, it is compared across species. phastCons gives each base the probability that it lies in a conserved element of a multi-species genome alignment: regions kept through millions of years of evolution are probably under functional constraint.",
      elements: c1,
    },
    {
      titleHe: "lncRNA: שמורים במידה בינונית", titleEn: "lncRNAs: Moderately Conserved",
      descHe: "האקסונים של ה-lncRNAs שמורים פחות מאקסונים של גנים מקודדי חלבון, אבל משמעותית יותר מאזורים אקראיים בין גנים — סימן לאילוץ תפקודי. גם הפרומוטורים שלהם שמורים, כצפוי מאתרים שמווסתים שעתוק. (הגבהים בתרשים סכמטיים.)",
      descEn: "lncRNA exons are less conserved than protein-coding exons, but clearly more than random intergenic regions — a sign of functional constraint. Their promoters are conserved too, as expected for sites that control transcription. (Bar heights are schematic.)",
      elements: c2,
    },
    {
      titleHe: "מיקום: כמה קילו-בסיסים מהגן", titleEn: "Position: a Few kb from the Gene",
      descHe: "רבים מה-lncRNAs בעלי התפקוד המגביר נמצאים במרחק של כמה קילו-בסיסים בלבד מהגן המקודד שהם מווסתים, לעתים באותו כיוון שעתוק — קרבה שמאפשרת לפעול עליו ב-cis, בדומה למגביר.",
      descEn: "Many enhancer-like lncRNAs lie only a few kilobases from the coding gene they regulate, sometimes in the same transcriptional orientation — proximity that lets them act on it in cis, like an enhancer.",
      elements: c3,
    },
    {
      titleHe: "lncRNA אנטיסנס", titleEn: "Antisense lncRNAs",
      descHe: "חלק מה-lncRNAs מתועתקים מהגדיל הנגדי (אנטיסנס) וחופפים חלקית לגן או לאזור הפרומוטור שלו. ההקשר הגנומי — מרחק, כיוון וחפיפה — מסייע לחזות על איזה גן lncRNA עשוי לפעול, ולכן הוא חלק חשוב בהבנת תפקודם.",
      descEn: "Some lncRNAs are transcribed from the opposite strand (antisense) and partly overlap a gene or its promoter region. Genomic context — distance, orientation and overlap — helps predict which gene an lncRNA may act on, and is an important part of understanding their function.",
      elements: c4,
    },
  ],
};
