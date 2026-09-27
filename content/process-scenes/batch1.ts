import { C, arrow, badge, bilayer, circle, ellipse, label, line, path, poly, rect, ring, smooth, text, wave, type El, type ProcessScene, type Pt } from "./kit";

const f = (n: number) => Math.round(n * 10) / 10;
// globular enzyme with an active-site cleft on top (same shape as the "enzyme" composite)
const enzymeShape = (id: string, cx: number, cy: number, r: number, color: string, cleftOpen = 1, o: Partial<El> = {}) => {
  const d = 0.45 * cleftOpen;
  const pts: Pt[] = [[cx - r, cy], [cx - r * 0.8, cy - r * 0.75], [cx - r * 0.25, cy - r * 0.9], [cx, cy - r * (0.9 - d)], [cx + r * 0.25, cy - r * 0.9], [cx + r * 0.8, cy - r * 0.75], [cx + r, cy], [cx + r * 0.7, cy + r * 0.8], [cx, cy + r], [cx - r * 0.7, cy + r * 0.8]];
  return path(id, smooth(pts, true), { color, stroke: "#334155", strokeWidth: 1.8, ...o });
};
const diamond = (id: string, x: number, y: number, s: number, color: string, stroke: string, o: Partial<El> = {}) =>
  path(id, poly([[x, y - s], [x + s, y], [x, y + s], [x - s, y]]), { color, stroke, strokeWidth: 1.5, ...o });

/* ══ ENZYME KINETICS (Lehninger 8e ch. 6) ═══════════════════════════ */
const GX = 214, GY = 250, SX = 14; // graph origin and px per unit [S]
const mm = (id: string, vmax: number, km: number, color: string, o: Partial<El> = {}) => {
  const pts: Pt[] = [];
  for (let s = 0; s <= 12; s += 0.75) pts.push([GX + s * SX, GY - (160 * vmax * s) / (km + s)]);
  return path(id, smooth(pts), { stroke: color, strokeWidth: 3, ...o });
};
const axes = (): El[] => [
  line("ax_y", GX, GY, GX, 44, C.line, 1.8, { arrow: true }),
  line("ax_x", GX, GY, 392, GY, C.line, 1.8, { arrow: true }),
  text("ax_yl", GX + 6, 40, "V₀", "V₀", { anchor: "start", ltr: true, weight: 700 }),
  text("ax_xl", 392, GY + 22, "[S]", "[S]", { anchor: "end", ltr: true, weight: 700 }),
  line("vmax", GX, 90, 392, 90, "#64748b", 1.3, { dash: "5 4" }),
  text("vmax_t", 390, 82, "Vmax", "Vmax", { anchor: "end", ltr: true, weight: 700, textColor: "#475569" }),
];
const kmMark = (id: string, km: number, vFrac: number, color: string): El[] => {
  const x = GX + km * SX, y = GY - 160 * vFrac;
  return [line(`${id}_h`, GX, y, x, y, color, 1.2, { dash: "3 3" }), line(`${id}_v`, x, y, x, GY, color, 1.2, { dash: "3 3" })];
};
const k1: El[] = [
  enzymeShape("enz", 90, 176, 46, "#c7d2fe"),
  diamond("sub", 60, 70, 14, "#fca5a5", "#dc2626"),
  arrow("s_in", 70, 84, 84, 122, C.line, 2.2),
  diamond("es", 90, 146, 13, "#fca5a5", "#dc2626", { opacity: 0 }),
  path("p1", poly([[270, 150], [284, 136], [284, 164]]), { color: "#fde68a", stroke: "#b45309", strokeWidth: 1.5 }),
  path("p2", poly([[330, 150], [316, 136], [316, 164]]), { color: "#fde68a", stroke: "#b45309", strokeWidth: 1.5 }),
  enzymeShape("enz2", 300, 214, 40, "#c7d2fe"),
  arrow("cat", 150, 170, 244, 190, C.line, 2.4),
  text("eq", 200, 40, "E + S ⇌ ES → E + P", "E + S ⇌ ES → E + P", { ltr: true, weight: 800, textColor: "#4338ca" }),
  text("k", 196, 172, "k_cat", "k_cat", { ltr: true, fontSize: 16.5, textColor: "#4338ca" }),
  label("l_as", 150, 90, "Active site", "אתר פעיל", [90, 146], { anchor: "start" }),
  label("l_sub", 14, 290, "Substrate (S)", "מצע (S)", [60, 84], { anchor: "start" }),
  label("l_p", 300, 110, "Products (P)", "תוצרים (P)", [284, 140], { anchor: "start" }),
];
const k2: El[] = [
  enzymeShape("enz", 90, 176, 46, "#c7d2fe"),
  diamond("es", 90, 146, 13, "#fca5a5", "#dc2626"),
  ...[[40, 90], [150, 100], [30, 250], [160, 240], [140, 60]].map(([x, y], i) => diamond(`sx${i}`, x, y, 10, "#fca5a5", "#dc2626")),
  ...axes(),
  mm("c0", 1, 2, "#4338ca"),
  ...kmMark("km0", 2, 0.5, "#4338ca"),
  text("km0_t", GX + 2 * SX, GY + 22, "Km", "Km", { ltr: true, weight: 700, textColor: "#4338ca" }),
  label("l_half", 290, 150, "½Vmax at [S] = Km", "Km (חצי Vmax)", [GX + 2 * SX, GY - 80], { anchor: "start", shortHe: "Km", short: "Km" }),
  label("l_sat", 14, 40, "Saturation: all E busy", "רוויה: כל האנזימים תפוסים", [90, 146], { anchor: "start", shortHe: "רוויה", short: "Saturation" }),
];
const k3: El[] = [
  enzymeShape("enz", 90, 176, 46, "#c7d2fe"),
  path("es", poly([[78, 146], [102, 146], [90, 132]]), { color: "#f87171", stroke: "#991b1b", strokeWidth: 1.5 }),
  ...axes(),
  mm("c0", 1, 2, "#4338ca", { opacity: 0.45 }),
  mm("c1", 1, 6, "#dc2626"),
  ...kmMark("km1", 6, 0.5, "#dc2626"),
  text("km1_t", GX + 6 * SX, GY + 22, "Km(app)", "Km(app)", { ltr: true, weight: 700, textColor: "#dc2626" }),
  label("l_ci", 14, 40, "Competitive inhibitor", "מעכב תחרותי", [90, 138], { anchor: "start" }),
  label("l_ce", 250, 200, "Km ↑, Vmax same", "Km עולה, Vmax זהה", [300, 160], { anchor: "start" }),
];
const k4: El[] = [
  enzymeShape("enz", 90, 176, 46, "#c7d2fe", 0.35),
  diamond("es", 90, 124, 13, "#fca5a5", "#dc2626"),
  circle("ni", 90, 226, 11, "#c4b5fd", { stroke: "#6d28d9", strokeWidth: 1.8 }),
  ...axes(),
  mm("c0", 1, 2, "#4338ca", { opacity: 0.45 }),
  mm("c2", 0.5, 2, "#7c3aed"),
  ...kmMark("km2", 2, 0.25, "#7c3aed"),
  line("vmax2", GX, 170, 392, 170, "#7c3aed", 1.3, { dash: "5 4" }),
  label("l_ni", 14, 290, "Inhibitor at another site", "מעכב באתר אחר", [90, 226], { anchor: "start" }),
  label("l_ne", 250, 130, "Vmax ↓, Km same", "Vmax יורד, Km זהה", [340, 170], { anchor: "start" }),
  label("l_sh", 14, 40, "Active site distorted", "האתר הפעיל משתנה", [90, 140], { anchor: "start" }),
];
export const enzymeKinetics: ProcessScene = {
  slug: "enzyme-kinetics",
  meta: {
    topic: "biochemistry", subtopic: "enzymes",
    nameHe: "קינטיקה אנזימטית ועיכוב", nameEn: "Enzyme Kinetics and Inhibition",
    descHe: "מודל מיכאליס-מנטן: Vmax ו-Km, ומה משנים מעכב תחרותי ומעכב לא-תחרותי",
    descEn: "The Michaelis–Menten model: Vmax and Km, and what competitive and noncompetitive inhibitors change",
    source: "Lehninger 8e ch. 6",
  },
  legend: [
    { color: "#4338ca", he: "אנזים / עקומה ללא מעכב", en: "Enzyme / curve without inhibitor", swatch: "line" },
    { color: "#dc2626", he: "מצע / מעכב תחרותי", en: "Substrate / competitive inhibitor", swatch: "line" },
    { color: "#7c3aed", he: "מעכב לא-תחרותי", en: "Noncompetitive inhibitor", swatch: "line" },
    { color: "#b45309", he: "תוצרים", en: "Products", swatch: "dot" },
  ],
  steps: [
    {
      titleHe: "אנזים, מצע וקומפלקס ES", titleEn: "Enzyme, Substrate and the ES Complex",
      descHe: "המצע נקשר לאתר הפעיל של האנזים ויוצר קומפלקס אנזים-מצע (ES). האנזים מייצב את מצב המעבר ומוריד את אנרגיית השפעול, והתוצרים משתחררים — האנזים עצמו לא משתנה. k_cat (מספר המחזורים) הוא מספר מולקולות המצע שאתר פעיל אחד הופך לתוצר בשנייה.",
      descEn: "The substrate binds the enzyme's active site, forming an enzyme–substrate complex (ES). The enzyme stabilises the transition state, lowers the activation energy, and the products are released — the enzyme itself is unchanged. k_cat (turnover number) is the number of substrate molecules one active site converts per second.",
      elements: k1,
    },
    {
      titleHe: "עקומת מיכאליס-מנטן", titleEn: "The Michaelis–Menten Curve",
      descHe: "המהירות ההתחלתית V₀ עולה עם ריכוז המצע ומתקרבת ל-Vmax כשכמעט כל מולקולות האנזים תפוסות (רוויה): V₀ = Vmax[S] / (Km + [S]). Km הוא ריכוז המצע שבו המהירות היא חצי מ-Vmax; Km נמוך מעיד בדרך כלל על זיקה גבוהה.",
      descEn: "The initial rate V₀ rises with substrate concentration and levels off at Vmax when nearly every enzyme molecule is occupied (saturation): V₀ = Vmax[S] / (Km + [S]). Km is the substrate concentration at half Vmax; a low Km usually means high affinity.",
      elements: k2,
    },
    {
      titleHe: "עיכוב תחרותי", titleEn: "Competitive Inhibition",
      descHe: "המעכב התחרותי דומה למצע ונקשר לאתר הפעיל, ולכן מתחרה בו. ריכוז מצע גבוה מספיק דוחק אותו החוצה: Vmax לא משתנה, אבל נדרש יותר מצע כדי להגיע לחצי ממנה — Km הנראה עולה.",
      descEn: "A competitive inhibitor resembles the substrate and binds the active site, competing with it. Enough substrate outcompetes it: Vmax is unchanged, but more substrate is needed to reach half of it — the apparent Km rises.",
      elements: k3,
    },
    {
      titleHe: "עיכוב לא-תחרותי", titleEn: "Noncompetitive Inhibition",
      descHe: "המעכב נקשר לאתר אחר באנזים (גם כשהמצע קשור) ומשנה את צורת האתר הפעיל, כך שחלק ממולקולות האנזים לא פעילות. הוספת מצע לא עוזרת: Vmax יורדת, ו-Km נשאר זהה (במקרה הכללי, עיכוב מעורב, גם Km משתנה).",
      descEn: "The inhibitor binds a different site (even with substrate bound) and alters the active site, so part of the enzyme is inactive. Adding substrate does not help: Vmax falls while Km stays the same (in the general case, mixed inhibition, Km changes too).",
      elements: k4,
    },
  ],
};

/* ══ MEMBRANE TRANSPORT (Alberts 7e ch. 11; Lehninger 8e ch. 11) ═════ */
const MY = 150;
const ion = (id: string, x: number, y: number, color: string) => circle(id, x, y, 4.5, color, { stroke: "#fff", strokeWidth: 1 });
const NA = "#f97316", K = "#7c3aed", GLC = "#16a34a", O2 = "#0ea5e9";
const hexG = (id: string, x: number, y: number) => path(id, ring(x, y, 7, 6), { color: "#bbf7d0", stroke: GLC, strokeWidth: 1.5 });
const tBase = (): El[] => [
  ...bilayer("mem", 0, 400, MY, { th: 26 }),
  // channel (x 150), Na⁺/K⁺ pump (x 250), SGLT symporter (x 340)
  rect("ch_l", 136, MY - 20, 10, 40, "#bae6fd", { rx: 3, stroke: "#0369a1", strokeWidth: 1.5 }),
  rect("ch_r", 154, MY - 20, 10, 40, "#bae6fd", { rx: 3, stroke: "#0369a1", strokeWidth: 1.5 }),
  path("pump", `M 228 ${MY - 22} C 228 ${MY - 34} 272 ${MY - 34} 272 ${MY - 22} L 272 ${MY + 22} C 272 ${MY + 34} 228 ${MY + 34} 228 ${MY + 22} Z`, { color: "#bbf7d0", stroke: "#15803d", strokeWidth: 1.8 }),
  path("sglt", `M 322 ${MY - 20} C 322 ${MY - 30} 358 ${MY - 30} 358 ${MY - 20} L 358 ${MY + 20} C 358 ${MY + 30} 322 ${MY + 30} 322 ${MY + 20} Z`, { color: "#fef9c3", stroke: "#a16207", strokeWidth: 1.8 }),
  text("out", 8, 30, "extracellular", "חוץ התא", { anchor: "start", weight: 700, textColor: C.muted }),
  text("in", 8, 290, "cytosol", "ציטוזול", { anchor: "start", weight: 700, textColor: C.muted }),
];
const t1: El[] = [
  ...tBase(),
  ...[[40, 70], [70, 100], [56, 150], [44, 196]].map(([x, y], i) => ion(`o2_${i}`, x, y, O2)),
  arrow("dif", 90, 80, 90, 220, O2, 2.4),
  label("l_o2", 110, 70, "O₂, CO₂: through the lipids", "O₂ ו-CO₂ עוברים דרך השומנים", [56, 150], { anchor: "start", shortHe: "O₂ ו-CO₂", short: "O₂, CO₂" }),
  label("l_grad", 110, 250, "high → low, no energy", "מריכוז גבוה לנמוך, ללא אנרגיה", [90, 200], { anchor: "start", shortHe: "גבוה ← נמוך", short: "high → low" }),
];
const t2: El[] = [
  ...tBase(),
  ...[[130, 70], [170, 90], [150, 130], [150, 170]].map(([x, y], i) => ion(`kc${i}`, x, y, K)),
  arrow("chflow", 184, 90, 184, 206, K, 2.2),
  label("l_ch", 200, 60, "Ion channel: selective pore", "תעלת יונים — נקבובית בררנית", [150, 130], { anchor: "start", shortHe: "תעלת יונים", short: "Ion channel" }),
  label("l_fd", 14, 250, "Facilitated diffusion, down the gradient", "דיפוזיה מזורזת, עם המפל", [150, 170], { anchor: "start", shortHe: "דיפוזיה מזורזת", short: "Facilitated" }),
];
const t3: El[] = [
  ...tBase(),
  ...[[236, 110], [250, 102], [264, 110]].map(([x, y], i) => ion(`na${i}`, x, y, NA)),
  ...[[242, 196], [258, 196]].map(([x, y], i) => ion(`kp${i}`, x, y, K)),
  arrow("naout", 290, 170, 290, 104, NA, 2.2), arrow("kin", 210, 104, 210, 190, K, 2.2),
  ...badge("atp", 250, 236, "ATP → ADP + Pᵢ", "#15803d", { w: 132 }),
  label("l_p", 14, 60, "Na⁺/K⁺ ATPase", "משאבת Na⁺/K⁺", [236, 130], { anchor: "start" }),
  label("l_3na", 300, 60, "3 Na⁺ out", "החוצה: 3 Na⁺", [264, 106], { anchor: "start" }),
  label("l_2k", 300, 286, "2 K⁺ in", "פנימה: 2 K⁺", [258, 198], { anchor: "start" }),
];
const t4: El[] = [
  ...tBase(),
  ...[[330, 100], [346, 92]].map(([x, y], i) => ion(`sna${i}`, x, y, NA)), hexG("glc", 356, 110),
  ...[[334, 196], [348, 204]].map(([x, y], i) => ion(`snb${i}`, x, y, NA)), hexG("glc2", 360, 196),
  arrow("co", 380, 90, 380, 206, "#a16207", 2.4),
  label("l_sg", 14, 60, "Na⁺–glucose symporter (SGLT1)", "סימפורטר Na⁺–גלוקוז (SGLT1)", [322, 140], { anchor: "start", shortHe: "SGLT1", short: "SGLT1" }),
  label("l_sec", 14, 250, "Na⁺ gradient powers glucose uptake", "מפל ה-Na⁺ מניע את קליטת הגלוקוז", [340, 200], { anchor: "start", shortHe: "מפל Na⁺ כמנוע", short: "Na⁺ gradient" }),
];
export const membraneTransport: ProcessScene = {
  slug: "membrane-transport",
  meta: {
    topic: "cell-biology", subtopic: "cell-membrane",
    nameHe: "מעבר חומרים דרך הממברנה", nameEn: "Transport Across the Membrane",
    descHe: "דיפוזיה פשוטה, דיפוזיה מזורזת בתעלות, הובלה פעילה ראשונית (משאבת Na⁺/K⁺) ומשנית (SGLT1)",
    descEn: "Simple diffusion, facilitated diffusion through channels, primary (Na⁺/K⁺ pump) and secondary (SGLT1) active transport",
    source: "Alberts 7e ch. 11; Lehninger 8e ch. 11",
  },
  legend: [
    { color: O2, he: "O₂ / CO₂", en: "O₂ / CO₂", swatch: "dot" },
    { color: NA, he: "Na⁺", en: "Na⁺", swatch: "dot" },
    { color: K, he: "K⁺", en: "K⁺", swatch: "dot" },
    { color: GLC, he: "גלוקוז", en: "Glucose", swatch: "ring" },
    { color: "#d97706", he: "דו-שכבה פוספוליפידית", en: "Phospholipid bilayer", swatch: "dot" },
  ],
  steps: [
    {
      titleHe: "דיפוזיה פשוטה", titleEn: "Simple Diffusion",
      descHe: "מולקולות קטנות ולא קוטביות — כמו O₂, CO₂ ו-N₂ — מתמוססות בליבה ההידרופובית של הדו-שכבה ועוברות דרכה ישירות, מריכוז גבוה לנמוך, בלי חלבון ובלי אנרגיה. יונים ומולקולות קוטביות גדולות כמעט לא עוברות כך.",
      descEn: "Small nonpolar molecules — such as O₂, CO₂ and N₂ — dissolve in the hydrophobic core of the bilayer and cross it directly, from high to low concentration, with no protein and no energy. Ions and large polar molecules barely cross this way.",
      elements: t1,
    },
    {
      titleHe: "דיפוזיה מזורזת", titleEn: "Facilitated Diffusion",
      descHe: "יונים ומולקולות קוטביות עוברים בעזרת חלבונים: תעלות יוצרות נקבובית בררנית (למשל תעלות K⁺ או אקוופורינים), ונשאים כמו GLUT1 משנים צורה כדי להעביר גלוקוז. הזרימה עדיין רק עם מפל הריכוז (והמפל החשמלי) — בלי השקעת אנרגיה.",
      descEn: "Ions and polar molecules cross with the help of proteins: channels form a selective pore (such as K⁺ channels or aquaporins), and carriers like GLUT1 change shape to move glucose. Flow is still only down the concentration (and electrical) gradient — no energy spent.",
      elements: t2,
    },
    {
      titleHe: "הובלה פעילה ראשונית", titleEn: "Primary Active Transport",
      descHe: "משאבת Na⁺/K⁺ (ATPase) מפרקת ATP ומשתמשת באנרגיה כדי להוציא 3 Na⁺ ולהכניס 2 K⁺ — נגד מפלי הריכוז שלהם. הזרחון והסרת הזרחה של המשאבה משנים את צורתה לסירוגין. המפלים שהיא יוצרת חיוניים לפוטנציאל הממברנה ולהובלה משנית.",
      descEn: "The Na⁺/K⁺ ATPase splits ATP and uses the energy to pump 3 Na⁺ out and 2 K⁺ in — against their gradients. Phosphorylation and dephosphorylation switch the pump's shape back and forth. The gradients it builds power the membrane potential and secondary transport.",
      elements: t3,
    },
    {
      titleHe: "הובלה פעילה משנית", titleEn: "Secondary Active Transport",
      descHe: "הסימפורטר SGLT1 בתאי המעי והכליה מכניס גלוקוז נגד מפל הריכוז שלו, בזכות Na⁺ שנכנס יחד איתו עם המפל. האנרגיה אינה מגיעה ישירות מ-ATP אלא ממפל ה-Na⁺ שמשאבת Na⁺/K⁺ יצרה — ולכן ההובלה \"משנית\".",
      descEn: "The SGLT1 symporter in gut and kidney cells brings glucose in against its gradient, driven by Na⁺ moving in with it down its own gradient. The energy comes not from ATP directly but from the Na⁺ gradient the Na⁺/K⁺ pump built — hence \"secondary\".",
      elements: t4,
    },
  ],
};

/* ══ GPCR – cAMP – PKA SIGNALLING (Lehninger 8e ch. 12; Alberts 7e ch. 15) ══ */
const GY2 = 110;
const gpcr = (x: number, active: boolean) =>
  path("gpcr", `M ${x - 30} ${GY2 - 22} ` + [0, 1, 2, 3, 4, 5, 6].map((i) => `L ${x - 30 + i * 10} ${i % 2 ? GY2 - 22 : GY2 + 22} L ${x - 25 + i * 10} ${i % 2 ? GY2 + 22 : GY2 - 22}`).join(" "), { stroke: active ? "#7c3aed" : "#a78bfa", strokeWidth: 5 });
const ligand = (x: number, y: number) => path("lig", poly([[x, y - 9], [x + 9, y], [x, y + 9], [x - 9, y]]), { color: "#f43f5e", stroke: "#9f1239", strokeWidth: 1.5 });
const gProtein = (ax: number, ay: number, bx: number, gtp: boolean): El[] => [
  ellipse("ga", ax, ay, 18, 14, gtp ? "#fcd34d" : "#fde68a", { stroke: "#b45309", strokeWidth: 1.8 }),
  text("ga_t", ax, ay + 6, gtp ? "GTP" : "GDP", gtp ? "GTP" : "GDP", { ltr: true, fontSize: 16.5, weight: 700, halo: false, textColor: "#78350f" }),
  ellipse("gb", bx, GY2 + 32, 13, 11, "#e9d5ff", { stroke: "#7e22ce", strokeWidth: 1.5 }),
  ellipse("gg", bx + 16, GY2 + 24, 7, 6, "#f5d0fe", { stroke: "#a21caf", strokeWidth: 1.2 }),
];
const ac = (on: boolean) => path("ac", `M 236 ${GY2 - 16} L 264 ${GY2 - 16} L 264 ${GY2 + 18} C 280 ${GY2 + 22} 284 ${GY2 + 46} 262 ${GY2 + 50} L 238 ${GY2 + 50} C 216 ${GY2 + 46} 220 ${GY2 + 22} 236 ${GY2 + 18} Z`, { color: on ? "#a7f3d0" : "#d1fae5", stroke: "#047857", strokeWidth: 1.8 });
const pka = (active: boolean): El[] => [
  rect("r1", 290, 222, 26, 16, "#cbd5e1", { rx: 4, stroke: "#475569", strokeWidth: 1.2 }),
  rect("r2", 290, 240, 26, 16, "#cbd5e1", { rx: 4, stroke: "#475569", strokeWidth: 1.2 }),
  ellipse("c1", active ? 360 : 330, active ? 200 : 230, 14, 10, "#93c5fd", { stroke: "#1d4ed8", strokeWidth: 1.5 }),
  ellipse("c2", active ? 368 : 330, active ? 262 : 250, 14, 10, "#93c5fd", { stroke: "#1d4ed8", strokeWidth: 1.5 }),
];
const CAMP: Pt[] = [[230, 196], [252, 206], [270, 188], [246, 180], [280, 212], [262, 226]];
const gBase = (): El[] => [...bilayer("mem", 0, 400, GY2, { th: 26 }), text("out", 392, 30, "outside", "חוץ התא", { anchor: "end", weight: 700, textColor: C.muted })];
const g1: El[] = [
  ...gBase(), gpcr(110, false), ligand(110, 52), ...gProtein(96, 150, 128, false), ac(false), ...pka(false),
  arrow("lig_in", 110, 64, 110, 82, "#9f1239", 2),
  label("l_h", 150, 44, "Hormone (e.g. adrenaline)", "הורמון (למשל אדרנלין)", [118, 52], { anchor: "start", shortHe: "הורמון", short: "Hormone" }),
  label("l_r", 14, 200, "GPCR: 7 membrane helices", "GPCR: שבעה סלילים", [80, 120], { anchor: "start", shortHe: "GPCR", short: "GPCR" }),
  label("l_g", 14, 270, "G protein αβγ (GDP)", "חלבון G ‏αβγ (GDP)", [96, 158], { anchor: "start", shortHe: "חלבון G", short: "G protein" }),
];
const g2: El[] = [
  ...gBase(), gpcr(110, true), ligand(110, 80), ...gProtein(180, 146, 118, true), ac(false), ...pka(false),
  arrow("gmove", 130, 158, 160, 150, "#b45309", 2),
  label("l_ex", 170, 290, "GDP → GTP: Gα leaves βγ", "Gα קושר GTP ונפרד", [180, 158], { anchor: "start", shortHe: "Gα פעיל", short: "Gα active" }),
  label("l_ra", 14, 44, "Receptor changes shape", "הקולטן משנה צורה", [104, 100], { anchor: "start" }),
];
const g3: El[] = [
  ...gBase(), gpcr(110, true), ligand(110, 80), ...gProtein(218, 150, 118, true), ac(true), ...pka(false),
  ...CAMP.map(([x, y], i) => circle(`cmp${i}`, x, y, 5, "#0ea5e9", { stroke: "#fff", strokeWidth: 1 })),
  label("l_ac", 290, 44, "Adenylyl cyclase", "אדנילט ציקלאז", [262, 110], { anchor: "start" }),
  label("l_camp", 14, 250, "ATP → cAMP (second messenger)", "cAMP נוצר מ-ATP (שליח שני)", [246, 196], { anchor: "start", shortHe: "cAMP", short: "cAMP" }),
];
const g4: El[] = [
  ...gBase(), gpcr(110, true), ligand(110, 80), ...gProtein(218, 150, 118, true), ac(true), ...pka(true),
  ...CAMP.map(([x, y], i) => circle(`cmp${i}`, i < 4 ? 294 + (i % 2) * 18 : x, i < 4 ? 216 + Math.floor(i / 2) * 44 : y, 5, "#0ea5e9", { stroke: "#fff", strokeWidth: 1 })),
  ...[[372, 176], [382, 244]].flatMap(([x, y], i) => [circle(`ph${i}`, x, y, 7, "#f97316", { stroke: "#fff", strokeWidth: 1 }), text(`ph${i}_t`, x, y + 5, "P", "P", { ltr: true, weight: 800, fontSize: 16.5, halo: false, textColor: "#fff" })]),
  label("l_pka", 14, 250, "cAMP frees PKA catalytic subunits", "cAMP משחרר את יחידות PKA הקטליטיות", [300, 230], { anchor: "start", shortHe: "PKA מופעל", short: "PKA active" }),
  label("l_ph", 250, 44, "Target proteins phosphorylated", "חלבוני מטרה מזורחנים", [372, 176], { anchor: "start", shortHe: "זרחון", short: "Phosphorylation" }),
];
const g5: El[] = [
  ...gBase(), gpcr(110, false), ...gProtein(96, 150, 128, false), ac(false), ...pka(false),
  ligand(60, 40),
  ...CAMP.slice(0, 2).map(([x, y], i) => circle(`cmp${i}`, x + 60, y + 50, 5, "#94a3b8")),
  path("pde", smooth([[150, 240], [166, 228], [186, 236], [184, 256], [160, 258]], true), { color: "#fecaca", stroke: "#b91c1c", strokeWidth: 1.8 }),
  label("l_gtp", 14, 200, "Gα hydrolyses GTP → GDP", "Gα מפרק GTP ל-GDP", [96, 150], { anchor: "start", shortHe: "GTP → GDP", short: "GTP → GDP" }),
  label("l_pde", 14, 286, "Phosphodiesterase: cAMP → AMP", "פוספודיאסטראז מפרק cAMP", [166, 246], { anchor: "start", shortHe: "פוספודיאסטראז", short: "PDE" }),
  label("l_off", 150, 44, "Hormone leaves", "ההורמון מתנתק", [68, 40], { anchor: "start" }),
];
export const gpcrSignaling: ProcessScene = {
  slug: "gpcr-camp-signaling",
  meta: {
    topic: "cell-biology", subtopic: "cell-biology-cell-cell-interactions-and-signaling-1780821343251",
    nameHe: "העברת אותות: GPCR, cAMP ו-PKA", nameEn: "Signalling: GPCR, cAMP and PKA",
    descHe: "הורמון נקשר לקולטן מצומד חלבון G, אדנילט ציקלאז מייצר cAMP, PKA מזרחן חלבוני מטרה — וסיום האות",
    descEn: "A hormone binds a G-protein-coupled receptor, adenylyl cyclase makes cAMP, PKA phosphorylates targets — and the signal is switched off",
    source: "Lehninger 8e ch. 12; Alberts 7e ch. 15; Berne & Levy 8e ch. 3",
  },
  legend: [
    { color: "#f43f5e", he: "הורמון (ליגנד)", en: "Hormone (ligand)", swatch: "dot" },
    { color: "#7c3aed", he: "קולטן GPCR", en: "GPCR", swatch: "line" },
    { color: "#b45309", he: "חלבון G ‏(α, β, γ)", en: "G protein (α, β, γ)", swatch: "ring" },
    { color: "#047857", he: "אדנילט ציקלאז", en: "Adenylyl cyclase", swatch: "ring" },
    { color: "#0ea5e9", he: "cAMP", en: "cAMP", swatch: "dot" },
    { color: "#1d4ed8", he: "PKA (יחידות קטליטיות)", en: "PKA (catalytic subunits)", swatch: "ring" },
  ],
  steps: [
    {
      titleHe: "הורמון נקשר לקולטן", titleEn: "A Hormone Binds the Receptor",
      descHe: "הורמון שאינו חודר לתא, כמו אדרנלין, נקשר לקולטן מצומד חלבון G (GPCR) — חלבון שחוצה את הממברנה 7 פעמים. בצד הציטוזולי ממתין חלבון G תלת-יחידתי (α, β, γ) במצב לא פעיל, כשיחידת α קשורה ל-GDP.",
      descEn: "A hormone that cannot enter the cell, such as adrenaline, binds a G-protein-coupled receptor (GPCR) — a protein that crosses the membrane 7 times. On the cytosolic side a trimeric G protein (α, β, γ) waits in its inactive state, with α bound to GDP.",
      elements: g1,
    },
    {
      titleHe: "הפעלת חלבון G", titleEn: "Activating the G Protein",
      descHe: "הקישור משנה את צורת הקולטן, והוא פועל כגורם החלפה: יחידת α משחררת GDP וקושרת GTP. Gα–GTP נפרדת מ-βγ ונעה לאורך הממברנה אל המטרה שלה.",
      descEn: "Binding changes the receptor's shape, and it acts as an exchange factor: the α subunit releases GDP and binds GTP. Gα–GTP separates from βγ and moves along the membrane to its target.",
      elements: g2,
    },
    {
      titleHe: "cAMP — שליח שני", titleEn: "cAMP — a Second Messenger",
      descHe: "Gαs–GTP מפעילה את האנזים אדנילט ציקלאז, שהופך ATP ל-cAMP (AMP מעגלי). כל קולטן מפעיל מולקולות G רבות, וכל ציקלאז מייצר מולקולות cAMP רבות — האות מוגבר מאוד.",
      descEn: "Gαs–GTP activates adenylyl cyclase, which converts ATP to cAMP (cyclic AMP). Each receptor activates many G proteins and each cyclase makes many cAMP molecules — the signal is strongly amplified.",
      elements: g3,
    },
    {
      titleHe: "PKA מזרחן חלבוני מטרה", titleEn: "PKA Phosphorylates Targets",
      descHe: "cAMP נקשר ליחידות הבקרה של חלבון קינאז A (PKA), והיחידות הקטליטיות משתחררות ופעילות. הן מזרחנות חלבוני מטרה — למשל בכבד אנזימים שמפרקים גליקוגן — והתגובה התאית מתרחשת.",
      descEn: "cAMP binds the regulatory subunits of protein kinase A (PKA), releasing the active catalytic subunits. They phosphorylate target proteins — in liver, for example, enzymes that break down glycogen — producing the cell's response.",
      elements: g4,
    },
    {
      titleHe: "כיבוי האות", titleEn: "Switching the Signal Off",
      descHe: "האות קצר מועד: Gα מפרקת בעצמה את ה-GTP ל-GDP וחוזרת להתחבר ל-βγ, פוספודיאסטראז הופך cAMP ל-AMP, וההורמון מתנתק מהקולטן. בלי הורמון חדש המערכת חוזרת למנוחה.",
      descEn: "The signal is short-lived: Gα hydrolyses its own GTP to GDP and rejoins βγ, phosphodiesterase turns cAMP into AMP, and the hormone leaves the receptor. Without new hormone the system returns to rest.",
      elements: g5,
    },
  ],
};

/* ══ APOPTOSIS (Alberts 7e ch. 18) ═══════════════════════════════════ */
const cellOutline = (bleb: number, shrink = 0) => {
  const pts: Pt[] = [];
  for (let i = 0; i < 24; i++) {
    const a = (2 * Math.PI * i) / 24, r = 118 - shrink + (i % 2 ? bleb : 0);
    pts.push([180 + r * 1.25 * Math.cos(a), 160 + r * 0.95 * Math.sin(a)]);
  }
  return path("cell", smooth(pts, true, 0.5), { color: "#f0fdf4", stroke: "#16a34a", strokeWidth: 2.5 });
};
const mito = (cx: number, cy: number, o: Partial<El> = {}): El[] => [
  ellipse("mt", cx, cy, 46, 26, "#fed7aa", { stroke: "#c2410c", strokeWidth: 2, ...o }),
  path("mt_c", `M ${cx - 32} ${cy} q 8 -14 16 0 q 8 14 16 0 q 8 -14 16 0 q 8 14 16 0`, { stroke: "#ea580c", strokeWidth: 1.8, ...o }),
];
const nucleus = (frag: boolean): El[] => frag
  ? [[-18, -10], [8, -16], [16, 8], [-10, 14]].map(([dx, dy], i) => circle(`nf${i}`, 110 + dx, 170 + dy, 11, "#6366f1", { stroke: "#3730a3", strokeWidth: 1.5 }))
  : [circle("nf0", 110, 170, 40, "#e0e7ff", { stroke: "#4338ca", strokeWidth: 2 }), circle("nf1", 110, 170, 0.1, "#6366f1"), circle("nf2", 110, 170, 0.1, "#6366f1"), circle("nf3", 110, 170, 0.1, "#6366f1")];
const casp = (id: string, x: number, y: number, color: string) => path(id, `M ${x - 10} ${y - 8} L ${x + 10} ${y + 8} M ${x - 10} ${y + 8} L ${x + 10} ${y - 8}`, { stroke: color, strokeWidth: 3.5 });
const CYTC: Pt[] = [[244, 118], [262, 110], [282, 118], [300, 128]];
const a1: El[] = [
  cellOutline(0), ...nucleus(false), ...mito(270, 160),
  ...[[238, 144], [298, 176]].map(([x, y], i) => circle(`bcl${i}`, x, y, 5, "#16a34a", { stroke: "#fff", strokeWidth: 1 })),
  label("l_mt", 280, 44, "Mitochondrion", "מיטוכונדריה", [280, 140], { anchor: "start" }),
  label("l_bcl", 250, 290, "Bcl-2 keeps it intact", "Bcl-2 שומר על שלמותה", [298, 176], { anchor: "start", shortHe: "Bcl-2", short: "Bcl-2" }),
  label("l_nuc", 14, 40, "Nucleus", "גרעין", [100, 140], { anchor: "start" }),
];
const a2: El[] = [
  cellOutline(0), ...nucleus(false), ...mito(270, 160),
  ...[[248, 136], [290, 136]].map(([x, y], i) => rect(`bax${i}`, x - 5, y - 6, 10, 12, "#dc2626", { rx: 2 })),
  ...CYTC.map(([x, y], i) => circle(`cc${i}`, x, y, 4.5, "#e11d48", { stroke: "#fff", strokeWidth: 1 })),
  path("dmg", "M 100 150 L 108 162 L 100 166 L 112 184", { stroke: "#eab308", strokeWidth: 3 }),
  label("l_dmg", 14, 40, "DNA damage → p53", "נזק ל-DNA מפעיל p53", [104, 162], { anchor: "start" }),
  label("l_bax", 150, 290, "Bax/Bak pores", "נקבוביות Bax/Bak", [248, 136], { anchor: "start" }),
  label("l_cc", 280, 44, "Cytochrome c released", "ציטוכרום c משתחרר", [282, 118], { anchor: "start", shortHe: "ציטוכרום c", short: "Cytochrome c" }),
];
const wheel = (cx: number, cy: number): El[] => [
  ...[0, 1, 2, 3, 4, 5, 6].map((i) => { const a = (i * 2 * Math.PI) / 7; return line(`sp${i}`, cx, cy, cx + 20 * Math.cos(a), cy + 20 * Math.sin(a), "#0f766e", 3); }),
  circle("hub", cx, cy, 7, "#14b8a6", { stroke: "#0f766e", strokeWidth: 1.5 }),
];
const a3: El[] = [
  cellOutline(0), ...nucleus(false), ...mito(270, 160, { opacity: 0.6 }),
  ...CYTC.map(([x, y], i) => circle(`cc${i}`, 200 + (i % 2) * 20, 104 + Math.floor(i / 2) * 14, 4.5, "#e11d48", { stroke: "#fff", strokeWidth: 1 })),
  ...wheel(214, 150),
  casp("c9", 214, 200, "#7c3aed"), casp("c3a", 180, 232, "#dc2626"), casp("c3b", 246, 238, "#dc2626"),
  arrow("c9to3", 214, 212, 196, 226, C.line, 1.8),
  label("l_apo", 250, 44, "Apoptosome (Apaf-1 + cyt c)", "אפופטוזום (Apaf-1 + ציטוכרום c)", [230, 142], { anchor: "start", shortHe: "אפופטוזום", short: "Apoptosome" }),
  label("l_c9", 14, 290, "Caspase-9 → caspase-3", "קספאז 9 מפעיל קספאז 3", [180, 232], { anchor: "start" }),
];
const a4: El[] = [
  cellOutline(0), ...nucleus(false), ...mito(270, 180, { opacity: 0.6 }),
  path("tc", smooth([[300, 10], [360, 12], [392, 40], [376, 58], [320, 56]], true), { color: "#e0f2fe", stroke: "#0369a1", strokeWidth: 2 }),
  path("fasl", "M 340 56 L 340 70", { stroke: "#0369a1", strokeWidth: 4 }),
  path("fas", "M 336 72 L 336 96 M 344 72 L 344 96", { stroke: "#be185d", strokeWidth: 4 }),
  casp("c8", 330, 120, "#db2777"), casp("c3a", 290, 118, "#dc2626"), casp("c3b", 270, 96, "#dc2626"),
  arrow("c8to3", 322, 120, 302, 120, C.line, 1.8),
  label("l_tc", 60, 40, "Killer lymphocyte: Fas ligand", "לימפוציט הורג: ליגנד Fas", [340, 58], { anchor: "start", shortHe: "ליגנד Fas", short: "Fas ligand" }),
  label("l_fas", 14, 290, "Death receptor Fas → caspase-8", "קולטן Fas מפעיל קספאז 8", [336, 94], { anchor: "start", shortHe: "Fas מפעיל קספאז 8", short: "Fas → casp-8" }),
];
const a5: El[] = [
  cellOutline(10, 20), ...nucleus(true), ...mito(262, 170, { opacity: 0.4 }),
  casp("c3a", 180, 150, "#dc2626"), casp("c3b", 230, 210, "#dc2626"),
  ...[[82, 60], [300, 250]].map(([x, y], i) => circle(`bod${i}`, x, y, 14, "#dcfce7", { stroke: "#16a34a", strokeWidth: 2 })),
  label("l_frag", 14, 290, "Chromatin condenses, DNA fragments", "הכרומטין מתעבה וה-DNA נחתך", [110, 186], { anchor: "start", shortHe: "ה-DNA נחתך", short: "DNA cut" }),
  label("l_bleb", 250, 44, "Blebs → apoptotic bodies", "בועיות וגופיפים אפופטוטיים", [300, 250], { anchor: "start", shortHe: "גופיפים", short: "Bodies" }),
];
export const apoptosis: ProcessScene = {
  slug: "apoptosis",
  meta: {
    topic: "cell-biology", subtopic: "cell-biology-cellular-stress-response-and-apoptosis-1780821344151",
    nameHe: "אפופטוזיס — מוות תאי מתוכנת", nameEn: "Apoptosis — Programmed Cell Death",
    descHe: "המסלול הפנימי (מיטוכונדריה, ציטוכרום c, אפופטוזום) והחיצוני (Fas), קספאזות והפירוק המסודר של התא",
    descEn: "The intrinsic (mitochondria, cytochrome c, apoptosome) and extrinsic (Fas) pathways, caspases and the orderly dismantling of the cell",
    source: "Alberts 7e ch. 18",
  },
  legend: [
    { color: "#c2410c", he: "מיטוכונדריה", en: "Mitochondrion", swatch: "ring" },
    { color: "#e11d48", he: "ציטוכרום c", en: "Cytochrome c", swatch: "dot" },
    { color: "#0f766e", he: "אפופטוזום", en: "Apoptosome", swatch: "ring" },
    { color: "#dc2626", he: "קספאזות מבצעות", en: "Executioner caspases", swatch: "line" },
    { color: "#16a34a", he: "Bcl-2 / קרום התא", en: "Bcl-2 / plasma membrane", swatch: "dot" },
  ],
  steps: [
    {
      titleHe: "תא בריא", titleEn: "A Healthy Cell",
      descHe: "אפופטוזיס הוא מוות תאי מתוכנת ומבוקר, שמסלק תאים מיותרים או פגועים בלי לגרום לדלקת. בתא בריא חלבונים ממשפחת Bcl-2 שומרים על שלמות הממברנה החיצונית של המיטוכונדריה, וקספאזות — אנזימי ההרס — נמצאות כקדם-אנזימים לא פעילים.",
      descEn: "Apoptosis is programmed, controlled cell death that removes unwanted or damaged cells without causing inflammation. In a healthy cell Bcl-2 family proteins keep the outer mitochondrial membrane intact, and caspases — the demolition enzymes — sit as inactive precursors.",
      elements: a1,
    },
    {
      titleHe: "המסלול הפנימי: ציטוכרום c משתחרר", titleEn: "Intrinsic Pathway: Cytochrome c Is Released",
      descHe: "נזק ל-DNA, מחסור בגורמי גדילה או עקה מפעילים חלבונים כמו p53. חלבוני Bax ו-Bak מתקבצים בממברנה החיצונית של המיטוכונדריה ויוצרים בה נקבוביות, וציטוכרום c — חלבון משרשרת הנשימה — יוצא לציטוזול.",
      descEn: "DNA damage, lack of growth factors or stress activate proteins such as p53. Bax and Bak gather in the outer mitochondrial membrane and form pores, and cytochrome c — a respiratory-chain protein — escapes into the cytosol.",
      elements: a2,
    },
    {
      titleHe: "האפופטוזום ומפל הקספאזות", titleEn: "The Apoptosome and the Caspase Cascade",
      descHe: "ציטוכרום c נקשר ל-Apaf-1, ושבע יחידות מתאספות למבנה דמוי גלגל — האפופטוזום — שמפעיל את קספאז 9 (קספאז יוזם). קספאז 9 חותך ומפעיל קספאזות מבצעות כמו קספאז 3, וכל אחת מפעילה רבות נוספות.",
      descEn: "Cytochrome c binds Apaf-1, and seven units assemble into a wheel-shaped apoptosome that activates caspase-9 (an initiator caspase). Caspase-9 cleaves and activates executioner caspases such as caspase-3, each activating many more.",
      elements: a3,
    },
    {
      titleHe: "המסלול החיצוני: קולטני מוות", titleEn: "Extrinsic Pathway: Death Receptors",
      descHe: "לימפוציט T ציטוטוקסי או תא NK מציג ליגנד Fas, שנקשר לקולטן המוות Fas על פני התא. חלבוני מתאם מתקבצים בזנב התוך-תאי של הקולטן ומפעילים את קספאז 8 — וגם הוא מפעיל ישירות את קספאז 3.",
      descEn: "A cytotoxic T cell or NK cell displays Fas ligand, which binds the death receptor Fas on the target cell. Adaptor proteins gather on the receptor's cytoplasmic tail and activate caspase-8 — which in turn directly activates caspase-3.",
      elements: a4,
    },
    {
      titleHe: "פירוק מסודר של התא", titleEn: "Orderly Dismantling",
      descHe: "הקספאזות המבצעות חותכות מאות חלבונים: הכרומטין מתעבה, ה-DNA נחתך למקטעים, השלד התאי מתפרק והממברנה יוצרת בועיות. התא מתכווץ ומתפרק לגופיפים אפופטוטיים עטופי ממברנה, שמציגים פוספטידילסרין — אות \"אכול אותי\" למקרופאגים — ונבלעים בלי דלקת.",
      descEn: "Executioner caspases cut hundreds of proteins: chromatin condenses, DNA is cut into fragments, the cytoskeleton collapses and the membrane blebs. The cell shrinks into membrane-bound apoptotic bodies that display phosphatidylserine — an 'eat me' signal for macrophages — and are engulfed without inflammation.",
      elements: a5,
    },
  ],
};

/* ══ VIRAL LIFE CYCLE — enveloped RNA virus (Campbell 12e ch. 19; Alberts 7e ch. 23) ══ */
const VM = 96;
const virion = (p: string, cx: number, cy: number, sc = 1, o: Partial<El> = {}): El[] => [
  circle(`${p}_env`, cx, cy, 20 * sc, "#fef3c7", { stroke: "#d97706", strokeWidth: 2, ...o }),
  ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => { const a = (i * Math.PI) / 4, r = 20 * sc; return line(`${p}_sp${i}`, cx + r * Math.cos(a), cy + r * Math.sin(a), cx + (r + 7 * sc) * Math.cos(a), cy + (r + 7 * sc) * Math.sin(a), "#b45309", 2.4, o); }),
  path(`${p}_cap`, ring(cx, cy, 12 * sc, 6), { color: "#bfdbfe", stroke: "#1d4ed8", strokeWidth: 1.5, ...o }),
  path(`${p}_rna`, smooth(wave(cx - 7 * sc, cx + 7 * sc, cy, 2.5 * sc, 5)), { stroke: "#dc2626", strokeWidth: 2, ...o }),
];
const hostBase = (caption = true): El[] => [
  ...bilayer("pm", 0, 400, VM, { th: 16 }),
  path("er", "M 240 250 C 270 230 320 236 350 248 M 236 266 C 272 246 322 252 356 264 M 232 282 C 270 262 326 268 360 280", { stroke: "#a16207", strokeWidth: 3 }),
  path("golgi", "M 300 170 q 30 -10 60 0 M 304 182 q 26 -8 52 0 M 308 194 q 22 -6 44 0", { stroke: "#059669", strokeWidth: 3 }),
  text("cyto", 8, 290, "host cytoplasm", "ציטופלזמה של התא המאכסן", { anchor: "start", textColor: C.muted, weight: 700, short: "host cell", shortHe: "תא מאכסן", opacity: caption ? 1 : 0 }),
];
const v1: El[] = [
  ...hostBase(), ...virion("v", 150, 50),
  ...[120, 180, 250].map((x, i) => path(`rec${i}`, `M ${x} ${VM - 8} L ${x} ${VM - 20} M ${x - 5} ${VM - 22} L ${x + 5} ${VM - 22}`, { stroke: "#0f766e", strokeWidth: 3 })),
  label("l_sp", 200, 36, "Viral glycoprotein spikes", "זיזי גליקופרוטאין נגיפיים", [168, 36], { anchor: "start", shortHe: "זיזים נגיפיים", short: "Spikes" }),
  label("l_rec", 250, 150, "Host receptor", "קולטן בתא המאכסן", [180, 76], { anchor: "start" }),
  label("l_env", 14, 150, "Envelope + capsid + RNA", "מעטפת, קפסיד ו-RNA", [140, 56], { anchor: "start", shortHe: "מעטפת וקפסיד", short: "Envelope + capsid" }),
];
const v2: El[] = [
  ...hostBase(),
  path("v_env", "M 120 96 C 130 80 170 80 180 96", { stroke: "#d97706", strokeWidth: 2 }),
  path("v_cap", ring(150, 140, 12, 6), { color: "#bfdbfe", stroke: "#1d4ed8", strokeWidth: 1.5, fillOpacity: 0.5 }),
  path("v_rna", smooth(wave(150, 214, 170, 3, 9)), { stroke: "#dc2626", strokeWidth: 2.5 }),
  label("l_fus", 200, 40, "Envelope fuses with membrane", "המעטפת מתמזגת עם הממברנה", [150, 88], { anchor: "start", shortHe: "היתוך", short: "Fusion" }),
  label("l_unc", 14, 230, "Uncoating releases the RNA", "הקפסיד מתפרק וה-RNA משתחרר", [190, 170], { anchor: "start", shortHe: "שחרור ה-RNA", short: "Uncoating" }),
];
const RIBO: Pt[] = [[110, 190], [140, 206], [170, 186]];
const v3: El[] = [
  ...hostBase(false),
  path("v_rna", smooth(wave(60, 124, 140, 3, 9)), { stroke: "#dc2626", strokeWidth: 2.5 }),
  path("v_rna2", smooth(wave(60, 124, 156, 3, 9)), { stroke: "#f472b6", strokeWidth: 2.5 }),
  ellipse("rdrp", 92, 148, 14, 10, "#fde68a", { stroke: "#b45309", strokeWidth: 1.5 }),
  ...RIBO.map(([x, y], i) => ellipse(`rib${i}`, x, y, 8, 6, "#93c5fd", { stroke: "#1d4ed8", strokeWidth: 1.2 })),
  ...[[120, 222], [150, 232], [184, 214], [100, 236]].map(([x, y], i) => path(`cp${i}`, ring(x, y, 5, 6), { color: "#bfdbfe", stroke: "#1d4ed8", strokeWidth: 1 })),
  ...[[262, 240], [300, 244], [336, 250]].map(([x, y], i) => line(`gp${i}`, x, y, x, y - 10, "#b45309", 2.4)),
  arrow("ves", 330, 160, 344, 110, "#059669", 2),
  label("l_rdrp", 14, 44, "Viral RNA polymerase copies the genome", "פולימראז RNA נגיפי משכפל את הגנום", [92, 140], { anchor: "start", shortHe: "שכפול הגנום", short: "Genome copied" }),
  label("l_rib", 14, 280, "Host ribosomes make capsid proteins", "ריבוזומי המאכסן מייצרים חלבוני קפסיד", [140, 206], { anchor: "start", shortHe: "חלבוני קפסיד", short: "Capsid proteins" }),
  label("l_er", 250, 150, "ER → Golgi: glycoproteins", "ER ← גולג'י: גליקופרוטאינים", [300, 238], { anchor: "start", shortHe: "גליקופרוטאינים", short: "Glycoproteins" }),
];
const v4: El[] = [
  ...hostBase(false),
  ...[80, 200].flatMap((x, k) => [
    path(`nc${k}`, ring(x, 132, 12, 6), { color: "#bfdbfe", stroke: "#1d4ed8", strokeWidth: 1.5 }),
    path(`nr${k}`, smooth(wave(x - 7, x + 7, 132, 2.5, 5)), { stroke: "#dc2626", strokeWidth: 2 }),
    ...[-14, 0, 14].map((dx, i) => line(`sk${k}_${i}`, x + dx, VM - 8, x + dx, VM - 18, "#b45309", 2.4)),
  ]),
  label("l_asm", 14, 250, "Capsids assemble with new genomes", "קפסידים מתאספים סביב גנומים חדשים", [80, 140], { anchor: "start", shortHe: "הרכבה", short: "Assembly" }),
  label("l_gpm", 230, 40, "Viral glycoproteins in the membrane", "גליקופרוטאינים נגיפיים בממברנה", [214, 82], { anchor: "start", shortHe: "גליקופרוטאינים", short: "Glycoproteins" }),
];
const v5: El[] = [
  ...hostBase(false),
  ...virion("b1", 80, 48), ...virion("b2", 200, 60, 0.9),
  path("bud", "M 300 96 C 300 60 350 60 350 96", { color: "#fef3c7", stroke: "#d97706", strokeWidth: 2 }),
  path("bud_cap", ring(325, 84, 10, 6), { color: "#bfdbfe", stroke: "#1d4ed8", strokeWidth: 1.5 }),
  label("l_bud", 14, 180, "Budding: the membrane becomes the envelope", "הנצה: ממברנת התא הופכת למעטפת", [325, 70], { anchor: "start", shortHe: "הנצה", short: "Budding" }),
  label("l_new", 14, 240, "New virions infect other cells", "נגיפים חדשים מדביקים תאים נוספים", [200, 60], { anchor: "start", shortHe: "נגיפים חדשים", short: "New virions" }),
];
export const viralLifeCycle: ProcessScene = {
  slug: "viral-life-cycle",
  meta: {
    topic: "microbiology", subtopic: "viruses",
    nameHe: "מחזור החיים של נגיף עטוף", nameEn: "Life Cycle of an Enveloped Virus",
    descHe: "היצמדות, חדירה והתפרקות הקפסיד, שכפול וסינתזה במנגנוני התא, הרכבה והנצה של נגיף RNA עטוף",
    descEn: "Attachment, entry and uncoating, replication and synthesis using host machinery, assembly and budding of an enveloped RNA virus",
    source: "Campbell 12e ch. 19; Alberts 7e ch. 23",
  },
  legend: [
    { color: "#d97706", he: "מעטפת הנגיף / ממברנת התא", en: "Viral envelope / host membrane", swatch: "ring" },
    { color: "#b45309", he: "גליקופרוטאינים נגיפיים (זיזים)", en: "Viral glycoproteins (spikes)", swatch: "line" },
    { color: "#1d4ed8", he: "קפסיד / ריבוזומים", en: "Capsid / ribosomes", swatch: "ring" },
    { color: "#dc2626", he: "גנום RNA נגיפי", en: "Viral RNA genome", swatch: "line" },
    { color: "#0f766e", he: "קולטן בתא המאכסן", en: "Host receptor", swatch: "line" },
  ],
  steps: [
    {
      titleHe: "היצמדות", titleEn: "Attachment",
      descHe: "נגיף עטוף בנוי מגנום (כאן RNA), קפסיד חלבוני ומעטפת ממברנית עם זיזי גליקופרוטאין. הזיזים נקשרים בספציפיות לקולטנים על פני התא המאכסן — ולכן כל נגיף מדביק רק מינים וסוגי תאים מסוימים (טווח מאכסנים).",
      descEn: "An enveloped virus has a genome (here RNA), a protein capsid and a membrane envelope with glycoprotein spikes. The spikes bind specifically to receptors on the host cell — which is why each virus infects only certain species and cell types (host range).",
      elements: v1,
    },
    {
      titleHe: "חדירה והתפרקות הקפסיד", titleEn: "Entry and Uncoating",
      descHe: "מעטפת הנגיף מתמזגת עם ממברנת התא (או שהנגיף נבלע באנדוציטוזה), הקפסיד נכנס לציטופלזמה ומתפרק, והגנום הנגיפי משתחרר.",
      descEn: "The viral envelope fuses with the host membrane (or the virus is taken in by endocytosis), the capsid enters the cytoplasm and comes apart, releasing the viral genome.",
      elements: v2,
    },
    {
      titleHe: "שכפול וסינתזת חלבונים", titleEn: "Replication and Protein Synthesis",
      descHe: "פולימראז RNA תלוי-RNA — אנזים שהנגיף מקודד ושאין בתא — מכין עותקים משלימים ומהם גנומים חדשים ו-mRNA. ריבוזומים חופשיים של התא מייצרים חלבוני קפסיד, וריבוזומים על ה-ER מייצרים את הגליקופרוטאינים, שעוברים דרך הגולג'י ומגיעים בשלפוחיות לממברנת התא.",
      descEn: "An RNA-dependent RNA polymerase — an enzyme the virus encodes and the cell lacks — makes complementary copies, and from them new genomes and mRNA. The host's free ribosomes make capsid proteins, while ribosomes on the ER make the glycoproteins, which pass through the Golgi and reach the plasma membrane in vesicles.",
      elements: v3,
    },
    {
      titleHe: "הרכבה", titleEn: "Assembly",
      descHe: "חלבוני הקפסיד מתאספים סביב הגנומים החדשים ליצירת נוקלאוקפסידים, שנעים אל אזורי הממברנה שבהם הוחדרו הגליקופרוטאינים הנגיפיים.",
      descEn: "Capsid proteins assemble around the new genomes to form nucleocapsids, which move to membrane patches where the viral glycoproteins have been inserted.",
      elements: v4,
    },
    {
      titleHe: "הנצה ושחרור", titleEn: "Budding and Release",
      descHe: "הנוקלאוקפסיד דוחף את הממברנה החוצה ומתעטף בה — כך ממברנת התא, עם הגליקופרוטאינים הנגיפיים, הופכת למעטפת הנגיף. הנגיפים החדשים משתחררים ומדביקים תאים נוספים; בהנצה התא לא חייב להתפרק מיד.",
      descEn: "The nucleocapsid pushes the membrane outward and is wrapped by it — so the host membrane, studded with viral glycoproteins, becomes the viral envelope. New virions are released to infect other cells; budding need not destroy the cell at once.",
      elements: v5,
    },
  ],
};
