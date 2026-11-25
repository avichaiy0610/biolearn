import type { CoursePlan } from "./types";
import { L, REUSE_NOTE_HE, sessionsFromTopics } from "./helpers";

// TAU 0455-1513 "מבוא לביולוגיה ב'" — phase-1 mapping (2026-11-25), no insider input.
// Topics: the official IMS syllabus (2026) names three parts — evolution theory, the diversity of life
// (prokaryotes, animals) and the plant world (structure ↔ function). The 2019/20 yedion lists the same course in
// more detail (viruses, DNA technology, natural selection, population genetics, species, prokaryotes, protists,
// invertebrates, vertebrates, plant science); 2026 no longer names viruses or DNA technology, so they are left out.
// Textbook: Campbell, Biology — A Global Approach 10e. Assessment: final exam. 112 drive files incl. exams since 2023
// (scope check: phase 2).

const sel = L("ev-selection"), drift = L("ev-drift"), spec = L("ev-speciation"), evid = L("ev-evidence");
const tol = L("ev-tree-of-life"), eukO = L("ev-eukaryotes"), anim = L("ev-animals");
const zi = L("z-intro"), pr = L("z-protists"), sc = L("z-sponges-cnidarians"), wo = L("z-worms"), ar = L("z-arthropods"), ch = L("z-chordates");
const pc = L("pp-plant-cell"), wb = L("pp-water-balance"), dev = L("pp-development");

const TOPICS: CoursePlan["topics"] = [
  { titleHe: "תאוריית האבולוציה: ברירה, גנטיקה של אוכלוסיות ומינים", items: [evid(), sel(), drift(), L("ev-selection-forces")(), spec()] },
  { titleHe: "פילוגנזה ועץ החיים", items: [evid("trees"), evid("reconstruction"), L("ev-origins")(), tol(), eukO()] },
  { titleHe: "המגוון הביולוגי: פרוקריוטים", items: [tol("bacteria-archaea"), tol("diversification"), L("mv-cell-envelope")(), L("mv-metabolic-diversity")("classes"), L("mv-diversity")()] },
  { titleHe: "המגוון הביולוגי: חד-תאיים אאוקריוטים", items: [eukO("diversity"), pr()] },
  { titleHe: "המגוון הביולוגי: בעלי חיים — חסרי חוליות", items: [zi(), anim("origin"), anim("cambrian"), anim("body-plans"), sc(), wo(), ar()] },
  { titleHe: "המגוון הביולוגי: בעלי חיים — חולייתנים", items: [ch(), anim("vertebrates"), L("ev-human")()] },
  { titleHe: "עולם הצומח: מגוון ואבולוציה של הצמחים", items: [L("sh-plant-diversity")()] },
  { titleHe: "עולם הצומח: מבנה ותפקוד", items: [pc(), wb(), dev(), L("pp-light-reactions")(), L("pp-auxin")(), L("pp-flowering")(), L("sh-mineral-phloem")()] },
];

const IMS = { labelHe: "הסילבוס ב-IMS (תשפ\"ז)", url: "https://www.ims.tau.ac.il/Tal/Syllabus/Syllabus_L.aspx?course=0455151301&year=2026" };
const YEDION = { labelHe: "הידיעון תש\"ף", url: "https://lifesci.tau.ac.il/yedion/2019-20/course04551513" };

export const tauBioIntroBPlan: CoursePlan = {
  courseSlug: "tau-bio-intro-b",
  lectureOrder: {
    confidence: "syllabus",
    noteHe: "אין לוח הרצאות פומבי. הסדר הוא סדר שלושת חלקי הקורס בסילבוס הרשמי (אבולוציה ← מגוון ← עולם הצומח), והפירוט לפי רשימת הנושאים בידיעון תש\"ף. " + REUSE_NOTE_HE,
    links: [IMS, YEDION],
  },
  tutorialOrder: null,
  schedule: "suggested",
  scheduleNoteHe: "לפי סדר חלקי הקורס בסילבוס הרשמי (IMS, תשפ\"ז); אין לוח הרצאות פומבי.",
  topics: TOPICS,
  lectures: sessionsFromTopics(TOPICS),
  tutorials: [],
};
