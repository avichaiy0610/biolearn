import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../app/generated/prisma/client";

const DB_URL = process.env.DATABASE_URL ?? "file:./dev.db";
const authToken = process.env.DATABASE_AUTH_TOKEN;
const adapter = new PrismaLibSql({ url: DB_URL, ...(authToken ? { authToken } : {}) });
const prisma = new PrismaClient({ adapter });

// ─── SVG DATA ────────────────────────────────────────────────────────────────

const dnaReplicationSteps = [
  {
    order: 1,
    titleHe: "ביטול סיבוב הסלייל הכפול — Helicase",
    titleEn: "Unwinding the Double Helix — Helicase",
    descHe: "אנזים ה-Helicase שובר את קשרי המימן בין בסיסי ה-DNA ומפריד את שני הגדילים ביצירת 'מזלג שכפול'. SSB proteins מייצבים את הגדילים הבודדים.",
    descEn: "Helicase breaks hydrogen bonds between base pairs, separating the two strands into a replication fork. Single-strand binding proteins (SSB) stabilize the exposed strands.",
    svgData: JSON.stringify({
      elements: [
        { id: "h1", type: "path", d: "M 80 250 Q 150 200 200 150 Q 250 100 320 50", color: "#3b82f6" },
        { id: "h2", type: "path", d: "M 120 250 Q 170 200 200 150 Q 230 100 280 50", color: "#f59e0b" },
        { id: "hel", type: "circle", cx: 200, cy: 150, r: 18, color: "#059669" },
        { id: "hlabel", type: "text", x: 200, y: 185, label: "Helicase", textColor: "#059669", fontSize: 11 },
        { id: "fork", type: "text", x: 200, y: 225, label: "Replication Fork →", textColor: "#7c3aed", fontSize: 10 },
        { id: "ssb1", type: "circle", cx: 145, cy: 115, r: 8, color: "#f97316" },
        { id: "ssb2", type: "circle", cx: 255, cy: 115, r: 8, color: "#f97316" },
        { id: "ssblabel", type: "text", x: 200, y: 260, label: "SSB proteins stabilize strands", textColor: "#f97316", fontSize: 9 },
      ],
      highlight: ["hel", "hlabel", "fork", "ssb1", "ssb2"],
    }),
  },
  {
    order: 2,
    titleHe: "פריימרים על ידי פרימייז",
    titleEn: "RNA Primers by Primase",
    descHe: "האנזים פרימייז מסנתז קטעי RNA קצרים (18-22 נוקלאוטידים) הנקראים פריימרים. הפריימרים מספקים קצה 3'-OH חופשי הדרוש ל-DNA פולימראז.",
    descEn: "Primase synthesizes short RNA primers (~18-22 nucleotides) providing the free 3'-OH end that DNA polymerase III requires to initiate synthesis.",
    svgData: JSON.stringify({
      elements: [
        { id: "t1", type: "path", d: "M 50 90 L 350 90", color: "#3b82f6" },
        { id: "t2", type: "path", d: "M 50 200 L 350 200", color: "#f59e0b" },
        { id: "p1", type: "rect", x: 60, y: 78, width: 60, height: 12, color: "#ec4899" },
        { id: "p2", type: "rect", x: 230, y: 200, width: 60, height: 12, color: "#ec4899" },
        { id: "primase", type: "circle", cx: 150, cy: 145, r: 14, color: "#059669" },
        { id: "plabel", type: "text", x: 150, y: 170, label: "Primase", textColor: "#059669", fontSize: 10 },
        { id: "rl1", type: "text", x: 90, y: 68, label: "5' RNA Primer 3'", textColor: "#ec4899", fontSize: 9 },
        { id: "rl2", type: "text", x: 260, y: 230, label: "RNA Primer", textColor: "#ec4899", fontSize: 9 },
      ],
      highlight: ["p1", "p2", "primase", "plabel", "rl1", "rl2"],
    }),
  },
  {
    order: 3,
    titleHe: "סינתזת הגדיל המוביל — DNA Pol III",
    titleEn: "Leading Strand Synthesis — DNA Pol III",
    descHe: "DNA פולימראז III מסנתז את הגדיל המוביל בצורה רציפה בכיוון 5'→3' בעקבות מזלג השכפול. הגדיל המוביל נוצר ממולקולה אחת רציפה.",
    descEn: "DNA Polymerase III synthesizes the leading strand continuously in the 5'→3' direction following the replication fork. This strand is made as one uninterrupted molecule.",
    svgData: JSON.stringify({
      elements: [
        { id: "template", type: "path", d: "M 50 130 L 350 130", color: "#3b82f6" },
        { id: "leading", type: "path", d: "M 50 108 L 220 108", color: "#22c55e" },
        { id: "pol3", type: "circle", cx: 225, cy: 119, r: 16, color: "#059669" },
        { id: "pol3l", type: "text", x: 225, y: 150, label: "Pol III", textColor: "#059669", fontSize: 11 },
        { id: "arrow", type: "text", x: 130, y: 96, label: "5' ────→ 3' synthesis", textColor: "#22c55e", fontSize: 10 },
        { id: "primer", type: "rect", x: 50, y: 101, width: 40, height: 8, color: "#ec4899" },
        { id: "pl", type: "text", x: 70, y: 92, label: "Primer", textColor: "#ec4899", fontSize: 9 },
      ],
      highlight: ["leading", "pol3", "pol3l", "arrow"],
    }),
  },
  {
    order: 4,
    titleHe: "שברי אוקאזאקי בגדיל המפגר",
    titleEn: "Okazaki Fragments on Lagging Strand",
    descHe: "כיוון שסינתזה מתרחשת רק 5'→3', הגדיל המפגר מסונתז בחתיכות קצרות (100-200 נ' בתאי אאוקריוט) הנקראות שברי אוקאזאקי, כל אחד מתחיל בפריימר RNA חדש.",
    descEn: "Since synthesis can only proceed 5'→3', the lagging strand is made in short fragments (100-200 nt in eukaryotes) called Okazaki fragments, each starting with a new RNA primer.",
    svgData: JSON.stringify({
      elements: [
        { id: "template", type: "path", d: "M 50 80 L 350 80", color: "#f59e0b" },
        { id: "ok1", type: "rect", x: 260, y: 92, width: 68, height: 10, color: "#22c55e" },
        { id: "ok2", type: "rect", x: 170, y: 92, width: 68, height: 10, color: "#22c55e" },
        { id: "ok3", type: "rect", x: 80, y: 92, width: 68, height: 10, color: "#22c55e" },
        { id: "pr1", type: "rect", x: 250, y: 92, width: 12, height: 10, color: "#ec4899" },
        { id: "pr2", type: "rect", x: 160, y: 92, width: 12, height: 10, color: "#ec4899" },
        { id: "pr3", type: "rect", x: 70, y: 92, width: 12, height: 10, color: "#ec4899" },
        { id: "dir", type: "text", x: 200, y: 122, label: "← ← ← synthesis direction", textColor: "#22c55e", fontSize: 9 },
        { id: "label", type: "text", x: 200, y: 140, label: "Okazaki Fragments (gaps between)", textColor: "#6b7280", fontSize: 9 },
      ],
      highlight: ["ok1", "ok2", "ok3", "pr1", "pr2", "pr3", "dir"],
    }),
  },
  {
    order: 5,
    titleHe: "הסרת פריימרים ומילוי פערים — DNA Pol I",
    titleEn: "Primer Removal & Gap Filling — DNA Pol I",
    descHe: "DNA פולימראז I מסיר את פריימרי ה-RNA בעזרת פעילות 5'→3' אקסונוקלאאז ומחליף אותם ב-DNA. נוצרים פערים קטנים (חריצים/nicks) בין שברי אוקאזאקי.",
    descEn: "DNA Polymerase I removes RNA primers via its 5'→3' exonuclease activity and replaces them with DNA. Small nicks remain between Okazaki fragments.",
    svgData: JSON.stringify({
      elements: [
        { id: "template", type: "path", d: "M 50 80 L 350 80", color: "#f59e0b" },
        { id: "f1", type: "rect", x: 250, y: 92, width: 80, height: 10, color: "#22c55e" },
        { id: "f2", type: "rect", x: 160, y: 92, width: 80, height: 10, color: "#22c55e" },
        { id: "f3", type: "rect", x: 60, y: 92, width: 90, height: 10, color: "#22c55e" },
        { id: "pol1", type: "circle", cx: 155, cy: 110, r: 13, color: "#7c3aed" },
        { id: "pol1l", type: "text", x: 155, y: 135, label: "Pol I", textColor: "#7c3aed", fontSize: 11 },
        { id: "rna", type: "text", x: 200, y: 70, label: "RNA primers removed ✓", textColor: "#ec4899", fontSize: 9 },
        { id: "nick", type: "text", x: 200, y: 118, label: "nicks between fragments", textColor: "#94a3b8", fontSize: 9 },
      ],
      highlight: ["f1", "f2", "f3", "pol1", "pol1l", "rna"],
    }),
  },
  {
    order: 6,
    titleHe: "חיבור בידי ליגייז — שתי מולקולות DNA",
    titleEn: "Ligase Seals Nicks — Two Complete DNA Molecules",
    descHe: "DNA ליגייז יוצר קשרי פוספודיאסטר הסוגרים את החריצים. התוצאה: שתי מולקולות DNA כפולות-גדיליות זהות — שכפול חצי-שמרני.",
    descEn: "DNA Ligase forms phosphodiester bonds to seal the remaining nicks. Result: two identical double-stranded DNA molecules — semi-conservative replication.",
    svgData: JSON.stringify({
      elements: [
        { id: "d1t", type: "path", d: "M 50 70 L 350 70", color: "#3b82f6" },
        { id: "d1b", type: "path", d: "M 50 88 L 350 88", color: "#22c55e" },
        { id: "d2t", type: "path", d: "M 50 170 L 350 170", color: "#f59e0b" },
        { id: "d2b", type: "path", d: "M 50 188 L 350 188", color: "#22c55e" },
        { id: "lig", type: "circle", cx: 200, cy: 130, r: 14, color: "#059669" },
        { id: "ligl", type: "text", x: 200, y: 155, label: "DNA Ligase", textColor: "#059669", fontSize: 11 },
        { id: "ok1", type: "text", x: 200, y: 60, label: "Molecule 1 ✓ (original + new)", textColor: "#3b82f6", fontSize: 9 },
        { id: "ok2", type: "text", x: 200, y: 210, label: "Molecule 2 ✓ (original + new)", textColor: "#f59e0b", fontSize: 9 },
        { id: "semi", type: "text", x: 200, y: 230, label: "Semi-conservative replication", textColor: "#7c3aed", fontSize: 10 },
      ],
      highlight: ["lig", "ligl", "ok1", "ok2", "d1b", "d2b", "semi"],
    }),
  },
];

const mitosisSteps = [
  {
    order: 1,
    titleHe: "פרופאזה — עיבוי כרומוזומים וביטול הגרעינית",
    titleEn: "Prophase — Chromosome Condensation",
    descHe: "הכרומוזומים מתעבים ומופיעים כמבנים זוגיים (כל אחד מורכב מ-2 כרומטידות אחיות). הגרעינית נעלמת. הציר המיטוטי מתחיל להיווצר מהצנטריולים.",
    descEn: "Chromosomes condense into visible structures (each consisting of 2 sister chromatids joined at the centromere). The nucleolus disappears and the mitotic spindle begins forming from centrosomes.",
    svgData: JSON.stringify({
      elements: [
        { id: "nuc", type: "circle", cx: 200, cy: 150, r: 75, color: "#dbeafe", opacity: 0.6 },
        { id: "c1", type: "ellipse", cx: 175, cy: 130, rx: 16, ry: 30, color: "#3b82f6" },
        { id: "c2", type: "ellipse", cx: 225, cy: 130, rx: 16, ry: 30, color: "#3b82f6" },
        { id: "c3", type: "ellipse", cx: 175, cy: 175, rx: 14, ry: 25, color: "#f59e0b" },
        { id: "c4", type: "ellipse", cx: 225, cy: 175, rx: 14, ry: 25, color: "#f59e0b" },
        { id: "cen1", type: "circle", cx: 120, cy: 150, r: 8, color: "#7c3aed" },
        { id: "cen2", type: "circle", cx: 280, cy: 150, r: 8, color: "#7c3aed" },
        { id: "label", type: "text", x: 200, y: 255, label: "Condensing chromosomes", textColor: "#3b82f6", fontSize: 10 },
        { id: "cenlabel", type: "text", x: 200, y: 270, label: "Centrosomes (spindle organizers)", textColor: "#7c3aed", fontSize: 9 },
      ],
      highlight: ["c1", "c2", "c3", "c4", "cen1", "cen2", "label"],
    }),
  },
  {
    order: 2,
    titleHe: "מטאפאזה — יישור על לוח המטאפזי",
    titleEn: "Metaphase — Chromosome Alignment",
    descHe: "הכרומוזומים מיושרים על גבי 'לוח מטאפזי' (קו המשווה של התא). סיבי הספינדל נקשרים לקינטוכורים על הצנטרומרים. שלב זה משמש לבדיקת נפרדות נכונה.",
    descEn: "Chromosomes align at the metaphase plate (cell equator). Spindle fibers attach to kinetochores at centromeres. This stage is the checkpoint for proper attachment before separation.",
    svgData: JSON.stringify({
      elements: [
        { id: "cell", type: "ellipse", cx: 200, cy: 150, rx: 125, ry: 95, color: "#f0fdf4", opacity: 0.6 },
        { id: "plate", type: "line", x1: 200, y1: 55, x2: 200, y2: 245, color: "#94a3b8" },
        { id: "c1", type: "ellipse", cx: 200, cy: 110, rx: 13, ry: 24, color: "#3b82f6" },
        { id: "c2", type: "ellipse", cx: 200, cy: 155, rx: 13, ry: 22, color: "#f59e0b" },
        { id: "sf1", type: "line", x1: 75, y1: 150, x2: 190, y2: 110, color: "#059669" },
        { id: "sf2", type: "line", x1: 325, y1: 150, x2: 210, y2: 110, color: "#059669" },
        { id: "sf3", type: "line", x1: 75, y1: 150, x2: 190, y2: 155, color: "#059669" },
        { id: "sf4", type: "line", x1: 325, y1: 150, x2: 210, y2: 155, color: "#059669" },
        { id: "pl", type: "text", x: 200, y: 265, label: "Metaphase plate", textColor: "#94a3b8", fontSize: 9 },
        { id: "sfl", type: "text", x: 200, y: 35, label: "Spindle fibers from centrosomes", textColor: "#059669", fontSize: 9 },
      ],
      highlight: ["c1", "c2", "plate", "sf1", "sf2", "sf3", "sf4"],
    }),
  },
  {
    order: 3,
    titleHe: "אנאפאזה — הפרדת כרומטידות אחיות",
    titleEn: "Anaphase — Sister Chromatid Separation",
    descHe: "החלבון קוהזין המחבר כרומטידות אחיות מפורק. מנועי מוטורים מושכים כרומטידות לקטבים מנוגדים. התא מתארך. כל קוטב מקבל עותק מדויק של כל כרומוזום.",
    descEn: "Cohesin proteins holding sister chromatids are cleaved by separase. Motor proteins pull chromatids to opposite poles. The cell elongates as chromosomes separate — each pole gets one copy of every chromosome.",
    svgData: JSON.stringify({
      elements: [
        { id: "cell", type: "ellipse", cx: 200, cy: 150, rx: 155, ry: 90, color: "#f0fdf4", opacity: 0.5 },
        { id: "c1l", type: "ellipse", cx: 95, cy: 138, rx: 10, ry: 20, color: "#3b82f6" },
        { id: "c2l", type: "ellipse", cx: 110, cy: 165, rx: 10, ry: 18, color: "#f59e0b" },
        { id: "c1r", type: "ellipse", cx: 305, cy: 138, rx: 10, ry: 20, color: "#3b82f6" },
        { id: "c2r", type: "ellipse", cx: 290, cy: 165, rx: 10, ry: 18, color: "#f59e0b" },
        { id: "arr1", type: "text", x: 200, y: 140, label: "◄◄◄  ►►►", textColor: "#059669", fontSize: 14 },
        { id: "arr2", type: "text", x: 200, y: 168, label: "◄◄◄  ►►►", textColor: "#059669", fontSize: 14 },
        { id: "label", type: "text", x: 200, y: 258, label: "Sister chromatids separate to opposite poles", textColor: "#6b7280", fontSize: 9 },
      ],
      highlight: ["c1l", "c2l", "c1r", "c2r", "arr1", "arr2"],
    }),
  },
  {
    order: 4,
    titleHe: "טלופאזה + ציטוקינזה — שתי תאות בנות",
    titleEn: "Telophase + Cytokinesis — Two Daughter Cells",
    descHe: "קרום גרעיני חדש נוצר סביב כל קבוצת כרומוזומים. הכרומוזומים מתרופפים. ציטוקינזה מחלקת את הציטופלזמה לשתי תאות בנות עם מטען גנטי זהה.",
    descEn: "A new nuclear envelope forms around each chromosome set. Chromosomes decondense. Cytokinesis (cleavage furrow in animals) divides the cytoplasm into two genetically identical daughter cells.",
    svgData: JSON.stringify({
      elements: [
        { id: "cell1", type: "ellipse", cx: 115, cy: 150, rx: 95, ry: 85, color: "#dbeafe", opacity: 0.6 },
        { id: "cell2", type: "ellipse", cx: 285, cy: 150, rx: 95, ry: 85, color: "#dbeafe", opacity: 0.6 },
        { id: "nuc1", type: "circle", cx: 115, cy: 150, r: 38, color: "#bfdbfe" },
        { id: "nuc2", type: "circle", cx: 285, cy: 150, r: 38, color: "#bfdbfe" },
        { id: "div", type: "line", x1: 200, y1: 65, x2: 200, y2: 235, color: "#ec4899" },
        { id: "d1l", type: "text", x: 115, y: 260, label: "Daughter 1 (2n)", textColor: "#3b82f6", fontSize: 10 },
        { id: "d2l", type: "text", x: 285, y: 260, label: "Daughter 2 (2n)", textColor: "#3b82f6", fontSize: 10 },
        { id: "clabel", type: "text", x: 200, y: 50, label: "Cytokinesis ↕", textColor: "#ec4899", fontSize: 10 },
      ],
      highlight: ["cell1", "cell2", "nuc1", "nuc2", "div", "d1l", "d2l"],
    }),
  },
];

const meiosisSteps = [
  {
    order: 1,
    titleHe: "מיוזה I — הפרדת כרומוזומים הומולוגיים",
    titleEn: "Meiosis I — Homologous Chromosome Separation",
    descHe: "בפרופאזה I: כרומוזומים הומולוגיים מתחברים בתהליך 'שיצ'וג' (Synapsis) ומחליפים חלקים (Crossing Over). זה יוצר גיוון גנטי.",
    descEn: "In Prophase I, homologous chromosomes pair up (synapsis) and exchange segments via crossing over at chiasmata. This creates genetic recombination — the key source of genetic variation.",
    svgData: JSON.stringify({
      elements: [
        { id: "cell", type: "ellipse", cx: 200, cy: 150, rx: 120, ry: 95, color: "#fef3c7", opacity: 0.5 },
        { id: "hom1a", type: "ellipse", cx: 175, cy: 140, rx: 12, ry: 35, color: "#3b82f6" },
        { id: "hom1b", type: "ellipse", cx: 200, cy: 140, rx: 12, ry: 35, color: "#f59e0b" },
        { id: "hom2a", type: "ellipse", cx: 215, cy: 165, rx: 10, ry: 28, color: "#22c55e" },
        { id: "hom2b", type: "ellipse", cx: 235, cy: 165, rx: 10, ry: 28, color: "#ef4444" },
        { id: "cross", type: "text", x: 188, y: 148, label: "✕", textColor: "#7c3aed", fontSize: 18 },
        { id: "label", type: "text", x: 200, y: 265, label: "Crossing Over → genetic recombination", textColor: "#7c3aed", fontSize: 9 },
        { id: "syn", type: "text", x: 200, y: 250, label: "Synapsis (bivalent formation)", textColor: "#94a3b8", fontSize: 9 },
      ],
      highlight: ["hom1a", "hom1b", "cross", "label"],
    }),
  },
  {
    order: 2,
    titleHe: "מיוזה I אנאפאזה — הפרדת הומולוגים",
    titleEn: "Meiosis I Anaphase — Homologs Separate",
    descHe: "בניגוד למיטוזה, הכרומטידות האחיות נשארות מחוברות! הכרומוזומים ההומולוגיים מופרדים לקטבים מנוגדים. כל תא בת יקבל מחצית ממספר הכרומוזומים (2n→n).",
    descEn: "Unlike mitosis, sister chromatids STAY together. Homologous chromosomes separate to opposite poles. Each daughter cell will have half the original chromosome number (2n→n). This is reduction division.",
    svgData: JSON.stringify({
      elements: [
        { id: "cell", type: "ellipse", cx: 200, cy: 150, rx: 150, ry: 90, color: "#fef3c7", opacity: 0.4 },
        { id: "hl", type: "ellipse", cx: 95, cy: 138, rx: 10, ry: 30, color: "#3b82f6" },
        { id: "fl", type: "ellipse", cx: 108, cy: 168, rx: 10, ry: 25, color: "#22c55e" },
        { id: "hr", type: "ellipse", cx: 305, cy: 138, rx: 10, ry: 30, color: "#f59e0b" },
        { id: "fr", type: "ellipse", cx: 292, cy: 168, rx: 10, ry: 25, color: "#ef4444" },
        { id: "div", type: "line", x1: 200, y1: 60, x2: 200, y2: 240, color: "#94a3b8" },
        { id: "lab1", type: "text", x: 100, y: 250, label: "n (haploid)", textColor: "#3b82f6", fontSize: 10 },
        { id: "lab2", type: "text", x: 300, y: 250, label: "n (haploid)", textColor: "#f59e0b", fontSize: 10 },
        { id: "note", type: "text", x: 200, y: 270, label: "Homologs separate → Reduction division", textColor: "#7c3aed", fontSize: 9 },
      ],
      highlight: ["hl", "fl", "hr", "fr", "lab1", "lab2", "note"],
    }),
  },
  {
    order: 3,
    titleHe: "מיוזה II — הפרדת כרומטידות אחיות",
    titleEn: "Meiosis II — Sister Chromatid Separation",
    descHe: "מיוזה II זהה למיטוזה: כרומטידות אחיות נפרדות. ממולקולת DNA אחת נוצרות 4 תאי בת האפלואידיות. בבני אדם: 4 תאי רביה (ספרמטידות/ביציות).",
    descEn: "Meiosis II resembles mitosis: sister chromatids separate. Result: 4 haploid daughter cells from one original cell. In humans: 4 gametes (sperm/eggs) each with 23 chromosomes.",
    svgData: JSON.stringify({
      elements: [
        { id: "g1", type: "circle", cx: 90, cy: 100, r: 45, color: "#dbeafe", opacity: 0.7 },
        { id: "g2", type: "circle", cx: 200, cy: 100, r: 45, color: "#fef3c7", opacity: 0.7 },
        { id: "g3", type: "circle", cx: 90, cy: 210, r: 45, color: "#dcfce7", opacity: 0.7 },
        { id: "g4", type: "circle", cx: 200, cy: 210, r: 45, color: "#fce7f3", opacity: 0.7 },
        { id: "l1", type: "text", x: 90, y: 104, label: "n", textColor: "#3b82f6", fontSize: 18 },
        { id: "l2", type: "text", x: 200, y: 104, label: "n", textColor: "#f59e0b", fontSize: 18 },
        { id: "l3", type: "text", x: 90, y: 214, label: "n", textColor: "#22c55e", fontSize: 18 },
        { id: "l4", type: "text", x: 200, y: 214, label: "n", textColor: "#ec4899", fontSize: 18 },
        { id: "total", type: "text", x: 145, y: 270, label: "4 haploid gametes", textColor: "#7c3aed", fontSize: 11 },
        { id: "unique", type: "text", x: 145, y: 285, label: "(each genetically unique)", textColor: "#94a3b8", fontSize: 9 },
      ],
      highlight: ["g1", "g2", "g3", "g4", "total", "unique"],
    }),
  },
];

const transcriptionSteps = [
  {
    order: 1,
    titleHe: "קשירה לפרומוטר",
    titleEn: "Promoter Binding",
    descHe: "גורמי שעתוק (Transcription Factors) מזהים ונקשרים לרצף TATA box שלפני הגן. הם מגייסים RNA פולימראז II לאתר ההתחלה. קובע אם הגן פעיל.",
    descEn: "Transcription factors recognize and bind the TATA box promoter sequence ~25 bp upstream of the gene. They recruit RNA Polymerase II to the transcription start site (TSS), determining gene activity.",
    svgData: JSON.stringify({
      elements: [
        { id: "dna1", type: "path", d: "M 40 120 L 360 120", color: "#3b82f6" },
        { id: "dna2", type: "path", d: "M 40 148 L 360 148", color: "#3b82f6" },
        { id: "tata", type: "rect", x: 70, y: 110, width: 55, height: 46, color: "#fde68a", opacity: 0.8 },
        { id: "tatal", type: "text", x: 97, y: 137, label: "TATA", textColor: "#92400e", fontSize: 11 },
        { id: "promo", type: "text", x: 97, y: 105, label: "Promoter", textColor: "#92400e", fontSize: 9 },
        { id: "tf", type: "circle", cx: 175, cy: 134, r: 18, color: "#a78bfa" },
        { id: "tfl", type: "text", x: 175, y: 165, label: "TF complex", textColor: "#7c3aed", fontSize: 9 },
        { id: "rnap", type: "circle", cx: 255, cy: 134, r: 22, color: "#059669" },
        { id: "rnapl", type: "text", x: 255, y: 168, label: "RNA Pol II", textColor: "#059669", fontSize: 9 },
        { id: "tss", type: "text", x: 295, y: 108, label: "↓ TSS", textColor: "#ef4444", fontSize: 10 },
      ],
      highlight: ["tata", "tatal", "tf", "tfl", "rnap", "rnapl"],
    }),
  },
  {
    order: 2,
    titleHe: "הארכה — סינתזת pre-mRNA",
    titleEn: "Elongation — pre-mRNA Synthesis",
    descHe: "RNA פולימראז II זזה לאורך תבנית ה-DNA (3'→5') ומסנתז שרשרת RNA משלימה (5'→3'). מוסיף כיפה 5' (5'-cap) לשמירה על ה-mRNA.",
    descEn: "RNA Pol II moves along the DNA template (reading 3'→5') synthesizing a complementary RNA strand (5'→3'). A 5' cap (7-methylguanosine) is added co-transcriptionally for mRNA stability.",
    svgData: JSON.stringify({
      elements: [
        { id: "template", type: "path", d: "M 40 130 L 360 130", color: "#3b82f6" },
        { id: "nt", type: "path", d: "M 40 105 L 180 105", color: "#3b82f6", opacity: 0.4 },
        { id: "mrna", type: "path", d: "M 40 158 L 200 158", color: "#ec4899" },
        { id: "pol", type: "circle", cx: 200, cy: 144, r: 20, color: "#059669" },
        { id: "poll", type: "text", x: 200, y: 180, label: "RNA Pol II", textColor: "#059669", fontSize: 9 },
        { id: "cap", type: "circle", cx: 50, cy: 158, r: 10, color: "#f59e0b" },
        { id: "capl", type: "text", x: 50, y: 180, label: "5' cap", textColor: "#f59e0b", fontSize: 9 },
        { id: "mrnal", type: "text", x: 120, y: 175, label: "pre-mRNA 5'→3'", textColor: "#ec4899", fontSize: 9 },
      ],
      highlight: ["mrna", "pol", "poll", "cap", "capl"],
    }),
  },
  {
    order: 3,
    titleHe: "עיבוד pre-mRNA — שחבור (Splicing)",
    titleEn: "pre-mRNA Processing — Splicing",
    descHe: "האינטרונים (אזורים לא-מקדדים) מוסרים בידי ה-Spliceosome. האקסונים (אזורים מקדדים) מחוברים יחדיו. הוספת זנב poly-A-3' לסיום.",
    descEn: "The spliceosome removes non-coding introns and joins coding exons. A poly-A tail (~200 adenines) is added at the 3' end. The mature mRNA is then exported to the cytoplasm for translation.",
    svgData: JSON.stringify({
      elements: [
        { id: "premrna", type: "rect", x: 30, y: 90, width: 340, height: 18, color: "#ec4899", opacity: 0.3 },
        { id: "exon1", type: "rect", x: 30, y: 90, width: 60, height: 18, color: "#22c55e" },
        { id: "intron1", type: "rect", x: 92, y: 90, width: 60, height: 18, color: "#94a3b8" },
        { id: "exon2", type: "rect", x: 154, y: 90, width: 60, height: 18, color: "#22c55e" },
        { id: "intron2", type: "rect", x: 216, y: 90, width: 60, height: 18, color: "#94a3b8" },
        { id: "exon3", type: "rect", x: 278, y: 90, width: 90, height: 18, color: "#22c55e" },
        { id: "il", type: "text", x: 122, y: 80, label: "Intron", textColor: "#94a3b8", fontSize: 9 },
        { id: "el", type: "text", x: 60, y: 80, label: "Exon", textColor: "#22c55e", fontSize: 9 },
        { id: "splice", type: "circle", cx: 200, cy: 155, r: 18, color: "#7c3aed" },
        { id: "splicel", type: "text", x: 200, y: 180, label: "Spliceosome", textColor: "#7c3aed", fontSize: 9 },
        { id: "mature", type: "rect", x: 80, y: 215, width: 200, height: 18, color: "#22c55e" },
        { id: "maturel", type: "text", x: 180, y: 250, label: "Mature mRNA (exons only)", textColor: "#22c55e", fontSize: 9 },
        { id: "polya", type: "rect", x: 280, y: 215, width: 60, height: 18, color: "#f59e0b" },
        { id: "polyAl", type: "text", x: 310, y: 250, label: "Poly-A", textColor: "#f59e0b", fontSize: 9 },
      ],
      highlight: ["exon1", "exon2", "exon3", "splice", "splicel", "mature", "polya"],
    }),
  },
];

const pcrSteps = [
  {
    order: 1,
    titleHe: "דנטורציה — הפרדת גדילי DNA ב-95°C",
    titleEn: "Denaturation — DNA Strand Separation at 95°C",
    descHe: "חימום ל-94-96°C שובר את קשרי המימן בין הבסיסים ומפריד את שני גדילי ה-DNA לגדילים בודדים. תהליך זה נחוץ כדי שהפריימרים יוכלו לגשת לרצפי היעד.",
    descEn: "Heating to 94-96°C breaks all hydrogen bonds between base pairs, converting double-stranded DNA into single strands. This exposes the template sequences for primer binding.",
    svgData: JSON.stringify({
      elements: [
        { id: "heat", type: "text", x: 200, y: 45, label: "🌡️ 95°C — HEAT", textColor: "#ef4444", fontSize: 14 },
        { id: "s1", type: "path", d: "M 60 130 Q 200 80 340 130", color: "#3b82f6" },
        { id: "s2", type: "path", d: "M 60 180 Q 200 230 340 180", color: "#f59e0b" },
        { id: "label", type: "text", x: 200, y: 260, label: "Single-stranded templates", textColor: "#6b7280", fontSize: 10 },
        { id: "bonds", type: "text", x: 200, y: 210, label: "H-bonds broken ✕", textColor: "#ef4444", fontSize: 10 },
      ],
      highlight: ["s1", "s2", "heat", "bonds"],
    }),
  },
  {
    order: 2,
    titleHe: "עיגון פריימרים ב-55-65°C",
    titleEn: "Primer Annealing at 55-65°C",
    descHe: "קירור לטמפרטורת ה-Annealing (55-65°C) מאפשר לפריימרים — זוגות של אוליגונוקלאוטידים בני 18-25 בסיסים — להיקשר ספציפית לרצפי ה-DNA המשלימים.",
    descEn: "Cooling to 55-65°C allows the short synthetic primers (18-25 nucleotides) to bind specifically to their complementary sequences flanking the target region. Temperature is carefully chosen for specificity.",
    svgData: JSON.stringify({
      elements: [
        { id: "temp", type: "text", x: 200, y: 42, label: "🌡️ 58°C — ANNEALING", textColor: "#3b82f6", fontSize: 12 },
        { id: "t1", type: "path", d: "M 50 115 L 350 115", color: "#3b82f6" },
        { id: "t2", type: "path", d: "M 50 205 L 350 205", color: "#f59e0b" },
        { id: "fwd", type: "rect", x: 70, y: 103, width: 65, height: 12, color: "#ec4899" },
        { id: "rev", type: "rect", x: 265, y: 205, width: 65, height: 12, color: "#ec4899" },
        { id: "fwdl", type: "text", x: 103, y: 95, label: "Forward primer →", textColor: "#ec4899", fontSize: 9 },
        { id: "revl", type: "text", x: 298, y: 232, label: "← Reverse primer", textColor: "#ec4899", fontSize: 9 },
        { id: "note", type: "text", x: 200, y: 258, label: "Primers flank the target region", textColor: "#6b7280", fontSize: 9 },
      ],
      highlight: ["fwd", "rev", "fwdl", "revl"],
    }),
  },
  {
    order: 3,
    titleHe: "הארכה ב-72°C — Taq פולימראז",
    titleEn: "Extension at 72°C — Taq Polymerase",
    descHe: "Taq פולימראז (עמיד לחום, מ-Thermus aquaticus) מאריך את הפריימרים ב-72°C. מסנתז גדיל DNA חדש בכיוון 5'→3'. כל מחזור מכפיל את הכמות: 2ⁿ העתקים.",
    descEn: "Heat-stable Taq polymerase (from Thermus aquaticus bacterium) extends primers at 72°C, synthesizing new DNA at ~1 kb/min. After n cycles: 2ⁿ copies of the target. Exponential amplification.",
    svgData: JSON.stringify({
      elements: [
        { id: "temp", type: "text", x: 200, y: 40, label: "🌡️ 72°C — EXTENSION", textColor: "#22c55e", fontSize: 12 },
        { id: "t1", type: "path", d: "M 50 100 L 350 100", color: "#3b82f6" },
        { id: "new1", type: "path", d: "M 50 118 L 350 118", color: "#22c55e" },
        { id: "t2", type: "path", d: "M 50 200 L 350 200", color: "#f59e0b" },
        { id: "new2", type: "path", d: "M 50 182 L 350 182", color: "#22c55e" },
        { id: "taq1", type: "circle", cx: 280, cy: 109, r: 12, color: "#7c3aed" },
        { id: "taq2", type: "circle", cx: 120, cy: 191, r: 12, color: "#7c3aed" },
        { id: "tl", type: "text", x: 200, y: 148, label: "Taq Polymerase extends 5'→3'", textColor: "#7c3aed", fontSize: 9 },
        { id: "cycle", type: "text", x: 200, y: 255, label: "Cycle 1→2→4→8…→2ⁿ copies", textColor: "#22c55e", fontSize: 10 },
      ],
      highlight: ["new1", "new2", "taq1", "taq2", "tl", "cycle"],
    }),
  },
];

const glycolysisSteps = [
  {
    order: 1,
    titleHe: "השקעת אנרגיה — 2 ATP לגלוקוז",
    titleEn: "Energy Investment — 2 ATP per Glucose",
    descHe: "הקסוקינז מזרח גלוקוז ל-G-6-P (ATP1 → ADP). איזומראז הופך ל-F-6-P. PFK-1 מזרח ל-F-1,6-BP (ATP2 → ADP). כעת מולקולה בת 6 פחמנים מוכנה לפיצול.",
    descEn: "Hexokinase phosphorylates glucose using ATP₁ → ADP. Phosphoglucose isomerase converts to F-6-P. PFK-1 (the key regulatory enzyme) adds another phosphate using ATP₂ → ADP, creating fructose-1,6-bisphosphate.",
    svgData: JSON.stringify({
      elements: [
        { id: "g", type: "circle", cx: 80, cy: 150, r: 26, color: "#f59e0b" },
        { id: "gl", type: "text", x: 80, y: 154, label: "Glc", textColor: "#78350f", fontSize: 10 },
        { id: "atp1", type: "circle", cx: 80, cy: 85, r: 14, color: "#ec4899" },
        { id: "atp1l", type: "text", x: 80, y: 65, label: "ATP₁→ADP", textColor: "#ec4899", fontSize: 9 },
        { id: "arr1", type: "line", x1: 108, y1: 150, x2: 150, y2: 150, color: "#6b7280" },
        { id: "g6p", type: "circle", cx: 175, cy: 150, r: 22, color: "#f59e0b" },
        { id: "g6pl", type: "text", x: 175, y: 154, label: "G-6-P", textColor: "#78350f", fontSize: 9 },
        { id: "arr2", type: "line", x1: 198, y1: 150, x2: 238, y2: 150, color: "#6b7280" },
        { id: "atp2", type: "circle", cx: 260, cy: 85, r: 14, color: "#ec4899" },
        { id: "atp2l", type: "text", x: 260, y: 65, label: "ATP₂→ADP", textColor: "#ec4899", fontSize: 9 },
        { id: "f16bp", type: "circle", cx: 310, cy: 150, r: 26, color: "#f59e0b" },
        { id: "f16bpl", type: "text", x: 310, y: 154, label: "F-1,6-BP", textColor: "#78350f", fontSize: 9 },
        { id: "pfk", type: "text", x: 260, y: 180, label: "PFK-1 (rate-limiting)", textColor: "#7c3aed", fontSize: 9 },
        { id: "invest", type: "text", x: 200, y: 240, label: "Investment: -2 ATP", textColor: "#ec4899", fontSize: 11 },
      ],
      highlight: ["atp1", "atp2", "pfk", "invest"],
    }),
  },
  {
    order: 2,
    titleHe: "פיצול — שני מולקולות G3P (3C)",
    titleEn: "Cleavage — Two Glyceraldehyde-3-Phosphate Molecules",
    descHe: "אלדולאז פוצל את F-1,6-BP (6C) לשתי מולקולות בנות 3 פחמנים: DHAP ו-G3P (גליצרואלדהיד-3-פוספט). DHAP מומר ל-G3P. לאחר מכן שתי מולקולות G3P נכנסות לשלב ההחזר.",
    descEn: "Aldolase cleaves F-1,6-BP (6C) into DHAP and G3P (glyceraldehyde-3-phosphate). Isomerase converts DHAP to G3P. Both G3P molecules then enter the energy payoff phase.",
    svgData: JSON.stringify({
      elements: [
        { id: "f16bp", type: "circle", cx: 200, cy: 90, r: 28, color: "#f59e0b" },
        { id: "f16l", type: "text", x: 200, y: 94, label: "F-1,6-BP", textColor: "#78350f", fontSize: 9 },
        { id: "aldol", type: "text", x: 200, y: 58, label: "↓ Aldolase", textColor: "#7c3aed", fontSize: 10 },
        { id: "line1", type: "line", x1: 180, y1: 118, x2: 130, y2: 165, color: "#6b7280" },
        { id: "line2", type: "line", x1: 220, y1: 118, x2: 270, y2: 165, color: "#6b7280" },
        { id: "dhap", type: "circle", cx: 110, cy: 185, r: 22, color: "#94a3b8" },
        { id: "dhapl", type: "text", x: 110, y: 189, label: "DHAP", textColor: "#475569", fontSize: 9 },
        { id: "g3p1", type: "circle", cx: 290, cy: 185, r: 22, color: "#22c55e" },
        { id: "g3p1l", type: "text", x: 290, y: 189, label: "G3P", textColor: "#14532d", fontSize: 10 },
        { id: "iso", type: "text", x: 200, y: 188, label: "→ isomerase →", textColor: "#6b7280", fontSize: 9 },
        { id: "g3p2", type: "circle", cx: 200, cy: 255, r: 22, color: "#22c55e" },
        { id: "g3p2l", type: "text", x: 200, y: 259, label: "G3P×2", textColor: "#14532d", fontSize: 10 },
        { id: "note", type: "text", x: 200, y: 285, label: "2 molecules → payoff phase", textColor: "#6b7280", fontSize: 9 },
      ],
      highlight: ["g3p1", "g3p2", "g3p2l"],
    }),
  },
  {
    order: 3,
    titleHe: "שלב ההחזר — 4 ATP + 2 NADH",
    titleEn: "Energy Payoff — 4 ATP + 2 NADH",
    descHe: "כל מולקולת G3P עוברת 5 תגובות: חמצון ל-1,3-BPG (יוצר NADH), ולאחר מכן 4 שלבי ייצור ATP. ל-2 מולקולות G3P: +4 ATP. רווח נקי: 2 ATP + 2 NADH + 2 פירובאט.",
    descEn: "Each G3P undergoes oxidation to 1,3-BPG (generating NADH), then 4 steps producing ATP by substrate-level phosphorylation. For 2 G3P molecules: +4 ATP total. Net: 2 ATP + 2 NADH + 2 pyruvate (3C).",
    svgData: JSON.stringify({
      elements: [
        { id: "g3p", type: "circle", cx: 80, cy: 150, r: 22, color: "#22c55e" },
        { id: "g3pl", type: "text", x: 80, y: 154, label: "G3P×2", textColor: "#14532d", fontSize: 9 },
        { id: "arr", type: "line", x1: 104, y1: 150, x2: 148, y2: 150, color: "#6b7280" },
        { id: "steps", type: "text", x: 126, y: 142, label: "5 rxns", textColor: "#6b7280", fontSize: 8 },
        { id: "atp", type: "circle", cx: 210, cy: 120, r: 22, color: "#22c55e" },
        { id: "atpl", type: "text", x: 210, y: 124, label: "+4 ATP", textColor: "#14532d", fontSize: 10 },
        { id: "nadh", type: "circle", cx: 210, cy: 185, r: 22, color: "#3b82f6" },
        { id: "nadhl", type: "text", x: 210, y: 189, label: "+2 NADH", textColor: "#1e40af", fontSize: 10 },
        { id: "pyru", type: "circle", cx: 330, cy: 150, r: 22, color: "#7c3aed" },
        { id: "pyrul", type: "text", x: 330, y: 154, label: "Pyruvate×2", textColor: "#4c1d95", fontSize: 9 },
        { id: "net", type: "text", x: 200, y: 250, label: "Net gain: 2 ATP + 2 NADH", textColor: "#059669", fontSize: 11 },
        { id: "invest", type: "text", x: 200, y: 268, label: "(4 produced − 2 invested)", textColor: "#94a3b8", fontSize: 9 },
      ],
      highlight: ["atp", "atpl", "nadh", "nadhl", "net"],
    }),
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  await prisma.processStep.deleteMany();
  await prisma.process.deleteMany();
  await prisma.subtopic.deleteMany();
  await prisma.topic.deleteMany();

  // ─── 1. גנטיקה — Inheritance, mutations, expression control ──────────────
  await prisma.topic.create({
    data: {
      slug: "genetics",
      nameHe: "גנטיקה",
      nameEn: "Genetics",
      descHe: "עקרונות תורשה, אללים, ביטוי גנטי, מוטציות, קישוריות גנטית",
      descEn: "Principles of heredity, alleles, gene expression, mutations, and genetic linkage",
      category: "genetics",
      icon: "🧬",
      subtopics: {
        create: [
          {
            slug: "mendelian-genetics",
            nameHe: "גנטיקה מנדלית",
            nameEn: "Mendelian Genetics",
            contentHe: "גרגור מנדל גילה את עקרונות התורשה הבסיסיים על ידי ניסויים בצמחי אפונה:\n\n• חוק ההפרדה: כל אורגניזם נושא שני אללים לכל גן; הם נפרדים בזמן יצירת גמטות\n• חוק ההתפלגות העצמאית: גנים על כרומוזומים שונים מתפזרים באופן עצמאי\n• דומיננטיות: אלל דומיננטי (A) מסתיר רצסיבי (a) ביחיד ההטרוזיגוטי (Aa)\n\nיחסי הורשה: יחס 3:1 בצאצאי Aa×Aa; יחס 1:1 בהכלאה בוחנת (Aa×aa)\n\nחשוב: מנדל לא ידע על DNA — מצא את החוקים סטטיסטית!",
            contentEn: "Gregor Mendel discovered the laws of heredity through pea plant experiments:\n\n• Law of Segregation: each organism carries two alleles per gene; they separate during gamete formation\n• Law of Independent Assortment: genes on different chromosomes assort independently\n• Dominance: dominant allele (A) masks recessive (a) in heterozygotes (Aa)\n\nRatios: 3:1 in Aa×Aa offspring; 1:1 in testcross (Aa×aa)\n\nKey: Mendel found these laws statistically — he never knew about DNA!",
          },
          {
            slug: "inheritance-patterns",
            nameHe: "דפוסי הורשה",
            nameEn: "Inheritance Patterns",
            contentHe: "מעבר לדומיננטיות פשוטה, קיימים דפוסי הורשה נוספים:\n\n• קודומיננטיות: שני האללים מתבטאים (סוג דם AB)\n• דומיננטיות לא שלמה: ביניים (פרח ורוד מהכלאת אדום×לבן)\n• הורשה מין-תלויה: גנים על כרומוזום X (עיוורון צבעים, המופיליה)\n• הורשה מרובת גנים (Polygenic): גובה, צבע עור — כמה גנים על תכונה אחת\n• פליוטרופיה: גן אחד משפיע על תכונות רבות (גן ה-CFTR במחלת ציסטיק פיברוזיס)",
            contentEn: "Beyond simple dominance, additional patterns exist:\n\n• Codominance: both alleles expressed simultaneously (blood type AB)\n• Incomplete dominance: blended phenotype (pink flower from red×white cross)\n• Sex-linked inheritance: genes on X chromosome (color blindness, hemophilia)\n• Polygenic inheritance: height, skin color — multiple genes per trait\n• Pleiotropy: one gene affects multiple traits (CFTR gene in cystic fibrosis)",
            relatedProcessSlug: "meiosis",
          },
          {
            slug: "mutations",
            nameHe: "מוטציות גנטיות",
            nameEn: "Genetic Mutations",
            contentHe: "מוטציות הן שינויים קבועים ברצף ה-DNA:\n\n• מוטציות נקודתיות: החלפת בסיס בודד — Missense (שינוי חומצת אמינו), Nonsense (קוד עצירה), Silent (אין שינוי)\n• Frameshift: הוספה/מחיקה של בסיסים (לא כפולת 3) — משנה את כל המסגרת\n• מוטציות כרומוזומליות: מחיקה, כפל, היפוך, תנסלוקציה\n• גורמי מוטציה: קרינת UV, חומרים כימיים, שגיאות שכפול\n• מוטציות סומטיות: לא עוברות בתורשה (סרטן). גרמינליות: עוברות לצאצאים",
            contentEn: "Mutations are permanent changes in DNA sequence:\n\n• Point mutations: single base substitution — Missense (amino acid change), Nonsense (stop codon), Silent (same amino acid)\n• Frameshift: insertion/deletion not in multiples of 3 — alters entire reading frame\n• Chromosomal mutations: deletion, duplication, inversion, translocation\n• Mutagens: UV radiation, chemicals, replication errors\n• Somatic mutations: not inherited (cancer). Germline: inherited by offspring",
          },
        ],
      },
      processes: {
        create: [
          {
            slug: "meiosis",
            nameHe: "מיוזה",
            nameEn: "Meiosis",
            descHe: "חלוקה הפחתתית המייצרת 4 גמטות האפלואידיות עם גיוון גנטי",
            descEn: "Reductive division producing 4 haploid gametes with genetic diversity through crossing over",
            steps: { create: meiosisSteps },
          },
        ],
      },
    },
  });

  // ─── 2. ביולוגיה מולקולרית — DNA, RNA, proteins, techniques ────────────
  await prisma.topic.create({
    data: {
      slug: "molecular-biology",
      nameHe: "ביולוגיה מולקולרית",
      nameEn: "Molecular Biology",
      descHe: "שכפול DNA, שעתוק, תרגום, ביטוי גנים, ושיטות מולקולריות (PCR, CRISPR)",
      descEn: "DNA replication, transcription, translation, gene expression, and molecular techniques (PCR, CRISPR)",
      category: "molecular",
      icon: "🧪",
      subtopics: {
        create: [
          {
            slug: "dna-structure",
            nameHe: "מבנה DNA",
            nameEn: "DNA Structure",
            contentHe: "DNA הוא פולימר דו-גדילי בצורת סלייל כפול (Watson & Crick, 1953):\n\n• כל גדיל: שרשרת נוקלאוטידים — פוספט + סוכר דאוקסיריבוז + בסיס (A/T/G/C)\n• הגדילים אנטי-פרלליים: 5'→3' מול 3'→5'\n• קשרי מימן בין בסיסים: A=T (2 קשרים), G≡C (3 קשרים)\n• כמות: A=T, G=C (חוק Chargaff)\n• 3.4Å למדרגה, 10 בסיסים לסיבוב\n• אחסון: DNA מלופף סביב היסטונים → נוקלאוזומות → כרומטין",
            contentEn: "DNA is a double-stranded helical polymer (Watson & Crick, 1953):\n\n• Each strand: polynucleotide chain — phosphate + deoxyribose sugar + base (A/T/G/C)\n• Antiparallel strands: 5'→3' opposite 3'→5'\n• Hydrogen bonds: A=T (2 bonds), G≡C (3 bonds)\n• Chargaff's rule: A=T, G=C\n• 3.4Å per base pair, 10 bases per turn\n• Packaging: DNA wrapped around histones → nucleosomes → chromatin",
            relatedProcessSlug: "dna-replication",
          },
          {
            slug: "central-dogma",
            nameHe: "הדוגמה המרכזית",
            nameEn: "Central Dogma",
            contentHe: "הדוגמה המרכזית (Francis Crick, 1958) מתארת את זרימת המידע הגנטי:\n\nDNA → RNA → חלבון\n\n• שעתוק (Transcription): DNA→pre-mRNA בגרעין, בידי RNA פולימראז\n• עיבוד: השחבור (Splicing), כיפוי 5', זנב poly-A\n• תרגום (Translation): mRNA→חלבון בריבוזומים, בעזרת tRNA\n• חריגים: רטרו-וירוסים — RNA→DNA (Reverse Transcription)\n\nחשיבות: כל תא מכיל אותו DNA, אך מבטא גנים שונים!",
            contentEn: "The Central Dogma (Francis Crick, 1958) describes the flow of genetic information:\n\nDNA → RNA → Protein\n\n• Transcription: DNA→pre-mRNA in nucleus by RNA polymerase II\n• Processing: splicing, 5' capping, poly-A tail addition\n• Translation: mRNA→protein at ribosomes using tRNA\n• Exception: retroviruses perform reverse transcription (RNA→DNA)\n\nKey insight: every cell has identical DNA but expresses different genes!",
            relatedProcessSlug: "transcription",
          },
          {
            slug: "pcr-technique",
            nameHe: "PCR — תגובת שרשרת פולימראז",
            nameEn: "PCR — Polymerase Chain Reaction",
            contentHe: "PCR (Mullis, 1985) היא שיטה מרכזית לצהכפלת קטעי DNA:\n\nמרכיבים:\n• תבנית DNA (DNA template)\n• שני פריימרים (forward + reverse)\n• Taq פולימראז (עמיד לחום)\n• dNTPs (בסיסים חופשיים)\n• חוצץ (Buffer)\n\nיישומים: אבחון מחלות (COVID-19 test), בדיקות DNA משפטיות, קלונינג של גנים\n\nקרינות: כל מחזור מכפיל. 30 מחזורים → ~10⁹ עותקים!",
            contentEn: "PCR (Mullis, 1985) is the key technique for DNA amplification:\n\nComponents:\n• DNA template\n• Two primers (forward + reverse)\n• Taq polymerase (heat-stable)\n• dNTPs (free nucleotides)\n• Buffer\n\nApplications: disease diagnosis (COVID-19 testing), forensic DNA analysis, gene cloning\n\nPower: each cycle doubles the DNA. 30 cycles → ~10⁹ copies!",
            relatedProcessSlug: "pcr",
          },
        ],
      },
      processes: {
        create: [
          {
            slug: "dna-replication",
            nameHe: "שכפול DNA",
            nameEn: "DNA Replication",
            descHe: "התהליך שבו מולקולת DNA מכפילה את עצמה בצורה חצי-שמרנית לפני חלוקת התא",
            descEn: "The semi-conservative process by which a DNA molecule duplicates itself prior to cell division",
            steps: { create: dnaReplicationSteps },
          },
          {
            slug: "transcription",
            nameHe: "שעתוק",
            nameEn: "Transcription",
            descHe: "העתקת מידע גנטי מ-DNA ל-mRNA ועיבוד ה-pre-mRNA",
            descEn: "Copying genetic information from DNA to mRNA and processing pre-mRNA",
            steps: { create: transcriptionSteps },
          },
          {
            slug: "pcr",
            nameHe: "PCR — תגובת שרשרת פולימראז",
            nameEn: "PCR — Polymerase Chain Reaction",
            descHe: "שיטה מעבדתית להכפלת קטעי DNA ספציפיים באופן אקספוננציאלי",
            descEn: "A laboratory technique for exponentially amplifying specific DNA sequences",
            steps: { create: pcrSteps },
          },
        ],
      },
    },
  });

  // ─── 3. ביולוגיה של התא ─────────────────────────────────────────────────
  await prisma.topic.create({
    data: {
      slug: "cell-biology",
      nameHe: "ביולוגיה של התא",
      nameEn: "Cell Biology",
      descHe: "מבנה התא האאוקריוטי, אברונים, קרום התא, מחזור התא, מיטוזה",
      descEn: "Eukaryotic cell structure, organelles, cell membrane, cell cycle, and mitosis",
      category: "cell",
      icon: "🔬",
      subtopics: {
        create: [
          {
            slug: "cell-organelles",
            nameHe: "אברוני התא",
            nameEn: "Cell Organelles",
            contentHe: "תאים אאוקריוטים מכילים אברונים בעלי ממברנה עם תפקידים מיוחדים:\n\n• גרעין (Nucleus): מכיל DNA, מרכז הבקרה הגנטית\n• מיטוכונדריה: ייצור ATP (נשימה תאית); בעלת DNA ייחודי (תאוריית האנדוסימביוזה)\n• rER (ריבוזומלי): ייצור וקיפול חלבונים; sER: סינתזת שומנים\n• גולגי: עיבוד, מיון ושינוע חלבונים; יוצר שלפוחיות\n• ליזוזומים: עיכול תוך-תאי בידי אנזימי הידרוליזה\n• כלורופלסטים (צמחים): פוטוסינתזה\n• ציטוסקלטון: מיקרוטובולים, אקטין — מבנה, תנועה, חלוקה",
            contentEn: "Eukaryotic cells contain membrane-bound organelles with specialized functions:\n\n• Nucleus: contains DNA; the genetic control center\n• Mitochondria: ATP production; has its own DNA (endosymbiotic origin)\n• rER: protein synthesis and folding; sER: lipid synthesis and detoxification\n• Golgi apparatus: protein processing, sorting, and secretion\n• Lysosomes: intracellular digestion by hydrolytic enzymes\n• Chloroplasts (plants): photosynthesis\n• Cytoskeleton: microtubules, actin — structure, movement, division",
          },
          {
            slug: "cell-cycle",
            nameHe: "מחזור התא",
            nameEn: "Cell Cycle",
            contentHe: "מחזור התא מחלק לשתי תקופות עיקריות:\n\nאינטרפאזה (90% מהזמן):\n• G1: גדילה, סינתזת חלבונים, בדיקת נזקי DNA (Restriction point)\n• S: שכפול DNA (כל ה-DNA מוכפל פעם אחת)\n• G2: גדילה, הכנה לחלוקה, שוב בדיקת נזקים\n\nמיטוזה (M): פרופאזה, מטאפאזה, אנאפאזה, טלופאזה + ציטוקינזה\n\nנקודות בדיקה (Checkpoints): G1/S, G2/M, Spindle checkpoint — גידולים לרוב מכילים מוטציות ב-p53 (שומר הגנום)",
            contentEn: "The cell cycle has two major phases:\n\nInterphase (90% of time):\n• G1: cell growth, protein synthesis, DNA damage check (restriction point)\n• S phase: DNA replication (each chromosome copied once)\n• G2: further growth, preparation for division, damage repair\n\nMitosis (M phase): prophase → metaphase → anaphase → telophase + cytokinesis\n\nCheckpoints: G1/S, G2/M, Spindle assembly — most cancers involve mutations in p53 ('guardian of the genome')",
            relatedProcessSlug: "mitosis",
          },
          {
            slug: "cell-membrane",
            nameHe: "קרום התא ותעבורה",
            nameEn: "Cell Membrane & Transport",
            contentHe: "קרום התא — דו-שכבת פוספוליפידים (מודל פסיפס נוזלי, Singer & Nicolson 1972):\n\n• מבנה: ראשים הידרופיליים פונים החוצה; זנבות הידרופוביים פנימה; כולסטרול מווסת נזילות\n• חלבוני קרום: תעלות יונים, חלבוני נשא, קולטנים, אנזימים\n\nסוגי תעבורה:\n• דיפוזיה פשוטה: עם הגרדיאנט, ללא ATP\n• דיפוזיה מוקלת: חלבוני נשא/תעלות, עם הגרדיאנט\n• תעבורה פעילה: נגד הגרדיאנט, דורש ATP (משאבת Na⁺/K⁺)\n• אנדוציטוזה/אקסוציטוזה: מולקולות גדולות",
            contentEn: "The cell membrane — phospholipid bilayer (fluid mosaic model, Singer & Nicolson 1972):\n\n• Structure: hydrophilic heads outward; hydrophobic tails inward; cholesterol regulates fluidity\n• Membrane proteins: ion channels, carrier proteins, receptors, enzymes\n\nTransport types:\n• Simple diffusion: along concentration gradient, no ATP\n• Facilitated diffusion: carrier/channel proteins, along gradient\n• Active transport: against gradient, requires ATP (Na⁺/K⁺ pump)\n• Endocytosis/exocytosis: large molecules",
          },
        ],
      },
      processes: {
        create: [
          {
            slug: "mitosis",
            nameHe: "מיטוזה",
            nameEn: "Mitosis",
            descHe: "חלוקה תאית סומטית המייצרת שתי תאות בנות דיפלואידיות זהות",
            descEn: "Somatic cell division producing two genetically identical diploid daughter cells",
            steps: { create: mitosisSteps },
          },
        ],
      },
    },
  });

  // ─── 4. ביוכימיה ────────────────────────────────────────────────────────
  await prisma.topic.create({
    data: {
      slug: "biochemistry",
      nameHe: "ביוכימיה",
      nameEn: "Biochemistry",
      descHe: "מבנה ותפקוד מולקולות ביולוגיות: חלבונים, אנזימים, מסלולים מטבוליים",
      descEn: "Structure and function of biological macromolecules: proteins, enzymes, metabolic pathways",
      category: "biochemistry",
      icon: "⚗️",
      subtopics: {
        create: [
          {
            slug: "protein-structure",
            nameHe: "מבנה חלבונים",
            nameEn: "Protein Structure",
            contentHe: "חלבונים — פולימרים של חומצות אמינו, 4 רמות מבנה:\n\n1. ראשוני: רצף חומצות אמינו (קשרי פפטיד)\n2. משני: α-helix, β-sheet (קשרי מימן בין שלד פפטידי)\n3. שלישוני: קיפול תלת-ממדי (קשרי דיסולפיד, הידרופוביות, מלחיים)\n4. רביעוני: כמה שרשראות ביחד (המוגלובין: 4 שרשראות)\n\nקיפול: שפרונים (Chaperones) מסייעים; מחלות פריון ממחישות חשיבות קיפול נכון\n\nתפקידים: קטליזה (אנזימים), מבנה (קולגן), הגנה (נוגדנים), הובלה (המוגלובין)",
            contentEn: "Proteins — polymers of amino acids, 4 levels of structure:\n\n1. Primary: amino acid sequence (peptide bonds)\n2. Secondary: α-helix, β-sheet (hydrogen bonds between backbone)\n3. Tertiary: 3D folding (disulfide bonds, hydrophobic interactions, ionic bonds)\n4. Quaternary: multiple polypeptide chains (hemoglobin: 4 chains)\n\nFolding: chaperones assist; prion diseases demonstrate the critical importance of correct folding\n\nFunctions: catalysis (enzymes), structure (collagen), defense (antibodies), transport (hemoglobin)",
          },
          {
            slug: "enzymes",
            nameHe: "אנזימים",
            nameEn: "Enzymes",
            contentHe: "אנזימים הם קטליזטורים ביולוגיים (בדרך כלל חלבונים) שמאיצים תגובות כימיות:\n\n• מקום פעיל (Active Site): כיס תלת-ממדי הקושר מצע ספציפי\n• מנגנון: מפחיתים אנרגיית הפעלה (Activation Energy)\n• מודל הידית-כפפה (Induced Fit): האנזים משנה צורה עם קשירת המצע\n\nוויסות אנזימים:\n• עיכוב תחרותי: מעכב דומה למצע, נקשר ל-Active Site\n• עיכוב לא-תחרותי: נקשר לאתר אלוסטרי, משנה צורת ה-Active Site\n• עיכוב product: צבירת תוצר מעכב את האנזים (feedback inhibition)\n• גורמים: טמפרטורה (Topt ~37°C), pH, ריכוז מצע (Km, Vmax — Michaelis-Menten)",
            contentEn: "Enzymes are biological catalysts (usually proteins) that accelerate chemical reactions:\n\n• Active Site: 3D pocket that binds a specific substrate\n• Mechanism: lowers activation energy (Activation Energy)\n• Induced Fit model: enzyme changes shape upon substrate binding\n\nEnzyme regulation:\n• Competitive inhibition: inhibitor resembles substrate, binds Active Site\n• Non-competitive inhibition: binds allosteric site, changes Active Site shape\n• Product inhibition: accumulated product inhibits enzyme (feedback inhibition)\n• Factors: temperature (Topt ~37°C), pH, substrate concentration (Km, Vmax — Michaelis-Menten)",
          },
          {
            slug: "atp-energy",
            nameHe: "ATP ומטבוליזם אנרגטי",
            nameEn: "ATP and Energy Metabolism",
            contentHe: "ATP (אדנוזין טריפוספט) — 'מטבע האנרגיה' הסלולרי:\n\n• מבנה: אדנין + ריבוז + 3 קבוצות פוספט (α, β, γ)\n• פירוק: ATP + H₂O → ADP + Pᵢ + 30.5 kJ/mol\n• ייצור ATP:\n  1. גליקוליזה (ציטופלזמה): +2 ATP נטו\n  2. מחזור קרבס (מטריצת מיטוכונדריה): +2 ATP\n  3. שרשרת הנשימה (קרום פנימי): +28-32 ATP\n  סה\"כ: ~32-36 ATP למולקולת גלוקוז\n\n• הפחתה/חמצון: NADH ו-FADH₂ נושאי אלקטרונים אל שרשרת הנשימה",
            contentEn: "ATP (Adenosine Triphosphate) — the cellular 'energy currency':\n\n• Structure: adenine + ribose + 3 phosphate groups (α, β, γ)\n• Hydrolysis: ATP + H₂O → ADP + Pᵢ + 30.5 kJ/mol\n• ATP production:\n  1. Glycolysis (cytoplasm): +2 ATP net\n  2. Krebs cycle (mitochondrial matrix): +2 ATP\n  3. Electron transport chain (inner membrane): +28-32 ATP\n  Total: ~32-36 ATP per glucose molecule\n\n• Reduction/oxidation: NADH and FADH₂ carry electrons to the ETC",
            relatedProcessSlug: "glycolysis",
          },
        ],
      },
      processes: {
        create: [
          {
            slug: "glycolysis",
            nameHe: "גליקוליזה",
            nameEn: "Glycolysis",
            descHe: "פירוק גלוקוז לשני פירובאט עם ייצור נטו של 2 ATP ו-2 NADH בציטופלזמה",
            descEn: "Breakdown of glucose into two pyruvate molecules with a net yield of 2 ATP and 2 NADH in the cytoplasm",
            steps: { create: glycolysisSteps },
          },
        ],
      },
    },
  });

  // ─── 5. מיקרוביולוגיה ────────────────────────────────────────────────────
  await prisma.topic.create({
    data: {
      slug: "microbiology",
      nameHe: "מיקרוביולוגיה",
      nameEn: "Microbiology",
      descHe: "חיידקים, וירוסים, מערכת החיסון, פתוגנים ומיקרוביום",
      descEn: "Bacteria, viruses, the immune system, pathogens, and the human microbiome",
      category: "microbiology",
      icon: "🦠",
      subtopics: {
        create: [
          {
            slug: "bacteria-structure",
            nameHe: "מבנה וגדילת חיידקים",
            nameEn: "Bacterial Structure and Growth",
            contentHe: "חיידקים הם תאים פרוקריוטים — ללא גרעין מקרומי:\n\n• דופן תא: פפטידוגליקן; יעד לאנטיביוטיקות (פניצילין)\n• קרום פלזמה, ריבוזומים 70S (30S+50S)\n• כרומוזום בודד מעגלי + פלסמידים\n• פיילי לדבקות; פלגלה לתנועה; ספולות (Spores) לחיים קשים\n\nסיווג גרם:\n• גרם+ (סגול): דופן עבה (20-80nm) — Staphylococcus, Bacillus\n• גרם- (ורד): דופן דקה + ממברנה חיצונית עם LPS — E. coli, Salmonella\n\nעקומת גדילה: Lag → Log → Stationary → Death",
            contentEn: "Bacteria are prokaryotic cells — no membrane-bound nucleus:\n\n• Cell wall: peptidoglycan; target of antibiotics (penicillin)\n• Plasma membrane, 70S ribosomes (30S+50S subunits)\n• Single circular chromosome + optional plasmids\n• Pili for adhesion; flagella for motility; endospores for harsh conditions\n\nGram classification:\n• Gram+ (purple): thick wall (20-80nm) — Staphylococcus, Bacillus\n• Gram- (pink): thin wall + outer membrane with LPS — E. coli, Salmonella\n\nGrowth curve: Lag → Log (exponential) → Stationary → Death",
          },
          {
            slug: "viruses",
            nameHe: "וירוסים ומחזור חיים ויראלי",
            nameEn: "Viruses and Viral Life Cycle",
            contentHe: "וירוסים הם גורמים זיהומיים תת-תאיים — חיים רק בתוך תאים מארח:\n\n• מבנה: חומצה גרעינית (DNA/RNA) + קפסיד חלבוני ± ממברנה ליפידית\n• מחזור ליטי: קשירה → חדירה → שכפול → הרכבה → שחרור (הרג התא)\n• מחזור ליסוגני: DNA ויראלי משולב בכרומוזום המארח (Provirus/Prophage)\n\nסוגים לפי גנום:\n• DNA ויראלים: חצבת נגיפי הרפס, פפילומה (HPV)\n• RNA ויראלים: שפעת, HIV (Retrovirus — RNA→DNA), COVID-19\n\nחיסונים: מבוססים על אנטיגנים ויראליים לעורר זיכרון חיסוני",
            contentEn: "Viruses are subcellular infectious agents — obligate intracellular parasites:\n\n• Structure: nucleic acid (DNA/RNA) + protein capsid ± lipid envelope\n• Lytic cycle: attachment → entry → replication → assembly → lysis (kills cell)\n• Lysogenic cycle: viral DNA integrates into host chromosome (provirus/prophage)\n\nTypes by genome:\n• DNA viruses: herpesviruses, papillomavirus (HPV), adenoviruses\n• RNA viruses: influenza, HIV (retrovirus — RNA→DNA), SARS-CoV-2\n\nVaccines: based on viral antigens to stimulate immunological memory",
          },
          {
            slug: "immune-system",
            nameHe: "מערכת החיסון",
            nameEn: "Immune System",
            contentHe: "מערכת החיסון מגנה על הגוף מגורמים פתוגניים:\n\nחסינות מולדת (Innate):\n• מחסומים פיזיים: עור, ריר, ריסיות\n• תאים: פגוציטים (נויטרופילים, מקרופאגים), NK cells\n• דלקת: כיווץ כלי דם, גיוס לויקוציטים\n\nחסינות נרכשת (Adaptive):\n• לימפוציטים B: מייצרים נוגדנים (אימונוגלובולינים)\n• לימפוציטים T: T מסייעים (CD4+), T ציטוטוקסיים (CD8+)\n• זיכרון חיסוני: מגיב מהיר בחשיפה חוזרת — בסיס החיסונים\n• MHC/HLA: מציג אנטיגנים ל-T cells",
            contentEn: "The immune system defends against pathogens:\n\nInnate Immunity (non-specific, fast):\n• Physical barriers: skin, mucus, cilia\n• Cells: phagocytes (neutrophils, macrophages), NK cells\n• Inflammation: vasodilation, leukocyte recruitment\n\nAdaptive Immunity (specific, memory):\n• B lymphocytes: produce antibodies (immunoglobulins)\n• T lymphocytes: Helper T (CD4+), Cytotoxic T (CD8+)\n• Immunological memory: faster response on re-exposure — basis of vaccines\n• MHC/HLA: presents antigens to T cells",
          },
        ],
      },
      processes: { create: [] },
    },
  });

  // ─── 6. פיזיולוגיה ───────────────────────────────────────────────────────
  await prisma.topic.create({
    data: {
      slug: "physiology",
      nameHe: "פיזיולוגיה",
      nameEn: "Physiology",
      descHe: "תפקוד מערכות הגוף: עצבית, לבבית, ריאתית, הורמונלית",
      descEn: "Function of body systems: nervous, cardiovascular, respiratory, and endocrine",
      category: "physiology",
      icon: "🫀",
      subtopics: {
        create: [
          {
            slug: "action-potential",
            nameHe: "פוטנציאל פעולה",
            nameEn: "Action Potential",
            contentHe: "פוטנציאל פעולה הוא גל חשמלי עצבי — 'הכל-או-לא-כלום':\n\nשלבים:\n1. מנוחה: -70mV (Na⁺ גבוה בחוץ, K⁺ גבוה בפנים — משאבת Na/K)\n2. דה-פולריזציה: גירוי מפתח תעלות Na⁺; Na⁺ נכנס; עד +40mV\n3. רה-פולריזציה: Na⁺ נסגרות; K⁺ נפתחות; K⁺ יוצא\n4. היפרפולריזציה: -80mV; תקופת רפרקטוריות\n5. חזרה למנוחה\n\nהולכה: בנוירונים מיילינציים — הסבות רנבייה → הולכה קפיצית (מהירה)\nסינפסה: מתווכים כימיים (כגון אצטילכולין, דופמין) מעבירים האות לתא הבא",
            contentEn: "Action potential is an all-or-nothing electrical nerve signal:\n\nStages:\n1. Resting: -70mV (Na⁺ high outside, K⁺ high inside — Na/K pump)\n2. Depolarization: stimulus opens Na⁺ channels; Na⁺ rushes in; reaches +40mV\n3. Repolarization: Na⁺ channels close; K⁺ channels open; K⁺ exits\n4. Hyperpolarization: -80mV; refractory period\n5. Return to rest\n\nConduction: in myelinated neurons — Nodes of Ranvier → saltatory conduction (fast)\nSynapse: neurotransmitters (acetylcholine, dopamine) transmit the signal to the next cell",
          },
          {
            slug: "cardiovascular",
            nameHe: "מערכת הלב וכלי הדם",
            nameEn: "Cardiovascular System",
            contentHe: "הלב הוא שריר חלול המשמש משאבה כפולה:\n\n• מחזור קטן (ריאתי): חדר ימין → ריאות → אטריום שמאל (החמצנה)\n• מחזור גדול (מערכתי): חדר שמאל → גוף → אטריום ימין\n\nמחזור לבבי:\n• סיסטולה (התכווצות): ~0.3 שניות\n• דיאסטולה (הרפיה): ~0.5 שניות\n• קצב לב נורמלי: 60-100 פעימות/דקה\n\nוויסות: מערכת הולכה חשמלית (SA node → AV node → Bundle of His → Purkinje)\n\nלחץ דם: סיסטולי/דיאסטולי (נורמלי: 120/80 mmHg)",
            contentEn: "The heart is a hollow muscle serving as a double pump:\n\n• Pulmonary circuit: right ventricle → lungs → left atrium (oxygenation)\n• Systemic circuit: left ventricle → body → right atrium\n\nCardiac cycle:\n• Systole (contraction): ~0.3 seconds\n• Diastole (relaxation): ~0.5 seconds\n• Normal heart rate: 60-100 beats/minute\n\nRegulation: electrical conduction system (SA node → AV node → Bundle of His → Purkinje fibers)\n\nBlood pressure: systolic/diastolic (normal: 120/80 mmHg)",
          },
          {
            slug: "hormones-endocrine",
            nameHe: "מערכת הורמונלית (אנדוקרינית)",
            nameEn: "Endocrine System",
            contentHe: "הורמונים הם שליחים כימיים המשתחררים לדם:\n\nסוגי הורמונים:\n• סטרואידים (מכולסטרול): קורטיזול, אסטרוגן, טסטוסטרון — חודרים לגרעין, משפיעים על ביטוי גנים\n• פפטידים/חלבונים: אינסולין, גלוקגון, GH — נקשרים לקולטן ממברנה\n\nציר HPA: היפותלמוס → Pituitary → אדרנל — ציר לחץ\nוויסות סוכר בדם:\n• אינסולין (תאי β): מוריד סוכר, מקדם אחסון גליקוגן\n• גלוקגון (תאי α): מעלה סוכר, מפרק גליקוגן\n• סוכרת I: חסר אינסולין; סוכרת II: עמידות לאינסולין",
            contentEn: "Hormones are chemical messengers released into the bloodstream:\n\nHormone types:\n• Steroids (from cholesterol): cortisol, estrogen, testosterone — enter nucleus, affect gene expression\n• Peptides/proteins: insulin, glucagon, GH — bind membrane receptors\n\nHPA axis: Hypothalamus → Pituitary → Adrenal — stress axis\nBlood glucose regulation:\n• Insulin (β cells): lowers glucose, promotes glycogen storage\n• Glucagon (α cells): raises glucose, breaks down glycogen\n• Type I diabetes: insulin deficiency; Type II: insulin resistance",
          },
        ],
      },
      processes: { create: [] },
    },
  });

  const counts = {
    topics: await prisma.topic.count(),
    processes: await prisma.process.count(),
    steps: await prisma.processStep.count(),
    subtopics: await prisma.subtopic.count(),
  };

  console.log("✅ Seed complete!");
  console.log(`  Topics: ${counts.topics}`);
  console.log(`  Processes: ${counts.processes}`);
  console.log(`  Steps: ${counts.steps}`);
  console.log(`  Subtopics: ${counts.subtopics}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
