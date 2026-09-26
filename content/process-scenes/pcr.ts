import { C, arrow, circle, label, line, path, rect, segments, tag, text, type El, type ProcessScene, type Pt } from "./kit";

// Template DNA from x = 20 to 330. Top strand 5'→3' (left → right), bottom 3'→5'.
const X1 = 20, X2 = 330, T0 = 120, T1 = 260; // target region between the primers
const stubs = (y: number, dir: 1 | -1): string => {
  const s: [Pt, Pt][] = [];
  for (let x = X1 + 5; x < X2; x += 10) s.push([[x, y], [x, y + dir * 7]]);
  return segments(s);
};
function strands(yt: number, yb: number, paired: boolean): El[] {
  return [
    rect("tgt", T0, yt - 14, T1 - T0, yb - yt + 28, "#fef9c3", { rx: 6, stroke: "#ca8a04", strokeWidth: 1.2, dash: "4 3" }),
    path("st_t", paired ? stubs(yt, 1).replace(/L (\S+) (\S+)/g, (_, x) => `L ${x} ${(yt + yb) / 2}`) : stubs(yt, 1), { stroke: C.rung, strokeWidth: 2 }),
    path("st_b", paired ? stubs(yb, -1).replace(/L (\S+) (\S+)/g, (_, x) => `L ${x} ${(yt + yb) / 2}`) : stubs(yb, -1), { stroke: C.rung, strokeWidth: 2 }),
    line("top", X1, yt, X2, yt, C.dnaB, 4),
    line("bot", X1, yb, X2, yb, C.dnaA, 4),
    tag("t5", X1 - 2, yt - 10, "5'"), tag("t3", X2 + 4, yt - 10, "3'"),
    tag("b3", X1 - 2, yb + 24, "3'"), tag("b5", X2 + 4, yb + 24, "5'"),
  ];
}

// thermometer on the right edge
const thermo = (t: number, color: string): El[] => {
  const h = ((t - 20) / 80) * 180;
  return [
    rect("th_tube", 364, 40, 18, 196, "#ffffff", { rx: 9, stroke: "#94a3b8", strokeWidth: 2 }),
    rect("th_hg", 368, 232 - h, 10, h, color, { rx: 5 }),
    circle("th_bulb", 373, 246, 13, color, { stroke: "#94a3b8", strokeWidth: 2 }),
    text("th_t", 372, 284, `${t}°C`, `${t}°C`, { ltr: true, weight: 800, textColor: color }),
  ];
};

const primer = (id: string, x1: number, x2: number, y: number) => arrow(id, x1, y, x2, y, "#16a34a", 5);

const step1: El[] = [
  ...strands(96, 214, false),
  ...thermo(95, "#dc2626"),
  label("l_hb", 40, 160, "H-bonds broken", "קשרי המימן נשברים", [100, 110], { anchor: "start" }),
  label("l_ss", 190, 280, "Single-stranded templates", "תבניות חד-גדיליות", [240, 214], { anchor: "start", shortHe: "חד-גדילי", short: "Single strands" }),
  label("l_tg", 150, 36, "Target sequence", "רצף המטרה", [190, 82], { anchor: "start" }),
];

const step2: El[] = [
  ...strands(96, 214, false),
  ...thermo(58, "#2563eb"),
  primer("fp", T0, T0 + 44, 214 - 13), primer("rp", T1, T1 - 44, 96 + 13),
  label("l_fp", 20, 272, "Forward primer 5'→3'", "פריימר קדמי 5'→3'", [T0 + 12, 201], { anchor: "start", shortHe: "פריימר קדמי", short: "Fwd primer" }),
  label("l_rp", 190, 40, "Reverse primer 5'→3'", "פריימר אחורי 5'→3'", [T1 - 12, 109], { anchor: "start", shortHe: "פריימר אחורי", short: "Rev primer" }),
  label("l_tg", 70, 160, "Primers flank the target", "הפריימרים תוחמים את המטרה", [T0 + 2, 160], { anchor: "start", shortHe: "תחימת המטרה", short: "Flank target" }),
];

const taq = (id: string, cx: number, cy: number) =>
  path(id, `M ${cx - 16} ${cy} C ${cx - 18} ${cy - 22} ${cx + 18} ${cy - 22} ${cx + 16} ${cy} C ${cx + 18} ${cy + 20} ${cx - 18} ${cy + 20} ${cx - 16} ${cy} Z`,
    { color: "#e0f2fe", fillOpacity: 0.85, stroke: "#0369a1", strokeWidth: 2 });
const step3: El[] = [
  ...strands(96, 214, false),
  ...thermo(72, "#ea580c"),
  primer("fp", T0, 296, 214 - 13), primer("rp", T1, 54, 96 + 13),
  taq("taq1", 306, 201), taq("taq2", 44, 109),
  ...[[180, 160], [220, 150], [150, 146], [260, 168], [300, 150], [90, 170]].map(([x, y], i) => circle(`dntp${i}`, x, y, 4, ["#f59e0b", "#10b981", "#6366f1", "#ef4444"][i % 4])),
  label("l_taq", 250, 272, "Taq polymerase", "Taq פולימראז", [306, 212], { anchor: "start" }),
  label("l_nt", 30, 160, "dNTPs", "dNTPs", [88, 168], { anchor: "start", ltr: true }),
  text("l_cyc", 8, 40, "Copies double every cycle", "מספר העותקים מוכפל בכל מחזור", { anchor: "start", weight: 700, textColor: "#0369a1", short: "×2 every cycle", shortHe: "הכפלה בכל מחזור" }),
];

export const pcr: ProcessScene = {
  slug: "pcr",
  legend: [
    { color: C.dnaB, he: "גדיל עליון (5'→3')", en: "Top strand (5'→3')", swatch: "line" },
    { color: C.dnaA, he: "גדיל תחתון (3'→5')", en: "Bottom strand (3'→5')", swatch: "line" },
    { color: "#16a34a", he: "פריימר / גדיל חדש", en: "Primer / new strand", swatch: "arrow" },
    { color: "#ca8a04", he: "רצף המטרה", en: "Target sequence", swatch: "dash" },
  ],
  steps: [
    {
      titleHe: "דנטורציה — הפרדת גדילי DNA ב-95°C", titleEn: "Denaturation — DNA Strand Separation at 95°C",
      descHe: "חימום ל-94–96°C שובר את קשרי המימן בין זוגות הבסיסים ומפריד את ה-DNA הדו-גדילי לשני גדילים בודדים. כך נחשפים רצפי התבנית שאליהם ייקשרו הפריימרים. קשרי הפוספודיאסטר בשלד אינם נשברים.",
      descEn: "Heating to 94–96°C breaks the hydrogen bonds between base pairs, separating double-stranded DNA into single strands. This exposes the template sequences the primers will bind. The phosphodiester backbone stays intact.",
      elements: step1,
      highlight: ["top", "bot", "st_t", "st_b", "tgt", "th_hg", "th_bulb"],
    },
    {
      titleHe: "הצמדת פריימרים ב-55–65°C", titleEn: "Primer Annealing at 55–65°C",
      descHe: "קירור ל-55–65°C מאפשר לשני פריימרים — אוליגונוקלאוטידים סינתטיים באורך 18–25 בסיסים — להיקשר לרצפים המשלימים להם משני צדי אזור המטרה, כל אחד לגדיל אחר. הפריימר הקדמי והאחורי מכוונים זה אל זה, כי כל אחד יוארך רק בכיוון 5'→3'. הטמפרטורה נבחרת לפי ה-Tm של הפריימרים כדי לשמור על ספציפיות.",
      descEn: "Cooling to 55–65°C lets two primers — synthetic oligonucleotides 18–25 bases long — bind their complementary sequences on either side of the target, one on each strand. They point toward each other, because each can only be extended 5'→3'. The temperature is set from the primers' Tm to keep binding specific.",
      elements: step2,
      highlight: ["fp", "rp", "tgt", "th_hg", "th_bulb"],
    },
    {
      titleHe: "הארכה ב-72°C — Taq פולימראז", titleEn: "Extension at 72°C — Taq Polymerase",
      descHe: "Taq פולימראז — אנזים עמיד לחום מהחיידק Thermus aquaticus — מוסיף dNTPs לקצה ה-3' של כל פריימר ומסנתז גדיל משלים בכיוון 5'→3', בקצב של כ-1,000 בסיסים לדקה. כל מחזור (דנטורציה-הצמדה-הארכה) מכפיל את מספר העותקים: אחרי n מחזורים כ-2ⁿ עותקים; תוצרים באורך המטרה בדיוק מופיעים מהמחזור השלישי.",
      descEn: "Taq polymerase — a heat-stable enzyme from Thermus aquaticus — adds dNTPs to each primer's 3' end, synthesising a complementary strand 5'→3' at about 1,000 bases per minute. Every cycle (denature-anneal-extend) doubles the copies: after n cycles about 2ⁿ; products of exactly the target length appear from cycle 3 on.",
      elements: step3,
      highlight: ["fp", "rp", "taq1", "taq2", "th_hg", "th_bulb", "dntp0", "dntp1", "dntp2", "dntp3", "dntp4", "dntp5"],
    },
  ],
};
