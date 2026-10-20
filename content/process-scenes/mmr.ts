import { arrow, circle, dsDNA, ellipse, label, line, path, rect, smooth, text, type El, type ProcessScene } from "./kit";

/* ══ DNA MISMATCH REPAIR in E. coli (Lewin's Genes XII §14.7; Alberts 7e ch. 5) ══════
   One duplex across the scene: the old (template) strand on top, the new strand below. The mismatch sits on
   the right, a hemimethylated GATC on the left — the only thing that tells the two strands apart.
   One idea per step; proteins appear for their step and leave. */

const OLD = "#475569", NEW = "#16a34a", NEW2 = "#86efac", BAD = "#dc2626", MUT = "#7c3aed", POL = "#1d4ed8";
const Y = 160, YT = Y - 7, YB = Y + 7; // duplex centre, top (old) and bottom (new) strand
const GX = 84, MX = 276; // GATC site, mismatch

const duplex = (): El[] => dsDNA("dx", 30, 370, Y, { tags: true, top: OLD, bottom: NEW });
// GATC site: methyl only on the old strand
const gatc = (newMethyl = false): El[] => [
  rect("gatc", GX - 18, Y - 16, 36, 32, "none", { stroke: "#94a3b8", strokeWidth: 1.4, rx: 5, dash: "3 3" }),
  text("gatc_t", GX, Y + 34, "GATC", "GATC", { ltr: true, weight: 700, fontSize: 13, textColor: "#64748b" }),
  circle("me_old", GX, YT - 14, 7, "#fde68a", { stroke: "#b45309", strokeWidth: 1.5 }),
  text("me_old_t", GX, YT - 26, "CH₃", "CH₃", { ltr: true, weight: 700, fontSize: 12, textColor: "#b45309" }),
  circle("me_new", GX, YB + 14, 7, "#fde68a", { stroke: "#b45309", strokeWidth: 1.5, opacity: newMethyl ? 1 : 0 }),
];
// the mismatched pair: G on the old strand, T (wrong) on the new one
const pair = (fixed = false): El[] => [
  rect("mm_t", MX - 5, YT - 2, 10, 9, OLD),
  rect("mm_b", MX - 5, YB - 7, 10, 9, fixed ? NEW : BAD),
  text("mm_tl", MX, YT - 12, "G", "G", { ltr: true, weight: 700, fontSize: 14, textColor: OLD }),
  text("mm_bl", MX, YB + 22, fixed ? "C" : "T", fixed ? "C" : "T", { ltr: true, weight: 700, fontSize: 14, textColor: fixed ? NEW : BAD }),
];
const muts = (op = 1): El => ellipse("muts", MX, Y, 20, 24, "none", { stroke: MUT, strokeWidth: 5, opacity: op });
const mutl = (op = 1): El => path("mutl", smooth([[MX + 22, Y - 22], [MX + 30, Y - 46], [MX + 52, Y - 46], [MX + 56, Y - 26], [MX + 40, Y - 18]], true), { color: "#ede9fe", stroke: MUT, strokeWidth: 2, opacity: op });
const muth = (op = 1): El => path("muth", smooth([[GX + 18, YB + 8], [GX + 20, YB + 30], [GX + 44, YB + 30], [GX + 46, YB + 8]], true), { color: "#fce7f3", stroke: "#be185d", strokeWidth: 2, opacity: op });

const s1: El[] = [
  ...duplex(), ...gatc(), ...pair(),
  label("l_mm", 210, 64, "G opposite T: a mismatch", "G מול T — אי-התאמה", [MX, YB + 4], { anchor: "start" }),
  label("l_me", 14, 64, "Only the old strand is methylated", "רק הגדיל הישן ממותל", [GX, YT - 20], { anchor: "start", shortHe: "גדיל ישן ממותל", short: "Old strand methylated" }),
  text("t_new", 200, 252, "new strand — just made", "הגדיל החדש — זה עתה נבנה", { weight: 700, fontSize: 15, textColor: NEW }),
];
const s2: El[] = [
  ...duplex(), ...gatc(), ...pair(), muts(), mutl(),
  label("l_muts", 200, 252, "MutS clamps the mismatch", "MutS נצמד לאי-ההתאמה", [MX - 14, Y + 20], { anchor: "start" }),
  label("l_mutl", 210, 64, "MutL joins", "MutL מצטרף", [MX + 40, Y - 44], { anchor: "start" }),
];
const s3: El[] = [
  ...duplex(), ...gatc(), ...pair(), muts(), mutl(), muth(),
  path("link", smooth([[MX + 30, Y - 46], [200, 86], [120, 96], [GX + 40, YB + 26]]), { stroke: MUT, strokeWidth: 1.8, dash: "4 4" }),
  path("nick", `M ${GX + 22} ${YB - 6} L ${GX + 26} ${YB + 6} M ${GX + 30} ${YB - 6} L ${GX + 26} ${YB + 6}`, { stroke: BAD, strokeWidth: 2.4 }),
  label("l_muth", 14, 252, "MutH nicks the unmethylated strand", "MutH חותך את הגדיל הלא-ממותל", [GX + 26, YB + 2], { anchor: "start", shortHe: "MutH חותך", short: "MutH nicks" }),
];
const s4: El[] = [
  ...duplex(), ...gatc(), ...pair(), muts(0), mutl(0), muth(0),
  line("gap", GX + 26, YB, MX + 18, YB, "#ffffff", 7),
  rect("mm_b", MX - 5, YB - 7, 10, 9, BAD, { opacity: 0 }),
  text("mm_bl", MX, YB + 22, "T", "T", { ltr: true, weight: 700, fontSize: 14, textColor: BAD, opacity: 0 }),
  ...[130, 168, 206, 244].map((x, i) => ellipse(`ssb${i}`, x, YB + 4, 11, 6, "#e2e8f0", { stroke: OLD, strokeWidth: 1.3 })),
  ...[[150, 206], [190, 222], [232, 210], [268, 226], [210, 238]].map(([x, y], i) => circle(`nt${i}`, x, y, 3, NEW)),
  label("l_exo", 14, 64, "The new strand is removed past the mismatch", "הגדיל החדש מוסר עד מעבר לאי-ההתאמה", [180, YB], { anchor: "start", shortHe: "הסרת קטע", short: "Stretch removed" }),
];
const s5: El[] = [
  ...duplex(), ...gatc(true), ...pair(true),
  line("gap", GX + 26, YB, MX + 18, YB, NEW2, 4),
  path("pol", smooth([[MX + 16, YB + 6], [MX + 20, YB + 30], [MX + 44, YB + 30], [MX + 46, YB + 6]], true), { color: "#dbeafe", stroke: POL, strokeWidth: 2 }),
  circle("lig", GX + 26, YB + 16, 8, "#dcfce7", { stroke: "#15803d", strokeWidth: 2 }),
  arrow("pol_ar", MX - 30, YB + 40, MX - 70, YB + 40, POL, 2),
  label("l_pol", 200, 252, "DNA polymerase III refills — now C", "DNA פולימראז III משלים — הפעם C", [MX + 30, YB + 28], { anchor: "start", shortHe: "השלמה עם C", short: "Refilled with C" }),
  label("l_lig", 14, 252, "Ligase seals", "ליגאז סוגר", [GX + 26, YB + 22], { anchor: "start" }),
  label("l_dam", 14, 64, "Dam then methylates the new GATC", "Dam ממתל אחר כך גם את הגדיל החדש", [GX, YB + 14], { anchor: "start", shortHe: "מתילציה", short: "Methylated" }),
];

export const mmrScene: ProcessScene = {
  slug: "dna-mismatch-repair",
  meta: {
    topic: "molecular-biology",
    nameHe: "תיקון אי-התאמות ב-DNA", nameEn: "DNA Mismatch Repair",
    descHe: "זיהוי בסיס לא תואם אחרי שכפול, זיהוי הגדיל החדש לפי המתילציה, הסרת קטע והשלמתו בידי פולימראז וליגאז",
    descEn: "Spotting a mismatched base after replication, telling the new strand by its methylation, removing a stretch and refilling it with polymerase and ligase",
    source: "Lewin's Genes XII §14.7; Alberts 7e ch. 5",
  },
  legend: [
    { color: OLD, he: "הגדיל הישן (תבנית)", en: "Old (template) strand", swatch: "line" },
    { color: NEW, he: "הגדיל החדש", en: "New strand", swatch: "line" },
    { color: BAD, he: "בסיס שגוי / חתך", en: "Wrong base / nick", swatch: "dot" },
    { color: MUT, he: "MutS / MutL", en: "MutS / MutL", swatch: "ring" },
    { color: "#b45309", he: "קבוצת מתיל על GATC", en: "Methyl group on GATC", swatch: "dot" },
  ],
  steps: [
    {
      titleHe: "אי-התאמה אחרי השכפול", titleEn: "A Mismatch After Replication",
      descHe: "DNA פולימראז מגיה את עצמו, ובכל זאת בערך בסיס אחד ל-10⁷ נשאר לא תואם — כאן T מול G. שני הבסיסים תקינים כימית, ולכן השאלה היא איזה מהם הטעות. ב-E. coli התשובה ברצף GATC: האנזים Dam ממתל אותו, אבל רק דקות אחרי השכפול — ובינתיים רק הגדיל הישן ממותל.",
      descEn: "DNA polymerase proofreads itself, yet about one base in 10⁷ is left mismatched — here T opposite G. Both bases are chemically normal, so the question is which one is the error. In E. coli the answer is the GATC sequence: Dam methylates it, but only minutes after replication — meanwhile only the old strand carries the methyl.",
      elements: s1,
    },
    {
      titleHe: "MutS מזהה את אי-ההתאמה", titleEn: "MutS Finds the Mismatch",
      descHe: "החלבון MutS סורק את ה-DNA ונצמד למקום שבו הסליל מעוות בגלל אי-ההתאמה. MutL מצטרף אליו ומקשר אותו לשלב הבא.",
      descEn: "MutS scans the DNA and clamps onto the spot where the helix is distorted by the mismatch. MutL joins it and links it to the next step.",
      elements: s2,
    },
    {
      titleHe: "MutH מסמן את הגדיל החדש", titleEn: "MutH Marks the New Strand",
      descHe: "MutL מפעיל את MutH, שיושב על אתר GATC חצי-ממותל — לפעמים במרחק של מאות או אלף זוגות בסיסים. MutH חותך (nick) את הגדיל הלא-ממותל — החדש. כך המערכת יודעת לתקן בגדיל הנכון.",
      descEn: "MutL activates MutH, which sits on a hemimethylated GATC — sometimes hundreds or a thousand base pairs away. MutH nicks the unmethylated strand — the new one. That is how the system knows which strand to fix.",
      elements: s3,
    },
    {
      titleHe: "הסרת קטע מהגדיל החדש", titleEn: "Removing a Stretch of the New Strand",
      descHe: "מהחתך, הליקאז (UvrD) ואקסונוקלאזות מפרקים את הגדיל החדש עד מעבר לבסיס השגוי. החלבון SSB מכסה את גדיל התבנית שנחשף, שנשאר שלם.",
      descEn: "From the nick, a helicase (UvrD) and exonucleases strip the new strand past the wrong base. SSB coats the exposed template strand, which stays intact.",
      elements: s4,
    },
    {
      titleHe: "השלמה וסגירה", titleEn: "Refilling and Sealing",
      descHe: "DNA פולימראז III משלים את הפער לפי התבנית — הפעם עם C מול G — ו-DNA ליגאז סוגר את החריץ. אחר כך Dam ממתל גם את הגדיל החדש. באדם המערכת דומה (MSH2, MLH1), והגדיל החדש מזוהה לפי חתכים; פגמים בה גורמים לתסמונת לינץ' — סרטן מעי גס תורשתי.",
      descEn: "DNA polymerase III refills the gap from the template — this time with C opposite G — and DNA ligase seals the nick. Dam then methylates the new strand too. In humans the system is similar (MSH2, MLH1), and the new strand is recognised by nicks; defects cause Lynch syndrome — hereditary colon cancer.",
      elements: s5,
    },
  ],
};
