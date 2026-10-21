import type { CourseScope, ScopeEntry } from "./types";

// Technion 134128 "ביולוגיה של התא". Evidence available (2026-10-21): the official topic list on the students
// portal only (Moodle closed to guests), so the strongest level is "syllabus-named". Reviewed row by row: subtopics
// the syllabus does not name (UPR, autophagy, cilia, cell migration, vision, JAK–STAT, targeted drugs…) are "likely".

const named = (topic: string, what?: string): ScopeEntry => ({
  level: "core", evidence: "syllabus-named",
  noteHe: what ? `הסילבוס הרשמי: "${topic}" — ${what}` : `הסילבוס הרשמי: "${topic}"`,
});
const heading = (topic: string, what: string): ScopeEntry => ({
  level: "likely", evidence: "syllabus-heading",
  noteHe: `נכלל בכותרת הסילבוס "${topic}", אבל ${what} לא מוזכר בשמו`,
});

// Official topics (verbatim, from the portal).
const MEM = "ממברנת-מבנה ותפקוד (ריענון)";
const ER = "איברוני התא האאוקריוטי: הרטיקולום האנדופלסמטי-טרנסלוקציה תוך תרגום";
const QC = "בקרת איכות ופירוק חלבונים פגומים במערכת היוביקואיטין";
const GOL = "הגולג'י ומערך האנדוזומים";
const VES = "מנגנוני הטרנספורט הווסיקולרי";
const IMP = "טרנספורט אחר-תרגומי לגרעין התא ולמיטוכונדריה";
const CYT = "שלד התא-חלבוני השלד ותפקודם בתא";
const POL = "תאים קוטביים";
const JN = "מתא לרקמה: תאחיזה בין תאים לבין עצמם - צמתים בין תאים";
const ECM = "המטריקס החוץ-תאי ותפקידו בעיגון תאים והעברת איתותים";
const SIG = "תקשורת בין תאים - מנגנוני העברת אותות באמצעות קולטנים ממברנלים";
const PATH = "מסלולי העברת האותות העיקריים באמצעות RTKS/GPCR";
const CC = "בקרת מחזור התא-מנגנונים מולקולרים";

export const technionCellScope: CourseScope = {
  courseSlug: "technion-cell",
  checkedAt: "2026-10-21",
  defaultSource: { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134128" },
  sections: {
    "cell-membranes": {
      "bilayer": named(MEM),
      "lipids": named(MEM),
      "fluidity": named(MEM),
      "asymmetry": named(MEM),
      "proteins": named(MEM),
      "functions": named(MEM),
    },
    "cell-er": {
      "organelles": named(ER, "איברוני התא"),
      "signals": named(ER),
      "srp": named(ER, "טרנסלוקציה תוך תרגום"),
      "sec61": named(ER, "טרנסלוקציה תוך תרגום"),
      "membrane-proteins": heading(ER, "הכנסת חלבוני ממברנה (טופולוגיה)"),
      "er-functions": heading(ER, "תפקידי ה-ER מעבר לטרנסלוקציה"),
    },
    "cell-quality-control": {
      "folding": named(QC, "בקרת איכות"),
      "calnexin": named(QC, "בקרת איכות"),
      "erad": named(QC, "פירוק חלבונים פגומים"),
      "upr": heading(QC, "תגובת החלבונים הלא מקופלים (UPR)"),
      "ups": named(QC, "מערכת היוביקוויטין"),
      "regulated": heading(QC, "פירוק מווסת של חלבונים תקינים"),
    },
    "cell-golgi-endosomes": {
      "structure": named(GOL),
      "glycosylation": heading(GOL, "גליקוזילציה בגולג'י"),
      "maturation": heading(GOL, "מודל ההבשלה של הבורות"),
      "lysosome-sorting": named(GOL),
      "endocytosis": named(GOL, "מערך האנדוזומים"),
      "endosomes": named(GOL, "מערך האנדוזומים"),
      "autophagy": heading(GOL, "אוטופגיה"),
    },
    "cell-vesicle-transport": {
      "cycle": named(VES),
      "coats": named(VES),
      "dynamin": named(VES),
      "rab": named(VES),
      "snares": named(VES),
      "retrieval": named(VES),
      "secretion": named(VES),
    },
    "cell-nuclear-mito-import": {
      "pore": named(IMP, "לגרעין"),
      "nls": named(IMP, "לגרעין"),
      "ran": named(IMP, "לגרעין"),
      "control": heading(IMP, "בקרה על המעבר לגרעין"),
      "mitochondria": named(IMP, "למיטוכונדריה"),
    },
    "cell-cytoskeleton": {
      "types": named(CYT),
      "actin": named(CYT),
      "abps": named(CYT),
      "mt-structure": named(CYT),
      "dynamic-instability": named(CYT),
      "intermediate": named(CYT),
    },
    "cell-motors-polarity": {
      "motors": named(CYT, "תפקוד השלד"),
      "kinesin": named(CYT, "תפקוד השלד"),
      "cilia": heading(CYT, "ריסים ושוטונים"),
      "migration": heading(CYT, "נדידת תאים"),
      "polarity": named(POL),
    },
    "cell-junctions": {
      "roles": named(JN),
      "tight": named(JN),
      "adherens": named(JN),
      "desmosomes": named(JN),
      "hemidesmosomes": named(ECM, "עיגון תאים"),
      "gap": named(JN),
    },
    "cell-ecm": {
      "components": named(ECM),
      "proteoglycans": named(ECM),
      "collagen": named(ECM),
      "elastin": heading(ECM, "אלסטין"),
      "fibronectin": named(ECM, "עיגון תאים"),
      "integrins": named(ECM, "עיגון תאים"),
      "focal-adhesions": named(ECM, "העברת איתותים"),
    },
    "cell-signaling-principles": {
      "types": named(SIG),
      "receptors": named(SIG, "קולטנים ממברנליים"),
      "switches": named(SIG),
      "second-messengers": named(SIG),
      "processing": heading(SIG, "עיבוד האות (הגברה, הסתגלות, משוב)"),
    },
    "cell-gpcr": {
      "cycle": named(PATH, "GPCR"),
      "camp": named(PATH, "GPCR"),
      "calcium": named(PATH, "GPCR"),
      "vision": heading(PATH, "הראייה (רודופסין)"),
      "desensitization": heading(PATH, "הסתגלות של GPCR"),
    },
    "cell-rtk": {
      "activation": named(PATH, "RTK"),
      "sh2": named(PATH, "RTK"),
      "ras": named(PATH, "RTK"),
      "pi3k": named(PATH, "RTK"),
      "jak-stat": heading(SIG, "מסלול JAK–STAT"),
      "drugs": heading(PATH, "תרופות ממוקדות"),
    },
    "cell-cycle-control": {
      "phases": named(CC),
      "cdk": named(CC),
      "ubiquitin": named(CC),
      "licensing": named(CC),
      "mitosis": named(CC),
      "g1": named(CC),
      "p53": named(CC),
    },
  },
};
