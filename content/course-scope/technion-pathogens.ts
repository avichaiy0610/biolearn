import type { CourseScope, ScopeEntry } from "./types";

// Technion 066418 "מקרוביולוגיה של פתוגנים". Evidence available (2026-10-27): the current portal paragraph (the only
// official scope), plus a 2020/21 staff syllabus known ONLY from search-engine snippets — the moodle2222 server is
// unreachable, so it is treated as WEAK evidence ("historical") and never used to raise a section to core on its own.
// No exams, reading list or staff material. Levels: "core" where the portal paragraph names the topic or the section
// is part of it by definition; "likely" where the section is a teaching choice under a named heading; "extension"
// for what Codex marked optional (biosensors, detailed MALDI-TOF, phage biocontrol, genome reduction, extensive
// antigenic variation) and for refresher sections of 134121 that this course does not link.

const named = (topic: string, what?: string): ScopeEntry => ({
  level: "core", evidence: "syllabus-named",
  noteHe: what ? `תיאור הקורס: "${topic}" — ${what}` : `תיאור הקורס: "${topic}"`,
});
const heading = (topic: string, what: string): ScopeEntry => ({
  level: "likely", evidence: "syllabus-heading",
  noteHe: `נכלל בנושא "${topic}" בתיאור הקורס, אבל ${what} לא מוזכר בשמו`,
});
const historical = (what: string): ScopeEntry => ({
  level: "likely", evidence: "syllabus-heading",
  noteHe: `${what} — מופיע בסילבוס הסגל מ-2020/21 בלבד, שאינו נגיש כיום (מוכר מקטעי חיפוש); ראיה חלשה`,
});
const beyond = (what: string): ScopeEntry => ({
  level: "extension", evidence: "none",
  noteHe: `${what} — מעבר לתיאור הקורס; הסעיף הוא העשרה`,
});
const refresher = (topic: string, what: string): ScopeEntry => heading(topic, `${what} (רענון מקורס מיקרוביולוגיה ווירולוגיה)`);
const outside = (what: string): ScopeEntry => ({
  level: "extension", evidence: "none",
  noteHe: `${what} — סעיף ביחידה של קורס אחר שלא מקושר מהקורס הזה`,
});

const PHYS = "פיזיולוגיה של מיקרואורגניזמים פתוגנים לאדם שמקורם במזון ובמים";
const MECH = "אפיון מנגנונים מולקולריים הקשורים בפתוגניות: היצמדות, חדירה לרקמה, הרס תאים";
const IMMUNE = "דרכי התגוננות מפני מערכת החיסון";
const EMERGE = "הסיבות להופעת פתוגנים חדשים, או רכישה של תכונות פתוגניות";
const DETECT = "שיטות זיהוי קונבנציונליות ומולקולריות";
const ANTI = "מנגנוני פעולה של חומרים אנטיבקטריאליים ורכישת עמידות";
const RISK = "מודלים מתמטיים להערכת סיכון";

export const technionPathogensScope: CourseScope = {
  courseSlug: "technion-pathogens",
  checkedAt: "2026-10-27",
  defaultSource: { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/066418" },
  sections: {
    "pg-intro": {
      mechanisms: named(PHYS, "זיהום, הרעלה וזיהום-רעלני"),
      dose: heading(PHYS, "מנה מדבקת כהסתברות"),
      commensal: historical("ההבחנה בין מיקרוביום וקומנסלים לבין פתוגנים"),
      causation: heading(PHYS, "הנחות קוך והנחות פלקאו"),
    },
    "pg-physiology": {
      persistence: named(PHYS, "שרידות מחוץ למארח"),
      stress: named(PHYS, "תגובות עקה"),
      cold: named(PHYS, "התרבות בקירור"),
      spores: heading(PHYS, "נבגים כצורת עמידות"),
      biofilm: heading(PHYS, "ביופילם"),
      vbnc: heading(PHYS, "תאים שאינם ניתנים לגידול"),
    },
    "pg-adhesion": {
      why: named(MECH, "היצמדות כתנאי להתיישבות"),
      adhesins: named(MECH, "אדהזינים וקולטנים"),
      intimate: heading(MECH, "מגע הדוק ושינוי בתא המארח"),
      evidence: heading(MECH, "ראיות לחיוניות של אדהזין"),
    },
    "pg-invasion": {
      barrier: named(MECH, "חדירה לרקמה"),
      "two-strategies": named(MECH, "אסטרטגיות כניסה"),
      niche: heading(MECH, "תא מחיה תוך-תאי"),
      spread: heading(MECH, "התפשטות בין תאים"),
      evidence: heading(MECH, "ראיות לחדירה"),
    },
    "pg-toxins": {
      axes: named(MECH, "סיווג גורמי נזק"),
      ab: named(MECH, "ארכיטקטורה דו-תפקודית"),
      pores: named(MECH, "יצירת נקבים בקרום"),
      superantigens: heading(MECH, "הפעלה רחבה של מערכת החיסון"),
      endotoxin: named(MECH, "רכיב מבני של הדופן"),
    },
    "pg-evasion-regulation": {
      barriers: named(IMMUNE, "רצף המחסומים"),
      phagocytes: named(IMMUNE, "הימנעות מבליעה והישרדות בתוכה"),
      iron: heading(IMMUNE, "תחרות על ברזל"),
      "two-component": heading(IMMUNE, "מערכת חישה דו-רכיבית"),
      conditional: heading(IMMUNE, "ביטוי מותנה של גורמי אלימות"),
    },
    "pg-viruses-molds": {
      "no-growth": named(PHYS, "נגיפים אינם מתרבים במזון"),
      stability: named(PHYS, "יציבות והישרדות של חלקיקים"),
      "dose-quantification": heading(PHYS, "מנה וכימות של חלקיקים"),
      "mold-growth": named(PHYS, "פיזיולוגיה של עובשים ונבגים"),
      "two-harms": named(PHYS, "מחלה פטרייתית לעומת פגיעה מתוצר"),
    },
    "pg-emergence": {
      islands: named(EMERGE, "איים של פתוגניות"),
      vehicles: named(EMERGE, "פאג'ים ופלסמידים כנשאים"),
      "acquisition-expression": heading(EMERGE, "רכישה לעומת ביטוי"),
      ecology: named(EMERGE, "שינויים בייצור, באספקה ובאוכלוסייה"),
      hybrid: heading(EMERGE, "צירוף תכונות משתי קבוצות"),
    },
    "pg-detection-conventional": {
      sampling: heading(DETECT, "ייצוגיות הדגימה"),
      enrichment: named(DETECT, "העשרה"),
      media: named(DETECT, "מצעים בוררים ומבחינים"),
      indicator: heading(DETECT, "אורגניזם מורה"),
      strain: heading(DETECT, "אפיון ברמת הזן"),
    },
    "pg-detection-molecular": {
      amplification: named(DETECT, "שיטות הגברה"),
      "four-questions": heading(DETECT, "מה נמדד: נוכחות, חיוניות, הדבקה ופעילות"),
      immunoassays: named(DETECT, "בדיקות מבוססות נוגדנים"),
      wgs: heading(DETECT, "ריצוף גנום מלא בחקירת אירוע"),
    },
    "pg-antimicrobials": {
      "two-families": named(ANTI, "תרופות לעומת חומרי חיטוי"),
      targets: named(ANTI, "מנגנוני פעולה לפי מטרה"),
      "resistance-mechanisms": named(ANTI, "מנגנוני עמידות"),
      tolerance: heading(ANTI, "עמידות לעומת סבילות"),
      selection: named(ANTI, "לחץ בררני ורכישת עמידות"),
      "lab-to-field": heading(ANTI, "מתנאי מעבדה ליישום"),
    },
    "pg-predictive": {
      "d-value": named(RISK, "ערך D והפחתה בסדרי גודל"),
      "z-value": named(RISK, "ערך z ותלות בטמפרטורה"),
      deviations: heading(RISK, "כתף וזנב"),
      growth: named(RISK, "פרמטרי גדילה"),
      "model-levels": heading(RISK, "מודל ראשוני, משני ואימות"),
      limits: heading(RISK, "מגבלות המודל"),
    },
    "pg-risk": {
      "four-steps": named(RISK, "ארבעת שלבי ההערכה"),
      exposure: named(RISK, "הערכת חשיפה"),
      exponential: named(RISK, "מודל מנה-תגובה מעריכי"),
      "beta-poisson": heading(RISK, "הצורה המקורבת של בטא-פואסון"),
      endpoints: heading(RISK, "הדבקה לעומת מחלה"),
      "variability-uncertainty": heading(RISK, "שונות לעומת אי-ודאות"),
    },
    // refresher sections from 134121 (linked after the local unit that needs them)
    "mv-clinical": {
      concepts: refresher(PHYS, "מושגי מארח-פתוגן"),
      stages: refresher(MECH, "שלבי ההדבקה"),
      toxins: refresher(MECH, "אקסוטוקסינים ואנדוטוקסין"),
      koch: refresher(PHYS, "הנחות קוך"),
      lab: refresher(DETECT, "המעבדה הקלינית"),
      ast: refresher(ANTI, "בדיקת רגישות"),
      "immuno-molecular": refresher(DETECT, "אבחון אימונולוגי ומולקולרי"),
      hai: outside("זיהומים במוסדות רפואיים"),
      epidemiology: refresher(PHYS, "אפידמיולוגיה"),
    },
    "mv-antibiotics": {
      "selective-toxicity": refresher(ANTI, "רעילות בררנית"),
      targets: refresher(ANTI, "מטרות"),
      mechanisms: refresher(ANTI, "מנגנוני עמידות"),
      spread: refresher(ANTI, "התפשטות עמידות"),
      tolerance: refresher(ANTI, "סבילות"),
      countermeasures: refresher(ANTI, "התמודדות"),
    },
    "mv-environment": {
      temperature: refresher(PHYS, "טמפרטורה"),
      ph: refresher(PHYS, "חומציות"),
      water: refresher(PHYS, "זמינות מים"),
      oxygen: outside("חמצן"),
      "control-terms": outside("מושגי שליטה בגדילה"),
      "physical-control": refresher(RISK, "חום, קרינה וסינון"),
      "chemical-control": refresher(ANTI, "חומרים כימיים"),
    },
    "mv-growth": {
      media: outside("מצעים"),
      division: outside("חלוקה בינארית"),
      counting: refresher(DETECT, "ספירת תאים"),
      exponential: refresher(RISK, "גדילה אקספוננציאלית"),
      "growth-curve": refresher(PHYS, "עקומת הגדילה"),
      chemostat: outside("תרבית רציפה"),
    },
    "mv-surface-motility": {
      capsule: refresher(IMMUNE, "קופסית"),
      pili: refresher(MECH, "פימבריות"),
      inclusions: outside("תכלילים"),
      flagellum: outside("השוטון"),
      "surface-motility": outside("תנועה על משטחים"),
      chemotaxis: outside("כמוטקסיס"),
    },
    "mv-immunology": {
      barriers: refresher(IMMUNE, "מחסומים"),
      cells: outside("תאי מערכת החיסון"),
      innate: refresher(IMMUNE, "החיסון המולד"),
      adaptive: outside("החיסון הנרכש"),
      antibodies: outside("נוגדנים"),
      "mhc-t": outside("MHC ותאי T"),
      memory: outside("זיכרון חיסוני"),
      "immunity-types": outside("סוגי חסינות"),
    },
    "mv-gene-transfer": {
      mutants: outside("מוטנטים וברירה"),
      transformation: refresher(EMERGE, "טרנספורמציה"),
      transduction: refresher(EMERGE, "טרנסדוקציה"),
      conjugation: refresher(EMERGE, "קוניוגציה"),
      plasmids: refresher(EMERGE, "פלסמידים"),
      transposons: refresher(EMERGE, "אלמנטים ניידים"),
      "hgt-significance": refresher(EMERGE, "משמעות ההעברה האופקית"),
    },
    "mv-phages": {
      structure: outside("מבנה פאג'ים"),
      lytic: outside("המחזור הליטי"),
      lysogeny: outside("ליזוגניה"),
      "lysogenic-conversion": refresher(EMERGE, "המרה ליזוגנית"),
      defenses: outside("הגנות החיידק"),
      applications: beyond("פאג'ים כתרופה וככלי"),
    },
  },
};
