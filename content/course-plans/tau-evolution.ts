import type { CoursePlan } from "./types";
import { L, soon, REUSE_NOTE_HE } from "./helpers";

// TAU 0455-2536 "אבולוציה" — phase-1 mapping (2026-11-25), no insider input.
// Topics: the official IMS syllabus (2026), 12 topics. Lectures: the course's detailed syllabus of 2025 sem. B
// (Chiat, Hadany, Ram; TA Ben-Nun) — 11 lessons, exam 100%. The PDF does not name its course code; it was downloaded
// from the IMS page of 0455-2536 (kurs=04552536) and read visually 2026-11-25. The 2026 detailed syllabus is not
// published yet, so the order is "official-past". 2026 adds two topics the 2025 table lacks: the evolution of sex and
// sexual selection.

const evid = L("ev-evidence"), sel = L("ev-selection"), drift = L("ev-drift"), sf = L("ev-selection-forces");
const ps = L("ev-population-structure"), ms = L("ev-measuring-selection"), spec = L("ev-speciation"), soc = L("ev-social");
const gs = L("ev-genetic-systems"), anim = L("ev-animals");

const DETAILED = { labelHe: "הסילבוס המפורט (תשפ\"ה)", url: "https://www.ims.tau.ac.il/Tal/Scans/Syllabus_Download.aspx?kurs=04552536&syllabus=kr_syllabus_s20252_k00_v00.pdf" };
const IMS = { labelHe: "הסילבוס ב-IMS (תשפ\"ז)", url: "https://www.ims.tau.ac.il/Tal/Syllabus/Syllabus_L.aspx?course=0455253601&year=2026" };

export const tauEvolutionPlan: CoursePlan = {
  courseSlug: "tau-evolution",
  lectureOrder: {
    confidence: "official-past",
    noteHe: "לפי הסילבוס המפורט של הקורס משנת תשפ\"ה (כיאט, הדני ורם): 11 שיעורים. בסילבוס הרשמי של תשפ\"ז נוספו שני נושאים — האבולוציה של הזוויגיות וברירה זוויגית — והם מופיעים כאן בסוף. " + REUSE_NOTE_HE,
    links: [DETAILED, IMS],
  },
  tutorialOrder: null,
  schedule: "official",
  scheduleNoteHe: "לפי הסילבוס המפורט של הקורס (תשפ\"ה).",
  topics: [
    { titleHe: "מבוא: מהי אבולוציה; תולדות התפתחות הרעיון", items: [evid("claims"), evid("history")] },
    { titleHe: "העדויות לקיומה של האבולוציה", items: [evid("fossils"), evid("homology"), evid("molecular"), evid("observed")] },
    { titleHe: "מנגנון הברירה הטבעית", items: [sel("conditions"), sel("variation"), ms()] },
    { titleHe: "גנטיקה של אוכלוסיות ומודלים של סלקציה", items: [sel("hardy-weinberg"), sel("selection-model"), sf(), ps()] },
    { titleHe: "תהליכים אקראיים והתאוריה הניטרליסטית", items: [drift()] },
    { titleHe: "ממודלים של שני גנים ועד גנטיקה כמותית", items: [sel("quantitative"), ms("response"), soon("יחידה מלאה: שני לוקוסים — אי-שיווי משקל בתאחיזה — וגנטיקה כמותית")] },
    { titleHe: "סיסטמטיקה ושחזור עצים פילוגנטיים", items: [evid("trees"), evid("reconstruction"), L("ev-tree-of-life")("rrna-tree")] },
    { titleHe: "ספציאציה והיווצרות מינים חדשים", items: [spec(), anim("extinctions")] },
    { titleHe: "חקר אדפטציות", items: [ms("dnds"), ms("sweep"), soon("יחידה מלאה: חקר התאמות — השיטה ההשוואתית ובדיקת השערות אדפטציה")] },
    { titleHe: "רמות הפעולה של הברירה הטבעית; האבולוציה של אלטרואיזם", items: [soc()] },
    { titleHe: "בעיית האבולוציה של ה-Sex", items: [gs("cost-of-sex"), gs("why-sex"), gs("y-chromosome"), gs("consequences")] },
    { titleHe: "ברירה זוויגית", items: [sel("other-forms"), soon("יחידה מלאה: ברירה זוויגית")] },
  ],
  lectures: [
    { n: 1, titleHe: "מבוא: מהי אבולוציה, התפתחות הרעיון, בעיות ראשונות ופתרונן", items: [evid("claims"), evid("history")] },
    { n: 2, titleHe: "העדויות לאבולוציה — התפתחות המינים ממוצא משותף", items: [evid("fossils"), evid("homology"), evid("molecular"), evid("observed")] },
    { n: 3, titleHe: "סיסטמטיקה ושחזור עצים פילוגנטיים", items: [evid("trees"), evid("reconstruction"), L("ev-tree-of-life")("rrna-tree")] },
    { n: 4, titleHe: "מנגנון הברירה הטבעית ודרכי פעולתו", items: [sel("conditions"), sel("variation"), ms("direct"), ms("competition")] },
    { n: 5, titleHe: "גנטיקה של אוכלוסיות ומודלים של ברירה טבעית", items: [sel("hardy-weinberg"), sel("selection-model"), sf("balancing"), sf("mutation-selection"), sf("cline")] },
    { n: 6, titleHe: "גנטיקה של אוכלוסיות — תרגול", items: [ps(), soon("תרגילים פתורים: הרדי-ויינברג ומודלי ברירה")] },
    { n: 7, titleHe: "תהליכים אקראיים והתאוריה הניטרלית", items: [drift(), sf("selection-drift")] },
    { n: 8, titleHe: "ממודלים של שני גנים לגנטיקה כמותית", items: [sel("quantitative"), ms("response"), soon("יחידה מלאה: שני לוקוסים — אי-שיווי משקל בתאחיזה — וגנטיקה כמותית")] },
    { n: 9, titleHe: "היווצרות מינים ותהליכי הכחדה", items: [spec(), anim("extinctions")] },
    { n: 10, titleHe: "חקר התאמות — השימוש בתאוריה האבולוציונית במחקר הביולוגי", items: [ms("dnds"), ms("sweep"), soon("יחידה מלאה: חקר התאמות — השיטה ההשוואתית ובדיקת השערות אדפטציה")] },
    { n: 11, titleHe: "רמות הפעולה של הברירה הטבעית: גן, פרט, אוכלוסייה", items: [soc()] },
    { n: 12, titleHe: "האבולוציה של ה-Sex (נוסף בסילבוס תשפ\"ז)", items: [gs("cost-of-sex"), gs("why-sex"), gs("y-chromosome"), gs("consequences")] },
    { n: 13, titleHe: "ברירה זוויגית (נוסף בסילבוס תשפ\"ז)", items: [sel("other-forms"), soon("יחידה מלאה: ברירה זוויגית")] },
  ],
  tutorials: [],
};
