import { C, arrow, bilayer, circle, ellipse, label, line, path, rect, smooth, text, type El, type ProcessScene, type Pt } from "./kit";

/* ══ PHOTOSYNTHESIS (Berg 10e ch. 19–20; Campbell 12e ch. 10) ══════
   Step 1: the chloroplast. Steps 2–4: a zoom on one thylakoid membrane — stroma above, lumen below — with the
   complexes in the order electrons pass them. Step 5: the Calvin cycle in the stroma. One idea per step. */

const MEM = 150;
const E = "#0f766e", HP = "#dc2626", LIGHT = "#facc15", ATPC = "#b45309", G = "#15803d";
const X = { psii: 66, pq: 116, b6f: 166, pc: 214, psi: 262, fd: 306, atp: 360 };
type St = 1 | 2 | 3 | 4 | 5;

// chloroplast overview
const chloroplast = (op: number): El[] => [
  ellipse("cp_o", 200, 150, 176, 112, "#dcfce7", { stroke: G, strokeWidth: 3, opacity: op }),
  ellipse("cp_i", 200, 150, 166, 102, "#f0fdf4", { stroke: "#4ade80", strokeWidth: 1.6, opacity: op }),
  ...[[110, 120], [196, 102], [284, 128], [150, 196], [252, 196]].flatMap(([x, y], g) =>
    [0, 1, 2, 3].map((k) => ellipse(`gr${g}_${k}`, x, y + k * 10, 30, 5.5, "#86efac", { stroke: G, strokeWidth: 1.4, opacity: op }))),
  ...[[140, 128, 166, 108], [226, 112, 254, 132], [180, 204, 222, 204]].map(([x1, y1, x2, y2], i) => line(`lam${i}`, x1, y1, x2, y2, G, 2, { opacity: op })),
];
// thylakoid membrane zoom
const membrane = (op: number): El[] => [
  rect("stroma_bg", 0, 0, 400, MEM - 14, "#f0fdf4", { opacity: op }),
  rect("lumen_bg", 0, MEM + 14, 400, 300 - MEM - 14, "#fef2f2", { opacity: op }),
  ...bilayer("thy", 0, 400, MEM, { th: 26, head: G, tail: "#bbf7d0" }).map((e) => ({ ...e, opacity: op })),
  text("t_str", 8, 24, "Stroma", "סטרומה", { anchor: "start", weight: 700, textColor: G, opacity: op }),
  text("t_lum", 8, 290, "Thylakoid lumen", "חלל התילקואיד", { anchor: "start", weight: 700, textColor: HP, opacity: op }),
];
const cplx = (id: string, x: number, w: number, h: number, fill: string, stroke: string, t: string, op: number): El[] => [
  rect(id, x - w / 2, MEM - h / 2, w, h, fill, { stroke, strokeWidth: 2, rx: 10, opacity: op }),
  text(`${id}_t`, x, MEM + 5, t, t, { ltr: true, weight: 700, fontSize: 13, opacity: op, halo: false }),
];
const complexes = (op: number): El[] => [
  ...cplx("psii", X.psii, 46, 54, "#bbf7d0", G, "PSII", op),
  circle("pq", X.pq, MEM, 9, "#fde68a", { stroke: ATPC, strokeWidth: 1.6, opacity: op }),
  ...cplx("b6f", X.b6f, 40, 50, "#fef3c7", ATPC, "b₆f", op),
  circle("pc", X.pc, MEM + 34, 9, "#bfdbfe", { stroke: "#1d4ed8", strokeWidth: 1.6, opacity: op }),
  ...cplx("psi", X.psi, 46, 54, "#bbf7d0", G, "PSI", op),
  circle("fd", X.fd, MEM - 34, 9, "#fecaca", { stroke: HP, strokeWidth: 1.6, opacity: op }),
  // ATP synthase: Fo in the membrane, F1 head in the stroma
  rect("fo", X.atp - 12, MEM - 14, 24, 28, "#fed7aa", { stroke: ATPC, strokeWidth: 1.8, rx: 5, opacity: op }),
  line("stalk", X.atp, MEM - 14, X.atp, MEM - 34, ATPC, 4, { opacity: op }),
  circle("f1", X.atp, MEM - 50, 17, "#fed7aa", { stroke: ATPC, strokeWidth: 2, opacity: op }),
];
const photon = (id: string, x: number, op: number): El[] => [
  path(id, `M ${x - 16} 34 l 6 10 l -6 6 l 8 10 l -6 6 l 12 ${MEM - 104}`, { stroke: LIGHT, strokeWidth: 3, arrow: true, opacity: op }),
];
const hs = (id: string, pts: Pt[], op: number): El[] => pts.map(([x, y], i) => text(`${id}${i}`, x, y, "H⁺", "H⁺", { ltr: true, weight: 700, fontSize: 13, textColor: HP, opacity: op }));
const flow = (id: string, pts: Pt[], op: number, color = E): El => path(id, smooth(pts), { stroke: color, strokeWidth: 2.6, arrow: true, dash: "6 4", opacity: op });

function scene(step: St): El[] {
  const on = (...s: St[]) => (s.includes(step) ? 1 : 0);
  const zoom = step >= 2 && step <= 4 ? 1 : 0;
  return [
    ...chloroplast(on(1)),
    ...membrane(zoom), ...complexes(zoom),
    // step 1 labels
    label("l_thy", 14, 24, "Thylakoids (grana): light reactions", "תילקואידים (גרנה): תגובות האור", [110, 126], { anchor: "start", shortHe: "תילקואידים", short: "Thylakoids", opacity: on(1) }),
    label("l_str", 210, 288, "Stroma: Calvin cycle", "סטרומה: מעגל קלווין", [320, 168], { anchor: "start", opacity: on(1) }),

    // step 2: light on PSII splits water; electrons to PQ and b6f
    ...photon("ph1", X.psii, on(2, 3)),
    text("h2o", X.psii, 216, "2 H₂O → O₂ + 4 H⁺", "2 H₂O → O₂ + 4 H⁺", { ltr: true, weight: 700, fontSize: 13, textColor: "#0369a1", opacity: on(2) }),
    arrow("h2o_ar", X.psii, 200, X.psii, MEM + 30, "#0369a1", 2, { opacity: on(2) }),
    flow("e1", [[X.psii + 20, MEM + 8], [X.pq, MEM + 4], [X.b6f - 18, MEM]], on(2, 3)),
    label("l_psii", 120, 40, "Light excites PSII; water is split", "האור מעורר את PSII; מים מתפרקים", [X.psii, MEM - 28], { anchor: "start", shortHe: "PSII מפרק מים", short: "PSII splits water", opacity: on(2) }),

    // step 3: b6f pumps H+ into the lumen; PC to PSI, second photon, Fd → NADPH
    ...photon("ph2", X.psi, on(3)),
    arrow("pump", X.b6f, MEM - 40, X.b6f, MEM + 46, HP, 2.6, { opacity: on(3) }),
    flow("e2", [[X.b6f + 16, MEM + 22], [X.pc, MEM + 34], [X.psi - 20, MEM + 20]], on(3)),
    flow("e3", [[X.psi + 14, MEM - 26], [X.fd, MEM - 34]], on(3)),
    text("nadph", X.fd + 10, MEM - 64, "NADP⁺ → NADPH", "NADP⁺ → NADPH", { ltr: true, weight: 700, fontSize: 13, textColor: E, opacity: on(3) }),
    ...hs("hl", [[110, 214], [150, 236], [190, 214], [230, 240], [270, 216], [312, 236]], on(3, 4)),
    label("l_b6f", 226, 286, "b₆f pumps H⁺ into the lumen", "b₆f שואב H⁺ לחלל", [X.b6f, MEM + 40], { anchor: "start", shortHe: "שאיבת H⁺", short: "H⁺ pumped", opacity: on(3) }),

    // step 4: H+ flows back through ATP synthase
    arrow("hback", X.atp + 26, MEM + 46, X.atp + 26, MEM - 40, HP, 3, { opacity: on(4) }),
    text("atp", 240, MEM - 76, "ADP + Pᵢ → ATP", "ADP + Pᵢ → ATP", { ltr: true, weight: 700, fontSize: 13, textColor: ATPC, opacity: on(4) }),
    label("l_atp", 140, 28, "H⁺ flow back drives ATP synthase", "H⁺ חוזר ומניע את ATP סינתאז", [X.atp - 14, MEM - 50], { anchor: "start", shortHe: "ATP סינתאז", short: "ATP synthase", opacity: on(4) }),

    // step 5: Calvin cycle
    ...[["rubp", 200, 58, "RuBP (5C)", "RuBP (5C)"], ["pga", 322, 196, "3-PGA", "3-PGA"], ["g3p", 78, 196, "G3P", "G3P"]].flatMap(([id, x, y, en, he]) => [
      rect(`${id}_bg`, Number(x) - 44, Number(y) - 14, 88, 28, "#ffffff", { stroke: G, strokeWidth: 2, rx: 14, opacity: on(5) }),
      text(`${id}_t`, Number(x), Number(y) + 6, String(en), String(he), { ltr: true, weight: 700, fontSize: 14, textColor: G, opacity: on(5) }),
    ]),
    path("c1", smooth([[246, 66], [300, 104], [322, 178]]), { stroke: G, strokeWidth: 3, arrow: true, opacity: on(5) }),
    path("c2", smooth([[276, 206], [200, 222], [124, 206]]), { stroke: G, strokeWidth: 3, arrow: true, opacity: on(5) }),
    path("c3", smooth([[78, 178], [100, 104], [154, 66]]), { stroke: G, strokeWidth: 3, arrow: true, opacity: on(5) }),
    text("k1", 300, 132, "1. fixation (rubisco) + CO₂", "1. קיבוע (רוביסקו) + CO₂", { anchor: "start", fontSize: 13, weight: 700, textColor: "#0369a1", opacity: on(5), short: "1. + CO₂", shortHe: "1. + CO₂" }),
    text("k2", 200, 246, "2. reduction: ATP, NADPH", "2. חיזור: ATP, NADPH", { fontSize: 13, weight: 700, textColor: ATPC, opacity: on(5) }),
    text("k3", 100, 132, "3. regeneration", "3. חידוש RuBP", { anchor: "end", fontSize: 13, weight: 700, textColor: G, opacity: on(5) }),
    arrow("sug", 70, 214, 48, 262, ATPC, 2.4, { opacity: on(5) }),
    text("sug_t", 54, 284, "→ sugars", "← סוכרים", { fontSize: 13, weight: 700, textColor: ATPC, opacity: on(5) }),
  ];
}

export const photoScene: ProcessScene = {
  slug: "photosynthesis",
  meta: {
    topic: "biochemistry",
    nameHe: "פוטוסינתזה: תגובות האור ומחזור קלווין", nameEn: "Photosynthesis: Light Reactions and the Calvin Cycle",
    descHe: "מבנה הכלורופלסט, העברת אלקטרונים מ-PSII ל-PSI, ייצור ATP בכימיאוסמוזה, וקיבוע CO₂ במחזור קלווין",
    descEn: "Chloroplast structure, electron flow from PSII to PSI, ATP by chemiosmosis, and CO₂ fixation in the Calvin cycle",
    source: "Berg 10e ch. 19–20; Campbell 12e ch. 10",
  },
  legend: [
    { color: G, he: "ממברנת התילקואיד / מחזור קלווין", en: "Thylakoid membrane / Calvin cycle", swatch: "line" },
    { color: E, he: "מסלול האלקטרונים", en: "Electron path", swatch: "dash" },
    { color: HP, he: "H⁺", en: "H⁺", swatch: "dot" },
    { color: ATPC, he: "ATP / ATP סינתאז", en: "ATP / ATP synthase", swatch: "ring" },
    { color: LIGHT, he: "אור", en: "Light", swatch: "line" },
  ],
  steps: [
    {
      titleHe: "הכלורופלסט", titleEn: "The Chloroplast",
      descHe: "לכלורופלסט שתי ממברנות חיצוניות, ובתוכו מערכת שלישית של ממברנות — התילקואידים, שנערמים לגרנה. תגובות האור מתרחשות בממברנות התילקואידים, ומעגל קלווין — בסטרומה, הנוזל שמסביבן.",
      descEn: "The chloroplast has two outer membranes and, inside, a third membrane system — the thylakoids, stacked into grana. The light reactions happen in the thylakoid membranes, and the Calvin cycle in the stroma, the fluid around them.",
      elements: scene(1),
    },
    {
      titleHe: "PSII: אור מפרק מים", titleEn: "PSII: Light Splits Water",
      descHe: "פוטון שנקלט ב-PSII מעורר אלקטרון בכלורופיל של מרכז התגובה. האלקטרון עובר לפלסטוקינון (PQ) ומשם לקומפלקס ציטוכרום b₆f. את האלקטרון החסר PSII משלים מפירוק מים בצד החלל: ‎2 H₂O → O₂ + 4 H⁺ — מקור החמצן באטמוספרה.",
      descEn: "A photon absorbed by PSII excites an electron in the reaction-centre chlorophyll. The electron passes to plastoquinone (PQ) and on to the cytochrome b₆f complex. PSII replaces the lost electron by splitting water on the lumen side: 2 H₂O → O₂ + 4 H⁺ — the source of atmospheric oxygen.",
      elements: scene(2),
    },
    {
      titleHe: "b₆f ו-PSI: מפל H⁺ ו-NADPH", titleEn: "b₆f and PSI: an H⁺ Gradient and NADPH",
      descHe: "ציטוכרום b₆f מעביר את האלקטרונים לפלסטוציאנין (PC) ובדרך שואב H⁺ אל חלל התילקואיד. פוטון שני מעורר את האלקטרון ב-PSI, והוא עובר לפרדוקסין (Fd) ומשם לחיזור NADP⁺ ל-NADPH בסטרומה. בחלל מצטברים H⁺ — מפל פרוטונים.",
      descEn: "Cytochrome b₆f passes the electrons to plastocyanin (PC) and pumps H⁺ into the thylakoid lumen on the way. A second photon excites the electron at PSI, and it goes to ferredoxin (Fd) and on to reduce NADP⁺ to NADPH in the stroma. H⁺ builds up in the lumen — a proton gradient.",
      elements: scene(3),
    },
    {
      titleHe: "ATP סינתאז: כימיאוסמוזה", titleEn: "ATP Synthase: Chemiosmosis",
      descHe: "ה-H⁺ זורמים חזרה מהחלל לסטרומה דרך ATP סינתאז, והזרימה מסובבת את האנזים ומייצרת ATP מ-ADP ו-Pᵢ. זה אותו עיקרון כמו במיטוכונדריה — אבל כאן הפרוטונים נשאבים לתוך התילקואיד, וה-ATP נוצר בסטרומה.",
      descEn: "The H⁺ flow back from the lumen to the stroma through ATP synthase, and the flow turns the enzyme and makes ATP from ADP and Pᵢ. It is the same principle as in mitochondria — but here the protons are pumped into the thylakoid, and ATP is made in the stroma.",
      elements: scene(4),
    },
    {
      titleHe: "מעגל קלווין", titleEn: "The Calvin Cycle",
      descHe: "בסטרומה, רוביסקו מקבע CO₂ ל-RuBP (5 פחמנים), ונוצרות שתי מולקולות 3-PGA. ה-ATP וה-NADPH מתגובות האור מחזרים אותן ל-G3P. רוב ה-G3P משמש לחידוש RuBP, ולכל 3 CO₂ יוצא G3P אחד לבניית סוכרים — במחיר של 9 ATP ו-6 NADPH.",
      descEn: "In the stroma, rubisco fixes CO₂ onto RuBP (5 carbons), giving two 3-PGA. ATP and NADPH from the light reactions reduce them to G3P. Most G3P regenerates RuBP, and for every 3 CO₂ one G3P leaves to make sugars — at a cost of 9 ATP and 6 NADPH.",
      elements: scene(5),
    },
  ],
};
