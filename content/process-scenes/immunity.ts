import { C, arrow, circle, ellipse, label, line, path, poly, rect, smooth, text, type El, type ProcessScene, type Pt } from "./kit";

// Innate and adaptive immunity (Campbell 12e ch. 43; Janeway's Immunobiology).
const f = (n: number) => Math.round(n * 10) / 10;

/* ── cells and molecules ─────────────────────────────────────────── */
const bacterium = (id: string, x: number, y: number, rot = 0, o: Partial<El> = {}): El[] => {
  const a = (rot * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
  const R = (dx: number, dy: number): Pt => [x + dx * c - dy * s, y + dx * s + dy * c];
  const body = smooth([R(-14, -6), R(0, -7), R(14, -6), R(17, 0), R(14, 6), R(0, 7), R(-14, 6), R(-17, 0)], true, 0.6);
  const [t1, t2, t3] = [R(17, 0), R(26, -5), R(34, 3)];
  return [
    path(id, body, { color: "#86efac", stroke: "#15803d", strokeWidth: 1.8, ...o }),
    path(`${id}_fl`, `M ${f(t1[0])} ${f(t1[1])} Q ${f(t2[0])} ${f(t2[1])} ${f(t3[0])} ${f(t3[1])}`, { stroke: "#15803d", strokeWidth: 1.5, ...o }),
  ];
};
// irregular blob with pseudopods (macrophage / dendritic cell)
const blob = (id: string, cx: number, cy: number, r: number, spikes: number, depth: number, fill: string, stroke: string, o: Partial<El> = {}) => {
  const pts: Pt[] = [];
  for (let i = 0; i < spikes * 2; i++) {
    const a = (Math.PI * i) / spikes, rr = i % 2 ? r * (1 - depth) : r;
    pts.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)]);
  }
  return path(id, smooth(pts, true, 0.7), { color: fill, stroke, strokeWidth: 2, ...o });
};
const macrophage = (id: string, cx: number, cy: number, r = 40): El[] => [
  blob(id, cx, cy, r, 7, 0.22, "#fde68a", "#b45309"),
  path(`${id}_n`, smooth([[cx - 14, cy - 4], [cx - 4, cy - 14], [cx + 12, cy - 8], [cx + 6, cy + 2], [cx + 12, cy + 12], [cx - 6, cy + 12]], true), { color: "#c2410c", fillOpacity: 0.55 }),
];
const neutrophil = (id: string, cx: number, cy: number, r = 24): El[] => [
  circle(id, cx, cy, r, "#fce7f3", { stroke: "#be185d", strokeWidth: 2 }),
  path(`${id}_n`, `M ${cx - 12} ${cy + 4} a 6 6 0 1 1 8 -8 a 6 6 0 1 1 8 0 a 6 6 0 1 1 8 8`, { stroke: "#9d174d", strokeWidth: 5 }),
  ...[[-10, 12], [4, 13], [14, -2], [-14, -10]].map(([dx, dy], i) => circle(`${id}_g${i}`, cx + dx, cy + dy, 2, "#db2777")),
];
const lymph = (id: string, cx: number, cy: number, r: number, fill: string, stroke: string, o: Partial<El> = {}): El[] => [
  circle(id, cx, cy, r, fill, { stroke, strokeWidth: 2, ...o }),
  circle(`${id}_n`, cx, cy + 2, r * 0.72, stroke, { fillOpacity: 0.35, ...o }),
];
const dendritic = (id: string, cx: number, cy: number, r = 46): El[] => [
  blob(id, cx, cy, r, 6, 0.5, "#e9d5ff", "#7e22ce"),
  circle(`${id}_n`, cx - 4, cy, r * 0.28, "#7e22ce", { fillOpacity: 0.45 }),
];
// antibody: Y shape (heavy chains) pointing up by default
const antibody = (id: string, x: number, y: number, rot = 0, color = "#2563eb", sc = 1): El => {
  const a = (rot * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
  const R = (dx: number, dy: number) => `${f(x + (dx * c - dy * s) * sc)} ${f(y + (dx * s + dy * c) * sc)}`;
  return path(id, `M ${R(0, 14)} L ${R(0, 0)} L ${R(-9, -11)} M ${R(0, 0)} L ${R(9, -11)}`, { stroke: color, strokeWidth: 3.2 });
};
// MHC class II cup holding a peptide (on the APC surface facing right)
const mhc = (id: string, x: number, y: number): El[] => [
  path(id, `M ${x} ${y - 10} L ${x + 12} ${y - 10} L ${x + 12} ${y - 4} L ${x + 4} ${y - 4} L ${x + 4} ${y + 4} L ${x + 12} ${y + 4} L ${x + 12} ${y + 10} L ${x} ${y + 10} Z`, { color: "#a855f7", stroke: "#6b21a8", strokeWidth: 1.2 }),
  rect(`${id}_pep`, x + 6, y - 3, 8, 6, "#dc2626", { rx: 1 }),
];
const tcr = (id: string, x: number, y: number): El => path(id, `M ${x} ${y - 9} L ${x - 10} ${y - 9} M ${x} ${y + 9} L ${x - 10} ${y + 9} M ${x - 10} ${y - 9} L ${x - 10} ${y - 3} M ${x - 10} ${y + 9} L ${x - 10} ${y + 3}`, { stroke: "#0369a1", strokeWidth: 3 });
const dots = (id: string, pts: Pt[], color: string): El[] => pts.map(([x, y], i) => circle(`${id}${i}`, x, y, 3, color));

/* ── INNATE ──────────────────────────────────────────────────────── */
// tissue: epithelium on top (y 64–92), connective tissue, capillary at the bottom
const epithelium = (gap: boolean): El[] =>
  [...Array(9)].flatMap((_, i) => {
    const x = 8 + i * 44;
    if (gap && (i === 4)) return [];
    return [rect(`ep${i}`, x, 64, 40, 28, "#fed7aa", { rx: 4, stroke: "#c2410c", strokeWidth: 1.4 }), circle(`ep${i}_n`, x + 20, 78, 5, "#c2410c", { fillOpacity: 0.6 })];
  });
const vessel = (wide: boolean): El[] => [
  rect("vess", 0, wide ? 244 : 252, 400, wide ? 56 : 44, "#fee2e2", { rx: 0, stroke: "#dc2626", strokeWidth: 2 }),
  ...[40, 110, 300, 360].map((x, i) => ellipse(`rbc${i}`, x, 274, 10, 5, "#ef4444", { stroke: "#b91c1c", strokeWidth: 1 })),
];

const i1: El[] = [
  ...vessel(false), ...epithelium(true),
  ...bacterium("b1", 196, 40, 20), ...bacterium("b2", 150, 30, -10), ...bacterium("b3", 208, 112, 70),
  label("l_skin", 250, 130, "Skin: physical barrier", "עור — מחסום פיזי", [300, 90], { anchor: "start", shortHe: "עור — מחסום", short: "Skin barrier" }),
  label("l_cut", 20, 150, "Wound lets microbes in", "פצע — חיידקים חודרים", [196, 90], { anchor: "start", shortHe: "פצע", short: "Wound" }),
  label("l_bac", 250, 30, "Bacteria", "חיידקים", [212, 38], { anchor: "start" }),
  text("l_vs", 200, 280, "capillary", "נימי דם", { textColor: "#b91c1c", halo: false }),
];
const i2: El[] = [
  ...vessel(false), ...epithelium(true),
  ...bacterium("b1", 176, 140, 10), ...bacterium("b2", 232, 176, -30), ...bacterium("b3", 204, 118, 70),
  ...macrophage("mac", 130, 190, 38),
  path("tlr", "M 162 170 L 170 164 M 166 167 L 174 172", { stroke: "#0f766e", strokeWidth: 3 }),
  ...dots("lps", [[176, 148], [168, 134], [186, 134]], "#0f766e"),
  label("l_mac", 14, 130, "Macrophage", "מקרופאג", [110, 180], { anchor: "start" }),
  label("l_tlr", 260, 130, "TLR (a PRR)", "קולטן TLR (PRR)", [170, 166], { anchor: "start" }),
  label("l_pamp", 250, 238, "PAMP (e.g. LPS)", "PAMP (למשל LPS)", [186, 148], { anchor: "start", shortHe: "PAMP", short: "PAMP" }),
];
const CYT: Pt[] = [[180, 208], [196, 222], [168, 232], [206, 200], [150, 240], [214, 236]];
const i3: El[] = [
  ...vessel(true), ...epithelium(true),
  ...bacterium("b1", 176, 140, 10), ...bacterium("b2", 232, 150, -30), ...bacterium("b3", 204, 118, 70),
  ...macrophage("mac", 120, 196, 38),
  ...dots("cy", CYT, "#7c3aed"),
  ...neutrophil("neu", 280, 232, 22),
  arrow("chemo", 270, 206, 244, 168, "#be185d", 2.4),
  label("l_cyt", 14, 130, "Cytokines & chemokines", "ציטוקינים וכימוקינים", [168, 232], { anchor: "start", shortHe: "ציטוקינים", short: "Cytokines" }),
  label("l_neu", 300, 150, "Neutrophil leaves the blood", "נויטרופיל יוצא מכלי הדם", [296, 222], { anchor: "start", shortHe: "נויטרופיל", short: "Neutrophil" }),
  text("l_vs", 200, 278, "vessel dilates", "כלי הדם מתרחב", { textColor: "#b91c1c", halo: false }),
];
const i4: El[] = [
  ...vessel(true), ...epithelium(true),
  ...bacterium("b2", 232, 150, -30), ...bacterium("b3", 204, 118, 70),
  ...macrophage("mac", 120, 196, 38),
  // neutrophil engulfing b1: pseudopods wrap it, a phagosome forms, lysosomes fuse
  circle("neu", 190, 168, 32, "#fce7f3", { stroke: "#be185d", strokeWidth: 2 }),
  path("neu_n", "M 176 184 a 6 6 0 1 1 8 -8 a 6 6 0 1 1 8 0 a 6 6 0 1 1 8 8", { stroke: "#9d174d", strokeWidth: 5 }),
  circle("phago", 184, 152, 13, "#fbcfe8", { stroke: "#9d174d", strokeWidth: 1.5 }),
  ...bacterium("b1", 184, 152, 10, { strokeWidth: 1.2 }),
  ...dots("lyso", [[204, 146], [200, 136]], "#6d28d9"),
  label("l_ph", 250, 60, "Phagosome", "פאגוזום", [186, 146], { anchor: "start" }),
  label("l_ly", 290, 110, "Lysosomes fuse", "ליזוזומים מתמזגים", [204, 146], { anchor: "start", shortHe: "ליזוזומים", short: "Lysosomes" }),
  label("l_pg", 14, 130, "Phagocytosis", "פאגוציטוזה", [160, 160], { anchor: "start" }),
];
const i5: El[] = [
  ...vessel(false), ...epithelium(false),
  ...macrophage("mac", 120, 196, 38),
  ...dendritic("dc", 230, 176, 40),
  ...dots("ag", [[222, 170], [238, 182]], "#dc2626"),
  path("lymv", "M 270 176 C 310 176 330 150 352 130", { stroke: "#16a34a", strokeWidth: 2.5, dash: "5 4", arrow: true }),
  path("ln", smooth([[344, 108], [372, 100], [392, 118], [388, 146], [364, 150], [354, 134]], true), { color: "#dcfce7", stroke: "#15803d", strokeWidth: 2 }),
  label("l_dc", 14, 130, "Dendritic cell carries antigen", "תא דנדריטי נושא אנטיגן", [214, 168], { anchor: "start", shortHe: "תא דנדריטי", short: "Dendritic cell" }),
  label("l_ln", 250, 44, "Lymph node → adaptive", "בלוטת לימפה ← חסינות נרכשת", [372, 104], { anchor: "start", shortHe: "בלוטת לימפה", short: "Lymph node" }),
  text("l_heal", 100, 44, "skin repaired", "העור נסגר", { textColor: "#c2410c" }),
];

export const innate: ProcessScene = {
  slug: "innate-immunity",
  meta: {
    topic: "immunology", subtopic: "innate-immunity",
    nameHe: "חיסוניות מולדת", nameEn: "Innate Immunity",
    descHe: "אנימציה: חיסוניות מולדת", descEn: "Animation: Innate Immunity",
    source: "Campbell 12e ch. 43; Janeway ch. 3",
  },
  legend: [
    { color: "#15803d", he: "חיידק", en: "Bacterium", swatch: "dot" },
    { color: "#b45309", he: "מקרופאג", en: "Macrophage", swatch: "ring" },
    { color: "#be185d", he: "נויטרופיל", en: "Neutrophil", swatch: "ring" },
    { color: "#7c3aed", he: "ציטוקינים", en: "Cytokines", swatch: "dot" },
    { color: "#7e22ce", he: "תא דנדריטי", en: "Dendritic cell", swatch: "ring" },
  ],
  steps: [
    {
      titleHe: "מחסומים — קו ההגנה הראשון", titleEn: "Barriers — the First Line of Defence",
      descHe: "העור והריריות הם מחסום פיזי וכימי (חומציות, ליזוזים, חיידקים ידידותיים). כשהמחסום נפגע — למשל בפצע — חיידקים חודרים לרקמה, ושם פוגשת אותם המערכת החיסונית המולדת: מהירה, זמינה תמיד ולא ספציפית לפתוגן מסוים.",
      descEn: "Skin and mucous membranes are physical and chemical barriers (acidity, lysozyme, friendly microbes). When the barrier is breached — for example by a wound — bacteria enter the tissue, where the innate immune system meets them: fast, always ready and not specific to one pathogen.",
      elements: i1,
    },
    {
      titleHe: "זיהוי: קולטנים לזיהוי דפוסים", titleEn: "Recognition by Pattern-Recognition Receptors",
      descHe: "מקרופאגים ברקמה מזהים את החיידקים בעזרת קולטנים לזיהוי דפוסים (PRRs), כמו קולטני Toll (TLR). הם נקשרים למבנים שמורים המשותפים לקבוצות פתוגנים ואינם קיימים בתאי הגוף (PAMPs) — למשל ליפופוליסכריד (LPS) של חיידקים גרם-שליליים או פלגלין.",
      descEn: "Tissue macrophages detect the bacteria through pattern-recognition receptors (PRRs) such as Toll-like receptors (TLRs). These bind conserved structures shared by groups of pathogens and absent from host cells (PAMPs) — for example the lipopolysaccharide (LPS) of Gram-negative bacteria, or flagellin.",
      elements: i2,
    },
    {
      titleHe: "דלקת וגיוס נויטרופילים", titleEn: "Inflammation and Neutrophil Recruitment",
      descHe: "המקרופאג המופעל מפריש ציטוקינים וכימוקינים. כלי הדם הסמוכים מתרחבים ונעשים חדירים יותר (אודם, חום, נפיחות), ונויטרופילים — התאים הראשונים המגיעים בכמות — נצמדים לדופן הנימים, יוצאים מהם לרקמה ונעים לעבר מקור הכימוקינים (כימוטקסיס).",
      descEn: "The activated macrophage secretes cytokines and chemokines. Nearby vessels dilate and become leaky (redness, heat, swelling), and neutrophils — the first cells to arrive in numbers — stick to the capillary wall, squeeze out into the tissue and move towards the chemokines (chemotaxis).",
      elements: i3,
    },
    {
      titleHe: "פאגוציטוזה", titleEn: "Phagocytosis",
      descHe: "הנויטרופיל עוטף את החיידק בשלוחות ובולע אותו לתוך פאגוזום. ליזוזומים מתמזגים עם הפאגוזום ויוצרים פאגוליזוזום, שבו אנזימים הידרוליטיים ורדיקלים חמצניים הורגים ומפרקים את החיידק. גם המקרופאגים בולעים חיידקים ושאריות תאים.",
      descEn: "The neutrophil wraps the bacterium in extensions and engulfs it into a phagosome. Lysosomes fuse with it to form a phagolysosome, where hydrolytic enzymes and reactive oxygen species kill and digest the bacterium. Macrophages also engulf bacteria and cell debris.",
      elements: i4,
    },
    {
      titleHe: "הקשר לחסינות הנרכשת", titleEn: "The Bridge to Adaptive Immunity",
      descHe: "תאים דנדריטיים בולעים חלקי חיידקים, נודדים בכלי הלימפה לבלוטת הלימפה ומציגים שם את האנטיגנים לתאי T — וכך מפעילים את החסינות הנרכשת, הספציפית. החסינות המולדת עצמה אינה יוצרת זיכרון: תגובתה זהה בכל הדבקה.",
      descEn: "Dendritic cells take up bacterial fragments, travel through lymphatic vessels to a lymph node and present the antigens to T cells there — switching on specific, adaptive immunity. Innate immunity itself forms no memory: it responds the same way to every infection.",
      elements: i5,
    },
  ],
};

/* ── ADAPTIVE ────────────────────────────────────────────────────── */
const tHelper = (id: string, cx: number, cy: number, r = 34, o: Partial<El> = {}) => lymph(id, cx, cy, r, "#e0f2fe", "#0369a1", o);
const bCell = (id: string, cx: number, cy: number, r = 34, o: Partial<El> = {}) => lymph(id, cx, cy, r, "#fef9c3", "#a16207", o);
const antigen = (id: string, x: number, y: number) => path(id, poly([[x, y - 7], [x + 7, y + 5], [x - 7, y + 5]]), { color: "#dc2626", stroke: "#7f1d1d", strokeWidth: 1 });

const a1: El[] = [
  ...dendritic("dc", 120, 150, 58),
  ...mhc("mhc", 176, 150),
  ...tHelper("th", 256, 150, 44),
  tcr("tcr", 212, 150),
  rect("cd4", 208, 166, 6, 14, "#0ea5e9", { rx: 2 }),
  label("l_dc", 14, 50, "Dendritic cell (APC)", "תא דנדריטי (APC)", [100, 118], { anchor: "start", shortHe: "תא דנדריטי", short: "APC" }),
  label("l_mhc", 60, 270, "MHC II + peptide", "MHC II + פפטיד", [186, 158], { anchor: "start" }),
  label("l_tcr", 240, 50, "TCR binds MHC–peptide", "TCR נקשר ל-MHC ופפטיד", [206, 142], { anchor: "start", shortHe: "TCR", short: "TCR" }),
  label("l_th", 250, 256, "Helper T (CD4)", "תא T עוזר (CD4)", [280, 180], { anchor: "start", shortHe: "תא T עוזר", short: "Helper T" }),
];
const CLONE: Pt[] = [[240, 90], [320, 110], [250, 200], [330, 200]];
const a2: El[] = [
  ...dendritic("dc", 90, 150, 50),
  ...mhc("mhc", 138, 150),
  ...tHelper("th", 180, 150, 34),
  tcr("tcr", 146, 150),
  ...CLONE.flatMap(([x, y], i) => tHelper(`tc${i}`, x, y, 28)),
  ...dots("il2", [[214, 128], [222, 150], [214, 172], [236, 142]], "#16a34a"),
  arrow("div", 208, 126, 226, 106, "#0369a1", 2), arrow("div2", 212, 170, 232, 188, "#0369a1", 2),
  label("l_il2", 14, 250, "IL-2 drives division", "IL-2 מעודד חלוקה", [222, 150], { anchor: "start", shortHe: "IL-2", short: "IL-2" }),
  label("l_cl", 270, 40, "Clone of identical T cells", "שבט תאי T זהים", [320, 90], { anchor: "start", shortHe: "שבט זהה", short: "Clone" }),
];
const a3: El[] = [
  ...bCell("bc", 120, 150, 44),
  antibody("bcr1", 120, 96, 0, "#a16207", 0.9), antibody("bcr2", 74, 132, -60, "#a16207", 0.9),
  antigen("ag1", 120, 78), antigen("ag2", 58, 122),
  ...mhc("mhcB", 164, 150),
  ...tHelper("th", 250, 150, 40),
  tcr("tcr", 200, 150),
  path("cd40", "M 176 180 L 212 180", { stroke: "#0369a1", strokeWidth: 3, dash: "3 2" }),
  ...dots("cyt", [[216, 110], [230, 98], [206, 96]], "#16a34a"),
  label("l_bcr", 14, 40, "BCR binds the antigen", "BCR קושר את האנטיגן", [118, 80], { anchor: "start", shortHe: "BCR", short: "BCR" }),
  label("l_pres", 14, 270, "B cell presents on MHC II", "תא B מציג על MHC II", [170, 156], { anchor: "start", shortHe: "הצגה על MHC II", short: "Presents" }),
  label("l_help", 250, 40, "CD40L + cytokines", "CD40L וציטוקינים", [220, 104], { anchor: "start" }),
  text("l_th", 330, 250, "helper T", "תא T עוזר", { textColor: "#0369a1", weight: 700 }),
];
const AB: [number, number, number][] = [[250, 90, 30], [290, 130, 60], [230, 170, 10], [300, 200, 80], [260, 240, 40], [330, 80, 20]];
const a4: El[] = [
  // plasma cell: large, eccentric nucleus, abundant rough ER
  ellipse("pc", 120, 160, 62, 50, "#fef9c3", { stroke: "#a16207", strokeWidth: 2 }),
  circle("pc_n", 88, 160, 22, "#a16207", { fillOpacity: 0.4 }),
  path("pc_er", "M 118 128 C 150 126 160 136 170 150 M 116 146 C 146 144 156 152 164 166 M 118 166 C 146 166 154 174 160 186", { stroke: "#ca8a04", strokeWidth: 2 }),
  ...AB.map(([x, y, r], i) => antibody(`ab${i}`, x, y, r, "#2563eb")),
  ...[[340, 150], [360, 110]].flatMap(([x, y], i) => [circle(`vir${i}`, x, y, 12, "#fecaca", { stroke: "#b91c1c", strokeWidth: 1.5 }), antibody(`abv${i}`, x - 16, y + 12, -45, "#2563eb", 0.8)]),
  label("l_pc", 14, 50, "Plasma cell", "תא פלזמה", [100, 132], { anchor: "start" }),
  label("l_ab", 200, 290, "Antibodies (IgM, then IgG)", "נוגדנים (IgM ואחר כך IgG)", [230, 176], { anchor: "start", shortHe: "נוגדנים", short: "Antibodies" }),
  label("l_neu", 250, 40, "Neutralise & tag", "נטרול וסימון", [340, 140], { anchor: "start" }),
];
// antibody level vs time: primary vs secondary response
const a5: El[] = [
  line("ax_y", 40, 250, 40, 50, C.line, 2, { arrow: true }),
  line("ax_x", 40, 250, 380, 250, C.line, 2, { arrow: true }),
  path("prim", "M 42 248 C 80 248 90 214 110 212 C 130 210 140 244 170 246", { stroke: "#94a3b8", strokeWidth: 3.5 }),
  path("sec", "M 200 248 C 212 248 216 90 240 84 C 270 80 300 150 360 190", { stroke: "#2563eb", strokeWidth: 3.5 }),
  line("exp1", 60, 256, 60, 240, C.line, 2), line("exp2", 205, 256, 205, 240, C.line, 2),
  text("e1", 60, 276, "1st exposure", "חשיפה 1", { fontSize: 16.5 }),
  text("e2", 205, 276, "2nd exposure", "חשיפה 2", { fontSize: 16.5 }),
  ...bCell("mb", 320, 70, 16), ...tHelper("mt", 356, 70, 16),
  label("l_prim", 44, 176, "Primary: slow, weak", "ראשונית: איטית וחלשה", [110, 214], { anchor: "start", shortHe: "ראשונית", short: "Primary" }),
  label("l_sec", 236, 230, "Secondary: fast, strong", "משנית: מהירה וחזקה", [256, 92], { anchor: "start", shortHe: "משנית", short: "Secondary" }),
  label("l_mem", 250, 30, "Memory B and T cells", "תאי זיכרון B ו-T", [320, 56], { anchor: "start", shortHe: "תאי זיכרון", short: "Memory cells" }),
  text("ylab", 46, 44, "antibody level", "רמת נוגדנים", { anchor: "start", textColor: C.muted }),
];

export const adaptive: ProcessScene = {
  slug: "adaptive-immunity",
  source: "Campbell 12e ch. 43; Janeway ch. 6, 10",
  legend: [
    { color: "#7e22ce", he: "תא מציג אנטיגן / MHC II", en: "Antigen-presenting cell / MHC II", swatch: "ring" },
    { color: "#0369a1", he: "תא T עוזר", en: "Helper T cell", swatch: "ring" },
    { color: "#a16207", he: "תא B / תא פלזמה", en: "B cell / plasma cell", swatch: "ring" },
    { color: "#dc2626", he: "אנטיגן", en: "Antigen", swatch: "dot" },
    { color: "#2563eb", he: "נוגדן", en: "Antibody", swatch: "line" },
  ],
  steps: [
    {
      titleHe: "הצגת אנטיגן לתא T עוזר", titleEn: "Antigen Presentation to a Helper T Cell",
      descHe: "תא דנדריטי שבלע פתוגן מפרק את חלבוניו לפפטידים ומציג אותם על מולקולות MHC מסוג II. בבלוטת הלימפה, תא T עוזר (CD4⁺) שקולטן ה-TCR שלו מתאים בדיוק לצירוף MHC–פפטיד הזה נקשר אליו; CD4 מייצב את הקישור. כך מתחילה תגובה ספציפית.",
      descEn: "A dendritic cell that engulfed a pathogen breaks its proteins into peptides and displays them on class II MHC molecules. In the lymph node, a helper T cell (CD4⁺) whose TCR fits that exact MHC–peptide combination binds it; CD4 stabilises the contact. This starts a specific response.",
      elements: a1,
    },
    {
      titleHe: "הפעלה וריבוי שבטי", titleEn: "Activation and Clonal Expansion",
      descHe: "תא ה-T העוזר המופעל מפריש IL-2 ומתחלק שוב ושוב — ברירה שבטית: רק התא שזיהה את האנטיגן מתרבה, ונוצר שבט של תאים זהים בעלי אותו TCR. חלקם יעזרו לתאי B ולתאי T ציטוטוקסיים, וחלקם יהפכו לתאי זיכרון.",
      descEn: "The activated helper T cell secretes IL-2 and divides repeatedly — clonal selection: only the cell that recognised the antigen multiplies, forming a clone of identical cells with the same TCR. Some will help B cells and cytotoxic T cells, and some become memory cells.",
      elements: a2,
    },
    {
      titleHe: "הפעלת תא B", titleEn: "B-Cell Activation",
      descHe: "תא B קושר את האנטיגן השלם בקולטן ה-BCR שלו (נוגדן הקשור לממברנה), בולע אותו ומציג פפטידים ממנו על MHC II. תא T עוזר מאותו שבט מזהה את ההצגה ומספק לתא ה-B אות שני — CD40L וציטוקינים — שמפעיל אותו לחלוקה ולהתמיינות.",
      descEn: "A B cell binds the intact antigen with its BCR (a membrane-bound antibody), takes it in and displays its peptides on MHC II. A helper T cell of the same clone recognises this and gives the B cell a second signal — CD40L and cytokines — that drives it to divide and differentiate.",
      elements: a3,
    },
    {
      titleHe: "תאי פלזמה ונוגדנים", titleEn: "Plasma Cells and Antibodies",
      descHe: "תאי B מופעלים מתמיינים לתאי פלזמה — תאים עשירים ברשתית תוך-תאית גבשושית — שמפרישים אלפי נוגדנים בשנייה בעלי אותה ספציפיות. תחילה מופרש IgM ובהמשך IgG. הנוגדנים מנטרלים נגיפים ורעלנים, מסמנים חיידקים לפאגוציטוזה ומפעילים את מערכת המשלים.",
      descEn: "Activated B cells differentiate into plasma cells — cells packed with rough ER — that secrete thousands of antibodies per second with the same specificity. IgM comes first, then IgG. Antibodies neutralise viruses and toxins, tag bacteria for phagocytosis and activate complement.",
      elements: a4,
    },
    {
      titleHe: "זיכרון חיסוני", titleEn: "Immunological Memory",
      descHe: "אחרי שהזיהום מתחסל נשארים תאי זיכרון B ו-T ארוכי חיים. בחשיפה נוספת לאותו אנטיגן התגובה המשנית מהירה יותר, חזקה יותר ובעיקר מ-IgG בעל זיקה גבוהה — העיקרון שעליו מבוססים חיסונים.",
      descEn: "Once the infection is cleared, long-lived memory B and T cells remain. On a second exposure to the same antigen the secondary response is faster, stronger and mostly high-affinity IgG — the principle behind vaccination.",
      elements: a5,
    },
  ],
};
