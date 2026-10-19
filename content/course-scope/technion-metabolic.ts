import type { CourseScope, ScopeEntry } from "./types";

// Technion 134113 "מסלולים מטבוליים". Evidence available (2026-10-19): the official topic list on the students
// portal only (Moodle closed to guests), so the strongest level is "syllabus-named". Generated from `scope --suggest`
// and reviewed row by row: specific examples the syllabus does not name (PKU, Cori cycle, storage diseases…) are "likely".

const named = (topic: string, what?: string): ScopeEntry => ({
  level: "core", evidence: "syllabus-named",
  noteHe: what ? `הסילבוס הרשמי: "${topic}" — ${what}` : `הסילבוס הרשמי: "${topic}"`,
});
const heading = (topic: string, what: string): ScopeEntry => ({
  level: "likely", evidence: "syllabus-heading",
  noteHe: `נכלל בכותרת הסילבוס "${topic}", אבל ${what} לא מוזכר בשמו`,
});

// Official topics (verbatim, from the portal).
const CAT = "קטבולים ואנבוליזם, המסלול המטבולי. מנגנוני בקרה הפועלים במסלולים מטבולים";
const PATH = "תיאור המסלולים המרכזיים במטבוליזם התאי: גליקוליזה, מעגל החומצה הציטרית, זירחון חימצוני ופוטוסינטזה, מסלול הפנטוז פוספאט, גלוקונאוגנזה";
const STORE = "מאגרי אנרגיה מטבולית: גליקוגן וחומצות שומן והבקרה ההורמונלית על יצירתם ופירוקם";
const STRESS = "מטבוליזם במצבי עקה: רעב ומחלת הסוכרת";
const OTHER = "המטבוליזם של פוספוליפידים, כולסטרול, חומצות אמינו ונוקלאוטידים";
const INT = "אינטגרציה של המטבוליזם התאי";

export const technionMetabolicScope: CourseScope = {
  courseSlug: "technion-metabolic",
  checkedAt: "2026-10-19",
  defaultSource: { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134113" },
  sections: {
    "met-concepts": {
      "overview": named(CAT),
      "atp": heading(CAT, "ATP כמטבע אנרגיה"),
      "carriers": heading(CAT, "הנשאים המופעלים"),
      "regulation": named(CAT),
    },
    "met-glycolysis": {
      "overview": named(PATH),
      "investment": named(PATH),
      "payoff": named(PATH),
      "regulation": named(PATH),
      "pyruvate-fates": named(PATH),
      "other-sugars": heading(PATH, "כניסת פרוקטוז וגלקטוז"),
    },
    "met-gluconeogenesis": {
      "why": named(PATH),
      "bypasses": named(PATH),
      "cost": named(PATH),
      "reciprocal": named(PATH),
      "cori": heading(PATH, "מעגל קורי"),
    },
    "met-citric-acid": {
      "pdh": heading(PATH, "קומפלקס פירובט דהידרוגנאז"),
      "cycle": named(PATH),
      "yield": named(PATH),
      "regulation": named(PATH),
      "anaplerotic": heading(PATH, "תגובות אנאפלרוטיות"),
      "glyoxylate": heading(PATH, "מעגל הגליאוקסילט"),
    },
    "met-oxphos": {
      "overview": named(PATH),
      "chain": named(PATH),
      "atp-synthase": named(PATH),
      "yield": named(PATH),
      "control": named(PATH),
    },
    "met-photosynthesis": {
      "overview": named(PATH),
      "light": named(PATH),
      "z-scheme": named(PATH),
      "calvin": named(PATH),
      "photorespiration": heading(PATH, "נשימה אורית, C₄ ו-CAM"),
    },
    "met-pentose": {
      "overview": named(PATH),
      "nadph": named(PATH),
      "modes": named(PATH),
      "regulation": named(PATH),
      "g6pd-deficiency": heading(PATH, "מחסור ב-G6PD"),
    },
    "met-glycogen": {
      "structure": named(STORE),
      "breakdown": named(STORE),
      "synthesis": named(STORE),
      "allosteric": named(STORE),
      "hormones": named(STORE),
      "diseases": heading(STORE, "מחלות אגירת גליקוגן"),
    },
    "met-fatty-acids": {
      "storage": named(STORE),
      "activation": named(STORE),
      "beta-oxidation": named(STORE),
      "synthesis": named(STORE),
      "regulation": named(STORE),
      "ketone-bodies": heading(STORE, "גופי קטון"),
    },
    "met-integration": {
      "organs": named(INT),
      "hormones": named(INT),
      "fed-fasted": named(INT),
      "starvation": named(STRESS),
      "diabetes": named(STRESS),
      "exercise": heading(STRESS, "פעילות גופנית"),
      "ethanol": heading(STRESS, "מטבוליזם של אלכוהול"),
    },
    "met-lipids-cholesterol": {
      "phosphatidate": named(OTHER),
      "synthesis": named(OTHER),
      "regulation": named(OTHER),
      "lipoproteins": named(OTHER),
      "derivatives": heading(OTHER, "נגזרות הכולסטרול"),
    },
    "met-amino-acids": {
      "turnover": heading(OTHER, "פירוק חלבונים ביוביקוויטין"),
      "nitrogen": named(OTHER),
      "urea-cycle": named(OTHER),
      "carbon-fates": named(OTHER),
      "biosynthesis": named(OTHER),
      "pku": heading(OTHER, "פנילקטונוריה"),
    },
    "met-nucleotides": {
      "overview": named(OTHER),
      "pyrimidines": named(OTHER),
      "purines": named(OTHER),
      "deoxy": named(OTHER),
      "regulation": named(OTHER),
      "degradation": named(OTHER),
    },
  },
};
