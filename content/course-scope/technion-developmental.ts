import type { CourseScope, ScopeEntry } from "./types";

// Technion 134069 "ביולוגיה של ההתפתחות". Evidence available (2026-10-23): the current portal paragraph only (three
// parts, ~17 named topics). No reading list, exams or staff material (Moodle closed to guests). Levels reviewed with
// Codex before writing: "core" where the paragraph names the subject or the section is the minimum framework needed
// to explain it; "likely" for textbook mechanisms and case studies under a named heading.

const named = (topic: string, what?: string): ScopeEntry => ({
  level: "core", evidence: "syllabus-named",
  noteHe: what ? `הסילבוס הרשמי: "${topic}" — ${what}` : `הסילבוס הרשמי: "${topic}"`,
});
const heading = (topic: string, what: string): ScopeEntry => ({
  level: "likely", evidence: "syllabus-heading",
  noteHe: `נכלל בנושא "${topic}" בסילבוס, אבל ${what} לא מוזכר בשמו`,
});

const MORPH = "מורפוגנזה";
const PATTERN = "יצירת תבניות הגוף";
const GRAD = "גרדיינטים ושדות מורפוגנטיים";
const FLYORG = "התפתחות איברים בזבוב התסיסה מהעובר ועד הבוגר";
const HOX = "מורפוגנים, גני-על, וגנים הומיאוטיים";
const AXES = "הבסיס המולקולרי לקביעת הצירים בעוברי הנמטודה, העוף, והעכבר";
const CELLCELL = "תפקיד אינטראקציות תא-תא ואפופטוזיס בהתפתחות";
const IDENT = "זיהוי ובידוד גנים הקשורים להתפתחות";
const EXPR = "הבקרה על ביטוי גנים בהתפתחות";
const REGEN = "רגנרציה";
const SIZE = "קביעת גודל התא, דטרמינציה ודיפרנציאציה";
const GONAD = "יצירת אברי המין בנמטודה";
const EYE = "העין בזבוב התסיסה";
const LIMB = "הכנף בעוף, האצבעות בעכבר";
const POOL = "ממאגרי גנים דומים ליצירת אורגניזמים שונים";
const EVO = "שינויים אבולוציוניים בגנים התפתחותיים ובבקרה על ביטוי גנים";

export const technionDevelopmentalScope: CourseScope = {
  courseSlug: "technion-developmental",
  checkedAt: "2026-10-23",
  defaultSource: { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134069" },
  sections: {
    "dv-principles": {
      fate: named(SIZE, "דטרמינציה ודיפרנציאציה"),
      specification: heading(PATTERN, "סיווג אופני הקביעה (אוטונומית, מותנית, סינציטיאלית)"),
      morphogens: named(GRAD),
      induction: named(CELLCELL, "השראה"),
      morphogenesis: named(MORPH),
    },
    "dv-signaling": {
      logic: named(CELLCELL),
      pathways: heading(CELLCELL, "סקירת חמשת מסלולי האותות"),
      notch: heading(CELLCELL, "Notch ועיכוב לטרלי"),
      apoptosis: named(CELLCELL, "אפופטוזיס"),
    },
    "dv-fly-axes": {
      syncytium: heading(PATTERN, "השלב הסינציטיאלי"),
      maternal: named(GRAD, "המפלים האימהיים"),
      dorsal: heading(PATTERN, "הציר הגבי-בטני (Dorsal)"),
      zygotic: named(PATTERN, "מפל קביעת המקטעים"),
    },
    "dv-hox": {
      homeosis: named(HOX, "גנים הומיאוטיים"),
      selectors: named(HOX, "גני-על"),
      "fly-hox": heading(HOX, "מבנה האשכולות והקולינאריות"),
      "vertebrate-hox": heading(HOX, "קוד Hox בחולייתנים"),
    },
    "dv-fly-organs": {
      "imaginal-discs": named(FLYORG),
      wing: heading(FLYORG, "המדורים ו-Dpp/Wingless בדיסקת הכנף"),
      "eye-master": named(EYE),
      ommatidium: named(EYE, "בניית האומטידיום"),
    },
    "dv-worm": {
      model: named(AXES, "הנמטודה"),
      par: named(AXES, "קביעת הציר בנמטודה"),
      "early-fates": heading(AXES, "גורלות התאים המייסדים"),
      gonad: named(GONAD),
      vulva: named(GONAD, "הפות"),
      fusion: heading(GONAD, "איחוי תאים (EFF-1)"),
    },
    "dv-vertebrate-axes": {
      "chick-early": named(AXES, "העוף — הקשר העוברי"),
      "chick-axis": named(AXES, "העוף"),
      "mouse-early": named(AXES, "העכבר — הקשר העוברי"),
      "mouse-axis": named(AXES, "העכבר"),
      "left-right": heading(AXES, "האסימטריה ימין-שמאל"),
      organizers: heading(AXES, "ההשוואה למארגן של הצפרדע"),
    },
    "dv-limb": {
      initiation: heading(LIMB, "קביעת מקום הגפה"),
      axes: named(LIMB, "הכנף בעוף"),
      aer: named(LIMB, "הכנף בעוף"),
      zpa: named(LIMB, "האצבעות"),
      "dorsal-ventral": heading(LIMB, "הציר הגבי-גחוני"),
      digits: named(LIMB, "האצבעות בעכבר"),
    },
    "dv-genes": {
      forward: named(IDENT),
      tools: named(IDENT, "כלים"),
      "necessary-sufficient": heading(IDENT, "ניסויי אובדן והוספת תפקוד"),
      enhancers: named(EXPR),
      "master-genes": heading(EXPR, "גנים ראשיים (MyoD)"),
      determination: named(SIZE, "דטרמינציה ודיפרנציאציה"),
      "cell-size": named(SIZE, "קביעת גודל התא"),
    },
    "dv-regeneration": {
      types: named(REGEN),
      planaria: heading(REGEN, "הפלנריה"),
      salamander: heading(REGEN, "גפת הסלמנדרה"),
      "positional-memory": heading(REGEN, "זיכרון מיקום"),
      mammals: heading(REGEN, "התחדשות ביונקים"),
    },
    "dv-evo-devo": {
      toolkit: named(POOL),
      "deep-homology": named(POOL, "הומולוגיה עמוקה"),
      "cis-regulatory": named(EVO, "בקרה על ביטוי גנים"),
      "hox-body-plans": named(EVO, "גנים התפתחותיים"),
      "dorsal-ventral-inversion": heading(POOL, "היפוך הציר הגבי-גחוני"),
    },
  },
};
