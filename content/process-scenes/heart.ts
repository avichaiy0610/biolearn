import { arrow, label, path, rect, smooth, text, type El, type ProcessScene, type Pt } from "./kit";

/* ══ THE HEART AND THE TWO CIRCUITS (Campbell 12e ch. 42; Berne & Levy 8e ch. 16) ══════
   Front view (the body's right side is on the viewer's left). Four chambers with their valves and septum,
   the great vessels, both lungs and the body's capillary bed. Each step lights the vessels of one part of the
   circuit and shows the flow with arrows; the rest stays faint. */

const D = "#2563eb", O = "#dc2626", MYO = "#7f1d1d", FLOW = "#0f172a";
const close = (pts: Pt[]) => smooth(pts, true, 0.5);

const RA: Pt[] = [[100, 120], [140, 110], [160, 128], [156, 156], [124, 162], [100, 146]];
const LA: Pt[] = [[186, 114], [226, 108], [240, 126], [234, 148], [200, 150], [186, 134]];
const RV: Pt[] = [[104, 172], [160, 168], [176, 174], [170, 214], [148, 246], [122, 232], [104, 200]];
const LV: Pt[] = [[182, 170], [240, 162], [258, 192], [246, 232], [214, 264], [192, 250], [182, 214]];

type Part = "svc" | "ivc" | "pa" | "pv" | "ao";
const VESSEL: Record<Part, { d: string; c: string; w: number }> = {
  svc: { d: "M 116 22 L 118 112", c: D, w: 11 },
  ivc: { d: "M 104 262 C 92 240 90 190 104 150", c: D, w: 11 },
  // pulmonary trunk from the right ventricle, branching to both lungs
  pa: { d: "M 166 168 C 168 130 172 104 176 90 M 176 90 C 150 76 110 70 74 70 M 176 90 C 210 58 270 50 312 58", c: D, w: 9 },
  // pulmonary veins from both lungs into the left atrium
  pv: { d: "M 70 92 C 120 100 156 104 188 118 M 316 84 C 290 96 262 106 238 120", c: O, w: 7 },
  // aorta: up from the left ventricle, the arch, down to the body
  ao: { d: "M 210 162 C 210 120 214 90 230 70 C 250 46 288 56 290 90 L 290 250 C 290 262 286 268 280 270", c: O, w: 11 },
};
const vessel = (p: Part, on: boolean): El => path(`v_${p}`, VESSEL[p].d, { stroke: VESSEL[p].c, strokeWidth: VESSEL[p].w, opacity: on ? 1 : 0.28 });

// valve = two small leaflets
const valve = (id: string, x: number, y: number, rot = 0): El =>
  path(id, `M ${x - 7} ${y} L ${x - 1} ${y + 6} M ${x + 7} ${y} L ${x + 1} ${y + 6}`, { stroke: "#f8fafc", strokeWidth: 2.4, ...(rot ? {} : {}) });

const heart = (lit: { right?: boolean; left?: boolean } = {}): El[] => [
  path("ra", close(RA), { color: "#bfdbfe", stroke: MYO, strokeWidth: 3, fillOpacity: lit.right ? 1 : 0.7 }),
  path("la", close(LA), { color: "#fecaca", stroke: MYO, strokeWidth: 3, fillOpacity: lit.left ? 1 : 0.7 }),
  path("rv", close(RV), { color: "#bfdbfe", stroke: MYO, strokeWidth: 3.5, fillOpacity: lit.right ? 1 : 0.7 }),
  // the left ventricle has the thickest muscular wall
  path("lv", close(LV), { color: "#fecaca", stroke: MYO, strokeWidth: 7, fillOpacity: lit.left ? 1 : 0.7 }),
  path("septum", "M 179 170 C 182 200 186 232 196 254", { stroke: MYO, strokeWidth: 6 }),
  valve("vt", 128, 164), valve("vm", 214, 154), valve("vp", 166, 166), valve("va", 210, 160),
];
const lungs = (on: boolean): El[] => [
  path("lung_r", close([[30, 40], [64, 26], [86, 48], [84, 92], [58, 108], [28, 94]]), { color: "#fce7f3", stroke: "#be185d", strokeWidth: 2, opacity: on ? 1 : 0.6 }),
  path("lung_l", close([[312, 34], [350, 22], [378, 44], [376, 88], [346, 104], [314, 88]]), { color: "#fce7f3", stroke: "#be185d", strokeWidth: 2, opacity: on ? 1 : 0.6 }),
];
const body = (on: boolean): El[] => [
  rect("body", 74, 262, 240, 30, "#fef3c7", { stroke: "#b45309", strokeWidth: 2, rx: 10, opacity: on ? 1 : 0.6 }),
  text("t_body", 194, 282, "Body tissues (capillaries)", "רקמות הגוף — נימים", { weight: 700, fontSize: 14, textColor: "#92400e", opacity: on ? 1 : 0.6 }),
];
const flow = (id: string, x1: number, y1: number, x2: number, y2: number): El => arrow(id, x1, y1, x2, y2, FLOW, 2.6);

const base = (on: Partial<Record<Part, boolean>>, o: { lungs?: boolean; body?: boolean; right?: boolean; left?: boolean } = {}): El[] => [
  ...lungs(!!o.lungs), ...body(!!o.body),
  ...(["pv", "pa", "ao", "svc", "ivc"] as Part[]).map((p) => vessel(p, !!on[p])),
  ...heart({ right: o.right, left: o.left }),
];

const h1: El[] = [
  ...base({ svc: true, ivc: true, pa: true, pv: true, ao: true }, { lungs: true, body: true, right: true, left: true }),
  label("l_ra", 8, 190, "Right atrium", "עלייה ימנית", [112, 140], { anchor: "start", fontSize: 15 }),
  label("l_rv", 8, 236, "Right ventricle", "חדר ימני", [126, 210], { anchor: "start", fontSize: 15 }),
  label("l_la", 300, 132, "Left atrium", "עלייה שמאלית", [234, 128], { anchor: "start", fontSize: 15 }),
  label("l_lv", 300, 222, "Left ventricle", "חדר שמאלי", [244, 214], { anchor: "start", fontSize: 15 }),
  label("l_sep", 300, 176, "Septum", "מחיצה", [184, 200], { anchor: "start", fontSize: 15 }),
];
const h2: El[] = [
  ...base({ svc: true, ivc: true, pa: true }, { lungs: true, right: true }),
  flow("f_svc", 117, 40, 118, 100), flow("f_ivc", 92, 230, 98, 172),
  flow("f_tri", 130, 150, 132, 186), flow("f_pa", 168, 190, 172, 112),
  flow("f_pal", 150, 80, 92, 72), flow("f_par", 214, 66, 290, 56),
  label("l_vc", 128, 16, "Venae cavae: from the body", "ורידים נבובים — מהגוף", [117, 44], { anchor: "start", fontSize: 15, shortHe: "ורידים נבובים", short: "Venae cavae" }),
  label("l_pa", 300, 130, "Pulmonary arteries", "עורקי הריאה", [244, 58], { anchor: "start", fontSize: 15 }),
  label("t_gas", 300, 176, "Lungs: CO₂ out, O₂ in", "בריאות: CO₂ יוצא, O₂ נכנס", [340, 80], { anchor: "start", fontSize: 14, shortHe: "חילוף גזים", short: "Gas exchange" }),
];
const h3: El[] = [
  ...base({ pv: true }, { lungs: true, left: true }),
  flow("f_pv1", 90, 94, 176, 114), flow("f_pv2", 300, 90, 246, 116),
  flow("f_mit", 214, 140, 218, 186),
  label("l_pv", 300, 140, "Pulmonary veins", "ורידי הריאה", [270, 104], { anchor: "start", fontSize: 15 }),
  label("l_mit", 300, 214, "Mitral valve", "מסתם דו-צניפי", [214, 158], { anchor: "start", fontSize: 15 }),
];
const h4: El[] = [
  ...base({ ao: true, ivc: true, svc: true }, { body: true, left: true }),
  flow("f_lv", 222, 232, 212, 176), flow("f_ao", 212, 140, 222, 86),
  flow("f_desc", 290, 120, 290, 236), flow("f_ret", 96, 250, 98, 190),
  label("l_ao", 300, 150, "Aorta", "אבי העורקים", [290, 140], { anchor: "start", fontSize: 15 }),
  label("l_lvw", 300, 214, "Thick wall", "דופן עבה", [252, 210], { anchor: "start", fontSize: 15 }),
  label("l_cap", 8, 252, "Back to the heart", "חזרה ללב", [94, 232], { anchor: "start", fontSize: 15 }),
];

export const heartScene: ProcessScene = {
  slug: "cardiovascular-animation-1780821487918",
  source: "Campbell 12e ch. 42; Berne & Levy 8e ch. 16",
  legend: [
    { color: D, he: "דם דל חמצן", en: "Deoxygenated blood", swatch: "line" },
    { color: O, he: "דם מחומצן", en: "Oxygenated blood", swatch: "line" },
    { color: FLOW, he: "כיוון הזרימה", en: "Direction of flow", swatch: "arrow" },
    { color: MYO, he: "שריר הלב", en: "Heart muscle (myocardium)", swatch: "ring" },
    { color: "#94a3b8", he: "מבט קדמי: צד ימין של הגוף משמאל", en: "Front view: body's right on the left", swatch: "dot" },
  ],
  steps: [
    {
      titleHe: "מבנה הלב: 4 חללים ומסתמים", titleEn: "The Heart: Four Chambers and Valves",
      descHe: "ללב היונקים ארבעה חללים: שתי עליות (מקבלות דם) ושני חדרים (שואבים דם החוצה), ומחיצה מפרידה בין הצד הימני (דם דל-חמצן) לשמאלי (דם מחומצן). מסתמים מונעים זרימה לאחור: מסתם תלת-צניפי ודו-צניפי (מיטרלי) בין העליות לחדרים, ומסתמי הריאה ואבי העורקים ביציאה מהחדרים. בתרשים — מבט קדמי, ולכן הצד הימני של הלב מופיע משמאל.",
      descEn: "The mammalian heart has four chambers: two atria (receive blood) and two ventricles (pump it out), with a septum separating the right side (deoxygenated blood) from the left (oxygenated). Valves prevent backflow: the tricuspid and mitral (bicuspid) valves between atria and ventricles, and the pulmonary and aortic valves at the ventricle outlets. The diagram is a front view, so the heart's right side appears on the left.",
      elements: h1,
    },
    {
      titleHe: "מחזור הדם הריאתי", titleEn: "The Pulmonary Circuit",
      descHe: "דם דל-חמצן מהגוף מגיע בוורידים הנבובים העליון והתחתון לעלייה הימנית, עובר דרך המסתם התלת-צניפי לחדר הימני, ונשאב דרך מסתם הריאה לגזע הריאתי ולעורקי הריאה. בנימי הריאה הוא מוסר CO₂ וקולט O₂. עורקי הריאה הם העורקים היחידים אצל המבוגר שנושאים דם דל-חמצן.",
      descEn: "Deoxygenated blood from the body enters the right atrium through the superior and inferior venae cavae, passes the tricuspid valve into the right ventricle, and is pumped through the pulmonary valve into the pulmonary trunk and arteries. In the lung capillaries it releases CO₂ and picks up O₂. The pulmonary arteries are the only adult arteries that carry deoxygenated blood.",
      elements: h2,
    },
    {
      titleHe: "הדם המחומצן חוזר ללב", titleEn: "Oxygenated Blood Returns to the Heart",
      descHe: "הדם המחומצן חוזר משתי הריאות בוורידי הריאה אל העלייה השמאלית, ועובר דרך המסתם הדו-צניפי (המיטרלי) לחדר השמאלי. ורידי הריאה הם הוורידים היחידים שנושאים דם מחומצן.",
      descEn: "Oxygenated blood returns from both lungs through the pulmonary veins to the left atrium, and passes the mitral (bicuspid) valve into the left ventricle. The pulmonary veins are the only veins that carry oxygenated blood.",
      elements: h3,
    },
    {
      titleHe: "מחזור הדם הגדול (הסיסטמי)", titleEn: "The Systemic Circuit",
      descHe: "החדר השמאלי — בעל הדופן השרירית העבה ביותר, כי הוא דוחף דם לכל הגוף — שואב את הדם דרך מסתם אבי העורקים אל אבי העורקים, דרך הקשת ומשם לכל הגוף. בנימים O₂ וחומרי מזון עוברים לרקמות ו-CO₂ נקלט. הדם דל-החמצן חוזר בוורידים הנבובים לעלייה הימנית, והמחזור נסגר.",
      descEn: "The left ventricle — with the thickest muscular wall, because it drives blood around the whole body — pumps blood through the aortic valve into the aorta, round the arch and on to the whole body. In the capillaries O₂ and nutrients pass to the tissues and CO₂ is taken up. Deoxygenated blood returns through the venae cavae to the right atrium, closing the loop.",
      elements: h4,
    },
  ],
};
