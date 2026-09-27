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
  if (mod === "oh") els.push(text(`${p}_oh`, x - 20, y + 30, "OH", "OH", { ltr: true, weight: 800, fontSize: 16.5, textColor: "#0369a1" }));
  if (mod === "keto") els.push(line(`${p}_o1`, x - 22, y + 10, x - 22, y + 20, "#b91c1c", 2), line(`${p}_o2`, x - 18, y + 10, x - 18, y + 20, "#b91c1c", 2), text(`${p}_o`, x - 20, y + 36, "O", "O", { ltr: true, weight: 800, fontSize: 16.5, textColor: "#b91c1c" }));
  if (mod === "split") els.push(path(`${p}_ac`, `M ${x - 20} ${y + 6} L ${x - 6} ${y - 6}`, { stroke: "#78350f", strokeWidth: 3.2 }), line(`${p}_cut`, x - 28, y - 10, x - 24, y + 14, "#dc2626", 2.4));
  return els;
};
const ST: [number, number][] = [[112, 96], [300, 96], [300, 206], [112, 206]];
const b2: El[] = [
  ...matrixBg(),
  ...station("s1", ...ST[0], "double"), ...station("s2", ...ST[1], "oh"), ...station("s3", ...ST[2], "keto"), ...station("s4", ...ST[3], "split"),
  arrow("r12", 170, 90, 236, 90, C.line, 2.2), arrow("r23", 300, 132, 300, 172, C.line, 2.2),
  arrow("r34", 236, 212, 170, 212, C.line, 2.2), arrow("r41", 80, 180, 80, 132, C.line, 2.2),
  text("n1", 112, 72, "1 oxidation", "1 · חמצון", { weight: 800, fontSize: 16.5 }),
  text("n2", 300, 72, "2 hydration", "2 · הוספת מים", { weight: 800, fontSize: 16.5 }),
  text("n3", 300, 256, "3 oxidation", "3 · חמצון", { weight: 800, fontSize: 16.5 }),
  text("n4", 112, 256, "4 thiolysis", "4 · תיאוליזה", { weight: 800, fontSize: 16.5 }),
  ...badge("ox1", 200, 116, "FADH₂", NADH), ...badge("hyd", 356, 152, "H₂O", "#0ea5e9"),
  ...badge("ox2", 200, 236, "NADH", NADH), ...badge("thi", 40, 152, "CoA", "#be123c"),
  circle("etf", 200, 40, 9, "#ccfbf1", { stroke: "#0f766e", strokeWidth: 1.5 }),
  arrow("to_etf", 200, 102, 200, 54, NADH, 2),
  text("etf_t", 216, 46, "ETF → Q", "ETF → Q", { anchor: "start", ltr: true, fontSize: 16.5, weight: 700, textColor: "#0f766e" }),
  text("l_out", 112, 284, "acetyl-CoA + acyl-CoA (n−2)", "אצטיל-CoA + שרשרת קצרה ב-2", { weight: 700, textColor: "#be123c", short: "acetyl-CoA", shortHe: "אצטיל-CoA" }),
];
const b3: El[] = [
  ...matrixBg(),
  chain("fa2", 130, 70, 4), ...coa("coa2", 156, 70),
  ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => { const x = 50 + (i % 4) * 90, y = 140 + Math.floor(i / 4) * 56; return path(`ac${i}`, `M ${x - 10} ${y + 5} L ${x} ${y - 5}`, { stroke: "#78350f", strokeWidth: 3.5 }); }),
  ...[0, 1, 2, 3, 4, 5, 6, 7].flatMap((i) => { const x = 50 + (i % 4) * 90, y = 140 + Math.floor(i / 4) * 56; return coa(`ca${i}`, x + 26, y); }),
  label("l_pal", 190, 40, "Palmitoyl-CoA (C16): 7 rounds", "פלמיטויל-CoA: 7 סבבים", [120, 70], { anchor: "start", shortHe: "7 סבבים", short: "C16: 7 rounds" }),
  ...badge("n_ac", 100, 272, "8 acetyl-CoA", "#be123c", { w: 116 }), ...badge("n_fad", 220, 272, "7 FADH₂", NADH, { w: 84 }), ...badge("n_nad", 320, 272, "7 NADH", NADH, { w: 80 }),
];
const b4: El[] = [
  ...matrixBg(),
  ...bilayer("imb", 12, 388, 262, { th: 14 }),
  ...coa("ca0", 70, 90),
  arrow("tca", 96, 90, 160, 90, C.line, 2.2),
  path("cyc", "M 200 60 A 36 36 0 1 1 199.9 60", { stroke: "#be123c", strokeWidth: 3 }),
  text("cyc_t", 200, 102, "TCA", "TCA", { ltr: true, weight: 800, textColor: "#be123c" }),
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
      titleHe: "סבב אחד: ארבע תגובות", titleEn: "One Round: Four Reactions",
      descHe: "בכל סבב: (1) חמצון ביצירת קשר כפול ו-FADH₂ (אציל-CoA דהידרוגנאז); (2) הוספת מים; (3) חמצון שני ו-NADH; (4) תיאוליזה בעזרת CoA חדש — משתחרר אצטיל-CoA (2 פחמנים), והשרשרת קצרה ב-2 פחמנים.",
      descEn: "Each round: (1) oxidation forming a double bond and FADH₂ (acyl-CoA dehydrogenase); (2) addition of water; (3) a second oxidation making NADH; (4) thiolysis by a new CoA — releasing acetyl-CoA (2 carbons) and leaving a chain 2 carbons shorter.",
      elements: b2,
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

/* ══ GLUCONEOGENESIS (Lehninger 8e ch. 14) ═════════════════════════ */
const MET = ["Glucose", "G6P", "F6P", "F-1,6-BP", "G3P / DHAP", "1,3-BPG", "3-PG", "2-PG", "PEP", "Pyruvate"];
const MET_HE = ["גלוקוז", "G6P", "F6P", "F-1,6-BP", "G3P / DHAP", "1,3-BPG", "3-PG", "2-PG", "PEP", "פירובט"];
const RY2 = (i: number) => 30 + i * 27;
const bypassIdx = [0, 2, 8]; // gaps below which glycolysis is irreversible
const gnBase = (hl: number[]): El[] => [
  ...MET.map((m, i) => text(`m${i}`, 150, RY2(i) + 6, m, MET_HE[i], { ltr: m !== "Glucose" && m !== "Pyruvate", fontSize: 16.5, weight: 700 })),
  ...MET.slice(0, -1).map((_, i) => arrow(`gl${i}`, 60, RY2(i) + 6, 60, RY2(i + 1) - 6, bypassIdx.includes(i) ? "#dc2626" : "#94a3b8", 1.8)),
  ...MET.slice(0, -1).map((_, i) => arrow(`gn${i}`, 232, RY2(i + 1) - 6, 232, RY2(i) + 6, bypassIdx.includes(i) ? (hl.includes(i) ? "#15803d" : "#86efac") : "#94a3b8", bypassIdx.includes(i) ? 3 : 1.8)),
  // sugar rings: glucose / G6P pyranose (6), F6P / F-1,6-BP furanose (5)
  ...[0, 1].map((i) => path(`ring6_${i}`, ring(204, RY2(i) - 2, 9, 6), { color: "#fde68a", stroke: "#b45309", strokeWidth: 1.5 })),
  ...[2, 3].map((i) => path(`ring5_${i}`, ring(204, RY2(i) - 2, 9, 5), { color: "#fed7aa", stroke: "#c2410c", strokeWidth: 1.5 })),
  text("h_gl", 60, 20, "glycolysis", "גליקוליזה", { textColor: C.muted, weight: 700, fontSize: 16.5 }),
  text("h_gn", 250, 20, "gluconeogenesis", "גלוקונאוגנזה", { textColor: "#15803d", weight: 700, fontSize: 16.5 }),
];
const gn1: El[] = [
  ...gnBase([0, 2, 8]),
  label("l_irr", 256, 250, "3 irreversible steps", "3 שלבים בלתי הפיכים", [60, RY2(8) + 14], { anchor: "start", shortHe: "3 בלתי הפיכים", short: "3 irreversible" }),
  label("l_rev", 256, 150, "7 shared, reversible", "7 שלבים משותפים", [232, RY2(5) + 14], { anchor: "start", shortHe: "7 משותפים", short: "7 shared" }),
];
const gn2: El[] = [
  ...gnBase([8]),
  text("oaa", 270, RY2(8.5) + 6, "OAA", "OAA", { ltr: true, weight: 800, textColor: "#15803d" }),
  label("l_pc", 300, 290, "PC + ATP", "PC + ATP", [240, RY2(8.8)], { anchor: "start", ltr: true }),
  label("l_pepck", 300, 190, "PEPCK + GTP", "PEPCK + GTP", [240, RY2(8.2)], { anchor: "start", ltr: true }),
];
const gn3: El[] = [
  ...gnBase([0, 2]),
  label("l_fbp", 290, 150, "FBPase-1", "FBPase-1", [238, RY2(2.5)], { anchor: "start", ltr: true }),
  label("l_g6p", 290, 70, "G6Pase (ER)", "G6Pase (ER)", [238, RY2(0.5)], { anchor: "start", ltr: true }),
];
const gn4: El[] = [
  ...gnBase([0, 2, 8]),
  text("cost1", 256, 230, "4 ATP + 2 GTP", "4 ATP + 2 GTP", { anchor: "start", ltr: true, weight: 800, textColor: ATPC }),
  text("cost2", 256, 254, "+ 2 NADH", "+ 2 NADH", { anchor: "start", ltr: true, weight: 800, textColor: ATPC }),
  text("reg1", 256, 110, "glucagon: on", "גלוקגון: מעודד", { anchor: "start", weight: 700, textColor: "#15803d" }),
  text("reg2", 256, 136, "insulin: off", "אינסולין: מעכב", { anchor: "start", weight: 700, textColor: "#dc2626" }),
];
export const gluconeogenesis: ProcessScene = {
  slug: "gluconeogenesis",
  meta: {
    topic: "biochemistry",
    nameHe: "גלוקונאוגנזה", nameEn: "Gluconeogenesis",
    descHe: "ייצור גלוקוז מפירובט בכבד: שבעה שלבים משותפים עם הגליקוליזה ושלושה מעקפים לשלבים הבלתי הפיכים",
    descEn: "Making glucose from pyruvate in the liver: seven steps shared with glycolysis and three bypasses of the irreversible steps",
    source: "Lehninger 8e ch. 14",
  },
  legend: [
    { color: "#94a3b8", he: "שלב הפיך משותף", en: "Shared reversible step", swatch: "arrow" },
    { color: "#dc2626", he: "שלב גליקוליזה בלתי הפיך", en: "Irreversible glycolytic step", swatch: "arrow" },
    { color: "#15803d", he: "מעקף בגלוקונאוגנזה", en: "Gluconeogenic bypass", swatch: "arrow" },
    { color: ATPC, he: "עלות אנרגטית", en: "Energy cost", swatch: "ring" },
  ],
  steps: [
    {
      titleHe: "גליקוליזה בכיוון ההפוך?", titleEn: "Glycolysis in Reverse?",
      descHe: "בצום הכבד (ומעט הכליה) מייצר גלוקוז מפירובט, לקטט, גליצרול וחומצות אמינו. שבעה משלבי הגליקוליזה הפיכים ומשותפים לשני המסלולים, אבל שלושה — הקסוקינאז, PFK-1 ופירובט קינאז — בלתי הפיכים ודורשים מעקפים באנזימים אחרים.",
      descEn: "During fasting the liver (and a little the kidney) makes glucose from pyruvate, lactate, glycerol and amino acids. Seven glycolytic steps are reversible and shared, but three — hexokinase, PFK-1 and pyruvate kinase — are irreversible and need bypass enzymes.",
      elements: gn1,
    },
    {
      titleHe: "מעקף 1: פירובט ל-PEP", titleEn: "Bypass 1: Pyruvate to PEP",
      descHe: "במיטוכונדריה פירובט קרבוקסילאז (עם ביוטין ו-ATP) הופך פירובט לאוקסלואצטט (OAA). PEP קרבוקסיקינאז הופך את ה-OAA ל-PEP תוך שימוש ב-GTP. שני צעדים ושני קשרים עתירי אנרגיה — במקום צעד אחד של פירובט קינאז.",
      descEn: "In mitochondria pyruvate carboxylase (with biotin and ATP) turns pyruvate into oxaloacetate (OAA). PEP carboxykinase converts OAA to PEP using GTP. Two steps and two high-energy bonds — instead of pyruvate kinase's single step.",
      elements: gn2,
    },
    {
      titleHe: "מעקפים 2 ו-3: הסרת זרחות", titleEn: "Bypasses 2 and 3: Removing Phosphates",
      descHe: "פרוקטוז-1,6-ביספוספטאז מסיר זרחה מ-F-1,6-BP ויוצר F6P (במקום PFK-1). בסוף, גלוקוז-6-פוספטאז ב-ER של תאי הכבד מסיר את הזרחה מ-G6P, והגלוקוז החופשי יוצא לדם. בשריר אין את האנזים הזה — ולכן השריר אינו מספק גלוקוז לדם.",
      descEn: "Fructose-1,6-bisphosphatase removes a phosphate from F-1,6-BP to give F6P (instead of PFK-1). Finally glucose-6-phosphatase in the liver-cell ER removes the phosphate from G6P, and free glucose leaves for the blood. Muscle lacks this enzyme — so muscle does not supply blood glucose.",
      elements: gn3,
    },
    {
      titleHe: "מחיר ובקרה", titleEn: "Cost and Control",
      descHe: "גלוקוז אחד משני פירובט עולה 4 ATP, 2 GTP ו-2 NADH — יותר מה-2 ATP שהגליקוליזה מרוויחה. שני המסלולים מבוקרים הפוך זה מזה כדי למנוע מעגל סרק: פרוקטוז-2,6-ביספוספט ו-AMP מעודדים גליקוליזה ומעכבים גלוקונאוגנזה, וגלוקגון מעודד גלוקונאוגנזה בכבד.",
      descEn: "One glucose from two pyruvate costs 4 ATP, 2 GTP and 2 NADH — more than the 2 ATP glycolysis gains. The two pathways are regulated reciprocally to avoid a futile cycle: fructose-2,6-bisphosphate and AMP stimulate glycolysis and inhibit gluconeogenesis, and glucagon promotes gluconeogenesis in the liver.",
      elements: gn4,
    },
  ],
};

/* ══ UREA CYCLE (Lehninger 8e ch. 18) ═══════════════════════════════ */
const UC: Pt[] = [[110, 90], [270, 90], [290, 220], [110, 220]]; // carbamoyl-P entry / citrulline / argininosuccinate+arginine / ornithine
const ucBase = (): El[] => [
  rect("mito", 16, 40, 150, 230, "#fff7ed", { rx: 24, stroke: "#c2410c", strokeWidth: 2.5 }),
  text("mito_t", 30, 64, "mitochondrion", "מיטוכונדריה", { anchor: "start", weight: 700, textColor: "#9a3412", short: "mito.", shortHe: "מיטוכונדריה" }),
  text("cyt_t", 390, 64, "cytosol", "ציטוזול", { anchor: "end", weight: 700, textColor: C.muted }),
  path("u1", `M ${UC[0][0] + 30} ${UC[0][1]} L ${UC[1][0] - 40} ${UC[1][1]}`, { stroke: "#16a34a", strokeWidth: 3, arrow: true }),
  path("u2", `M ${UC[1][0]} ${UC[1][1] + 16} L ${UC[2][0] - 6} ${UC[2][1] - 18}`, { stroke: "#16a34a", strokeWidth: 3, arrow: true }),
  path("u3", `M ${UC[2][0] - 40} ${UC[2][1]} L ${UC[3][0] + 44} ${UC[3][1]}`, { stroke: "#16a34a", strokeWidth: 3, arrow: true }),
  path("u4", `M ${UC[3][0]} ${UC[3][1] - 16} L ${UC[0][0]} ${UC[0][1] + 18}`, { stroke: "#16a34a", strokeWidth: 3, arrow: true }),
  text("orn", UC[3][0], UC[3][1] + 6, "Ornithine", "אורניתין", { weight: 700 }),
  text("cit", UC[1][0], UC[1][1] + 6, "Citrulline", "ציטרולין", { weight: 700 }),
  text("arg", UC[2][0], UC[2][1] + 6, "Arginine", "ארגינין", { weight: 700 }),
];
const u1: El[] = [
  ...ucBase(),
  ...badge("cp", 90, 140, "carbamoyl-P", "#0ea5e9", { w: 110, he: "קרבמויל-P" }),
  text("nh4", 36, 116, "NH₄⁺ + HCO₃⁻", "NH₄⁺ + HCO₃⁻", { anchor: "start", ltr: true, weight: 700, fontSize: 16.5 }),
  ...badge("atp", 90, 176, "2 ATP", ATPC),
  label("l_cps", 200, 150, "Carbamoyl-phosphate synthetase I", "קרבמויל-פוספט סינתטאז I", [120, 140], { anchor: "start", shortHe: "CPS I", short: "CPS I" }),
];
const u2: El[] = [
  ...ucBase(),
  ...badge("cp", 110, 130, "carbamoyl-P", "#0ea5e9", { w: 110, he: "קרבמויל-P" }),
  label("l_otc", 200, 150, "Ornithine + carbamoyl-P → citrulline", "אורניתין + קרבמויל-P יוצרים ציטרולין", [190, 90], { anchor: "start", shortHe: "יצירת ציטרולין", short: "→ citrulline" }),
  label("l_exp", 200, 290, "Citrulline exported to cytosol", "הציטרולין יוצא לציטוזול", [240, 100], { anchor: "start", shortHe: "יציאה לציטוזול", short: "Exported" }),
];
const u3: El[] = [
  ...ucBase(),
  text("asp", 392, 128, "Aspartate", "אספרטט", { anchor: "end", weight: 700, textColor: "#7c3aed" }),
  text("asp2", 392, 150, "brings", "מביא את", { anchor: "end", fontSize: 16.5, textColor: "#7c3aed" }),
  text("asp3", 392, 170, "the 2nd N", "החנקן השני", { anchor: "end", fontSize: 16.5, textColor: "#7c3aed" }),
  arrow("asp_in", 336, 182, 302, 204, "#7c3aed", 2),
  text("fum", 360, 280, "Fumarate", "פומרט", { anchor: "end", weight: 700, textColor: "#be123c" }),
  arrow("fum_out", 300, 236, 330, 262, "#be123c", 2),
  ...badge("atp", 220, 160, "ATP → AMP", ATPC, { w: 104 }),
];
const u4: El[] = [
  ...ucBase(),
  ...badge("urea", 230, 280, "urea", "#b45309", { he: "שתנן (אוריאה)" }),
  arrow("urea_out", 250, 236, 240, 264, "#b45309", 2),
  path("liver_kid", "M 300 280 L 360 280", { stroke: "#b45309", strokeWidth: 2, dash: "4 3", arrow: true }),
  text("kid", 390, 262, "→ kidney", "לכליה", { anchor: "end", fontSize: 16.5, textColor: "#b45309" }),
  label("l_argi", 170, 36, "Arginase: urea + ornithine", "ארגינאז: שתנן ואורניתין", [200, 220], { anchor: "start", shortHe: "ארגינאז", short: "Arginase" }),
];
export const ureaCycle: ProcessScene = {
  slug: "urea-cycle",
  meta: {
    topic: "biochemistry",
    nameHe: "מעגל השתנן (אוריאה)", nameEn: "The Urea Cycle",
    descHe: "הפיכת אמוניה רעילה לשתנן בכבד: קרבמויל-פוספט, ציטרולין, ארגינין ושחרור האוריאה",
    descEn: "Turning toxic ammonia into urea in the liver: carbamoyl phosphate, citrulline, arginine and release of urea",
    source: "Lehninger 8e ch. 18",
  },
  legend: [
    { color: "#16a34a", he: "תגובות המעגל", en: "Cycle reactions", swatch: "arrow" },
    { color: "#0ea5e9", he: "קרבמויל-פוספט (החנקן הראשון)", en: "Carbamoyl phosphate (1st N)", swatch: "ring" },
    { color: "#7c3aed", he: "אספרטט (החנקן השני)", en: "Aspartate (2nd N)", swatch: "arrow" },
    { color: "#b45309", he: "שתנן", en: "Urea", swatch: "ring" },
    { color: "#c2410c", he: "מיטוכונדריה", en: "Mitochondrion", swatch: "ring" },
  ],
  steps: [
    {
      titleHe: "אמוניה הופכת לקרבמויל-פוספט", titleEn: "Ammonia Becomes Carbamoyl Phosphate",
      descHe: "פירוק חומצות אמינו משחרר אמוניה (NH₄⁺), שהיא רעילה למוח. במטריצה של מיטוכונדריות הכבד האנזים קרבמויל-פוספט סינתטאז I מצרף NH₄⁺ ו-HCO₃⁻ ליצירת קרבמויל-פוספט, בעלות של 2 ATP. זהו הצעד המבוקר של המעגל (מופעל על ידי N-אצטילגלוטמט).",
      descEn: "Amino-acid breakdown releases ammonia (NH₄⁺), which is toxic to the brain. In the matrix of liver mitochondria carbamoyl-phosphate synthetase I joins NH₄⁺ and HCO₃⁻ into carbamoyl phosphate, at a cost of 2 ATP. This is the cycle's controlled step (activated by N-acetylglutamate).",
      elements: u1,
    },
    {
      titleHe: "יצירת ציטרולין", titleEn: "Forming Citrulline",
      descHe: "אורניתין טרנסקרבמוילאז מעביר את קבוצת הקרבמויל לאורניתין, ונוצר ציטרולין. הציטרולין יוצא מהמיטוכונדריה אל הציטוזול.",
      descEn: "Ornithine transcarbamoylase transfers the carbamoyl group to ornithine, forming citrulline. Citrulline leaves the mitochondrion for the cytosol.",
      elements: u2,
    },
    {
      titleHe: "החנקן השני ויצירת ארגינין", titleEn: "The Second Nitrogen and Arginine",
      descHe: "בציטוזול ציטרולין מתחבר לאספרטט — שמביא את אטום החנקן השני — ליצירת ארגינינוסוקצינט (ATP → AMP + PPᵢ). זה מתפרק לארגינין ולפומרט; הפומרט מקשר את מעגל השתנן למעגל קרבס.",
      descEn: "In the cytosol citrulline joins aspartate — which brings the second nitrogen atom — to form argininosuccinate (ATP → AMP + PPᵢ). This splits into arginine and fumarate; fumarate links the urea cycle to the citric acid cycle.",
      elements: u3,
    },
    {
      titleHe: "שחרור השתנן", titleEn: "Releasing Urea",
      descHe: "ארגינאז מפרק את הארגינין לשתנן ולאורניתין, והאורניתין חוזר למיטוכונדריה לסבב נוסף. השתנן — מולקולה מסיסה ולא רעילה עם שני אטומי חנקן — עובר בדם לכליות ומופרש בשתן. פגם באנזימי המעגל גורם להצטברות אמוניה בדם.",
      descEn: "Arginase splits arginine into urea and ornithine, and ornithine returns to the mitochondrion for another turn. Urea — a soluble, non-toxic molecule carrying two nitrogens — travels in the blood to the kidneys and is excreted in urine. Defects in the cycle's enzymes cause ammonia to build up in the blood.",
      elements: u4,
    },
  ],
};

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
  label("l_st", 250, 290, "Stroma: Calvin cycle", "סטרומה: מחזור קלווין", [300, 220], { anchor: "start" }),
  label("l_lr", 230, 40, "Membranes: light reactions", "בממברנות: תגובות האור", [212, 124], { anchor: "start", shortHe: "תגובות האור", short: "Light reactions" }),
];
const ph2: El[] = [
  ...thyl(),
  ...cx2("psii", 70, 60, "#bbf7d0", "PSII"), ...cx2("b6f", 170, 44, "#fde68a", "b₆f"), ...cx2("psi", 260, 60, "#a7f3d0", "PSI"),
  ...[0, 1, 2].map((i) => line(`light${i}`, 40 + i * 14, 40, 56 + i * 14, 86, "#facc15", 3)),
  path("e_path", `M 70 ${PY + 20} C 110 ${PY + 50} 140 ${PY + 40} 170 ${PY + 10} C 200 ${PY - 30} 230 ${PY + 40} 260 ${PY + 10} C 290 ${PY - 30} 320 ${PY - 50} 340 ${PY - 70}`, { stroke: "#0f766e", strokeWidth: 2.2, dash: "5 4", arrow: true }),
  text("h2o", 116, 222, "2 H₂O → O₂ + 4 H⁺", "2 H₂O → O₂ + 4 H⁺", { ltr: true, weight: 700, textColor: "#0369a1", fontSize: 16.5 }),
  text("nadph", 350, 64, "NADPH", "NADPH", { ltr: true, weight: 800, textColor: NADH }),
  label("l_ps", 90, 40, "Light excites PSII and PSI", "האור מעורר את \u2066PSII\u2069 ו-\u2066PSI\u2069", [70, PY - 26], { anchor: "start", shortHe: "עירור באור", short: "Light" }),
];
const ph3: El[] = [
  ...thyl(),
  ...cx2("psii", 70, 60, "#bbf7d0", "PSII"), ...cx2("b6f", 170, 44, "#fde68a", "b₆f"), ...cx2("psi", 260, 60, "#a7f3d0", "PSI"),
  path("atps", `M 334 ${PY + 14} L 334 ${PY - 14} M 350 ${PY + 14} L 350 ${PY - 14}`, { stroke: "#9a3412", strokeWidth: 6 }),
  circle("f1", 342, PY - 40, 18, "#fdba74", { stroke: "#9a3412", strokeWidth: 1.6 }),
  arrow("hflow", 342, PY + 60, 342, PY + 18, "#dc2626", 2.4),
  ...[[100, 220], [140, 232], [180, 216], [220, 234], [300, 222]].map(([x, y], i) => text(`hp${i}`, x, y, "H⁺", "H⁺", { ltr: true, weight: 800, textColor: "#dc2626" })),
  text("atp", 342, PY - 70, "ADP + Pᵢ → ATP", "ADP + Pᵢ → ATP", { ltr: true, weight: 700, textColor: ATPC, fontSize: 16.5 }),
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
const gBase = (): El[] => [...islet(), ...vessel(), liver(), muscleCell(),
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
  label("l_hi", 160, 40, "After a meal: glucose ↑", "אחרי ארוחה: הגלוקוז עולה", [190, 172], { anchor: "start", shortHe: "גלוקוז עולה", short: "Glucose ↑" }),
  label("l_beta", 14, 290, "β cells release insulin", "תאי β מפרישים אינסולין", [80, 72], { anchor: "start", shortHe: "תאי β: אינסולין", short: "β cells: insulin" }),
];
const bg2: El[] = [
  ...gBase(), ...GLC_LO.map(([x, y], i) => glc(`g${i}`, x, y)),
  ...[[240, 238], [270, 244], [300, 236]].map(([x, y], i) => glc(`gm${i}`, x, y)),
  ...[[330, 70], [350, 90]].map(([x, y], i) => glc(`gl${i}`, x, y)),
  ...[0, 1, 2].map((i) => rect(`glut${i}`, 226 + i * 50, 216, 10, 10, "#1d4ed8", { rx: 2 })),
  arrow("up_m", 270, 196, 270, 224, "#1d4ed8", 2.2), arrow("up_l", 320, 150, 326, 116, "#1d4ed8", 2.2),
  label("l_glut", 14, 250, "GLUT4 moves to the membrane", "GLUT4 עובר לממברנה", [236, 221], { anchor: "start", shortHe: "GLUT4", short: "GLUT4" }),
  label("l_gly", 150, 40, "Liver stores glycogen", "הכבד אוגר גליקוגן", [340, 80], { anchor: "start" }),
];
const bg3: El[] = [
  ...gBase(), ...GLC_LO.slice(0, 2).map(([x, y], i) => glc(`g${i}`, x, y)),
  ...[[120, 110], [134, 124]].map(([x, y], i) => circle(`gcg${i}`, x, y, 4, "#b91c1c")),
  arrow("gcg_out", 110, 110, 160, 140, "#b91c1c", 2.2),
  label("l_lo", 160, 40, "Fasting: glucose ↓", "בצום: הגלוקוז יורד", [230, 170], { anchor: "start" }),
  label("l_alpha", 14, 290, "α cells release glucagon", "תאי α מפרישים גלוקגון", [94, 84], { anchor: "start", shortHe: "תאי α: גלוקגון", short: "α cells: glucagon" }),
];
const bg4: El[] = [
  ...gBase(), ...GLC_HI.slice(3).map(([x, y], i) => glc(`g${i + 3}`, x, y)),
  ...[[330, 70], [350, 90]].map(([x, y], i) => glc(`gl${i}`, x, y)),
  arrow("out_l", 326, 118, 318, 150, "#b45309", 2.4),
  label("l_liv", 14, 40, "Liver: glycogenolysis + gluconeogenesis", "הכבד: פירוק גליקוגן וגלוקונאוגנזה", [330, 80], { anchor: "start", shortHe: "הכבד משחרר גלוקוז", short: "Liver releases glucose" }),
  text("l_fb", 96, 236, "negative feedback", "משוב שלילי", { weight: 800, textColor: "#15803d" }),
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
