import type { CourseScope, ScopeEntry } from "./types";

// Technion 134147 "מטבוליזם ומחלות באדם". Evidence available (2026-10-26): the current portal paragraph (Hebrew + English
// versions; a topic list) only — no books, reading, exams or staff material (Moodle closed to guests). Levels: "core"
// where the paragraph names the topic (three-tissue interactions; sugar/fat/protein metabolism in fed, fasted, diabetes,
// obesity, hyperlipidemia; disease mechanisms and therapeutic targets; muscle atrophy/weakness, UPS and autophagy) or the
// section is part of it by definition; "likely" where only the broad heading covers it; "extension" for sections the
// paragraph does not reach (diabetes complications detail, obesity genetics, atherosclerosis plaque biology).

const named = (topic: string, what?: string): ScopeEntry => ({
  level: "core", evidence: "syllabus-named",
  noteHe: what ? `תיאור הקורס: "${topic}" — ${what}` : `תיאור הקורס: "${topic}"`,
});
const heading = (topic: string, what: string): ScopeEntry => ({
  level: "likely", evidence: "syllabus-heading",
  noteHe: `נכלל בנושא "${topic}" בתיאור הקורס, אבל ${what} לא מוזכר בשמו`,
});
const refresher = (topic: string, what: string): ScopeEntry => heading(topic, `${what} (רענון מקורס קדם)`);
const outside = (what: string): ScopeEntry => ({
  level: "extension", evidence: "none",
  noteHe: `${what} — סעיף ביחידה של קורס אחר שלא מקושר מהקורס הזה`,
});

// 2026-11-08: the lecturer's own syllabus (13 weeks) and the 2024 slides are staff material — the strongest evidence.
const week = (n: number, what: string): ScopeEntry => ({
  level: "core", evidence: "staff-material",
  noteHe: `סילבוס המרצה (פרופ' שנהב כהן), שבוע ${n} — ${what}`,
});
const slides = (n: number, what: string): ScopeEntry => ({
  level: "core", evidence: "staff-material",
  noteHe: `שקפי הרצאה ${n} (2024) — ${what}`,
});

const TISSUES = "האינטראקציות המטבוליות בין שריר, כבד ורקמת שומן";
const FED = "מטבוליזם של סוכרים, שומנים וחלבונים במצבים של שובע ורעב";
const DIABETES = "סכרת";
const OBESITY = "השמנת יתר";
const LIPIDS = "היפרליפידמיה";
const MECH = "מנגנונים התורמים לפתולוגיה";
const TARGETS = "פקטורים בעלי תפקיד מפתח שיכולים להוות מטרה תיראפויטית";
const ATROPHY = "מנגנוני אטרופיה והיחלשות של שרירים";
const UPS = "muscle wasting by the ubiquitin-proteasome system and autophagy";

export const technionMetabolicDiseaseScope: CourseScope = {
  courseSlug: "technion-metabolic-disease",
  checkedAt: "2026-11-08",
  defaultSource: { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134147" },
  sections: {
    "md-crosstalk": {
      tissues: named(TISSUES, "תפקידי הרקמות"),
      fluxes: named(TISSUES, "זרימות בין הרקמות"),
      randle: heading(TISSUES, "התחרות בין גלוקוז לשומן"),
      endocrine: named(TISSUES, "רקמות כאיברים אנדוקריניים"),
      "disease-map": named(MECH, "מפת המחלות"),
    },
    "md-fed-fasted": {
      fed: named(FED, "שובע"),
      fasting: named(FED, "צום"),
      sensors: heading(FED, "AMPK ו-mTORC1"),
      "protein-balance": named(FED, "חלבונים"),
      starvation: named(FED, "רעב"),
    },
    "md-insulin-resistance": {
      definition: named(DIABETES, "תנגודת לאינסולין"),
      "ectopic-lipid": named(MECH, "שומן אקטופי"),
      inflammation: named(MECH, "דלקת"),
      selective: heading(MECH, "תנגודת סלקטיבית בכבד"),
      targets: named(TARGETS, "מטרות בתנגודת"),
    },
    "md-diabetes": {
      types: named(DIABETES, "סוגי הסוכרת"),
      "insulin-deficiency": named(DIABETES, "מחסור באינסולין ברקמות"),
      "type-2": named(DIABETES, "סוג 2 ברקמות"),
      "beta-failure": heading(DIABETES, "כשל תאי בטא"),
      treatments: named(TARGETS, "תרופות לסוכרת"),
      complications: week(6, "\"complications\" של הסוכרת"),
    },
    "md-obesity": {
      functions: named(OBESITY, "תפקידי רקמת השומן"),
      expansion: named(OBESITY, "התרחבות בריאה ופגומה"),
      leptin: named(OBESITY, "לפטין"),
      "genetics-environment": week(8, "\"Obesity: definition, causes and heredity\""),
      treatments: named(TARGETS, "טיפולים בהשמנה"),
    },
    "md-hyperlipidemia": {
      particles: named(LIPIDS, "סוגי החלקיקים"),
      "ldl-receptor": named(LIPIDS, "קולטן ה-LDL"),
      pcsk9: named(TARGETS, "PCSK9 והתרופות"),
      triglycerides: named(LIPIDS, "טריגליצרידים ו-LPL"),
      "liver-fat": heading(TISSUES, "כבד שומני"),
      atherosclerosis: week(11, "\"role of the liver, atherosclerosis\""),
    },
    "md-muscle-metabolism": {
      fuels: named(TISSUES, "דלק בשריר"),
      "glucose-uptake": named(TISSUES, "קליטת גלוקוז בשריר"),
      synthesis: named(FED, "בניית חלבון בשריר"),
      degradation: named(UPS, "מערכות הפירוק בשריר"),
      "why-mass": named(ATROPHY, "חשיבות מסת השריר והכוח"),
      satellite: week(2, "\"satellite cells\"; וגם בשקפי הרצאה 4 (טסטוסטרון ומספר תאי הלוויין) ובנושא \"Muscle hypertrophy and growth\""),
    },
    "md-atrophy-ups": {
      signals: named(ATROPHY, "האותות"),
      foxo: named(ATROPHY, "FoxO והאטרוגנים"),
      "e3-ligases": named(UPS, "MuRF1 ואטרוגין-1"),
      disassembly: named(UPS, "פירוק המיופיבריל"),
      targets: named(TARGETS, "מטרות באטרופיה"),
    },
    "md-autophagy": {
      machinery: named(UPS, "מכונת האוטופגיה"),
      regulation: named(UPS, "בקרת האוטופגיה בשריר"),
      flux: heading(UPS, "מדידת שטף"),
      protective: named(UPS, "אוטופגיה מגינה"),
      coordination: named(UPS, "תיאום עם הפרוטאזום"),
    },
    "md-wasting-states": {
      comparison: named(ATROPHY, "השוואה בין המחלות"),
      "metabolic-disease": named(ATROPHY, "סוכרת והשמנה"),
      cachexia: heading(ATROPHY, "קכקסיה"),
      disuse: heading(ATROPHY, "חוסר שימוש"),
      therapies: named(TARGETS, "טיפולים באטרופיה"),
    },
    "md-inborn-errors": {
      principles: slides(9, "עקרונות, תכונות, סימני אזהרה והיגיון הטיפול"),
      "amino-acids": slides(9, "פירוק חומצות אמינו ומעגל גלוקוז–אלנין"),
      pku: week(9, "\"Phenylketonuria — reduced metabolism of phenylalanine\""),
      "other-aa": slides(9, "אלקפטונוריה ומחלת שתן בריח סירופ מייפל"),
      "urea-cycle": week(9, "\"Urea cycle disorders\" — ארגינין, בנזואט ופניל-אצטט"),
      storage: slides(9, "פון גירקה, פומפה, קורי, לקטאז וטיי-זקס"),
      metabolomics: slides(9, "מטבולומיקה להסבר הפנוטיפ"),
    },
    "md-energy-metabolism": {
      atp: slides(10, "צימוד ל-ATP, ATP בשריר, ותחלופת ATP יומית"),
      creatine: slides(10, "קריאטין-פוספט"),
      interactosome: slides(10, "סידור המיטוכונדריות בתאי לב, MtCK והאינטראקטוזום"),
      "energy-charge": slides(10, "המטען האנרגטי"),
      balance: week(10, "\"Dynamics and regulation of energy balance ... energy expenditure on body composition and weight\""),
    },
    "md-calcium": {
      signal: slides(12, "סידן כשליח שני, קלמודולין, IP3"),
      flux: slides(12, "SERCA ושחרור מקומי בשריר"),
      muscle: slides(12, "איתות סידן ומטבוליזם בשריר; דליפה דרך RyR בהזדקנות"),
      homeostasis: week(12, "\"Maintenance of extracellular and intracellular concentrations and calcium homeostasis\""),
      disorders: week(12, "\"hypo- and hypercalcemia, pathological consequences\""),
    },
    "md-master-regulators": {
      overview: week(13, "\"Master regulators of metabolism\""),
      fgf21: week(13, "\"FGF-21\"; נשאל גם במועד א' 2022 (עכברים חסרי FGF21 בדיאטה קטוגנית)"),
      mtor: week(13, "\"mTOR\""),
      sirt1: week(13, "\"SIRT1\"; ובשקפי הרצאה 4: \"SIRT1 is a master regulator of muscle growth and atrophy\""),
      resistance: week(13, "\"metabolic resistance in disease\""),
    },
    // refreshers from prerequisite or neighbouring courses (linked before the unit that needs them)
    "met-integration": {
      organs: refresher(TISSUES, "חלוקת העבודה בין האיברים"),
      hormones: refresher(TISSUES, "אינסולין וגלוקגון"),
      "fed-fasted": refresher(FED, "מארוחה לצום"),
      starvation: refresher(FED, "רעב ממושך"),
      diabetes: outside("סוכרת — סקירה"),
      exercise: refresher(TISSUES, "פעילות גופנית"),
      ethanol: outside("אלכוהול והכבד"),
    },
    "met-gluconeogenesis": {
      why: outside("למה גלוקונאוגנזה"),
      bypasses: outside("עקיפות"),
      cost: outside("מחיר האנרגיה"),
      reciprocal: outside("בקרה הדדית"),
      cori: refresher(TISSUES, "מעגל קורי וגלוקוז-אלנין"),
    },
    "met-fatty-acids": {
      storage: refresher(OBESITY, "טריאצילגליצרולים"),
      activation: outside("שפעול והובלה"),
      "beta-oxidation": outside("β-חמצון"),
      "ketone-bodies": refresher(FED, "גופי קטון"),
      synthesis: outside("בניית חומצות שומן"),
      regulation: outside("בקרה הדדית"),
    },
    "met-lipids-cholesterol": {
      phosphatidate: outside("פוספטידאט"),
      synthesis: outside("בניית כולסטרול"),
      regulation: refresher(LIPIDS, "בקרת HMG-CoA רדוקטאז"),
      lipoproteins: refresher(LIPIDS, "ליפופרוטאינים"),
      derivatives: outside("תוצרי כולסטרול"),
    },
    "en-pancreas": {
      islets: outside("איי לנגרהנס"),
      secretion: refresher(DIABETES, "הפרשת אינסולין"),
      "insulin-actions": refresher(DIABETES, "פעולות האינסולין"),
      glucagon: outside("גלוקגון והצום"),
      diabetes: refresher(DIABETES, "סוכרת — סקירה"),
    },
    "cell-rtk": {
      activation: outside("הפעלת RTK"),
      sh2: outside("אתרי עגינה"),
      ras: outside("Ras–MAPK"),
      pi3k: refresher(DIABETES, "PI3K–Akt"),
      "jak-stat": outside("JAK–STAT"),
      drugs: outside("תרופות ממוקדות"),
    },
    "ph-skeletal-muscle": {
      structure: refresher(ATROPHY, "מבנה השריר והסרקומר"),
      nmj: outside("הסינפסה עצב-שריר"),
      "ec-coupling": outside("צימוד עירור-התכווצות"),
      "cross-bridge": outside("גשרי רוחב"),
      mechanics: outside("מכניקה"),
      "motor-units": outside("יחידות מוטוריות"),
    },
    "ub-conjugation": {
      ubiquitin: outside("היוביקוויטין"),
      cascade: refresher(UPS, "E1–E2–E3"),
      "e3-types": outside("משפחות ה-E3"),
      degrons: outside("דגרונים"),
      "quality-control": outside("בקרת איכות"),
      measuring: outside("מדידת פירוק"),
    },
    "ub-proteasome": {
      overview: refresher(UPS, "הפרוטאזום"),
      core: outside("הליבה 20S"),
      regulatory: outside("המכסה 19S"),
      cycle: outside("מחזור הפירוק"),
      alternatives: outside("p97 ופרוטאזומים חלופיים"),
      inhibitors: outside("מעכבי פרוטאזום"),
    },
    "cell-golgi-endosomes": {
      structure: outside("מבנה הגולג'י"),
      glycosylation: outside("גליקוזילציה"),
      maturation: outside("הבשלה"),
      "lysosome-sorting": outside("מיון לליזוזום"),
      endocytosis: outside("אנדוציטוזה"),
      endosomes: outside("אנדוזומים"),
      autophagy: refresher(UPS, "אוטופגיה"),
    },
    "ub-like": {
      family: outside("משפחת חלבונים דמויי יוביקוויטין"),
      sumo: outside("SUMO"),
      nedd8: outside("NEDD8"),
      lysosome: outside("ESCRT"),
      autophagy: refresher(UPS, "אוטופגיה סלקטיבית"),
    },
  },
};
