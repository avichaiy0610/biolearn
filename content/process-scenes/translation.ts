import { C, CODON, TRNA_K, arrow, circle, gone, label, mrna, path, poly, ribosome, tag, text, trna, type El, type ProcessScene, type Pt } from "./kit";

// mRNA at y = 190; codons AUG UUC GGC GCA UAA starting at x = 110 (CODON px each).
const Y = 190, C0 = 110;
const codonX = (i: number) => C0 + i * CODON + CODON / 2; // centre of codon i
const CODONS = ["AUG", "UUC", "GGC", "GCA", "UAA"];
const AA = { met: "#7c3aed", phe: "#0ea5e9", gly: "#10b981", ala: "#f59e0b" };

function base(stopRed = false): El[] {
  return [
    ...mrna("m", 14, 386, Y, C0, CODONS, { colors: stopRed ? { 4: "#dc2626" } : { 0: "#b91c1c" } }),
    circle("cap", 14, Y, 6.5, "#065f46", { stroke: "#fff", strokeWidth: 1.5 }),
    tag("m5", 16, Y - 14, "5'"),
    text("tail", 366, Y + 21, "AAAA", "AAAA", { ltr: true, weight: 700, textColor: "#047857" }),
    tag("m3", 384, Y - 12, "3'"),
  ];
}

// Peptide residues: each residue is the amino-acid circle of the tRNA that brought it.
const aa = (id: string, cx: number, cy: number, color: string, o: Partial<El> = {}) =>
  circle(id, cx, cy, 6.5, color, { stroke: "#fff", strokeWidth: 1.5, ...o });

const TY = Y - 3;                       // tRNA anticodon loop sits on the mRNA
const AAY = TY - 52 * TRNA_K;            // amino-acid height on a tRNA
const rfPath = (ax: number) => poly([[ax - 14, TY], [ax - 14, TY - 35], [ax - 8, TY - 48], [ax - 11, TY - 68], [ax + 11, TY - 68], [ax + 8, TY - 48], [ax + 14, TY - 35], [ax + 14, TY]]);
const RF = (o: Partial<El> = {}) => path("rf", rfPath(codonX(4)), { color: "#fbcfe8", stroke: "#be185d", strokeWidth: 2, ...o });
const PEP0 = `M ${codonX(1)} ${AAY} L ${codonX(1)} ${AAY} L ${codonX(1)} ${AAY} L ${codonX(1)} ${AAY}`;
const PEP = (d = PEP0, o: Partial<El> = {}) => path("pep", d, { stroke: "#475569", strokeWidth: 2.5, ...o });

const step1: El[] = [
  ...gone(ribosome("rib", codonX(0), Y, { sites: true, small: false })),
  ...ribosome("rib", 76, Y, { large: false }),
  ...base(),
  ...trna("t1", 76, TY, { anticodon: "UAC", aa: "Met", aaColor: AA.met }),
  arrow("scan", 120, 262, 176, 262, C.line, 2.4),
  label("l40", 64, 286, "Small subunit (40S)", "תת-יחידה קטנה (40S)", [40, Y + 26], { anchor: "start", short: "40S", shortHe: "40S" }),
  label("lti", 130, 48, "Initiator tRNA (Met)", "tRNA התחלה (Met)", [80, AAY + 2], { anchor: "start" }),
  label("lcap", 8, 96, "5' cap", "כובע 5'", [14, Y - 8], { anchor: "start" }),
  label("laug", 250, 118, "Start codon AUG", "קודון התחלה AUG", [codonX(0), Y + 8], { anchor: "start", shortHe: "AUG", short: "AUG" }),
  text("lscan", 186, 268, "scanning", "סריקה", { anchor: "start", textColor: C.muted }),
];

const step2: El[] = [
  ...ribosome("rib", codonX(0), Y, { sites: true }),
  ...base(),
  ...trna("t1", codonX(0), TY, { anticodon: "UAC", aa: "Met", aaColor: AA.met }),
  ...gone([arrow("scan", 120, 262, 176, 262)]),
  label("l80", 290, 50, "80S ribosome", "ריבוזום 80S", [codonX(1) + 30, 96], { anchor: "start" }),
  label("lp", 14, 48, "Met-tRNA in P site", "tRNA התחלה באתר P", [codonX(0) - 10, AAY + 20], { anchor: "start", shortHe: "אתר P", short: "P site" }),
  label("la", 290, 140, "A site empty", "אתר A ריק", [codonX(1) + 8, 150], { anchor: "start" }),
];

const step3: El[] = [
  ...ribosome("rib", codonX(1), Y, { sites: true }),
  ...base(),
  // tRNAi stayed on AUG, which is now in the E site; its Met is now at the start of the chain
  ...trna("t1", codonX(0), TY, { anticodon: "UAC" }),
  aa("t1_aa", codonX(1) + 2.6, AAY - 17, AA.met),
  ...trna("t2", codonX(1), TY, { anticodon: "AAG", aa: "Phe", aaColor: AA.phe }),
  ...trna("t3", codonX(2), TY, { anticodon: "CCG", aa: "Gly", aaColor: AA.gly }),
  PEP(`M ${codonX(1) + 2.6} ${AAY - 17} L ${codonX(1) + 2.6} ${AAY} L ${codonX(1) + 2.6} ${AAY} L ${codonX(1) + 2.6} ${AAY}`),
  label("lbond", 262, 40, "Peptide bond", "קשר פפטידי", [codonX(1) + 4, AAY - 9], { anchor: "start" }),
  label("le", 10, 52, "E site: tRNA leaves", "אתר E — tRNA יוצא", [codonX(0) - 12, AAY + 26], { anchor: "start", shortHe: "יציאה (E)", short: "E: exit" }),
  label("la", 300, 128, "A site: next tRNA", "tRNA חדש באתר A", [codonX(2) + 14, AAY + 22], { anchor: "start", shortHe: "אתר A", short: "A site" }),
  arrow("trl", 130, 276, 176, 276, "#1d4ed8", 2.6),
  text("ltrl", 186, 282, "translocation: 1 codon", "טרנסלוקציה: קודון אחד", { anchor: "start", textColor: "#1d4ed8", short: "1 codon", shortHe: "קודון אחד" }),
];

// released polypeptide (N-terminal Met first), folding beside the ribosome
const OUT: Pt[] = [[344, 40], [364, 52], [352, 70], [372, 82]];
const step4: El[] = [
  ...ribosome("rib", codonX(3), Y, { sites: true }),
  ...base(true),
  ...gone(trna("t1", codonX(0), TY, { anticodon: "UAC" })),
  ...gone(trna("t2", codonX(1), TY, { anticodon: "AAG" })),
  ...gone(trna("t3", codonX(2), TY, { anticodon: "CCG" })),
  ...trna("t4", codonX(3), TY, { anticodon: "CGU" }),
  RF(),
  aa("t1_aa", ...OUT[0], AA.met),
  aa("t2_aa", ...OUT[1], AA.phe),
  aa("t3_aa", ...OUT[2], AA.gly),
  aa("t4_aa", ...OUT[3], AA.ala),
  PEP(poly(OUT, false)),
  label("lstop", 70, 282, "Stop codon UAA", "קודון עצירה UAA", [codonX(4), Y + 8], { anchor: "start", shortHe: "UAA", short: "UAA" }),
  label("lrf", 20, 40, "Release factor", "גורם שחרור", [codonX(4) - 6, TY - 40], { anchor: "start" }),
  label("lpep", 200, 30, "Protein released", "החלבון משתחרר", [344, 40], { anchor: "start", shortHe: "חלבון", short: "Protein" }),
];

// z-order: later tRNAs, the release factor and the chain exist (hidden) from step 1 so they paint above the ribosome
const hidden: El[] = gone([
  ...trna("t2", codonX(1), TY, { anticodon: "AAG", aa: "Phe", aaColor: AA.phe }),
  ...trna("t3", codonX(2), TY, { anticodon: "CCG", aa: "Gly", aaColor: AA.gly }),
  ...trna("t4", codonX(3), TY, { anticodon: "CGU", aa: "Ala", aaColor: AA.ala }),
  RF(),
  PEP(),
]);

export const translation: ProcessScene = {
  slug: "translation",
  legend: [
    { color: C.rna, he: "mRNA (קודונים)", en: "mRNA (codons)", swatch: "line" },
    { color: "#b45309", he: "tRNA (אנטי-קודון למטה)", en: "tRNA (anticodon at bottom)", swatch: "ring" },
    { color: "#1d4ed8", he: "ריבוזום: אתרים E, P, A", en: "Ribosome: E, P, A sites", swatch: "ring" },
    { color: AA.met, he: "חומצות אמינו", en: "Amino acids", swatch: "dot" },
    { color: "#be185d", he: "גורם שחרור", en: "Release factor", swatch: "dot" },
  ],
  steps: [
    {
      titleHe: "קשירת mRNA לריבוזום וסריקה", titleEn: "mRNA Binds the Small Subunit and Scans",
      descHe: "ה-mRNA הבוגר יוצא מהגרעין לציטופלזמה. תת-היחידה הקטנה (40S באאוקריוטים), שכבר נושאת את tRNA ההתחלה (Met-tRNAᵢ) וגורמי התחלה (eIFs), נקשרת לכובע 5' וסורקת לכיוון 3' עד שהאנטי-קודון UAC מזווג לקודון ההתחלה AUG.",
      descEn: "Mature mRNA leaves the nucleus. The small subunit (40S in eukaryotes), already carrying the initiator tRNA (Met-tRNAi) and initiation factors (eIFs), binds the 5' cap and scans toward the 3' end until the UAC anticodon pairs with the start codon AUG.",
      elements: [...step1, ...hidden],
      highlight: ["rib_S", "t1_body", "t1_acc", "t1_aa", "cap", "m_s"],
    },
    {
      titleHe: "קומפלקס ההתחלה — ריבוזום 80S", titleEn: "Initiation Complex — the 80S Ribosome",
      descHe: "לאחר זיהוי AUG משתחררים גורמי ההתחלה ותת-היחידה הגדולה (60S) מצטרפת → ריבוזום 80S שלם. tRNA ההתחלה יושב באתר P מול AUG, ואתר A ריק ומוכן לקבל את ה-aminoacyl-tRNA הבא.",
      descEn: "Once AUG is recognised, initiation factors are released and the large subunit (60S) joins to form the complete 80S ribosome. The initiator Met-tRNAi sits in the P site on AUG; the A site is empty, ready for the next aminoacyl-tRNA.",
      elements: [...step2, ...hidden],
      highlight: ["rib_L", "rib_S", "rib_sP", "rib_sA", "t1_body", "t1_acc", "t1_aa"],
    },
    {
      titleHe: "הארכה — הוספת חומצות אמינו", titleEn: "Elongation — Adding Amino Acids",
      descHe: "aminoacyl-tRNA שהאנטי-קודון שלו משלים לקודון נכנס לאתר A. מרכז הפפטידיל-טרנספראז (rRNA — ריבוזים) מעביר את השרשרת אל חומצת האמינו החדשה ויוצר קשר פפטידי. אז הריבוזום מתקדם קודון אחד (טרנסלוקציה): ה-tRNA מאתר P עובר ל-E ויוצא, וה-tRNA מאתר A עובר ל-P. השרשרת גדלה מהקצה N ל-C.",
      descEn: "An aminoacyl-tRNA whose anticodon matches the codon enters the A site. The peptidyl-transferase centre (rRNA — a ribozyme) transfers the chain onto the new amino acid, forming a peptide bond. The ribosome then moves one codon (translocation): the P-site tRNA shifts to E and leaves, the A-site tRNA shifts to P. The chain grows N → C.",
      elements: [...hidden, ...step3],
      highlight: ["t1_body", "t1_acc", "t1_aa", "t2_body", "t2_acc", "t2_aa", "t3_body", "t3_acc", "t3_aa", "trl", "pep", "m_s"],
    },
    {
      titleHe: "סיום — קודון עצירה ושחרור החלבון", titleEn: "Termination — Stop Codon and Protein Release",
      descHe: "כשקודון עצירה (UAA, UAG או UGA) מגיע לאתר A אין tRNA משלים. גורם שחרור (eRF1), חלבון שצורתו מחקה tRNA, נקשר לאתר A ומפעיל את מרכז הפפטידיל-טרנספראז להוסיף מולקולת מים — הקשר בין השרשרת ל-tRNA נחתך. החלבון משתחרר ומתקפל, ותתי-היחידות נפרדות וממוחזרות.",
      descEn: "When a stop codon (UAA, UAG or UGA) reaches the A site there is no matching tRNA. A release factor (eRF1), a protein shaped like a tRNA, binds the A site and makes the peptidyl-transferase centre add water, cutting the chain from the tRNA. The protein is released and folds; the subunits separate and are recycled.",
      elements: step4,
      highlight: ["rf", "t1_aa", "t2_aa", "t3_aa", "t4_aa", "pep", "m_c4"],
    },
  ],
};
