import { C, bilayer, circle, label, line, path, rect, text, type El, type ProcessScene, type Pt } from "./kit";

// Action potential in an axon (Berne & Levy 8e ch. 5; Campbell 12e ch. 48):
// membrane with voltage-gated Na⁺ (activation + inactivation gates) and K⁺
// channels above, the membrane-potential trace below.
const NA = "#f97316", K = "#7c3aed", MY = 100;
const iso = (t: string) => `⁦${t}⁩`; // keep "−55 mV" left-to-right inside Hebrew

// voltage-gated Na⁺ channel at x: activation gate (bar) at the inner mouth, inactivation ball on a tether
function naChannel(x: number, act: boolean, inact: boolean): El[] {
  const ball: Pt = inact ? [x, MY + 20] : [x + 22, MY + 34];
  return [
    rect("na_l", x - 16, MY - 18, 10, 36, "#fdba74", { rx: 3, stroke: "#c2410c", strokeWidth: 1.5 }),
    rect("na_r", x + 6, MY - 18, 10, 36, "#fdba74", { rx: 3, stroke: "#c2410c", strokeWidth: 1.5 }),
    rect("na_m", act ? x - 20 : x - 6, MY + 12, act ? 8 : 12, 5, "#c2410c", { rx: 1 }),
    path("na_teth", `M ${x + 16} ${MY + 18} Q ${x + 24} ${MY + 28} ${ball[0]} ${ball[1]}`, { stroke: "#c2410c", strokeWidth: 1.5 }),
    circle("na_h", ball[0], ball[1], 5, "#9a3412"),
  ];
}
function kChannel(x: number, open: boolean): El[] {
  return [
    rect("k_l", x - 16, MY - 18, 10, 36, "#ddd6fe", { rx: 3, stroke: "#6d28d9", strokeWidth: 1.5 }),
    rect("k_r", x + 6, MY - 18, 10, 36, "#ddd6fe", { rx: 3, stroke: "#6d28d9", strokeWidth: 1.5 }),
    rect("k_g", open ? x - 20 : x - 6, MY + 12, open ? 8 : 12, 5, "#6d28d9", { rx: 1 }),
  ];
}
const pump = (): El[] => [
  path("pump", `M 322 ${MY - 16} C 322 ${MY - 26} 358 ${MY - 26} 358 ${MY - 16} L 358 ${MY + 16} C 358 ${MY + 26} 322 ${MY + 26} 322 ${MY + 16} Z`, { color: "#bbf7d0", stroke: "#15803d", strokeWidth: 1.5 }),
  text("pump_t", 340, MY + 6, "ATP", "ATP", { ltr: true, fontSize: 16.5, weight: 700, halo: false, textColor: "#15803d" }),
];
const ions = (id: string, pts: Pt[], color: string) => pts.map(([x, y], i) => circle(`${id}${i}`, x, y, 4.5, color, { stroke: "#fff", strokeWidth: 1 }));
const NA_OUT: Pt[] = [[40, 58], [70, 70], [100, 54], [150, 62], [180, 72], [230, 56], [290, 66], [300, 40]];
const K_IN: Pt[] = [[40, 142], [80, 150], [150, 146], [190, 138], [236, 150], [300, 142], [330, 160]];

// membrane-potential trace (bottom panel): x = time, y = mV; −70 → y 270, +30 → y 205
const V = (mv: number) => 270 - ((mv + 70) / 100) * 65;
const TRACE = `M 40 ${V(-70)} L 110 ${V(-70)} C 125 ${V(-68)} 135 ${V(-58)} 142 ${V(-55)} C 152 ${V(-40)} 160 ${V(10)} 172 ${V(30)} C 182 ${V(28)} 196 ${V(-20)} 212 ${V(-65)} C 224 ${V(-86)} 244 ${V(-84)} 262 ${V(-76)} C 290 ${V(-72)} 320 ${V(-70)} 380 ${V(-70)}`;
const graph = (dot: Pt): El[] => [
  line("g_ax", 36, 290, 384, 290, C.line, 1.5),
  line("g_thr", 40, V(-55), 384, V(-55), "#94a3b8", 1.2, { dash: "4 3" }),
  path("g_tr", TRACE, { stroke: "#334155", strokeWidth: 2.5 }),
  circle("g_dot", dot[0], dot[1], 6, "#dc2626", { stroke: "#fff", strokeWidth: 1.5 }),
  text("g_m70", 8, V(-70) + 5, "−70", "−70", { anchor: "start", ltr: true, fontSize: 16.5, textColor: C.muted }),
  text("g_p30", 8, V(30) + 5, "+30", "+30", { anchor: "start", ltr: true, fontSize: 16.5, textColor: C.muted }),
];
const base = (): El[] => [
  ...bilayer("mem", 0, 400, MY, { th: 26 }),
  ...pump(),
  text("out", 396, 78, "outside", "חוץ התא", { anchor: "end", textColor: C.muted, weight: 700 }),
  text("in", 396, 136, "cytosol", "ציטוזול", { anchor: "end", textColor: C.muted, weight: 700 }),
];

const s1: El[] = [
  ...base(), ...naChannel(120, false, false), ...kChannel(240, false),
  ...ions("na", NA_OUT, NA), ...ions("k", K_IN, K),
  ...graph([90, V(-70)]),
  label("l_na", 14, 30, "Voltage-gated Na⁺ (closed)", "תעלת Na⁺ תלוית מתח — סגורה", [120, 88], { anchor: "start", shortHe: "Na⁺ סגורה", short: "Na⁺ closed" }),
  label("l_pump", 250, 196, "Na⁺/K⁺ pump keeps gradients", "משאבת Na⁺/K⁺ שומרת על המפל", [340, 116], { anchor: "start", shortHe: "משאבת Na⁺/K⁺", short: "Na⁺/K⁺ pump" }),
];
const s2: El[] = [
  ...base(), ...naChannel(120, true, false), ...kChannel(240, false),
  ...ions("na", [[40, 58], [70, 70], [120, 80], [150, 62], [180, 72], [230, 56], [290, 66], [124, 128]], NA), ...ions("k", K_IN, K),
  ...graph([142, V(-55)]),
  label("l_thr", 250, 196, "Threshold ≈ −55 mV", `סף ≈ ${iso("−55 mV")}`, [300, V(-55)], { anchor: "start" }),
  label("l_act", 14, 30, "Activation gates open", "שער ההפעלה נפתח", [110, 114], { anchor: "start" }),
];
const s3: El[] = [
  ...base(), ...naChannel(120, true, false), ...kChannel(240, false),
  ...ions("na", [[112, 76], [120, 96], [128, 118], [110, 132], [140, 140], [100, 146], [160, 128], [124, 150]], NA), ...ions("k", K_IN, K),
  ...graph([172, V(30)]),
  label("l_in", 14, 30, "Na⁺ rushes in", "Na⁺ נכנס בשטף", [128, 118], { anchor: "start" }),
  label("l_pk", 220, 196, "Depolarisation to +30 mV", `דה-פולריזציה עד ${iso("+30 mV")}`, [172, V(30)], { anchor: "start", shortHe: `שיא ${iso("+30 mV")}`, short: "Peak +30 mV" }),
];
const s4: El[] = [
  ...base(), ...naChannel(120, true, true), ...kChannel(240, true),
  ...ions("na", [[112, 76], [150, 62], [128, 118], [110, 132], [140, 140], [100, 146], [160, 128], [124, 150]], NA),
  ...ions("k", [[40, 142], [80, 150], [236, 110], [240, 84], [248, 60], [300, 142], [330, 160]], K),
  ...graph([204, V(-45)]),
  label("l_inact", 14, 30, "Na⁺ channels inactivate", "תעלות Na⁺ מושבתות", [120, MY + 20], { anchor: "start", shortHe: "Na⁺ מושבתות", short: "Na⁺ inactivated" }),
  label("l_kout", 270, 30, "K⁺ flows out", "K⁺ יוצא", [248, 60], { anchor: "start" }),
];
const s5: El[] = [
  ...base(), ...naChannel(120, false, false), ...kChannel(240, true),
  ...ions("na", NA_OUT, NA), ...ions("k", K_IN, K),
  ...graph([250, V(-82)]),
  label("l_hyp", 250, 196, "Hyperpolarisation", "היפרפולריזציה", [250, V(-82)], { anchor: "start" }),
  label("l_ref", 14, 30, "Refractory: Na⁺ gates reset", "תקופה רפרקטורית", [120, 88], { anchor: "start", shortHe: "רפרקטורית", short: "Refractory" }),
];

export const actionPotential: ProcessScene = {
  slug: "action-potential",
  meta: {
    topic: "physiology", subtopic: "action-potential",
    nameHe: "פוטנציאל פעולה", nameEn: "The Action Potential",
    descHe: "תעלות Na⁺ ו-K⁺ תלויות מתח יוצרות את פוטנציאל הפעולה: מנוחה, סף, דה-פולריזציה, רה-פולריזציה והיפרפולריזציה",
    descEn: "Voltage-gated Na⁺ and K⁺ channels generate the action potential: rest, threshold, depolarisation, repolarisation and hyperpolarisation",
    source: "Berne & Levy 8e ch. 5; Campbell 12e ch. 48",
  },
  legend: [
    { color: NA, he: "יוני Na⁺", en: "Na⁺ ions", swatch: "dot" },
    { color: K, he: "יוני K⁺", en: "K⁺ ions", swatch: "dot" },
    { color: "#c2410c", he: "תעלת Na⁺ תלוית מתח (שערים m ו-h)", en: "Voltage-gated Na⁺ channel (m and h gates)", swatch: "ring" },
    { color: "#6d28d9", he: "תעלת K⁺ תלוית מתח", en: "Voltage-gated K⁺ channel", swatch: "ring" },
    { color: "#334155", he: "פוטנציאל הממברנה (mV)", en: "Membrane potential (mV)", swatch: "line" },
  ],
  steps: [
    {
      titleHe: "פוטנציאל מנוחה (−70 mV)", titleEn: "Resting Potential (−70 mV)",
      descHe: "במנוחה פנים האקסון שלילי ביחס לחוץ, כ-−70 mV. משאבת Na⁺/K⁺ (ATPase) מוציאה 3 Na⁺ ומכניסה 2 K⁺, ולכן Na⁺ מרוכז בחוץ ו-K⁺ בפנים. דליפת K⁺ דרך תעלות פתוחות תמיד היא העיקר ביצירת הפוטנציאל. תעלות ה-Na⁺ וה-K⁺ תלויות המתח סגורות.",
      descEn: "At rest the inside of the axon is negative relative to the outside, about −70 mV. The Na⁺/K⁺ ATPase pumps out 3 Na⁺ and in 2 K⁺, so Na⁺ is concentrated outside and K⁺ inside. K⁺ leaking through always-open channels mainly sets the potential. Voltage-gated Na⁺ and K⁺ channels are closed.",
      elements: s1,
    },
    {
      titleHe: "הגעה לסף", titleEn: "Reaching Threshold",
      descHe: "גירוי (למשל פוטנציאל סינפטי) מקטין את השליליות. כשהממברנה מגיעה לסף — בערך −55 mV — שערי ההפעלה של תעלות Na⁺ תלויות מתח נפתחים. מתחת לסף לא נוצר פוטנציאל פעולה; מעליו הוא נוצר תמיד באותו גודל (הכול או לא-כלום).",
      descEn: "A stimulus (for example a synaptic potential) makes the inside less negative. When the membrane reaches threshold — about −55 mV — the activation gates of voltage-gated Na⁺ channels open. Below threshold no action potential forms; above it, one always forms at full size (all-or-none).",
      elements: s2,
    },
    {
      titleHe: "דה-פולריזציה", titleEn: "Depolarisation",
      descHe: "Na⁺ נכנס לתא לפי מפל הריכוז והמטען, והכניסה פותחת עוד תעלות Na⁺ — משוב חיובי. תוך כמילישנייה הפוטנציאל עולה לכ-+30 mV, קרוב לפוטנציאל שיווי המשקל של Na⁺.",
      descEn: "Na⁺ enters down its concentration and electrical gradient, and the entry opens more Na⁺ channels — positive feedback. Within about a millisecond the potential rises to about +30 mV, close to the Na⁺ equilibrium potential.",
      elements: s3,
    },
    {
      titleHe: "רה-פולריזציה", titleEn: "Repolarisation",
      descHe: "שערי ההשבתה (h) סוגרים את תעלות ה-Na⁺, וכניסת ה-Na⁺ נעצרת. במקביל נפתחות, באיחור, תעלות K⁺ תלויות מתח, ו-K⁺ יוצא מהתא — הפוטנציאל חוזר לערכים שליליים.",
      descEn: "Inactivation gates (h) close the Na⁺ channels and Na⁺ entry stops. Meanwhile voltage-gated K⁺ channels, which open with a delay, let K⁺ out — the potential returns to negative values.",
      elements: s4,
    },
    {
      titleHe: "היפרפולריזציה ותקופה רפרקטורית", titleEn: "Hyperpolarisation and Refractory Period",
      descHe: "תעלות ה-K⁺ נסגרות לאט, ולכן הפוטנציאל יורד לרגע מתחת ל-−70 mV. בזמן שתעלות ה-Na⁺ מושבתות אי אפשר לעורר פוטנציאל פעולה חדש (תקופה רפרקטורית מוחלטת), ולכן הדחף מתקדם באקסון בכיוון אחד בלבד. משאבת Na⁺/K⁺ שומרת לאורך זמן על המפלים.",
      descEn: "K⁺ channels close slowly, so the potential briefly dips below −70 mV. While Na⁺ channels are inactivated no new action potential can fire (absolute refractory period), so the impulse travels along the axon in one direction only. The Na⁺/K⁺ pump maintains the gradients over time.",
      elements: s5,
    },
  ],
};
