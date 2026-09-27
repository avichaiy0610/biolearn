import { C, arrow, badge, bilayer, circle, dsDNA, ellipse, label, line, path, poly, rect, ring, smooth, text, wave, type El, type ProcessScene, type Pt } from "./kit";

const f = (n: number) => Math.round(n * 10) / 10;

/* ══ SYNAPTIC TRANSMISSION — neuromuscular/chemical synapse (Berne & Levy 8e ch. 6) ══ */
const CA = "#0ea5e9", ACH = "#16a34a", NA2 = "#f97316";
// presynaptic terminal (top) and postsynaptic membrane (bottom) with a cleft between
const terminal = (): El[] => [
  path("pre", "M 20 20 L 20 118 C 60 138 340 138 380 118 L 380 20 Z", { color: "#e0f2fe", stroke: "#0369a1", strokeWidth: 2.5 }),
  ...bilayer("post", 0, 400, 196, { th: 14 }),
  text("t_pre", 14, 40, "axon terminal", "קצה האקסון", { anchor: "start", weight: 700, textColor: "#0369a1" }),
  text("t_post", 14, 290, "postsynaptic cell", "התא הבתר-סינפטי", { anchor: "start", weight: 700, textColor: C.muted }),
];
const ves = (id: string, x: number, y: number, fused = false): El[] => fused
  ? [path(id, `M ${x - 14} 124 Q ${x} 146 ${x + 14} 124`, { stroke: "#0369a1", strokeWidth: 2 })]
  : [circle(id, x, y, 13, "#f0fdf4", { stroke: "#16a34a", strokeWidth: 1.8 }), ...[[-4, -3], [4, 2], [-2, 5]].map(([dx, dy], i) => circle(`${id}_n${i}`, x + dx, y + dy, 2.4, ACH))];
const vgcc = (open: boolean): El[] => [
  rect("cach_l", 110, 112, 8, 24, "#bae6fd", { rx: 2, stroke: "#0369a1", strokeWidth: 1.2 }),
  rect("cach_r", open ? 126 : 120, 112, 8, 24, "#bae6fd", { rx: 2, stroke: "#0369a1", strokeWidth: 1.2 }),
];
const receptor = (x: number, open: boolean): El[] => [
  rect(`rc${x}_l`, x - 12, 182, 8, 28, "#fbcfe8", { rx: 2, stroke: "#be185d", strokeWidth: 1.2 }),
  rect(`rc${x}_r`, open ? x + 6 : x + 2, 182, 8, 28, "#fbcfe8", { rx: 2, stroke: "#be185d", strokeWidth: 1.2 }),
];
const RECS = [170, 230, 290];
const APs = [[60, 70], [150, 80], [300, 72]] as const;
const sy1: El[] = [
  ...terminal(), ...vgcc(false), ...RECS.flatMap((x) => receptor(x, false)),
  ...APs.flatMap(([x, y], i) => ves(`v${i}`, x, y)),
  arrow("ap", 380, 60, 300, 104, "#dc2626", 2.4),
  label("l_ap", 250, 170, "Action potential arrives", "פוטנציאל פעולה מגיע", [340, 82], { anchor: "start", shortHe: "פוטנציאל פעולה", short: "Action potential" }),
  label("l_ves", 14, 170, "Vesicles full of acetylcholine", "שלפוחיות עם אצטילכולין", [60, 70], { anchor: "start", shortHe: "שלפוחיות ACh", short: "ACh vesicles" }),
];
const sy2: El[] = [
  ...terminal(), ...vgcc(true), ...RECS.flatMap((x) => receptor(x, false)),
  ...ves("v0", 60, 70), ...ves("v1", 150, 108), ...ves("v2", 230, 108),
  ...[[122, 92], [134, 100], [124, 104]].map(([x, y], i) => circle(`ca${i}`, x, y, 3.5, CA)),
  label("l_ca", 250, 170, "Ca²⁺ enters through channels", "Ca²⁺ נכנס דרך תעלות", [124, 104], { anchor: "start", shortHe: "כניסת Ca²⁺", short: "Ca²⁺ enters" }),
  label("l_dock", 14, 170, "SNAREs dock vesicles", "חלבוני SNARE מעגנים", [150, 108], { anchor: "start", shortHe: "עגינה", short: "Docking" }),
];
const ACH_CLEFT: Pt[] = [[148, 152], [160, 166], [176, 158], [228, 156], [240, 170], [214, 164], [286, 160], [300, 172]];
const sy3: El[] = [
  ...terminal(), ...vgcc(true), ...RECS.flatMap((x) => receptor(x, false)),
  ...ves("v0", 60, 70), ...ves("v1", 150, 0, true), ...ves("v2", 230, 0, true),
  ...ACH_CLEFT.map(([x, y], i) => circle(`ach${i}`, x, y, 2.6, ACH)),
  label("l_exo", 250, 60, "Exocytosis into the cleft", "אקסוציטוזה למרווח הסינפטי", [230, 130], { anchor: "start", shortHe: "אקסוציטוזה", short: "Exocytosis" }),
  label("l_cl", 14, 240, "Synaptic cleft (~20 nm)", "המרווח הסינפטי", [110, 160], { anchor: "start" }),
];
const sy4: El[] = [
  ...terminal(), ...vgcc(false), ...RECS.flatMap((x) => receptor(x, true)),
  ...ves("v0", 60, 70),
  ...RECS.flatMap((x, k) => [circle(`ach${2 * k}`, x - 6, 176, 2.6, ACH), circle(`ach${2 * k + 1}`, x + 10, 176, 2.6, ACH)]),
  ...[[178, 222], [240, 228], [296, 220]].map(([x, y], i) => circle(`nai${i}`, x, y, 4, NA2)),
  label("l_rec", 250, 60, "ACh opens receptor channels", "ACh פותח תעלות-קולטן", [236, 184], { anchor: "start", shortHe: "תעלות-קולטן", short: "Receptor channels" }),
  label("l_epsp", 250, 290, "Na⁺ in: depolarisation (EPSP)", "Na⁺ נכנס: דה-פולריזציה", [240, 228], { anchor: "start", shortHe: "דה-פולריזציה", short: "EPSP" }),
];
const sy5: El[] = [
  ...terminal(), ...vgcc(false), ...RECS.flatMap((x) => receptor(x, false)),
  ...ves("v0", 60, 70), ...ves("v1", 150, 76), ...ves("v2", 230, 84),
  path("ache", smooth([[250, 150], [266, 140], [282, 150], [276, 164], [256, 164]], true), { color: "#fde68a", stroke: "#b45309", strokeWidth: 1.8 }),
  ...[[292, 146], [300, 158], [306, 150]].map(([x, y], i) => circle(`frag${i}`, x, y, 2, "#94a3b8")),
  arrow("reup", 330, 150, 330, 128, "#94a3b8", 2),
  label("l_ache", 14, 240, "Acetylcholinesterase splits ACh", "אצטילכולין-אסטראז מפרק ACh", [256, 158], { anchor: "start", shortHe: "פירוק ACh", short: "ACh broken down" }),
  label("l_rec2", 250, 60, "Choline taken back up", "הכולין נקלט מחדש", [330, 132], { anchor: "start", shortHe: "קליטה מחדש", short: "Reuptake" }),
];
export const synapse: ProcessScene = {
  slug: "synaptic-transmission",
  meta: {
    topic: "physiology",
    nameHe: "העברה סינפטית כימית", nameEn: "Chemical Synaptic Transmission",
    descHe: "מפוטנציאל פעולה בקצה האקסון, דרך כניסת Ca²⁺ ושחרור אצטילכולין, עד פתיחת תעלות בתא הבתר-סינפטי וסיום האות",
    descEn: "From an action potential in the axon terminal, through Ca²⁺ entry and acetylcholine release, to opening channels in the postsynaptic cell and ending the signal",
    source: "Berne & Levy 8e ch. 6",
  },
  legend: [
    { color: "#0369a1", he: "קצה האקסון / תעלות Ca²⁺", en: "Axon terminal / Ca²⁺ channels", swatch: "ring" },
    { color: ACH, he: "אצטילכולין (ACh)", en: "Acetylcholine (ACh)", swatch: "dot" },
    { color: CA, he: "Ca²⁺", en: "Ca²⁺", swatch: "dot" },
    { color: "#be185d", he: "קולטן-תעלה ל-ACh", en: "ACh receptor channel", swatch: "ring" },
    { color: NA2, he: "Na⁺", en: "Na⁺", swatch: "dot" },
  ],
  steps: [
    {
      titleHe: "פוטנציאל פעולה מגיע לקצה האקסון", titleEn: "An Action Potential Reaches the Terminal",
      descHe: "בקצה האקסון מאוחסן המוליך העצבי — כאן אצטילכולין (ACh), כמו בצומת עצב-שריר — בשלפוחיות סינפטיות. פוטנציאל הפעולה שמתקדם לאורך האקסון מגיע לקצה ומבצע בו דה-פולריזציה.",
      descEn: "The axon terminal stores its neurotransmitter — here acetylcholine (ACh), as at the neuromuscular junction — in synaptic vesicles. The action potential travelling down the axon reaches the terminal and depolarises it.",
      elements: sy1,
    },
    {
      titleHe: "כניסת Ca²⁺ ועגינת שלפוחיות", titleEn: "Ca²⁺ Entry and Vesicle Docking",
      descHe: "הדה-פולריזציה פותחת תעלות Ca²⁺ תלויות מתח, ו-Ca²⁺ נכנס לקצה העצב. חלבוני SNARE מחזיקים שלפוחיות עגונות ליד הממברנה, והחיישן סינפטוטגמין קושר Ca²⁺ ומפעיל את ההיתוך.",
      descEn: "Depolarisation opens voltage-gated Ca²⁺ channels, and Ca²⁺ enters the terminal. SNARE proteins hold vesicles docked at the membrane, and the sensor synaptotagmin binds Ca²⁺ and triggers fusion.",
      elements: sy2,
    },
    {
      titleHe: "אקסוציטוזה של המוליך", titleEn: "Exocytosis of the Transmitter",
      descHe: "השלפוחיות מתמזגות עם הממברנה הקדם-סינפטית ומשחררות ACh למרווח הסינפטי — רווח צר של כ-20 ננומטר. המוליך מתפזר אל הממברנה הבתר-סינפטית תוך פחות ממילישנייה.",
      descEn: "Vesicles fuse with the presynaptic membrane and release ACh into the synaptic cleft — a gap of about 20 nm. The transmitter diffuses to the postsynaptic membrane in under a millisecond.",
      elements: sy3,
    },
    {
      titleHe: "הפעלת קולטנים בתא הבתר-סינפטי", titleEn: "Postsynaptic Receptors Open",
      descHe: "ACh נקשר לקולטנים ניקוטיניים — תעלות יונים תלויות ליגנד. התעלות נפתחות, Na⁺ נכנס (ו-K⁺ יוצא במידה פחותה), והממברנה עוברת דה-פולריזציה: פוטנציאל מעורר (EPSP, ובשריר פוטנציאל לוחית הקצה). אם הוא מגיע לסף — נוצר פוטנציאל פעולה בתא הבא.",
      descEn: "ACh binds nicotinic receptors — ligand-gated ion channels. They open, Na⁺ flows in (and less K⁺ out), and the membrane depolarises: an excitatory potential (EPSP; in muscle, the end-plate potential). If it reaches threshold, the next cell fires an action potential.",
      elements: sy4,
    },
    {
      titleHe: "סיום האות", titleEn: "Ending the Signal",
      descHe: "האנזים אצטילכולין-אסטראז במרווח מפרק את ה-ACh לכולין ולאצטט תוך מילישניות, התעלות נסגרות, והכולין נקלט חזרה לקצה העצב לייצור ACh חדש. מוליכים אחרים מסולקים בעיקר בקליטה חוזרת.",
      descEn: "Acetylcholinesterase in the cleft splits ACh into choline and acetate within milliseconds, the channels close, and choline is taken back into the terminal to make new ACh. Other transmitters are cleared mainly by reuptake.",
      elements: sy5,
    },
  ],
};

/* ══ SKELETAL MUSCLE CONTRACTION — cross-bridge cycle (Berne & Levy 8e ch. 12) ══ */
// one half-sarcomere: thin actin filament (with tropomyosin) above a thick myosin filament
const AY = 110, MYO = 200;
const actin = (dx: number): El[] => [
  ...Array.from({ length: 12 }, (_, i) => circle(`ac${i}`, 40 + dx + i * 26, AY, 11, "#fecaca", { stroke: "#b91c1c", strokeWidth: 1.2 })),
  line("zline", 30 + dx, 60, 30 + dx, 150, "#475569", 5),
];
const tropo = (dx: number, covered: boolean) => path("tropo", `M ${40 + dx} ${covered ? AY : AY - 12} C ${120 + dx} ${covered ? AY - 4 : AY - 18} ${220 + dx} ${covered ? AY + 4 : AY - 8} ${330 + dx} ${covered ? AY : AY - 14}`, { stroke: "#7c3aed", strokeWidth: 4 });
const myosinHead = (x: number, state: "cocked" | "bound" | "stroke" | "detached", withATP: boolean, withADP: boolean): El[] => {
  const neck: Pt = [x, MYO - 16];
  const tip: Pt = state === "cocked" ? [x + 14, AY + 32] : state === "bound" ? [x + 14, AY + 14] : state === "stroke" ? [x - 26, AY + 16] : [x - 16, AY + 40];
  return [
    path("mneck", `M ${neck[0]} ${neck[1]} Q ${neck[0] - 4} ${(neck[1] + tip[1]) / 2 + 10} ${tip[0]} ${tip[1] + 10}`, { stroke: "#1d4ed8", strokeWidth: 5 }),
    ellipse("mhead2", tip[0] - 8, tip[1] + 12, 11, 8, "#bfdbfe", { stroke: "#1d4ed8", strokeWidth: 1.5 }),
    ellipse("mhead", tip[0], tip[1] + 4, 13, 9, "#93c5fd", { stroke: "#1d4ed8", strokeWidth: 1.8 }),
    text("m_atp", tip[0] + 32, tip[1] + 10, withATP ? "ATP" : withADP ? "ADP+Pᵢ" : "", withATP ? "ATP" : withADP ? "ADP+Pᵢ" : "", { ltr: true, fontSize: 16.5, weight: 700, textColor: "#b45309", opacity: withATP || withADP ? 1 : 0 }),
  ];
};
// thick filament: myosin tails packed into a bundle, two-headed myosin molecules projecting
// along its length (heads point away from the M line, toward the Z line)
const MYO_X = [90, 130, 170, 240, 280, 320];
const thick = (): El[] => [
  path("myo", [MYO - 10, MYO - 4, MYO + 2, MYO + 8].map((y) => `M 60 ${y} L 380 ${y}`).join(" "), { stroke: "#1d4ed8", strokeWidth: 3 }),
  ...MYO_X.flatMap((x, i) => [
    path(`mn${i}`, `M ${x} ${MYO - 10} Q ${x - 2} ${MYO - 26} ${x - 12} ${MYO - 34}`, { stroke: "#1d4ed8", strokeWidth: 3 }),
    ellipse(`mh${i}a`, x - 16, MYO - 38, 9, 6, "#93c5fd", { stroke: "#1d4ed8", strokeWidth: 1.3 }),
    ellipse(`mh${i}b`, x - 6, MYO - 42, 9, 6, "#bfdbfe", { stroke: "#1d4ed8", strokeWidth: 1.3 }),
    path(`mnb${i}`, `M ${x} ${MYO + 8} Q ${x - 2} ${MYO + 22} ${x - 12} ${MYO + 30}`, { stroke: "#1d4ed8", strokeWidth: 3, opacity: 0.55 }),
  ]),
  line("mline", 380, MYO - 30, 380, MYO + 30, "#475569", 5),
];
const mc1: El[] = [
  ...actin(0), tropo(0, true), ...thick(), ...myosinHead(200, "cocked", false, true),
  label("l_act", 14, 40, "Thin filament: actin", "חוט דק: אקטין", [118, AY - 8], { anchor: "start" }),
  label("l_tro", 230, 40, "Tropomyosin blocks sites", "טרופומיוזין חוסם", [260, AY], { anchor: "start" }),
  label("l_myo", 14, 270, "Thick filament: two-headed myosins", "חוט עבה: מולקולות מיוזין דו-ראשיות", [130, MYO + 4], { anchor: "start", shortHe: "חוט עבה: מיוזין", short: "Thick filament" }),
];
const mc2: El[] = [
  ...actin(0), tropo(0, false), ...thick(), ...myosinHead(200, "cocked", false, true),
  ...[[80, 70], [110, 60], [150, 70]].map(([x, y], i) => circle(`ca${i}`, x, y, 4, CA)),
  label("l_ca", 180, 40, "Ca²⁺ binds troponin", "Ca²⁺ נקשר לטרופונין", [150, 70], { anchor: "start" }),
  label("l_sites", 230, 270, "Binding sites exposed", "אתרי הקישור נחשפים", [214, AY + 6], { anchor: "start" }),
];
const mc3: El[] = [
  ...actin(0), tropo(0, false), ...thick(), ...myosinHead(200, "bound", false, true),
  label("l_xb", 14, 270, "Cross-bridge forms", "נוצר גשר צולב", [214, AY + 18], { anchor: "start" }),
];
const mc4: El[] = [
  ...actin(-40), tropo(-40, false), ...thick(), ...myosinHead(200, "stroke", false, false),
  arrow("slide", 300, 60, 240, 60, "#b91c1c", 2.6),
  label("l_ps", 14, 270, "Power stroke: Pᵢ, ADP released", "תנועת כוח: Pᵢ ו-ADP משתחררים", [174, AY + 20], { anchor: "start", shortHe: "תנועת כוח", short: "Power stroke" }),
  label("l_sl", 250, 40, "Actin slides toward M line", "האקטין מחליק למרכז", [300, 60], { anchor: "start", shortHe: "החלקה", short: "Sliding" }),
];
const mc5: El[] = [
  ...actin(-40), tropo(-40, false), ...thick(), ...myosinHead(200, "detached", true, false),
  label("l_atp", 14, 40, "ATP binds: head detaches", "ATP נקשר: הראש מתנתק", [184, AY + 44], { anchor: "start", shortHe: "ניתוק", short: "Detach" }),
  label("l_cock", 230, 270, "ATP hydrolysis re-cocks the head", "פירוק ATP דורך את הראש מחדש", [196, AY + 50], { anchor: "start", shortHe: "דריכה מחדש", short: "Re-cock" }),
];
export const muscle: ProcessScene = {
  slug: "muscle-contraction",
  meta: {
    topic: "physiology",
    nameHe: "כיווץ שריר השלד — מחזור הגשרים הצולבים", nameEn: "Skeletal Muscle Contraction — the Cross-Bridge Cycle",
    descHe: "Ca²⁺ חושף את אתרי הקישור באקטין, ראש המיוזין נקשר, מבצע תנועת כוח ומתנתק בעזרת ATP",
    descEn: "Ca²⁺ exposes binding sites on actin, the myosin head binds, makes a power stroke and detaches with ATP",
    source: "Berne & Levy 8e ch. 12; Campbell 12e ch. 50",
  },
  legend: [
    { color: "#b91c1c", he: "אקטין (חוט דק)", en: "Actin (thin filament)", swatch: "ring" },
    { color: "#7c3aed", he: "טרופומיוזין", en: "Tropomyosin", swatch: "line" },
    { color: "#1d4ed8", he: "מיוזין (חוט עבה וראש)", en: "Myosin (thick filament and head)", swatch: "ring" },
    { color: CA, he: "Ca²⁺", en: "Ca²⁺", swatch: "dot" },
    { color: "#475569", he: "קו Z / קו M", en: "Z line / M line", swatch: "line" },
  ],
  steps: [
    {
      titleHe: "מנוחה: אתרי הקישור מכוסים", titleEn: "Rest: Binding Sites Covered",
      descHe: "בסרקומר חוטי אקטין דקים, המעוגנים בקו Z, משתלבים בחוטי מיוזין עבים. במנוחה טרופומיוזין, המוחזק במקומו על ידי טרופונין, מכסה את אתרי הקישור למיוזין על האקטין. ראש המיוזין כבר \"דרוך\" ומחזיק ADP ו-Pᵢ מפירוק ATP קודם.",
      descEn: "In the sarcomere, thin actin filaments anchored at the Z line interdigitate with thick myosin filaments. At rest tropomyosin, held in place by troponin, covers the myosin-binding sites on actin. The myosin head is already 'cocked', holding ADP and Pᵢ from an earlier ATP hydrolysis.",
      elements: mc1,
    },
    {
      titleHe: "Ca²⁺ חושף את אתרי הקישור", titleEn: "Ca²⁺ Exposes the Binding Sites",
      descHe: "פוטנציאל פעולה בסיב השריר מתפשט לתוך צינוריות T וגורם לרשתית הסרקופלזמית לשחרר Ca²⁺ (צימוד עירור-כיווץ). Ca²⁺ נקשר לטרופונין C, והטרופומיוזין זז וחושף את אתרי הקישור על האקטין.",
      descEn: "An action potential in the muscle fibre spreads into the T tubules and makes the sarcoplasmic reticulum release Ca²⁺ (excitation–contraction coupling). Ca²⁺ binds troponin C, and tropomyosin shifts to expose the binding sites on actin.",
      elements: mc2,
    },
    {
      titleHe: "היווצרות גשר צולב", titleEn: "A Cross-Bridge Forms",
      descHe: "ראש המיוזין הדרוך נקשר לאתר החשוף באקטין ויוצר גשר צולב.",
      descEn: "The cocked myosin head binds the exposed site on actin, forming a cross-bridge.",
      elements: mc3,
    },
    {
      titleHe: "תנועת הכוח", titleEn: "The Power Stroke",
      descHe: "שחרור Pᵢ ואחריו ADP גורם לראש המיוזין להסתובב — תנועת הכוח — ולמשוך את חוט האקטין לכיוון מרכז הסרקומר (קו M). החוטים עצמם לא מתקצרים: הם מחליקים זה על זה, והסרקומר מתקצר.",
      descEn: "Release of Pᵢ and then ADP makes the myosin head pivot — the power stroke — pulling the actin filament toward the centre of the sarcomere (M line). The filaments do not shorten; they slide past each other, and the sarcomere shortens.",
      elements: mc4,
    },
    {
      titleHe: "ATP מנתק ודורך מחדש", titleEn: "ATP Detaches and Re-cocks",
      descHe: "ATP חדש נקשר לראש המיוזין, והוא מתנתק מהאקטין. פירוק ה-ATP ל-ADP ו-Pᵢ דורך את הראש מחדש, והמחזור חוזר כל עוד יש Ca²⁺ ו-ATP. בלי ATP הראשים נשארים קשורים — זהו קישיון המוות (rigor mortis).",
      descEn: "A new ATP binds the myosin head and it lets go of actin. Hydrolysing the ATP to ADP and Pᵢ re-cocks the head, and the cycle repeats as long as Ca²⁺ and ATP are present. Without ATP the heads stay bound — rigor mortis.",
      elements: mc5,
    },
  ],
};

/* ══ HEMOGLOBIN: cooperative O₂ binding and the Bohr effect (Lehninger 8e ch. 5; B&L ch. 24) ══ */
const HX = 110, HY = 150;
const subunit = (id: string, dx: number, dy: number, color: string, o2: boolean, relaxed: boolean): El[] => {
  const s = relaxed ? 1 : 0.9, x = HX + dx * s, y = HY + dy * s;
  return [
    path(id, smooth([[x - 24, y - 4], [x - 16, y - 24], [x + 8, y - 26], [x + 24, y - 8], [x + 18, y + 18], [x - 8, y + 24], [x - 22, y + 14]], true), { color, stroke: "#7f1d1d", strokeWidth: 1.6 }),
    rect(`${id}_heme`, x - 7, y - 3, 14, 6, "#78350f", { rx: 1 }),
    circle(`${id}_o2`, x, y - 10, 5, "#0ea5e9", { stroke: "#fff", strokeWidth: 1, opacity: o2 ? 1 : 0 }),
  ];
};
const hb = (nO2: number, relaxed: boolean): El[] => [
  ...subunit("a1", -26, -26, "#fca5a5", nO2 > 0, relaxed), ...subunit("b1", 26, -26, "#fecaca", nO2 > 1, relaxed),
  ...subunit("a2", 26, 26, "#fca5a5", nO2 > 2, relaxed), ...subunit("b2", -26, 26, "#fecaca", nO2 > 3, relaxed),
];
const SAT = (p: number, p50: number, n = 2.8) => p ** n / (p ** n + p50 ** n);
const curve = (id: string, p50: number, color: string, o: Partial<El> = {}) => {
  const pts: Pt[] = [];
  for (let p = 0; p <= 100; p += 5) pts.push([230 + p * 1.5, 250 - SAT(p, p50) * 170]);
  return path(id, smooth(pts), { stroke: color, strokeWidth: 3, ...o });
};
const hAxes = (): El[] => [
  line("hx", 230, 250, 386, 250, C.line, 1.8, { arrow: true }), line("hy", 230, 250, 230, 60, C.line, 1.8, { arrow: true }),
  text("hxl", 392, 240, "pO₂", "pO₂", { anchor: "end", ltr: true, weight: 700 }),
  text("hyl", 222, 70, "% saturation", "% רוויה", { anchor: "end", weight: 700 }),
  line("tis", 230 + 40 * 1.5, 250, 230 + 40 * 1.5, 70, "#94a3b8", 1, { dash: "3 3" }),
  line("lung", 230 + 100 * 1.5, 250, 230 + 100 * 1.5, 70, "#94a3b8", 1, { dash: "3 3" }),
  text("tis_t", 290, 290, "tissues", "רקמות", { fontSize: 16.5, textColor: C.muted }),
  text("lung_t", 376, 290, "lungs", "ריאות", { fontSize: 16.5, textColor: C.muted, anchor: "end" }),
];
const h1: El[] = [
  ...hb(0, false),
  label("l_sub", 14, 40, "α₂β₂ tetramer, 4 hemes", "טטרמר α₂β₂ עם 4 המים", [84, 124], { anchor: "start" }),
  label("l_t", 14, 280, "T state: low O₂ affinity", "מצב T: זיקה נמוכה ל-O₂", [110, 176], { anchor: "start", shortHe: "מצב T", short: "T state" }),
  label("l_heme", 230, 110, "Heme Fe²⁺ binds O₂", "ברזל Fe²⁺ בהם קושר O₂", [136, 126], { anchor: "start", shortHe: "הם (Fe²⁺)", short: "Heme" }),
];
const h2: El[] = [
  ...hb(4, true), ...hAxes(), curve("c1", 26, "#dc2626"),
  label("l_r", 14, 280, "R state: high affinity", "מצב R: זיקה גבוהה", [110, 176], { anchor: "start" }),
  label("l_sig", 250, 40, "Sigmoid: cooperativity", "עקומה סיגמואידית: שיתופיות", [300, 170], { anchor: "start", shortHe: "שיתופיות", short: "Cooperative" }),
];
const h3: El[] = [
  ...hb(2, false), ...hAxes(), curve("c1", 26, "#dc2626", { opacity: 0.4 }), curve("c2", 38, "#7c3aed"),
  ...[[40, 84], [70, 76], [40, 226]].map(([x, y], i) => text(`hp${i}`, x, y, "H⁺", "H⁺", { ltr: true, weight: 800, textColor: "#7c3aed" })),
  text("co2", 100, 226, "CO₂", "CO₂", { ltr: true, weight: 800, textColor: "#475569" }),
  label("l_bohr", 14, 36, "Bohr effect: H⁺, CO₂ → O₂ released", "אפקט בוהר: H⁺ ו-CO₂ משחררים O₂", [110, 176], { anchor: "start", shortHe: "אפקט בוהר", short: "Bohr effect" }),
  label("l_right", 250, 18, "Curve shifts right", "העקומה זזה ימינה", [300, 180], { anchor: "start" }),
];
export const hemoglobin: ProcessScene = {
  slug: "hemoglobin-oxygen-binding",
  meta: {
    topic: "biochemistry",
    nameHe: "המוגלובין: קישור O₂ שיתופי ואפקט בוהר", nameEn: "Hemoglobin: Cooperative O₂ Binding and the Bohr Effect",
    descHe: "מבנה α₂β₂, מעבר ממצב T למצב R, עקומת קישור סיגמואידית והשפעת H⁺ ו-CO₂ על שחרור החמצן",
    descEn: "The α₂β₂ structure, the T-to-R transition, the sigmoid binding curve and how H⁺ and CO₂ promote O₂ release",
    source: "Lehninger 8e ch. 5; Berne & Levy 8e ch. 24",
  },
  legend: [
    { color: "#dc2626", he: "תת-יחידות α / עקומה רגילה", en: "α subunits / normal curve", swatch: "line" },
    { color: "#78350f", he: "קבוצת הם", en: "Heme group", swatch: "dot" },
    { color: "#0ea5e9", he: "O₂", en: "O₂", swatch: "dot" },
    { color: "#7c3aed", he: "H⁺ / עקומה בחומציות", en: "H⁺ / acidic curve", swatch: "line" },
  ],
  steps: [
    {
      titleHe: "מבנה ההמוגלובין", titleEn: "The Structure of Hemoglobin",
      descHe: "המוגלובין הוא טטרמר של שתי תת-יחידות α ושתי β, ובכל אחת קבוצת הם שבמרכזה יון Fe²⁺ הקושר מולקולת O₂ אחת — עד 4 מולקולות לחלבון. בלי חמצן החלבון נמצא במצב T (מתוח), שזיקתו ל-O₂ נמוכה.",
      descEn: "Hemoglobin is a tetramer of two α and two β subunits, each with a heme group whose Fe²⁺ ion binds one O₂ — up to four per protein. Without oxygen it is in the T (tense) state, with low O₂ affinity.",
      elements: h1,
    },
    {
      titleHe: "קישור שיתופי — עקומה סיגמואידית", titleEn: "Cooperative Binding — a Sigmoid Curve",
      descHe: "קישור O₂ לתת-יחידה אחת משנה את צורתה ומקל על קישור בתת-היחידות האחרות: החלבון עובר למצב R (רפוי) בעל זיקה גבוהה. לכן העקומה סיגמואידית — ההמוגלובין נטען כמעט במלואו בריאות ומשחרר חלק גדול מהחמצן בטווח הלחצים של הרקמות.",
      descEn: "O₂ binding to one subunit changes its shape and eases binding at the others: the protein shifts to the high-affinity R (relaxed) state. The curve is therefore sigmoid — hemoglobin loads almost fully in the lungs and releases much of its oxygen over the pressure range of the tissues.",
      elements: h2,
    },
    {
      titleHe: "אפקט בוהר", titleEn: "The Bohr Effect",
      descHe: "ברקמות פעילות יש יותר CO₂ ו-H⁺ (pH נמוך). H⁺ ו-CO₂ נקשרים להמוגלובין ומייצבים את מצב T, והעקומה זזה ימינה: באותו pO₂ משתחרר יותר חמצן — בדיוק היכן שצריך. 2,3-BPG ועלייה בחום פועלים באותו כיוון.",
      descEn: "Active tissues have more CO₂ and H⁺ (lower pH). H⁺ and CO₂ bind hemoglobin and stabilise the T state, shifting the curve to the right: at the same pO₂ more oxygen is released — exactly where it is needed. 2,3-BPG and higher temperature act the same way.",
      elements: h3,
    },
  ],
};

/* ══ LAC OPERON (Lehninger 8e ch. 28; Alberts 7e ch. 7; Campbell ch. 18) ══ */
const LY = 150;
const lacDNA = (): El[] => [
  ...dsDNA("ld", 20, 380, LY, { tags: true, top: "#475569", bottom: "#475569" }),
  rect("g_i", 26, LY - 12, 40, 24, "#e9d5ff", { rx: 3, stroke: "#7e22ce", strokeWidth: 1.2 }),
  rect("g_p", 110, LY - 12, 24, 24, "#fde68a", { rx: 3, stroke: "#b45309", strokeWidth: 1.2 }),
  rect("g_o", 134, LY - 12, 22, 24, "#fecaca", { rx: 3, stroke: "#b91c1c", strokeWidth: 1.2 }),
  rect("g_z", 160, LY - 12, 90, 24, "#bfdbfe", { rx: 3, stroke: "#1d4ed8", strokeWidth: 1.2 }),
  rect("g_y", 252, LY - 12, 64, 24, "#bfdbfe", { rx: 3, stroke: "#1d4ed8", strokeWidth: 1.2 }),
  rect("g_a", 318, LY - 12, 52, 24, "#bfdbfe", { rx: 3, stroke: "#1d4ed8", strokeWidth: 1.2 }),
  ...[["t_i", 46, "lacI"], ["t_z", 205, "lacZ"], ["t_y", 284, "lacY"], ["t_a", 344, "lacA"]].map(([id, x, s]) => text(String(id), Number(x), LY + 6, String(s), String(s), { ltr: true, fontSize: 16.5, weight: 700, halo: false })),
  text("t_p", 122, LY + 36, "P", "P", { ltr: true, weight: 800, textColor: "#b45309" }),
  text("t_o", 145, LY + 36, "O", "O", { ltr: true, weight: 800, textColor: "#b91c1c" }),
];
const repressor = (x: number, y: number, bound: boolean): El[] => [
  path("rep", smooth([[x - 20, y + 10], [x - 22, y - 12], [x, y - 22], [x + 22, y - 12], [x + 20, y + 10], [x, y + (bound ? 4 : 16)]], true), { color: "#e9d5ff", stroke: "#7e22ce", strokeWidth: 1.8 }),
];
const lacPol = (x: number, o: Partial<El> = {}) => path("pol", `M ${x - 20} ${LY - 12} C ${x - 22} ${LY - 40} ${x + 22} ${LY - 40} ${x + 20} ${LY - 12} Z`, { color: "#bfdbfe", fillOpacity: 0.85, stroke: "#1d4ed8", strokeWidth: 1.8, ...o });
const lo1: El[] = [
  ...lacDNA(), ...repressor(145, LY - 30, true), lacPol(90),
  line("blk", 104, LY - 34, 124, LY - 24, "#dc2626", 2.5),
  label("l_rep", 190, 36, "Repressor on the operator", "הרפרסור יושב על האופרטור", [150, LY - 34], { anchor: "start", shortHe: "רפרסור על O", short: "Repressor on O" }),
  label("l_pol", 14, 60, "RNA polymerase blocked", "RNA פולימראז חסום", [90, LY - 34], { anchor: "start", shortHe: "פולימראז חסום", short: "Pol blocked" }),
  text("l_off", 200, 250, "no lactose: genes OFF", "אין לקטוז: הגנים כבויים", { weight: 700, textColor: "#b91c1c" }),
];
const lo2: El[] = [
  ...lacDNA(), ...repressor(170, 80, false), lacPol(160),
  circle("allo", 170, 96, 6, "#16a34a", { stroke: "#fff", strokeWidth: 1.2 }),
  path("mrna", smooth(wave(160, 300, 206, 3, 11)), { stroke: C.rna, strokeWidth: 3 }),
  label("l_allo", 230, 50, "Allolactose binds repressor", "אלולקטוז נקשר לרפרסור", [176, 96], { anchor: "start", shortHe: "אלולקטוז", short: "Allolactose" }),
  label("l_mrna", 14, 250, "One mRNA: lacZ, lacY, lacA", "mRNA אחד לשלושת הגנים", [230, 206], { anchor: "start", shortHe: "mRNA פוליציסטרוני", short: "One mRNA" }),
];
const lo3: El[] = [
  ...lacDNA(), ...repressor(170, 80, false), lacPol(160),
  circle("allo", 170, 96, 6, "#16a34a", { stroke: "#fff", strokeWidth: 1.2 }),
  path("cap", smooth([[84, LY - 12], [82, LY - 34], [100, LY - 42], [116, LY - 32], [110, LY - 12]], true), { color: "#fed7aa", stroke: "#c2410c", strokeWidth: 1.8 }),
  circle("camp", 100, LY - 50, 5, "#0ea5e9"),
  path("mrna", smooth(wave(160, 360, 206, 3, 11)), { stroke: C.rna, strokeWidth: 4 }),
  label("l_cap", 14, 60, "Low glucose: cAMP–CAP binds", "מעט גלוקוז: cAMP–CAP נקשר", [100, LY - 40], { anchor: "start", shortHe: "cAMP–CAP", short: "cAMP–CAP" }),
  text("l_on", 200, 270, "lactose, no glucose: strong transcription", "לקטוז בלי גלוקוז: שעתוק חזק", { weight: 700, textColor: "#15803d", short: "strongly ON", shortHe: "שעתוק חזק" }),
];
export const lacOperon: ProcessScene = {
  slug: "lac-operon",
  meta: {
    topic: "molecular-biology",
    nameHe: "אופרון lac — בקרת ביטוי גנים בחיידקים", nameEn: "The lac Operon — Gene Regulation in Bacteria",
    descHe: "רפרסור על האופרטור, השראה על ידי אלולקטוז, ובקרה חיובית של cAMP–CAP כשהגלוקוז חסר",
    descEn: "The repressor on the operator, induction by allolactose, and positive control by cAMP–CAP when glucose is scarce",
    source: "Lehninger 8e ch. 28; Alberts 7e ch. 7; Campbell 12e ch. 18",
  },
  legend: [
    { color: "#1d4ed8", he: "גנים מבניים / RNA פולימראז", en: "Structural genes / RNA polymerase", swatch: "ring" },
    { color: "#7e22ce", he: "רפרסור (lacI)", en: "Repressor (lacI)", swatch: "ring" },
    { color: "#b91c1c", he: "אופרטור", en: "Operator", swatch: "ring" },
    { color: "#16a34a", he: "אלולקטוז (משרן)", en: "Allolactose (inducer)", swatch: "dot" },
    { color: "#c2410c", he: "CAP עם cAMP", en: "CAP with cAMP", swatch: "ring" },
  ],
  steps: [
    {
      titleHe: "בלי לקטוז: הרפרסור חוסם", titleEn: "No Lactose: the Repressor Blocks",
      descHe: "אופרון lac כולל פרומוטור (P), אופרטור (O) ושלושה גנים לפירוק לקטוז: lacZ (β-גלקטוזידאז), lacY (פרמאז) ו-lacA. הגן lacI, שמחוץ לאופרון, מקודד רפרסור שנקשר לאופרטור ומונע מ-RNA פולימראז לשעתק את הגנים.",
      descEn: "The lac operon has a promoter (P), an operator (O) and three genes for using lactose: lacZ (β-galactosidase), lacY (permease) and lacA. The lacI gene, outside the operon, encodes a repressor that binds the operator and keeps RNA polymerase from transcribing the genes.",
      elements: lo1,
    },
    {
      titleHe: "השראה: אלולקטוז משחרר את הרפרסור", titleEn: "Induction: Allolactose Releases the Repressor",
      descHe: "כשיש לקטוז, חלק ממנו הופך לאלולקטוז, שנקשר לרפרסור ומשנה את צורתו (בקרה אלוסטרית). הרפרסור עוזב את האופרטור, ו-RNA פולימראז משעתק mRNA אחד (פוליציסטרוני) לשלושת הגנים.",
      descEn: "When lactose is present, some becomes allolactose, which binds the repressor and changes its shape (allosteric control). The repressor leaves the operator, and RNA polymerase transcribes a single (polycistronic) mRNA for all three genes.",
      elements: lo2,
    },
    {
      titleHe: "בקרה חיובית: cAMP–CAP", titleEn: "Positive Control: cAMP–CAP",
      descHe: "הפרומוטור של lac חלש. כשהגלוקוז חסר, רמת ה-cAMP עולה; cAMP נקשר לחלבון CAP, והקומפלקס נקשר ליד הפרומוטור ומגייס את RNA פולימראז — השעתוק חזק. כשיש גלוקוז, cAMP נמוך והאופרון כמעט לא מבוטא גם בנוכחות לקטוז.",
      descEn: "The lac promoter is weak. When glucose is scarce, cAMP rises; cAMP binds the protein CAP, and the complex binds next to the promoter and recruits RNA polymerase — transcription is strong. With glucose present, cAMP is low and the operon is barely expressed even with lactose.",
      elements: lo3,
    },
  ],
};

/* ══ VESICULAR TRANSPORT: the secretory pathway (Alberts 7e ch. 12–13) ══ */
// nucleus: double envelope with pores and a nucleolus, named in every step
const nucleusV = (): El[] => [
  circle("vnuc", 58, 170, 48, "#e0e7ff", { stroke: "#4338ca", strokeWidth: 2 }),
  circle("vnuc_in", 58, 170, 43, "none", { stroke: "#6366f1", strokeWidth: 1.2 }),
  ...[30, 90, 150, 210, 270, 330].map((a, i) => circle(`vpore${i}`, 58 + 45.5 * Math.cos((a * Math.PI) / 180), 170 + 45.5 * Math.sin((a * Math.PI) / 180), 2.6, "#ffffff", { stroke: "#3730a3", strokeWidth: 1 })),
  circle("vnucleolus", 46, 160, 12, "#a5b4fc", { stroke: "#4338ca", strokeWidth: 1 }),
  text("l_nuc", 58, 200, "nucleus", "גרעין", { textColor: "#3730a3", weight: 700, fontSize: 16.5 }),
];
const rer = (): El[] => [
  path("rer", "M 112 120 C 150 106 150 150 118 150 C 150 150 154 190 116 196 C 150 196 150 236 114 230", { stroke: "#a16207", strokeWidth: 4 }),
  ...[[132, 116], [142, 132], [140, 164], [146, 182], [136, 214]].map(([x, y], i) => circle(`rb${i}`, x, y, 3, "#1d4ed8")),
];
// Golgi stack: curved, flattened cisternae (convex cis face toward the ER), dilated rims
const golgiV = (): El[] => [0, 1, 2, 3, 4].flatMap((i) => {
  const x = 222 + i * 13, top = 118 + i * 5, bot = 222 - i * 5, bow = 26 - i * 3;
  return [
    path(`gc${i}`, `M ${x} ${top} Q ${x - bow} 170 ${x} ${bot} L ${x + 7} ${bot} Q ${x + 7 - bow} 170 ${x + 7} ${top} Z`, { color: "#bbf7d0", stroke: "#059669", strokeWidth: 1.6 }),
    circle(`gcr${i}a`, x + 3.5, top - 2, 4.5, "#bbf7d0", { stroke: "#059669", strokeWidth: 1.2 }),
    circle(`gcr${i}b`, x + 3.5, bot + 2, 4.5, "#bbf7d0", { stroke: "#059669", strokeWidth: 1.2 }),
  ];
});
const pmV = (): El[] => bilayer("pmv", 370, 390, 160, { th: 10 }).map((e) => e);
const cargo = (id: string, x: number, y: number, color = "#dc2626") => circle(id, x, y, 3.2, color);
const vesicle = (id: string, x: number, y: number, coat: string, cargoColor = "#dc2626"): El[] => [
  circle(id, x, y, 10, "#fff", { stroke: coat, strokeWidth: 2.4, dash: coat === "#059669" ? undefined : "2 2" }),
  cargo(`${id}_c`, x, y, cargoColor),
];
const pm = (): El[] => [path("pmline", "M 380 30 L 380 290", { stroke: "#d97706", strokeWidth: 6 })];
const vt1: El[] = [
  ...nucleusV(), ...rer(), ...golgiV(), ...pm(),
  ...[[124, 128], [130, 176], [124, 214]].map(([x, y], i) => cargo(`cg${i}`, x, y)),
  label("l_rer", 14, 40, "Rough ER: proteins made into the lumen", "RER: חלבונים מיוצרים לתוך החלל", [140, 132], { anchor: "start", shortHe: "RER", short: "Rough ER" }),
  label("l_sig", 14, 280, "Signal peptide + SRP", "פפטיד אות ו-SRP", [142, 182], { anchor: "start" }),
];
const vt2: El[] = [
  ...nucleusV(), ...rer(), ...golgiV(), ...pm(),
  ...vesicle("cv1", 186, 150, "#0284c7"), ...vesicle("cv2", 196, 190, "#0284c7"),
  arrow("er_go", 160, 170, 214, 170, "#0284c7", 2.2),
  label("l_copii", 200, 60, "COPII vesicles: ER → Golgi", "שלפוחיות COPII אל הגולג'י", [186, 142], { anchor: "start", shortHe: "COPII", short: "COPII" }),
  label("l_cis", 200, 270, "cis face of the Golgi", "הצד ה-cis של הגולג'י", [228, 210], { anchor: "start", shortHe: "צד cis", short: "cis face" }),
];
const vt3: El[] = [
  ...nucleusV(), ...rer(), ...golgiV(), ...pm(),
  ...[[240, 150], [254, 176], [268, 196]].map(([x, y], i) => cargo(`gcg${i}`, x, y, "#7c3aed")),
  ...[[244, 144], [258, 170], [272, 190]].map(([x, y], i) => path(`sug${i}`, `M ${x} ${y} l 4 -6 l 4 6`, { stroke: "#16a34a", strokeWidth: 2 })),
  label("l_mod", 14, 40, "Glycosylation and sorting", "גליקוזילציה ומיון", [258, 170], { anchor: "start" }),
  label("l_trans", 150, 286, "trans face ships out", "הצד ה-trans שולח", [280, 214], { anchor: "start" }),
];
const vt4: El[] = [
  ...nucleusV(), ...rer(), ...golgiV(), ...pm(),
  ...vesicle("sv1", 322, 130, "#059669", "#7c3aed"), ...vesicle("sv2", 340, 190, "#059669", "#7c3aed"),
  path("fus", "M 380 236 Q 364 250 380 264", { stroke: "#d97706", strokeWidth: 4 }),
  ...[[392, 244], [394, 256]].map(([x, y], i) => cargo(`out${i}`, x, y, "#7c3aed")),
  arrow("go_pm", 300, 170, 360, 170, "#059669", 2.2),
  label("l_sec", 14, 40, "Secretory vesicles to the membrane", "שלפוחיות הפרשה אל הממברנה", [322, 130], { anchor: "start", shortHe: "שלפוחיות הפרשה", short: "Secretory vesicles" }),
  label("l_exo", 14, 280, "Exocytosis releases the protein", "אקסוציטוזה משחררת את החלבון", [378, 250], { anchor: "start", shortHe: "אקסוציטוזה", short: "Exocytosis" }),
];
export const vesicular: ProcessScene = {
  slug: "secretory-pathway",
  meta: {
    topic: "cell-biology",
    nameHe: "מסלול ההפרשה: מה-ER דרך הגולג'י אל מחוץ לתא", nameEn: "The Secretory Pathway: ER to Golgi to the Cell Surface",
    descHe: "סינתזה ב-RER, שלפוחיות COPII לגולג'י, גליקוזילציה ומיון, ואקסוציטוזה של חלבון מופרש",
    descEn: "Synthesis on the rough ER, COPII vesicles to the Golgi, glycosylation and sorting, and exocytosis of a secreted protein",
    source: "Alberts 7e ch. 12–13",
  },
  legend: [
    { color: "#a16207", he: "ER גבשושי (ריבוזומים בכחול)", en: "Rough ER (ribosomes in blue)", swatch: "line" },
    { color: "#059669", he: "גולג'י / שלפוחיות הפרשה", en: "Golgi / secretory vesicles", swatch: "line" },
    { color: "#0284c7", he: "שלפוחיות COPII", en: "COPII vesicles", swatch: "dash" },
    { color: "#dc2626", he: "חלבון בדרך", en: "Cargo protein", swatch: "dot" },
    { color: "#d97706", he: "ממברנת התא", en: "Plasma membrane", swatch: "line" },
  ],
  steps: [
    {
      titleHe: "סינתזה ב-ER הגבשושי", titleEn: "Synthesis on the Rough ER",
      descHe: "חלבון שמיועד להפרשה מתחיל להיות מתורגם בציטוזול; פפטיד אות בקצה ה-N שלו נקשר ל-SRP, שמוביל את הריבוזום אל ה-ER. החלבון נכנס לחלל ה-ER תוך כדי תרגום, שם הוא מתקפל ומקבל סוכרים ראשונים.",
      descEn: "A protein destined for secretion starts being translated in the cytosol; a signal peptide at its N-terminus binds SRP, which brings the ribosome to the ER. The protein enters the ER lumen as it is made, where it folds and gets its first sugars.",
      elements: vt1,
    },
    {
      titleHe: "מה-ER אל הגולג'י", titleEn: "From the ER to the Golgi",
      descHe: "חלבונים מקופלים כהלכה נארזים בשלפוחיות עטופות COPII שננצות מה-ER ומתמזגות עם הצד ה-cis של מערכת הגולג'י. חלבונים לא מקופלים נשארים ב-ER ומפורקים.",
      descEn: "Correctly folded proteins are packed into COPII-coated vesicles that bud from the ER and fuse with the cis face of the Golgi. Misfolded proteins stay in the ER and are degraded.",
      elements: vt2,
    },
    {
      titleHe: "עיבוד ומיון בגולג'י", titleEn: "Processing and Sorting in the Golgi",
      descHe: "החלבון עובר מבורות ה-cis אל ה-trans, ובדרך האנזימים משנים את שרשראות הסוכר שלו (גליקוזילציה). בצד ה-trans החלבונים ממוינים לפי יעדם: הפרשה, ממברנת התא או ליזוזומים.",
      descEn: "The protein moves from the cis to the trans cisternae while enzymes modify its sugar chains (glycosylation). At the trans face proteins are sorted by destination: secretion, the plasma membrane or lysosomes.",
      elements: vt3,
    },
    {
      titleHe: "אקסוציטוזה", titleEn: "Exocytosis",
      descHe: "שלפוחיות הפרשה ננצות מהצד ה-trans, נעות לאורך השלד התאי אל ממברנת התא ומתמזגות איתה (בעזרת חלבוני SNARE). תוכנן משתחרר מחוץ לתא — בהפרשה קבועה או, בתאים כמו תאי β בלבלב, בהפרשה מווסתת בתגובה לאות.",
      descEn: "Secretory vesicles bud from the trans face, travel along the cytoskeleton to the plasma membrane and fuse with it (using SNARE proteins). Their contents are released outside — constitutively or, in cells such as pancreatic β cells, in regulated secretion triggered by a signal.",
      elements: vt4,
    },
  ],
};

/* ══ THE NEPHRON (Berne & Levy 8e ch. 33–34) ═══════════════════════════ */
const nephronPath = "M 70 70 C 70 110 110 120 130 110 C 150 100 140 70 170 72 C 196 74 190 110 200 150 L 206 250 C 208 270 226 270 228 250 L 232 150 C 236 110 250 90 270 96 C 300 104 290 70 316 70 C 340 70 340 90 340 110 L 346 280";
const NEP = (): El[] => [
  circle("bow", 70, 58, 26, "#fef3c7", { stroke: "#b45309", strokeWidth: 2 }),
  path("glom", smooth([[56, 52], [64, 40], [78, 44], [84, 58], [74, 70], [60, 66]], true), { color: "#fca5a5", stroke: "#b91c1c", strokeWidth: 1.5 }),
  path("tube", nephronPath, { stroke: "#b45309", strokeWidth: 9 }),
  path("tube_in", nephronPath, { stroke: "#fef3c7", strokeWidth: 5 }),
];
const flow = (id: string, x1: number, y1: number, x2: number, y2: number, color: string) => arrow(id, x1, y1, x2, y2, color, 2.2);
const n1: El[] = [
  ...NEP(),
  flow("filt", 100, 50, 124, 80, "#0ea5e9"),
  label("l_glom", 150, 30, "Glomerulus: filtration", "פקעית: סינון", [70, 52], { anchor: "start" }),
  label("l_bow", 14, 140, "Bowman's capsule", "קופסית באומן", [58, 80], { anchor: "start" }),
  text("l_gfr", 250, 200, "~180 L/day filtered", "כ-180 ליטר ביום", { weight: 700, textColor: "#0369a1" }),
];
const n2: El[] = [
  ...NEP(),
  flow("pr1", 150, 90, 150, 130, "#16a34a"), flow("pr2", 180, 100, 160, 140, "#16a34a"),
  label("l_pct", 14, 170, "Proximal tubule reabsorbs ~65%", "האבובית המקורבת ספגה כ-65%", [170, 76], { anchor: "start", shortHe: "אבובית מקורבת", short: "Proximal tubule" }),
  text("l_what", 250, 50, "Na⁺, water, all glucose", "Na⁺, מים וכל הגלוקוז", { weight: 700, textColor: "#16a34a", short: "Na⁺, H₂O, glucose", shortHe: "Na⁺, מים, גלוקוז" }),
];
const n3: El[] = [
  ...NEP(),
  flow("desc", 180, 200, 150, 200, "#0ea5e9"), flow("asc", 244, 200, 274, 200, "#f97316"),
  label("l_des", 14, 250, "Descending limb: water out", "הזרוע היורדת: מים יוצאים", [202, 210], { anchor: "start", shortHe: "יורדת: מים", short: "Descending: H₂O" }),
  label("l_asc", 270, 290, "Ascending limb: NaCl out", "הזרוע העולה: NaCl יוצא", [232, 210], { anchor: "start", shortHe: "עולה: NaCl", short: "Ascending: NaCl" }),
  text("l_loop", 290, 150, "loop of Henle", "לולאת הנלה", { weight: 700, textColor: "#b45309" }),
];
const n4: El[] = [
  ...NEP(),
  flow("adh", 380, 200, 352, 200, "#0ea5e9"),
  circle("aqp", 346, 200, 5, "#0ea5e9", { stroke: "#fff", strokeWidth: 1 }),
  label("l_cd", 150, 280, "Collecting duct: ADH inserts aquaporins", "צינור מאסף: ADH מוסיף אקוופורינים", [346, 240], { anchor: "start", shortHe: "ADH ← אקוופורינים", short: "ADH → aquaporins" }),
  label("l_ald", 200, 40, "Aldosterone: Na⁺ reabsorbed", "אלדוסטרון: ספיגת Na⁺", [320, 72], { anchor: "start", shortHe: "אלדוסטרון", short: "Aldosterone" }),
  text("l_urine", 346, 298, "urine", "שתן", { weight: 700, textColor: "#a16207" }),
];
export const nephron: ProcessScene = {
  slug: "nephron-urine-formation",
  meta: {
    topic: "physiology",
    nameHe: "הנפרון ויצירת השתן", nameEn: "The Nephron and Urine Formation",
    descHe: "סינון בפקעית, ספיגה חוזרת באבובית המקורבת, לולאת הנלה, ובקרה הורמונלית בצינור המאסף",
    descEn: "Glomerular filtration, proximal reabsorption, the loop of Henle and hormonal control in the collecting duct",
    source: "Berne & Levy 8e ch. 33–35",
  },
  legend: [
    { color: "#b91c1c", he: "פקעית (נימים)", en: "Glomerulus (capillaries)", swatch: "ring" },
    { color: "#b45309", he: "הנפרון", en: "The nephron", swatch: "line" },
    { color: "#0ea5e9", he: "תנועת מים", en: "Water movement", swatch: "arrow" },
    { color: "#16a34a", he: "ספיגה חוזרת", en: "Reabsorption", swatch: "arrow" },
    { color: "#f97316", he: "הוצאת NaCl", en: "NaCl transport", swatch: "arrow" },
  ],
  steps: [
    {
      titleHe: "סינון בפקעית", titleEn: "Glomerular Filtration",
      descHe: "לחץ הדם בנימי הפקעית דוחף מים ומומסים קטנים דרך דופן הנימים אל קופסית באומן. תאי דם וחלבונים גדולים נשארים בדם. בשני הכליות מסוננים כ-180 ליטר ביום — אבל רק כ-1.5 ליטר הופכים לשתן.",
      descEn: "Blood pressure in the glomerular capillaries pushes water and small solutes through the capillary wall into Bowman's capsule. Blood cells and large proteins stay behind. The two kidneys filter about 180 L a day — yet only about 1.5 L becomes urine.",
      elements: n1,
    },
    {
      titleHe: "ספיגה חוזרת באבובית המקורבת", titleEn: "Reabsorption in the Proximal Tubule",
      descHe: "האבובית המקורבת מחזירה לדם כ-65% מה-Na⁺ והמים, ובמצב תקין את כל הגלוקוז וחומצות האמינו — בעזרת משאבת Na⁺/K⁺ ונשאים משניים כמו SGLT. כאן גם מופרשים חומצות ותרופות אל הנוזל.",
      descEn: "The proximal tubule returns about 65% of the Na⁺ and water to the blood, and normally all the glucose and amino acids — using the Na⁺/K⁺ pump and secondary carriers such as SGLT. Acids and drugs are also secreted into the fluid here.",
      elements: n2,
    },
    {
      titleHe: "לולאת הנלה", titleEn: "The Loop of Henle",
      descHe: "הזרוע היורדת חדירה למים ובלתי חדירה כמעט למלח; הזרוע העולה מוציאה NaCl אך אינה חדירה למים. יחד הן יוצרות מפל אוסמוטי בליבת הכליה (מנגנון זרם נגדי) — הבסיס ליכולת לייצר שתן מרוכז.",
      descEn: "The descending limb is permeable to water but hardly to salt; the ascending limb pumps out NaCl but is impermeable to water. Together they build an osmotic gradient in the medulla (countercurrent mechanism) — the basis for making concentrated urine.",
      elements: n3,
    },
    {
      titleHe: "בקרה בצינור המאסף", titleEn: "Control in the Collecting Duct",
      descHe: "ההורמון ADH (וזופרסין) גורם להחדרת אקוופורינים לצינור המאסף, ומים נספגים אל הליבה המלוחה — השתן מתרכז. אלדוסטרון מגביר ספיגת Na⁺ והפרשת K⁺ בחלקים האחרונים. כך הכליה מכווננת את נפח הנוזלים והאוסמולריות.",
      descEn: "The hormone ADH (vasopressin) makes the collecting duct insert aquaporins, so water is drawn into the salty medulla — the urine is concentrated. Aldosterone increases Na⁺ reabsorption and K⁺ secretion in the final segments. This is how the kidney tunes body-fluid volume and osmolarity.",
      elements: n4,
    },
  ],
};

/* ══ DNA MISMATCH REPAIR and NUCLEOTIDE EXCISION REPAIR (Alberts 7e ch. 5) ══ */
const DY = 150;
const duplex = (p: string, gapFrom?: number, gapTo?: number, newColor = "#16a34a"): El[] => [
  ...dsDNA(p, 30, 370, DY, { tags: true, top: "#475569", bottom: newColor }),
  ...(gapFrom !== undefined && gapTo !== undefined ? [line(`${p}_gap`, gapFrom, DY + 7, gapTo, DY + 7, "#ffffff", 7)] : [line(`${p}_gap`, 200, DY + 7, 200, DY + 7, "#ffffff", 7)]),
];
const mism = (x: number, show: boolean): El[] => [
  rect("mm_t", x - 4, DY - 8, 8, 8, "#475569", { opacity: show ? 1 : 0 }),
  rect("mm_b", x - 4, DY, 8, 8, "#dc2626", { opacity: show ? 1 : 0 }),
];
const r1: El[] = [
  ...duplex("dr"), ...mism(200, true),
  label("l_mm", 14, 60, "Mismatch after replication", "זוג בסיסים לא תואם", [200, DY + 4], { anchor: "start", shortHe: "אי-התאמה", short: "Mismatch" }),
  label("l_new", 220, 260, "New strand (not yet methylated)", "הגדיל החדש", [300, DY + 7], { anchor: "start" }),
  label("l_old", 220, 60, "Template strand", "גדיל התבנית", [300, DY - 7], { anchor: "start" }),
];
const r2: El[] = [
  ...duplex("dr"), ...mism(200, true),
  path("muts", smooth([[184, DY - 10], [188, DY - 32], [212, DY - 32], [216, DY - 10], [200, DY - 4]], true), { color: "#c4b5fd", stroke: "#6d28d9", strokeWidth: 1.8 }),
  path("mutl", smooth([[228, DY - 10], [232, DY - 30], [254, DY - 30], [258, DY - 10], [244, DY - 4]], true), { color: "#fbcfe8", stroke: "#be185d", strokeWidth: 1.8 }),
  label("l_mut", 14, 60, "MutS finds it, MutL joins", "MutS מזהה, MutL מצטרף", [196, DY - 30], { anchor: "start", shortHe: "MutS ו-MutL", short: "MutS, MutL" }),
  label("l_nick", 230, 260, "Nick marks the new strand", "חתך מסמן את הגדיל החדש", [300, DY + 7], { anchor: "start", shortHe: "סימון הגדיל החדש", short: "New strand marked" }),
];
const r3: El[] = [
  ...duplex("dr", 150, 290), ...mism(200, false),
  rect("mm_t2", 196, DY - 8, 8, 8, "#475569"),
  path("muts", smooth([[184, DY - 10], [188, DY - 32], [212, DY - 32], [216, DY - 10], [200, DY - 4]], true), { color: "#c4b5fd", stroke: "#6d28d9", strokeWidth: 1.8, opacity: 0.55 }),
  path("mutl", smooth([[228, DY - 10], [232, DY - 30], [254, DY - 30], [258, DY - 10], [244, DY - 4]], true), { color: "#fbcfe8", stroke: "#be185d", strokeWidth: 1.8, opacity: 0.55 }),
  ...[166, 192, 218, 244, 270].map((x, i) => ellipse(`rpa${i}`, x, DY + 12, 11, 6, "#e2e8f0", { stroke: "#475569", strokeWidth: 1.3 })),
  path("exo", smooth([[284, DY + 10], [292, DY + 30], [310, DY + 32], [314, DY + 12]], true), { color: "#fde68a", stroke: "#b45309", strokeWidth: 1.8 }),
  ...[[322, DY + 46], [338, DY + 58], [314, DY + 64], [348, DY + 40], [330, DY + 76]].map(([x, y], i) => circle(`dnmp${i}`, x, y, 3.2, "#16a34a")),
  label("l_exo", 14, 260, "Exonuclease removes a stretch", "אקסונוקלאז מסיר קטע", [300, DY + 22], { anchor: "start", shortHe: "הסרת קטע", short: "Stretch removed" }),
  label("l_rpa", 14, 60, "RPA protects the single strand", "RPA מגן על הגדיל הבודד", [218, DY + 12], { anchor: "start", shortHe: "RPA", short: "RPA" }),
  label("l_nt", 230, 286, "Released nucleotides", "נוקלאוטידים משתחררים", [330, DY + 76], { anchor: "start", shortHe: "נוקלאוטידים", short: "Nucleotides" }),
];
const r4: El[] = [
  ...duplex("dr"), ...mism(200, false),
  rect("mm_b2", 196, DY, 8, 8, "#16a34a"),
  path("poly", `M 184 ${DY + 12} C 184 ${DY + 36} 216 ${DY + 36} 216 ${DY + 12} Z`, { color: "#bfdbfe", stroke: "#1d4ed8", strokeWidth: 1.8 }),
  circle("lig", 260, DY + 20, 9, "#bbf7d0", { stroke: "#15803d", strokeWidth: 1.8 }),
  label("l_pol", 14, 260, "DNA polymerase fills the gap", "DNA פולימראז משלים", [200, DY + 26], { anchor: "start", shortHe: "השלמת הפער", short: "Gap filled" }),
  label("l_lig", 250, 60, "DNA ligase seals", "DNA ליגאז סוגר", [260, DY + 12], { anchor: "start" }),
];
export const dnaRepair: ProcessScene = {
  slug: "dna-mismatch-repair",
  meta: {
    topic: "molecular-biology",
    nameHe: "תיקון אי-התאמות ב-DNA", nameEn: "DNA Mismatch Repair",
    descHe: "זיהוי בסיס לא תואם אחרי שכפול, סימון הגדיל החדש, הסרת קטע והשלמתו על ידי פולימראז וליגאז",
    descEn: "Spotting a mismatched base after replication, identifying the new strand, removing a stretch and refilling it with polymerase and ligase",
    source: "Alberts 7e ch. 5; Campbell 12e ch. 16",
  },
  legend: [
    { color: "#475569", he: "גדיל התבנית (הישן)", en: "Template (old) strand", swatch: "line" },
    { color: "#16a34a", he: "הגדיל החדש", en: "New strand", swatch: "line" },
    { color: "#dc2626", he: "בסיס שגוי", en: "Wrong base", swatch: "dot" },
    { color: "#6d28d9", he: "MutS / MutL", en: "MutS / MutL", swatch: "ring" },
    { color: "#1d4ed8", he: "DNA פולימראז", en: "DNA polymerase", swatch: "ring" },
    { color: "#475569", he: "RPA (חלבון קושר גדיל בודד)", en: "RPA (single-strand binding)", swatch: "ring" },
  ],
  steps: [
    {
      titleHe: "אי-התאמה אחרי השכפול", titleEn: "A Mismatch After Replication",
      descHe: "DNA פולימראז מגיה את עצמו, ובכל זאת בערך בסיס אחד ל-10⁷ נשאר לא תואם. אם לא יתוקן, השכפול הבא יקבע את השגיאה כמוטציה. מערכת תיקון אי-ההתאמות משפרת את הדיוק פי 100 עד 1,000 בערך.",
      descEn: "DNA polymerase proofreads itself, yet about one base in 10⁷ is left mismatched. If not fixed, the next replication will fix the error as a mutation. Mismatch repair improves accuracy roughly 100- to 1,000-fold.",
      elements: r1,
    },
    {
      titleHe: "זיהוי וסימון הגדיל החדש", titleEn: "Recognition and Marking the New Strand",
      descHe: "החלבון MutS מזהה את העיוות בסליל שבמקום אי-ההתאמה, ו-MutL מצטרף אליו. המערכת חייבת לדעת איזה גדיל שגוי: באאוקריוטים חתכים (nicks) שנשארו בגדיל החדש מסמנים אותו; ב-E. coli הגדיל החדש עדיין לא ממותל.",
      descEn: "The protein MutS detects the distortion of the helix at the mismatch, and MutL joins it. The system must know which strand is wrong: in eukaryotes nicks left in the new strand mark it; in E. coli the new strand is not yet methylated.",
      elements: r2,
    },
    {
      titleHe: "הסרת קטע מהגדיל החדש", titleEn: "Removing a Stretch of the New Strand",
      descHe: "אקסונוקלאז מפרק את הגדיל החדש החל מהחתך ועד מעבר לבסיס השגוי — קטע שיכול להגיע לאלפי נוקלאוטידים. גדיל התבנית נשאר שלם ומשמש כתבנית לתיקון.",
      descEn: "An exonuclease digests the new strand from the nick to beyond the wrong base — a stretch that can span thousands of nucleotides. The template strand stays intact and serves as the pattern for the repair.",
      elements: r3,
    },
    {
      titleHe: "השלמה וסגירה", titleEn: "Refilling and Sealing",
      descHe: "DNA פולימראז משלים את הפער לפי התבנית, והפעם עם הבסיס הנכון, ו-DNA ליגאז סוגר את קשר הפוספודיאסטר האחרון. פגמים בגנים של המערכת (למשל MSH2 ו-MLH1) גורמים לסרטן מעי גס תורשתי (תסמונת לינץ').",
      descEn: "DNA polymerase refills the gap from the template, this time with the right base, and DNA ligase seals the last phosphodiester bond. Defects in the system's genes (such as MSH2 and MLH1) cause hereditary colon cancer (Lynch syndrome).",
      elements: r4,
    },
  ],
};
