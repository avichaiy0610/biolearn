import type { CoursePlan } from "./types";
import { L, soon, REUSE_NOTE_HE } from "./helpers";

// TAU 0455-1809 "אקולוגיה" — phase-1 mapping (2026-11-25), no insider input.
// Lectures: the course's detailed syllabus, 2026 sem. B (Sternberg, Belmaker, Abelson) — 13 lessons.
// Grading: quizzes / peer-graded summary exercises 30%, final exam 70%. Reading: Bowman, Hacker & Cain, Ecology,
// plus papers that are part of the exam material.

const env = L("ec-environment"), bio = L("ec-biomes"), ad = L("ec-adaptations"), pg = L("ec-population-growth");
const prg = L("ec-population-regulation"), comp = L("ec-competition"), pred = L("ec-predation"), div = L("ec-diversity");
const succ = L("ec-succession"), ef = L("ec-energy-flow"), bgc = L("ec-biogeochemical"), hum = L("ec-human-impact");

const DETAILED = { labelHe: "הסילבוס המפורט (תשפ\"ו, סמסטר ב')", url: "https://www.ims.tau.ac.il/Tal/Scans/Syllabus_Download.aspx?kurs=04551809&syllabus=kr_syllabus_s20262_k00_v00.pdf" };
const IMS = { labelHe: "הסילבוס ב-IMS", url: "https://www.ims.tau.ac.il/Tal/Syllabus/Syllabus_L.aspx?course=0455180901&year=2026" };

const LECTURES: CoursePlan["lectures"] = [
  { n: 1, titleHe: "מבוא", items: [env("what"), env("levels"), env("conditions-resources")] },
  { n: 2, titleHe: "הביוספרה", items: [env("climate"), bio()] },
  { n: 3, titleHe: "התמודדות עם סביבה משתנה", items: [ad()] },
  { n: 4, titleHe: "אבולוציה ואקולוגיה", items: [env("niche"), env("dispersal"), L("ev-selection")("conditions")] },
  { n: 5, titleHe: "מהלכי חיים", items: [prg("life-history"), pg("life-tables"), pg("survivorship")] },
  { n: 6, titleHe: "אוכלוסיות", items: [pg("bookkeeping"), pg("dispersion"), pg("exponential"), pg("logistic"), pg("age-structure"), prg("density-dependence"), prg("fluctuations"), prg("metapopulations")] },
  { n: 7, titleHe: "תחרות", items: [prg("intraspecific"), comp()] },
  { n: 8, titleHe: "אינטראקציות נוספות", items: [pred(), L("mv-ecology")("symbiosis"), L("sh-mutualism-parasitism")()] },
  { n: 9, titleHe: "חברות I", items: [div("measuring"), div("local"), pred("cascades")] },
  { n: 10, titleHe: "חברות II", items: [succ(), div("function")] },
  { n: 11, titleHe: "זרימת אנרגיה ומארגי מזון", items: [ef(), bgc()] },
  { n: 12, titleHe: "אקולוגיה מרחבית ושמירת טבע", items: [div("species-area"), div("latitude"), div("islands"), hum("habitat"), hum("endangered"), hum("conservation"), soon("יחידה מלאה: אקולוגיית נוף")] },
  { n: 13, titleHe: "אקולוגיה של שינויים גלובליים", items: [hum("crisis"), hum("footprint"), hum("climate"), hum("invasive"), hum("overharvest"), hum("pollution")] },
];

export const tauEcologyPlan: CoursePlan = {
  courseSlug: "tau-ecology",
  lectureOrder: {
    confidence: "official",
    noteHe: "לפי הסילבוס המפורט של הקורס (תשפ\"ו, סמסטר ב'): 13 שיעורים. " + REUSE_NOTE_HE,
    links: [DETAILED, IMS],
  },
  tutorialOrder: null,
  schedule: "official",
  scheduleNoteHe: "לפי הסילבוס המפורט של הקורס (תשפ\"ו).",
  topics: LECTURES.map(({ titleHe, items }) => ({ titleHe, items })),
  lectures: LECTURES,
  tutorials: [],
};
