import type { CoursePlan, PlanItem, PlanSession } from "./types";
import type { Lesson } from "../lessons/types";
import { imIntro } from "../lessons/technion-immunology/im-intro";
import { imInnate } from "../lessons/technion-immunology/im-innate";
import { imAntibodies } from "../lessons/technion-immunology/im-antibodies";
import { imIgGenetics } from "../lessons/technion-immunology/im-ig-genetics";
import { imBCells } from "../lessons/technion-immunology/im-b-cells";
import { imMhc } from "../lessons/technion-immunology/im-mhc";
import { imTCells } from "../lessons/technion-immunology/im-t-cells";
import { imCytokines } from "../lessons/technion-immunology/im-cytokines";
import { imEffector } from "../lessons/technion-immunology/im-effector";
import { imTolerance } from "../lessons/technion-immunology/im-tolerance";
import { imInfection } from "../lessons/technion-immunology/im-infection";
import { imHypersensitivity } from "../lessons/technion-immunology/im-hypersensitivity";
import { imTransplant } from "../lessons/technion-immunology/im-transplant";
import { imImmunodeficiency } from "../lessons/technion-immunology/im-immunodeficiency";

// Technion 02760413 "אימונולוגיה בסיסית" (Medicine faculty course in the Biology elective list, year 3) — built with
// the course-track-builder skill, no insider input. Evidence: the CURRENT portal paragraph (24 topics, no weeks, no
// books listed). Moodle closed to guests; lecturers 2025–2027: Prof. Ariella Glasner, Prof. Dvora Yablonski, Prof.
// Doron Melamed (+ Prof. Natan Karin 2025–26). Parallel evidence ("no extra credit" pair, SAME lecturers): Medicine
// 274261 "אימונולוגיה בסיסית וקלינית", spring 2025 syllabus (md.technion.ac.il) — 27 lectures, books Janeway's
// Immunobiology and Abbas, Cellular and Molecular Immunology (neither on disk; facts checked by Codex from knowledge).
// Scope (step 5a), reviewed by Codex before writing (2026-10-23): 14 units covering all 24 portal topics; vaccines and
// drug allergy have parallel-course support only (likely); clinical protocols and exhaustive cascades not written.
// Order: the 274261 sequence (innate → antibodies and B cells → MHC and T cells → cytokines and effectors →
// tolerance → infection → hypersensitivity → transplantation → immunodeficiency), labelled "parallel".

const sec = (l: Lesson, ...ids: string[]): PlanItem[] => (ids.length ? ids.map((section) => ({ kind: "lesson" as const, slug: l.slug, section })) : [{ kind: "lesson", slug: l.slug }]);
const probs = (l: Lesson): PlanItem[] => (l.workedProblems ?? []).map((w) => ({ kind: "lesson" as const, slug: l.slug, problem: w.id }));

const PORTAL = { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/276413" };
const PARALLEL = { labelHe: "הסילבוס של הקורס המקביל 274261 (רפואה, אותם מרצים)", url: "https://md.technion.ac.il/wp-content/uploads/2025/03/%D7%A1%D7%99%D7%9C%D7%91%D7%95%D7%A1-%D7%90%D7%99%D7%9E%D7%95%D7%A0%D7%95%D7%9C%D7%95%D7%92%D7%99%D7%94-%D7%91%D7%A1%D7%99%D7%A1%D7%99%D7%AA-%D7%95%D7%A7%D7%9C%D7%99%D7%A0%D7%99%D7%AA-2740261-%D7%90%D7%91%D7%99%D7%91-%D7%AA%D7%A9%D7%A4%D7%94-2024-2025.pdf" };

const LECTURES: { titleHe: string; items: PlanItem[]; practice: PlanItem[] }[] = [
  { titleHe: "מבוא: חסינות מולדת ונרכשת, תאים ואיברים", items: sec(imIntro), practice: probs(imIntro) },
  { titleHe: "החסינות המולדת: קולטנים, תאים, משלים ודלקת", items: sec(imInnate), practice: probs(imInnate) },
  { titleHe: "אנטיגנים ונוגדנים", items: sec(imAntibodies), practice: probs(imAntibodies) },
  { titleHe: "הגנטיקה והביוסינטזה של נוגדנים", items: sec(imIgGenetics), practice: probs(imIgGenetics) },
  { titleHe: "תאי B: התפתחות, הפעלה וזיכרון", items: sec(imBCells), practice: probs(imBCells) },
  { titleHe: "MHC והצגת אנטיגנים", items: sec(imMhc), practice: probs(imMhc) },
  { titleHe: "תאי T: הקולטן, התימוס וההפעלה", items: sec(imTCells), practice: probs(imTCells) },
  { titleHe: "ציטוקינים, מולקולות הדבקה ונדידה", items: sec(imCytokines), practice: probs(imCytokines) },
  { titleHe: "תאי T מבצעים ויחסי גומלין בין תאים", items: sec(imEffector), practice: probs(imEffector) },
  { titleHe: "סבילות ואוטואימוניות", items: sec(imTolerance), practice: probs(imTolerance) },
  { titleHe: "זיהומים, ריריות, יילוד וחיסונים", items: sec(imInfection), practice: probs(imInfection) },
  { titleHe: "רגישות יתר ואלרגיה", items: sec(imHypersensitivity), practice: probs(imHypersensitivity) },
  { titleHe: "ביולוגיה של השתלות", items: sec(imTransplant), practice: probs(imTransplant) },
  { titleHe: "חסרים חיסוניים ראשוניים ואיידס", items: sec(imImmunodeficiency), practice: probs(imImmunodeficiency) },
];

export const technionImmunologyPlan: CoursePlan = {
  courseSlug: "technion-immunology",
  lectureOrder: {
    confidence: "parallel",
    noteHe: "אין לוח הרצאות ציבורי לקורס (אתר הקורס במודל סגור). הסדר כאן לפי לוח ההרצאות של הקורס המקביל 274261 בפקולטה לרפואה, שמלמדים בו אותם מרצים — סביר שהוא קרוב, אבל לא הוכח שהוא זהה.",
    links: [PORTAL, PARALLEL],
  },
  tutorialOrder: null,
  schedule: "suggested",
  scheduleNoteHe: "הנושאים לפי הסילבוס בפורטל הטכניון (24 נושאים). בפורטל לא רשומים ספרים; הפירוט לפי הספרים של הקורס המקביל (Janeway, Abbas). בקורס אין תרגולים רשומים — התרגילים הפתורים כאן לתרגול עצמי.",
  topics: [
    { titleHe: "מבוא לחסינות טבעית ונרכשת", items: [...sec(imIntro, "arms", "cells"), ...sec(imInnate)] },
    { titleHe: "נוגדנים: קבוצות ותת-קבוצות — מבנה ותפקיד", items: sec(imAntibodies, "structure", "classes") },
    { titleHe: "גנטיקה וביוסינטזה של נוגדנים", items: sec(imIgGenetics) },
    { titleHe: "אידיוטיפ, אלוטיפ, איזוטיפ של הנוגדן", items: sec(imAntibodies, "isotype-allotype-idiotype") },
    { titleHe: "היברידומות", items: sec(imAntibodies, "hybridomas") },
    { titleHe: "משלים בחסינות הומורלית ובדלקת", items: sec(imInnate, "complement", "inflammation") },
    { titleHe: "תבחינים אימוניים", items: sec(imAntibodies, "assays") },
    { titleHe: "גנטיקה ותפקוד האתר העיקרי לסיווג רקמות (MHC)", items: sec(imMhc) },
    { titleHe: "מהות האנטיגנים", items: sec(imAntibodies, "antigens") },
    { titleHe: "המערכת הלימפטית: איברים, רקמות, תאים", items: sec(imIntro, "cells", "organs", "lymph-node") },
    { titleHe: "הקולטן של תאי T", items: sec(imTCells) },
    { titleHe: "תאים ותפקידים ביולוגיים בתגובות חיסון; תאי עזר", items: [...sec(imBCells), ...sec(imEffector)] },
    { titleHe: "ציטוקינים, לימפוקינים, דלקת, מולקולות הדבקה; נדידת תאים ויחסי גומלין בין תאים", items: [...sec(imCytokines), ...sec(imEffector, "interactions")] },
    { titleHe: "סבילות טבעית ונרכשת; אוטואימוניות", items: sec(imTolerance) },
    { titleHe: "ביולוגיה של השתלות", items: sec(imTransplant) },
    { titleHe: "אלרגיות ורגישויות יתר", items: sec(imHypersensitivity) },
    { titleHe: "תסמונת הכשל החיסוני (AIDS)", items: sec(imImmunodeficiency, "hiv", "aids") },
    { titleHe: "תנגודת לזיהומים; חסינות של מערכת הריריות; חסינות ביילוד", items: sec(imInfection) },
    { titleHe: "הבסיס המולקולרי של חסרים חיסוניים ראשוניים", items: sec(imImmunodeficiency, "by-infection", "b-defects", "scid", "phagocyte-complement") },
  ],
  lectures: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.items })),
  tutorials: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.practice })).filter((t) => t.items.length > 0),
};
