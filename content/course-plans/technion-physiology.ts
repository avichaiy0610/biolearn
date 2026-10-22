import type { CoursePlan, PlanItem, PlanSession } from "./types";
import type { Lesson } from "../lessons/types";
import { phTransport } from "../lessons/technion-physiology/ph-transport";
import { phMembranePotential } from "../lessons/technion-physiology/ph-membrane-potential";
import { phActionPotential } from "../lessons/technion-physiology/ph-action-potential";
import { phNervousSystem } from "../lessons/technion-physiology/ph-nervous-system";
import { phSynapse } from "../lessons/technion-physiology/ph-synapse";
import { phSkeletalMuscle } from "../lessons/technion-physiology/ph-skeletal-muscle";
import { phSmoothCardiacMuscle } from "../lessons/technion-physiology/ph-smooth-cardiac-muscle";
import { phBlood } from "../lessons/technion-physiology/ph-blood";
import { phKidneyFiltration } from "../lessons/technion-physiology/ph-kidney-filtration";
import { phKidneyTubules } from "../lessons/technion-physiology/ph-kidney-tubules";
import { phVolumePressure } from "../lessons/technion-physiology/ph-volume-pressure";

// Technion 01340117 "פיזיולוגיה" — built with the course-track-builder skill (step 5a), no insider input.
// Topics: the CURRENT syllabus on the Technion students portal — detailed enough to bound the scope by itself:
// cell physiology (pumps, carriers, channels); kidney (filtration, reabsorption, blood volume and pressure);
// blood (composition, erythropoiesis, platelets, coagulation); nervous system (CNS/PNS, excitatory and inhibitory
// neurons, glia and myelin, action potential, synaptic transmission); muscle (skeletal, smooth, NMJ, control of
// smooth and cardiac contraction). NOT in the syllabus, so not written: respiration, GI, endocrine, the heart as a
// pump, sensory/motor systems. The book list (Katz, Aidley, Matthews, Stein) weights excitable cells and transport.
// Lecture order: no public schedule (Moodle closed to guests) — the syllabus order. Parallel 136086 (graduate,
// same faculty) has no public syllabus. Tutorials: no source — "practice for lecture n".

const P = "physiology";
const proc = (slug: string, topic = P): PlanItem => ({ kind: "process", topic, slug });
const sec = (l: Lesson, ...ids: string[]): PlanItem[] => (ids.length ? ids.map((section) => ({ kind: "lesson" as const, slug: l.slug, section })) : [{ kind: "lesson", slug: l.slug }]);
const probs = (l: Lesson, ...ids: string[]): PlanItem[] =>
  (l.workedProblems ?? []).filter((w) => !ids.length || ids.includes(w.id)).map((w) => ({ kind: "lesson" as const, slug: l.slug, problem: w.id }));

const PORTAL = { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134117" };

const LECTURES: { titleHe: string; items: PlanItem[]; practice: PlanItem[] }[] = [
  { titleHe: "פיזיולוגיה של התא: משאבות, נשאים ותעלות", items: [...sec(phTransport), proc("membrane-transport", "cell-biology")], practice: probs(phTransport) },
  { titleHe: "פוטנציאל המנוחה", items: sec(phMembranePotential), practice: probs(phMembranePotential) },
  { titleHe: "הכליה: מבנה, פינוי וסינון בפקעית", items: [...sec(phKidneyFiltration), proc("nephron-urine-formation")], practice: probs(phKidneyFiltration) },
  { titleHe: "הכליה: ספיגה והפרשה לאורך הנפרון", items: sec(phKidneyTubules), practice: probs(phKidneyTubules) },
  { titleHe: "בקרת נפח הדם, האוסמולריות ולחץ הדם", items: sec(phVolumePressure), practice: probs(phVolumePressure) },
  { titleHe: "הדם: הרכב, אריתרופויאזה וקרישה", items: sec(phBlood), practice: probs(phBlood) },
  { titleHe: "מערכת העצבים: תאים, מבנה ותאים תומכים", items: sec(phNervousSystem), practice: probs(phNervousSystem) },
  { titleHe: "פוטנציאל הפעולה והולכתו", items: [...sec(phActionPotential), proc("action-potential")], practice: probs(phActionPotential) },
  { titleHe: "העברה סינפטית: נוירונים מעוררים ומעכבים", items: [...sec(phSynapse), proc("synaptic-transmission")], practice: probs(phSynapse) },
  { titleHe: "שריר השלד והסינפסה עצב-שריר", items: [...sec(phSkeletalMuscle), proc("muscle-contraction")], practice: probs(phSkeletalMuscle) },
  { titleHe: "בקרת ההתכווצות בשריר הלב ובשריר החלק", items: sec(phSmoothCardiacMuscle), practice: probs(phSmoothCardiacMuscle) },
];

export const technionPhysiologyPlan: CoursePlan = {
  courseSlug: "technion-physiology",
  lectureOrder: {
    confidence: "syllabus",
    noteHe: "אין לוח הרצאות ציבורי לקורס (אתר הקורס במודל סגור). הסדר כאן הוא סדר הנושאים בסילבוס הרשמי: פיזיולוגיה של התא, הכליה, הדם, מערכת העצבים והשריר. החלוקה לשבועות בפועל עשויה להיות שונה.",
    links: [PORTAL],
  },
  tutorialOrder: null,
  schedule: "suggested",
  scheduleNoteHe: "הנושאים לפי הסילבוס העדכני של הקורס בפורטל הטכניון. הפירוט לתת-נושאים לפי ספר הקורס (Berne & Levy Physiology); נושא הדם — גם לפי Vander, כי Berne & Levy מקצר בו.",
  topics: [
    { titleHe: "פיסיולוגיה של התא: מבנה ותפקוד של משאבות", items: sec(phTransport, "classes", "pumps") },
    { titleHe: "נשאים ותעלות", items: [...sec(phTransport, "secondary", "kinetics", "osmosis", "epithelia"), ...sec(phMembranePotential), proc("membrane-transport", "cell-biology")] },
    { titleHe: "פיסיולוגיה של מערכות: הכליה - סינון וספיגה", items: [...sec(phKidneyFiltration), ...sec(phKidneyTubules), proc("nephron-urine-formation")] },
    { titleHe: "בקרת נפח הדם ולחץ הדם", items: sec(phVolumePressure) },
    { titleHe: "מערכת הדם- הרכב הדם ותפקידיו", items: sec(phBlood, "composition", "erythrocytes") },
    { titleHe: "אריתרופויאסיס, טסיות הדם וקרישת הדם", items: sec(phBlood, "erythropoiesis", "platelets", "coagulation", "anticoagulation") },
    { titleHe: "מערכת העצבים-המערכת המרכזית וההיקפית", items: sec(phNervousSystem, "neuron", "axonal-transport", "cns-pns", "csf-bbb", "injury") },
    { titleHe: "נאורונים אקסיטטורים ואינהיביטורים", items: sec(phSynapse, "epsp-ipsp", "integration") },
    { titleHe: "תאים תומכים ומעטפת המיאלין", items: [...sec(phNervousSystem, "glia"), ...sec(phActionPotential, "myelin")] },
    { titleHe: "פוטנציאל הפעולה וההעברה הסינפטית", items: [...sec(phActionPotential, "passive", "phases", "channels", "refractory", "conduction"), ...sec(phSynapse, "types", "release", "receptors", "plasticity", "transmitters"), proc("action-potential"), proc("synaptic-transmission")] },
    { titleHe: "שריר-שריר חלק ומשורטט", items: [...sec(phSkeletalMuscle, "structure"), ...sec(phSmoothCardiacMuscle, "cardiac-structure", "smooth-structure")] },
    { titleHe: "מנגנון התכווצות השריר המשורטט", items: [...sec(phSkeletalMuscle, "ec-coupling", "cross-bridge", "mechanics", "motor-units"), proc("muscle-contraction")] },
    { titleHe: "הסינפסה הנאורו-מוסקולרית", items: sec(phSkeletalMuscle, "nmj") },
    { titleHe: "בקרת התכווצות של שריר חלק ושל שריר הלב", items: sec(phSmoothCardiacMuscle, "cicr", "cardiac-regulation", "smooth-mechanism", "smooth-calcium") },
  ],
  lectures: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.items })),
  tutorials: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.practice })).filter((t) => t.items.length > 0),
};
