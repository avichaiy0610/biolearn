import { C, arrow, label, line, mitochondrion, path, rect, smooth, text, type El, type ProcessScene } from "./kit";

/* ══ GLUCONEOGENESIS in a hepatocyte (Lehninger 8e ch. 14; Berg 10e ch. 16) ══════
   A liver cell: mitochondrion bottom-left, ER top-right. The pathway is drawn as a ladder in the cytosol:
   glycolysis runs down on the left (grey; its 3 irreversible steps red), gluconeogenesis runs up on the right
   (green), and the 3 bypasses happen where they really are — in the mitochondrion, the cytosol and the ER lumen. */

const GLY = "#94a3b8", IRR = "#dc2626", GNG = "#16a34a", ENZ = "#0369a1";
const X = 200; // ladder axis
const Y = { g6p: 50, f6p: 92, fbp: 134, pep: 206, pyr: 262 };

const node = (id: string, y: number, en: string, he: string, w: number, x = X, color = C.ink, op = 1): El[] => [
  rect(`${id}_bg`, x - w / 2, y - 12, w, 24, "#ffffff", { stroke: color, strokeWidth: 2, rx: 12, opacity: op }),
  text(`${id}_tx`, x, y + 5.5, en, he, { weight: 700, fontSize: 14, textColor: color, ltr: en === he, opacity: op }),
];
const enz = (id: string, x: number, y: number, s: string, he: string, color = ENZ, op = 1, anchor: "start" | "end" = "start"): El =>
  text(id, x, y, s, he, { fontSize: 13, weight: 700, textColor: color, ltr: s === he, anchor, opacity: op });

const cell = (): El[] => [
  rect("cell", 6, 6, 388, 288, "#f8fafc", { stroke: "#15803d", strokeWidth: 2.5, rx: 26 }),
  ...mitochondrion("mito", 316, 222, 80, 62, {}, 0.12, 4),
  path("er", smooth([[296, 30], [336, 22], [382, 32], [386, 66], [380, 100], [338, 108], [300, 98], [290, 64]], true), { color: "#fce7f3", stroke: "#be185d", strokeWidth: 2 }),
  text("t_er", 310, 44, "ER", "ER", { ltr: true, weight: 700, fontSize: 13, textColor: "#be185d" }),
  text("t_mt", 326, 300, "mitochondrion", "מיטוכונדריה", { weight: 700, fontSize: 12, textColor: "#9a3412", opacity: 0 }),
];

// glycolysis (down, left of the ladder): grey reversible, red irreversible
const GX = X - 34;
const glycolysis = (op: number, pk?: number): El[] => [
  arrow("gl1", GX, Y.g6p + 10, GX, Y.f6p - 10, GLY, 2, { opacity: op }),
  arrow("gl2", GX, Y.f6p + 10, GX, Y.fbp - 10, IRR, 2.6, { opacity: op }),
  line("gl3", GX, Y.fbp + 12, GX, Y.pep - 12, GLY, 2, { dash: "5 4", opacity: op }),
  arrow("gl4", GX, Y.pep + 10, GX, Y.pyr - 10, IRR, 2.6, { opacity: op }),
  enz("e_pfk", GX - 8, (Y.f6p + Y.fbp) / 2 + 4, "PFK-1", "PFK-1", IRR, op, "end"),
  enz("e_pk", GX - 8, (Y.pep + Y.pyr) / 2 + 4, "pyruvate kinase", "פירובט קינאז", IRR, pk ?? op, "end"),
];
const middle = (): El[] => [
  line("mid", X, Y.fbp + 12, X, Y.pep - 12, GLY, 2.5, { dash: "5 4" }),
  text("t_mid", GX - 8, (Y.fbp + Y.pep) / 2 + 4, "7 shared reversible steps", "7 שלבים הפיכים משותפים", { anchor: "end", fontSize: 13, textColor: C.muted }),
];

type St = 1 | 2 | 3 | 4;
function scene(step: St): El[] {
  const hot = (s: St) => (step === s ? 1 : step > s ? 0.5 : 0);
  const only = (s: St) => (step === s ? 1 : 0);
  return [
    ...cell(),
    ...glycolysis(step === 1 ? 1 : 0.35, step === 4 ? 0 : undefined),
    ...middle(),
    ...node("g6p", Y.g6p, "G6P", "G6P", 56),
    ...node("f6p", Y.f6p, "F6P", "F6P", 56),
    ...node("fbp", Y.fbp, "F-1,6-BP", "F-1,6-BP", 84),
    ...node("pep", Y.pep, "PEP", "PEP", 56),
    ...node("pyr", Y.pyr, "Pyruvate", "פירובט", 76),
    // step 1: the problem
    text("t_irr", 78, 28, "3 irreversible steps", "3 שלבים בלתי הפיכים", { weight: 700, fontSize: 14, textColor: IRR, opacity: only(1) }),
    text("t_irr2", 78, 50, "→ need bypasses", "← צריך מעקפים", { fontSize: 14, textColor: IRR, opacity: only(1) }),
    arrow("gl0", 290, 46, X + 32, Y.g6p, IRR, 2.4, { opacity: only(1) }),
    enz("e_hk", 234, 24, "hexokinase", "הקסוקינאז", IRR, only(1)),
    // bypass 1: pyruvate → mitochondrion → OAA (pyruvate carboxylase); then two routes to PEP:
    //   PEPCK-M inside the mitochondrion (PEP exported), or OAA → malate out → OAA → PEPCK-C in the cytosol
    path("b1a", smooth([[X + 38, Y.pyr], [256, 268], [274, 260]]), { stroke: GNG, strokeWidth: 2.6, arrow: true, opacity: hot(2) }),
    ...node("oaa_m", 252, "OAA", "OAA", 52, 302, GNG, hot(2)),
    enz("e_pc", 332, 278, "PC + ATP", "PC + ATP", ENZ, hot(2)),
    // route 1: mitochondrial PEPCK, PEP leaves
    arrow("b1m", 302, 238, 302, 204, GNG, 2.4, { opacity: hot(2) }),
    ...node("pep_m", 190, "PEP", "PEP", 46, 302, GNG, hot(2)),
    enz("e_pepckm", 312, 222, "PEPCK-M", "PEPCK-M", ENZ, hot(2)),
    enz("e_gtp", 312, 240, "+ GTP", "+ GTP", ENZ, hot(2)),
    path("b1b", smooth([[278, 190], [254, 196], [X + 32, Y.pep]]), { stroke: GNG, strokeWidth: 2.6, arrow: true, opacity: hot(2) }),
    // route 2: as malate to the cytosol, back to OAA, cytosolic PEPCK
    path("b1c", smooth([[276, 256], [252, 244], [X + 30, Y.pep + 12]]), { stroke: GNG, strokeWidth: 2.2, arrow: true, dash: "5 3", opacity: hot(2) }),
    label("e_mal", 110, 287, "or: as malate → PEPCK-C", "או: כמאלאט ← PEPCK-C", [250, 242], { anchor: "start", fontSize: 13, textColor: ENZ, opacity: hot(2) }),
    // shared steps back up
    arrow("up_mid", X + 34, Y.pep - 12, X + 34, Y.fbp + 12, GNG, 2.2, { opacity: step >= 3 ? 1 : 0, dash: "5 4" }),
    // bypass 2: FBPase-1
    arrow("b2", X + 34, Y.fbp - 10, X + 34, Y.f6p + 10, GNG, 2.8, { opacity: hot(3) }),
    enz("e_fbp", X + 44, (Y.f6p + Y.fbp) / 2 + 4, "FBPase-1", "FBPase-1", ENZ, hot(3)),
    arrow("up_f6p", X + 34, Y.f6p - 10, X + 34, Y.g6p + 10, GNG, 2.2, { opacity: hot(3) }),
    // bypass 3: G6P into the ER lumen, G6Pase, glucose out through GLUT2
    path("b3a", smooth([[X + 30, Y.g6p], [262, 54], [304, 62]]), { stroke: GNG, strokeWidth: 2.6, arrow: true, opacity: hot(3) }),
    ...node("glc", 62, "Glucose", "גלוקוז", 64, 342, GNG, hot(3)),
    enz("e_g6p", 340, 90, "G6Pase", "G6Pase", ENZ, hot(3)),
    arrow("b3b", 342, 48, 342, 10, GNG, 2.8, { opacity: hot(3) }),
    text("t_blood", 272, 18, "to blood (GLUT2)", "לדם (GLUT2)", { weight: 700, fontSize: 13, textColor: GNG, opacity: hot(3) }),
    // step 4: regulation and cost
    text("r_f26", 300, 140, "⊣ F-2,6-BP", "F-2,6-BP ⊣", { ltr: true, weight: 700, fontSize: 14, textColor: IRR, opacity: only(4) }),
    text("r_glcg", 78, 30, "glucagon ↑", "גלוקגון ↑", { weight: 700, fontSize: 14, textColor: GNG, opacity: only(4) }),
    text("r_ins", 78, 52, "insulin ↓", "אינסולין ↓", { weight: 700, fontSize: 14, textColor: IRR, opacity: only(4) }),
    rect("cost_bg", 16, 196, 120, 52, "#fffbeb", { stroke: C.energy, strokeWidth: 2, rx: 10, opacity: only(4) }),
    text("cost1", 76, 218, "4 ATP + 2 GTP", "4 ATP + 2 GTP", { ltr: true, weight: 700, fontSize: 14, textColor: "#b45309", opacity: only(4) }),
    text("cost2", 76, 238, "+ 2 NADH", "+ 2 NADH", { ltr: true, weight: 700, fontSize: 14, textColor: "#b45309", opacity: only(4) }),
  ];
}

export const gngScene: ProcessScene = {
  slug: "gluconeogenesis",
  meta: {
    topic: "biochemistry",
    nameHe: "גלוקונאוגנזה", nameEn: "Gluconeogenesis",
    descHe: "ייצור גלוקוז מפירובט בכבד: שבעה שלבים משותפים עם הגליקוליזה ושלושה מעקפים לשלבים הבלתי הפיכים — במיטוכונדריה, בציטוזול וב-ER",
    descEn: "Making glucose from pyruvate in the liver: seven steps shared with glycolysis and three bypasses of the irreversible steps — in the mitochondrion, the cytosol and the ER",
    source: "Lehninger 8e ch. 14; Berg 10e ch. 16",
  },
  legend: [
    { color: GLY, he: "גליקוליזה (שלב הפיך)", en: "Glycolysis (reversible step)", swatch: "arrow" },
    { color: IRR, he: "שלב בלתי הפיך של הגליקוליזה", en: "Irreversible glycolytic step", swatch: "arrow" },
    { color: GNG, he: "גלוקונאוגנזה", en: "Gluconeogenesis", swatch: "arrow" },
    { color: "#be185d", he: "רטיקולום אנדופלסמטי", en: "Endoplasmic reticulum", swatch: "ring" },
    { color: "#c2410c", he: "מיטוכונדריה", en: "Mitochondrion", swatch: "ring" },
  ],
  steps: [
    {
      titleHe: "גליקוליזה בכיוון ההפוך?", titleEn: "Glycolysis in Reverse?",
      descHe: "בצום הכבד (ובמידה פחותה הכליה) מייצר גלוקוז מפירובט, לקטט, גליצרול וחומצות אמינו. שבעה משלבי הגליקוליזה הפיכים ומשותפים לשני המסלולים, אבל שלושה — הקסוקינאז, PFK-1 ופירובט קינאז — בלתי הפיכים ודורשים מעקפים באנזימים אחרים.",
      descEn: "During fasting the liver (and to a lesser extent the kidney) makes glucose from pyruvate, lactate, glycerol and amino acids. Seven glycolytic steps are reversible and shared, but three — hexokinase, PFK-1 and pyruvate kinase — are irreversible and need bypass enzymes.",
      elements: scene(1),
    },
    {
      titleHe: "מעקף 1: מפירובט ל-PEP", titleEn: "Bypass 1: Pyruvate to PEP",
      descHe: "פירובט נכנס למיטוכונדריה, ושם פירובט קרבוקסילאז (עם ביוטין ו-ATP; מופעל על ידי אצטיל-CoA) הופך אותו לאוקסלואצטט (OAA). מה-OAA יש שתי דרכים ל-PEP, ושתיהן בעזרת PEP קרבוקסיקינאז ו-GTP: PEPCK מיטוכונדריאלי (PEPCK-M) יוצר PEP במיטוכונדריה, וה-PEP יוצא לציטוזול; או שה-OAA יוצא כמאלאט (OAA עצמו לא עובר את הממברנה הפנימית), מחומצן חזרה ל-OAA בציטוזול — ומספק גם NADH שנדרש בהמשך — ו-PEPCK ציטוזולי (PEPCK-C) הופך אותו ל-PEP. כשהמקור הוא לקטט, NADH כבר נוצר בציטוזול, והדרך המיטוכונדריאלית מתאימה. שני צעדים ושני קשרים עתירי אנרגיה — במקום הצעד האחד של פירובט קינאז.",
      descEn: "Pyruvate enters the mitochondrion, where pyruvate carboxylase (with biotin and ATP; activated by acetyl-CoA) turns it into oxaloacetate (OAA). From OAA there are two routes to PEP, both using PEP carboxykinase and GTP: mitochondrial PEPCK (PEPCK-M) makes PEP inside the mitochondrion and PEP is exported; or OAA leaves as malate (OAA itself cannot cross the inner membrane), is re-oxidised to OAA in the cytosol — also supplying NADH needed later — and cytosolic PEPCK (PEPCK-C) converts it to PEP. When the source is lactate, NADH is already made in the cytosol and the mitochondrial route fits. Two steps and two high-energy bonds — instead of pyruvate kinase's single step.",
      elements: scene(2),
    },
    {
      titleHe: "מעקפים 2 ו-3: הסרת זרחות", titleEn: "Bypasses 2 and 3: Removing Phosphates",
      descHe: "מ-PEP עולים בשלבים ההפיכים עד F-1,6-BP. פרוקטוז-1,6-ביספוספטאז (FBPase-1) מסיר זרחה ויוצר F6P — במקום PFK-1. בסוף, G6P נכנס ל-ER, ושם גלוקוז-6-פוספטאז מסיר את הזרחה; הגלוקוז החופשי יוצא לדם דרך GLUT2. בשריר אין גלוקוז-6-פוספטאז — ולכן השריר אינו מספק גלוקוז לדם.",
      descEn: "From PEP the reversible steps climb to F-1,6-BP. Fructose-1,6-bisphosphatase (FBPase-1) removes a phosphate to give F6P — instead of PFK-1. Finally G6P enters the ER, where glucose-6-phosphatase removes the phosphate; free glucose leaves for the blood through GLUT2. Muscle lacks glucose-6-phosphatase — so muscle does not supply blood glucose.",
      elements: scene(3),
    },
    {
      titleHe: "מחיר ובקרה", titleEn: "Cost and Control",
      descHe: "גלוקוז אחד משני פירובט עולה 4 ATP, 2 GTP ו-2 NADH — יותר מה-2 ATP שהגליקוליזה מרוויחה. שני המסלולים מבוקרים הפוך זה מזה כדי למנוע מעגל סרק: פרוקטוז-2,6-ביספוספט מעודד את PFK-1 ומעכב את FBPase-1; גלוקגון מוריד את רמתו ומעודד גלוקונאוגנזה בכבד, ואינסולין פועל בכיוון ההפוך.",
      descEn: "One glucose from two pyruvate costs 4 ATP, 2 GTP and 2 NADH — more than the 2 ATP glycolysis gains. The two pathways are regulated reciprocally to avoid a futile cycle: fructose-2,6-bisphosphate stimulates PFK-1 and inhibits FBPase-1; glucagon lowers its level and promotes gluconeogenesis in the liver, while insulin acts the other way.",
      elements: scene(4),
    },
  ],
};
