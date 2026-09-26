import { C, arrow, chromatid, circle, label, line, path, rect, text, type El, type ProcessScene } from "./kit";

// Shared genetics drawing: pea flowers (A = purple, dominant; a = white), chromosomes with allele bands, Punnett squares.
const PURPLE = "#7c3aed", WHITE = "#f8fafc";
const flower = (id: string, cx: number, cy: number, color: string, r = 11, o: Partial<El> = {}): El[] => [
  ...[0, 72, 144, 216, 288].map((a, i) => {
    const t = ((a - 90) * Math.PI) / 180;
    return circle(`${id}_p${i}`, cx + r * 0.9 * Math.cos(t), cy + r * 0.9 * Math.sin(t), r * 0.62, color, { stroke: "#6b21a8", strokeWidth: 1.2, ...o });
  }),
  circle(`${id}_c`, cx, cy, r * 0.38, "#fde047", { stroke: "#a16207", strokeWidth: 1, ...o }),
];
// chromosome with a coloured allele band and letter
const chr = (id: string, cx: number, y1: number, y2: number, color: string, allele: string, bandAt = 0.3, side: 1 | -1 = 1): El[] => [
  path(id, chromatid(cx, y1, y2, 7, 0.55), { color, stroke: "#0f172a", strokeWidth: 1 }),
  rect(`${id}_band`, cx - 7, y1 + (y2 - y1) * bandAt - 4, 14, 8, "#0f172a", { rx: 1 }),
  text(`${id}_al`, cx + side * 14, y1 + (y2 - y1) * bandAt + 6, allele, allele, { ltr: true, weight: 800, anchor: side > 0 ? "start" : "end" }),
];
// gamete = small circle with an allele letter
const gamete = (id: string, cx: number, cy: number, s: string, color = "#fef3c7"): El[] => [
  circle(id, cx, cy, 17, color, { stroke: "#b45309", strokeWidth: 1.8 }),
  text(`${id}_t`, cx, cy + 6, s, s, { ltr: true, weight: 800, halo: false }),
];
// 2x2 Punnett square; cells [[genotype, flowerColor]]
function punnett(p: string, x: number, y: number, top: string[], side: string[], cells: [string, string][], cw = 58): El[] {
  const els: El[] = [];
  top.forEach((s, i) => els.push(text(`${p}_h${i}`, x + cw * i + cw / 2, y - 10, s, s, { ltr: true, weight: 800, textColor: "#b45309" })));
  side.forEach((s, i) => els.push(text(`${p}_v${i}`, x - 16, y + cw * i + cw / 2 + 6, s, s, { ltr: true, weight: 800, textColor: "#b45309" })));
  cells.forEach(([g, col], k) => {
    const i = k % 2, j = Math.floor(k / 2), cx = x + cw * i, cy = y + cw * j;
    els.push(rect(`${p}_c${k}`, cx, cy, cw, cw, "#ffffff", { rx: 0, stroke: "#94a3b8", strokeWidth: 1.5 }));
    els.push(...flower(`${p}_f${k}`, cx + 16, cy + cw / 2, col, 9));
    els.push(text(`${p}_g${k}`, cx + 42, cy + cw / 2 + 6, g, g, { ltr: true, weight: 700, fontSize: 16.5 }));
  });
  return els;
}

/* ── Mendelian genetics ─────────────────────────────────────────── */
const m1: El[] = [
  circle("cell", 90, 140, 62, "#f0fdf4", { stroke: "#16a34a", strokeWidth: 2.2 }),
  ...chr("hA", 72, 100, 180, C.maternal, "A", 0.3, -1), ...chr("ha", 110, 100, 180, C.paternal, "a"),
  arrow("s1", 160, 120, 230, 90, C.line), arrow("s2", 160, 160, 230, 190, C.line),
  ...gamete("gA", 262, 84, "A"), ...gamete("ga", 262, 196, "a"),
  text("half1", 300, 90, "½", "½", { anchor: "start", ltr: true, weight: 700 }),
  text("half2", 300, 202, "½", "½", { anchor: "start", ltr: true, weight: 700 }),
  label("l_par", 16, 40, "Parent Aa (2 alleles)", "הורה Aa — שני אללים", [90, 80], { anchor: "start" }),
  label("l_gam", 180, 280, "Gametes: one allele each", "גמטות — אלל אחד בכל אחת", [262, 214], { anchor: "start", shortHe: "גמטות", short: "Gametes" }),
  label("l_loc", 16, 272, "Gene locus", "מיקום הגן (לוקוס)", [116, 125], { anchor: "start" }),
];
const m2: El[] = [
  circle("cell", 76, 150, 60, "#f0fdf4", { stroke: "#16a34a", strokeWidth: 2.2 }),
  ...chr("hA", 58, 104, 164, C.maternal, "A", 0.3, -1), ...chr("ha", 94, 104, 164, C.paternal, "a"),
  ...chr("hB", 58, 170, 204, C.maternal, "B", 0.5, -1), ...chr("hb", 94, 170, 204, C.paternal, "b", 0.5),
  arrow("s1", 150, 150, 196, 150, C.line),
  ...gamete("g1", 236, 96, "AB"), ...gamete("g2", 294, 96, "Ab"), ...gamete("g3", 236, 196, "aB"), ...gamete("g4", 294, 196, "ab"),
  text("q", 265, 152, "¼ each", "¼ לכל סוג", { textColor: C.muted }),
  label("l_par", 16, 40, "Parent AaBb", "הורה AaBb", [76, 92], { anchor: "start" }),
  label("l_ind", 190, 272, "Genes on different chromosomes", "גנים על כרומוזומים שונים", [100, 190], { anchor: "start", shortHe: "כרומוזומים שונים", short: "Different chromosomes" }),
  text("l_4", 200, 44, "4 gamete types, 1:1:1:1", "4 סוגי גמטות, 1:1:1:1", { weight: 700, textColor: "#b45309" }),
];
const m3: El[] = [
  ...flower("fAA", 70, 110, PURPLE, 26), ...flower("fAa", 200, 110, PURPLE, 26), ...flower("faa", 330, 110, WHITE, 26),
  text("gAA", 70, 176, "AA", "AA", { ltr: true, weight: 800 }), text("gAa", 200, 176, "Aa", "Aa", { ltr: true, weight: 800 }), text("gaa", 330, 176, "aa", "aa", { ltr: true, weight: 800 }),
  text("pAA", 70, 204, "purple", "סגול", { textColor: PURPLE }), text("pAa", 200, 204, "purple", "סגול", { textColor: PURPLE }), text("paa", 330, 204, "white", "לבן", { textColor: C.muted }),
  line("brace", 50, 226, 220, 226, PURPLE, 2.5),
  text("same", 135, 250, "same phenotype", "אותו פנוטיפ", { weight: 700, textColor: PURPLE }),
  label("l_het", 250, 40, "Heterozygote: A masks a", "הטרוזיגוט: A מסתיר את a", [212, 92], { anchor: "start", shortHe: "A מסתיר את a", short: "A masks a" }),
  text("l_gt", 8, 284, "genotype ≠ phenotype", "גנוטיפ ≠ פנוטיפ", { anchor: "start", textColor: C.muted }),
];
const cells3: [string, string][] = [["AA", PURPLE], ["Aa", PURPLE], ["Aa", PURPLE], ["aa", WHITE]];
const m4: El[] = [
  text("cross", 110, 40, "Aa × Aa", "Aa × Aa", { ltr: true, weight: 800 }),
  ...punnett("ps", 52, 80, ["A", "a"], ["A", "a"], cells3),
  text("r_ph", 300, 110, "3 purple : 1 white", "3 סגול : 1 לבן", { weight: 700, textColor: PURPLE }),
  text("r_gt", 300, 150, "1 AA : 2 Aa : 1 aa", "1 AA : 2 Aa : 1 aa", { ltr: true, weight: 700 }),
  text("r_l1", 300, 86, "phenotypes", "פנוטיפים", { textColor: C.muted }),
  text("r_l2", 300, 180, "genotypes", "גנוטיפים", { textColor: C.muted }),
  label("l_f2", 190, 270, "F2 of a monohybrid cross", "צאצאי F2 בהכלאה חד-תכונתית", [152, 210], { anchor: "start", shortHe: "דור F2", short: "F2" }),
];
const cells5: [string, string][] = [["Aa", PURPLE], ["aa", WHITE], ["Aa", PURPLE], ["aa", WHITE]];
const m5: El[] = [
  text("cross", 110, 40, "Aa × aa", "Aa × aa", { ltr: true, weight: 800 }),
  ...punnett("ps", 52, 80, ["A", "a"], ["a", "a"], cells5),
  text("r_ph", 300, 100, "1 purple : 1 white", "1 סגול : 1 לבן", { weight: 700, textColor: PURPLE }),
  text("r_l1", 300, 76, "if parent is Aa", "אם ההורה Aa", { textColor: C.muted }),
  text("r_gt", 300, 170, "all purple", "כולם סגולים", { weight: 700, textColor: PURPLE }),
  text("r_l2", 300, 146, "if parent is AA", "אם ההורה AA", { textColor: C.muted }),
  label("l_tc", 190, 270, "Cross with recessive homozygote", "הכלאה עם הומוזיגוט רצסיבי", [110, 214], { anchor: "start", shortHe: "הכלאה עם aa", short: "Cross with aa" }),
];

export const mendelian: ProcessScene = {
  slug: "mendelian-genetics-animation-1780786392025",
  legend: [
    { color: C.maternal, he: "כרומוזום מהאם", en: "Maternal chromosome", swatch: "line" },
    { color: C.paternal, he: "כרומוזום מהאב", en: "Paternal chromosome", swatch: "line" },
    { color: "#b45309", he: "גמטה / אלל", en: "Gamete / allele", swatch: "ring" },
    { color: PURPLE, he: "פרח סגול (A דומיננטי)", en: "Purple flower (A dominant)", swatch: "dot" },
  ],
  steps: [
    {
      titleHe: "חוק ההיפרדות", titleEn: "Law of Segregation",
      descHe: "לכל אורגניזם דיפלואידי שני עותקים (אללים) של כל גן, אחד מכל הורה, הנמצאים באותו מיקום (לוקוס) על שני כרומוזומים הומולוגיים. במיוזה ההומולוגים נפרדים, ולכן כל גמטה מקבלת אלל אחד בלבד: הורה Aa יוצר גמטות A ו-a ביחס 1:1.",
      descEn: "A diploid organism has two copies (alleles) of each gene, one from each parent, at the same locus on a pair of homologous chromosomes. In meiosis the homologs separate, so each gamete receives only one allele: an Aa parent makes A and a gametes in a 1:1 ratio.",
      elements: m1,
    },
    {
      titleHe: "חוק המיון הבלתי תלוי", titleEn: "Law of Independent Assortment",
      descHe: "זוגות אללים של גנים שונים נפרדים זה מזה באופן בלתי תלוי בזמן יצירת הגמטות, כי כל זוג הומולוגים מסתדר באקראי במטאפאזה I. לכן הורה AaBb יוצר 4 סוגי גמטות — AB, Ab, aB, ab — ביחס 1:1:1:1. החוק תקף לגנים על כרומוזומים שונים (או רחוקים מאוד על אותו כרומוזום); גנים תאחיזים סמוכים אינם ממוינים באופן בלתי תלוי.",
      descEn: "Allele pairs of different genes segregate independently during gamete formation, because each homologous pair lines up at random in metaphase I. An AaBb parent therefore makes 4 gamete types — AB, Ab, aB, ab — in a 1:1:1:1 ratio. This holds for genes on different chromosomes (or far apart on one chromosome); closely linked genes do not assort independently.",
      elements: m2,
    },
    {
      titleHe: "דומיננטיות", titleEn: "Dominance",
      descHe: "בדומיננטיות מלאה האלל הדומיננטי (A) קובע את הפנוטיפ גם בהטרוזיגוט (Aa): פרחי AA ו-Aa סגולים, ורק aa (הומוזיגוט רצסיבי) לבן. לכן אותו פנוטיפ יכול להתאים ליותר מגנוטיפ אחד. דומיננטיות אינה אומרת שהאלל נפוץ יותר או 'טוב' יותר.",
      descEn: "With complete dominance the dominant allele (A) sets the phenotype even in the heterozygote (Aa): AA and Aa flowers are purple, and only aa (recessive homozygote) is white. So one phenotype can match more than one genotype. Dominance does not mean an allele is more common or 'better'.",
      elements: m3,
    },
    {
      titleHe: "יחס 3:1", titleEn: "The 3:1 Ratio",
      descHe: "בהכלאת שני הטרוזיגוטים (Aa × Aa) כל הורה תורם A או a בהסתברות ½. ריבוע פאנט מראה את 4 הצירופים השווים: יחס גנוטיפים 1 AA : 2 Aa : 1 aa, ויחס פנוטיפים 3 סגול : 1 לבן — היחס שמנדל מצא בדור F2.",
      descEn: "Crossing two heterozygotes (Aa × Aa), each parent gives A or a with probability ½. The Punnett square shows 4 equally likely combinations: genotypes 1 AA : 2 Aa : 1 aa, and phenotypes 3 purple : 1 white — the ratio Mendel found in the F2.",
      elements: m4,
    },
    {
      titleHe: "הכלאת מבחן", titleEn: "Testcross",
      descHe: "כדי לדעת אם פרט בעל פנוטיפ דומיננטי הוא AA או Aa, מכליאים אותו עם הומוזיגוט רצסיבי (aa). אם כל הצאצאים סגולים — ההורה כנראה AA; אם כמחציתם לבנים (יחס 1:1) — ההורה Aa.",
      descEn: "To learn whether an individual with the dominant phenotype is AA or Aa, cross it with a recessive homozygote (aa). If all offspring are purple, the parent is probably AA; if about half are white (1:1), the parent is Aa.",
      elements: m5,
    },
  ],
};

/* ── Non-Mendelian inheritance ───────────────────────────────────── */
const RED = "#dc2626", PINK = "#f9a8d4", WHT = "#f8fafc";
const snap = (id: string, cx: number, cy: number, color: string, r = 16): El[] => [
  path(`${id}_b`, `M ${cx - r} ${cy + r * 0.3} C ${cx - r} ${cy - r * 1.3} ${cx + r} ${cy - r * 1.3} ${cx + r} ${cy + r * 0.3} C ${cx + r * 0.5} ${cy + r * 0.9} ${cx - r * 0.5} ${cy + r * 0.9} ${cx - r} ${cy + r * 0.3} Z`, { color, stroke: "#9f1239", strokeWidth: 1.5 }),
  line(`${id}_s`, cx, cy + r * 0.7, cx, cy + r * 2.2, "#16a34a", 3),
];
const n1: El[] = [
  text("h0", 200, 36, "Heterozygote phenotype", "הפנוטיפ של ההטרוזיגוט", { weight: 700, textColor: C.muted }),
  text("h1", 70, 72, "Complete", "מלאה", { weight: 700 }),
  text("h2", 200, 72, "Incomplete", "חלקית", { weight: 700 }),
  text("h3", 330, 72, "Codominance", "קו-דומיננטיות", { weight: 700 }),
  ...flower("fc", 70, 130, PURPLE, 24), ...snap("sp", 200, 124, PINK, 24),
  circle("rbc", 330, 130, 30, "#fecaca", { stroke: "#b91c1c", strokeWidth: 2 }),
  circle("rbc_in", 330, 130, 14, "#fca5a5"),
  ...[0, 60, 120, 180, 240, 300].map((a, i) => { const t = (a * Math.PI) / 180; return i % 2 ? circle(`agB${i}`, 330 + 36 * Math.cos(t), 130 + 36 * Math.sin(t), 5, "#2563eb") : path(`agA${i}`, `M ${330 + 36 * Math.cos(t)} ${130 + 36 * Math.sin(t) - 6} l 6 10 l -12 0 z`, { color: "#16a34a" }); }),
  text("g1", 70, 200, "Aa → purple", "Aa → סגול", { ltr: true, weight: 700 }),
  text("g2", 200, 200, "CᴿCᵂ → pink", "CᴿCᵂ → ורוד", { ltr: true, weight: 700 }),
  text("g3", 330, 200, "IᴬIᴮ → AB", "IᴬIᴮ → AB", { ltr: true, weight: 700 }),
  text("q", 200, 262, "Mendel's laws still hold", "חוקי מנדל עדיין תקפים", { textColor: C.muted }),
];
const n2: El[] = [
  ...snap("pR", 60, 70, RED, 16), ...snap("pW", 150, 70, WHT, 16),
  text("x", 105, 80, "×", "×", { ltr: true, weight: 800 }),
  text("gP", 105, 124, "CᴿCᴿ × CᵂCᵂ", "CᴿCᴿ × CᵂCᵂ", { ltr: true, weight: 700 }),
  arrow("a1", 105, 136, 105, 164, C.line),
  ...snap("sp", 105, 188, PINK, 18),
  text("gF1", 105, 250, "F1: CᴿCᵂ pink", "F1: CᴿCᵂ ורוד", { ltr: true, weight: 700, textColor: "#be185d" }),
  text("f2t", 300, 60, "F2 (F1 × F1)", "F2 (F1 × F1)", { ltr: true, weight: 700 }),
  ...snap("f2a", 240, 130, RED, 14), ...snap("f2b", 280, 130, PINK, 14), ...snap("f2c", 320, 130, PINK, 14), ...snap("f2d", 360, 130, WHT, 14),
  text("ratio", 300, 238, "1 red : 2 pink : 1 white", "1 אדום : 2 ורוד : 1 לבן", { weight: 700, short: "1 : 2 : 1", shortHe: "1 : 2 : 1" }),
  text("same", 300, 266, "phenotype = genotype ratio", "יחס פנוטיפים = יחס גנוטיפים", { textColor: C.muted, short: "phenotype = genotype", shortHe: "פנוטיפ = גנוטיפ" }),
];
const antigenRing = (p: string, cx: number, cy: number, kinds: ("A" | "B")[]): El[] => [
  circle(`${p}_c`, cx, cy, 30, "#fecaca", { stroke: "#b91c1c", strokeWidth: 2 }),
  circle(`${p}_i`, cx, cy, 14, "#fca5a5"),
  ...kinds.map((k, i) => {
    const t = ((i * 360) / kinds.length) * (Math.PI / 180);
    const x = cx + 36 * Math.cos(t), y = cy + 36 * Math.sin(t);
    return k === "B" ? circle(`${p}_g${i}`, x, y, 5, "#2563eb") : path(`${p}_g${i}`, `M ${x.toFixed(1)} ${(y - 6).toFixed(1)} l 6 10 l -12 0 z`, { color: "#16a34a" });
  }),
];
const n3: El[] = [
  ...antigenRing("ra", 70, 110, ["A", "A", "A", "A", "A", "A"]),
  ...antigenRing("rab", 200, 110, ["A", "B", "A", "B", "A", "B"]),
  ...antigenRing("rb", 330, 110, ["B", "B", "B", "B", "B", "B"]),
  text("ga", 70, 178, "IᴬIᴬ / Iᴬi", "IᴬIᴬ / Iᴬi", { ltr: true, weight: 700 }),
  text("gab", 200, 178, "IᴬIᴮ", "IᴬIᴮ", { ltr: true, weight: 700 }),
  text("gb", 330, 178, "IᴮIᴮ / Iᴮi", "IᴮIᴮ / Iᴮi", { ltr: true, weight: 700 }),
  text("ta", 70, 204, "type A", "סוג A", { textColor: "#16a34a", weight: 700 }),
  text("tab", 200, 204, "type AB", "סוג AB", { textColor: "#7c3aed", weight: 700 }),
  text("tb", 330, 204, "type B", "סוג B", { textColor: "#2563eb", weight: 700 }),
  label("l_ab", 90, 270, "Both antigens expressed", "שני האנטיגנים מבוטאים", [206, 146], { anchor: "start", shortHe: "שני האנטיגנים", short: "Both antigens" }),
  text("l_rbc", 200, 40, "Red blood cell surface", "פני תא דם אדום", { textColor: C.muted }),
];
// polygenic: AaBbCc × AaBbCc → 7 classes 1:6:15:20:15:6:1
const COUNTS = [1, 6, 15, 20, 15, 6, 1];
const n4: El[] = [
  ...COUNTS.map((c, i) => rect(`bar${i}`, 62 + i * 42, 236 - c * 8.6, 34, c * 8.6, ["#fef3c7", "#fde68a", "#fcd34d", "#f59e0b", "#d97706", "#b45309", "#78350f"][i], { rx: 2, stroke: "#78350f", strokeWidth: 1 })),
  line("axis", 50, 237, 360, 237, C.line, 2),
  path("curve", "M 62 234 C 130 232 160 60 211 58 C 262 60 292 232 356 234", { stroke: "#be123c", strokeWidth: 2.5, dash: "5 4" }),
  ...COUNTS.map((c, i) => text(`n${i}`, 79 + i * 42, 228 - c * 8.6, String(c), String(c), { ltr: true, fontSize: 16.5, textColor: C.muted })),
  text("x0", 79, 260, "0", "0", { ltr: true, weight: 700 }), text("x6", 331, 260, "6", "6", { ltr: true, weight: 700 }),
  text("xl", 205, 286, "contributing alleles (skin tone, height…)", "מספר אללים 'מוסיפים' (צבע עור, גובה…)", { textColor: C.muted, short: "contributing alleles", shortHe: "אללים מוסיפים" }),
  text("cross", 20, 40, "AaBbCc × AaBbCc", "AaBbCc × AaBbCc", { anchor: "start", ltr: true, weight: 700 }),
  label("l_bell", 250, 40, "Bell-shaped distribution", "התפלגות פעמון", [262, 90], { anchor: "start" }),
];

export const nonMendelian: ProcessScene = {
  slug: "non-mendelian-inheritance-animation-1780786393174",
  legend: [
    { color: "#be185d", he: "צבע פרח / פנוטיפ", en: "Flower colour / phenotype", swatch: "dot" },
    { color: "#16a34a", he: "אנטיגן A", en: "A antigen", swatch: "dot" },
    { color: "#2563eb", he: "אנטיגן B", en: "B antigen", swatch: "dot" },
    { color: "#be123c", he: "התפלגות רציפה", en: "Continuous distribution", swatch: "dash" },
  ],
  steps: [
    {
      titleHe: "תורשה לא-מנדלית — מבוא", titleEn: "Non-Mendelian Inheritance — Introduction",
      descHe: "חוקי ההיפרדות והמיון של מנדל עדיין תקפים — האללים עוברים לגמטות באותו אופן. מה שמשתנה הוא הקשר בין גנוטיפ לפנוטיפ: בדומיננטיות חלקית ההטרוזיגוט הוא ביניים, בקו-דומיננטיות שני האללים מתבטאים במלואם, ובתורשה פוליגנית כמה גנים משפיעים על תכונה אחת.",
      descEn: "Mendel's laws of segregation and assortment still hold — alleles reach gametes the same way. What changes is the link between genotype and phenotype: with incomplete dominance the heterozygote is intermediate, with codominance both alleles are fully expressed, and with polygenic inheritance several genes affect one trait.",
      elements: n1,
    },
    {
      titleHe: "דומיננטיות חלקית", titleEn: "Incomplete Dominance",
      descHe: "בלוע-ארי (snapdragon) הכלאת פרחים אדומים (CᴿCᴿ) ולבנים (CᵂCᵂ) נותנת F1 ורוד (CᴿCᵂ): עותק אחד של האלל Cᴿ מייצר פחות פיגמנט. ב-F2 מתקבל יחס 1 אדום : 2 ורוד : 1 לבן — יחס הפנוטיפים זהה ליחס הגנוטיפים. האללים לא 'התערבבו': הלבן והאדום חוזרים ב-F2.",
      descEn: "In snapdragons, crossing red (CᴿCᴿ) and white (CᵂCᵂ) gives pink F1 (CᴿCᵂ): one copy of Cᴿ makes less pigment. The F2 is 1 red : 2 pink : 1 white — the phenotype ratio equals the genotype ratio. The alleles did not 'blend': red and white reappear in the F2.",
      elements: n2,
    },
    {
      titleHe: "קו-דומיננטיות", titleEn: "Codominance",
      descHe: "בקו-דומיננטיות שני האללים מתבטאים במלואם בהטרוזיגוט. בסוגי הדם ABO: האלל Iᴬ מוסיף סוכר A לפני תאי הדם האדומים והאלל Iᴮ סוכר B; לאדם IᴬIᴮ יש שניהם — סוג AB. האלל i (סוג O) רצסיבי לשניהם, כך ש-ABO הוא גם דוגמה לאללים מרובים. דוגמה נוספת: מערכת MN.",
      descEn: "With codominance both alleles are fully expressed in the heterozygote. In ABO blood groups, Iᴬ adds sugar A to red blood cells and Iᴮ adds sugar B; an IᴬIᴮ person has both — type AB. The i allele (type O) is recessive to both, so ABO is also an example of multiple alleles. Another example: the MN system.",
      elements: n3,
    },
    {
      titleHe: "תורשה פוליגנית", titleEn: "Polygenic Inheritance",
      descHe: "תכונות כמו גובה או גוון עור נקבעות על ידי גנים רבים שלכל אחד תרומה קטנה ומצטברת. בדגם של שלושה גנים (AaBbCc × AaBbCc) יש 7 מחלקות פנוטיפ ביחס 1:6:15:20:15:6:1 — וככל שמספר הגנים גדל ומתווספת השפעת הסביבה, ההתפלגות נעשית רציפה וצורתה פעמון.",
      descEn: "Traits such as height or skin tone are set by many genes, each adding a small effect. In a three-gene model (AaBbCc × AaBbCc) there are 7 phenotype classes in a 1:6:15:20:15:6:1 ratio — and as the number of genes grows and the environment adds its effect, the distribution becomes continuous and bell-shaped.",
      elements: n4,
    },
  ],
};
