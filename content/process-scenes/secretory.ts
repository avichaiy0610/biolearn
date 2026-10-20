import { C, arrow, circle, label, line, path, rect, smooth, text, type El, type ProcessScene, type Pt } from "./kit";

/* ══ THE SECRETORY PATHWAY (Alberts 7e ch. 12–13; Campbell 12e ch. 6) ══════
   One cell edge: nucleus (left), rough ER, Golgi stack (cis faces the ER), plasma membrane (right).
   The protein (red dot) is followed through the steps. Step 1 adds a round zoom inset of a ribosome docking on
   the ER membrane — the one event too small to see at the scale of the cell. */

const ERC = "#a16207", GOL = "#059669", PM = "#d97706", PROT = "#dc2626", SUG = "#7c3aed";
const PMX = 372;

// rough ER: three folded sheets with ribosomes on the cytosolic face
const ER_X = [104, 122, 140];
const erSheet = (k: number) => smooth([[ER_X[k], 60], [ER_X[k] + 12, 96], [ER_X[k] - 2, 132], [ER_X[k] + 12, 168], [ER_X[k] - 2, 204], [ER_X[k] + 10, 240]]);
// Golgi: four curved cisternae, concave toward the plasma membrane (trans side)
const golgi = (k: number) => smooth([[226 + k * 13, 86 + k * 5], [214 + k * 13, 150], [226 + k * 13, 214 - k * 5]]);

const cell = (go = 1): El[] => [
  rect("cyto", 0, 0, PMX, 300, "#f8fafc"),
  path("pm", `M ${PMX} 0 L ${PMX} 300`, { stroke: PM, strokeWidth: 6 }),
  rect("outside", PMX + 3, 0, 400 - PMX, 300, "#fff7ed"),
  circle("nuc", 20, 150, 66, "#ede9fe", { stroke: "#7c3aed", strokeWidth: 2.4 }),
  text("t_nuc", 30, 156, "Nucleus", "גרעין", { weight: 700, fontSize: 14, textColor: "#6d28d9" }),
  ...[0, 1, 2].map((k) => path(`er${k}`, erSheet(k), { stroke: ERC, strokeWidth: 4 })),
  ...[0, 1, 2].flatMap((k) => [78, 114, 150, 186, 222].map((y, i) => circle(`rb${k}_${i}`, ER_X[k] + (i % 2 ? 14 : 2) - 6, y, 2.6, "#1e3a8a"))),
  ...[0, 1, 2, 3].map((k) => path(`go${k}`, golgi(k), { stroke: GOL, strokeWidth: 6, opacity: go })),
  text("t_er", 120, 270, "rough ER", "ER גבשושי", { weight: 700, fontSize: 14, textColor: ERC }),
  text("t_go", 250, 270, "Golgi", "גולג'י", { weight: 700, fontSize: 14, textColor: GOL, opacity: go }),
];
const prot = (id: string, x: number, y: number, sugar = false): El[] => [
  circle(id, x, y, 4.5, PROT, { stroke: "#fff", strokeWidth: 1.2 }),
  ...(sugar ? [path(`${id}_s`, `M ${x + 3} ${y - 3} l 5 -5 m 0 0 l 4 2 m -4 -2 l 1 -5`, { stroke: SUG, strokeWidth: 2 })] : []),
];
const vesicle = (id: string, x: number, y: number, color: string, coat = false): El[] => [
  circle(id, x, y, 11, "#ffffff", { stroke: color, strokeWidth: 2.2, dash: coat ? "2 2.5" : undefined }),
];

// step 1 zoom inset: ER membrane, translocon, ribosome with SRP, signal peptide entering
const IX = 300, IY = 72, IR = 62;
const inset = (op: number): El[] => [
  line("zl1", 150, 112, IX - IR + 6, IY + 22, "#94a3b8", 1.4, { dash: "4 3", opacity: op }),
  circle("ins", IX, IY, IR, "#ffffff", { stroke: "#94a3b8", strokeWidth: 2, opacity: op }),
  rect("ins_mem", IX - 56, IY + 14, 112, 12, "#fde68a", { stroke: ERC, strokeWidth: 1.6, opacity: op }),
  rect("ins_tl", IX - 7, IY + 10, 14, 20, "#fef3c7", { stroke: ERC, strokeWidth: 2, rx: 3, opacity: op }),
  path("ins_rib", smooth([[IX - 26, IY + 8], [IX - 28, IY - 18], [IX, IY - 30], [IX + 28, IY - 18], [IX + 26, IY + 8]], true), { color: "#bfdbfe", stroke: "#1d4ed8", strokeWidth: 2, opacity: op }),
  circle("ins_srp", IX - 36, IY - 24, 9, "#fbcfe8", { stroke: "#be185d", strokeWidth: 1.8, opacity: op }),
  path("ins_pep", smooth([[IX, IY - 4], [IX + 1, IY + 18], [IX - 4, IY + 34], [IX + 6, IY + 46]]), { stroke: PROT, strokeWidth: 3, opacity: op }),
  text("ins_lum", IX - 30, IY + 48, "lumen", "חלל ה-ER", { fontSize: 12, weight: 700, textColor: ERC, opacity: op }),
];

const s1: El[] = [
  ...cell(0), ...inset(1),
  label("l_srp", 190, 176, "SRP brings the ribosome to the ER", "SRP מביא את הריבוזום ל-ER", [IX - 36, IY - 24], { anchor: "start", shortHe: "SRP", short: "SRP" }),
  label("l_tl", 190, 222, "Through the translocon into the lumen", "דרך הטרנסלוקון לחלל ה-ER", [IX, IY + 20], { anchor: "start", shortHe: "טרנסלוקון", short: "Translocon" }),
];
const s2: El[] = [
  ...cell(0), ...inset(0),
  ...prot("p", 128, 150),
  path("fold", smooth([[118, 158], [112, 150], [118, 142], [132, 144], [134, 156]]), { stroke: PROT, strokeWidth: 2.4 }),
  label("l_fold", 196, 64, "Folds, gets disulfide bonds and first sugars", "מתקפל, נוצרים קשרים דיסולפידיים וסוכרים ראשונים", [130, 148], { anchor: "start", shortHe: "קיפול ב-ER", short: "Folding in ER" }),
  label("l_qc", 196, 240, "Misfolded proteins stay and are degraded", "חלבון לא מקופל נשאר ומפורק", [118, 160], { anchor: "start", shortHe: "בקרת איכות", short: "Quality control" }),
];
const s3: El[] = [
  ...cell(),
  ...vesicle("v1", 186, 150, "#0ea5e9", true), ...prot("p", 186, 150),
  arrow("v1_ar", 158, 150, 172, 150, "#0ea5e9", 2.2),
  arrow("v1_ar2", 200, 150, 212, 150, "#0ea5e9", 2.2),
  label("l_copii", 196, 52, "COPII vesicle to the cis face", "שלפוחית COPII לצד ה-cis", [186, 139], { anchor: "start", shortHe: "שלפוחית COPII", short: "COPII vesicle" }),
];
const s4: El[] = [
  ...cell(),
  ...prot("p", 244, 150, true),
  arrow("g_ar", 220, 236, 270, 236, GOL, 2.4),
  text("t_cis", 218, 60, "cis", "cis", { ltr: true, fontSize: 13, weight: 700, textColor: GOL }),
  text("t_trans", 272, 60, "trans", "trans", { ltr: true, fontSize: 13, weight: 700, textColor: GOL }),
  label("l_gly", 160, 28, "Sugar chains modified", "שרשראות הסוכר משתנות", [248, 146], { anchor: "start", shortHe: "גליקוזילציה", short: "Glycosylation" }),
];
const s5: El[] = [
  ...cell(),
  ...vesicle("v2", 320, 150, GOL), ...prot("p", 320, 150, true),
  arrow("v2_ar", 288, 150, 304, 150, GOL, 2.2),
  path("fuse", smooth([[PMX, 214], [PMX - 14, 222], [PMX - 14, 238], [PMX, 246]]), { stroke: PM, strokeWidth: 4 }),
  ...prot("p_out", 388, 232, true),
  label("l_ves", 196, 52, "Secretory vesicle, along microtubules", "שלפוחית הפרשה, לאורך מיקרוטובולים", [320, 139], { anchor: "start", shortHe: "שלפוחית הפרשה", short: "Secretory vesicle" }),
  label("l_exo", 196, 290, "Exocytosis: fuses and releases", "אקסוציטוזה: מתמזגת ומשחררת", [PMX - 10, 230], { anchor: "start", shortHe: "אקסוציטוזה", short: "Exocytosis" }),
];

export const secretoryScene: ProcessScene = {
  slug: "secretory-pathway",
  meta: {
    topic: "cell-biology",
    nameHe: "מסלול ההפרשה: מה-ER דרך הגולג'י אל מחוץ לתא", nameEn: "The Secretory Pathway: ER to Golgi to the Cell Surface",
    descHe: "כניסה ל-ER עם SRP והטרנסלוקון, קיפול ובקרת איכות, שלפוחיות COPII לגולג'י, גליקוזילציה ומיון, ואקסוציטוזה",
    descEn: "Entry into the ER via SRP and the translocon, folding and quality control, COPII vesicles to the Golgi, glycosylation and sorting, and exocytosis",
    source: "Alberts 7e ch. 12–13; Campbell 12e ch. 6",
  },
  legend: [
    { color: ERC, he: "ER גבשושי (ריבוזומים בכחול)", en: "Rough ER (ribosomes in blue)", swatch: "line" },
    { color: GOL, he: "גולג'י / שלפוחיות הפרשה", en: "Golgi / secretory vesicles", swatch: "line" },
    { color: "#0ea5e9", he: "שלפוחיות COPII", en: "COPII vesicles", swatch: "dash" },
    { color: PROT, he: "החלבון בדרך", en: "The protein on its way", swatch: "dot" },
    { color: SUG, he: "שרשראות סוכר", en: "Sugar chains", swatch: "line" },
    { color: PM, he: "ממברנת התא", en: "Plasma membrane", swatch: "line" },
  ],
  steps: [
    {
      titleHe: "כניסה ל-ER: SRP והטרנסלוקון", titleEn: "Into the ER: SRP and the Translocon",
      descHe: "תרגום של חלבון מופרש מתחיל בציטוזול. כשפפטיד האות (רצף הידרופובי בקצה ה-N) יוצא מהריבוזום, SRP נקשר אליו, עוצר את התרגום ומביא את הריבוזום לקולטן על ה-ER. שם התרגום ממשיך, והשרשרת עוברת דרך הטרנסלוקון אל חלל ה-ER; פפטיד האות נחתך.",
      descEn: "A secreted protein starts being translated in the cytosol. When the signal peptide (a hydrophobic stretch at the N-terminus) emerges from the ribosome, SRP binds it, pauses translation and brings the ribosome to its receptor on the ER. There translation resumes and the chain threads through the translocon into the ER lumen; the signal peptide is cut off.",
      elements: s1,
    },
    {
      titleHe: "קיפול ובקרת איכות ב-ER", titleEn: "Folding and Quality Control in the ER",
      descHe: "בחלל ה-ER שפרונים עוזרים לחלבון להתקפל, נוצרים קשרים דיסולפידיים, ומתווספת שרשרת סוכר ראשונה (N-גליקוזילציה). חלבון שלא התקפל כראוי נשאר ב-ER, ובסוף מוצא ממנו לציטוזול ומפורק בפרוטאזום.",
      descEn: "In the ER lumen chaperones help the protein fold, disulfide bonds form, and a first sugar chain is added (N-glycosylation). A protein that fails to fold stays in the ER and is eventually exported to the cytosol and destroyed by the proteasome.",
      elements: s2,
    },
    {
      titleHe: "שלפוחיות COPII לגולג'י", titleEn: "COPII Vesicles to the Golgi",
      descHe: "חלבונים מקופלים נארזים בשלפוחיות עטופות COPII שננצות מה-ER ומתמזגות עם הצד ה-cis של מערכת הגולג'י, שפונה אל ה-ER.",
      descEn: "Folded proteins are packed into COPII-coated vesicles that bud from the ER and fuse with the cis face of the Golgi, the side that faces the ER.",
      elements: s3,
    },
    {
      titleHe: "עיבוד ומיון בגולג'י", titleEn: "Processing and Sorting in the Golgi",
      descHe: "החלבון עובר מבורות ה-cis אל ה-trans, ובדרך אנזימים שונים בכל בור משנים את שרשראות הסוכר שלו. בצד ה-trans החלבונים ממוינים לפי יעדם: הפרשה, ממברנת התא או ליזוזומים.",
      descEn: "The protein moves from the cis to the trans cisternae while different enzymes in each cisterna modify its sugar chains. At the trans face proteins are sorted by destination: secretion, the plasma membrane or lysosomes.",
      elements: s4,
    },
    {
      titleHe: "אקסוציטוזה", titleEn: "Exocytosis",
      descHe: "שלפוחיות הפרשה ננצות מהצד ה-trans, נעות לאורך מיקרוטובולים אל ממברנת התא ומתמזגות איתה בעזרת חלבוני SNARE. תוכנן משתחרר מחוץ לתא — בהפרשה קבועה או, בתאים כמו תאי β בלבלב, בהפרשה מווסתת בתגובה לאות.",
      descEn: "Secretory vesicles bud from the trans face, travel along microtubules to the plasma membrane and fuse with it using SNARE proteins. Their contents are released outside — constitutively or, in cells such as pancreatic β cells, in regulated secretion triggered by a signal.",
      elements: s5,
    },
  ],
};
