import type { CoursePlan, PlanItem, PlanSession } from "./types";
import type { Lesson } from "../lessons/types";
import { phTransport } from "../lessons/technion-physiology/ph-transport";
import { phDiffusion } from "../lessons/technion-physiology/ph-diffusion";
import { phAnatomy } from "../lessons/technion-physiology/ph-anatomy";
import { phMembranePotential } from "../lessons/technion-physiology/ph-membrane-potential";
import { phActionPotential } from "../lessons/technion-physiology/ph-action-potential";
import { phNervousSystem } from "../lessons/technion-physiology/ph-nervous-system";
import { phSynapse } from "../lessons/technion-physiology/ph-synapse";
import { phSkeletalMuscle } from "../lessons/technion-physiology/ph-skeletal-muscle";
import { phSmoothCardiacMuscle } from "../lessons/technion-physiology/ph-smooth-cardiac-muscle";
import { phMuscleAtrophy } from "../lessons/technion-physiology/ph-muscle-atrophy";
import { phBlood } from "../lessons/technion-physiology/ph-blood";
import { phBloodDisorders } from "../lessons/technion-physiology/ph-blood-disorders";
import { phKidneyFiltration } from "../lessons/technion-physiology/ph-kidney-filtration";
import { phKidneyTubules } from "../lessons/technion-physiology/ph-kidney-tubules";
import { phVolumePressure } from "../lessons/technion-physiology/ph-volume-pressure";

// Technion 01340117 "פיזיולוגיה". Updated 2026-11-02 against the course's OWN syllabus (Prof. Shenhav Cohen),
// found in the student Drive and in `syllabuses/_text/Syllabus Physiology 134117.pdf.txt` — its header mistakenly
// carries the name and number of 134147, but its content, lecturer and reading list are this course. It divides
// 13 weeks into seven sessions: cell physiology (1–2), human anatomy (3–4), blood (5–6), urinary (7–8), nervous
// (9–10) and musculoskeletal (11–13). The earlier version of this plan was built only from the portal topic list,
// which omits anatomy and muscle homeostasis entirely and is here superseded.
// Tutorials: the Drive holds the tutorial decks (Topic 1 transport, Topic 2 diffusion/flux/osmosis/electrogenic,
// Topic 3 blood, Topic 4 kidney) but not a full 13-week tutorial schedule, so tutorials remain "practice for
// lecture n". The syllabus itself warns that tutorials teach material only superficially covered in class.

const P = "physiology";
const proc = (slug: string, topic = P): PlanItem => ({ kind: "process", topic, slug });
const sec = (l: Lesson, ...ids: string[]): PlanItem[] => (ids.length ? ids.map((section) => ({ kind: "lesson" as const, slug: l.slug, section })) : [{ kind: "lesson", slug: l.slug }]);
const probs = (l: Lesson, ...ids: string[]): PlanItem[] =>
  (l.workedProblems ?? []).filter((w) => !ids.length || ids.includes(w.id)).map((w) => ({ kind: "lesson" as const, slug: l.slug, problem: w.id }));

const PORTAL = { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134117" };

const LECTURES: { titleHe: string; items: PlanItem[]; practice: PlanItem[] }[] = [
  // The 13 sessions follow the weekly blocks of the lecturer's syllabus: 1-2 cell physiology, 3-4 anatomy,
  // 5-6 blood, 7-8 urinary, 9-10 nervous, 11-13 musculoskeletal.
  { titleHe: "פיזיולוגיה של התא: משאבות, נשאים ותעלות", items: [...sec(phTransport, "classes", "channel-structure", "pumps", "abc", "asymmetry", "secondary", "glut"), proc("membrane-transport", "cell-biology")], practice: probs(phTransport, "ouabain", "pgp-inhibitors", "abcb4-liposome") },
  { titleHe: "עקרונות הדיפוזיה, החדירות והאוסמוזה", items: [...sec(phDiffusion), ...sec(phTransport, "kinetics", "osmosis", "epithelia")], practice: [...probs(phDiffusion), ...probs(phTransport, "tonicity")] },
  { titleHe: "אנטומיה של גוף האדם: מונחים, שלד, מפרקים ושרירים", items: sec(phAnatomy, "terms", "visceral-somatic", "skeleton", "joints", "muscles"), practice: probs(phAnatomy, "thorax-reasoning") },
  { titleHe: "אנטומיה: עמוד השדרה, עצבי הגולגולת, בית החזה והבטן", items: sec(phAnatomy, "spine", "cranial-nerves", "thorax", "abdomen", "tissues"), practice: probs(phAnatomy, "epidural-level", "disc-herniation", "cranial-lesion") },
  { titleHe: "הדם: הרכב, תאים אדומים ויצירת תאי הדם", items: sec(phBlood, "composition", "erythrocytes", "erythropoiesis", "leukopoiesis", "thrombopoiesis"), practice: [...probs(phBlood, "anemia-causes"), ...probs(phBloodDisorders, "cbc-reading", "hemolysis-labs")] },
  { titleHe: "קרישת הדם, ופתולוגיה של הדם", items: [...sec(phBlood, "platelets", "coagulation", "anticoagulation"), ...sec(phBloodDisorders)], practice: [...probs(phBlood, "clotting-tests"), ...probs(phBloodDisorders, "thalassemia-alleles", "polycythemia-epo")] },
  { titleHe: "הכליה: מבנה, פינוי וסינון בפקעית", items: [...sec(phKidneyFiltration), proc("nephron-urine-formation")], practice: probs(phKidneyFiltration) },
  { titleHe: "הכליה: ספיגה והפרשה, בקרת נפח ולחץ דם", items: [...sec(phKidneyTubules), ...sec(phVolumePressure)], practice: [...probs(phKidneyTubules), ...probs(phVolumePressure)] },
  { titleHe: "מערכת העצבים: תאים, פוטנציאל מנוחה ופוטנציאל פעולה", items: [...sec(phNervousSystem), ...sec(phMembranePotential), ...sec(phActionPotential), proc("action-potential")], practice: [...probs(phNervousSystem), ...probs(phMembranePotential), ...probs(phActionPotential)] },
  { titleHe: "העברה סינפטית: נוירונים מעוררים ומעכבים", items: [...sec(phSynapse), proc("synaptic-transmission")], practice: probs(phSynapse) },
  { titleHe: "שריר השלד: מבנה ומנגנון ההתכווצות", items: [...sec(phSkeletalMuscle, "structure", "ec-coupling", "cross-bridge", "mechanics", "motor-units"), proc("muscle-contraction")], practice: probs(phSkeletalMuscle) },
  { titleHe: "הסינפסה עצב-שריר, ושריר הלב והשריר החלק", items: [...sec(phSkeletalMuscle, "nmj"), ...sec(phSmoothCardiacMuscle)], practice: probs(phSmoothCardiacMuscle) },
  { titleHe: "הומאוסטזיס של השריר: אטרופיה, היפרטרופיה ודיסטרופיה", items: sec(phMuscleAtrophy), practice: probs(phMuscleAtrophy) },
];

export const technionPhysiologyPlan: CoursePlan = {
  courseSlug: "technion-physiology",
  lectureOrder: {
    confidence: "official-past",
    noteHe: "הסדר לפי לוח השבועות בסילבוס הרשמי של הקורס (פרופ' שנהב כהן): שבועות 1–2 פיזיולוגיה של התא, 3–4 אנטומיה, 5–6 הדם, 7–8 הכליה, 9–10 מערכת העצבים, 11–13 שריר ושלד. שלוש-עשרה היחידות כאן ממופות אחת-לאחת לשבועות האלה. הסילבוס אינו נושא שנה, ולכן ייתכנו שינויים בסמסטר הנוכחי.",
    links: [PORTAL],
  },
  tutorialOrder: null,
  schedule: "official",
  scheduleNoteHe: "לפי הסילבוס של מרצת הקורס (הנושאים וחלוקת השבועות). בחומרי הקורס יש ארבע חבילות תרגול מתועדות — הובלה, דיפוזיה ושטף, מערכת הדם והכליה — אבל אין לוח תרגולים מלא, ולכן התרגולים כאן מוצגים כתרגול על ההרצאה. הסילבוס מציין במפורש שהתרגולים מלמדים גם חומר שנסקר בהרצאה רק על קצה המזלג, והוא נבחן.",
  topics: [
    { titleHe: "פיזיולוגיה של התא: ממברנה, משאבות, נשאים ותעלות", items: [...sec(phTransport, "classes", "channel-structure", "pumps", "abc", "asymmetry", "secondary", "glut", "kinetics"), proc("membrane-transport", "cell-biology")] },
    { titleHe: "עקרונות הדיפוזיה והאוסמוזה", items: [...sec(phDiffusion), ...sec(phTransport, "osmosis", "epithelia")] },
    { titleHe: "אנטומיה של גוף האדם, כולל מערכת השלד", items: sec(phAnatomy) },
    { titleHe: "מערכת הדם: יצירת תאי הדם וקרישה", items: [...sec(phBlood), ...sec(phBloodDisorders)] },
    { titleHe: "מערכת ההפרשה: הכליה", items: [...sec(phKidneyFiltration), ...sec(phKidneyTubules), ...sec(phVolumePressure), proc("nephron-urine-formation")] },
    { titleHe: "מערכת העצבים", items: [...sec(phNervousSystem), ...sec(phMembranePotential), ...sec(phActionPotential), ...sec(phSynapse), proc("action-potential"), proc("synaptic-transmission")] },
    { titleHe: "מערכת השריר והשלד", items: [...sec(phSkeletalMuscle), ...sec(phMuscleAtrophy), ...sec(phSmoothCardiacMuscle), proc("muscle-contraction")] },
  ],
  lectures: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.items })),
  tutorials: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.practice })).filter((t) => t.items.length > 0),
};
