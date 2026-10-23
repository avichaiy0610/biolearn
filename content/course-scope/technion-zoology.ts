import type { CourseScope, ScopeEntry } from "./types";

// Technion 134111 "זואולוגיה". Evidence available (2026-10-23): the current portal paragraph (topics only) and the
// official book list (Hickman, Integrated Principles of Zoology, on disk). No reading list, exams or staff material
// (Moodle closed to guests). Levels reviewed with Codex before writing: "core" only where the portal wording names
// the subject (or the section is that subject by definition); anything that is only part of a broader heading is "likely".

const named = (topic: string, what?: string): ScopeEntry => ({
  level: "core", evidence: "syllabus-named",
  noteHe: what ? `הסילבוס הרשמי: "${topic}" — ${what}` : `הסילבוס הרשמי: "${topic}"`,
});
const heading = (topic: string, what: string): ScopeEntry => ({
  level: "likely", evidence: "syllabus-heading",
  noteHe: `נכלל בנושא "${topic}" בסילבוס, אבל ${what} לא מוזכר בשמו`,
});

const INTRO = "מבוא לעולם החי";
const PROT = "חסרי חוליות - חד תאיים";
const SPCN = "ספוגים ונבובים";
const WORMS = "תולעים שטוחות, עגולות וטבעתיות";
const ARTH = "פרוקי רגליים";
const CHORD = "מיתרנים וחוליתנים - מוצא ותכונות יסוד";
const AMPH = "האמפיוקסוס כדוגמא";
const HIST = "יסודות ההיסטולוגיה (טיפוסי תאים והתארגנות לרקמות)";
const DIG = "אבולוציה וקשרי מבנה-תפקוד של מערכות העיכול";
const URO = "אבולוציה וקשרי מבנה-תפקוד של מערכות המין והשתן";
const RESP = "אבולוציה וקשרי מבנה-תפקוד של הנשימה";
const BLOOD = "מערכת הדם";
const CNS = "מערכת העצבים המרכזית והחושים";
const EMB = "עקרונות ההתפתחות העוברית";
const AXES = "התפתחות צירי הגוף";
const INT = "אבולוציה של האינטגומנט ותוצריו - קווי ההתפתחות של קשקשים, שערות ונוצות";

export const technionZoologyScope: CourseScope = {
  courseSlug: "technion-zoology",
  checkedAt: "2026-10-23",
  defaultSource: { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134111" },
  sections: {
    "z-intro": {
      "what-is-animal": named(INTRO),
      organization: heading(INTRO, "רמות הארגון"),
      symmetry: heading(INTRO, "סימטריה"),
      "germ-layers": heading(INTRO, "שכבות הנבט"),
      coelom: heading(INTRO, "חלל הגוף"),
      lineages: heading(INTRO, "החלוקה לפרוטוסטומים ודאוטרוסטומים"),
    },
    "z-protists": {
      who: named(PROT),
      locomotion: heading(PROT, "תנועה"),
      feeding: heading(PROT, "הזנה"),
      osmoregulation: heading(PROT, "ויסות אוסמוטי"),
      paramecium: heading(PROT, "הפרמציום"),
    },
    "z-sponges-cnidarians": {
      sponges: named(SPCN, "ספוגים"),
      "cnidarian-body": named(SPCN, "נבובים"),
      "polyp-medusa": heading(SPCN, "פוליפ ומדוזה"),
      cnidocyte: heading(SPCN, "התא הצורב"),
      corals: heading(SPCN, "אלמוגים"),
    },
    "z-worms": {
      comparison: named(WORMS),
      flatworms: named(WORMS, "תולעים שטוחות"),
      nematodes: named(WORMS, "תולעים עגולות"),
      annelids: named(WORMS, "תולעים טבעתיות"),
    },
    "z-arthropods": {
      exoskeleton: heading(ARTH, "השלד החיצוני"),
      molting: heading(ARTH, "הנשל"),
      appendages: heading(ARTH, "הגפיים"),
      systems: heading(ARTH, "מערכות הגוף"),
      groups: named(ARTH),
    },
    "z-histology": {
      tissue: named(HIST),
      epithelium: named(HIST, "אפיתל"),
      connective: named(HIST, "רקמת חיבור"),
      muscle: named(HIST, "רקמת שריר"),
      nervous: named(HIST, "רקמת עצב"),
    },
    "z-embryology": {
      fertilization: heading(EMB, "ההפריה"),
      cleavage: named(EMB, "חלוקה"),
      gastrulation: named(EMB, "גסטרולציה"),
      axes: named(AXES),
      neurulation: named(EMB, "נוירולציה"),
      amniote: heading(EMB, "קרומי העובר של האמניוטים"),
    },
    "z-chordates": {
      features: named(CHORD),
      amphioxus: named(AMPH),
      feeding: named("מערכת סינון והובלת המזון"),
      systems: named("מערכות מין ושתן, מערכת הדם", "באמפיוקסוס"),
      tunicates: heading(CHORD, "המעטפתנים"),
      vertebrates: named(CHORD, "חוליתנים"),
    },
    "z-digestive": {
      "feeding-modes": heading(DIG, "דרכי ההזנה"),
      regions: named(DIG),
      surface: heading(DIG, "הגדלת שטח הספיגה"),
      teeth: heading(DIG, "שיניים"),
      diet: heading(DIG, "תסיסה ומעלי גירה"),
    },
    "z-urogenital": {
      function: heading(URO, "תפקודי הכליה"),
      "kidney-series": named(URO, "מערכת השתן"),
      nitrogen: heading(URO, "הפרשת חנקן"),
      reproductive: named(URO, "מערכת המין"),
      fertilization: heading(URO, "הפריה פנימית וחיצונית"),
    },
    "z-respiration": {
      "water-vs-air": heading(RESP, "נשימה במים ובאוויר"),
      gills: named(RESP, "זימים"),
      amphibians: heading(RESP, "נשימה בדו-חיים"),
      "reptiles-mammals": heading(RESP, "נשימה בזוחלים ויונקים"),
      birds: heading(RESP, "נשימה בציפורים"),
      circulation: named(BLOOD),
    },
    "z-nervous-senses": {
      brain: named(CNS, "המוח"),
      "spinal-cord": named(CNS, "חוט השדרה"),
      eye: heading(CNS, "העין"),
      "hair-cells": heading(CNS, "תאי שערה"),
      "middle-ear": heading(CNS, "האוזן התיכונה"),
      olfaction: heading(CNS, "חוש הריח"),
    },
    "z-integument": {
      skin: named(INT, "האינטגומנט"),
      "fish-scales": named(INT, "קשקשים"),
      "reptile-scales": named(INT, "קשקשים"),
      feathers: named(INT, "נוצות"),
      hair: named(INT, "שערות"),
      placodes: named(INT, "קווי ההתפתחות"),
    },
  },
};
