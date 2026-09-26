import { C, badge, circle, label, line, path, poly, rect, smooth, text, type El, type ProcessScene, type Pt } from "./kit";

const SLUG = "protein-degradation-and-ubiquitin-proteasome-system-animation-1780958699914";

// Substrate protein as a 10-point chain: folded (compact) or unfolded (threaded into the proteasome).
const FOLD: Pt[] = [[-40, -10], [-25, -30], [-5, -12], [10, -32], [30, -15], [40, 10], [20, 25], [0, 12], [-20, 28], [-38, 12]];
const LYS = 6; // lysine that receives the first ubiquitin
const folded = (cx: number, cy: number): Pt[] => FOLD.map(([x, y]) => [cx + x, cy + y]);
const sub = (pts: Pt[], o: Partial<El> = {}) => path("sub", smooth(pts), { stroke: C.protein, strokeWidth: 6, ...o });
const degron = (pts: Pt[]) => circle("deg", pts[1][0], pts[1][1], 7, "#f43f5e", { stroke: "#fff", strokeWidth: 1.5 });

// Ubiquitin: small yellow globule
const ub = (i: number, x: number, y: number, o: Partial<El> = {}): El[] => [
  circle(`ub${i}`, x, y, 12, "#fde047", { stroke: "#a16207", strokeWidth: 1.8, ...o }),
  text(`ub${i}_t`, x, y + 5, "Ub", "Ub", { ltr: true, weight: 700, halo: false, textColor: "#713f12", ...o }),
];
const bond = (id: string, a: Pt, b: Pt, o: Partial<El> = {}) => line(id, a[0], a[1], b[0], b[1], "#a16207", 2.5, o);

const blob = (id: string, cx: number, cy: number, rx: number, ry: number, fill: string, stroke: string) =>
  path(id, smooth([[cx - rx, cy], [cx - rx * 0.7, cy - ry], [cx + rx * 0.6, cy - ry * 0.9], [cx + rx, cy + ry * 0.1], [cx + rx * 0.5, cy + ry], [cx - rx * 0.6, cy + ry * 0.9]], true), { color: fill, stroke, strokeWidth: 2 });

// 26S proteasome: 20S core (α7β7β7α7 rings) capped by 19S regulatory particles at both ends
const PX = 272, PW = 76;
const proteasome = (o: Partial<El> = {}): El[] => [
  path("cap1", poly([[PX + 4, 80], [PX + 14, 46], [PX + PW - 14, 46], [PX + PW - 4, 80]]), { color: "#ddd6fe", stroke: "#6d28d9", strokeWidth: 2, ...o }),
  ...[0, 1, 2, 3].map((i) => rect(`ring${i}`, PX, 82 + i * 27, PW, 25, i === 0 || i === 3 ? "#99f6e4" : "#5eead4", { rx: 5, stroke: "#0f766e", strokeWidth: 1.8, ...o })),
  path("cap2", poly([[PX + 4, 192], [PX + PW - 4, 192], [PX + PW - 14, 224], [PX + 14, 224]]), { color: "#ddd6fe", stroke: "#6d28d9", strokeWidth: 2, ...o }),
  path("chan", `M ${PX + PW / 2} 50 L ${PX + PW / 2} 220`, { stroke: "#0f766e", strokeWidth: 1.2, dash: "3 3", ...o }),
];

const S1 = folded(140, 140);
const step1: El[] = [
  ...proteasome({ opacity: 0 }),
  sub(S1), degron(S1),
  ...ub(1, 40, 70), ...ub(2, 70, 104), ...ub(3, 36, 140), ...ub(4, 64, 178),
  label("l_sub", 180, 64, "Target protein", "חלבון מטרה", [150, 116], { anchor: "start" }),
  label("l_deg", 196, 250, "Degron (misfolded / signal)", "דגרון — אות לפירוק", [115, 111], { anchor: "start", shortHe: "דגרון", short: "Degron" }),
  label("l_ub", 8, 270, "Ubiquitin (76 aa)", "אוביקוויטין (76 ח\"א)", [60, 188], { anchor: "start", shortHe: "אוביקוויטין", short: "Ubiquitin" }),
];

const step2: El[] = [
  sub(S1), degron(S1),
  blob("e1", 80, 236, 34, 22, "#bae6fd", "#0369a1"),
  text("e1_t", 80, 242, "E1", "E1", { ltr: true, weight: 800, halo: false, textColor: "#0c4a6e" }),
  ...ub(1, 80, 196), bond("b1", [80, 209], [80, 214]),
  ...ub(2, 30, 90), ...ub(3, 36, 136), ...ub(4, 30, 176),
  ...badge("atp", 190, 250, "ATP → AMP + PPᵢ", C.energy, { w: 150 }),
  label("l_e1", 210, 204, "E1 activates Ub (thioester)", "E1 מפעיל Ub (קשר תיואסטר)", [96, 206], { anchor: "start", shortHe: "E1 מפעיל Ub", short: "E1 activates Ub" }),
];

const LP = S1[LYS];
const step3: El[] = [
  sub(S1), degron(S1),
  blob("e1", 50, 250, 30, 20, "#bae6fd", "#0369a1"),
  text("e1_t", 50, 256, "E1", "E1", { ltr: true, weight: 800, halo: false, textColor: "#0c4a6e" }),
  blob("e2", 118, 228, 26, 20, "#bbf7d0", "#15803d"),
  text("e2_t", 118, 234, "E2", "E2", { ltr: true, weight: 800, halo: false, textColor: "#14532d" }),
  blob("e3", 190, 204, 32, 24, "#fed7aa", "#c2410c"),
  text("e3_t", 194, 212, "E3", "E3", { ltr: true, weight: 800, halo: false, textColor: "#7c2d12" }),
  ...ub(1, LP[0] - 6, LP[1] + 22), bond("b1", [LP[0], LP[1] + 4], [LP[0] - 4, LP[1] + 10]),
  ...ub(2, 30, 90), ...ub(3, 36, 136), ...ub(4, 30, 176),
  text("lys", LP[0] + 14, LP[1] - 2, "K", "K", { ltr: true, weight: 800, textColor: "#be123c" }),
  label("l_e3", 238, 150, "E3 ligase binds the substrate", "E3 (ליגאז) מזהה את המצע", [206, 186], { anchor: "start", shortHe: "E3 מזהה מצע", short: "E3 picks substrate" }),
  label("l_e2", 150, 286, "E2 carries Ub", "E2 נושא Ub", [118, 244], { anchor: "start" }),
  label("l_lys", 220, 60, "Ub → lysine (isopeptide)", "Ub נקשר לליזין", [LP[0] + 2, LP[1] + 2], { anchor: "start" }),
];

const CH: Pt[] = [[LP[0] - 6, LP[1] + 22], [LP[0] + 18, LP[1] + 42], [LP[0] + 44, LP[1] + 56], [LP[0] + 72, LP[1] + 64]];
const chain = (pts: Pt[]): El[] => [
  ...pts.flatMap((p, i) => ub(i + 1, p[0], p[1])),
  bond("b2", pts[0], pts[1]), bond("b3", pts[1], pts[2]), bond("b4", pts[2], pts[3]),
];
const step4: El[] = [
  sub(S1), degron(S1),
  bond("b1", [LP[0], LP[1] + 4], [LP[0] - 4, LP[1] + 10]),
  blob("e3", 110, 214, 32, 24, "#fed7aa", "#c2410c"),
  text("e3_t", 114, 222, "E3", "E3", { ltr: true, weight: 800, halo: false, textColor: "#7c2d12" }),
  ...chain(CH),
  label("l_ch", 230, 270, "K48 chain (≥4 Ub)", "שרשרת K48 (4 Ub לפחות)", [CH[3][0] + 6, CH[3][1] + 10], { anchor: "start", shortHe: "שרשרת K48", short: "K48 chain" }),
  text("k48", 250, 186, "Lys48 → Gly76", "Lys48 → Gly76", { anchor: "start", ltr: true, textColor: "#a16207" }),
];

const S5 = folded(196, 54);
const LP5 = S5[LYS];
const CH5: Pt[] = [[LP5[0] + 6, LP5[1] + 22], [LP5[0] + 34, LP5[1] + 32], [LP5[0] + 46, LP5[1] + 60], [LP5[0] + 24, LP5[1] + 80]];
const step5: El[] = [
  ...proteasome(),
  sub(S5), degron(S5),
  bond("b1", [LP5[0], LP5[1] + 4], [LP5[0] + 4, LP5[1] + 10]),
  ...chain(CH5),
  label("l_19", 20, 200, "19S cap: Ub receptors", "19S — קולטני Ub", [PX + 8, 66], { anchor: "start", shortHe: "19S", short: "19S" }),
  label("l_20", 170, 286, "20S core (α7β7β7α7)", "20S — ליבה קטליטית", [PX + 4, 150], { anchor: "start", shortHe: "20S", short: "20S" }),
  text("l_26", 358, 272, "26S", "26S", { ltr: true, weight: 800, textColor: "#6d28d9" }),
];

// unfolded chain threading down the central channel
const THREAD: Pt[] = [[170, 22], [190, 24], [210, 26], [230, 28], [250, 30], [268, 32], [290, 36], [310, 48], [310, 100], [310, 150]];
const FREE: Pt[] = [[44, 110], [72, 130], [40, 156], [70, 178]];
const step6: El[] = [
  ...proteasome(),
  sub(THREAD),
  circle("deg", THREAD[1][0], THREAD[1][1], 7, "#f43f5e", { stroke: "#fff", strokeWidth: 1.5 }),
  ...FREE.flatMap((p, i) => ub(i + 1, p[0], p[1])),
  ...badge("atp6", 200, 76, "ATP", C.energy),
  label("l_unf", 8, 246, "19S ATPases unfold & thread", "ה-ATPase של 19S פורש ומשחיל", [PX + 4, 64], { anchor: "start", shortHe: "פרישה והשחלה", short: "Unfold, thread" }),
  label("l_dub", 8, 60, "DUBs recycle Ub", "DUBs ממחזרים Ub", [60, 108], { anchor: "start" }),
];

const PEP: Pt[][] = [[[282, 244], [294, 238], [306, 246]], [[318, 252], [330, 246], [342, 254]], [[290, 266], [302, 260], [314, 268], [326, 262]], [[250, 256], [262, 250], [274, 256]]];
const step7: El[] = [
  ...proteasome(),
  ...FREE.flatMap((p, i) => ub(i + 1, p[0], p[1])),
  ...PEP.map((pts, i) => path(`pep${i}`, poly(pts, false), { stroke: C.protein, strokeWidth: 4 })),
  label("l_pep", 8, 250, "Short peptides (3–25 aa)", "פפטידים קצרים (3–25 ח\"א)", [262, 252], { anchor: "start", shortHe: "פפטידים קצרים", short: "Short peptides" }),
  text("l_aa", 8, 284, "→ amino acids (cytosolic peptidases)", "← חומצות אמינו (פפטידאזות)", { anchor: "start", textColor: C.muted, short: "→ amino acids", shortHe: "← חומצות אמינו" }),
  label("l_ub7", 8, 60, "Ub reused", "Ub חוזר לשימוש", [60, 108], { anchor: "start" }),
];

export const ups: ProcessScene = {
  slug: SLUG,
  legend: [
    { color: C.protein, he: "חלבון המטרה", en: "Target protein", swatch: "line" },
    { color: "#a16207", he: "אוביקוויטין (Ub)", en: "Ubiquitin (Ub)", swatch: "ring" },
    { color: "#c2410c", he: "אנזימי E1 / E2 / E3", en: "E1 / E2 / E3 enzymes", swatch: "ring" },
    { color: "#0f766e", he: "ליבת 20S", en: "20S core", swatch: "ring" },
    { color: "#6d28d9", he: "מכסה 19S", en: "19S cap", swatch: "ring" },
  ],
  steps: [
    {
      titleHe: "חלבון מטרה ואוביקוויטין", titleEn: "Target Protein and Ubiquitin",
      descHe: "חלבונים פגומים, שגוי-קיפול או קצרי-חיים (למשל ציקלינים) נושאים אות פירוק — דגרון. אוביקוויטין הוא חלבון קטן (76 חומצות אמינו) ושמור מאוד, שמשמש כתג: חלבון שמסומן בשרשרת אוביקוויטין מיועד לפירוק בפרוטאזום.",
      descEn: "Damaged, misfolded or short-lived proteins (for example cyclins) carry a degradation signal — a degron. Ubiquitin is a small (76 amino acids), highly conserved protein used as a tag: a protein marked with a ubiquitin chain is sent to the proteasome.",
      elements: step1,
    },
    {
      titleHe: "E1 מפעיל את Ub (ATP)", titleEn: "E1 Activates Ub (ATP)",
      descHe: "האנזים המפעיל E1 משתמש ב-ATP (ATP → AMP + PPᵢ) כדי לקשור את קצה ה-C של האוביקוויטין (גליצין 76) לציסטאין באתר הפעיל שלו בקשר תיואסטר עתיר אנרגיה.",
      descEn: "The activating enzyme E1 uses ATP (ATP → AMP + PPi) to link ubiquitin's C-terminus (glycine 76) to a cysteine in its active site through a high-energy thioester bond.",
      elements: step2,
      highlight: ["e1", "e1_t", "ub1", "ub1_t", "b1", "atp_bg", "atp_tx"],
    },
    {
      titleHe: "E2 ו-E3 מסמנים את המצע", titleEn: "E2 and E3 Tag the Substrate",
      descHe: "ה-Ub מועבר מ-E1 לאנזים המצמיד E2 (שוב בקשר תיואסטר). ליגאז E3 מזהה את הדגרון של המצע ומקרב אליו את E2~Ub, וה-Ub נקשר לליזין במצע בקשר איזופפטידי. בתא יש מאות סוגי E3 — הם שקובעים איזה חלבון יפורק ומתי.",
      descEn: "Ub is passed from E1 to a conjugating enzyme E2 (again as a thioester). An E3 ligase recognises the substrate's degron and brings E2~Ub to it, and Ub is joined to a lysine on the substrate by an isopeptide bond. Cells have hundreds of E3s — they decide which protein is degraded and when.",
      elements: step3,
      highlight: ["e2", "e2_t", "e3", "e3_t", "ub1", "ub1_t", "b1", "sub", "lys"],
    },
    {
      titleHe: "שרשרת פולי-אוביקוויטין (K48)", titleEn: "Poly-Ubiquitin Chain (K48)",
      descHe: "המחזור חוזר: כל Ub חדש נקשר לליזין 48 של ה-Ub הקודם, ונבנית שרשרת. שרשרת K48 של 4 יחידות Ub לפחות היא האות הקלאסי לפירוק בפרוטאזום (שרשראות מסוג אחר, למשל K63, משמשות לאיתות ולא לפירוק).",
      descEn: "The cycle repeats: each new Ub is linked to lysine 48 of the previous Ub, building a chain. A K48 chain of at least four Ub is the classic signal for proteasomal degradation (other chain types, such as K63, signal rather than degrade).",
      elements: step4,
      highlight: ["ub1", "ub2", "ub3", "ub4", "ub1_t", "ub2_t", "ub3_t", "ub4_t", "b2", "b3", "b4"],
    },
    {
      titleHe: "הפרוטאזום 26S מזהה את התג", titleEn: "The 26S Proteasome Recognises the Tag",
      descHe: "הפרוטאזום 26S בנוי מליבה 20S — חבית של ארבע טבעות (α7β7β7α7), כשהאתרים הפרוטאוליטיים בטבעות β פונים פנימה — וממכסה מווסת 19S בקצה אחד או בשניהם. קולטני Ub במכסה 19S נקשרים לשרשרת ה-K48.",
      descEn: "The 26S proteasome consists of a 20S core — a barrel of four rings (α7β7β7α7) with the proteolytic sites of the β rings facing inward — and a 19S regulatory cap at one or both ends. Ub receptors in the 19S cap bind the K48 chain.",
      elements: step5,
    },
    {
      titleHe: "פרישה, השחלה ומחזור של Ub", titleEn: "Unfold, Thread In, Recycle Ub",
      descHe: "אנזימי דה-אוביקוויטינציה (DUBs) מסירים את שרשרת ה-Ub לשימוש חוזר. טבעת ה-ATPase של מכסה 19S מנצלת אנרגיה מ-ATP כדי לפרוש את החלבון ולהשחיל אותו כשרשרת לא-מקופלת דרך הפתח הצר אל תוך חביות ה-20S.",
      descEn: "Deubiquitinating enzymes (DUBs) remove the Ub chain for reuse. The ATPase ring of the 19S cap uses ATP to unfold the protein and thread it, as an unfolded chain, through the narrow gate into the 20S barrel.",
      elements: step6,
    },
    {
      titleHe: "פפטידים משתחררים", titleEn: "Peptides Released",
      descHe: "בתוך הליבה, האתרים הפעילים של תת-יחידות β חותכים את החלבון לפפטידים קצרים (בדרך כלל 3–25 חומצות אמינו) שיוצאים מהפרוטאזום. פפטידאזות בציטוזול מפרקות אותם לחומצות אמינו שמשמשות לבניית חלבונים חדשים; חלקם מוצגים על MHC I למערכת החיסון.",
      descEn: "Inside the core, the β-subunit active sites cut the protein into short peptides (typically 3–25 amino acids) that leave the proteasome. Cytosolic peptidases break them into amino acids reused for new proteins; some are displayed on MHC I to the immune system.",
      elements: step7,
    },
  ],
};
