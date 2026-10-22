import type { CoursePlan, PlanItem, PlanSession } from "./types";
import type { Lesson } from "../lessons/types";
import { b1Intro } from "../lessons/technion-biology-1/b1-intro";
import { b1Science } from "../lessons/technion-biology-1/b1-science";
import { b1ProteinsEnzymes } from "../lessons/technion-biology-1/b1-proteins-enzymes";
import { b1Cells } from "../lessons/technion-biology-1/b1-cells";
import { b1EukaryoticCell } from "../lessons/technion-biology-1/b1-eukaryotic-cell";
import { b1Membranes } from "../lessons/technion-biology-1/b1-membranes";
import { b1Energy } from "../lessons/technion-biology-1/b1-energy";
import { b1Metabolism } from "../lessons/technion-biology-1/b1-metabolism";
import { b1Dna } from "../lessons/technion-biology-1/b1-dna";
import { b1GeneExpression } from "../lessons/technion-biology-1/b1-gene-expression";
import { b1CellDivision } from "../lessons/technion-biology-1/b1-cell-division";
import { b1Development } from "../lessons/technion-biology-1/b1-development";

// Technion 01340058 "ביולוגיה 1" — built with the course-track-builder skill (step 5a), no insider input.
// Sources: (1) the course's own detailed syllabus, winter 2024 (תשפ"ד), lecture groups 10/20/30 — Dr. Sagi Levy,
// Prof. Oded Béjà, Prof. Dedi Meiri (lead); 11 numbered topics with subtopics and chapters of Purves/Hillis "Life"
// (7th/8th ed.). Found as a student upload on Scribd (document 744244211) and read from page images. (2) The
// CURRENT portal description, a broader topic paragraph shared by the winter version (biology, biotechnology, science
// education) and the spring version (biomedical engineering, EE, CS, math, chemistry).
// Scope decision: units follow the 11 topics of the detailed syllabus — the narrow core of each subtopic, at intro
// level (the deeper versions are in 134019, 134113, 134082, 134119, 134128). Covered from the portal paragraph inside
// those units: water (b1-membranes), chemical evolution (b1-intro), from cell to tissue (b1-development).
// NOT written (portal paragraph only, absent from the detailed syllabus): DNA technology and genomics; systematics,
// taxonomy and phylogeny; foundations of evolution; carbohydrates and lipids as macromolecules. Open question for
// Avichai — they may belong to the spring version or to an older paragraph.
// Lecture order: the topic order of the 2024 syllabus ("the order may change during the semester"); tutorials are
// optional and have no public schedule — "practice for lecture n".

const B = "biochemistry", C = "cell-biology", M = "molecular-biology", G = "genetics", MI = "microbiology";
const proc = (slug: string, topic: string): PlanItem => ({ kind: "process", topic, slug });
const sec = (l: Lesson, ...ids: string[]): PlanItem[] => (ids.length ? ids.map((section) => ({ kind: "lesson" as const, slug: l.slug, section })) : [{ kind: "lesson", slug: l.slug }]);
const probs = (l: Lesson, ...ids: string[]): PlanItem[] =>
  (l.workedProblems ?? []).filter((w) => !ids.length || ids.includes(w.id)).map((w) => ({ kind: "lesson" as const, slug: l.slug, problem: w.id }));

const PORTAL = { labelHe: "תיאור הקורס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134058" };
const SYL2024 = { labelHe: "סילבוס הקורס, חורף תשפ\"ד (עותק שהועלה ל-Scribd)", url: "https://www.scribd.com/document/744244211" };

const LECTURES: { titleHe: string; items: PlanItem[]; practice: PlanItem[] }[] = [
  { titleHe: "הקדמה: מה הם חיים, ההיסטוריה של החיים וההיררכיה הביולוגית", items: sec(b1Intro), practice: probs(b1Intro) },
  { titleHe: "השיטה המדעית והכלים שבעזרתם חוקרים חיים", items: sec(b1Science), practice: probs(b1Science) },
  { titleHe: "חלבונים ואנזימים", items: [...sec(b1ProteinsEnzymes), proc("enzyme-kinetics", B)], practice: probs(b1ProteinsEnzymes) },
  { titleHe: "התא כיחידת חיים: פרוקריוטים, אאוקריוטים ווירוסים", items: [...sec(b1Cells), proc("viral-life-cycle", MI)], practice: probs(b1Cells) },
  { titleHe: "התא האאוקריוטי: האברונים ותפקידם", items: [...sec(b1EukaryoticCell), proc("secretory-pathway", C)], practice: probs(b1EukaryoticCell) },
  { titleHe: "ממברנות והובלה של חומרים", items: [...sec(b1Membranes), proc("membrane-transport", C)], practice: probs(b1Membranes) },
  { titleHe: "אנרגיה והתא: תרמודינמיקה ו-ATP", items: sec(b1Energy), practice: probs(b1Energy) },
  { titleHe: "חילוף חומרים: גליקוליזה, תסיסה ונשימה תאית", items: [...sec(b1Metabolism), proc("glycolysis", B), proc("cellular-respiration", B)], practice: probs(b1Metabolism) },
  { titleHe: "מבנה ותפקוד הגנים (1): DNA, החומר התורשתי והשכפול", items: [...sec(b1Dna), proc("dna-replication", M)], practice: probs(b1Dna) },
  { titleHe: "מבנה ותפקוד הגנים (2): שעתוק, הצופן, תרגום ובקרה", items: [...sec(b1GeneExpression), proc("transcription", M), proc("translation", M), proc("lac-operon", M)], practice: probs(b1GeneExpression) },
  { titleHe: "מחזור התא וחלוקתו: מיטוזה ומיוזה", items: [...sec(b1CellDivision), proc("meiosis", G)], practice: probs(b1CellDivision) },
  { titleHe: "התמיינות והתפתחות", items: sec(b1Development), practice: probs(b1Development) },
];

export const technionBiology1Plan: CoursePlan = {
  courseSlug: "technion-biology-1",
  lectureOrder: {
    confidence: "syllabus",
    noteHe: "סדר הנושאים בסילבוס המפורט של הקורס (חורף תשפ\"ד). בסילבוס עצמו כתוב שהסדר עלול להשתנות במהלך הסמסטר, ואין בו חלוקה לשבועות. נושאים 1–2 הם הרצאות קצרות יחסית; נושא 9 פוצל כאן לשתי יחידות.",
    links: [SYL2024, PORTAL],
  },
  tutorialOrder: null,
  schedule: "suggested",
  scheduleNoteHe: "הנושאים ותתי-הנושאים לפי הסילבוס המפורט של הקורס (חורף תשפ\"ד, ספר הקורס: Purves/Hillis, Life). התרגולים בקורס הם רשות, ואין להם לוח ציבורי.",
  topics: [
    { titleHe: "1. הקדמה: הגדרות ומושגים בסיסיים, ההיסטוריה של החיים, היררכיה ביולוגית", items: sec(b1Intro) },
    { titleHe: "2. תצפית, ניסוי וטעיה; הכלים שבעזרתם חוקרים חיים", items: sec(b1Science) },
    { titleHe: "3. חלבונים ואנזימים", items: [...sec(b1ProteinsEnzymes), proc("enzyme-kinetics", B)] },
    { titleHe: "4. התא כיחידת חיים: תא פרוקריוטי, תא אאוקריוטי, וירוסים", items: [...sec(b1Cells), proc("viral-life-cycle", MI)] },
    { titleHe: "5. התא האאוקריוטי — מבנה ותפקיד", items: [...sec(b1EukaryoticCell), proc("secretory-pathway", C)] },
    { titleHe: "6. קרומים וטרנספורט של מומסים", items: [...sec(b1Membranes), proc("membrane-transport", C)] },
    { titleHe: "7. אנרגיה והתא", items: sec(b1Energy) },
    { titleHe: "8. חילוף חומרים בתא", items: [...sec(b1Metabolism), proc("glycolysis", B), proc("cellular-respiration", B)] },
    { titleHe: "9. מבנה ותפקיד הגנים", items: [...sec(b1Dna), ...sec(b1GeneExpression), proc("dna-replication", M), proc("transcription", M), proc("translation", M), proc("lac-operon", M)] },
    { titleHe: "10. מעגל התא וחלוקתו", items: [...sec(b1CellDivision), proc("meiosis", G)] },
    { titleHe: "11. דיפרנציאציה והתפתחות", items: sec(b1Development) },
  ],
  lectures: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.items })),
  tutorials: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.practice })).filter((t) => t.items.length > 0),
};
