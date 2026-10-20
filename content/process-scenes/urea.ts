import { C, arrow, circle, label, mitochondrion, path, rect, smooth, text, type El, type ProcessScene, type Pt } from "./kit";

/* ══ THE UREA CYCLE in a hepatocyte (Lehninger 8e ch. 18; Berg 10e ch. 23) ══════
   Left: a mitochondrion (matrix); right: the cytosol. The cycle runs across the inner membrane:
   ornithine + carbamoyl-P → citrulline (matrix) → citrulline exported → argininosuccinate → arginine → urea + ornithine,
   and ornithine goes back in. Each step adds its reaction; earlier ones stay, dimmed. */

const N1 = "#0ea5e9", N2 = "#7c3aed", CYC = "#16a34a", UREA = "#b45309", ENZ = "#0369a1";

// a molecule as a rounded badge with a Hebrew/English name
const mol = (id: string, cx: number, cy: number, en: string, he: string, color: string, w: number, on = true, dim = false): El[] => [
  rect(`${id}_bg`, cx - w / 2, cy - 13, w, 26, "#ffffff", { stroke: color, strokeWidth: 2.2, rx: 13, opacity: on ? (dim ? 0.55 : 1) : 0 }),
  text(`${id}_tx`, cx, cy + 6, en, he, { weight: 700, fontSize: 15, textColor: color, opacity: on ? (dim ? 0.55 : 1) : 0 }),
];
const enz = (id: string, x: number, y: number, s: string, he: string, on: boolean, dim = false): El =>
  text(id, x, y, s, he, { fontSize: 13, weight: 700, textColor: ENZ, ltr: s === he, opacity: on && !dim ? 1 : 0 });
const flow = (id: string, pts: Pt[], color: string, on: boolean, dim = false): El =>
  path(id, smooth(pts), { stroke: color, strokeWidth: 2.6, arrow: true, opacity: on ? (dim ? 0.3 : 1) : 0 });

// transporter in the inner membrane (a small channel)
const porter = (id: string, x: number, y: number): El[] => [
  rect(`${id}_a`, x - 9, y - 9, 6, 18, "#e0e7ff", { stroke: "#4338ca", strokeWidth: 1.2, rx: 2 }),
  rect(`${id}_b`, x + 3, y - 9, 6, 18, "#e0e7ff", { stroke: "#4338ca", strokeWidth: 1.2, rx: 2 }),
];

const cell = (): El[] => [
  rect("cell", 6, 6, 388, 288, "#f8fafc", { stroke: "#15803d", strokeWidth: 2.5, rx: 26 }),
  ...mitochondrion("mito", 104, 154, 86, 124, {}, 0.14, 4),
  text("t_mat", 62, 146, "Matrix", "מטריצה", { weight: 700, fontSize: 14, textColor: "#9a3412" }),
  text("t_cyt", 300, 30, "Cytosol", "ציטוזול", { weight: 700, fontSize: 14, textColor: C.muted }),
  ...porter("tp1", 194, 112), ...porter("tp2", 194, 222),
];

type St = 1 | 2 | 3 | 4;
function scene(step: St): El[] {
  const on = (s: St) => step >= s, dim = (s: St) => step > s;
  return [
    ...cell(),
    // 1 — CPS I in the matrix
    text("in1", 104, 62, "NH₄⁺ + HCO₃⁻", "NH₄⁺ + HCO₃⁻", { ltr: true, weight: 700, fontSize: 14, textColor: N1, opacity: on(1) && !dim(1) ? 1 : 0 }),
    flow("f_cps", [[104, 70], [104, 86]], N1, on(1), dim(1)),
    enz("e_cps", 140, 84, "CPS I", "CPS I", on(1), dim(1)),
    ...mol("cp", 104, 104, "Carbamoyl-P", "קרבמואיל-P", N1, 104, on(1), dim(1)),
    text("atp1", 62, 84, "2 ATP", "2 ATP", { ltr: true, weight: 700, fontSize: 13, textColor: C.energy, opacity: on(1) && !dim(1) ? 1 : 0 }),
    // ornithine (matrix) is there from the start: the cycle's carrier
    ...mol("orn_m", 82, 236, "Ornithine", "אורניתין", CYC, 84, true, step === 1),
    // 2 — OTC: ornithine + carbamoyl-P → citrulline, exported
    flow("f_otc1", [[104, 118], [112, 146], [122, 162]], N1, on(2), dim(2)),
    flow("f_otc2", [[90, 222], [104, 202], [116, 190]], CYC, on(2), dim(2)),
    enz("e_otc", 62, 196, "OTC", "OTC", on(2), dim(2)),
    ...mol("cit_m", 128, 176, "Citrulline", "ציטרולין", CYC, 80, on(2), dim(2)),
    flow("f_exp", [[160, 168], [190, 124], [214, 104]], CYC, on(2), dim(2)),
    ...mol("cit_c", 262, 92, "Citrulline", "ציטרולין", CYC, 80, on(2), dim(2)),
    // 3 — ASS + aspartate → argininosuccinate; ASL → arginine + fumarate
    text("asp", 330, 52, "Aspartate (2nd N)", "אספרטט — N שני", { weight: 700, fontSize: 14, textColor: N2, opacity: on(3) && !dim(3) ? 1 : 0 }),
    flow("f_asp", [[322, 60], [314, 80], [300, 100]], N2, on(3), dim(3)),
    flow("f_ass", [[300, 96], [326, 118], [330, 136]], CYC, on(3), dim(3)),
    enz("e_ass", 360, 104, "ATP→AMP", "ATP→AMP", on(3), dim(3)),
    ...mol("asa", 316, 154, "Argininosuccinate", "ארגינינוסוקצינט", CYC, 132, on(3), dim(3)),
    flow("f_asl", [[296, 168], [276, 186], [262, 200]], CYC, on(3), dim(3)),
    flow("f_fum", [[362, 168], [368, 178]], "#be123c", on(3), dim(3)),
    text("fum", 388, 194, "Fumarate → TCA", "פומרט ← לקרבס", { anchor: "end", weight: 700, fontSize: 13, textColor: "#be123c", opacity: on(3) && !dim(3) ? 1 : 0 }),
    ...mol("arg", 246, 214, "Arginine", "ארגינין", CYC, 72, on(3), dim(3)),
    // 4 — arginase: urea out, ornithine back into the matrix
    flow("f_arg", [[246, 228], [254, 250]], UREA, on(4)),
    enz("e_arg", 300, 242, "arginase", "ארגינאז", on(4)),
    ...mol("urea", 262, 266, "Urea → blood → kidney", "אוריאה ← לדם ולכליה", UREA, 170, on(4)),
    flow("f_orn", [[210, 216], [194, 222], [176, 228], [126, 236]], CYC, on(4)),
    // N-acetylglutamate activates CPS I (step 1 only, as a regulator note)
    label("l_nag", 214, 150, "N-acetylglutamate activates", "N-אצטילגלוטמט מפעיל", [130, 84], { anchor: "start", fontSize: 13, textColor: C.muted, opacity: step === 1 ? 1 : 0 }),
    circle("nh_dot", 104, 62, 0.1, "#fff", { opacity: 0 }),
  ];
}

export const ureaScene: ProcessScene = {
  slug: "urea-cycle",
  meta: {
    topic: "biochemistry",
    nameHe: "מעגל השתנן (אוריאה)", nameEn: "The Urea Cycle",
    descHe: "הפיכת אמוניה רעילה לשתנן בכבד: קרבמואיל-פוספט, ציטרולין, ארגינינוסוקצינט, ארגינין ושחרור האוריאה",
    descEn: "Turning toxic ammonia into urea in the liver: carbamoyl phosphate, citrulline, argininosuccinate, arginine and release of urea",
    source: "Lehninger 8e ch. 18; Berg 10e ch. 23",
  },
  legend: [
    { color: CYC, he: "תגובות המעגל", en: "Cycle reactions", swatch: "arrow" },
    { color: N1, he: "החנקן הראשון (מ-NH₄⁺)", en: "1st nitrogen (from NH₄⁺)", swatch: "arrow" },
    { color: N2, he: "החנקן השני (מאספרטט)", en: "2nd nitrogen (from aspartate)", swatch: "arrow" },
    { color: UREA, he: "אוריאה", en: "Urea", swatch: "ring" },
    { color: "#4338ca", he: "נשא בממברנה הפנימית", en: "Inner-membrane transporter", swatch: "line" },
  ],
  steps: [
    {
      titleHe: "אמוניה הופכת לקרבמואיל-פוספט", titleEn: "Ammonia Becomes Carbamoyl Phosphate",
      descHe: "פירוק חומצות אמינו משחרר אמוניה (NH₄⁺), שהיא רעילה למוח. במטריצה של מיטוכונדריות הכבד האנזים קרבמואיל-פוספט סינתטאז I ‏(CPS I) מצרף NH₄⁺ ו-HCO₃⁻ ליצירת קרבמואיל-פוספט, בעלות של 2 ATP. זה הצעד המבוקר של המעגל: CPS I פעיל רק בנוכחות N-אצטילגלוטמט.",
      descEn: "Amino-acid breakdown releases ammonia (NH₄⁺), which is toxic to the brain. In the matrix of liver mitochondria carbamoyl-phosphate synthetase I (CPS I) joins NH₄⁺ and HCO₃⁻ into carbamoyl phosphate, at a cost of 2 ATP. This is the cycle's controlled step: CPS I is active only with N-acetylglutamate bound.",
      elements: scene(1),
    },
    {
      titleHe: "יצירת ציטרולין ויציאתו", titleEn: "Forming and Exporting Citrulline",
      descHe: "אורניתין טרנסקרבמואילאז (OTC) מעביר את קבוצת הקרבמואיל לאורניתין, ונוצר ציטרולין — כך נכנס למעגל החנקן הראשון. נשא בממברנה הפנימית מוציא את הציטרולין אל הציטוזול (ומכניס אורניתין בתמורה).",
      descEn: "Ornithine transcarbamoylase (OTC) transfers the carbamoyl group to ornithine, forming citrulline — this is how the first nitrogen enters the cycle. A transporter in the inner membrane moves citrulline out to the cytosol (in exchange for ornithine).",
      elements: scene(2),
    },
    {
      titleHe: "החנקן השני: ארגינינוסוקצינט וארגינין", titleEn: "The Second Nitrogen: Argininosuccinate and Arginine",
      descHe: "בציטוזול ארגינינוסוקצינט סינתטאז מחבר ציטרולין לאספרטט — שמביא את אטום החנקן השני — ונוצר ארגינינוסוקצינט (ATP → AMP + PPᵢ). ארגינינוסוקצינאז מפרק אותו לארגינין ולפומרט; הפומרט חוזר לאוקסלואצטט ולאספרטט — זה החיבור בין מעגל השתנן למעגל קרבס.",
      descEn: "In the cytosol argininosuccinate synthetase joins citrulline to aspartate — which brings the second nitrogen atom — to form argininosuccinate (ATP → AMP + PPᵢ). Argininosuccinase splits it into arginine and fumarate; fumarate is recycled to oxaloacetate and aspartate — the link between the urea cycle and the citric acid cycle.",
      elements: scene(3),
    },
    {
      titleHe: "שחרור האוריאה", titleEn: "Releasing Urea",
      descHe: "ארגינאז מפרק את הארגינין לאוריאה (שתנן) ולאורניתין, והאורניתין חוזר למיטוכונדריה לסבב נוסף. האוריאה — מולקולה מסיסה ולא רעילה עם שני אטומי חנקן — עוברת בדם לכליות ומופרשת בשתן. פגם באחד מאנזימי המעגל גורם להצטברות אמוניה בדם.",
      descEn: "Arginase splits arginine into urea and ornithine, and ornithine returns to the mitochondrion for another turn. Urea — a soluble, non-toxic molecule carrying two nitrogens — travels in the blood to the kidneys and is excreted in urine. A defect in any of the cycle's enzymes makes ammonia build up in the blood.",
      elements: scene(4),
    },
  ],
};
