import type { CoursePlan, PlanItem, PlanSession } from "./types";
import type { Lesson } from "../lessons/types";
import { syInformation } from "../lessons/technion-systems/sy-information";
import { syMatlab } from "../lessons/technion-systems/sy-matlab";
import { syResponseFeedback } from "../lessons/technion-systems/sy-response-feedback";
import { syFflCoherent } from "../lessons/technion-systems/sy-ffl-coherent";
import { syFflIncoherent } from "../lessons/technion-systems/sy-ffl-incoherent";
import { syBistability } from "../lessons/technion-systems/sy-bistability";
import { syDevelopment } from "../lessons/technion-systems/sy-development";
import { syCovalent } from "../lessons/technion-systems/sy-covalent";
import { sySignaling } from "../lessons/technion-systems/sy-signaling";
import { syAdaptation } from "../lessons/technion-systems/sy-adaptation";
import { syNoise } from "../lessons/technion-systems/sy-noise";
import { syNeurons } from "../lessons/technion-systems/sy-neurons";
import { syModels } from "../lessons/technion-systems/sy-models";
import { cbDynamics } from "../lessons/technion-computational/cb-dynamics";
import { cbFeedback } from "../lessons/technion-computational/cb-feedback";
import { cbNetworks } from "../lessons/technion-computational/cb-networks";

// Technion 136037 "ביולוגיה מערכתית" (Faculty of Biology, graduate listing, 2.5 credits = 2 lecture hours + 1 tutorial
// hour). Built with the course-track-builder skill, no insider input. Lecturer: Dr. Sagi Levy. Prerequisite: 104003
// Calculus 1 only — the course is explicitly open to students from biology, physics, chemistry, CS and engineering.
// Evidence: this is BY FAR the most detailed portal syllabus on the site — it names the motifs (self-feedback,
// coherent/incoherent FFL, positive/negative feedback), their FUNCTIONS (sign-dependent delay, speeding/slowing,
// spike generation, input-noise filtering, bistability), the worked systems (lambda switch, yeast noise filtering,
// C. elegans sensory neurons, Drosophila differentiation, E. coli chemotaxis and transcription, mammalian cells),
// the tooling (MATLAB incl. numerical ODEs) and the grading (30/70). Hence an unusually high share of "core".
// Scope reviewed by Codex before writing (2026-10-31): 13 units; proposed units 3+4 MERGED into sy-response-feedback
// and re-aimed at local linearisation and matched-steady-state comparison; the freed week went to sy-development;
// mammalian transcription became a substantial case inside sy-signaling. Extensions: formal transfer functions,
// Shannon information, full stochastic simulation, bifurcation theory, integrate-and-fire, fold-change detection.
// NOTE: 134141 (computational biology) is NOT a prerequisite — its sections are linked as optional refreshers only,
// and every unit here stands alone and goes deliberately deeper than the corresponding cb-* section.
export const SYSTEMS_LESSONS: Lesson[] = [syInformation, syMatlab, syResponseFeedback, syFflCoherent,
  syFflIncoherent, syBistability, syDevelopment, syCovalent, sySignaling, syAdaptation, syNoise, syNeurons, syModels];

const sec = (l: Lesson, ...ids: string[]): PlanItem[] => (ids.length ? ids.map((section) => ({ kind: "lesson" as const, slug: l.slug, section })) : [{ kind: "lesson", slug: l.slug }]);
const probs = (l: Lesson): PlanItem[] => (l.workedProblems ?? []).map((w) => ({ kind: "lesson" as const, slug: l.slug, problem: w.id }));

const PORTAL = { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/136037" };

// Codex's recommended order; optional cb-* refreshers sit after the local unit that goes deeper than them
const LECTURES: { titleHe: string; items: PlanItem[]; practice: PlanItem[] }[] = [
  { titleHe: "מערכת ביולוגית כמעבדת מידע", items: sec(syInformation), practice: probs(syInformation) },
  { titleHe: "MATLAB ופתרון נומרי של משוואות", items: [...sec(syMatlab), ...sec(cbDynamics, "ode", "steady", "euler", "convergence")], practice: probs(syMatlab) },
  { titleHe: "תגובה של צומת בודד ומשוב עצמי", items: [...sec(syResponseFeedback), ...sec(cbFeedback, "nar", "compare", "stability")], practice: probs(syResponseFeedback) },
  { titleHe: "לולאה קוהרנטית: השהיה תלוית סימן", items: [...sec(syFflCoherent), ...sec(cbNetworks, "motifs")], practice: probs(syFflCoherent) },
  { titleHe: "לולאה אי-קוהרנטית: ספייק והאצה", items: sec(syFflIncoherent), practice: probs(syFflIncoherent) },
  { titleHe: "דו-יציבות, היסטרזיס ומפסק למבדה", items: [...sec(syBistability), ...sec(cbFeedback, "toggle")], practice: probs(syBistability) },
  { titleHe: "מידע מיקומי והתמיינות בעובר", items: sec(syDevelopment), practice: probs(syDevelopment) },
  { titleHe: "מחזורי שינוי קוולנטי ורגישות סדר-אפס", items: sec(syCovalent), practice: probs(syCovalent) },
  { titleHe: "מעבר אותות ובקרת שעתוק בתאי יונקים", items: sec(sySignaling), practice: probs(sySignaling) },
  { titleHe: "הסתגלות מדויקת וכימוטקסיס", items: sec(syAdaptation), practice: probs(syAdaptation) },
  { titleHe: "רעש וסינון קלט", items: sec(syNoise), practice: probs(syNoise) },
  { titleHe: "עיבוד מידע בנוירונים חושיים", items: sec(syNeurons), practice: probs(syNeurons) },
  { titleHe: "לאתגר מודלים ולהשוות ביניהם", items: [...sec(syModels), ...sec(cbFeedback, "validation"), ...sec(cbDynamics, "limits")], practice: probs(syModels) },
];

export const technionSystemsPlan: CoursePlan = {
  courseSlug: "technion-systems",
  lectureOrder: {
    confidence: "syllabus",
    noteHe: "אין לוח הרצאות ציבורי לקורס, אך תיאור הקורס בפורטל מפורט במיוחד וכולל תוצאות למידה ממוספרות שמונות את המוטיבים בשמם, את תפקידיהם ואת מערכות הדוגמה. הסדר כאן עוקב אחרי סדר הנושאים ותוצאות הלמידה: יסודות וכלים, מוטיבים לפי סדר מורכבות (משוב עצמי, לולאות הזנה קדימה, דו-יציבות), ואז היישומים הביולוגיים שנזכרים במפורש. חלוקת הנושאים ליחידות היא בחירה שלנו, לא לוח רשמי. לחלק מהיחידות מקושרים סעיפי רענון מקורס הביולוגיה החישובית (134141) — שאינו מקצוע קדם, ולכן כל יחידה כאן עומדת בפני עצמה ומעמיקה מעבר אליהם.",
    links: [PORTAL],
  },
  tutorialOrder: null,
  schedule: "suggested",
  scheduleNoteHe: "הנושאים לפי תיאור הקורס בפורטל הטכניון (2.5 נקודות זכות: 2 שעות הרצאה ושעת תרגול). בפורטל לא רשומים ספרים; הפירוט נשען על ספרות התחום, ובעיקר על Alon, An Introduction to Systems Biology, שהוא הספר המקובל לקורסים מסוג זה — אך אינו ספר קורס רשמי. הקורס משתמש ב-MATLAB; דוגמאות הקוד כאן נכתבו ב-MATLAB, והערכים המספריים שבהן אומתו בחישוב נומרי עצמאי. מקצוע קדם: חדו\"א 1 בלבד. התרגילים הפתורים מוצגים כ\"תרגול על הרצאה n\".",
  topics: [
    { titleHe: "תיאור מערכות ביולוגיות כמערכות לעיבוד מידע", items: [...sec(syInformation), ...sec(syModels)] },
    { titleHe: "תכנות ב-MATLAB ופתרון נומרי של מד\"ר", items: sec(syMatlab) },
    { titleHe: "ניתוח דינמיקה של רשתות ביולוגיות", items: [...sec(syResponseFeedback), ...sec(sySignaling)] },
    { titleHe: "מוטיבים ברשת ותפקידם", items: [...sec(syFflCoherent), ...sec(syFflIncoherent), ...sec(syBistability)] },
    { titleHe: "מערכות חישה ושינויים קוולנטיים", items: [...sec(syCovalent), ...sec(syAdaptation)] },
    { titleHe: "בקרת שעתוק והתמיינות בהתפתחות", items: sec(syDevelopment) },
    { titleHe: "נטרול רעשי קלט", items: sec(syNoise) },
    { titleHe: "עיבוד מידע בנוירונים", items: sec(syNeurons) },
  ],
  lectures: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.items })),
  tutorials: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.practice })).filter((t) => t.items.length > 0),
};
