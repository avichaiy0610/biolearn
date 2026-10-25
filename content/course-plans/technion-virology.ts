import type { CoursePlan, PlanItem, PlanSession } from "./types";
import type { Lesson } from "../lessons/types";
import { vrProperties } from "../lessons/technion-virology/vr-properties";
import { vrMethods } from "../lessons/technion-virology/vr-methods";
import { vrRnaExpression } from "../lessons/technion-virology/vr-rna-expression";
import { vrGenomeReplication } from "../lessons/technion-virology/vr-genome-replication";
import { vrAssemblyPackaging } from "../lessons/technion-virology/vr-assembly-packaging";
import { vrExit } from "../lessons/technion-virology/vr-exit";
import { vrLatency } from "../lessons/technion-virology/vr-latency";
import { vrBacterialDefenses } from "../lessons/technion-virology/vr-bacterial-defenses";
import { vrAnimalDefenses } from "../lessons/technion-virology/vr-animal-defenses";
import { vrEvolution } from "../lessons/technion-virology/vr-evolution";

// Technion 134039: the agreed 12-unit scope was supplied by the owner after review.
// No public weekly schedule; the topic view preserves the portal order. The lecture
// view is explicitly suggested. No official tutorials. Prerequisites own Baltimore,
// MOI/Poisson, basic growth curves, IRES/cap-snatching and the basic lambda switch.
// Per owner's subsequent instruction, skip two unwritten units after a writer was
// blocked: vr-attachment-entry (T4/influenza) and vr-dna-expression (T7).
// Do not substitute the prerequisites for these missing molecular-level units.
// Examples have one owner: polio/MS2 expression; SV40 replication; phi29 packaging;
// M13 exit; lambda/HSV latency; cyanophage psbA evolution. No pathogenesis, vaccines,
// antivirals, giant-virus survey, reverse-genetics protocols or origin speculation.
export const VIROLOGY_LESSONS: Lesson[] = [vrProperties, vrMethods, vrRnaExpression,
  vrGenomeReplication, vrAssemblyPackaging, vrExit, vrLatency, vrBacterialDefenses,
  vrAnimalDefenses, vrEvolution];
const sec = (l: Lesson): PlanItem[] => [{ kind: "lesson", slug: l.slug }];
const ENTRY: PlanItem = { kind: "soon", titleHe: "ספיחה וכניסה — יחידת ההמשך טרם נכתבה" };
const DNA: PlanItem = { kind: "soon", titleHe: "ביטוי גנום DNA — יחידת ההמשך טרם נכתבה" };
const lectures: PlanSession[] = [
  { n: 1, titleHe: vrProperties.titleHe, items: sec(vrProperties) },
  { n: 2, titleHe: vrMethods.titleHe, items: sec(vrMethods) },
  { n: 3, titleHe: "ספיחה וכניסה", items: [ENTRY] },
  { n: 4, titleHe: "ביטוי גנום DNA", items: [DNA] },
  ...VIROLOGY_LESSONS.slice(2).map((l, i) => ({ n: i + 5, titleHe: l.titleHe, items: sec(l) })),
];
export const technionVirologyPlan: CoursePlan = {
  courseSlug: "technion-virology",
  lectureOrder: { confidence: "suggested", noteHe: "סדר לימוד מוצע של 12 יחידות, ולא לוח הרצאות מאומת. בפורטל רשימת נושאים בלבד ואתר הקורס סגור לאורחים. עשר יחידות כתובות; יחידות ספיחה/כניסה וביטוי DNA טרם נכתבו ומסומנות כחסרות.", links: [{ labelHe: "פורטל הטכניון — 134039", url: "https://students.technion.ac.il/local/technionsearch/course/134039" }] },
  tutorialOrder: null,
  schedule: "suggested",
  scheduleNoteHe: "2 נק״ז, שתי שעות הרצאה וללא תרגול רשמי. התרגילים כאן הם לתרגול עצמי. הבסיס המולקולרי והמיקרוביולוגי מקושר כרענון. כרגע חסרות שתי יחידות; אין כאן טענה לכיסוי מלא של הקורס.",
  topics: [
    { titleHe: "המסלול הליטי: ספיחה", items: [ENTRY] },
    { titleHe: "כניסה וביטוי הגנום", items: [ENTRY, DNA, ...sec(vrRnaExpression)] },
    { titleHe: "שכפול הגנום", items: sec(vrGenomeReplication) },
    { titleHe: "הרכבה, אריזה ויציאה", items: [...sec(vrAssemblyPackaging), ...sec(vrExit)] },
    { titleHe: "היבטים של המסלול הלטנטי", items: sec(vrLatency) },
    { titleHe: "מאפייני הנגיף", items: sec(vrProperties) },
    { titleHe: "שיטות מחקר בסיסיות", items: sec(vrMethods) },
    { titleHe: "מנגנוני הגנה ותוצאות אבולוציוניות של יחסי הגומלין", items: [...sec(vrBacterialDefenses), ...sec(vrAnimalDefenses), ...sec(vrEvolution)] },
    { titleHe: "דוגמאות מנגיפי בעלי חיים ומפאג׳ים בעלי גנומי DNA ו-RNA", items: [...sec(vrRnaExpression), ...sec(vrGenomeReplication), ...sec(vrAssemblyPackaging), ...sec(vrExit), ...sec(vrLatency), ...sec(vrEvolution), ENTRY, DNA] },
  ],
  lectures,
  tutorials: lectures.flatMap(s => s.items.filter((item): item is Extract<PlanItem, { kind: "lesson" }> => item.kind === "lesson").map(item => {
    const lesson = VIROLOGY_LESSONS.find(l => l.slug === item.slug)!;
    return { n: s.n, titleHe: s.titleHe, items: (lesson.workedProblems ?? []).map(w => ({ kind: "lesson" as const, slug: lesson.slug, problem: w.id })) };
  })),
};
