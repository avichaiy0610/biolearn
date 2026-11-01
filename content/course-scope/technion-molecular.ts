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
// Winter 2024 syllabus (Drive, Prof. Yoav Arava) — names methods per topic; no public URL.
const syl24 = (words: string): ScopeEntry => ({
  level: "core", evidence: "syllabus-named",
  noteHe: `סילבוס הקורס, חורף תשפ"ד: "${words}"`,
});
// Course homework with the staff's official answers (Drive).
const hw = (what: string): ScopeEntry => ({
  level: "core", evidence: "staff-material",
  noteHe: `תרגילי הבית של הקורס, עם פתרון רשמי: ${what}`,
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
  checkedAt: "2026-11-01",
  defaultSource: { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134082" },
  sections: {
    "mol-nucleic-acids": {
      "nucleotides": named(NA),
      "polynucleotide": named(NA),
      "double-helix": named(NA),
      "forms": heading(NA, "צורות A ו-Z של הסליל"),
      "melting": heading(NA, "דנטורציה והכלאה"),
      "blotting": syl24("מבנה נוקלאוטידים, מבנה דנ\"א ורנ\"א, היברידיזציה southern blot"),
      "supercoiling": heading(NA, "פיתול-על וטופואיזומראזות"),
      "rna": named(NA),
    },
    "mol-chromatin": {
      "packaging": named(CHR),
      "nucleosome": named(CHR),
      "levels": named(CHR),
      "euchromatin": named(CHR),
      "centromere-telomere": heading(CHR, "מבנה הצנטרומר והטלומרים"),
      "nuclease-assays": syl24("כרומוזומים וכרומטין, DNAse and MNase assays"),
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
    "mol-pcr-sequencing": {
      "primers": hw("בחירת זוג פריימרים ו-Tm (תשפ\"ד תרגיל 3, תשפ\"ה תרגיל 2)"),
      "pcr-math": hw("מספר עותקים, מסה ו-dNTPs ב-PCR (תשפ\"ד תרגיל 3, תשפ\"ה תרגיל 2)"),
      "fidelity": hw("טעות PCR מול הטרוזיגוטיות בריצוף (תשפ\"ד תרגיל 3, תשפ\"ה תרגיל 2)"),
      "sanger": syl24("הכפלת דנ\"א – מנגנון ואנזימים, ריצוף, PCR"),
      "primer-extension": hw("ניסוי primer extension עם Pol I, Pol III, הליקאז ו-Tus (תשפ\"ד תרגיל 3, תשפ\"ה תרגיל 2)"),
      "cloning": syl24("שיבוט ופלסמידים"),
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
    "mol-transcription-methods": {
      "northern": syl24("northern blot"),
      "emsa": syl24("EMSA"),
      "footprint": syl24("DNAse and MNase assays"),
      "reporter": syl24("reporter analysis"),
      "chip": syl24("ChIP"),
      "tweezers": syl24("optical tweezers"),
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
      "editing": syl24("שחבור (splicing) ועריכת רנ\"א"),
    },
    "mol-genetic-code": {
      "triplet": named(TL),
      "cracking": named(TL),
      "trna": named(TL),
      "wobble": named(TL),
      "synthetases": named(TL),
      "fidelity": heading(TL, "ההגהה של הסינתטאזות"),
      "exceptions": heading(TL, "חריגים בקוד הגנטי"),
      "western": syl24("הקוד הגנטי ו tRNA. Western analysis"),
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
