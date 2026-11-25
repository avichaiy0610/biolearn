import type { CoursePlan } from "./types";
import { L, REUSE_NOTE_HE, sessionsFromTopics, soon } from "./helpers";

/* Hebrew University, phase-1 mapping (2026-11-25), no insider input. Every HUJI syllabus in the shnaton (2027,
   synced) is a topic list without dates or lesson numbers, so the lectures view is one session per official topic, in
   the syllabus order (confidence "syllabus"). Grading and staff are in the synced record. */
export const hujiPlan = (courseSlug: string, code: string, topics: CoursePlan["topics"], extraHe = ""): CoursePlan => ({
  courseSlug,
  lectureOrder: {
    confidence: "syllabus",
    noteHe: `אין לוח הרצאות פומבי. הסדר הוא סדר הנושאים בסילבוס הרשמי בשנתון (תשפ"ז). ${extraHe}` + REUSE_NOTE_HE,
    links: [{ labelHe: "הסילבוס בשנתון (תשפ\"ז)", url: `https://shnaton.huji.ac.il/course/${code}/syllabus/year/2027` }],
  },
  tutorialOrder: null,
  schedule: "suggested",
  scheduleNoteHe: "לפי סדר הנושאים בסילבוס הרשמי (שנתון תשפ\"ז); אין לוח הרצאות פומבי.",
  topics,
  lectures: sessionsFromTopics(topics),
  tutorials: [],
});

/* Gaps that recur across universities — one title each, so the cross-university gap table groups them. */
export const GAP = {
  homeostasis: L("sh-homeostasis-autonomic")(),
  heart: L("sh-heart")(),
  vessels: L("sh-vessels")(),
  lung: L("sh-respiration")(),
  digestion: soon("יחידה מלאה: מערכת העיכול — עיכול וספיגה"),
  somatosensory: L("sh-somatosensory")(),
  motor: L("sh-motor-control")(),
  plantDiversity: L("sh-plant-diversity")(),
  mineral: L("sh-mineral-phloem")(),
  plantReproduction: soon("יחידה מלאה: רבייה בצמחים — גמטופיטים, האבקה, הפריה כפולה ופירות"),
  fungi: soon("יחידה מלאה: פטריות — ביולוגיה של התא ומחלות"),
  quantitative: L("sh-quantitative-genetics")(),
  sexualSelection: L("sh-sexual-selection")(),
  gametogenesis: soon("יחידה מלאה: גמטוגנזה והפריה"),
  aging: soon("יחידה מלאה: הזדקנות — מנגנונים ומודלים גנטיים"),
  transgenic: soon("סעיף: עכברים טרנסגניים ועכברי knockout"),
  parasitology: soon("יחידה מלאה: פרזיטולוגיה — פלסמודיום, טריפנוזומות ותולעים טפיליות"),
  behavioralEcology: soon("יחידה מלאה: אקולוגיה התנהגותית — חיפוש מזון, טריטוריה וברירה זוויגית"),
};
