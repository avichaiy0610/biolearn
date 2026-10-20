import { arrow, circle, label, line, path, rect, smooth, text, type El, type ProcessScene, type Pt } from "./kit";

/* ══ THE NEPHRON (Berne & Levy 8e ch. 33–35; Campbell 12e ch. 44) ══════════
   One nephron drawn in the kidney: cortex above, medulla below (its interstitium gets saltier with depth).
   Every segment is its own path (wall + lumen) so the step that talks about it can light it up. */

const WALL = "#b45309", LUMEN = "#fffbeb", HOT = "#c2410c";
const H2O = "#0ea5e9", REABS = "#16a34a", SALT = "#f97316";

type Seg = "pct" | "dl" | "al" | "dct" | "cd";
const SEGS: Record<Seg, { pts: Pt[]; w: number }> = {
  // proximal convoluted tubule: leaves Bowman's capsule and coils in the cortex
  pct: { pts: [[101, 70], [110, 52], [130, 60], [126, 82], [144, 98], [164, 86], [176, 104], [180, 126]], w: 10 },
  // thin descending limb, down into the medulla
  dl: { pts: [[180, 126], [182, 180], [184, 234], [186, 262], [194, 274], [202, 264]], w: 7 },
  // ascending limb (thick in its upper part), back up to the cortex
  al: { pts: [[202, 264], [204, 220], [206, 170], [208, 130], [212, 112]], w: 9 },
  // distal convoluted tubule, in the cortex
  dct: { pts: [[212, 112], [226, 96], [246, 104], [262, 84], [282, 92], [304, 76], [330, 80], [352, 70]], w: 9 },
  // collecting duct: from the cortex down through the medulla
  cd: { pts: [[352, 40], [354, 110], [357, 180], [360, 240], [362, 294]], w: 12 },
};
const seg = (s: Seg, active: boolean): El[] => {
  const d = smooth(SEGS[s].pts), w = SEGS[s].w;
  return [
    path(`${s}_w`, d, { stroke: active ? HOT : WALL, strokeWidth: active ? w + 2 : w, opacity: active ? 1 : 0.55 }),
    path(`${s}_l`, d, { stroke: LUMEN, strokeWidth: Math.max(3, w - 5) }),
  ];
};

// kidney zones: cortex on top, the medulla below gets more concentrated toward the papilla
const zones = (osm: boolean): El[] => [
  rect("z_cx", 0, 0, 400, 128, "#fffdf7"),
  rect("z_m1", 0, 128, 400, 56, "#fef3c7", { fillOpacity: osm ? 0.9 : 0.55 }),
  rect("z_m2", 0, 184, 400, 56, "#fde68a", { fillOpacity: osm ? 0.85 : 0.5 }),
  rect("z_m3", 0, 240, 400, 60, "#fcd34d", { fillOpacity: osm ? 0.8 : 0.45 }),
  line("z_b", 0, 128, 400, 128, "#a8a29e", 1.4, { dash: "5 4" }),
  text("t_cx", 8, 20, "Cortex", "קליפה", { anchor: "start", weight: 700, fontSize: 14, textColor: "#78716c" }),
  text("t_md", 8, 148, "Medulla", "ליבה", { anchor: "start", weight: 700, fontSize: 14, textColor: "#78716c" }),
  text("osm1", 8, 170, "300 mOsm", "300 mOsm", { anchor: "start", ltr: true, fontSize: 13, textColor: "#92400e", opacity: osm ? 1 : 0 }),
  text("osm2", 8, 292, "1200 mOsm", "1200 mOsm", { anchor: "start", ltr: true, fontSize: 13, weight: 700, textColor: "#92400e", opacity: osm ? 1 : 0 }),
];

// renal corpuscle: afferent arteriole in, capillary tuft (glomerulus) inside Bowman's capsule, efferent out
const TUFT: Pt[] = [[58, 60], [72, 58], [80, 70], [72, 84], [57, 83], [50, 70], [65, 71]];
const corpuscle = (active: boolean): El[] => [
  path("aff", "M 0 48 C 18 50 30 56 44 64", { stroke: "#dc2626", strokeWidth: 7 }),
  path("eff", "M 44 84 C 30 92 18 96 0 98", { stroke: "#991b1b", strokeWidth: 5 }),
  circle("bow", 66, 72, 36, "#fff7ed", { stroke: active ? HOT : WALL, strokeWidth: active ? 3.5 : 2.5, opacity: active ? 1 : 0.8 }),
  circle("bow_in", 66, 72, 29, LUMEN, { stroke: "#fdba74", strokeWidth: 1 }),
  ...TUFT.map(([x, y], i) => circle(`cap${i}`, x + 1, y + 1, 8, "#fecaca", { stroke: "#b91c1c", strokeWidth: 1.6 })),
];
const nephron = (active: Seg | "glom" | null): El[] => [
  ...corpuscle(active === "glom"),
  ...(["pct", "dl", "al", "dct", "cd"] as Seg[]).flatMap((s) => seg(s, active === s || (active === "dl" && s === "al") || (active === "dct" && s === "cd"))),
  text("t_aff", 4, 40, "afferent", "מוביל", { anchor: "start", fontSize: 13, textColor: "#dc2626" }),
  text("t_eff", 4, 116, "efferent", "מוציא", { anchor: "start", fontSize: 13, textColor: "#991b1b" }),
];

const s1: El[] = [
  ...zones(false), ...nephron("glom"),
  ...[[62, 64, 90, 48], [70, 80, 94, 96]].map(([x1, y1, x2, y2], i) => arrow(`fl${i}`, x1, y1, x2, y2, H2O, 2)),
  ...[[90, 60], [93, 84], [84, 98]].map(([x, y], i) => circle(`sol${i}`, x, y, 2.6, H2O)),
  label("l_glom", 122, 24, "Glomerulus: capillary tuft", "פקעית — סליל נימים", [74, 60], { anchor: "start", shortHe: "פקעית", short: "Glomerulus" }),
  label("l_bow", 14, 180, "Bowman's capsule", "קופסית באומן", [44, 100], { anchor: "start" }),
  text("l_gfr", 284, 222, "≈180 L/day filtered", "כ-180 ליטר ביום", { weight: 700, textColor: "#0369a1" }),
  text("l_gfr2", 284, 246, "only ≈1.5 L becomes urine", "רק כ-1.5 ליטר — שתן", { textColor: "#0369a1", fontSize: 14 }),
];

const s2: El[] = [
  ...zones(false), ...nephron("pct"),
  ...[[112, 46, 112, 22], [148, 84, 148, 56], [176, 98, 196, 76]].map(([x1, y1, x2, y2], i) => arrow(`re${i}`, x1, y1, x2, y2, REABS, 2.4)),
  arrow("sec", 102, 106, 118, 88, SALT, 2.2),
  text("l_what", 218, 30, "Na⁺, H₂O, all glucose, amino acids", "Na⁺, מים, כל הגלוקוז", { anchor: "start", weight: 700, textColor: REABS, fontSize: 15, short: "Na⁺, H₂O, glucose", shortHe: "Na⁺, מים, גלוקוז" }),
  label("l_pct", 14, 196, "Proximal tubule: ≈65% reabsorbed", "אבובית מקורבת: כ-65% נספגים", [150, 92], { anchor: "start", shortHe: "אבובית מקורבת", short: "Proximal tubule" }),
  label("l_sec", 14, 246, "Secretion: H⁺, drugs", "הפרשה: H⁺ ותרופות", [106, 102], { anchor: "start" }),
];

const s3: El[] = [
  ...zones(true), ...nephron("dl"),
  ...[[180, 190], [183, 240]].map(([x, y], i) => arrow(`w${i}`, x - 4, y, x - 32, y, H2O, 2.4)),
  ...[[205, 160], [206, 205]].map(([x, y], i) => arrow(`na${i}`, x + 6, y, x + 34, y, SALT, 2.4)),
  label("l_dl", 24, 258, "Descending: water out", "יורדת: מים יוצאים", [182, 220], { anchor: "start", fontSize: 15 }),
  label("l_al", 248, 228, "Ascending: NaCl out", "עולה: NaCl יוצא", [207, 186], { anchor: "start", fontSize: 15 }),
  text("l_loop", 296, 150, "loop of Henle", "לולאת הנלה", { weight: 700, textColor: HOT }),
];

const s4: El[] = [
  ...zones(true), ...nephron("dct"),
  ...[[358, 196], [361, 250]].map(([x, y], i) => circle(`aqp${i}`, x, y, 4.5, H2O, { stroke: "#fff", strokeWidth: 1.2 })),
  ...[[354, 196], [357, 250]].map(([x, y], i) => arrow(`adh${i}`, x - 4, y, x - 34, y, H2O, 2.4)),
  arrow("ald", 290, 84, 290, 52, REABS, 2.4),
  label("l_ald", 226, 26, "Aldosterone: Na⁺ reabsorbed", "אלדוסטרון: ספיגת Na⁺", [290, 70], { anchor: "start", shortHe: "אלדוסטרון", short: "Aldosterone", fontSize: 15 }),
  label("l_adh", 222, 230, "ADH: aquaporins, water out", "ADH: אקוופורינים", [356, 222], { anchor: "start", fontSize: 15 }),
  text("l_cd", 296, 150, "collecting duct", "צינור מאסף", { weight: 700, textColor: HOT }),
  text("l_urine", 330, 296, "urine", "שתן", { weight: 700, textColor: "#a16207", fontSize: 15 }),
];

export const nephronScene: ProcessScene = {
  slug: "nephron-urine-formation",
  meta: {
    topic: "physiology",
    nameHe: "הנפרון ויצירת השתן", nameEn: "The Nephron and Urine Formation",
    descHe: "סינון בפקעית, ספיגה חוזרת באבובית המקורבת, לולאת הנלה, ובקרה הורמונלית בצינור המאסף",
    descEn: "Glomerular filtration, proximal reabsorption, the loop of Henle and hormonal control in the collecting duct",
    source: "Berne & Levy 8e ch. 33–35; Campbell 12e ch. 44",
  },
  legend: [
    { color: "#b91c1c", he: "נימי הפקעית", en: "Glomerular capillaries", swatch: "ring" },
    { color: WALL, he: "הנפרון (המקטע המודגש — פעיל בשלב)", en: "Nephron (highlighted segment = this step)", swatch: "line" },
    { color: H2O, he: "מים", en: "Water", swatch: "arrow" },
    { color: REABS, he: "ספיגה חוזרת", en: "Reabsorption", swatch: "arrow" },
    { color: SALT, he: "NaCl / הפרשה", en: "NaCl / secretion", swatch: "arrow" },
  ],
  steps: [
    {
      titleHe: "סינון בפקעית", titleEn: "Glomerular Filtration",
      descHe: "דם מגיע לפקעית — סליל של נימים — דרך העורקיק המוביל, ויוצא דרך העורקיק המוציא. לחץ הדם בנימים דוחף מים ומומסים קטנים דרך דופן הנימים אל חלל קופסית באומן; תאי דם וחלבונים גדולים נשארים בדם. בשתי הכליות מסוננים כ-180 ליטר ביום — אבל רק כ-1.5 ליטר הופכים לשתן.",
      descEn: "Blood enters the glomerulus — a tuft of capillaries — through the afferent arteriole and leaves through the efferent arteriole. Capillary blood pressure pushes water and small solutes across the capillary wall into Bowman's capsule; blood cells and large proteins stay behind. The two kidneys filter about 180 L a day — yet only about 1.5 L becomes urine.",
      elements: s1,
    },
    {
      titleHe: "ספיגה חוזרת באבובית המקורבת", titleEn: "Reabsorption in the Proximal Tubule",
      descHe: "האבובית המקורבת, בקליפת הכליה, מחזירה לדם כ-65% מה-Na⁺ והמים, ובמצב תקין את כל הגלוקוז וחומצות האמינו — בעזרת משאבת Na⁺/K⁺ ונשאים משניים כמו SGLT. כאן גם מופרשים אל הנוזל יוני H⁺ ותרופות.",
      descEn: "The proximal tubule, in the cortex, returns about 65% of the Na⁺ and water to the blood, and normally all the glucose and amino acids — using the Na⁺/K⁺ pump and secondary carriers such as SGLT. H⁺ ions and drugs are also secreted into the fluid here.",
      elements: s2,
    },
    {
      titleHe: "לולאת הנלה", titleEn: "The Loop of Henle",
      descHe: "הלולאה יורדת לליבת הכליה וחוזרת. הזרוע היורדת חדירה למים ובלתי חדירה כמעט למלח — מים יוצאים אל הליבה המלוחה. הזרוע העולה מוציאה NaCl (בחלקה העבה — בהובלה פעילה) אבל אינה חדירה למים. יחד הן יוצרות מפל אוסמוטי בליבה, מכ-300 ועד כ-1200 mOsm (מנגנון הזרם הנגדי) — הבסיס ליכולת לייצר שתן מרוכז.",
      descEn: "The loop dips into the medulla and returns. The descending limb is permeable to water but hardly to salt — water leaves into the salty medulla. The ascending limb moves NaCl out (actively, in its thick part) but is impermeable to water. Together they build an osmotic gradient in the medulla, from about 300 to about 1200 mOsm (the countercurrent mechanism) — the basis for making concentrated urine.",
      elements: s3,
    },
    {
      titleHe: "בקרה באבובית המרוחקת ובצינור המאסף", titleEn: "Control in the Distal Tubule and Collecting Duct",
      descHe: "אלדוסטרון מגביר ספיגת Na⁺ (והפרשת K⁺) בחלקים האחרונים של האבובית המרוחקת ובצינור המאסף. ההורמון ADH (וזופרסין) גורם להחדרת אקוופורינים לדופן הצינור המאסף, ומים נספגים אל הליבה המלוחה — השתן מתרכז. כך הכליה מכווננת את נפח הנוזלים ואת האוסמולריות.",
      descEn: "Aldosterone increases Na⁺ reabsorption (and K⁺ secretion) in the late distal tubule and the collecting duct. The hormone ADH (vasopressin) makes the collecting duct insert aquaporins, so water is drawn into the salty medulla — the urine is concentrated. This is how the kidney tunes body-fluid volume and osmolarity.",
      elements: s4,
    },
  ],
};
