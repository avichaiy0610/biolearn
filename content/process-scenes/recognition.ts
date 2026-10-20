import { C, circle, label, line, path, ring, segments, smooth, text, type El, type ProcessScene, type Pt } from "./kit";

/* ══ MOLECULAR RECOGNITION: the theophylline RNA aptamer (Jenison et al. 1994; Alberts 7e ch. 3, 6–7) ══════
   A folded RNA: a lower stem, an internal loop that forms the binding pocket, an upper stem and a hairpin loop.
   Both strands are morphable paths (same point count), so the pocket visibly closes around the ligand.
   Last step: caffeine — the same rings plus one methyl group — does not fit. */

const RNA = C.rna, BASE = "#34d399", LIG = "#b45309", LIGF = "#fde68a", HB = "#0ea5e9";
const CX = 140, W = 15; // axis, stem half-width
// strand points top→bottom; `b` = how far the internal loop bulges out (open pocket) or in (closed)
const strand = (side: -1 | 1, b: number): Pt[] => [
  [CX + side * W, 64], [CX + side * W, 94], [CX + side * W, 122], [CX + side * (W + b * 0.6), 146], [CX + side * (W + b), 172],
  [CX + side * (W + b * 0.6), 198], [CX + side * W, 222], [CX + side * W, 252], [CX + side * W, 290],
];
// base-pair rungs in the two stems
const RUNGS = (y0: number, y1: number) => { const r: [Pt, Pt][] = []; for (let y = y0; y <= y1; y += 11) r.push([[CX - W + 2, y], [CX + W - 2, y]]); return r; };
// unpaired bases pointing into the pocket
const pocketBases = (b: number) => segments([-1, 1].flatMap((side) => [146, 172, 198].map((y, i) => {
  const x = CX + side * (W + (i === 1 ? b : b * 0.6));
  return [[x, y], [x - side * 12, y]] as [Pt, Pt];
})));
const aptamer = (b: number): El[] => [
  path("st_rung", segments([...RUNGS(96, 122), ...RUNGS(226, 284)]), { stroke: "#a7f3d0", strokeWidth: 2.4 }),
  path("st_l", smooth(strand(-1, b)), { stroke: RNA, strokeWidth: 6 }),
  path("st_r", smooth(strand(1, b)), { stroke: RNA, strokeWidth: 6 }),
  circle("hp", CX, 50, 16, "none", { stroke: RNA, strokeWidth: 6 }),
  path("pk_b", pocketBases(b), { stroke: BASE, strokeWidth: 4 }),
];
// purine-like ligand: fused 6- and 5-membered rings (+ an optional extra methyl = caffeine)
const purine = (p: string, cx: number, cy: number, s = 1, o: Partial<El> = {}): El[] => [
  path(`${p}6`, ring(cx - 7 * s, cy, 11 * s, 6, 0), { color: LIGF, stroke: LIG, strokeWidth: 2, ...o }),
  path(`${p}5`, ring(cx + 11 * s, cy, 9 * s, 5, 180), { color: LIGF, stroke: LIG, strokeWidth: 2, ...o }),
];
const methyl = (id: string, x: number, y: number, o: Partial<El> = {}): El[] => [
  line(`${id}_b`, x - 7, y + 6, x, y, LIG, 2, o),
  circle(id, x + 4, y - 4, 6, "#fca5a5", { stroke: "#b91c1c", strokeWidth: 2, ...o }),
];
const decoys = (op = 1): El[] => [
  path("glc", ring(340, 160, 15, 6), { color: "#e2e8f0", stroke: "#64748b", strokeWidth: 2, opacity: op }),
  text("glc_t", 340, 190, "glucose", "גלוקוז", { fontSize: 12, textColor: C.muted, opacity: op }),
  circle("ion", 360, 110, 8, "#e2e8f0", { stroke: "#64748b", strokeWidth: 2, opacity: op }),
];
const hbonds = (b: number, op = 1): El[] => [
  line("hb1", CX - W - b + 12, 172, CX - 26, 172, HB, 2.4, { dash: "3 3", opacity: op }),
  line("hb2", CX + W + b - 12, 172, CX + 30, 172, HB, 2.4, { dash: "3 3", opacity: op }),
  line("hb3", CX - W - b * 0.6 + 12, 198, CX - 14, 186, HB, 2.4, { dash: "3 3", opacity: op }),
];

const s1: El[] = [
  ...aptamer(40), ...purine("th", 300, 74, 1.5), ...decoys(),
  label("l_apt", 214, 284, "RNA aptamer: stems + a pocket", "אפטמר RNA — גבעולים וכיס", [CX + 16, 260], { anchor: "start", shortHe: "אפטמר RNA", short: "RNA aptamer" }),
  label("l_lig", 196, 30, "Ligand: theophylline", "ליגנד: תאופילין", [292, 70], { anchor: "start" }),
  label("l_pk", 214, 236, "Unpaired bases line the pocket", "בסיסים לא מזווגים בכיס", [CX + 46, 172], { anchor: "start", shortHe: "כיס הקישור", short: "Pocket" }),
];
const s2: El[] = [
  ...aptamer(40), ...purine("th", CX - 2, 172, 1.5), ...decoys(0.6), ...hbonds(40),
  circle("mg", CX + 44, 120, 8, "#a3e635", { stroke: "#3f6212", strokeWidth: 1.5 }),
  text("mg_t", CX + 58, 108, "Mg²⁺", "Mg²⁺", { ltr: true, weight: 700, anchor: "start", textColor: "#3f6212" }),
  label("l_hb", 196, 30, "H-bonds to the bases", "קשרי מימן לבסיסים", [CX + 26, 168], { anchor: "start" }),
  label("l_st", 214, 236, "Stacking on the bases", "הערמה על הבסיסים", [CX + 20, 186], { anchor: "start" }),
  text("l_weak", 300, 286, "many weak bonds add up", "הרבה קשרים חלשים — ביחד חזק", { weight: 700, fontSize: 15 }),
];
const s3: El[] = [
  ...aptamer(24), ...purine("th", CX - 2, 172, 1.5), ...decoys(0.4), ...hbonds(24),
  circle("mg", CX + 34, 128, 8, "#a3e635", { stroke: "#3f6212", strokeWidth: 1.5 }),
  text("mg_t", CX + 48, 116, "Mg²⁺", "Mg²⁺", { ltr: true, weight: 700, anchor: "start", textColor: "#3f6212" }),
  label("l_fit", 196, 30, "Induced fit: the pocket closes", "התאמה מושרית — הכיס נסגר", [CX + 24, 150], { anchor: "start", shortHe: "התאמה מושרית", short: "Induced fit" }),
  text("l_kd", 280, 270, "Kd ≈ 0.1 µM", "Kd ≈ 0.1 µM", { ltr: true, weight: 700, textColor: RNA }),
  text("l_kd2", 280, 290, "tight, specific binding", "קישור הדוק וספציפי", { fontSize: 14, textColor: RNA }),
];
const s4: El[] = [
  ...aptamer(24), ...purine("th", CX - 2, 172, 1.5), ...hbonds(24),
  ...purine("cf", 300, 100, 1.5), ...methyl("cf_me", 292, 80),
  line("x1", 252, 120, 272, 140, "#dc2626", 3), line("x2", 272, 120, 252, 140, "#dc2626", 3),
  label("l_caf", 196, 30, "Caffeine: one extra CH₃", "קפאין: CH₃ אחד נוסף", [300, 78], { anchor: "start" }),
  text("l_ratio", 280, 250, "binds ≈10,000× weaker", "נקשר חלש פי ≈10,000", { weight: 700, textColor: "#dc2626" }),
  text("l_ratio2", 280, 272, "one methyl decides", "קבוצת מתיל אחת מכריעה", { fontSize: 14, textColor: "#dc2626" }),
];

export const recognitionScene: ProcessScene = {
  slug: "molecular-recognition-animation",
  meta: {
    topic: "molecular-biology",
    nameHe: "זיהוי מולקולרי", nameEn: "Molecular Recognition",
    descHe: "אפטמר RNA ותאופילין: צורה משלימה, קשרים חלשים, התאמה מושרית — וקבוצת מתיל אחת שמבדילה מקפאין",
    descEn: "An RNA aptamer and theophylline: complementary shape, weak bonds, induced fit — and the one methyl group that tells it from caffeine",
    source: "Alberts 7e ch. 3, 6–7; Jenison et al., Science 1994",
  },
  legend: [
    { color: RNA, he: "שלד ה-RNA", en: "RNA backbone", swatch: "line" },
    { color: "#a7f3d0", he: "זוגות בסיסים (גבעולים)", en: "Base pairs (stems)", swatch: "line" },
    { color: BASE, he: "בסיסים לא מזווגים בכיס", en: "Unpaired pocket bases", swatch: "line" },
    { color: LIG, he: "ליגנד", en: "Ligand", swatch: "ring" },
    { color: HB, he: "קשר מימן", en: "Hydrogen bond", swatch: "dash" },
  ],
  steps: [
    {
      titleHe: "צורה משלימה", titleEn: "Complementary Shape",
      descHe: "זיהוי מולקולרי מבוסס על התאמה בין משטחים. RNA קצר מתקפל על עצמו: אזורים משלימים יוצרים גבעולים (זוגות בסיסים), ובין הגבעולים נשארת לולאה פנימית — כיס שבסיסים לא מזווגים מרפדים אותו. לכיס של האפטמר בדוגמה צורה ופיזור קשרי מימן שמשלימים בדיוק את התאופילין. מולקולות אחרות בסביבה לא מתאימות לכיס.",
      descEn: "Molecular recognition relies on matching surfaces. A short RNA folds back on itself: complementary stretches form stems (base pairs), and between the stems an internal loop remains — a pocket lined with unpaired bases. The pocket of the aptamer in this example has a shape and hydrogen-bond pattern that exactly complement theophylline. Other molecules nearby do not fit the pocket.",
      elements: s1,
    },
    {
      titleHe: "קשרים לא-קוולנטיים", titleEn: "Non-Covalent Interactions",
      descHe: "הליגנד נאחז בכיס בעזרת קשרים חלשים רבים: קשרי מימן לבסיסים, הערמה (stacking) של הטבעות שלו על בסיסים, כוחות ואן דר ואלס ומשיכה אלקטרוסטטית — לעתים בעזרת יוני Mg²⁺ שמנטרלים את מטען הפוספטים. כל קשר חלש ומתפרק בקלות, אבל ביחד הם יוצרים קישור יציב — ועדיין הפיך.",
      descEn: "The ligand is held in the pocket by many weak bonds: hydrogen bonds to bases, stacking of its rings on bases, van der Waals contacts and electrostatic attraction — often helped by Mg²⁺ ions that neutralise the phosphates. Each bond is weak and breaks easily, but together they make binding stable — yet still reversible.",
      elements: s2,
    },
    {
      titleHe: "התאמה מושרית", titleEn: "Induced Fit",
      descHe: "הקישור משנה את מבנה ה-RNA: הלולאה הגמישה נסגרת סביב הליגנד (התאמה מושרית), מוסיפה מגעים ומייצבת את הקומפלקס. אפטמר התאופילין קושר אותו בזיקה גבוהה — Kd של כ-0.1 מיקרומולר. אותו עיקרון פועל בריבוסוויצ'ים: הקישור משנה את קיפול ה-RNA, וזה משנה את ביטוי הגן.",
      descEn: "Binding changes the RNA's structure: the flexible loop closes around the ligand (induced fit), adding contacts and stabilising the complex. The theophylline aptamer binds it with high affinity — a Kd of about 0.1 µM. The same principle runs riboswitches: binding changes the RNA's fold, and that changes gene expression.",
      elements: s3,
    },
    {
      titleHe: "ספציפיות: קבוצת מתיל אחת", titleEn: "Specificity: One Methyl Group",
      descHe: "קפאין שונה מתאופילין רק בקבוצת מתיל אחת נוספת — ובכל זאת האפטמר קושר אותו חלש פי כ-10,000. קבוצת המתיל לא נכנסת לכיס וגם מבטלת קשר מימן. הניסוי (Jenison ועמיתיו, 1994) הראה כמה מדויק יכול להיות זיהוי מולקולרי שמבוסס רק על צורה וקשרים חלשים.",
      descEn: "Caffeine differs from theophylline by just one extra methyl group — yet the aptamer binds it about 10,000 times more weakly. The methyl does not fit the pocket and also removes a hydrogen bond. The experiment (Jenison and colleagues, 1994) showed how precise molecular recognition can be when it relies only on shape and weak bonds.",
      elements: s4,
    },
  ],
};
