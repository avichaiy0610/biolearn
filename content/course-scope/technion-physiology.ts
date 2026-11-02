import type { CourseScope, ScopeEntry } from "./types";

// Technion 134117 "פיזיולוגיה". Evidence available (2026-10-22): the official topic list on the students portal
// (detailed — names most subtopics), Moodle closed to guests. Reviewed row by row: subtopics the syllabus does not
// name (resting potential as such, cable properties, CSF/BBB, nerve regeneration, synaptic plasticity, motor units,
// RAAS details, countercurrent mechanism…) are "likely" under the heading they belong to.
// Updated 2026-11-02: a second official document was found — the course's OWN syllabus by the lecturer,
// Prof. Shenhav Cohen (`syllabuses/_text/Syllabus Physiology 134117.pdf.txt`; its header wrongly carries 134147's
// name). It divides the 13 weeks into seven sessions and names subtopics the portal omits: principles of
// diffusion, ABC transporters, human anatomy, leuko/thrombopoiesis and muscle homeostasis/atrophy. Added to the
// evidence here, together with the lecturer's and tutors' own course material and the exams and homework
// (through 2023) in the student Drive.

const named = (topic: string, what?: string): ScopeEntry => ({
  level: "core", evidence: "syllabus-named",
  noteHe: what ? `הסילבוס הרשמי: "${topic}" — ${what}` : `הסילבוס הרשמי: "${topic}"`,
});
const heading = (topic: string, what: string): ScopeEntry => ({
  level: "likely", evidence: "syllabus-heading",
  noteHe: `נכלל בכותרת הסילבוס "${topic}", אבל ${what} לא מוזכר בשמו`,
});

// The lecturer's own syllabus (which divides the course into weeks), her and the tutors' course material, and
// the past exams and homework in the course Drive.
const lect = (topic: string, what?: string): ScopeEntry => ({
  level: "core", evidence: "syllabus-named",
  noteHe: what ? `הסילבוס של מרצת הקורס: "${topic}" — ${what}` : `הסילבוס של מרצת הקורס: "${topic}"`,
});
const staff = (what: string): ScopeEntry => ({
  level: "core", evidence: "staff-material",
  noteHe: `מחומרי הקורס עצמם: ${what}`,
});
const tested = (what: string): ScopeEntry => ({
  level: "core", evidence: "exam",
  noteHe: `נבחן בקורס: ${what}`,
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

// Topics named in the lecturer's own syllabus (the English wording is quoted in the notes).
const CELLPHYS = "פיזיולוגיה של התא (שבועות 1-2)";
const ANAT = "אנטומיה של גוף האדם לביולוגים של התא (שבועות 3-4)";
const BLOODW = "מערכת הדם (שבועות 5-6)";
const MSK = "מערכת השריר והשלד (שבועות 11-13)";

export const technionPhysiologyScope: CourseScope = {
  courseSlug: "technion-physiology",
  checkedAt: "2026-11-02",
  defaultSource: { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134117" },
  sections: {
    "ph-transport": {
      "classes": named(PUMPS, "משאבות, נשאים ותעלות"),
      "channel-structure": tested("מבחן 2022 מועד א' (למה תעלות מהירות פי 1000 מנשאים) ומועד ב' (TTX וה-selectivity filter; סלקטיביות בתעלות מים); בהרצאה: S1–S6, TVGYG ואנרגיית ההתייבשות"),
      "pumps": named(PUMPS),
      "abc": lect(CELLPHYS, 'הסעיף "Structure and function of ABC transporters"'),
      "asymmetry": lect(CELLPHYS, 'הסעיף "Principles of membrane asymmetry" — וגם אחת ממטרות הקורס; ABCB4 כמעביר PC נבחן ב-2011 וב-2014'),
      "secondary": named(CARRIERS),
      "glut": tested('תרגיל בית 1, תשפ"ג — שאלה של 40 נקודות על GLUT1 ו-GLUT4 ועל הזיקה שלהם לגלוקוז'),
      "kinetics": named(CARRIERS),
      "osmosis": staff("תרגול Topic 2C מוקדש לאוסמוזה, ותרגיל בית 3 תשפ\"ג מחשב שטף מים לליפוזום"),
      "epithelia": heading(PUMPS, "הובלה דרך אפיתל"),
    },
    "ph-membrane-potential": {
      "gradients": named(CARRIERS, "המפלים שהמשאבות יוצרות"),
      "nernst": tested("משוואת נרנסט מחושבת בתרגילי הבית ובמבחנים (למשל 2022 מועד א' ומועד ב')"),
      "ghk": staff("מחושבת בתרגולי הקורס לצד משוואת נרנסט"),
      "driving-force": staff("תרגולי הקורס — חישוב הכוח המניע מהפרש הפוטנציאלים"),
      "potassium": heading(AP, "השפעת K⁺ חיצוני"),
    },
    "ph-action-potential": {
      "passive": heading(AP, "התגובה הפסיבית"),
      "phases": named(AP),
      "channels": named(AP),
      "gating-mechanisms": tested("S4 כחיישן מתח, ball and chain וניסויי המחיקה והפפטיד בהרצאה; במבחן 2022 מועד א' ball and chain מופיע כמסיח בשאלה על מהירות התעלות, ובאותו מבחן נשאלת שאלה על מוטציות בתעלות Na⁺ ואובדן חוש הכאב"),
      "refractory": named(AP),
      "conduction": named(AP),
      "myelin": named(GLIA),
    },
    "ph-nervous-system": {
      "neuron": named(NS),
      "axonal-transport": heading(NS, "הובלה אקסונית"),
      "cns-pns": named(NS),
      "sensory": staff("הרצאת מערכת העצבים (2020): חישה, עיבוד ותגובה; קולטנים חושיים יונוטרופיים ומטבוטרופיים; קפסאיצין ו-TRPV1 והעצב הטריגמינלי"),
      "reflex": tested("\"מי מהבאים אינו מייצג תגובת רפלקס\" (2022 מועד ב'); קשת הרפלקס בהרצאת מערכת העצבים"),
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
      "drugs": tested("SSRI וקליטה חוזרת של סרוטונין (2009 מועד א'), קוקאין וקליטה חוזרת של דופמין (2012 מועד א', 2020 מועד ב'); בהרצאה: פרוזק וציפרלקס, ריטלין, פרקינסון וגזי עצבים"),
    },
    "ph-skeletal-muscle": {
      "structure": named(MUSCLE),
      "nmj": named(NMJ),
      "ec-coupling": named(SKEL),
      "cross-bridge": named(SKEL),
      "mechanics": named(SKEL),
      "motor-units": heading(SKEL, "יחידות מוטוריות וסוגי סיבים"),
    },
    // The portal names this topic, but the lecturer's own syllabus does not list cardiac or smooth muscle at all,
    // and the only question we found on them in the exams 2016-2022 is cardiac coupling through gap junctions.
    // The comparison and structure stay core; the detailed regulation mechanisms rest on the portal heading only.
    "ph-smooth-cardiac-muscle": {
      "cardiac-structure": named(CONTROL),
      "cicr": heading(CONTROL, "מנגנון ה-CICR ופוספולמבן"),
      "cardiac-regulation": heading(CONTROL, "הוויסות דרך β1 ו-PKA"),
      "smooth-structure": named(MUSCLE),
      "smooth-mechanism": heading(CONTROL, "מסלול Rho-kinase והרגישות לסידן"),
      "smooth-calcium": heading(CONTROL, "מצב ה-latch"),
    },
    "ph-diffusion": {
      "coefficient": lect(CELLPHYS, 'הסעיף "Principles of diffusion"'),
      "einstein": staff("תרגול Topic 2A — יחס איינשטיין וחישוב זמני דיפוזיה בתא אדום ובאקסון"),
      "fick": staff("תרגול Topic 2B — חוק פיק וחישובי שטף"),
      "permeability": tested('תרגיל בית 2, תשפ"ג — חישוב מקדם חדירות מתוך D, ‏K ועובי הממברנה'),
      "partition": tested('תרגיל בית 2, תשפ"ג — מקדם חלוקה מתוך ניסוי הפרדה'),
      "relaxation": tested('תרגיל בית 2, תשפ"ג — דעיכת הפרש הריכוזים בזמן'),
      "water": tested('תרגיל בית 3, תשפ"ג — חדירות מים של ליפוזום'),
      "limits": tested('תרגיל בית 2, תשפ"ג — הפער בין חדירות מדודה לחזויה בגלל משאבות הוצאה'),
    },
    "ph-anatomy": {
      "terms": staff("שיעור האנטומיה נפתח במונחי המיקום ובמישורי החתך"),
      "visceral-somatic": lect(ANAT, 'הסעיף "Visceral and Somatic systems"'),
      "skeleton": lect(ANAT, 'הסעיף "Skeletal system: axial and appendicular skeleton"'),
      "joints": lect(ANAT, 'הסעיף "joints, movement"'),
      "muscles": lect(ANAT, 'הסעיף "Key muscles and their innervation"'),
      "spine": lect(ANAT, 'הסעיף "spine and spinal column"'),
      "cranial-nerves": lect(ANAT, 'הסעיף "cranial and spinal nerves"'),
      "thorax": lect(ANAT, 'הסעיף "Thorax"'),
      "abdomen": lect(ANAT, 'הסעיף "Abdominal viscera"'),
      "tissues": staff("שיעור האנטומיה כולל את ארבע רקמות היסוד ואת שיטות ההדמיה"),
    },
    "ph-muscle-atrophy": {
      "definitions": lect(MSK, 'הסעיף "Muscle atrophy vs. dystrophy and hypertrophy"'),
      "balance": lect(MSK, 'הסעיף "Normal muscle homeostasis"'),
      "atrogenes": lect(MSK, 'הסעיף "Mechanisms of muscle atrophy"'),
      "signaling": staff("הרצאת המרצה על אטרופיה — PI3K/Akt מול FoxO, גלוקוקורטיקואידים וציטוקינים"),
      "ligases": tested("מבחן 2022 מועד ב' — פרשנות תוצאות של עכברים חסרי MuRF1"),
      "disassembly": staff("הרצאת המרצה וסיכום 2020 — דזמין, GSK3-β, קלפאין-1, Trim32 ו-p97/VCP"),
      "fiber-types": staff("הרצאת המרצה — רגישות סיבי II, ‏PGC-1α והשפעת אימון"),
      "therapy": lect(MSK, 'הסעיף "New concepts in the muscle field from the last decade"'),
    },
    "ph-blood-disorders": {
      "cbc": tested('תרגיל בית 4, תשפ"ג — קריאת ספירת דם מלאה'),
      "classification": staff("תרגול Topic 3A — אבחון אנמיות"),
      "iron": staff("תרגול Topic 3B — חסר ברזל ואנמיה של מחלה כרונית"),
      "thalassemia": staff("תרגול Topic 3B — תלסמיה α ו-β"),
      "sickle": staff("תרגול Topic 3B — אנמיה חרמשית"),
      "g6pd": staff("תרגול Topic 3C — חסר G6PD"),
      "hemolysis": staff("תרגול Topic 3C — המוליזה והמוגלובין החופשי"),
      "heterozygote": staff("תרגול Topic 3B — יתרון ההטרוזיגוט מול מלריה"),
      "polycythemia": staff("תרגול Topic 3C — פוליציתמיה ורה ו-JAK2"),
    },
    "ph-blood": {
      "composition": named(BLOOD),
      "erythrocytes": named(BLOOD),
      "erythropoiesis": named(ERY),
      "leukopoiesis": lect(BLOODW, 'הסעיף "Leukopoiesis"'),
      "thrombopoiesis": lect(BLOODW, 'הסעיף "Thrombopoiesis"'),
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
      "kidney-disease": tested("כליה פוליציסטית ושיבוש קליטת Ca²⁺ (2022 מועד ב'), תסמונת נפרוטית וטיפול בה (2022 מועד א'), קריאטינין גבוה כסימן לאי-ספיקה (2022 מועד ב'); בהרצאה: המטוריה, אנוריה והמודיאליזה"),
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
