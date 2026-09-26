import { C, arrow, circle, gone, label, line, path, poly, rect, segments, smooth, tag, text, type El, type ProcessScene, type Pt } from "./kit";

// Gene drawn left → right: coding (non-template) strand on top, 5'→3';
// template strand below, 3'→5'. RNA polymerase II moves right, reading the
// template 3'→5' and making RNA 5'→3'.
const Y = 176, G = 16;
const XS = Array.from({ length: 39 }, (_, i) => 10 + i * 10);

function dna(bx: number, open: number): El[] {
  const bump = (x: number) => open * Math.exp(-(((x - bx) / 22) ** 2));
  const top: Pt[] = XS.map((x) => [x, Y - G / 2 - bump(x)]);
  const bot: Pt[] = XS.map((x) => [x, Y + G / 2 + bump(x)]);
  // base stubs: meet in the middle where paired, stick inward where the bubble is open
  const stubs: [Pt, Pt][] = [];
  XS.forEach((x, i) => {
    if (i === 0) return;
    const b = bump(x), paired = b < 3;
    stubs.push([top[i], [x, paired ? Y : top[i][1] + 5]]);
    stubs.push([bot[i], [x, paired ? Y : bot[i][1] - 5]]);
  });
  return [
    path("d_st", segments(stubs), { stroke: C.rung, strokeWidth: 2 }),
    path("d_top", smooth(top), { stroke: C.dnaB, strokeWidth: 4 }),
    path("d_bot", smooth(bot), { stroke: C.dnaA, strokeWidth: 4 }),
    tag("d5", 16, Y - 16, "5'"), tag("d3", 386, Y - 16, "3'"),
    tag("d3b", 16, Y + 30, "3'"), tag("d5b", 386, Y + 30, "5'"),
  ];
}

// RNA polymerase II: large two-lobed enzyme with the DNA in its cleft
const pol = (cx: number, o: Partial<El> = {}) =>
  path("pol", smooth([[cx - 40, Y - 2], [cx - 36, Y - 30], [cx - 12, Y - 44], [cx + 18, Y - 42], [cx + 40, Y - 24], [cx + 42, Y + 8], [cx + 30, Y + 34], [cx + 4, Y + 42], [cx - 24, Y + 36], [cx - 42, Y + 18]], true, 0.6),
    { color: "#93c5fd", fillOpacity: 0.55, stroke: "#1d4ed8", strokeWidth: 2.2, ...o });

// RNA from the active site (on the template, inside the bubble) out of the enzyme, 5' end with cap last point
function rna(site: number, pts: Pt[], o: Partial<El> = {}): El[] {
  const all: Pt[] = [[site + 10, Y + 12], [site - 10, Y + 13], ...pts];
  const end = all[all.length - 1];
  return [
    path("rna", smooth(all), { stroke: C.rna, strokeWidth: 4, ...o }),
    circle("cap", end[0], end[1], 6.5, "#065f46", { stroke: "#fff", strokeWidth: 1.5, opacity: o.opacity ?? 1 }),
  ];
}

const tata = rect("tata", 70, Y - 11, 34, 22, "#fde68a", { rx: 4, stroke: "#b45309", strokeWidth: 1.5, fillOpacity: 0.6 });
const tfiid = path("tfiid", smooth([[64, Y - 10], [66, Y - 32], [86, Y - 40], [106, Y - 32], [108, Y - 10]], false) + " Z", { color: "#c4b5fd", stroke: "#6d28d9", strokeWidth: 2 });
const gtf = path("gtf", smooth([[108, Y + 10], [112, Y + 30], [126, Y + 36], [140, Y + 28], [136, Y + 10]], false) + " Z", { color: "#ddd6fe", stroke: "#6d28d9", strokeWidth: 1.8 });
const pas = rect("pas", 286, Y - 11, 26, 22, "#fecaca", { rx: 4, stroke: "#b91c1c", strokeWidth: 1.5, fillOpacity: 0.7 });

const step1: El[] = [
  ...dna(160, 9),
  tata, tfiid, gtf, pol(166),
  ...gone(rna(166, [[150, Y + 18], [146, Y + 20], [144, Y + 21], [142, Y + 22], [140, Y + 23]])),
  ...gone([pas]),
  line("tss", 160, Y + 48, 160, Y + 60, C.ink, 2),
  arrow("dir", 160, Y + 60, 200, Y + 60, C.ink, 2.2),
  text("tss_t", 150, Y + 78, "+1", "+1", { ltr: true, weight: 700 }),
  label("l_tata", 8, 248, "Promoter: TATA box", "פרומוטור: תיבת TATA", [84, Y + 10], { anchor: "start", shortHe: "תיבת TATA", short: "TATA box" }),
  label("l_tfiid", 8, 110, "TFIID (TBP)", "TFIID (TBP)", [84, Y - 30], { anchor: "start", ltr: true }),
  label("l_pol", 230, 70, "RNA polymerase II", "RNA פולימראז II", [184, Y - 34], { anchor: "start" }),
  label("l_gtf", 150, 290, "General transcription factors", "גורמי שעתוק כלליים", [122, Y + 30], { anchor: "start", shortHe: "גורמי שעתוק", short: "GTFs" }),
  text("l_dir", 210, Y + 66, "direction", "כיוון השעתוק", { anchor: "start", textColor: C.muted }),
];

const RNA2: Pt[] = [[228, Y + 30], [206, Y + 52], [176, Y + 70], [150, Y + 80], [128, Y + 86]];
const step2: El[] = [
  ...dna(262, 12),
  tata, { ...tfiid, opacity: 0.5 }, gone([gtf])[0],
  pol(268),
  ...rna(268, RNA2),
  gone([pas])[0],
  ...gone([line("tss", 160, Y + 48, 160, Y + 60), arrow("dir", 160, Y + 60, 200, Y + 60), text("tss_t", 150, Y + 78, "+1", "+1")]),
  label("l_tpl", 220, 272, "Template read 3'→5'", "התבנית נקראת 3'→5'", [300, Y + 10], { anchor: "start", shortHe: "תבנית 3'→5'", short: "template 3'→5'" }),
  label("l_rna", 8, 226, "RNA made 5'→3'", "RNA נבנה 5'→3'", [184, Y + 64], { anchor: "start", shortHe: "נבנה 5'→3'", short: "RNA 5'→3'" }),
  label("l_cap", 8, 292, "5' cap added early", "כובע 5' נוסף מוקדם", [128, Y + 86], { anchor: "start", shortHe: "כובע 5'", short: "5' cap" }),
  label("l_bub", 214, 60, "Transcription bubble", "בועת שעתוק", [262, Y - 16], { anchor: "start" }),
  tag("r5", 110, Y + 92, "5'"),
];

const step3: El[] = [
  ...dna(352, 10),
  tata, { ...tfiid, opacity: 0.35 }, pas,
  pol(356, { opacity: 0.55, dash: "5 4" }),
  // cleaved pre-mRNA: the 3' end is now free (cut ~10-35 nt past AAUAAA) and gets a poly(A) tail
  path("rna", smooth([[300, Y + 60], [290, Y + 70], [262, Y + 82], [206, Y + 94], [150, Y + 98], [110, Y + 99], [80, Y + 99]]), { stroke: C.rna, strokeWidth: 4 }),
  circle("cap", 80, Y + 99, 6.5, "#065f46", { stroke: "#fff", strokeWidth: 1.5 }),
  text("polyA", 306, Y + 66, "AAAA…", "AAAA…", { anchor: "start", ltr: true, weight: 700, textColor: "#047857" }),
  path("frag", smooth([[362, Y + 12], [344, Y + 22], [328, Y + 32]]), { stroke: C.rna, strokeWidth: 3, dash: "4 3" }),
  line("cut1", 316, Y + 30, 330, Y + 44, "#b91c1c", 2.5), line("cut2", 330, Y + 30, 316, Y + 44, "#b91c1c", 2.5),
  label("l_pas", 150, 44, "Poly(A) signal (AAUAAA)", "אות פוליאדנילציה AAUAAA", [298, Y - 10], { anchor: "start", shortHe: "AAUAAA", short: "AAUAAA" }),
  label("l_cut", 346, 276, "Cleavage", "חיתוך", [324, Y + 40], { anchor: "start" }),
  label("l_pa", 190, 292, "Poly(A) tail", "זנב פולי-A", [330, Y + 72], { anchor: "start" }),
  label("l_poloff", 300, 100, "Pol II releases", "הפולימראז משתחרר", [370, Y - 30], { anchor: "start", shortHe: "משתחרר", short: "releases" }),
  tag("r5", 66, Y + 124, "5'"), tag("r3", 372, Y + 66, "3'"),
];

// pre-mRNA → mature mRNA (exons joined, introns removed)
const EX = ["#34d399", "#10b981", "#059669"];
const pre = (y: number): El[] => [
  circle("p_cap", 26, y, 7, "#065f46", { stroke: "#fff", strokeWidth: 1.5 }),
  rect("p_e1", 34, y - 9, 70, 18, EX[0], { rx: 3 }),
  path("p_i1", smooth([[104, y], [124, y - 2], [140, y - 26], [156, y - 2], [176, y]]), { stroke: "#94a3b8", strokeWidth: 3 }),
  rect("p_e2", 176, y - 9, 60, 18, EX[1], { rx: 3 }),
  path("p_i2", `M 236 ${y} L 282 ${y}`, { stroke: "#94a3b8", strokeWidth: 3 }),
  rect("p_e3", 282, y - 9, 56, 18, EX[2], { rx: 3 }),
  text("p_pa", 344, y + 6, "AAAA", "AAAA", { anchor: "start", ltr: true, weight: 700, textColor: "#047857" }),
];
const mature = (y: number, x0 = 60): El[] => [
  circle("m_cap", x0 - 8, y, 7, "#065f46", { stroke: "#fff", strokeWidth: 1.5 }),
  rect("m_e1", x0, y - 9, 70, 18, EX[0], { rx: 3 }),
  rect("m_e2", x0 + 70, y - 9, 60, 18, EX[1], { rx: 3 }),
  rect("m_e3", x0 + 130, y - 9, 56, 18, EX[2], { rx: 3 }),
  text("m_pa", x0 + 192, y + 6, "AAAA", "AAAA", { anchor: "start", ltr: true, weight: 700, textColor: "#047857" }),
];
const spliceosome = path("splc", smooth([[112, 104], [118, 72], [140, 60], [162, 72], [168, 104], [140, 116]], true), { color: "#fbcfe8", fillOpacity: 0.6, stroke: "#be185d", strokeWidth: 2 });

const hideDNA = gone([...dna(352, 10), tata, tfiid, pas, pol(356), line("cut1", 316, Y + 30, 330, Y + 44), line("cut2", 330, Y + 30, 316, Y + 44),
  path("frag", smooth([[362, Y + 12], [344, Y + 22], [328, Y + 32]])), text("polyA", 306, Y + 66, "AAAA…", "AAAA…"),
  path("rna", smooth([[300, Y + 60], [290, Y + 70], [262, Y + 82], [206, Y + 94], [150, Y + 98], [110, Y + 99], [80, Y + 99]])), circle("cap", 80, Y + 99, 6.5, "#065f46")]);

const step4: El[] = [
  ...hideDNA,
  ...pre(104),
  spliceosome,
  arrow("p_arr", 200, 140, 200, 184, C.line, 2.4),
  ...mature(220),
  label("l_ex", 20, 50, "Exon", "אקסון", [70, 96], { anchor: "start" }),
  label("l_in", 230, 44, "Intron (lariat)", "אינטרון (לולאה)", [148, 84], { anchor: "start", shortHe: "אינטרון", short: "Intron" }),
  label("l_sp", 230, 80, "Spliceosome", "ספלייסוזום", [166, 96], { anchor: "start" }),
  label("l_cap4", 8, 272, "5' cap (m⁷G)", "כובע 5' (m⁷G)", [52, 224], { anchor: "start" }),
  label("l_pa4", 210, 272, "Poly(A) tail", "זנב פולי-A", [270, 222], { anchor: "start" }),
  text("l_mat", 8, 190, "mature mRNA", "mRNA בוגר", { anchor: "start", textColor: "#047857" }),
  text("l_pre", 8, 144, "pre-mRNA", "pre-mRNA", { anchor: "start", ltr: true, textColor: C.muted }),
];

// nuclear envelope (two membranes) with a pore; nucleus above, cytoplasm below
const env = (y: number): El[] => [
  path("ne_o", `M 0 ${y} L 176 ${y} M 224 ${y} L 400 ${y}`, { stroke: C.membrane, strokeWidth: 3.5 }),
  path("ne_i", `M 0 ${y - 12} L 176 ${y - 12} M 224 ${y - 12} L 400 ${y - 12}`, { stroke: C.membrane, strokeWidth: 3.5 }),
  path("npc_l", poly([[168, y - 20], [184, y - 20], [184, y + 8], [168, y + 8]]), { color: "#a78bfa", stroke: "#6d28d9", strokeWidth: 1.5 }),
  path("npc_r", poly([[216, y - 20], [232, y - 20], [232, y + 8], [216, y + 8]]), { color: "#a78bfa", stroke: "#6d28d9", strokeWidth: 1.5 }),
  path("npc_b", `M 176 ${y - 20} L 186 ${y - 44} L 200 ${y - 50} L 214 ${y - 44} L 224 ${y - 20}`, { stroke: "#8b5cf6", strokeWidth: 1.5, dash: "3 2" }),
];
const step5: El[] = [
  ...gone([...pre(104), spliceosome, arrow("p_arr", 200, 140, 200, 184)]),
  ...env(150),
  // mature mRNA threading through the pore, 5' cap first
  path("exp", smooth([[70, 96], [120, 108], [168, 118], [200, 130], [200, 150], [206, 176], [236, 200], [278, 214]]), { stroke: C.rna, strokeWidth: 5 }),
  circle("m_cap", 286, 216, 7, "#065f46", { stroke: "#fff", strokeWidth: 1.5 }),
  text("m_pa", 30, 100, "AAAA", "AAAA", { anchor: "start", ltr: true, weight: 700, textColor: "#047857" }),
  ...gone([rect("m_e1", 60, 211, 70, 18, EX[0]), rect("m_e2", 130, 211, 60, 18, EX[1]), rect("m_e3", 190, 211, 56, 18, EX[2])]),
  text("nuc", 330, 60, "Nucleus", "גרעין", { anchor: "start", weight: 700, textColor: "#92400e" }),
  text("cyt", 20, 285, "Cytoplasm", "ציטופלזמה", { anchor: "start", weight: 700, textColor: C.muted }),
  label("l_npc", 250, 110, "Nuclear pore complex", "נקבובית גרעינית", [226, 132], { anchor: "start", shortHe: "נקבובית", short: "Pore" }),
  label("l_ne", 8, 200, "Nuclear envelope", "מעטפת הגרעין", [110, 150], { anchor: "start" }),
  label("l_5first", 130, 262, "5' end leaves first", "קצה 5' יוצא ראשון", [286, 216], { anchor: "start", shortHe: "5' ראשון", short: "5' first" }),
];

export const transcription: ProcessScene = {
  slug: "transcription",
  legend: [
    { color: C.dnaB, he: "גדיל מקודד (5'→3')", en: "Coding strand (5'→3')", swatch: "line" },
    { color: C.dnaA, he: "גדיל תבנית (3'→5')", en: "Template strand (3'→5')", swatch: "line" },
    { color: C.rna, he: "RNA", en: "RNA", swatch: "line" },
    { color: "#1d4ed8", he: "RNA פולימראז II", en: "RNA polymerase II", swatch: "ring" },
    { color: "#6d28d9", he: "גורמי שעתוק / נקבובית", en: "Transcription factors / pore", swatch: "dot" },
  ],
  steps: [
    {
      titleHe: "התחלה — הרכבה על הפרומוטור", titleEn: "Initiation — Assembly at the Promoter",
      descHe: "בגרעין: TFIID (דרך תת-היחידה TBP) מזהה את תיבת ה-TATA בפרומוטור, כ-25–30 נוקלאוטידים לפני אתר תחילת השעתוק (+1). גורמי שעתוק כלליים נוספים מגייסים את RNA פולימראז II ויוצרים את קומפלקס טרום-ההתחלה. הדנ\"א נפתח סביב +1 ונוצרת בועת שעתוק — אין צורך בפריימר ולא בהליקאז נפרד.",
      descEn: "In the nucleus, TFIID (via its TBP subunit) recognises the TATA box in the promoter, about 25–30 nucleotides upstream of the start site (+1). Other general transcription factors recruit RNA polymerase II to form the pre-initiation complex. The DNA opens around +1 into a transcription bubble — no primer and no separate helicase are needed.",
      elements: step1,
      highlight: ["tata", "tfiid", "gtf", "pol", "d_top", "d_bot"],
    },
    {
      titleHe: "הארכה — סינתזת RNA בכיוון 5'→3'", titleEn: "Elongation — RNA Made 5'→3'",
      descHe: "RNA פולימראז II מתקדם לאורך הגן, קורא את גדיל התבנית בכיוון 3'→5' ומוסיף ריבונוקלאוטידים משלימים לקצה ה-3' של ה-RNA (U מול A). מאחוריו הגדילים נסגרים מחדש. כבר בתחילת ההארכה מתווסף ל-5' כובע של 7-מתיל-גואנוזין. רצף ה-RNA זהה לגדיל המקודד (עם U במקום T).",
      descEn: "RNA polymerase II moves along the gene, reading the template strand 3'→5' and adding complementary ribonucleotides to the RNA's 3' end (U opposite A). The DNA rewinds behind it. Early in elongation a 7-methylguanosine cap is added to the 5' end. The RNA matches the coding strand (U instead of T).",
      elements: step2,
      highlight: ["pol", "rna", "cap", "d_bot"],
    },
    {
      titleHe: "סיום — חיתוך ופוליאדנילציה", titleEn: "Termination — Cleavage and Polyadenylation",
      descHe: "אחרי שהפולימראז משעתק את אות הפוליאדנילציה (AAUAAA ב-RNA), חלבונים הקשורים אליו חותכים את ה-pre-mRNA כ-10–35 נוקלאוטידים בהמשך. פולי-A פולימראז מוסיף לקצה ה-3' החדש זנב של כ-200 אדנינים. הפולימראז ממשיך מעט, ה-RNA שנשאר עליו מפורק, והוא משתחרר מהדנ\"א.",
      descEn: "After the polymerase transcribes the polyadenylation signal (AAUAAA in the RNA), proteins riding on it cut the pre-mRNA about 10–35 nucleotides downstream. Poly(A) polymerase adds a tail of ~200 adenines to the new 3' end. The polymerase continues briefly, the RNA still attached to it is degraded, and it falls off the DNA.",
      elements: step3,
      highlight: ["pas", "rna", "cap", "polyA", "cut1", "cut2", "frag"],
    },
    {
      titleHe: "עיבוד ה-mRNA — כובע, שחבור וזנב", titleEn: "mRNA Processing — Cap, Splicing and Tail",
      descHe: "ה-pre-mRNA מעובד עוד בגרעין: הספלייסוזום (snRNPs) חותך את האינטרונים — שמשתחררים כלולאה (lariat) — ומחבר את האקסונים. הכובע ב-5' וזנב הפולי-A ב-3' מגינים על ה-mRNA מפירוק ומסייעים לייצוא ולהתחלת התרגום. שחבור חלופי מאפשר לגן אחד לקודד כמה חלבונים.",
      descEn: "The pre-mRNA is processed in the nucleus: the spliceosome (snRNPs) cuts out the introns — released as lariats — and joins the exons. The 5' cap and the 3' poly(A) tail protect the mRNA from degradation and help export and translation initiation. Alternative splicing lets one gene encode several proteins.",
      elements: step4,
      highlight: ["splc", "p_i1", "p_i2", "m_cap", "m_e1", "m_e2", "m_e3", "m_pa", "p_arr"],
    },
    {
      titleHe: "ייצוא דרך נקבובית גרעינית", titleEn: "Export Through a Nuclear Pore",
      descHe: "ה-mRNA הבוגר, קשור לחלבונים, יוצא מהגרעין דרך קומפלקס הנקבובית הגרעינית — הקצה עם הכובע (5') ראשון. רק mRNA שעובד כראוי מיוצא. בציטופלזמה הוא ייקשר לריבוזומים ויתורגם לחלבון — זהו כבר תהליך התרגום, לא חלק מהשעתוק.",
      descEn: "The mature mRNA, bound by proteins, leaves the nucleus through a nuclear pore complex — capped 5' end first. Only properly processed mRNA is exported. In the cytoplasm it will bind ribosomes and be translated into protein — that is translation, not part of transcription.",
      elements: step5,
      highlight: ["exp", "m_cap", "m_pa", "npc_l", "npc_r", "npc_b"],
    },
  ],
};
