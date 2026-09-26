import { C, arrow, circle, label, line, path, rect, ring, segments, smooth, tag, text, type El, type ProcessScene, type Pt } from "./kit";

/* ── Molecular recognition (RNA aptamer ↔ ligand) ─────────────────── */
const OPEN: Pt[] = [[112, 112], [124, 168], [148, 210], [174, 232], [200, 238], [226, 232], [252, 210], [276, 168], [288, 112]];
const CLOSED: Pt[] = [[168, 112], [142, 150], [150, 200], [174, 226], [200, 232], [226, 226], [250, 200], [258, 150], [232, 112]];
// base stubs pointing into the pocket from the RNA backbone
const stubs = (pts: Pt[]) => segments(pts.slice(1, -1).map(([x, y]) => {
  const dx = 200 - x, dy = 175 - y, L = Math.hypot(dx, dy);
  return [[x, y], [x + (dx / L) * 12, y + (dy / L) * 12]] as [Pt, Pt];
}));
const rna = (pts: Pt[]): El[] => [
  path("rna", smooth(pts), { stroke: C.rna, strokeWidth: 6 }),
  path("bases", stubs(pts), { stroke: "#34d399", strokeWidth: 3 }),
];
// purine-like ligand: fused 6- and 5-membered rings
const ligand = (cx: number, cy: number): El[] => [
  path("lig6", ring(cx - 9, cy, 15, 6, 0), { color: "#fde68a", stroke: "#b45309", strokeWidth: 2 }),
  path("lig5", ring(cx + 16, cy, 12, 5, 180), { color: "#fde68a", stroke: "#b45309", strokeWidth: 2 }),
];
const decoys = (o: Partial<El> = {}): El[] => [
  path("dec1", "M 312 56 L 334 94 L 290 94 Z", { color: "#e2e8f0", stroke: "#64748b", strokeWidth: 2, ...o }),
  rect("dec2", 320, 200, 36, 36, "#e2e8f0", { rx: 3, stroke: "#64748b", strokeWidth: 2, ...o }),
  circle("dec3", 60, 230, 17, "#e2e8f0", { stroke: "#64748b", strokeWidth: 2, ...o }),
];
const r1: El[] = [
  ...rna(OPEN), ...ligand(90, 60), ...decoys(),
  label("l_rna", 8, 290, "RNA aptamer: binding pocket", "אפטמר RNA — כיס קישור", [148, 210], { anchor: "start", shortHe: "כיס קישור", short: "Pocket" }),
  label("l_lig", 130, 34, "Ligand", "ליגנד", [98, 50], { anchor: "start" }),
  label("l_dec", 220, 280, "Other molecules", "מולקולות אחרות", [330, 208], { anchor: "start" }),
];
const HB = (id: string, a: Pt, b: Pt) => line(id, a[0], a[1], b[0], b[1], "#0ea5e9", 2, { dash: "3 3" });
const r2: El[] = [
  ...rna(OPEN), ...ligand(200, 180), ...decoys(),
  HB("hb1", [162, 190], [178, 184]), HB("hb2", [200, 220], [196, 196]), HB("hb3", [238, 190], [226, 182]),
  circle("mg", 244, 150, 9, "#a3e635", { stroke: "#3f6212", strokeWidth: 1.5 }),
  text("mg_t", 262, 136, "Mg²⁺", "Mg²⁺", { ltr: true, weight: 700, anchor: "start", textColor: "#3f6212" }),
  label("l_hb", 8, 60, "H-bonds, base stacking", "קשרי מימן והערמת בסיסים", [170, 186], { anchor: "start", shortHe: "קשרי מימן", short: "H-bonds" }),
  text("l_weak", 200, 290, "many weak non-covalent bonds", "הרבה קשרים חלשים לא-קוולנטיים", { weight: 700, short: "weak bonds add up", shortHe: "קשרים חלשים" }),
];
const r3: El[] = [
  ...rna(CLOSED), ...ligand(200, 180), ...decoys({ opacity: 0.5 }),
  HB("hb1", [160, 186], [178, 184]), HB("hb2", [200, 216], [196, 196]), HB("hb3", [240, 186], [226, 182]),
  circle("mg", 236, 136, 9, "#a3e635", { stroke: "#3f6212", strokeWidth: 1.5 }),
  text("mg_t", 254, 124, "Mg²⁺", "Mg²⁺", { ltr: true, weight: 700, anchor: "start", textColor: "#3f6212" }),
  label("l_fit", 8, 60, "Induced fit: pocket closes", "התאמה מושרית — הכיס נסגר", [150, 132], { anchor: "start", shortHe: "התאמה מושרית", short: "Induced fit" }),
  text("l_kd", 200, 290, "specific, high affinity (low Kd)", "ספציפי ובזיקה גבוהה (Kd נמוך)", { weight: 700, short: "high affinity", shortHe: "זיקה גבוהה" }),
];

export const recognition: ProcessScene = {
  slug: "molecular-recognition-animation",
  legend: [
    { color: C.rna, he: "RNA (שלד ובסיסים)", en: "RNA (backbone and bases)", swatch: "line" },
    { color: "#b45309", he: "ליגנד", en: "Ligand", swatch: "ring" },
    { color: "#0ea5e9", he: "קשר מימן", en: "Hydrogen bond", swatch: "dash" },
  ],
  steps: [
    {
      titleHe: "צורה משלימה", titleEn: "Complementary Shape",
      descHe: "זיהוי מולקולרי מבוסס על התאמה בין משטחים: RNA מתקפל למבנה תלת-ממדי (אפטמר) עם כיס שצורתו ופיזור המטענים בו משלימים לליגנד מסוים. מולקולות אחרות בסביבה אינן מתאימות — ולכן לא נקשרות ביציבות.",
      descEn: "Molecular recognition relies on matching surfaces: an RNA folds into a 3D structure (an aptamer) with a pocket whose shape and charge pattern complement one particular ligand. Other molecules nearby do not fit — so they do not bind stably.",
      elements: r1,
    },
    {
      titleHe: "קשרים לא-קוולנטיים", titleEn: "Non-Covalent Interactions",
      descHe: "הליגנד נאחז בכיס בעזרת קשרים חלשים רבים: קשרי מימן לבסיסים, הערמה (stacking) בין טבעות, כוחות ואן דר ואלס ומשיכה אלקטרוסטטית — לעתים דרך יוני Mg²⁺ המנטרלים את מטען הפוספטים. כל קשר חלש, אבל יחד הם יוצרים קישור יציב והפיך.",
      descEn: "The ligand is held in the pocket by many weak bonds: hydrogen bonds to bases, stacking between rings, van der Waals contacts and electrostatic attraction — often via Mg²⁺ ions that neutralise the phosphates. Each bond is weak, but together they give stable, reversible binding.",
      elements: r2,
    },
    {
      titleHe: "התאמה מושרית", titleEn: "Induced Fit",
      descHe: "הקישור משנה את מבנה ה-RNA: חלקים גמישים של הכיס נסגרים סביב הליגנד (התאמה מושרית), מוסיפים מגעים ומייצבים את הקומפלקס. כך מתקבלת ספציפיות גבוהה וזיקה גבוהה (Kd נמוך) — וזה הבסיס לפעולת ריבוסוויצ'ים.",
      descEn: "Binding changes the RNA's structure: flexible parts of the pocket close around the ligand (induced fit), adding contacts and stabilising the complex. This gives high specificity and high affinity (low Kd) — the basis of how riboswitches work.",
      elements: r3,
    },
  ],
};

/* ── Riboswitches (bacterial 5'UTR) ───────────────────────────────── */
const Y = 230;
// hairpin: stem from x to x + w standing on the strand, loop on top
const hairpin = (id: string, x: number, w: number, h: number, color: string, o: Partial<El> = {}): El[] => {
  const r = w / 2, rungs: [Pt, Pt][] = [];
  for (let y = Y - 8; y > Y - h + 4; y -= 9) rungs.push([[x + 2, y], [x + w - 2, y]]);
  return [
    path(`${id}_r`, segments(rungs), { stroke: "#cbd5e1", strokeWidth: 2, ...o }),
    path(id, `M ${x} ${Y} L ${x} ${Y - h} A ${r} ${r} 0 1 1 ${x + w} ${Y - h} L ${x + w} ${Y}`, { stroke: color, strokeWidth: 4, ...o }),
  ];
};
const strand = (): El[] => [
  line("m", 14, Y, 386, Y, C.rna, 4),
  tag("m5", 14, Y + 26, "5'"), tag("m3", 384, Y + 26, "3'"),
  rect("cds", 320, Y - 9, 62, 18, "#bbf7d0", { rx: 3, stroke: "#15803d", strokeWidth: 1.5 }),
];
const aptamer = (o: Partial<El> = {}): El[] => [...hairpin("ap1", 40, 26, 70, "#0d9488", o), ...hairpin("ap2", 90, 26, 96, "#0d9488", o), ...hairpin("ap3", 140, 26, 60, "#0d9488", o)];
const antiT = (o: Partial<El> = {}) => hairpin("anti", 200, 30, 54, "#2563eb", o);
const termT = (o: Partial<El> = {}): El[] => [...hairpin("term", 240, 30, 80, "#dc2626", o), text("utract", 300, Y + 24, "UUUUUU", "UUUUUU", { ltr: true, weight: 700, textColor: "#dc2626", ...o })];
const tpp = (x: number, y: number) => path("tpp", `M ${x} ${y - 12} L ${x + 12} ${y} L ${x} ${y + 12} L ${x - 12} ${y} Z`, { color: "#f59e0b", stroke: "#92400e", strokeWidth: 2 });
const rnap = (cx: number, o: Partial<El> = {}) =>
  path("rnap", `M ${cx - 26} ${Y + 4} C ${cx - 30} ${Y - 36} ${cx + 30} ${Y - 36} ${cx + 26} ${Y + 4} C ${cx + 30} ${Y + 34} ${cx - 30} ${Y + 34} ${cx - 26} ${Y + 4} Z`, { color: "#bfdbfe", fillOpacity: 0.7, stroke: "#1d4ed8", strokeWidth: 2, ...o });

const w1: El[] = [
  ...strand(), ...aptamer(), ...antiT(), ...termT({ opacity: 0 }), { ...tpp(60, 40), opacity: 0 },
  label("l_apt", 16, 60, "Aptamer (senses metabolite)", "תחום אפטמר — חיישן", [103, 130], { anchor: "start", shortHe: "אפטמר", short: "Aptamer" }),
  label("l_exp", 190, 90, "Expression platform", "פלטפורמת ביטוי", [215, 160], { anchor: "start" }),
  text("l_utr", 110, Y + 28, "5'UTR", "5'UTR", { ltr: true, weight: 700, textColor: C.muted }),
  text("l_cds", 351, Y - 18, "gene", "גן", { weight: 700, textColor: "#15803d" }),
];
const w2: El[] = [
  ...strand(), ...aptamer(), ...antiT(), tpp(103, 150),
  label("l_tpp", 170, 50, "Metabolite (e.g. TPP)", "מטבוליט (למשל TPP)", [110, 146], { anchor: "start" }),
  text("l_spec", 200, 290, "binds only its own metabolite", "נקשר רק למטבוליט הספציפי", { textColor: C.muted }),
];
const w3: El[] = [
  ...strand(), ...aptamer(), ...antiT({ opacity: 0 }), ...termT(), tpp(103, 150),
  label("l_sw", 150, 40, "Platform refolds", "הפלטפורמה מתקפלת מחדש", [255, 140], { anchor: "start", shortHe: "קיפול מחדש", short: "Refolds" }),
  label("l_term", 280, 110, "Terminator", "טרמינטור", [270, 180], { anchor: "start" }),
];
const w4: El[] = [
  ...strand(), ...aptamer({ opacity: 0.5 }), ...termT(), tpp(103, 150),
  rnap(320, { opacity: 0.6, dash: "5 4" }),
  arrow("off", 330, 180, 360, 130, "#1d4ed8", 2.4),
  label("l_off", 120, 40, "RNA polymerase falls off: OFF", "RNA פולימראז מתנתק — כבוי", [322, 194], { anchor: "start", shortHe: "שעתוק נעצר", short: "OFF" }),
  text("l_hp", 200, 290, "hairpin + U-tract = intrinsic termination", "גבעול-לולאה + רצף U = סיום שעתוק", { textColor: C.muted, short: "early termination", shortHe: "סיום מוקדם" }),
];
// translational control: Shine-Dalgarno hidden in a stem when metabolite is bound
const w5: El[] = [
  ...strand(), ...aptamer({ opacity: 0.5 }), tpp(103, 150),
  ...hairpin("sdhp", 236, 34, 62, "#7c3aed"),
  rect("sd", 232, Y - 56, 12, 44, "#f5d0fe", { rx: 3, stroke: "#a21caf", strokeWidth: 1.5 }),
  path("s30", "M 300 108 C 300 84 360 84 360 108 C 360 128 300 128 300 108 Z", { color: "#dbeafe", stroke: "#1d4ed8", strokeWidth: 2 }),
  line("nx1", 316, 136, 340, 160, "#b91c1c", 3), line("nx2", 340, 136, 316, 160, "#b91c1c", 3),
  text("s30_t", 330, 76, "30S", "30S", { ltr: true, weight: 700, textColor: "#1d4ed8" }),
  label("l_sd", 20, 50, "Shine-Dalgarno hidden in a stem", "רצף SD מוסתר בגבעול", [238, 190], { anchor: "start", shortHe: "SD מוסתר", short: "SD hidden" }),
  text("l_on", 200, 290, "no metabolite → SD exposed → translation ON", "בלי מטבוליט: SD חשוף ← תרגום (דולק)", { weight: 700, textColor: "#15803d", short: "no ligand → ON", shortHe: "בלי ליגנד ← דולק" }),
];
// feedback loop: gene → enzymes → metabolite ⊣ riboswitch
const box = (id: string, cx: number, cy: number, en: string, he: string, color: string): El[] => [
  rect(`${id}_b`, cx - 62, cy - 20, 124, 40, "#ffffff", { rx: 10, stroke: color, strokeWidth: 2.2 }),
  text(`${id}_t`, cx, cy + 6, en, he, { weight: 700, textColor: color, halo: false }),
];
const w6: El[] = [
  ...box("fg", 90, 70, "thi genes", "גני thi", "#15803d"),
  ...box("fe", 310, 70, "enzymes", "אנזימים", "#0369a1"),
  ...box("fm", 310, 210, "TPP", "TPP", "#b45309"),
  ...box("fr", 90, 210, "riboswitch", "ריבוסוויץ'", "#0d9488"),
  arrow("f1", 156, 70, 244, 70, C.line, 2.4), arrow("f2", 310, 92, 310, 186, C.line, 2.4),
  arrow("f3", 244, 210, 156, 210, "#dc2626", 2.6),
  line("f4a", 90, 188, 90, 96, "#dc2626", 2.6), line("f4b", 78, 96, 102, 96, "#dc2626", 3),
  text("minus", 104, 150, "−", "−", { ltr: true, weight: 800, textColor: "#dc2626", fontSize: 22, anchor: "start" }),
  text("l_fb", 200, 270, "Negative feedback: product turns its genes off", "משוב שלילי: התוצר מכבה את הגנים שלו", { weight: 700, textColor: "#dc2626", short: "Negative feedback", shortHe: "משוב שלילי" }),
];

export const riboswitch: ProcessScene = {
  slug: "riboswitches-animation-1780833787341",
  legend: [
    { color: "#0d9488", he: "תחום אפטמר", en: "Aptamer domain", swatch: "line" },
    { color: "#2563eb", he: "אנטי-טרמינטור", en: "Anti-terminator", swatch: "line" },
    { color: "#dc2626", he: "טרמינטור / עיכוב", en: "Terminator / inhibition", swatch: "line" },
    { color: "#f59e0b", he: "מטבוליט", en: "Metabolite", swatch: "dot" },
  ],
  steps: [
    {
      titleHe: "מבנה: אפטמר ופלטפורמת ביטוי", titleEn: "Structure: Aptamer and Expression Platform",
      descHe: "ריבוסוויץ' הוא רצף בקצה ה-5' הלא-מתורגם (5'UTR) של mRNA, בעיקר בחיידקים. יש לו שני חלקים: תחום אפטמר, שמתקפל לכיס קישור למטבוליט מסוים, ופלטפורמת ביטוי, שיכולה להתקפל לאחד משני מבנים חלופיים שקובעים אם הגן יבוטא.",
      descEn: "A riboswitch is a sequence in the 5' untranslated region (5'UTR) of an mRNA, mostly in bacteria. It has two parts: an aptamer domain that folds into a binding pocket for a specific metabolite, and an expression platform that can fold into one of two alternative structures that decide whether the gene is expressed.",
      elements: w1,
    },
    {
      titleHe: "קישור המטבוליט לאפטמר", titleEn: "Metabolite Binds the Aptamer",
      descHe: "כשריכוז המטבוליט בתא גבוה, הוא נקשר לאפטמר בספציפיות גבוהה — למשל ריבוסוויץ' TPP מבחין בין תיאמין-פירופוספט לבין תיאמין ללא פוספטים. אין צורך בחלבון בקרה: ה-RNA עצמו הוא החיישן.",
      descEn: "When the metabolite is abundant, it binds the aptamer with high specificity — the TPP riboswitch, for example, distinguishes thiamine pyrophosphate from unphosphorylated thiamine. No regulatory protein is needed: the RNA itself is the sensor.",
      elements: w2,
    },
    {
      titleHe: "שינוי מבנה בפלטפורמת הביטוי", titleEn: "The Expression Platform Switches Fold",
      descHe: "הקישור מייצב את מבנה האפטמר, והרצף המשותף לשני המבנים החלופיים נלכד. בגלל זה פלטפורמת הביטוי לא יכולה ליצור את האנטי-טרמינטור, ובמקומו נוצר גבעול-לולאה חלופי — טרמינטור (או גבעול שמסתיר את אתר קשירת הריבוזום).",
      descEn: "Binding stabilises the aptamer fold and traps the sequence shared by the two alternative structures. The expression platform can then no longer form the anti-terminator, and an alternative hairpin forms instead — a terminator (or a stem that hides the ribosome-binding site).",
      elements: w3,
    },
    {
      titleHe: "כיבוי ברמת השעתוק", titleEn: "Switching Off Transcription",
      descHe: "טרמינטור — גבעול-לולאה עשיר ב-GC שאחריו רצף של U — גורם ל-RNA פולימראז להתנתק מה-DNA לפני שהגן שועתק (סיום שעתוק עצמאי). כשהמטבוליט חסר, נוצר האנטי-טרמינטור, והפולימראז ממשיך אל הגן.",
      descEn: "A terminator — a GC-rich hairpin followed by a run of U — makes RNA polymerase release the DNA before the gene is transcribed (intrinsic termination). When the metabolite is scarce, the anti-terminator forms and the polymerase continues into the gene.",
      elements: w4,
    },
    {
      titleHe: "כיבוי ברמת התרגום", titleEn: "Switching Off Translation",
      descHe: "בריבוסוויצ'ים אחרים הקישור גורם לרצף שיין-דלגרנו (אתר קשירת הריבוזום) להיכלא בגבעול, ותת-היחידה 30S לא יכולה להתחיל תרגום. בלי מטבוליט ה-SD חשוף והגן מתורגם (מצב ON).",
      descEn: "In other riboswitches, binding traps the Shine-Dalgarno sequence (the ribosome-binding site) in a stem, so the 30S subunit cannot start translation. Without the metabolite the SD is exposed and the gene is translated (ON).",
      elements: w5,
    },
    {
      titleHe: "משוב שלילי: התוצר מכבה את הגנים שלו", titleEn: "Negative Feedback: The Product Turns Off Its Own Genes",
      descHe: "ריבוסוויצ'ים נמצאים בדרך כלל לפני גנים שמייצרים או מובילים את אותו מטבוליט: TPP מכבה את גני סינתזת התיאמין (thi), וליזין מכבה את lysC ב-B. subtilis. כשיש מספיק תוצר, הייצור נעצר. ריבוסוויץ' TPP הוא היחיד הידוע גם באאוקריוטים (בצמחים ובפטריות, דרך שחבור חלופי).",
      descEn: "Riboswitches usually sit in front of genes that make or import the same metabolite: TPP turns off thiamine-synthesis (thi) genes, and lysine turns off lysC in B. subtilis. When there is enough product, production stops. The TPP riboswitch is the only one also known in eukaryotes (plants and fungi, via alternative splicing).",
      elements: w6,
    },
  ],
};
