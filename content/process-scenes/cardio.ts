import { C, arrow, ellipse, label, line, path, rect, smooth, text, type El, type ProcessScene, type Pt } from "./kit";

// Anterior view: the patient's right side is on the viewer's LEFT.
const O = C.oxy, D = C.deoxy;
const blob = (id: string, pts: Pt[], color: string, o: Partial<El> = {}) => path(id, smooth(pts, true), { color, stroke: "#7f1d1d", strokeWidth: 2, ...o });
const chambers = (o: { ra?: string; rv?: string; la?: string; lv?: string } = {}): El[] => [
  blob("ra", [[100, 140], [106, 110], [140, 104], [170, 118], [172, 160], [140, 172], [108, 166]], o.ra ?? "#dbeafe"),
  blob("rv", [[112, 190], [140, 176], [194, 178], [198, 226], [170, 256], [140, 244]], o.rv ?? "#dbeafe"),
  blob("la", [[226, 118], [250, 100], [292, 104], [302, 132], [282, 156], [236, 156]], o.la ?? "#fee2e2"),
  blob("lv", [[206, 180], [240, 166], [290, 170], [300, 208], [270, 262], [226, 268], [206, 240]], o.lv ?? "#fee2e2"),
  line("sept", 202, 170, 202, 262, "#7f1d1d", 3),
  // valves: tricuspid (RA→RV), mitral (LA→LV), pulmonary, aortic
  path("v_tri", "M 128 172 L 140 182 L 152 172", { stroke: "#f8fafc", strokeWidth: 3 }),
  path("v_mit", "M 250 158 L 262 168 L 274 158", { stroke: "#f8fafc", strokeWidth: 3 }),
];
const vessels = (hl: "none" | "pulm" | "ret" | "sys"): El[] => {
  const w = (on: boolean) => (on ? 9 : 7);
  const op = (on: boolean) => (hl === "none" || on ? 1 : 0.35);
  const P = hl === "pulm", R = hl === "ret", S = hl === "sys";
  return [
    path("svc", "M 122 30 L 124 108", { stroke: D, strokeWidth: w(P || S), opacity: op(P || S) }),
    path("ivc", "M 116 292 C 112 250 110 200 112 168", { stroke: D, strokeWidth: w(P || S), opacity: op(P || S) }),
    path("pt", "M 176 180 C 176 140 184 110 196 90 C 170 70 120 64 92 64", { stroke: D, strokeWidth: w(P), opacity: op(P) }),
    path("pt2", "M 196 90 C 230 74 280 66 308 64", { stroke: D, strokeWidth: w(P), opacity: op(P) }),
    path("pv", "M 318 84 C 312 100 304 110 298 118", { stroke: O, strokeWidth: w(R), opacity: op(R) }),
    path("pv2", "M 96 86 C 150 96 200 100 230 112", { stroke: O, strokeWidth: w(R) - 2, opacity: op(R), dash: "7 4" }),
    path("ao", "M 236 172 C 230 120 236 60 280 44 C 330 30 368 60 370 110 L 372 262", { stroke: O, strokeWidth: w(S), opacity: op(S) }),
  ];
};
const organs = (): El[] => [
  ellipse("lungL", 62, 64, 44, 30, "#fce7f3", { stroke: "#db2777", strokeWidth: 2 }),
  ellipse("lungR", 340, 70, 40, 28, "#fce7f3", { stroke: "#db2777", strokeWidth: 2 }),
  rect("body", 150, 272, 250, 26, "#fef3c7", { rx: 8, stroke: "#b45309", strokeWidth: 2 }),
  text("body_t", 280, 291, "Body tissues", "רקמות הגוף", { weight: 700, textColor: "#92400e", halo: false }),
];

const h1: El[] = [
  ...organs(), ...vessels("none"), ...chambers(),
  label("l_ra", 8, 196, "Right atrium", "עלייה ימנית", [120, 140], { anchor: "start", shortHe: "ע. ימנית", short: "RA" }),
  label("l_rv", 8, 240, "Right ventricle", "חדר ימני", [150, 220], { anchor: "start", shortHe: "ח. ימני", short: "RV" }),
  label("l_la", 250, 190, "Left atrium", "עלייה שמאלית", [270, 128], { anchor: "start", shortHe: "ע. שמאלית", short: "LA" }),
  label("l_lv", 300, 240, "Left ventricle", "חדר שמאלי", [262, 220], { anchor: "start", shortHe: "ח. שמאלי", short: "LV" }),
];
const flow = (id: string, x1: number, y1: number, x2: number, y2: number, color: string) => arrow(id, x1, y1, x2, y2, color, 2.8);
const h2: El[] = [
  ...organs(), ...vessels("pulm"), ...chambers({ ra: "#93c5fd", rv: "#93c5fd" }),
  flow("f1", 138, 124, 146, 196, "#1e3a8a"), flow("f2", 170, 214, 184, 164, "#1e3a8a"),
  flow("f3", 150, 72, 110, 66, "#1e3a8a"), flow("f4", 250, 72, 290, 66, "#1e3a8a"),
  label("l_vc", 10, 110, "Venae cavae", "ורידים נבובים", [123, 60], { anchor: "start" }),
  label("l_pa", 200, 30, "Pulmonary arteries", "עורקי הריאה", [240, 74], { anchor: "start" }),
  label("l_lung", 8, 20, "Lungs: CO₂ out, O₂ in", "ריאות — חילוף גזים", [62, 44], { anchor: "start", shortHe: "ריאות", short: "Lungs" }),
];
const h3: El[] = [
  ...organs(), ...vessels("ret"), ...chambers({ la: "#fca5a5", lv: "#fca5a5" }),
  flow("f5", 322, 90, 306, 112, "#7f1d1d"), flow("f6", 262, 134, 262, 196, "#7f1d1d"),
  label("l_pv", 250, 250, "Pulmonary veins", "ורידי הריאה", [316, 92], { anchor: "start" }),
  label("l_mit", 8, 240, "Mitral (bicuspid) valve", "מסתם דו-צניפי", [262, 164], { anchor: "start", shortHe: "מסתם דו-צניפי", short: "Mitral" }),
  text("l_ox", 60, 120, "oxygenated", "דם מחומצן", { textColor: O, weight: 700 }),
];
const h4: El[] = [
  ...organs(), ...vessels("sys"), ...chambers({ lv: "#fca5a5", ra: "#93c5fd" }),
  flow("f7", 244, 204, 238, 130, "#7f1d1d"), flow("f8", 371, 180, 372, 250, "#7f1d1d"),
  flow("f9", 114, 262, 112, 200, "#1e3a8a"),
  label("l_ao", 250, 20, "Aorta", "אבי העורקים", [290, 40], { anchor: "start" }),
  label("l_cap", 8, 268, "Capillaries: O₂ to tissues", "נימים — O₂ לרקמות", [160, 284], { anchor: "start", shortHe: "נימים", short: "Capillaries" }),
  label("l_ret", 8, 186, "Back to right atrium", "חזרה לעלייה הימנית", [114, 226], { anchor: "start", shortHe: "חזרה ללב", short: "Return" }),
];

export const cardio: ProcessScene = {
  slug: "cardiovascular-animation-1780821487918",
  legend: [
    { color: D, he: "דם דל חמצן", en: "Deoxygenated blood", swatch: "line" },
    { color: O, he: "דם מחומצן", en: "Oxygenated blood", swatch: "line" },
    { color: "#7f1d1d", he: "כיוון הזרימה", en: "Direction of flow", swatch: "arrow" },
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
      descHe: "דם דל-חמצן מהגוף מגיע בוורידים הנבובים לעלייה הימנית, עובר דרך המסתם התלת-צניפי לחדר הימני, ונשאב דרך מסתם הריאה לעורקי הריאה. בנימי הריאה הוא מוסר CO₂ וקולט O₂. עורקי הריאה הם העורקים היחידים אצל המבוגר שנושאים דם דל-חמצן.",
      descEn: "Deoxygenated blood from the body enters the right atrium through the venae cavae, passes the tricuspid valve into the right ventricle, and is pumped through the pulmonary valve into the pulmonary arteries. In the lung capillaries it releases CO₂ and picks up O₂. The pulmonary arteries are the only adult arteries that carry deoxygenated blood.",
      elements: h2,
    },
    {
      titleHe: "הדם המחומצן חוזר ללב", titleEn: "Oxygenated Blood Returns to the Heart",
      descHe: "הדם המחומצן חוזר מהריאות בוורידי הריאה אל העלייה השמאלית, ועובר דרך המסתם הדו-צניפי (המיטרלי) לחדר השמאלי. ורידי הריאה הם הוורידים היחידים שנושאים דם מחומצן.",
      descEn: "Oxygenated blood returns from the lungs through the pulmonary veins to the left atrium, and passes the mitral (bicuspid) valve into the left ventricle. The pulmonary veins are the only veins that carry oxygenated blood.",
      elements: h3,
    },
    {
      titleHe: "מחזור הדם הגדול (הסיסטמי)", titleEn: "The Systemic Circuit",
      descHe: "החדר השמאלי — בעל הדופן השרירית העבה ביותר — שואב את הדם דרך מסתם אבי העורקים אל אבי העורקים ומשם לכל הגוף. בנימים O₂ וחומרי מזון עוברים לרקמות ו-CO₂ נקלט. הדם דל-החמצן חוזר בוורידים הנבובים לעלייה הימנית, והמחזור נסגר.",
      descEn: "The left ventricle — with the thickest muscular wall — pumps blood through the aortic valve into the aorta and on to the whole body. In the capillaries O₂ and nutrients pass to the tissues and CO₂ is taken up. Deoxygenated blood returns through the venae cavae to the right atrium, closing the loop.",
      elements: h4,
    },
  ],
};
