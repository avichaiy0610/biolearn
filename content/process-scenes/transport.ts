import { C, arrow, bilayer, circle, label, path, rect, ring, text, type El, type ProcessScene, type Pt } from "./kit";

/* ══ TRANSPORT ACROSS THE MEMBRANE (Alberts 7e ch. 11; Lehninger 8e ch. 11) ══════
   Outside above, cytosol below, one bilayer across. Each step shows only its own particles, and their numbers on
   each side show the concentration gradient — the thing that decides whether transport needs energy.
   The three proteins stay in place across the steps; the one that works in a step is drawn in full colour. */

const MEM = 150;
const GAS = "#0ea5e9", K = "#7c3aed", NA = "#f97316", GLC = "#16a34a";
const CH_X = 140, PUMP_X = 230, SYM_X = 322;

// a scatter of n particles in a box, deterministic
const scatter = (n: number, x0: number, x1: number, y0: number, y1: number, seed: number): Pt[] =>
  Array.from({ length: n }, (_, i) => {
    const a = Math.sin((i + 1) * 12.9898 + seed * 78.233) * 43758.5453, b = Math.sin((i + 1) * 39.346 + seed * 11.135) * 24634.6345;
    return [x0 + (a - Math.floor(a)) * (x1 - x0), y0 + (b - Math.floor(b)) * (y1 - y0)];
  });
const dots = (id: string, pts: Pt[], color: string, r = 4): El[] => pts.map(([x, y], i) => circle(`${id}${i}`, x, y, r, color, { stroke: "#fff", strokeWidth: 1 }));
const hexes = (id: string, pts: Pt[]): El[] => pts.map(([x, y], i) => path(`${id}${i}`, ring(x, y, 5.5, 6), { color: "#dcfce7", stroke: GLC, strokeWidth: 1.6 }));

const proteins = (active: "ch" | "pump" | "sym" | null): El[] => {
  const op = (k: string) => (active === k ? 1 : 0.35);
  return [
    // K⁺ channel: two subunits with a pore
    rect("ch_l", CH_X - 15, MEM - 22, 11, 44, "#e0e7ff", { stroke: K, strokeWidth: 1.8, rx: 4, opacity: op("ch") }),
    rect("ch_r", CH_X + 4, MEM - 22, 11, 44, "#e0e7ff", { stroke: K, strokeWidth: 1.8, rx: 4, opacity: op("ch") }),
    // Na⁺/K⁺ pump
    rect("pump", PUMP_X - 22, MEM - 26, 44, 52, "#dcfce7", { stroke: "#15803d", strokeWidth: 2, rx: 12, opacity: op("pump") }),
    // SGLT1 symporter
    rect("sym", SYM_X - 18, MEM - 24, 36, 48, "#fef3c7", { stroke: "#b45309", strokeWidth: 2, rx: 10, opacity: op("sym") }),
  ];
};
const frame = (): El[] => [
  ...bilayer("mem", 0, 400, MEM, { th: 22 }),
  text("t_out", 392, 26, "Outside", "מחוץ לתא", { anchor: "end", weight: 700, textColor: C.muted }),
  text("t_in", 392, 290, "Cytosol", "ציטוזול", { anchor: "end", weight: 700, textColor: C.muted }),
];

const s1: El[] = [
  ...frame(), ...proteins(null),
  ...dots("o2a", scatter(12, 20, 110, 40, 124, 1), GAS),
  ...dots("o2b", scatter(3, 20, 110, 180, 260, 2), GAS),
  arrow("dif", 64, 116, 64, 190, GAS, 3),
  label("l_o2", 120, 50, "O₂, CO₂ cross the lipids", "O₂ ו-CO₂ עוברים דרך השומנים", [64, MEM], { anchor: "start", shortHe: "דרך השומנים", short: "Through lipids" }),
  label("l_grad", 120, 258, "High → low, no energy", "מריכוז גבוה לנמוך, בלי אנרגיה", [64, 186], { anchor: "start", shortHe: "גבוה ← נמוך", short: "High → low" }),
];
const s2: El[] = [
  ...frame(), ...proteins("ch"),
  ...dots("ka", scatter(3, 100, 180, 50, 120, 3), K),
  ...dots("kb", scatter(12, 90, 190, 180, 270, 4), K),
  arrow("kflow", CH_X, 186, CH_X, 108, K, 3),
  label("l_ch", 200, 50, "K⁺ channel: a selective pore", "תעלת K⁺ — נקבובית בררנית", [CH_X + 6, MEM - 20], { anchor: "start", shortHe: "תעלת K⁺", short: "K⁺ channel" }),
  label("l_fd", 200, 258, "Down the gradient, no energy", "עם המפל — בלי אנרגיה", [CH_X, 196], { anchor: "start", shortHe: "עם המפל", short: "Down the gradient" }),
];
const s3: El[] = [
  ...frame(), ...proteins("pump"),
  ...dots("naa", scatter(12, 180, 290, 40, 120, 5), NA),
  ...dots("nab", scatter(3, 180, 290, 190, 262, 6), NA),
  ...dots("kpa", scatter(3, 60, 120, 40, 120, 7), K),
  ...dots("kpb", scatter(10, 40, 120, 186, 270, 8), K),
  arrow("na_out", PUMP_X + 10, 178, PUMP_X + 10, 112, NA, 3),
  arrow("k_in", PUMP_X - 10, 112, PUMP_X - 10, 178, K, 3),
  rect("atp_bg", PUMP_X - 44, 222, 88, 22, "#ffffff", { stroke: C.energy, strokeWidth: 2, rx: 11 }),
  text("atp", PUMP_X, 237, "ATP → ADP", "ATP → ADP", { ltr: true, weight: 700, fontSize: 13, textColor: "#b45309" }),
  label("l_pump", 14, 50, "Na⁺/K⁺ pump: 3 Na⁺ out, 2 K⁺ in", "משאבת Na⁺/K⁺: 3 Na⁺ החוצה, 2 K⁺ פנימה", [PUMP_X - 18, MEM - 22], { anchor: "start", shortHe: "משאבת Na⁺/K⁺", short: "Na⁺/K⁺ pump" }),
  label("l_ag", 14, 262, "Against both gradients", "נגד שני המפלים", [PUMP_X - 10, 160], { anchor: "start" }),
];
const s4: El[] = [
  ...frame(), ...proteins("sym"),
  ...dots("nsa", scatter(12, 250, 390, 40, 124, 9), NA),
  ...dots("nsb", scatter(3, 250, 390, 186, 262, 10), NA),
  ...hexes("gla", scatter(2, 260, 380, 50, 120, 11)),
  ...hexes("glb", scatter(8, 252, 300, 186, 270, 12)),
  arrow("na_in", SYM_X - 8, 112, SYM_X - 8, 186, NA, 3),
  arrow("g_in", SYM_X + 8, 112, SYM_X + 8, 186, GLC, 3),
  label("l_sym", 14, 50, "SGLT1: Na⁺ and glucose together", "SGLT1: ‏Na⁺ וגלוקוז יחד", [SYM_X - 16, MEM - 22], { anchor: "start", shortHe: "SGLT1", short: "SGLT1" }),
  label("l_drive", 14, 262, "Na⁺ down its gradient pulls glucose up", "Na⁺ עם המפל — גלוקוז נגד המפל", [SYM_X - 8, 176], { anchor: "start", shortHe: "מפל Na⁺ מניע", short: "Na⁺ gradient drives" }),
];

export const transportScene: ProcessScene = {
  slug: "membrane-transport",
  meta: {
    topic: "cell-biology", subtopic: "cell-membrane",
    nameHe: "מעבר חומרים דרך הממברנה", nameEn: "Transport Across the Membrane",
    descHe: "דיפוזיה פשוטה, דיפוזיה מזורזת בתעלות, הובלה פעילה ראשונית (משאבת Na⁺/K⁺) ומשנית (SGLT1)",
    descEn: "Simple diffusion, facilitated diffusion through channels, primary (Na⁺/K⁺ pump) and secondary (SGLT1) active transport",
    source: "Alberts 7e ch. 11; Lehninger 8e ch. 11",
  },
  legend: [
    { color: GAS, he: "O₂ / CO₂", en: "O₂ / CO₂", swatch: "dot" },
    { color: K, he: "K⁺", en: "K⁺", swatch: "dot" },
    { color: NA, he: "Na⁺", en: "Na⁺", swatch: "dot" },
    { color: GLC, he: "גלוקוז", en: "Glucose", swatch: "ring" },
    { color: C.membrane, he: "דו-שכבה פוספוליפידית", en: "Phospholipid bilayer", swatch: "line" },
  ],
  steps: [
    {
      titleHe: "דיפוזיה פשוטה", titleEn: "Simple Diffusion",
      descHe: "מולקולות קטנות ולא קוטביות — כמו O₂, CO₂ ו-N₂ — מתמוססות בליבה ההידרופובית של הדו-שכבה ועוברות דרכה ישירות, מהצד שבו ריכוזן גבוה לצד שבו הוא נמוך, בלי חלבון ובלי אנרגיה. יונים ומולקולות קוטביות גדולות כמעט לא עוברות כך.",
      descEn: "Small nonpolar molecules — such as O₂, CO₂ and N₂ — dissolve in the hydrophobic core of the bilayer and cross it directly, from the side where they are concentrated to the side where they are not, with no protein and no energy. Ions and large polar molecules barely cross this way.",
      elements: s1,
    },
    {
      titleHe: "דיפוזיה מזורזת", titleEn: "Facilitated Diffusion",
      descHe: "יונים ומולקולות קוטביות עוברים בעזרת חלבונים: תעלות יוצרות נקבובית בררנית (כאן תעלת K⁺, ויש גם אקוופורינים למים), ונשאים כמו GLUT1 משנים צורה כדי להעביר גלוקוז. הזרימה עדיין רק עם מפל הריכוז (והמפל החשמלי) — בלי השקעת אנרגיה.",
      descEn: "Ions and polar molecules cross with the help of proteins: channels form a selective pore (here a K⁺ channel; aquaporins do it for water), and carriers like GLUT1 change shape to move glucose. Flow is still only down the concentration (and electrical) gradient — no energy spent.",
      elements: s2,
    },
    {
      titleHe: "הובלה פעילה ראשונית", titleEn: "Primary Active Transport",
      descHe: "משאבת Na⁺/K⁺ (ATPase) מפרקת ATP ומשתמשת באנרגיה כדי להוציא 3 Na⁺ ולהכניס 2 K⁺ — נגד מפלי הריכוז של שניהם. הזרחון והסרת הזרחה של המשאבה משנים את צורתה לסירוגין. המפלים שהיא יוצרת חיוניים לפוטנציאל הממברנה ולהובלה המשנית.",
      descEn: "The Na⁺/K⁺ ATPase splits ATP and uses the energy to pump 3 Na⁺ out and 2 K⁺ in — against both their gradients. Phosphorylation and dephosphorylation switch the pump's shape back and forth. The gradients it builds power the membrane potential and secondary transport.",
      elements: s3,
    },
    {
      titleHe: "הובלה פעילה משנית", titleEn: "Secondary Active Transport",
      descHe: "הסימפורטר SGLT1 בתאי המעי והכליה מכניס גלוקוז נגד מפל הריכוז שלו, בזכות Na⁺ שנכנס יחד איתו עם המפל. האנרגיה אינה מגיעה ישירות מ-ATP אלא ממפל ה-Na⁺ שמשאבת Na⁺/K⁺ יצרה — ולכן ההובלה \"משנית\".",
      descEn: "The SGLT1 symporter in gut and kidney cells brings glucose in against its gradient, driven by Na⁺ moving in with it down its own gradient. The energy comes not from ATP directly but from the Na⁺ gradient the Na⁺/K⁺ pump built — hence \"secondary\".",
      elements: s4,
    },
  ],
};
