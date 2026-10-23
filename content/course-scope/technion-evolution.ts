import type { CourseScope, ScopeEntry } from "./types";

// Technion 134133 "אבולוציה". Evidence available (2026-10-22): the current portal paragraph (topics only) and the
// official book (Barton et al., Evolution), whose chapters the paragraph follows. No reading list, exams or staff
// material (Moodle closed to guests). Levels were reviewed independently by Codex before writing: "core" only where
// the portal wording itself names the subject; anything that is only part of a broader heading is "likely".

const named = (topic: string, what?: string): ScopeEntry => ({
  level: "core", evidence: "syllabus-named",
  noteHe: what ? `הסילבוס הרשמי: "${topic}" — ${what}` : `הסילבוס הרשמי: "${topic}"`,
});
const heading = (topic: string, what: string): ScopeEntry => ({
  level: "likely", evidence: "syllabus-heading",
  noteHe: `נכלל בנושא "${topic}" בסילבוס, אבל ${what} לא מוזכר בשמו`,
});

const EVID = "ההוכחות לקיום אבולוציה של החיים";
const DIV = "היווצרות השונות של חיידקים, ארכיאה ואיאוקריוטים";
const ANH = "תוך שימת דגש על אבולוציה של חיות ובני האדם";
const SEL = "ברירה טבעית";
const DRIFT = "סחף גנטי ומבנה אוכלוסיה";
const MEAS = "מדידת הסלקציה הפועלת על השונות והאינטראקציה שלה עם כוחות נוספים";
const MULTI = "אבולוציה של אורגניזמים רב תאיים התפתחות";
const GSYS = "מערכות גנטיות חדשות";

export const technionEvolutionScope: CourseScope = {
  courseSlug: "technion-evolution",
  checkedAt: "2026-10-23",
  defaultSource: { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134133" },
  sections: {
    "ev-evidence": {
      claims: named(EVID),
      trees: heading(EVID, "קריאת עצים פילוגנטיים"),
      fossils: named(EVID, "מאובנים"),
      homology: named(EVID, "הומולוגיה"),
      molecular: named(EVID, "עדויות מולקולריות"),
      observed: named(EVID, "אבולוציה שנצפתה"),
    },
    "ev-tree-of-life": {
      "rrna-tree": named(DIV),
      "bacteria-archaea": named(DIV),
      luca: heading(DIV, "האב הקדמון האוניברסלי (LUCA)"),
      diversification: named(DIV),
      hgt: heading(DIV, "העברה אופקית של גנים"),
    },
    "ev-eukaryotes": {
      novelties: named(DIV, "האאוקריוטים"),
      endosymbiosis: heading(DIV, "האנדוסימביוזה"),
      "gene-transfer": heading(DIV, "העברת גנים מהאברונים לגרעין"),
      secondary: heading(DIV, "אנדוסימביוזה משנית"),
      host: heading(DIV, "המאכסן הארכאי"),
      diversity: named(DIV, "הגיוון של האאוקריוטים"),
    },
    "ev-animals": {
      origin: heading(ANH, "מוצא בעלי החיים"),
      cambrian: heading(ANH, "הפיצוץ הקמבריוני"),
      "body-plans": named(ANH, "אבולוציה של חיות"),
      vertebrates: heading(ANH, "המעברים בשושלת החולייתנים"),
      extinctions: heading(ANH, "הכחדות המוניות"),
    },
    "ev-human": {
      apes: named(ANH, "אבולוציה של בני האדם"),
      bipedalism: named(ANH, "אבולוציה של בני האדם"),
      homo: named(ANH, "אבולוציה של בני האדם"),
      "out-of-africa": named(ANH, "אבולוציה של בני האדם"),
      admixture: heading(ANH, "ההכלאה עם ניאנדרטלים ודניסובנים"),
      "recent-selection": heading(ANH, "ברירה באדם בזמן האחרון"),
    },
    "ev-selection": {
      conditions: named(SEL),
      variation: heading(SEL, "מקורות השונות"),
      "hardy-weinberg": heading(SEL, "עקרון הרדי-ויינברג"),
      "selection-model": named(SEL),
      quantitative: named(SEL, "ברירה על תכונות כמותיות"),
      "other-forms": heading(SEL, "ברירה תלוית-תדירות וברירה זוויגית"),
    },
    "ev-drift": {
      sampling: named(DRIFT, "סחף גנטי"),
      fixation: named(DRIFT, "סחף גנטי"),
      ne: named(DRIFT, "סחף גנטי — גודל אוכלוסייה"),
      bottleneck: heading(DRIFT, "צוואר בקבוק ואפקט מייסד"),
      "neutral-theory": heading(DRIFT, "התאוריה הניטרלית והשעון המולקולרי"),
    },
    "ev-population-structure": {
      subdivision: named(DRIFT, "מבנה אוכלוסיה"),
      fst: heading(DRIFT, "המדד F_ST"),
      "gene-flow": named(DRIFT, "מבנה אוכלוסיה — זרימת גנים"),
      inbreeding: heading(DRIFT, "הזדווגות בין קרובים"),
      humans: heading(DRIFT, "מבנה האוכלוסייה האנושית"),
    },
    "ev-selection-forces": {
      "selection-drift": named(MEAS, "האינטראקציה של הסלקציה עם סחף"),
      cline: named(MEAS, "האינטראקציה של הסלקציה עם הגירה"),
      balancing: heading(MEAS, "ברירה מאזנת"),
      "mutation-selection": named(MEAS, "האינטראקציה של הסלקציה עם מוטציה"),
    },
    "ev-measuring-selection": {
      direct: named(MEAS, "מדידת הסלקציה"),
      competition: named(MEAS, "מדידת הסלקציה"),
      response: heading(MEAS, "התגובה לברירה ומשוואת המגדלים"),
      dnds: heading(MEAS, "היחס dN/dS"),
      sweep: heading(MEAS, "סחף ברירה"),
      summary: named(MEAS, "מדידת הסלקציה"),
    },
    "ev-evo-devo": {
      origins: named(MULTI, "אבולוציה של אורגניזמים רב-תאיים"),
      volvocine: heading(MULTI, "האצות הוולבוקסיות"),
      requirements: named(MULTI, "אבולוציה של אורגניזמים רב-תאיים"),
      toolkit: named(MULTI, "התפתחות"),
      "deep-homology": heading(MULTI, "הומולוגיה עמוקה"),
      "cis-regulation": named(MULTI, "התפתחות — שינוי בתוכניות ההתפתחות"),
    },
    "ev-genetic-systems": {
      overview: named(GSYS),
      "mutation-rate": heading(GSYS, "האבולוציה של קצב המוטציה"),
      "cost-of-sex": heading(GSYS, "המחיר של רבייה מינית"),
      "why-sex": heading(GSYS, "היתרונות של רקומבינציה"),
      "y-chromosome": heading(GSYS, "ניוון כרומוזום Y"),
      consequences: heading(GSYS, "אניזוגמיה ודיפלואידיות"),
    },
  },
};
