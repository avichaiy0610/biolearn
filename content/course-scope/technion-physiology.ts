import type { CourseScope, ScopeEntry } from "./types";

// Technion 134117 "פיזיולוגיה". Evidence available (2026-10-22): the official topic list on the students portal
// (detailed — names most subtopics), Moodle closed to guests. Reviewed row by row: subtopics the syllabus does not
// name (resting potential as such, cable properties, CSF/BBB, nerve regeneration, synaptic plasticity, motor units,
// RAAS details, countercurrent mechanism…) are "likely" under the heading they belong to.

const named = (topic: string, what?: string): ScopeEntry => ({
  level: "core", evidence: "syllabus-named",
  noteHe: what ? `הסילבוס הרשמי: "${topic}" — ${what}` : `הסילבוס הרשמי: "${topic}"`,
});
const heading = (topic: string, what: string): ScopeEntry => ({
  level: "likely", evidence: "syllabus-heading",
  noteHe: `נכלל בכותרת הסילבוס "${topic}", אבל ${what} לא מוזכר בשמו`,
});

// Official topics (verbatim, from the portal).
const PUMPS = "פיסיולוגיה של התא: מבנה ותפקוד של משאבות";
const CARRIERS = "נשאים ותעלות";
const KIDNEY = "פיסיולוגיה של מערכות: הכליה - סינון וספיגה";
const VOLUME = "בקרת נפח הדם ולחץ הדם";
const BLOOD = "מערכת הדם- הרכב הדם ותפקידיו";
const ERY = "אריתרופויאסיס, טסיות הדם וקרישת הדם";
const NS = "מערכת העצבים-המערכת המרכזית וההיקפית";
const EI = "נאורונים אקסיטטורים ואינהיביטורים";
const GLIA = "תאים תומכים ומעטפת המיאלין";
const AP = "פוטנציאל הפעולה וההעברה הסינפטית";
const MUSCLE = "שריר-שריר חלק ומשורטט";
const SKEL = "מנגנון התכווצות השריר המשורטט";
const NMJ = "הסינפסה הנאורו-מוסקולרית";
const CONTROL = "בקרת התכווצות של שריר חלק ושל שריר הלב";

export const technionPhysiologyScope: CourseScope = {
  courseSlug: "technion-physiology",
  checkedAt: "2026-10-22",
  defaultSource: { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134117" },
  sections: {
    "ph-transport": {
      "classes": named(PUMPS, "משאבות, נשאים ותעלות"),
      "pumps": named(PUMPS),
      "secondary": named(CARRIERS),
      "kinetics": named(CARRIERS),
      "osmosis": heading(PUMPS, "אוסמוזה ונפח התא"),
      "epithelia": heading(PUMPS, "הובלה דרך אפיתל"),
    },
    "ph-membrane-potential": {
      "gradients": named(CARRIERS, "המפלים שהמשאבות יוצרות"),
      "nernst": heading(AP, "פוטנציאל המנוחה ומשוואת Nernst"),
      "ghk": heading(AP, "משוואת GHK"),
      "driving-force": heading(AP, "הכוח המניע"),
      "potassium": heading(AP, "השפעת K⁺ חיצוני"),
    },
    "ph-action-potential": {
      "passive": heading(AP, "התגובה הפסיבית"),
      "phases": named(AP),
      "channels": named(AP),
      "refractory": named(AP),
      "conduction": named(AP),
      "myelin": named(GLIA),
    },
    "ph-nervous-system": {
      "neuron": named(NS),
      "axonal-transport": heading(NS, "הובלה אקסונית"),
      "cns-pns": named(NS),
      "glia": named(GLIA),
      "csf-bbb": heading(NS, "נוזל המוח ומחסום הדם-מוח"),
      "injury": heading(NS, "ניוון והתחדשות של עצב"),
    },
    "ph-synapse": {
      "types": named(AP),
      "release": named(AP),
      "receptors": named(AP),
      "epsp-ipsp": named(EI),
      "integration": named(EI),
      "plasticity": heading(AP, "שינויים בחוזק הסינפסה"),
      "transmitters": named(AP),
    },
    "ph-skeletal-muscle": {
      "structure": named(MUSCLE),
      "nmj": named(NMJ),
      "ec-coupling": named(SKEL),
      "cross-bridge": named(SKEL),
      "mechanics": named(SKEL),
      "motor-units": heading(SKEL, "יחידות מוטוריות וסוגי סיבים"),
    },
    "ph-smooth-cardiac-muscle": {
      "cardiac-structure": named(CONTROL),
      "cicr": named(CONTROL),
      "cardiac-regulation": named(CONTROL),
      "smooth-structure": named(MUSCLE),
      "smooth-mechanism": named(CONTROL),
      "smooth-calcium": named(CONTROL),
    },
    "ph-blood": {
      "composition": named(BLOOD),
      "erythrocytes": named(BLOOD),
      "erythropoiesis": named(ERY),
      "platelets": named(ERY),
      "coagulation": named(ERY),
      "anticoagulation": named(ERY, "קרישת הדם"),
    },
    "ph-kidney-filtration": {
      "anatomy": named(KIDNEY),
      "barrier": named(KIDNEY),
      "clearance": named(KIDNEY),
      "starling": named(KIDNEY),
      "autoregulation": named(KIDNEY),
    },
    "ph-kidney-tubules": {
      "overview": named(KIDNEY),
      "proximal": named(KIDNEY),
      "loop": named(KIDNEY),
      "distal": named(KIDNEY),
      "collecting": named(KIDNEY),
    },
    "ph-volume-pressure": {
      "two-systems": named(VOLUME),
      "adh": named(VOLUME),
      "concentration": heading(KIDNEY, "מנגנון הזרם הנגדי"),
      "volume-sensors": named(VOLUME),
      "raas": named(VOLUME),
      "blood-pressure": named(VOLUME),
    },
  },
};
