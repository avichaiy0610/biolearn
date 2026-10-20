import { C, arrow, circle, label, line, path, rect, smooth, text, wave, type El, type ProcessScene } from "./kit";

/* ══ THE lac OPERON (Lewin's Genes XII ch. 24; Alberts 7e ch. 7; Campbell 12e ch. 18) ══════
   One stretch of E. coli DNA across the scene: lacI (with its own promoter), then the CAP site, promoter,
   operator and the three structural genes. The repressor is a tetramer (four subunits). One idea per step. */

const Y = 136, H = 30; // DNA axis and gene box height
const REP = "#7c3aed", REPF = "#ede9fe", POL = "#1d4ed8", CAPC = "#c2410c", ALLO = "#16a34a", OFF = "#dc2626";

const box = (id: string, x: number, w: number, fill: string, stroke: string, t?: string): El[] => [
  rect(id, x, Y - H / 2, w, H, fill, { stroke, strokeWidth: 1.6, rx: 4 }),
  ...(t ? [text(`${id}_t`, x + w / 2, Y + 6, t, t, { ltr: true, fontSize: 15, weight: 700, halo: false })] : []),
];
const dna = (): El[] => [
  line("dna1", 14, Y - 4, 386, Y - 4, "#475569", 3),
  line("dna2", 14, Y + 4, 386, Y + 4, "#475569", 3),
  ...box("g_i", 20, 62, "#f3e8ff", REP, "lacI"),
  ...box("g_cap", 120, 22, "#ffedd5", CAPC),
  ...box("g_p", 144, 24, "#fef3c7", "#b45309"),
  ...box("g_o", 170, 22, "#fee2e2", OFF),
  ...box("g_z", 196, 92, "#dbeafe", POL, "lacZ"),
  ...box("g_y", 290, 50, "#dbeafe", POL, "lacY"),
  ...box("g_a", 342, 40, "#dbeafe", POL, "lacA"),
  text("t_cap", 131, Y + 34, "CAP", "CAP", { ltr: true, fontSize: 13, weight: 700, textColor: CAPC }),
  text("t_p", 156, Y + 34, "P", "P", { ltr: true, weight: 700, textColor: "#b45309" }),
  text("t_o", 181, Y + 34, "O", "O", { ltr: true, weight: 700, textColor: OFF }),
];
// repressor tetramer: four lobes
const repressor = (x: number, y: number, op = 1): El[] =>
  [[-11, -10], [11, -10], [-11, 10], [11, 10]].map(([dx, dy], i) => circle(`rep${i}`, x + dx, y + dy, 11, REPF, { stroke: REP, strokeWidth: 1.8, opacity: op }));
const pol = (x: number, op = 1): El => path("pol", `M ${x - 24} ${Y - H / 2} C ${x - 26} ${Y - 54} ${x + 26} ${Y - 54} ${x + 24} ${Y - H / 2} Z`, { color: "#dbeafe", fillOpacity: 0.9, stroke: POL, strokeWidth: 2, opacity: op });
const allo = (x: number, y: number, op = 1): El[] => [-11, 11].map((dx, i) => circle(`al${i}`, x + dx, y - 22, 5, ALLO, { stroke: "#fff", strokeWidth: 1.2, opacity: op }));

const s1: El[] = [
  ...dna(), ...repressor(52, 214),
  arrow("i_ar", 51, Y + 20, 51, 186, REP, 2.2),
  label("l_i", 92, 236, "lacI: repressor, made all the time", "lacI: רפרסור — מיוצר תמיד", [64, 214], { anchor: "start", shortHe: "lacI: רפרסור", short: "lacI: repressor" }),
  label("l_zya", 200, 52, "One promoter, three genes", "פרומוטור אחד — שלושה גנים", [280, Y - 15], { anchor: "start", shortHe: "שלושה גנים", short: "Three genes" }),
  label("l_po", 14, 52, "Promoter + operator", "פרומוטור ואופרטור", [170, Y - 15], { anchor: "start" }),
];
const s2: El[] = [
  ...dna(), ...repressor(181, Y - 42), pol(124),
  line("blk1", 140, Y - 70, 156, Y - 54, OFF, 3), line("blk2", 156, Y - 70, 140, Y - 54, OFF, 3),
  label("l_rep", 220, 40, "Repressor sits on the operator", "הרפרסור יושב על האופרטור", [192, Y - 42], { anchor: "start", shortHe: "רפרסור על O", short: "Repressor on O" }),
  text("l_off", 200, 246, "no lactose: genes off", "אין לקטוז — הגנים כבויים", { weight: 700, textColor: OFF }),
];
const s3: El[] = [
  ...dna(), ...repressor(250, 56), ...allo(250, 56),
  arrow("rep_ar", 192, 92, 226, 70, REP, 2.2),
  label("l_al", 14, 40, "Allolactose binds the repressor", "אלולקטוז נקשר לרפרסור", [239, 34], { anchor: "start", shortHe: "אלולקטוז", short: "Allolactose" }),
  label("l_free", 14, 236, "It changes shape and lets go of O", "הוא משנה צורה ומשתחרר מ-O", [181, Y - 16], { anchor: "start", shortHe: "O משתחרר", short: "O released" }),
];
const s4: El[] = [
  ...dna(), ...repressor(250, 56, 0), ...allo(250, 56, 0), pol(244),
  path("mrna", smooth(wave(196, 382, 196, 3, 13)), { stroke: C.rna, strokeWidth: 4 }),
  arrow("tx", 270, Y - 36, 310, Y - 36, POL, 2.2),
  ...[[242, "#93c5fd"], [314, "#a5b4fc"], [362, "#c4b5fd"]].map(([x, c], i) => path(`prot${i}`, smooth([[Number(x) - 14, 236], [Number(x) - 10, 222], [Number(x) + 4, 220], [Number(x) + 14, 230], [Number(x) + 8, 246], [Number(x) - 8, 248]], true), { color: String(c), stroke: POL, strokeWidth: 1.6 })),
  label("l_prot", 14, 268, "β-galactosidase, permease, transacetylase", "β-גלקטוזידאז, פרמאז, טרנסאצטילאז", [242, 244], { anchor: "start", shortHe: "שלושה חלבונים", short: "Three proteins" }),
  label("l_mrna", 14, 200, "One mRNA → three proteins", "mRNA אחד ← שלושה חלבונים", [210, 196], { anchor: "start", shortHe: "mRNA אחד", short: "One mRNA" }),
];
const s5: El[] = [
  ...dna(), ...repressor(250, 56, 0), ...allo(250, 56, 0), pol(156),
  path("capp", smooth([[110, Y - 15], [106, Y - 40], [124, Y - 50], [140, Y - 40], [136, Y - 15]], true), { color: "#fed7aa", stroke: CAPC, strokeWidth: 2 }),
  circle("camp", 123, Y - 58, 6, "#0ea5e9", { stroke: "#fff", strokeWidth: 1.2 }),
  path("mrna", smooth(wave(196, 382, 196, 3, 13)), { stroke: C.rna, strokeWidth: 6 }),
  label("l_cap", 14, 40, "No glucose → cAMP–CAP recruits the polymerase", "אין גלוקוז ← cAMP–CAP מגייס את הפולימראז", [123, Y - 58], { anchor: "start", shortHe: "cAMP–CAP", short: "cAMP–CAP" }),
  text("l_on", 200, 246, "lactose, no glucose: strongly on", "לקטוז בלי גלוקוז — שעתוק חזק", { weight: 700, textColor: ALLO }),
];

export const lacScene: ProcessScene = {
  slug: "lac-operon",
  meta: {
    topic: "molecular-biology",
    nameHe: "אופרון lac — בקרת ביטוי גנים בחיידקים", nameEn: "The lac Operon — Gene Regulation in Bacteria",
    descHe: "מבנה האופרון, הרפרסור והאופרטור, אלולקטוז כמשרן, mRNA אחד לשלושה חלבונים, ובקרה חיובית על ידי cAMP–CAP",
    descEn: "Operon structure, repressor and operator, allolactose as inducer, one mRNA for three proteins, and positive control by cAMP–CAP",
    source: "Lewin's Genes XII ch. 24; Alberts 7e ch. 7; Campbell 12e ch. 18",
  },
  legend: [
    { color: REP, he: "רפרסור (טטרמר) / lacI", en: "Repressor (tetramer) / lacI", swatch: "ring" },
    { color: POL, he: "RNA פולימראז / גנים מבניים", en: "RNA polymerase / structural genes", swatch: "ring" },
    { color: OFF, he: "אופרטור", en: "Operator", swatch: "ring" },
    { color: ALLO, he: "אלולקטוז (משרן)", en: "Allolactose (inducer)", swatch: "dot" },
    { color: CAPC, he: "CAP עם cAMP", en: "CAP with cAMP", swatch: "ring" },
  ],
  steps: [
    {
      titleHe: "מבנה האופרון", titleEn: "The Operon",
      descHe: "שלושת הגנים לפירוק לקטוז — lacZ, lacY ו-lacA — יושבים ברצף תחת פרומוטור אחד, ולכן נשלטים יחד. ליד הפרומוטור יש אופרטור (O) — אתר הקישור של הרפרסור — ואתר קישור ל-CAP. הגן lacI, שמחוץ לאופרון ועם פרומוטור משלו, מייצר את הרפרסור כל הזמן.",
      descEn: "The three genes for using lactose — lacZ, lacY and lacA — sit in a row under one promoter, so they are controlled together. Next to the promoter is the operator (O) — the repressor's binding site — and a binding site for CAP. The lacI gene, outside the operon with its own promoter, makes the repressor all the time.",
      elements: s1,
    },
    {
      titleHe: "בלי לקטוז: הרפרסור חוסם", titleEn: "No Lactose: the Repressor Blocks",
      descHe: "הרפרסור — טטרמר של ארבע יחידות — נקשר לאופרטור וחוסם את RNA הפולימראז שעל הפרומוטור. האנזימים לא מיוצרים — התא לא מבזבז משאבים על חלבונים שאין להם מצע.",
      descEn: "The repressor — a tetramer of four subunits — binds the operator and blocks the RNA polymerase on the promoter. The enzymes are not made — the cell does not waste resources on proteins with nothing to work on.",
      elements: s2,
    },
    {
      titleHe: "לקטוז מגיע: הרפרסור משתחרר", titleEn: "Lactose Arrives: the Repressor Lets Go",
      descHe: "מעט β-גלקטוזידאז שקיים תמיד הופך חלק מהלקטוז לאלולקטוז. אלולקטוז נקשר לרפרסור, משנה את צורתו (בקרה אלוסטרית), והרפרסור מאבד את הזיקה לאופרטור ומשתחרר ממנו. אלולקטוז הוא המשרן.",
      descEn: "The little β-galactosidase always present turns some lactose into allolactose. Allolactose binds the repressor and changes its shape (allosteric control), so the repressor loses its affinity for the operator and lets go. Allolactose is the inducer.",
      elements: s3,
    },
    {
      titleHe: "שעתוק: mRNA אחד, שלושה חלבונים", titleEn: "Transcription: One mRNA, Three Proteins",
      descHe: "הפולימראז משעתק את שלושת הגנים ל-mRNA פוליציסטרוני אחד, ולכל גן אתר התחלה משלו לתרגום. β-גלקטוזידאז מפרק לקטוז לגלוקוז וגלקטוז, פרמאז מכניס עוד לקטוז לתא, וטרנסאצטילאז — תפקידו פחות ברור.",
      descEn: "The polymerase transcribes the three genes into one polycistronic mRNA, with a separate translation start for each gene. β-galactosidase splits lactose into glucose and galactose, permease brings more lactose into the cell, and transacetylase — its role is less clear.",
      elements: s4,
    },
    {
      titleHe: "בקרה חיובית: cAMP–CAP", titleEn: "Positive Control: cAMP–CAP",
      descHe: "כשיש גם גלוקוז, החיידק מעדיף אותו, והשעתוק נשאר חלש. כשאין גלוקוז, רמת ה-cAMP עולה; cAMP נקשר ל-CAP, והקומפלקס נקשר לאתר שלו ליד הפרומוטור ומגייס את הפולימראז — השעתוק חזק פי עשרות. אז האופרון פעיל במלואו רק כשיש לקטוז ואין גלוקוז.",
      descEn: "When glucose is also present the bacterium prefers it, and transcription stays weak. Without glucose cAMP rises; cAMP binds CAP, and the complex binds its site next to the promoter and recruits the polymerase — transcription is tens of times stronger. So the operon is fully on only with lactose and without glucose.",
      elements: s5,
    },
  ],
};
