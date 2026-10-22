import type { CoursePlan, PlanItem, PlanSession } from "./types";
import type { Lesson } from "../lessons/types";
import { ppPlantCell } from "../lessons/technion-plant-physiology/pp-plant-cell";
import { ppResearchTools } from "../lessons/technion-plant-physiology/pp-research-tools";
import { ppWaterCells } from "../lessons/technion-plant-physiology/pp-water-cells";
import { ppWaterBalance } from "../lessons/technion-plant-physiology/pp-water-balance";
import { ppCellGrowth } from "../lessons/technion-plant-physiology/pp-cell-growth";
import { ppDevelopment } from "../lessons/technion-plant-physiology/pp-development";
import { ppAuxin } from "../lessons/technion-plant-physiology/pp-auxin";
import { ppCytokininGibberellin } from "../lessons/technion-plant-physiology/pp-cytokinin-gibberellin";
import { ppAbaEthylene } from "../lessons/technion-plant-physiology/pp-aba-ethylene";
import { ppLightReactions } from "../lessons/technion-plant-physiology/pp-light-reactions";
import { ppCalvin } from "../lessons/technion-plant-physiology/pp-calvin";
import { ppPhotoreceptors } from "../lessons/technion-plant-physiology/pp-photoreceptors";
import { ppTropisms } from "../lessons/technion-plant-physiology/pp-tropisms";
import { ppCircadianPhotoperiod } from "../lessons/technion-plant-physiology/pp-circadian-photoperiod";
import { ppFlowering } from "../lessons/technion-plant-physiology/pp-flowering";
import { ppBioticStress } from "../lessons/technion-plant-physiology/pp-biotic-stress";

// Technion 01340040 "פיזיולוגיה מוליקולרית של הצמח" — built with the course-track-builder skill (step 5a), no insider
// input. Topics: the CURRENT syllabus on the Technion students portal — detailed enough to bound the scope by itself
// (it names each hormone, the light reactions and the Calvin cycle, light quality, tropism, photoperiodism, the
// circadian clock, flowering and biotic stress). Books (official list): Taiz, Plant Physiology and Development
// (7th ed. in textbooks/) and Schumann, Essential Plant Pathology (not available — the biotic-stress unit is checked
// against Taiz ch. 24). Consensus of equivalent courses that use Taiz: HUJI 71015 (water relations incl. the stoma,
// photosynthesis, photoreceptors, hormones) and 71963 (development, hormones, photomorphogenesis, water relations,
// photosynthesis); Academia Sinica Advanced Plant Biology (Taiz 7e) adds circadian rhythm and biotic stress, as
// here. NOT in the syllabus, so not written: mineral nutrition, solute transport and phloem translocation,
// respiration, nitrogen/sulfur assimilation, abiotic stress, embryogenesis, secondary growth, senescence,
// brassinosteroids/strigolactones as units. Parallel 134118 ("no extra credit", same faculty) has no syllabus.
// Moodle 2026 closed to guests (staff: סיגל סבלדי, אורי ארליכמן; 2025 also שמעון גפשטין). Lecture order: the
// syllabus order. Tutorials: no source — "practice for lecture n".

const P = "plant-physiology";
const proc = (slug: string, topic = P): PlanItem => ({ kind: "process", topic, slug });
const sec = (l: Lesson, ...ids: string[]): PlanItem[] => (ids.length ? ids.map((section) => ({ kind: "lesson" as const, slug: l.slug, section })) : [{ kind: "lesson", slug: l.slug }]);
const probs = (l: Lesson, ...ids: string[]): PlanItem[] =>
  (l.workedProblems ?? []).filter((w) => !ids.length || ids.includes(w.id)).map((w) => ({ kind: "lesson" as const, slug: l.slug, problem: w.id }));

const PORTAL = { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134040" };

const LECTURES: { titleHe: string; items: PlanItem[]; practice: PlanItem[] }[] = [
  { titleHe: "מבנה הצמח והתא הצמחי", items: sec(ppPlantCell), practice: probs(ppPlantCell) },
  { titleHe: "כלים למחקר במדעי הצמח", items: sec(ppResearchTools), practice: probs(ppResearchTools) },
  { titleHe: "המים ותא הצמח: פוטנציאל המים", items: [...sec(ppWaterCells), proc("membrane-transport", "cell-biology")], practice: probs(ppWaterCells) },
  { titleHe: "מאזן המים של הצמח: מהקרקע לאוויר", items: sec(ppWaterBalance), practice: probs(ppWaterBalance) },
  { titleHe: "גדילת התא: הדופן וההתארכות", items: sec(ppCellGrowth), practice: probs(ppCellGrowth) },
  { titleHe: "התפתחות: מהזרע ועד המריסטמות", items: sec(ppDevelopment), practice: probs(ppDevelopment) },
  { titleHe: "הורמונים ואיתות בצמח: אוקסין", items: sec(ppAuxin), practice: probs(ppAuxin) },
  { titleHe: "ציטוקינין וגיברלין", items: sec(ppCytokininGibberellin), practice: probs(ppCytokininGibberellin) },
  { titleHe: "חומצה אבסיסית ואתילן", items: sec(ppAbaEthylene), practice: probs(ppAbaEthylene) },
  { titleHe: "פוטוסינתזה: תגובות האור", items: [...sec(ppLightReactions), proc("photosynthesis", "biochemistry")], practice: probs(ppLightReactions) },
  { titleHe: "פוטוסינתזה: מעגל קלווין וקיבוע הפחמן", items: sec(ppCalvin), practice: probs(ppCalvin) },
  { titleHe: "האור כאות: קולטני האור", items: sec(ppPhotoreceptors), practice: probs(ppPhotoreceptors) },
  { titleHe: "טרופיזם", items: sec(ppTropisms), practice: probs(ppTropisms) },
  { titleHe: "השעון הצירקדי והפוטופריודיזם", items: sec(ppCircadianPhotoperiod), practice: probs(ppCircadianPhotoperiod) },
  { titleHe: "פריחה", items: sec(ppFlowering), practice: probs(ppFlowering) },
  { titleHe: "תגובת הצמח לעקות ביוטיות", items: sec(ppBioticStress), practice: probs(ppBioticStress) },
];

export const technionPlantPhysiologyPlan: CoursePlan = {
  courseSlug: "technion-plant-physiology",
  lectureOrder: {
    confidence: "syllabus",
    noteHe: "אין לוח הרצאות ציבורי לקורס (אתר הקורס במודל סגור). הסדר כאן הוא סדר הנושאים בסילבוס הרשמי. החלוקה לשבועות בפועל עשויה להיות שונה.",
    links: [PORTAL],
  },
  tutorialOrder: null,
  schedule: "suggested",
  scheduleNoteHe: "הנושאים לפי הסילבוס העדכני של הקורס בפורטל הטכניון. הפירוט לתת-נושאים לפי ספר הקורס (Taiz, Plant Physiology and Development) ולפי קורסים מקבילים שמשתמשים באותו ספר.",
  topics: [
    { titleHe: "מבנה הצמח והתא הצמחי", items: sec(ppPlantCell) },
    { titleHe: "כלים למחקר במדעי הצמח", items: sec(ppResearchTools) },
    { titleHe: "יחסי צמח-מים", items: [...sec(ppWaterCells), ...sec(ppWaterBalance)] },
    { titleHe: "גדילה והתפתחות", items: [...sec(ppCellGrowth), ...sec(ppDevelopment)] },
    { titleHe: "מסלולי העברת אותות בתגובה להורמונים (אוקסין, ציטוקינין, גיברלין, חומצה אבציסית, אתילן)", items: [...sec(ppAuxin), ...sec(ppCytokininGibberellin), ...sec(ppAbaEthylene)] },
    { titleHe: "פוטוסינתזה, שלבי האור", items: [...sec(ppLightReactions), proc("photosynthesis", "biochemistry")] },
    { titleHe: "מעגל קלוין", items: sec(ppCalvin) },
    { titleHe: "איכות האור כאות המבקר תהליכים פיזיולוגים והתפתחותיים", items: sec(ppPhotoreceptors) },
    { titleHe: "טרופיזם", items: sec(ppTropisms) },
    { titleHe: "פוטופריודיזם", items: sec(ppCircadianPhotoperiod, "photoperiodism", "coincidence") },
    { titleHe: "שעון צירקאדי", items: sec(ppCircadianPhotoperiod, "rhythms", "clock") },
    { titleHe: "פריחה", items: sec(ppFlowering) },
    { titleHe: "תגובת הצמח לעקות ביוטית", items: sec(ppBioticStress) },
  ],
  lectures: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.items })),
  tutorials: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.practice })).filter((t) => t.items.length > 0),
};
