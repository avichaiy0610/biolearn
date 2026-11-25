import type { CoursePlan } from "./types";
import { L, REUSE_NOTE_HE, sessionsFromTopics } from "./helpers";

// TAU 0455-1512 "מבוא לביולוגיה א'" — phase-1 mapping (2026-11-25), no insider input.
// Topics: the official IMS syllabus (2026), in its own order. The detailed syllabus is "for course students only"
// and no older detailed file was found (IMS 2023-2027 pages, yedion 2017-2020: topic paragraphs only).
// Textbook: Campbell, Biology — A Global Approach 10e (units 1-3). Assessment: final exam (IMS 2026; 2019/20 also
// an online-exercise "protective" grade). Exams 2016-2022 sit in the public student drive (scope check: phase 2).
// Content reuse: the Technion "Biology 1" units cover the same intro level; deeper Technion units are linked by section.

const intro = L("b1-intro"), prot = L("b1-proteins-enzymes"), cells = L("b1-cells"), euk = L("b1-eukaryotic-cell");
const mem = L("b1-membranes"), en = L("b1-energy"), met = L("b1-metabolism"), dna = L("b1-dna"), gx = L("b1-gene-expression");
const div = L("b1-cell-division"), sig = L("cell-signaling-principles"), ps = L("met-photosynthesis");
const carbs = L("carbs-lipids"), na = L("mol-nucleic-acids"), mp = L("mendel-probability"), ct = L("chromosomal-theory");
const da = L("dominance-alleles"), lm = L("linkage-mapping"), sd = L("sex-determination"), cc = L("cell-cycle-control");

const TOPICS: CoursePlan["topics"] = [
    { titleHe: "עקרונות הכימיה של הביולוגיה והמאקרומולקולות", items: [intro(), mem("water"), prot(), carbs(), na(), dna("nucleic-acids")] },
    { titleHe: "מבנה התא", items: [cells(), euk(), mem(), L("b1-science")("microscopy"), L("b1-science")("fractionation")] },
    { titleHe: "המרת אנרגיה במיטוכונדריה ובכלורופלסטים", items: [en(), met(), ps("overview"), ps("light"), ps("z-scheme"), ps("calvin")] },
    { titleHe: "תקשורת תוך-תאית", items: [sig(), L("cell-gpcr")(), L("cell-rtk")()] },
    { titleHe: "מחזור חלוקת התא", items: [div(), cc("phases"), cc("cdk")] },
    { titleHe: "גנטיקה מנדלית", items: [mp(), ct(), da(), sd("sex-linkage"), lm("intro")] },
    { titleHe: "שכפול, שעתוק ותרגום", items: [dna(), gx()] },
  ];

const IMS = { labelHe: "הסילבוס ב-IMS (תשפ\"ז)", url: "https://www.ims.tau.ac.il/Tal/Syllabus/Syllabus_L.aspx?course=0455151201&year=2026" };

export const tauBioIntroAPlan: CoursePlan = {
  courseSlug: "tau-bio-intro-a",
  lectureOrder: {
    confidence: "syllabus",
    noteHe: "אין לוח הרצאות פומבי (הסילבוס המפורט מפורסם לתלמידי הקורס בלבד). הסדר כאן הוא סדר הנושאים בסילבוס הרשמי, שהוא גם סדר הפרקים בספר הקורס (Campbell). " + REUSE_NOTE_HE,
    links: [IMS],
  },
  tutorialOrder: null,
  schedule: "suggested",
  scheduleNoteHe: "לפי סדר הנושאים בסילבוס הרשמי (IMS, תשפ\"ז); אין לוח הרצאות פומבי.",
  topics: TOPICS,
  lectures: sessionsFromTopics(TOPICS), // no public schedule: one session per official topic
  tutorials: [],
};

