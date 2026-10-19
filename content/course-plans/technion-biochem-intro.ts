import type { CoursePlan, PlanItem } from "./types";

// Technion 01340019 "מבוא לביוכימיה ואנזימולוגיה" — built with the course-track-builder skill, no insider input.
// Topics: the CURRENT syllabus on the Technion students portal (topics only, no weeks), in its own order.
// Lecture order: no public schedule (Moodle is closed to guests). The syllabus lists its topics in exactly the
// order of the course's first textbook (Berg, ch. 2–7, 11–12), so the order is "textbook", one lecture per topic.
// Tutorials: no source — shown as "practice for lecture n".

const B = "biochemistry";
const sub = (id: string): PlanItem => ({ kind: "subtopic", topic: B, id });
const proc = (slug: string): PlanItem => ({ kind: "process", topic: B, slug });
const L = (slug: string) => (section?: string): PlanItem => ({ kind: "lesson", slug, section });
const W = (slug: string) => (problem: string): PlanItem => ({ kind: "lesson", slug, problem });
const aa = L("amino-acids"), aaWp = W("amino-acids");
const ps = L("protein-structure"), psWp = W("protein-structure");
const pf = L("protein-folding"), pfWp = W("protein-folding");
const fm = L("fibrous-membrane"), fmWp = W("fibrous-membrane");
const pm = L("protein-methods"), pmWp = W("protein-methods");
const hb = L("hemoglobin"), hbWp = W("hemoglobin");
const ep = L("enzyme-principles"), epWp = W("enzyme-principles");
const ek = L("enzyme-kinetics"), ekWp = W("enzyme-kinetics");
const cm = L("catalytic-mechanisms"), cmWp = W("catalytic-mechanisms");
const ar = L("allosteric-regulation"), arWp = W("allosteric-regulation");
const cr = L("covalent-regulation"), crWp = W("covalent-regulation");
const cl = L("carbs-lipids"), clWp = W("carbs-lipids");

const S = {
  enzymes: "cmq0ts64y00128s4mpkala89o",
  proteins: "cmq5cko5l000004ldy3umhmv0",
  lipids: "cmq4zr0l2000204jsi5a0iyg2",
};
const PORTAL = { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134019" };

export const technionBiochemIntroPlan: CoursePlan = {
  courseSlug: "technion-biochem-intro",
  lectureOrder: {
    confidence: "textbook",
    noteHe: "אין לוח הרצאות ציבורי לקורס (אתר הקורס במודל סגור). הסילבוס מונה את הנושאים בדיוק בסדר הפרקים של ספר הקורס הראשון (Berg, פרקים 2–7 ו-11–12), ולכן הסדר כאן הוא סדר הסילבוס והספר — הרצאה לכל נושא. ייתכן שהחלוקה לשבועות בפועל שונה.",
    links: [PORTAL],
  },
  tutorialOrder: null,
  schedule: "suggested",
  scheduleNoteHe: "הנושאים לפי הסילבוס העדכני של הקורס בפורטל הטכניון (הוא מפרט נושאים, לא שבועות). הפירוט לתת-נושאים לפי ספר הקורס (Berg); סדר ההרצאות לפי סדר הסילבוס, שזהה לסדר הספר.",
  topics: [
    { titleHe: "המבנה והתכונות של חומצות אמינו", items: [aa()] },
    { titleHe: "פפטידים וחלבונים: מבנה ראשוני, שניוני ושלישוני", items: [aa("peptide"), ps("levels"), ps("backbone"), ps("secondary"), ps("tertiary"), sub(S.proteins)] },
    { titleHe: "קיפול חלבונים ותפקוד השפרונים", items: [pf()] },
    { titleHe: "חלבונים סיביים, מבניים וממברנליים", items: [fm()] },
    { titleHe: "בידוד והפרדה של חלבונים", items: [pm()] },
    { titleHe: "מבנה רביעוני: המוגלובין ואינטראקציות קואופרטיביות", items: [ps("quaternary"), hb(), proc("hemoglobin-oxygen-binding")] },
    { titleHe: "אנזימים, עקרונות הקטליזה, קואנזימים וקו-פקטורים", items: [ep(), sub(S.enzymes)] },
    { titleHe: "קינטיקה אנזימטית", items: [ek("rates"), ek("michaelis"), ek("parameters"), ek("lineweaver"), proc("enzyme-kinetics")] },
    { titleHe: "מבנה האתר הפעיל ומנגנוני קטליזה", items: [ep("active-site"), cm()] },
    { titleHe: "בקרת אנזימים ומנגנוני עיכוב", items: [ek("reversible"), ek("irreversible"), ar()] },
    { titleHe: "בקרה בשינויים אחר-תרגומיים", items: [cr()] },
    { titleHe: "מבוא לסוכרים ולשומנים", items: [cl(), sub(S.lipids)] },
  ],
  lectures: [
    { n: 1, titleHe: "חומצות אמינו: מבנה, יוניזציה ומטען", items: [aa("structure"), aa("ionization"), aa("groups"), aa("charge")] },
    { n: 2, titleHe: "הקשר הפפטידי; מבנה ראשוני ושניוני", items: [aa("peptide"), ps("levels"), ps("backbone"), ps("secondary")] },
    { n: 3, titleHe: "מבנה שלישוני ורביעוני", items: [ps("tertiary"), ps("quaternary"), sub(S.proteins)] },
    { n: 4, titleHe: "קיפול חלבונים ושפרונים", items: [pf("anfinsen"), pf("cooperative"), pf("pathway"), pf("chaperones"), pf("misfolding")] },
    { n: 5, titleHe: "חלבונים סיביים וחלבוני ממברנה", items: [fm("fibrous"), fm("keratin"), fm("collagen"), fm("membrane"), fm("hydropathy")] },
    { n: 6, titleHe: "בידוד והפרדה של חלבונים", items: [pm("assay"), pm("solubility"), pm("chromatography"), pm("electrophoresis"), pm("evaluation"), pm("mass")] },
    { n: 7, titleHe: "מיוגלובין והמוגלובין: קואופרטיביות ובקרה אלוסטרית", items: [hb("myoglobin"), hb("heme"), hb("cooperativity"), hb("models"), hb("effectors"), hb("sickle"), proc("hemoglobin-oxygen-binding")] },
    { n: 8, titleHe: "עקרונות הקטליזה; קואנזימים; אנרגיה חופשית ומצב המעבר", items: [ep("catalysis"), ep("cofactors"), ep("thermo"), ep("transition"), ep("active-site"), sub(S.enzymes)] },
    { n: 9, titleHe: "קינטיקה אנזימטית: מיכאליס-מנטן", items: [ek("rates"), ek("michaelis"), ek("parameters"), ek("lineweaver"), proc("enzyme-kinetics")] },
    { n: 10, titleHe: "עיכוב אנזימים", items: [ek("reversible"), ek("irreversible")] },
    { n: 11, titleHe: "מנגנוני קטליזה באתר הפעיל", items: [cm("strategies"), cm("chymotrypsin"), cm("specificity"), cm("carbonic-anhydrase"), cm("restriction")] },
    { n: 12, titleHe: "בקרה אלוסטרית ואיזואנזימים", items: [ar("feedback"), ar("structure"), ar("sigmoid"), ar("effectors"), ar("isozymes")] },
    { n: 13, titleHe: "בקרה בשינויים קוולנטיים: זרחון ושפעול פרוטאוליטי", items: [cr("covalent"), cr("phosphorylation"), cr("pka"), cr("zymogens"), cr("digestion"), cr("clotting")] },
    { n: 14, titleHe: "מבוא לסוכרים ולשומנים", items: [cl("monosaccharides"), cl("rings"), cl("reducing"), cl("glycosidic"), cl("fatty-acids"), cl("membrane-lipids"), cl("bilayer"), sub(S.lipids)] },
  ],
  tutorials: [
    { n: 1, titleHe: "תרגול על הרצאה 1: pI ומטען", items: [aaWp("glycine-pi"), aaWp("glutamate-pi"), aaWp("histidine-hh")] },
    { n: 2, titleHe: "תרגול על הרצאה 2: מטען פפטיד וסליל α", items: [aaWp("peptide-charge"), psWp("helix-length"), psWp("same-face")] },
    { n: 3, titleHe: "תרגול על הרצאה 3: מיקום שיירים", items: [psWp("predict-location")] },
    { n: 4, titleHe: "תרגול על הרצאה 4: קיפול", items: [pfWp("disulfide-pairings"), pfWp("levinthal"), pfWp("concentration")] },
    { n: 5, titleHe: "תרגול על הרצאה 5: חלבונים סיביים וממברנליים", items: [fmWp("tm-helix"), fmWp("tropomyosin"), fmWp("osteogenesis")] },
    { n: 6, titleHe: "תרגול על הרצאה 6: טבלת טיהור ו-SDS-PAGE", items: [pmWp("purification-table"), pmWp("sds-mass"), pmWp("subunits")] },
    { n: 7, titleHe: "תרגול על הרצאה 7: עקומות קישור", items: [hbWp("myoglobin-delivery"), hbWp("hill"), hbWp("shift")] },
    { n: 8, titleHe: "תרגול על הרצאה 8: ΔG ושיווי משקל", items: [epWp("dg-from-k"), epWp("equilibrium-unchanged"), epWp("barrier")] },
    { n: 9, titleHe: "תרגול על הרצאה 9: מיכאליס-מנטן ו-k_cat", items: [ekWp("mm-fraction"), ekWp("kcat")] },
    { n: 10, titleHe: "תרגול על הרצאה 10: סוגי עיכוב", items: [ekWp("competitive"), ekWp("lb-identify")] },
    { n: 11, titleHe: "תרגול על הרצאה 11: מנגנונים", items: [cmWp("mutant-kinetics"), cmWp("trypsin-pocket"), cmWp("zinc-pka")] },
    { n: 12, titleHe: "תרגול על הרצאה 12: אנזימים אלוסטריים", items: [arWp("threshold"), arWp("allosteric-coefficient"), arWp("pala")] },
    { n: 13, titleHe: "תרגול על הרצאה 13: זרחון וזימוגנים", items: [crWp("phospho-cost"), crWp("cascade-amplification"), crWp("enteropeptidase")] },
    { n: 14, titleHe: "תרגול על הרצאה 14: סוכרים", items: [clWp("stereoisomers"), clWp("reducing-test"), clWp("glycogen-ends")] },
  ],
};
