import { C, arrow, badge, bilayer, circle, label, mitochondrion, path, ring, text, type El, type ProcessScene } from "./kit";

const tri = (id: string, x: number, y: number, o: Partial<El> = {}) =>
  path(id, `M ${x - 18} ${y + 6} L ${x - 6} ${y - 6} L ${x + 6} ${y + 6} L ${x + 18} ${y - 6}`, { stroke: "#ea580c", strokeWidth: 5, ...o });
const acoa = (x: number, y: number): El[] => [
  path("acoa", `M ${x - 30} ${y + 5} L ${x - 18} ${y - 6} L ${x - 6} ${y + 5}`, { stroke: "#be123c", strokeWidth: 5 }),
  path("coa", `M ${x - 4} ${y} m -1 0 a 17 12 0 1 0 34 0 a 17 12 0 1 0 -34 0`, { color: "#fecdd3", stroke: "#be123c", strokeWidth: 1.8 }),
  text("coa_t", x + 12, y + 6, "CoA", "CoA", { ltr: true, weight: 700, textColor: "#9f1239", halo: false }),
];

// zoomed mitochondrion used in steps 2-3 (matrix fills the view)
const MITO_BIG = () => mitochondrion("mt", 214, 166, 188, 118, {}, 0.3, 5);

const step1: El[] = [
  ...mitochondrion("mt", 318, 176, 70, 46, {}, 0.3, 5),
  path("glc", ring(56, 150, 22, 6), { color: "#fde68a", stroke: "#b45309", strokeWidth: 2 }),
  text("glc_t", 56, 196, "Glucose (6C)", "גלוקוז (6C)"),
  arrow("gly", 84, 150, 142, 150, C.line, 2.6),
  text("gly_t", 113, 132, "Glycolysis", "גליקוליזה", { textColor: "#0369a1" }),
  tri("pyr1", 178, 132), tri("pyr2", 178, 168),
  text("pyr_t", 178, 204, "2 pyruvate (3C)", "2 פירובט (3C)"),
  ...badge("b_atp", 70, 244, "2 ATP", C.energy), ...badge("b_nadh", 150, 244, "2 NADH", C.redox, { w: 78 }),
  text("cyto", 20, 40, "Cytosol", "ציטוזול", { anchor: "start", weight: 700, textColor: C.muted }),
  label("l_mt", 250, 60, "Mitochondrion", "מיטוכונדריה", [300, 134], { anchor: "start" }),
];

const step2: El[] = [
  ...MITO_BIG(),
  tri("pyr1", 44, 166),
  arrow("in", 64, 166, 104, 166, "#ea580c", 2.4),
  // pyruvate dehydrogenase complex: E1, E2 core, E3
  circle("pdh1", 132, 150, 17, "#bae6fd", { stroke: "#0369a1", strokeWidth: 2 }),
  circle("pdh2", 156, 176, 17, "#7dd3fc", { stroke: "#0369a1", strokeWidth: 2 }),
  circle("pdh3", 128, 184, 13, "#e0f2fe", { stroke: "#0369a1", strokeWidth: 2 }),
  arrow("co2a", 150, 140, 176, 110, C.co2, 2.2),
  ...badge("b_co2", 196, 100, "CO₂", C.co2),
  arrow("nadh_a", 160, 196, 176, 222, C.redox, 2.2),
  ...badge("b_nadh", 204, 232, "NADH", C.redox),
  arrow("out", 180, 166, 232, 166, C.line, 2.4),
  ...acoa(272, 166),
  label("l_pdh", 60, 290, "Pyruvate dehydrogenase", "פירובט דהידרוגנאז", [128, 196], { anchor: "start", shortHe: "PDH", short: "PDH" }),
  label("l_acoa", 250, 100, "Acetyl-CoA", "אצטיל-CoA", [262, 158], { anchor: "start" }),
  label("l_im", 290, 290, "Inner membrane", "ממברנה פנימית", [330, 240], { anchor: "start", shortHe: "פנימית", short: "Inner" }),
  label("l_om", 250, 28, "Outer membrane", "ממברנה חיצונית", [300, 58], { anchor: "start", shortHe: "חיצונית", short: "Outer" }),
  text("mat", 316, 170, "Matrix", "מטריצה", { anchor: "start", weight: 700, textColor: "#9a3412" }),
];

// Citric acid cycle drawn as a ring of three arrowed arcs around (CX, CY)
const CX = 222, CY = 166, R = 44;
const arcSeg = (id: string, a0: number, a1: number) => {
  const p = (a: number) => [CX + R * Math.cos((a * Math.PI) / 180), CY + R * Math.sin((a * Math.PI) / 180)].map((n) => Math.round(n * 10) / 10);
  const [x0, y0] = p(a0), [x1, y1] = p(a1);
  return path(id, `M ${x0} ${y0} A ${R} ${R} 0 0 1 ${x1} ${y1}`, { stroke: "#be123c", strokeWidth: 3, arrow: true });
};
const step3: El[] = [
  ...MITO_BIG(),
  ...acoa(108, 120),
  arrow("feed", 142, 128, 180, 138, "#be123c", 2.4),
  arcSeg("k1", -100, 10), arcSeg("k2", 20, 130), arcSeg("k3", 140, 250),
  text("k_cit", CX + 4, CY - R - 10, "Citrate (6C)", "ציטרט (6C)", { anchor: "start", fontSize: 16.5 }),
  text("k_oaa", CX, CY + R + 26, "Oxaloacetate (4C)", "אוקסלואצטט (4C)", { fontSize: 16.5, short: "OAA (4C)", shortHe: "OAA (4C)" }),
  text("k_n", CX, CY + 6, "×2", "×2", { ltr: true, weight: 800, textColor: "#be123c" }),
  ...badge("b_nadh", 330, 126, "3 NADH", C.redox, { w: 80 }),
  ...badge("b_fad", 330, 158, "FADH₂", C.redox, { w: 72 }),
  ...badge("b_atp", 330, 190, "ATP / GTP", C.energy, { w: 96 }),
  ...badge("b_co2", 330, 222, "2 CO₂", C.co2, { w: 64 }),
  text("perturn", 330, 98, "per turn", "לכל סיבוב", { textColor: C.muted }),
  label("l_cyc", 30, 250, "Citric acid cycle (8 steps)", "מעגל קרבס (8 תגובות)", [CX - R, CY + 12], { anchor: "start", shortHe: "מעגל קרבס", short: "Krebs cycle" }),
  text("mat", 20, 290, "Matrix", "מטריצה", { anchor: "start", weight: 700, textColor: "#9a3412" }),
];

// Step 4: inner membrane close-up — intermembrane space above, matrix below
const MY = 158;
const cx = (id: string, d: string, color: string) => path(id, d, { color, stroke: "#334155", strokeWidth: 1.6 });
const Hup = (id: string, x: number) => [arrow(id, x, MY + 44, x, MY - 56, "#dc2626", 2), text(`${id}_t`, x, MY - 62, "H⁺", "H⁺", { ltr: true, weight: 700, textColor: "#dc2626" })];
const step4: El[] = [
  ...bilayer("mem", 0, 400, MY, { th: 24 }),
  cx("c1", `M 36 ${MY - 26} L 76 ${MY - 26} L 76 ${MY + 40} L 64 ${MY + 72} L 36 ${MY + 72} Z`, "#a7f3d0"),
  cx("c2", `M 102 ${MY + 4} L 128 ${MY + 4} L 128 ${MY + 40} L 102 ${MY + 40} Z`, "#fef08a"),
  circle("q", 150, MY, 8, "#fde047", { stroke: "#a16207", strokeWidth: 1.5 }),
  cx("c3", `M 172 ${MY - 30} L 212 ${MY - 30} L 212 ${MY + 34} L 172 ${MY + 34} Z`, "#bfdbfe"),
  circle("cytc", 234, MY - 36, 8, "#fca5a5", { stroke: "#b91c1c", strokeWidth: 1.5 }),
  cx("c4", `M 252 ${MY - 28} L 290 ${MY - 28} L 290 ${MY + 34} L 252 ${MY + 34} Z`, "#ddd6fe"),
  // ATP synthase: F0 rotor in the membrane, stalk, F1 head in the matrix
  cx("f0", `M 334 ${MY - 16} L 370 ${MY - 16} L 370 ${MY + 14} L 334 ${MY + 14} Z`, "#fed7aa"),
  path("stalk", `M 352 ${MY + 14} L 352 ${MY + 44}`, { stroke: "#9a3412", strokeWidth: 5 }),
  circle("f1", 352, MY + 64, 22, "#fdba74", { stroke: "#9a3412", strokeWidth: 1.8 }),
  text("c1_t", 50, MY + 58, "I", "I", { ltr: true, weight: 800 }),
  text("c2_t", 115, MY + 30, "II", "II", { ltr: true, weight: 800 }),
  text("q_t", 150, MY - 16, "Q", "Q", { ltr: true, weight: 800 }),
  text("c3_t", 186, MY + 6, "III", "III", { ltr: true, weight: 800 }),
  text("cytc_t", 234, MY - 50, "c", "c", { ltr: true, weight: 800, textColor: "#b91c1c" }),
  text("c4_t", 265, MY + 6, "IV", "IV", { ltr: true, weight: 800 }),
  // electron path (dashed)
  path("e_path", `M 40 ${MY + 104} L 56 ${MY + 72} L 70 ${MY + 8} L 150 ${MY + 2} L 190 ${MY - 6} L 234 ${MY - 30} L 268 ${MY - 4} L 276 ${MY + 60}`, { stroke: "#0f766e", strokeWidth: 2.2, dash: "5 4", arrow: true }),
  text("nadh", 28, MY + 124, "NADH", "NADH", { ltr: true, weight: 700, textColor: C.redox }),
  text("fadh", 116, MY + 64, "FADH₂", "FADH₂", { ltr: true, weight: 700, textColor: C.redox }),
  text("o2", 276, MY + 82, "O₂ → H₂O", "O₂ → H₂O", { ltr: true, weight: 700, textColor: "#0369a1" }),
  ...Hup("h1", 68), ...Hup("h3", 204), ...Hup("h4", 282),
  arrow("hdown", 330, MY - 56, 342, MY - 4, "#dc2626", 2),
  text("hdown_t", 328, MY - 62, "H⁺", "H⁺", { ltr: true, weight: 700, textColor: "#dc2626" }),
  text("atp", 352, MY + 110, "ADP + Pᵢ → ATP", "ADP + Pᵢ → ATP", { ltr: true, weight: 700, textColor: "#b45309", short: "ATP", shortHe: "ATP" }),
  text("ims", 8, 30, "Intermembrane space (high H⁺)", "מרווח בין-ממברנלי (ריכוז H⁺ גבוה)", { anchor: "start", weight: 700, textColor: C.muted, short: "Intermembrane space", shortHe: "מרווח בין-ממברנלי" }),
  text("mat", 150, 292, "Matrix", "מטריצה", { anchor: "start", weight: 700, textColor: "#9a3412" }),
  label("l_syn", 250, 290, "ATP synthase", "ATP סינתאז", [352, MY + 44], { anchor: "start" }),
];

export const respiration: ProcessScene = {
  slug: "cellular-respiration",
  legend: [
    { color: "#c2410c", he: "ממברנות המיטוכונדריה", en: "Mitochondrial membranes", swatch: "ring" },
    { color: C.energy, he: "ATP", en: "ATP", swatch: "ring" },
    { color: C.redox, he: "NADH / FADH₂ (נשאי אלקטרונים)", en: "NADH / FADH₂ (electron carriers)", swatch: "ring" },
    { color: "#0f766e", he: "מסלול האלקטרונים", en: "Electron path", swatch: "dash" },
    { color: "#dc2626", he: "שאיבת H⁺", en: "H⁺ pumping", swatch: "arrow" },
  ],
  steps: [
    {
      titleHe: "גליקוליזה — פירוק גלוקוז לפירובט", titleEn: "Glycolysis — Glucose to Pyruvate",
      descHe: "בציטוזול: גלוקוז (6C) מפורק ל-2 פירובט (3C). מושקעים 2 ATP ומיוצרים 4 ATP ו-2 NADH — רווח נקי של 2 ATP ו-2 NADH. הגליקוליזה אינה דורשת חמצן; בנוכחות O₂ הפירובט ממשיך למיטוכונדריה.",
      descEn: "In the cytosol, glucose (6C) is split into 2 pyruvate (3C). 2 ATP are invested and 4 ATP + 2 NADH are made — a net 2 ATP and 2 NADH. Glycolysis does not need oxygen; when O₂ is present, pyruvate continues into the mitochondrion.",
      elements: step1,
    },
    {
      titleHe: "חמצון פירובט — כניסה למטריצה", titleEn: "Pyruvate Oxidation — Into the Matrix",
      descHe: "הפירובט מועבר דרך שתי ממברנות המיטוכונדריה אל המטריצה. קומפלקס פירובט דהידרוגנאז משחרר CO₂, מחזר NAD⁺ ל-NADH וקושר את שארית שני הפחמנים ל-קואנזים A → אצטיל-CoA. לכל גלוקוז (2 פירובט): 2 אצטיל-CoA, 2 NADH, 2 CO₂.",
      descEn: "Pyruvate is carried across both mitochondrial membranes into the matrix. The pyruvate dehydrogenase complex releases CO₂, reduces NAD⁺ to NADH and attaches the remaining two carbons to coenzyme A → acetyl-CoA. Per glucose (2 pyruvate): 2 acetyl-CoA, 2 NADH, 2 CO₂.",
      elements: step2,
    },
    {
      titleHe: "מעגל קרבס — ייצור NADH ו-FADH₂", titleEn: "Citric Acid Cycle — Generating NADH and FADH₂",
      descHe: "במטריצה: אצטיל-CoA (2C) מתחבר לאוקסלואצטט (4C) ויוצר ציטרט (6C). ב-8 תגובות הציטרט מחומצן בחזרה לאוקסלואצטט. לכל סיבוב: 2 CO₂, 3 NADH, 1 FADH₂ ו-1 ATP (או GTP, בזרחון ברמת הסובסטרט). לכל גלוקוז (2 סיבובים): 6 NADH, 2 FADH₂, 2 ATP, 4 CO₂.",
      descEn: "In the matrix, acetyl-CoA (2C) joins oxaloacetate (4C) to form citrate (6C). Over 8 reactions citrate is oxidised back to oxaloacetate. Per turn: 2 CO₂, 3 NADH, 1 FADH₂ and 1 ATP (or GTP, by substrate-level phosphorylation). Per glucose (2 turns): 6 NADH, 2 FADH₂, 2 ATP, 4 CO₂.",
      elements: step3,
    },
    {
      titleHe: "שרשרת העברת אלקטרונים ו-ATP סינתאז", titleEn: "Electron Transport Chain and ATP Synthase",
      descHe: "NADH מוסר אלקטרונים לקומפלקס I ו-FADH₂ לקומפלקס II. יוביקינון (Q) וציטוכרום c מעבירים אותם דרך קומפלקס III אל IV, שם O₂ — הקולט הסופי — מחוזר למים. האנרגיה משמשת את קומפלקסים I, III ו-IV לשאיבת H⁺ אל המרווח הבין-ממברנלי. זרימת H⁺ חזרה דרך ATP סינתאז מסובבת אותו ומייצרת ATP (כימיאוסמוזה): כ-26–28 ATP, כך שהסך לגלוקוז הוא כ-30–32 ATP.",
      descEn: "NADH donates electrons to Complex I and FADH₂ to Complex II. Ubiquinone (Q) and cytochrome c carry them through Complex III to IV, where O₂ — the final acceptor — is reduced to water. The energy lets Complexes I, III and IV pump H⁺ into the intermembrane space. H⁺ flowing back through ATP synthase turns it and makes ATP (chemiosmosis): about 26–28 ATP, for a total of about 30–32 ATP per glucose.",
      elements: step4,
    },
  ],
};
