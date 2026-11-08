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
  { titleHe: "מבוא למערכת החיסון; מרכיבי החסינות המולדת ומנגנוניה", items: [...sec(imIntro, "arms", "organs", "lymph-node"), ...sec(imInnate, "barriers", "prr")], practice: probs(imIntro) },
  { titleHe: "מנגנוני החסינות המולדת (המשך); יצירה והתפתחות של תאי החיסון", items: [...sec(imInnate, "phagocytes", "complement", "inflammation"), ...sec(imIntro, "cells")], practice: probs(imInnate) },
  { titleHe: "חיסון הסתגלותי; נוגדנים — מבנה ותפקיד; גנטיקה של שונות", items: [...sec(imAntibodies, "antigens", "structure", "classes", "isotype-allotype-idiotype"), ...sec(imIgGenetics, "problem", "diversity")], practice: probs(imAntibodies) },
  { titleHe: "תהליכי רקומבינציה; ריאקציית אנטיגן-נוגדן", items: [...sec(imIgGenetics, "vdj", "allelic-exclusion", "biosynthesis"), ...sec(imAntibodies, "hybridomas", "assays")], practice: probs(imIgGenetics) },
  { titleHe: "התפתחות תאי B, שפעול וזיכרון; סבילות חיסונית", items: [...sec(imBCells, "development", "bcr", "t-dependent", "subsets"), ...sec(imIgGenetics, "csr-shm"), ...sec(imTolerance, "definition", "central")], practice: probs(imBCells) },
  { titleHe: "אנטיגן תואם הרקמות (MHC) והצגת אנטיגנים לתאי T", items: sec(imMhc), practice: probs(imMhc) },
  { titleHe: "הרצפטור לאנטיגן של תאי T והתפתחות תאי T", items: sec(imTCells, "tcr", "thymus"), practice: [] },
  { titleHe: "שפעול תאי T וזיכרון; T-B במרכז הנבט; העברת האותות בתאי T", items: [...sec(imTCells, "activation", "checkpoints"), ...sec(imBCells, "germinal-center"), ...sec(imEffector, "memory")], practice: probs(imTCells) },
  { titleHe: "מבוא לחיסונים (vaccination); ציטוקינים וכמוקינים; העברת אותות בתגובה לציטוקינים", items: [...sec(imInfection, "vaccines"), ...sec(imCytokines, "what", "key", "receptors", "chemokines")], practice: probs(imCytokines) },
  { titleHe: "ציטוקינים בהפעלת החסינות המולדת", items: [...sec(imInnate, "inflammation"), ...sec(imCytokines, "extravasation")], practice: [] },
  { titleHe: "תתי-אוכלוסיות של תאי T, תאים רגולטוריים וסבילות", items: [...sec(imEffector, "polarization", "helpers", "ctl"), ...sec(imTolerance, "peripheral", "autoimmunity")], practice: [...probs(imEffector), ...probs(imTolerance)] },
  { titleHe: "יחסי גומלין בין תאים", items: sec(imEffector, "interactions"), practice: [] },
];

export const technionImmunologyPlan: CoursePlan = {
  courseSlug: "technion-immunology",
  lectureOrder: {
    confidence: "official",
    noteHe: "לפי לוח 12 השבועות בסילבוס הקורס לחורף תשפ\"ה (פרופ' דורון מלמד, פרופ' נתן קרין, ד\"ר ארי גלסנר, פרופ\"ח דבי יבלונסקי). רגישות יתר, השתלות, חסרים חיסוניים ורוב יחידת הזיהומים לא נלמדים בלוח הזה — הם נשארו בלשונית \"לפי נושאים\" ומסומנים כהרחבה. המבחן: 50 שאלות אמריקאיות, שעתיים.",
    links: [PORTAL, PARALLEL],
  },
  tutorialOrder: null,
  schedule: "official",
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
