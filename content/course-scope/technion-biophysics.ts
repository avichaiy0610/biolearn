import type { CourseScope, ScopeEntry } from "./types";

// Technion 134156 "ביופיסיקה מולקולרית". Evidence available (2026-10-26): the current portal paragraph (8 topics), the
// official book list, and the older same-course description (134136: random walks, diffusion and friction; mechanical
// forces; processive enzymes as motors; single-molecule manipulation and analysis). No exams, reading list or staff
// material (Moodle closed). Levels: "core" where the paragraph names the topic or the section is part of it by
// definition; "likely" for sections only reachable under a broad heading; "extension" for the items Codex flagged
// (crowding/hydrophobic detail, Berg–Purcell, comparison table of other motors).

const named = (topic: string, what?: string): ScopeEntry => ({
  level: "core", evidence: "syllabus-named",
  noteHe: what ? `תיאור הקורס: "${topic}" — ${what}` : `תיאור הקורס: "${topic}"`,
});
const heading = (topic: string, what: string): ScopeEntry => ({
  level: "likely", evidence: "syllabus-heading",
  noteHe: `נכלל בנושא "${topic}" בתיאור הקורס, אבל ${what} לא מוזכר בשמו`,
});
const beyond = (what: string): ScopeEntry => ({
  level: "extension", evidence: "none",
  noteHe: `${what} — מעבר לתיאור הקורס; הסעיף הוא העשרה`,
});
const refresher = (topic: string, what: string): ScopeEntry => heading(topic, `${what} (רענון מקורס אחר)`);
const outside = (what: string): ScopeEntry => ({
  level: "extension", evidence: "none",
  noteHe: `${what} — סעיף ביחידה של קורס אחר שלא מקושר מהקורס הזה`,
});

const INTRO = "מבוא לעקרונות הפיסיקליים בדינמיקה התוך תאית";
const EQ = "שיווי משקל מכאני וכימי בהקשר הביולוגי";
const ENTROPY = "תהליכיים אנטרופיים מרכזיים בתא";
const WALK = "הליכת אקראי ומודלים למבנה של ביומולקולות";
const SM = "שיטות למניפולציות חד-מולקולריות ושימושיהן";
const DIFF = "דיפוזיה וחיכוך";
const RE = "החיים במספר ריינולדס נמוך";
const MOTORS = "אנזימים פרוססיביים כמנועים מולקולריים";

export const technionBiophysicsScope: CourseScope = {
  courseSlug: "technion-biophysics",
  checkedAt: "2026-10-26",
  defaultSource: { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134156" },
  sections: {
    "bp-scales": {
      numbers: named(INTRO, "גדלים ומספרים בתא"),
      times: named(INTRO, "סקאלות זמן"),
      "thermal-energy": named(INTRO, "האנרגיה התרמית"),
      forces: named(INTRO, "כוחות מולקולריים"),
      overdamped: named(INTRO, "תנועה מרוסנת"),
    },
    "bp-mechanical-equilibrium": {
      "force-potential": named(EQ, "שיווי משקל מכני"),
      boltzmann: named(EQ, "חוק בולצמן"),
      "two-state": named(EQ, "מערכת של שני מצבים"),
      equipartition: named(EQ, "חלוקה שווה"),
      "force-tilt": named(EQ, "כוח שמטה נוף אנרגיה"),
    },
    "bp-chemical-equilibrium": {
      "chemical-potential": named(EQ, "פוטנציאל כימי"),
      "mass-action": named(EQ, "חוק פעולת המסות"),
      binding: named(EQ, "עקומת קשירה"),
      atp: named(EQ, "ATP"),
      "chemical-work": named(EQ, "מאנרגיה כימית לעבודה"),
    },
    "bp-entropy": {
      counting: named(ENTROPY, "אנטרופיה וכוח אנטרופי"),
      osmosis: named(ENTROPY, "לחץ אוסמוטי"),
      "polymer-entropy": named(ENTROPY, "אנטרופיה של פולימר"),
      crowding: heading(ENTROPY, "כוחות דילול וצפיפות"),
      hydrophobic: heading(ENTROPY, "האפקט ההידרופובי"),
    },
    "bp-random-walk": {
      walk: named(WALK, "הליכת אקראי"),
      "diffusion-emerges": named(WALK, "הופעת הדיפוזיה"),
      msd: named(WALK, "MSD"),
      "transport-question": named(INTRO, "תובלה בתא"),
      "one-d": heading(WALK, "החלקה על DNA"),
    },
    "bp-polymers": {
      fjc: named(WALK, "שרשרת חופשית"),
      persistence: named(WALK, "אורך התמדה"),
      "force-extension": named(WALK, "כוח מול הארכה"),
      "high-force": named(SM, "DNA בכוחות גבוהים"),
    },
    "bp-diffusion-friction": {
      fick: named(DIFF, "חוק פיק"),
      friction: named(DIFF, "חיכוך צמיגי"),
      einstein: named(DIFF, "יחס איינשטיין"),
      "fluctuation-dissipation": named(DIFF, "פלקטואציה-דיסיפציה"),
      measuring: heading(DIFF, "מדידת דיפוזיה בתא"),
    },
    "bp-first-passage": {
      concept: heading(DIFF, "זמן מעבר ראשון"),
      "exponential-waits": heading(DIFF, "זמני המתנה"),
      smoluchowski: heading(DIFF, "קצב מוגבל-דיפוזיה"),
      search: heading(DIFF, "חיפוש בתא"),
    },
    "bp-low-reynolds": {
      reynolds: named(RE, "מספר ריינולדס"),
      scallop: named(RE, "משפט הצדפה"),
      flagella: named(RE, "שחייה בשוט"),
      chemotaxis: heading(RE, "כימוטקסיס"),
      peclet: heading(RE, "מספר פקלה"),
    },
    "bp-single-molecule": {
      why: named(SM, "למה מולקולה אחת"),
      "optical-tweezers": named(SM, "פינצטה אופטית"),
      calibration: named(SM, "כיול"),
      "other-methods": named(SM, "פינצטה מגנטית, AFM ו-smFRET"),
      traces: named(SM, "קריאת מסלולים"),
    },
    "bp-motor-principles": {
      cycle: named(MOTORS, "מחזור מכנו-כימי"),
      mechanisms: named(MOTORS, "מכת כוח ומחגר בראוני"),
      "force-velocity": named(MOTORS, "כוח ומהירות"),
      efficiency: named(MOTORS, "עבודה ויעילות"),
      randomness: heading(MOTORS, "פרמטר האקראיות"),
    },
    "bp-polymerases-helicases": {
      rnap: named(MOTORS, "RNA פולימראז"),
      pauses: named(MOTORS, "עצירות ונסיגה"),
      helicases: named(MOTORS, "הליקאזות"),
      "nucleosome-barrier": heading(MOTORS, "מנוע מול נוקלאוזום"),
      comparison: beyond("השוואה למנועים נוספים"),
    },
    "bp-case-studies": {
      transport: named(INTRO, "תובלה בתא"),
      "trap-design": named(SM, "תכנון ניסוי"),
      hairpin: named(EQ, "סיכה בשני מצבים"),
      barrier: named(MOTORS, "מנוע מול מחסום"),
      "concept-map": named(INTRO, "מפת מושגים"),
    },
    // refreshers from other courses (linked before the unit that needs them)
    "mv-surface-motility": {
      capsule: outside("קופסית"),
      pili: outside("פימבריות"),
      inclusions: outside("תכלילים"),
      flagellum: refresher(RE, "השוטון"),
      "surface-motility": outside("תנועה על משטחים"),
      chemotaxis: refresher(RE, "כימוטקסיס"),
    },
    "cell-motors-polarity": {
      motors: refresher(MOTORS, "משפחות מנועים"),
      kinesin: refresher(MOTORS, "קינזין"),
      cilia: outside("ריסים ושוטונים"),
      migration: outside("תא זוחל"),
      polarity: outside("קוטביות"),
    },
    "mol-transcription-prok": {
      basics: outside("עקרון השעתוק"),
      rnap: refresher(MOTORS, "RNA פולימראז בחיידקים"),
      promoter: outside("פרומוטור"),
      initiation: outside("התחלה"),
      termination: outside("סיום"),
      "cis-trans": outside("cis ו-trans"),
      "alt-sigma": outside("פקטורי סיגמא"),
    },
  },
};
