import { C, arrow, line, mitochondrion, path, rect, smooth, text, type El, type ProcessScene } from "./kit";

/* ══ GLUCONEOGENESIS in a hepatocyte (Lehninger 8e ch. 14; Berg 10e ch. 16) ══════
   Design rule: one idea per step, few labels, and anything not part of the step is removed (not left faint).
   Step 1 shows the problem: the pathway as a ladder with glycolysis running down beside it.
   From step 2 the ladder slides to the left edge, freeing the middle of the cell for the bypasses,
   each drawn where it happens: mitochondrion (bottom right), cytosol, ER lumen (top right). */

const GLY = "#94a3b8", IRR = "#dc2626", GNG = "#16a34a", ENZ = "#0369a1";
const Y = { g6p: 50, f6p: 92, fbp: 134, pep: 206, pyr: 262 };
type St = 1 | 2 | 3 | 4 | 5;

const node = (id: string, x: number, y: number, en: string, he: string, w: number, color = C.ink, op = 1): El[] => [
  rect(`${id}_bg`, x - w / 2, y - 12, w, 24, "#ffffff", { stroke: color, strokeWidth: 2, rx: 12, opacity: op }),
  text(`${id}_tx`, x, y + 5.5, en, he, { weight: 700, fontSize: 14, textColor: color, ltr: en === he, opacity: op }),
];
const t = (id: string, x: number, y: number, en: string, he: string, color: string, op: number, o: Partial<El> = {}): El =>
  text(id, x, y, en, he, { fontSize: 14, weight: 700, textColor: color, ltr: en === he, opacity: op, ...o });

function scene(step: St): El[] {
  const X = step === 1 ? 200 : 70; // ladder axis
  const on = (...s: St[]) => (s.includes(step) ? 1 : 0);
  const G = X + 34; // gluconeogenesis arrows, right of the ladder
  return [
    // the cell, its mitochondrion and ER
    rect("cell", 6, 6, 388, 288, "#f8fafc", { stroke: "#15803d", strokeWidth: 2.5, rx: 26 }),
    ...mitochondrion("mito", 316, 222, 80, 62, {}, 0.12, 4),
    path("er", smooth([[290, 30], [334, 22], [382, 32], [386, 66], [380, 100], [338, 108], [298, 98], [286, 64]], true), { color: "#fce7f3", stroke: "#be185d", strokeWidth: 2 }),
    t("t_er", 308, 44, "ER", "ER", "#be185d", 1, { fontSize: 13 }),

    // the ladder (slides left after step 1)
    ...node("g6p", X, Y.g6p, "G6P", "G6P", 56),
    ...node("f6p", X, Y.f6p, "F6P", "F6P", 56),
    ...node("fbp", X, Y.fbp, "F-1,6-BP", "F-1,6-BP", 84),
    ...node("pep", X, Y.pep, "PEP", "PEP", 56),
    ...node("pyr", X, Y.pyr, "Pyruvate", "פירובט", 76),
    line("mid", X, Y.fbp + 12, X, Y.pep - 12, GLY, 2.5, { dash: "5 4" }),

    // ── step 1: glycolysis down the left side; its 3 irreversible steps in red
    arrow("gl0", 284, 48, X + 30, Y.g6p, IRR, 2.6, { opacity: on(1) }),
    t("e_hk", 236, 30, "hexokinase", "הקסוקינאז", IRR, on(1), { fontSize: 13 }),
    arrow("gl2", X - 34, Y.f6p + 10, X - 34, Y.fbp - 10, IRR, 2.6, { opacity: on(1) }),
    t("e_pfk", X - 42, (Y.f6p + Y.fbp) / 2 + 4, "PFK-1", "PFK-1", IRR, on(1), { anchor: "end", fontSize: 13 }),
    arrow("gl4", X - 34, Y.pep + 10, X - 34, Y.pyr - 10, IRR, 2.6, { opacity: on(1) }),
    t("e_pk", X - 42, (Y.pep + Y.pyr) / 2 + 4, "pyruvate kinase", "פירובט קינאז", IRR, on(1), { anchor: "end", fontSize: 13 }),
    t("t_mid", X - 42, (Y.fbp + Y.pep) / 2 + 4, "7 shared reversible steps", "7 שלבים הפיכים", C.muted, on(1), { anchor: "end", fontSize: 13, weight: 400 }),

    // ── step 2: pyruvate carboxylase in the mitochondrion, mitochondrial PEPCK, PEP leaves
    path("b1a", smooth([[X + 40, Y.pyr], [180, 270], [272, 258]]), { stroke: GNG, strokeWidth: 2.6, arrow: true, opacity: on(2, 3) }),
    t("e_pc", 172, 288, "pyruvate carboxylase · ATP", "פירובט קרבוקסילאז · ATP", ENZ, on(2), { fontSize: 13 }),
    ...node("oaa_m", 302, 254, "OAA", "OAA", 52, GNG, on(2, 3)),
    arrow("b1m", 302, 240, 302, 204, GNG, 2.4, { opacity: on(2) }),
    ...node("pep_m", 302, 190, "PEP", "PEP", 46, GNG, on(2)),
    t("e_pepckm", 312, 226, "PEPCK-M", "PEPCK-M", ENZ, on(2), { anchor: "start", fontSize: 13 }),
    path("b1b", smooth([[278, 188], [180, 190], [X + 32, Y.pep]]), { stroke: GNG, strokeWidth: 2.6, arrow: true, opacity: on(2) }),
    t("t_out", 180, 178, "PEP leaves the mitochondrion", "PEP יוצא לציטוזול", GNG, on(2), { fontSize: 13 }),

    // ── step 3: the other route — out as malate, back to OAA, cytosolic PEPCK
    path("b2a", smooth([[276, 258], [244, 252], [222, 246]]), { stroke: GNG, strokeWidth: 2.4, arrow: true, opacity: on(3) }),
    ...node("mal", 190, 242, "Malate", "מאלאט", 64, "#7c3aed", on(3)),
    arrow("b2b", 190, 228, 190, 196, GNG, 2.4, { opacity: on(3) }),
    ...node("oaa_c", 190, 182, "OAA", "OAA", 52, GNG, on(3)),
    path("b2c", smooth([[164, 184], [130, 196], [X + 32, Y.pep]]), { stroke: GNG, strokeWidth: 2.6, arrow: true, opacity: on(3) }),
    t("e_pepckc", 190, 156, "PEPCK-C · GTP", "PEPCK-C · GTP", ENZ, on(3), { fontSize: 13 }),
    t("t_nadh", 124, 234, "+ NADH", "+ NADH", "#0d9488", on(3), { fontSize: 13 }),

    // ── step 4: FBPase-1, then G6P into the ER, G6Pase, glucose to the blood
    arrow("up_mid", G, Y.pep - 12, G, Y.fbp + 12, GNG, 2.2, { opacity: on(4, 5), dash: "5 4" }),
    arrow("b3", G, Y.fbp - 10, G, Y.f6p + 10, GNG, 2.8, { opacity: on(4, 5) }),
    t("e_fbp", G + 10, (Y.f6p + Y.fbp) / 2 + 5, "FBPase-1", "FBPase-1", ENZ, on(4, 5), { anchor: "start", fontSize: 13 }),
    arrow("up_f6p", G, Y.f6p - 10, G, Y.g6p + 10, GNG, 2.2, { opacity: on(4, 5) }),
    path("b4a", smooth([[X + 30, Y.g6p], [200, 50], [296, 62]]), { stroke: GNG, strokeWidth: 2.6, arrow: true, opacity: on(4, 5) }),
    ...node("glc", 340, 66, "Glucose", "גלוקוז", 66, GNG, on(4, 5)),
    t("e_g6p", 340, 96, "G6Pase", "G6Pase", ENZ, on(4), { fontSize: 13 }),
    arrow("b4b", 340, 52, 340, 12, GNG, 2.8, { opacity: on(4, 5) }),
    t("t_blood", 268, 22, "to blood · GLUT2", "לדם · GLUT2", GNG, on(4), { fontSize: 13 }),

    // ── step 5: control and cost
    t("r_f26", G + 10, (Y.f6p + Y.fbp) / 2 + 26, "⊣ F-2,6-BP", "F-2,6-BP ⊣", IRR, on(5), { anchor: "start", ltr: true }),
    t("r_glcg", 182, 160, "glucagon → more", "גלוקגון ← יותר", GNG, on(5)),
    t("r_ins", 182, 184, "insulin → less", "אינסולין ← פחות", IRR, on(5)),
    rect("cost_bg", 116, 214, 112, 52, "#fffbeb", { stroke: C.energy, strokeWidth: 2, rx: 10, opacity: on(5) }),
    t("cost1", 172, 236, "4 ATP + 2 GTP", "4 ATP + 2 GTP", "#b45309", on(5)),
    t("cost2", 172, 256, "+ 2 NADH", "+ 2 NADH", "#b45309", on(5)),
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
    { color: IRR, he: "שלב בלתי הפיך של הגליקוליזה", en: "Irreversible glycolytic step", swatch: "arrow" },
    { color: GNG, he: "גלוקונאוגנזה", en: "Gluconeogenesis", swatch: "arrow" },
    { color: ENZ, he: "אנזים", en: "Enzyme", swatch: "dot" },
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
      titleHe: "מעקף 1: מפירובט ל-PEP דרך המיטוכונדריה", titleEn: "Bypass 1: Pyruvate to PEP via the Mitochondrion",
      descHe: "פירובט נכנס למיטוכונדריה, ושם פירובט קרבוקסילאז (עם ביוטין ו-ATP; מופעל על ידי אצטיל-CoA) הופך אותו לאוקסלואצטט (OAA). PEP קרבוקסיקינאז מיטוכונדריאלי (PEPCK-M) הופך את ה-OAA ל-PEP בעזרת GTP, וה-PEP יוצא לציטוזול. שני צעדים ושני קשרים עתירי אנרגיה — במקום הצעד האחד של פירובט קינאז.",
      descEn: "Pyruvate enters the mitochondrion, where pyruvate carboxylase (with biotin and ATP; activated by acetyl-CoA) turns it into oxaloacetate (OAA). Mitochondrial PEP carboxykinase (PEPCK-M) converts OAA to PEP using GTP, and PEP leaves for the cytosol. Two steps and two high-energy bonds — instead of pyruvate kinase's single step.",
      elements: scene(2),
    },
    {
      titleHe: "הדרך השנייה: מאלאט ו-PEPCK ציטוזולי", titleEn: "The Other Route: Malate and Cytosolic PEPCK",
      descHe: "OAA לא עובר את הממברנה הפנימית. בדרך השנייה הוא מחוזר למאלאט, המאלאט יוצא לציטוזול ושם מחומצן חזרה ל-OAA — וכך נוצר גם NADH בציטוזול, שהמסלול צריך בהמשך. PEPCK ציטוזולי (PEPCK-C) הופך אותו ל-PEP בעזרת GTP. כשהמקור הוא פירובט או אלנין עוברים בדרך הזו; כשהמקור לקטט, NADH כבר נוצר בציטוזול, והדרך המיטוכונדריאלית מתאימה.",
      descEn: "OAA cannot cross the inner membrane. In the other route it is reduced to malate, malate leaves for the cytosol and is re-oxidised to OAA there — which also makes the cytosolic NADH the pathway needs later. Cytosolic PEPCK (PEPCK-C) turns it into PEP using GTP. From pyruvate or alanine this route is used; from lactate, NADH is already made in the cytosol and the mitochondrial route fits.",
      elements: scene(3),
    },
    {
      titleHe: "מעקפים 2 ו-3: הסרת זרחות", titleEn: "Bypasses 2 and 3: Removing Phosphates",
      descHe: "מ-PEP עולים בשלבים ההפיכים עד F-1,6-BP. פרוקטוז-1,6-ביספוספטאז (FBPase-1) מסיר זרחה ויוצר F6P — במקום PFK-1. בסוף, G6P נכנס ל-ER, ושם גלוקוז-6-פוספטאז מסיר את הזרחה; הגלוקוז החופשי יוצא לדם דרך GLUT2. בשריר אין גלוקוז-6-פוספטאז — ולכן השריר אינו מספק גלוקוז לדם.",
      descEn: "From PEP the reversible steps climb to F-1,6-BP. Fructose-1,6-bisphosphatase (FBPase-1) removes a phosphate to give F6P — instead of PFK-1. Finally G6P enters the ER, where glucose-6-phosphatase removes the phosphate; free glucose leaves for the blood through GLUT2. Muscle lacks glucose-6-phosphatase — so muscle does not supply blood glucose.",
      elements: scene(4),
    },
    {
      titleHe: "מחיר ובקרה", titleEn: "Cost and Control",
      descHe: "גלוקוז אחד משני פירובט עולה 4 ATP, 2 GTP ו-2 NADH — יותר מה-2 ATP שהגליקוליזה מרוויחה. שני המסלולים מבוקרים הפוך זה מזה כדי למנוע מעגל סרק: פרוקטוז-2,6-ביספוספט מעודד את PFK-1 ומעכב את FBPase-1; גלוקגון מוריד את רמתו ומעודד גלוקונאוגנזה בכבד, ואינסולין פועל בכיוון ההפוך.",
      descEn: "One glucose from two pyruvate costs 4 ATP, 2 GTP and 2 NADH — more than the 2 ATP glycolysis gains. The two pathways are regulated reciprocally to avoid a futile cycle: fructose-2,6-bisphosphate stimulates PFK-1 and inhibits FBPase-1; glucagon lowers its level and promotes gluconeogenesis in the liver, while insulin acts the other way.",
      elements: scene(5),
    },
  ],
};
