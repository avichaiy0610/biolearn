import { C, arrow, circle, ellipse, label, line, mitochondrion, path, rect, text, type El, type ProcessScene } from "./kit";

const MT = "#fdba74", MTS = "#c2410c", MUT = "#dc2626";
const mini = (id: string, cx: number, cy: number, color = MT, o: Partial<El> = {}) => ellipse(id, cx, cy, 9, 5, color, { stroke: color === MUT ? "#7f1d1d" : MTS, strokeWidth: 1.2, ...o });
const ring = (id: string, cx: number, cy: number, r: number, o: Partial<El> = {}) => circle(id, cx, cy, r, "none", { stroke: "#1d4ed8", strokeWidth: 2.5, ...o });

// deterministic scatter inside a circle
function scatter(n: number, cx: number, cy: number, r: number, seed = 1): [number, number][] {
  const out: [number, number][] = [];
  let s = seed;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  while (out.length < n) {
    const x = cx + (rnd() * 2 - 1) * r, y = cy + (rnd() * 2 - 1) * r;
    if ((x - cx) ** 2 + (y - cy) ** 2 < (r * 0.82) ** 2) out.push([Math.round(x), Math.round(y)]);
  }
  return out;
}

const s1: El[] = [
  ...mitochondrion("mt", 200, 150, 160, 92, {}, 0.3, 5),
  ring("dna1", 130, 150, 20), ring("dna2", 205, 142, 16), ring("dna3", 270, 158, 18),
  ...[[160, 170], [240, 130], [180, 125], [300, 140]].map(([x, y], i) => circle(`rib${i}`, x, y, 4, "#475569")),
  label("l_dna", 20, 280, "Circular mtDNA (16,569 bp)", "mtDNA מעגלי (16,569 bp)", [130, 170], { anchor: "start" }),
  label("l_cp", 220, 280, "Many copies", "עותקים רבים", [270, 176], { anchor: "start" }),
  text("l_genes", 200, 34, "37 genes: 13 proteins · 22 tRNA · 2 rRNA", "37 גנים: 13 חלבונים · 22 tRNA · 2 rRNA", { weight: 700, short: "37 genes", shortHe: "37 גנים" }),
  label("l_rib", 250, 70, "Own ribosomes", "ריבוזומים משלה", [240, 130], { anchor: "start" }),
];

const EGG = scatter(26, 140, 150, 100, 7);
const s2: El[] = [
  circle("egg", 140, 150, 104, "#fef3c7", { stroke: "#d97706", strokeWidth: 2.5 }),
  circle("egg_n", 120, 140, 26, "#fde68a", { stroke: "#b45309", strokeWidth: 1.5 }),
  ...EGG.map(([x, y], i) => mini(`em${i}`, x, y)),
  // sperm: head, mid-piece with few mitochondria, tail
  ellipse("sp_h", 262, 150, 14, 9, "#e0e7ff", { stroke: "#4338ca", strokeWidth: 1.8 }),
  rect("sp_mid", 276, 145, 30, 10, "#c7d2fe", { rx: 4, stroke: "#4338ca", strokeWidth: 1.2 }),
  mini("sm0", 284, 150, MT, { strokeWidth: 1 }), mini("sm1", 298, 150, MT, { strokeWidth: 1 }),
  path("sp_t", "M 306 150 C 324 136 338 164 356 150 C 370 140 380 158 394 150", { stroke: "#4338ca", strokeWidth: 2 }),
  line("x1", 276, 136, 306, 164, "#b91c1c", 2.5), line("x2", 306, 136, 276, 164, "#b91c1c", 2.5),
  label("l_egg", 150, 34, "Egg: >100,000 mitochondria", "ביצית: יותר מ-100,000 מיטוכונדריות", [180, 90], { anchor: "start", shortHe: "ביצית: מיטוכונדריות רבות", short: "Egg: many" }),
  label("l_sp", 200, 282, "Sperm mitochondria are destroyed", "מיטוכונדריות הזרעון מפורקות", [290, 162], { anchor: "start", shortHe: "של הזרעון מפורקות", short: "Sperm's destroyed" }),
];

// pedigree: circle = female, square = male; filled = affected
const fem = (id: string, cx: number, cy: number, aff: boolean) => circle(id, cx, cy, 13, aff ? "#b91c1c" : "#ffffff", { stroke: "#0f172a", strokeWidth: 2 });
const mal = (id: string, cx: number, cy: number, aff: boolean) => rect(id, cx - 13, cy - 13, 26, 26, aff ? "#b91c1c" : "#ffffff", { rx: 0, stroke: "#0f172a", strokeWidth: 2 });
const L = (id: string, x1: number, y1: number, x2: number, y2: number) => line(id, x1, y1, x2, y2, "#0f172a", 1.8);
const s3: El[] = [
  mal("i1", 160, 50, false), fem("i2", 240, 50, true), L("m1", 173, 50, 227, 50), L("d1", 200, 50, 200, 90), L("sib1", 110, 90, 290, 90),
  L("c1", 110, 90, 110, 127), L("c2", 200, 90, 200, 127), L("c3", 290, 90, 290, 127),
  fem("ii1", 110, 140, true), mal("ii2", 200, 140, true), mal("ii3", 290, 140, true),
  mal("ii1h", 50, 140, false), L("m2", 63, 140, 97, 140), L("d2", 80, 140, 80, 190), L("sib2", 50, 190, 110, 190), L("c4", 50, 190, 50, 217), L("c5", 110, 190, 110, 217),
  fem("iii1", 50, 230, true), mal("iii2", 110, 230, true),
  fem("ii3w", 350, 140, false), L("m3", 303, 140, 337, 140), L("d3", 320, 140, 320, 190), L("sib3", 290, 190, 350, 190), L("c6", 290, 190, 290, 217), L("c7", 350, 190, 350, 217),
  mal("iii3", 290, 230, false), fem("iii4", 350, 230, false),
  text("g1", 16, 56, "I", "I", { ltr: true, weight: 800, textColor: C.muted }), text("g2", 16, 146, "II", "II", { ltr: true, weight: 800, textColor: C.muted }), text("g3", 16, 236, "III", "III", { ltr: true, weight: 800, textColor: C.muted }),
  text("l_mom", 80, 280, "via mother: all children", "דרך האם: כל הילדים", { weight: 700, textColor: "#b91c1c" }),
  text("l_dad", 320, 280, "via father: none", "דרך האב: אף אחד", { weight: 700, textColor: C.muted }),
];

const s4: El[] = [
  ...mitochondrion("mtA", 250, 110, 80, 44, {}, 0.3, 4),
  ...mitochondrion("mtB", 290, 210, 80, 44, {}, 0.3, 4),
  ring("dnaA", 240, 110, 12), ring("dnaB", 290, 210, 12),
  circle("nuc", 70, 150, 50, "#e0e7ff", { stroke: "#4338ca", strokeWidth: 2.5 }),
  text("nuc_t", 70, 156, "Nucleus", "גרעין", { weight: 700, textColor: "#3730a3" }),
  arrow("imp", 124, 140, 176, 118, "#4338ca", 2.4), arrow("imp2", 124, 166, 216, 200, "#4338ca", 2.4),
  label("l_imp", 8, 262, "~1,000+ nuclear-encoded proteins imported", "רוב החלבונים מקודדים בגרעין ומיובאים", [150, 128], { anchor: "start", shortHe: "יבוא חלבונים", short: "Protein import" }),
  label("l_fis", 200, 290, "Divides by fission", "מתחלקת בביקוע", [270, 160], { anchor: "start" }),
  label("l_own", 300, 40, "Own DNA", "DNA עצמי", [246, 104], { anchor: "start" }),
];

const cell = (p: string, cx: number, nMut: number, seed: number): El[] => {
  const pts = scatter(12, cx, 130, 50, seed);
  return [
    circle(`${p}`, cx, 130, 56, "#f0fdf4", { stroke: "#16a34a", strokeWidth: 2 }),
    ...pts.map(([x, y], i) => mini(`${p}_m${i}`, x, y, i < nMut ? MUT : MT)),
  ];
};
const s5: El[] = [
  ...cell("ca", 70, 1, 3), ...cell("cb", 200, 6, 5), ...cell("cc", 330, 11, 11),
  text("pa", 70, 212, "~10% mutant", "כ-10% מוטנטי", { weight: 700 }),
  text("pb", 200, 212, "~50%", "~50%", { ltr: true, weight: 700 }),
  text("pc", 330, 212, "~90%", "~90%", { ltr: true, weight: 700, textColor: MUT }),
  line("thr", 265, 60, 265, 222, MUT, 2, { dash: "5 4" }),
  text("thr_t", 265, 46, "threshold → symptoms", "סף ← הופעת תסמינים", { textColor: MUT, weight: 700, short: "threshold", shortHe: "סף" }),
  text("ex", 200, 256, "e.g. LHON, MELAS · brain, muscle", "למשל LHON, MELAS · מוח ושריר", { textColor: C.muted }),
  text("het", 200, 284, "Heteroplasmy: mixed mtDNA", "הטרופלסמיה: תערובת של mtDNA", { weight: 700 }),
];

export const mitoInheritance: ProcessScene = {
  slug: "mitochondrial-inheritance-animation-1780786394329",
  legend: [
    { color: MTS, he: "מיטוכונדריה", en: "Mitochondrion", swatch: "ring" },
    { color: "#1d4ed8", he: "mtDNA מעגלי", en: "Circular mtDNA", swatch: "ring" },
    { color: MUT, he: "מיטוכונדריה עם mtDNA מוטנטי / פרט חולה", en: "Mutant mtDNA / affected", swatch: "dot" },
  ],
  steps: [
    {
      titleHe: "DNA מיטוכונדריאלי", titleEn: "Mitochondrial DNA",
      descHe: "למיטוכונדריה גנום משלה: מולקולת DNA מעגלית קטנה (באדם 16,569 זוגות בסיסים) עם 37 גנים — 13 חלבונים של הזרחון החמצוני, 22 tRNA ו-2 rRNA. בכל מיטוכונדריה כמה עותקים, ובכל תא מאות עד אלפי עותקים. למיטוכונדריה גם ריבוזומים משלה.",
      descEn: "Mitochondria have their own genome: a small circular DNA (16,569 base pairs in humans) with 37 genes — 13 oxidative-phosphorylation proteins, 22 tRNAs and 2 rRNAs. Each mitochondrion holds several copies, and each cell hundreds to thousands. Mitochondria also have their own ribosomes.",
      elements: s1,
    },
    {
      titleHe: "הביצית מורישה את המיטוכונדריות", titleEn: "The Egg Passes On the Mitochondria",
      descHe: "בהפריה הביצית תורמת את כמעט כל הציטופלזמה — כולל יותר מ-100,000 מיטוכונדריות. לזרעון מעט מיטוכונדריות בחלק האמצעי, והן מסומנות ומפורקות בביצית המופרית זמן קצר אחרי ההפריה. לכן ה-mtDNA של העובר מגיע כמעט תמיד מהאם בלבד.",
      descEn: "At fertilisation the egg supplies almost all the cytoplasm — including over 100,000 mitochondria. The sperm has only a few, in its mid-piece, and they are tagged and destroyed in the zygote soon after fertilisation. So the embryo's mtDNA comes almost always from the mother alone.",
      elements: s2,
    },
    {
      titleHe: "דגם תורשה אימהי באילן יוחסין", titleEn: "Maternal Inheritance in a Pedigree",
      descHe: "תכונה מיטוכונדריאלית עוברת מאם לכל ילדיה — בנים ובנות — אבל רק הבנות מעבירות אותה הלאה. אב חולה אינו מוריש אותה לאף אחד מילדיו. זה מבדיל תורשה מיטוכונדריאלית מתורשה הקשורה ל-X (שבה אב מוריש לכל בנותיו).",
      descEn: "A mitochondrial trait passes from a mother to all her children — sons and daughters — but only daughters pass it on. An affected father passes it to none of his children. This distinguishes mitochondrial inheritance from X-linked inheritance (where a father passes to all his daughters).",
      elements: s3,
    },
    {
      titleHe: "המיטוכונדריה — אברון חצי-אוטונומי", titleEn: "A Semi-Autonomous Organelle",
      descHe: "המיטוכונדריה מתחלקת בביקוע ומשכפלת ומבטאת את ה-DNA שלה — עדות למוצא אנדוסימביוטי מחיידק. אבל היא רק חצי-אוטונומית: רוב חלבוניה (יותר מ-1,000) מקודדים בגנום הגרעיני, מתורגמים בציטוזול ומיובאים דרך הממברנות (קומפלקסי TOM/TIM).",
      descEn: "Mitochondria divide by fission and replicate and express their own DNA — evidence of an endosymbiotic, bacterial origin. But they are only semi-autonomous: most of their proteins (over 1,000) are encoded in the nuclear genome, made in the cytosol and imported across the membranes (TOM/TIM complexes).",
      elements: s4,
    },
    {
      titleHe: "הטרופלסמיה ומחלות מיטוכונדריאליות", titleEn: "Heteroplasmy and Mitochondrial Disease",
      descHe: "בתא יכולים להתקיים יחד mtDNA תקין ומוטנטי (הטרופלסמיה), והיחס ביניהם משתנה בין תאים, רקמות ודורות. תסמינים מופיעים כשהשיעור המוטנטי עובר סף, בעיקר ברקמות תלויות-אנרגיה כמו מוח, שריר ורשתית. דוגמאות: LHON (עיוורון עצב הראייה) ו-MELAS.",
      descEn: "A cell can hold both normal and mutant mtDNA (heteroplasmy), and the ratio varies between cells, tissues and generations. Symptoms appear when the mutant fraction passes a threshold, mainly in energy-hungry tissues such as brain, muscle and retina. Examples: LHON (optic-nerve blindness) and MELAS.",
      elements: s5,
    },
  ],
};
