import { C, arrow, badge, bilayer, circle, ellipse, label, line, path, poly, rect, ring, smooth, text, type El, type ProcessScene, type Pt } from "./kit";

const NADH = C.redox, ATPC = C.energy;
const coa = (id: string, x: number, y: number): El[] => [
  ellipse(id, x, y, 20, 12, "#fecdd3", { stroke: "#be123c", strokeWidth: 1.6 }),
  text(`${id}_t`, x, y + 6, "CoA", "CoA", { ltr: true, weight: 700, halo: false, textColor: "#9f1239", fontSize: 16.5 }),
];
// fatty-acyl chain drawn as a zig-zag of n carbons ending at x0 (thioester end on the right)
const chain = (id: string, x0: number, y: number, n: number, color = "#78350f"): El => {
  const pts: Pt[] = Array.from({ length: n }, (_, i) => [x0 - (n - 1 - i) * 14, y + (i % 2 ? -7 : 7)]);
  return path(id, poly(pts, false), { stroke: color, strokeWidth: 3.5 });
};
const mitoWall = (x: number): El[] => [
  line("om", x, 30, x, 280, "#c2410c", 3), line("im", x + 12, 30, x + 12, 280, "#ea580c", 3, { dash: "6 3" }),
];

/* ══ β-OXIDATION (Lehninger 8e ch. 17) ═════════════════════════════ */
// matrix context: inner membrane (with ETF/Q path) framing the matrix
const matrixBg = (): El[] => [
  rect("mx", 6, 28, 388, 266, "#fff7ed", { rx: 26, stroke: "#ea580c", strokeWidth: 2.5, dash: "7 4" }),
  text("mx_t", 18, 50, "matrix", "מטריצה", { anchor: "start", weight: 700, textColor: "#9a3412", fontSize: 16.5 }),
];
const b1: El[] = [
  ...matrixBg().map((e) => ({ ...e, opacity: 0 })), // paints under the chain in later steps
  ...mitoWall(200),
  chain("fa", 150, 80, 8), ...coa("coa1", 176, 80),
  path("cpt", smooth([[196, 150], [204, 136], [218, 140], [222, 160], [206, 166]], true), { color: "#fde68a", stroke: "#b45309", strokeWidth: 1.6 }),
  arrow("shuttle", 160, 150, 250, 150, C.line, 2.4),
  chain("fa2", 318, 150, 8), ...coa("coa2", 344, 150),
  ...badge("atp", 100, 130, "ATP → AMP", ATPC, { w: 104 }),
  label("l_act", 14, 250, "Activated: fatty acyl-CoA", "שפעול: אציל-CoA", [150, 88], { anchor: "start" }),
  label("l_car", 214, 250, "Carnitine shuttle", "מעבורת קרניטין", [210, 160], { anchor: "start" }),
  text("cyt", 100, 290, "cytosol", "ציטוזול", { weight: 700, textColor: C.muted }),
  text("mat", 300, 290, "matrix", "מטריצה", { weight: 700, textColor: "#9a3412" }),
];
// one station of the β-oxidation round: C4 of the acyl chain (Cβ highlighted) + CoA, with the change at Cβ
const station = (p: string, x: number, y: number, mod: "none" | "double" | "oh" | "keto" | "split"): El[] => {
  const pts: Pt[] = [[x - 48, y + 6], [x - 34, y - 6], [x - 20, y + 6], [x - 6, y - 6]]; // ω … Cβ(x-20) Cα(x-6)
  const els: El[] = [
    path(`${p}_ch`, poly(mod === "split" ? pts.slice(0, 2) : pts, false), { stroke: "#78350f", strokeWidth: 3.2 }),
    circle(`${p}_cb`, x - 20, y + 6, 4.5, "#f97316", { stroke: "#fff", strokeWidth: 1 }),
    ...coa(`${p}_coa`, x + 20, y - 4),
  ];
  if (mod === "double") els.push(line(`${p}_db`, x - 19, y + 1, x - 8, y - 9, "#78350f", 2.2));
  if (mod === "oh") els.push(text(`${p}_oh`, x - 20, y + 30, "OH", "OH", { ltr: true, weight: 700, fontSize: 16.5, textColor: "#0369a1" }));
  if (mod === "keto") els.push(line(`${p}_o1`, x - 22, y + 10, x - 22, y + 20, "#b91c1c", 2), line(`${p}_o2`, x - 18, y + 10, x - 18, y + 20, "#b91c1c", 2), text(`${p}_o`, x - 20, y + 36, "O", "O", { ltr: true, weight: 700, fontSize: 16.5, textColor: "#b91c1c" }));
  if (mod === "split") els.push(path(`${p}_ac`, `M ${x - 20} ${y + 6} L ${x - 6} ${y - 6}`, { stroke: "#78350f", strokeWidth: 3.2 }), line(`${p}_cut`, x - 28, y - 10, x - 24, y + 14, "#dc2626", 2.4));
  return els;
};
const ST: [number, number][] = [[112, 96], [300, 96], [300, 206], [112, 206]];
const b2: El[] = [
  ...matrixBg(),
  ...station("s1", ...ST[0], "double"), ...station("s2", ...ST[1], "oh"),
  arrow("r12", 170, 90, 236, 90, C.line, 2.2),
  text("n1", 112, 72, "1 oxidation", "1 · חמצון", { weight: 700, fontSize: 16.5 }),
  text("n2", 300, 72, "2 hydration", "2 · הוספת מים", { weight: 700, fontSize: 16.5 }),
  ...badge("ox1", 200, 116, "FADH₂", NADH), ...badge("hyd", 300, 150, "H₂O", "#0ea5e9"),
  circle("etf", 200, 40, 9, "#ccfbf1", { stroke: "#0f766e", strokeWidth: 1.5 }),
  arrow("to_etf", 200, 102, 200, 54, NADH, 2),
  text("etf_t", 216, 46, "ETF → Q", "ETF → Q", { anchor: "start", ltr: true, fontSize: 16.5, weight: 700, textColor: "#0f766e" }),
  label("l_cb", 40, 250, "Cβ is oxidised (hence β-oxidation)", "פחמן β מחומצן — ומכאן השם", [92, 102], { anchor: "start", shortHe: "פחמן β", short: "Cβ" }),
];
const b2b: El[] = [
  ...matrixBg(),
  ...station("s3", ...ST[2], "keto"), ...station("s4", ...ST[3], "split"),
  arrow("r34", 236, 212, 170, 212, C.line, 2.2),
  text("n3", 300, 256, "3 oxidation", "3 · חמצון", { weight: 700, fontSize: 16.5 }),
  text("n4", 112, 256, "4 thiolysis", "4 · תיאוליזה", { weight: 700, fontSize: 16.5 }),
  ...badge("ox2", 200, 236, "NADH", NADH), ...badge("thi", 112, 160, "+ CoA", "#be123c", { w: 70 }),
  label("l_out", 150, 80, "Released: acetyl-CoA (2 C)", "משתחרר אצטיל-CoA (2 פחמנים)", [ST[3][0] - 12, ST[3][1]], { anchor: "start", textColor: "#be123c", shortHe: "אצטיל-CoA", short: "acetyl-CoA" }),
];
const b3: El[] = [
  ...matrixBg(),
  chain("fa2", 130, 70, 4), ...coa("coa2", 156, 70),
  ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => { const x = 50 + (i % 4) * 90, y = 140 + Math.floor(i / 4) * 56; return path(`ac${i}`, `M ${x - 10} ${y + 5} L ${x} ${y - 5}`, { stroke: "#78350f", strokeWidth: 3.5 }); }),
  ...[0, 1, 2, 3, 4, 5, 6, 7].flatMap((i) => { const x = 50 + (i % 4) * 90, y = 140 + Math.floor(i / 4) * 56; return coa(`ca${i}`, x + 26, y); }),
  label("l_pal", 190, 26, "Palmitoyl-CoA (C16): 7 rounds", "פלמיטויל-CoA: 7 סבבים", [120, 70], { anchor: "start", shortHe: "7 סבבים", short: "C16: 7 rounds" }),
  ...badge("n_ac", 100, 272, "8 acetyl-CoA", "#be123c", { w: 116, he: "8 אצטיל-CoA" }), ...badge("n_fad", 220, 272, "7 FADH₂", NADH, { w: 84 }), ...badge("n_nad", 320, 272, "7 NADH", NADH, { w: 80 }),
];
const b4: El[] = [
  ...matrixBg(),
  ...bilayer("imb", 12, 388, 262, { th: 14 }),
  ...coa("ca0", 70, 90),
  arrow("tca", 96, 90, 160, 90, C.line, 2.2),
  path("cyc", "M 200 60 A 36 36 0 1 1 199.9 60", { stroke: "#be123c", strokeWidth: 3 }),
  text("cyc_t", 200, 102, "TCA", "TCA", { ltr: true, weight: 700, textColor: "#be123c" }),
  ...badge("fad", 90, 190, "FADH₂", NADH), ...badge("nad", 170, 190, "NADH", NADH),
  arrow("etc", 210, 190, 270, 190, NADH, 2.2),
  arrow("etc_down", 170, 206, 170, 250, NADH, 2),
  ...badge("atpy", 326, 190, "≈106 ATP", ATPC, { w: 96 }),
  label("l_tca", 250, 60, "Acetyl-CoA → citric acid cycle", "אצטיל-CoA נכנס למעגל קרבס", [236, 96], { anchor: "start", shortHe: "מעגל קרבס", short: "TCA cycle" }),
  label("l_etc", 196, 240, "Electrons → respiratory chain", "האלקטרונים לשרשרת הנשימה", [170, 258], { anchor: "start", shortHe: "שרשרת הנשימה", short: "Resp. chain" }),
];
export const betaOxidation: ProcessScene = {
  slug: "fatty-acid-beta-oxidation",
  meta: {
    topic: "biochemistry",
    nameHe: "חמצון β של חומצות שומן", nameEn: "β-Oxidation of Fatty Acids",
    descHe: "שפעול חומצת השומן, מעבורת הקרניטין, ארבע תגובות בכל סבב, והתוצר: אצטיל-CoA, FADH₂ ו-NADH",
    descEn: "Fatty-acid activation, the carnitine shuttle, the four reactions of each round, and the output: acetyl-CoA, FADH₂ and NADH",
    source: "Lehninger 8e ch. 17",
  },
  legend: [
    { color: "#78350f", he: "שרשרת הפחמנים", en: "Carbon chain", swatch: "line" },
    { color: "#be123c", he: "קואנזים A / מעגל קרבס", en: "Coenzyme A / citric acid cycle", swatch: "ring" },
    { color: NADH, he: "FADH₂ / NADH", en: "FADH₂ / NADH", swatch: "ring" },
    { color: ATPC, he: "ATP", en: "ATP", swatch: "ring" },
    { color: "#c2410c", he: "ממברנות המיטוכונדריה / מטריצה", en: "Mitochondrial membranes / matrix", swatch: "dash" },
    { color: "#f97316", he: "פחמן β", en: "β carbon", swatch: "dot" },
  ],
  steps: [
    {
      titleHe: "שפעול והעברה למטריצה", titleEn: "Activation and Entry into the Matrix",
      descHe: "בציטוזול חומצת השומן נקשרת ל-CoA (אציל-CoA סינתטאז), בתהליך שעולה ATP → AMP + PPᵢ — שווה ערך לשני ATP. אציל-CoA ארוך אינו חוצה את הממברנה הפנימית, ולכן הוא מועבר כאציל-קרניטין (מעבורת הקרניטין, CPT1 ו-CPT2) ומוחזר ל-CoA במטריצה. CPT1 הוא הצעד המבוקר: מלוניל-CoA מעכב אותו.",
      descEn: "In the cytosol the fatty acid is joined to CoA (acyl-CoA synthetase) at the cost of ATP → AMP + PPᵢ — two ATP equivalents. Long acyl-CoA cannot cross the inner membrane, so it is carried as acyl-carnitine (the carnitine shuttle, CPT1 and CPT2) and returned to CoA in the matrix. CPT1 is the controlled step: malonyl-CoA inhibits it.",
      elements: b1,
    },
    {
      titleHe: "סבב אחד, חלק א: חמצון והוספת מים", titleEn: "One Round, Part 1: Oxidation and Hydration",
      descHe: "(1) אציל-CoA דהידרוגנאז מחמצן את השרשרת ויוצר קשר כפול בין פחמן α לפחמן β; האלקטרונים עוברים ל-FAD (FADH₂), ומשם דרך ETF לקואנזים Q בשרשרת הנשימה. (2) מוספות מים לקשר הכפול, ועל פחמן β נוצרת קבוצת OH.",
      descEn: "(1) Acyl-CoA dehydrogenase oxidises the chain, making a double bond between the α and β carbons; the electrons go to FAD (FADH₂), and on through ETF to coenzyme Q in the respiratory chain. (2) Water is added across the double bond, leaving an OH group on the β carbon.",
      elements: b2,
    },
    {
      titleHe: "סבב אחד, חלק ב: חמצון ותיאוליזה", titleEn: "One Round, Part 2: Oxidation and Thiolysis",
      descHe: "(3) חמצון שני הופך את ה-OH על פחמן β לקבוצת קטו, ונוצר NADH. (4) תיאוליזה: CoA חדש חותך בין פחמן α לפחמן β — משתחרר אצטיל-CoA (2 פחמנים), והשרשרת שנשארת קצרה ב-2 פחמנים וכבר קשורה ל-CoA, מוכנה לסבב הבא.",
      descEn: "(3) A second oxidation turns the OH on the β carbon into a keto group, making NADH. (4) Thiolysis: a new CoA cuts between the α and β carbons — releasing acetyl-CoA (2 carbons), and the remaining chain, 2 carbons shorter and already bound to CoA, is ready for the next round.",
      elements: b2b,
    },
    {
      titleHe: "חזרה עד הסוף", titleEn: "Repeating to the End",
      descHe: "הסבבים חוזרים עד שכל השרשרת מפורקת. פלמיטויל-CoA (16 פחמנים) עובר 7 סבבים ויוצר 8 אצטיל-CoA, 7 FADH₂ ו-7 NADH. חומצות שומן בלתי רוויות או בעלות מספר פחמנים אי-זוגי דורשות אנזימים נוספים.",
      descEn: "Rounds repeat until the whole chain is used. Palmitoyl-CoA (16 carbons) goes through 7 rounds, giving 8 acetyl-CoA, 7 FADH₂ and 7 NADH. Unsaturated or odd-chain fatty acids need extra enzymes.",
      elements: b3,
    },
    {
      titleHe: "המשך ותשואה", titleEn: "Fate and Yield",
      descHe: "האצטיל-CoA נכנס למעגל קרבס, וה-FADH₂ וה-NADH מוסרים אלקטרונים לשרשרת הנשימה. חמצון מלא של פלמיטט מניב כ-108 ATP, ובניכוי שני ה-ATP של השפעול — כ-106. זו הסיבה ששומן הוא מאגר אנרגיה צפוף בהרבה מגליקוגן.",
      descEn: "Acetyl-CoA enters the citric acid cycle, and FADH₂ and NADH pass electrons to the respiratory chain. Complete oxidation of palmitate yields about 108 ATP, or about 106 after the two ATP of activation. That is why fat is a far denser energy store than glycogen.",
      elements: b4,
    },
  ],
};

/* Gluconeogenesis and the urea cycle moved to ./gng.ts and ./urea.ts (rebuilt 2026-10). */

/* ══ PHOTOSYNTHESIS (Lehninger 8e ch. 20) ═══════════════════════════ */
const chloroplast = (): El[] => [
  ellipse("chl", 200, 160, 180, 110, "#dcfce7", { stroke: "#15803d", strokeWidth: 2.5 }),
  ellipse("chl_i", 200, 160, 172, 102, "none", { stroke: "#16a34a", strokeWidth: 1.4 }),
  ...[[110, 150], [200, 130], [290, 170]].flatMap(([x, y], g) => [0, 1, 2, 3].map((i) => ellipse(`gr${g}_${i}`, x, y + i * 12 - 18, 30, 5, "#4ade80", { stroke: "#166534", strokeWidth: 1.2 }))),
];
const PY = 150;
const thyl = (): El[] => [
  ...bilayer("tm", 0, 400, PY, { th: 26, head: "#15803d", tail: "#bbf7d0" }),
  text("str", 390, 40, "stroma", "סטרומה", { anchor: "end", weight: 700, textColor: "#166534" }),
  text("lum", 384, 286, "lumen (H⁺ high)", "חלל התילקואיד (H⁺ גבוה)", { anchor: "end", weight: 700, textColor: "#b91c1c" }),
];
const cx2 = (id: string, x: number, w: number, color: string, labelTxt: string): El[] => [
  rect(id, x - w / 2, PY - 26, w, 52, color, { rx: 10, stroke: "#334155", strokeWidth: 1.5 }),
  text(`${id}_t`, x, PY + 6, labelTxt, labelTxt, { ltr: true, weight: 800, halo: false, fontSize: 16.5 }),
];
const ph1: El[] = [
  ...chloroplast(),
  label("l_gr", 14, 40, "Thylakoids (grana)", "תילקואידים (גרנה)", [110, 138], { anchor: "start" }),
  label("l_st", 176, 290, "Stroma: Calvin cycle", "סטרומה: מחזור קלווין", [300, 220], { anchor: "start" }),
  label("l_lr", 230, 40, "Membranes: light reactions", "בממברנות: תגובות האור", [212, 124], { anchor: "start", shortHe: "תגובות האור", short: "Light reactions" }),
];
const ph2: El[] = [
  ...thyl(),
  ...cx2("psii", 70, 60, "#bbf7d0", "PSII"), ...cx2("b6f", 170, 44, "#fde68a", "b₆f"), ...cx2("psi", 260, 60, "#a7f3d0", "PSI"),
  ...[0, 1, 2].map((i) => line(`light${i}`, 40 + i * 14, 40, 56 + i * 14, 86, "#facc15", 3)),
  path("e_path", `M 70 ${PY + 20} C 110 ${PY + 50} 140 ${PY + 40} 170 ${PY + 10} C 200 ${PY - 30} 230 ${PY + 40} 260 ${PY + 10} C 290 ${PY - 30} 320 ${PY - 50} 340 ${PY - 70}`, { stroke: "#0f766e", strokeWidth: 2.2, dash: "5 4", arrow: true }),
  text("h2o", 116, 222, "2 H₂O → O₂ + 4 H⁺", "2 H₂O → O₂ + 4 H⁺", { ltr: true, weight: 700, textColor: "#0369a1", fontSize: 16.5 }),
  text("nadph", 350, 64, "NADPH", "NADPH", { ltr: true, weight: 800, textColor: NADH }),
  label("l_ps", 90, 40, "Light excites PSII and PSI", "האור מעורר את \u2066PSII\u2069 ואת \u2066PSI\u2069", [70, PY - 26], { anchor: "start", shortHe: "עירור באור", short: "Light" }),
];
const ph3: El[] = [
  ...thyl(),
  ...cx2("psii", 70, 60, "#bbf7d0", "PSII"), ...cx2("b6f", 170, 44, "#fde68a", "b₆f"), ...cx2("psi", 260, 60, "#a7f3d0", "PSI"),
  path("atps", `M 334 ${PY + 14} L 334 ${PY - 14} M 350 ${PY + 14} L 350 ${PY - 14}`, { stroke: "#9a3412", strokeWidth: 6 }),
  circle("f1", 342, PY - 40, 18, "#fdba74", { stroke: "#9a3412", strokeWidth: 1.6 }),
  arrow("hflow", 342, PY + 60, 342, PY + 18, "#dc2626", 2.4),
  ...[[100, 220], [140, 232], [180, 216], [220, 234], [300, 222]].map(([x, y], i) => text(`hp${i}`, x, y, "H⁺", "H⁺", { ltr: true, weight: 800, textColor: "#dc2626" })),
  text("atp", 296, PY - 70, "ADP + Pᵢ → ATP", "ADP + Pᵢ → ATP", { ltr: true, weight: 700, textColor: ATPC, fontSize: 16.5 }),
  label("l_syn", 14, 40, "ATP synthase: H⁺ back to stroma", "ATP סינתאז: H⁺ חוזר לסטרומה", [342, PY - 40], { anchor: "start", shortHe: "ATP סינתאז", short: "ATP synthase" }),
];
const CAL: Pt[] = [[200, 70], [310, 200], [90, 200]];
const ph4: El[] = [
  path("cal1", "M 234 84 Q 300 110 306 172", { stroke: "#15803d", strokeWidth: 3, arrow: true }),
  path("cal2", "M 270 214 Q 200 250 130 214", { stroke: "#15803d", strokeWidth: 3, arrow: true }),
  path("cal3", "M 94 172 Q 100 110 166 84", { stroke: "#15803d", strokeWidth: 3, arrow: true }),
  text("rubp", CAL[0][0], CAL[0][1] + 6, "RuBP (5C)", "RuBP (5C)", { ltr: true, weight: 800 }),
  text("pga", CAL[1][0], CAL[1][1] + 6, "3-PGA", "3-PGA", { ltr: true, weight: 800 }),
  text("g3p", CAL[2][0], CAL[2][1] + 6, "G3P", "G3P", { ltr: true, weight: 800 }),
  text("co2", 320, 60, "CO₂", "CO₂", { ltr: true, weight: 800, textColor: "#475569" }),
  arrow("co2_in", 310, 70, 270, 110, "#475569", 2),
  ...badge("atpn", 200, 260, "ATP + NADPH", ATPC, { w: 116 }),
  arrow("sugar", 60, 214, 30, 260, "#b45309", 2.4),
  text("out", 30, 282, "sugars", "סוכרים", { fontSize: 16.5, textColor: "#b45309" }),
  label("l_rub", 14, 40, "Rubisco fixes CO₂", "רוביסקו מקבע CO₂", [296, 130], { anchor: "start" }),
  label("l_red", 250, 290, "Reduction uses ATP, NADPH", "חיזור בעזרת ATP ו-NADPH", [200, 240], { anchor: "start", shortHe: "חיזור", short: "Reduction" }),
];
export const photosynthesis: ProcessScene = {
  slug: "photosynthesis",
  meta: {
    topic: "biochemistry",
    nameHe: "פוטוסינתזה: תגובות האור ומחזור קלווין", nameEn: "Photosynthesis: Light Reactions and the Calvin Cycle",
    descHe: "מבנה הכלורופלסט, העברת אלקטרונים מ-PSII ל-PSI, ייצור ATP בכימיאוסמוזה, וקיבוע CO₂ במחזור קלווין",
    descEn: "Chloroplast structure, electron flow from PSII to PSI, ATP by chemiosmosis, and CO₂ fixation in the Calvin cycle",
    source: "Lehninger 8e ch. 20; Campbell 12e ch. 10",
  },
  legend: [
    { color: "#15803d", he: "ממברנת התילקואיד / מחזור קלווין", en: "Thylakoid membrane / Calvin cycle", swatch: "line" },
    { color: "#0f766e", he: "מסלול האלקטרונים", en: "Electron path", swatch: "dash" },
    { color: "#dc2626", he: "H⁺", en: "H⁺", swatch: "dot" },
    { color: ATPC, he: "ATP", en: "ATP", swatch: "ring" },
    { color: "#facc15", he: "אור", en: "Light", swatch: "line" },
  ],
  steps: [
    {
      titleHe: "הכלורופלסט", titleEn: "The Chloroplast",
      descHe: "בכלורופלסט שתי ממברנות חיצוניות ובתוכו מערכת של תילקואידים — שקיקים שחלקם מסודרים בערימות (גרנה). תגובות האור מתרחשות בממברנות התילקואידים, שבהן הכלורופיל והקומפלקסים; מחזור קלווין מתרחש בסטרומה, הנוזל שסביבם.",
      descEn: "The chloroplast has two outer membranes and inside a system of thylakoids — sacs, some stacked into grana. The light reactions take place in the thylakoid membranes, which hold chlorophyll and the complexes; the Calvin cycle runs in the stroma, the fluid around them.",
      elements: ph1,
    },
    {
      titleHe: "תגובות האור: מ-H₂O ל-NADPH", titleEn: "Light Reactions: From H₂O to NADPH",
      descHe: "אור מעורר את כלורופיל P680 ב-PSII; האלקטרון עובר בשרשרת, והחוסר מתמלא מפירוק מים — 2 H₂O → O₂ + 4 H⁺ + 4 e⁻, מקור החמצן באטמוספרה. דרך פלסטוקינון, קומפלקס ציטוכרום b₆f ופלסטוציאנין מגיע האלקטרון ל-PSI, שם אור מעורר אותו שוב, והוא מחזר NADP⁺ ל-NADPH.",
      descEn: "Light excites chlorophyll P680 in PSII; its electron moves down a chain, and the gap is filled by splitting water — 2 H₂O → O₂ + 4 H⁺ + 4 e⁻, the source of atmospheric oxygen. Via plastoquinone, the cytochrome b₆f complex and plastocyanin the electron reaches PSI, where light excites it again, and it reduces NADP⁺ to NADPH.",
      elements: ph2,
    },
    {
      titleHe: "כימיאוסמוזה ויצירת ATP", titleEn: "Chemiosmosis Makes ATP",
      descHe: "פירוק המים ושאיבת H⁺ על ידי קומפלקס b₆f מרכזים H⁺ בחלל התילקואיד. זרימת H⁺ חזרה לסטרומה דרך ATP סינתאז מייצרת ATP — אותו עיקרון כמו במיטוכונדריה, אבל בכיוון הפוך: ה-ATP נוצר בסטרומה, היכן שמחזור קלווין צריך אותו.",
      descEn: "Water splitting and H⁺ pumping by the b₆f complex concentrate H⁺ in the thylakoid lumen. H⁺ flowing back to the stroma through ATP synthase makes ATP — the same principle as in mitochondria, but facing the other way: ATP forms in the stroma, where the Calvin cycle needs it.",
      elements: ph3,
    },
    {
      titleHe: "מחזור קלווין", titleEn: "The Calvin Cycle",
      descHe: "בסטרומה האנזים רוביסקו מקבע CO₂ ל-RuBP (5 פחמנים), והתוצר מתפצל לשתי מולקולות 3-PGA. ATP ו-NADPH מתגובות האור מחזרים אותן ל-G3P. רוב ה-G3P משמש לחידוש ה-RuBP, ועל כל 3 CO₂ שמקובעים יוצא G3P אחד לייצור סוכרים — בעלות של 9 ATP ו-6 NADPH.",
      descEn: "In the stroma the enzyme rubisco fixes CO₂ onto RuBP (5 carbons), and the product splits into two 3-PGA. ATP and NADPH from the light reactions reduce them to G3P. Most G3P regenerates RuBP, and for every 3 CO₂ fixed one G3P leaves to make sugars — at a cost of 9 ATP and 6 NADPH.",
      elements: ph4,
    },
  ],
};

/* ══ BLOOD GLUCOSE REGULATION: insulin and glucagon (Berne & Levy 8e ch. 39; Lehninger ch. 23) ══ */
const glc = (id: string, x: number, y: number) => path(id, ring(x, y, 7, 6), { color: "#fde68a", stroke: "#b45309", strokeWidth: 1.4 });
const islet = (): El[] => [
  circle("isl", 70, 90, 44, "#fef9c3", { stroke: "#a16207", strokeWidth: 2 }),
  ...[[56, 76], [80, 72], [68, 96], [90, 100], [50, 104]].map(([x, y], i) => circle(`bc${i}`, x, y, 8, "#bfdbfe", { stroke: "#1d4ed8", strokeWidth: 1.2 })),
  ...[[40, 86], [94, 84], [72, 118]].map(([x, y], i) => circle(`ac${i}`, x, y, 7, "#fecaca", { stroke: "#b91c1c", strokeWidth: 1.2 })),
];
const vessel = (): El[] => [rect("bv", 0, 150, 400, 40, "#fee2e2", { rx: 20, stroke: "#dc2626", strokeWidth: 2 })];
const liver = (): El => path("liv", smooth([[290, 60], [340, 40], [390, 60], [380, 110], [320, 118], [284, 96]], true), { color: "#fecaca", stroke: "#9f1239", strokeWidth: 2 });
const muscleCell = (): El => rect("mus", 200, 220, 170, 60, "#fde2e2", { rx: 20, stroke: "#b91c1c", strokeWidth: 2 });
const glut = (atMembrane: boolean): El[] => [0, 1, 2].map((i) => rect(`glut${i}`, 226 + i * 50, atMembrane ? 216 : 248 + (i % 2) * 8, 10, 10, "#1d4ed8", { rx: 2 }));
// glycogen: a rosette of granules in the liver
const glycogen = (op: number): El[] => [[330, 76], [346, 70], [356, 84], [342, 92], [328, 90], [343, 81]].map(([x, y], i) => circle(`gy${i}`, x, y, 4, "#fbbf24", { stroke: "#b45309", strokeWidth: 1, opacity: op }));
const gBase = (gl = false, gy = 0): El[] => [...islet(), ...vessel(), liver(), muscleCell(), ...glut(gl), ...glycogen(gy),
  text("t_panc", 70, 146, "pancreatic islet", "איון בלבלב", { fontSize: 16.5, textColor: "#a16207", weight: 700 }),
  text("t_liv", 336, 136, "liver", "כבד", { fontSize: 16.5, textColor: "#9f1239", weight: 700 }),
  text("t_mus", 285, 298, "muscle / fat", "שריר / שומן", { fontSize: 16.5, textColor: "#b91c1c", weight: 700 }),
];
const GLC_HI: Pt[] = [[30, 170], [70, 162], [110, 176], [150, 164], [190, 172], [230, 164], [270, 176], [310, 168], [350, 172]];
const GLC_LO: Pt[] = [[70, 170], [230, 170], [350, 170]];
const bg1: El[] = [
  ...gBase(), ...GLC_HI.map(([x, y], i) => glc(`g${i}`, x, y)),
  ...[[120, 110], [134, 124]].map(([x, y], i) => circle(`ins${i}`, x, y, 4, "#1d4ed8")),
  arrow("ins_out", 110, 100, 160, 140, "#1d4ed8", 2.2),
  label("l_hi", 150, 240, "After a meal: glucose ↑", "אחרי ארוחה: הגלוקוז עולה", [190, 176], { anchor: "end", shortHe: "גלוקוז עולה", short: "Glucose ↑" }),
  label("l_beta", 130, 30, "β cells release insulin", "תאי β מפרישים אינסולין", [84, 70], { anchor: "start", shortHe: "תאי β: אינסולין", short: "β cells: insulin" }),
];
const bg2: El[] = [
  ...gBase(true, 1), ...GLC_LO.map(([x, y], i) => glc(`g${i}`, x, y)),
  ...[[240, 238], [270, 244], [300, 236]].map(([x, y], i) => glc(`gm${i}`, x, y)),
  arrow("up_m", 270, 196, 270, 224, "#1d4ed8", 2.2), arrow("up_l", 320, 150, 326, 116, "#1d4ed8", 2.2),
  label("l_glut", 14, 270, "Insulin: GLUT4 moves to the membrane", "אינסולין: GLUT4 עובר לממברנה", [231, 221], { anchor: "start", shortHe: "GLUT4 לממברנה", short: "GLUT4 to membrane" }),
  label("l_gly", 150, 40, "Liver stores glycogen", "הכבד אוגר גליקוגן", [330, 76], { anchor: "start" }),
];
const bg3: El[] = [
  ...gBase(), ...GLC_LO.slice(0, 2).map(([x, y], i) => glc(`g${i}`, x, y)),
  ...[[120, 110], [134, 124]].map(([x, y], i) => circle(`gcg${i}`, x, y, 4, "#b91c1c")),
  arrow("gcg_out", 110, 110, 160, 140, "#b91c1c", 2.2),
  label("l_lo", 150, 240, "Fasting: glucose ↓", "בצום: הגלוקוז יורד", [230, 176], { anchor: "end" }),
  label("l_alpha", 130, 30, "α cells release glucagon", "תאי α מפרישים גלוקגון", [96, 84], { anchor: "start", shortHe: "תאי α: גלוקגון", short: "α cells: glucagon" }),
];
const bg4: El[] = [
  ...gBase(), ...GLC_HI.slice(3).map(([x, y], i) => glc(`g${i + 3}`, x, y)),
  ...[[330, 70], [350, 90]].map(([x, y], i) => glc(`gl${i}`, x, y)),
  arrow("out_l", 326, 118, 318, 150, "#b45309", 2.4),
  label("l_liv", 14, 40, "Liver: glycogenolysis + gluconeogenesis", "הכבד: פירוק גליקוגן וגלוקונאוגנזה", [330, 80], { anchor: "start", shortHe: "הכבד משחרר גלוקוז", short: "Liver releases glucose" }),
  text("l_fb", 96, 236, "negative feedback", "משוב שלילי", { weight: 700, textColor: "#15803d" }),
  text("l_fb2", 96, 262, "keeps ~5 mM", "שומר על כ-5 מילימולר", { weight: 700, textColor: "#15803d", fontSize: 16.5 }),
];
export const bloodGlucose: ProcessScene = {
  slug: "blood-glucose-regulation",
  meta: {
    topic: "physiology",
    nameHe: "ויסות רמת הסוכר בדם: אינסולין וגלוקגון", nameEn: "Blood Glucose Regulation: Insulin and Glucagon",
    descHe: "תאי β ו-α באיי הלבלב, קליטת גלוקוז דרך GLUT4, אגירה ושחרור בכבד, ומשוב שלילי",
    descEn: "β and α cells in the pancreatic islets, glucose uptake through GLUT4, storage and release by the liver, and negative feedback",
    source: "Berne & Levy 8e ch. 39; Lehninger 8e ch. 23",
  },
  legend: [
    { color: "#b45309", he: "גלוקוז", en: "Glucose", swatch: "ring" },
    { color: "#1d4ed8", he: "תאי β / אינסולין / GLUT4", en: "β cells / insulin / GLUT4", swatch: "dot" },
    { color: "#b91c1c", he: "תאי α / גלוקגון", en: "α cells / glucagon", swatch: "dot" },
    { color: "#dc2626", he: "כלי דם", en: "Blood vessel", swatch: "ring" },
  ],
  steps: [
    {
      titleHe: "אחרי ארוחה: אינסולין", titleEn: "After a Meal: Insulin",
      descHe: "אחרי ארוחה רמת הגלוקוז בדם עולה. תאי β באיי לנגרהנס בלבלב קולטים גלוקוז דרך GLUT2; חילוף החומרים שלו מעלה את יחס ה-ATP/ADP, סוגר תעלות K⁺ תלויות ATP, והדה-פולריזציה פותחת תעלות Ca²⁺ — ו-Ca²⁺ מפעיל הפרשת אינסולין.",
      descEn: "After a meal blood glucose rises. β cells in the pancreatic islets of Langerhans take up glucose via GLUT2; its metabolism raises the ATP/ADP ratio, closes ATP-sensitive K⁺ channels, and the depolarisation opens Ca²⁺ channels — Ca²⁺ triggers insulin secretion.",
      elements: bg1,
    },
    {
      titleHe: "פעולת האינסולין", titleEn: "What Insulin Does",
      descHe: "אינסולין נקשר לקולטן טירוזין-קינאז. בשריר וברקמת שומן הוא גורם לשלפוחיות עם GLUT4 להתמזג עם הממברנה, וקליטת הגלוקוז עולה. בכבד הוא מעודד בניית גליקוגן ושומן ומעכב ייצור גלוקוז. רמת הסוכר יורדת.",
      descEn: "Insulin binds a receptor tyrosine kinase. In muscle and fat it makes vesicles carrying GLUT4 fuse with the membrane, raising glucose uptake. In the liver it promotes glycogen and fat synthesis and inhibits glucose output. Blood glucose falls.",
      elements: bg2,
    },
    {
      titleHe: "בצום: גלוקגון", titleEn: "Fasting: Glucagon",
      descHe: "כשרמת הגלוקוז יורדת (בין ארוחות, בצום) הפרשת האינסולין פוחתת, ותאי α באיים מפרישים גלוקגון.",
      descEn: "When glucose falls (between meals, in fasting) insulin secretion drops and α cells in the islets secrete glucagon.",
      elements: bg3,
    },
    {
      titleHe: "פעולת הגלוקגון ומשוב שלילי", titleEn: "Glucagon's Action and Negative Feedback",
      descHe: "גלוקגון פועל בעיקר על הכבד דרך קולטן מצומד חלבון G ו-cAMP: הוא מפעיל פירוק גליקוגן וגלוקונאוגנזה, והכבד משחרר גלוקוז לדם. האיזון בין שני ההורמונים — משוב שלילי — שומר על רמת גלוקוז של כ-4–6 מילימולר. בסוכרת סוג 1 אין הפרשת אינסולין; בסוג 2 יש עמידות לאינסולין.",
      descEn: "Glucagon acts mainly on the liver through a G-protein-coupled receptor and cAMP: it activates glycogen breakdown and gluconeogenesis, and the liver releases glucose into the blood. The balance between the two hormones — negative feedback — holds glucose at about 4–6 mM. In type 1 diabetes insulin is not secreted; in type 2 there is insulin resistance.",
      elements: bg4,
    },
  ],
};
