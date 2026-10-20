import { C, arrow, bilayer, circle, label, line, path, rect, smooth, text, type El, type ProcessScene, type Pt } from "./kit";

/* ══ GLYCOLYSIS in the cytosol (Campbell 12e ch. 9; Lehninger 8e ch. 14) ═══════════════════
   One scene, drawn as carbon skeletons so the student sees where every phosphate sits.
   The six carbons keep their ids from start to end: the 6-ring rearranges into the 5-ring
   (step 2), then aldolase splits it — C1–C3 go up (DHAP), C4–C6 go down (G3P) — and from
   step 5 both 3-carbon chains go through the payoff together, so "×2" is visible.
   Atom identity is kept honest:
   - phosphates hang on a bridging O (C–O–P); a kinase takes only the P, so the bridging O
     stays: in 1,3-BPG it becomes the carboxylate O, in PEP the ketone O of pyruvate;
   - the ring O (O5) leaves with C5 as an OH at the split; DHAP's C=O and G3P's C=O are other
     oxygens, so they fade in/out rather than travel; TPI moves the carbonyl, not the
     phosphate, so the top chain is the mirror image of the bottom one;
   - incoming phosphates fly in from the enzyme, outgoing ones fly to the ADP → ATP badge.
   H atoms and OH groups are left out (schematic). Design review by Codex (2026-10-20). */

const PH = "#f97316", HIGH = "#b91c1c", CARB = "#334155", OXY = "#dc2626", BOND = "#475569";
type St = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

// chain geometry (steps 4–10): top chain = C1–C3, bottom chain = C4–C6
const T = 128, B = 222, XL = 175, XM = 215, XR = 255;
const UP = 30, BR = 20, OUT = 40; // carbonyl O offset, bridging O, phosphate
const ENZ_AT: Pt = [62, 175], OUT_TO: Pt = [90, 240];

type Atom =
  | "C1" | "C2" | "C3" | "C4" | "C5" | "C6"
  | "Or" | "tOk" | "tO1" | "bO1"            // ring O5, DHAP keto O, G3P aldehyde O (top / bottom)
  | "o1" | "o6" | "o2b" | "o5b" | "o3a" | "o4a" // bridging O of each phosphate
  | "P1" | "P6" | "tPa" | "bPa";             // phosphates (main top / main bottom / acyl top / acyl bottom)

const pos = (s: St): Record<Atom, Pt> => {
  const ring = s <= 3, hex = s === 1;
  const C: Record<"C1" | "C2" | "C3" | "C4" | "C5" | "C6", Pt> = hex
    ? { C5: [200, 132], C1: [175.8, 174], C2: [200, 188], C3: [224.2, 174], C4: [224.2, 146], C6: [222, 106] }
    : ring
      ? { C2: [175.3, 152], C3: [184.7, 181], C4: [215.3, 181], C5: [224.7, 152], C1: [148, 136], C6: [252, 136] }
      : { C1: [XL, T], C2: [XM, T], C3: [XR, T], C4: [XL, B], C5: [XM, B], C6: [XR, B] };
  return {
    ...C,
    Or: hex ? [175.8, 146] : ring ? [200, 134] : [XM, B],          // fades on C5 at the split
    tOk: [XM, T - UP], tO1: [XR, T - UP], bO1: [XL, B - UP],
    o1: ring ? [132, 124] : [XL - BR, T],
    P1: s <= 2 ? ENZ_AT : s === 3 ? [114, 112] : s <= 7 ? [XL - OUT, T] : s <= 9 ? [XM, T + OUT] : OUT_TO,
    o6: hex ? [238, 94] : ring ? [268, 124] : [XR + BR, B],
    P6: hex ? [256, 82] : ring ? [286, 112] : s <= 7 ? [XR + OUT, B] : s <= 9 ? [XM, B + OUT] : OUT_TO,
    o2b: [XM, T + BR], o5b: [XM, B + BR],
    o3a: [XR + BR, T], o4a: [XL - BR, B],
    tPa: s <= 5 ? ENZ_AT : s === 6 ? [XR + OUT, T] : OUT_TO,
    bPa: s <= 5 ? ENZ_AT : s === 6 ? [XL - OUT, B] : OUT_TO,
  };
};

const between = (s: St, a: number, b: number) => s >= a && s <= b;
const PRESENT: Record<Atom, (s: St) => boolean> = {
  C1: () => true, C2: () => true, C3: () => true, C4: () => true, C5: () => true, C6: () => true,
  Or: (s) => s <= 3, tOk: (s) => s === 4, tO1: (s) => s >= 5, bO1: (s) => s >= 4,
  o1: (s) => between(s, 3, 7), P1: (s) => between(s, 3, 9), o2b: (s) => s >= 8,
  o6: (s) => s <= 7, P6: (s) => s <= 9, o5b: (s) => s >= 8,
  o3a: (s) => s >= 6, tPa: (s) => s === 6, o4a: (s) => s >= 6, bPa: (s) => s === 6,
};

/** bonds per step: [id, atom, atom, order] — order 0 = absent */
function bonds(s: St): [string, Atom, Atom, 0 | 1 | 2][] {
  const ring = s <= 3, hex = s === 1, chain = s >= 4;
  const on = (x: boolean): 0 | 1 => (x ? 1 : 0);
  return [
    ["b_o1", "Or", "C1", on(hex)],
    ["b_o2", "Or", "C2", on(ring && !hex)],
    ["b_o5", "Or", "C5", on(ring)],
    ["b_12", "C1", "C2", s === 9 ? 2 : 1],     // PEP (top): C=C between the old C1 and C2
    ["b_23", "C2", "C3", 1],
    ["b_34", "C3", "C4", on(ring)],            // broken by aldolase
    ["b_45", "C4", "C5", 1],
    ["b_56", "C5", "C6", s === 9 ? 2 : 1],     // PEP (bottom)
    ["b_tok", "C2", "tOk", s === 4 ? 2 : 0],
    ["b_to1", "C3", "tO1", s >= 5 ? 2 : 0],
    ["b_bo1", "C4", "bO1", chain ? 2 : 0],
    ["b_c1o", "C1", "o1", on(between(s, 3, 7))],
    ["b_o1p", "o1", "P1", on(between(s, 3, 7))],
    ["b_c6o", "C6", "o6", on(s <= 7)],
    ["b_o6p", "o6", "P6", on(s <= 7)],
    ["b_c2o", "C2", "o2b", s === 10 ? 2 : on(s >= 8)],
    ["b_o2p", "o2b", "P1", on(between(s, 8, 9))],
    ["b_c5o", "C5", "o5b", s === 10 ? 2 : on(s >= 8)],
    ["b_o5p", "o5b", "P6", on(between(s, 8, 9))],
    ["b_c3a", "C3", "o3a", on(s >= 6)],
    ["b_o3p", "o3a", "tPa", on(s === 6)],
    ["b_c4a", "C4", "o4a", on(s >= 6)],
    ["b_o4p", "o4a", "bPa", on(s === 6)],
  ];
}

const bondEls = (id: string, a: Pt, b: Pt, order: 0 | 1 | 2): El[] => {
  const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1;
  const o = order === 2 ? 2.8 : 0, nx = (-dy / len) * o, ny = (dx / len) * o;
  return [
    line(id, a[0] + nx, a[1] + ny, b[0] + nx, b[1] + ny, BOND, 3, { opacity: order ? 1 : 0 }),
    line(`${id}_2`, a[0] - nx, a[1] - ny, b[0] - nx, b[1] - ny, BOND, 3, { opacity: order === 2 ? 1 : 0 }),
  ];
};

const phos = (id: string, [x, y]: Pt, op: number, high = false): El[] => [
  circle(id, x, y, 10.5, PH, { stroke: high ? HIGH : "#ffffff", strokeWidth: high ? 3 : 1.5, opacity: op }),
  text(`${id}_t`, x, y + 6, "P", "P", { ltr: true, weight: 800, textColor: "#ffffff", halo: false, opacity: op }),
];

/** enzyme: a globular protein with an active-site notch facing the substrate (dir).
    Each enzyme is its own element, so one enzyme fades out and the next fades in. */
const ENZ_PTS: Pt[] = [[-28, 0], [-22, -18], [-4, -24], [16, -20], [27, -9], [17, 0], [27, 9], [16, 20], [-4, 24], [-22, 18]];
type Enz = { at: Pt; dir: 1 | -1; name: Pt; en: string; he: string };
const ENZ: Record<St, Enz> = {
  1: { at: [300, 140], dir: -1, name: [300, 186], en: "Hexokinase", he: "הקסוקינאז" },
  2: { at: ENZ_AT, dir: 1, name: [62, 139], en: "Isomerase", he: "איזומראז" },
  3: { at: ENZ_AT, dir: 1, name: [62, 139], en: "PFK-1", he: "PFK-1" },
  4: { at: ENZ_AT, dir: 1, name: [62, 139], en: "Aldolase", he: "אלדולאז" },
  5: { at: [62, 128], dir: 1, name: [62, 92], en: "TPI", he: "TPI" },
  6: { at: ENZ_AT, dir: 1, name: [62, 139], en: "GAPDH", he: "GAPDH" },
  7: { at: ENZ_AT, dir: 1, name: [62, 139], en: "PGK", he: "PGK" },
  8: { at: ENZ_AT, dir: 1, name: [62, 139], en: "Mutase", he: "מוטאז" },
  9: { at: ENZ_AT, dir: 1, name: [62, 139], en: "Enolase", he: "אנולאז" },
  10: { at: ENZ_AT, dir: 1, name: [62, 139], en: "Pyruvate kinase", he: "פירובט קינאז" },
};
const STEPS = Object.keys(ENZ).map(Number) as St[];
const enzymes = (s: St): El[] => STEPS.map((k) => {
  const e = ENZ[k];
  return path(`enz${k}`, smooth(ENZ_PTS.map(([x, y]) => [e.at[0] + e.dir * x, e.at[1] + y] as Pt), true),
    { color: C.enzymeFill, stroke: C.enzyme, strokeWidth: 2.4, opacity: k === s ? 1 : 0 });
});

// what the enzyme consumes/produces in this step (badge under it)
const COF: Partial<Record<St, { s: string; color: string; at: Pt }>> = {
  1: { s: "ATP → ADP", color: C.energy, at: [300, 214] },
  3: { s: "ATP → ADP", color: C.energy, at: [62, 226] },
  6: { s: "NAD⁺ → NADH", color: C.redox, at: [72, 246] },
  7: { s: "ADP → ATP", color: C.energy, at: [62, 246] },
  9: { s: "− H₂O", color: C.muted, at: [62, 246] },
  10: { s: "ADP → ATP", color: C.energy, at: [62, 246] },
};

// one callout per step, pointing at what changes
const CALLOUT: Partial<Record<St, { at: Pt; to: Pt; en: string; he: string }>> = {
  2: { at: [96, 70], to: [148, 136], en: "C1 outside the ring", he: "פחמן 1 מחוץ לטבעת" },
  3: { at: [116, 70], to: [114, 101], en: "Phosphate on C1", he: "זרחה על פחמן 1" },
  4: { at: [338, 180], to: [257, 140], en: "C3–C4 bond broken", he: "הקשר 3–4 נשבר" },
  5: { at: [150, 66], to: [252, 97], en: "Carbonyl moved", he: "הקרבוניל עבר לקצה" },
  6: { at: [330, 180], to: [294, 139], en: "High-energy bond", he: "קשר עתיר אנרגיה" },
  7: { at: [330, 180], to: [277, 135], en: "Carboxyl group", he: "קבוצה קרבוקסילית" },
  8: { at: [342, 182], to: [226, 171], en: "P moved to C2", he: "זרחה לפחמן 2" },
  9: { at: [150, 72], to: [195, 125], en: "C=C double bond", he: "קשר כפול C=C" },
  10: { at: [330, 180], to: [222, 150], en: "Ketone group", he: "קבוצה קטונית" },
};

const ATP = ["ATP −1", "ATP −1", "ATP −2", "ATP −2", "ATP −2", "ATP −2", "ATP ±0", "ATP ±0", "ATP ±0", "ATP +2"];
const CAPTION: Partial<Record<St, [string, string, string]>> = {
  1: ["Glucose 6-phosphate", "גלוקוז-6-פוספט", "G6P"],
  2: ["Fructose 6-phosphate", "פרוקטוז-6-פוספט", "F6P"],
  3: ["Fructose 1,6-bisphosphate", "פרוקטוז-1,6-ביספוספט", "F-1,6-BP"],
};
const TAGS: Partial<Record<St, [string, string, string, string]>> = { // top en/he, bottom en/he
  4: ["DHAP", "DHAP", "G3P", "G3P"],
  5: ["G3P", "G3P", "G3P", "G3P"],
  6: ["1,3-BPG", "1,3-BPG", "1,3-BPG", "1,3-BPG"],
  7: ["3-PG", "3-PG", "3-PG", "3-PG"],
  8: ["2-PG", "2-PG", "2-PG", "2-PG"],
  9: ["PEP", "PEP", "PEP", "PEP"],
  10: ["Pyruvate", "פירובט", "Pyruvate", "פירובט"],
};

function scene(s: St): El[] {
  const p = pos(s);
  const op = (a: Atom) => (PRESENT[a](s) ? 1 : 0);
  const e = ENZ[s], cof = COF[s], cap = CAPTION[s], tags = TAGS[s], co = CALLOUT[s];
  const carbon = (a: Atom) => circle(a, ...p[a], 8, CARB, { stroke: "#ffffff", strokeWidth: 1.5, opacity: op(a) });
  const oxygen = (a: Atom) => circle(a, ...p[a], 6.5, OXY, { stroke: "#ffffff", strokeWidth: 1.5, opacity: op(a) });
  const tagText = (id: string, y: number, en?: string, he?: string) =>
    text(id, 350, y, en ?? "", he ?? "", { weight: 700, ltr: en === he, opacity: tags ? 1 : 0 });
  const first = s === 1 ? 1 : 0;
  const cw = cof ? Math.max(70, cof.s.length * 10.5 + 20) : 70, ca = cof?.at ?? [62, 246];

  return [
    // step 1 only: cell membrane with the glucose transporter
    ...bilayer("mem", 0, 400, 22).map((m) => ({ ...m, opacity: first })),
    rect("glut_l", 183, 4, 14, 40, C.proteinFill, { rx: 6, stroke: C.protein, strokeWidth: 2, opacity: first }),
    rect("glut_r", 203, 4, 14, 40, C.proteinFill, { rx: 6, stroke: C.protein, strokeWidth: 2, opacity: first }),
    arrow("in", 200, 46, 200, 112, C.line, 2.4, { opacity: first }),
    label("l_glut", 108, 66, "Glucose transporter", "נשא גלוקוז (GLUT)", [188, 28], { opacity: first, short: "GLUT", shortHe: "GLUT" }),

    // running tally per glucose
    text("led_h", 351, 52, "Per glucose", "מאזן לגלוקוז", { textColor: C.muted }),
    rect("led_atp_bg", 304, 58, 94, 24, "#ffffff", { rx: 12, stroke: C.energy, strokeWidth: 2 }),
    text("led_atp", 351, 75, ATP[s - 1], ATP[s - 1], { ltr: true, weight: 800, textColor: "#b45309" }),
    rect("led_nadh_bg", 304, 88, 94, 24, "#ffffff", { rx: 12, stroke: C.redox, strokeWidth: 2, opacity: s >= 6 ? 1 : 0 }),
    text("led_nadh", 351, 105, "NADH +2", "NADH +2", { ltr: true, weight: 800, textColor: C.redox, opacity: s >= 6 ? 1 : 0 }),

    // enzymes + what this one uses/makes
    ...enzymes(s),
    text("enz_n", e.name[0], e.name[1], e.en, e.he, { weight: 700, textColor: "#0369a1", ltr: e.en === e.he }),
    rect("cof_bg", ca[0] - cw / 2, ca[1] - 12, cw, 24, "#ffffff", { rx: 12, stroke: cof?.color ?? C.muted, strokeWidth: 2, opacity: cof ? 1 : 0 }),
    text("cof_tx", ca[0], ca[1] + 6, cof?.s ?? "", cof?.s ?? "", { ltr: true, weight: 700, textColor: cof?.color ?? C.muted, opacity: cof ? 1 : 0 }),

    // the molecule(s): bonds under atoms
    ...bonds(s).flatMap(([id, a, b, order]) => bondEls(id, p[a], p[b], order)),
    ...(["C1", "C2", "C3", "C4", "C5", "C6"] as Atom[]).map(carbon),
    ...(["Or", "tOk", "tO1", "bO1", "o1", "o6", "o2b", "o5b", "o3a", "o4a"] as Atom[]).map(oxygen),
    ...phos("P1", p.P1, op("P1"), s === 9),
    ...phos("P6", p.P6, op("P6"), s === 9),
    ...phos("tPa", p.tPa, op("tPa"), true),
    ...phos("bPa", p.bPa, op("bPa"), true),

    // callout + names
    label("co", co?.at[0] ?? 200, co?.at[1] ?? 150, co?.en ?? "", co?.he ?? "", co?.to ?? [200, 150], { opacity: co ? 1 : 0 }),
    text("cap", 200, 266, cap?.[0] ?? "", cap?.[1] ?? "", { weight: 700, opacity: cap ? 1 : 0, short: cap?.[2], shortHe: cap?.[2] }),
    tagText("tag_t", T + 6, tags?.[0], tags?.[1]),
    tagText("tag_b", B + 6, tags?.[2], tags?.[3]),
  ];
}

export const glycolysis: ProcessScene = {
  slug: "glycolysis",
  meta: {
    topic: "biochemistry",
    nameHe: "גליקוליזה", nameEn: "Glycolysis",
    descHe: "פירוק גלוקוז לשתי מולקולות פירובט בציטוזול, עם רווח נקי של 2 ATP ו-2 NADH",
    descEn: "Breakdown of glucose into two pyruvate molecules in the cytosol, with a net yield of 2 ATP and 2 NADH",
    source: "Campbell 12e ch. 9; Lehninger 8e ch. 14",
  },
  legend: [
    { color: CARB, he: "אטום פחמן", en: "Carbon atom", swatch: "dot" },
    { color: OXY, he: "אטום חמצן", en: "Oxygen atom", swatch: "dot" },
    { color: PH, he: "זרחה (P)", en: "Phosphoryl group (P)", swatch: "dot" },
    { color: HIGH, he: "זרחה עתירת אנרגיה", en: "High-energy phosphate", swatch: "ring" },
    { color: C.enzyme, he: "אנזים", en: "Enzyme", swatch: "ring" },
  ],
  steps: [
    {
      titleHe: "גלוקוז נכנס ונלכד — הקסוקינאז", titleEn: "Glucose Enters and Is Trapped — Hexokinase",
      descHe: "גלוקוז נכנס לתא דרך נשא GLUT (דיפוזיה מואצת). בציטוזול הקסוקינאז מעביר זרחה מ-ATP לחמצן שעל פחמן 6 ויוצר גלוקוז-6-פוספט. המטען השלילי של הזרחה לא עובר דרך הנשא, ולכן הגלוקוז נלכד בתא. זו ההשקעה הראשונה: ATP אחד.",
      descEn: "Glucose enters the cell through a GLUT transporter (facilitated diffusion). In the cytosol, hexokinase transfers a phosphate from ATP to the oxygen on carbon 6, forming glucose 6-phosphate. The phosphate's negative charge cannot pass through the transporter, so glucose is trapped in the cell. First investment: one ATP.",
      elements: scene(1),
    },
    {
      titleHe: "איזומריזציה — מטבעת בת 6 לטבעת בת 5", titleEn: "Isomerization — From a 6- to a 5-Membered Ring",
      descHe: "פוספוגלוקוז איזומראז הופך את G6P (אלדוז) לפרוקטוז-6-פוספט (קטוז): הקבוצה הקרבונילית עוברת מפחמן 1 לפחמן 2, והטבעת נסגרת כטבעת בת 5 דרך אותו חמצן של פחמן 5. כעת פחמן 1 בולט מחוץ לטבעת וזמין לזרחה נוספת.",
      descEn: "Phosphoglucose isomerase converts G6P (an aldose) into fructose 6-phosphate (a ketose): the carbonyl moves from carbon 1 to carbon 2, and the ring closes as a 5-membered ring through the same carbon-5 oxygen. Carbon 1 now sticks out of the ring, free to take a second phosphate.",
      elements: scene(2),
    },
    {
      titleHe: "PFK-1 — השלב המחייב והמבוקר", titleEn: "PFK-1 — The Committed, Regulated Step",
      descHe: "פוספופרוקטוקינאז-1 מעביר זרחה שנייה מ-ATP לפחמן 1 ויוצר פרוקטוז-1,6-ביספוספט. מכאן הסוכר מחויב לגליקוליזה, ולכן כאן נמצאת נקודת הבקרה העיקרית: ATP וציטראט מעכבים את האנזים, AMP ופרוקטוז-2,6-ביספוספט משפעלים אותו. סך ההשקעה: 2 ATP.",
      descEn: "Phosphofructokinase-1 transfers a second phosphate from ATP to carbon 1, forming fructose 1,6-bisphosphate. From here the sugar is committed to glycolysis, so this is the main control point: ATP and citrate inhibit the enzyme, AMP and fructose 2,6-bisphosphate activate it. Total investment: 2 ATP.",
      elements: scene(3),
    },
    {
      titleHe: "אלדולאז — פיצול לשני סוכרים בני 3 פחמנים", titleEn: "Aldolase — Splitting into Two 3-Carbon Sugars",
      descHe: "אלדולאז מפרק את הקשר בין פחמן 3 לפחמן 4 (בצורה הפתוחה של הסוכר). פחמנים 1–3 יוצרים דיהידרוקסיאצטון פוספט (DHAP, קטון), ופחמנים 4–6 יוצרים גליצראלדהיד-3-פוספט (G3P, אלדהיד). כל אחד מקבל אחת משתי הזרחות שהושקעו.",
      descEn: "Aldolase breaks the bond between carbons 3 and 4 (in the open-chain form of the sugar). Carbons 1–3 become dihydroxyacetone phosphate (DHAP, a ketone) and carbons 4–6 become glyceraldehyde 3-phosphate (G3P, an aldehyde). Each takes one of the two invested phosphates.",
      elements: scene(4),
    },
    {
      titleHe: "TPI — שתי מולקולות G3P", titleEn: "TPI — Two Molecules of G3P",
      descHe: "טריוז-פוספט איזומראז מעביר את הקבוצה הקרבונילית של DHAP מהפחמן האמצעי לפחמן הקצה; הזרחה נשארת במקומה. כך DHAP הופך ל-G3P. רק G3P ממשיך במסלול, ולכן מכל גלוקוז יוצאות שתי מולקולות G3P, ומכאן כל שלב קורה פעמיים.",
      descEn: "Triose phosphate isomerase moves DHAP's carbonyl from the middle carbon to the end carbon; the phosphate stays where it is. DHAP thus becomes G3P. Only G3P continues down the pathway, so each glucose yields two G3P, and from here on every step happens twice.",
      elements: scene(5),
    },
    {
      titleHe: "GAPDH — חמצון ויצירת NADH", titleEn: "GAPDH — Oxidation Makes NADH",
      descHe: "גליצראלדהיד-3-פוספט דהידרוגנאז מחמצן את קבוצת האלדהיד ומחבר אליה זרחה אנאורגנית מהתמיסה (Pi, לא מ-ATP). האלקטרונים עוברים ל-NAD⁺ ונוצר NADH. התוצר, 1,3-ביספוספוגליצרט, נושא קשר אציל-פוספט עתיר אנרגיה. לגלוקוז: 2 NADH.",
      descEn: "Glyceraldehyde 3-phosphate dehydrogenase oxidizes the aldehyde group and attaches inorganic phosphate from solution (Pi, not from ATP). The electrons go to NAD⁺, forming NADH. The product, 1,3-bisphosphoglycerate, carries a high-energy acyl-phosphate bond. Per glucose: 2 NADH.",
      elements: scene(6),
    },
    {
      titleHe: "PGK — ה-ATP הראשון", titleEn: "PGK — The First ATP",
      descHe: "פוספוגליצרט קינאז מעביר את הזרחה עתירת האנרגיה ל-ADP ונוצר ATP: זרחון ברמת הסובסטרט. החמצן שגישר לזרחה נשאר על פחמן 1, שהופך לקבוצה קרבוקסילית (3-פוספוגליצרט). שתי המולקולות יחד מחזירות 2 ATP, וההשקעה כוסתה.",
      descEn: "Phosphoglycerate kinase transfers the high-energy phosphate to ADP, making ATP by substrate-level phosphorylation. The bridging oxygen stays on carbon 1, which becomes a carboxyl group (3-phosphoglycerate). Together the two molecules return 2 ATP, covering the investment.",
      elements: scene(7),
    },
    {
      titleHe: "מוטאז — הזרחה עוברת לפחמן 2", titleEn: "Mutase — The Phosphate Moves to Carbon 2",
      descHe: "פוספוגליצרט מוטאז מעביר את הזרחה מפחמן 3 לפחמן 2 ויוצר 2-פוספוגליצרט (דרך תוצר ביניים 2,3-ביספוספוגליצרט). אין כאן השקעה או רווח של ATP; זו הכנה לשלב הבא.",
      descEn: "Phosphoglycerate mutase moves the phosphate from carbon 3 to carbon 2, forming 2-phosphoglycerate (via a 2,3-bisphosphoglycerate intermediate). No ATP is used or made; this sets up the next step.",
      elements: scene(8),
    },
    {
      titleHe: "אנולאז — יצירת PEP", titleEn: "Enolase — Making PEP",
      descHe: "אנולאז מוציא מולקולת מים מ-2-פוספוגליצרט ויוצר קשר כפול בין פחמן 2 לפחמן 3: פוספואנולפירובט (PEP). הסידור מחדש מעלה מאוד את פוטנציאל העברת הזרחה, כך שהיא יכולה לזרחן ADP.",
      descEn: "Enolase removes a water molecule from 2-phosphoglycerate, creating a double bond between carbons 2 and 3: phosphoenolpyruvate (PEP). The rearrangement greatly raises the phosphate's transfer potential, enough to phosphorylate ADP.",
      elements: scene(9),
    },
    {
      titleHe: "פירובט קינאז — עוד 2 ATP ופירובט", titleEn: "Pyruvate Kinase — Two More ATP and Pyruvate",
      descHe: "פירובט קינאז מעביר את הזרחה מ-PEP ל-ADP ונוצר ATP. החמצן שגישר נשאר על פחמן 2 והופך לקבוצה קטונית: פירובט. גם זה שלב בלתי הפיך ומבוקר. רווח נקי לגלוקוז: 2 ATP, 2 NADH ו-2 פירובט, שממשיכים למיטוכונדריה (בנוכחות חמצן) או לתסיסה.",
      descEn: "Pyruvate kinase transfers the phosphate from PEP to ADP, making ATP. The bridging oxygen stays on carbon 2 and becomes a ketone: pyruvate. This is also an irreversible, regulated step. Net per glucose: 2 ATP, 2 NADH and 2 pyruvate, which go on to the mitochondrion (with oxygen) or to fermentation.",
      elements: scene(10),
    },
  ],
};
