import type { CoursePlan } from "./types";
import { L, soon, REUSE_NOTE_HE, sessionsFromTopics } from "./helpers";

// TAU 0455-2580 "מיקרוביולוגיה" — phase-1 mapping (2026-11-25), no insider input.
// Topics: the official IMS syllabus (2025 — the 2026 page has no syllabus yet): virology of eukaryotic viruses (10 h), bacteriology (25 h), mycology (4 h).
// No detailed syllabus published (IMS 2023-2027 checked). Prerequisite: biochemistry. 13 drive files (phase 2).
// Phase 2 note: new pathogen/virology text is written in a separate Opus 5 session (memory: opus55-bio-flag-split).

const vir = L("mv-viruses"), vp = L("vr-properties"), ae = L("vr-attachment-entry"), gr = L("vr-genome-replication");
const env = L("mv-cell-envelope"), sm = L("mv-surface-motility"), gro = L("mv-growth"), md = L("mv-metabolic-diversity");
const nc = L("mv-nutrient-cycles"), eco = L("mv-ecology"), gt = L("mv-gene-transfer"), ph = L("mv-phages");
const ab = L("mv-antibiotics"), cl = L("mv-clinical"), evo = L("mv-evolution"), dv = L("mv-diversity");

const TOPICS: CoursePlan["topics"] = [
  { titleHe: "וירולוגיה: מבנה ומיון של נגיפים; נגיפי DNA ו-RNA", items: [vir("nature"), vir("structure"), vir("baltimore"), vp()] },
  { titleHe: "וירולוגיה: מחזור החיים הנגיפי", items: [vir("cycle"), ae(), L("vr-dna-expression")(), L("vr-rna-expression")(), gr(), L("vr-assembly-packaging")(), L("vr-exit")()] },
  { titleHe: "וירולוגיה: הדבקה חריפה, מתמשכת וחבויה", items: [vir("infection-types"), L("vr-latency")()] },
  { titleHe: "וירולוגיה: מחלות נגיפיות — התמרה סרטנית, פגיעה עצבית ופגיעה בחיסון", items: [L("ca-viruses")(), L("im-immunodeficiency")(), soon("יחידה מלאה: מחלות נגיפיות — פגיעה עצבית ודוגמאות קליניות")] },
  { titleHe: "וירולוגיה: חיסונים ותרופות — פוליו ו-HIV", items: [vir("antivirals"), L("im-infection")("vaccines"), soon("יחידה מלאה: חיסון הפוליו ותרופות נגד HIV")] },
  { titleHe: "בקטריולוגיה: מבוא — הייחוד של בקטריות וגישות המחקר", items: [L("mv-history")(), L("mv-methods")()] },
  { titleHe: "טקסונומיה, פילוגנטיקה ואקולוגיה; חיידקים וארכאות בתנאי קיצון", items: [evo(), dv(), L("mv-environment")("temperature"), L("mv-environment")("ph")] },
  { titleHe: "תזונה ומטבוליזם אנרגטי; אסימילציה של חנקן, פחמן וגופרית", items: [gro("media"), md(), nc()] },
  { titleHe: "גדילת חיידקים: חלוקה, שכפול הכרומוזום, תרבית מנתית ורציפה, ביופילמים", items: [gro(), eco("biofilm")] },
  { titleHe: "גנטיקה של חיידקים: ברירה, סריקה והעשרה", items: [gt("mutants"), L("sh-bacterial-genetics-methods")("enrichment"), L("sh-bacterial-genetics-methods")("mutant-hunts"), L("sh-bacterial-genetics-methods")("complementation")] },
  { titleHe: "מעבר גנים אופקי; בקטריופאג'ים; פלסמידים ומערכות רעלן-נוגדן", items: [gt(), ph(), L("vr-bacterial-defenses")(), L("sh-bacterial-genetics-methods")("plasmid-copy"), L("sh-bacterial-genetics-methods")("toxin-antitoxin")] },
  { titleHe: "בקרת ביטוי גנים בחיידקים ומערכות חישת מניין", items: [L("gx-operons")(), L("mol-transcription-prok")(), eco("quorum-sensing")] },
  { titleHe: "דופן התא החיידקי: ייחודיות וסינתזה", items: [env(), sm()] },
  { titleHe: "אנטיביוטיקות ומנגנוני עמידות", items: [ab()] },
  { titleHe: "גורמי מחלה בקטריאליים: קומנסליזם, פתוגנזה ותגובה חיסונית", items: [cl(), L("pg-microbiome")(), L("pg-adhesion")(), L("pg-invasion")(), L("pg-toxins")(), L("pg-evasion-regulation")(), L("mv-immunology")()] },
  { titleHe: "מיקולוגיה: ביולוגיה של הפטריות ומחלות בצמחים, בבעלי חיים ובאדם", items: [soon("יחידה מלאה: פטריות — ביולוגיה של התא ומחלות")] },
];

const IMS = { labelHe: "הסילבוס ב-IMS (תשפ\"ה)", url: "https://www.ims.tau.ac.il/Tal/Syllabus/Syllabus_L.aspx?course=0455258001&year=2025" };

export const tauMicrobiologyPlan: CoursePlan = {
  courseSlug: "tau-microbiology",
  lectureOrder: {
    confidence: "syllabus",
    noteHe: "אין לוח הרצאות פומבי. הסדר הוא סדר הנושאים בסילבוס הרשמי: וירולוגיה (10 שעות), בקטריולוגיה (25 שעות) ומיקולוגיה (4 שעות). " + REUSE_NOTE_HE,
    links: [IMS],
  },
  tutorialOrder: null,
  schedule: "suggested",
  scheduleNoteHe: "לפי סדר הנושאים בסילבוס הרשמי (IMS); אין לוח הרצאות פומבי.",
  topics: TOPICS,
  lectures: sessionsFromTopics(TOPICS),
  tutorials: [],
};
