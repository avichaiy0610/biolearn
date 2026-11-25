import type { CoursePlan } from "./types";
import { L, soon, REUSE_NOTE_HE } from "./helpers";

// TAU 0455-3066 "מבוא לביואינפורמטיקה" — phase-1 mapping (2026-11-25), no insider input.
// Lectures: the course's detailed syllabus, 2026 sem. B (Burstein, Pupko, Nachman) — 13 lessons, exam 90% + exercise 10%.
// Lecturer fields (to verify from lab pages in phase 2): Burstein — machine learning on microbial genomes; Pupko — phylogenetics/alignment;
// Nachman — systems biology, networks, single-cell.

const pw = L("bi-pairwise"), blast = L("bi-blast"), msa = L("bi-msa"), seq = L("bi-sequencing"), net = L("bi-networks");
const sc = L("bi-singlecell"), stats = L("bi-stats-exploration"), cl = L("cb-clustering"), evid = L("ev-evidence");

const DETAILED = { labelHe: "הסילבוס המפורט (תשפ\"ו, סמסטר ב')", url: "https://www.ims.tau.ac.il/Tal/Scans/Syllabus_Download.aspx?kurs=04553066&syllabus=kr_syllabus_s20262_k00_v00.pdf" };
const IMS = { labelHe: "הסילבוס ב-IMS", url: "https://www.ims.tau.ac.il/Tal/Syllabus/Syllabus_L.aspx?course=0455306601&year=2026" };
const ML = soon("יחידה מלאה: למידה חישובית בביולוגיה — מסווגים, הערכת ביצועים וקיבוץ");

const LECTURES: CoursePlan["lectures"] = [
  { n: 1, titleHe: "מבוא לתחום; למידה חישובית — מסווגים", items: [ML] },
  { n: 2, titleHe: "למידה חישובית — מסווגים נוספים והערכת ביצועים", items: [ML, stats("multiple-testing")] },
  { n: 3, titleHe: "למידה חישובית — שיטות קיבוץ ומחקר לדוגמה", items: [cl(), stats("pca"), stats("clustering")] },
  { n: 4, titleHe: "ריצוף הדור הבא — שיטות ואלגוריתמים", items: [seq(), L("mol-pcr-sequencing")()] },
  { n: 5, titleHe: "מבוא לעימוד רצפים", items: [pw("homology"), pw("dot-plot"), pw("matrices")] },
  { n: 6, titleHe: "עימוד רצפים", items: [pw("global-local"), pw("gaps"), pw("dp"), L("cb-alignment")(), blast()] },
  { n: 7, titleHe: "עימוד רצפים מרובה ושחזור עצים פילוגנטיים", items: [msa("progressive"), msa("conservation"), msa("trees")] },
  { n: 8, titleHe: "שחזור עצים פילוגנטיים", items: [evid("trees"), evid("reconstruction"), soon("יחידה מלאה: שחזור עצים — UPGMA, Neighbor-Joining, פרסימוניה ונראות מרבית")] },
  { n: 9, titleHe: "רשתות בביולוגיה — מבנה גלובלי ותכונות", items: [net("graphs"), net("centrality"), net("hubs-modules"), L("cb-networks")()] },
  { n: 10, titleHe: "רשתות בביולוגיה — מוטיבי רשת ומעגלי משוב", items: [net("motifs"), L("sy-ffl-coherent")(), L("sy-ffl-incoherent")(), L("sy-response-feedback")()] },
  { n: 11, titleHe: "מוטיבי רשת; אנליזת ביטוי מתאים בודדים", items: [net("motifs"), sc("why"), sc("barcodes"), sc("qc")] },
  { n: 12, titleHe: "אנליזת ביטוי מתאים בודדים; אנליזת מיקרוסקופיה של תאים", items: [sc("pipeline"), sc("annotation"), L("cb-images")(), L("cb-segmentation-tracking")()] },
  { n: 13, titleHe: "חזרה על החומר", items: [] },
];

export const tauBioinformaticsPlan: CoursePlan = {
  courseSlug: "tau-bioinformatics",
  lectureOrder: {
    confidence: "official",
    noteHe: "לפי הסילבוס המפורט של הקורס (תשפ\"ו, סמסטר ב'): 13 שיעורים של שלושה מרצים. " + REUSE_NOTE_HE,
    links: [DETAILED, IMS],
  },
  tutorialOrder: null,
  schedule: "official",
  scheduleNoteHe: "לפי הסילבוס המפורט של הקורס (תשפ\"ו).",
  topics: [
    { titleHe: "למידה חישובית: מסווגים, הערכת ביצועים וקיבוץ", items: [ML, cl(), stats("pca"), stats("clustering")] },
    { titleHe: "ריצוף הדור הבא", items: LECTURES[3].items },
    { titleHe: "עימוד רצפים", items: [pw(), L("cb-alignment")(), blast(), msa()] },
    { titleHe: "שחזור עצים פילוגנטיים", items: LECTURES[7].items },
    { titleHe: "רשתות בביולוגיה: מבנה, מוטיבים ומעגלי משוב", items: [net(), L("cb-networks")(), L("sy-ffl-coherent")(), L("sy-ffl-incoherent")()] },
    { titleHe: "ביטוי בתאים בודדים ומיקרוסקופיה", items: [sc(), L("cb-images")(), L("cb-segmentation-tracking")()] },
  ],
  lectures: LECTURES,
  tutorials: [],
};
