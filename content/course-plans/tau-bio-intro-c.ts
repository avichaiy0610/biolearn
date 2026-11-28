import type { CoursePlan } from "./types";
import { L, REUSE_NOTE_HE } from "./helpers";

// TAU 0455-1514 "מבוא לביולוגיה ג'" — phase-1 mapping (2026-11-25), no insider input.
// Lectures: the course's detailed syllabus for 2026 sem. B (Bernshtein, Domer, Scharf, Yovel) — 13 lessons,
// "the order of lectures may change". Grading: final exam 90%, four quizzes 10%.
// Textbook: Campbell, Biology — A Global Approach 10e, chapters 40-56.

const hi = L("z-histology"), dig = L("z-digestive"), resp = L("z-respiration"), uro = L("z-urogenital"), emb = L("z-embryology");
const enI = L("en-intro"), enR = L("en-reproduction"), imI = L("im-intro"), imN = L("im-innate"), imA = L("im-antibodies"), imT = L("im-t-cells");
const mp = L("ph-membrane-potential"), ap = L("ph-action-potential"), syn = L("ph-synapse"), ns = L("ph-nervous-system");
const sen = L("nb-anatomy-senses"), zns = L("z-nervous-senses"), sk = L("ph-skeletal-muscle");
const ecE = L("ec-environment"), ecB = L("ec-biomes"), pg = L("ec-population-growth"), prg = L("ec-population-regulation");
const comp = L("ec-competition"), pred = L("ec-predation"), div = L("ec-diversity"), succ = L("ec-succession");
const ef = L("ec-energy-flow"), bgc = L("ec-biogeochemical"), hum = L("ec-human-impact");

const DETAILED = { labelHe: "הסילבוס המפורט (תשפ\"ו, סמסטר ב')", url: "https://www.ims.tau.ac.il/Tal/Scans/Syllabus_Download.aspx?kurs=04551514&syllabus=kr_syllabus_s20262_k00_v00.pdf" };
const IMS = { labelHe: "הסילבוס ב-IMS", url: "https://www.ims.tau.ac.il/Tal/Syllabus/Syllabus_L.aspx?course=0455151401&year=2026" };

const LECTURES: CoursePlan["lectures"] = [
  { n: 1, titleHe: "צורה, תפקוד ותרמורגולציה; אותות כימיים בבעלי חיים", items: [hi(), L("sh-homeostasis-autonomic")(), enI()] },
  { n: 2, titleHe: "תזונה ומאזן אנרגיה; נשימה ומחזור הדם", items: [dig(), resp(), L("sh-heart")(), L("sh-vessels")()] },
  { n: 3, titleHe: "מערכות הפרשה; מערכות רבייה", items: [uro(), L("ph-kidney-filtration")(), L("ph-kidney-tubules")(), enR()] },
  { n: 4, titleHe: "התפתחות בבעלי חיים", items: [emb(), L("dv-principles")()] },
  { n: 5, titleHe: "הגנות מפני זיהום (א): חסינות מולדת", items: [imI(), imN()] },
  { n: 6, titleHe: "הגנות מפני זיהום (ב): חסינות נרכשת", items: [imA(), imT(), L("im-infection")("vaccines")] },
  { n: 7, titleHe: "אותות חשמליים בבעלי חיים", items: [mp(), ap(), syn()] },
  { n: 8, titleHe: "בקרה עצבית", items: [ns(), zns("brain"), zns("spinal-cord"), sen("cortex")] },
  { n: 9, titleHe: "חושים ותנועה", items: [sen("senses"), zns("eye"), zns("hair-cells"), sk()] },
  { n: 10, titleHe: "מבוא לאקולוגיה; אקולוגיה של אוכלוסיות ומהלכי חיים", items: [ecE(), ecB(), pg(), prg()] },
  { n: 11, titleHe: "מגוון ביולוגי וחברות", items: [comp(), pred(), div(), succ()] },
  { n: 12, titleHe: "זרימת אנרגיה ומחזורי חומרים; שמירת טבע ואקולוגיה גלובלית", items: [ef(), bgc(), hum()] },
  { n: 13, titleHe: "אקולוגיה התנהגותית", items: [L("ev-social")(), L("sh-behavioral-ecology")()] },
];

export const tauBioIntroCPlan: CoursePlan = {
  courseSlug: "tau-bio-intro-c",
  lectureOrder: {
    confidence: "official",
    noteHe: "לפי הסילבוס המפורט של הקורס (תשפ\"ו, סמסטר ב'): 13 שיעורים. בסילבוס נכתב שסדר ההרצאות עשוי להשתנות. " + REUSE_NOTE_HE,
    links: [DETAILED, IMS],
  },
  tutorialOrder: null,
  schedule: "official",
  scheduleNoteHe: "לפי הסילבוס המפורט של הקורס (תשפ\"ו).",
  topics: [
    { titleHe: "מבנה, צורה ותרמורגולציה", items: LECTURES[0].items.slice(0, 2) },
    { titleHe: "סיגנלים כימיים בבעלי חיים", items: [enI(), L("en-receptors")(), L("en-control")()] },
    { titleHe: "תזונה ומאזן אנרגיה", items: [dig()] },
    { titleHe: "נשימה וחילוף חומרים", items: [resp(), LECTURES[1].items[2]] },
    { titleHe: "מערכות הפרשה", items: [uro("function"), uro("kidney-series"), uro("nitrogen"), L("ph-kidney-filtration")(), L("ph-kidney-tubules")()] },
    { titleHe: "מערכות רבייה", items: [uro("reproductive"), enR()] },
    { titleHe: "התפתחות", items: LECTURES[3].items },
    { titleHe: "אימונולוגיה", items: [...LECTURES[4].items, ...LECTURES[5].items] },
    { titleHe: "סיגנלים חשמליים ובקרה נוירונלית", items: [...LECTURES[6].items, ...LECTURES[7].items] },
    { titleHe: "מערכת חושים ותנועה בבעלי חיים", items: LECTURES[8].items },
    { titleHe: "מבוא לאקולוגיה", items: [ecE(), ecB()] },
    { titleHe: "התנהגות בעלי חיים", items: LECTURES[12].items },
    { titleHe: "אקולוגיה של אוכלוסיות", items: [pg(), prg()] },
    { titleHe: "אקולוגיה של חברות", items: [comp(), pred(), div(), succ()] },
    { titleHe: "מעגלים ביוכימיים", items: [ef(), bgc()] },
    { titleHe: "שמירת טבע ואקולוגיה גלובלית", items: [hum()] },
  ],
  lectures: LECTURES,
  tutorials: [],
};
