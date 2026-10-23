import type { CoursePlan, PlanItem, PlanSession } from "./types";
import type { Lesson } from "../lessons/types";
import { zIntro } from "../lessons/technion-zoology/z-intro";
import { zProtists } from "../lessons/technion-zoology/z-protists";
import { zSpongesCnidarians } from "../lessons/technion-zoology/z-sponges-cnidarians";
import { zWorms } from "../lessons/technion-zoology/z-worms";
import { zArthropods } from "../lessons/technion-zoology/z-arthropods";
import { zHistology } from "../lessons/technion-zoology/z-histology";
import { zEmbryology } from "../lessons/technion-zoology/z-embryology";
import { zChordates } from "../lessons/technion-zoology/z-chordates";
import { zDigestive } from "../lessons/technion-zoology/z-digestive";
import { zUrogenital } from "../lessons/technion-zoology/z-urogenital";
import { zRespiration } from "../lessons/technion-zoology/z-respiration";
import { zNervousSenses } from "../lessons/technion-zoology/z-nervous-senses";
import { zIntegument } from "../lessons/technion-zoology/z-integument";

// Technion 01340111 "זואולוגיה" (Faculty of Biology) — built with the course-track-builder skill, no insider input.
// Evidence: the CURRENT portal paragraph (topics only) and the official book list; main book on disk: Hickman,
// Integrated Principles of Zoology 14e. Moodle closed to guests; staff 2026: Dr. Avner Wallach + Yoram Yerushalmi
// (2025: Prof. Zeev Arad + Yerushalmi). No detailed syllabus, exams or summaries found.
// Scope (step 5a), reviewed independently by Codex before writing (2026-10-23): invertebrates only as far as the
// portal names them (protists, sponges and cnidarians, the three worm grades, arthropods) — body plan and the
// systems that define each grade, no class-by-class survey; molluscs and echinoderms only as placements on the tree.
// Chordates: the basic features, amphioxus as the worked example (filter feeding, urogenital, circulation), then the
// comparative vertebrate systems the portal names (digestion, reproduction/urinary, respiration with a short
// circulation section, CNS and senses), histology basics, embryology principles incl. body axes, and the integument.
// NOT written: musculoskeletal and endocrine systems (not in the paragraph), aortic-arch detail, the books' class surveys.
// Order: Codex's suggestion — the portal's own order with histology and embryology moved before the vertebrate
// systems that rely on them. No tutorials listed.

const sec = (l: Lesson, ...ids: string[]): PlanItem[] => (ids.length ? ids.map((section) => ({ kind: "lesson" as const, slug: l.slug, section })) : [{ kind: "lesson", slug: l.slug }]);
const probs = (l: Lesson): PlanItem[] => (l.workedProblems ?? []).map((w) => ({ kind: "lesson" as const, slug: l.slug, problem: w.id }));

const PORTAL = { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134111" };

const LECTURES: { titleHe: string; items: PlanItem[]; practice: PlanItem[] }[] = [
  { titleHe: "מבוא לעולם החי: תוכניות גוף", items: sec(zIntro), practice: probs(zIntro) },
  { titleHe: "חד-תאיים", items: sec(zProtists), practice: probs(zProtists) },
  { titleHe: "ספוגים ונבובים", items: sec(zSpongesCnidarians), practice: probs(zSpongesCnidarians) },
  { titleHe: "תולעים שטוחות, עגולות וטבעתיות", items: sec(zWorms), practice: probs(zWorms) },
  { titleHe: "פרוקי רגליים", items: sec(zArthropods), practice: probs(zArthropods) },
  { titleHe: "יסודות ההיסטולוגיה", items: sec(zHistology), practice: probs(zHistology) },
  { titleHe: "התפתחות עוברית וצירי הגוף", items: sec(zEmbryology), practice: probs(zEmbryology) },
  { titleHe: "מיתרניים וחולייתנים; האמפיוקסוס", items: sec(zChordates), practice: probs(zChordates) },
  { titleHe: "מערכת העיכול", items: sec(zDigestive), practice: probs(zDigestive) },
  { titleHe: "מערכות המין והשתן", items: sec(zUrogenital), practice: probs(zUrogenital) },
  { titleHe: "נשימה ומחזור הדם", items: sec(zRespiration), practice: probs(zRespiration) },
  { titleHe: "מערכת העצבים המרכזית והחושים", items: sec(zNervousSenses), practice: probs(zNervousSenses) },
  { titleHe: "האינטגומנט: קשקשים, נוצות ושערות", items: sec(zIntegument), practice: probs(zIntegument) },
];

export const technionZoologyPlan: CoursePlan = {
  courseSlug: "technion-zoology",
  lectureOrder: {
    confidence: "syllabus",
    noteHe: "אין לוח הרצאות ציבורי (אתר הקורס במודל סגור). הסדר כאן הוא סדר הנושאים בסילבוס הרשמי, כשהיסטולוגיה והתפתחות עוברית מוקדמות לפני מערכות החולייתנים שנשענות עליהן. הפירוט לתת-נושאים — לפי ספר הקורס (Hickman).",
    links: [PORTAL],
  },
  tutorialOrder: null,
  schedule: "suggested",
  scheduleNoteHe: "הנושאים לפי הסילבוס בפורטל הטכניון; כל נושא מפורט לפי הפרקים המקבילים בספר הקורס (Hickman, Integrated Principles of Zoology). בקורס אין תרגולים רשומים — התרגילים הפתורים כאן לתרגול עצמי.",
  topics: [
    { titleHe: "מבוא לעולם החי", items: sec(zIntro) },
    { titleHe: "חסרי חוליות — חד-תאיים", items: sec(zProtists) },
    { titleHe: "ספוגים ונבובים", items: sec(zSpongesCnidarians) },
    { titleHe: "תולעים שטוחות, עגולות וטבעתיות", items: sec(zWorms) },
    { titleHe: "פרוקי רגליים", items: sec(zArthropods) },
    { titleHe: "מיתרנים וחוליתנים — מוצא ותכונות יסוד", items: sec(zChordates, "features", "tunicates", "vertebrates") },
    { titleHe: "התפתחות צירי הגוף", items: sec(zEmbryology, "axes") },
    { titleHe: "האמפיוקסוס כדוגמא: סינון והובלת המזון, מערכות מין ושתן, מערכת הדם", items: sec(zChordates, "amphioxus", "feeding", "systems") },
    { titleHe: "יסודות ההיסטולוגיה (טיפוסי תאים והתארגנות לרקמות)", items: sec(zHistology) },
    { titleHe: "אבולוציה וקשרי מבנה-תפקוד: מערכת העיכול", items: sec(zDigestive) },
    { titleHe: "אבולוציה וקשרי מבנה-תפקוד: המין והשתן", items: sec(zUrogenital) },
    { titleHe: "אבולוציה וקשרי מבנה-תפקוד: הנשימה", items: sec(zRespiration) },
    { titleHe: "מערכת העצבים המרכזית והחושים", items: sec(zNervousSenses) },
    { titleHe: "עקרונות ההתפתחות העוברית", items: sec(zEmbryology, "fertilization", "cleavage", "gastrulation", "neurulation", "amniote") },
    { titleHe: "אבולוציה של האינטגומנט ותוצריו — קשקשים, שערות ונוצות", items: sec(zIntegument) },
  ],
  lectures: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.items })),
  tutorials: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.practice })).filter((t) => t.items.length > 0),
};
