import { C, arrow, badge, circle, label, path, ring, text, type El, type ProcessScene } from "./kit";

// Sugar rings: glucose / G6P are 6-membered (pyranose), F6P / F1,6BP 5-membered (furanose).
// Phosphate groups = small orange circles marked P.
const PH = "#f97316";
const phos = (id: string, cx: number, cy: number, o: Partial<El> = {}): El[] => [
  circle(`${id}`, cx, cy, 10.5, PH, { stroke: "#fff", strokeWidth: 1.5, ...o }),
  text(`${id}_t`, cx, cy + 6, "P", "P", { ltr: true, weight: 800, textColor: "#ffffff", halo: false, ...o }),
];
const sugar6 = (id: string, cx: number, cy: number, o: Partial<El> = {}) => path(id, ring(cx, cy, 20, 6), { color: "#fde68a", stroke: "#b45309", strokeWidth: 2, ...o });
const sugar5 = (id: string, cx: number, cy: number, o: Partial<El> = {}) => path(id, ring(cx, cy, 20, 5), { color: "#fed7aa", stroke: "#c2410c", strokeWidth: 2, ...o });
// 3-carbon sugar phosphate drawn as a short zig-zag chain
const tri = (id: string, x: number, y: number, color = "#fdba74", o: Partial<El> = {}) =>
  path(id, `M ${x - 18} ${y + 6} L ${x - 6} ${y - 6} L ${x + 6} ${y + 6} L ${x + 18} ${y - 6}`, { stroke: color, strokeWidth: 5, ...o });

// Step 1: investment phase, four molecules left → right
const X1 = [40, 142, 244, 346];
const step1: El[] = [
  sugar6("glc", X1[0], 150),
  sugar6("g6p", X1[1], 150),
  ...phos("g6p_p", X1[1] + 26, 132),
  sugar5("f6p", X1[2], 150),
  ...phos("f6p_p", X1[2] + 24, 132),
  sugar5("fbp", X1[3], 150),
  ...phos("fbp_p1", X1[3] + 24, 132),
  ...phos("fbp_p2", X1[3] - 24, 132),
  arrow("a1", 64, 150, 116, 150, C.line), arrow("a2", 166, 150, 218, 150, C.line), arrow("a3", 268, 150, 320, 150, C.line),
  ...badge("atp1", 90, 98, "ATP", C.energy), ...badge("adp1", 90, 206, "ADP", C.muted),
  path("atp1_c", "M 90 110 Q 104 150 90 194", { stroke: C.energy, strokeWidth: 2, dash: "3 3", arrow: true }),
  ...badge("atp2", 294, 98, "ATP", C.energy), ...badge("adp2", 294, 206, "ADP", C.muted),
  path("atp2_c", "M 294 110 Q 308 150 294 194", { stroke: C.energy, strokeWidth: 2, dash: "3 3", arrow: true }),
  text("n_glc", X1[0], 196, "Glucose", "גלוקוז", { fontSize: 16.5 }),
  text("n_g6p", X1[1] + 4, 196, "G6P", "G6P", { ltr: true }),
  text("n_f6p", X1[2] - 6, 196, "F6P", "F6P", { ltr: true }),
  text("n_fbp", X1[3], 196, "F-1,6-BP", "F-1,6-BP", { ltr: true }),
  text("e_hk", 90, 60, "Hexokinase", "הקסוקינאז", { textColor: "#0369a1" }),
  text("e_pgi", 192, 124, "Isomerase", "איזומראז", { textColor: "#0369a1", short: "PGI", shortHe: "PGI" }),
  text("e_pfk", 300, 60, "PFK-1 (key step)", "PFK-1 (שלב מבקר)", { textColor: "#0369a1", short: "PFK-1", shortHe: "PFK-1" }),
  text("sum1", 200, 264, "Investment: 2 ATP used", "השקעה: 2 ATP", { weight: 700, textColor: "#b45309" }),
];

// Step 2: cleavage of F-1,6-BP into DHAP + G3P; DHAP isomerised to G3P
const step2: El[] = [
  sugar5("fbp", 70, 150),
  ...phos("fbp_p1", 94, 132), ...phos("fbp_p2", 46, 132),
  text("n_fbp", 70, 196, "F-1,6-BP (6C)", "F-1,6-BP (6C)", { ltr: true }),
  arrow("s_a1", 100, 142, 176, 96, C.line), arrow("s_a2", 100, 158, 176, 204, C.line),
  text("e_ald", 142, 156, "Aldolase", "אלדולאז", { textColor: "#0369a1" }),
  tri("dhap", 220, 90, "#fdba74"), ...phos("dhap_p", 250, 76),
  tri("g3p_a", 220, 210, "#fb923c"), ...phos("g3p_a_p", 250, 196),
  text("n_dhap", 220, 128, "DHAP (3C)", "DHAP (3C)", { ltr: true }),
  text("n_g3p", 220, 248, "G3P (3C)", "G3P (3C)", { ltr: true }),
  path("tpi", "M 290 96 Q 330 150 290 200", { stroke: "#0369a1", strokeWidth: 2.4, arrow: true }),
  text("e_tpi", 318, 140, "Isomerase", "איזומראז", { anchor: "start", textColor: "#0369a1", short: "TPI", shortHe: "TPI" }),
  text("res2", 312, 262, "= 2 × G3P", "= 2 × G3P", { ltr: true, weight: 700, textColor: "#c2410c" }),
];

// Step 3: payoff phase for one G3P (happens twice per glucose)
const RY = [44, 88, 132, 176, 220, 264];
const MX = 100;
const NAMES = ["G3P", "1,3-BPG", "3-PG", "2-PG", "PEP", "Pyruvate"];
const NAMES_HE = ["G3P", "1,3-BPG", "3-PG", "2-PG", "PEP", "פירובט"];
const ENZ: [string, string][] = [["GAPDH", "GAPDH"], ["PGK", "PGK"], ["Mutase", "מוטאז"], ["Enolase", "אנולאז"], ["Pyruvate kinase", "פירובט קינאז"]];
const step3: El[] = [
  tri("g3p_a", 40, RY[0] - 4, "#fb923c"),
  text("n_g3p", MX, RY[0] + 6, "G3P", "G3P", { ltr: true, weight: 700 }),
  ...NAMES.slice(1).map((n, i) => text(`n3_${i}`, MX, RY[i + 1] + 6, n, NAMES_HE[i + 1], { ltr: n !== "Pyruvate", weight: 700 })),
  ...ENZ.map((_, i) => arrow(`r3_${i}`, MX, RY[i] + 12, MX, RY[i + 1] - 14, C.line, 2)),
  ...ENZ.map(([en, he], i) => text(`e3_${i}`, MX + 12, RY[i] + 28, en, he, { anchor: "start", textColor: "#0369a1", fontSize: 16.5 })),
  ...badge("nadh", 300, RY[0] + 22, "NAD⁺ → NADH", C.redox, { w: 124 }),
  ...badge("atp_a", 300, RY[1] + 22, "ADP → ATP", C.energy, { w: 110 }),
  ...badge("h2o", 300, RY[3] + 22, "− H₂O", C.muted, { w: 70 }),
  ...badge("atp_b", 300, RY[4] + 22, "ADP → ATP", C.energy, { w: 110 }),
  label("x2", 224, 290, "×2 per glucose", "פעמיים לכל גלוקוז", [300, RY[4] + 34], { anchor: "start", textColor: "#c2410c", shortHe: "פעמיים", short: "×2" }),
];

export const glycolysis: ProcessScene = {
  slug: "glycolysis",
  legend: [
    { color: "#b45309", he: "טבעת סוכר (6 או 5 אטומים)", en: "Sugar ring (6- or 5-membered)", swatch: "ring" },
    { color: PH, he: "קבוצת זרחה (P)", en: "Phosphate group (P)", swatch: "dot" },
    { color: C.energy, he: "ATP / ADP", en: "ATP / ADP", swatch: "ring" },
    { color: C.redox, he: "NADH", en: "NADH", swatch: "ring" },
    { color: "#0369a1", he: "אנזים", en: "Enzyme", swatch: "arrow" },
  ],
  steps: [
    {
      titleHe: "השקעת אנרגיה — 2 ATP לגלוקוז", titleEn: "Energy Investment — 2 ATP per Glucose",
      descHe: "בציטוזול: הקסוקינאז מזרחן את הגלוקוז ל-G6P (ATP → ADP), והזרחן לוכד את הגלוקוז בתא. איזומראז הופך את G6P ל-F6P (טבעת בת 5). PFK-1 — האנזים המבקר העיקרי של הגליקוליזה — מוסיף זרחה שנייה (ATP → ADP) ויוצר פרוקטוז-1,6-ביספוספט.",
      descEn: "In the cytosol, hexokinase phosphorylates glucose to G6P (ATP → ADP), trapping it in the cell. An isomerase converts G6P to F6P (a 5-membered ring). PFK-1 — the main regulatory enzyme of glycolysis — adds a second phosphate (ATP → ADP), forming fructose-1,6-bisphosphate.",
      elements: step1,
    },
    {
      titleHe: "פיצול — שתי מולקולות G3P (3C)", titleEn: "Cleavage — Two Glyceraldehyde-3-Phosphate Molecules",
      descHe: "אלדולאז מפצל את F-1,6-BP (6 פחמנים) לשתי מולקולות בנות 3 פחמנים: DHAP ו-G3P (גליצראלדהיד-3-פוספט). טריוז-פוספט איזומראז (TPI) הופך את ה-DHAP ל-G3P, כך שמכל גלוקוז מתקבלות שתי מולקולות G3P שנכנסות לשלב ההחזר.",
      descEn: "Aldolase splits F-1,6-BP (6 carbons) into two 3-carbon molecules: DHAP and G3P (glyceraldehyde-3-phosphate). Triose phosphate isomerase (TPI) converts DHAP to G3P, so each glucose yields two G3P molecules for the payoff phase.",
      elements: step2,
    },
    {
      titleHe: "שלב ההחזר — 4 ATP + 2 NADH", titleEn: "Energy Payoff — 4 ATP + 2 NADH",
      descHe: "כל G3P עובר 5 תגובות: GAPDH מחמצן אותו ומוסיף זרחה אנאורגנית → 1,3-BPG ונוצר NADH אחד; בהמשך נוצרים 2 ATP בזרחון ברמת הסובסטרט (PGK ופירובט קינאז), ובאמצע משתחררת מולקולת מים (אנולאז). לשתי מולקולות G3P: 4 ATP ו-2 NADH. רווח נקי לגלוקוז: 2 ATP + 2 NADH + 2 פירובט.",
      descEn: "Each G3P goes through 5 reactions: GAPDH oxidises it and adds inorganic phosphate → 1,3-BPG, making one NADH; later 2 ATP are made by substrate-level phosphorylation (PGK and pyruvate kinase), and one water is removed (enolase). For both G3P: 4 ATP and 2 NADH. Net per glucose: 2 ATP + 2 NADH + 2 pyruvate.",
      elements: step3,
    },
  ],
};
