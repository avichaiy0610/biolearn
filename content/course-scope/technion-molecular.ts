import type { CourseScope, ScopeEntry } from "./types";

// Technion 134082 "ביולוגיה מולקולרית". Evidence available (2026-10-20): the official topic list on the students
// portal only (Moodle closed to guests), so the strongest level is "syllabus-named". Reviewed row by row: subtopics
// the syllabus does not name (forms of DNA, telomerase, TLS/SOS, site-specific recombination, enhancers…) are "likely".

const named = (topic: string, what?: string): ScopeEntry => ({
  level: "core", evidence: "syllabus-named",
  noteHe: what ? `הסילבוס הרשמי: "${topic}" — ${what}` : `הסילבוס הרשמי: "${topic}"`,
});
const heading = (topic: string, what: string): ScopeEntry => ({
  level: "likely", evidence: "syllabus-heading",
  noteHe: `נכלל בכותרת הסילבוס "${topic}", אבל ${what} לא מוזכר בשמו`,
});

// Official topics (verbatim, from the portal).
const NA = "חומצות גרעין: אבני הבניין, מבנה הדנ\"א";
const CHR = "מבנה הכרומטין בתאים אאוקריוטיים ואריזת הדנ\"א";
const REP = "שכפול דנ\"א, תיקון ורקומבינציה- מנגנונים ואנזימים המעורבים בתהליך";
const TX = "תעתוק - מנגנון ואלמנטים בסיסיים בציס ובטרנס המשתתפים בתהליך (פרומוטור, רנ\"א פולימרז)";
const PROC = "עיבוד ושחבור רנ\"א";
const TL = "תרגום- הקוד הגנטי, מבנה הריבוזום, TRNA. שלבי התרגום - התחלה, הארכת החלבון וסיום";

export const technionMolecularScope: CourseScope = {
  courseSlug: "technion-molecular",
  checkedAt: "2026-10-20",
  defaultSource: { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134082" },
  sections: {
    "mol-nucleic-acids": {
      "nucleotides": named(NA),
      "polynucleotide": named(NA),
      "double-helix": named(NA),
      "forms": heading(NA, "צורות A ו-Z של הסליל"),
      "melting": heading(NA, "דנטורציה והכלאה"),
      "supercoiling": heading(NA, "פיתול-על וטופואיזומראזות"),
      "rna": named(NA),
    },
    "mol-chromatin": {
      "packaging": named(CHR),
      "nucleosome": named(CHR),
      "levels": named(CHR),
      "euchromatin": named(CHR),
      "centromere-telomere": heading(CHR, "מבנה הצנטרומר והטלומרים"),
      "assembly": heading(CHR, "הרכבת נוקלאוזומים בשכפול"),
    },
    "mol-replication-fork": {
      "semiconservative": named(REP),
      "polymerase": named(REP),
      "fork": named(REP),
      "enzymes": named(REP),
      "replisome": named(REP),
      "fidelity": named(REP),
      "eukaryotes": named(REP),
      "pcr": heading(REP, "PCR — שכפול DNA במבחנה"),
    },
    "mol-replication-origins": {
      "replicon": named(REP),
      "initiation-bacteria": named(REP),
      "once-bacteria": named(REP),
      "termination": named(REP),
      "licensing": named(REP),
      "telomerase": heading(REP, "טלומראז"),
    },
    "mol-repair": {
      "damage": named(REP),
      "direct": named(REP),
      "ber": named(REP),
      "ner": named(REP),
      "mmr": named(REP),
      "dsb": named(REP),
      "crispr": heading(REP, "CRISPR ועריכת גנום (הקורס המקביל ברפואה 274243 מזכיר \"עריכה גנומית\" — ראיה בלבד)"),
      "tls": heading(REP, "סינתזה דרך נזק ותגובת SOS"),
    },
    "mol-recombination": {
      "roles": named(REP),
      "dsb-model": named(REP),
      "holliday": named(REP),
      "gene-conversion": heading(REP, "המרת גנים"),
      "bacteria": named(REP),
      "site-specific": heading(REP, "רקומבינציה ספציפית לאתר"),
    },
    "mol-transcription-prok": {
      "basics": named(TX),
      "rnap": named(TX),
      "promoter": named(TX),
      "initiation": named(TX),
      "termination": named(TX),
      "cis-trans": named(TX),
      "alt-sigma": heading(TX, "פקטורי סיגמא חלופיים"),
    },
    "mol-transcription-euk": {
      "three-polymerases": named(TX),
      "core-promoter": named(TX),
      "pic": named(TX),
      "ctd": heading(TX, "הזרחון של ה-CTD"),
      "enhancers": named(TX),
      "pol-i-iii": heading(TX, "הפרומוטורים של Pol I ו-Pol III"),
    },
    "mol-rna-processing": {
      "split-genes": named(PROC),
      "capping": named(PROC),
      "splice-sites": named(PROC),
      "chemistry": named(PROC),
      "spliceosome": named(PROC),
      "self-splicing": heading(PROC, "אינטרונים שמשחברים את עצמם"),
      "alternative": heading(PROC, "שחבור חלופי"),
      "polyadenylation": named(PROC),
      "rrna-trna": named(PROC),
    },
    "mol-genetic-code": {
      "triplet": named(TL),
      "cracking": named(TL),
      "trna": named(TL),
      "wobble": named(TL),
      "synthetases": named(TL),
      "fidelity": heading(TL, "ההגהה של הסינתטאזות"),
      "exceptions": heading(TL, "חריגים בקוד הגנטי"),
    },
    "mol-ribosome-initiation": {
      "structure": named(TL),
      "overview": named(TL),
      "initiator": named(TL),
      "initiation-bacteria": named(TL),
      "initiation-eukaryotes": named(TL),
      "eif2-control": heading(TL, "בקרה על התחלת התרגום"),
      "polysomes": heading(TL, "פוליזומים"),
    },
    "mol-translation-elongation": {
      "cycle": named(TL),
      "accuracy": named(TL),
      "energy": heading(TL, "המחיר האנרגטי"),
      "termination": named(TL),
      "antibiotics": heading(TL, "אנטיביוטיקות"),
    },
  },
};
